import type { AppProps } from 'next/app'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from '@emotion/react'
import { theme } from '@/store/theme'

import GlobalStyle from '@/styles/GlobalStyle'
import AppLayout from '@/components/layout/AppLayout'

import {
  RecoilRoot,
  RecoilEnv
} from 'recoil'

export default function App({ Component }: AppProps) {
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

  return (
    <>
      <Head>
        <title>핫재의 개발 블로그</title>
        <meta name="title" content="핫재의 개발 블로그" />
        <meta name="description" content="김학재의 개발 블로그입니다" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="핫재의 개발 블로그" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hotjae.com" />
        <meta property="og:description" content="김학재의 개발 블로그입니다" />
        <meta property="og:image" content="https://hotjae.com/images/og_image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <AppLayout>
            <GlobalStyle />
            <AnimatePresence mode="wait" initial={false}>
              <Component />
            </AnimatePresence>
          </AppLayout>
        </ThemeProvider>
      </RecoilRoot>
    </>
  )
}