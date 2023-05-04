import Link from 'next/link'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Image from 'next/image'

const StickyHeader = styled.div`
  position: sticky;
  padding-top: 16px;
  top: -16px;
  box-shadow: 2px 4px 15px 0px rgba(0,0,0,0.75);
  width: 100%;
  display: flex;
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
  width: 100%;

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
        <div className="header-external">
          <a href="https://github.com/gouz7514">
            <Image
              src="/images/logo-github.webp"
              height={40}
              width={40}
              alt="github logo"
            />
          </a>
          <a href="https://www.linkedin.com/in/%ED%95%99%EC%9E%AC-%EA%B9%80-a23a7b271">
            <Image
              src="/images/logo-linkedin.webp"
              height={40}
              width={40}
              alt="linkedin logo"
            />
          </a>
        </div>
      </CommonHeader>
    </StickyHeader>
  )
}