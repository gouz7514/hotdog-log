import { useContext } from "react"
import { ThemeContext } from "@/pages/_app"
import { theme } from '@/styles/theme'

import Link from "next/link"
import Head from "next/head"
import styled from "@emotion/styled"
import { getAllPostData, getAllPostTags } from "@/lib/posts"
import { Post } from "@/types/types"

import Badge from "@/components/Molecule/Badge"
import Icon from "@/components/Atom/Icon"
import { IconTags } from "@/components/Icon/IconTags"

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

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 12px;
    background-color: var(--color-list-background);
    border-radius: 12px;
    padding: 12px 16px;
  }

  .post-item {
    position: relative;
    width: 100%;
    border-top-left-radius: 12px;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
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

    .post-date {
      font-size: 0.8rem;
      margin-bottom: 4px;
      font-weight: 400;
      font-family: Consolas,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New;
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

export default function Posts({ allPostsData, allTags }: { allPostsData: Post[], allTags: string[] }) {
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark

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
        <div className="tags">
          <Icon icon={<IconTags isDark={isDark} />} width={24} height={24} />
          {
            allTags && (
              allTags.map((tag: string) => (
                <Badge key={tag} content={tag} size="small" />
              ))
            )
          }
        </div>
        <ul>
          {allPostsData.map(({ id, title, summary, tags, date }) => (
            <li key={id} className="post-item">
              <Link href={`/posts/${id}`}>
                <div className="post-date">{parseDate(date)}</div>
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
  const allTags = getAllPostTags()

  return {
    props: {
      allPostsData,
      allTags
    }
  }
}