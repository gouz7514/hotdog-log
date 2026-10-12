import dayjs from 'dayjs'

import { BackButton } from '@/components/Atom'
import { Heading } from '@/types/types'

interface MarkdownLayoutProps {
  title: string
  innerHtml: string
  date?: string
  headings?: Heading[]
}

function TableOfContents({ headings }: { headings: Heading[] }) {
  if (headings.length === 0) return null

  return (
    <ul className="mb-8 leading-[1.4]">
      {headings.map((heading, index) => (
        <li
          key={index}
          className="my-2 first:mt-0 last:mb-0"
          style={{ paddingLeft: `${(heading.level - 1) * 0.5}rem` }}
        >
          <a
            href={`#${heading.id}`}
            className="text-[0.95rem] leading-[1.4] underline brightness-60 transition-all duration-200 hover:opacity-40"
          >
            {heading.text}
          </a>
        </li>
      ))}
    </ul>
  )
}

export function MarkdownLayout({
  title,
  innerHtml,
  date,
  headings,
}: MarkdownLayoutProps) {
  return (
    <div className="page-container">
      <BackButton />
      <div className="mt-2 flex items-center justify-between">
        {date && (
          <div className="text-[0.9rem] font-normal brightness-60">
            {dayjs(date).format('YYYY.MM.DD')}
          </div>
        )}
      </div>
      <h2 className="mt-1">{title}</h2>

      {headings && <TableOfContents headings={headings} />}

      <div
        className="markdown-body"
        dangerouslySetInnerHTML={{ __html: innerHtml }}
      />
    </div>
  )
}
