import styled from '@emotion/styled'

import { ListProps } from '@/types/types'

export function ListContainer({ children, className }: ListProps) {
  return <ListStyle className={className}>{children}</ListStyle>
}

const ListStyle = styled.ul`
  display: flex;
  flex-direction: column;
  list-style: none;
  gap: 6px;

  li {
    position: relative;
    padding: 0.1rem 0 0.1rem 1rem;

    &::before {
      position: absolute;
      left: 0;
      content: '•';
      color: var(--color-blue);
      font-size: 1rem;
    }
  }
`
