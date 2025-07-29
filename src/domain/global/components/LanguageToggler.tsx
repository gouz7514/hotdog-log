import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

const LanguageToggleContainer = styled.div`
  cursor: pointer;
  user-select: none;

  h5 {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 0.7;
    }
  }
`

export function LanguageToggler() {
  const router = useRouter()
  const { locale, pathname, asPath, query } = router

  const toggleLanguage = useCallback(() => {
    const newLocale = locale === 'ko' ? 'en' : 'ko'
    router.push({ pathname, query }, asPath, { locale: newLocale })
  }, [locale, router, pathname, asPath, query])

  return (
    <LanguageToggleContainer onClick={toggleLanguage}>
      <h5>{locale === 'ko' ? 'EN' : 'KO'}</h5>
    </LanguageToggleContainer>
  )
}
