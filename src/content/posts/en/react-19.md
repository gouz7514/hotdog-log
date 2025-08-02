---
title: 'React 19 RC'
summary: 'Explore what has been improved and newly added in React 19'
tags: ['React']
date: '2024-06-01 19:00:00'
---
> This article is my own summary and translation of [React 19 RC](https://react.dev/blog/2024/04/25/react-19) written by the React Team on April 25, 2024.

---
# What's New
## Actions
In React, it's common to change data and update state based on the response.

For example, when a user submits a form to change their name, you make an API request and handle the response:
```typescript
// Example using useState
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async () => {
    setIsPending(true);
    const error = await updateName(name);
    setIsPending(false);
    if (error) {
      setError(error);
      return;
    } 
    redirect("/path");
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```

React 19 provides async functions that support pending states, errors, forms, and optimistic updates.

For example, you can use the `useTransition` hook to handle pending states:
```typescript
// Using pending state from Actions
function UpdateName({}) {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      const error = await updateName(name);
      if (error) {
        setError(error);
        return;
      } 
      redirect("/path");
    })
  };

  return (
    <div>
      <input value={name} onChange={(event) => setName(event.target.value)} />
      <button onClick={handleSubmit} disabled={isPending}>
        Update
      </button>
      {error && <p>{error}</p>}
    </div>
  );
}
```
Async transitions immediately set `isPending` to true, make the async request, and switch to false after the transition completes.

> By convention, functions that use async transitions are called "Actions."
Actions automatically manage data submission for you:
> - **Pending state**: Starts at the beginning of a request and automatically resets when the final state update is committed.
> - **Optimistic updates**: Using the new `useOptimistic` hook, you can show users instant feedback while requests are submitting.
> - **Error handling**: Provides Error Boundaries when requests fail, and automatically reverts optimistic updates back to their original value.
> - **Forms**: `<form>` elements now support passing functions to the `action` and `formAction` props. Passing functions to the `action` props use Actions by default and reset the form automatically after submission.

Based on Actions, React 19 introduces `useOptimistic` for managing optimistic updates, and the new `React.useActionState` hook for handling common cases of Actions.

In react-dom, we're adding `<form> Actions` for managing forms, and `useFormStatus` for supporting Actions in forms.
```typescript
// Using <form> Actions and useActionState
function ChangeName({ name, setName }) {
  const [error, submitAction, isPending] = useActionState(
    async (previousState, formData) => {
      const error = await updateName(formData.get("name"));
      if (error) {
        return error;
      }
      redirect("/path");
      return null;
    },
    null,
  );

  return (
    <form action={submitAction}>
      <input type="text" name="name" />
      <button type="submit" disabled={isPending}>Update</button>
      {error && <p>{error}</p>}
    </form>
  );
}
```

## New hook: `useActionState`
This is a hook for common use cases of Actions.
```typescript
const [error, submitAction, isPending] = useActionState(
  async (previousState, newName) => {
    const error = await updateName(newName);
    if (error) {
      return error;
    }

    return null;
  },
  null,
};
```
`useActionState` accepts a function (Action) and returns a wrapped Action to call. When the wrapped Action is called, `useActionState` will return the last result of the Action as `data`, and the pending state of the Action as `pending`.

> **Behind the scenes of the `useActionState` hook**
> [github facebook/react PR #28491 - Add React.useActionState](https://github.com/facebook/react/pull/28491)
> - It was originally `useFormState`
> - useFormState was only exported from the ReactDOM package and implied that it was only used for `<form>` actions, similar to `useFormStatus`.
>   - This led to confusion about "why doesn't `useFormState` provide pending state like `useFormStatus`"
> - The main issue was that the `useFormState` hook doesn't return the state of any specific form  
>    - Instead, it returns the state of the action passed to the hook, returns a wrapped trackable action to add to a form, and returns the last return value of the given action. → There's no reason it should be used inside `<form>`
> - Therefore, simply adding a pending state would be more confusing since it returns the pending state of the given action, not the state of the `<form>` that the action was passed to.
>    - It could be passed to multiple forms, which would only add to the confusion and cause pending state conflicts from multiple form submissions.
> - Since it's not limited to `<form>`, it can be used in any renderer.
>    - ex: In RN, you can use this hook to wrap an action, pass it to a component, then unwrap it and return the form's result and pending state. It's renderer agnostic.
> - Solution: To solve the above problems
>    - `useFormState` ⇒ `useActionState`
>    - Add pending state to return value
>    - Move hook to `react` package

## React DOM: `<form>` Actions
Actions also integrate with React 19's new `<form>` features for react-dom.

We've added support for passing functions to the `action` and `formAction` props of `<form>`, `<input>`, and `<button>` elements to automatically submit forms with Actions:
```html
<form action={actionFunction}>
```
When a `<form>` Action succeeds, React will automatically reset the form for uncontrolled components.

If you need to reset the `<form>` manually, you can call the new `requestFormReset` React DOM API.


## React DOM: New hook: `useFormStatus`
In design systems, it's common to write components that need access to information about the `<form>` they're in, without prop drilling down to the component. This can be done via Context, but to make the common case easier, we've added a `useFormStatus` hook:
```typescript
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```
`useFormStatus` reads the status of the parent `<form>` as if the form was a Context provider.

## New hook: `useOptimistic`
Another new hook we're adding is `useOptimistic`. This hook helps you manage optimistic updates.
```typescript
function ChangeName({currentName, onUpdateName}) {
  const [optimisticName, setOptimisticName] = useOptimistic(currentName);

  const submitAction = async formData => {
    const newName = formData.get("name");
    setOptimisticName(newName);
    const updatedName = await updateName(newName);
    onUpdateName(updatedName);
  };

  return (
    <form action={submitAction}>
      <p>Your name is: {optimisticName}</p>
      <p>
        <label>Change Name:</label>
        <input
          type="text"
          name="name"
          disabled={currentName !== optimisticName}
        />
      </p>
    </form>
  );
}
```
`useOptimistic` will immediately render the `optimisticName` while the `updateName` request is in progress.
When the update finishes or errors, React will automatically switch back to the `currentName` value.

## New API: `use`
In React 19 we're introducing a new API to read resources in render: `use`.

For example, you can read a promise with `use`, and React will suspend until the promise resolves:
```typescript
import {use} from 'react';

function Comments({commentsPromise}) {
  // `use` will suspend until the promise resolves.
  const comments = use(commentsPromise);
  return comments.map(comment => <p key={comment.id}>{comment}</p>);
}

function Page({commentsPromise}) {
  // When `use` suspends in Comments,
  // this Suspense boundary will be shown.
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```
You can also read context with `use`, allowing you to read context conditionally such as after early returns:
```typescript
import {use} from 'react';
import ThemeContext from './ThemeContext'

function Heading({children}) {
  if (children == null) {
    return null;
  }
  
  // This would not work with useContext
  // because of the early return.
  const theme = use(ThemeContext);
  return (
    <h1 style={{color: theme.color}}>
      {children}
    </h1>
  );
}
```
The `use` API can only be called in render, similar to hooks. Unlike hooks, `use` can be called conditionally.

## React Server Components
### Server Components
Server Components are a new option that allows rendering components ahead of time, before bundling, in an environment separate from your client app or SSR server. This separate environment is the "server" in React Server Components. Server Components can run once at build time on your CI server, or they can be run for each request using a web server.

All of the React Server Components features shipped in the Canary channel are included in React 19. This means libraries that ship with Server Components can now target React 19 as a peer dependency with a conditional export for frameworks that support the full-stack React architecture.

### Server Actions
Server Actions allow Client Components to call async functions executed on the server.

When a Server Action is defined with the `"use server"` directive, your framework will automatically create a reference to the server function and pass that reference to the Client Component. When that function is called on the client, React will send a request to the server to execute the function and return the result.

> **`use server` is a directive for Server Actions, not Server Components.**

---

# Improvements
## `ref` as a prop
Starting in React 19, you can now access `ref` as a prop for function components:
```typescript
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```
New function components will no longer need `forwardRef`.

In a future version, we will deprecate and remove `forwardRef` (!)

## Hydration error improvements
We've also improved hydration error messages. For example, instead of multiple error messages like this:
![hydration-error-as-is](https://github.com/gouz7514/hotdog-log/assets/41367134/ad589d2a-50d3-4661-a4d2-743f1e032935)

Now you get a single message with a diff of what was different:
![hydration-error-to-be](https://github.com/gouz7514/hotdog-log/assets/41367134/d973bb5d-ef3f-43de-bbe7-3fcb05abdb51)

## `<Context>` as a provider
Starting in React 19, you can render `<Context>` as a provider instead of `<Context.Provider>` (!)
```typescript
const ThemeContext = createContext('');

function App({children}) {
  return (
    <ThemeContext value="dark">
      {children}
    </ThemeContext>
  );  
}
```
New React apps can use `<Context>` as a provider. We will deprecate `<Context.Provider>` in a future version.

## Cleanup functions for refs
We now also support returning a cleanup function from `ref` callbacks:
```html
<input
  ref={(ref) => {
    // ref created

    // NEW: return a cleanup function to reset
    // the ref when element is removed from DOM.
    return () => {
      // ref cleanup
    };
  }}
/>
```
When the component unmounts, React will call the cleanup function returned from the `ref` callback.

This works for DOM refs, refs to class components, and `useImperativeHandle`.

> Previously, React would call `ref` functions with `null` when unmounting the component. If your `ref` returns a cleanup function, React will now skip this step.
In future versions, we will deprecate calling `ref` functions with `null` when unmounting components.

Due to the introduction of ref cleanup functions, returning anything else from a `ref` callback will now be rejected by TypeScript. The fix is usually to stop using implicit returns:
```html
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```
The original code was returning the instance of the `HTMLDivElement` and TypeScript didn't know if you meant to return a cleanup function.

## Initial value for `useDeferredValue`
We've also added an `initialValue` option to `useDeferredValue`:
```typescript
function Search({deferredValue}) {
  // On initial render the value is ''.
  // Then a re-render is scheduled with the deferredValue.
  const value = useDeferredValue(deferredValue, '');
  
  return (
    <Results query={value} />
  );
}
```
When `initialValue` is provided, `useDeferredValue` will return it as the value for the initial render of the component, and schedule a re-render in the background with the `deferredValue` returned.

## Document metadata support
In HTML, document metadata tags like `<title>`, `<link>`, and `<meta>` are reserved for placement in the `<head>` section of the document. In React, the component that decides what metadata is appropriate for the app may be very far from the place where you render the `<head>` or React doesn't render a `<head>` at all. In the past, these elements would need to be inserted manually or by libraries like `react-helmet`, and required careful handling when server rendering React applications.

In React 19, we're adding support for rendering document metadata tags in components natively (!)
```typescript
function BlogPost({post}) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content="Josh" />
      <link rel="author" href="https://twitter.com/joshcstory/" />
      <meta name="keywords" content={post.keywords} />
      <p>
        Eee equals em-see-squared...
      </p>
    </article>
  );
}
```
When React renders this component, it will see the `<title>`, `<link>`, and `<meta>` tags and automatically hoist them to the `<head>` section of the document.

(By supporting metadata natively, we can enable compatibility with streaming, server components, and client-only applications, but you may still want to use a metadata library for advanced features like setting specific metadata for routes.)

## Stylesheet support
Stylesheets, both external (`<link rel="stylesheet" href="...">`) and inline (`<style>...</style>`), require careful positioning in the DOM due to style precedence rules. Building a stylesheet capability that allows for composability within components is hard, so users often end up either loading all their styles far from the components that depend on them, or using a style library which encapsulates this complexity.

In React 19, we're addressing this complexity and providing even deeper integration into Concurrent Features on the client and streaming features on the server by adding built-in support for stylesheets.

If you tell React the `precedence` of your stylesheet, it will manage the insertion order of the stylesheet in the DOM and ensure that the stylesheet (if external) is loaded before revealing content that depends on those style rules:

```typescript
function ComponentOne() {
  return (
    <Suspense fallback="loading...">
      <link rel="stylesheet" href="foo" precedence="default" />
      <link rel="stylesheet" href="bar" precedence="high" />
      <article class="foo-class bar-class">
        {...}
      </article>
    </Suspense>
  )
}

function ComponentTwo() {
  return (
    <div>
      <p>{...}</p>
      <link rel="stylesheet" href="baz" precedence="default" />  <-- will be inserted between foo & bar
    </div>
  )
}
```
During server side rendering, React will include the stylesheet in the `<head>`, which ensures that the browser will not paint until it has loaded. If the stylesheet is discovered late after we've already started streaming, React will ensure that the stylesheet is inserted into the `<head>` on the client prior to revealing the content of a Suspense boundary that depends on that stylesheet.

During client side rendering, React will wait for newly rendered stylesheets to load before committing the render. If you render this component from multiple places within your application, React will only include the stylesheet once in the document.

## Async script support
In HTML, normal scripts (`<script src="...">`) and inline scripts (`<script>...</script>`) are render-blocking, meaning the browser cannot process more of the document while the script is loading. Scripts with `async` (`<script async="" src="...">`) will load in arbitrary order.

In React 19, we've included better support for async scripts by allowing you to render them anywhere in your component tree, inside the components that actually depend on the script, without having to manage relocating and deduplicating the script:
```typescript
function MyComponent() {
  return (
    <div>
      <script async={true} src="..." />
      Hello World
    </div>
  )
}

function App() {
  <html>
    <body>
      <MyComponent>
      ...
      <MyComponent> // won't lead to duplicate script in the DOM
    </body>
  </html>
}
```
In all rendering environments, async scripts will be deduplicated so that React will only load and execute the script once even if it gets rendered by multiple different components.

In server side rendering, async scripts will be included in the `<head>` and prioritized behind critical resources that block paint like stylesheets, fonts, and image preloads.

## Resource preloading support
During initial document load and on client-side navigations, telling the Browser about resources that it will likely need as early as possible can have a dramatic effect on page performance.

React 19 includes a number of new APIs for loading and preloading Browser resources to make it as easy as possible to build great experiences that aren't held back by inefficient resource loading:
```typescript
import { prefetchDNS, preconnect, preload, preinit } from 'react-dom'
function MyComponent() {
  preinit('https://.../path/to/some/script.js', {as: 'script' }) // loads and executes this script eagerly
  preload('https://.../path/to/font.woff', { as: 'font' }) // preloads this font
  preload('https://.../path/to/stylesheet.css', { as: 'style' }) // preloads this stylesheet
  prefetchDNS('https://...') // when you may not actually request anything from this host
  preconnect('https://...') // when you will request something but aren't sure what
}
```
These APIs can be used to optimize initial page loads by moving discovery of additional resources like fonts out of stylesheet loading. They can also make client-side updates faster by prefetching a list of anticipated resources used by a likely navigation and then eagerly preloading those resources on click or even on hover.

For more details, see the [Resource Preloading APIs](https://react.dev/reference/react-dom#resource-preloading-apis).

## Third-party scripts and extensions compatibility
We've improved hydration to account for third-party scripts and browser extensions.

When hydrating, if an element that renders on the client doesn't match the element found in the HTML from the server, React will force a client re-render to fix up the content. Previously, if an element was inserted by third-party scripts or browser extensions, it would trigger a mismatch error and client render.

In React 19, unexpected tags in the `<head>` and `<body>` will be skipped over, avoiding the mismatch errors. If React needs to re-render the entire document due to an unrelated hydration mismatch, it will leave in place stylesheets inserted by third-party scripts and browser extensions.

## Better error reporting
We improved error handling to remove duplication and provide options for handling caught and uncaught errors. For example, when there's an error in render caught by an Error Boundary, previously React would throw the error twice (once for the original error, then again after failing to automatically recover), and then call `console.error` with information about where the error occurred.

This resulted in three errors for every error caught:
![error-handling-as-is](https://github.com/gouz7514/hotdog-log/assets/41367134/838c0360-5ce2-476c-8efd-9e77c7bba55f)

In React 19, we log a single error with all the error information included:
![error-handling-to-be](https://github.com/gouz7514/hotdog-log/assets/41367134/aa472af5-8ded-4903-9999-a39a8480926d)

Additionally, we've added two new root options to complement `onRecoverableError`:
- `onCaughtError`: called when React catches an error in an Error Boundary.
- `onUncaughtError`: called when an error is thrown and not caught by an Error Boundary.
- `onRecoverableError`: called when React automatically recovers from errors.


## Custom element support
React 19 adds full support for custom elements and passes all tests in [Custom Elements Everywhere](https://custom-elements-everywhere.com/).

In past versions, using Custom Elements in React has been difficult because React treated unrecognized props as attributes rather than properties. In React 19, we've added support for properties that works on the client and during SSR with the following strategy:

- Server Side Rendering: props passed to a custom element will render as attributes if their type is a primitive value like `string`, `number`, or the value is `true`. Props with non-primitive types like `object`, `symbol`, `function`, or value `false` will be omitted.
- Client Side Rendering: props that match a property on the Custom Element instance will be assigned as properties, otherwise they will be assigned as attributes.

---
Writing this summary and reflecting on this update, I felt that a lot of conveniences have been improved.
Some of the newly introduced hooks, especially `useOptimistic`, made me think "Do we really need to create this...?" But thinking about it again, since these are already established patterns in React usage, providing them as built-in features seems quite useful.

What impressed me most was how many parts that I felt were inconvenient have been improved. Some impressive points include:
- Making `Context` directly usable as a provider while deprecating `Context.Provider`
- Making `ref` usable as a prop while deprecating `forwardRef`
- Supporting stylesheet precedence (I felt inconvenience while developing but just accepted it - this makes me reflect on myself..)

The kind of developer I want to become is **a developer who finds inconveniences inconvenient**, and it seems like the React team is working in the way I aspire to. This article helped me understand why React leads the frontend ecosystem.