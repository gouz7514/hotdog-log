import Head from 'next/head'

import { MarkdownLayout } from '@/components/Template'
import { getPageData } from '@/lib/pages'

interface StaticPageProps {
  title: string
  summary: string
  contentHtml: string
  date?: string
}

export default function Privacy({ page }: { page: StaticPageProps }) {
  return (
    <>
      <Head>
        <title>{page.title}</title>
        <meta name="title" content={page.title} />
        <meta name="description" content={page.summary} />
        <meta name="og:title" content={page.title} key="og:title" />
        <meta
          name="og:description"
          content={page.summary}
          key="og:description"
        />
      </Head>
      <MarkdownLayout
        title={page.title}
        innerHtml={page.contentHtml}
        date={page.date}
      />
    </>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  const page = await getPageData('privacy', locale as 'ko' | 'en')

  return {
    props: {
      page,
    },
  }
}
