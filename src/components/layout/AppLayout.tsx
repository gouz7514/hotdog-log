import React, { ReactNode } from 'react'
import Header from '../Header'
import Footer from '../Footer'

type AppLayoutProps = {
  children: ReactNode;
  page: string;
}

export default function AppLayout({ children, page } : AppLayoutProps) {
  return (
    <div>
      <Header />
      { children }
      <Footer />
    </div>
  )
}