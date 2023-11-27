import { StaticImageData } from "next/image"
import { ReactNode } from "react"

export interface LayoutProps {
  children: ReactNode
}

export interface TooltipProps {
  children: ReactNode
}

export interface ListProps {
  children: ReactNode,
  className?: string,
}

export interface BadgeProps {
  content: string | number
  className?: string | ''
  link?: string
  size?: 'small' | 'medium' | 'large'
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

export type Theme = 'light' | 'dark' | null