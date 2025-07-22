import { ListContainer } from '@/components/Molecule'

export function Skills() {
  return (
    <div>
      <h2 className="text-blue">SKILLS</h2>
      <ListContainer>
        <li>React, Typescript 기반의 프론트엔드 개발 경험이 있습니다.</li>
        <li style={{ lineHeight: '1.6' }}>
          Nuxt, Vue를 활용한 경험이 있으며, 프레임워크의 라이프사이클에 대한
          이해를 바탕으로 네트워크 비용 최적화를 진행한 경험이 있습니다.
        </li>
        <li style={{ lineHeight: '1.6' }}>
          AWS를 다방면으로 활용한 경험이 있습니다. 정적/동적 배포에 있어 각각
          S3와 ECS를 활용한 파이프라인을 구축한 경험이 있습니다. CloudWatch를
          활용한 모니터링 및 Lambda를 활용한 비즈니스 로직 개발 경험을 보유하고
          있습니다.
        </li>
        <li style={{ lineHeight: '1.6' }}>
          프론트엔드 퍼포먼스 개선 경험이 있습니다. 페이지 성능 개선, 네트워크
          비용 최적화, 불필요한 로직 간소화 등 다양한 경험이 있습니다.
        </li>
        <li style={{ lineHeight: '1.6' }}>
          다양한 직군의 동료와 소통을 즐깁니다. 소통을 통한 팀과 개인 그리고
          제품의 성장을 함께 이끌어나가는 것을 좋아합니다.
        </li>
      </ListContainer>
    </div>
  )
}
