import en from '@/locales/en.json'
import ko from '@/locales/ko.json'

const translations = {
  ko,
  en,
}

export type Locale = 'ko' | 'en'

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
