import en from '@/locales/en.json'
import ko from '@/locales/ko.json'

const translations = {
  ko,
  en,
}

export const locales = ['ko', 'en'] as const
export const defaultLocale = 'ko'

export type Locale = (typeof locales)[number]

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export function toLocale(value: string): Locale {
  return isLocale(value) ? value : defaultLocale
}

// 기본 언어(ko)는 접두사 없이, 그 외 언어는 /en 처럼 접두사를 붙인다
export function localePath(locale: Locale, path: string) {
  if (locale === defaultLocale) return path
  return path === '/' ? `/${locale}` : `/${locale}${path}`
}

export function getTranslation(locale: Locale) {
  return translations[locale]
}

export function t(locale: Locale, key: string) {
  const keys = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let value: any = translations[locale]

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k]
    } else {
      return key // fallback to key if translation not found
    }
  }

  return value
}
