import styled from '@emotion/styled'

import { ListProps } from '@/types/types'

const ListStyle = styled.ul`
  li {
    margin: 6px 0;
  }
`

export default function ListContainer({ children, className }: ListProps) {
  return <ListStyle className={className}>{children}</ListStyle>
}
