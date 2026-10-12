import Link from 'next/link'

import { Locale, localePath } from '@/lib/translations'

import { DarkMode, LanguageToggler } from '../Molecule'

interface HeaderProps {
  locale: Locale
}

export function Header({ locale }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 m-auto flex w-full max-w-[50rem] items-center justify-between bg-background p-4">
      <Link href={localePath(locale, '/')}>
        <h4 className="text-[1.6rem]">HAKJAE</h4>
      </Link>
      <div className="flex items-center gap-4">
        <LanguageToggler locale={locale} />
        <DarkMode />
      </div>
    </header>
  )
}
