import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from '@emotion/styled'

import { ResumeButton } from '@/domain/global'
import { DarkMode } from '../Molecule'

export function Header() {
  const router = useRouter()
  const currentPage = router.pathname

  const conditionalClass = (page: string) => {
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
          <div className={`header-links ${conditionalClass('intro')}`}>
            <Link href="/intro">Intro</Link>
          </div>
        </div>
      </div>
      <div className="d-flex align-items-center" style={{ gap: '16px' }}>
        <ResumeButton />
        <DarkMode />
      </div>
    </StickyHeader>
  )
}

const StickyHeader = styled.div`
  --padding: 16px;
  --logo-size: 40px;

  position: sticky;
  padding: 0 var(--padding);
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: var(--color-header);
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
    font-size: 24px;
    font-weight: bold;
    color: var(--color-white);

    @media screen and (max-width: 375px) {
      font-size: 18px;
    }

    .header-pages {
      display: flex;
      align-items: center;
      gap: 16px;

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
