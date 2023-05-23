import styled from 'styled-components'
import { PostTypes } from '@/types/types'

const PostContainer = styled.div`
  .post {
    background: white;
    transition: box-shadow 0.1s ease-in;
    border: 1px solid #eee;
    border-radius: 6px;
    cursor: pointer;
    padding: 12px;
    box-shadow: 1px 1px 3px #aaa;
  }

  .post:hover {
    box-shadow: 2px 2px 6px #aaa;
  }

  .post + .post {
    margin-top: 2rem;
  }
`

export default function Post({ post }: { post: PostTypes }) {
  const authorName = post?.author?.name || 'Unknown author'

  return (
    <PostContainer>
      <div className="post">
        <h4>{post.title}</h4>
        <p>BY {authorName}</p>
      </div>
    </PostContainer>
  )
}