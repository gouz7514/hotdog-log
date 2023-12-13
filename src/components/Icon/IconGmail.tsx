import { IconChildProps } from '@/types/types'

function IconGmail({ fill = '#000000', isDark = false }: IconChildProps) {
  return (
    <svg
      version="1.0"
      xmlns="http://www.w3.org/2000/svg"
      width="512.000000pt"
      height="512.000000pt"
      viewBox="0 0 512.000000 512.000000"
      preserveAspectRatio="xMidYMid meet"
    >
      <g
        transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)"
        fill={isDark ? '#ffffff' : fill}
        stroke="none"
      >
        <path
          d="M404 4595 c-191 -41 -358 -213 -394 -404 -14 -74 -14 -3188 0 -3262
  37 -194 204 -363 399 -405 99 -21 4203 -21 4302 0 195 42 362 211 399 405 14
  74 14 3188 0 3262 -37 194 -204 363 -399 405 -95 20 -4214 19 -4307 -1z m1282
  -1035 l874 -539 874 540 874 540 149 -3 148 -3 0 -1535 0 -1535 -252 -3 -253
  -2 0 1126 c0 974 -2 1125 -14 1121 -8 -3 -353 -220 -766 -481 -413 -262 -755
  -476 -760 -476 -5 0 -347 214 -760 476 -413 261 -758 478 -766 481 -12 4 -14
  -147 -14 -1121 l0 -1126 -252 2 -253 3 -3 1525 c-1 839 0 1531 3 1538 3 9 43
  12 151 12 l147 0 873 -540z"
        />
      </g>
    </svg>
  )
}

export default IconGmail
