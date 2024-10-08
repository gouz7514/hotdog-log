import styled from '@emotion/styled'
import { useContext } from 'react'
import ThemeContext from '@/context/themeContext'
import { theme } from '@/styles/theme'

import { Icon } from '../Atom'

import { IconGithub, IconLinkedIn, IconGmail, IconVelog } from '../Icon'

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
  gap: 24px;
`

export function Footer() {
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark

  return (
    <AppFooter>
      <ProfileLogo>
        <a href="https://github.com/gouz7514" target="blank">
          <Icon icon={<IconGithub isDark={isDark} />} />
        </a>
        <a
          href="https://www.linkedin.com/in/%ED%95%99%EC%9E%AC-%EA%B9%80-a23a7b271"
          target="blank"
        >
          <Icon icon={<IconLinkedIn isDark={isDark} />} />
        </a>
        <a href="mailto:gouz7514@gmail.com" target="blank">
          <Icon icon={<IconGmail isDark={isDark} />} />
        </a>
        <a href="https://velog.io/@gouz7514" target="blank">
          <Icon icon={<IconVelog isDark={isDark} />} />
        </a>
      </ProfileLogo>
    </AppFooter>
  )
}
