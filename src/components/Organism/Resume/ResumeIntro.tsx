import styled from '@emotion/styled'

import Badge from '@/components/Molecule/Badge'

const ResumeIntroStyle = styled.div`
  .resume-intro-footer {
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @media screen and (max-width: 600px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;
    }

    .badge-place {
      display: flex;
      flex-direction: row;
      gap: 12px;
    }

    .last-updated {
      font-weight: 500;
      font-size: 85%;
      font-family: 'Fira Mono', source-code-pro, Menlo, Monaco, Consolas,
        'Courier New', monospace;
    }
  }
`

const lastUpdated = '2024-02-14'

export default function ResumeIntro() {
  const dayFromLastUpdated = Math.floor(
    (new Date().getTime() - new Date(lastUpdated).getTime()) /
      (1000 * 60 * 60 * 24),
  )

  return (
    <ResumeIntroStyle>
      <h2>
        프론트엔드 개발자,
        <br />
        <span className="text-blue">김학재</span>입니다
      </h2>
      <>
        <div className="big-paragraph">
          스타트업에서 웹 서비스를 개발/배포/운영한 경험이 있습니다.
          프론트엔드뿐 아니라 다양한 도메인에 걸쳐 서비스를 전반적으로 유지하고
          개발했습니다.
        </div>
        <div className="big-paragraph mt-12">
          불편함을 방치하면 모두의 불편함이 될 수 있기에 스스로 불편함을
          해결하려는 자세를 갖춰야 좋은 개발자라고 생각합니다. 저는 불편함을
          불편해합니다. 서비스에 대한 책임감과 이해도를 바탕으로 항상 고민하며,
          주도적으로 솔루션을 제시해 해결하기 위해 노력합니다.
        </div>
        <div className="big-paragraph mt-12">
          프로덕트의 개발 및 유지와 더불어 CS 응대와 같은 다양한 경험을 통해
          프론트엔드 개발자로서 성장해 왔습니다. 이와 함께 블로그, 오픈 소스
          기여, 프로젝트를 통해 성장하려는 자세를 바탕으로 부피뿐 아니라
          밀도있는 개발자로 성장해나가고 있습니다.
        </div>
      </>
      <div className="resume-intro-footer">
        <div className="badge-place">
          <Badge
            content="PDF로 보기"
            link="https://drive.google.com/file/d/1RR3AklQoC2eNUI8vIBJxvVCg4tSKW5PX/view?usp=sharing"
          />
          <Badge
            content="경력기술서"
            link="https://drive.google.com/file/d/1sEv1QKz6I5Dw3VM8B-unNj70WAVRQX8k/view?usp=sharing"
          />
        </div>
        <div className="last-updated">
          Last updated: {lastUpdated} ({dayFromLastUpdated} days ago)
        </div>
      </div>
    </ResumeIntroStyle>
  )
}
