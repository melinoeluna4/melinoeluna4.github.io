# 0005. Add per-tool GitHub Pages landing pages and a fifth CLI

## Status

Accepted · 2026-11-06. Extends [0004](0004-add-go-cli-series-and-project-detail-pages.md).

## Context

The four CLI repositories had a README and a portfolio detail page, but no live page of their own. The owner asked for more GitHub Pages sites, each with a different design, presenting the repository and what it does. The series also had four tools; a fifth keeps the set consistent with five landing pages.

## Decision

- **Fifth CLI: `mdtoc`.** Reads Markdown from a file or stdin, extracts ATX headings, ignores fenced code blocks and prints a nested table of contents with GitHub-style anchors. Go 1.27, standard library only, tests + CI, README.
- **One landing page per tool, inside each tool repository:**
  - `docs/index.html`, `docs/styles.css`, `docs/app.js`, `docs/favicon.svg`, `docs/.nojekyll`.
  - GitHub Pages source: `main` branch, `/docs` folder, legacy build.
  - URL: `https://melinoeluna4.github.io/<tool>/`.
  - Each page has its own design language:
    - `envcheck`: CRT terminal, phosphor green on black.
    - `portwait`: blueprint sheet, navy/cyan technical drawing.
    - `httpcheck`: signal/status dashboard, dark navy with neon status codes.
    - `treehash`: paper archive, serif editorial, rust stamp.
    - `mdtoc`: documentation manual, cream/orange, sticky table of contents.
  - Every page is self-contained: no external fonts, scripts, images or analytics. It includes install/usage, links to the repository and portfolio, a copy button, a "more tools" section, responsive layout, focus states and reduced-motion handling.
- **Portfolio connection:** each project content file gets a `demoUrl` pointing to its landing page; the cards and detail pages render the live demo link. `mdtoc` becomes the sixth project (five CLIs + the portfolio).
- **Profile connection:** the profile README lists all five tools with repository and live links.
- **Repository homepage:** each tool repo points its GitHub homepage at its landing page, not at the portfolio.

## Consequences

- Five independent GitHub Pages sites are added; they share no code with the portfolio and can use a different visual language each.
- The portfolio project pages and the tool landing pages duplicate some copy. The landing page is the marketing surface; the portfolio is the catalog. Keep the install command and the tool name in sync.
- The tool repositories now serve both code and a website; the `docs/` folder is part of each repo's review surface.
- The five landing pages are static and have no server runtime. Their only client JavaScript is the copy button and, where present, a small demo interaction (port status replay, status selector, TOC highlighting).
- The portfolio sitemap does not include the tool landing pages because they belong to other origins; each landing page has its own canonical URL.
