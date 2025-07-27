import styled from '@emotion/styled'
import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion'
import { ReactNode, useEffect, useRef } from 'react'

import { Portal } from '../Portal'

export type ModalProps = {
  isOpen: boolean
  onClose: VoidFunction
  width?: string
  children?: ReactNode
  clickOutsideClose?: boolean
} & Omit<HTMLMotionProps<'div'>, 'isOpen' | 'onClose'>

export function Modal({
  children,
  isOpen,
  onClose,
  width,
  clickOutsideClose = true,
  ...props
}: ModalProps): JSX.Element {
  const modalRef = useRef<HTMLDivElement>(null)

  const handleClickOutside = (
    e: React.MouseEvent | React.TouchEvent | React.PointerEvent,
  ): void => {
    if (!clickOutsideClose) return

    if (!modalRef.current?.contains(e.target as Node)) {
      onClose()
    }
  }

  useEffect((): (() => void) => {
    document.body.style.overflow = isOpen ? 'hidden' : ''

    return (): void => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const dimVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.15 } },
    exit: { opacity: 0, transition: { duration: 0.2 } },
  }

  const modalVariants = {
    hidden: { scale: 0.95, opacity: 0, y: 10 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 350,
        duration: 0.2,
      },
    },
    exit: {
      scale: 0.95,
      opacity: 0,
      y: 10,
      transition: {
        type: 'spring',
        damping: 30,
        stiffness: 350,
        duration: 0.2,
      },
    },
  }

  return (
    <Portal isOpen={isOpen}>
      <AnimatePresence>
        {isOpen && (
          <Overlay
            variants={dimVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={handleClickOutside}
          >
            <ModalContainer
              ref={modalRef}
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              style={{ width: width }}
              {...props}
            >
              {children}
            </ModalContainer>
          </Overlay>
        )}
      </AnimatePresence>
    </Portal>
  )
}

const Overlay = styled(motion.div)`
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 100vw;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
`

const ModalContainer = styled(motion.div)`
  width: 450px;
  max-width: 90vw;
  height: auto;
  background-color: var(--color-background);
  padding: 12px;
  border-radius: 4px;
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);

  &::-webkit-scrollbar {
    display: none;
  }
`
