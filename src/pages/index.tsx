import styled from '@emotion/styled'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { overlay } from 'overlay-kit'

import { Button, Modal, ModalProps } from '@/domain/global'
import { t } from '@/lib/translations'

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
  const router = useRouter()
  const locale = router.locale as 'ko' | 'en'

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
            <h4 className="text-bold">{t(locale, 'home.title')}</h4>
            <p>{t(locale, 'home.subtitle')}</p>
          </div>
          <Button size="small" variant="primary" onClick={onClickResumeButton}>
            <span>{t(locale, 'home.learnMore')}</span>
          </Button>
        </div>
        <div className="big-paragraph mt-16" style={{ whiteSpace: 'pre-line' }}>
          {t(locale, 'home.description')}
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
