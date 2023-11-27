---
title: '[React] React 공식 문서 기여를 통한 성장'
summary: 'React 공식 문서에 기여하며 배운 것들을 정리한 글입니다.'
tags: ['React', 'Open Source']
---

> 💡 옵시디언을 활용해 리액트를 공부하는 흔적들을 보고 싶다면 [여기](https://github.com/gouz7514/second-brain/tree/main/1_Projects/React)를 확인해주세요!

리액트 공식 문서를 탐독하면서 리액트 기본기를 쌓기 위해 밤낮없이 열심히 공부하는 중이다.
[원문](https://react.dev/)과 [한글 번역본](https://ko.react.dev/)을 열심히 오가며 공부를 하다보니 오타나 자잘한 오류들을 발견해서 공부하는 겸 리액트 문서에 기여하기로 했다.

---
## 🥶 그거 어떻게 하는데..
채용 공고를 보다 보면 종종 **오픈 소스에 기여한 경험**이 있는 개발자를 찾는 경우가 있다.

> 그거.. 어떻게 하는 건데..❓

사실 나도 머리로만 해야 한다고 생각하면서 시작을 어떻게 해야할지 도통 감이 잡히지 않았다.
어디에 기여하지..? 분명 내용이 엄청 어려울텐데 내가 이해할 수 있을까..? 이해를 한다해도 어떻게 수정하고 기여해야 하지..?

그러나 백문이불여일견.
내가 애용하거나 공부하고 있는 프로젝트에 기여하기로 결정했다.

해서, React 공식 문서를 훑어봤고 마침 한글 번역이 진행되고 있어서 이번 기회를 통해 처음으로 오픈소스에 기여를 하게 됐다.

## 💡 오픈 소스에 기여하기
기여하는 과정은 생각보다 어렵지 않다.
- 웬만한 프로젝트라면 프로젝트에 기여하는 방법(ex : [React 한글 문서](https://github.com/reactjs/ko.react.dev#%EA%B8%B0%EC%97%AC-%EB%B0%A9%EB%B2%95))이 정해져 있다.
- 리포지토리를 fork한 뒤 수정을 진행할 브랜치를 만든다.
- 수정을 진행하고 내 리포지토리에 push를 한다.
- 원본 리포지토리에 PR을 날린다.
- 리뷰어에게 검토를 받은 뒤 머지되면 끝! 🎉

한글 번역 이슈를 읽다보니 아직 번역이 되지 않은 문서가 여럿 있었고 그 중 분량과 내용이 충분한 이슈를 찾아 번역을 진행했다.

**나의 첫 오픈소스 기여** : [Translate: Versioning Policy](https://github.com/reactjs/ko.react.dev/pull/790)

## 🌟 또 기여하기
이번 글을 쓰게 된 계기다.

첫번째 기여를 하고 난 뒤, 공식 문서를 활용해 공부를 하다 보니 오타를 몇 개 발견해 이를 수정하는 [PR](https://github.com/reactjs/ko.react.dev/pull/830)을 새로 생성했다.
![](https://velog.velcdn.com/images/gouz7514/post/6feba605-a9a8-4d64-84c2-21b0752a59e8/image.png)

뿌듯한 마음에 잠들려고 한 찰나, github action에서 오류가 발생하는 것을 확인했다. 오류를 디버깅해보니 특정 파일에서 에러가 발생하고 있었다.
오타를 수정한 것으로 만족할 수도 있었지만, 액션에서 에러가 발생한다는 것은 정상적이지 않은 상황이고, 이는 나중에 크리티컬한 에러로 이어질 수도 있어서 이를 직접 디버깅하고 수정을 진행하기로 했다.

### 🛠️ 에러 디버깅
[에러가 발생한 액션](https://github.com/reactjs/ko.react.dev/actions/runs/6968685339/job/18963052273)은 다음과 같다.
![](https://velog.velcdn.com/images/gouz7514/post/ab6d6398-775c-4a04-9102-155b05ab0aa8/image.png)

위 액션 로그를 살펴보면 다음과 같다.
- `node 20.x` 환경
- `ci-check` 스크립트 실행
- `prettier` 커맨드 실행
- `src/pages/404.js`에서 에러 발생

해서 오타 수정을 넘어 `404.js` 파일까지 수정을 진행하기로 결심했다.

### 🛠️ 에러 수정
에러가 발생하고 있던 `404.js` 파일은 다음과 같다.

**리액트 문서 한글 번역본 - `404.js`**
```javascript
/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: '페이지를 찾을 수 없습니다'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>요청하신 페이지가 존재하지 않습니다.</P>
          <P>
            저희 잘못으로 인한 오류라면{', '}
            수정할 수 있도록{' '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
            저희에게 알려주세요
            </A>
            {'. '}

          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
```

처음에는 왜 에러가 발생하는지 파악하지 못했다. 같은 디렉토리에 있는 `500.js` 파일은 멀쩡한데 왜 너만 말썽일까..

그러다 원문 즉, `react.dev`의 `404.js`는 어떻게 생겼는지 궁금해 이를 찾아봤다.

**원문 - `404.js`**
```javascript
/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import {Page} from 'components/Layout/Page';
import {MDXComponents} from 'components/MDX/MDXComponents';
import sidebarLearn from '../sidebarLearn.json';

const {Intro, MaxWidth, p: P, a: A} = MDXComponents;

export default function NotFound() {
  return (
    <Page toc={[]} meta={{title: 'Not Found'}} routeTree={sidebarLearn}>
      <MaxWidth>
        <Intro>
          <P>This page doesn’t exist.</P>
          <P>
            If this is a mistake{', '}
            <A href="https://github.com/reactjs/react.dev/issues/new">
              let us know
            </A>
            {', '}
            and we will try to fix it!
          </P>
        </Intro>
      </MaxWidth>
    </Page>
  );
}
```

육안으로 코드를 보고 바로 발견할 수 있는 다른 점은 다음과 같다.
- `A` 태그와 `P` 태그 사이에 공백 유무
- `저희에게 알려주세요` 부분 indent

해서 이 부분을 수정했으나 여전히 에러는 발생했고, 결국 문제가 되는 scripts를 분석했다.
```javascript
// package.json
{
	"scripts": {
    	...
        "nit:source": "prettier --config .prettierrc --list-different \"{plugins,src}/**/*.{js,ts,jsx,tsx,css}\"",
        "prettier:diff": "yarn nit:source",
        "ci-check": "npm-run-all prettier:diff --parallel lint tsc lint-heading-ids",
    }
}
```
각 명령어는 다음과 같은 순서로 실행된다.
```
ci-check -> prettier:diff -> nit:source
```
여기서 에러 로그를 다시 한번 살펴보면 `.prettierrc` 파일을 통해 prettier 설정을 적용하는데, 이 과정에서 에러가 발생한다.

그렇다면 이제 `.prettierrc` 파일을 살펴볼 차례!
```javascript
{
  "bracketSpacing": false,
  "singleQuote": true,
  "bracketSameLine": true,
  "trailingComma": "es5",
  "printWidth": 80,
  "overrides": [
    {
      "files": "*.css",
      "options": {
        "parser": "css"
      }
    },
    {
      "files": "*.md",
      "options": {
        "parser": "mdx"
      }
    }
  ]
}
```
이 설정은 한글 번역본 뿐만 아니라 원문에도 그대로 적용이 되어 있어 설정의 오류는 아니었다.
다시 한번 코드를 살펴보다 보니 코드의 길이 제한을 뜻하는 `printWidth`가 80으로 생각보다 낮게 잡혀있는 것을 보았고 `혹시 코드의 길이가 길어서 그런가?` 하는 생각이 들었다.
해서 이 부분을 아래와 같이 수정했더니
```javascript
// AS_IS
export default function NotFound() {
	return (
      <Page toc={[]} meta={{title: '페이지를 찾을 수 없습니다'}} routeTree={sidebarLearn}>
	      ...
      </Page
>    )
}
  
// TO_BE
export default function NotFound() {
	return (
      <Page
        toc={[]}
        meta={{title: '페이지를 찾을 수 없습니다'}}
        routeTree={sidebarLearn}>
	      ...
      </Page
>    )
}
```
에러가 귀신같이 잡혔다!
이렇게 수정된 내용을 정리해 기존 PR에 추가했고 이제 리뷰어 분의 리뷰만 받으면 성공적으로 기여를 마무리할 수 있게 됐다.

---
지레 겁먹었던 오픈 소스 기여, 막상 해보니 그렇게 어려운 것이 아니었다.
단순 번역을 넘어 오픈 소스를 자세히 훑어보고 오류를 수정하면서 나는 다음과 같은 내용을 배웠다.
- 오픈 소스 문서를 읽는 것만으로 훌륭한 개발자로 거듭나게 된다.
- 오픈 소스 코드를 읽으며 뛰어난 개발자들이 일하는 방식을 알 수 있다.
- 나의 기여가 다른 사람들에게 큰 도움이 될 수 있다.

앞으로도 꾸준히 공부를 통해 나중에는 직접 코드에 기여할 수 있는 날이 오기를 기대한다!