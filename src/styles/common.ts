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

    --color-background-light: ${colors.background.light};
    --color-background-dark: ${colors.background.dark};
    --color-text-light: ${colors.black};
    --color-text-dark: ${colors.white};
  }

  body[data-theme="dark"] {
    background-color: var(--color-background-dark);
    color: var(--color-text-dark);
    transition: all 0.3s ease-in-out;

    --color-background-header: ${colors.background.dark};
  }

  body[data-theme="light"] {
    background-color: var(--color-background-light);
    color: var(--color-text-light);
    transition: all 0.3s ease-in-out;

    --color-background-header: ${colors.blue};
  }
`

export default common