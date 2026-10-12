import { IconProps } from '@/types/types'

export function IconBack({ className }: IconProps) {
  return (
    <svg
      className={className}
      width="256"
      height="256"
      viewBox="0 0 768 768"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="48"
        d="M244 400L100 256l144-144M120 256h292"
      />
    </svg>
  )
}
