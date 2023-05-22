import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import AppLayout from '../../components/layout/AppLayout'

import {
  RecoilRoot,
  RecoilEnv
} from 'recoil'

export default function App({ Component, pageProps }: AppProps) {
  const { page } = pageProps
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

  return (
    <>
      <Head>
        <title>게으른 개발자, 김학재입니다</title>
        <meta name="og:title" content="게으른 개발자, 김학재입니다" />
        <meta name="description" content="김학재의 개발 블로그" />
        <meta name="og:description" content="김학재의 개발 블로그" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/images/profile.webp" />
      </Head>
      <RecoilRoot>
        <AppLayout page={page}>
          <AnimatePresence mode="wait" initial={false}>
            <Component {...pageProps} />
          </AnimatePresence>
        </AppLayout>
      </RecoilRoot>
    </>
  )
}