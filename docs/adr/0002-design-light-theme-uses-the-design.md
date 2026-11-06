# 0002. Design: Light theme uses the DESIGN.md Constructivist base tokens and dark theme uses the phosphor-green terminal tokens; both are complete token sets in `app.css`, so no component hardcodes a theme

## Status

Accepted · 2026-11-05

## Context

Build of melinoe-luna-interface (design · from DESIGN.md). Builds the visible Constructivist portfolio interface for Melinoe Luna: a responsive shared layout, a home page with hero and featured work, a projects grid, an about page, a blog listing and a sample post page. The interface reads one curated sample-content module, so every screen renders without content collections or an SSR adapter. Design tokens live in one Tailwind v4 stylesheet and drive light Constructivist and dark phosphor-terminal themes. A native theme toggle persists before first paint, and the mobile navigation works without JavaScript. The entry route opens the new home page and every screen is wired through the existing Astro foundation.

## Decision

Architecture: Routes in `src/pages/` stay thin: each selects one page shell and asks `src/lib/content-queries.ts` for its data. `src/layouts/BaseLayout.astro` owns the document head, pre-paint theme script, one header, one main and one footer, composing `Seo`, `Header` and `Footer`. `src/components/` owns one presentational unit each and imports only types and the date formatter. `src/lib/content-queries.ts` is the only data-access module, reading `src/data/sample-content.ts` and exposing sorted projects, published posts, tag counts, skills and roadmap views; shared types live in `src/lib/content-types.ts`. `src/styles/app.css` owns the design tokens, base styles and repeated Constructivist classes. Dependency direction is pages → layouts → components → lib → data/types, with no cycles and no UI framework runtime.

- Light theme uses the DESIGN.md Constructivist base tokens and dark theme uses the phosphor-green terminal tokens; both are complete token sets in `app.css`, so no component hardcodes a theme.
- This interface build reads `src/data/sample-content.ts` rather than content collections, keeping every screen static and adapter-free.
- Theme preference is a two-state native button with an inline pre-paint script and a small click script in `ThemeToggle`; there is no hydrated island and no UI framework runtime.
- Mobile navigation is a native `<details>` disclosure, so every route link remains reachable without JavaScript.
- Copy is Spanish as the Q4 default, while the required status labels stay exactly `In Progress` and `Completed` and technical terms remain in English.
- Syntax highlighting in the sample post uses Astro's build-time `<Code>` component instead of a client-side highlighter.
- Styling maps CSS variables through Tailwind v4 `@theme inline`; repeated Constructivist surfaces, chips and prose rules are raw CSS classes, never `@apply` chains.

## Consequences

- Files created: src/styles/app.css, src/lib/content-types.ts, src/data/sample-content.ts, src/lib/format-date.ts, src/lib/content-queries.ts, public/og-default.svg, src/components/Seo.astro, src/components/ThemeToggle.astro, src/components/Header.astro, src/components/Footer.astro, src/components/TagList.astro, src/components/ProjectCard.astro, src/components/PostCard.astro, src/components/PostList.astro, src/layouts/BaseLayout.astro, src/pages/proyectos.astro, src/pages/sobre-mi.astro, src/pages/blog/index.astro, src/pages/blog/[...slug].astro, tests/e2e/interface.spec.ts
- Files changed: astro.config.mjs, src/pages/index.astro, README.md
- Later changes follow these decisions; one that reverses a decision gets a new ADR that supersedes this one.
