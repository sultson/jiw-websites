# jiw-websites

pnpm workspaces monorepo for JIW client websites.

## Time boxes & scope

A time box ("get it done in 20 min", "spin up agents") sets effort *intensity*, not scope: work continuously and in parallel for the whole window, never coast or stop early. It is never a licence to drop stated requirements, skip listed sources, or ship half-done work — completeness of the goal outranks the clock. If time and scope collide, parallelize harder and keep going; if something genuinely cannot fit, finish everything else and flag the gap loudly rather than silently cutting it. "Ran low on time" is not a reason to deliver less than asked.

## Layout

```
apps/         client sites (almost all a Vite + React 19 + TS 5.8 + Tailwind v4 app)
  yanis-klussenbedrijf/   the exception: no Vite, no React. `bouw.mjs` writes 14 static
                          HTML pages (nl on /, en on /en) from pagina/ + pagina-en/ into
                          dist/. Kept that way on graduation from jiw-concepts because
                          every page is already fully in the HTML; see its README.
  rh-klusservice/         same exception, graduated 07-10-2026. dist/ IS the source for
                          index.html + projecten/; four maak-*.mjs generators write the
                          other ten pages, the 404 and the sitemap into it. `pnpm build`
                          runs them. dev port 3069. See its README + SEO.md.
  jasm-flowers/           same exception, graduated 09-10-2026 from claudius/playground/flower.
                          src/build.mjs writes 30 pages (10 templates x en/nl/de) into dist/ —
                          the six site pages plus four /wholesale/<line>/ SEO pages that are
                          linked ONLY from the footer strip (smoke.mjs enforces both halves);
                          translation is a post-pass over the built HTML keyed on the English
                          string (src/lang/*.tsv), and the build prints untranslated counts —
                          keep them at zero. `pnpm build` must also run gen-mail-logo + gen-pdf:
                          the build wipes dist/ and takes the three catalogue PDFs with it.
                          dev port 3070. See its README.
  my-kim-nails/        dev port 3000 — frontend-only
  nail-it-rosmalen/    dev port 3002 — frontend-only
  sgv-nails/           placeholder (INFO.md only, not yet scaffolded)
packages/     cloudflare-forms/  @jiw/cloudflare-forms, the shared lead-form worker
                                 (see docs/cloudflare-forms.md). shared-ui / i18n are
                                 still only candidates.
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
- **Cache-busting:** when replacing a `public/` asset in place, append `?v=YYYYMMDD` to every reference (component src/srcSet, og:image, preload, schema.org) so browsers and Cloudflare's edge refetch immediately.

## Performance & motion

These are client sites for real customers (patients, salon clients), not investor demos. Keep motion to a restrained minimum and never let it hurt loading.

- **Never gate content visibility on JS.** Do NOT use scroll-reveal patterns that set content to `opacity:0` / `transform` and only reveal it once an `IntersectionObserver` (or any JS) fires. On mid-range Android the JS lag makes cards/headings render as empty gaps that pop in late while scrolling (the classic "empty → half card → full card" jank). All real content must be fully visible in the server-rendered HTML at first paint. This bit `omnia-dental` (a `.reveal` utility + observer in `Layout.astro`) — that mechanism was removed; don't reintroduce it. If you want a one-time entrance, use a CSS-only animation that starts visible or animates from `opacity:1`, not JS-gated reveal.
- **Minimal animation by default.** No image zoom/`scale` on hover, no decorative parallax, no staggered entrance delays. Keep only functional micro-interactions (menu open/close, FAQ accordion, focus states). When unsure, leave it static.
- Avoid `backdrop-filter` on many repeated elements (e.g. every card) — it tanks mobile scroll/reveal. Keep it to a single overlapping surface like the nav.

## Cloudflare Workers

New Cloudflare deployments should use Workers Static Assets with `wrangler.jsonc`, not Pages. Existing examples are `apps/smooth-by-lau/wrangler.jsonc` for a static site and `apps/rn-schilders/wrangler.jsonc` for a site with `/api/*` Worker routes. Deploy with `pnpm --filter @jiw/<name> ship`; it runs `pnpm build` first so wrangler cannot ship a stale `dist/`. Use `ship:dry-run` when deployment config, routes, bindings, assets plumbing, or auth changed; skip it for small frontend-only diffs after a clean build unless asked. Use `pnpm ship:dry-run` and `pnpm ship` for all Worker-enabled apps. Scripts are named `ship` rather than `deploy` because `pnpm deploy` is a pnpm built-in (in every form — root, `--filter`, and `-r`) and silently fails to run a `deploy` script. The Cloudflare account id currently used is `aec64586d4d04a644f4f9b8225d7ca28`, and local API credentials live in `.env` as `CLOUDFLARE_API_TOKEN`; never commit tokens or secrets. Wrangler does not auto-load the root `.env`, so export it first: `set -a && source .env && set +a` (or `export $(grep -v '^#' .env | xargs)`) before running any deploy command, otherwise wrangler fails with `Failed to fetch auth token`. When wiring up a real custom domain (not a `jouwidealewebsite.nl` subdomain), add `custom_domain` routes for both the apex `[domain]` and `www.[domain]` — it's easy to forget the `www` one. For form handling, use `@jiw/cloudflare-forms` and the notes in `docs/cloudflare-forms.md` instead of creating one-off endpoints. Never send a test form submission to a client's real address; use `hallo@jouwidealewebsite.nl` on both sides, or ask first. RN Schilders stores private uploads in the shared R2 bucket `jiw-form-uploads-prod` under per-site prefixes and sends email via Cloudflare Email Service from `offerte@notify.rn-schilders.nl` to `info@rn-schilders.nl`. Smooth By Lau is deployed to the existing Worker `smooth-by-lau-waspik`, which serves `smoothbylau.nl`, `www.smoothbylau.nl`, and `smooth-by-lau-waspik.jouwidealewebsite.nl`. Yanis Klussenbedrijf serves `yanisklussenbedrijf.nl` and sends from `offers@notify.yanisklussenbedrijf.nl` to `hallo@jouwidealewebsite.nl`; adding both apex and `www` as `custom_domain` routes makes `www` resolve but does not redirect it, so there is also a zone-level redirect rule (`http_request_dynamic_redirect` entrypoint ruleset) sending `www` to the apex with a 301 — do that for every real client domain, a canonical tag alone leaves two hosts serving 200. Note the Rulesets API rejects a `kind` field on that PUT even though it returns one on GET. Wrangler may need `CLOUDFLARE_ACCOUNT_ID` exported for some commands because the account-scoped token can fail Wrangler's membership lookup. RH Klusservice serves `rhklusservice.nl` and sends from `offerte@notify.rhklusservice.nl` to `hallo@jouwidealewebsite.nl`. JASM Flowers serves the client's own `jasmflowers.com` since 09-10-2026 (apex canonical; `www` 301s onto it, and both old addresses `jasmflowers.jouwidealewebsite.nl` and `flower.jouwidealewebsite.nl` 301 there too via a rule on the `jouwidealewebsite.nl` zone — they stay attached as custom domains so a deleted rule degrades to duplicate content rather than an outage). It sends from `no-reply@notify.jasmflowers.com` to `sales@jasmflowers.co.ke` — the client's own mailbox since 09-10-2026, and also the reply-to on the buyer's confirmation, so **never send a test submission against the deployed config**; point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first. Its confirmation is localised EN/NL/DE off `__jiw_confirmation_locale`, which the page sets from `<html lang>`; `apps/jasm-flowers/tools/preview-mail.mjs` renders all three through the real renderer if you need to look at one. The `jasmflowers.com` zone carries the Email Service records for `notify.*` alongside the site's own apex and `www` records; the apex has no MX, SPF or DMARC of its own, so nothing stops a third party spoofing mail *from* `@jasmflowers.com` — worth closing with a null MX plus `v=spf1 -all` and a `p=reject` DMARC if the client confirms they will never send from the apex. Only the sending *domain* under `notify.<client>.nl` is set up (DKIM/SPF/DMARC) — the local part is free, so changing `offers@` to `offerte@` is a one-line change to `allowed_sender_addresses` plus `LEAD_SENDER`, no DNS work.

**Moving a custom domain from one Worker to another** (every graduation out of `jiw-concepts` hits this): `wrangler deploy` cannot take a hostname that another Worker already holds. Deploy once with the `routes` block removed so the new Worker exists, then `PUT /accounts/{id}/workers/domains` with `{environment, hostname, service, zone_id, override_existing_origin: true}` per hostname — without that last flag the API returns error 100116. Then put `routes` back and deploy again. No downtime, and the certificate is reused. Afterwards make sure the old Worker's `wrangler.toml` no longer lists those hostnames, or its next deploy silently takes them back.

That override path stops working once the zone is at its cap. `jouwidealewebsite.nl` sits at exactly **100 Workers custom domains**, the per-zone limit, so the `PUT` above is rejected with error **100122** even for a hostname that is only *moving* between Workers and consumes no new slot. Verified 09-10-2026 moving `jasmflowers.jouwidealewebsite.nl`. The way through is to free the slot first: `GET /accounts/{id}/workers/domains?zone_id=..&hostname=..` for the entry's id, `DELETE /accounts/{id}/workers/domains/{id}`, then the same `PUT`. Do one hostname at a time and poll it back to 200 before starting the next. The gap is a few seconds of 522 and the cert is reused — a first-level subdomain is already covered by the zone's `*.jouwidealewebsite.nl` universal cert, so nothing is re-provisioned. A real client domain with its own zone would not hit this at all.

`_headers` works on Workers Static Assets, not just Pages — verified live on `rhklusservice.nl`. Use it for `Referrer-Policy` / `X-Content-Type-Options`, and for `X-Robots-Tag: noindex` while a site is still a concept. `html_handling: "force-trailing-slash"` redirects the slashless form, but Cloudflare answers with a **307**, not a 301; harmless when nothing links to that form, worth knowing before someone files it as a bug.

## Adding a new client site

1. `mkdir apps/<client>` and scaffold with Vite (React + TS template).
2. Set `"name": "@jiw/<client>"` in its package.json; pick an unused dev port.
3. `pnpm install` from root — it's auto-discovered via `pnpm-workspace.yaml`.
