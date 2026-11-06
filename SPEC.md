# SPEC.md: Astro Portfolio and Mini Blog

## Summary

Build the personal site of Melinoe Luna — DevOps Engineer & Backend Developer, 20, recently graduated — as a portfolio, technical brand and mini blog on Astro with Tailwind CSS, static output and no UI framework runtime, deployed on GitHub Pages. The visual language is Constructivist (asymmetric, red/black, direct) with a fast, content-first build. Content is authored as local Markdown through Astro content collections. The blog filter is a client-side progressive enhancement with static tag pages, not a server endpoint; the implementation decisions are recorded in ADR 0003.

## Problem

Melinoe is at the start of her professional career and in an active phase of learning and consolidating knowledge. She has no owned surface that proves her specialisation in Go, Rust and the Cloudflare ecosystem (Workers, Pages, D1, R2, KV): her evidence is scattered across social profiles, and repositories alone do not communicate project status, focus or growth. Recruiters cannot screen her in minutes, peers cannot follow her learning, and she has no low-friction channel to publish short technical notes. The cost of waiting is that her most active learning period produces no durable, linkable public record.

## Goals

- G1: All routes in `## Interfaces` are live on the GitHub Pages domain `https://melinoeluna4.github.io/`, built from one repository, and redeployed automatically on every push to `main`.
- G2: Lighthouse (mobile) scores 100 in Performance, Accessibility, Best Practices and SEO on `/`, `/proyectos`, `/blog` and `/blog/[slug]`.
- G3: Core Web Vitals are green in the field: LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (FID ≤ 100 ms per the draft; see Q10).
- G4: A new blog post ships by adding one `.md` file with frontmatter and merging — no code change, no manual index edit.
- G5: A visitor reaches any project repository or demo in ≤ 2 clicks from `/`.
- G6: No UI framework runtime (React/Vue/Svelte) or client library is shipped; the only client JavaScript is the inline theme controls and the plain-TypeScript blog filter.

## Non-goals

- No CMS, admin UI, authentication or authoring interface — publishing is git + Markdown.
- No comments, newsletter, contact form backend, likes or any user-generated content.
- No multi-language routing or i18n framework in v1 (single copy language, see Q4).
- No e-commerce, gated content or paid sections.
- No SPA/SPA-like navigation, no client-side router, no heavy animation library.
- No D1-backed content in v1; content is local Markdown (Q1 resolved in ADR 0003).
- No native mobile app and no PWA/offline support.

## Users and scenarios

Personas:

- P1 Recruiter / hiring manager: screens candidates in under 5 minutes, needs role, stack, project evidence and contact links.
- P2 Peer developer: reads posts on DevOps, Go, Rust and Cloudflare, copies code, follows repository links.
- P3 Melinoe (author/operator): publishes notes, edits project status, owns deploys.

Main flows:

1. Recruiter screening (P1): lands on `/` → reads the positioning statement (DevOps, Go, Rust, Cloudflare) → scans featured projects → opens `/proyectos` → clicks a repository link → opens `/sobre-mi` for education and skill levels → uses a social link.
2. Find a project by technology (P1/P2): opens `/proyectos` → filters or scans tags (Go, Rust, Docker, Cloudflare) → opens the matching project card → follows repo or demo link.
3. Read a post (P2): opens `/blog` → uses live filter or a tag → opens `/blog/[slug]` → reads highlighted code → navigates to the related repository.
4. Publish a note (P3): writes `src/content/blog/<slug>.md` with frontmatter → commits to `main` → CI builds and deploys → the post appears in `/blog`, its tag index and OG previews without further edits.
5. Theme preference (any): toggles light/dark in the header → the choice persists across pages and reloads; first visit follows `prefers-color-scheme`.
6. Update a project (P3): edits the project entry's `status` field from `in_progress` to `completed` → the badge on `/` and `/proyectos` reflects it after deploy.

## Requirements

**FR-1 — Astro project with static GitHub Pages deployment**

The system must be an Astro project with static output, Tailwind CSS and content collections; no SSR adapter is required.

- Given a clean checkout, when `pnpm install && pnpm build` runs, then the build succeeds with no TypeScript or content-collection errors and emits deployable static output in `dist/`.
- Given the static build, when `pnpm preview` runs, then all routes render locally with the same output as the production build.
- Given Tailwind is installed, when a component uses utility classes, then the classes are generated in the production CSS with no unstyled-content warnings in the build log.
- Given a pull request or a push to `main`, when CI runs, then the same format, lint, typecheck, content, unit, E2E and build gates run.

**FR-2 — Global layout**

The system must provide one reusable layout with `Header`, `Footer` and `ThemeToggle`, applied to every route.

- Given any route, when it renders, then the page contains exactly one `<header>`, one `<main>` and one `<footer>`, in that document order.
- Given a viewport narrower than 768 px, when the header navigation is used, then all route links remain reachable without horizontal scrolling.
- Given the layout renders, when the same content is requested without JavaScript, then header links and footer links still work.

**FR-3 — Home**

The system must present Melinoe on `/` with her presentation, her focus statement (DevOps, Go, Rust, Cloudflare), quick access to featured projects, and links to GitHub, LinkedIn and Twitter/X.

- Given a visit to `/`, when the hero renders, then it shows her name, her role "DevOps Engineer & Backend Developer" and the focus statement.
- Given featured projects exist in content, when `/` renders, then 3 to 4 featured projects appear with a link to each detail target and a link to `/proyectos`.
- Given the profile data, when the footer or hero renders, then GitHub, LinkedIn and Twitter/X are rendered as external links with `rel="noopener noreferrer"` and accessible names (URLs per Q6).

**FR-4 — About page**

The system must publish `/sobre-mi` with personal history, academic background, learning roadmap and technical skills grouped by knowledge level.

- Given a visit to `/sobre-mi`, when it renders, then it contains four distinct sections: history, education, learning roadmap, skills.
- Given the skills data, when the section renders, then each skill is grouped under its declared level and each group has a visible heading (level taxonomy per Q7).
- Given the roadmap data, when it renders, then each roadmap item shows its label and status.

**FR-5 — Projects listing**

The system must publish `/proyectos` as a grid or list of projects with technology tags, repository links, demo links and project status.

- Given published projects in content, when `/proyectos` renders, then every published project appears exactly once.
- Given a project with tags, when its card renders, then all tags are visible as text (not icon-only) and the tag list is not truncated without a way to read it.
- Given a project with no demo URL, when its card renders, then no demo link is rendered (no empty anchor).
- Given a project with a repository URL, when the card renders, then the link opens the repository in a new tab.
- Given a project card, when the title or "Ver ficha" is activated, then `/proyectos/<slug>/` renders the project Markdown body, status, dates, tags and repository/demo links.

**FR-6 — ProjectCard component**

The system must implement `ProjectCard.astro` with a visual status indicator supporting at least `In Progress` and `Completed`.

- Given a project with `status: in_progress`, when the card renders, then a badge with the text "In Progress" is visible and is not conveyed by colour alone.
- Given a project with `status: completed`, when the card renders, then a badge with the text "Completed" is visible and is not conveyed by colour alone.
- Given an unknown status value, when the content collection is validated, then the build fails with an error naming the offending file.
- Given long titles or many tags, when the card renders at 320 px width, then text wraps and the card does not overflow its container.

**FR-7 — Blog listing**

The system must publish `/blog` listing short posts about DevOps, continuous learning, quick tutorials and reflections on Go, Rust and Cloudflare.

- Given published posts, when `/blog` renders, then posts are ordered newest-first by publication date and each entry shows title, date, description and tags.
- Given a post with `draft: true`, when `/blog` renders, then that post does not appear and is not built into production output.
- Given the listing, when it renders, then each entry links to `/blog/<slug>`.

**FR-8 — Post page**

The system must render `/blog/[slug]` for each published post with syntax-highlighted code blocks.

- Given a published post slug, when `/blog/<slug>` is requested, then the page renders title, date, tags and full body.
- Given a fenced code block with a language identifier, when the page renders, then it is highlighted at build time (Astro/Shiki) with the language's grammar; highlighting must not require client JavaScript.
- Given a code line wider than the viewport, when the page is viewed at 320 px, then the code block scrolls horizontally without causing page-level horizontal scroll.
- Given the post frontmatter, when the page renders, then an "updated" date is shown only if present.

**FR-9 — Client-side live filter (progressive enhancement)**

The system must provide one live search and tag filter on `/blog` that updates the listing without a full page reload. It is a static progressive enhancement, not an htmx/server endpoint (Q2 resolved in ADR 0003).

- Given JavaScript enabled, when the user types in the search input or selects a tag, then the rendered cards are filtered in place without navigating.
- Given the filter is active, when the user types or selects a tag, then the URL reflects the query and tag via `history.replaceState`, so the state is shareable.
- Given JavaScript disabled, when the user submits the form, then a normal GET reaches `/blog/` and the complete listing remains readable; the static `/blog/etiqueta/<tag>/` pages are the no-JS tag filter.
- Given the filter is applied, when results change, then the result count is announced in a live region (`aria-live="polite"`) and a zero-result state offers a clear action.
- Given a query, when it is matched, then it is treated as literal text, bounded to 100 characters and never injected as HTML.

**FR-10 — Blog tags and mini-feed**

The system must expose a tag system for the blog and a mini-feed of recent posts.

- Given posts with tags, when `/blog` renders, then a tag list is rendered with the count of posts per tag.
- Given a tag is selected, when the listing updates, then only posts containing that tag are shown.
- Given the home page renders, when a mini-feed is enabled, then the N most recent published posts are listed with title and date (N and inclusion per Q3).

**FR-11 — SEO and Open Graph**

The system must emit per-page SEO metadata and Open Graph tags.

- Given any route, when the page renders, then `<title>`, `<meta name="description">`, `<link rel="canonical">`, `og:title`, `og:description`, `og:type`, `og:url`, `og:image` and `twitter:card` are present and non-empty.
- Given a blog post, when the page renders, then `og:type` is `article` and the canonical URL is absolute.
- Given a page has no specific image, when it renders, then the site default OG image is used.
- Given the built site, when a crawler reads the HTML, then the primary content is present in server-rendered HTML without JavaScript execution.

**FR-12 — Image and asset optimisation**

The system must serve optimised images through Astro's image pipeline and avoid layout shift.

- Given a content image, when the build runs, then it is emitted as a modern format (AVIF or WebP) with explicit `width`/`height`.
- Given images below the fold, when the page renders, then they are lazy-loaded; the hero/LCP image is not lazy-loaded.
- Given any `<img>`, when the page renders, then it has a non-empty `alt` attribute.

**FR-13 — Theme toggle**

The system must provide light/dark theming controlled by `ThemeToggle`.

- Given no stored preference, when a visitor loads a page, then the theme follows `prefers-color-scheme`.
- Given the visitor toggles the theme, when they navigate to another page or reload, then the chosen theme is applied from `localStorage` before first paint, with no visible flash of the wrong theme.
- Given the toggle, when operated by keyboard only, then it is reachable by Tab, activates with Enter/Space, and exposes its state (`aria-pressed` or equivalent).
- Given `prefers-reduced-motion: reduce`, when the theme changes, then no transition animation plays.

**FR-14 — Continuous deployment to GitHub Pages**

The system must deploy to GitHub Pages on every push to `main` through `.github/workflows/deploy.yml` (Q5/Q8/Q9 resolved in ADR 0003).

- Given a merged pull request to `main`, when CI and the deploy workflow complete, then `https://melinoeluna4.github.io/` serves the new build.
- Given a failing build, when the workflow runs, then the deployment is not promoted and the previous production build stays live.
- Given a branch push, when CI runs, then the build and tests run but no production deployment is published; only `main` deploys.
- Given the repository, when a new contributor clones it, then the deploy steps are documented and need no secrets beyond the GitHub token and Pages permissions.

**FR-15 — Content-driven pages**

The system must drive `/proyectos`, `/blog` and `/blog/[slug]` from Astro Content Collections with schema validation. `/sobre-mi` uses typed data modules (`about.ts`, `skills.ts`, `roadmap.ts`), which are compile-time checked and documented in ADR 0003.

- Given a content file missing a required field, when the build runs, then it fails with a message naming the file and field.
- Given a valid content file, when the build runs, then its page is generated without any manual route registration.

## Non-functional requirements

- **NFR-1 Performance:** Lighthouse mobile 100 for Performance/Accessibility/Best Practices/SEO on `/`, `/proyectos`, `/blog` and `/blog/[slug]`; LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms (FID ≤ 100 ms as a secondary check); TTFB ≤ 200 ms from the GitHub Pages CDN is a target, measured on the deployed URL.
- **NFR-2 JavaScript budget:** no UI framework runtime shipped; the only client JavaScript is the inline theme controls and the plain-TypeScript blog filter, small enough to keep TBT < 200 ms on a mid-tier mobile profile in Lighthouse.
- **NFR-3 Build performance:** a content-only change rebuilds and deploys in under 5 minutes.
- **NFR-4 Accessibility:** WCAG 2.1 AA — keyboard-operable interactive elements, visible focus, text contrast ≥ 4.5:1, one `<h1>` per page, landmarks present, decorative elements `aria-hidden`.
- **NFR-5 SEO/crawlability:** every route is server-rendered HTML; semantic headings; descriptive link text; no content behind client JavaScript.
- **NFR-6 Security:** no secrets in the repository or client bundle; external links use `rel="noopener noreferrer"`; the client filter treats input as literal text, bounds it to 100 characters and never injects HTML. GitHub Pages does not apply custom response headers from this repository, so security-header work would require a different host (ADR 0003).
- **NFR-7 Privacy:** no third-party trackers or cookies; theme preference stored in `localStorage` only (Q12 resolved: no analytics).
- **NFR-8 Availability/cost:** static assets served from the GitHub Pages CDN; the site uses the free public-repository Pages tier.
- **NFR-9 Browser support:** latest two versions of Chrome, Firefox, Safari and Edge; all content readable without JavaScript.
- **NFR-10 Maintainability:** TypeScript strict mode; one component per file under `src/components/`; content schemas defined once in `src/content/config.ts`; `README.md` documents setup, content authoring and deploy.
- **NFR-11 i18n:** single copy language in v1 (Spanish, per Q4); no i18n routing. Copy lives in the pages, components and content files; centralising it is deferred until a second language is actually required.

## Data

Content Collections (local Markdown). Q1 is resolved: no D1 store.

`projects` (one file per project, e.g. `src/content/projects/<slug>.md`)

| Field         | Type                              | Required    | Notes                                                   |
| ------------- | --------------------------------- | ----------- | ------------------------------------------------------- |
| `title`       | string                            | yes         | card heading                                            |
| `description` | string                            | yes         | 1–2 sentences, also used for meta description           |
| `slug`        | string                            | yes         | the filename is the slug; kebab-case                    |
| `tags`        | string[]                          | yes         | Go, Rust, Docker, Cloudflare, etc.; drives tags/filters |
| `status`      | enum `in_progress` \| `completed` | yes         | rendered by `ProjectCard`                               |
| `repoUrl`     | url                               | no          | hidden when absent                                      |
| `demoUrl`     | url                               | no          | hidden when absent                                      |
| `featured`    | boolean                           | no          | default `false`; controls presence on `/`               |
| `startDate`   | date                              | no          | ordering                                                |
| `endDate`     | date                              | conditional | required when `status: completed` (Q16 resolved)        |
| `cover`       | image                             | no          | optimised by Astro assets                               |
| `order`       | number                            | no          | manual ordering override                                |

`blog` (one file per post, e.g. `src/content/blog/<slug>.md`)

| Field         | Type     | Required | Notes                                       |
| ------------- | -------- | -------- | ------------------------------------------- |
| `title`       | string   | yes      |                                             |
| `description` | string   | yes      | listing excerpt and meta description        |
| `pubDate`     | date     | yes      | newest-first ordering                       |
| `updatedDate` | date     | no       | shown only when present                     |
| `tags`        | string[] | yes      | feeds tag index and mini-feed filter        |
| `draft`       | boolean  | no       | default `false`; drafts excluded from build |
| `cover`       | image    | no       | OG image fallback for the post              |
| `body`        | MDX      | yes      | code fences highlighted at build            |

`skills` (single data file, e.g. `src/data/skills.ts` or `content/skills`)

| Field      | Type   | Required | Notes                                                                                |
| ---------- | ------ | -------- | ------------------------------------------------------------------------------------ |
| `category` | string | yes      | e.g. Backend, Frontend, Infrastructure (see Q7 for levels)                           |
| `name`     | string | yes      | Go, Rust, Astro, TypeScript, Tailwind CSS, Workers, Pages, D1, R2, KV, Docker, Linux |
| `level`    | enum   | yes      | taxonomy undefined → Q7                                                              |

`roadmap` (learning roadmap items)

| Field    | Type   | Required | Notes                               |
| -------- | ------ | -------- | ----------------------------------- |
| `label`  | string | yes      | topic or milestone                  |
| `status` | enum   | yes      | e.g. learning / planned / done → Q7 |
| `note`   | string | no       | short context                       |

`site` (single config: `src/config.ts`)

| Field            | Type             | Required | Notes                                                           |
| ---------------- | ---------------- | -------- | --------------------------------------------------------------- |
| `name`           | string           | yes      | "Melinoe Luna"                                                  |
| `role`           | string           | yes      | "DevOps Engineer & Backend Developer"                           |
| `focus`          | string[]         | yes      | DevOps, Go, Rust, Cloudflare                                    |
| `social`         | `{label, url}[]` | yes      | GitHub, LinkedIn, Twitter/X (Q6 resolved; edit `src/config.ts`) |
| `description`    | string           | yes      | default meta description                                        |
| `defaultOgImage` | image            | yes      | fallback OG image                                               |
| `locale`         | string           | yes      | copy language per Q4                                            |

Relations: `blog.tags` and `projects.tags` are the shared tag vocabulary rendering tag indexes and filters; a tag page/filter exists only as the filter state defined in FR-9/FR-10 (dedicated tag routes: Q3).

## Interfaces

Routes:

| Path                    | Render                 | Input                                        | Output                                                               |
| ----------------------- | ---------------------- | -------------------------------------------- | -------------------------------------------------------------------- |
| `/`                     | static                 | site config, featured projects, recent posts | hero, focus statement, featured projects, recent notes, social links |
| `/sobre-mi/`            | static                 | `about`, `skills`, `roadmap`                 | history, education, principles, roadmap, skills by level             |
| `/proyectos/`           | static                 | `projects` collection                        | responsive grid with tags, status, detail/repo/demo links            |
| `/proyectos/<slug>/`    | static per project     | one `projects` entry                         | mini presentation, status, dates, tags and repo/demo links           |
| `/blog/`                | static + client filter | `blog` collection, tag index                 | listing newest-first, live filter, tag index                         |
| `/blog/<slug>/`         | static per post        | one `blog` entry                             | article with build-time code highlighting, dates and meta/OG         |
| `/blog/etiqueta/<tag>/` | static per tag         | tag slug generated from the collection       | filtered listing; the no-JS tag path                                 |
| `/rss.xml`              | static endpoint        | published posts                              | RSS 2.0 feed without drafts                                          |
| `/sitemap.xml`          | static endpoint        | routes, posts, tags                          | XML sitemap                                                          |
| `/404.html`             | static                 | none                                         | styled not-found page                                                |

Commands:

| Command                        | Purpose                                               |
| ------------------------------ | ----------------------------------------------------- |
| `pnpm install`                 | install dependencies                                  |
| `pnpm dev`                     | local dev server                                      |
| `pnpm build`                   | production build (content schema validation)          |
| `pnpm preview`                 | serve the built static output                         |
| `pnpm check`                   | Astro and content diagnostics                         |
| `pnpm typecheck`               | `tsc --noEmit`                                        |
| `pnpm lint` / `pnpm format`    | Biome check / write                                   |
| `pnpm test:unit`               | Vitest                                                |
| `pnpm test:e2e`                | build + preview + Playwright + axe                    |
| `pnpm deploy`                  | trigger the GitHub Pages workflow with the GitHub CLI |
| `.github/workflows/deploy.yml` | deploy on push to `main` (FR-14)                      |

Components (props contract):

| Component             | Props                                             | Renders                                                             |
| --------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| `Header.astro`        | none (reads `site`)                               | one header, active nav, native mobile menu, `ThemeToggle`           |
| `Footer.astro`        | none (reads `site`)                               | copyright, site links, external social links                        |
| `ThemeToggle.astro`   | none                                              | button, `aria-pressed`, inline post-paint behaviour                 |
| `ProjectCard.astro`   | `project: ProjectView`, `index: number`           | title, description, tags, text status badge, detail/repo/demo links |
| `StatusBadge.astro`   | `status: ProjectStatus`                           | icon + `In Progress`/`Completed`, shared by cards and detail pages  |
| `ProjectLayout.astro` | `project: ProjectView`, `related?: ProjectView[]` | project detail shell, Markdown body and related projects            |
| `PostCard.astro`      | `post: PostView`                                  | title, date, description, tags, filter data attributes              |
| `TagList.astro`       | `tags: TagCount[]`, `active?: string`             | static tag links with counts                                        |
| `PostList.astro`      | `posts: PostView[]`, `emptyMessage?: string`      | list or explicit empty state                                        |
| `SearchFilter.astro`  | `tags: TagCount[]`, `total: number`               | GET form, client filter, live count, no-JS note                     |
| `Seo.astro`           | title, description, image, type, dates, tags      | title, description, canonical, OG, Twitter and article metadata     |

Theme contract: `localStorage` key `theme` with values `light` | `dark`; applied on `<html>` before first paint; no `theme` value means follow `prefers-color-scheme`. The CSS uses `light-dark()` so the system preference also applies with JavaScript disabled.

## Edge cases

- **No JavaScript:** header/footer navigation, project links and the filter's GET submission all work; the listing renders unfiltered and the static tag pages filter by tag.
- **Filter returns zero results:** show an explicit empty state ("no posts match") with a clear-filter action; never render an empty container with no message.
- **Client filter fails to initialise:** the complete static listing stays visible; the count remains the total and the tag pages remain usable.
- **Unknown slug** (`/blog/does-not-exist`): respond `404` with a site-styled page (dedicated `404.astro`: Q11).
- **Draft post referenced by URL:** not built, so it resolves to `404` in production.
- **Post without tags:** renders normally; excluded from tag filters and tag counts.
- **Project without `repoUrl` and without `demoUrl`:** card renders with no links and no empty anchors.
- **Duplicate slugs** across content: build fails with a clear error.
- **Invalid frontmatter** (wrong date, unknown status/tag): build fails naming the file and field.
- **Very long titles, descriptions or 20+ tags:** wrap or clamp with an accessible way to read the full value; no horizontal page overflow at 320 px.
- **Long unbroken strings in code blocks or URLs:** horizontal scroll contained inside the block/container.
- **Search query with regex/special/Unicode characters or 10 KB of input:** treated as literal text, bounded to 100 characters in the client filter and never injected as HTML.
- **`localStorage` unavailable or blocked:** theme falls back to `prefers-color-scheme` without throwing; the page still renders.
- **Missing or failed image:** `alt` text remains visible; dimensions stay reserved so CLS is unaffected.
- **GitHub Pages build failure:** the deployment is not promoted and the previous production build stays live; the failure is visible in the Actions log.

## Resolved decisions

All seventeen questions are closed for this build; the full rationale is in [ADR 0003](docs/adr/0003-static-github-pages-content-collections.md).

| Question | Decision                                                                                                                      |
| -------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Q1       | Local Markdown content collections. No D1, no admin write path.                                                               |
| Q2       | `/blog` gets the filter. It is client-side, with static tag pages as the no-JS path.                                          |
| Q3       | Both: tag counts on `/blog` and a 3-post mini-feed on `/`.                                                                    |
| Q4       | Spanish UI and copy; required status labels stay `In Progress`/`Completed`; identifiers and code are English.                 |
| Q5       | GitHub Pages user site: `https://melinoeluna4.github.io/`, repository `melinoeluna4/melinoeluna4.github.io`.                  |
| Q6       | GitHub `melinoeluna4`, LinkedIn `melinoeluna4`, X `melinoeluna4`; edit `src/config.ts` if the LinkedIn path differs.          |
| Q7       | Skills: `advanced` / `intermediate` / `learning`. Roadmap: `done` / `learning` / `planned`.                                   |
| Q8       | No SSR. The filter is not a reason to add an adapter.                                                                         |
| Q9       | No Workers. Static GitHub Pages only.                                                                                         |
| Q10      | INP ≤ 200 ms is the target; FID ≤ 100 ms is a secondary check.                                                                |
| Q11      | Custom 404, sitemap and RSS are in scope and implemented.                                                                     |
| Q12      | No analytics; the site is tracker-free.                                                                                       |
| Q13      | Social links only; no contact form or `mailto:` backend.                                                                      |
| Q14      | All-Constructivist light/dark palette, system fonts, no third-party assets.                                                   |
| Q15      | 5 projects: the four Go CLI tools (envcheck, portwait, httpcheck, treehash) and the portfolio; 4 published posts and 1 draft. |
| Q16      | No project covers; `endDate` is required when `status: completed`.                                                            |
| Q17      | The biography is drafted as editable sample content in `src/data/about.ts`; the owner reviews and replaces it.                |

## Milestones

- **M1 — Deployable skeleton:** Astro + TypeScript strict + Tailwind, base layout with `Header`/`Footer`/`ThemeToggle`, `/` rendering the site config, deployed to GitHub Pages. Done when `/` is publicly reachable with a working, persistent theme toggle and Lighthouse SEO/a11y pass baseline.
- **M2 — Projects surface:** `projects` Content Collection with schema, `ProjectCard.astro` with status badges and tags, `/proyectos` listing, `featured` projects on `/`. Done when FR-5, FR-6 and FR-15 pass for projects and a status edit changes the rendered badge after deploy.
- **M3 — About page:** `/sobre-mi` with history, education, roadmap and skills grouped by level, driven by data files. Done when FR-4 passes and Q7/Q17 answers are applied.
- **M4 — Blog:** `blog` collection, `/blog` listing (newest first, drafts excluded), `/blog/[slug]` with build-time Shiki highlighting, post OG/`article` metadata. Done when FR-7, FR-8 and the post part of FR-11 pass.
- **M5 — Interactivity and tags:** client-side search/filter with URL state, static tag pages for the no-JS path, live-region count, tag index and mini-feed. Done when FR-9 and FR-10 pass with JavaScript disabled and enabled.
- **M6 — Hardening:** OG image defaults, 404/sitemap/RSS, Lighthouse 100 across the four target pages, CWV verification, README deploy docs. Done when G1–G6 are all measured and met on production. GitHub Pages does not support custom response headers from this repository (ADR 0003).
