import styled from '@emotion/styled'

import MarkdownStyle from '@/styles/MarkdownStyle'
import BackButton from '@/components/Atom/BackButton'
import Hits from '@/components/Atom/Hits'

import parseDate from '@/lib/util/date'

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

interface MarkdownLayoutProps {
  id?: string
  title: string
  innerHtml: string
  date?: string
}

export default function MarkdownLayout({
  id,
  title,
  innerHtml,
  date,
}: MarkdownLayoutProps) {
  return (
    <MarkdownLayoutStyle className="container">
      <BackButton />
      <div className="markdown-info-header">
        {date && <div className="markdown-date">{parseDate(date)}</div>}
        {id && <Hits id={id} />}
      </div>
      <h2 className="markdown-title">{title}</h2>
      <div
        dangerouslySetInnerHTML={{ __html: innerHtml }}
        css={MarkdownStyle}
      />
    </MarkdownLayoutStyle>
  )
}
