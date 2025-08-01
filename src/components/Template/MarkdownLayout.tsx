import styled from '@emotion/styled'

import { BackButton } from '@/components/Atom'
import parseDate from '@/lib/util/date'
import MarkdownStyle from '@/styles/MarkdownStyle'

interface MarkdownLayoutProps {
  title: string
  innerHtml: string
  date?: string
}

export function MarkdownLayout({
  title,
  innerHtml,
  date,
}: MarkdownLayoutProps) {
  return (
    <MarkdownLayoutStyle className="container">
      <BackButton />
      <div className="markdown-info-header">
        {date && <div className="markdown-date">{parseDate(date)}</div>}
      </div>
      <h2 className="markdown-title">{title}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        css={MarkdownStyle}
      />
    </MarkdownLayoutStyle>
  )
}

const MarkdownLayoutStyle = styled.div`
  .markdown-date {
    font-size: 0.9rem;
    font-weight: 400;
    filter: brightness(0.6);
  }

  .markdown-info-header {
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .markdown-title {
    margin-top: 4px;
  }
`
