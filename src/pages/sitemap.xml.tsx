import { getAllPostData } from '@/lib/posts'
import { Post } from '@/types/types'

const BASE_URL = 'https://hakjae.dev'

const generateSitemap = (posts: Post[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${`${BASE_URL}`}</loc>
    <lastmod>2024-02-21</lastmod>
  </url>
  <url>
    <loc>${`${BASE_URL}/posts`}</loc>
    <lastmod>2024-02-21</lastmod>
  </url>
  <url>
    <loc>${`${BASE_URL}/intro`}</loc>
    <lastmod>2024-07-23</lastmod>
  </url>
  ${posts
    .map((post: Post) => {
      return `
    <url>
      <loc>${`${BASE_URL}/posts/${post.id}`}</loc>
      <lastmod>${new Date(post.date).toISOString()}</lastmod>
    </url>
    `
    })
    .join('')}
  </urlset>
`
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getServerSideProps({ res }: any) {
  const posts = getAllPostData()
  const sitemap = generateSitemap(posts)

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

export default function Sitemap() {}
