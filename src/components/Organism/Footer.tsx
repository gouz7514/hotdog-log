import { IconGithub, IconGmail, IconInstagram, IconLinkedIn } from '../Icon'

export function Footer() {
  return (
    <footer className="relative bottom-8 flex w-full flex-col items-center">
      <div className="mt-10 flex items-center gap-6">
        <a href="https://github.com/gouz7514" target="_blank" rel="noopener">
          <IconGithub className="size-[30px]" />
        </a>
        <a
          href="https://www.linkedin.com/in/hakjae"
          target="_blank"
          rel="noopener"
        >
          <IconLinkedIn className="size-[30px]" />
        </a>
        <a
          href="https://www.instagram.com/coffeerro"
          target="_blank"
          rel="noopener"
        >
          <IconInstagram className="size-[30px]" />
        </a>
        <a href="mailto:hakjae.dev@gmail.com">
          <IconGmail className="size-[30px]" />
        </a>
      </div>
    </footer>
  )
}
