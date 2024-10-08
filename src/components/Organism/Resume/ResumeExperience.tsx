import styled from '@emotion/styled'
import Link from 'next/link'

import { Icon } from '@/components/Atom'
import { IconYoutube } from '@/components/Icon/IconYoutube'
import { ListContainer } from '@/components/Molecule'

export function ResumeExperience() {
  return (
    <ResumeExperienceStyle>
      <h2 className="text-blue">EXPERIENCE</h2>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">오픈소스 기여</h4>
        </div>
        <ListContainer>
          <li>
            리액트 공식문서 한글 번역 (
            <a
              href="https://github.com/reactjs/ko.react.dev/pull/790"
              target="blank"
              className="text-blue"
            >
              PR #790 - Translate: Versioning Policy
            </a>
            )
          </li>
          <li>
            리액트 공식 문서 한글 번역 프로젝트의 CI 오류 해결 (
            <a
              href="https://github.com/reactjs/ko.react.dev/pull/830"
              target="blank"
              className="text-blue"
            >
              PR #830
            </a>
            )
          </li>
          <li>
            Next.js 한글 번역 (
            <a
              href="https://github.com/luciancah/nextjs-ko/pull/59"
              target="blank"
              className="text-blue"
            >
              PR #59 - static-site-generation
            </a>
            )
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
            단국대 시간표를 기반으로 한 알람, 단국대 지도를 기반으로 한
            내비게이션 애플리케이션
          </li>
          <li>
            시중에 출시된 서비스(에브리타임, 단국대 공식 앱)의 부족한 점을
            분석하고 보완
          </li>
          <li>
            팀장으로서 각 구성원의 참여를 이끌어내고 협의를 통한 문제 해결
          </li>
          <li>메일을 통해 해당 프로젝트에 대해 문의받고 도움을 준 경험 보유</li>
        </ListContainer>
      </div>
      <div className="experience-container">
        <div className="d-flex experience-title-container">
          <h4 className="experience-title">카투사로 군 복무</h4>
        </div>
        <div className="experience-term">2015.03 ~ 2016.12</div>
        <ListContainer>
          <li>영어로 원활한 의사소통 가능</li>
          <li>2016년 올해의 카투사 수상</li>
        </ListContainer>
      </div>
    </ResumeExperienceStyle>
  )
}

const ResumeExperienceStyle = styled.div`
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
