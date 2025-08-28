import { css } from '@emotion/react'

const MarkdownStyle = css`
  strong {
    color: var(--color-blue);
  }

  a {
    color: var(--color-blue);
    text-decoration: underline;
    font-weight: bold;
  }

  blockquote {
    margin: 1rem 0;
    padding: 0.6rem 1rem;
    border-left: 0.25rem solid var(--color-blue);
    background-color: var(--color-blockquote);

    h4 {
      margin-top: 0;
      color: var(--color-blue);
    }

    p {
      margin: 0.3rem 0;
    }
  }

  pre {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;

    code {
      background: initial;
    }

    * {
      font-size: 0.95rem;
      font-family:
        Consolas,
        Monaco,
        Lucida Console,
        Liberation Mono,
        DejaVu Sans Mono,
        Bitstream Vera Sans Mono,
        Courier New;
    }
  }

  code {
    background: var(--color-code);
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-size: 85%;
    font-family:
      'Fira Mono', source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    position: relative;
    scroll-margin-top: 80px; /* 헤더 높이 + 여유 공간 */

    &:hover .anchor-link {
      opacity: 1;
    }
  }

  h1 {
    font-size: 2.5rem;
    margin: 1.8rem 0 0;
    color: var(--color-blue);
  }

  h2 {
    margin: 1.5rem 0 0;
    color: var(--color-blue);

    & + h3 {
      margin-top: 1rem;
    }
  }

  h3 {
    margin-top: 1.5rem;
    color: var(--color-blue);
  }

  h4 {
    font-size: 1.2rem;
    margin-top: 1.5rem;
    color: var(--color-blue);
  }

  h3 ~ h4 {
    margin-top: 1rem;
  }

  h5 {
    margin-top: 1.3rem;
  }

  .anchor-link {
    opacity: 0;
    margin-left: 0.5rem;
    color: var(--color-blue);
    text-decoration: none;
    font-size: 0.9em;

    &:hover {
      opacity: 1;
      text-decoration: underline;
    }

    &::before {
      content: '#';
    }
  }

  p {
    margin: 0.8rem 0;
    white-space: pre-wrap;
    word-break: keep-all;
    line-height: 1.7;
  }

  li {
    margin: 0.3rem 0;
    line-height: 1.5;
    margin-left: 1rem;
  }

  ul {
    li {
      list-style: disc;
    }
  }

  img {
    display: block;
    width: 100%;
    max-width: 520px;
    margin: 2rem auto 0;

    @media screen and (max-width: 600px) {
      max-width: calc(100% - 40px);
    }
  }

  @media screen and (max-width: 600px) {
    font-size: 1.05rem;
  }
`

export default MarkdownStyle
