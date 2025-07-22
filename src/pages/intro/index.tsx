import Head from 'next/head'

import { Divider } from '@/components/Atom'
import {
  Summary,
  Skills,
  Experience,
  Activities,
} from '@/components/Organism/Intro'

export default function Intro() {
  return (
    <>
      <Head>
        <title>핫재의 개발 블로그 | 소개</title>
        <meta name="title" content="핫재의 개발 블로그 | 소개" />
        <meta name="description" content="불편함을 불편해합니다" />
        <meta
          property="og:title"
          content="핫재의 개발 블로그 | 소개"
          key="og:title"
        />
        <meta
          property="og:url"
          content="https://hotjae.com/intro"
          key="og:url"
        />
        <meta
          property="og:description"
          content="불편함을 불편해합니다"
          key="og:description"
        />
      </Head>
      <div className="container">
        <Summary />
        <Divider />
        <Experience />
        <Divider />
        <Skills />
        <Divider />
        <Activities />
      </div>
    </>
  )
}
