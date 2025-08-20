---
title: 'Ping Request를 사용해 더 빠른 데이터 전송을 경험해보자'
summary: 'Ping Request를 활용한 이벤트 로직의 개선 (feat. sendBeacon)'
tags: ['FE', 'Network', 'Javascript']
date: '2024-02-25 22:00:00'
---

최근 사내 프로젝트를 진행하면서 `sendBeacon`이라는 메소드를 접하고 활용하게 되었다.
이 과정에서 비즈니스 로직의 개선을 이뤄낼 수 있었고, 그 과정을 이번 글에서 공유하고자 한다.

> **TL;DR**
> - Ping Request란?
> - `sendBeacon` 메소드 활용하기
> - `OPTIONS` request는 무엇인지 알아보고 이를 생략하는 방법에 대해 알아본다

---
## 이벤트 수집
현재 내가 개발중인 인포크링크는 사용자 누구나 원하는 링크를 추가하고, 이를 공유할 수 있는 링크 인 바이오 서비스이다. 많은 링크를 한 번에 관리할 수 있다는 점 덕분에, 많은 유저 분들이 우리의 링크를 인스타 바이오 링크에 추가해서 사용하고 있다.

또한, 인포크링크는 유료 플랜 사용자에 한해 링크별 클릭수를 집계하고 이를 제공하고 있다. 이를 통해 사용자는 자신의 링크가 얼마나 많이 클릭되었는지 확인할 수 있고, 이를 통해 더욱 효과적인 마케팅을 진행할 수 있다.

클릭수를 집계하는 이벤트의 자세한 로직을 설명할 수는 없지만 간단하게 설명하면 다음과 같다.
```markdown
// Event 발생 순서
1. 사용자 페이지 방문
2. 링크 클릭
3. 새 창 (target="blank")으로 링크를 열고 동시에 클릭 이벤트를 서버로 전송
4. 클릭 이벤트 집계 및 리다이렉션
```

## 인앱 브라우저(인스타)의 문제점
위에서 언급했듯 수많은 유저들은 인스타 바이오 링크를 통해 우리 서비스에 접근하게 된다.
즉, 인앱 브라우저에서 우리 서비스를 이용하게 되는데, **인앱 브라우저의 경우 새 창에서 링크가 열리지 않고 현재 창에서 링크가 열리지 않기 때문**에 다음과 같은 로직으로 이벤트를 발생시키게 된다.

```markdown
// 인앱 브라우저(인스타)에서의 Event 발생 순서
1. 사용자 페이지 방문
2. 링크 클릭
3. 클릭 이벤트를 서버로 전송
4. 클릭 이벤트가 완료되면 클릭한 링크로 리다이렉션
```

네트워크 환경이 문제가 없다면 위 로직은 전혀 문제가 되지 않지만, 만약 네트워크 환경이 느리거나 이벤트 집계 API에 문제가 생기는 경우 원하는 링크로 리다이렉션이 되지 않을 수 있고 이는 결국 서비스의 오류로 이어지게 된다.

## Ping Request
이에 대해 해결책을 고민하던 중, 다른 서비스는 이런 이벤트를 어떻게 처리하는지에 대한 궁금증이 생겨 링크트리의 이벤트 로직을 살펴보게 되었다.

![ping-request](https://github.com/gouz7514/hotdog-log/assets/41367134/5f311ce9-b716-4699-b914-c2c197d142e0)

링크트리도 우리와 마찬가지로 링크 클릭 시 이벤트 API를 호출하지만, 개발자 도구의 Network tab을 살펴보니 Fetch/XHR type이 아닌 Ping type으로 request를 요청하는 것을 확인할 수 있었다.

해서, ping request란 무엇인지, 왜 이 방식을 채택했는지에 대한 궁금증이 생겨 찾아본 결과 다음과 같은 자료를 찾을 수 있었다.

[StackOverflow - Type "ping" in network tab](https://stackoverflow.com/questions/75666416/type-ping-in-network-tab)
![ping request description](https://github.com/gouz7514/hotdog-log/assets/41367134/a9701cef-cc59-4f23-9a2d-f94a009939b1)

- `ping` request는 `navigator.sendBeacon`를 사용해 전송할 수 있다.
- 전통적으로 데이터를 보낼 때 사용하는 `XMLHttpRequest`의 문제점을 보완하기 위한 방법이다.

그렇다면 `sendBeacon` 메소드는 무엇일까?

### `sendBeacon()`
[MDN - Navigator: sendBeacon() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)

유저가 웹페이지를 이동하는 과정에 있어 서버로 데이터를 전송할 때 `XMLHttpRequest`를 사용하는 경우 데이터 전송의 완료를 보장하기 위해 다음과 같은 방식을 사용했어야 했다.
- Blocking하고 동기적인 `XMLHttpRequest` 호출을 통해 데이터를 전송한다
- `<img>`요소를 만들고 `src` 속성에 데이터를 포함한 URL을 설정하는 방식으로 데이터를 전송한다
- 혹은... 랜덤 시간의 루프를 통해 데이터를 전송한다

위 방식들은 모두 페이지 전환을 막기 때문에, 사용자에게 나쁜 경험을 제공하게 된다.
이를 해결하기 위해 `sendBeacon` 메소드를 활용할 수 있다.

`sendBeacon` 메소드는 적은 양의 데이터를 포함한 POST 요청을 비동기적으로 전송한다.
`sendBeacon` 메소드는 **전송하고자 하는 데이터가 성공적으로 queue에 추가되었는지 여부를 return**한다. 즉, 요청을 전송만 한다면 그 뒤 동작에 대해서는 신경쓰지 않는다.

위와 같은 이점을 지닌 `sendBeacon` 메소드를 활용한 우리의 이벤트 로직은 다음과 같이 개선할 수 있게 된다.
```markdown
1. 사용자 페이지 방문
2. 링크 클릭
3. 클릭 이벤트를 `sendBeacon` 메소드를 통해 서버로 전송
4. 유저는 클릭한 링크로 리다이렉션
5. 클릭 이벤트는 이미 전송되었기 때문에 서버에서 집계 완료
```

유저가 링크를 클릭함과 동시에 클릭 이벤트는 서버로 전송되고, 유저는 이 동작의 성공 여부와 관계없이 원하는 링크로 리다이렉션이 가능하게 된다.

## + `OPTIONS` request
url 또는 서버와 요청을 주고받는 경우 `OPTIONS` request가 발생하는 것을 확인할 수 있다.
이는 preflight request로, 실제 요청을 보내기 전에 서버가 요청을 받아들일 수 있는지 확인하는 요청이다.

`sendBeacon` 메소드도 결국은 `POST` request를 보내기 때문에, `OPTIONS` request가 발생하게 된다. 그러나 위 링크트리의 경우 `OPTIONS` request가 발생하지 않는 것을 확인할 수 있었다.

`OPTIONS` request를 발생시키지 않는다면 API 서버의 부하를 줄일 수 있지 않을까 하는 생각에 찾아본 결과 다음과 같은 해결책을 찾을 수 있었다.
- `GET`, `HEAD`, `POST` 요청 중 하나
- `Content-Type` 헤더가 `application/x-www-form-urlencoded`, `multipart/form-data`, `text/plain` 중 하나
- CORS-satisfied request-header로 명시된 헤더들만 포함된 경우

(출처 : [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests))

위 링크트리의 경우에도 `OPTIONS` request가 발생하지 않고 있으며, 아래 사진과 같이 Content-type이 `text/plain`으로 설정되어 있는 것을 확인할 수 있었다.
![linktree api content type as text/plain](https://github.com/gouz7514/hotdog-log/assets/41367134/0b5dc006-6c61-4f69-8962-0772cc290d45)

전체적인 API의 요청 수는 줄어들겠지만, 동시에 CORS 측면에 있어 일종의 안전 장치를 거치지 않는 것이기에 이 방식의 적용 여부는 신중히 결정해야 할 것 같다. 링크트리는 과연 어떤 이유로 이 방식을 채택한 것일까..

---
해결책은 생각보다 단순했지만 그 과정에서 배운 내용은 너무나도 새롭고 유용했다. 짧은 고민을 통해 나온 솔루션이 비즈니스 로직을 개선할 뿐더러 더 나은 사용자 경험을 제공할 수 있게 돼, 항상 목표로 하는 **불편함을 불편해하는 개발자**로 한 걸음 더 성장하게 된 것 같아 매우 홀가분하다.

> **이번 포스팅을 통해 배운 점**
> - ping request는 적은 양의 데이터를 전송하는데 사용할 수 있다.
> - `sendBeacon` 메소드를 활용해 ping request를 전송할 수 있다.
> - `OPTIONS` request는 preflight request이며, 원하는 경우 이를 생략할 수 있다.

---
**참고한 글들**
- [StackOverflow - Type "ping" in network tab](https://stackoverflow.com/questions/75666416/type-ping-in-network-tab)
- [MDN - Navigator: sendBeacon() method](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [MDN - CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#simple_requests)