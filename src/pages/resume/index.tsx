import styled from "styled-components"
import Divider from "../../../components/Divider"
import Badge from "../../../components/Badge"

const SkillContainer = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, auto));
  row-gap: 12px;

  @media screen and (min-width: 1000px) {
    grid-template-columns: repeat(5, 200px)
  }
`

const SkillTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const ProjectContainer = styled.div`
  margin-top: 24px;

  a {
    color: #366C2A;
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

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;

  .contact-container {
    display: flex;
    gap: 12px;
  }
`

export default function Resume() {
  const skills = {
    FE: [
      {
        name: 'Vue',
        score: 3
      },
      {
        name: 'Nuxt',
        score: 3
      },
      {
        name: 'Javascript',
        score: 3
      },
      {
        name: 'React',
        score: 2
      },
      {
        name: 'Next',
        score: 2
      },
      {
        name: 'Typescript',
        score: 2
      },
      {
        name: 'Storybook',
        score: 2
      },
      {
        name: 'Webpack',
        score: 2
      },
      {
        name: 'Graphql',
        score: 1
      },
    ],
    DEVOPS: [
      {
        name: 'AWS',
        score: 3
      },
      {
        name: 'Git',
        score: 3
      },
      {
        name: 'Docker',
        score: 2
      },
    ],
    BE: [
      {
        name: 'Python',
        score: 2
      },
      {
        name: 'Nginx',
        score: 1
      },
      {
        name: 'Django',
        score: 1
      },
    ],
  }

  const SkillBadgeClass = (score: number) => {
    switch (score) {
      case 3:
        return 'badge-primary'
      case 2:
        return 'badge-secondary'
      default:
        return 'badge-default'
    }
  }

  return (
    <>
      <div className="container">
        <div>
          <h1>
            게으른 개발자,<br />
            김학재입니다
          </h1>
          <div>
            프론트엔드 뿐 아니라 <span className="text-bold">다양한 도메인</span>에 관심을 갖고 고민합니다. <span className="text-bold">소통</span>의 중요성을 알고 실천하려고 노력합니다.
            소비자의 진심을 읽고 <span className="text-bold">나도 사용하고 싶은 프로덕트</span>를 만드는 일을 지향합니다.
          </div>
        </div>
        <Divider />
        <div>
          <h2>
            Skills
          </h2>
          <div className="mt-12">
            <h3>
              FE
            </h3>
            <SkillContainer>
              {
                skills.FE.map(skill => {
                  return (
                    <SkillTag key={ skill.name }>
                      <Badge content={skill.score} className={SkillBadgeClass(skill.score)} />
                      <span>
                        { skill.name }
                      </span>
                    </SkillTag>
                  )
                })
              }
            </SkillContainer>
          </div>
          <div className="mt-12">
            <h3>
              Devops
            </h3>
            <SkillContainer>
              {
                skills.DEVOPS.map(skill => {
                  return (
                    <SkillTag key={ skill.name }>
                      <Badge content={skill.score} className={SkillBadgeClass(skill.score)} />
                      <span>
                        { skill.name }
                      </span>
                    </SkillTag>
                  )
                })
              }
            </SkillContainer>
          </div>
          <div className="mt-12">
            <h3>
              BE
            </h3>
            <SkillContainer>
              {
                skills.BE.map(skill => {
                  return (
                    <SkillTag key={ skill.name }>
                      <Badge content={skill.score} className={SkillBadgeClass(skill.score)} />
                      <span>
                        { skill.name }
                      </span>
                    </SkillTag>
                  )
                })
              }
            </SkillContainer>
          </div>
        </div>
        <Divider />
        <div>
          <h2>
            Career
          </h2>
          <h3>
            ABZ 주식회사
          </h3>
          <div>
            2021.06 ~ 2023.04
          </div>
          <div className="d-flex flex-column">
            <span>
              ・ 국내 최대 바이오링크 서비스인 &quot;인포크링크&quot; 운영
            </span>
            <span>
              ・ &quot;인포크링크&quot; 서비스의 메인 프론트엔드 개발자로 근무
            </span>
          </div>
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
                  인포크링크 서비스의 Node 버전 업그레이드 (12.x → 16.x)
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
                    ・ CI / CD 소요 시간 50% 감소
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
                    ・ Cloudfront 요청 약 50% 절감
                  </li>
                  <li>
                    ・ Cloudfront 비용 약 40% 절감
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
                    ・ Event Bridge 활용을 통한 이미지 자동 갱신
                  </li>
                  <li>
                    ・ Serverless 환경 활용을 통한 효율 증가
                  </li>
                  <li>
                    ・ 캐싱 활용을 통한 렌더링 시간 단축
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
                    ・ Core Web Vital 개선 : LCP 3.1s → 0.5s
                  </li>
                  <li>
                    ・ 캐싱 적용, API 호출 횟수 약 15% 절감
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
                    ・ 주간 가입자 수 약 30% 증가
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
                    ・ 프로젝트 내용을 회사 블로그에 기고 <a href="https://medium.com/ab-z/%EA%B8%89%EA%B2%A9%ED%95%98%EA%B2%8C-%EC%A6%9D%EA%B0%80%ED%95%98%EB%8A%94-%ED%8A%B8%EB%9E%98%ED%94%BD-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%8C%80%EB%B9%84%ED%95%A0%EA%B9%8C-d92f2fbf2130" target="blank">(링크)</a>
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
        <ProfileContainer>
          <div>
            <h2>
              Contact
            </h2>
            <div className="contact-container">
              <span>
                Email
              </span>
              <span>
                Blog
              </span>
              <span>
                Github
              </span>
            </div>
          </div>
        </ProfileContainer>
      </div>
    </>
  )
}