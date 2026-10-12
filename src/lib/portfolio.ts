import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

import { PortfolioItem } from '@/types/types'

import directoryToHtml from './directoryToHtml'
import { Locale } from './translations'

const portfolioDirectory = path.join(process.cwd(), 'src/content/portfolio')
const koDirectory = path.join(portfolioDirectory, 'ko')
const enDirectory = path.join(portfolioDirectory, 'en')

// posts와 같이 ko가 기준이고, en 파일이 있으면 en을 사용한다
function getTargetDirectory(id: string, locale: Locale) {
  const enFilePath = path.join(enDirectory, `${id}.md`)
  return locale === 'en' && fs.existsSync(enFilePath)
    ? enDirectory
    : koDirectory
}

export function getAllPortfolioIds() {
  return fs
    .readdirSync(koDirectory)
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.md$/, ''))
}

export function getAllPortfolioItems(locale: Locale = 'ko') {
  return getAllPortfolioIds()
    .map(id => {
      const filePath = path.join(getTargetDirectory(id, locale), `${id}.md`)
      const { data } = matter(fs.readFileSync(filePath, 'utf8'))
      return { id, ...data } as PortfolioItem
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export function getPortfolioItem(id: string, locale: Locale = 'ko') {
  return directoryToHtml<Omit<PortfolioItem, 'id'>>(
    getTargetDirectory(id, locale),
    id,
  )
}
