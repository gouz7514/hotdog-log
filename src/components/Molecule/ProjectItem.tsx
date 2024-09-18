import styled from '@emotion/styled'
import { Badge } from './Badge'

export interface Project {
  title: string
  term: string
  tldr: string
  techStack: Array<string>
  description: React.ReactNode
}

interface ProjectItemProps {
  project: Project
}

export function ProjectItem(props: ProjectItemProps) {
  const { project } = props
  return (
    <ProjectItemWrapper>
      <section>
        <h4>{project.title}</h4>
        <div className="project-item-term">{project.term}</div>
      </section>
      <section>
        <h5 className="section-title">TL;DR</h5>
        <div>{project.tldr}</div>
      </section>
      <section className="project-description">
        <h5 className="section-title">What Did I Do</h5>
        <div>{project.description}</div>
      </section>
      <section>
        <h5 className="section-title">Tech Stack</h5>
        <div className="tech-stack-container">
          {project.techStack.map(tech => (
            <Badge key={`${tech}`} content={tech} size="small" />
          ))}
        </div>
      </section>
    </ProjectItemWrapper>
  )
}

const ProjectItemWrapper = styled.div`
  margin-top: 1.5rem;

  .project-item-term {
    font-size: 14px;
    margin-top: 0.3rem;
  }

  section {
    .section-title {
      margin-bottom: 0.2rem;
    }
  }

  section ~ section {
    margin-top: 0.8rem;
  }

  .tech-stack-container {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
`
