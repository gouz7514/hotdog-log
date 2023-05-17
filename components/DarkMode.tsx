import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'

const DarkModeBtn = styled.div`
  width: 30px;
  height: 30px;
  background-size: 26px 26px;
  background-repeat: no-repeat;

  &.light {
    background-image: url('/icon/icon-sun.svg');
  }

  &.dark {
    background-image: url('/icon/icon-moon.svg');
  }
`

export default function DarkMode() {
  const [mode, setMode] = useState('light')

  const handleMouseClick = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    document.body.classList.remove(mode);
    document.body.classList.add(newMode);
  }

  return (
    <DarkModeBtn onClick={handleMouseClick} className={mode}/>
  )
}