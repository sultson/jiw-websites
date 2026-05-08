# jiw-websites

pnpm workspaces monorepo for JIW client websites.

## Layout

```
apps/         client sites (each a Vite + React 19 + TS 5.8 + Tailwind v4 app)
  my-kim-nails/        dev port 3000 — frontend-only
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
- **Native builds:** `pnpm.onlyBuiltDependencies` in root package.json allowlists `esbuild`, `protobufjs`, `sharp`, `workerd`. Add new native deps here, then `pnpm rebuild <dep>`.
- **Duplicated components:** Nav, Hero, Gallery, Lightbox, Services, Footer, UspStrip, Faq, Reviews, LangToggle, About exist in both apps — candidates for `@jiw/shared-ui` extraction. `useLang` hook + translations pattern → `@jiw/i18n`.
- **No root tsconfig yet.** Each app has its own `tsconfig.json`. Introduce `tsconfig.base.json` when extracting shared packages.
- **Gitignore is root-only.** Don't reintroduce per-app `.gitignore`.

## Cloudflare Workers

New Cloudflare deployments should use Workers Static Assets with `wrangler.jsonc`, not Pages. Existing examples are `apps/smooth-by-lau/wrangler.jsonc` for a static site and `apps/rn-schilders/wrangler.jsonc` for a site with `/api/*` Worker routes. Build first with the app's Vite `build` script, validate with `pnpm --filter @jiw/<name> ship:dry-run`, then deploy with `pnpm --filter @jiw/<name> ship`. Use `pnpm ship:dry-run` and `pnpm ship` for all Worker-enabled apps. Scripts are named `ship` rather than `deploy` because `pnpm deploy` is a pnpm built-in (in every form — root, `--filter`, and `-r`) and silently fails to run a `deploy` script. The Cloudflare account id currently used is `aec64586d4d04a644f4f9b8225d7ca28`, and local API credentials live in `.env` as `CLOUDFLARE_API_TOKEN`; never commit tokens or secrets. Wrangler does not auto-load the root `.env`, so export it first: `set -a && source .env && set +a` (or `export $(grep -v '^#' .env | xargs)`) before running any deploy command, otherwise wrangler fails with `Failed to fetch auth token`. For form handling, use `@jiw/cloudflare-forms` and the notes in `docs/cloudflare-forms.md` instead of creating one-off endpoints. RN Schilders stores private uploads in the shared R2 bucket `jiw-form-uploads-prod` under per-site prefixes and sends email via Cloudflare Email Service from `offerte@notify.rn-schilders.nl` to `info@rn-schilders.nl`. Smooth By Lau is deployed to the existing Worker `smooth-by-lau-waspik`, which serves `smoothbylau.nl`, `www.smoothbylau.nl`, and `smooth-by-lau-waspik.jouwidealewebsite.nl`. Wrangler may need `CLOUDFLARE_ACCOUNT_ID` exported for some commands because the account-scoped token can fail Wrangler's membership lookup.

## Adding a new client site

1. `mkdir apps/<client>` and scaffold with Vite (React + TS template).
2. Set `"name": "@jiw/<client>"` in its package.json; pick an unused dev port.
3. `pnpm install` from root — it's auto-discovered via `pnpm-workspace.yaml`.
