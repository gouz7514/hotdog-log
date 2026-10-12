'use client'

import { usePathname } from 'next/navigation'

import { Locale, defaultLocale, localePath } from '@/lib/translations'

interface LanguageTogglerProps {
  locale: Locale
}

export function LanguageToggler({ locale }: LanguageTogglerProps) {
  const pathname = usePathname()
  const nextLocale = locale === 'ko' ? 'en' : 'ko'

  const basePath =
    locale === defaultLocale
      ? pathname
      : pathname.replace(new RegExp(`^/${locale}`), '') || '/'

  // proxy의 언어 자동 감지보다 사용자가 직접 고른 언어를 우선하기 위해 쿠키에 저장
  const saveLocale = () => {
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`
  }

  // 언어가 바뀌면 루트 레이아웃([locale])이 바뀌므로 클라이언트 내비게이션 대신 전체 페이지를 새로 로드한다
  // (<Link>로 이동하면 <head>의 테마 스크립트가 클라이언트에서 다시 렌더링되며 React 경고가 발생)
  return (
    <a
      href={localePath(nextLocale, basePath)}
      onClick={saveLocale}
      className="select-none"
    >
      <h4>{nextLocale.toUpperCase()}</h4>
    </a>
  )
}
