# Melinoe Luna — Portfolio

Personal site of Melinoe Luna, DevOps Engineer & Backend Developer: a portfolio, technical brand and mini blog. Astro 7 generates static HTML, content collections validate every entry, Tailwind CSS 4 owns the design tokens, and GitHub Pages serves the result from `https://melinoeluna4.github.io/`.

The visual language is Constructivist: asymmetric layouts, red/black geometry and direct typography. The light theme uses the DESIGN.md base palette; the dark theme keeps the same language with lighter surfaces and a brighter accent. There is no UI framework runtime.

The portfolio also links five small Go CLI tools, each in its own public repository with README, tests, CI and a standalone GitHub Pages landing page:

| Tool        | What it does                                                           | Repository                                        | Live                                              |
| ----------- | ---------------------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| `envcheck`  | Compares `.env` with `.env.example` and fails on missing or empty keys | [repo](https://github.com/melinoeluna4/envcheck)  | [demo](https://melinoeluna4.github.io/envcheck/)  |
| `portwait`  | Waits for TCP endpoints to accept connections                          | [repo](https://github.com/melinoeluna4/portwait)  | [demo](https://melinoeluna4.github.io/portwait/)  |
| `httpcheck` | Smoke-tests HTTP endpoints with retries and an expected status         | [repo](https://github.com/melinoeluna4/httpcheck) | [demo](https://melinoeluna4.github.io/httpcheck/) |
| `treehash`  | Deterministic SHA-256 of a directory tree for CI cache keys            | [repo](https://github.com/melinoeluna4/treehash)  | [demo](https://melinoeluna4.github.io/treehash/)  |
| `mdtoc`     | Generates a table of contents from Markdown headings                   | [repo](https://github.com/melinoeluna4/mdtoc)     | [demo](https://melinoeluna4.github.io/mdtoc/)     |

The GitHub profile README lives in [melinoeluna4/melinoeluna4](https://github.com/melinoeluna4/melinoeluna4). All five landing pages are self-contained, axe-clean, have no horizontal scroll at 320/360 px and scored 100 in Lighthouse mobile (Performance, Accessibility, Best Practices and SEO) on 2026-11-06.

## Stack

| Layer           | Choice                                                                                                                                                                                    |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Language        | TypeScript 6.0.3, check-only (`tsc --noEmit`) with `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` and `isolatedModules` |
| Framework       | Astro 7, static output, no SSR adapter                                                                                                                                                    |
| Content         | Astro content collections (`src/content.config.ts`) with Zod schemas and Markdown                                                                                                         |
| Styling         | Tailwind CSS 4 through `@tailwindcss/vite`; tokens in `@theme` in `src/styles/app.css`                                                                                                    |
| Client JS       | Inline pre-paint theme scripts and one plain-TypeScript blog filter; no React/Vue/Svelte/Alpine/htmx runtime                                                                              |
| SEO             | Per-page `Seo.astro`, manual `sitemap.xml`, RSS and `robots.txt`                                                                                                                          |
| Tests           | Vitest for pure helpers; Playwright + `@axe-core/playwright` for pages, links, filter, theme and accessibility                                                                            |
| Lint and format | Biome 2, the only configuration (no ESLint, no Prettier)                                                                                                                                  |
| Deploy          | GitHub Pages through `.github/workflows/deploy.yml`                                                                                                                                       |
| Package manager | pnpm                                                                                                                                                                                      |

> TypeScript is pinned to 6.0.3 because `@astrojs/check` does not support TypeScript 7.0 yet. The reason and the revisit condition are recorded in [ADR 0003](docs/adr/0003-static-github-pages-content-collections.md).

## Requirements

- Node.js 22 or newer.
- pnpm.
- For deployment: a GitHub repository with Pages enabled and Actions allowed. For `pnpm deploy`: the GitHub CLI authenticated.

## Getting started

```sh
pnpm install
pnpm dev
```

The development server runs at `http://localhost:4321`. The production output is built with `pnpm build` into `dist/` and served locally with `pnpm preview`.

## Commands

| Task                       | Command              |
| -------------------------- | -------------------- |
| Install dependencies       | `pnpm install`       |
| Dev server                 | `pnpm dev`           |
| Build static output        | `pnpm build`         |
| Serve the production build | `pnpm preview`       |
| Astro/content check        | `pnpm check`         |
| Generate content types     | `pnpm sync`          |
| Typecheck                  | `pnpm typecheck`     |
| Lint                       | `pnpm lint`          |
| Format and fix             | `pnpm format`        |
| Unit tests                 | `pnpm test:unit`     |
| End-to-end tests           | `pnpm test:e2e`      |
| Unit + E2E                 | `pnpm test`          |
| Install Git hooks          | `pnpm hooks:install` |
| Trigger the Pages workflow | `pnpm deploy`        |

- `pnpm test:e2e` runs `scripts/e2e.mjs`: it builds the site, starts `astro preview` on `127.0.0.1:4321`, runs Playwright and stops the preview server afterwards. This keeps the test server lifecycle explicit and works in CI.
- A single unit test: `pnpm exec vitest run src/lib/filter-posts.test.ts`.
- A single E2E test needs a running preview: `pnpm exec astro preview --background --host 127.0.0.1`, then `pnpm exec playwright test -g "filters live"`, then `pnpm exec astro preview stop`.

## Routes

| Path                    | What it renders                                                         |
| ----------------------- | ----------------------------------------------------------------------- |
| `/`                     | Hero, focus statement, featured projects, recent notes and social links |
| `/proyectos/`           | Every published project with status, tags, repository and demo links    |
| `/proyectos/<slug>/`    | One project with a mini presentation and links to its repository/demo   |
| `/sobre-mi/`            | History, education, principles, roadmap and skills by level             |
| `/blog/`                | Published notes newest-first, tag index and the live filter             |
| `/blog/<slug>/`         | One post with build-time Shiki highlighting, dates and tags             |
| `/blog/etiqueta/<tag>/` | Static tag page; the no-JavaScript filter path                          |
| `/rss.xml`              | RSS 2.0 feed without drafts                                             |
| `/sitemap.xml`          | Static sitemap with posts and tag pages                                 |
| `/404.html`             | Styled not-found page served by GitHub Pages                            |

## Content authoring

### Projects

Add `src/content/projects/<slug>.md`. The filename is the route slug.

```yaml
---
title: "Atlas Deploy"
description: "One or two sentences used on the card and in metadata."
tags: ["Go", "Cloudflare", "Docker"]
status: completed # in_progress | completed
repoUrl: "https://github.com/melinoeluna4/atlas-deploy"
demoUrl: "https://example.com" # optional
featured: true # optional, default false
startDate: 2025-09-01 # optional
endDate: 2026-02-15 # required when status is completed
order: 1 # optional manual order
---
```

A project without `repoUrl` and `demoUrl` renders without empty links. A long title or many tags wrap at 320 px.

### Blog

Add `src/content/blog/<slug>.md`.

```yaml
---
title: "Context en Go: cancelar antes de que duela"
description: "The excerpt used in listings and metadata."
pubDate: 2026-10-28
updatedDate: 2026-11-02 # optional; shown only when present
tags: ["Go", "Backend"]
draft: false # true excludes the post from the build, RSS and sitemap
---
```

Code fences are highlighted at build time by Astro/Shiki. The production output has no client highlighter. Drafts are filtered in `src/lib/posts.ts`, so they never reach a route, the listing, the feed or the sitemap.

### About and profile

- `src/data/about.ts`: history, location, availability, education and principles.
- `src/data/skills.ts`: skills grouped by `advanced`, `intermediate` and `learning`.
- `src/data/roadmap.ts`: roadmap items with `done`, `learning` or `planned`.
- `src/config.ts`: name, role, focus, description, social URLs, handles and navigation.

The repository ships the five Go CLI projects and the portfolio project, all with real public repositories and demo pages. The posts, biography, skills, roadmap and social URLs are editable; confirm the LinkedIn path before sharing the site widely.

## Theme

- The pre-paint script in `src/layouts/BaseLayout.astro` reads `localStorage.theme` and applies `data-theme` before first paint.
- The contract is `theme: "light" | "dark"`. No stored value follows `prefers-color-scheme`; the CSS uses `light-dark()` so the correct theme also applies before JavaScript runs.
- `ThemeToggle.astro` is a native button with `aria-pressed`, a visible label and a keyboard-operable action. It stores the choice and updates the system preference listener.
- `prefers-reduced-motion: reduce` removes transitions and animations through `src/styles/motion.css`.
- The only colors are tokens in `src/styles/app.css`; components never carry raw hex values.

## Blog filter

The `/blog` filter is a progressive enhancement, not a server endpoint:

- With JavaScript, typing or selecting a tag filters the rendered cards, updates the URL with `history.replaceState` and announces the result count in `aria-live="polite"`.
- Without JavaScript, the form is a normal `GET` to `/blog/` and the complete listing remains readable. The tag index links to static `/blog/etiqueta/<tag>/` pages, which are the supported no-JS filter.
- The query is treated as literal text, bounded to 100 characters and never injected as HTML. There is no server request, so there is no endpoint to validate or abuse.
- There is no SSR adapter by decision. Adding one requires a new ADR and a review of the deployment target.

## Deployment

The committed target is GitHub Pages on the public repository `melinoeluna4/melinoeluna4.github.io`.

1. Push the repository to `melinoeluna4/melinoeluna4.github.io` on `main`.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. The `Deploy to GitHub Pages` workflow builds with `pnpm build`, uploads `dist/` and deploys it. A failing build is not promoted; the previous deployment stays live.
4. `https://melinoeluna4.github.io/` serves the site. The first deployment may take a minute after the workflow finishes.

`pnpm deploy` runs `gh workflow run deploy.yml --ref main` for a manual redeploy when the CLI is authenticated. No repository secrets are required: the workflow uses the GitHub token and the Pages permissions.

The canonical origin is `astro.config.mjs` (`site: "https://melinoeluna4.github.io"`). To use a custom domain, update `site`, add `public/CNAME` with the domain and configure DNS; the rest of the URLs are absolute and derive from `Astro.site`.

## Project layout

```text
.
├── .github/workflows/        ci.yml, deploy.yml
├── docs/adr/                 architecture decisions
├── public/                   favicon, OG image, robots.txt, .nojekyll
├── scripts/e2e.mjs           build + preview + Playwright lifecycle
├── src/
│   ├── components/           Seo, Header, Footer, cards, filter, StatusBadge
│   ├── content/
│   │   ├── blog/             one Markdown file per post
│   │   └── projects/         one Markdown file per project, rendered as a detail page
│   ├── data/                 about, skills, roadmap
│   ├── layouts/              BaseLayout, PostLayout, ProjectLayout
│   ├── lib/                  queries, dates, tags, filter, XML, types
│   ├── pages/                routes, project detail, RSS, sitemap, 404
│   ├── scripts/              blog filter client module
│   ├── styles/               app.css tokens, base, components, prose, motion
│   └── content.config.ts     collection schemas
├── tests/e2e/                Playwright + axe specs
├── astro.config.mjs          site, static output, Shiki themes
├── biome.json                the only lint/format config
├── playwright.config.ts      browser project and base URL
└── tsconfig.json             strict check-only TypeScript
```

Dependency direction: `pages → layouts → components → lib → data/types`. `lib` has no `.astro` imports; client scripts import only pure helpers.

## Quality gates

- `pnpm build` succeeds, content collections validate and the output is deployable.
- `pnpm typecheck` exits 0; `pnpm check` reports 0 errors, 0 warnings and 0 hints.
- `pnpm lint` passes with Biome; no ESLint or Prettier config exists.
- `pnpm test:unit` runs the pure-helper suite; `pnpm test:e2e` runs the page, filter, theme, SEO, feed, 404 and axe checks.
- No UI framework runtime is shipped. The only client JavaScript is the inline theme controls and the filter module.
- Every page has one `<header>`, one `<main>`, one `<footer>`, one `<h1>`, a skip link and a complete `Seo.astro` contract.
- The 320 px and 360 px checks assert no horizontal page scroll; code blocks scroll inside their own container.
- axe checks pass in the light and dark themes on the home, projects, project detail, about, blog and post pages.

Lighthouse mobile (2026-11-06) scores 100 in Performance, Accessibility, Best Practices and SEO on the live home, the live `/proyectos/envcheck/` detail page and the local build of `/`, `/proyectos/`, `/proyectos/envcheck/`, `/blog/` and `/blog/go-context-en-produccion/`. The live pages measured LCP 1.0 s, CLS 0 and TBT 0 ms; the local pages measured LCP 0.8–0.9 s and CLS ≤ 0.001. These are lab numbers; field LCP/CLS/INP still need a production run after the content replacement.

## Open work

- Review the biography, posts and social URLs with the final copy.
- Confirm the LinkedIn profile path.
- Optionally add a custom domain and a `CNAME` file.
- Revisit the TypeScript pin when `@astrojs/check` supports TypeScript 7.
- Add a `cloudflare`-style security header set only if the deploy target changes; GitHub Pages does not apply one from this repository.

## License and credits

Personal portfolio and writing by Melinoe Luna. The code is published as a reference. Built with [Astro](https://astro.build/), [Tailwind CSS](https://tailwindcss.com/), [Biome](https://biomejs.dev/), [Vitest](https://vitest.dev/), [Playwright](https://playwright.dev/) and [axe-core](https://github.com/dequelabs/axe-core). Served by GitHub Pages.
