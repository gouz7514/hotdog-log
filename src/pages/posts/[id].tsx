import Head from "next/head"

import MarkdownLayout from "@/components/Template/MarkdownLayout"
import { getAllPostIds, getPostData } from "@/lib/posts"

interface PostProps {
  title: string
  contentHtml: string
  summary: string
}

export default function Post({ post, id }: { post: PostProps, id: string }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta name="title" content={post.title} />
        <meta name="description" content={post.summary} />
        <meta name="og:title" content={post.title} />
        <meta name="og:url" content={`https://hotjae.com/posts/${id}`} />
        <meta name="og:description" content={post.summary} />
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
export async function getStaticProps({ params }: { params: { id: string } }) {
  const post = await getPostData(params.id)

  return {
    props: {
      post,
      id: params.id
    }
  }
}