# 0001. Foundation: Use pnpm as the only package manager; all commands are package.json scripts and the Makefile is a thin wrapper, so local and CI run the same commands

## Status

Accepted · 2026-11-05

## Context

Build of melinoe-luna-foundation (foundation · from STACK.md). This build lays the foundation for Melinoe Luna's Astro portfolio: the pnpm manifest, Astro/TypeScript/Biome/Playwright configuration, Cloudflare and CI/hook/update tooling, a minimal static home page that prints the project name, one Playwright smoke test, and the README. It intentionally contains no content collections, layouts, components, styling tokens or routes beyond `/`; those arrive in the domain and design builds. The smoke test builds and serves the static output, proving the toolchain end to end. Later layers follow `pages → layouts → components → lib`.

## Decision

Architecture: Root tooling owns the manifest, compiler/lint/test/deploy configuration and CI/hooks. `src/pages/` owns routes; the only route is the minimal `index.astro`. `tests/e2e/` owns Playwright specs that exercise the built site. No domain, layout, component or lib modules exist yet; when added they must depend downward as `pages → layouts → components → lib`, with `lib` free of `.astro` imports and no cycles.

- Use pnpm as the only package manager; all commands are package.json scripts and the Makefile is a thin wrapper, so local and CI run the same commands.
- Pin dependency versions with the `latest` dist-tag in package.json and let pnpm resolve them into the lockfile, avoiding guessed versions in the plan.
- Astro runs in static output mode with no SSR adapter; the foundation page is plain `.astro` and ships no client JavaScript.
- TypeScript is check-only (`tsc --noEmit`) with `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax` and `isolatedModules`.
- Biome 2 is the only formatter/linter; no ESLint or Prettier configs are created.
- Playwright is the only smoke test now and runs against `astro preview` of the built site; Vitest is installed and passes with no tests until `lib/` exists.
- Keep `src/content`, `src/layouts`, `src/components`, `src/lib` and `src/styles` absent rather than empty placeholders; the design and domain builds create them.
- Third-party GitHub Actions are pinned to full commit SHAs in CI, and Renovate groups Astro/Tailwind updates.

## Consequences

- Files created: package.json, astro.config.mjs, tsconfig.json, src/pages/index.astro, playwright.config.ts, tests/e2e/smoke.spec.ts, biome.json, lefthook.yml, .github/workflows/ci.yml, renovate.json, wrangler.toml, Makefile, .env.example, .gitignore, README.md
- Later changes follow these decisions; one that reverses a decision gets a new ADR that supersedes this one.
