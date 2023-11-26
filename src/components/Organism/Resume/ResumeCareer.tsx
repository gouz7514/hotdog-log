import styled from '@emotion/styled'

import ListContainer from '@/components/Molecule/ListContainer'

const ResumeCareerStyle = styled.div`
  .career-term {
    font-size: 14px;
    margin: 6px 0;
  }

  a {
    text-decoration: underline;
  }
`

export default function ResumeCareer() {
  return (
    <ResumeCareerStyle>
      <h2 className="text-blue">
        CAREER
      </h2>
      <h4 className="career-company">
        ABZ 주식회사
      </h4>
      <div className="career-term text-bold">
        2021.06 ~ 2023.04 (1년 11개월)
      </div>
      <ListContainer className="career-detail">
        <li>
          ・ 국내 1위 링크 인 바이오 서비스 <a href="https://link.inpock.co.kr" target="blank" className="text-orange text-bold">인포크링크</a> 메인 프론트엔드 개발자
        </li>
        <li>
          ・ 프론트엔드 뿐 아니라 다양한 도메인에 걸쳐 서비스의 전반적인 유지보수 및 개발
        </li>
        <li>
          ・ 직접 고객 응대를 통해 고객이 원하는 바를 파악하고 서비스의 품질 향상에 기여
        </li>
      </ListContainer>
    </ResumeCareerStyle>
  )
}