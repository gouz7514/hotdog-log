import { useContext } from 'react'
import ThemeContext from '@/context/themeContext'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

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
  const { colorTheme, toggleTheme } = useContext(ThemeContext)

  return (
    <DarkModeBtn
      onClick={toggleTheme}
      className={colorTheme === theme.light ? 'light' : 'dark'}
    />
  )
}
