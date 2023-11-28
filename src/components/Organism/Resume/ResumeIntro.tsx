import { Fragment } from "react"

import styled from '@emotion/styled'

import Badge from "@/components/Molecule/Badge"

const ResumeIntroStyle = styled.div`
  margin-bottom: 12px;
`

export default function ResumeIntro() {
  return (
    <Fragment>
      <h2>
        프론트엔드 개발자,<br />
        김학재입니다
      </h2>
      <ResumeIntroStyle>
        <div className="big-paragraph">
          스타트업에서 웹 서비스를 개발/배포/운영한 경험이 있습니다.
          프론트엔드뿐 아니라 다양한 도메인에 걸쳐 서비스를 전반적으로 유지하고 개발했습니다.
        </div>
        <div className="big-paragraph mt-12">
          불편함을 방치하면 모두의 불편함이 될 수 있기에
          스스로 불편함을 해결하려는 자세를 갖춰야 좋은 개발자라고 생각합니다.
          저는 불편함을 불편해합니다. 서비스에 대한 책임감과 이해도를
          바탕으로 항상 고민하며, 주도적으로 솔루션을 제시해 해결하기 위해 노력합니다.
        </div>
      </ResumeIntroStyle>
      <div className="badge-place">
        <Badge
          content="PDF로 보기"
          link="https://drive.google.com/file/d/1FQ1IfrqY1Yn7ItXUC9ieULRjAL_mZUPW/view?usp=sharing"
        />
      </div>
    </Fragment>
  )
}