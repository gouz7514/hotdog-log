import styled from 'styled-components'
import Icon from './Icon'
import { IconGithub } from './icon/IconGIthub'
import { IconLinkedIn } from './icon/IconLinkedin'
import { IconGmail } from './icon/IconGmail'

const AppFooter = styled.footer`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  bottom: 2rem;
  width: 100%;
`

const ProfileLogo = styled.div`
  margin-top: 40px;
  display: flex;
  gap: 24px;
`

export default function Footer() {
  return (
    <>
      <AppFooter>
        <ProfileLogo>
          <a href="https://github.com/gouz7514" target='blank'>
            <Icon icon={<IconGithub />} />
          </a>
          <a href="https://www.linkedin.com/in/%ED%95%99%EC%9E%AC-%EA%B9%80-a23a7b271" target='blank'>
          <Icon icon={<IconLinkedIn />} />
          </a>
          <a href="mailto:gouz7514@gmail.com" target='blank'>
          <Icon icon={<IconGmail />} />
          </a>
        </ProfileLogo>
      </AppFooter>
    </>
    )
}