import styled from '@emotion/styled'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useContext, useState } from 'react'

import { Icon } from '@/components/Atom'
import { IconTags } from '@/components/Icon'
import { Badge } from '@/components/Molecule'
import { LottieAnimation } from '@/components/Organism'
import ThemeContext from '@/context/themeContext'
import { getAllPostData, getAllPostTags } from '@/lib/posts'
import { theme } from '@/styles/theme'
import { Post } from '@/types/types'

import AnimationStudy from '../../../public/lottie/lottie-study.json'

export default function Posts({
  allPostsData,
  allTags,
}: {
  allPostsData: Post[]
  allTags: { [key: string]: number }
}) {
  const { colorTheme } = useContext(ThemeContext)
  const isDark = colorTheme === theme.dark

  const [selectedTag, setSelectedTag] = useState<string>('')

  const onClickTag = (tag: string) => {
    if (selectedTag === tag) return setSelectedTag('')
    return setSelectedTag(tag)
  }

  const filteredPosts = allPostsData.filter((post: Post) => {
    if (selectedTag === '') return allPostsData
    return post.tags.includes(selectedTag)
  })

  return (
    <>
      <PostStyle className="container">
        <div className="guide">
          <LottieAnimation json={AnimationStudy} height={80} />
        </div>
        <div className="tags">
          <Icon icon={<IconTags isDark={isDark} />} width={24} height={24} />
          {Object.entries(allTags).map(([tag, count]) => (
            <Badge
              key={tag}
              content={`${tag} (${count})`}
              size="small"
              onClick={() => onClickTag(tag)}
              active={tag === selectedTag}
            />
          ))}
        </div>
        <ul>
          {filteredPosts.map(({ id, title, summary, tags, date }) => {
            const isNew = dayjs(date).isAfter(dayjs().subtract(7, 'day'))
            console.log(isNew)
            return (
              <li key={id} className="post-item">
                <Link href={`/posts/${id}`}>
                  <div className="d-flex justify-content-between">
                    <div className="post-date">
                      {dayjs(date).format('YYYY.MM.DD')}
                    </div>
                    {isNew && <NewBadge>New</NewBadge>}
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
    box-shadow:
      rgba(60, 64, 67, 0.3) 0px 1px 2px 0px,
      rgba(60, 64, 67, 0.15) 0px 1px 3px 1px;

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

const NewBadge = styled.div`
  padding: 4px 8px 2px;
  border-radius: 4px;
  background-color: var(--color-yellow);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-black);
`

export async function getStaticProps({ locale }: { locale: string }) {
  const allPostsData = getAllPostData(locale as 'ko' | 'en')
  const allTags = getAllPostTags(locale as 'ko' | 'en')

  return {
    props: {
      allPostsData,
      allTags,
    },
  }
}
