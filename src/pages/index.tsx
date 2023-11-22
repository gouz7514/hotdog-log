import styled from '@emotion/styled'
import Typed from 'react-typed'

import { colors } from '@/styles/colors'

const HomeStyle = styled.main`
  min-height: calc(100vh - 160px);
`

const ProfileImage = styled.div`
  overflow: hidden;
  display: block;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  background-color: ${colors.beige};
  background-image: url('/images/profile.webp');
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
    color: ${colors.blue};

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

export default function Home() {
  return (
    <>
      <HomeStyle className="main">
        <div className="d-flex flex-column align-items-center">
          <ProfileImage />
          <ProfileDescription>
            <div className="d-flex flex-column align-items-center">
              <Typed
                className="typed-text"
                strings={[
                  '소통하는 법을 아는',
                  '끊임없이 고민하는',
                  '소비자의 진심을 읽는',
                  '프론트엔드'
                ]}
                typeSpeed={100}
                backSpeed={100}
                loop
              />
              <h1>
                개발자 김학재입니다
              </h1>
            </div>
          </ProfileDescription>
        </div>
      </HomeStyle>
      {/* <Footer /> */}
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