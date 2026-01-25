---
title: 'Next.Js Cloudfront 비용 다이어트'
summary: '비용이 2배가 줄어든 게 아니라 2배가 늘었다?'
tags: ['AWS', 'FE', 'Next.Js', 'Productivity']
date: '2026-01-25 23:00:00'
---
최근 현재 회사에서 운영중인 서비스, 인포크링크의 제일 큰 업데이트가 진행됐다.
바로 디자인 설정 기능의 업데이트!
![inpocklink update](/images/blog/optimizing-cloudfront/inpocklink-design-edit-update.png)

프로덕트 면에 있어 다양한 기능 및 유저 편의성의 제공은 물론, 기술적으로도 기술 스택 migration (vue -> react)이 이루어져 배포 과정부터 다양한 이슈 해결 및 핫픽스, 안정성을 잡기 위한 작업이 진행됐다.

그렇게 몇 일이 지난 날, 슬랙에 올라온 한 메시지..
![cloudfront cost spike](/images/blog/optimizing-cloudfront/cloudfront-cost-spike.png)

구체적인 수치를 공유할 수는 없지만, 그냥 모든 수치가 최소 2배, 최대 4배 늘어난 상황이었다.
**일 단위로 부과되는 CloudFront (이하 CF) 비용은 무려 2.5배 증가한 상황...**
이대로 가다가는 진짜 큰일나겠다 싶어 바로 CF 비용 정상화 작업에 들어갔고, 이번 글에서는 그 과정에 대해서 공유하려고 한다.

> **TL;DR**
> - Barrel export에 대해서 알아보자
> - AWS CF 캐싱에 대해 알아보자
> - Next.Js의 public 경로와 캐싱에 대해 알아보자

---
## 0. 현재 상황 진단
가장 먼저 정확히 어떤 CF에서 비용이 많이 부과되는지 알기 위해 AWS CloudWatch에 현재 프로덕션에서 돌아가는 모든 CF를 한 눈에 모아볼 수 있는 대시보드를 만들었고, 대시보드에는 크게 아래 CF들이 포함되었다.
- migration 이전 Nuxt static asset CF
- migration 이후 Next.Js static asset CF
- 프로덕션에서 운영중인 ELB, S3와 연결된 CF

![cloudfront dashboard](/images/blog/optimizing-cloudfront/cloudfront-cloudwatch-dashboard.png)

위 사진에서 볼 수 있듯 Nuxt CF는 당연히 migration 이후 비용이 줄었고 (상단 2개 그래프), Next.js CF 그리고 ELB와 연결된 CF를 하나하나 파헤쳐보았다.

## 1. CloudFront 다이어트 - Next.Js static asset

### 1.1 원인 파악 - chunk 분석, network coverage 분석
실제 서비스 상에서 요청하는 Requests와 Data Transfer가 어느 정도인지 파악하기 위해 `@next/bundle-analyzer`를 사용해 chunk 분석을 진행했다. 서비스의 특성 상 특정 페이지 (크리에이터 각각의 프로필 페이지)에 트래픽이 집중되기 때문에 해당 페이지만을 대상으로 분석했다.

![chunk asis](/images/blog/optimizing-cloudfront/chunk-asis.png)
- gzip 기준 194.71kb
- admin, design-editor 와 같이 필요 없는 chunk도 함께 포함

chunk와 함께 chrome devtools를 활용해 CF에서 받아오는 chunk 파일의 사이즈와 coverage 체크도 진행헀다.
![network coverage asis](/images/blog/optimizing-cloudfront/network-coverage-asis.png)
- 전체 1.9MB 중 coverage 34%

[Next.js는 기본적으로 라우트 기반으로 코드 스플리팅](https://nextjs.org/learn/dashboard-app/navigating-between-pages#automatic-code-splitting-and-prefetching)을 지원하는데, 왜 이런 현상(사용하지 않는 chunk 요청)이 발생하는 걸까?

### 1.2 액션 - barrel export 제거하기
원인은 바로 barrel export에 있었다.
barrel export란 여러 파일을 하나의 진입점에서 한번에 export 하는 방식을 의미한다.
```typescript
// components/index.ts
export * from './Image'
export * from './Icon'

// 페이지 단에서 사용할 때
import { Image, Icon } from '@/components'
```
Javascript 표준 모듈 시스템인 ECMAScript Module (이하 ESM)에서는 깊이 우선 후위 순회(Depth-first post-order traversal) 방식으로 모듈을 탐색한다. ([참고 링크](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/)) 자식 노드를 먼저 평가하고 부모 노드를 마지막에 평가하기 때문에, barrel export를 사용하는 경우 결국 `components/index.ts` 파일에 선언된 export를 모두 평가하게 되는 것이다.

(실제로 [한 사용자](https://articles.wesionary.team/the-hidden-costs-of-barrel-files-25de560b9f63)는 barrel export 방식에서 direct import 방식으로 변경한 뒤 번들 사이즈가 `255kb`에서 `92.4kb`로 줄어들었다고도 한다.)

우리 코드에도 feature 단위로 코드는 잘 분리되어 있었지만, 공통 컴포넌트 등에서 barrel export를 사용하고 있었고, 이를 일부 제거하는 방식으로 수정을 진행하며 로컬에서 bundle analyze를 통해 번들 사이즈의 변화를 확인했다.

### 1.4 결과
barrel export 제거와 일부 컴포넌트에 dynamic import를 적용한 뒤 결과는 아래와 같다.
- **chunk 분석**
  - 사이즈 : `194.71kb -> 96.41kb` (51% 감소)
  - admin, design-editor와 같이 불필요한 chunk 제거
- **chrome devtools 분석**
  - 사이즈 : `1.9MB -> 1.3MB` (31% 감소)
  - coverage : `34% -> 38%` (11% 증가)

## 2. CloudFront 다이어트 - ELB
### 2.1 원인 파악 - CF 로그 파일 분석
어떤 요청이 ELB CF 비용 증가의 정확한 원인인지 파악하기 위해 일부 시간대의 CF 로그 파일을 GPT를 활용해 분석했고 그 결과는 아래와 같았다.

| 경로                                              | 요청 수  | BytesDownloaded |
|---------------------------------------------------|--------|----------------|
| /fonts/pretendard/Pretendard-Regular.woff2        | 38,775 | ~21.4 GB       |
| /fonts/pretendard/Pretendard-Bold.woff2           | 33,860 | ~19.7 GB       |
| /fonts/pretendard/Pretendard-SemiBold.woff2       | 33,549 | ~19.4 GB       |
| /fonts/pretendard/Pretendard-Medium.woff2         | 33,905 | ~19.3 GB       |
| /fonts/maruburi/MaruBuri-Regular.woff2            | 38,736 | ~12.1 GB       |
| ... | ... | ... |

폰트 파일이 원인일까 추측은 했으나 로그 분석을 통해 원인이 더욱 명확해졌다. 위에서 언급한 폰트 설정 기능을 위해 next.js의 public 디렉토리 내에 폰트 파일을 추가하고 `fonts.css` 파일을 통해 폰트를 불러오고 있는데, 이 부분에 최적화가 적용되지 않아 <span style="color:red"><b>*모든 페이지에서 모든 폰트를 요청하고 있는 상황*</b></span> 이었다.

### 2.2 액션 1) - CF 경로에 캐싱 적용
가장 먼저 CF의 경로 기반 캐싱을 적용했다. CF에는 경로 별로 원본(S3, ELB 등), 원본 정책, 캐시 정책 등을 지정할 수 있는데 이를 활용해 `/fonts/*` 경로에 1년짜리 캐시 정책을 적용했다.

이를 통해 문제가 해결될 줄 알았으나 CF의 Requests, BytesDownloaded 수는 전혀 개선되지 않았는데 사실 이 부분은 우리가 잘못 짚고 넘어간 부분이었다. CF에 캐싱을 적용해도 `Origin -> CF` 의 요청만 줄어들 뿐 (= Origin의 부하만 줄어들 뿐), `CF -> 사용자` 의 요청은 변함이 없기 때문에 비용은 전혀 개선되지 않았던 것이었다.

### 2.2 액션 2) - 외부 CDN 사용
그 다음으로 생각한 해결책이 외부 CDN을 사용하는 것이었다. 눈누와 같은 외부 CDN을 사용할 경우 비용 부담은 아예 줄어들 수 있다는 장점이 있어 고려했으나, 동료 개발자와 논의 끝에 "제어가 불가능한 점", "핵심 비즈니스 로직에 부담이 생기는 점" 등 여러 이슈가 있어 해당 액션은 적용하지 않았다.

### 2.2 액션 3) - next.config.js 에 캐시 적용
결국 코드나 인프라 단에서 폰트 파일 요청을 어떻게든 줄여야 하는 상황이 되었고, GPT와 함께 열심히 씨름하던 중 이상한 부분을 하나 발견했다.
Network 탭에서 폰트 파일이 캐싱은 적용되었다고 나오지만, 실제 헤더를 살펴보면 `max-age=0` 과 같이 전혀 캐싱이 적용되지 않은 채 오고 있던 것.

이 부분이 아무리 생각해도 의심쩍어 리서치를 한 끝에 그동안 몰랐던 사실을 하나 발견했다.
[Next.js 공식 문서 : public Folder - Caching](https://nextjs.org/docs/pages/api-reference/file-conventions/public-folder#caching)
> Next.js cannot safely cache assets in the public folder because they may change.
> The default caching headers applied are:
> `Cache-Control: public, max-age=0`

Next.js는 기본적으로 public 디렉토리 내의 파일에 캐싱을 적용하지 않아 브라우저가 이를 매번 재확인하고 있던 것이었다.
이를 해결하기 위해 `next.config.js` 내에 폰트 파일에 대해 명시적으로 캐시를 적용했다.
```javascript
// next.config.js
async headers() {
  return [
    {
      source: '/fonts/:path*',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ];
},
```
<figure>
  <img src="/images/blog/optimizing-cloudfront/cached-font.png" alt="cached font">
  <figcaption>폰트 헤더에 캐싱이 적용된 모습</figcaption>
</figure>

### 2.2 액션 4) - 폰트 다이나믹 로드
캐싱은 적용되었으나 아직 근본적인 문제, <span style="color:red"><b>*모든 페이지에서 모든 폰트를 요청하고 있는 상황*</b></span>은 해결되지 않은 상황.

이를 해결하기 위해 기존의 `fonts.css` 파일을 분리하고, 필요한 폰트만 불러오는 방식으로 코드를 수정했다.
**AS_IS**
```css
@font-face {
  font-family: 'Pretendard';
  src: url('/fonts/pretendard/Pretendard-Regular.woff2') format('woff2');
}
... 이외 많은 폰트들
```
**TO_BE**
```css
@import url('./pretendard.css');
```
<br />

```typescript
// FontLoader.tsx : 필요한 폰트만 불러와 동적으로 로드
export function FontLoader({ fontKey }: FontLoaderProps) {
  const config = getFontConfig(fontKey);

  return (
    <Head>
      <link rel="stylesheet" href={config.cssUrl} />
    </Head>
  );
}
```

### 2.3 결과
<figure>
  <img src="/images/blog/optimizing-cloudfront/cloudfront-result.png" alt="cached font">
  <figcaption>CF requests, BytesDownloaded 개선 결과 (Cloudwatch)</figcaption>
</figure>

최적화 작업을 통해 업데이트로 인해 발생한 **비용 spike 문제를 모두 해결**했으며, 이전 대비 **클라이언트 CF 비용 소폭 감축 (10 ~ 20%)** 을 달성할 수 있었다.

무엇보다 이 참에 클라이언트에서 사용하는 모든 CF를 모니터링하는 **대시보드를 구축**하게 되어 이제는 출근하자마자 들여다보는 습관이 생겼다.

---
## 3. 결론
물론 앞으로 해결해야 할 문제는 아직도 많이 남아있다.
- 디자인 시스템 최적화를 통한 bundle 경량화
- CF request 줄이기 (Requests와 BytesDownloaded 모두 비용에 영향을 미치지만 Requests가 미치는 영향이 더 크다)

그렇지만 원인 파악 → 다양한 해결책 적용 → 결과 까지 이어지는 평소 내가 즐겨하는 **"먼저, 그리고 끝까지 불편해하기"** 정신을 오랜만에 발휘할 수 있어 개인적으로 매우 뿌듯한 시간이었다.
