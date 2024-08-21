import { LayoutProps } from '@/types/types'

import { Header, Footer } from '@/components/Organism'

export function AppLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
