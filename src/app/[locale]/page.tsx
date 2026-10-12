import Link from 'next/link'

import { pageMetadata } from '@/lib/metadata'
import { localePath, toLocale } from '@/lib/translations'

const MENUS = [
  { label: 'Blog', path: '/blog' },
  { label: 'Portfolio', path: '/portfolio' },
]

export async function generateMetadata({ params }: PageProps<'/[locale]'>) {
  const locale = toLocale((await params).locale)
  return pageMetadata({ locale, path: '/' })
}

export default async function Home({ params }: PageProps<'/[locale]'>) {
  const locale = toLocale((await params).locale)

  return (
    <main className="page-container flex min-h-[calc(100vh-180px)] flex-col justify-center">
      <ul className="flex flex-col gap-4">
        {MENUS.map(({ label, path }) => (
          <li key={path}>
            <Link href={localePath(locale, path)} className="hover:underline">
              <h2>{label}</h2>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
