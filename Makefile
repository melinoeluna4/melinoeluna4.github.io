PNPM ?= pnpm

.DEFAULT_GOAL := help

.PHONY: help install dev build preview check sync lint format typecheck test test-unit test-e2e hooks deploy

help: ## List the available targets
	@awk 'BEGIN {FS = ":.*## "} /^[a-zA-Z0-9_-]+:.*## / {printf "  %-12s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies with pnpm
	$(PNPM) install

dev: ## Start the Astro dev server
	$(PNPM) dev

build: ## Build the static site into dist/
	$(PNPM) build

preview: ## Serve the production build locally
	$(PNPM) preview

check: ## Type-check Astro components and content schemas
	$(PNPM) check

sync: ## Generate content collection types
	$(PNPM) sync

lint: ## Lint and format-check with Biome
	$(PNPM) lint

format: ## Format and fix lint findings with Biome
	$(PNPM) format

typecheck: ## Check TypeScript types without emitting
	$(PNPM) typecheck

test: ## Run unit tests, then end-to-end tests
	$(PNPM) test

test-unit: ## Run Vitest unit tests
	$(PNPM) test:unit

test-e2e: ## Run Playwright tests against the built site
	$(PNPM) test:e2e

hooks: ## Install the Lefthook git hooks
	$(PNPM) hooks:install

deploy: ## Trigger the GitHub Pages deploy workflow
	$(PNPM) deploy
