# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a static Next.js 14 inventory catalog website for RS Automation. It displays ~181 used industrial equipment items loaded from `data/inventory.json`. There are no backend services, databases, or external APIs required at runtime.

### Running the app

- `npm run dev` starts the dev server on http://localhost:3000
- `npm run build` produces a static export in `out/`
- `npm run lint` runs ESLint

### Non-obvious caveats

- **ESLint config**: The repo ships a `.eslintrc.json` (extends `next/core-web-vitals` with `react/no-unescaped-entities` disabled). Without this file, `next lint` and `next build` may prompt interactively for ESLint setup or fail on pre-existing unescaped entity violations in the codebase.
- **No automated test suite**: There are no unit/integration tests configured. Testing is manual via the dev server.
- **Static data**: Inventory data lives in `data/inventory.json` and is already committed. The Python export scripts (`scripts/`) are optional offline tools for refreshing data from a SQLite database and are not needed for local development.
- **Static export mode**: `next.config.js` sets `output: 'export'`, so the site is fully static. Image optimization is disabled (`images.unoptimized: true`).
- **No external services**: No databases, Docker, or API keys are needed for local development.
