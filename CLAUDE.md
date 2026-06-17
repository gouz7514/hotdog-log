# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`hotdog-log` is Hakjae Kim's personal dev blog (https://hakjae.dev), deployed on Vercel. It's a Next.js **Pages Router** site (not App Router) that renders bilingual (Korean/English) Markdown posts as statically generated pages.

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
- `src/lib/project.ts` — same pipeline for `src/content/projects/`.

Pages are statically generated: `src/pages/posts/[id].tsx` builds paths from the Korean filenames and emits **both `ko` and `en` routes for every post** (`fallback: false`), fetching content in `getStaticProps`.

### i18n

Locale routing is configured in `next.config.js` (`locales: ['ko','en']`, default `ko`) — Next.js prefixes English routes with `/en`. UI string translation is a custom lookup, not a library: `src/lib/translations.ts` exposes `t(locale, 'dot.path.key')` reading from `src/locales/{ko,en}.json` (falls back to the key itself if missing). Post-body translation is the file-fallback logic in `posts.ts` described above.

### Styling & theming

- **Emotion** is the styling system. `tsconfig.json` sets `jsxImportSource: '@emotion/react'`, so the `css` prop works without per-file pragmas.
- Theme tokens live in `src/styles/` (`colors.ts`, `theme.ts`, `typo.ts`, `MarkdownStyle.ts`). `MarkdownStyle.ts` styles the rendered post HTML.
- Dark mode: `useDarkMode` (`src/util/hooks/useDarkmode.ts`) drives the active Emotion theme, exposed app-wide through `ThemeContext` (`src/context/themeContext.ts`). There is also a Recoil `theme` atom in `src/store/theme.ts`. All providers (`RecoilRoot`, `ThemeContext`, Emotion `ThemeProvider`, `OverlayProvider` from `overlay-kit`, `GlobalStyle`, GA) are wired in `src/pages/_app.tsx`.

### Components

- `src/components/` follows **Atomic Design**: `Atom/`, `Molecule/`, `Organism/`, `Template/`, plus `Icon/`. Each folder re-exports through an `index.ts` barrel; import via the barrel (e.g. `@/components/Template`).
- `src/domain/global/` holds cross-cutting UI (Modal, Button, Portal, LanguageToggler) with its own barrels.
- Pages can opt into a custom layout via a static `getLayout`; otherwise `_app.tsx` wraps them in `AppLayout`.

Path alias `@/*` → `src/*`.

## Conventions

- Prettier: **no semicolons**, single quotes, trailing commas (`all`), `printWidth` 80, `arrowParens: avoid`.
- ESLint enforces ordered/alphabetized imports with `newlines-between` groups (builtin → external → internal → parent → sibling → index → object → type). Run `yarn lint:fix` to auto-sort before committing.
- To add a post: create `src/content/posts/ko/<id>.md` (required) and optionally `src/content/posts/en/<id>.md` with matching frontmatter.
