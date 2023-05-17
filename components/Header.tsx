import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const StickyHeader = styled.div`
  position: sticky;
  padding-top: 16px;
  top: -16px;
  box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.55);
  width: 100%;
  display: flex;
  background-color: #0066cc;
`

const CommonHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  gap: 16px;
  height: 60px;
  align-items: center;
  padding: 8px;
  width: 100%;
  color: white;

  .header-pages {
    display: flex;

    .header-links {
      padding: 8px;
  
      &.active {
        text-decoration: underline;
      }
    }
  }

  .header-external {
    margin-left: auto;
    display: flex;
    gap: 12px;
  }
`

type HeaderProps = {
  page: string
}

export default function Header({ page }: HeaderProps) {
  const router = useRouter()
  const currentPage = router.pathname

  const conditionalClass = function(page: String) {
    if (currentPage === '/' + page) return 'active'
    return ''
  }

  return (
    <StickyHeader>
      <CommonHeader>
        <div className="header-pages">
          <div className={`header-links ${conditionalClass('')}`}>
            <Link href="/">Home</Link>
          </div>
          <div className={`header-links ${conditionalClass('posts')}`}>
            <Link href="/posts">Posts</Link>
          </div>
          <div className={`header-links ${conditionalClass('resume')}`}>
            <Link href="/resume">Resume</Link>
          </div>
        </div>
      </CommonHeader>
    </StickyHeader>
  )
}