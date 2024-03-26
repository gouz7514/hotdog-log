import styled from '@emotion/styled'

import ListContainer from '@/components/Molecule/ListContainer'

import dayjs from 'dayjs'

const ResumeCareerStyle = styled.div`
  .career-term {
    font-size: 14px;
    margin: 6px 0;
  }

  a {
    text-decoration: underline;
  }
`

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
    totalMonths += Math.floor(end.diff(start, 'day') / 30)
  })

  const years = Math.floor(totalMonths / 12)
  const months = totalMonths % 12

  return `${years}년 ${months}개월`
}

export default function ResumeCareer() {
  return (
    <ResumeCareerStyle>
      <h2 className="text-blue">CAREER</h2>
      <h4 className="career-company">ABZ 주식회사</h4>
      <div className="career-term text-bold">
        2021.06 ~ 2023.04 / 2024.01 ~ ({getCareerPeriod()})
      </div>
      <ListContainer className="career-detail">
        <li>
          ・ 국내 1위 링크 인 바이오 서비스{' '}
          <a
            href="https://link.inpock.co.kr"
            target="blank"
            className="text-orange text-bold"
          >
            인포크링크
          </a>{' '}
          메인 프론트엔드 개발자
        </li>
        <li>
          ・ 프론트엔드 뿐 아니라 다양한 도메인에 걸쳐 서비스의 전반적인
          유지보수 및 개발
        </li>
        <li>・ 시장에 존재하지 않았던 서비스에 대한 고민 및 개발</li>
        <li>・ 일하고 싶은 개발팀을 만들어나가기 위한 다양한 시도 및 노력</li>
      </ListContainer>
    </ResumeCareerStyle>
  )
}
