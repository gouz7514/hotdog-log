---
title: 'Cursor 0.50 changelog'
summary: 'AI 시대를 거쳐가는 개발자를 위한 Cursor 0.50 changelog'
tags: ['AI']
date: '2025-05-18 19:00:00'
---

### We are goint to be AI first

평소 가장 즐겨 사용하는 앱 중 하나인 듀오링고의 CEO가 전사 이메일을 통해 밝힌 내용이다. ([링크](https://www.linkedin.com/posts/duolingo_below-is-an-all-hands-email-from-our-activity-7322560534824865792-l9vh?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEKLTvsB-PmtVOClCaU8HcMHmXT-4d8leSw))
회사는 “AI-first” 조직으로 전환될 것이며, AI 활용이 채용과 평가 기준에 포함될 예정이라는 것.

개발자로 일하면서 나를 도와주는 AI 도구들(github copilot, cursor 등)을 초기에 사용했을 때 느낀 점은 말 그대로 “나를 도와줄 수 있구나” 하는 느낌이었다.

그러나, 불과 몇년 새 그 도구들은 “나 대신 일을 할 수 있네?” 라는 느낌을 주게 되었다.
그도 그럴것이, context와 코드 몇 줄 던져주고 화장실 다녀오면 알아서 구현을 해 놓으니..

AI가 나를 대체할 수 있겠다 하는 두려움도 없진 않지만, 그것보다 **AI를 더 잘 활용해서 스스로 더 뛰어난, 팀에서 필요한 개발자가 되고 싶다는 생각**이 들어 지금보다 관심을 더 가지고 리서치를 해보려고 한다.

이번 글은 회사에서 유료로 사용하게 된 cursor의 0.50 버전 changelog를 간단하게 번역하고 이해한 글이다. 나를 포함해 동료 개발자들도 cursor와 투닥투닥하며 “일 잘하네” vs “멍청하네”를 오락가락하는 상황이라 좀 더 잘 써보고자 함도 있다.

- [원문 링크 - Cursor 0.50 changelog](https://www.cursor.com/changelog/0-50)
---

### Simpler, unified pricing

사용자들의 혼동을 방지하기 위해 통합된 요금 정책이 출시되었다.
- 모든 모델 사용이 요청 단위로 통합된다. (요청 기반 과금)ㅣ낼
- 가격 구조를 단순화하기 위해 Premium tool call과 long context 모드는 제거되었다.

max mode나 long context 모드를 사용하지 않아서 몰랐었는데 기존에는 모델별로 다른 과금 방식, 추가 모드에 따라 추가 비용이 발생해 사용자들이 본인의 사용량과 비용을 정확히 파악하기 어려운 이슈가 있었다고 한다.
([Agent 모드를 사용했음에도 다수의 “수정” 요청을 “premium-tool-call”, “claude-3.7-sonnet-max”로 분류해 30$를 날린 레딧 유저](https://www.reddit.com/r/ClaudeAI/comments/1jm4zo4/is_anyone_else_getting_overcharged_on_cursorai_i/?utm_source=chatgpt.com))

### Max Mode for all top models

> #### [Max Mode](https://docs.cursor.com/context/max-mode)
> - 최신 AI 모델들의 모든 기능을 사용할 수 있게 한다
> - normal mode와 가장 큰 차이점은, Max Mode는 가능한 많은 context를 한번에 고려하도록 최적화되어 있다는 것
> - "더 큰 Context Window(AI가 한 번에 참고할 수 있는 context의 범위)", "tool call 200회", "최대 750줄의 코드 읽기 가능"을 제공

모든 최신 모델에서 Max Mode를 사용할 수 있게 된다.
사용한 토큰 수에 따라 과금되며, 새로운 모델이 출시되면 그 즉시 Max Mode를 통해 제공될 예정이다.
(모델 출시 → 서비스 반영 with 요금 정책 까지 pipeline이 잘 구축되어 있다는 반증인 것 같기도 하다)

### New Tab model

여러 파일에 걸쳐 변경 사항을 제안하는 새로운 Tab model!
(TAB 눌러서 cursor의 제안을 반영하는데 그 기능을 가능하게 하는 model)
리팩토링, 연쇄적인 수정, 여러 파일 수정, 연관 코드 간 이동을 가능하게 한다.

### Background Agent (preview)

Cursor agent가 이제 백그라운드에서 동작할 수 있다. (Settings > Beta > Background Agent)

이걸 통해 여러 에이전트가 병렬적으로 동작하고, 대규모 작업을 효율적으로 처리할 수 있다. 각 에이전트는 독립적인 환경에서 실행되어 로컬 리소스 부담을 줄인다. 또한, 작업 상황을 실시간으로 모니터링하며 필요 시 언제든 개입할 수 있다.

아직 beta 단계인 기능이지만 cursor 팀에서는 버그 수정, 조사, PR(꽤 긴)의 초안을 작성하는데 유용했다고 한다. 

### Include your entire codebase in context

`@folders` 를 사용해 모델의 context에 전체 코드베이스를 추가할 수 있다.
(`Full folder contents` 가 활성화되어 있어야 함)
단, 폴더나 파일이 너무 크면 포함되지 않을 수 있다.

### Refreshed Inline Edit (Cmd/Ctrl+K) with Agent integration

Inline Edit(코드 상에서 바로 묻고 수정하는)의 UI가 개편되었으며, 새로운 옵션들이 생겼다.

- full file edits (⌘⇧⏎)
  - 에이전트를 사용하지 않고도 파일 전체에 대한 변경이 가능
- sending to agent (⌘L)
  - 선택한 코드 블록을 에이전트에 보내 추가 작업 가능

### Fast edits for long files with Agent

에이전트가 파일 전체를 읽지 않고도 필요한 부분만 찾아 변경하여, 긴 파일의 편집 속도가 향상되었다.
Postgres codebase 파일을 수정하는 예시 영상을 보면 검색 & 수정 작업이 거의 2배나 빨라졌다.
Anthropic model에 먼저 적용 후 다른 모델에도 순차적으로 적용될 예정이다.

개인적으로 궁금하고 유용하리라 생각되는 기능이다. 수정을 요청하면 관련 코드를 찾고 → 관련 파일을 찾고 → 라이브러리를 import 하는 경우 또 검토하고… 이러다가 결국 원하는 답은 얻지 못하는 경우가 종종 있었기에 한번 체감해봐야겠다.

### Work in multiple codebases with workspaces

여러 코드베이스를 하나의 워크스페이스에서 관리할 수 있다 (!) 여러 프로젝트가 각각 다른 폴더에 있을 때 효과적으로 사용할 수 있다 (!!) 심지어 각 폴더에 추가되 있는 `.cursor/rules` 도 지원한다 (!!!)
![omg](https://pbs.twimg.com/media/FFjWQ78WUAME5w-?format=jpg&name=large)

여러 코드베이스를 동시에 작업하고 변경에 대한 수정사항을 다방면으로 검토해야 하는 경우가 종종 있는데 이거야 말로 내가 제일 필요한 기능이다. `rules` 를 아직 적극 활용하지 못하고 있는데 얼른 만들어서 테스트하고 팀에도 공유해봐야겠다!!

### Working with Chat

markdown 형식으로 공유, 기존 채팅의 복제가 가능하다.

기존 채팅의 복제는, 기존 대화의 경로는 그대로 두고, 새로운 대화에서 다른 경로를 탐색하는 것이 가능해졌다는 것이다. 마치 타임 스톤을 통해 가능한 모든 미래를 살펴보는 닥터 스트레인지처럼.
![](https://static1.cbrimages.com/wordpress/wp-content/uploads/2018/05/Avengers-Infinity-War-Doctor-Strange-Time-Stone.jpg?q=50&fit=crop&w=1140&h=&dpr=1.5)

---

단순 업데이트 노트인줄 알았는데 읽다보니 실제 개발자가 일하는 방식들이 기능으로 추가되고 있어서 너무 흥미롭고 또 놀라웠다. 물론 다른 IDE들도 매일 엄청난 기능들이 추가되고 경쟁하겠지만 앞으로 cursor는 어떤 기능들로 놀라게 할지 기대가 된다.

번외 #1) 프로젝트마다 `cursor/rules` 를 얼른 만들어야겠다. 매번 새로운 대화를 시작할 때 시간 소비가 크다. 마치 소개팅 나가서 처음 소개하는 것 마냥..

번외 #2) cursor 블로그가 정말 잘 쓰여져 있다. 물론 기술적으로 딥한 내용을 담은 블로그는 어렵겠지만 이번 changelog 같은 경우 `변경 사항이 무엇인지` 만 담백하게 서술해 글을 읽고 이해하는 데 두 시간도 걸리지 않은 것 같다.