import React from 'react'

interface MdxLayoutProps {
  children: React.ReactNode
}

export default function MdxLayout({ children }: MdxLayoutProps) {
  return (
    <div className="container">
      {children}
    </div>
  )
}