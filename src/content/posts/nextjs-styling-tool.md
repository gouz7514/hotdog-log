---
title: '[NextJS] 스타일링 방식 갈아타기 (emotion)'
summary: 'styled-components에서 emotion으로 교체하는 과정을 정리한 글입니다.'
tags: ['NextJS', 'emotion', 'styled-components']
order: 1
---

4달 넘게 진행했던 프로젝트도 끝났고 한 달 동안 빡세게 달렸던 우테코도 끝이 났다!
다시 뭘 공부하면 좋을지 고민하던 와중, **React를 좀 더 딥하게 파보자는 생각**이 들어 [공식 문서](https://react.dev/)와 [Udemy](https://www.udemy.com/course/best-react/)를 오가면서 열심히 공부중에 있다.

아무래도 옵시디언을 활용해 정리한 내용은 내가 보기에 편한 내용들이기에 블로그에 기록하고 싶은 마음이 생겼다.
어떻게 기록할까 고민하던 중, 마침 velog에 접속했더니 서비스의 속도가 예전만큼 안정적이지 못한 것 같아(잔버그도 요새 점점 늘어난다..) 이전에 구축해놓은 나만의 웹사이트를 이참에 기록용 블로그로 발전시키기로 했다!

해서 이번 포스트를 시작으로 개인 블로그를 완성해나가는 과정을 기록해가려고 한다.

이번 포스팅은 그 첫번째인 <span style="color:#ff69b4"> **styled-components에서 emotion으로 갈아타기**</span>를 기록해보려고 한다.

💡 **목표**
- `emotion`과 `styled-components`의 차이를 알아보자
- `emotion`으로 갈아타기

> **해당 포스팅은 page router를 사용하는 nextjs 13.2 버전을 기준으로 작성된 글입니다.**

---
## 왜 스타일링 도구를 교체하는가?
기존에는 웹사이트에 `styled-components`를 적용한 상태였다.
`nextjs`를 공부하면서 바로 사용하기 쉬운 `styled-components`를 적용해놨는데 사이드 프로젝트를 진행하다보니 [여러 애로사항들](https://velog.io/@gouz7514/how-to-use-nextjs-13-properly#styled-components)도 존재했고 새로운 기술도 활용할겸 교체를 결정했다.

### 이유 1 : `use-client`
NextJS가 서버 컴포넌트가 기반이 되면서 `styled-components`를 사용하기 위해서는 파일 상단에 `use-client`의 사용이 강제된다. 이는 결국 서버 컴포넌트의 장점을 활용하지 못할 뿐더러 메타데이터 등 서버 사이드에서 필요한 동작을 원하는만큼 구현하지 못하게 된다.

![styled components issue - use client](https://velog.velcdn.com/images/gouz7514/post/4778a135-5873-4acd-b0f9-4a183f5855e4/image.png)
실제로도 여러 개발자들이 이런 내용으로 [문제를 제기하고 있는 상황](https://github.com/styled-components/styled-components/issues/4025)이다.
물론, `styled-components`가 잘못된 도구라는 소리는 전혀 아니다. 실제로도 훨씬 많은 개발자들과 회사에서 `styled-components`를 활용하고 있으니 말이다. 그러나, 버전이 올라간 NextJS에서 원하는 동작을 빠르게 구현하기 위해서는 스타일링 도구를 바꿔야겠다는 결론에 도달하게 되었다.

### 이유 2 : 복잡한 설정
`styled-components`를 사용하려면 별도의 설정이 필요하다
- app router를 사용하는 경우
[공식 홈페이지에서 권장](https://nextjs.org/docs/app/building-your-application/styling/css-in-js#styled-components)하는 대로 글로벌 레지스트리 컴포넌트를 만들고 해당 파일을 import하는 과정이 필요하다.

- page router를 사용하는 경우
서버 사이드에서 스타일 시트를 `_document.tsx` 파일에 추가해줘야 한다. 추가로 babel 설정을 적용해 서버 사이드에서도 스타일링이 원활하게 동작하도록 해야 한다. (필수 적용인지는 확인이 필요하다)

(이와 반대로 `emotion`은 설치만 해서 사용하면 된다!)
이러한 이유로 <span style="color:#ff69b4">**emotion**</span>으로의 교체를 결정했다!

## `emotion` vs `styled-components`
아무래도 두 도구 모두 같은 css-in-js 라이브러리이고 sass 문법을 사용하기 때문에 사용 방법은 거의 비슷하다.

- `styled-components`
```javascript
const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: palevioletred;
`
render(<Title>Hiya!</Title>)

// Object syntax
const button = styled.button({
  fontSize: '1.5em',
  textAlign: 'center',
  color: 'palevioletred'
});
```

- `@emotion/styled` : 컴포넌트 스타일용 패키지
```javascript
const Button = styled.button`
  padding: 32px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`

render(<Button>Hey! It works.</Button>)
---
render(
  <h1
    className={css`
      font-size: 1.5em;
      text-align: center;
      color: palevioletred;
    `}
  >
    Hiya!
  </h1>
)

// Object syntax
const titleStyles = css({
  fontSize: '1.5em',
  textAlign: 'center',
  color: 'palevioletred'
})

render(<h1 className={titleStyles}>Hiya!</h1>)

```

두 도구를 모두 능숙하게 사용해본 것은 아니지만 공식 문서와 여러 블로그를 훑으며 몇가지 다른 부분을 정리해 보았다.
- emotion은 CSS를 작성할 때 타입스크립트를 활용해 디버깅이 가능하다 ([출처](https://emotion.sh/docs/best-practices))
- 컴포넌트 스타일링 문법은 emotion이 styled-components의 영향을 받았다
- emotion이 좀 더 가볍다
- emotion의 문법은 좀 더 개발자 친화적이다 ([출처](https://emotion.sh/docs/composition))
- 속도는 비등비등하다

결국, 어떤 도구를 사용할지는 개발자의 취향, 코딩 컨벤션 차이에 따라 갈릴 것 같다.

## `emotion`으로 갈아타기
이제 개인 블로그에 emotion을 적용하기만 하면 된다!

### 글로벌 스타일 적용하기
`@emotion/react`에서 제공하는 `Global`을 사용해 프로젝트 전체에 글로벌 스타일을 적용한다.

필요한 경우 reset CSS 등을 여기에 적용할 수 있다.
```typescript
// src/styles/GlobalStyle.tsx
import { Global, css } from '@emotion/react'

const style = css`
	...
	프로젝트에 적용할 글로벌 스타일
`
const GlobalStyle = () => <Global styles={style} />

export default GlobalStyle
```

이후 `_app.tsx`에 `GlobalStyle`을 적용한다.
```typescript
// src/pages/_app.tsx
import GlobalStyle from '@/styles/GlobalStyle'

export default function App() {
	return (
    	<>
      		<Head>...</Head>
      		<Layout>
      			<GlobalStyle /> // 여기에 적용
      			...
      		</Layout>
      	</>
    )
}
```

이후, `styled-components`의 흔적을 하나씩 지워 나가면 된다.

[개인 프로젝트 PR - 스타일링 도구 교체](https://github.com/gouz7514/hotdog-log/pull/16)

---
채용 공고를 보다보니 emotion을 사용하는 회사들도 많고(특히 토스..!) 새로운 기술을 활용해보고 싶은 와중에 좋은 기회가 됐다.

뭘 공부해야할지 막막했는데 개인 블로그를 만들면서 react, nextjs 공부, 더 나아가 이력서와 포트폴리오까지 더 완성해나가보자!

---
**참고한 글들**
- [Emotion vs Styled Components](https://caisy.io/blog/emotion-vs-styled-components)
- [styled-components 과 emotion, 도대체 차이가 뭔가?](https://velog.io/@bepyan/styled-components-%EA%B3%BC-emotion-%EB%8F%84%EB%8C%80%EC%B2%B4-%EC%B0%A8%EC%9D%B4%EA%B0%80-%EB%AD%94%EA%B0%80)
- [github - jsjoeio : styled-components-vs-emotion](https://github.com/jsjoeio/styled-components-vs-emotion)