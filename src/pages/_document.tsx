import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

class MyDocument extends Document {
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
        <Head />
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