import styled from '@emotion/styled'
import Link from 'next/link'

import { LanguageToggler } from '@/domain/global/components'

import { DarkMode } from '../Molecule'

export function Header() {
  return (
    <StickyHeader>
      <Link href="/">
        <Logo className="icon-logo" />
      </Link>
      <div className="d-flex align-items-center" style={{ gap: '16px' }}>
        <Link href="/posts">
          <h4>BLOG</h4>
        </Link>
        <LanguageToggler />
        <DarkMode />
      </div>
    </StickyHeader>
  )
}

const StickyHeader = styled.div`
  position: sticky;
  padding: 1rem;
  top: 0;
  width: 100%;
  max-width: 50rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: var(--z-index-header);
  background-color: var(--color-background);
  margin: auto;
`

const Logo = styled.div`
  width: 40px;
  height: 40px;
  background-image: url('/images/hakjae.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  border-radius: 50%;
`
