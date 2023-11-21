import styled from '@emotion/styled'
import Icon from './Icon'
import { IconGithub } from './icon/IconGIthub'
import { IconLinkedIn } from './icon/IconLinkedin'
import { IconGmail } from './icon/IconGmail'
import { IconVelog } from './icon/IconVelog'
import { themeState } from '@/store/theme'
import { useRecoilState } from 'recoil'

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

export default function Footer() {
  const [theme] = useRecoilState(themeState)

  return (
    <AppFooter>
      <ProfileLogo>
        <a href="https://github.com/gouz7514" target='blank'>
          <Icon icon={<IconGithub isDark={ theme.value === 'dark' } />} />
        </a>
        <a href="https://www.linkedin.com/in/%ED%95%99%EC%9E%AC-%EA%B9%80-a23a7b271" target='blank'>
            <Icon icon={<IconLinkedIn isDark={ theme.value === 'dark' } />} />
        </a>
        <a href="mailto:gouz7514@gmail.com" target='blank'>
          <Icon icon={<IconGmail isDark={ theme.value === 'dark' } />} />
        </a>
        <a href="https://velog.io/@gouz7514" target='blank'>
          <Icon icon={<IconVelog isDark={ theme.value === 'dark' } />} />
        </a>
      </ProfileLogo>
    </AppFooter>
  )
}