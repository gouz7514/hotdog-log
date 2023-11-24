import { Global, css } from '@emotion/react'
import common from './common'
import typo from './typo'
import reset from './reset'

const style = css`
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

const GlobalStyle = () => <Global styles={[style, common, typo, reset]} />

export default GlobalStyle