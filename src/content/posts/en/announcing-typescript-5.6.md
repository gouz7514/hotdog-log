---
title: '[Translation] TypeScript 5.6 Release'
summary: "What's new in TypeScript 5.6"
tags: ['Typescript']
date: '2024-10-12 02:00:00'
---
- Official blog post date: 2024.09.09
- [Original link](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/)

---
Since the TypeScript 5.6 beta version, we reverted [changes related to how TypeScript's language service searches for `tsconfig.json` files](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6-beta/#search-ancestor-configuration-files-for-project-ownership).  
Previously, it continued searching to find all project files named `tsconfig.json`. Since this could cause many referenced projects to be opened, [we reverted this behavior](https://github.com/microsoft/TypeScript/pull/59634) and are [looking for ways to reintroduce this in TypeScript 5.7](https://github.com/microsoft/TypeScript/pull/59688).

Additionally, compared to the beta, several new type names have been changed. Previously, TypeScript provided a single type called `BuiltinIterator` to describe all values based on `Iterator.prototype`. This type has been renamed to `IteratorObject` and now has different type parameters. Several subtypes like `ArrayIterator`, `MapIterator`, etc. have also been added.

A new flag named `--stopOnBuildErrors` has been added to `--build` mode. This flag causes other projects to stop building when an error occurs during project builds. This flag provides functionality similar to pre-TypeScript 5.6 behavior, [since TypeScript 5.6 always continues building even when errors occur](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#allow---build-with-intermediate-errors).

New editor features have been added that provide [direct support for commit characters](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#granular-commit-characters) and [setting exclude patterns for auto-imports](https://devblogs.microsoft.com/typescript/announcing-typescript-5-6/#exclude-patterns-for-auto-imports).

## Disallowed Nullish and Truthy Checks

You might have written a regular expression and forgotten to call `.test(...)`
```javascript
if (/0x[0-9a-f]/) {
    // The logic below always runs
    // ...
}
```

Or you might have written `=>` instead of `>=`
```javascript
if (x => 0) {
    // The logic below always runs
    // ...
}
```

Or you might have used parentheses incorrectly in complex expressions.
```javascript
if (
    isValid(primaryValue, "strict") || isValid(secondaryValue, "strict") ||
    isValid(primaryValue, "loose" || isValid(secondaryValue, "loose"))
) {
    //                           ^^^^ 👀 unclosed parenthesis
}
```

All the above examples don't work as the author intended, but they are valid JavaScript code. TypeScript also previously had no major issues with these examples.

However, through some experimentation, we discovered that we could catch many bugs like the examples above. In TypeScript 5.6, the compiler generates errors when it can syntactically confirm that certain conditions will always evaluate to truthy or nullish. This means you'll see errors like the following in the above examples:

```javascript
if (/0x[0-9a-f]/) {
//  ~~~~~~~~~~~~
// error: This kind of expression is always truthy.
}

if (x => 0) {
//  ~~~~~~
// error: This kind of expression is always truthy.
}

function isValid(value: string | number, options: any, strictness: "strict" | "loose") {
    if (strictness === "loose") {
        value = +value
    }
    return value < options.max ?? 100;
    //     ~~~~~~~~~~~~~~~~~~~
    // error: Right operand of ?? is unreachable because the left operand is never nullish.
}

if (
    isValid(primaryValue, "strict") || isValid(secondaryValue, "strict") ||
    isValid(primaryValue, "loose" || isValid(secondaryValue, "loose"))
) {
    //                    ~~~~~~~
    // error: This kind of expression is always truthy.
}

```

You can achieve similar results using ESLint's `no-constant-binary-expression` rule, and you can check out [some achievements in the ESLint blog post](https://eslint.org/blog/2022/07/interesting-bugs-caught-by-no-constant-binary-expression/). However, the new checking method TypeScript performs doesn't completely match the ESLint rule, and we think it's useful to have this checking functionality built into TypeScript itself.

Some expressions can be allowed even if they're always truthy or nullish. Particularly, `true`, `false`, `0`, and `1` are allowed even if they're always truthy or falsy, like in the following code:

```javascript
while (true) {
    doStuff();

    if (something()) {
        break;
    }

    doOtherStuff();
}
```

This is still useful code, and
```javascript
if (true || inDebuggingOrDevelopmentEnvironment()) {
    // ...
}
```
the above code is also useful for iterating/debugging.

If you're curious about how the checking works or what bugs it can catch, take a look at [the PR for this feature](https://github.com/microsoft/TypeScript/pull/59217).

## Iterator Helper Methods
JavaScript has concepts of `iterables` and `iterators`
- `iterables`: Things that can be iterated to get an iterator by calling `[Symbol.iterator]()`
- `iterator`: Things that have a `next()` method that can be used to get the next value during iteration

Generally, when using `for / of` statements or `[...spread]`, you don't think about these concepts. However, TypeScript models these using `Iterable` and `Iterator` types (or `IterableIterator` which acts like both), and these types are the minimum concepts needed for constructs like `for / of` to work.

While `Iterable` is convenient and can be used in various places in JavaScript, many people feel inconvenienced by the lack of methods like map, filter, and for some reason reduce that are available on arrays. That's why there was recently [a proposal in ECMAScript to add various array methods to most `IterableIterator`s](https://github.com/tc39/proposal-iterator-helpers).

For example, from now on, all generators create objects that have `map` and `take` methods.
```javascript
function* positiveIntegers() {
    let i = 1;
    while (true) {
        yield i;
        i++;
    }
}

const evenNumbers = positiveIntegers().map(x => x * 2);

// Output:
//    2
//    4
//    6
//    8
//   10
for (const value of evenNumbers.take(5)) {
    console.log(value);
}
```

The same applies to `keys()`, `values()`, `entries()`, `Map`, `Set`.
```javascript
function invertKeysAndValues<K, V>(map: Map<K, V>): Map<V, K> {
    return new Map(
        map.entries().map(([k, v]) => [v, k])
    );
}
```

You can also extend new `Iterator` objects.
```javascript
/**
 * Provides an endless stream of `0`s.
 */
class Zeroes extends Iterator<number> {
    next() {
        return { value: 0, done: false } as const;
    }
}

const zeroes = new Zeroes();

// Transform into an endless stream of `1`s.
const ones = zeroes.map(x => x + 1);
```

You can also convert existing `Iterable` and `Iterator` to new types using `Iterator.from`.
```javascript
Iterator.from(...).filter(someFunction);
```

These new methods will work when using the latest version of JavaScript runtime or polyfills for the new `Iterator` object.

Now it's time to talk about naming.

As mentioned above, TypeScript has `Iterable` and `Iterator` types. However, as mentioned earlier, these features serve as a kind of "protocol" that ensures certain operations work properly. This means not all values declared as `Iterable` or `Iterator` in TypeScript have the methods mentioned above.

However, there's a new runtime value called `Iterator`. In JavaScript, you can reference `Iterator` and `Iterator.prototype` as actual values. But since TypeScript already defines something called `Iterator` for type checking, a name collision occurs between the two. Due to this problem, TypeScript needs to introduce a separate type to describe these built-in iterators.

TypeScript 5.6 introduces a new type called `IteratorObject`, which is defined as follows:

```typescript
interface IteratorObject<T, TReturn = unknown, TNext = unknown> extends Iterator<T, TReturn, TNext> {
    [Symbol.iterator](): IteratorObject<T, TReturn, TNext>;
}
```

Built-in collections and methods that create subtypes of `IteratorObject` (`ArrayIterator`, `SetIterator`, `MapIterator`, etc.), core JavaScript and DOM types in `lib.d.ts`, and `@types/node` have been updated for this new type.

Similarly, an `AsyncIteratorObject` type has been added to serve a similar role. JavaScript doesn't yet have `AsyncIterator` as a runtime value that provides methods for `AsyncIterable`, but it's [currently in the proposal stage](https://github.com/tc39/proposal-async-iterator-helpers) and this new type is prepared for that.

- [Related type PR link](https://github.com/microsoft/TypeScript/pull/58222)
- [proposal-iterator-helpers](https://github.com/tc39/proposal-iterator-helpers)

## Strict Builtin Iterator Checks (and `strictBuiltinIteratorReturn`)

When you call the `next()` method of `Iterator<T, TReturn>`, it returns an object with `value` and `done` properties. This object is modeled as the `IteratorResult` type.
```typescript
type IteratorResult<T, TReturn = any> = IteratorYieldResult<T> | IteratorReturnResult<TReturn>;

interface IteratorYieldResult<TYield> {
    done?: false;
    value: TYield;
}

interface IteratorReturnResult<TReturn> {
    done: true;
    value: TReturn;
}
```

The naming in the above code was inspired by how generator functions work. Generator functions can yield values and return a final value. However, the types of yielded values and the final return value may be unrelated to each other.

```typescript
function abc123() {
    yield "a";
    yield "b";
    yield "c";
    return 123;
}

const iter = abc123();

iter.next(); // { value: "a", done: false }
iter.next(); // { value: "b", done: false }
iter.next(); // { value: "c", done: false }
iter.next(); // { value: 123, done: true }
```

When introducing the new `IteratorObject` type, we discovered difficulties in safely implementing `IteratorObject`. At the same time, safety issues have long existed in `IteratorResult` when `TReturn` is the any type. For example, if you have `IteratorResult<string, any>` and use the value, it becomes `string | any` type, which is ultimately treated as `any` type.

```typescript
function* uppercase(iter: Iterator<string, any>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase(); // oops! forgot to check for `done` first and misspelled `toUpperCase`

        if (done) {
            return;
        }
    }
}
```

While fixing the problem for all iterators is difficult because it requires applying numerous changes, we can improve this for most newly created `IteratorObject`s.

TypeScript 5.6 introduces a new intrinsic type called `BuiltinIteratorReturn` and a new `--strict`-mode flag called `--strictBuiltinIteratorReturn`. When `IteratorObject` is used in places like `lib.d.ts`, it's always written with `BuiltinIteratorReturn` type for `TReturn` (though more specific MapIterator, ArrayIterator, SetIterator are used more often)

```typescript
interface MapIterator<T> extends IteratorObject<T, BuiltinIteratorReturn, unknown> {
    [Symbol.iterator](): MapIterator<T>;
}

// ...

interface Map<K, V> {
    // ...

    /**
     * Returns an iterable of key, value pairs for every entry in the map.
     */
    entries(): MapIterator<[K, V]>;

    /**
     * Returns an iterable of keys in the map
     */
    keys(): MapIterator<K>;

    /**
     * Returns an iterable of values in the map
     */
    values(): MapIterator<V>;
}
```

By default, `BuiltinIteratorReturn` is the `any` type, but in `--strictBuiltinIteratorReturn` mode, it's the `undefined` type. In this mode, using `BuiltinIteratorReturn` makes the above example correctly generate errors.

```typescript
function* uppercase(iter: Iterator<string, BuiltinIteratorReturn>) {
    while (true) {
        const { value, done } = iter.next();
        yield value.toUppercase();
        //    ~~~~~ ~~~~~~~~~~~
        // error! ┃      ┃
        //        ┃      ┗━ Property 'toUppercase' does not exist on type 'string'. Did you mean 'toUpperCase'?
        //        ┃
        //        ┗━ 'value' is possibly 'undefined'.

        if (done) {
            return;
        }
    }
}
```

You'll typically see `BuiltinIteratorReturn` appear alongside `IteratorObject` in `lib.d.ts`. We recommend writing more explicitly for `TReturn` when possible.

More information can be found [here](https://github.com/microsoft/TypeScript/pull/58243).

## Support for Arbitrary Module Identifiers
JavaScript allows modules to export by binding to identifier names that are not valid as string literals.
```javascript
const banana = "🍌";

export { banana as "🍌" };
```

Similarly, JavaScript allows importing with arbitrary names and binding them to valid identifiers.
```javascript
import { "🍌" as banana } from "./foo"

/**
 * om nom nom
 */
function eat(food: string) {
    console.log("Eating", food);
};

eat(banana);
```

This is useful for interoperability with other languages because different languages may have different rules for defining valid identifiers. It can also be useful for code generation tools like [esbuild's inject feature](https://esbuild.github.io/api/#inject).

Starting from TypeScript 5.6, you can use these arbitrary module identifiers. Changes can be found [here](https://github.com/microsoft/TypeScript/pull/58640).

## The --noUncheckedSideEffectImports Option
In JavaScript, it's possible to `import` a module without importing any values from it.
```javascript
import "some-module";
```

These imports are called side effect imports because they can only provide useful behavior by executing side effects (registering global variables, adding polyfills to prototypes).

TypeScript has something quite strange about this syntax.  
If an `import` could be resolved to a valid source file, TypeScript would load and check that file. However, if a source file couldn't be found, TypeScript would silently ignore the import without any warning.

This is surprising behavior, but it was partly the result of modeling patterns in the JavaScript ecosystem. For example, it was used with special loaders in bundlers to load CSS or other assets. A bundler could be configured to include specific `.css` files like this:

```typescript
import "./button-component.css";

export function Button() {
    // ...
}
```

Nevertheless, this could hide typos that might occur in side effect imports. So TypeScript 5.6 introduces a new compiler option called `--noUncheckedSideEffectImports` to catch these cases. When this option is enabled, it generates errors when source files cannot be found for side effect imports.

```typescript
import "oops-this-module-does-not-exist";
//     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// error: Cannot find module 'oops-this-module-does-not-exist' or its corresponding type declarations.
```

Enabling this option might cause code that previously worked to generate errors. To solve this, users who simply want to write side effect imports for assets might find it better to write _ambient module declarations_ with wildcard specifiers. You can write this in a global file:

```typescript
// ./src/globals.d.ts

// Recognize all CSS files as module imports.
declare module "*.css" {}
```

This kind of file might already exist in your project. Running `vite init` creates a similar `vite-env.d.ts` file.

This option is off by default, but we recommend trying it once.

More information can be found [here](https://github.com/microsoft/TypeScript/pull/58941).

## The --noCheck Option
TypeScript 5.6 introduces a new option called `--noCheck` that skips type checking for all input files. This is useful for avoiding unnecessary type checking when performing semantic analysis needed to generate output files.

One use case for this option is separating JavaScript file generation and type checking to run these two tasks as separate steps. For example, you can run `tsc --noCheck` during iterative work and `tsc --noEmit` for thorough type checking. You can also run both tasks in parallel, even in `--watch` mode. However, when running both tasks simultaneously, it's good to specify separate `tsBuildInfoFile` paths.

`--noCheck` is also useful when generating declaration files. In projects that comply with `–isolatedDeclarations`, when `--noCheck` is specified, TypeScript can quickly generate declaration files without the type checking process. The declaration files generated this way depend only on fast syntactic transformations.

When `–noCheck` is specified but the project doesn't use `–isolatedDeclarations`, TypeScript can still perform as much type checking as needed to generate `.d.ts` files. In this regard, `–noCheck` might be a somewhat misleading name, but this process is looser than full type checking and mainly calculates types for declarations without type annotations. This can be processed much faster than full type checking.

`--noCheck` is also available as a standard option through the TypeScript API. Internally, it uses `transpileModule` and `transpileDeclaration` for speed. Now any build tool can leverage this flag to improve build speed through various custom strategies.

For more information, see [the work done to internally strengthen noCheck in TypeScript 5.5](https://github.com/microsoft/TypeScript/pull/58364) and [related work to make it publicly available from the command line](https://github.com/microsoft/TypeScript/pull/58839).

## Allow --build with Intermediate Errors
TypeScript's project references concept allows you to organize your codebase into multiple projects and create dependencies between them. Running the TypeScript compiler in `--build` mode is the built-in way to actually perform builds across multiple projects and figure out which projects and files need to be compiled.

Previously, `--build` mode was considered as `--noEmitOnError`, so builds would stop the moment they encountered errors. This meant that if an "upstream" dependency had errors during the build process, "downstream" projects that used that dependency could never be checked or built. This was theoretically a reasonable approach because if a project has errors, that project might not be in a consistent state regarding its dependencies.

In practice, this strictness made upgrade work more difficult. If project B depends on project A, someone more familiar with project B couldn't upgrade project B until the dependency was upgraded. Project A had to be upgraded first, blocking work on project B.

Starting from TypeScript 5.6, project builds continue even when dependencies have intermediate errors during the build process. When intermediate errors occur, those errors are consistently reported and output files are generated in the best way possible. However, the build of the specified project is completed to the end.

If you want to stop building when there are errors in projects, you can use a new flag called `--stopOnBuildErrors`. This flag is useful when running in CI environments or when iteratively working on projects that many other projects depend on.

To achieve this, TypeScript now always generates `tsbuildinfo` files for all projects when called with `--build` (even when `--incremental` or `--composite` aren't declared). This is to track how `--build` was called and the state of work that needs to be performed in the future.

More information can be found [here](https://github.com/microsoft/TypeScript/pull/58838).

## Region-Prioritized Diagnostics in Editors
When TypeScript performs diagnostics on files (like errors, suggestions, deprecations), it usually checks the entire file. This is fine in most cases, but huge files can cause delays. Simple typo fixes are simple tasks, but they can take several seconds in huge files, which can be very scary.

To solve this, TypeScript 5.6 introduces a feature called _region-prioritized diagnostics_ or _region-prioritized checking_. Instead of simply requesting checks on files, editors can provide relevant regions of specific files, which usually means the part of the file the user is currently viewing. The TypeScript language server can provide two diagnostic results for specific regions of files and entire files respectively. This reduces the time waiting for red underlines to disappear when editing large files, making editing feel much faster.

Testing on TypeScript's checker.ts file showed that diagnostics for the entire file took 3330ms. In contrast, region-based diagnostics took only 143ms. The remaining response for the entire file took 3200ms, but this difference can have a big impact in quick editing tasks.

This feature also includes work to report diagnostic results more consistently. Because of how the type-checker uses caching to avoid duplicate work, subsequent checks between the same types could often generate different error messages. More specifically, delayed out-of-order checks could report different diagnostic results at two locations in the editor. This problem existed before this feature was introduced, but we didn't want to make this problem worse. Through this work, we resolved many of these error inconsistencies.

Currently, this feature is available in TypeScript 5.6 and later versions in VSCode environments.

More information can be found [here](https://github.com/microsoft/TypeScript/pull/57842).

## Granular Commit Characters
TypeScript now provides its own _commit characters_ for each auto-completion item. Commit characters are specific characters that automatically confirm the currently suggested auto-completion item when users type them.

This means that when you type specific characters in the editor, the editor will commit the currently suggested auto-completion item more often. Let's look at the following example:

```typescript
declare let food: {
    eat(): any;
}

let f = (foo/**/
```

If the cursor is at `/**/`, it's unclear whether the code you want to write will be `let f = (food.eat())` or `let f = (foo, bar) => foo + bar`. We would expect the editor to auto-complete differently based on the next character we type. For example, if we type `.`, the editor would be likely to use the `food` variable. However, if we type `,`, we would be writing a parameter in an arrow function.

Unfortunately, previously, no commit characters were safe because TypeScript signaled to the editor that the current text could define a new parameter name. So even when typing `.`, the editor wouldn't do anything despite it being a clear situation where it should auto-complete with `food`.

Now TypeScript explicitly lists characters that can be safely committed for each auto-completion item. While you won't feel immediate changes from this feature, auto-completion behavior will improve over time in editors that support commit characters. To see the improvements right away, you can try using the [TypeScript nightly extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-next) in [VSCode Insiders](https://code.visualstudio.com/insiders/). In the above code, typing `.` will auto-complete `food`.

More information can be found at:
- [PR for adding commit characters](https://github.com/microsoft/TypeScript/pull/59339)
- [Fix work for context-dependent commit characters](https://github.com/microsoft/TypeScript/pull/59523)

## Exclude Patterns for Auto-Imports
TypeScript can now specify a list of regular expression patterns to filter auto-import suggestions from specific specifiers. For example, to exclude all "deep" imports from packages like `lodash`, you can configure the following setting in VSCode:

```json
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^lodash/.*$"
    ]
}
```

Conversely, you might want to prohibit importing from a package's entry point.
```json
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^lodash$"
    ]
}
```

You can also prevent imports for `node:` like this:
```json
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^node:"
    ]
}
```

If you want to specify specific regex flags like `i` or `u`, you need to wrap the regex with slashes. In this case, internal slashes need to be escaped.
```json
{
    "typescript.preferences.autoImportSpecifierExcludeRegexes": [
        "^./lib/internal",        // no escaping needed
        "/^.\\/lib\\/internal/",  // escaping needed - note the leading and trailing slashes
        "/^.\\/lib\\/internal/i"  // escaping needed - we needed slashes to provide the 'i' regex flag
    ]
}
```

For JavaScript, you can apply this through the `javascript.preferences.autoImportSpecifierExcludeRegexes` setting in VSCode.

While it seems to overlap with `typescript.preferences.autoImportFileExcludePatterns`, there are differences. The existing `autoImportFileExcludePatterns` uses a list of glob patterns to exclude file paths. This might be simple for the majority of situations where you want to avoid auto-imports for specific files or directories, but it won't always be the case. For example, when using the `@types/node` package, the same file declares both `fs` and `node:fs`, so you can't filter one of them using `autoImportExcludePatterns`.

The new `autoImportSpecifierExcludeRegexes` option is specialized for module specifiers, so you can write expressions that exclude either `fs` or `node:fs`. Furthermore, you can use patterns to configure auto-imports to prefer different specifier styles (making `./foo/bar.js` preferred over `#foo/bar.js`).

More information can be found [here](https://github.com/microsoft/TypeScript/pull/59543).

## Notable Behavioral Changes
This section covers changes that are good to know about and may be deprecations, feature removals, or new constraints. Technical improvements for bug fixes are also included, which may cause new errors in existing builds.

### lib.d.ts
Types generated for the DOM can affect type checking of your codebase. For more information, see [DOM and lib.d.ts related issues](https://github.com/microsoft/TypeScript/issues/58764).

### .tsbuildinfo is Always Written
To allow project builds to continue even when intermediate dependencies have errors in `--build` mode, and to support `--noCheck` from the command line, TypeScript now always generates `.tsbuildinfo` files for all projects when called with --build. This happens regardless of whether the `--incremental` option is enabled. More information can be found [here](https://github.com/microsoft/TypeScript/pull/58626).

### Respecting File Extensions and package.json from within node_modules
Before Node.js supported ECMAScript modules in version 12, there was no good way for TypeScript to know whether `.d.ts` files found in `node_modules` were for JavaScript files written in CommonJS or ECMAScript modules. When most npm packages used only CommonJS, this wasn't a big problem, and when in doubt, TypeScript could assume everything behaved like CommonJS. However, if this assumption was wrong, it could allow unsafe imports.

```typescript
// node_modules/dep/index.d.ts
export declare function doSomething(): void;

// index.ts
// Okay if "dep" is a CommonJS module, but fails if
// it's an ECMAScript module - even in bundlers!
import dep from "dep";
dep.doSomething();
```

This doesn't happen very often in practice. However, since Node.js started supporting ECMAScript modules, the adoption of ESM (ECMAScript Module) has gradually increased. Fortunately, Node.js introduced mechanisms that allow TypeScript to determine whether a given file is an ECMAScript module or CommonJS module. These are the `.mjs` and `.cjs` file extensions and the `"type"` field in `package.json`, which TypeScript supported through `.mts` and `.cts` files in TypeScript 4.7. However, TypeScript could only read these in `--module node16` and `--module nodenext`, so unsafe imports remained a problem for people using `--module esnext` and `--moduleResolution bundler`.

To solve this, TypeScript 5.6 collects module format information and uses it to resolve ambiguities that occur in all such `module` modes. Format-specific file extensions (`.mts` or `.cts`) are recognized everywhere, and the `"type"` field in `package.json` is referenced within dependencies in `node_modules` regardless of the `module` setting. Previously, only changing CommonJS results to `.mjs` or vice versa was technically possible.

```typescript
// main.mts
export default "oops";

// $ tsc --module commonjs main.mts
// main.mjs
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "oops";
```

Now `.mts` files don't produce CommonJS output, and `.cts` files don't produce ESM output.

These behaviors were already provided in early release versions of TypeScript 5.5, but starting from 5.6, this behavior extends only to files within `node_modules`.

More information can be found [here](https://github.com/microsoft/TypeScript/pull/58825).

### Correct Override Checks on Computed Properties
Previously, properties declared with `override` didn't properly check for the existence of base class members (members of the class being overridden). Similarly, if you used `noImplicitOverride`, forgetting to declare `override` wouldn't generate any errors.

TypeScript 5.6 properly checks properties in both cases.
```typescript
const foo = Symbol("foo");
const bar = Symbol("bar");

class Base {
    [bar]() {}
}

class Derived extends Base {
    override [foo]() {}
//           ~~~~~
// error: This member cannot have an 'override' modifier because it is not declared in the base class 'Base'.

    [bar]() {}
//  ~~~~~
// error under noImplicitOverride: This member must have an 'override' modifier because it overrides a member in the base class 'Base'.
}
```

---

The translation took quite some time to organize and understand due to many sentences that weren't naturally flowing.

Impressive parts of version 5.6 include:

- Understanding iterator behavior and introducing new types for iterators

This should allow writing safer and more readable code when using iterators.

- Introduction of the `--noCheck` option

Although the name is noCheck, it's actually a fascinating option that helps perform type checking faster.

The translation made me very excited because there's so much I want to study.  
I want to study TypeScript's various flags, and I also became curious about ECMAScript modules and CommonJS modules mentioned in between. I plan to read [the blog written by Toss](https://toss.tech/article/commonjs-esm-exports-field) and organize it in my own words for a post.