import styled from '@emotion/styled'

import Badge from '@/components/Molecule/Badge'
import Tooltip from '@/components/Molecule/Tooltip'

import { SKILLS } from '@/constants/constants'

const SkillContainer = styled.div`
  margin-top: 6px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(170px, auto));
  row-gap: 12px;

  @media screen and (min-width: 1000px) {
    grid-template-columns: repeat(5, 170px);
  }
`

const SkillTag = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

export default function ResumeSkills() {
  const SkillBadgeClass = (score: number) => {
    switch (score) {
      case 3:
        return 'badge-primary'
      case 2:
        return 'badge-default'
      default:
        return 'badge-minor'
    }
  }

  return (
    <>
      <div className="d-flex align-items-center">
        <h2 className="text-blue">SKILLS</h2>
        <Tooltip>
          <div className="text-bold">3 : 다수의 개발 경험</div>
          <div className="text-bold">2 : 간단한 개발 경험</div>
          <div className="text-bold">1 : 기초적 개발 경험</div>
        </Tooltip>
      </div>
      <>
        <h3>FE</h3>
        <SkillContainer>
          {SKILLS.FE.map(skill => {
            return (
              <SkillTag key={skill.name}>
                <Badge
                  content={skill.score}
                  className={SkillBadgeClass(skill.score)}
                />
                <span className="text-bold">{skill.name}</span>
              </SkillTag>
            )
          })}
        </SkillContainer>
      </>
      <div className="mt-16">
        <h3>Devops</h3>
        <SkillContainer>
          {SKILLS.DEVOPS.map(skill => {
            return (
              <SkillTag key={skill.name}>
                <Badge
                  content={skill.score}
                  className={SkillBadgeClass(skill.score)}
                />
                <span className="text-bold">{skill.name}</span>
              </SkillTag>
            )
          })}
        </SkillContainer>
      </div>
      <div className="mt-16">
        <h3>BE</h3>
        <SkillContainer>
          {SKILLS.BE.map(skill => {
            return (
              <SkillTag key={skill.name}>
                <Badge
                  content={skill.score}
                  className={SkillBadgeClass(skill.score)}
                />
                <span className="text-bold">{skill.name}</span>
              </SkillTag>
            )
          })}
        </SkillContainer>
      </div>
    </>
  )
}
