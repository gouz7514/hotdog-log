---
title: '[Translation] TypeScript 5.5 Release'
summary: "What's new in TypeScript 5.5"
tags: ['Typescript']
date: '2024-08-6 01:00:00'
---

# Before We Begin
As a developer, I believe one way to understand a language or framework is to love that technology.

After reading a [post](https://www.linkedin.com/posts/soohwan-cho-60468a19b_wwdc-%EC%A0%95%EB%A6%AC%EB%85%B8%ED%8A%B8-notion-activity-7207724207458123776-yeX3?utm_source=share&utm_medium=member_desktop) written by Soo-hwan Cho, an iOS developer at Toss on LinkedIn, I decided to translate this to become a developer with substance.

> **TL;DR**
> - The goal is to understand the broader TypeScript world and become a sexier TypeScript developer through TypeScript blog translation.
> - I tried not to include content that requires additional learning in the translation article as much as possible during the translation process.

---

## Inferred Type Predicates

TypeScript goes through the process of tracking how variable types change within code.
```tsx
interface Bird {
    commonName: string;
    scientificName: string;
    sing(): void;
}

// Maps country names -> national bird.
// Not all nations have official birds (looking at you, Canada!)
declare const nationalBirds: Map<string, Bird>;

function makeNationalBirdCall(country: string) {
  const bird = nationalBirds.get(country);  // bird has a declared type of Bird | undefined
  if (bird) {
    bird.sing();  // bird has type Bird inside the if statement
  } else {
    // bird has type undefined here.
  }
}
```

When handling `undefined` cases like above, the code becomes more complex and messy.

In the past, defining types for arrays in this way was much more difficult.  
The code below would cause errors in previous versions.
```tsx
function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // error: 'bird' is possibly 'undefined'.
  }
}
```

The code above is logically perfect, but TypeScript would produce errors.  
In version 5.5, it works correctly
```tsx
function makeBirdCalls(countries: string[]) {
  // birds: Bird[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // ok!
  }
}
```
The type of the `birds` variable has become more accurate.

This is because TypeScript infers a [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) for the `filter` function.  
It becomes clearer when we extract the function like below.
```tsx
// function isBirdReal(bird: Bird | undefined): bird is Bird
function isBirdReal(bird: Bird | undefined) {
  return bird !== undefined;
}
```

Here, `bird is Bird` is the type predicate.  
This means that if the above function returns `true`, the `bird` variable is of type `Bird`.  
(i.e., `value is type`)

The type specification of `Array.prototype.filter` performs type predicate, so the execution result has a clearer type and passes the type checking process.

TypeScript will infer that a function returns a type predicate if the following conditions are met:

1. The function has no explicit return type or type predicate annotation
2. The function has a single `return` statement and no implicit return
3. The function does not mutate the parameter
4. The function returns a `boolean` expression that refines the parameter

Additional examples of type predicates include:
```tsx
// const isNumber: (x: unknown) => x is number
const isNumber = (x: unknown) => typeof x === 'number';

// const isNonNullish: <T>(x: T) => x is NonNullable<T>
const isNonNullish = <T,>(x: T) => x != null;
```

Previously, TypeScript would only infer that these functions return a `boolean` type.  
Now it infers type predicates like `x is number` or `x is NonNullable<T>`.

Type predicates have "if and only if" semantics. If a function returns `x is T`, it means:
1. If the function returns `true`, then `x` is of type `T`.
2. If the function returns `false`, then `x` is not of type `T`.

If you expect a type predicate to be inferred but it isn't, you may be violating the second rule.  
This is often the result of truthiness checks.
```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => !!score);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // error: Object is possibly 'undefined'.
}
```

TypeScript cannot infer a type predicate for `score => !!score`.  
If this expression returns `true`, then `score` is of type `number`.  
But if it returns `false`, `score` could be `undefined` or `number` (specifically `0`).  
This creates problems for calculating the average score that the function aims for.  
(If a student with 0 points is filtered out, the number of students decreases and the average score increases accordingly!)

Therefore, it's better to filter out `undefined` in the above function.
```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => score !== undefined);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;  // ok!
}
```

Such truthiness checks will infer type predicates for unambiguous object types.  
A function must return a `boolean` to be a candidate for type predicate inference. (`x => !!x` might work, but `x => x` won't.)

Explicit type predicates work as before.  
TypeScript doesn't check whether the same type predicate should be inferred.  
Explicit type predicates ("is") are not safer than type assertions ("as").

If TypeScript infers types more precisely, previously working code might stop working.
```tsx
// Previously, nums: (number | null)[]
// Now, nums: number[]
const nums = [1, 2, 3, null, 5].filter(x => x !== null);

nums.push(null);  // ok in TS 5.4, error in TS 5.5
```

The solution for the above is to use explicit type annotation for the type.
```typescript
const nums: (number | null)[] = [1, 2, 3, null, 5].filter(x => x !== null);
nums.push(null);  // ok in all versions
```

---
## Control Flow Narrowing for Constant Indexed Access
> In Korean, this would translate to "상수 인덱스 접근에 대한 제어 흐름 좁히기".  
> This means progressively narrowing types when accessing using constants as indexes.

You can narrow expressions of the form `obj[key]` when `obj` and `key` are constants.
```typescript
function f1(obj: Record<string, unknown>, key: string) {
    if (typeof obj[key] === "string") {
        // Now okay, previously was error
        obj[key].toUpperCase();
    }
}
```
In the above code, since `obj` and `key` don't change, TypeScript can narrow the type of `obj[key]` to `string` after checking with `typeof`.

---
## JSDoc `@import` Tag
Importing something solely for type checking in JavaScript files is a really annoying task.  
Even if you need specific types, you can't use them if they don't exist at runtime.  
(TypeScript is a statically typed language where type checking occurs at compile time, but JavaScript is a dynamic language where everything is evaluated and applied during execution)
```javascript
// ./some-module.d.ts
export interface SomeType {
    // ...
}

// ./index.js
import { SomeType } from "./some-module"; // ❌ runtime error!

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

In the above code, `SomeType` doesn't exist at runtime, so it won't be imported.  
Instead, you can use namespace import.

```javascript
import * as someModule from "./some-module";

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

However, `some-module` still needs to be imported.  
Instead, you can use `import(...)` in JSDoc comments.
```javascript
/**
 * @param {import("./some-module").SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

If you want to reuse this in multiple places, you can use `typedef`.
```javascript
/**
 * @typedef {import("./some-module").SomeType} SomeType
 */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```
Writing code this way allows global use of `SomeType`, but if there are multiple import statements, the story becomes different (it gets more annoying).

To solve this! TypeScript has introduced a new `@import` comment with the same syntax as ECMAScript imports.

```javascript
/** @import { SomeType } from "some-module" */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

Using namespace import would ultimately look like this:
```javascript
/** @import * as someModule from "some-module" */

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

---
## Regular Expression Syntax Checking
Until now, TypeScript has ignored many regular expressions within code.  
Regular expressions technically have different syntax, and there was no need for TypeScript to compile these regular expressions to earlier versions of JavaScript.  
However, this could lead to many problems within regular expressions going undetected, eventually leading to errors.

Now TypeScript performs basic syntax checking for regular expressions.
```typescript
let myRegex = /@robot(\s+(please|immediately)))? do some task/;
//                                            ~
// error!
// Unexpected ')'. Did you mean to escape it with backslash?
```

This is a simple example, but it can catch many mistakes.  
TypeScript's checking process goes a bit beyond simple syntax checking and can catch issues related to non-existent backreferences, for example.
```typescript
let myRegex = /@typedef \{import\((.+)\)\.([a-zA-Z_]+)\} \3/u;
//                                                        ~
// error!
// This backreference refers to a group that does not exist.
// There are only 2 capturing groups in this regular expression.
```

```typescript
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<namedImport>/;
//                                                                                        ~~~~~~~~~~~
// error!
// There is no capturing group named 'namedImport' in this regular expression.
```

It can also recognize when regular expressions that are newer than the target ECMAScript version are used.
```typescript
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<importedEntity>/;
//                                  ~~~~~~~~~~~~         ~~~~~~~~~~~~~~~~
// error!
// Named capturing groups are only available when targeting 'ES2018' or later.
```

The same applies to regular expression flags (like i, g).

The above checking process is limited to regular expression literals. It doesn't check strings declared with `new RegExp`.

---
## Support for New ECMAScript `Set` Methods
TypeScript 5.5 includes new `Set` types introduced in ECMAScript.

Methods like `union`, `intersection`, `difference`, `symmetricDifference` take a `Set` as an argument and create a new `Set` as the result.  
Methods like `isSubsetOf`, `isSupersetOf`, `isDisjointFrom` turn a `Set` into a `boolean` value. These methods don't mutate the original `Set`.

(For detailed information, refer to the [original code](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#support-for-new-ecmascript-set-methods))

---
## Isolated Declarations
Declaration files (`.d.ts` files) describe the shape of specific libraries and modules to TypeScript.  
These files contain type definitions for libraries while not including detailed execution content like function bodies.  
They allow TypeScript to check libraries without needing to analyze the library.  
You can write declaration files manually, but a safer and simpler way is to use `--declaration` to have TypeScript automatically generate these files.

The TypeScript compiler and API have been responsible for generating declaration files, but there may be some use cases where you want to use different tools or where traditional build processes don't scale.

[For detailed information, see the original text...](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#isolated-declarations)

---
## The `${configDir}` Template variable for Configuration Files
It's very common to create base `tsconfig.json` files and reuse them across multiple codebases. The `extends` keyword makes this possible.

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

One issue with this approach is that all paths in the `tsconfig.json` file are relative to the file itself. If there's a shared `tsconfig.base.json` file used by multiple projects, relative paths might not work as intended.
```json
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types"
            "./custom-types"
        ],
        "outDir": "dist"
    }
}
```
If the author's intention is that `tsconfig.json` files extending the above file should:
1. Have `dist` directory as output relative to the desired `tsconfig.json` file, and
2. Have `custom-types` directory relative to the desired `tsconfig.json` file
this won't work as intended.  
The `typeRoots` paths are relative to the shared `tsconfig.base.json` file's path, not the extending project.  
All projects extending the common file must declare the same `outDir` and `typeRoots` content.  
This makes synchronization across multiple projects difficult, and this problem occurs with other options like `path` as well as `typeRoots`.

To solve this, TypeScript 5.5 introduces a new template variable `${configDir}`.  
When `${configDir}` is used in specific path fields, the variable is replaced at compile time with the directory containing the configuration file. This means you can write:
```json
{
    "compilerOptions": {
        "typeRoots": [
            "${configDir}/node_modules/@types"
            "${configDir}/custom-types"
        ],
        "outDir": "${configDir}/dist"
    }
}
```

When extending and using the above file, the paths will be relative to the desired `tsconfig.json`. This allows for easier sharing and management of configuration files across multiple projects.

---
## Consulting `package.json` Dependencies for Declaration Files Generation
TypeScript often produces errors like:
```
The inferred type of "X" cannot be named without a reference to "Y". This is likely not portable. A type annotation is necessary.
```

This often occurs when TypeScript's declaration file generation finds itself in content from files that weren't explicitly imported.  
Importing such files can be risky when the path is a relative path. However, when using dependencies specified in `package.json`'s dependencies (or `peerDependencies`, `optionalDependencies`), it may be safe to use such import statements.

TypeScript 5.5 is more lenient in these cases, so errors won't occur.

- [Related issue](https://github.com/microsoft/TypeScript/issues/42873), [Related PR](https://github.com/microsoft/TypeScript/pull/58176)

---
## Editor and Watch-Mode Reliability Improvements
TypeScript has added several new features and modified existing logic to make `--watch` mode and code editor integration more reliable. This will reduce the occurrence of TSServer or editor restarts.

### Correctly Refresh Editor Errors in Configuration Files
TypeScript can generate errors for `tsconfig.json` files.  
However, these errors occur during the project loading process, and editors typically don't directly generate errors for `tsconfig.json` files. This means even when all errors in the `tsconfig.json` file are fixed, TypeScript doesn't update the empty error state, so users continue to see errors unless they refresh the editor.

TypeScript 5.5 addresses this by generating events. [See PR](https://github.com/microsoft/TypeScript/pull/58120)

### Better Handling for Deletes Followed by Immediate Writes
Some tools adopt the approach of deleting and recreating files instead of overwriting them. The `npm ci` command works exactly this way.

While this approach can be efficient for these tools, it can be problematic in TypeScript's editor scenarios where deleting a watched item can remove that item and all its transitive dependencies.

TypeScript 5.5 has a more sophisticated approach that retains deleted parts of projects until new creation events are detected. This approach makes commands like `npm ci` work better with TypeScript. For more information, see [here](https://github.com/microsoft/TypeScript/pull/57492)

### Symlinks are Tracked in Failed Resolutions
When TypeScript fails to resolve a module, it needs to watch the failed resolution paths in case the module is added later. Previously, this wasn't done for symbolically linked directories, which could cause reliability issues in scenarios like monorepos where one project building might not be recognized by another project. TypeScript 5.5 addresses this issue, so you won't need to restart the editor as frequently.

[Learn more details in the PR!](https://github.com/microsoft/TypeScript/pull/58139)

### Project References Contribute to Auto-Imports
Auto imports no longer require at least one explicit import to a dependent project in project reference settings. Instead, auto import completion should work properly for items listed in the `references` field of `tsconfig.json`.

[Learn more details in the PR](https://github.com/microsoft/TypeScript/pull/55955)

---
## Performance and Size Optimizations
### Monomorphized Objects in Language Service and Public API
In TypeScript 5.0, `Node` and `Symbol` objects were made to have consistent properties and initialization order. This reduced polymorphism in various operations, allowing properties to be retrieved faster at runtime.

We witnessed significant compiler speed improvements through this change. However, most of these changes were performed on the internal allocator of data structures. The Language Service and TypeScript's public API use different allocators for specific objects. This allowed data used only in the language service to not be used in the compiler, making the TypeScript compiler lighter.

In TypeScript 5.5, the same monomorphization work has been performed for the Language service and public API. This means editors and build tools using the TypeScript API become significantly faster. In fact, benchmarks showed build times were 5-8% faster when using the public API's allocator, and language service operations were 10-20% faster. This may increase memory usage, but we think it's worth it and plan to find ways to reduce memory overhead.

[More information here](https://github.com/microsoft/TypeScript/pull/58045)

(Additional content)
- Allocator ([Wikipedia - Allocator](https://ko.wikipedia.org/wiki/%ED%95%A0%EB%8B%B9%EC%9E%90))
	- A component or algorithm that manages memory allocation in programming
- language service
	- A collection of features to provide enhanced development experience while developers write code
	- See [TypeScript-Compiler-Notes : GLOSSARY.md](https://github.com/microsoft/TypeScript-Compiler-Notes/blob/main/GLOSSARY.md)

### Monomorphized Control Flow Nodes
In TypeScript 5.5, control flow graph nodes are monomorphized to always maintain consistent shape. This reduces checking time by about 1%.

[More information here](https://github.com/microsoft/TypeScript/pull/57977)

(Additional content)  
In programming, polymorphism refers to the property where each element of a programming language is allowed to belong to various data types. The opposite is monomorphism, which refers to the property where each element of a programming language has only one form.

The core of this change is that the compiler's control flow nodes, which previously had polymorphic structures, have been monomorphized.

### Optimizations on our Control Flow Graph
In many cases, control flow analysis explores nodes that don't provide new information. We observed that when certain nodes have early termination or no effect in their preconditions, these nodes can always be skipped. Accordingly, TypeScript connects to previous nodes that provide useful information for control flow analysis when constructing the control flow graph. This creates a flatter control flow graph and makes exploration more efficient. These optimizations provide appropriate performance improvements, with build times reduced by up to 2% in specific code.

[More information here](https://github.com/microsoft/TypeScript/pull/58013)

### Skipped Checking in `transpileModule` and `transpileDeclaration`
TypeScript's `transpileModule` API can be used to compile the contents of a single TypeScript file to JavaScript. Similarly, the `transpileDeclaration` API (see below) can be used to generate declaration files for a single TypeScript file. One problem with these APIs was that TypeScript internally performed a full type checking process before outputting results. This was necessary to collect specific information for use in the output stage.

In TypeScript 5.5, we found ways to collect information only when needed without performing full type checking, and `transpileModule` and `transpileDeclaration` enable this feature by default. This allows tools integrated with these APIs, such as [ts-loader](https://www.npmjs.com/package/ts-loader)'s `transpileOnly` and [ts-jest](https://www.npmjs.com/package/ts-jest), to experience noticeable speed improvements. In our test environment, we generally confirmed that [build times were about twice as fast when using `transpileModule`](https://github.com/microsoft/TypeScript/pull/58364#issuecomment-2138580690).

### TypeScript Package Size Reduction
By further utilizing [the migration to modules conducted in TypeScript 5.0](https://devblogs.microsoft.com/typescript/typescripts-migration-to-modules/), we significantly reduced the overall package size by [having `tsserver.js` and `typingInstaller.js` import from a common API library instead of each creating independent bundles](https://github.com/microsoft/TypeScript/pull/55326).

This reduced TypeScript's disk size from 30.2 MB to 20.4 MB, and the compressed size decreased from 5.5 MB to 3.7 MB!

### Node Reuse in Declaration Emit
While working to support the `isolatedDeclarations` feature, we significantly improved how frequently TypeScript directly copies input source code when generating declaration files.

For example, when writing code like:
```typescript
export const strBool: string | boolean = "hello";
export const boolStr: boolean | string = "world";
```

The union types are the same but in different order. When generating declaration files, TypeScript can produce two possible results.

The first is using consistent expressions for each type:
```typescript
export const strBool: string | boolean;
export const boolStr: string | boolean;
```

The second is reusing type declarations as written:
```typescript
export const strBool: string | boolean;
export const boolStr: boolean | string;
```

The second approach is preferred for the following reasons:
- There are many similar expressions, but it contains the intention that it's still better to maintain them in the declaration file
- Creating new representations of types can be somewhat expensive, so it's better to avoid this
- User-written types are generally shorter than generated type expressions.

In TypeScript 5.5, we improved TypeScript to output types written in input files exactly as they are. In most cases, these improvements may not be visible in terms of performance gains. Previously, TypeScript needed to create new syntax nodes and serialize them to strings. Now, TypeScript can work directly from original syntax nodes, making it much cheaper and faster.

### Caching Contextual Types from Discriminated Unions
When TypeScript requests the contextual type of expressions like object literals, it often encounters union types. In such cases, TypeScript tries to filter union members based on properties with known values. This operation can be quite expensive, especially when dealing with objects with many properties.

In TypeScript 5.5, [we cached most of these computations so TypeScript doesn't need to recalculate for every property of the object literal](https://github.com/microsoft/TypeScript/pull/58372). Thanks to this optimization, compiling the TypeScript compiler itself was reduced by 250ms.

---
## Easier API Consumption from ECMAScript Modules
Previously, when writing ECMAScript modules in Node.js, named imports weren't available from the TypeScript package.
```typescript
import { createSourceFile } from "typescript"; // ❌ error

import * as ts from "typescript";
ts.createSourceFile // ❌ undefined???

ts.default.createSourceFile // ✅ works - but ugh!
```

This was because [cjs-module-lexer](https://github.com/guybedford/es-module-lexer) couldn't parse the CommonJS code generated by TypeScript. This issue has been resolved, and users can now use named imports from the TypeScript npm package in Node.js ECMAScript modules.

---
## The `transpileDeclaration` API
TypeScript's API provides a function called `transpileModule`. This function is designed to easily compile a single TypeScript file. However, since it doesn't have access to the entire program, it may not produce correct results if the code causes errors in the `isolateModules` option.

TypeScript 5.5 adds a new similar API called `transpileDeclaration`. This API is similar to `transpileModule` but is designed to generate a single declaration file based on specific source text. Like `transpileModule`, it doesn't have access to the entire program, and similar caveats apply. This means it can only generate accurate declaration files when the input code has no errors under the `isolatedDeclarations` option.

If desired, this function can be used to parallelize declaration generation across all files in `isolatedDeclarations` mode.

For more information, see [the PR](https://github.com/microsoft/TypeScript/pull/58261)

---
## Notable Behavioral Changes
This section covers changes that should be understood and known due to upgrades. These may be deprecations, removals, or new restrictions, and may include functionally improved bug fixes that could cause new errors affecting existing builds.

### Disabling Features Deprecated in TypeScript 5.0
The following options and behaviors were deprecated in TypeScript 5.0:
- `charset`
- `target: ES3`
- `importsNotUsedAsValues`
- `noImplicitUseStrict`
- `noStrictGenericChecks`
- `keyofStringsOnly`
- `suppressExcessPropertyErrors`
- `suppressImplicitAnyIndexErrors`
- `out`
- `preserveValueImports`
- `prepend` in project references
- implicitly OS-specific `newLine`

To use the deprecated options above, you must declare a new option called `ignoreDeprecations` along with `5.0`.

In TypeScript 5.5, these options no longer work. They can be defined in tsconfig, but starting from TypeScript 6.0, they will be treated as errors. For upcoming deprecation strategies, see [Flag Deprecation Plan](https://github.com/microsoft/TypeScript/issues/51000).

[Detailed information about these deprecation plans can be found on GitHub](https://github.com/microsoft/TypeScript/issues/51909), including suggestions for how to appropriately adjust your code.

### `lib.d.ts` Changes
Types generated for the DOM can affect the type checking process of your code. For more information, see [DOM updates for TypeScript 5.5](https://github.com/microsoft/TypeScript/pull/58211)

### Strict Parsing for Decorators
Since decorators were first introduced in TypeScript, the syntax has become more strict. TypeScript is now more strict about the forms it allows. Existing decorators may need to be wrapped in parentheses to prevent errors:
```typescript
class DecoratorProvider {
    decorate(...args: any[]) { }
}

class D extends DecoratorProvider {
    m() {
        class C {
            @super.decorate // ❌ error
            method1() { }

            @(super.decorate) // ✅ okay
            method2() { }
        }
    }
}
```

[More information here](https://github.com/microsoft/TypeScript/pull/57749)

### `undefined` is No Longer a Definable Type Name
TypeScript has not allowed type declarations that could conflict with built-in types.
```typescript
// Illegal
type null = any;
// Illegal
type number = any;
// Illegal
type object = any;
// Illegal
type any = any;
```

However, due to a bug, this wasn't applied to `undefined`. Starting from 5.5, it's now properly treated as an error.
```typescript
// Now also illegal
type undefined = any;
```

Simple references to type declarations named `undefined` didn't work from the beginning. You could define them, but you couldn't use them as unqualified type names.
```typescript
export type undefined = string;
export const m: undefined = "";
//           ^
// Errors in 5.4 and earlier - the local definition of 'undefined' was not even consulted.
```

[More information here](https://github.com/microsoft/TypeScript/pull/57575)

### Simplified Reference Directive Declaration Emit
When generating declaration files, TypeScript generates reference directives when it deems necessary. For example, since all Node.js modules are generated globally, they cannot be loaded through module resolution alone. For a file like:
```typescript
import path from "path";
export const myPath = path.parse(__filename);
```

Even though no reference directive appeared in the original code, it would generate a declaration file like:
```typescript
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

TypeScript also removes reference directives when it determines they're not needed. For example, even if you declare a reference directive with `jest`, it might not be needed when generating declaration files. TypeScript just removes it.

```typescript
/// <reference types="jest" />
import path from "path";
export const myPath = path.parse(__filename);
```

Even when given the above code, TypeScript produces:
```typescript
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

During the `isolatedDeclarations` process, we realized this logic was infeasible for those trying to generate declaration files without type checking or using more than one file context. Also, this behavior is difficult for users to understand. Unless you know exactly what happens during type checking, whether reference directives appear in generated files is inconsistent and hard to predict. To prevent declaration files from behaving differently when `isolatedDeclarations` is enabled, we realized we needed to change the generation method.

Through [experiments](https://github.com/microsoft/TypeScript/pull/57569), we found that almost all cases where TypeScript generated reference directives were to include Node.js or react. This is where there's an expectation that end users would already reference those types through "types" in tsconfig.json or imports from other libraries, so the likelihood of problems occurring by no longer generating such reference directives is very low. It's worth noting that this approach is already used in `lib.d.ts`. TypeScript doesn't generate a reference to `lib="es2015"` when a module exports `WeakMap`, instead assuming the end user included this as part of their environment.

Through [additional experiments](https://github.com/microsoft/TypeScript/pull/57656) with reference directives written by library authors, we found that