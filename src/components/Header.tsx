import Link from 'next/link'
import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import DarkMode from './DarkMode'

const StickyHeader = styled.div`
  position: sticky;
  padding: 16px 16px 0;
  top: -16px;
  box-shadow: 2px 2px 8px 0px rgba(0,0,0,0.55);
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #0066cc;
`

const CommonHeader = styled.div`
  font-size: 24px;
  font-weight: bold;
  display: flex;
  gap: 16px;
  height: 60px;
  align-items: center;
  width: 100%;
  color: white;

  @media screen and (max-width: 375px) {
    font-size: 18px;
  }

  .header-pages {
    display: flex;
    gap: 8px;

    .header-links {  
      &.active {
        text-decoration: underline;
      }

      .disabled-link {
        cursor: pointer;
      }
    }
  }
`

export default function Header() {
  const router = useRouter()
  const currentPage = router.pathname 

  const conditionalClass = function(page: String) {
    if (currentPage.split('/')[1] === page) return 'active'
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
      <DarkMode />
    </StickyHeader>
  )
}