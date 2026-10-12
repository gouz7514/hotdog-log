'use client'

import { useRouter } from 'next/navigation'

import { IconBack } from '../Icon'

export function BackButton() {
  const router = useRouter()

  return (
    <button
      type="button"
      aria-label="back"
      className="w-[30px] cursor-pointer"
      onClick={() => router.back()}
    >
      <IconBack className="size-[30px]" />
    </button>
  )
}
