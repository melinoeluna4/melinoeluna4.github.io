# 0004. Add a Go CLI series, project detail pages and a GitHub profile README

## Status

Accepted · 2026-11-06.

## Context

The portfolio was already live, but the project evidence was mostly sample content. The owner asked for several small CLI tools, mini presentations, public repositories under `melinoeluna4`, and a GitHub profile that presents her as a woman dev in Go.

The portfolio had a projects listing but no project detail route. Adding real tools without a page to present them would leave the portfolio cards linking only to external repositories, and the Markdown bodies in the projects collection would stay unused.

## Decision

- **Four standalone Go CLIs**, each in its own public repository:
  - `envcheck`: compares `.env` with `.env.example`.
  - `portwait`: waits for TCP endpoints.
  - `httpcheck`: smoke-tests HTTP endpoints.
  - `treehash`: deterministic directory-tree hash.
- **Go 1.27, standard library only.** No third-party dependencies, so `go install` is the whole installation story and the review surface stays small.
- **Each repository ships:** `main.go`, the logic and tests, a README with a mini presentation (why, install, usage, exit codes, design, development), a GitHub Actions CI workflow (`go vet`, `go test`, `go build`), a `.gitignore`, topics and a homepage pointing at its portfolio page.
- **Portfolio project detail pages:** `/proyectos/<slug>/`, generated from the `projects` collection with `getStaticPaths`, rendered through a centered `ProjectLayout`, with the project Markdown body, status badge, dates, tags, repository/demo links and two related projects. The sitemap includes the detail pages.
- **Project cards link to the detail page** and keep conditional repository/demo links. `StatusBadge.astro` owns the status markup shared by cards and detail pages.
- **Content replacement:** the four fictional sample projects are replaced by the real tools; `Edge Notes` remains as the portfolio project (`in_progress`, not featured). The home still shows four featured cards, now the tools.
- **Profile presentation:** the `melinoeluna4/melinoeluna4` public repository contains the profile README: “Mujer dev en Go · Backend & DevOps”, the four CLIs, the stack, a terminal sample and links to the portfolio/blog.
- **Brand emphasis:** `site.focus` puts Go first; the about copy says “mujer dev en Go” and mentions the CLI series; the skills add “CLI tools” and “Testing en Go”; the roadmap records publishing and documenting the tools as done.

## Consequences

- The portfolio now has 24 generated pages: the existing routes plus five project detail pages.
- The projects collection is the single source for cards, detail pages and the sitemap; adding a tool means adding one Markdown file and one repository.
- The tool repositories are independent; the portfolio only links to them. A README change in a tool does not require a portfolio rebuild unless the copy depends on it.
- The profile README is a separate repository and must be updated when the tool list or portfolio URL changes.
- No new runtime dependency is added to the portfolio. The only client JavaScript remains the theme controls and the blog filter.
- The tool repositories have no license file yet; add one only after the owner chooses a license.
