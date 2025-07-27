import { css } from '@emotion/react'

export const theme = {
  light: {
    background: 'hsl(0deg, 0%, 100%)',
    backgroundHover: 'hsl(0deg, 0%, 95%)',
    border: 'oklch(92.3% .003 48.717)',
    font: '#000000',
    header: '#e3f2fd',
    listBackground: '#eaeaea',
    code: '#e9ecef',
    blockquote: 'hsl(225deg, 25%, 95%)',
  },
  dark: {
    background: 'hsl(210deg, 30%, 8%)',
    backgroundHover: 'hsl(210deg, 30%, 15%)',
    border: 'oklch(100% 0 0 / .1)',
    font: '#ffffff',
    header: 'hsl(210deg, 30%, 8%)',
    listBackground: 'hsl(210deg, 22%, 15%)',
    code: '#363636',
    blockquote: 'hsl(210deg, 22%, 15%)',
  },
}

const themeMaker = (target: 'light' | 'dark') => {
  const targetTheme = theme[target]

  return Object.entries(targetTheme).reduce(
    (acc, [key, value]) => {
      const keyName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      acc[`--color-${keyName}`] = value
      return acc
    },
    {} as Record<string, string>,
  )
}

export const lighTheme = css`
  ${themeMaker('light')}

  background: ${theme.light.background};
  color: ${theme.light.font};
`

export const darkTheme = css`
  ${themeMaker('dark')}

  background: ${theme.dark.background};
  color: ${theme.dark.font};
`

export type MainTheme = typeof theme.light
