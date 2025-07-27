import styled from '@emotion/styled'
import { HTMLAttributes, ReactNode } from 'react'

type ModalFooterProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function ModalFooter({ children, ...props }: ModalFooterProps) {
  return <StyledModalFooter {...props}>{children}</StyledModalFooter>
}

const StyledModalFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
`
