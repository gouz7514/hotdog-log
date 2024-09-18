import styled from '@emotion/styled'

import { Project, ProjectItem } from '@/components/Molecule/ProjectItem'
import { ListContainer } from '@/components/Molecule'
import Link from 'next/link'

const PROJECTS: Array<Project> = [
  {
    title: '인포크마켓',
    term: '2024.01 ~ 2024.08',
    tldr: '크리에이터를 위한 공동구매 맞춤형 자사몰',
    description: (
      <ListContainer>
        <li>
          크리에이터와 구매자를 위한 기능 개발 (주문관리, 상품관리, 주문내역
          확인, 주문 취소 등)
        </li>
        <li>
          컴파운드 컴포넌트 패턴, 고차 컴포넌트를 활용한 유연하고 재사용 가능한
          구조 설계
        </li>
        <li>
          SEO 최적화가 어려운 S3 배포 환경에서 cloudfront function을 활용해 SEO
          최적화 및 메타데이터 제공
        </li>
        <li>에러 바운더리, 결제 과정 모니터링 구축을 통한 더 나은 UX 제공</li>
      </ListContainer>
    ),
    techStack: [
      'Typescript',
      'React',
      'React Query',
      'Recoil',
      'Emotion',
      'AWS',
    ],
  },
  {
    title: '인포크비즈니스 공동구매',
    term: '2024.01 ~ 2024.08',
    tldr: '편리한 공동구매의 운영을 가능하게 하는 브랜드용 서비스',
    description: (
      <ListContainer>
        <li>기존의 모바일 특화 UI를 PC에 맞춰 개편</li>
        <li>
          Utility Type, Enum 등 Typescript를 활용해 타입 안정성 및 가독성을 높임
        </li>
        <li>
          입금대기부터 취소대기까지 이루는 복잡한 주문 상태를 React Query를
          활용해 캐싱을 적용하고 핸들링
        </li>
        <li>
          React Context API를 활용해 공동구매에 필요한 정보를 쉽게 저장하고
          재사용할 수 있는 구조 구축
        </li>
      </ListContainer>
    ),
    techStack: [
      'Typescript',
      'Next.js',
      'React',
      'React Query',
      'React Hook Form',
      'styled-components',
      'AWS',
    ],
  },
  {
    title: '인포크링크',
    term: '2021.06 ~',
    tldr: '1,600만 MAU, 20만 회원을 보유한 국내 1위 링크 인 바이오 서비스',
    description: (
      <ListContainer>
        <li>
          다양한 블록의 추가, 친구 초대 이벤트 등 다양한 비즈니스 로직 구현
        </li>
        <li>
          아키텍처 개선, 비용 절감 등 프론트엔드를 넘어 모든 도메인에 걸쳐
          프로덕트의 개발 및 운영에 참여
        </li>
        <li>
          직접 CS 응대를 진행하며 고객들이 겪은 문제를 누구보다 잘 이해하고
          빠르게 해결한 경험 보유
        </li>
        <li>
          비용 및 성능 개선을 위해 문제와 해결책을 주도적으로 고민하고 진행한
          경험 보유
        </li>
        <li>
          <Link className="text-blue" href="/posts/automate-inpocklink-gallery">
            인포크링크 갤러리 자동화
          </Link>
          ,{' '}
          <Link
            className="text-blue"
            href="/projects/performance-improvement-with-vue-query"
          >
            Vue Query 도입을 통한 성능 개선
          </Link>
          ,{' '}
          <Link
            className="text-blue"
            href="/projects/create-server-with-docker"
          >
            도커를 활용한 서버 구축
          </Link>{' '}
          ,
          <Link className="text-blue" href="/projects/ids">
            인포크 디자인 시스템 (IDS)
          </Link>{' '}
          등
        </li>
      </ListContainer>
    ),
    techStack: ['Javascript', 'Nuxt', 'Vue.js', 'Vue Query', 'AWS'],
  },
]

export function ResumeProjectItemList() {
  return (
    <ListWrapper>
      {PROJECTS.map(project => (
        <ProjectItem key={`${project.title}`} project={project} />
      ))}
    </ListWrapper>
  )
}

const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
`
