---
title: '[React] 리액트 톺아보기 (2)'
summary: '리액트의 State에 대해 알아보자'
tags: ['React']
date: '2023-12-12 16:00:00'
---
> #### Tl;DR
> - State가 무엇인지 알아보자.
> - State가 업데이트되는 과정을 이해한다.
> - useState 훅에 대해 이해한다.

---

## State
이전 포스팅에서 알아봤듯이 리액트는 컴포넌트를 통해 UI를 구성한다.
컴포넌트는 상호 작용의 결과로 화면의 내용을 변경해야 하는 경우가 있는데, 이 경우 현재 입력값, 이미지 등을 `기억`해야 한다. 리액트는 이런 종류의 컴포넌트별 메모리를 **State**라고 한다.

단순한 지역 변수를 사용하는 경우, 리액트는 해당 값들을 인식하지 못한다.
1. 지역 변수는 렌더링 간에 유지되지 않는다.
2. 지역 변수를 변경해도 렌더링을 유발하지 않는다.

이를 해결하기 위해 리액트는 `useState` 훅을 통해 다음의 두 가지를 제공한다.
1. 렌더링 간에 데이터를 유지하기 위한 `state 변수`
2. 변수를 업데이트하고 컴포넌트를 다시 렌더링하도록 유발하는 `setState` 함수

(`useState`훅에 대해서는 좀 더 밑에서 알아보도록 하자.)

State는 컴포넌트 인스턴스에 대해 지역적이다. 이 말은 즉, 동일한 컴포넌트를 여러 번 렌더링하면 각각의 인스턴스는 독립적인 state를 유지한다는 것이다.

## 리액트에서의 렌더링
그렇다면 리액트에서의 렌더링은 어떻게 이루어지는 걸까?

### 1단계 : 렌더링 트리거
> 손님의 주문을 주방으로 전달

컴포넌트 렌더링이 일어나는 데에는 두 가지 이유가 있다.
**1. 컴포넌트의 초기 렌더링**
앱이 시작될 때, `createRoot`를 호출한 뒤 `render`를 호출하면 초기 렌더링이 일어난다.

**2. 컴포넌트의 state가 업데이트된 경우**
`setState`를 호출하면 컴포넌트의 state가 업데이트되고, 이에 따라 컴포넌트가 다시 렌더링된다. 컴포넌트의 상태를 업데이트하면 렌더링 동작이 자동으로 큐에 들어가게 된다.

### 2단계 : 컴포넌트 렌더링
> 주방에서 주문 준비하기
**렌더링**은 리액트에서 컴포넌트를 호출하는 것을 일컫는다.
- 초기 렌더링에서 리액트는 루트 컴포넌트를 호출한다.
- 이후 렌더링에서, 리액트는 state 업데이트가 일어나 렌더링을 트리거한 컴포넌트를 호출한다.

### 3단계 : DOM에 커밋
> 테이블에 주문한 요리 내놓기

컴포넌트를 렌더링한 후 리액트는 DOM을 수정한다.
- 초기 렌더링의 경우 리액트는 `appendChild()` DOM API를 사용해 생성한 모든 DOM 노드를 화면에 표시한다.
- 리렌더링의 경우 필요한 최소한의 작업을 통해 DOM이 최신 렌더링 출력과 일치하도록 한다.

**즉, 리액트는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경한다.**

## 스냅샷으로서의 State
리액트에서 state 변수는 스냅샷처럼 동작한다. state 변수를 설정해도 이미 가지고 있는 state 변수는 변경되지 않고, 리렌더링을 일으킨다.

리액트에서 **렌더링은 그 시점의 스냅샷을 찍는다.** 즉 prop, 이벤트 핸들러, 로컬 변수 등은 모두 렌더링 당시의 state를 기반으로 한다.

리액트에서 컴포넌트를 다시 렌더링하는 과정은 다음과 같다.
1. 리액트가 함수를 다시 호출
2. 함수가 새로운 JSX 스냅샷을 반환
3. 리액트는 반환된 스냅샷과 일치하도록 화면을 업데이트

컴포넌트를 호출해 **UI의 스냅샷을 찍을 때 값이 고정**된다! 좀 더 쉬운 이해를 위해 코드와 함께 살펴보자.

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
코드의 흐름만 살펴보면 `number` state를 5만큼 증가시켰으니 5가 출력되어야할 것 같지만, 이미 해당 JSX의 `number`는 0인 상태로 스냅샷이 찍혔기 떄문에 0이 출력된다. (사용자가 상호작용한 시점에 이미 state가 예약됨)
이런 현상을 해결하기 위해 `updater` 함수를 사용할 수 있다.

## State 업데이트 큐
리액트는 state의 업데이트를 하기 전에 이벤트 핸들러의 모든 코드가 실행되기까지 기다린다. 이를 통해 과도한 리런데링을 방지하고 다수의 state를 한번에 업데이트할 수 있다. 이를 `batching`이라고 한다.

동일한 state 변수에 대해 `batching` 동작을 적용하는 경우 이전 큐의 state를 기반으로 다음 state를 계산하는 함수를 전달할 수 있다. 이를 `updater` 함수라고 한다.

```jsx
import { useState } from 'react';

export default function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h1>{number}</h1>
      <button onClick={() => {
        setNumber(n => n + 1); // updater 함수
      }}>+5</button>
    </>
  )
}
```

> #### 📌 Recap
> - State는 리액트 컴포넌트의 메모리를 의미한다.
> - 리액트는 렌더링 간에 차이가 있는 경우에만 DOM 노드를 변경한다.
> - 리액트에서 State는 스냅샷처럼 동작한다.
> - 이전 state를 기반으로 다음 state를 계산하는 함수를 `updater` 함수라고 한다.


## `useState`
```javascript
import { useState } from 'react'

const [index, setIndex] = useState(0);
```

### 해부하기
1. 컴포넌트가 처음 렌더링된다.
2. state를 업데이트한다. 사용자가 버튼을 클릭하면 `setIndex(index + 1)`을 호출한다. 이는 리액트에 `index`는 1임을 기억하게 하고 또 다른 렌더링을 유발한다.
3. 컴포넌트가 두번째로 렌더링된다. 리액트는 여전히 `useState(0)`을 보지만, `index`를 1로 설정한 것을 기억하고 있기 때문에 `[1, setIndex]`를 반환한다.


### [state 구조 선택하기](https://ko.react.dev/learn/choosing-the-state-structure)
여러 개의 state를 사용하는 경우 state의 구조화가 필요할 수 있다.

#### 1. 연관된 state 그룹화하기
두 개 이상의 state 변수를 항상 동시에 업데이트한다면, 단일 state 변수로 병합하는 것을 고려해라
```javascript
// AS_IS
const [x, setX] = useState(0);  
const [y, setY] = useState(0);

// TO_BE
const [position, setPosition] = useState({ x: 0, y: 0 });
```

#### 2. state의 모순 피하기
여러 state가 서로 모순되고 불일치해서는 안 된다.

#### 3. 불필요한 state 피하기
렌더링 중에 컴포넌트의 props나 기존 state 변수에서 일부 정보를 계산할 수 있다면, 컴포넌트의 state에 해당 정보를 넣지 않아야 한다.

> **Props를 state에 미러링해서는 안된다!**
> State는 첫번째 렌더링 중에만 초기화 되기 때문에 전달받은 props를 그대로 state에 저장하면 다른 값의 props가 전달될 때 state 변수가 업데이트되지 않는다.
>
> Props를 state에 미러링하는 것은 특정 prop에 대한 모든 업데이트를 무시하기 원할 때에만 의미가 있다. 이 경우, 관례에 따라 prop의 이름을 `initial` or `default`로 시작한다.

#### 4. state의 중복 피하기
동일한 데이터의 중복을 피해야 한다.

#### 5. 깊게 중첩된 state 피하기
만일 state가 깊게 중첩된 객체라면, state를 평탄하게 만드는 것을 고려해야 한다.

> #### 💡 리액트는 어떤 state를 반환할지 어떻게 결정할까?
> 리액트에서 훅은 동일한 컴포넌트의 모든 렌더링에서 안정적인 호출 순서에 의존한다.
> 최상위 수준에서 훅을 호출해야하는 규칙만 잘 따르면, 훅은 항상 같은 순서로 호출된다.
>
> 내부적으로 React는 모든 컴포넌트에 대해 한 쌍의 state 배열을 가진다.
> 또한 렌더링 전에 0으로 설정된 현재 인덱스 쌍을 유지한다.
> `useState`를 호출할 때마다, React는 다음 state 쌍을 제공하고 인덱스를 증가시킨다.
>
> 리액트의 코드를 직접 살펴보면 다음과 같이 다음 state 쌍을 기억하는 것을 확인할 수 있다.
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


### 자주하는 실수
#### 1. 이전 상태를 기반으로 업데이트할 때는 함수형 표현을 써야 한다
```javascript
const [count, setCount] = useState(0)

function onClickCounter(amount) {
  // setCount((count) => count + adjustment)
  setCount(count + adjustment) // 이 방식은 몇 번을 호출하든 결국 1만 변경됨
}
```
리액트는 상태 업데이트를 에약한다. 따라서, 이론적으로 함수형이 아닌 접근법을 사용하면 오래되었거나 잘못된 상태 스냅샷에 의존하게 될 수도 있다.

#### 2. 상태 업데이트는 바로 반영되지 않는다.
`useState`훅 자체는 동기 함수이다. 그러나, 리렌더링이 일어나는 과정이 비동기이다. (batching)

#### 3. primitive vs non-primitive
참조 타입은 참조에 의한 전달을 하므로 같은 값이어도 다른 객체이다. 따라서, 같은 값을 전달해도 리렌더링이 발생한다.


## 마무리
리액트의 핵심 개념인 State에 대해 깊이 있게 이해할 수 있었다. 특히, 직접 리액트 코드를 살펴보며 어떻게 동작하는지 알아볼 수 있었다.
문서 기여를 넘어 언젠가는 코드에도 기여할 수 있는 날이 오기를!

> **이번 포스팅을 통해 배운 점**
> - 리액트의 State는 컴포넌트의 메모리를 의미한다.
> - 리액트에서 State는 스냅샷처럼 동작한다.
> - 리액트는 다음 state 쌍을 기억함으로써 어떤 state를 반환할지 결정한다.
> - **직접 리액트 코드를 살펴보며 어떻게 동작하는지 알 수 있었다.**
---
**참고한 글들**
- [react.dev](https://react.dev/)