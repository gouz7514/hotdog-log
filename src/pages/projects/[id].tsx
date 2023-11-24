import styled from "@emotion/styled"

import BackButton from "@/components/Atom/BackButton";
import { getAllPostIds, getPostData } from "@/lib/project"

const PostStyle = styled.div`
  .title {
    margin: 12px 0;
  }
`

export default function Posts({ postData }: any) {
  return (
    <PostStyle className="container">
      <BackButton />
        <h3 className="title">
          {postData.title}
        </h3>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </PostStyle>
  );
}

// return a list of possible value for id
export async function getStaticPaths() {
  const paths = getAllPostIds()
  return {
    paths,
    fallback: false
  }
}

// fetch necessary data for the blog post using params.id
export async function getStaticProps({ params }: any) {
  const postData = await getPostData(params.id)

  return {
    props: {
      postData
    }
  }
}