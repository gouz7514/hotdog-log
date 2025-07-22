import styled from '@emotion/styled'
import Link from 'next/link'

import { Icon } from '@/components/Atom'
import { IconYoutube } from '@/components/Icon/IconYoutube'
import { ListContainer } from '@/components/Molecule'

export function Activities() {
  return (
    <ActivitiesStyle>
      <h2 className="text-blue">Activities</h2>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">오픈소스 기여</h4>
        </div>
        <ListContainer>
          <li>
            <a
              href="https://github.com/reactjs/ko.react.dev/pull/790"
              target="blank"
              className="text-blue"
            >
              리액트 공식문서 한글 번역
            </a>{' '}
            및{' '}
            <a
              href="https://github.com/reactjs/ko.react.dev/pull/830"
              target="blank"
              className="text-blue"
            >
              CI 오류
            </a>{' '}
            해결
          </li>
          <li>
            <a
              href="https://github.com/luciancah/nextjs-ko/pull/59"
              target="blank"
              className="text-blue"
            >
              Next.js 한글 번역
            </a>
          </li>
          <li>
            오픈 소스 기여를 통해 배운 내용을{' '}
            <Link
              href="/posts/contribute-to-react-document"
              className="text-blue"
            >
              개인 블로그에 기록
            </Link>
          </li>
        </ListContainer>
      </div>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">단국대 캡스톤 경진대회 금상</h4>
          <Link
            href="https://www.youtube.com/watch?v=RQQwxN8pxB0"
            target="blank"
          >
            <Icon icon={<IconYoutube />} width={24} height={24} />
          </Link>
        </div>
        <div className="experience-term">2020.03 ~ 2021.02</div>
        <ListContainer>
          <li>
            교내 시간표와 지도를 기반으로 한, 알람과 내비게이션 기능을 제공하는
            애플리케이션
          </li>
          <li>
            팀장으로서 각 구성원의 참여를 이끌어내고 협의를 통한 문제 해결
          </li>
          <li>
            메일을 통해 해당 프로젝트에 대해 문의받고 사람들에게 도움을 준 경험
            보유
          </li>
        </ListContainer>
      </div>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">카투사로 군 복무</h4>
        </div>
        <div className="experience-term">2015.03 ~ 2016.12</div>
        <ListContainer>
          <li>영어로 원활한 의사소통 가능</li>
          <li>커뮤니케이션 스킬 및 리더십 향상</li>
        </ListContainer>
      </div>
    </ActivitiesStyle>
  )
}

const ActivitiesStyle = styled.div`
  .experience-container {
    .experience-title-container {
      align-items: center;
      gap: 10px;
      margin-bottom: 0.3rem;
    }

    & ~ .experience-container {
      margin-top: 32px;
    }

    .experience-term {
      font-size: 14px;
      margin-bottom: 0.3rem;
    }

    a {
      text-decoration: underline;
    }
  }
`
