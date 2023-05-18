import React from 'react'
import styled from 'styled-components'
import { useDarkMode } from '@/util/hooks/useDarkmode'

import { useRecoilState } from 'recoil'
import { themeState } from '@/store/theme'

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
  const [theme] = useRecoilState(themeState)

  return (
    <DarkModeBtn onClick={toggleTheme} className={theme.value}/>
  )
}