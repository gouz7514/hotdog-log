import React from 'react'
import styled from '@emotion/styled'

import { useDarkMode } from '@/util/hooks/useDarkmode'

import { useRecoilState } from 'recoil'
import { theme } from '@/store/theme'

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
  const [_, toggleTheme] = useDarkMode()
  const [currentTheme] = useRecoilState(theme)

  return (
    <DarkModeBtn onClick={toggleTheme} className={currentTheme.value}/>
  )
}