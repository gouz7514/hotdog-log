---
title: '사내 FE 공용 로거 만들기'
summary: '우리 서비스의 문제는 우리가 먼저 알아야 한다'
tags: ['AWS', 'FE', 'Productivity']
date: '2026-06-09 00:00:00'
---
여러 서비스를 개발하며 항상 달성하고자 하는 목표가 있었습니다.

**“우리 서비스의 문제는 우리가 먼저 알아야 한다”**

센트리, 데이터독같은 외부 툴도 사용해봤지만 비용 등 여러 오버헤드가 존재해 AWS Cloudwatch 와 슬랙을 활용해 모니터링을 하고 있었는데요, 이러한 방식에는 다음과 같은 문제점이 존재했습니다.

문제 1) 표준 부재

- 어떤 로그가 Cloudwatch로 찍히는지 표준이 정해져있지 않다
- 어떤 로그가, 왜, 어떻게 찍히는지 아무도 모른다

문제 2) 멀티라인

- ECS task의 awslogs 드라이버가 stdout/stderr를 그대로 Cloudwatch로 보내는 구조에서, 줄바꿈이 들어간 로그가 Cloudwatch에서 멀티라인 이벤트로 쪼개짐
- 하나의 로그가 줄바꿈 수만큼 분해되어 가독성 저하 및 필터링 ⋅ 검색 불가

“모든 서비스가 하나의 로거를 통해 로그를 수집하도록 하자”는 목표 아래 프로젝트를 시작했고, 그 과정에서 했던 고민과 생각을 담아보려고 합니다.

> **TL;DR**
> 구조화된 로그 메시지를 설계하고,
모든 서비스에서 최소한의 오버헤드로 활용 가능한 공용 로거를 구현합니다.

---
## 1. 라이브러리 선택
본격적인 구축에 앞서 로깅에 사용할 라이브러리를 선택했습니다.
브라우저는 물론 서버 사이드에서도 사용 가능한 로거를 구축하고자 했고 JS 생태계에서 자주 언급되는 4가지 라이브러리를 비교했습니다.

| 후보 | 장점 | 단점 |
|---|---|---|
| consola | 보기 좋은 로그 메시지 (pretty log)<br>우수한 DX | 구조화된 로깅에 약함<br>운영 로그 파이프라인 측면에서 애매 |
| pino | 매우 빠름<br>한 줄 JSON 출력 기본<br>공식적으로 browser 옵션 제공 | 일부 옵션 학습 필요 |
| winston | transport를 통해 file, DB 등에 저장 용이<br>format combine 통해 출력 형태 정의 가능 | 브라우저 친화적이지 않음<br>속도 느림 |
| loglevel | 매우 가볍고 단순<br>console wrapper에 적합 | 구조화된 로깅에 약함<br>transport / context 기능 부족 |

<figure>
  <img src="/images/blog/logger-for-fe/logger-npm-trend.png" alt="logger npm trend" />
  <figcaption>출처 : npm trend</figcaption>
</figure>

npm trend 상으로 consola가 앞서지만, JSON 출력을 기본으로 하고 node.js 기반이면서 브라우저 옵션을 제공하는 pino를 선택했습니다.

## 2. 로그 메시지 설계
로깅 도구를 선택했으니 이제 보고자 하는 로그 메시지의 구조를 설계할 차례!

최초에는 유저가 어디서(Where) 어떤 동작(What)을 했는지를 상하 관계로 포함하는 breadcrumb같은 구조를 고민했으나
<figure>
  <img src="/images/blog/logger-for-fe/logger-message-anatomy.png" alt="logger message anatomy" />
  <figcaption>출처 : https://velog.io/@moreso/data-event-design-for-frontend</figcaption>
</figure>

유저의 행동 데이터, 퍼널 등을 파악하는 게 목적이라면 유효하겠지만, 최초 목표로 한 에러와 같이 특정 상황만 보기 위해서는 필요 이상으로 복잡하다는 생각이 들어 최종적으로는 “로그명(과 필요하다면 로그 메시지)”만 선언하는 구조로 구현했습니다.

아래는 실제 로그 메시지에 포함되는 property와 각 property에 대한 설명입니다.

| 키 | 설명 | 예시 |
| --- | --- | --- |
| logName | 로그명 | axios.response.error |
| logMessage | 로그에 실을 메시지 | failed to fetch profile for user |
| username | 인포크 username | hakjae |
| logLevel | 로그 레벨
(프로덕션에서는 error만 찍기) | error / info |
| logService | 서비스명 | business |
| logEnvironment | 환경변수의 NODE_ENV | production |
| logStage | 배포 환경 | production |
| runtime | 서비스 런타임 | node / browser |
| version | 서비스 버전 | 2.14.1 |
| logPath | 로그 발생 경로 | /admin/deal/chat |
| logSource | 브라우저 로그 식별용 | browser |
| error | Error 인스턴스 자동 직렬화 | { type, message, stack, status, url, method, data } |

위 property 중 logName, logMessage, username을 제외한 모든 값은 로거를 호출하는 서비스가 아닌 로거 자체에서 파악하는 구조를 그린 뒤 실제 구현을 진행했습니다.

## 3. 구현
먼저 초기 단계에 구현한 로거 코드와 주요 옵션을 함께 살펴볼게요.
```typescript
// FE 모노레포 내 package 디렉토리에 구현
// packages/logger/src/index.ts
const baseOptions: LoggerOptions = {
  level: process.env.LOG_LEVEL ?? defaultLevel,
  messageKey: '__noop_msg__',
  errorKey: '__noop_err__',
  base: {
    logService: process.env.LOG_SERVICE,
    logEnvironment: process.env.NODE_ENV,
    logStage: process.env.STAGE,
    version: process.env.APP_VERSION,
    runtime: typeof window === 'undefined' ? 'node' : 'browser',
  },
  redact: { paths: REDACT_PATHS, censor: '***REDACTED***' },
  formatters: { level: (label) => ({ logLevel: label }) },
  timestamp: false,
  browser: {
    asObject: true,
    transmit: {
      level: 'debug',
      send: (level, logEvent) => {
        if (process.env.STAGE === 'production') return;
        const messages = logEvent.messages ?? [];
        const ctxObj = (messages.find((m) => typeof m === 'object' && m !== null) ?? {}) as Record<
          string,
          unknown
        >;
        const bindings = (logEvent.bindings ?? []).reduce<Record<string, unknown>>(
          (acc, b) => ({ ...acc, ...b }),
          {},
        );
        const payload = JSON.stringify({
          level,
          ctx: { ...bindings, ...ctxObj },
        });
        try {
          const blob = new Blob([payload], { type: 'application/json' });
          if (navigator.sendBeacon?.('/api/log', blob)) return;
        } catch {
          // sendBeacon 미지원/실패 → fetch fallback
        }
        fetch('/api/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {
          // 검증 도구가 사용자 화면에 에러 띄우면 안 됨
        });
      },
    },
  },
};
```

<br />

- **redact** ([공식 문서](https://github.com/pinojs/pino/blob/main/docs/redaction.md))
  - redact는 문서나 데이터에서 기밀, 사생활, 혹은 민감한 정보를 검열 ⋅ 삭제 한다는 뜻으로 마스킹 행위를 의미하기도 합니다. 사전적 정의 그대로 해당 옵션은 로그에 드러나면 안되는 민감한 정보(ex : 토큰, secret 등)를 마스킹해야 할 경우 사용합니다.
- **browser** ([공식 문서](https://github.com/pinojs/pino/blob/main/docs/browser.md))
    - browser 옵션은 pino 가 브라우저 단에서 어떻게 동작할지 지정하는 옵션입니다. pino는 Node.js 스타일 코드를 브라우저에서도 실행 가능하게 변환해주는 번들링 도구인 `browserify`와 호환을 통해 브라우저에서도 사용이 가능합니다.
    - Next.js 기반의 서비스에서 로거를 구현했기에 api router를 통해 로그를 발생시키도록 구현했습니다. transmit 옵션 내에 `sendBeacon` API를 활용해 `/api/log` 경로로 로그를 발생시키도록 하고, 각 서비스 내에 `/api/log` 라우트를 구현했습니다.

<br />
<br />

### 유저 식별 정보 추가하기

또한, 로그를 발생시킨 유저를 빠르게 파악하고 바로 CS, 버그 해결로 이어져야 하기 때문에 이미 마스킹된 민감한 정보 외에 유저 식별 정보를 추가하도록 구현했습니다.

로그를 발생시킬 때마다 일일이 유저 식별 정보를 추가하는 비효율적인 방식 대신, `_app.tsx`  에서 logger에 유저 식별 정보인 `username`을 한 번만 추가하는 방식으로 구현했는데요. `username`을 property에 추가만 하면 될 줄 알았지만, 아래와 같은 문제점이 존재했습니다.

**브라우저의 경우**
- 사용자별로 별도 JS process
- hydration 과정에서 property에 username 추가만 하면 됨

```typescript
// packages/logger/src/index.ts
let properties: Record<string, unknown> = {};

export function setLogProperty(bindings: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  properties = { ...properties, ...bindings };
}

// 서비스 내 _app.tsx의 hydration 코드 내에서
useEffect(() => {
  setLogProperty({ username: user?.username });
}, [user]);
```

**하지만 서버의 경우**
- 서비스가 돌아가는 ECS Fargate는 Node.js 기반
- 즉 서버에서 호출되는 로거는 Node 상에서 호출됨
- Node.js의 module은 process당 한 번만 로드되고, 모든 request가 해당 process를 공유함
- 브라우저처럼 property에 단순 추가하는 경우 로그 간 username 뒤섞일 수 있음

때문에 서버 사이드에서는로거에 유저 식별 정보를 추가하고 이를 비동기 작업 전반에 걸쳐 유지할 필요가 발생하게 됩니다.

Node.js에는 이 동작을 가능하게 해주는 `AsyncLocalStorage` API가 존재합니다. ([공식 문서](https://nodejs.org/api/async_context.html#class-asynclocalstorage))
설명에 따르면 다음과 같아요.
> “This class creates stores that stay coherent through asynchronous operations.”
즉, “비동기 작업 전반에서도 일관되게 유지되는 저장소를 만든다”

이를 활용해 아래와 같이 로거 내에서 AsyncLocalStroage 클래스를 가져와 인스턴스를 생성하고, 필요한 로그 property를 넘겨 로거가 실행되도록 했습니다.

```typescript
// packages/logger/src/index.ts
let asyncLocalStorage: AsyncLocalStorageLike | null = null;

if (typeof window === 'undefined') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-implied-eval
    const nodeRequire = eval('require') as NodeRequire;
    const { AsyncLocalStorage } = nodeRequire('node:async_hooks') as {
      AsyncLocalStorage: new () => AsyncLocalStorageLike;
    };
    asyncLocalStorage = new AsyncLocalStorage();
  } catch {
    // edge runtime 등 async_hooks 미지원 환경
    asyncLocalStorage = null;
  }
}

export function runWithLogContext<T>(bindings: Record<string, unknown>, fn: () => T): T {
  if (!asyncLocalStorage) return fn();
  return asyncLocalStorage.run({ ...bindings }, fn);
}

// 서비스 내 _app.tsx
MyApp.getInitialProps = async (appContext: AppContext) => {
  ...
  return runWithLogContext(
    // 필요한 property와 함수를 넘겨 로거가 실행되게 함
  )
}
```

<br />

와! 이제 로거 패키지를 설치하고 /api/log 경로만 선언하면 원하는 형태의 로그를 어디서나 발생시킬 수 있는 구조가 되었습니다.

하지만...

api router 방식은 너무나 프레임워크 종속적이며 각 서비스가 요청을 받아내는 구조가 되어 안정적이지 못했고, 로거를 연동하는 개발자가 매번 `/api/log` 경로를 선언해야 한다는 점에서 최초 목표로 한 “최소한의 오버헤드로 활용 가능한 로거”를 만족시키지 못한다는 문제가 존재합니다.

이를 해결하기 위해 한단계 더 진화한 아키텍처를 그리게 되었습니다.

## 4. 서버리스 아키텍처 구현과 패키지화
아키텍처의 요구 사항은 다음과 같이 정의했습니다.

- 상시 돌아가는 서버가 아닌 서버리스로 구현한다
- 로그 이벤트를 받을 수 있는 엔드포인트가 존재해야 한다
- AWS 콘솔에서 수동으로 관리하지 않는, 코드로 관리하는 아키텍처를 만든다
![logger architecture](/images/blog/logger-for-fe/logger-architecture.png)

- 로거는 람다로 배포해 서버리스 환경을 구현한 뒤
- API Gateway와 Route53을 활용해 엔드포인트를 생성하고
- 이 모든 과정을 콘솔에서 수동이 아닌 터미널에서 AWS CDK를 활용해 관리하고 배포되도록

또한 로거는 사내 패키지로 배포해 각 서비스에서 install 후 아래와 같이 호출만 하면 서비스 별로 지정된 CloudWatch Log group에 로그가 쌓이도록 구현했습니다.

```typescript
// services/A/env.production
NEXT_PUBLIC_LOG_ENDPOINT="로그_엔드포인트"

// service/A/src/pages/_app.tsx
import { configureLogger } from '@inpock/logger';

configureLogger({ endpoint: `${process.env.NEXT_PUBLIC_LOG_ENDPOINT}?service=A` });

// services/A/src/특정_페이지.tsx
import { logger } from '@inpock/logger';

logger.error('특정_에러_메시지', { error });
```

## 5. 결과
이제 완성된 로거의 결과물이 어떤지 확인해볼게요.
![log message asis](/images/blog/logger-for-fe/log-message-asis.png)
로거 구축 전 위와 같이 같은 시간대 로그가 무분별하게 쌓이고 있었다면

![log message to be](/images/blog/logger-for-fe/log-message-tobe.png)
이제는 한 로그의 모든 문맥이 하나의 메시지로 잘 쌓이는 것을 확인할 수 있게 되었습니다.

이제 사내 모든 개발자는 로거를 연동하고 원하는 곳에 로깅을 심고 “누구보다 서비스의 문제를 가장 먼저 파악하고 해결할 수 있게” 되었습니다.

---

![logger-testimonial](/images/blog/logger-for-fe/logger-testimonial.png)

프로덕션 배포 전 공유드린 팀원에게 긍정적인 평가를 받을 뿐더러, 차츰 서비스 단에서 로깅을 통해 문제를 파악하고 해결해 나가는 스스로를 보며 미약하게나마 만들어보길 잘했구나 생각이 들었습니다.

아직 FE단에서만 활용 가능한 로거지만 더 나아가 BE에서도 사용 가능한 로거가 되기를 바라며 글을 마무리해봅니다.