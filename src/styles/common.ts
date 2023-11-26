import { css } from '@emotion/react'
import { colors } from './colors'

const common = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.3;
    -webkit-font-smoothing: antialiased;

    --z-index-header: 10;
    --header-height: 80px;

    --color-blue: ${colors.blue};
    --color-light-background: ${colors.lightTheme.background};
    --color-light-font: ${colors.lightTheme.font};
    --color-dark-background: ${colors.darkTheme.background};
    --color-dark-font: ${colors.darkTheme.font};
  }

  body[data-theme="dark"] {
    background-color: var(--color-dark-background);
    color: var(--color-dark-font);
    transition: all 0.3s ease-in-out;

    --color-background-header: ${colors.darkTheme.header};
  }

  body[data-theme="light"] {
    background-color: var(--color-light-background);
    color: var(--color-light-font);
    transition: all 0.3s ease-in-out;

    --color-background-header: ${colors.lightTheme.header};
  }
`

export default common