export const theme = {
  light: {
    background: 'hsl(0deg, 0%, 100%)',
    font: '#000000',
    header: '#0066cc',
    listBackground: '#eaeaea'
  },
  dark: {
    background: 'hsl(210deg, 30%, 8%)',
    font: '#ffffff',
    header: 'hsl(210deg, 30%, 8%)',
    listBackground: 'hsl(210deg, 22%, 15%)'
  }
}

export const lighTheme = `
  --color-header: ${theme.light.header};
  --color-list-background: ${theme.light.listBackground};

  background: ${theme.light.background};
  color: ${theme.light.font};
`

export const darkTheme = `
  --color-header: ${theme.dark.header};
  --color-list-background: ${theme.dark.listBackground};

  background: ${theme.dark.background};
  color: ${theme.dark.font};
`

export type MainTheme = typeof theme.light