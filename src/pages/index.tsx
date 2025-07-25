import styled from '@emotion/styled'
import Image from 'next/image'

export default function Home() {
  return (
    <HomeStyle>
      <Image
        src="/images/profile.webp"
        alt="profile"
        width={300}
        height={300}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          flex: 1,
        }}
      />
      <ProfileDescription>
        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
          <p className="text-bold">김학재</p>
          <p>프론트엔드 개발자</p>
        </div>
        <div className="big-paragraph mt-16">
          최대한의 사용자에게 최고의 경험을 제공하는데 관심이 있습니다.
          프로덕트의 A부터 Z까지 개발해본 경험이 있습니다. 누구나 일하고 싶은
          팀을 만들어 나가는 것을 좋아합니다.
        </div>
      </ProfileDescription>
    </HomeStyle>
  )
}

const HomeStyle = styled.main`
  display: flex;
  min-height: calc(100vh - 180px);
  margin: 0 auto;
  gap: 20px;
  max-width: 1200px;
  padding: 2rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`

const ProfileDescription = styled.div`
  width: 100%;
  height: 0;
  flex: 1;
  padding-bottom: 50%;
`
