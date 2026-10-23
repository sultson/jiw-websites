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
  dagmar-voss/            same exception, graduated 10-10-2026 from
                          claudius/playground/dagmarvoss. build.mjs writes 8 complete pages
                          into dist/, 394-1536 words of text each, one progressive-enhancement
                          script per page and no hydration. `pnpm build` also runs
                          tools/prerender.mjs, which FAILS the build on a page that is no
                          longer whole in the HTML (word floor, one non-empty h1, no
                          <script src>, JSON-LD that parses, canonical = this page, no dead
                          internal link, sitemap covering exactly the 8 pages) — a gate you can
                          skip is not a gate. tools/zonder-js.mjs is the browser counter-proof:
                          JS off next to JS on, identical word counts. Needs MAPBOX_TOKEN from
                          the root .env for the static map on /contact/. Still on
                          dagmarvoss-concept.jouwidealewebsite.nl — the client's own site is
                          live on dagmarvoss.nl with her Purelymail records on that zone, so
                          the cutover is hers to make, not a build step. dev port 3071.
                          See its README.
  marjon-bewustgezondinjemond/
                          graduated 12-10-2026 from jiw-concepts/marjon. A normal Vite+React
                          app, but the only one that is ONE component routing on
                          `window.location.pathname` instead of a page per file. Prerendered
                          anyway: `scripts/prerender.mjs` renders that one component once per
                          address into its own `dist/<pad>/index.html`, and swaps the head
                          (title/description/canonical/og/schema.org) between the
                          `<!--kop:start-->`/`<!--kop:end-->` markers in index.html via
                          `scripts/kop.mjs`. The path comes from `PadContext` (src/pad.tsx),
                          never from `window`, or every file would carry the home page.
                          22 pages: home, 5 pillars, privacy (+ the shared old address), the
                          12 earlier pillar slugs (canonical to their successor), a noindex
                          review mock and a real 404. **Check `pnpm build` still bakes 22
                          after touching routing** — a lower number means an address silently
                          dropped out. `scripts/audit-seo.mjs` gates `ship`. dev port 3072.
                          See its README + SEO.md.
  framemedia/             same exception, graduated 17-10-2026 from
                          claudius/playground/framemedia. `bouw.mjs` writes 23 static pages
                          (10 nl on /, 6 en on /en/, 6 de on /de/, plus a 404) from inhoud/
                          into dist/, and copies oud/ in untouched — 57 files of the client's
                          old WordPress site on their original /wp-content/uploads/ paths, so
                          Google Images keeps answering. **That is the only copy left**: the
                          old site went offline the day of the graduation, so
                          `haal-oude-media.mjs` can no longer refetch it. `pnpm build` runs
                          gen-mail-logo, then `bouw.mjs --prod`, then `tools/vooraf.mjs` — the
                          prerender gate, which FAILS the build on a page that is not whole in
                          the HTML (title, description, exactly one filled h1, self-pointing
                          canonical, 180-word floor, JSON-LD that parses, every <form> with an
                          action that exists in the worker, no dead internal link, sitemap
                          covering exactly the indexable pages). `bouw.mjs --prod` has its own
                          gate: it refuses to finish if any concept wording or `noindex`
                          survives into dist/, or if the number of wired-up forms is not 10.
                          Four form endpoints, not one. dev port 3073. See its LEESMIJ.md + SEO.md.
  velvet-cakes-by-anka/   same exception, graduated 18-10-2026 from
                          claudius/playground/velvet-cakes-2. `bouw.mjs` writes 31 static
                          pages into dist/ — 10 nl on /, 10 en on /en/, 10 ro on /ro/, plus a
                          404. The graduation WAS the SEO work: in the concept the English and
                          Romanian versions only existed in the browser (`i18n.js` swapped the
                          text out of two .js tables on localStorage), so there was one address
                          per page carrying `lang="nl"` and two of the three languages existed
                          nowhere as a page. Translation is now a build-time pass over the
                          generated Dutch body on the SAME keys (`data-i18n`,
                          `data-i18n-html`, `data-i18n-attr`) — the tables were months
                          measured on the live site, so only the moment they are applied
                          changed. **`vertaal()` counts the keys it picks up and throws on a
                          mismatch**; that caught a real bug on day one (the tag regex was
                          `[a-z]+`, which never matches `<h1>` because `\b` wants a boundary
                          between `h` and `1`, so every heading silently stayed Dutch —
                          55 of 64 keys). `pnpm build` runs gen-mail-logo, then
                          `bouw.mjs --prod`, then `tools/vooraf.mjs`: the prerender gate,
                          13 checks per page including `lang` == the language of the directory
                          and a reciprocal hreflang set whose every target exists as a file.
                          `bouw.mjs` has its own gate: no concept-domain or
                          jouwidealewebsite.nl address in the HTML, no surviving `noindex` in
                          the prod build, no `.html` in an internal link, and exactly **27**
                          forms (9 pages x 3 languages — NOT 30: the terms page deliberately
                          carries no form and no quote button). The home page is the one
                          template on disk (`bron/index.html`) because it has blocks no other
                          page has; its nav, footer, request block and dock are markers
                          (`<!--vc:kop-->` etc) filled by the build — do not turn those back
                          into real HTML, they were duplicated before and a mail-address change
                          went half-applied. One form endpoint, `/api/forms/aanvraag`; before
                          the graduation the form sent nothing at all, it just opened wa.me.
                          dev port 3074. See its LEESMIJ.md + SEO.md.
  novera-bouw/            same exception, graduated 03-10-2026 from jiw-concepts. `bouw.mjs`
                          writes 30 static pages into dist/ — 15 nl on /, 15 en on /en/ — from
                          one shell (`pagina/_schil.html`) plus a page per file. Serves
                          noverabouw.nl (apex canonical, `www` 301s onto it) and sends from
                          `offers@notify.noverabouw.nl` to `info@noverabouw.nl`, the client's
                          own mailbox, so **never send a test submission against the deployed
                          config**. Two blocks in `pagina/` are GENERATED, not hand-written:
                          the gallery in werkzaamheden.html + en/services.html and the
                          before/after block in stucwerk.html + en/plastering.html, both
                          between `<!-- galerij -->` / `<!-- voorna -->` markers. Edit
                          `_ref/eigen-lijst.mjs` and run `node _ref/eigen.mjs`, or your change
                          is gone on the next run. `_ref/kijk.mjs` is the browser check: the
                          full round is ~100 page loads and takes a quarter of an hour, so use
                          `--snel --pad=/a,/en/b` while working and the full round before
                          handing something over. dev port 3068. See its README + SEO.md.
  bloei/                  a normal Vite+React app, graduated 19-10-2026 onto the client's own
                          `bloei-ouddorp.nl`. Built in this repo from day one (7-10-2026) but
                          served only `bloei-concept.jouwconcept.app` until then, so the
                          graduation was the domain + mail + SEO work, not a move of files.
                          A copy of `apps/fleurig` — same owners, new shop, new colours — so
                          fixes often belong in both. 7 pages prerendered by
                          `scripts/prerender.mjs` (5 indexable + noindex /bedankt/ + 404),
                          `scripts/seo.mjs` writes sitemap + robots from `PAGINAS` in
                          `site.config.mjs`, `scripts/audit-seo.mjs` gates `ship` (it checks
                          for `GardenStore`, not `Florist` — the shop sells flowers but leans
                          on plants, garden and homeware). `pnpm indexnow` pings Bing/Yandex
                          off the built sitemap; the key is the filename in `public/`.
                          **The shop is still called Vershal Ouddorp** and renames to Bloei!
                          in a few weeks — that is why `alternateName` sits in the
                          `GardenStore` block and a disclaimer runs on every page. dev port
                          3065. See its NOTITIES.md + SEO.md.
  resq-protec/            Rescue Watercraft. Astro, static, nl/en/de (de added 22-10-2026),
                          60 pages. DEFAULT_LANG in wrangler.jsonc picks the language on /
                          (en since 23-10-2026, was nl) and the
                          others go under /<lang>; pages are src/routes/* mounted per
                          language by an integration in astro.config.mjs, not page files. Canonicals, hreflang, schema.org
                          and the sitemap already point at rescuewatercraft.eu; the concept
                          hosts serve noindex until `LIVE` flips to "true" in wrangler.jsonc,
                          then 301 there. `pnpm build` runs tools/check-seo.mjs (prerender
                          gate, 9 forms). Go-live steps in its README. dev port 3014.
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
- **Commit on `main`, no branches.** Default to committing straight to `main` and pushing there. Do NOT create a feature branch, and do not ask whether to make one — only use a branch when the user explicitly asks for one by name or in so many words. (Until 10-10-2026 this file said the opposite; the branch-per-change habit left graduated sites sitting unmerged for days while the live Worker already served them.)
- **Cache-busting:** when replacing a `public/` asset in place, append `?v=YYYYMMDD` to every reference (component src/srcSet, og:image, preload, schema.org) so browsers and Cloudflare's edge refetch immediately.

## Performance & motion

These are client sites for real customers (patients, salon clients), not investor demos. Keep motion to a restrained minimum and never let it hurt loading.

- **Never gate content visibility on JS.** Do NOT use scroll-reveal patterns that set content to `opacity:0` / `transform` and only reveal it once an `IntersectionObserver` (or any JS) fires. On mid-range Android the JS lag makes cards/headings render as empty gaps that pop in late while scrolling (the classic "empty → half card → full card" jank). All real content must be fully visible in the server-rendered HTML at first paint. This bit `omnia-dental` (a `.reveal` utility + observer in `Layout.astro`) — that mechanism was removed; don't reintroduce it. If you want a one-time entrance, use a CSS-only animation that starts visible or animates from `opacity:1`, not JS-gated reveal.
- **Minimal animation by default.** No image zoom/`scale` on hover, no decorative parallax, no staggered entrance delays. Keep only functional micro-interactions (menu open/close, FAQ accordion, focus states). When unsure, leave it static.
- Avoid `backdrop-filter` on many repeated elements (e.g. every card) — it tanks mobile scroll/reveal. Keep it to a single overlapping surface like the nav.

## Cloudflare Workers

New Cloudflare deployments should use Workers Static Assets with `wrangler.jsonc`, not Pages. Existing examples are `apps/smooth-by-lau/wrangler.jsonc` for a static site and `apps/rn-schilders/wrangler.jsonc` for a site with `/api/*` Worker routes. Deploy with `pnpm --filter @jiw/<name> ship`; it runs `pnpm build` first so wrangler cannot ship a stale `dist/`. Use `ship:dry-run` when deployment config, routes, bindings, assets plumbing, or auth changed; skip it for small frontend-only diffs after a clean build unless asked. Use `pnpm ship:dry-run` and `pnpm ship` for all Worker-enabled apps. Scripts are named `ship` rather than `deploy` because `pnpm deploy` is a pnpm built-in (in every form — root, `--filter`, and `-r`) and silently fails to run a `deploy` script. The Cloudflare account id currently used is `aec64586d4d04a644f4f9b8225d7ca28`, and local API credentials live in `.env` as `CLOUDFLARE_API_TOKEN`; never commit tokens or secrets. Wrangler does not auto-load the root `.env`, so export it first: `set -a && source .env && set +a` (or `export $(grep -v '^#' .env | xargs)`) before running any deploy command, otherwise wrangler fails with `Failed to fetch auth token`. When wiring up a real custom domain (not a `jouwidealewebsite.nl` subdomain), add `custom_domain` routes for both the apex `[domain]` and `www.[domain]` — it's easy to forget the `www` one. For form handling, use `@jiw/cloudflare-forms` and the notes in `docs/cloudflare-forms.md` instead of creating one-off endpoints. Never send a test form submission to a client's real address; use `hallo@jouwidealewebsite.nl` on both sides, or ask first. RN Schilders stores private uploads in the shared R2 bucket `jiw-form-uploads-prod` under per-site prefixes and sends email via Cloudflare Email Service from `offerte@notify.rn-schilders.nl` to `info@rn-schilders.nl`. Smooth By Lau is deployed to the existing Worker `smooth-by-lau-waspik`, which serves `smoothbylau.nl`, `www.smoothbylau.nl`, and `smooth-by-lau-waspik.jouwidealewebsite.nl`. Yanis Klussenbedrijf serves `yanisklussenbedrijf.nl` and sends from `offers@notify.yanisklussenbedrijf.nl` to `hallo@jouwidealewebsite.nl`; adding both apex and `www` as `custom_domain` routes makes `www` resolve but does not redirect it, so there is also a zone-level redirect rule (`http_request_dynamic_redirect` entrypoint ruleset) sending `www` to the apex with a 301 — do that for every real client domain, a canonical tag alone leaves two hosts serving 200. Note the Rulesets API rejects a `kind` field on that PUT even though it returns one on GET. Wrangler may need `CLOUDFLARE_ACCOUNT_ID` exported for some commands because the account-scoped token can fail Wrangler's membership lookup. RH Klusservice serves `rhklusservice.nl` and sends from `offerte@notify.rhklusservice.nl` to `hallo@jouwidealewebsite.nl`. JASM Flowers serves the client's own `jasmflowers.com` since 09-10-2026 (apex canonical; `www` 301s onto it, and both old addresses `jasmflowers.jouwidealewebsite.nl` and `flower.jouwidealewebsite.nl` 301 there too via a rule on the `jouwidealewebsite.nl` zone — they stay attached as custom domains so a deleted rule degrades to duplicate content rather than an outage). It sends from `no-reply@notify.jasmflowers.com` to `sales@jasmflowers.co.ke` — the client's own mailbox since 09-10-2026, and also the reply-to on the buyer's confirmation, so **never send a test submission against the deployed config**; point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first. Its confirmation is localised EN/NL/DE off `__jiw_confirmation_locale`, which the page sets from `<html lang>`; `apps/jasm-flowers/tools/preview-mail.mjs` renders all three through the real renderer if you need to look at one. The `jasmflowers.com` zone carries the Email Service records for `notify.*` alongside the site's own apex and `www` records; the apex has no MX, SPF or DMARC of its own, so nothing stops a third party spoofing mail *from* `@jasmflowers.com` — worth closing with a null MX plus `v=spf1 -all` and a `p=reject` DMARC if the client confirms they will never send from the apex. Only the sending *domain* under `notify.<client>.nl` is set up (DKIM/SPF/DMARC) — the local part is free, so changing `offers@` to `offerte@` is a one-line change to `allowed_sender_addresses` plus `LEAD_SENDER`, no DNS work. Marjon Ooteman serves `bewustgezondinjemond.nl` since 12-10-2026 (apex canonical; `www` 301s onto it via both a zone redirect rule and the Worker, and `marjon.jouwidealewebsite.nl` 301s there too — that host moved onto this Worker, so there is no separate redirect worker left in `jiw-concepts/marjon`). It sends from `no-reply@notify.bewustgezondinjemond.nl` to `hallo@jouwidealewebsite.nl`; the zone already carried the Email Service records before graduation. FRAME MEDIA serves `www.framemedia.tv` since 17-10-2026 and is the one site here where **`www` is canonical and the apex 301s onto it**, not the other way round — their WordPress site served `www` for years, so that is what Google and inbound links hold, and a migration is not the moment to also change hostname. Both are attached as `custom_domain` and the apex redirect is a rule on the zone. It sends from `no-reply@notify.framemedia.tv` to `info@framemedia.tv` — the client's own mailbox since 17-10-2026 (Alfred), and also the reply-to and the printed contact address on the visitor's confirmation, so **never send a test submission against the deployed config**; point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first. The `notify.*` Email Service records were already on the zone when it moved in, and the zone also carries the client's Purelymail records (MX, SPF and a `p=reject` DMARC on the apex, so the apex spoofing gap is closed) — do not treat unexpected DNS entries there as leftovers. It is also the only app with **four** form endpoints on one worker (`/api/forms/snel`, `/contact`, `/puurgenieten`, `/programma-idee`) — one per page, wired from the page key by `bouw.mjs`, which counts them and fails the build at anything other than 10. Velvet Cakes by Anka serves `velvetcakesbyanka.nl` since 18-10-2026 (apex canonical — the domain had no history, only the client's Purelymail mailbox, so the house rule applies and not the framemedia exception; `www` is attached as `custom_domain` and 301s onto the apex via a zone redirect rule). It sends from `no-reply@notify.velvetcakesbyanka.nl` to `info@velvetcakesbyanka.nl` — the client's own mailbox since 18-10-2026 (Alfred), and also the reply-to and the printed contact address on the visitor's confirmation, so **never send a test submission against the deployed config**; point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first. `tools/keur.mjs --verstuur` reads that var out of `wrangler.jsonc` and refuses by itself while it points at her. **The `notify.*` Email Service records were already on that zone before the graduation, and they hang off `cf-bounce.notify.velvetcakesbyanka.nl` and `_dmarc.notify.velvetcakesbyanka.nl` — NOT off `notify.velvetcakesbyanka.nl` itself.** A DNS lookup on that second name returns empty and that is not evidence the sending domain is missing; that conclusion was drawn once during this graduation and was wrong. The DKIM key is account-wide (byte-identical to `notify.framemedia.tv`). The zone also carries the client's own Purelymail records on the apex (MX, SPF, DKIM, DMARC) for `info@velvetcakesbyanka.nl`, the address printed on the site and in article 1 of her terms — that is separate from the subdomain and must not be touched. `velvet-cakes-2-concept.klantenkraan.nl` 301s to the apex path-preserving via a rule on the `klantenkraan.nl` zone; before that it served a complete second copy of the same site with an allow-all `robots.txt`. **Still open:** `velvet-cakes-concept.klantenkraan.nl` (concept 1) still serves 200 and is indexable — a different design for the same business competing on the same terms, left alone because Armando used it actively alongside concept 2.

Bloei! serves `bloei-ouddorp.nl` since 19-10-2026 (apex canonical — the domain had no history at all, no A record and never a site, so the house rule applies and not the framemedia exception; `www` is attached as `custom_domain` and 301s onto the apex via a zone redirect rule *and* via `ANDERE_HOSTS` in the worker). The old concept host `bloei-concept.jouwconcept.app` stays attached to the same Worker and 301s path-preserving onto the apex — before that it served a complete second copy with an allow-all `robots.txt`. The Worker was renamed `bloei-concept` → `bloei` and the old script deleted once it held no hostnames. It sends from `no-reply@notify.bloei-ouddorp.nl` to `info@bloei-ouddorp.nl` — the shop's own mailbox since 19-10-2026 (Alfred), on the Purelymail records of the apex, so **never send a test submission against the deployed config**; point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first. That address is only an inbox for the leads: it is printed nowhere on the site and there is no `contactEmail` in the visitor's confirmation, because the shop has not given out an address to publish. The `notify.*` Email Service records were already on the zone before the graduation and hang off `cf-bounce.notify.bloei-ouddorp.nl` and `_dmarc.notify.bloei-ouddorp.nl`, NOT off `notify.bloei-ouddorp.nl` itself; the zone also carries the client's own Purelymail records on the apex (MX, SPF, DKIM, DMARC), which are separate and must not be touched. Note that the `http_request_dynamic_redirect` entrypoint PUT rejects a `phase` field as well as a `kind` field — both come back on GET and neither may be sent.

**Wrangler 4.85 (the pinned version) 404s on `wrangler email sending settings|enable|dns`,** even against a zone where sending demonstrably works — the endpoints in that version are stale and only `email sending list` works. Use `npx wrangler@4.151.1 email sending ...` for that work and keep the pinned version for build and deploy.

A caveat worth knowing for every site here: a **lead** email that fails to send throws and the visitor sees an error, but a **confirmation** failure is only `console.error`'d — `{"ok":true}` does not prove the visitor's copy left. Read `wrangler tail` for `Confirmation email failed` when you want certainty.

**Moving a custom domain from one Worker to another** (every graduation out of `jiw-concepts` hits this): `wrangler deploy` cannot take a hostname that another Worker already holds. Deploy once with the `routes` block removed so the new Worker exists, then `PUT /accounts/{id}/workers/domains` with `{environment, hostname, service, zone_id, override_existing_origin: true}` per hostname — without that last flag the API returns error 100116. Then put `routes` back and deploy again. No downtime, and the certificate is reused. Afterwards make sure the old Worker's `wrangler.toml` no longer lists those hostnames, or its next deploy silently takes them back.

That override path stops working once the zone is at its cap. `jouwidealewebsite.nl` sits at exactly **100 Workers custom domains**, the per-zone limit, so the `PUT` above is rejected with error **100122** even for a hostname that is only *moving* between Workers and consumes no new slot. Verified 09-10-2026 moving `jasmflowers.jouwidealewebsite.nl`. The way through is to free the slot first: `GET /accounts/{id}/workers/domains?zone_id=..&hostname=..` for the entry's id, `DELETE /accounts/{id}/workers/domains/{id}`, then the same `PUT`. Do one hostname at a time and poll it back to 200 before starting the next. The gap is a few seconds of 522 and the cert is reused — a first-level subdomain is already covered by the zone's `*.jouwidealewebsite.nl` universal cert, so nothing is re-provisioned. A real client domain with its own zone would not hit this at all.

`_headers` works on Workers Static Assets, not just Pages — verified live on `rhklusservice.nl`. Use it for `Referrer-Policy` / `X-Content-Type-Options`, and for `X-Robots-Tag: noindex` while a site is still a concept. `html_handling: "force-trailing-slash"` redirects the slashless form, but Cloudflare answers with a **307**, not a 301; harmless when nothing links to that form, worth knowing before someone files it as a bug.

## Adding a new client site

1. `mkdir apps/<client>` and scaffold with Vite (React + TS template).
2. Set `"name": "@jiw/<client>"` in its package.json; pick an unused dev port.
3. `pnpm install` from root — it's auto-discovered via `pnpm-workspace.yaml`.
