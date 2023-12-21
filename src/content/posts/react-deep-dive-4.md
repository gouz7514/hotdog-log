---
title: '[React] 리액트 톺아보기 (4) - 심화 학습 (2)'
summary: 'Effect, Reducer, Context에 대해 알아보자'
tags: ['React']
date: '2023-12-21 16:00:00'
---
## Effect
리액트의 기본적인 역할은 **사용자의 입력에 반응**하고, **UI를 렌더링**하는 것이다.

이외의 로직들은 모두 `Effect`라고 칭할 수 있다. 즉 `Effect`는 렌더링 자체에 의해 발생하는 모든 부수 효과(side effect)를 의미한다.
- Http 요청
- 스토리지에 데이터 저장
- 로깅 등...

이를 핸들링하기 위해 `useEffect()`를 사용할 수 있다.

### `useEffect`
`useEffect`는 다음과 같이 작성할 수 있다.
- `setup`
  - Effect 로직 함수
  - Effect는 모든 렌더링 후에 실행된다
  - 필요한 경우 `클린업` 함수를 리턴할 수 있다
  - `클린업`함수는 처음 실행될 때를 제외하고, 모든 **새로운** Effect 함수가 실행되기 전에 실행된다
- `dependencies`
  - setup 함수 내에서 참조되는 모든 반응형 값들이 포함된 배열
  - 리액트는 각각의 의존성들을 `Object.is` 비교법을 통해 이전 값과 비교한다
  - Effect로 사용되는 모든 것들을 종속성으로 추가해야 한다. 즉, 구성 요소가 다시 렌더링되어 변경될 수 있는 경우만 종속성으로 추가되어야 한다.

> #### 주의사항
> - 만약 dependencies가 객체이거나 컴포넌트 내부에 선언된 함수인 경우 Effect가 필요 이상으로 재실행될 수 있다. 이 경우 불필요한 의존성을 제거하거나, "이전 상태를 기반으로 상태를 업데이트"할 수 있다.
> - Effect로 수행하는 작업이 시각적인 작업을 수행하고 지연이 눈에 띄개 발생한다면 `useLayoutEffect`를 사용할 수 있다. ([참고](https://medium.com/@guptagaruda/react-hooks-understanding-component-re-renders-9708ddee9928#ab4f))

## Reducer
state가 많아지면 로직도 복잡해지고 관리가 힘들어진다.
이를 통합해 관리하기 위해 reducer를 사용할 수 있다.

리액트에서는 reducer를 사용하기 위해 `useReducer` 훅을 사용한다.

### `useReducer`
#### 1단계. action을 dispatch 함수로 전달하는 함수 정의하기
```javascript
// AS_IS
function handleAddTask(text) {
  setTasks([
  ...tasks,
  {
    id: nextId++,
    text: text,
    done: false,
  },
  ]);
}

// TO_BE
function handleAddTask(text) {  
  dispatch({  
    type: 'added',  
    id: nextId++,  
    text: text,  
  });  
}
```
state를 설정해 리액트에게 "무엇을 할 지" 지시하는 대신, action을 전달해 "방금 한 일"을 지정한다.

#### 2단계. reducer 함수 정의하기
reducer 함수는 현재 state값과 action 객체를 인자로 받고 다음 state 값을 반환한다.
```javascript
function tasksReducer(tasks, action) {
  switch (action.type) {
    case 'added': {
      return [
        ...tasks,
        {
          id: action.id,
          text: action.text,
          done: false
        }
      ]
    }
    default: {
      throw Error('Unknown action type')
    }
  }
}
```

> #### 왜 reducer라고 부를까?
> reducer는 배열에서 사용하는 `reduce()` 연산에서 이름을 따 왔다.
> `reduce`가 지금까지의 결과와 현재 아이템을 인자로 받고 다음 결과를 반환하듯, reducer 함수는 현재 state와 action을 인자로 받고 다음 state를 반환한다.

#### 3단계. 컴포넌트에서 reducer 사용하기
```javascript
import { useReducer } from 'react'

const [tasks, dispatch] = useReducer(tasksReducer, initialTasks)
```

> #### 주의사항
> - reducer는 반드시 순수해야 한다. 즉, 입력 값이 같다면 결과 값도 항상 같아야 한다.
> - 각 action은 하나의 사용자 상호작용만을 정의해야 한다.

## Context
리액트에서는 컴포넌트 간 전달을 위해 prop을 사용한다.
그러나 많은 컴포넌트를 거치거나, 여러 컴포넌트에서 동일한 정보를 필요로 하는 경우 prop을 전달하는 것이 복잡해진다.
![react prop drilling](https://ko.react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_prop_drilling.dark.png&w=640&q=75)

이를 해결하기 위해 `Context`를 사용할 수 있다.

#### 1단계. Context 생성하기
`createContext`를 사용해서 context를 생성한다.
```javascript
import { createContext } from 'react';

export const LevelContext = createContext(1);
```

#### 2단계. Context 사용하기
`useContext`훅을 사용해 생성된 context를 사용한다.
```jsx
import { useContext } from 'react';  
import { LevelContext } from './LevelContext.js';

export default function Heading({ children }) {  
  const level = useContext(LevelContext);  
  // ...  
}
```

#### 3단계. Context 제공하기
```jsx
// AS_IS
export default function Section({ children }) {  
  return (  
    <section className="section">  
      {children}  
    </section>
  );  
}

// TO_BE
import { LevelContext } from './LevelContext.js';  

export default function Section({ level, children }) {  
  return (  
    <section className="section">  
      <LevelContext.Provider value={level}>  
        {children}  
      </LevelContext.Provider>  
    </section>  
  );  
}
```
`Section` 컴포넌트의 모든 자식 컴포넌트에 props를 넘겨주는 대신 context를 활용해 같은 로직을 구현할 수 있다.
![using context in react](https://ko.react.dev/_next/image?url=%2Fimages%2Fdocs%2Fdiagrams%2Fpassing_data_context_far.dark.png&w=640&q=75)

### Context 사용 예시
- 테마 지정
- 현재 계정
- 상태 관리

---
이로써 리액트의 기초 개념부터 심화 개념까지 다양한 개념들을 살펴보고 나름대로 정리해보았다.
아직까지는 공식 문서의 내용을 읽고 간단하게 활용해본 수준이지만 더 나아가 React 코드를 직접 살펴보고 동작 원리를 이해해보는 시간을 가지려고 한다.
그 때는 더 양질의 포스팅을 작성할 수 있겠지!

> **이번 포스팅을 통해 배운 점**
> - `Effect`는 렌더링 자체에 의해 발생하는 모든 부수 효과(side effect)를 의미한다.
> - `Reducer`는 state를 통합해 관리하기 위해 사용한다.
> - `Context`를 사용하면 컴포넌트 간 전달을 위해 prop을 사용하지 않아도 된다.

---
**참고한 글들**
- [react.dev](https://react.dev/)
- [Medium : React Hooks - Understanding Component Re-renders](https://medium.com/@guptagaruda/react-hooks-understanding-component-re-renders-9708ddee9928)