---
title: '[React] 리액트 톺아보기 (3) - 심화 학습 (1)'
summary: '리액트 심화 학습 (1)'
tags: ['React']
date: '2023-12-19 16:00:00'
---

지금까지 포스팅을 통해 리액트의 핵심과 더불어 기본 개념에 대해 알아보았다.
이번 포스팅에서는 기본 개념을 바탕으로 여러 심화 개념들에 대해 정리해보려고 한다.

---
## Fragment
리액트에서 컴포넌트는 하나의 루트 엘리먼트만을 반환해야 한다.
이 경우 `<div>`와 같은 불필요한 엘리먼트가 렌더링되는 것을 방지하기 위해 `Fragment`를 사용할 수 있다.
`Fragment`는 `<></>`와 같이 간략화해서 사용할 수 있다.

```html
<>
  <ChildA />
  <ChildB />
</>
```

`Fragment`로 엘리먼트를 그룹화하면 DOM 결과물에 영향을 주지 않는다. 이는 즉, 엘리먼트가 그룹화되지 않은 것과 같다.

### 주의사항
`Fragment`에 `key` 속성을 사용할 수 있다. 이 경우 명시적으로 `Fragment`를 사용해야 한다.

리액트에서 state가 초기화되는 경우가 코드에 따라 다르다. 자세한 내용은 [여기](https://gist.github.com/clemmy/b3ef00f9507909429d8aa0d3ee4f986b)를 참고하자!


## Portal
리액트로 웹앱을 개발하다 보면 모달, 다이얼로그 등을 개발해야 하는 경우가 종종 발생한다. 이 경우 페이지 내에서 엘리먼트를 렌더링하면, 다른 HTML 코드 안에 위치할 뿐더러 스타일링과 접근성 관점에서 좋지 않다.

이를 해결하기 위해 `Portal`을 사용할 수 있다. `Portal`은 DOM 트리의 어디에서나 자식 엘리먼트를 렌더링할 수 있게 해준다.

### 사용방법
- **컴포넌트를 이동시킬 장소를 만든다.**
ex) `index.html` 파일에 `<div id="modal-root"></div>`를 추가한다.

- **[createPortal()]((https://react.dev/reference/react-dom/createPortal))**
```jsx
<div>  
  <SomeComponent />  
  {createPortal(children, domNode, key?)}  
</div>
```
`createPortal()`은 두 개의 인자를 받는다.
`children` : 렌더링되어야 하는 리액트 노드
`domNode` : 렌더링될 실제 DOM 영역

`Portal`을 사용하면 상술했듯이 페이지의 흐름에 영향을 주지 않는 모달, 다이얼로그를 만들 수 있다.
또한, 리액트 컴포넌트를 리액트가 아닌 DOM 노드로 렌더링하는 데 사용할 수 있다.

> #### 주의사항
> - 애플리케이션의 접근성이 준수되는지 확인하는 것이 중요하다.
> - 모달의 경우 WAI-ARIA 모달 제작 관행을 따르는 것이 중요하다.

## Ref
컴포넌트로 하여금 일부 정보를 기억하면서 렌더링을 유발하지 않고 싶을 경우 `Ref`를 사용할 수 있다.

```javascript
import { useRef } from 'react';

const ref = useRef(0);
```

`useRef`는 다음과 같은 객체를 반환한다.
```javascript
{
	current: 0,
}
```

`ref.current` 프로퍼티를 통해 값에 접근할 수 있다. 이 값은 리액트가 추적하지 않는다. 이를 통해 리액트의 단방향 데이터 흐름에서 벗어나게 된다.
이 값은 렌더링 과정에서는 읽거나 쓰지 않아야 한다. 리액트는 `ref.current`값의 변경에 대해 알지 못하기 떄문에, 애플리케이션의 동작을 예상하기 힘들어진다.

---
> **이번 포스팅을 통해 배운 점**
> - Fragment, Portal, Ref에 대해 학습했다.


To be continued...
