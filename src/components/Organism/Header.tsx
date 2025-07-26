import styled from '@emotion/styled'
import Link from 'next/link'

import { DarkMode } from '../Molecule'

export function Header() {
  return (
    <StickyHeader>
      <Link href="/">
        <Logo className="icon-logo" />
      </Link>
      <div className="d-flex align-items-center" style={{ gap: '12px' }}>
        <Link href="/posts">
          <h5>TIL</h5>
        </Link>
        <DarkMode />
      </div>
    </StickyHeader>
  )
}

const StickyHeader = styled.div`
  --padding: 16px;
  --logo-size: 32px;

  position: sticky;
  padding: 1rem;
  top: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  z-index: var(--z-index-header);
  background-color: var(--color-background);

  body[data-theme='dark'] & {
    box-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  }

  body[data-theme='light'] & {
    box-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
  }
`
const Logo = styled.div`
  width: var(--logo-size);
  height: var(--logo-size);
  background-image: url('/images/logo-page.webp');
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
  border-radius: 8px;
  transition: transform 0.2s ease;
`
