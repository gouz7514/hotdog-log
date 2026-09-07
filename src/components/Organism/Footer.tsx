import styled from '@emotion/styled'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useContext } from 'react'

import ThemeContext from '@/context/themeContext'
import { t } from '@/lib/translations'
import { theme } from '@/styles/theme'

import { Icon } from '../Atom'
import { IconGithub, IconGmail, IconLinkedIn } from '../Icon'

export function Footer() {
  const { locale } = useRouter()
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark

  return (
    <AppFooter>
      <ProfileLogo>
        <a href="https://github.com/gouz7514" target="blank">
          <Icon icon={<IconGithub isDark={isDark} />} />
        </a>
        <a href="https://www.linkedin.com/in/hakjae" target="blank">
          <Icon icon={<IconLinkedIn isDark={isDark} />} />
        </a>
        <a href="mailto:hakjae.dev@gmail.com" target="blank">
          <Icon icon={<IconGmail isDark={isDark} />} />
        </a>
      </ProfileLogo>
      <FooterLinks>
        <Link href="/privacy">
          {t(locale as 'ko' | 'en', 'footer.privacy')}
        </Link>
      </FooterLinks>
    </AppFooter>
  )
}

const AppFooter = styled.footer`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  bottom: 2rem;
  width: 100%;
`

const ProfileLogo = styled.div`
  margin-top: 40px;
  display: flex;
  align-items: center;
  gap: 24px;
`

const FooterLinks = styled.div`
  margin-top: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 0.85rem;

  a {
    color: var(--color-text);
    text-decoration: none;
    filter: brightness(0.6);

    &:hover {
      text-decoration: underline;
    }
  }
`
