export const theme = {
  light: {
    background: 'hsl(0deg, 0%, 100%)',
    font: '#000000',
    header: '#e3f2fd',
    listBackground: '#eaeaea',
    code: '#e9ecef',
    blockQuote: 'hsl(225deg, 25%, 95%)',
  },
  dark: {
    background: 'hsl(210deg, 30%, 8%)',
    font: '#ffffff',
    header: 'hsl(210deg, 30%, 8%)',
    listBackground: 'hsl(210deg, 22%, 15%)',
    code: '#363636',
    blockQuote: 'hsl(210deg, 22%, 15%)',
  },
}

export const lighTheme = `
  --color-header: ${theme.light.header};
  --color-list-background: ${theme.light.listBackground};
  --color-code: ${theme.light.code};
  --color-block-quote: ${theme.light.blockQuote};

  background: ${theme.light.background};
  color: ${theme.light.font};
`

export const darkTheme = `
  --color-header: ${theme.dark.header};
  --color-list-background: ${theme.dark.listBackground};
  --color-code: ${theme.dark.code};
  --color-block-quote: ${theme.dark.blockQuote};

  background: ${theme.dark.background};
  color: ${theme.dark.font};
`

export type MainTheme = typeof theme.light
