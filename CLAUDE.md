# jiw-websites

pnpm workspaces monorepo for JIW client websites.

## Layout

```
apps/         client sites (each a Vite + React 19 + TS 5.8 + Tailwind v4 app)
  my-kim-nails/        dev port 3000 — has backend (express + better-sqlite3 + @google/genai)
  nail-it-rosmalen/    dev port 3002 — frontend-only
  sgv-nails/           placeholder (INFO.md only, not yet scaffolded)
packages/     reserved for future @jiw/* shared packages (shared-ui, i18n) — empty
```

Apps are published under the `@jiw/` scope (`@jiw/my-kim-nails`, etc.). Root package is `@jiw/monorepo`, private.

## Commands (run from repo root)

- `pnpm dev` — all apps in parallel
- `pnpm dev:my-kim-nails` / `pnpm dev:nail-it-rosmalen` — single app
- `pnpm -r build` — build all
- `pnpm -r lint` — `tsc --noEmit` across all
- `pnpm --filter @jiw/<name> <script>` — run a script in one app

Each app also has its own `optimize-images` script using `sharp`.

## Conventions

- **Package manager:** pnpm 10 (pinned via `packageManager` field). Never use npm/yarn — no per-app lockfiles.
- **Native builds:** `pnpm.onlyBuiltDependencies` in root package.json allowlists `better-sqlite3`, `esbuild`, `protobufjs`, `sharp`. Add new native deps here, then `pnpm rebuild <dep>`.
- **Duplicated components:** Nav, Hero, Gallery, Lightbox, Services, Footer, UspStrip, Faq, Reviews, LangToggle, About exist in both apps — candidates for `@jiw/shared-ui` extraction. `useLang` hook + translations pattern → `@jiw/i18n`.
- **No root tsconfig yet.** Each app has its own `tsconfig.json`. Introduce `tsconfig.base.json` when extracting shared packages.
- **Gitignore is root-only.** Don't reintroduce per-app `.gitignore`.

## Adding a new client site

1. `mkdir apps/<client>` and scaffold with Vite (React + TS template).
2. Set `"name": "@jiw/<client>"` in its package.json; pick an unused dev port.
3. `pnpm install` from root — it's auto-discovered via `pnpm-workspace.yaml`.
