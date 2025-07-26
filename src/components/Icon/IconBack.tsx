import { IconChildProps } from '@/types/types'

export function IconBack({ fill = '#000000', isDark = false }: IconChildProps) {
  return (
    <svg
      width="256"
      height="256"
      viewBox="0 0 768 768"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke={isDark ? '#ffffff' : fill}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
        d="M244 400L100 256l144-144M120 256h292"
      />
    </svg>
  )
}
