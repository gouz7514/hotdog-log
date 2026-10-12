import { Modal, PortfolioThumbnail } from '@/components/Molecule'
import { PortfolioDetail } from '@/components/Organism'
import { pageMetadata } from '@/lib/metadata'
import { getAllPortfolioItems, getPortfolioItem } from '@/lib/portfolio'
import { t, toLocale } from '@/lib/translations'
import { portfolioCategories } from '@/types/types'

const CATEGORY_LABELS = {
  web: 'Web',
  app: 'App',
  etc: 'Etc',
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/portfolio'>) {
  const locale = toLocale((await params).locale)
  return pageMetadata({ locale, path: '/portfolio', title: 'Portfolio' })
}

export default async function Portfolio({
  params,
}: PageProps<'/[locale]/portfolio'>) {
  const locale = toLocale((await params).locale)
  const items = await Promise.all(
    getAllPortfolioItems(locale).map(async item => ({
      ...item,
      detail: await getPortfolioItem(item.id, locale),
    })),
  )

  return (
    <div className="page-container mb-10">
      <p className="mb-8 text-[1.1rem]">{t(locale, 'portfolio.intro')}</p>
      {portfolioCategories.map(category => {
        const categoryItems = items.filter(item => item.category === category)
        // 아직 만든 게 없는 카테고리는 숨긴다
        if (categoryItems.length === 0) return null

        return (
          <section key={category} className="mt-6 first:mt-0">
            <h3 className="mb-4 border-b border-font pb-1 font-mono">
              {CATEGORY_LABELS[category]}
            </h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
              {categoryItems.map(({ id, title, summary, image, detail }) => (
                <li key={id}>
                  <Modal
                    title={title}
                    trigger={
                      <button
                        type="button"
                        className="group block w-full cursor-pointer text-left"
                      >
                        <PortfolioThumbnail
                          title={title}
                          image={image}
                          className="transition-transform duration-200 group-hover:scale-[1.03]"
                        />
                        <div className="mt-3 font-semibold group-hover:underline">
                          {title}
                        </div>
                        <div className="mt-1 text-[0.9rem] leading-normal break-keep opacity-60">
                          {summary}
                        </div>
                      </button>
                    }
                  >
                    <PortfolioDetail item={detail} />
                  </Modal>
                </li>
              ))}
            </ul>
          </section>
        )
      })}
    </div>
  )
}
