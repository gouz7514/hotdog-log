---
title: '[Redux] Redux 파헤치기'
summary: 'Redux를 조금 더 잘 쓰는 방법을 알아보자'
tags: ['React', 'Redux']
date: '2024-01-10 16:00:00'
---
리액트에서는 여러 컴포넌트에서 동일한 정보를 사용하기 위해 `Context`를 사용한다.
그러나 애플리케이션 전체에 걸쳐 여러 개의 context가 필요한 경우 코드 복잡도가 증가할 뿐 더러, 빈도가 잦은 업데이트의 경우에는 성능 저하를 일으킬 수 있다는 문제점이 있다.

> #### 빈도가 잦은 업데이트가 context에 미치는 영향?
> Context는 Provider가 변경될 때마다 하위 컴포넌트를 모두 리렌더링한다.
> 때문에 빈도가 잦은 업데이트의 경우에는 성능 저하를 일으킬 수 있다.

이를 해결하기 위해 다양한 상태 관리 라이브러리를 사용할 수 있다.
이번 포스팅에서는 다양한 라이브러리 중 가장 높은 인기를 구가하고 있는 `Redux`에 대해 알아보려고 한다.

![redux npm trend](https://github.com/gouz7514/hotdog-log/assets/41367134/6db7a270-93ea-4769-887e-3b372dfa402d)

> **TL;DR**
> - redux의 작동 방식에 대해 이해한다.
> - redux를 더 잘 사용하는 방법을 알아본다.

---
## Redux란?
Redux는 "action"이라 불리는 이벤트를 사용해 애플리케이션의 상태를 관리하고 업데이트하는 패턴과 라이브러리를 일컫는다.

공식 문서의 설명에 따르면 아래와 같은 특징을 지닌다.
- 일관적으로 동작하고, 서로 다른 환경에서도 실행되며, 테스트하기 쉬운 앱의 작성을 돕는다.
- 앱의 상태와 로직을 중앙화한다.
- devtools를 사용해 앱의 상태 추적과 디버깅을 가능하게 한다.

## Redux 작동 방식
먼저 Redux의 핵심 개념에 대해 알아보자

### Store
Redux 애플리케이션의 상태를 저장하는 객체이다.

`reducer`를 넘겨 줌으로써 store를 생성할 수 있다.

```javascript
import { configureStore } from '@reduxjs/toolkit'

const store = configureStore({ reducer: counterReducer })

console.log(store.getState())
// {value: 0}
```

### Action
애플리케이션에서 "무엇인가 일어났음을 의미"하는 객체이다.

```javascript
const counterIncreaseAction = {
  type: 'counter/increment',
  payload: 1
}
```

### Dispatch
Redux에서 상태를 변경하는 유일한 방법은 `action` 객체를 생성하고, `store.dispatch()`를 호출해 `action` 객체를 전달하는 것이다.


```javascript
store.dispatch({ type: 'counter/increment' })

console.log(store.getState())
// {value: 1}
```

### Reducer
`reducer`는 `state`와 `action`을 인자로 받아 `state`를 업데이트하고, 새로운 `state`를 반환하는 함수이다. `action` 객체의 type에 따라 이벤트를 처리하는 이벤트 리스너라고 생각할 수 있다.

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

> #### 주의사항
> Reducer는 다음과 같은 규칙을 반드시 지켜야 한다.
> - 반드시 `state`와 `action`을 기반으로 새로운 `state`를 계산해야 한다.
> - 상태를 직접 수정해서는 안된다. 대신, `state` 객체를 복사한 후 수정해야 한다. (immutable updates)
> - side effect(비동기 로직과 같은)를 절대로 포함해서는 안된다.

![redux data flow](https://redux.js.org/assets/images/ReduxDataFlowDiagram-49fa8c3968371d9ef6f2a1486bd40a26.gif)

위 개념들을 바탕으로 Redux의 동작 방식에 대해 이해하면 다음과 같다.
```
(1) root reducer를 통해 store가 생성된다.
(2) 애플리케이션에 변화가 발생하면, action이 store에 dispatch된다.
(3) store는 reducer를 호출하고, 현재 상태와 action을 인자로 전달한다.
(4) reducer는 action의 type에 따라 상태를 업데이트하고, 새로운 상태를 반환한다.
(5) store는 reducer가 반환한 새로운 상태를 저장한다.
(6) store의 상태가 변경되면, 이를 구독하고 있는 컴포넌트들이 리렌더링된다.
```

## Redux 사용해보기
리액트 애플리케이션에서 redux를 사용하려면 `react-redux` 라이브러리를 사용한다.

### 1. 설치
```bash
npm install react-redux
```

### 2. store 생성하기
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

### 3. 리액트 앱에 상태 전달하기
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

### 4. 컴포넌트에서 action을 dispatch하기
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
redux를 사용해 여러 상태를 한 곳에서 관리할 수 있지만 애플리케이션의 규모가 커짐에 따라 상태 관리도 복잡해지고 각 reducer의 식별자들을 관리하기도 어려워진다.
이를 간편하게 해결해주는 라이브러리가 바로 [`redux-toolkit`](https://redux-toolkit.js.org/)이다.

`redux-toolkit`의 주요 메서드를 살펴보면 다음과 같다.


### [createSlice](https://redux-toolkit.js.org/api/createSlice)
- slice name, 초기 상태, reducer 함수 객체를 파라미터로 받아, 리듀서와 상태에 대응하는 액션을 생성한다.
- `reducers` 파라미터 안의 모든 메서드는 자동으로 최근 state를 받는다.
  - 여기서 모든 reducer 메서드는 Immer로 wrapping되어, 보다 안전하게 상태를 변경할 수 있다. ([참고 링크](https://redux-toolkit.js.org/usage/immer-reducers))

### [configureStore](https://redux-toolkit.js.org/api/configureStore)
- redux 상태를 만드는 표준 메서드
- `createStore`를 내부적으로 활용해서, 상태를 생성할 때 더 나은 DX를 제공한다.
- 여러 reducer를 하나의 store에 결합할 수 있다.

위에서 작성한 코드를 `redux-toolkit`를 사용하면 다음과 같이 리팩토링할 수 있다.

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

컴포넌트에서는 아래와 같이 사용한다.
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

## Redux 고급지게 사용하기
> #### 참고 링크
> - [redux 공식 문서 - Side Effects Approaches](https://redux.js.org/usage/side-effects-approaches)
> - [redux 공식 문서 - Redux Style Guide](https://redux.js.org/style-guide)

상술했다시피 Redux의 핵심 개념 중 하나인 Reducer는 `side effect를 절대로 포함해서는 안된다` 라는 주의사항이 존재한다.
이 말은 즉, Redux는 오로지 `state`와 `action`을 기반으로 새로운 `state`를 계산하는 데에만 사용해야 한다는 것이다.

Redux는 그 어떤 비동기 로직에 대해서도 알 필요가 없다.
전달받은 action을 활용해 상태를 변경하는 것만이 reducer의 역할이다.

그러나, 실생활의 애플리케이션에서는 비동기 로직과 같은 side effect를 처리해야 하는 경우가 많다. Redux에서 이를 해결하려면 어떤 방식을 활용해야 할까?

### 1. 컴포넌트 내에서
컴포넌트 내에서 side effect를 처리할 때 다음과 같은 점을 꼭 주의해야 한다.
- state를 직접 변경해서는 안 된다.
- 동기적이거나 side effect가 아닌 로직은 reducer에서 수행해야 한다.
  - 애플리케이션 전체에 영향을 미치는 state를 하나의 store에서 관리하고 있기 때문에, 컴포넌트 내에서 side effect를 처리하면 다른 컴포넌트에서도 동일한 side effect가 발생할 수 있다.

백엔드(firebase)와 장바구니를 연동하는 예제를 통해 컴포넌트 내에서 side effect를 처리하는 방법을 알아보자.

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

    // side effect를 처리하는 로직
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

컴포넌트에서 http request를 요청했기 때문에 reducer는 side effect로부터 분리되어 immutability를 보장할 수 있게 된다.

### 2. action creator 내에서
redux toolkit를 통해 자동으로 action creator를 확보하고 이를 불러와서 dispatch할 action 객체를 생성하게 된다.

또는, `thunk`를 생성할 수 있다.
프로그래밍에서 `thunk`는 "지연 작업을 하는 코드"를 의미한다. 즉, 다른 작업이 완료될 때까지 작업을 지연시키는 단순한 함수라고 할 수 있다. 이를 활용해 당장 어떤 로직을 실행하지 않고, 나중에 실행하도록 코드를 작성할 수 있다.

즉, 실제 action 객체를 dispatch하기 전에 다른 코드를 실행할 수 있게 된다.

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

실제 action 객체를 dispatch하는 thunk는 다음과 같이 작성할 수 있다.
```javascript
// src/store/cartActions.js
// reducer 함수 외부에 존재하는 thunk를 생성해 side effect를 수행한다
export const sendCartData = (cart) => {
  return async (dispatch) => {
    dispatch(uiActions.showNotification({
      status: 'pending',
      title: 'Sending...',
      message: 'Sending cart data!'
    }));

  // side effect를 처리하는 로직
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

> #### thunk를 사용하는 이유?
> redux reducer는 side effect를 포함해서는 안된다.
> 그러나 실제 어플리케이션은 side effect를 포함한 로직을 필요로 한다. 이러한 로직을 UI 계층에서 분리하기 위해 thunk를 사용할 수 있다.

---
redux의 동작 원리와 핵심 개념부터, redux를 좀 더 잘 쓰는 방법에 대해서 알아보았다.
비즈니스 로직 구현뿐 아니라 상태 관리에 있어서도 계층 분리가 잘 이루어져야 더 좋은 코드를 작성할 수 있다는 것을 배우게 됐다.
다음 사이드 프로젝트에서는 redux를 한번 활용해봐야겠다!

> **이번 포스팅을 통해 배운 점**
> - redux의 동작 원리에 대해 학습했다.
> - redux의 핵심 개념에 대해 학습했다.
> - redux에서 side effect를 처리하는 방법에 대해 학습했다.
>   - 컴포넌트
>   - action creator (thunk)

---
**참고한 글들**
- [redux 공식 문서](https://redux.js.org/)
- [redux toolkit 공식 문서](https://redux-toolkit.js.org/)