# Progress: melinoe-luna-portfolio

Where the work stands, for whoever goes on with it. Rewritten after every build; `Done` is a log and is kept.

## Now

- Last build: full portfolio · 2026-11-06 · build 19 pages · 28 unit + 35 E2E tests pass · `astro check` 0 errors, 0 warnings, 0 hints · Biome clean · Lighthouse mobile 100/100/100/100 on `/`, `/proyectos/`, `/blog/` and a post.
- Deploy target: GitHub Pages, repository `melinoeluna4/melinoeluna4.github.io`, live at `https://melinoeluna4.github.io/`.
- Last deploy: `Deploy to GitHub Pages` run 42256551206 · success · 2026-11-06 · live routes, CSS, OG image, RSS, sitemap and the styled 404 verified.
- What it is: a static Astro 7 portfolio and mini blog. Constructivist light/dark theme, content collections for projects and posts, Markdown with build-time Shiki highlighting, SEO/OG/RSS/sitemap/404, a client-side blog filter with static tag pages for the no-JS path, and Playwright + axe checks.
- To resume: `pnpm install`, `pnpm dev`; run `pnpm test:e2e` for the full browser suite; read `docs/adr/0003-static-github-pages-content-collections.md` for the decisions.

## Done

- 2026-11-06 · full portfolio · ✓ built · 82 files checked · checks pass · 28 unit + 35 E2E · Lighthouse 100/100/100/100
- 2026-11-06 · deploy · ✓ public repo created · Pages source = GitHub Actions · workflow success · live URL verified
- 2026-11-06 · content · ✓ 5 projects, 4 published posts, 1 draft, skills, roadmap and about data
- 2026-11-06 · design · ✓ Constructivist tokens, light/dark `light-dark()`, 320/360 px containment, reduced motion
- 2026-11-06 · SEO and feeds · ✓ canonical/OG/Twitter per page, RSS, sitemap, robots, 404
- 2026-11-06 · tests · ✓ 28 Vitest tests, 35 Playwright tests, axe on five pages in both themes
- 2026-11-06 · docs · ✓ README, AGENTS, STACK, DESIGN, SPEC and ADR 0003 updated
- 2026-11-05 · foundation · ✓ built · 16 files · checks pass

## Open

- Replace the sample content: `src/content/projects/`, `src/content/blog/`, `src/data/about.ts`, `src/data/skills.ts`, `src/data/roadmap.ts`.
- Confirm the final social URLs and handles in `src/config.ts`; the LinkedIn path is the most likely placeholder.
- Run Lighthouse against the deployed URL after content replacement and record LCP/CLS/INP field data. The local build scores 100/100/100/100, but field metrics are not the same as local numbers.
- Optional: custom domain (`site` in `astro.config.mjs` + `public/CNAME` + DNS).
- Revisit the TypeScript 6.0.3 pin when `@astrojs/check` supports TypeScript 7.

## Next

1. Open `https://melinoeluna4.github.io/` and spot-check the live routes, the filter and the theme.
2. Replace the sample projects and posts, then rerun `pnpm test:e2e` and push.
3. Run Lighthouse mobile on the deployed URL after the content replacement.
4. Add a custom domain only if it is part of the final brand.

## Known trade-offs

- The blog search is client-side by decision (ADR 0003). Without JavaScript the listing is complete and the static tag pages filter by tag; the search box itself does not filter without JS.
- GitHub Pages does not support custom response headers from this repository; `rel="noopener noreferrer"` and the bounded client filter are the security surface.
- TypeScript is pinned to 6.0.3 because `@astrojs/check` does not support 7.0 yet. Do not drop `astro check` to chase the compiler.
