# CLAUDE.md - Project Instructions for AI Assistants

## Build & Development Commands

**IMPORTANT: Always use Docker for all build, dev, and test commands.**

```bash
# Build the project
docker compose run --rm gaeia-web npm run build

# Run development server
docker compose run --rm --service-ports gaeia-web npm run dev

# Run type checking
docker compose run --rm gaeia-web npm run astro check

# Install dependencies
docker compose run --rm gaeia-web npm install
```

## Project Structure

- `src/components/` - Astro components
- `src/pages/` - Astro pages (file-based routing)
- `src/utils/` - Utility functions
- `src/types/` - TypeScript type definitions

## Content Architecture

### Vault Structure

The project reads content from the parent Obsidian vault. In Docker, the vault is mounted at `/vault`. Locally, it's relative to gaeia-web (parent directory).

```
AI-Engineer/                    # Vault root
├── universe/                   # Main content structure
│   ├── _catalog.json          # Trilhas catalog (v3.0)
│   ├── topicos/               # Atomic content units
│   │   ├── _index.json        # Topics index
│   │   └── *.md               # Topic markdown files (44+ topics)
│   └── trilhas/               # Learning paths (direct JSON files)
│       ├── llm-do-zero.json   # LLM fundamentals path
│       ├── ia-pratica.json    # Practical AI path
│       └── ai-engineer.json   # AI Engineer roadmap
└── gaeia-web/                 # This web app
```

### Key Concepts

- **Topicos** = Atomic content units (single .md files about one subject)
- **Trilhas** = Learning paths that sequence topics via direct JSON files
- **Modulos** = Groups of related topics within a trilha
- **Progress by Topic** = Completing a topic in one trilha = complete in all trilhas

### Key Files

| File | Purpose |
|------|---------|
| `src/utils/trilhas.ts` | Load trilhas and topics from vault |
| `src/utils/progressStore.ts` | Client-side progress (localStorage) |
| `src/utils/markdown.ts` | Markdown rendering with Shiki syntax highlighting |
| `src/types/trilhas.ts` | TypeScript types for trilhas system |

## Routes

```
/                              # Home - shows trilhas and topics
/trilhas                       # List all trilhas
/trilhas/[trilha]              # Trilha page with modules
/trilhas/[trilha]/[topico]     # Topic with trilha context (prev/next nav)
/topicos                       # Topics library with search
/topicos/[topico]              # Topic standalone (no trilha context)
/conquistas                    # Badges and achievements
```

## Content Loading

All content is loaded via `src/utils/trilhas.ts`:

```typescript
import {
  getAllTrilhas,     // Get all available trilhas
  getTrilha,         // Get single trilha by ID
  getTopico,         // Get single topic by ID
  getAllTopicos,     // Get all topics
  getCatalog         // Get catalog metadata
} from './trilhas';
```

## Catalog Format (v3.0)

The `universe/_catalog.json` uses direct JSON file paths:

```json
{
  "version": "3.0",
  "trilhas": [
    { "id": "llm-do-zero", "path": "trilhas/llm-do-zero.json" },
    { "id": "ia-pratica", "path": "trilhas/ia-pratica.json" },
    { "id": "ai-engineer", "path": "trilhas/ai-engineer.json" }
  ],
  "topicos": { "path": "topicos", "indexFile": "_index.json" }
}
```
