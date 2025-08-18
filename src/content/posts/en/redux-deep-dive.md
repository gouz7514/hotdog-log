---
title: '[Redux] Deep Dive into Redux'
summary: 'Learn how to use Redux a bit better'
tags: ['React', 'Redux']
date: '2024-01-10 16:00:00'
---
In React, we use `Context` to share the same information across multiple components.
However, when multiple contexts are needed throughout the entire application, not only does code complexity increase, but frequent updates can also cause performance degradation.

> #### How do frequent updates affect context?
> Context re-renders all child components whenever the Provider changes.
> Therefore, frequent updates can cause performance degradation.

To solve this, we can use various state management libraries.
In this post, I want to explore `Redux`, which is one of the most popular libraries among the various options.

![redux npm trend](https://github.com/gouz7514/hotdog-log/assets/41367134/6db7a270-93ea-4769-887e-3b372dfa402d)

> **TL;DR**
> - Understand how redux works.
> - Learn how to use redux better.

---
## What is Redux?
Redux refers to a pattern and library for managing and updating application state using events called "actions".

According to the official documentation, it has the following characteristics:
- Helps write applications that behave consistently, run in different environments, and are easy to test.
- Centralizes your app's state and logic.
- Enables app state tracking and debugging using devtools.

## How Redux Works
First, let's learn about Redux's core concepts

### Store
An object that stores the state of a Redux application.

You can create a store by passing a `reducer`.

```javascript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

### Action
An object that represents "something happened" in the application.

```javascript
const counterIncreaseAction = {
  type: 'counter/increment',
  payload: 1
}
```

### Dispatch
The only way to change state in Redux is to create an `action` object and call `store.dispatch()` to pass the `action` object.

```javascript
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

### Reducer
A `reducer` is a function that takes `state` and `action` as arguments, updates the `state`, and returns a new `state`. You can think of it as an event listener that handles events based on the type of the `action` object.

```javascript
const initialState = { value: 0 }

function counterReducer(state = initialState, action) {
  switch (action.type) {
    case 'counter/increment':
      return {
        ...state,
        value: state.value + 1
      }
    default:
      return state
  }
}
```

> #### Important Notes
> Reducers must follow these rules:
> - They should only calculate the new state value based on the `state` and `action` arguments.
> - They are not allowed to modify the existing state. Instead, they must make immutable updates by copying the existing state and making changes to the copied values.
> - They must not do any asynchronous logic, calculate random values, or cause other "side effects".

![redux data flow](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

Based on these concepts, Redux's operation can be understood as follows:
```
(1) The store is created through the root reducer.
(2) When changes occur in the application, an action is dispatched to the store.
(3) The store calls the reducer and passes the current state and action as arguments.
(4) The reducer updates the state according to the action's type and returns the new state.
(5) The store saves the new state returned by the reducer.
(6) When the store's state changes, the components that subscribe to it re-render.
```

## Using Redux
To use redux in a React application, we use the `react-redux` library.

### 1. Installation
```bash
npm install react-redux
```

### 2. Creating a store
```javascript
// store/index.js
import { createStore } from 'redux'

const counterReducer = (state = { counter: 0 }, action) => {
  if (action.type === 'increment') {
    return {
      counter: state.counter + 1
    }
  }

  if (action.type === 'decrement') {
    return {
      counter: state.counter - 1
    }
  }
  
  return state
}

const store = createStore(counterReducer)

export default store
```

### 3. Providing state to React app
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import { Provider } from 'react-redux';
import store from './store';

import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
```

### 4. Dispatching actions from components
```jsx
import { useSelector, useDispatch } from 'react-redux';

const Counter = () => {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch({ type: 'increment' });
  };

  const decrementHandler = () => {
    dispatch({ type: 'decrement' });
  };

  return (
    <main>
      <div>{ counter }</div>
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
    </main>
  )
}
```

## redux-toolkit
While redux allows us to manage multiple states in one place, as the application grows larger, state management becomes more complex and it becomes difficult to manage each reducer's identifiers.
The library that makes this easier is [`redux-toolkit`](https://redux-toolkit.js.org/).

Let's look at the main methods of `redux-toolkit`:

### [createSlice](https://redux-toolkit.js.org/api/createSlice)
- Takes a slice name, initial state, and reducer function object as parameters to generate reducers and corresponding actions for the state.
- All methods in the `reducers` parameter automatically receive the latest state.
  - Here, all reducer methods are wrapped with Immer, allowing safer state changes. ([Reference link](https://redux-toolkit.js.org/usage/immer-reducers))

### [configureStore](https://redux-toolkit.js.org/api/configureStore)
- The standard method for creating redux state
- Uses `createStore` internally to provide a better DX when creating state.
- Can combine multiple reducers into one store.

The code written above can be refactored using `redux-toolkit` as follows:

```javascript
// store/index.js
import { createSlice, configureStore } from '@reduxjs/toolkit'

const initialState = { counter: 0, showCounter: true }

const counterSlice = createSlice({
name: 'counter',
initialState,
reducers: {
  increment(state) {
    state.counter++
  },
  decrement(state) {
    state.counter--
  },
  increase(state, action) {
    state.counter += action.payload
  },
  toggle(state) {
    state.showCounter = !state.showCounter
  }
}
})

const store = configureStore({
  reducer: counterSlice.reducer
})

export const counterActions = counterSlice.actions
export default store
```

In components, it's used as follows:
```jsx
import { useSelector, useDispatch } from 'react-redux';
import { counterActions } from '../store';

const Counter = () => {
  const counter = useSelector(state => state.counter);
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };
  const increaseHandler = () => {
    dispatch(counterActions.increase(5));
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  return (
    <main>
      <div>{ counter }</div>
      <div>
        <button onClick={incrementHandler}>Increment</button>
        <button onClick={increaseHandler}>Increment by 5</button>
        <button onClick={decrementHandler}>Decrement</button>
      </div>
    </main>
  )
}
```

## Using Redux More Elegantly
> #### Reference Links
> - [redux official docs - Side Effects Approaches](https://redux.js.org/usage/side-effects-approaches)
> - [redux official docs - Redux Style Guide](https://redux.js.org/style-guide)

As mentioned above, one of Redux's core concepts, Reducer, has the important note that `side effects should never be included`.
This means that Redux should only be used to calculate new `state` based on `state` and `action`.

Redux doesn't need to know about any asynchronous logic.
The only role of a reducer is to change state using the received action.

However, in real-world applications, we often need to handle side effects like asynchronous logic. How can we solve this in Redux?

### 1. Inside Components
When handling side effects inside components, you must pay attention to the following:
- Never modify state directly.
- Synchronous or non-side-effect logic should be performed in reducers.
  - Since the store manages state that affects the entire application, handling side effects in components could cause the same side effects to occur in other components.

Let's learn how to handle side effects inside components through an example that integrates a shopping cart with a backend (firebase).

```javascript
// src/App.js
import { useSelector } from 'react-redux';

const cart = useSelector((state) => state.cart);

let isInitial = true;

useEffect(() => {
  const sendCartData = async () => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!'
    }));

    // Logic for handling side effects
    const response = await fetch('FIREBASE_URL', {
      method: 'PUT',
      body: JSON.stringify(cart)
    })

    if (!response.ok) {
      throw new Error('Sending cart data failed.');
    }

    dispatch(uiActions.showNotification({
      status: 'success',
      title: 'Success!',
      message: 'Sent cart data successfully!'
    }));
  }

  if (isInitial) {
    isInitial = false;
    return;
  }
    
  sendCartData().catch(error => {
    dispatch(uiActions.showNotification({
      status: 'error',
      title: 'Error!',
      message: 'Sending cart data failed!'
    }));
  })
}
, [cart, dispatch]);
```

Since the http request was made in the component, the reducer can be separated from side effects and ensure immutability.

### 2. Inside Action Creators
Through redux toolkit, we automatically get action creators and import them to create action objects to dispatch.

Alternatively, we can create `thunks`.
In programming, a `thunk` means "code that does delayed work". In other words, it's a simple function that delays work until other work is completed. Using this, we can write code to execute some logic later instead of immediately.

This means we can execute other code before dispatching the actual action object.

```javascript
// src/App.js
import { sendCartData } from './store/cartActions';

let isInitial = true;

useEffect(() => {
  if (isInitial) {
    isInitial = false;
    return;
  }

  dispatch(sendCartData(cart));
}, [cart, dispatch]);
```

The thunk that dispatches the actual action object can be written as follows:
```javascript
// src/store/cartActions.js
// Create a thunk that exists outside the reducer function to perform side effects
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!'
    }));

  // Logic for handling side effects
  const sendRequest = async () => {
    const response = await fetch('FIREBASE_URL', {
      method: 'PUT',
      body: JSON.stringify(cart)
    })

    if (!response.ok) {
      throw new Error('Sending cart data failed.');
    }
  }

  try {
    await sendRequest()
    
    dispatch(uiActions.showNotification({
      status: 'success',
      title: 'Success!',
      message: 'Sent cart data successfully!'
    }));
  } catch (error) {
    dispatch(uiActions.showNotification({
      status: 'error',
      title: 'Error!',
      message: 'Sending cart data failed!'
    }));
    }
  }
};
```

> #### Why use thunks?
> Redux reducers should not contain side effects.
> However, real applications require logic that includes side effects. Thunks can be used to separate this logic from the UI layer.

---
I've learned about redux's operating principles and core concepts, as well as how to use redux better.
I learned that good layer separation is important not only for implementing business logic but also for state management to write better code.
I should try using redux in my next side project!

> **What I learned through this post**
> - Learned about redux's operating principles.
> - Learned about redux's core concepts.
> - Learned how to handle side effects in redux.
>   - Components
>   - Action creators (thunks)

---
**References**
- [redux official documentation](https://redux.js.org/)
- [redux toolkit official documentation](https://redux-toolkit.js.org/)