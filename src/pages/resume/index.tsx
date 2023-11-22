import styled from '@emotion/styled'

import Divider from "@/components/Divider"
import Badge from "@/components/Badge"
import ResumeIntro from '@/components/Organism/Resume/ResumeIntro'
import ResumeSkills from '@/components/Organism/Resume/ResumeSkills'
import ResumeCareer from '@/components/Organism/Resume/ResumeCareer'

const ProjectContainer = styled.div`
  margin-top: 30px;

  a {
    color: #0066cc;
    font-weight: bold;
    text-decoration: underline;
  }

  .project-detail {
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .project-tech {
    .project-tech-item {
      display: flex;
      gap: 4px;
    }
  }
`

export default function Resume() {
  return (
    <div className="container">
      <ResumeIntro />
      <Divider />
      <ResumeSkills />
      <Divider />
      <ResumeCareer />
      <Divider />
      <div>
        <h2>Projects</h2>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              노드 버전 변경
            </h4>
            <div>
              2023.04
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크링크 서비스의 Node 버전 업그레이드
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ 레거시 코드의 개선
                </li>
                <li>
                  ・ 최신 라이브러리 설치 가능 환경 구성
                </li>
                <li>
                  ・ <span className="text-blue text-bold">CI / CD 소요 시간 50% 감소</span>
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Nuxt" />
                <Badge content="Webpack" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              CloudFront 비용 최적화
            </h4>
            <div>
              2023.04
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크링크 서비스의 CloudFront 요청 및 비용 절감
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ chunk 갯수 4 ~ 50% 절감
                </li>
                <li>
                  ・ <span className="text-blue text-bold">Cloudfront 요청 약 50% 절감</span>
                </li>
                <li>
                  ・ <span className="text-blue text-bold">Cloudfront 비용 약 40% 절감</span>
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Nuxt" />
                <Badge content="Webpack" />
                <Badge content="Vue" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              갤러리 페이지 자동화
            </h4>
            <div>
              2023.03
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크링크 갤러리 페이지의 자동화 아키텍처 개발
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ Event Bridge 활용 → 이미지 자동 갱신
                </li>
                <li>
                  ・ Serverless 환경 활용 → 업무 효율 증가
                </li>
                <li>
                  ・ 캐싱 활용 → 렌더링 시간 단축
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="AWS" />
                <Badge content="Typescript" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              vue-query 도입
            </h4>
            <div>
              2022.12 ~ 2023.01
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크링크 서비스에 vue-query 도입
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ Core Web Vital 개선 : <span className="text-bold text-blue">LCP 3.1s → 0.5s</span>
                </li>
                <li>
                  ・ 캐싱 적용, API 호출 횟수 약 15% 절감
                </li>
                <li>
                  ・ 관련 내용을 <a href="https://velog.io/@gouz7514/%EC%9A%B0%EB%8B%B9%ED%83%95%ED%83%95-vue-query-%EC%A0%81%EC%9A%A9%EA%B8%B0" target="blank">블로그</a>에 정리 
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Vue" />
                <Badge content="Nuxt" />
                <Badge content="Javascript" />
                <Badge content="vue-query" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              미들웨어 리팩토링
            </h4>
            <div>
              2022.11
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크링크 서비스 내, 미들웨어 로직의 리팩토링
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ nuxt 프레임워크에 대한 이해도 향상
                </li>
                <li>
                  ・ 서버 / 클라이언트 사이드 코드의 명확한 분리
                </li>
                <li>
                  ・ 유효성 체크 로직 통일
                </li>
                <li>
                  ・ 인증 관련 CS 인입 감소
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Vue" />
                <Badge content="Nuxt" />
                <Badge content="Javascript" />
                <Badge content="vuex" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              블록화
            </h4>
            <div>
              2022.07 ~ 2022.08
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                {"인포크링크에 '블록' 개념 도입 및 개발"}
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ 다양한 형태의 링크에 대한 유저들의 니즈 해결
                </li>
                <li>
                  ・ <span className="text-blue text-bold">주간 가입자 수 약 30% 증가</span>
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Vue" />
                <Badge content="Nuxt" />
                <Badge content="Javascript" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              도커라이징
            </h4>
            <div>
              2021.12 ~ 2022.01
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                도커를 활용한 인포크링크 서버 아키텍처 구현
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ ECS를 활용, 더 빠르고 간단한 오케스트레이션이 가능한 서버 구축
                </li>
                <li>
                  ・ 더 큰 부하를 감당 가능한 서버 구성
                </li>
                <li>
                  ・ 프로젝트 내용을 <a href="https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130" target="blank">회사 블로그</a>에 기고
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Django" />
                <Badge content="Nginx" />
                <Badge content="Docker" />
                <Badge content="AWS" />
              </div>
            </div>
          </div>
        </ProjectContainer>
        <ProjectContainer>
          <div className="project-title">
            <h4>
              디자인 시스템
            </h4>
            <div>
              2021.06 ~ 2021.09
            </div>
          </div>
          <div className="project-detail">
            <div className="project-description">
              <h5>설명</h5>
              <div>
                인포크 디자인 시스템 (IDS) 개발 및 유지 / 보수
              </div>
            </div>
            <div className="project-result">
              <h5>결과</h5>
              <ul>
                <li>
                  ・ 산재해있던 디자인 및 코드의 컴포넌트화
                </li>
                <li>
                  ・ 향후 프로젝트의 개발 난이도 및 개발 시간 감소
                </li>
                <li>
                  ・ <a href="https://inpock.github.io" target="blank">스토리북</a>을 활용해 개발 및 배포
                </li>
              </ul>
            </div>
            <div className="project-tech">
              <h5>기술</h5>
              <div className="project-tech-item">
                <Badge content="Vue" />
                <Badge content="Storybook" />
              </div>
            </div>
          </div>
        </ProjectContainer>
      </div>
      <Divider />
      <div>
        <h2>Awards</h2>
        <div>
          <h4>
            단국대 캡스톤 경진대회 금상
          </h4>
          <ul>
            <li>
              ・ 단국대 시간표를 기반으로 한 알람, 단국대 지도를 기반으로 한 네비게이션 구현
            </li>
            <li>
              ・ 시중에 출시된 서비스(에브리타임, 단국대 앱)의 부족한 점을 분석하고 보완한 프로젝트
            </li>
            <li>
              ・ 팀장으로서 각 구성원의 참여를 이끌어내고 협의를 통한 문제 해결
            </li>
            <li>
              ・ 메일을 통해 해당 프로젝트에 대해 문의를 받고 도움을 준 경험이 있음
            </li>
          </ul>
        </div>
      </div>
      <Divider />
      <div>
        <h2>Education</h2>
        <div>
          <h4>단국대학교</h4>
          <ul>
            <li>
              ・ 응용컴퓨터공학과 학사 졸업
            </li>
            <li>
              ・ 캡스톤 경진대회 금상 수상
            </li>
          </ul>
        </div>
      </div>
      <Divider />
      <div>
        <h2>ETC</h2>
        <div>
          <h4>정보처리기사</h4>
          <ul>
            <li>
              ・ 휴학 기간을 활용, 전공 지식을 바탕으로 자격증 취득
            </li>
          </ul>
          <h4 style={{ "marginTop": "12px" }}>TOEIC</h4>
          <ul>
            <li>
              ・ 930
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}