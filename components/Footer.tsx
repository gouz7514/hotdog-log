import Image from 'next/image'
import styled from 'styled-components'

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
            <Image
              src="/images/logo-github.webp"
              height={30}
              width={30}
              alt="github logo"
            />
          </a>
          <a href="https://www.linkedin.com/in/%ED%95%99%EC%9E%AC-%EA%B9%80-a23a7b271" target='blank'>
            <Image
              src="/images/logo-linkedin.webp"
              height={30}
              width={30}
              alt="linkedin logo"
            />
          </a>
          <a href="mailto:gouz7514@gmail.com" target='blank'>
            <Image
              src="/images/logo-gmail.webp"
              height={30}
              width={30}
              alt="gmail logo"
            />
          </a>
        </ProfileLogo>
      </AppFooter>
    </>
    )
}