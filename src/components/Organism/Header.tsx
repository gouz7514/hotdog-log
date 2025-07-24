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
    <StickyHeader className="container">
      <FloatingHeader>
        <div className="common-header">
          <div className="header-pages">
            <div className={`header-links link-logo ${conditionalClass('')}`}>
              <Link href="/">
                <div className="icon-logo" />
              </Link>
            </div>
            <div
              className={`header-links link-posts ${conditionalClass('posts')}`}
            >
              <Link href="/posts">Posts</Link>
            </div>
            <div
              className={`header-links link-intro ${conditionalClass('intro')}`}
            >
              <Link href="/intro">Intro</Link>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center" style={{ gap: '8px' }}>
          <ResumeButton />
          <DarkMode />
        </div>
      </FloatingHeader>
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
  z-index: var(--z-index-header);
`

const FloatingHeader = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin: 16px 0;

  /* Floating island design */
  background-color: var(--color-header);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 2px 8px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);

  /* Dark mode support */
  body[data-theme='dark'] & {
    background: rgba(33, 33, 33, 0.8);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .icon-logo {
    width: var(--logo-size);
    height: var(--logo-size);
    background-image: url('/images/logo-page.webp');
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    cursor: pointer;
    border-radius: 8px;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  .common-header {
    display: flex;
    align-items: center;
    font-size: 24px;
    font-weight: 700;
    color: var(--color-font);

    @media screen and (max-width: 375px) {
      font-size: 18px;
    }

    .header-pages {
      display: flex;
      align-items: center;
      gap: 8px;

      .header-links:not(.link-logo) {
        position: relative;
        transition: all 0.2s ease;

        a {
          padding: 4px 8px;
          border-radius: 12px;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(0, 0, 0, 0.05);
            transform: translateY(-1px);
          }
        }

        &.active {
          a {
            background: rgba(0, 122, 255, 0.1);
            color: #007aff;
          }
        }

        body[data-theme='dark'] &.active {
          a {
            background: rgba(0, 122, 255, 0.2);
          }
        }
      }
    }
  }
`
