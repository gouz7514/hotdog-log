import { useContext } from 'react'

import ThemeContext from '@/context/themeContext'
import { theme } from '@/styles/theme'
import { IconChildProps } from '@/types/types'

export function IconYoutube({ fill = '#282828' }: IconChildProps) {
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark
  const white = '#ffffff'

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlSpace="preserve"
      id="Layer_1"
      width="71.412064"
      height="50"
      x="0"
      y="0"
      version="1.1"
      viewBox="0 0 71.412065 50"
    >
      <g id="g5" transform="scale(.58824)">
        <path
          id="path7"
          fill={isDark ? white : fill}
          fillOpacity="1"
          d="M118.9 13.3c-1.4-5.2-5.5-9.3-10.7-10.7C98.7 0 60.7 0 60.7 0s-38 0-47.5 2.5C8.1 3.9 3.9 8.1 2.5 13.3 0 22.8 0 42.5 0 42.5s0 19.8 2.5 29.2C3.9 76.9 8 81 13.2 82.4 22.8 85 60.7 85 60.7 85s38 0 47.5-2.5c5.2-1.4 9.3-5.5 10.7-10.7 2.5-9.5 2.5-29.2 2.5-29.2s.1-19.8-2.5-29.3z"
        />
        <path
          id="polygon9"
          fill={isDark ? fill : white}
          d="M80.2 42.5 48.6 24.3v36.4z"
        />
      </g>
    </svg>
  )
}
