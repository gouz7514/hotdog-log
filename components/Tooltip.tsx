import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'

interface TooltipProps {
  children: ReactNode
}

const TooltipContainer = styled.div`
  border-radius: 50%;
  background-image: url('/images/icon-detail.svg');
  width: 24px;
  height: 24px;
  background-size: 24px 24px;
  margin-left: 6px;
  position: relative;
`

const TooltipContent = styled.div`
  position: absolute;
  background-color: #343434;
  color: white;
  width: 120px;
  padding: 8px;
  border-radius: 6px;
  font-size: 80%;
  left: 32px;
  transform: translateY(-50%);
  top: 12px;

  &:before {
    content: "";
    position: absolute;
    left: -8px;
    top: 50%;
    transform: translateY(-50%);
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-right: 8px solid #343434;
  }
`

export default function Tooltip({ children }: TooltipProps) {
  const [show, setShow] = useState(false)

  const handleMouseEnter = () => {
    setShow(true)
  }

  const handleMouseLeave = () => {
    setShow(false)
  }

  return (
    <TooltipContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {show && (
        <TooltipContent
        >
          { children }
        </TooltipContent>
      )}
    </TooltipContainer>
  )
}