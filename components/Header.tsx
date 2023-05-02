import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'

const StickyHeader = styled.div`
  position: sticky;
  padding-top: 32px;
  top: -32px;
  background-color: #CDE4B4;
  border-bottom: 1px black solid;
  width: 100%;
`

const CommonHeader = styled.div`
  font-size: 1.5em;
  color: black;
  font-weight: bold;
  display: flex;
  gap: 16px;
  height: 60px;
  align-items: center;
  padding: 8px;

  .header-links {
    padding: 8px;

    &.active {
      text-decoration: underline;
    }
  }
`

type HeaderProps = {
  page: string
}

export default function Header({ page }: HeaderProps) {
  const router = useRouter()
  const currentPage = router.pathname
  console.log(currentPage)

  const conditionalClass = function(page: String) {
    if (router.pathname === '/' + page) return 'active'
    return ''
  }

  return (
    <StickyHeader>
      <CommonHeader>
        <div className={`header-links ${conditionalClass('')}`}>
          <Link href="/">Home</Link>
        </div>
        <div className={`header-links ${conditionalClass('posts')}`}>
          <Link href="/posts">Posts</Link>
        </div>
        <div className={`header-links ${conditionalClass('resume')}`}>
          <Link href="/resume">Resume</Link>
        </div>
      </CommonHeader>
    </StickyHeader>
  )
}