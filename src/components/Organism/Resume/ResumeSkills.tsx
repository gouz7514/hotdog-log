import { ListContainer } from '@/components/Molecule'

export function ResumeSkills() {
  return (
    <div>
      <h2 className="text-blue">SKILLS</h2>
      <ListContainer>
        <li>・ 언어 : Javascript, Typescript</li>
        <li>・ 프레임워크 및 라이브러리 : React, Next.js, Vue.js, Nuxt</li>
        <li>
          ・ 상태 관리 : React Context API, React Query, Recoil, Vue Query, Vuex
        </li>
        <li>・ 클라우드 서비스 : AWS</li>
        <li>・ 기타 도구 : GIthub Actions, Slack, Notion, FIgma</li>
      </ListContainer>
    </div>
  )
}
