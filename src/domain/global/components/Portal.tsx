import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ReactNode } from 'react'

type PortalProps = {
  children: ReactNode
  isOpen: boolean
}

export function Portal({ isOpen, children }: PortalProps) {
  const didMountRef = useRef(false)
  const [container, setContainer] = useState<Element | null>(null)

  useEffect(() => {
    if (didMountRef.current) return
    didMountRef.current = true

    if (document) {
      setContainer(document.body)
    }
  }, [])

  if (!container) return null

  return createPortal(isOpen && children, container)
}
