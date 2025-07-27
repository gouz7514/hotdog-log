import styled from '@emotion/styled'
import Image from 'next/image'
import { overlay } from 'overlay-kit'

import { Button, Modal, ModalProps } from '@/domain/global'

function ResumeDialog({ isOpen, onClose }: ModalProps) {
  const handleKoreanResume = () => {
    window.open('/resume_ko.pdf', '_blank')
  }

  const handleEnglishResume = () => {
    window.open('/resume.pdf', '_blank')
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className="d-flex flex-column"
        style={{ gap: '24px', padding: '16px' }}
      >
        <Button size="medium" variant="primary" onClick={handleKoreanResume}>
          한국어 📄
        </Button>
        <Button size="medium" variant="secondary" onClick={handleEnglishResume}>
          English 📄
        </Button>
      </div>
    </Modal>
  )
}

export default function Home() {
  const onClickResumeButton = () => {
    overlay.open(({ isOpen, close }) => (
      <ResumeDialog isOpen={isOpen} onClose={close} />
    ))
  }

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
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center" style={{ gap: '8px' }}>
            <p className="text-bold">김학재</p>
            <p>프론트엔드 개발자</p>
          </div>
          <Button size="small" variant="primary" onClick={onClickResumeButton}>
            <span>더 알아보기</span>
          </Button>
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
