import { LayoutProps } from '@/types/types'

import Header from '../Organism/Header'
import Footer from '../Organism/Footer'

export default function AppLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
