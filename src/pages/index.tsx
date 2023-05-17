import styles from '@/styles/Home.module.css'
import styled from 'styled-components'
import Footer from '../../components/Footer'

const ProfileImage = styled.div`
  overflow: hidden;
  display: block;
  border-radius: 50%;
  width: 300px;
  height: 300px;
  background-color: beige;
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
  gap: 12px;
`

export default function Home() {
  return (
    <>
      <main className={styles.main}>
        <div className="d-flex flex-column align-items-center">
          <ProfileImage>
          </ProfileImage>

          <ProfileDescription>
            <div className="d-flex flex-column align-items-center">
              <h1>
                게으른 개발자<br />
                김학재입니다
              </h1>
            </div>
          </ProfileDescription>
        </div>
      </main>
      <Footer />
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