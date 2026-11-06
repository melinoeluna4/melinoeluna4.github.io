# 0003. Ship a static, content-collection portfolio on GitHub Pages with a client-side blog filter and an all-Constructivist theme

## Status

Accepted · 2026-11-06. Supersedes the sample-content and phosphor-dark parts of [0002](0002-design-light-theme-uses-the-design.md).

## Context

The first builds produced a foundation and a partial interface. The owner then chose GitHub Pages on the public repository `melinoeluna4/melinoeluna4.github.io` (root URL, no subpath), asked for the full portfolio, and resolved three open decisions: keep the site static, use sample content that can be edited, and use the Constructivist language in both themes.

The original SPEC combined a Cloudflare hybrid SSR setup with an htmx endpoint for the blog filter. A full SSR adapter would add a server runtime, a deployment target and a request path that the site does not otherwise need. The owner accepted a static filter with a smaller no-JavaScript surface.

## Decision

- **Deploy target:** GitHub Pages, built by `.github/workflows/deploy.yml` and uploaded with the official Pages actions. The Astro `site` is `https://melinoeluna4.github.io`, the repository is the user site (`melinoeluna4.github.io`), so `base` stays `/`. The output is plain static HTML in `dist/`; there is no adapter and no Worker.
- **Content:** local Markdown in Astro content collections (`projects`, `blog`), validated in `src/content.config.ts`. The filename is the slug. Drafts are filtered in `src/lib/posts.ts` and never enter `getStaticPaths`, RSS or the sitemap. Sample projects, posts, skills, roadmap and biography ship so every screen renders; the owner replaces them in the same files.
- **Blog filter:** a progressive enhancement, not a server endpoint. `src/scripts/blog-filter.ts` filters the rendered cards in the browser, updates the URL with `history.replaceState` and announces the count in a live region. Without JavaScript the `/blog` form is a normal GET that shows the complete listing. Static `/blog/etiqueta/<slug>/` pages are generated from the tag index, so tags remain a fully working no-JS filter. The htmx endpoint and the htmx dependency are not used.
- **Theme:** light is the DESIGN.md Constructivist base palette; dark keeps the same red/black language with lighter surfaces and a brighter accent. The phosphor-green terminal palette is removed. Tokens use `light-dark()` so the system preference works before JavaScript runs; the pre-paint script applies the stored choice without a flash.
- **Copy:** Spanish UI and body copy, with required technical status labels `In Progress` and `Completed`, and English identifiers, code and commit messages.
- **TypeScript:** pinned to 6.0.3 because `@astrojs/check` does not support TypeScript 7.0 yet. Revisit when the checker supports it; do not drop `astro check` to chase the newer compiler.
- **Client runtime:** no UI framework runtime. The theme scripts are inline and the filter is plain TypeScript compiled by Astro. No analytics, no third-party requests on page load.
- **Profiles:** the GitHub, LinkedIn and X URLs live in `src/config.ts`. They are the owner's handles where known; confirm or replace them before sharing the site widely.
- **Quality gates:** `biome check`, `tsc --noEmit`, `astro check`, Vitest, Playwright and axe. The deploy workflow builds the same static output that the tests exercise.

## Consequences

- `dist/` is portable to any static host, but the committed deployment is GitHub Pages.
- The search box cannot filter without JavaScript; the tag pages are the supported no-JS path. This is a deliberate trade-off and must be stated in the README.
- The site has no server-side request validation because it has no server endpoint; the client filter bounds the query to 100 characters, treats input as literal text and never injects HTML.
- GitHub Pages does not support custom response headers from this repository, so security headers are limited to what the static host provides. External links use `rel="noopener noreferrer"`.
- Files created: content collections, `src/data/`, `src/lib/`, `src/scripts/`, `src/components/`, `src/layouts/`, the additional pages, `src/styles/`, `public/`, `scripts/e2e.mjs`, `.github/workflows/deploy.yml`, tests and the ADR.
- Files removed or replaced: `wrangler.toml`, the Cloudflare deploy script and the unused Preact/Svelte/Wrangler dependencies.
