import styled from '@emotion/styled'

import { ListContainer } from '@/components/Molecule'

import dayjs from 'dayjs'
import Link from 'next/link'
import { ResumeProjectItemList } from './ResumeProjectItemList'

const EMPLOYMENT_PERIOD = [
  {
    start: '2021.06.01',
    end: '2023.04.30',
  },
  {
    start: '2024.01.15',
    end: dayjs().format('YYYY.MM.DD'),
  },
]

const getCareerPeriod = () => {
  let totalMonths = 0
  EMPLOYMENT_PERIOD.forEach(period => {
    const start = dayjs(period.start)
    const end = dayjs(period.end)
    totalMonths += Math.round(end.diff(start, 'day') / 30)
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return `${years}년 ${months}개월`
}

export function ResumeWorkExperience() {
  return (
    <WrapperStyle>
      <h2 className="text-blue">WORK EXPERIENCE</h2>
      <h3 className="text-blue">ABZ 주식회사</h3>
      <div className="experience-term">
        2021.06 ~ 2023.04 / 2024.01 ~ ({getCareerPeriod()})
      </div>
      <ListContainer>
        <li>
          국내 1위 링크 인 바이오 서비스{' '}
          <a
            href="https://link.inpock.co.kr"
            target="blank"
            className="text-orange"
          >
            인포크링크
          </a>{' '}
          메인 프론트엔드 개발자
        </li>
        <li>
          프로덕트 개발, 아키텍처 & 비용 개선, 인프라 구축 등 다양한 도메인에
          대한 고민 및 개발
        </li>
        <li>
          주도적으로 프로덕트의 다양한 문제를 고민하고 이를 해결한 경험 보유
        </li>
        <li>
          <Link href="/posts/making-good-dev-team" className="text-blue">
            누구나 일하고 싶은 팀
          </Link>
          을 만들어나가기 위한 다양한 시도 및 노력
        </li>
      </ListContainer>
      <ResumeProjectItemList />
    </WrapperStyle>
  )
}

const WrapperStyle = styled.div`
  .experience-term {
    font-size: 14px;
    margin: 0.3rem 0;
  }

  a {
    text-decoration: underline;
  }
`
