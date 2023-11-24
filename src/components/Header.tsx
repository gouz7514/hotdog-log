import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

import DarkMode from './DarkMode'
import { colors } from '@/styles/colors'

const StickyHeader = styled.div`
  --padding: 16px;
  --logo-size: 40px;

  position: sticky;
  padding: 0 var(--padding);
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--color-background-header);
  z-index: var(--z-index-header);

  .logo {
    width: var(--logo-size);
    height: var(--logo-size);
    background-image: url('/images/logo-page.webp');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
  }

  .common-header {
    height: var(--header-height);
    width: 100%;
    display: flex;
    align-items: center;
    gap: 16px;
    font-size: 24px;
    font-weight: bold;
    color: ${colors.white};

    @media screen and (max-width: 375px) {
      font-size: 18px;
    }

    .header-pages {
      display: flex;
      align-items: center;
      gap: 24px;

      .header-links {  
        &.active {
          text-decoration: underline;
        }

        .disabled-link {
          cursor: pointer;
        }
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
      <div className="common-header">
        <div className="header-pages">
          <div className={`header-links ${conditionalClass('')}`}>
            <Link href="/">
              <div className="logo" />
            </Link>
          </div>
          <div className={`header-links ${conditionalClass('posts')}`}>
            <Link href="/posts">Posts</Link>
          </div>
          <div className={`header-links ${conditionalClass('resume')}`}>
            <Link href="/resume">Resume</Link>
          </div>
        </div>
      </div>
      <DarkMode />
    </StickyHeader>
  )
}