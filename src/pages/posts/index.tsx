import Link from "next/link"
import Head from "next/head"
import styled from "@emotion/styled"
import { getAllPostData } from "@/lib/posts"
import { Post } from "@/types/types"

import Badge from "@/components/Molecule/Badge"

import LottieAnimation from "@/components/Organism/Lottie"
import AnimationStudy from '../../../public/lottie/lottie-study.json'

import { parseDate } from "@/lib/util/date"

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
    width: 100%;
    border-radius: 12px;
    background-color: var(--color-list-background);
    list-style: none;
    margin-bottom: 12px;
    padding: 12px 16px;
    box-shadow: rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      filter: brightness(0.9);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      @media screen and (max-width: 600px) {
        flex-direction: column;
        align-items: flex-start;

        .post-date {
          margin-top: 8px;
          margin-right: 0;
          margin-left: auto;
        }
      }
    }

    .post-tags {
      display: flex;
      gap: 8px;
    }

    .post-date {
      font-size: 0.8rem;
      font-weight: 400;
      filter: brightness(0.6);
    }
  }
`

export default function Posts({ allPostsData }: { allPostsData: Post[] }) {
  return (
    <>
      <Head>
        <title>핫재의 개발 블로그 | 기록</title>
        <meta name="title" content="핫재의 개발 블로그 | 기록" />
        <meta name="description" content="밀도를 갖춰가고 있습니다" />
        <meta property="og:title" content="핫재의 개발 블로그 | 기록" key="og:title" />
        <meta property="og:url" content="https://hotjae.com/posts" key="og:url" />
        <meta property="og:description" content="밀도를 갖춰가고 있습니다" key="og:description" />
      </Head>
      <PostStyle className='container'>
        <div className="guide">
          <LottieAnimation json={AnimationStudy} height={80} />
        </div>
        <ul>
          {allPostsData.map(({ id, title, summary, tags, date }) => (
            <li key={id} className="post-item">
              <Link href={`/posts/${id}`}>
                <div className="post-title">{title}</div>
                <div className="post-summary">{ summary }</div>
                <div className="post-footer">
                  <div className="post-tags">
                    {
                      tags && (
                        tags.map((tag: string) => (
                          <Badge key={tag} content={tag} size="small" />
                          ))
                          )
                        }
                  </div>
                  <div className="post-date">{parseDate(date)}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </PostStyle>
    </>
  )
}

export async function getStaticProps() {
  const allPostsData = getAllPostData()
  return {
    props: {
      allPostsData,
    }
  }
}