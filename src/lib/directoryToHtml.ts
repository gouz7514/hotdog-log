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

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}

export default directoryToHtml
