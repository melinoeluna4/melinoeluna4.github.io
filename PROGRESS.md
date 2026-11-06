# Progress: melinoe-luna-portfolio

Where the work stands, for whoever goes on with it. Rewritten after every build; `Done` is a log and is kept.

## Now

- Last build: portfolio + five Go CLIs + five landing pages · 2026-11-06 · build 25 pages · 29 unit + 39 E2E tests pass · `astro check` 0 errors, 0 warnings, 0 hints · Biome clean · Lighthouse mobile 100/100/100/100 on the live home, the live envcheck detail page, the live landing pages and the local main pages.
- Deploy target: GitHub Pages, repository `melinoeluna4/melinoeluna4.github.io`, live at `https://melinoeluna4.github.io/`.
- Last deploy: `Deploy to GitHub Pages` run 42266255291 · success · 2026-11-06 · `mdtoc` project page and the five demo links live.
- Public CLI repos: `melinoeluna4/envcheck`, `melinoeluna4/portwait`, `melinoeluna4/httpcheck`, `melinoeluna4/treehash`, `melinoeluna4/mdtoc`; Go 1.27, standard library only, tests + CI.
- Landing pages: `https://melinoeluna4.github.io/<tool>/` for each CLI, each with a different design and `docs/` source in its repo; all five have a successful Pages build and a live 200.
- Profile README: `melinoeluna4/melinoeluna4`, presenting “Mujer dev en Go · Backend & DevOps” and the five tools with live links.
- To resume: `pnpm install`, `pnpm dev`; run `pnpm test:e2e` for the browser suite; read ADR 0003 (static portfolio), 0004 (CLI series/detail pages) and 0005 (landing pages/mdtoc).

## Done

- 2026-11-06 · five landing pages · ✓ envcheck (CRT), portwait (blueprint), httpcheck (signal), treehash (paper), mdtoc (manual) · Pages built · live 200 · axe clean · no overflow at 320/360 · Lighthouse 100/100/100/100
- 2026-11-06 · Go CLI series · ✓ envcheck, portwait, httpcheck, treehash, mdtoc · `go test`, `go vet`, `go build` pass · public repos with README, CI, topics and homepage
- 2026-11-06 · project detail pages · ✓ `/proyectos/<slug>/` generated from the projects collection · sitemap and tests updated · six detail pages live after the next deploy
- 2026-11-06 · profile README · ✓ `melinoeluna4/melinoeluna4` with the Go dev presentation, five tools and live links
- 2026-11-06 · full portfolio · ✓ built · 88 files checked · 29 unit + 39 E2E · Lighthouse 100/100/100/100
- 2026-11-06 · deploy · ✓ previous portfolio deploy · live URL, CSS, OG, RSS, sitemap and 404 verified · live Lighthouse 100/100/100/100
- 2026-11-06 · content · ✓ 6 projects (5 Go CLIs + portfolio), 4 published posts, 1 draft, skills, roadmap and about data
- 2026-11-06 · design · ✓ Constructivist tokens, light/dark `light-dark()`, 320/360 px containment, reduced motion
- 2026-11-06 · SEO and feeds · ✓ canonical/OG/Twitter per page, project detail pages, RSS, sitemap, robots, 404
- 2026-11-06 · tests · ✓ 29 Vitest tests, 39 Playwright tests, axe on project and blog pages
- 2026-11-06 · docs · ✓ README, AGENTS, STACK, DESIGN, SPEC and ADRs 0003–0005 updated
- 2026-11-05 · foundation · ✓ built · 16 files · checks pass

## Open

- Confirm the final social URLs and handles in `src/config.ts` and the profile README; the LinkedIn path is the most likely placeholder.
- Record field LCP/CLS/INP with Lighthouse or CrUX after the content replacement. The lab scores are 100/100/100/100.
- Optional: custom domain (`site` in `astro.config.mjs` + `public/CNAME` + DNS).
- Revisit the TypeScript 6.0.3 pin when `@astrojs/check` supports TypeScript 7.
- Optional: choose a license for the five CLI repositories (none was added yet).

## Next

1. Open the six portfolio project pages, the five landing pages and the profile README.
2. Replace or extend the sample posts and biography with the final copy.
3. Run Lighthouse mobile on the deployed home, projects, a project detail and a post after the content replacement.
4. Add a custom domain only if it is part of the final brand.

## Known trade-offs

- The blog search is client-side by decision (ADR 0003). Without JavaScript the listing is complete and the static tag pages filter by tag; the search box itself does not filter without JS.
- GitHub Pages does not support custom response headers from this repository; `rel="noopener noreferrer"` and the bounded client filter are the security surface.
- TypeScript is pinned to 6.0.3 because `@astrojs/check` does not support 7.0 yet. Do not drop `astro check` to chase the compiler.
- The CLI tools are Go standard library only by design: fewer dependencies, easy to install with `go install`, and a small surface to review.
- Each landing page is self-contained in its own repo; the portfolio only links to it. The copy is duplicated on purpose: the landing page sells the tool, the portfolio catalogs it.
