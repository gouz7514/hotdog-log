import { notFound } from 'next/navigation'

// 매칭되지 않는 경로를 [locale]/not-found.tsx로 보내기 위한 catch-all
export default function CatchAll() {
  notFound()
}
