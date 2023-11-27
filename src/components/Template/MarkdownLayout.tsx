import { MarkdownStyle } from "@/styles/MarkdownStyle"
import BackButton from "@/components/Atom/BackButton"

interface MarkdownLayoutProps {
  title: string,
  innerHtml: string
}

export default function MarkdownLayout({ title, innerHtml }: MarkdownLayoutProps) {
  return (
    <div className="container">
      <BackButton />
      <h2>
        { title }
      </h2>
      <div dangerouslySetInnerHTML={{ __html: innerHtml }} css={MarkdownStyle} />
    </div>
  )
}