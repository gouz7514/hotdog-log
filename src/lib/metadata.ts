import { Locale, localePath } from './translations'

import type { Metadata } from 'next'

export const BASE_URL = 'https://hakjae.dev'
export const SITE_TITLE = "Hakjae's Dev Blog"
export const SITE_DESCRIPTION = 'Inspire, Record, Code'

interface PageMetadataOptions {
  locale: Locale
  path: string
  title?: string
  description?: string
}

// 페이지별 canonical / hreflang / Open Graph 메타데이터
export function pageMetadata({
  locale,
  path,
  title,
  description = SITE_DESCRIPTION,
}: PageMetadataOptions): Metadata {
  const url = localePath(locale, path)

  return {
    ...(title && { title }),
    description,
    alternates: {
      canonical: url,
      languages: {
        ko: localePath('ko', path),
        en: localePath('en', path),
        'x-default': localePath('ko', path),
      },
    },
    openGraph: {
      title: title ?? SITE_TITLE,
      description,
      type: 'website',
      url,
      images: [{ url: '/images/og_image.webp', width: 1200, height: 630 }],
    },
  }
}
