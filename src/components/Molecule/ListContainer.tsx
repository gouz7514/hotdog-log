import { ReactNode } from "react"
import styled from '@emotion/styled'

const ListStyle = styled.ul`
  li {
    margin: 6px 0;
  }
`

interface ListProps {
  children: ReactNode,
  className?: string,
}

export default function ListContainer({ children, className }: ListProps) {
  return (
    <ListStyle className={className}>
      {children}
    </ListStyle>
  )
}