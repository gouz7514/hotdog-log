import { Global, css } from '@emotion/react'
import typo from './typo'
import reset from './reset'
import { colors } from './colors'

import { lighTheme, darkTheme } from './theme'

const style = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.3;
    -webkit-font-smoothing: antialiased;

    --z-index-header: 10;
    --header-height: 80px;

    --color-black: ${colors.black};
    --color-light-gray: ${colors.lightGray};
    --color-dark-gray: ${colors.darkgray};
    --color-blue: ${colors.blue};
  }

  body {
    ${lighTheme};
    transition: all 0.3s ease-in-out;
  }

  body[data-theme="dark"] {
    ${darkTheme};
  }

  body[data-theme="light"] {
    ${lighTheme};
  }

  ul {
    list-style: none;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  .d-flex {
    display: flex;
  }

  .d-flex.flex-column {
    flex-direction: column;
  }

  .d-flex.align-items-center {
    align-items: center;
  }

  .relative {
    position: relative;
  }

  .justify-content-between {
    justify-content: space-between;
  }

  .container {
    width: 100%;
    padding: 1rem;
    z-index: 1;
    max-width: 50rem;
    margin: auto;
    position: relative;
  }

  .mt-40 {
    margin-top: 40px;
  }

  .mt-12 {
    margin-top: 12px;
  }

  .mt-16 {
    margin-top: 16px;
  }

  .mt-24 {
    margin-top: 24px;
  }
`

const GlobalStyle = () => <Global styles={[style, typo, reset]} />

export default GlobalStyle