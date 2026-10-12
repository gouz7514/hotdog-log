import { BackButton } from '@/components/Atom'
import { PortfolioDetail } from '@/components/Organism'
import { pageMetadata } from '@/lib/metadata'
import { getAllPortfolioIds, getPortfolioItem } from '@/lib/portfolio'
import { locales, toLocale } from '@/lib/translations'

export const dynamicParams = false

export function generateStaticParams() {
  const ids = getAllPortfolioIds()
  return locales.flatMap(locale => ids.map(id => ({ locale, id })))
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/portfolio/[id]'>) {
  const { locale, id } = await params
  const item = await getPortfolioItem(id, toLocale(locale))

  return pageMetadata({
    locale: toLocale(locale),
    path: `/portfolio/${id}`,
    title: item.title,
    description: item.summary,
  })
}

export default async function PortfolioDetailPage({
  params,
}: PageProps<'/[locale]/portfolio/[id]'>) {
  const { locale, id } = await params
  const item = await getPortfolioItem(id, toLocale(locale))

  return (
    <div className="page-container mb-10">
      <BackButton />
      <div className="mt-4">
        <PortfolioDetail item={item} />
      </div>
    </div>
  )
}
