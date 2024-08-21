import Head from 'next/head'

import { Divider } from '@/components/Atom'
import {
  ResumeIntro,
  ResumeSkills,
  ResumeCareer,
  ResumeProjects,
  ResumeExperience,
} from '@/components/Organism/Resume'

export default function Resume() {
  return (
    <>
      <Head>
        <title>핫재의 개발 블로그 | 이력서</title>
        <meta name="title" content="핫재의 개발 블로그 | 이력서" />
        <meta name="description" content="불편함을 불편해합니다" />
        <meta
          property="og:title"
          content="핫재의 개발 블로그 | 이력서"
          key="og:title"
        />
        <meta
          property="og:url"
          content="https://hotjae.com/resume"
          key="og:url"
        />
        <meta
          property="og:description"
          content="불편함을 불편해합니다"
          key="og:description"
        />
      </Head>
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
    </>
  )
}
