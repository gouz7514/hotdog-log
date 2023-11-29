import type { AppProps } from 'next/app'
import { createContext } from 'react'
import Head from 'next/head'
import { AnimatePresence } from 'framer-motion'

import { theme, MainTheme } from '@/styles/theme'
import { ThemeProvider } from '@emotion/react'
import GlobalStyle from '@/styles/GlobalStyle'
import AppLayout from '@/components/Template/AppLayout'
import { useDarkMode } from '@/util/hooks/useDarkmode'

import {
  RecoilRoot,
  RecoilEnv
} from 'recoil'

export interface ContextProps {
  colorTheme: MainTheme | null;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ContextProps>({
  colorTheme: theme.light,
  toggleTheme: () => {
    return null;
  },
});

export default function App({ Component, pageProps }: AppProps) {
  const { colorTheme, toggleTheme } = useDarkMode()
  RecoilEnv.RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED = false
  // console.log('theme : ', theme)
  console.log(colorTheme)

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
        <ThemeContext.Provider value={{ colorTheme, toggleTheme }}>
          <ThemeProvider theme={{ ...colorTheme }}>
            <AppLayout>
              <GlobalStyle />
              <AnimatePresence mode="wait" initial={false}>
                <Component {...pageProps} />
              </AnimatePresence>
            </AppLayout>
          </ThemeProvider>
        </ThemeContext.Provider>
      </RecoilRoot>
    </>
  )
}