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
        <title>핫재의 개발 블로그</title>
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