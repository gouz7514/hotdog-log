import { BASE_URL } from '@/lib/metadata'
import { getAllPortfolioIds } from '@/lib/portfolio'
import { getAllPostData } from '@/lib/posts'

import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostData()

  return [
    { url: BASE_URL, lastModified: '2024-02-21' },
    { url: `${BASE_URL}/blog`, lastModified: '2024-02-21' },
    { url: `${BASE_URL}/portfolio`, lastModified: '2026-10-12' },
    ...getAllPortfolioIds().map(id => ({
      url: `${BASE_URL}/portfolio/${id}`,
    })),
    ...posts.map(post => ({
      url: `${BASE_URL}/blog/${post.id}`,
      lastModified: new Date(post.date).toISOString(),
    })),
  ]
}
