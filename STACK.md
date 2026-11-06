# STACK.md: Astro content site

## Summary

A content-first portfolio and mini blog on Astro. Pages are rendered to static HTML at build time and ship no UI
framework runtime; interactivity is limited to inline theme controls and one plain-TypeScript blog filter. Content is
Markdown in type-checked content collections, so a typo in front matter fails the build instead of the page. The site is
deployed to GitHub Pages, not to a server runtime.

## Stack

| Layer           | Choice                                                                                              | Why                                                                                   |
| --------------- | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| Language        | TypeScript 6.0.3 (check-only, `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`) | `@astrojs/check` does not support TypeScript 7.0 yet; the pin is recorded in ADR 0003 |
| Framework       | Astro 7, static output                                                                              | Static HTML by default, content layer, no server runtime                              |
| Content         | Content collections (`src/content.config.ts`) with Zod schemas and Markdown                         | Validated front matter; no MDX dependency needed                                      |
| Client JS       | Inline pre-paint theme scripts + one plain-TypeScript filter                                        | No UI framework runtime, no island hydration                                          |
| Styling         | Tailwind CSS 4 (`@tailwindcss/vite`), tokens in `@theme` in `src/styles/app.css`                    | Utilities generated from tokens; no config file                                       |
| Images          | `astro:assets` when content images arrive; the current design uses CSS geometry                     | Sizes, formats and lazy loading at build                                              |
| SEO             | `Seo.astro`, manual `sitemap.xml`, RSS and `robots.txt`                                             | No extra integration needed for four routes                                           |
| Search/filter   | Client-side blog filter + static tag pages                                                          | Static hosting, URL state, no-JS tag fallback                                         |
| Tests           | Vitest + Playwright + `@axe-core/playwright`                                                        | Pure helpers, pages, theme, filter, SEO and a11y                                      |
| Lint            | Biome 2 (`@biomejs/biome`), `biome.json`                                                            | One fast tool, one config, no plugin drift                                            |
| Deploy          | GitHub Pages through `.github/workflows/deploy.yml`                                                 | Static output on the owner's public user site                                         |
| Package manager | pnpm                                                                                                | Lockfile and scripts are the source of truth                                          |
| Typecheck       | `tsc --noEmit` from the TypeScript 6 package                                                        | The bundler strips types; tsc only checks                                             |
| CI              | GitHub Actions (`.github/workflows/ci.yml`) on pull requests and `main`                             | Same gates as local                                                                   |
| Hooks           | Lefthook: pre-commit format + lint on staged files, commit-msg Conventional Commits                 | Fast local feedback                                                                   |
| Updates         | Renovate: grouped weekly updates, automerge for patch and lockfile maintenance                      | Small reviewable steps                                                                |

## Project layout

```
src/
  content.config.ts                projects and blog schemas
  content/
    blog/<slug>.md                 published notes and drafts
    projects/<slug>.md             project entries
  data/                            about, skills, roadmap
  pages/                           routes only
    index.astro
    proyectos.astro
    sobre-mi.astro
    blog/index.astro
    blog/[...slug].astro
    blog/etiqueta/[tag].astro
    404.astro
    rss.xml.ts
    sitemap.xml.ts
  layouts/
    BaseLayout.astro               html, head, pre-paint theme, Seo, header, main, footer
    PostLayout.astro               article shell
  components/
    Seo.astro
    Header.astro
    Footer.astro
    ThemeToggle.astro
    ProjectCard.astro
    PostCard.astro
    PostList.astro
    TagList.astro
    SearchFilter.astro
  lib/                             pure queries and helpers
  scripts/blog-filter.ts           the only client module
  styles/                          app.css tokens + base, components, prose, motion
public/                            favicon, OG image, robots.txt, .nojekyll
scripts/e2e.mjs                    build + preview + Playwright lifecycle
tests/e2e/                         Playwright + axe specs
```

Dependency direction: `pages → layouts → components → lib → data/types`; `lib` is plain TypeScript with no `.astro`
imports; client scripts import only pure `lib` helpers.

```
src/styles/app.css             @import "tailwindcss"; @theme { … } (tokens); imports base/components/prose/motion
.github/workflows/ci.yml       jobs: lint (Biome + tsc + astro check), test, build
.github/workflows/deploy.yml   build, configure Pages, upload artifact, deploy
lefthook.yml                   pre-commit: format + lint ({staged_files}); commit-msg: conventional commit check
renovate.json                  config:recommended; schedule; groups; automerge patch
```

## Conventions

- One file = one responsibility: one component, one layout, one query helper.
- `.astro` components by default; there are no hydrated islands. The only client JavaScript is the inline theme controls and `src/scripts/blog-filter.ts`.
- Every collection entry is validated by its schema; drafts are filtered in `lib/posts.ts`, never in pages.
- Every page sets title, description and canonical URL through `Seo.astro`; post pages also set `og:type=article` and article dates.
- Images, if added, go through `astro:assets` with width, height and `alt`; decorative images use `alt=""`. The current design uses CSS geometry, not content images.
- URLs are stable: renaming a slug requires a redirect in `astro.config.mjs`. The canonical origin is `https://melinoeluna4.github.io`; the repo is the user site, so `base` stays `/`.
- New section = a collection + schema → query helper in `lib/` → page with `getStaticPaths` → layout/components.
- `tsconfig.json` keeps `strict: true`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` and `isolatedModules` on; a file never lowers them locally.
- Types are checked by `tsc`, code is emitted by the bundler (Vite, Astro): never rely on `tsc` output files.
- Before upgrading, check that every tool that loads the compiler API states TypeScript 7 support; if one lags, keep that tool on its supported version and record why. `@astrojs/check` currently requires TypeScript 6.
- `biome.json` is the only lint/format config: no `.eslintrc*`, no `.prettierrc*` in the repository.
- Recommended rules on, plus `noExplicitAny`, `noUnusedVariables` and `useImportType` as errors. `noUnusedImports` and `noUnusedVariables` are disabled for `.astro` because Biome cannot see template usage.
- Imports are sorted by Biome (organize imports); never sort them by hand.
- Design tokens live in `@theme` (colors, fonts, radius, spacing) and mirror DESIGN.md; components use the generated utilities (`bg-background`, `text-muted`, `bg-accent`, `border-border-strong`).
- Long class lists are composed in one place (a variant helper such as `cva` or a component), not repeated across files.
- Arbitrary values (`w-[317px]`) only with a comment; a repeated one becomes a token.
- The site is static. There are no Cloudflare bindings, Wrangler variables or server request paths; `public/` is served as is by GitHub Pages.
- The blog filter is a client-side progressive enhancement; static `/blog/etiqueta/<tag>/` pages are the no-JS path. Do not add an htmx endpoint or an SSR adapter without a new ADR.
- CI runs exactly the commands in the Commands table; no CI-only scripts.
- Third-party actions are pinned to a full commit SHA; `permissions:` default to `contents: read`.
- `concurrency` cancels superseded runs on the same branch; `main` is protected and requires a green CI.
- Hooks run only the fast checks on staged files; tests stay in CI.
- Hooks run the same commands as the Commands table.
- Related packages update together (framework + its plugins, test tooling, linters).
- Patch updates and lockfile maintenance automerge only when CI is green; minor/major are reviewed.
- A major update gets its own pull request with the migration notes linked.

## Commands

| Task               | Command                         |
| ------------------ | ------------------------------- |
| Install            | `pnpm install`                  |
| Install hooks      | `pnpm hooks:install`            |
| Dev server         | `pnpm dev`                      |
| Build              | `pnpm build`                    |
| Preview            | `pnpm preview`                  |
| Type/content check | `pnpm check`                    |
| Sync content types | `pnpm sync`                     |
| Lint               | `pnpm lint`                     |
| Format             | `pnpm format`                   |
| Unit tests         | `pnpm test:unit`                |
| E2E tests          | `pnpm test:e2e`                 |
| Typecheck (watch)  | `tsc --noEmit --watch`          |
| Deploy             | `pnpm deploy` or push to `main` |

## Testing

- `astro check` is the first test: content schemas and component props.
- Vitest for pure `lib/` helpers (dates, tags, filter, XML, navigation).
- Playwright on the built site: key pages, theme persistence, the blog filter, static tag pages, 404, SEO, RSS, sitemap and 320/360 px containment.
- axe (`@axe-core/playwright`) runs on the home (light and dark), projects, about, blog and post pages.
- Lighthouse targets: performance ≥ 95, accessibility 100, SEO 100 on `/`, `/proyectos`, `/blog` and a post. Run Lighthouse against the deployed URL after content replacement; local headless numbers are not field data.

## Quality gates

- `astro check` with zero errors, Biome format and lint clean, `tsc --noEmit` exits 0.
- No UI framework runtime; the only client JS is the inline theme controls and the filter module.
- No horizontal page scroll at 320 px and 360 px; code blocks scroll inside their own container.
- `pnpm test:unit` and `pnpm test:e2e` pass, including axe checks in both themes.
- No `@ts-ignore` (use `@ts-expect-error` with a reason); no inline lint suppression without a reason.
- `biome check .` passes in CI (lint and format, no writes).

## Dependencies

- Astro built-ins first (`astro:assets`, content collections, `<ClientRouter />` view transitions).
- Allowed: the table above; anything else needs a reason in the PR. `@axe-core/playwright` is part of the test stack.
- Do NOT use: a UI framework runtime, client-side routing libraries, jQuery, analytics scripts that block rendering, external image CDNs when `astro:assets` is enough, Google Fonts links (self-host fonts or use system fonts).
- Do NOT add an SSR adapter, a Cloudflare Worker or a D1 binding to this static build.

## Rules for agents

- Never add a `client:*` directive or a framework island; the current site has none. If one becomes unavoidable, record the decision in an ADR first.
- Never render content without its collection schema; add fields to the schema first.
- Use `<Image />` from `astro:assets` for every content image, always with `alt`.
- Every new page uses a layout and the `Seo` component.
- Keep pages free of data logic: queries live in `lib/`.
- Do not introduce an SSR adapter unless a feature truly needs per-request rendering and a new ADR changes the deploy target.
- Self-host fonts and assets; no third-party requests on page load without a reason. The current site uses system fonts.
- Changing a URL requires a redirect entry.
- Never weaken `tsconfig.json` (turning off `strict` or a strict flag) to make a change compile: fix the types.
- Never use `any`; use `unknown` and narrow it, or write the type.
- Never add `@ts-ignore`; `@ts-expect-error` only with a one-line reason.
- Run `biome check --write .` before finishing; never commit unformatted files.
- Never add ESLint or Prettier next to Biome.
- Never disable a rule inline without `// biome-ignore <rule>: <reason>`.
- Never hardcode a color, font size or radius in a class or style: use a token from `@theme`, or add it there first.
- Never add a second CSS framework or a CSS-in-JS runtime.
- Do not write `@apply` chains to rebuild components in CSS: make a component.
- Never commit secrets. The GitHub Pages deploy uses the workflow token; no repository secrets are required.
- Keep the client bundle small: the theme scripts and the filter are the only client JavaScript.
- Never weaken or skip a CI step to make a change pass.
- A new quality gate is added to the Commands table and to `ci.yml` in the same change.
- Never put secrets in workflow files; use repository or environment secrets.
- Never bypass hooks with `--no-verify`.
- Commit messages follow Conventional Commits (`feat(scope): …`, `fix(scope): …`).
- Never pin a dependency to an old version to silence Renovate without a comment saying why. The TypeScript 6.0.3 pin is recorded in ADR 0003 because `@astrojs/check` requires it.
- Never mix a dependency update with feature changes in one commit.

## Engineering principles

Rules, not suggestions: every change follows them, and a review checks them. When one has to be broken, say so in the change and why.

### Clean Code

- **Names** reveal intent: a reader knows what a variable holds or a function does without reading its body; no abbreviations, no `data`, `info`, `tmp`, `manager`, `helper`.
- **Small functions**: one thing, one level of abstraction; ~30 lines is a smell, ~60 is a split. At most 3-4 parameters; more becomes an options/params type.
- **Guard clauses**: handle invalid cases first and return early; nesting deeper than 3 levels is refactored.
- **No surprises**: a function named like a query does not mutate; side effects are visible in the name (`save`, `send`, `delete`).
- **No magic values**: numbers and strings with meaning become named constants or configuration.
- **Comments explain why**, never what: the code says what. No commented-out code, no journal comments, no stale TODOs.
- **DRY with judgment**: remove duplicated knowledge, not similar-looking code; wait for the third occurrence before abstracting.
- **Boolean flags** that switch a function's behaviour become two functions.
- Review check: every new name reads as a sentence in its call site; no function in the diff exceeds the limits above without a reason in the change.

### Error handling

- **Never swallow**: every error is handled, returned or logged-and-escalated exactly once; empty catch blocks and ignored results are bugs.
- **Wrap with context**: add what was being done (`load order 42: …`) while keeping the original cause inspectable (wrapping, `cause`).
- **Domain errors are types/values** (`ErrOrderNotFound`, `InsufficientFunds`) declared in the core; infrastructure errors stay in adapters and are translated.
- **Map at the boundary, once**: one place turns errors into HTTP status, exit codes or UI messages; no status codes inside business logic.
- **Fail fast at startup**: missing or invalid configuration stops the process with a clear message instead of failing on first use.
- **No exceptions/panics for control flow**: expected outcomes (not found, invalid input) are values; panics only for programmer errors.
- **User-safe messages**: users see what happened and what to do; stack traces, SQL and internal ids go only to logs.
- **Log where handled**, not at every layer: one log entry per failure, with its context and correlation id.
- **Retries** only for transient errors, with backoff, jitter and a limit; never retry non-idempotent operations blindly.
- Review check: no new code path drops an error; every new error type is mapped at the boundary.

### Hexagonal architecture

- **The core** (domain + application) contains business rules and knows nothing about HTTP, databases, queues, frameworks, ORMs or the UI.
- **Ports are owned by the core**: interfaces declared where they are used (`OrderRepository`, `PaymentGateway`, `Clock`), named in business terms, never after a technology.
- **Adapters live at the edge**: driving adapters (HTTP handlers, CLI, consumers) call use cases; driven adapters (Postgres, Stripe, SMTP) implement ports.
- **Dependency rule**: adapters → application → domain. The core never imports an adapter, a driver or a framework package.
- **No framework types in the core**: no request/response objects, ORM entities, annotations or SDK types cross into it; adapters map to and from core types.
- **One composition root** (`main`/bootstrap) wires concrete adapters into the core; nothing else instantiates infrastructure.
- **Tests through ports**: use cases are tested with in-memory fakes of their ports; adapters get their own integration tests against the real technology.
- Review check: grep the core for driver, framework and SDK imports: there are none; every new adapter implements a port declared in the core.

### One file, one responsibility

- **One file = one responsibility**: one entity, one use case, one handler group, one component. If its description needs "and", it is two files.
- **Size limits**: ~300 lines is a soft limit, ~500 a hard one; a file over it is split by responsibility, not by line count.
- **Folders by feature**, not by technical type: `orders/` holds its entity, use cases, adapters and tests; shared kernels stay small and explicit.
- **Explicit public surface**: each module exposes a small API (index/exports/package-level types); everything else is private and may change freely.
- **No dumping grounds**: no `utils`, `helpers`, `common`, `misc` files; a helper lives next to its only user or in a module named for what it does.
- **High cohesion, low coupling**: things that change together live together; modules talk through interfaces or events, never through each other's internals.
- **Replaceable modules**: deleting or swapping a module touches its folder and the composition root, nothing else.
- **No cycles**: module dependencies form a DAG; a cycle is broken by extracting the shared concept or inverting a dependency.
- Review check: each new file can be described in one sentence; no import reaches into another module's private files.

### SOLID

- **Single responsibility**: a module, type or function has one reason to change. If describing it needs "and", split it.
- **Open/closed**: add behaviour by adding code (a new implementation, a new strategy, a new handler), not by growing `switch`/`if` chains in existing code.
- **Liskov substitution**: every implementation of an interface honours its full contract (inputs, outputs, errors, side effects); no implementation panics or ignores a method it "does not support".
- **Interface segregation**: interfaces are small and owned by the consumer; a consumer never depends on methods it does not call.
- **Dependency inversion**: business code depends on interfaces it defines; concrete adapters (DB, HTTP, queues, clocks, random) are injected from the composition root.
- Review check: no constructor creates its own infrastructure; no type takes more than ~5 dependencies (a sign it does too much).

### Testing

- **Pyramid**: many fast unit tests, fewer integration tests against real dependencies (containers), a few end-to-end tests of critical flows.
- **Test behaviour, not implementation**: assert on outputs and observable effects through public APIs; refactoring must not break tests.
- **Arrange, Act, Assert**: one behaviour per test, named after it (`rejects_order_without_items`); table-driven for variations.
- **Deterministic**: no `sleep`, no real clock, randomness or network in unit tests; inject clocks, id generators and seeds.
- **Fakes over mocks** for ports you own (in-memory repository); mocks only to assert interactions that are the behaviour (an email was sent).
- **Isolated**: tests do not depend on order or shared state; each creates its data and cleans up (transactions rolled back, temp dirs).
- **Every bug gets a regression test** that fails before the fix and passes after it.
- **Coverage is a signal, not a target**: uncovered critical paths matter; chasing a percentage with trivial tests does not.
- Review check: every changed behaviour has a test in the same change; the suite passes repeatedly and in parallel.
