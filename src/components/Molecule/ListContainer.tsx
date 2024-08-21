import styled from '@emotion/styled'

import { ListProps } from '@/types/types'

export function ListContainer({ children, className }: ListProps) {
  return <ListStyle className={className}>{children}</ListStyle>
}

const ListStyle = styled.ul`
  margin-top: 8px;
  line-height: 1.5;

  li {
    font-size: 1.1em;

    &:not(:last-child) {
      margin-bottom: 8px;
    }
  }
`
