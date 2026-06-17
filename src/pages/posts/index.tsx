import styled from '@emotion/styled'
import dayjs from 'dayjs'
import Link from 'next/link'

import { Badge } from '@/components/Molecule'
import { getAllPostData } from '@/lib/posts'
import { Post } from '@/types/types'

const TWO_WEEKS = 14

export default function Posts({ allPostsData }: { allPostsData: Post[] }) {
  return (
    <>
      <PostStyle className="container">
        <ul>
          {allPostsData.map(({ id, title, summary, tags, date }) => {
            const isNew = dayjs(date).isAfter(
              dayjs().subtract(TWO_WEEKS, 'day'),
            )
            return (
              <li key={id} className="post-item">
                <Link href={`/posts/${id}`}>
                  <div className="d-flex justify-content-between">
                    <div className="post-date">
                      {dayjs(date).format('YYYY.MM.DD')}
                    </div>
                    {isNew && <NewTag>💡</NewTag>}
                  </div>
                  <div className="post-title">{title}</div>
                  <div className="post-summary">{summary}</div>
                  <div className="post-footer">
                    <div className="post-tags">
                      {tags.map((tag: string) => (
                        <Badge key={tag} content={tag} size="small" />
                      ))}
                    </div>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </PostStyle>
    </>
  )
}

const PostStyle = styled.div`
  margin-bottom: 40px;

  .guide {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 16px;

    @media screen and (max-width: 600px) {
      font-size: 1rem;
    }
  }

  .post-item {
    position: relative;
    width: 100%;
    list-style: none;
    padding: 16px 12px;
    border-bottom: 1px solid var(--color-blue);

    &:last-child {
      margin-bottom: 0;
    }

    .post-date {
      font-size: 0.8rem;
      margin-bottom: 4px;
      font-weight: 400;
      font-family:
        Consolas,
        Monaco,
        Lucida Console,
        Liberation Mono,
        DejaVu Sans Mono,
        Bitstream Vera Sans Mono,
        Courier New;
    }

    .post-title {
      margin-bottom: 8px;
      font-size: 1.3rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media screen and (max-width: 600px) {
        font-size: 1.1rem;
      }
    }

    .post-summary {
      font-size: 1rem;
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media screen and (max-width: 600px) {
        font-size: 0.8rem;
      }
    }

    .post-footer {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .post-tags {
        display: flex;
        gap: 8px;
      }
    }
  }
`

const NewTag = styled.div`
  position: absolute;
  top: 16px;
  right: 12px;
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-yellow);
`

export async function getStaticProps({ locale }: { locale: string }) {
  const allPostsData = getAllPostData(locale as 'ko' | 'en')

  return {
    props: {
      allPostsData,
    },
  }
}
