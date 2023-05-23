import { GetStaticProps } from "next"
import LoadingLayout from "../../../components/layout/LoadingLayout"
import prisma from "../../lib/prisma"
import { PostTypes } from '../../types/types'
import Post from '../../../components/Post'
import Router from 'next/router'

interface PostsProps {
  feed: PostTypes[]
}

export default function Posts({ feed }: PostsProps) {
  return (
    <LoadingLayout>
      <div className='container'>
        <h2>
          Posts
        </h2>
        <div>
          {feed.map((post) => (
            <div key={post.id} onClick={() => Router.push('/posts/[id]', `/posts/${post.id}`)}>
              <Post post={post} />
            </div>
          ))}
        </div>
      </div>
    </LoadingLayout>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const feed = await prisma.post.findMany({
    where: { published: true },
    include: {
      author: {
        select: { name: true },
      },
    },
  })
  
  return {
    props: { feed },
    revalidate: 10,
  }
}