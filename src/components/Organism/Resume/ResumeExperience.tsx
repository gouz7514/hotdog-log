import styled from '@emotion/styled'
import Link from 'next/link'

import Icon from '@/components/Atom/Icon'
import IconYoutube from '@/components/Icon/IconYoutube'
import ListContainer from '@/components/Molecule/ListContainer'

const ResumeExperienceStyle = styled.div`
  .experience-container {
    .experience-title-container {
      align-items: center;
      gap: 10px;
    }
    
    & ~ .experience-container {
      margin-top: 24px;
    }

    .experience-term {
      margin: 6px 0;
    }
  }
`

export default function ResumeExperience() {
  return (
    <ResumeExperienceStyle>
      <h2 className="text-blue">
        EXPERIENCE
      </h2>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">
            단국대 캡스톤 경진대회 금상
          </h4>
          <Link href="https://www.youtube.com/watch?v=RQQwxN8pxB0" target='blank'>
            <Icon icon={<IconYoutube />} width={24} height={24} />
          </Link>
        </div>
        <div className="experience-term text-bold">
          2020.03 ~ 2021.02
        </div>
        <ListContainer>
          <li>
            ・ 단국대 시간표를 기반으로 한 알람, 단국대 지도를 기반으로 한 내비게이션 애플리케이션
          </li>
          <li>
            ・ 시중에 출시된 서비스(에브리타임, 단국대 공식 앱)의 부족한 점을 분석하고 보완
          </li>
          <li>
            ・ 팀장으로서 각 구성원의 참여를 이끌어내고 협의를 통한 문제 해결
          </li>
          <li>
            ・ 메일을 통해 해당 프로젝트에 대해 문의받고 도움을 준 경험 보유
          </li>
        </ListContainer>
      </div>
      <div className="experience-container">
        <h4 className="experience-title">
          TOEIC
        </h4>
        <div className="experience-term text-bold">
          2020.01
        </div>
        <ListContainer>
          <li>
            ・ 930점
          </li>
          <li>
            ・ 카투사로 복무하며 영어로 원활한 의사소통 경험
          </li>
        </ListContainer>
      </div>
    </ResumeExperienceStyle>
  )
}