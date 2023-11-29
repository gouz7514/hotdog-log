import { css } from "@emotion/react"

export const MarkdownStyle = css`
  font-size: 1.05rem;

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
    padding: 0.4rem 1rem;
    border-left: 0.25rem solid var(--color-blue);
    background-color: var(--color-block-quote);

    h4 {
      margin-top: 0;
      color: var(--color-blue);
    }
  }

  pre {
    padding: 1rem;
    border-radius: 0.5rem;
    overflow-x: auto;

    code {
      background: initial;
    }
  }

  code {
    background: var(--color-code);
    padding: 0.2rem 0.3rem;
    border-radius: 0.25rem;
  }

  h2 {
    margin-top: 2rem;
    color: var(--color-blue);

    & ~ h3 {
      margin-top: 1rem;
    }
  }

  h3 {
    margin-top: 2rem;
    color: var(--color-blue);
  }

  h4{
    margin-top: 1.5rem;
  }

  h3 ~ h4 {
    margin-top: 1rem;
  }

  h5 {
    margin-top: 1.3rem;
  }

  p {
    margin: 0.8rem 0;
    white-space: pre-wrap;
    line-height: 1.7;
  }

  li {
    margin: 0.5rem 0;
    line-height: 1.5;
    list-style: disc;
    margin-left: 1rem;
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
`