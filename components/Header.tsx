import { ReactNode } from 'react'

type HeaderProps = {
  page: string
}

export default function Header({ page }: HeaderProps) {
  return (
    <div>
      { page === 'Home' ? 
      (
        <div>
          This is Home Header
        </div>
      ) : 
      (
        <div>This is Normal header</div>
      )}
    </div>
  )
}