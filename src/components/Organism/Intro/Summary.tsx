import styled from '@emotion/styled'

import dayjs from 'dayjs'

// import { Badge } from '@/components/Molecule'

const LAST_UPDATED = '2025.04.09'

const getDayFromLastUpdated = () => {
  return dayjs().diff(dayjs(LAST_UPDATED), 'day')
}

export function Summary() {
  return (
    <SummaryStyle>
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
          실제 유저는 물론 팀원과 직접 소통을 통해 제품에 필요한 바를 빠르게
          파악하고 반영한 경험이 있으며, 내가 할 수 있는 일들을 먼저 주도적으로
          진행하는 자세를 갖추고 있습니다.
        </div>
        <div className="big-paragraph mt-20">
          팀과 함께 성장하는 법을 알고 있습니다. 빠르고 효과적인 시도를 필요로
          하는 팀에 속해, 다양한 직군의 동료들과 끊임없이 소통해 다양한 문제를
          해결한 경험이 있습니다.
        </div>
        <div className="big-paragraph mt-20">
          프론트엔드 개발자로서 하나의 프로덕트를 A부터 Z까지 개발한 경험이
          있으며, 인프라, 비용 개선 등을 진행한 경험이 있습니다.
        </div>
      </>
      <div className="summary-footer">
        {/* <Badge
          content="더 자세한 내용이 궁금하다면? 👋"
          link="https://www.canva.com/design/DAGLlKxYoag/P7IJPAsbTxGKeahTCL5CDQ/view#1"
        /> */}
        <div className="last-updated">
          Last updated: {LAST_UPDATED} ({getDayFromLastUpdated()} days ago)
        </div>
      </div>
    </SummaryStyle>
  )
}

const SummaryStyle = styled.div`
  .summary-footer {
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
