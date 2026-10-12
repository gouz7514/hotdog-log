import { NextResponse } from 'next/server'

import { defaultLocale, isLocale } from '@/lib/translations'

import type { NextRequest } from 'next/server'

// 첫 방문 시 루트(/)에서만 브라우저 언어를 보고 /en으로 보낸다 (기존 Pages Router i18n 동작 유지)
function getPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale && isLocale(cookieLocale)) return cookieLocale

  const languages = (request.headers.get('accept-language') ?? '')
    .split(',')
    .map(language => language.split(';')[0].trim().slice(0, 2))

  return languages.find(isLocale) ?? defaultLocale
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const [, firstSegment] = pathname.split('/')

  // /ko/... 로 들어오면 접두사 없는 주소로 정규화
  if (firstSegment === defaultLocale) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.slice(defaultLocale.length + 1) || '/'
    return NextResponse.redirect(url)
  }

  if (isLocale(firstSegment)) return NextResponse.next()

  if (pathname === '/' && getPreferredLocale(request) !== defaultLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/${getPreferredLocale(request)}`
    return NextResponse.redirect(url)
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${defaultLocale}${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  // _next, api, 정적 파일(sitemap.xml, robots.txt, 이미지 등)은 제외
  // 포스트 id에 점이 들어갈 수 있어(announcing-typescript-5.5) 확장자를 명시한다
  matcher: [
    '/((?!_next|api|.*\\.(?:xml|txt|ico|png|jpe?g|webp|gif|svg|json|pdf)$).*)',
  ],
}
