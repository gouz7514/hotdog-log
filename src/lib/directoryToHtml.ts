import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeExternalLinks from 'rehype-external-links'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import remarkUnwrapImages from 'remark-unwrap-images'
import { unified } from 'unified'

interface Heading {
  level: number
  text: string
  id: string
}

// HTML에서 heading 정보를 추출하는 함수
function extractHeadingsFromHtml(html: string): Heading[] {
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/g
  const headings: Heading[] = []

  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10)
    const id = match[2]
    const text = match[3].replace(/<[^>]*>/g, '') // HTML 태그 제거

    headings.push({
      level,
      text,
      id,
    })
  }

  return headings
}

const directoryToHtml = async (directory: string, id: string) => {
  const fullPath = path.join(directory, `${id}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)

  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkUnwrapImages)
    .use(remarkRehype)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .use(rehypePrettyCode as any, {
      theme: 'one-dark-pro',
    })
    .use(rehypeSlug) // h 태그에 id 속성 추가
    .use(rehypeAutolinkHeadings, {
      // h 태그에 링크 추가
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Permalink to section',
      },
    })
    .use(rehypeExternalLinks, { target: '_blank', rel: ['noopener'] })
    .use(rehypeStringify)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  // HTML에서 heading 정보 추출
  const headings = extractHeadingsFromHtml(contentHtml)

  return {
    id,
    contentHtml,
    headings, // 목차 데이터 추가
    ...matterResult.data,
  }
}

export default directoryToHtml
