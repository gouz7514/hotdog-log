import { LottieAnimation } from '@/components/Organism'

import AnimationNotFound from '../../../public/lottie/lottie-not-found.json'

export default function NotFound() {
  return (
    <div className="flex h-[calc(100vh-150px)] flex-col items-center justify-center text-center">
      <LottieAnimation json={AnimationNotFound} height={300} />
      <h3 className="mb-5">존재하지 않는 페이지입니다</h3>
      {/* /en 하위 404에서 / 로 가면 locale이 바뀌므로 전체 페이지 로드 */}
      {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
      <a
        href="/"
        className="cursor-pointer rounded-[5px] bg-black px-5 py-2.5 text-white"
      >
        메인으로 돌아가기
      </a>
    </div>
  )
}
