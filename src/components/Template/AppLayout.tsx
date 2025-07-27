import { Header, Footer } from '@/components/Organism'
import { LayoutProps } from '@/types/types'


export function AppLayout({ children }: LayoutProps) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  )
}
