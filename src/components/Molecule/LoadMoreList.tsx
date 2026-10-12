'use client'

import { Children, ReactNode, useState } from 'react'

interface LoadMoreListProps {
  children: ReactNode
  pageSize: number
  loadMoreLabel: string
}

// 항목은 서버에서 렌더링해 children으로 받고, 클라이언트에서는 보여줄 개수만 관리한다
export function LoadMoreList({
  children,
  pageSize,
  loadMoreLabel,
}: LoadMoreListProps) {
  const [visibleCount, setVisibleCount] = useState(pageSize)
  const items = Children.toArray(children)

  return (
    <>
      <ul>{items.slice(0, visibleCount)}</ul>
      {visibleCount < items.length && (
        <button
          type="button"
          onClick={() => setVisibleCount(count => count + pageSize)}
          className="mt-6 w-full cursor-pointer py-3 underline"
        >
          {loadMoreLabel}
        </button>
      )}
    </>
  )
}
