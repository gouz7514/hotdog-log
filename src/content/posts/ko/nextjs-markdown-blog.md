---
title: '[NextJS] NextJS로 마크다운 블로그 만들기'
summary: 'NextJS로 마크다운 블로그를 만들어보자!'
tags: ['Next.JS', 'React']
date: '2023-11-29 23:00:00'
---

> #### TL;DR
> - Next.js의 Static Generation을 알아보자
> - 마크다운 파일을 페이지에 렌더링하는 법을 알아보자

미뤄만 왔던 나만의 웹사이트를 드디어 완성하게 됐다!
도메인을 사 놓은지는 꽤 됐지만 미루고 미루다 보니 드디어 남들에게 보여줄 수 있는 수준이 되어 링크드인에도 공유하고 지인들에게도 자랑할 수 있게 됐다.

해서, 이번 포스팅에서는 블로그를 만들면서 공부한 내용을 기록해보려고 한다.
> - 해당 포스팅은 마크다운을 활용해 작성되었습니다. 원본 파일이 궁금하시다면 [여기](https://github.com/gouz7514/hotdog-log/blob/main/src/content/posts/nextjs-markdown-blog.md)를 참고해주세요!
> - [Velog](https://velog.io/@gouz7514) 출처가 아닌, 이 블로그에 처음으로 작성하는 포스팅입니다.

---
## Intro
나만의 웹사이트를 계획하게 된 가장 큰 계기는 자유롭게 기록하고 스타일링할 수 있는 나만의 개발 블로그를 완성하는 것이었다. `next.js`를 사용했기에 처음에는 `page.tsx` 를 매번 생성할까 고민했지만, 페이지의 양도 너무 방대해지고 "굳이 이렇게 해야 하나..?" 하는 생각이 들게 되었다.

생각만 하던 와중, [리액트 공식문서](https://react.dev)를 공부하고 이에 기여하기 위해 [코드](https://github.com/reactjs/react.dev)를 둘러보다가 공식 문서의 모든 컨텐츠가 마크다운 파일을 기반으로 생성된다는 것을 알게 되었다.

해서, 나도 비슷한 방식으로 마크다운 블로그를 만들기로 결정하고 다음과 같은 목표를 세웠다.
> - 마크다운 파일을 페이지에 렌더링하기
> - 복잡한 추가 작업 없이 마크다운 파일을 생성하면 블로그에 자동 반영되는 구조
> - **react.dev**나 **velog**와 비슷하게 스타일링 적용

## Pre-rendering
> 참고 링크 : [NextJS 공식문서 - Pre-rendering](https://nextjs.org/learn-pages-router/basics/data-fetching/pre-rendering)

마크다운 파일을 렌더링하는 방법을 알아보기 전에 먼저 `Pre-rendering`에 대해 알아보자.

기본적으로 NextJS는 `Pre-rendering`을 지원한다. `Pre-rendering`은 빌드 시점에 페이지를 미리 렌더링하는 방식으로, 성능과 SEO 측면에서 더 나은 결과를 가져올 수 있다.

![Pre-rendering](https://nextjs.org/static/images/learn/data-fetching/pre-rendering.png)

위 그림처럼 서버에서 이미 HTML이 완성된 페이지를 전달받아 브라우저에 렌더링하는 방식이다.

### `Static Generation` vs `Server-side Rendering`
Next.js는 `Static Generation`과 `Server-side Rendering` 총 2가지 방식의 `Pre-rendering`을 지원한다.
- `Static Generation` : 빌드 시점에 HTML을 생성하는 방식
- `Server-side Rendering` : 요청 시점에 HTML을 생성하는 방식

두 방식 모두 서버에서 HTML을 생성하지만 그 생성 시점에서 차이가 존재한다.

그렇다면 블로그를 만들 때는 어떤 방식을 사용해야 할까?
블로그에 기록하게 되는 내용은 자주 변경될 일이 없으며, 유저의 요청에 따라 페이지를 매번 호출할 필요가 없다. 때문에 나는 블로그 구현에 있어 `Static Generation` 방식을 도입하기로 결정했다.

### `getStaticProps`
Static 페이지를 생성하기 위해 `getStaticProps`를 사용한다.
`getStaticProps`는 NextJS가 지원하는 특별한 함수로, `getStaticProps`를 통해 반환된 prop이 페이지에 렌더링되게 된다.

```typescript
// pages/posts/index.tsx
// (2) 페이지의 props로 전달된다.
export default function Post(props) { ... }

export async function getStaticProps() {
  const post = ...

  return {
    props: {
      post // (1) 여기서 반환된 데이터가
    }
  }
}
```

어떤 렌더링 방식을 적용할지 알았으니 이제 마크다운 파일을 렌더링해볼 차례다!

## 마크다운 렌더링하기
### Dynamic Routes
> 참고 링크 : [NextJS 공식문서 - Dynamic Routes](https://nextjs.org/learn-pages-router/basics/dynamic-routes/page-path-external-data)

내가 원하는 블로그의 모습은, 여러 개의 마크다운 파일이 각각 페이지의 경로가 되고 동시에 마크다운의 내용이 페이지에 렌더링되는 것이다.

이를 위해 `posts/[id].tsx` 파일을 생성하고 `getStaticProps`를 사용해 마크다운 파일의 데이터를 가져오도록 구현했다.

```typescript
// pages/posts/[id].tsx
export default function Post(props) { ... }

// 정적으로 생성될 페이지의 경로를 정의한다.
export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

// params.id를 통해 id에 해당하는 post 데이터를 가져온다.
export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id)

  return {
    props: {
      post
    }
  }
}
```

### remark, rehype
페이지 경로를 생성하는 법을 알았으니 이제 실제로 마크다운 파일을 렌더링할 차례이다.
[공식 문서](https://nextjs.org/learn-pages-router/basics/dynamic-routes/render-markdown)에 자세히 설명하고 있어 간단하게만 정리를 하려고 한다.

`remark`는 [`unified`](https://github.com/unifiedjs/unified)에 기반한 마크다운 파서이다. `remark`를 사용해 마크다운 파일을 파싱하면 `remark`에서 반환된 AST(Abstract Syntax Tree)를 사용해 HTML로 변환할 수 있다.

공식 문서의 설명대로 `remark`와 `remark-html`만 사용해도 마크다운 파일을 HTML로 변환할 수 있지만, 내가 원하는 블로그의 동작까지는 다음과 같은 부분이 부족했다.
- 하이퍼링크가 무조건 현재 탭에서 열리는 문제
- 코드 하이라이팅이 적용되어 있지 않아 가독성이 떨어지는 문제

이를 해결하기 위해 레퍼런스로 삼은 **react.dev**의 코드를 살펴보았다.

```javascript
// plugins/markdownToHtml.js
const remark = require('remark');
const externalLinks = require('remark-external-links'); // Add _target and rel to external links
const customHeaders = require('./remark-header-custom-ids'); // Custom header id's for i18n
const images = require('remark-images'); // Improved image syntax
const unrwapImages = require('remark-unwrap-images'); // Removes <p> wrapper around images
const smartyPants = require('./remark-smartypants'); // Cleans up typography
const html = require('remark-html');

module.exports = {
  remarkPlugins: [
    externalLinks,
    customHeaders,
    images,
    unrwapImages,
    smartyPants,
  ],
  markdownToHtml,
};

async function markdownToHtml(markdown) {
  const result = await remark()
    .use(externalLinks)
    .use(customHeaders)
    .use(images)
    .use(unrwapImages)
    .use(smartyPants)
    .use(html)
    .process(markdown);
  return result.toString();
}
```
react는 remark와 관련된 다양한 플러그인을 사용해 마크다운 파일을 원하는 모습으로 변환해 렌더링하고 있었고 이를 참고하기로 했다.

[`remark-external-links`](https://github.com/remarkjs/remark-external-links)와 같은 플러그인을 사용하려고 보니 상당수가 Legacy 상태에 들어간 것을 확인할 수 있었고 공통적으로 `rehype-~` 플러그인의 사용을 권장하고 있었다.

`rehype`은 `remark`와 마찬가지로 `unified`에 기반한 HTML 파서이다. `remark`에서 반환된 AST를 사용해 HTML을 생성할 수 있으며, `remark`와 마찬가지로 다양한 플러그인을 사용해 HTML을 원하는 모습으로 변환할 수 있다.

`remark`와 `rehype`을 사용해 내가 작성한 마크다운 파일을 HTML로 변환하는 코드는 다음과 같다.

```typescript
// lib/directoryToHtml.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkUnwrapImages from 'remark-unwrap-images'
import remarkRehype from 'remark-rehype'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeStringify from 'rehype-stringify'
import rehypePrettyCode from 'rehype-pretty-code'

const directoryToHtml = async (directory: string, id: string) => {
  const fullPath = path.join(directory, `${id}.md`) // 해당 경로의 마크다운 파일을 읽어온다.
  const fileContents = fs.readFileSync(fullPath, 'utf8') // 파일 내용을 읽어온다.
  const matterResult = matter(fileContents) // 메타 데이터를 추출한다.

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkUnwrapImages)
    .use(remarkRehype)
    .use(rehypePrettyCode as any, { // 코드 하이라이팅
      theme: 'one-dark-pro'
    })
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] }) // 하이퍼링크가 새 탭에서 열리도록
    .use(rehypeStringify)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    ...matterResult.data
  }
}

export default directoryToHtml
```

특히 코드 블록 하이라이팅을 도와주는 `rehype-pretty-code` 플러그인을 적극 권장한다.
그냥 마크다운 파일을 렌더링하면 읽기도 힘들고 아무런 스타일도 없어 가독성이 떨어지는데, 해당 플러그인은 코드 블록 언어에 따라 코드를 파싱하고 적절한 스타일을 적용해주는 매우 유용한 플러그인이다..!

## (Bonus) 마크다운 파일 Fast Refresh
블로그를 작성하기 위해 마크다운 파일을 편집하다보면 NextJS에서 기본으로 지원하는 Fast Refresh가 지원되지 않아 페이지를 계속 새로고침하며 확인해야 하는 불편함이 있다. [공식 문서의 설명](https://nextjs.org/docs/architecture/fast-refresh)에 따르면 리액트 트리 구조 바깥에 있는 파일은 Fast Refresh가 지원되지 않는다고 한다.

그러나 이대로 포스팅을 계속 작성하며 새로고침을 하기에는 한계가 있다는 생각에 해결책을 찾아보았고 아니나 다를까 고맙게도 어느 능력자가 만든 [next-remote-watch](https://github.com/hashicorp/next-remote-watch)를 찾을 수 있었다.

해당 패키지는 next.js 프로젝트 내에 있지 않은 파일의 변경도 감지해 Fast Refresh를 지원한다.
해당 명령어를 다음과 같이 적용함으로써 마크다운 파일의 변경도 즉시 반영되는 나만의 블로그를 만들 수 있었다.
```json
// package.json
{
  "scripts": {
    "dev": "next dev",
    "write:posts": "next-remote-watch src/content/posts" // posts 폴더 내의 파일 변경 감지
  }
}
```

---
## 마무리
어떻게 만들지 막막했는데 공식 문서의 설명과 리액트 공식 문서, 코드를 참고하다 보니 그리 어렵지 않게 나만의 마크다운 블로그를 만들 수 있었다!

사실 궁극적으로 원하는 모습은 마크다운 파일 내에도 컴포넌트를 추가해 실제 페이지를 렌더링하는 것처럼 다양한 스타일링을 적용하는 것이었지만, 리액트 코드를 보아도 그 방식의 구현 난이도가 꽤 있어 보여 나중에 제대로 진행해보기로..!

> **이번 포스팅을 통해 배운 점**
> - `getStaticProps`를 사용해 정적 페이지를 생성하는 방법
> - `Static Generation`과 `Server-side Rendering`의 차이와 사용 시점
> - `remark`와 `rehype`를 활용해 마크다운 파일을 렌더링하는 법