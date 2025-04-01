import styled from '@emotion/styled'

import dayjs from 'dayjs'

import { Badge } from '@/components/Molecule'

const LAST_UPDATED = '2025.04.02'

const getDayFromLastUpdated = () => {
  return dayjs().diff(dayjs(LAST_UPDATED), 'day')
}

export function ResumeIntro() {
  return (
    <ResumeIntroStyle>
      <h2>
        3년 차, 프로덕트 엔지니어
        <br />
        <span className="text-blue">김학재</span>입니다
      </h2>
      <>
        <div className="big-paragraph mt-16">
          <span className="text-bold text-blue">
            사용자에게 최고의 가치를 제공하는 것을 최우선으로 합니다.
          </span>
          <br />
          고객과 직접 소통을 통해 원하는 바를 빠르게 파악하고 프로덕트에 반영한
          경험이 있으며,
          <br />
          “팀원들도 고객이다”라는 마음가짐으로 더 쓰기 좋은, 쓰고 싶은
          프로덕트를 만들어가고 있습니다.
          <br />
          내가 할 수 있는 일들을 누구보다 먼저 주도적으로 진행해 고객과 팀의
          긍정적인 반응을 얻은 경험이 있습니다.
        </div>
        <div className="big-paragraph mt-20">
          <span className="text-bold text-blue">
            팀의 성장을 통해 스스로 성장해 나가고자 합니다.
          </span>
          <br />
          팀의 성장은 곧 개개인의 성장으로 이어진다고 믿기에, 더 나은 팀을
          만들기 위해 고민하고 실천해 왔습니다.
          <br />
          다양한 직군의 동료들과 협업을 통해 팀과 개인의 비즈니스에 대한
          이해도를 높이기 위해 노력했으며, 빠른 성공과 실패를 통해 시장을
          선점하기 위해 끊임없이 다양한 시도를 하고 있습니다.
          <br />
          현재는 팀 내 문서 개선과 새로운 문화를 정착시키는 것을 시작으로 누구나
          일하고 싶은 팀을 만들어 나가고 있습니다.
        </div>
      </>
      <div className="resume-intro-footer">
        <Badge
          content="더 자세한 내용이 궁금하다면? 👋"
          link="https://www.canva.com/design/DAGLlKxYoag/P7IJPAsbTxGKeahTCL5CDQ/view#1"
        />
        <div className="last-updated">
          Last updated: {LAST_UPDATED} ({getDayFromLastUpdated()} days ago)
        </div>
      </div>
    </ResumeIntroStyle>
  )
}

const ResumeIntroStyle = styled.div`
  .resume-intro-footer {
    margin-top: 16px;
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
