---
title: '모달 선언적으로 사용하기 (feat. useOverlay)'
summary: '선언적 코드 작성을 통해 컴포넌트 개선하기'
tags: ['React', 'FE']
date: '2025-03-24 01:00:00'
---
웹 서비스를 개발하다 보면 ‘모달’을 생각 이상으로 자주 사용하게 됩니다.

현재 근무하고 있는 에이비제트에서는 서비스 공지사항 안내 등을 포함하여 다양한 모달을 적극절으로 활용하고 있는데요

서비스가 점차 고도화되고 다양한 모달을 빠른 기간 내에 개발해야할 일이 많아짐에 따라 컴포넌트화를 통한 재사용과 누가 봐도 이해할 수 있는 직관적인 코드 작성의 필요성을 느끼게 되었어요.

이번 글에서는 기존에 모달 컴포넌트를 구현한 방식과 더불어 이를 어떻게 개선해 나갔는지에 대해 정리해보려고 합니다.

> **이 글을 통해 다음 내용에 대해 알 수 있어요.**
> - 기존 Modal 컴포넌트의 구현 방식과 문제점
> - 선언적 코드 작성을 통한 모달 컴포넌트 개선 방법
>

### 1. 모달의 구조 정의
모달의 구현에 있어 코드를 먼저 작성하는 것이 아닌, 모달을 여러 구역으로 쪼개 각 구역이 하는 역할을 명확히 하고자 했어요.
![Image](https://velog.velcdn.com/images/gouz7514/post/bdee8a6a-4c07-4cf4-b1c4-66b0fbacd275/image.png)

위 그림은 어느 모달에서도 공통적으로 활용하는 UI, 즉 모달 컴포넌트의 공통 UI를 정의한 대략적인 그림이에요.

간단하게 살펴보자면 아래와 같답니다.

- 모달이 띄워지는 경우, 기존 화면에는 backdrop이 씌워지고 모달을 화면 정중앙에 위치
- 모달은 크게 3개의 구역으로 나뉘어짐
- `ModalTitle` 영역은 모달의 제목, 역할 명시
- `ModalBody` 영역은 모달의 실제 컨텐츠
- `ModalFooter` 영역은 액션 버튼 영역

### 2. 모달 컴포넌트 구현
모달 컴포넌트의 구현에 있어 채널톡의 오픈소스 디자인 시스템인 [bezier-react](https://github.com/channel-io/bezier-react)를 참고했어요.

자세한 설명에 앞서, bezier-react의 [Modal 컴포넌트](https://github.com/channel-io/bezier-react/blob/main/packages/bezier-react/src/components/Modal/Modal.tsx)에 대한 간단한 Anatomy는 아래와 같아요

```javascript
// 컴포넌트 구조
<Modal>
  <ModalTrigger />
  <ModalContent>
    <ModalHeader />
    <ModalBody />
    <ModalFooter />
  </ModalContent>
</Modal>
```

`trigger` 를 통해 모달을 여닫는 방식, `Header`, `Body`, `Footer` 의 3가지 영역이 모여 하나의 모달을 구성하는 방식 등 우리가 구현하고자 하는 모달과 비슷하다고 판단했어요.

이를 바탕으로 최종적으로 구현된 모달 코드는 아래와 같아요.
```javascript
// Modal.tsx
// 모달의 실제 UI를 담당. ModalTitle, ModalBody, ModalFooter가 여기에 포함.
function ModalContent() {
  const { style, onCloseModal, disableOutsideClick, footer } =
    useContext(ModalContext);
  const modalContentRef = useRef<HTMLDivElement>(null);

  useOutsideClick(modalContentRef, () => {
    if (!disableOutsideClick && onCloseModal) onCloseModal();
  });

  return (
    <S.ModalWrapper ref={modalContentRef} style={style}>
      <ModalTitle />
      <ModalBody />
      {footer && <ModalFooter />}
    </S.ModalWrapper>
  );
}

/**
 * 페이지를 가리고 사용자에게 정보를 입력받거나, 단순 확인을 위한 모달 컴포넌트입니다.
 * children을 prop으로 넘길 경우, ModalTrigger 컴포넌트로 전달됩니다.
 * ModalTrigger 클릭 시 모달이 노출되며 모달 컨텐츠 자체는 portal을 통해 backdrop에 렌더링됩니다.
 *
 * children을 사용하는 방식 대신 외부에서 Modal 컴포넌트를 사용할 경우 `externalShow`, `onCloseModal`을 사용하여 모달을 제어할 수 있습니다.
 *
 * `type`이 confirm인 경우 `title`은 string, `type`이 close인 경우 title은 string | React.ReactNode으로 받습니다.
 *
 * @example
 * ```tsx
 * // Modal 구조
 * <Modal>
 *  <ModalTrigger />
 *  <ModalContent>
 *    <ModalTitle />
 *    <ModalBody />
 *    <ModalFooter />
 *  </ModalContent>
 * </Modal>
 * ```
 */
export function Modal(props: ModalProps) {
  const { children, onShow, onCloseModal, externalShow } = props;
  const [backdrop, setBackdrop] = useState<HTMLDivElement | null>(null);
  // modal의 노출 여부를 관리하는 state
  const [show, setShow] = useState(externalShow || false);

  const onClickShowModal = () => {
    setShow(true);
  };

  const onClickCloseModal = () => {
    if (onCloseModal) onCloseModal();
    setShow(false);
  };

  // _app.tsx 내에 backdrop이라는 id를 가진 엘리먼트 존재
  useEffect(() => {
    setBackdrop(document.getElementById('backdrop') as HTMLDivElement);
  }, []);

  useEffect(() => {
    if (show && onShow) onShow();
  }, [show, onShow]);

  useEffect(() => {
    if (externalShow !== undefined) {
      setShow(externalShow);
    }
  }, [externalShow]);

  return (
    <>
      {children && (
        <ModalTrigger onClickShowModal={onClickShowModal}>
          {children}
        </ModalTrigger>
      )}
      {show && (
        <ModalContext.Provider
          value={{ ...props, onCloseModal: onClickCloseModal }}
        >
          {backdrop &&
            (createPortal(
              <Backdrop deep>
                <ModalContent />
              </Backdrop>,
              backdrop as HTMLDivElement
            ) as ReactNode)}
        </ModalContext.Provider>
      )}
    </>
  );
}
```

컴포넌트의 anatomy와 사용 방식은 레퍼런스로 삼은 bezier-react와 크게 다를 바 없지만, 뭔가 코드가 더 길고 복잡해 보이는데요. 이는 처음 구현했을 당시의 모달 기능에 대비해 서비스에서 필요로 하는 모달의 기능은 더 복잡해졌기 때문이에요

- 모달 외부를 클릭했을 때 닫히게 할지 말지를 결정 (`disableOutsideClick`)
- 모달을 여닫는 별도의 컴포넌트(ModalTrigger)를 사용하지 않고 모달을 여닫는 경우를 제어하는 props (`externalShow` : 모달 외부에서 모달을 보여준다는 의미)

위 코드를 기반으로 작성된 실제 모달 컴포넌트는 다음과 같았어요.
```javascript
<Modal
  type={MODAL_TYPES.CONFIRM} // type에 따라 Modalitle 영역 UI가 달라짐
  title={isEdit ? '그룹 수정' : '그룹 추가'}
  titleAlign="left" // title의 text-align 방향
  externalShow={externalShow}
  onCloseModal={onCloseModal}
  content={ // 모달 실제 content
    <StyledInput
      guide="그룹명"
      required
      clearable
      width={'100%'}
      value={productName}
      maxLength={20}
      onInput={handleOnInput}
      placeholder="그룹명을 입력하세요 (최대 20자)"
    />
  }
  footer={{ // 모달 footer 영역
    left: (
      <Button size="medium" fullWidth>
        돌아가기
      </Button>
    ),
    right: (
      <Button
        size="medium"
        type="primary"
        onClick={onClickSave}
        fullWidth
        disabled={!productName}
      >
        저장
      </Button>
    ),
  }}
/>
```

이제 점점 컴포넌트라고 부르기 애매한, 만든 사람의 설명이 없다면 이해하기 힘든 모달 컴포넌트가 되어 버리고 말았답니다… 😥
![불편함 짤](https://i.namu.wiki/i/Qya4xTx5ck-j-FxzOp3h6fofdXgCXiN_kPNDH2UE7LbDMPLcmLy3LymxhuY6z_JDM72ziIA_TDc-z7lMXUcWgg.webp)

<br />

### 3. `useOverlay`를 활용한 리팩토링
애물단지가 되어버린 모달 컴포넌트를 품에 안고 끙끙대던 어느 날, 기능 스프린트가 어느 정도 완료되고 코드를 리팩토링할 수 있는 기간이 찾아왔어요.

인프라 개선, 신규 프로젝트에 대한 고민 등 해결할 수 있는 과제는 많았지만 저는 가장 먼저 모달 컴포넌트 리팩토링을 진행했으며 그 이유는 다음과 같아요.

- 점진적 모노레포 도입에 있어 통일된 모달 로직에 대한 필요성 증가
- 단기간에 기능 배포를 위해서 효율적인 코드가 필수불가결해짐

state와 props로 관리하는 방식의 치명적인 단점을 어떻게 하면 해결할 수 있을까 고민하던 중, [toss-slash의 useOverlay](https://www.slash.page/ko/libraries/react/use-overlay/src/useOverlay.i18n)를 접하게 되었어요.

_**`*useOverlay`는 Overlay를 선언적으로 다루기 위한 유틸리티입니다.**_

저는 여기서 “선언적” 이라는 단어에 집중했어요. 프로그래밍에서 “선언적” 이라는 단어는 “명령형” 과 대조되는 개념의 단어로 [React 공식 문서](https://react.dev/learn/reacting-to-input-with-state#how-declarative-ui-compares-to-imperative)에 따르면 선언적(Declarative) 프로그래밍이란, Ui를 직접 조작하는 방식이 아닌, 각각의 시각적 state로 UI를 묘사하는 것을 의미해요. 여기서 한 발 더 나아가, [토스 FE 챕터](https://toss.tech/article/frontend-declarative-code)에서는 선언적인 코드를 “추상화 레벨이 높아진 코드”로 생각하고 있다고 해요.

즉, 기존에 작성한 모달 컴포넌트 코드는 다변화에 대한 대응이 어려운(추상화 레벨이 낮은) 코드로 점점 좋지 않은 코드가 되어 있었던 것이죠.

“불편함을 불편해한다”는 스스로의 마음가짐을 다시금 되새기고, 기존에 작성한 모든 모달 컴포넌트를 `useOverlay` 훅을 활용해 리팩토링하는 작업을 진행했으며, 이 과정에서 유의한 점은 다음과 같아요.

- 다양한 모달 UI를 하나의 컴포넌트로 대응하려고 하지 않기 (= 추상화 레벨 높이기)
- 새로운 모달 UI 개발이 필요해도 빠른 시간 내 개발이 가능한 구조로 만들기

위 내용을 토대로 고민해서 구현한 모달 코드는 다음과 같아요.
```javascript
// components/common/Modal/Modal.tsx
import { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Backdrop } from '../Backdrop';

import * as S from './styled';

export const Modal = forwardRef(function Modal<T>({
  open,
  children,
  width = 375,
}: {
  open: boolean;
  children: React.ReactElement<T>;
  width?: number;
}) {
  const [backdrop, setBackdrop] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    setBackdrop(document.getElementById('backdrop') as HTMLDivElement);
  }, []);

  return (
    <>
      {open &&
        backdrop &&
        createPortal(
          <Backdrop deep>
            <S.ModalWrapper style={{ width: width }}>{children}</S.ModalWrapper>
          </Backdrop>,
          backdrop as HTMLDivElement
        )}
    </>
  );
});
```

```javascript
// ex) Modal 사용 예시 - useSpecificModal
import { Modal } from '@/components/common';

export function useSpecificModal() {
  const overlay = useOverlay(); // 토스의 useOverlay 훅을 차요

  return useMemo(
    () => ({
      open: (id: number) =>
        overlay.open(({ isOpen, close }) => (
          <Modal open={isOpen} width={610}>
	          {* Modal의 contents가 될 컴포넌트가 children으로 들어감 *}
          </Modal>
        )),
      close: overlay.close,
    }),
    [overlay]
  );
}
```

먼저 모든 모달 컴포넌트의 공통 UI의 추상화 레벨을 높여서 정의했어요.
즉, 기존의 세 영역으로 쪼개는 것을 포함하지 않는, backdrop과 화면 중앙 정렬만을 구현하는 공통의 `Modal` 컴포넌트를 정의했어요.

그 다음, 각 모달이 필요한 상황에 맞춰 `useOverlay` 훅과 함께 커스텀 훅을 정의해 각 모달을 선언적으로 사용했어요. 추가 props의 전달이 필요한 경우는 open 메소드에 필요한 prop을 넘겨 `Modal` 컴포넌트에서 받아서 사용하는 방식으로 구현했어요.

그럼 리팩토링 전과 비교했을 때 코드가 어떻게 변했는지 알아볼까요?

```javascript
// AS_IS : 리팩토링 전 모달마다 show 상태 정의 필요, 수많은 prop 대응 = 장황해지는 코드 😥
const [showSpecificModal, setShowSpecificModal] = useState(false)
...
<SpecificModal
  show={showSpecificModal}
  // 이외 필요한 수많은 prop들
/>

// TO_BE : 리팩토링 후 코드가 훨씬 간결, 명확해짐. 추상화 레벨이 높아짐 = react스러워짐! 😊
const { open } = useSpecificModal()
```

기술적으로 어마어마한 작업을 진행하지 않았음에도 코드의 가독성이 훨씬 올라가고, 누가 봐도 이해할 수 있는 코드가 된 것을 확인할 수 있었어요. 이후 새로운 모달의 작성에 있어서도 `Modal` 컴포넌트와 `useOverlay` 훅을 활용해 이전보다 훨씬 빠른 속도로 개발을 할 수 있었답니다.

---
## 마치며
현재 리팩토링된 모달 코드는 하나의 레포지토리에서만 활용하고 있는데요, 여기서 더 나아가 디자이너 그리고 동료 FE 개발자와 긴밀한 소통을 통해 **디자인 시스템에 모달과 훅의 포함을 검토**하고 있는 단계에요.

또한, 여기서 리팩토링을 멈추는 것이 아닌 더 간결한 코드, 공통 로직을 분리할 수 있는 방법에 대해 지속적으로 고민해 나갈 예정입니다.

이번 리팩토링을 통해 더 React스러운 코드를 작성하는 법, 기존의 내 코드를 넘어선 더 나은 코드를 작성하는 법에 대해 터득할 수 있었어요. 앞으로도, 꾸준한 고민을 통해 다양한 “불편함”을 해결해 나가고자 합니다.

---
### 참고한 글들
- [Declarative React, and Inversion of Control](https://blog.mathpresso.com/declarative-react-and-inversion-of-control-7b95f3fbddf5)
- [React docs - Reacting to Input with State : How declarative UI compares to imperative](https://react.dev/learn/reacting-to-input-with-state)
- [toss tech - 선언적인 코드 작성하기](https://toss.tech/article/frontend-declarative-code)