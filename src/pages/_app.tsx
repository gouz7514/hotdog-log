// import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import AppLayout from '../../components/layout/AppLayout'

export default function App({ Component, pageProps }: AppProps) {
  const { page } = pageProps

  return (
    <AppLayout page={page}>
      <Component {...pageProps} />
    </AppLayout>
  )
}
