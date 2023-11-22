import { LayoutProps } from '@/types/types'

import Header from '../Header'
import Footer from '../Footer'

export default function AppLayout({ children } : LayoutProps) {
  return (
    <div>
      <Header />
      { children }
      <Footer />
    </div>
  )
}