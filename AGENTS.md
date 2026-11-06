# AGENTS.md: portfolio

## Project

Personal site of Melinoe Luna, DevOps Engineer & Backend Developer: a portfolio, technical brand and mini blog. Audience: recruiters/hiring managers (P1), peer developers (P2) and the author publishing notes (P3). Astro 7 with TypeScript, Markdown content collections validated by Zod, Tailwind CSS 4, static output on GitHub Pages, no UI framework runtime. Behaviour and acceptance criteria live in [SPEC.md](SPEC.md).

## Read first

- [STACK.md](STACK.md): the stack, the project layout and the engineering rules every change follows.
- [DESIGN.md](DESIGN.md): the design system: tokens, components and UI rules.
- [SPEC.md](SPEC.md): what is being built: requirements and resolved decisions.
- [docs/adr/README.md](docs/adr/README.md): why the code is the way it is. ADR 0003 records the static GitHub Pages, content-collection, client-filter and all-Constructivist decisions.
- [PROGRESS.md](PROGRESS.md): where the work stands: the last build, what is open, what is next.

Read the code around a change before writing.

## Commands

| Task                       | Command                                                                                                                                              |
| -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Install                    | `pnpm install`                                                                                                                                       |
| Dev server                 | `pnpm dev`                                                                                                                                           |
| Build                      | `pnpm build`                                                                                                                                         |
| Serve the production build | `pnpm preview`                                                                                                                                       |
| Astro and content check    | `pnpm check`                                                                                                                                         |
| Sync content types         | `pnpm sync`                                                                                                                                          |
| Typecheck                  | `pnpm typecheck`                                                                                                                                     |
| Lint                       | `pnpm lint`                                                                                                                                          |
| Format and fix             | `pnpm format`                                                                                                                                        |
| Unit tests                 | `pnpm test:unit`                                                                                                                                     |
| E2E tests                  | `pnpm test:e2e`                                                                                                                                      |
| Unit + E2E                 | `pnpm test`                                                                                                                                          |
| Single unit test           | `pnpm exec vitest run src/lib/<file>.test.ts`                                                                                                        |
| Single E2E test            | start `pnpm exec astro preview --background --host 127.0.0.1`, run `pnpm exec playwright test -g "<name>"`, stop with `pnpm exec astro preview stop` |
| Install hooks              | `pnpm hooks:install`                                                                                                                                 |
| Deploy                     | `pnpm deploy` (GitHub CLI) or push to `main`                                                                                                         |

- `pnpm test:e2e` runs `scripts/e2e.mjs`: build, explicit preview server, Playwright, cleanup. Do not remove the cleanup; the tests must leave no server behind.
- `pnpm preview` may daemonise when an agent is detected. For tests, use the script; for a manual check, use `pnpm exec astro preview --ignore-lock --host 127.0.0.1`.
- TypeScript is pinned to 6.0.3 because `@astrojs/check` does not support TypeScript 7.0 yet (ADR 0003). Do not remove `astro check` to chase the newer compiler.
- The Node.js floor is 22 (`engines`), the package manager is pnpm.

## Layout

- `src/content.config.ts` — `projects` and `blog` collections and their Zod schemas.
- `src/content/projects/`, `src/content/blog/` — Markdown entries; the filename is the slug.
- `src/data/` — `about.ts`, `skills.ts`, `roadmap.ts`.
- `src/pages/` — routes only: `index.astro`, `proyectos.astro`, `sobre-mi.astro`, `blog/index.astro`, `blog/[...slug].astro`, `blog/etiqueta/[tag].astro`, `404.astro`, `rss.xml.ts`, `sitemap.xml.ts`.
- `src/layouts/` — `BaseLayout.astro` (html, head, theme pre-paint script, SEO, header, one main, footer), `PostLayout.astro`.
- `src/components/` — `Seo.astro`, `Header.astro`, `Footer.astro`, `ThemeToggle.astro`, `ProjectCard.astro`, `PostCard.astro`, `PostList.astro`, `TagList.astro`, `SearchFilter.astro`.
- `src/lib/` — pure TypeScript: `posts.ts`, `projects.ts`, `format-date.ts`, `tag.ts`, `filter-posts.ts`, `navigation.ts`, `site-url.ts`, `xml.ts`, `content-types.ts`, `project-status.ts`.
- `src/scripts/` — `blog-filter.ts`, the only client module outside the inline theme scripts.
- `src/styles/` — `app.css` with the `@theme` tokens, plus `base.css`, `components.css`, `prose.css`, `motion.css`.
- `public/` — favicon, `og-default.svg`/`.png`, `robots.txt`, `.nojekyll`.
- `tests/e2e/` — Playwright specs with axe checks.
- `scripts/e2e.mjs` — builds, starts the preview server, runs Playwright and stops it.
- Root config: `.github/workflows/ci.yml`, `.github/workflows/deploy.yml`, `lefthook.yml`, `renovate.json`, `biome.json`, `astro.config.mjs`, `tsconfig.json`, `playwright.config.ts`.

Dependency direction: `pages → layouts → components → lib → data/types`. `lib` is plain TypeScript with no `.astro` imports; `components` never import from `pages`; client scripts import only pure `lib` helpers.

## Conventions

- One file = one responsibility: one component, one layout, one query helper.
- `.astro` by default; there are no hydrated islands. The only client JavaScript is the inline theme scripts and the blog filter.
- Every collection entry is validated by its schema; drafts are filtered in `lib/posts.ts`, never in pages.
- Every page sets title, description and canonical URL through `Seo.astro`; post pages also set `og:type=article` and article dates.
- Images, if added, go through `astro:assets` with width, height and `alt`; decorative images use `alt=""`. The current design uses CSS geometry, not content images.
- New section: collection + schema → query helper in `lib/` → page with `getStaticPaths` → layout/components.
- URLs are stable: renaming a slug requires a redirect in `astro.config.mjs`. The canonical origin is `https://melinoeluna4.github.io`; the repository is the GitHub user site, so `base` stays `/`.
- `tsconfig.json` keeps `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` and `isolatedModules` on; a file never lowers them locally. `tsc` only checks, the bundler emits.
- Biome 2 is the only lint/format config: no `.eslintrc*`, no `.prettierrc*`. Recommended rules plus `noExplicitAny`, `noUnusedVariables` and `useImportType` as errors; imports are sorted by Biome, never by hand. `noUnusedImports`/`noUnusedVariables` are disabled for `.astro` because Biome cannot see template usage.
- Design tokens live in `@theme` in `app.css` and mirror DESIGN.md; components use the generated utilities (`bg-background`, `text-muted`, `bg-accent`, `border-border-strong`). Long class lists are composed once (variant helper or component). Arbitrary values only with a comment; a repeated one becomes a token.
- Routes and copy are Spanish; required project status labels stay exactly `In Progress` and `Completed`; identifiers, code and commit messages are English.
- The blog filter is a progressive enhancement: client-side filtering with URL state, plus static `/blog/etiqueta/<tag>/` pages for no-JS. Do not add an htmx endpoint or SSR adapter without a new ADR.
- The site is static. No Cloudflare Workers, Wrangler, D1 bindings or server request path exist; do not reintroduce them without changing the deploy target through an ADR.
- The social URLs and sample content live in `src/config.ts`, `src/content/` and `src/data/`. They are editable content, not secrets.

## Workflow

1. Read SPEC.md, DESIGN.md and STACK.md for the requirement and rules, then open the files the change touches and the ADRs it may supersede.
2. Check the resolved decisions (ADR 0003). Ask when a new decision changes the deploy target, URL structure, design language or content model.
3. Make the smallest change that satisfies the requirement, reusing existing components and tokens.
4. Run `pnpm format`, `pnpm lint`, `pnpm typecheck`, `pnpm check`, `pnpm test:unit`, `pnpm test:e2e` and `pnpm build`.
5. Check the affected routes at 320 px and 360 px, keyboard only, with `prefers-reduced-motion`, and in both themes.
6. Update the docs the change makes stale (SPEC.md, DESIGN.md, STACK.md, this file, PROGRESS.md, ADR index).
7. Commit with Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`); Lefthook formats and lints staged files and checks the commit message.

## Boundaries

- Never commit secrets, tokens or credentials. This repository needs none for its GitHub Pages deploy.
- Never edit `pnpm-lock.yaml`, `dist/`, `.astro/` or the generated content store by hand.
- Never add a dependency, a client UI framework runtime, analytics, a D1-backed content store, an SSR adapter, a CMS, auth, comments, a newsletter, a contact backend or i18n routing without asking (or without an ADR that records the decision).
- Never rewrite unrelated files, reformat the whole repository, or reorder imports manually.
- Never add Cloudflare/Wrangler bindings or a server route to a static GitHub Pages build.
- Ask first: changing the deploy target, the rendering mode, the URL structure, the design language or the content source.
- Do not weaken `tsconfig.json`, remove a CI gate or add an inline lint suppression without a reason. Use `/* biome-ignore <rule>: <reason> */` for CSS and `// biome-ignore <rule>: <reason>` for TS only when the alternative is worse.

## Definition of done

- [ ] `pnpm build` succeeds, content collections validate and `dist/` is deployable to GitHub Pages.
- [ ] `pnpm typecheck` and `pnpm check` are clean; Biome format and lint pass with no new suppressions.
- [ ] `pnpm test:unit` and `pnpm test:e2e` pass, including axe checks in both themes.
- [ ] No UI framework runtime ships; the only client JS is the theme controls and the blog filter.
- [ ] Every page sets title, description and canonical via `Seo.astro`; one `<header>`, one `<main>`, one `<footer>` and one `<h1>`.
- [ ] No horizontal scroll at 320 px and 360 px; code blocks scroll inside their container; focus is visible; reduced motion is respected.
- [ ] The filter updates the URL and announces the count; static tag pages still work without JavaScript.
- [ ] Docs reflect the change; the diff is minimal; the commit message follows Conventional Commits.
