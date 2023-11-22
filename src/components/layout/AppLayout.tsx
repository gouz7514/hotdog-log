import { ReactNode } from 'react'

import Header from '../Header'
import Footer from '../Footer'

type AppLayoutProps = {
  children: ReactNode;
}

export default function AppLayout({ children } : AppLayoutProps) {
  return (
    <div>
      <Header />
      { children }
      <Footer />
    </div>
  )
}