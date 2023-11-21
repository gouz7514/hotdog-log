import { Global, css } from '@emotion/react'
import reset from './reset'

const style = css`
  * {
    box-sizing: border-box;
    padding: 0;
    margin: 0;
    line-height: 1.3;
    -webkit-font-smoothing: antialiased;
  }

  body[data-theme="dark"] {
    background-color: black;
    color: white;
    transition: all 0.3s ease-in-out;
  }

  body[data-theme="light"] {
    background-color: white;
    color: black;
    transition: all 0.3s ease-in-out;
  }

  h1 {
    font-size: 3em;
    margin: 24px 0;
  }

  h2 {
    margin: 12px 0;
    font-size: 2em
  }

  h3 {
    font-size: 1.5em;
  }

  h4 {
    font-size: 1.3em;
  }

  h5 {
    font-size: 1.1em;
    line-height: 1.5;
  }

  .big-paragraph {
    font-size: 1.5rem;
    word-break: keep-all;
  }

  @media screen and (max-width: 600px) {
    .big-paragraph {
      font-size: 1.3rem;
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

  .container {
    width: 100%;
    padding: 1rem;
    z-index: 1;
    max-width: 50rem;
    margin: auto;
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

  .text-bold {
    font-weight: bold;
  }

  .text-blue {
    color: #0066cc;
  }

  .text-orange {
    color: #ff5b1a;
  }

  .main {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 2rem;
  }
`

const GlobalStyle = () => <Global styles={style} />

export default GlobalStyle