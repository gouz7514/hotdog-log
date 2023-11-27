import Lottie from 'lottie-react'
import styled from '@emotion/styled'

interface LottieProps {
  json: Record<string, any>
  height?: number
  description: string
}

const LottieWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .lottie-description {
    text-align: center;
  }

  h3 {
    word-break: keep-all;
  }
`

export default function LottieAnimation({ json, height = 300 }: LottieProps) {
  return (
    <LottieWrapper>
      <Lottie animationData={json} style={{ height }} />
      <div className="lottie-description">
      </div>
    </LottieWrapper>
  )
}