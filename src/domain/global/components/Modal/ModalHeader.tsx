import styled from '@emotion/styled'
import { HTMLAttributes, ReactNode } from 'react'

type ModalHeaderProps = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

export function ModalHeader({ children, ...props }: ModalHeaderProps) {
  return <StyledModalHeader {...props}>{children}</StyledModalHeader>
}

const StyledModalHeader = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`
