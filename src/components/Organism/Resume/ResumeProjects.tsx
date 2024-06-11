import styled from '@emotion/styled'

import Card from '@/components/Organism/Card'
import { PROJECTS } from '@/constants/constants'

const ResumeProjectsStyle = styled.div`
  .project-container {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-top: 12px;

    @media screen and (max-width: 600px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`

export default function ResumeProjects() {
  const COMPANY_PROJECTS = PROJECTS.filter(
    project => project.type === 'company',
  )

  return (
    <ResumeProjectsStyle>
      <h2 className="text-blue">PROJECTS</h2>
      <>
        <h3 className="text-blue">ABZ 주식회사</h3>
        <div className="project-container">
          {COMPANY_PROJECTS.map(project => (
            <Card
              key={project.id}
              image={project.image}
              title={project.title}
              tags={project.tags}
              period={project.period}
              route={project.route}
            />
          ))}
        </div>
      </>
    </ResumeProjectsStyle>
  )
}
