import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import AppLayout from '../../components/layout/AppLayout'

export default function App({ Component, pageProps }: AppProps) {
  const { page } = pageProps

  return (
    <AppLayout page={page}>
      <Head>
        <title>게으른 개발자, 김학재입니다</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </AppLayout>
  )
}
