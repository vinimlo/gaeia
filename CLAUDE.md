# CLAUDE.md - GAEIA Integrator

## What This Is

GAEIA combines two git submodules into a gamified AI learning platform:

| Directory | Submodule | Purpose |
|-----------|-----------|---------|
| `cosmos/` | [cosmos](https://github.com/vinimlo/cosmos) | Astro 5 engine (UI, routing, progress) |
| `universe/` | [cosmos-universe-ai](https://github.com/vinimlo/cosmos-universe-ai) | AI/ML content (topics, trails, catalog) |

## Build & Dev Commands

**Always run from the repo root.**

```bash
# Development (recommended)
docker compose up                    # http://localhost:4321

# Or without Docker
cd cosmos && npm install && npm run dev

# Build (static for GitHub Pages)
cd cosmos && PUBLIC_MODE=static npm run build

# Type checking
cd cosmos && npm run astro check
```

## Submodule Workflow

```bash
# Clone with submodules
git clone --recursive https://github.com/vinimlo/GAEIA.git

# If already cloned without --recursive
git submodule update --init --recursive

# Update submodules to latest
git submodule update --remote
```

## Docker Setup

The root `docker-compose.yml` uses service `cosmos` and mounts `universe/` at `/universe`.

**Do NOT confuse with `cosmos/docker-compose.yml`** (service `gaeia-web`, different volume mounts — used for standalone cosmos development).

## Environment Variables

| Variable | Values | Purpose |
|----------|--------|---------|
| `PUBLIC_MODE` | `hybrid` (default) / `static` | `hybrid` = SSR + node adapter; `static` = GitHub Pages build |
| `COSMOS_UNIVERSE_PATH` | path | Where to find universe content (Docker: `/universe`) |
| `COSMOS_SITE_URL` | URL | Site URL for Astro (default: `http://localhost:4321`) |
| `COSMOS_BASE_PATH` | path | Base path (default: `/`, GitHub Pages: `/gaeia`) |

## Deployment

CI/CD via `.github/workflows/deploy.yml`:
- Triggers on push to `main` or manual dispatch
- Builds with `PUBLIC_MODE=static`, `COSMOS_BASE_PATH=/gaeia`
- Deploys to GitHub Pages at `vinimlo.github.io/gaeia`
- Uses Node 20, `npm ci` in `cosmos/` directory

## Language

- UI and content: **Brazilian Portuguese** (pt-BR)
- Variable/function names use Portuguese terms (trilha, topico, modulo, conquistas)
- Code comments and logs: English

## Key Directories

- `docs/` — Architecture docs, schemas, migration plans
- `tools/` — Utility scripts (e.g., `scrape_roadmap.py`)
- `.github/workflows/` — CI/CD pipeline
