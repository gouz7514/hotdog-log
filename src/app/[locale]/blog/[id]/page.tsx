import fs from 'fs'
import path from 'path'

import { MarkdownLayout } from '@/components/Template'
import { pageMetadata } from '@/lib/metadata'
import { getPostData } from '@/lib/posts'
import { locales, toLocale } from '@/lib/translations'

export const dynamicParams = false

// 모든 한국어 글에 대해 ko/en 경로를 모두 생성 (영어 버전이 없으면 한국어로 대체)
export function generateStaticParams() {
  const koDirectory = path.join(process.cwd(), 'src/content/posts/ko')
  const ids = fs
    .readdirSync(koDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))

  return locales.flatMap(locale => ids.map(id => ({ locale, id })))
}

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/blog/[id]'>) {
  const { locale, id } = await params
  const post = await getPostData(id, toLocale(locale))

  return pageMetadata({
    locale: toLocale(locale),
    path: `/blog/${id}`,
    title: post.title,
    description: post.summary,
  })
}

export default async function Post({
  params,
}: PageProps<'/[locale]/blog/[id]'>) {
  const { locale, id } = await params
  const post = await getPostData(id, toLocale(locale))

  return (
    <MarkdownLayout
      title={post.title}
      innerHtml={post.contentHtml}
      date={post.date}
      headings={post.headings}
    />
  )
}
