export interface IconProps {
  className?: string
}

export interface Post {
  id: string
  title: string
  summary: string
  tags: string[]
  date: string
}

export interface Heading {
  level: number
  text: string
  id: string
}

export const portfolioCategories = ['web', 'app', 'etc'] as const

export type PortfolioCategory = (typeof portfolioCategories)[number]

export interface PortfolioItem {
  id: string
  title: string
  summary: string
  category: PortfolioCategory
  image?: string
  links: Array<{ label: string; url: string }>
  date: string
}
