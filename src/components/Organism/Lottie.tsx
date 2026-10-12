'use client'

import dynamic from 'next/dynamic'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface LottieProps {
  json: Record<string, unknown>
  height?: number
}

export function LottieAnimation({ json, height = 300 }: LottieProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center">
      <Lottie animationData={json} style={{ height }} />
    </div>
  )
}
