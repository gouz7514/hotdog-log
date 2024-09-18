import styled from '@emotion/styled'

import dayjs from 'dayjs'

import { Badge } from '@/components/Molecule'

const LAST_UPDATED = '2024.09.12'

const getDayFromLastUpdated = () => {
  return dayjs().diff(dayjs(LAST_UPDATED), 'day')
}

export function ResumeIntro() {
  return (
    <ResumeIntroStyle>
      <h2>
        불편함을 불편해하는 개발자,
        <br />
        <span className="text-blue">김학재</span>입니다
      </h2>
      <>
        <div className="big-paragraph">
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          3년차 프론트엔드 개발자로 국내 1위 바이오링크 서비스, "인포크링크"를
          전반적으로 개발하고 운영했습니다.
          <br />이 과정에서 단순 기능 구현을 넘어 인프라 최적화, 비용 개선 등
          다양한 도메인에 대해 배우고 성장했습니다.
        </div>
        <div className="big-paragraph mt-16">
          <span className="text-bold">불편함을 불편해하는 개발자입니다.</span>
          <br />
          인증 로직 개선을 통해 고객의 불편함을, AWS 아키텍처 및 비용의 최적화를
          통해 개발팀의 불편함을 해소한 경험이 있으며, 이 모든 과정을 주도적으로
          진행해 방치된 불편함이 모두의 불편함이 되지 않도록 노력했습니다.
        </div>
        <div className="big-paragraph mt-16">
          <span className="text-bold">
            다양한 문제를 해결하고 비즈니스 성장에 기여하는 일을 최우선으로
            합니다.
          </span>
          <br />
          프로덕트에 대한 책임감과 이해를 바탕으로 시장에 없던 서비스를 고민하고
          개발한 경험이 있습니다.
          <br />이 과정에서 다양한 직군의 동료들은 물론, 직접 CS 응대를 통해
          고객과 소통하고 문제를 해결해 더 나은 프로덕트를 만든 경험이 있습니다.
        </div>
        <div className="big-paragraph mt-16">
          <span className="text-bold">
            함께 일하고 싶은 개발 문화, 회사를 만들어 나가기 위해 노력합니다.
          </span>
          <br />
          개발팀의 전체적인 문서와 온보딩 과정을 개선하고 이를 채용 과정에서
          활용한 경험이 있습니다.
          <br />
          현재는 주도적으로 새로운 개발 문화를 정착시키는 것을 시작으로 누구나
          한번쯤 일하고 싶은 개발팀을 만들어 나가는 중에 있습니다.
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
