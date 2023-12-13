import styled from '@emotion/styled'

import MarkdownStyle from '@/styles/MarkdownStyle'
import BackButton from '@/components/Atom/BackButton'

import parseDate from '@/lib/util/date'

const MarkdownLayoutStyle = styled.div`
  .markdown-date {
    font-size: 0.9rem;
    font-weight: 400;
    margin-top: 16px;
    filter: brightness(0.6);
  }

  .markdown-title {
    margin-top: 4px;
  }
`

interface MarkdownLayoutProps {
  title: string
  innerHtml: string
  date?: string
}

export default function MarkdownLayout({
  title,
  innerHtml,
  date,
}: MarkdownLayoutProps) {
  return (
    <MarkdownLayoutStyle className="container">
      <BackButton />
      {date && <div className="markdown-date">{parseDate(date)}</div>}
      <h2 className="markdown-title">{title}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        css={MarkdownStyle}
      />
    </MarkdownLayoutStyle>
  )
}
