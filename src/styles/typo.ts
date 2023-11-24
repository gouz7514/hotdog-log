import { css } from '@emotion/react'
import { colors } from './colors'

const typo = css`
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
    font-size: 1.2rem;
    word-break: keep-all;
    line-height: 1.5;

    @media screen and (max-width: 768px) {
      font-size: 1.15rem;
    }
  }

  .text-bold {
    font-weight: bold;
  }

  .text-blue {
    color: ${colors.blue};
  }

  .text-orange {
    color: ${colors.orange};
  }
`

export default typo