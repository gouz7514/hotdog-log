import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import styled from 'styled-components'

const CircleImage = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  overflow: hidden;
`

const ProfileDescription = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className="d-flex flex-column align-items-center">
          <CircleImage>
            <Image
              src="/images/profile.webp"
              height={300}
              width={300}
              alt="profile"
            />
          </CircleImage>
          <ProfileDescription>
            <h1>
              게으른 개발자, 김학재입니다
            </h1>
            <div className="profile-description">
              <span>
                1000만 MAU, 12만 회원 서비스의 메인 프론트엔드 개발자로 근무
              </span><br />
              <span>
                다양한 도메인에 관심을 갖고 고민할 줄 아는
              </span><br />
              <span>
                소통과 문제 해결 능력을 지니고 있는
              </span>
            </div>
          </ProfileDescription>
        </div>
      </main>
    </>
  )
}

export async function getStaticProps() {
  return {
    props: {
      page: 'Home'
    }
  }
}