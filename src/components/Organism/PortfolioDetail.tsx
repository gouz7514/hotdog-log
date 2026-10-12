import { PortfolioItem } from '@/types/types'

import { PortfolioThumbnail } from '../Molecule'

interface PortfolioDetailProps {
  item: Omit<PortfolioItem, 'id'> & { contentHtml: string }
}

export function PortfolioDetail({ item }: PortfolioDetailProps) {
  return (
    <>
      <PortfolioThumbnail
        title={item.title}
        image={item.image}
        className="w-32 sm:w-40"
      />
      <h2 className="mt-6 mb-2">{item.title}</h2>
      <p className="text-[1.05rem] break-keep opacity-60">{item.summary}</p>
      <div className="mt-4 flex gap-4">
        {item.links.map(({ label, url }) => (
          <a
            key={url}
            href={url}
            target="_blank"
            rel="noopener"
            className="underline"
          >
            {label} ↗
          </a>
        ))}
      </div>
      <div
        className="markdown-body mt-6"
        dangerouslySetInnerHTML={{ __html: item.contentHtml }}
      />
    </>
  )
}
