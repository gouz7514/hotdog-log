import React, { ReactNode } from 'react'
import Header from '../Header'

type AppLayoutProps = {
  children: ReactNode;
  page: string;
}

export default function AppLayout({ children, page } : AppLayoutProps) {
  return (
    <div>
      <Header page={page}/>
      { children }
    </div>
  )
}