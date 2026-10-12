# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`hotdog-log` is Hakjae Kim's personal dev blog (https://hakjae.dev), deployed on Vercel. It's a Next.js 16 **App Router** site that renders bilingual (Korean/English) Markdown posts as statically generated pages.

## Commands

Package manager is **yarn** (npm is blocked via `engines`).

- `yarn dev` — run dev server on **port 7514**
- `yarn build` / `yarn start` — production build / serve
- `yarn lint` / `yarn lint:fix` — ESLint (also runs on `pre-commit` via Husky)
- `yarn write:posts` — dev server with `next-remote-watch` on `src/content/posts`, for live-reloading while writing Markdown

There is no test suite.

## Architecture

### Content pipeline (Markdown → HTML)

Posts are Markdown files under `src/content/posts/{ko,en}/`, with the filename (minus `.md`) as the post `id`. Frontmatter fields (parsed by `gray-matter`): `title`, `summary`, `tags` (string array), `date` (`'YYYY-MM-DD HH:mm:ss'`, used for descending sort).

- `src/lib/posts.ts` — `getAllPostData`, `getPostData`, `getAllPostTags`. The **Korean directory is the source of truth**: every `ko/*.md` defines a post; the matching `en/*.md` is used only when locale is `en` and that file exists, otherwise it falls back to Korean.
- `src/lib/directoryToHtml.ts` — the `unified`/`remark`/`rehype` pipeline that turns a Markdown file into `{ id, contentHtml, headings, ...frontmatter }`. Headings (for the table of contents) are extracted by regex from the generated HTML, not from the AST. Code highlighting uses `rehype-pretty-code` with the `one-dark-pro` theme; external links get `target=_blank`.

Everything is statically generated at build time. `src/app/[locale]/blog/[id]/page.tsx` (URL `/blog/<id>`; old `/posts/*` URLs permanently redirect via `next.config.ts`) builds params from the Korean filenames and emits **both `ko` and `en` routes for every post** via `generateStaticParams` (`dynamicParams = false`). Avoid dynamic APIs (`cookies()`, `headers()`) in pages, or they stop being static.

### i18n

All routes live under `src/app/[locale]/` (`ko` | `en`). Public URLs keep the old Pages Router shape — Korean has no prefix, English is `/en/...` — via `src/proxy.ts`: unprefixed paths are rewritten to `/ko/...`, `/ko/...` redirects to the unprefixed URL, and `/` redirects to `/en` based on the `NEXT_LOCALE` cookie or `Accept-Language`. Build internal links with `localePath(locale, path)`; never hardcode `/ko`. The proxy matcher excludes static files by extension (post ids may contain dots), so add an extension there when serving a new static file type from `public/`. Unmatched URLs hit `[locale]/[...rest]` → `notFound()` → `[locale]/not-found.tsx`. UI string translation is a custom lookup, not a library: `src/lib/translations.ts` exposes `t(locale, 'dot.path.key')` reading from `src/locales/{ko,en}.json` (falls back to the key itself if missing). Post-body translation is the file-fallback logic in `posts.ts` described above.

### Styling & theming

- **Tailwind CSS v4** (CSS-first config, no `tailwind.config`). Tokens, base styles and custom utilities (`page-container`) live in `src/styles/globals.css` under `@theme static`.
- `src/styles/markdown.css` styles the rendered post HTML (`.markdown-body`), since utility classes can't be applied to `dangerouslySetInnerHTML` output.
- Dark mode: `data-theme` on `<html>`, set before paint by an inline script in `src/app/[locale]/layout.tsx` and toggled by `DarkMode`. Theme-dependent colors are CSS variables overridden under `[data-theme='dark']`; the `dark:` variant targets the same attribute. No React state or context for theme — icons use `currentColor`.
- Metadata (canonical, hreflang, Open Graph) is built per page with `pageMetadata()` in `src/lib/metadata.ts`. `src/app/sitemap.ts` generates the sitemap.

### Components

- `src/components/` follows **Atomic Design**: `Atom/`, `Molecule/`, `Organism/`, `Template/`, plus `Icon/`. Each folder re-exports through an `index.ts` barrel; import via the barrel (e.g. `@/components/Template`).
- Components are server components by default; only interactive ones (`BackButton`, `DarkMode`, `LanguageToggler`, `LottieAnimation`) are `'use client'`. Pass `locale` down as a prop rather than reading it on the client.

Path alias `@/*` → `src/*`.

## Conventions

- Prettier: **no semicolons**, single quotes, trailing commas (`all`), `printWidth` 80, `arrowParens: avoid`.
- ESLint enforces ordered/alphabetized imports with `newlines-between` groups (builtin → external → internal → parent → sibling → index → object → type). Run `yarn lint:fix` to auto-sort before committing.
- To add a post: create `src/content/posts/ko/<id>.md` (required) and optionally `src/content/posts/en/<id>.md` with matching frontmatter.
- To add a portfolio project: create `src/content/portfolio/ko/<id>.md` (required, optional `en/<id>.md`) with frontmatter `title`, `summary`, `category` (`web` | `app` | `etc`), optional `image` (put files in `public/images/portfolio/`), `links` (`[{ label, url }]`), `date` (sort key). Loaded by `src/lib/portfolio.ts`; empty categories are hidden on `/portfolio`, and items without `image` get a text tile.
