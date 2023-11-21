import { ReactNode } from 'react'
import styled from '@emotion/styled'

type IconProps = {
  icon: ReactNode
  width?: number
  height?: number
}

const IconWrapper = styled.span<{ width: number, height: number }>`
  display: inline-block;
  svg {
    width: ${(props) => props.width ? `${props.width}px` : 'auto'};
    height: ${(props) => props.height ? `${props.height}px` : 'auto'};
  }
`

export default function Icon({ icon, width = 30, height = 30 }: IconProps) {
  return (
    <IconWrapper width={width} height={height}>
      { icon }
    </IconWrapper>
  )
}
