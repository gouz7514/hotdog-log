'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { ReactElement, ReactNode } from 'react'

interface ModalProps {
  // 스크린 리더용 제목. 화면에는 children이 보인다
  title: string
  // 모달을 여는 요소. 버튼 같은 단일 요소를 넘기면 그대로 트리거가 된다
  trigger: ReactElement
  children: ReactNode
}

export function Modal({ title, trigger, children }: ModalProps) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-20 bg-black/50" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed top-1/2 left-1/2 z-20 max-h-[85vh] w-[calc(100%-2rem)] max-w-[40rem] -translate-1/2 overflow-y-auto rounded-xl bg-background p-6 sm:p-8"
        >
          <Dialog.Title className="sr-only">{title}</Dialog.Title>
          <Dialog.Close
            aria-label="Close"
            className="absolute top-4 right-4 cursor-pointer text-[1.4rem] leading-none opacity-60 hover:opacity-100"
          >
            ✕
          </Dialog.Close>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
