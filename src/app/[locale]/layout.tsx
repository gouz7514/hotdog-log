import { GoogleAnalytics } from '@next/third-parties/google'
import { notFound } from 'next/navigation'

import { Footer, Header } from '@/components/Organism'
import { GA_ID } from '@/lib/gtag'
import { BASE_URL, SITE_DESCRIPTION, SITE_TITLE } from '@/lib/metadata'
import { isLocale, locales } from '@/lib/translations'

import type { Metadata } from 'next'

import 'pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'
import '@/styles/globals.css'

// 첫 페인트 전에 테마를 정해 깜빡임을 막는다
const setThemeMode = `
  const theme = localStorage.getItem('theme')
  const getUserTheme = () => {
    if (theme) return theme
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }
  document.documentElement.dataset.theme = getUserTheme()
`

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Hakjae Kim',
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: 'website',
    url: BASE_URL,
    images: [{ url: '/images/og_image.webp', width: 1200, height: 630 }],
  },
  icons: '/favicon.ico',
}

export const dynamicParams = false

export function generateStaticParams() {
  return locales.map(locale => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<'/[locale]'>) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: setThemeMode }} />
      </head>
      <body>
        <Header locale={locale} />
        {children}
        <Footer />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  )
}
