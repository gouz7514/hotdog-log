import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

import { Post } from '../types/types'
import directoryToHtml from './directoryToHtml'

const postsDirectory = path.join(process.cwd(), 'src/content/posts')

export function getAllPostData() {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id
    const id = fileName.replace(/\.md$/, '')

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id
    return {
      id,
      ...matterResult.data,
    };
  }) as Post[]

  return allPostsData.sort((a, b) => {
    if (a.order! < b.order!) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory)

  return fileNames.map((fileName : string) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, '')
      }
    }
  })
}

export async function getPostData(id : string) {
  return directoryToHtml(postsDirectory, id)
}