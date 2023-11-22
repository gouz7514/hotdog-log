import { Global, css } from '@emotion/react'
import reset from './reset'
import typo from './typo'
import { colors } from './colors'

const style = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.3;
    -webkit-font-smoothing: antialiased;
  }

  body[data-theme="dark"] {
    background-color: ${colors.background.dark};
    color: ${colors.white};
    transition: all 0.3s ease-in-out;
  }

  body[data-theme="light"] {
    background-color: ${colors.background.light};
    color: ${colors.black};
    transition: all 0.3s ease-in-out;
  }

  @media screen and (max-width: 600px) {
    .big-paragraph {
      font-size: 1.15rem;
    }
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

  .mt-24 {
    margin-top: 24px;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
  }
`

const GlobalStyle = () => <Global styles={[style, reset, typo]} />

export default GlobalStyle