import type { AppProps } from 'next/app'
import { useMemo } from 'react'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'

import { MainTheme } from '@/styles/theme'
import { ThemeProvider } from '@emotion/react'
import GlobalStyle from '@/styles/GlobalStyle'
import { AppLayout } from '@/components/Template'
import useDarkMode from '@/util/hooks/useDarkmode'
import { GoogleAnalytics } from '@next/third-parties/google'

import { RecoilRoot, RecoilEnv } from 'recoil'

import ThemeContext from '@/context/themeContext'
import * as gtag from '@/lib/gtag'

export interface ContextProps {
  colorTheme: MainTheme | null
  toggleTheme: () => void
}

export default function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode()
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false

  const contextValue = useMemo(
    () => ({ colorTheme, toggleTheme }),
    [colorTheme, toggleTheme],
  )

  return (
    <>
      <Head>
        <title>핫재의 개발 블로그</title>
        <meta name="title" content="핫재의 개발 블로그" />
        <meta name="description" content="김학재의 개발 블로그입니다" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="핫재의 개발 블로그" key="og:title" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hotjae.com" key="og:url" />
        <meta
          property="og:description"
          content="김학재의 개발 블로그입니다"
          key="og:description"
        />
        <meta
          property="og:image"
          content="https://hotjae.com/images/og_image.png"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <ThemeContext.Provider value={contextValue}>
          <ThemeProvider theme={{ ...colorTheme }}>
            <GoogleAnalytics gaId={gtag.GA_ID as string} />
            <AppLayout>
              <GlobalStyle />
              <AnimatePresence mode="wait" initial={false}>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <Component {...pageProps} />
              </AnimatePresence>
            </AppLayout>
          </ThemeProvider>
        </ThemeContext.Provider>
      </RecoilRoot>
    </>
  )
}
