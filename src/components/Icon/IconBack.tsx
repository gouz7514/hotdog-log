import { IconChildProps } from "@/types/types"

export const IconBack = ({ fill = '#000000', isDark = false }: IconChildProps) => (
  <svg width="128" height="128" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke={ isDark ? '#ffffff' : fill } strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="M244 400L100 256l144-144M120 256h292"/>
  </svg>
)