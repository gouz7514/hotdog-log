import { ReactNode } from "react"

export interface LayoutProps {
  children: ReactNode
}

export interface ListProps {
  children: ReactNode,
  className?: string,
}

export interface IconProps {
  icon: ReactNode
  width?: number
  height?: number
}

export interface IconChildProps {
  fill?: string
  isDark?: boolean
}

export interface Post {
  id: string,
  title: string,
  summary: string,
  tags?: string[],
  order?: number,
}