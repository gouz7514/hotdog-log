import styled from '@emotion/styled'
import Typed from 'react-typed'

export default function Home() {
  return (
    <HomeStyle>
      <div className="d-flex flex-column align-items-center">
        <ProfileImage />
        <ProfileDescription>
          <div className="d-flex flex-column align-items-center">
            <Typed
              className="typed-text"
              strings={[
                '고객 경험에 미쳐있는',
                '제품을 최우선으로 생각하는',
                '팀을 만들어 나가는',
                '프로덕트 엔지니어',
              ]}
              typeSpeed={100}
              backSpeed={50}
            />
            <h1>김학재입니다</h1>
          </div>
        </ProfileDescription>
      </div>
    </HomeStyle>
  )
}

const HomeStyle = styled.main`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 2rem;
`

const ProfileImage = styled.div`
  overflow: hidden;
  display: block;
  border-radius: 24px;
  width: 300px;
  height: 300px;
  background-color: var(--color-beige);
  background-image: url('/images/profile.png');
  background-size: 300px;
  transition: all 0.3s ease-in-out;

  @media screen and (max-width: 450px) {
    width: 200px;
    height: 200px;
    background-size: 200px;
    transition: all 0.3s ease-in-out;
  }
`

const ProfileDescription = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .typed-text {
    font-size: 3em;
    font-weight: bold;
    color: var(--color-blue);

    @media screen and (max-width: 600px) {
      font-size: 2em;
    }
  }

  h1 {
    margin: 12px 0;

    @media screen and (max-width: 600px) {
      font-size: 2em;
    }
  }
`
