---
title: 'React 19 RC'
summary: 'React 19에서 무엇이 개선되고 새롭게 추가되었는지 알아보자'
tags: ['React']
date: '2024-06-01 19:00:00'
---
> 이 글은 React Team이 24년 4월 25일에 작성한 [React 19 RC](https://react.dev/blog/2024/04/25/react-19)를 나름대로 정리하고 번역한 글입니다.

---
# 새롭게 등장하는 것
## Actions
React에서는 데이터를 변경하고 이에 대한 응답을 기반으로 상태를 업데이트하는 것이 일반적이다.

예를 들어, 사용자가 이름을 변경하기 위해 form을 제출하면 API 요청을 보내고 응답을 처리한다
```typescript
// useState를 활용한 예시
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

React 19에서는 pending 상태, 에러, form 그리고 낙관적 업데이트를 지원하는 비동기 함수를 제공한다

예를 들어 `useTransition` 훅을 사용해 pending 상태를 다룰 수 있다.
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
비동기 트랜지션은 `isPending` 을 즉시 true로 바꾸고 비동기 요청을 보내며, 트랜지션 수행 후 false로 바꾼다.

> 컨벤션에 따라, 비동기 트랜지션을 사용하는 함수를 Actions라고 부른다.
Actions는 데이터 제출 과정을 자동으로 관리한다
> - **pending 상태** : request의 시작과 함께 시작되며, 최종 상태 업데이트가 커밋되면 리셋된다.
> - **낙관적 업데이트** : `useOptimistic` 훅을 사용해 요청이 제출되고 있는 중에도 유저가 즉각적인 피드백을 확인할 수 있다.
> - **에러 핸들링** : 요청이 실패했을 때 Error Boundaries를 보여줄 수 있고, 낙관적 업데이트된 값을 원래 값으로 자동으로 revert 시켜준다.
> - **Forms** : `<form>` 요소의 action 과 formAction props에 함수를 전달할 수 있다. `<action>`에 함수를 전달하면 Actions를 사용하고 제출 후 자동으로 form을 reset 한다.

Actions를 기반으로 한 React 19는 낙관적 업데이트를 관리하는 `useOptimistic` , Actions의 사용을 다루기 위한 `React.useActionState` 훅을 제공한다.

react-dom 에서는 form을 관리하는 `<form> Actions` , form에서 Action을 지원하는 `useFormStatus` 훅을 추가하고 있다.
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

## New hook : `useActionState`
Actions를 일반적으로 사용하기 위한 훅이다.
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
`useActionState`는 함수(Action)을 받아 호출할 래핑된 Action을 반환한다. 래핑된 액션이 호출되면, Action의 마지막 결과를 data로, pending 상태를 pending 으로 변경한다.

> **`useActionState` 훅의 비하인드**
> [github facebook/react PR #28491 - Add React.useActionState](https://github.com/facebook/react/pull/28491)
> - 처음에는 `useFormState`였다
> - useFormState는 ReactDOM 패키지에서만 export 되고, `useFormStatus`와 비슷하게 `<form>` actions에서만 사용되는 것을 암시한다.
>   - 이는 곧 ‘왜 `useFormState`는 `useFormStatus`처럼 pending 상태를 제공하지 않는가’ 하는 혼란을 야기하게 된다
> - 주 쟁점은, `useFormState` 훅은 그 어떤 특정한 form의 상태도 반환하지 않는다는 것
>    - 대신, 훅으로 전달된 action의 상태를 반환하고, hook을 감싸고 추적 가능한 action을 반환하여 form에 추가하고, 주어진 action의 마지막 리턴값을 반환한다. → `<form>` 안에서 쓰일 이유가 없다
> - 따라서, 단순히 pending 상태를 추가하는 것은 주어진 action의 pending 상태를 반환하는 것이지, action이 전달된 `<form>`의 상태를 반환하는 것이 아니기 때문에 더 혼란스러울 것이다.
>    - 여러 개의 form에 전달될 수 있고, 이 경우 혼란이 가중될 뿐더러 여러 form의 제출로 인해 pending 상태가 충돌할 것이다.
> - `<form>`에 국한된 것이 아니기 때문에, 그 어떤 renderer에서도 쓰일 수 있다.
>    - ex : RN에서 이 훅을 활용해 action을 감싸고, 컴포넌트로 전달한 뒤 unwrap하고, form의 결과와 pending 상태를 반환할 수 있다. it’s renderer agnostic (renderer에 상관없다)
> - 결론 : 위 문제를 해결하기 위해
>    - `useFormState` ⇒ `useActionState`
>    - pending 상태를 반환값에 추가
>    - `react` 패키지 로 훅을 이동

## React DOM : `<form>` Actions
Action은 `react-dom` 을 위한 React 19의 새로운 `<form>` 기능과도 통합된다.

Action을 활용해 자동으로 form을 제출할 수 있도록 form, input, button 요소에 action과 formAction props를 전달하는 기능이 추가되었다.
```html
<form action={actionFunction}>
```
`<form>` Action이 성공적으로 수행되면 React는 자동으로 form을 제어되지 않은 컴포넌트로 reset 한다.

`<form>`을 수동으로 reset 해야 한다면, 새로운 react DOM API인 `requestFormReset`을 호출할 수 있다.


## React DOM : New hook : `useFormStatus`
일반적으로, 컴포넌트에 prop을 드릴링하지 않고, `<form>`의 정보에 접근해야 하는 컴포넌트를 작성해야 할 때가 있다. Context 를 사용할 수도 있지만, 좀 더 쉽게 다루도록 `useFormStatus` 훅을 추가했다.
```typescript
import {useFormStatus} from 'react-dom';

function DesignButton() {
  const {pending} = useFormStatus();
  return <button type="submit" disabled={pending} />
}
```
마치 Context Provider처럼 부모의 `<form>` 상태를 읽는다.

## New hook : `useOptimistic`
낙관적 업데이트를 쉽게 지원하도록 새로운 훅이 추가되었다.
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
`updateName` 요청이 진행되면 `optimisticName` 값을 바로 보여준다.
업데이트가 종료되거나 에러가 발생 시, currentName 값으로 자동으로 전환된다.

## New API : `use`
렌더링에서 리소스를 읽는다 (read resources in render)

`use` 로 promise를 읽는 경우, promise가 resolve 될 때까지 React는 일시 중단된다.
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
`use`로 context를 읽을 수도 있으며, early return 이후에 동작하는 것처럼 조건부로 context를 읽을 수도 있다.
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
`use` API는 훅과 비슷하게 렌더에서만 호출될 수 있다. 훅과 다른 점은 조건부 호출이 가능하다는 것.

## Reac Server Components
### Server Comopnents
서버 컴포넌트는 번들링 전에, 클라이언트 애플리케이션 또는 SSR 서버와 분리된 환경에서 컴포넌트를 미리 렌더링할 수 있는 새로운 방법이다. 이렇게 분리된 환경이 RSC의 “서버”가 된다.서버 컴포넌트는 CI 서버에서 빌드 시 한번 실행되거나 웹 서버를 사용해 각 요청에 대해 실행될 수 있다.

카나리에서 제공된 RSC의 모든 기능이 리액트 19에도 포함된다. 즉, 서버 컴포넌트와 함께 제공되는 라이브러리는 이제 풀스택 리액트 아키텍처를 지원하는 프레임워크에서 조건부 내보내기를 지원하는 React 19를 peer dependency로 설정할 수 있다.

### Server Actions
Server Actions는 서버에서 실행되는 비동기 함수를 클라이언트 컴포넌트가 호출할 수 있도록 한다.

Server Action이 `use server` 로 선언되어 있으면, 프레임워크는 자동으로 서버 함수에 대한 reference를 생성해 클라이언트 컴포넌트에 전달한다. 이 함수가 클라이언트에서 호출될 때, React는 함수를 실행하기 위해 서버에 요청을 보내고 결과를 반환한다.

> **`use Server`는 서버 컴포넌트가 아닌 Server Actions를 위한 directive이다.**

---

# 개선사항들
## `ref`를 prop으로 사용
React 19부터, 함수형 컴포넌트에서 `ref`를 프로퍼티로 접근할 수 있다.
```typescript
function MyInput({placeholder, ref}) {
  return <input placeholder={placeholder} ref={ref} />
}

//...
<MyInput ref={ref} />
```
더 이상 함수형 컴포넌트에 `forwardRef` 를 사용하지 않아도 된다.

향후 버전에서는 `forwardRef` 가 deprecate될 예정 (!)

## hydration 에러 개선
아래와 같이 여러 줄로 노출되던 에러 메시지를
![hydration-error-as-is](https://github.com/gouz7514/hotdog-log/assets/41367134/ad589d2a-50d3-4661-a4d2-743f1e032935)

아래와 같이 하나의 메시지로 개선
![hydration-error-to-be](https://github.com/gouz7514/hotdog-log/assets/41367134/d973bb5d-ef3f-43de-bbe7-3fcb05abdb51)

## `<Context>`를 provider로 사용
React 19부터, `<Context.Provider>` 대신 `<Context>` 를 provider로 사용할 수 있다. (!)
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
`<Context.Provider>` 는 deprecate될 예정

## `ref`를 위한 클린업 함수
```html
<input
  ref={(ref) => {
    // ref 생성

    // NEW: 요소가 DOM에서 제거되면 ref를 리셋하기 위한
    // 클린업 함수를 반환
    return () => {
      // ref cleanup
    };
  }}
/>
```
컴포넌트가 unmount될 때, React는 `ref` 콜백에서 반환된 클린업 함수를 호출한다.

이는 DOM ref 뿐 아니라 클래스 컴포넌트의 ref, `useImperativeHandle` 에서도 동작한다.

> 이전에는, 컴포넌트가 언마운트될 때 `ref` 함수를 `null` 과 함께 호출했다. `ref` 가 클린업 함수를 반환한다면 이제 리액트는 이 단계를 건너 뛴다.
향후 버전에서는 이 과정이 deprecate 될 예정

클린업 함수의 도입으로 `ref` 콜백에서 클린업 함수 외에 다른 것을 반환하면 타입스크립트에서 거부할 것이다.
이를 수정하려면, 암시적 반환을 지양해야 한다.
```html
- <div ref={current => (instance = current)} />
+ <div ref={current => {instance = current}} />
```
원래 코드에서는 `HTMLDivElement`의 인스턴스를 반환했기 때문에 클린업 함수를 반환하려는 것인지 알 수 없었다.

## `useDeferredValue`를 위한 초깃값
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
초기값이 존재하면, `useDeferredValue`는 컴포넌트 초기 렌더링 시 value를 반환하고, 이후 백그라운드에서 다시 렌더링할 때 반환된 deferredValue 를 사용한다.

## 문서 메타데이터 지원
React에서는 메타데이터를 결정하는 컴포넌트가 `<head>`를 렌더링하는 위치와 매우 멀거나, React가 `<head>`를 렌더링하지 않을 수도 있었다. 이전에는, `react-helmet` 과 같은 라이브러리를 사용하거나 수동으로 삽입해야 했으며, 리액트 앱을 서버에서 렌더링 시 핸들링해야 했다.

React 19에서는 컴포넌트 자체에 문서 메타데이터 태그를 렌더링하는 기능이 추가된다. (!)
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
React가 위 컴포넌트를 렌더링할 때, `<title>`, `<link>`, `<meta>` 태그를 `<head>` 섹션에 위치하도록 자동으로 호이스팅 처리한다.

(그럼에도 불구하고 메타데이터 라이브러리를 활용해, 라우트에 따라 특정 메타데이터로 재정의하는 등 더 우수한 기능을 제공할 수 있다)

## 스타일시트 지원
외부 link 또는 inline으로 선언된 스타일시트는 스타일 우선순위 규칙으로 인해 DOM에서 신중하게 위치가 정해져야 한다. 컴포넌트 내에서 합성 가능한 스타일시트를 구축하는 것은 어렵기 때문에, 스타일시트에 의존하는 컴포넌트와 동떨어져 스타일을 한번에 로드하거나, 캡슐화하는 스타일 라이브러리를 사용하게 된다.

React 19에서는 내장된 스타일시트 지원을 통해 이러한 복잡성 문제를 해결한다.

스타일시트에 `precedence` 를 선언하면 스타일시트가 DOM에 삽입되는 순서를 관리하고, 컨텐츠가 보이기 전에 스타일시트가 로드되도록 보장한다

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
서버 사이드 렌더링 과정에서 React는 `<head>`에 스타일시트를 포함시켜, 모두 로드되기 전까지는 브라우저가 화면을 그리지 않도록 한다. 만약 스타일시트가 늦게 로드되더라도, `<head>`에 삽입되도록 보장한다.

클라이언트 사이드 렌더링 과정에서 React는 렌더링을 커밋하기 전에 새로 렌더링된 스타일시트가 로드될 때까지 기다린다. 해당 컴포넌트를 애플리케이션의 여러 곳에서 렌더링한다면 React는 스타일시트를 딱 한번만 포함시킨다.

## 비동기 스크립트 지원
`async` 키워드를 사용한 비동기 스크립트는 임의의 순서로 로드되게 된다.

React 19에서는 스크립트를 재배치하거나 중복을 제거하는 작업을 할 필요 없이, 비동기 스크립트를 컴포넌트 트리 내 어디든지 렌더링할 수 있도록 지원한다.
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
여러 다른 컴포넌트에 의해 비동기 스크립트가 렌더링되더라도 React는 스크립트를 단 한번만 로드하고 실행하게 된다.

서버 사이드 렌더링에서 비동기 스크립트는 `<head>`에 포함되며 화면 그리기를 block하는 스타일시트, 폰트, 이미지 프리로드 바로 다음으로 우선순위가 지정될 것이다.

## 리소스 프리로딩 지원
React 19에서는 브라우저 리소스를 로드하고 프리로드하는 새로운 API를 제공해 비효율적인 리소스 프리로드로 방해받지 않게 할 수 있다
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
폰트와 같은 추가 리소스를 스타일시트 로딩에서 제외해 초기 페이지 로드를 최적화할 수 있다.
더 자세한 내용은 [Resource Preloading APIs](https://react.dev/reference/react-dom#resource-preloading-apis)를 참고

## 서드파티 스크립트와 익스텐션 호환성
하이드레이션 중에 클라이언트에서 렌더링하는 요소가 서버의 HTMl과 일치하지 않으면, React는 강제로 클라이언트 렌더링을 다시 수행한다. 이전에는 서드파티 스크립트나 익스텐션에 의해 요소가 삽입되면 불일치가 발생해 클라이언트로 하여금 렌더링을 유발했다.

React 19에서는, `<head>` 및 `<body>`에 예상치 못한 태그가 있으면 건너뛴다. 만약 전체 문서가 다시 렌더링되어야할 경우, 서드파티 스크립트에 의해 삽입된 스타일시트를 그대로 유지한다.

## 개선된 에러 보고
중복된 에러를 제거하고 catch된 에러와 그렇지 않은 에러를 핸들링하는 옵션을 제공하도록 에러 핸들링을 개선했다.
예를 들어, Error Boundary에 의해 catch된 에러가 있다면, 이전에는 React가 에러를 두 번(원래 에러, 자동 복구에 실패한 후) 발생시켰다. 그 다음 에러 발생 위치에 대한 정보를 포함해 `console.error`를 호출했다.

이는 다음과 같이 에러 발생 시마다 3개의 에러를 발생시켰다.
![error-handling-as-is](https://github.com/gouz7514/hotdog-log/assets/41367134/838c0360-5ce2-476c-8efd-9e77c7bba55f)

React 19에서는 모든 에러 정보를 포함해 하나의 에러만 발생시킨다.
![error-handling-to-be](https://github.com/gouz7514/hotdog-log/assets/41367134/aa472af5-8ded-4903-9999-a39a8480926d)

추가로, `onRecoverableError`를 보완하기 위해 2개의 옵션을 추가했다.
- `onCaughtError` : React가 Error Boundary에 의해 catch된 에러를 보고할 때 호출
- `onUncaughtError` : React가 Error Boundary에 의해 catch되지 않은 에러를 보고할 때 호출
- `onRecoverableError` : React가 에러를 복구할 수 없을 때 호출


## Custom element 지원
이전 버전에서는 React에서 인식되지 않는 prop을 속성으로 처리하여 Custom element의 사용이 어려웠다.

React 19에서는 다음과 같은 전략을 사용해 클라이언트와 SSR 환경에서 동작하도록 한다.

- SSR : custom element에 전달된 prop이 원시 타입인 경우 attributes로 렌더링된다. 원시 타입이 아닌 prop은 생략된다
- CSR: Custom Element의 인스턴스와 일치하는 prop의 경우 prop으로 할당되고 일치하지 않으면 attribute로 렌더링된다.

---
이번 업데이트를 정리하며 느낀 점은 편의성이 많이 개선됐다는 느낌을 받았다.
새롭게 등장한 몇 가지 훅, 특히 `useOptimistic`과 같은 훅은 '굳이 이걸 만들어야 하나..?' 라는 생각이 들지만, 다시 생각해보면 이미 React의 활용 방안으로 굳어진 내용들을 아예 내장 기능으로 제공하는 것이기에 꽤나 유용하게 사용할 수 있을 것으로 보인다.

특히 인상 깊었던 점은, 기존에 불편하다고 느꼈던 많은 부분이 개선되는 점이다. 인상깊었던 점들을 몇가지 꼽자면 다음과 같다.
- `Context`를 바로 provider로 사용할 수 있게 하면서 `Context.Provider`를 deprecate한다는 점
- `ref`를 prop으로 사용할 수 있게 하면서 `forwardRef`를 deprecate한다는 점
- 스타일시트의 우선 순의를 지원한다는 점 (개발하면서 불편함을 느꼈는데 그냥 그러려니 했던 나를 반성하게 된다..)

평소 되고 싶은 개발자의 모습이 **불편함을 불편해하는 개발자**가 되는 것인데 React 팀은 내가 바라는 모습으로 일을 하고 있는 것 같다. 왜 React가 프론트엔드 생태계를 주도하는지 알 수 있었던 글이었다.