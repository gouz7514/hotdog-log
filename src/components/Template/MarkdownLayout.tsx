import styled from '@emotion/styled'

import { BackButton } from '@/components/Atom'
import parseDate from '@/lib/util/date'
import MarkdownStyle from '@/styles/MarkdownStyle'

interface Heading {
  level: number
  text: string
  id: string
}

interface MarkdownLayoutProps {
  title: string
  innerHtml: string
  date?: string
  headings?: Heading[]
}

// Table of Contents 컴포넌트
function TableOfContents({ headings }: { headings: Heading[] }) {
  if (!headings || headings.length === 0) return null

  return (
    <TocList>
      {headings.map((heading, index) => (
        <TocItem key={index} level={heading.level}>
          <TocLink href={`#${heading.id}`}>{heading.text}</TocLink>
        </TocItem>
      ))}
    </TocList>
  )
}

export function MarkdownLayout({
  title,
  innerHtml,
  date,
  headings,
}: MarkdownLayoutProps) {
  return (
    <MarkdownLayoutStyle className="container">
      <BackButton />
      <div className="markdown-info-header">
        {date && <div className="markdown-date">{parseDate(date)}</div>}
      </div>
      <h2 className="markdown-title">{title}</h2>

      {/* 목차 표시 */}
      {headings && <TableOfContents headings={headings} />}

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

const TocList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
  margin-bottom: 2rem;
  line-height: 1.4;
`

const TocItem = styled.li<{ level: number }>`
  margin: 0.5rem 0;
  padding-left: ${props => (props.level - 1) * 0.5}rem;

  &:first-of-type {
    margin-top: 0;
  }

  &:last-of-type {
    margin-bottom: 0;
  }
`

const TocLink = styled.a`
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.95rem;
  line-height: 1.4;
  text-decoration: underline;
  filter: brightness(0.6);
  transition: all 0.2s ease;

  &:hover {
    opacity: 0.4;
  }
`
