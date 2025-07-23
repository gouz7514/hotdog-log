import styled from '@emotion/styled'

import { ListContainer } from '@/components/Molecule'

import dayjs from 'dayjs'
import Link from 'next/link'

const EMPLOYMENT_PERIOD = [
  {
    start: '2021-06-01',
    end: '2023-04-30',
  },
  {
    start: '2024-01-15',
    end: dayjs().format('YYYY-MM-DD'),
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

export function Experience() {
  return (
    <WrapperStyle>
      <h2 className="text-blue">Experience</h2>
      <h3>ABZ 주식회사</h3>
      <div className="experience-term">
        2021.06 ~ 2023.04 / 2024.01 ~ ({getCareerPeriod()})
      </div>
      <ListContainer>
        <li>
          30만 유저, 2,000만 MAU를 지닌{' '}
          <a
            href="https://link.inpock.co.kr"
            target="blank"
            className="text-blue"
          >
            인포크링크
          </a>
          의 프론트엔드 개발/유지/보수
        </li>
        <li style={{ lineHeight: '1.6' }}>
          유저 경험을 해칠 수 있는 문제를 주도적으로 찾아서 개선 : 서버 상태
          캐싱을 통한 성능 개선 (api 호출 횟수 15%, LCP 80% 개선), 인증 로직
          개선을 통한 인증 관련 CS 인입 100% 감소
        </li>
        <li style={{ lineHeight: '1.6' }}>
          비즈니스 로직 개선 및 개발자들의 생산성 향상 :{' '}
          <Link href="/posts/what-is-ping-request" className="text-blue">
            ping request를 활용한 데이터 전송 로직 개선,
          </Link>{' '}
          <Link
            href="/posts/모노레포-환경에서-docker-활용하기"
            className="text-blue"
          >
            nextjs standalone을 활용한 docker 경량화,
          </Link>{' '}
          <Link
            href="/posts/refactoring-with-declarative-code"
            className="text-blue"
          >
            선언적 코드를 활용한 생산성 향상
          </Link>
        </li>
        <li>
          <Link href="/posts/making-good-dev-team" className="text-blue">
            누구나 일하고 싶은 팀
          </Link>
          을 만들어나가기 위한 다양한 시도 및 노력
        </li>
      </ListContainer>
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
