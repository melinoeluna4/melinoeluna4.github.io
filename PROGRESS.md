# Progress: melinoe-luna-portfolio

Where the work stands, for whoever goes on with it. Rewritten after every build; `Done` is a log and is kept.

## Now

- Last build: portfolio + Go CLI series · 2026-11-06 · build 24 pages · 29 unit + 38 E2E tests pass · `astro check` 0 errors, 0 warnings, 0 hints · Biome clean · Lighthouse mobile 100/100/100/100 on the live home and on the local `/`, `/proyectos/`, `/proyectos/envcheck/`, `/blog/` and a post.
- Deploy target: GitHub Pages, repository `melinoeluna4/melinoeluna4.github.io`, live at `https://melinoeluna4.github.io/`.
- Last deploy: `Deploy to GitHub Pages` run 42261058634 · success · 2026-11-06 · five project detail pages live · live Lighthouse 100/100/100/100 on `/proyectos/envcheck/`.
- Public CLI repos: `melinoeluna4/envcheck`, `melinoeluna4/portwait`, `melinoeluna4/httpcheck`, `melinoeluna4/treehash`; Go 1.27, standard library only, tests + CI.
- Profile README: `melinoeluna4/melinoeluna4`, presenting “Mujer dev en Go · Backend & DevOps”.
- To resume: `pnpm install`, `pnpm dev`; run `pnpm test:e2e` for the browser suite; read ADR 0003 for the static/portfolio decisions and ADR 0004 for the CLI series and project detail pages.

## Done

- 2026-11-06 · Go CLI series · ✓ envcheck, portwait, httpcheck, treehash · `go test`, `go vet`, `go build` pass · public repos with README, CI, topics and homepage · all four CI runs green
- 2026-11-06 · project detail pages · ✓ `/proyectos/<slug>/` generated from the projects collection · sitemap and tests updated · five detail pages live
- 2026-11-06 · profile README · ✓ `melinoeluna4/melinoeluna4` with the Go dev presentation and tool links
- 2026-11-06 · deploy · ✓ project detail pages live · run 42261058634 · live Lighthouse 100/100/100/100 on `/proyectos/envcheck/`
- 2026-11-06 · full portfolio · ✓ built · 86 files checked · 29 unit + 38 E2E · Lighthouse 100/100/100/100
- 2026-11-06 · deploy · ✓ public repo created · Pages source = GitHub Actions · workflow success · live URL, CSS, OG, RSS, sitemap and 404 verified · live Lighthouse 100/100/100/100
- 2026-11-06 · content · ✓ 5 projects (4 Go CLIs + portfolio), 4 published posts, 1 draft, skills, roadmap and about data
- 2026-11-06 · design · ✓ Constructivist tokens, light/dark `light-dark()`, 320/360 px containment, reduced motion
- 2026-11-06 · SEO and feeds · ✓ canonical/OG/Twitter per page, project detail pages, RSS, sitemap, robots, 404
- 2026-11-06 · tests · ✓ 29 Vitest tests, 38 Playwright tests, axe on six pages including a project detail
- 2026-11-06 · docs · ✓ README, AGENTS, STACK, DESIGN, SPEC and ADRs updated
- 2026-11-05 · foundation · ✓ built · 16 files · checks pass

## Open

- Confirm the final social URLs and handles in `src/config.ts` and in the profile README; the LinkedIn path is the most likely placeholder.
- Record field LCP/CLS/INP with Lighthouse or CrUX after the content replacement. The local and live project-detail lab scores are 100/100/100/100.
- Optional: custom domain (`site` in `astro.config.mjs` + `public/CNAME` + DNS).
- Revisit the TypeScript 6.0.3 pin when `@astrojs/check` supports TypeScript 7.
- Optional: choose a license for the four CLI repositories (none was added yet).

## Next

1. Open the portfolio project pages, the four CLI repositories and the GitHub profile README.
2. Replace or extend the sample posts and biography with the final copy.
3. Run Lighthouse mobile on the deployed home, projects, a project detail and a post after the content replacement.
4. Add a custom domain only if it is part of the final brand.

## Known trade-offs

- The blog search is client-side by decision (ADR 0003). Without JavaScript the listing is complete and the static tag pages filter by tag; the search box itself does not filter without JS.
- GitHub Pages does not support custom response headers from this repository; `rel="noopener noreferrer"` and the bounded client filter are the security surface.
- TypeScript is pinned to 6.0.3 because `@astrojs/check` does not support 7.0 yet. Do not drop `astro check` to chase the compiler.
- The CLI tools are Go standard library only by design: fewer dependencies, easy to install with `go install`, and a small surface to review.
