import styled from '@emotion/styled'
import Link from 'next/link'

import LottieAnimation from '@/components/Organism/Lottie'
import AnimationNotFound from '../../public/lottie/lottie-not-found.json'

const NotFoundStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: calc(100vh - 150px);

  .guide {
    margin-bottom: 20px;
  }

  a {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #000;
    color: #fff;
    cursor: pointer;
  }
`

export default function Custom404() {
  return (
    <NotFoundStyle className="conatiner">
      <LottieAnimation json={AnimationNotFound} height={300} />
      <h3 className="guide">존재하지 않는 페이지입니다</h3>
      <Link href="/">
        <div>메인으로 돌아가기</div>
      </Link>
    </NotFoundStyle>
  )
}
