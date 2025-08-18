import fs from 'fs'
import path from 'path'

import Head from 'next/head'

import { MarkdownLayout } from '@/components/Template'
import { getPostData } from '@/lib/posts'

interface PostProps {
  title: string
  contentHtml: string
  summary: string
  date: string
  headings?: Array<{ level: number; text: string; id: string }>
}

export default function Post({ post, id }: { post: PostProps; id: string }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="title" content={post.title} />
        <meta name="description" content={post.summary} />
        <meta name="og:title" content={post.title} key="og:title" />
        <meta
          name="og:url"
          content={`https://hakjae.dev/posts/${id}`}
          key="og:url"
        />
        <meta
          name="og:description"
          content={post.summary}
          key="og:description"
        />
      </Head>
      <MarkdownLayout
        title={post.title}
        innerHtml={post.contentHtml}
        date={post.date}
        headings={post.headings}
      />
    </>
  )
}

export async function getStaticPaths() {
  const postsDirectory = path.join(process.cwd(), 'src/content/posts')
  const koDirectory = path.join(postsDirectory, 'ko')

  const koFileNames = fs.existsSync(koDirectory)
    ? fs
        .readdirSync(koDirectory)
        .filter((fileName: string) => fileName.endsWith('.md'))
    : []

  const pathsWithLocale: Array<{ params: { id: string }; locale: string }> = []

  // 모든 한국어 글에 대해 한국어와 영어 경로 모두 생성
  koFileNames.forEach((fileName: string) => {
    const id = fileName.replace(/\.md$/, '')

    // 한국어 경로 생성
    pathsWithLocale.push({
      params: { id },
      locale: 'ko',
    })

    // 영어 경로도 생성 (영어 버전이 없어도 생성)
    pathsWithLocale.push({
      params: { id },
      locale: 'en',
    })
  })

  return {
    paths: pathsWithLocale,
    fallback: false,
  }
}

// fetch necessary data for the blog post using params.id
export async function getStaticProps({
  params,
  locale,
}: {
  params: { id: string }
  locale: string
}) {
  const post = await getPostData(params.id, locale as 'ko' | 'en')

  return {
    props: {
      post,
      id: params.id,
    },
  }
}
