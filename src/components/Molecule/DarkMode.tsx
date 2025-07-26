import ThemeContext from '@/context/themeContext'
import { theme } from '@/styles/theme'
import styled from '@emotion/styled'
import { useContext } from 'react'

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
  width: 32px;
  height: 32px;
  background-size: 32px 32px;
  background-repeat: no-repeat;
  cursor: pointer;

  &.light {
    background-image: url('/icon/icon-sun.png');
    animation: rotate 10s linear infinite;

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  }

  &.dark {
    background-image: url('/icon/icon-moon.png');
    animation: swing 5s linear infinite;

    @keyframes swing {
      0% {
        transform: rotate(0deg);
      }

      30% {
        transform: rotate(-10deg);
      }

      70% {
        transform: rotate(10deg);
      }

      100% {
        transform: rotate(0deg);
      }
    }
  }
`
