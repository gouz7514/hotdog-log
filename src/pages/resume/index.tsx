import Divider from "@/components/Atom/Divider"
import ResumeIntro from '@/components/Organism/Resume/ResumeIntro'
import ResumeSkills from '@/components/Organism/Resume/ResumeSkills'
import ResumeCareer from '@/components/Organism/Resume/ResumeCareer'
import ResumeExperience from '@/components/Organism/Resume/ResumeExperience'
import ResumeProjects from '@/components/Organism/Resume/ResumeProjects'

export default function Resume() {
  return (
    <div className="container">
      <ResumeIntro />
      <Divider />
      <ResumeSkills />
      <Divider />
      <ResumeCareer />
      <Divider />
      <ResumeProjects />
      <Divider />
      <ResumeExperience />
    </div>
  )
}