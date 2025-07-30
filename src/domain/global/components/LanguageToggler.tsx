import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useCallback } from 'react'



export function LanguageToggler() {
  const router = useRouter()
  const { locale, pathname, asPath, query } = router

  const toggleLanguage = useCallback(() => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }, [locale, router, pathname, asPath, query])

  return (
    <LanguageToggleContainer onClick={toggleLanguage}>
      <h4>{locale === 'ko' ? 'EN' : 'KO'}</h4>
    </LanguageToggleContainer>
  )
}

const LanguageToggleContainer = styled.div`
  cursor: pointer;
  user-select: none;
`