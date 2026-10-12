import dayjs from 'dayjs'
import Link from 'next/link'

import { LoadMoreList } from '@/components/Molecule'
import { pageMetadata } from '@/lib/metadata'
import { getAllPostData } from '@/lib/posts'
import { localePath, t, toLocale } from '@/lib/translations'

const PAGE_SIZE = 10

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog'>) {
  const locale = toLocale((await params).locale)
  return pageMetadata({ locale, path: '/blog' })
}

export default async function Blog({ params }: PageProps<'/[locale]/blog'>) {
  const locale = toLocale((await params).locale)
  const allPostsData = getAllPostData(locale)

  return (
    <div className="page-container mb-10 font-mono text-[0.9rem] sm:text-base">
      <LoadMoreList
        pageSize={PAGE_SIZE}
        loadMoreLabel={t(locale, 'posts.loadMore')}
      >
        {allPostsData.map(({ id, title, summary, tags, date }, index) => (
          <li key={id} className="border-b border-font">
            <Link
              href={localePath(locale, `/blog/${id}`)}
              className="group grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-3 gap-y-1 py-2 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <span>
                {String(allPostsData.length - index).padStart(2, '0')}
              </span>
              <span className="group-hover:underline">{title}</span>
              <span className="col-start-2 truncate opacity-60">{summary}</span>
              <span className="col-start-2 flex gap-3 text-[0.75rem] opacity-60 sm:text-[0.85rem]">
                <span className="whitespace-nowrap">
                  {dayjs(date).format('YYYY.MM.DD')}
                </span>
                <span className="truncate">{tags.join(', ')}</span>
              </span>
            </Link>
          </li>
        ))}
      </LoadMoreList>
    </div>
  )
}
