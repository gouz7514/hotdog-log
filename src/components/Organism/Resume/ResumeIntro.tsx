import { Fragment } from "react"

import Badge from "@/components/Badge"

export default function ResumeIntro() {
  return (
    <Fragment>
      <h1>
        프론트엔드 개발자,<br />
        김학재입니다
      </h1>
      <div style={{ marginBottom: '12px' }}>
        <div className="big-paragraph">
          소비자의 진심을 읽고 나도 사용하고 싶은 프로덕트의 개발을 지향합니다.
          프론트엔드 뿐 아니라 다양한 도메인, 새로운 기술에 대해 관심을 갖고 고민합니다.
          다양한 데이터를 기반으로 한 소통, 의사결정을 통해 목표를 달성하는 팀을 만들어 나가고 싶습니다.
          체계적인 개발 문화, 뚜렷한 목표를 갖고 열심히 고민하는 문화를 갈망합니다.
        </div>
      </div>
      <Badge content="PDF로 보기" link="https://drive.google.com/file/d/1ZoEpNtpuxgspP8kb5P5YFdRwt5dWOa21/view?usp=sharing" />
    </Fragment>
  )
}