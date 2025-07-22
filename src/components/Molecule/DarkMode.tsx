import { useContext } from 'react'
import ThemeContext from '@/context/themeContext'
import styled from '@emotion/styled'
import { theme } from '@/styles/theme'

export function DarkMode() {
  const { colorTheme, toggleTheme } = useContext(ThemeContext)

  return (
    <DarkModeBtn
      onClick={toggleTheme}
      className={colorTheme === theme.light ? 'light' : 'dark'}
    />
  )
}

const DarkModeBtn = styled.div`
  width: 30px;
  height: 30px;
  background-size: 30px 30px;
  background-repeat: no-repeat;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.1);
  }

  &.light {
    background-image: url('/icon/icon-sun.svg');
  }

  &.dark {
    background-image: url('/icon/icon-moon.svg');
  }
`
