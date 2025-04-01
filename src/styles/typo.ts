import { css } from '@emotion/react'

const typo = css`
  html {
    font-size: 16px;
  }

  h1 {
    font-size: 3rem;
    margin: 24px 0;
  }

  h2 {
    font-size: 2rem;
    margin: 12px 0;
  }

  h3 {
    font-size: 1.5rem;
  }

  h4 {
    font-size: 1.3rem;
  }

  h5 {
    font-size: 1.1rem;
    line-height: 1.5;
  }

  .big-paragraph {
    font-size: 1.1rem;
    word-break: keep-all;
    line-height: 1.8;

    @media screen and (max-width: 768px) {
      font-size: 1.05rem;
    }
  }

  .text-bold {
    font-weight: bold;
  }

  .text-blue {
    color: var(--color-blue);
  }

  .text-orange {
    color: var(--color-orange);
  }

  @media screen and (max-width: 600px) {
    html {
      font-size: 14px;
    }
  }
`

export default typo
