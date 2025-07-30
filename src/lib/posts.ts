import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

import { Post } from '../types/types'

import directoryToHtml from './directoryToHtml'
import { Locale } from './translations'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export function getAllPostData(locale: Locale = 'ko') {
  const koDirectory = path.join(postsDirectory, 'ko')
  const enDirectory = path.join(postsDirectory, 'en')

  // 한국어 디렉토리의 모든 마크다운 파일을 가져옴
  const koFileNames = fs.existsSync(koDirectory)
    ? fs.readdirSync(koDirectory).filter(fileName => fileName.endsWith('.md'))
    : []

  const allPostsData: Post[] = []

  koFileNames.forEach(fileName => {
    const id = fileName.replace(/\.md$/, '')
    const koFilePath = path.join(koDirectory, fileName)
    const enFilePath = path.join(enDirectory, fileName)

    // 영어 버전이 있으면 영어 버전을, 없으면 한국어 버전을 사용
    const targetFilePath =
      locale === 'en' && fs.existsSync(enFilePath) ? enFilePath : koFilePath

    const fileContents = fs.readFileSync(targetFilePath, 'utf8')
    const matterResult = matter(fileContents)

    allPostsData.push({
      id,
      ...matterResult.data,
    } as Post)
  })

  return allPostsData.sort((a, b) => {
    if (a.date! < b.date!) {
      return 1
    }
    return -1
  })
}

export async function getPostData(id: string, locale: Locale = 'ko') {
  const koDirectory = path.join(postsDirectory, 'ko')
  const enDirectory = path.join(postsDirectory, 'en')

  const enFilePath = path.join(enDirectory, `${id}.md`)

  // 영어 버전이 있으면 영어 버전을, 없으면 한국어 버전을 사용
  const targetDirectory =
    locale === 'en' && fs.existsSync(enFilePath) ? enDirectory : koDirectory

  return directoryToHtml(targetDirectory, id)
}

export function getAllPostTags(locale: Locale = 'ko') {
  const posts = getAllPostData(locale)
  const tags: { [key: string]: number } = {}
  posts.forEach(post => {
    post.tags.forEach(tag => {
      if (tags[tag]) {
        tags[tag] += 1
      } else {
        tags[tag] = 1
      }
    })
  })

  return tags
}
