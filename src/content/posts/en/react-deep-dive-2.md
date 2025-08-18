---
title: '[React] Deep Dive into React (2)'
summary: 'State in React'
tags: ['React']
date: '2023-12-12 16:00:00'
---
> **TL;DR**
> - Let's understand what State is.
> - Understand the process of State updates.
> - Understand the useState hook.

---

## State
As we learned in the previous post, React composes UI through components.
Components sometimes need to change what's on the screen as a result of interaction. In this case, they need to `remember` things like the current input value, current image, etc. React calls this kind of component-specific memory **State**.

When using simple local variables, React doesn't recognize these values.
1. Local variables don't persist between renders.
2. Changes to local variables won't trigger renders.

To solve this, React provides the following two things through the `useState` hook:
1. A `state variable` to retain data between renders
2. A `setState` function to update the variable and trigger the component to render again

(Let's learn more about the `useState` hook below.)

State is local to a component instance. This means that if you render the same component multiple times, each instance maintains its own independent state.

## Rendering in React
So how does rendering work in React?

### Step 1: Trigger a render
> Taking the guest's order to the kitchen

There are two reasons why a component renders:
**1. Component's initial render**
When the app starts, calling `createRoot` followed by `render` triggers the initial render.

**2. Component's state has been updated**
Calling `setState` updates the component's state, causing the component to re-render. Updating a component's state automatically queues a render.

### Step 2: React renders the component
> Preparing the order in the kitchen
**Rendering** is React calling your components.
- On initial render, React will call the root component.
- For subsequent renders, React will call the function component whose state update triggered the render.

### Step 3: React commits to the DOM
> Serving the dish to the table

After rendering your components, React will modify the DOM.
- For the initial render, React will use the `appendChild()` DOM API to put all the DOM nodes it has created on screen.
- For re-renders, React will apply the minimal necessary operations to make the DOM match the latest rendering output.

**In other words, React only changes the DOM nodes if there's a difference between renders.**

## State as a Snapshot
State variables in React behave like snapshots. Setting a state variable doesn't change the state variable you already have, but triggers a re-render.

In React, **rendering takes a snapshot of that moment.** That is, props, event handlers, local variables, etc. are all based on the state at the time of rendering.

The process of React re-rendering a component is as follows:
1. React calls your function again
2. Your function returns a new JSX snapshot
3. React then updates the screen to match the snapshot you've returned

**The values are fixed when UI snapshot is taken by calling the component!** Let's look at this with code for easier understanding.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(number + 5);
        setTimeout(() => {
          alert(number);
        }, 3000);
      }}>+5</button>
    </>
  )
}
```
Looking at the code flow, it seems like 5 should be output since we increased the `number` state by 5, but 0 is output because the `number` in that JSX was already captured as 0 in the snapshot. (State is scheduled at the moment of user interaction)
To solve this phenomenon, we can use an `updater` function.

## State Update Queue
React waits for all code in event handlers to complete before processing state updates. This prevents excessive re-renders and allows multiple states to be updated at once. This is called `batching`.

When applying `batching` behavior to the same state variable, you can pass a function that calculates the next state based on the previous state in the queue. This is called an `updater` function.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1); // updater function
      }}>+5</button>
    </>
  )
}
```

> #### 📌 Recap
> - State refers to the memory of React components.
> - React only changes DOM nodes if there's a difference between renders.
> - State in React behaves like snapshots.
> - A function that calculates the next state based on the previous state is called an `updater` function.

## `useState`
```javascript
import { useState } from 'react'

const [index, setIndex] = useState(0);
```

### Dissecting it
1. Your component renders for the first time.
2. You update state. When the user clicks a button, it calls `setIndex(index + 1)`. This tells React to remember that `index` is 1 and triggers another render.
3. Your component renders a second time. React still sees `useState(0)`, but because React remembers that you set `index` to 1, it returns `[1, setIndex]` instead.

### [Choosing the State Structure](https://ko.react.dev/learn/choosing-the-state-structure)
When using multiple states, structuring the state may be necessary.

#### 1. Group related state
If you always update two or more state variables at the same time, consider merging them into a single state variable.
```javascript
// AS_IS
const [x, setX] = useState(0);  
const [y, setY] = useState(0);

// TO_BE
const [position, setPosition] = useState({ x: 0, y: 0 });
```

#### 2. Avoid contradictions in state
Multiple states should not contradict and be inconsistent with each other.

#### 3. Avoid redundant state
If you can calculate some information from the component's props or its existing state variables during rendering, you should not put that information into that component's state.

> **Don't mirror props in state!**
> State is only initialized during the first render, so if you store received props directly in state, the state variable won't update when different props are passed.
>
> Mirroring props in state only makes sense when you want to ignore all updates for a specific prop. By convention, start the prop name with `initial` or `default`.

#### 4. Avoid duplication in state
Avoid duplication of the same data.

#### 5. Avoid deeply nested state
If your state is deeply nested, consider flattening it.

> #### 💡 How does React know which state to return?
> Hooks in React rely on a stable call order on every render of the same component.
> As long as you follow the rule of calling hooks at the top level, hooks are always called in the same order.
>
> Internally, React holds an array of state pairs for every component.
> It also maintains the current pair index, which is set to 0 before rendering.
> Each time you call `useState`, React gives you the next state pair and increments the index.
>
> Looking directly at React's code, you can see how it remembers the next state pair:
> ```javascript
> // ReactFiberHooks.js
> function updateWorkInProgressHook() {
>   let nextCurrentHook: null | Hook;
>   if (currentHook === null) {
>     const current = currentlyRenderingFiber.alternate;
>     if (current !== null) {
>       nextCurrentHook = current.memoizedState;
>     } else {
>       nextCurrentHook = null;
>     }
>   } else {
>     nextCurrentHook = currentHook.next;
>   }
> }
> ```

### Common Mistakes
#### 1. Use functional updates when updating based on previous state
```javascript
const [count, setCount] = useState(0)

function onClickCounter(amount) {
  // setCount((count) => count + adjustment)
  setCount(count + adjustment) // This approach only changes by 1 no matter how many times you call it
}
```
React schedules state updates. Therefore, theoretically, using a non-functional approach could rely on outdated or incorrect state snapshots.

#### 2. State updates are not reflected immediately
The `useState` hook itself is a synchronous function. However, the re-rendering process is asynchronous. (batching)

#### 3. primitive vs non-primitive
Reference types are passed by reference, so even with the same value, they are different objects. Therefore, re-rendering occurs even when passing the same value.

## Conclusion
I was able to deeply understand State, which is a core concept of React. In particular, I was able to learn how it works by looking directly at React code.
May the day come when I can contribute to code beyond just documentation!

> **What I learned through this post**
> - State in React refers to the memory of components.
> - State in React behaves like snapshots.
> - React decides which state to return by remembering the next state pair.
> - **I was able to understand how it works by looking directly at React code.**
---
**References**
- [react.dev](https://react.dev/)