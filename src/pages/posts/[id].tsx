import { GetServerSideProps } from "next"
import prisma from "../../lib/prisma"
import { PostTypes } from "../../types/types"

type SimplePostProps = {
  post: PostTypes | null;
};

export default function SimplePost({ post }: SimplePostProps) {
  return (
    <>
      <div>{post?.title}</div>
      <div>{post?.content}</div>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const post = await prisma.post.findUnique({
    where: {
      id: String(params?.id),
    },
    include: {
      author: {
        select: { name: true },
      },
    },
  })

  return {
    props: {
      post
    },
  }
}
