import Head from "next/head"

import MarkdownLayout from "@/components/Template/MarkdownLayout"
import { getAllPostIds, getPostData } from "@/lib/posts"

export default function Post({ post }: any) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="title" content={post.title} />
        <meta name="og:title" content={post.title} />
      </Head>
      <MarkdownLayout
        title={post.title}
        innerHtml={post.contentHtml}
      />
    </>
  )

}

export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

// fetch necessary data for the blog post using params.id
export async function getStaticProps({ params }: any) {
  const post = await getPostData(params.id)

  return {
    props: {
      post
    }
  }
}