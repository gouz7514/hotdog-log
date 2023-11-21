import LoadingLayout from "../../../components/layout/LoadingLayout"

import AnimationHotdog from '../../../public/lottie/lottie-hotdog.json'
import LottieAnimation from "../../../components/Lottie"

export default function Projects() {
  return (
    <LoadingLayout>
      <div className='container'>
        <div>
          <LottieAnimation json={AnimationHotdog} description="아직 준비중인 페이지입니다. 조금만 기다려주세요!" />
        </div>
      </div>
    </LoadingLayout>
  )
}