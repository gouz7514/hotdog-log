import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    const setThemeMode = `
      if (localStorage.theme) {
        document.body.dataset.theme = localStorage.theme
      } else {
        document.body.data.set.theme = 'light'
      }
    `;

    return (
      <Html lang="en">
        <Head>
          <meta name="og:title" content="핫재의 개발 블로그" />
          <meta name="description" content="김학재의 개발 블로그입니다" />
          <meta name="og:description" content="김학재의 개발 블로그입니다" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <meta property="og:image" content="/images/profile.webp" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: setThemeMode }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument