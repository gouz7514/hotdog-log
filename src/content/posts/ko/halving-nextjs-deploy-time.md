---
title: 'Next.js 배포 시간 깎기'
summary: 'yarn berry와 standalone을 활용해 배포 시간 단축시키기'
tags: ['Next.Js', 'Docker', 'ABZ Inc.']
date: '2025-08-10 23:00:00'
---
**“방금 수정했고, n분 뒤에 실서버 반영 예정입니다!”**

다양한 프로덕트를 빠른 시간 안에 개발하다 보니 개발 서버, 실서버에 배포를 하게 되는 일이 이전보다 훨씬 잦아졌습니다. QA를 진행하고, 핫픽스를 올리고, 실서버에 배포하고…

여느 날과 마찬가지로 배포를 열심히 돌리던 와중 아무 이상이 없음에도 **github action이 돌지 않는 현상**이 발생했습니다. 원인이 무엇인가 하고 찾아보니, github action에 할당되어 있는 budget이 초과해서 더 이상 action을 돌릴 수가 없는 상황이었습니다. budget은 매 달 초기화되는데 이 이슈가 발생한 게 25일이었으니 꽤나 심각한 이슈…

다행히 기존에 그리 높지 않은 budget이 할당되어 있어서 이를 늘리는 것으로 해결했지만, 하루빨리 이 이슈를 해결해야 하는 상황이었습니다. 적게는 3분, 많게는 5분 넘게 걸리는 배포(github action만, codedeploy까지 포함하면 거의 10분)시간도 문제인데 배포를 할 수조차 없는 상황이라면..?

하루빨리 이 문제를 해결하기 위해 최근 가장 활발하게 개발 & 배포가 이루어지는 Next.js 서비스부터 배포 시간을 줄여나가기로 결정했습니다. **이번 글에서는 Next.js와 Docker 그리고 codedeploy 환경에서 배포 시간을 줄여 나가는 과정을 기록해보려고 해요.**

> #### TL;DR
> - Next.js와 Yarn 환경에서 진행했어요
> - Yarn Berry와 Zero Install을 어떻게 활용했는지에 대해 다루고 있어요
> - Next.js의 standalone 옵션에 대해 다루고 있어요
> - Docker와 ECS 환경에서의 고민에 대해 다루고 있어요

---
## 0. 현재 상황 진단
가장 먼저 해야 할 액션은 현재 아키텍쳐와 배포 파이프라인에 대해 파악하는 것.

그림으로 간단하게 나타내면 다음과 같아요.
![Nextjs Project Architecture](/images/blog/halving-nextjs-deploy-time/nextjs-architecture.jpeg)

- Next.js 프로젝트를 docker로 빌드
- 빌드된 이미지를 AWS ECR에 업로드
- ECS와 Codedeploy를 활용해 유저에게 무중단 서비스 제공

여기서 제일 많은 시간이 소요되는 곳은 크게 두 군데에요.

- **Github Action** : Next.js 프로젝트를 Docker 이미지로 빌드하고, 이를 AWS ECR에 업로드
- **CodeDeploy** : ECR에 업로드된 이미지를 바탕으로 ECS Task, Service를 만들고 target group에 배포

Next.js와 Yarn으로 개발된 프로젝트였기에 이 환경에서 배포 시간을 줄일 수 있는 액션을 찾아보았고, Yarn Berry와 Zero Install에 대해 리서치를 진행했습니다.

## 1. Yarn Berry & PnP 개념 이해
Yarn Berry가 무엇이고 왜 등장했는지, 같이 등장하는 PnP(Plug’n’Play)에 대해서도 간단하게 짚고 넘어가볼게요.

### 1-1. Yarn Berry?
Yarn Berry라는 이름은 Yarn v2 이후의 버전 전체를 지칭하는 별명입니다.

Yarn Berry는 기존 패키지 관리 생태계(npm, yarn v1)를 개선하기 위해 즉, 느리고, 비효율적이고, 불안정한 `node_modules` 구조를 개선하기 위해 등장했습니다.

![node_modules blakchole](https://preview.redd.it/tfugj4n3l6ez.png?auto=webp&s=b8163176d8482d5e78ac631e16b7973a52e3b188)

긴 말이 필요없을 듯 해요.

프로젝트마다 같은 패키지가 중복 설치되고, 패키지를 찾기 위해 상위 디렉토리의 `node_modules`를 탐색하고..
특정 패키지를 찾지 못할수록 readdir, stat과 같은 I/O 호출이 반복되고..

심지어 패키지를 찾는 과정에서 상위 디렉토리의 환경이 달라지면 어쩔 때는 의존성을 불러올 수 있고, 어쩔 때는 불러올 수 없는 난감한 상황이 종종 발생하기도 합니다. 이런 상황을 해결하기 위해 Yarn Berry는 PnP라는 전략을 활용합니다.

### 1-2. PnP(Plug’n’Play)
[Plug'n'Play | Yarn](https://yarnpkg.com/features/pnp)
공식 문서의 설명에 따르면 다음과 같아요.
> Yarn PnP는 현재 Yarn에서 채택하고 있는 기본 설치 전략으로, `node_modules` 설치 방식, symlink 기반 방식을 대체 가능한 개선된 전략이다.

PnP는 `node_modules` 폴더를 만들지 않고, `.yarn/cache` 폴더에 의존성의 정보를 저장합니다.
동시에 `.pnp.cjs` 파일에 “의존성 → 저장 위치” 매핑 정보를 기록해, 특정 의존성 호출 시 이 매핑을 참고해 실제 패키지 파일을 찾을 수 있도록 합니다. 이 때 각 패키지를 압축 파일 형태로 저장하는데 매번 압축 해제를 할 수 없기 때문에 ZipFS라는 시스템을 사용합니다.

> #### ❓ ZipFS (Zip File System)
> - zip 파일을 가상 경로로 직접 읽는 파일 시스템
> -  zip 아카이브로 의존성을 관리하면 다음과 같은 장점을 지녀요.
>     1. 더 이상 `node_modules` 디렉토리 구조를 생성할 필요가 없기 때문에 설치가 신속히 완료됨
>     2. 각 패키지는 버전마다 하나의 zip 아카이브를 가지기 때문에 중복 설치되지 않음
>     3. 의존성을 구성하는 파일의 수가 많지 않으므로, 변경 사항을 감지하거나 전체 의존성 삭제하는 작업이 빠름

## 2. Yarn Berry 적용하기
Yarn Berry와 PnP가 무엇인지 알았으니, 이제 실제로 적용해볼 차례입니다.

### 2-1. yarn berry 초기화
yarn berry 초기화를 위해 다음 커맨드를 실행합니다.

```bash
yarn set version berry
```

실행하고 나면 의존성 정보를 기록한 `.pnp.cjs` 파일이 생성돼요.

이후 해당 프로젝트에서 PnP 사용을 위해 [`.yarnrc.yml` 설정](https://yarnpkg.com/configuration/yarnrc)을 진행합니다.

```yaml
nodeLinker: pnp
pnpEnableEsmLoader: true
enableGlobalCache: false
checksumBehavior: update
enableStrictSsl: true
yarnPath: .yarn/releases/yarn-4.9.2.cjs
```

### 2-2. 의존성 설치

```bash
# 1. yarn 캐시 제거
yarn cache clean

# 2. 모든 설치 흔적 제거
rm -rf node_modules .yarn/cache

# 3. 재설치
yarn install
```

PnP 환경에서 의존성을 설치하면 `node_modules` 가 아닌 `.yarn/cache` 디렉토리에 의존성의 정보가 저장되는 것을 확인할 수 있어요.

![yarn cache](/images/blog/halving-nextjs-deploy-time/yarn-cache.png)

### 2-3. gitignore (with or without zero install)

PnP 환경에 맞는 `.gitignore` 설정을 진행합니다. 이 부분은 [공식 문서](https://yarnpkg.com/getting-started/qa#which-files-should-be-gitignored)에 잘 설명이 되어 있어서 그대로 따라 해도 무방해요. zero-install은 단어 그대로 설치를 하지 않는, 여기서는 의존성을 설치하지 않는다는 것을 의미합니다. 이에 대해서는 뒤에서 좀 더 자세히 설명할게요.

```bash
# zero-install O
.yarn/*
!.yarn/cache
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# zero-install X
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
```

### 2-4. IDE 플러그인 설치

PnP 모드에서는 패키지를 zip 형태로 관리하기 때문에, zip에 저장된 파일들을 바로 읽을 수 있도록 설정을 진행해줘야 합니다. 이를 위해 ZipFS 플러그인을 설치하고, 패키지를 인식할 수 있도록 SDK 파일을 생성하는 명령어를 입력하면 됩니다.

![ZipFS](/images/blog/halving-nextjs-deploy-time/ZipFS.png)
<br />
```bash
yarn dlx @yarnpkg/sdks vscode
```

## 3. zero install 전략, 그리고 채택하지 않은 이유

위에서 잠깐 언급한 zero install 전략은 의존성을 매번 설치하는 방식이 아닌, git 등을 활용해 버전 관리를 하는 전략을 말합니다.. 잘 구성된 zero install 환경에서는 어떤 개발자라도 git pull 만 수행하면 별도의 설치 과정 없이 프로젝트를 실행할 수 있게 되는 거죠.

이런 이점을 적용하고 싶어서 zero install 설정, 즉 모든 의존성 압축 파일을 git에 올리는 방식을 검토했으나 크게 다음과 같은 이유로 채택하지 않게 되었어요.

### 3-1. 그럼에도 큰 의존성 파일

![still large zipfs](/images/blog/halving-nextjs-deploy-time/large-zipfs.png)

전체 의존성 크기는 줄었지만 그럼에도 특정 의존성 압축 파일의 용량이 100MB를 초과하는 경우가 있었습니다.

100MB가 넘는 파일을 git을 통해 관리하려면 [Git LFS](https://docs.github.com/ko/repositories/working-with-files/managing-large-files/configuring-git-large-file-storage)를 따로 구성해줘야 하고 (그것도 모든 개발자가), 이런 의존성 파일이 많아지게 될 경우 pull, push 과정에서도 시간이 많이 소요됩니다.

### 3-2. 얼마 걸리지 않는 `yarn install`

zero-install을 채택하지 않은 궁극적 이유입니다. 로컬에서 yarn install을 돌려도 아무리 길어야 10초가 걸리지 않아서 zero-install을 굳이 적용하지 않아도 되겠다는 결론을 내렸습니다.

물론 zero-install은 정말 좋은 기능이에요. 누구나 같은 환경에서 프로젝트를 실행할 수 있도록 해주니 말이죠.
그렇지만 어디까지나 optional한 기능입니다. 무조건 옳은 방식도 아닌, 적용하지 않았다고 큰 단점이 있는 것도 아니니 크게 걱정하지 않아도 됩니다.

(관련해서 진행된 열띤 논의 [#1](https://github.com/yarnpkg/berry/issues/180), [#2](https://github.com/yarnpkg/berry/discussions/4845))

## 4. Next.js와 Docker 최적화

### 4-1. Next.js standalone

위에서 언급한 것처럼 현재 배포 시간이 많이 소요되는 곳은 Github Action 그리고 CodeDeploy 입니다. 여기서 CodeDeploy는 빌드된 docker 이미지를 가지고 서비스를 실제로 배포하는 과정인데 이 이미지의 용량에 비례해서 소요 시간이 늘어나게 됩니다.

이를 해결하기 위해 Next.js에서 제공하는 standalone 옵션을 적용했어요.

standalone 옵션은 이름 그대로 (독립적, 독립형) 추가적인 종속성 설치 없이 단독으로 애플리케이션이 실행되도록 합니다. `.next/standalone` 폴더 내에 최소한의 종속성과 서버를 구동시키기 위한 파일만을 포함시키는 방식으로요.

### 4-2. Docker에서 PnP 대신 `node_modules`를 사용한 이유

**Next.js의 standalone + PnP** 라는 조합을 완성하고 싶었지만 Docker 환경에서는 결국 `node_modules`를 채택하게 되었습니다.

`.yarnrc.docker.yml` : docker 환경에서 `.yarnrc.yml` 대신 사용
```yaml
nodeLinker: node-modules
enableGlobalCache: false
checksumBehavior: update
enableStrictSsl: false
yarnPath: .yarn/releases/yarn-4.9.2.cjs
```

standalone 옵션은 실제 파일 경로를 추적하며 필요한 것만 복사하는데, PnP는 ZipFS 위의 가상 경로를 추적하기 때문에 런타임에서 의존성 추적에 실패하는 이슈가 발생했습니다. 즉 standalone 옵션은 PnP와 함께 동작할 수 없는 옵션인 셈이죠. ([Github Discussions: outputStandalone not working with Yarn PnP](https://github.com/vercel/next.js/discussions/34600?utm_source=chatgpt.com))**

Next.js의 차세대 빌드 시스템인 [Turbopack 문서](https://nextjs.org/docs/app/api-reference/turbopack#unsupported-and-unplanned-features)에도 Yarn PnP는 지원 계획이 없다고 하니 두 옵션을 한번에 활용하기는 힘들어 보입니다.

### 4-3. 멀티 스테이지 Dockerfile

기존에 싱글 스테이지로만 구성되어 있던 Dockerfile을 멀티 스테이지 구조로 수정했습니다.

이를 통해 실제 런타임에 필요한 리소스를 최종 이미지에 포함시켜 훨씬 가벼운 Docker 이미지를 빌드할 수 있었어요

---

## 결론

Yarn PnP와 Next.js의 stnadalone 옵션을 도입해 다음과 같은 결과를 달성했습니다.

![image.png](/images/blog/halving-nextjs-deploy-time/result-1.png)
![image2.png](/images/blog/halving-nextjs-deploy-time/result-2.png)

- **github action 시간 50% 단축 (약 6분 → 3분)**
- **ECS 이미지 용량 90% 감축 (800MB ~ 1GB → 50MB)**
- **AWS Codedeploy 시간 30% 단축 (약 3분 → 2분)**
- **총 배포 시간 50% 단축 (총 10분 → 총 5분)**

단순히 기능을 개발하는 것을 넘어, 현재 활용하고 있는 인프라에 대해 더욱 깊이 고민하고 개선할 수 있는 기회였어요. 동시에 해당 내용을 팀과 공유를 통해 같이 한걸음 더 성장할 수 있었습니다.

결과에 있어서도 배포 시간의 획기적인 단축을 통해 팀 전체의 생산성 향상에 기여할 수 있게 되어 큰 보람을 느낀 기회였습니다.

---
### 참고한 자료들
- [node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)
- [Yarn 공식 문서](https://yarnpkg.com/)
- [yarn berry는 4가 되었고 zeroinstall 은 못생겼다.](https://xionwcfm.tistory.com/452)