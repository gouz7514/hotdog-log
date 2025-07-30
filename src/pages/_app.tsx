import { ThemeProvider } from '@emotion/react'
import { GoogleAnalytics } from '@next/third-parties/google'
import { AnimatePresence } from 'framer-motion'
import Head from 'next/head'
import { OverlayProvider } from 'overlay-kit'
import { useMemo } from 'react'
import { RecoilEnv, RecoilRoot } from 'recoil'

import { AppLayout } from '@/components/Template'
import ThemeContext from '@/context/themeContext'
import * as gtag from '@/lib/gtag'
import GlobalStyle from '@/styles/GlobalStyle'
import { MainTheme } from '@/styles/theme'
import useDarkMode from '@/util/hooks/useDarkmode'

import type { AppProps } from 'next/app'

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

  const getLayout =
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (Component as any).getLayout ||
    ((page: React.ReactNode) => <AppLayout>{page}</AppLayout>)

  return (
    <>
      <Head>
        <title>Hakjae Kim</title>
        <meta name="title" content="Hakjae's Dev Blog" />
        <meta name="description" content="Hakjae's Dev Blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Hakjae's Dev Blog" key="og:title" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://hakjae.dev" key="og:url" />
        <meta
          property="og:description"
          content="Hakjae's Dev Blog"
          key="og:description"
        />
        <meta
          property="og:image"
          content="https://hakjae.dev/images/og_image.webp"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <RecoilRoot>
        <ThemeContext.Provider value={contextValue}>
          <ThemeProvider theme={{ ...colorTheme }}>
            <GoogleAnalytics gaId={gtag.GA_ID as string} />
            <GlobalStyle />
            <AnimatePresence initial={false}>
              <OverlayProvider>
                {getLayout(<Component {...pageProps} />)}
              </OverlayProvider>
            </AnimatePresence>
          </ThemeProvider>
        </ThemeContext.Provider>
      </RecoilRoot>
    </>
  )
}
