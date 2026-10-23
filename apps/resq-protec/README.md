# Rescue Watercraft

Astro, fully static: every page is complete in the HTML (60 pages: the default language
on `/`, the other two under `/<lang>`, 15 product pages per language, plus a 404). The Worker
(`worker/index.ts`) serves the lead forms, the brand films from R2, the LinkedIn feed,
and the host rules. Dev: `pnpm --filter @jiw/resq-protec dev` (port 3014).

## Default language

`DEFAULT_LANG` in `wrangler.jsonc` decides which language sits on `/` (now `nl`: nl on `/`,
en on `/en`, de on `/de`). With `en`, English moves to `/` and Dutch to `/nl`
(`/nl/opleidingen-en-trainingen`, `/nl/equipment/alpine`, ...). One value drives
everything: the build reads it (`tools/default-lang.mjs`) for routes, sitemap,
hreflang x-default, the language switcher order and llms.txt, and the Worker reads it for
the confirmation mail's website link and to 301 `/<default>/...` onto the unprefixed URL.
Form endpoints stay per language and do not move.

Pick it **before** go-live: switching afterwards changes every URL Google has indexed.

Trying another default without touching the concept hosts (preview URLs are on for this
Worker, the workers.dev production address is off):

    DEFAULT_LANG=en pnpm build
    npx wrangler versions upload --preview-alias en-default --var DEFAULT_LANG:en
    # -> https://en-default-resq-protec.alfredsultson.workers.dev (noindex)

## Where things live

- `src/routes/*.astro`: one entrypoint per page type, mounted at its URL in every
  language by the small integration in `astro.config.mjs`. Not a file per language (the
  URLs follow `DEFAULT_LANG`) and not one catch-all route (Astro bundles CSS per route,
  so a catch-all gave every page the styles of every component).

- `src/data/content.ts`: routes per language, `SITE` (the production origin every
  canonical, hreflang, og:url, schema.org id and sitemap entry is built on), SEO titles
  and descriptions, and the low-key footer line with the search terms.
- `src/data/courses.ts`, `src/data/products.json`: the catalogues, one block per language.
  German was translated from the Dutch, with the English as a cross-check.
- `src/pages/sitemap.xml.ts`, `robots.txt.ts`, `llms.txt.ts`: generated at build time.
  The sitemap carries the full hreflang set per URL. It is written by hand because the
  slugs differ per language (`/equipment` / `/de/ausruestung`), and @astrojs/sitemap
  pairs pages by prefix only.
- `worker/confirmation.ts`: the branded confirmation the visitor receives, in the language
  of the page they sent it from. `npx tsx tools/preview-mail.ts <dir>` renders all
  three languages plus the owner notification through the real worker, without sending.

## Build gate

`pnpm build` runs `tools/check-seo.mjs` and fails on any page that is not whole in the
HTML. Per page it checks the title and description, exactly one filled h1, `<html lang>`
against the path, a self-canonical on rescuewatercraft.eu, a reciprocal hreflang set
whose targets exist, JSON-LD that parses, a word floor and dead internal links. It also
checks that the sitemap covers exactly the built pages and that there are exactly 9
forms (3 per language), each posting to its own language's endpoint.

## Forms

Three per language: `/api/forms/{,en/,de/}{course,equipment,contact}`. They use a
honeypot (`website`) instead of Turnstile, because the Turnstile widget would have
needed rescuewatercraft.eu on its hostname list. Mail is sent from
`no-reply@notify.rescuewatercraft.eu` (sending domain verified in Cloudflare Email
Service) to `LEAD_RECIPIENT`, which is `hallo@jouwidealewebsite.nl` until the client's
address is confirmed. The owner notification is always Dutch, with an (EN)/(DE) tag in
the subject. A failed confirmation is only logged: read `wrangler tail` for
`Confirmation email failed`.

## Hosts

`CANONICAL_HOST` = `rescuewatercraft.eu`. Until `LIVE` is `"true"`, the concept hosts
(`rescuewatercraft.jouwidealewebsite.nl`, `resqprotec.jouwidealewebsite.nl`) serve the
site with `X-Robots-Tag: noindex`. Once `LIVE` is `"true"`, they 301 to the apex with the
path preserved. `www.rescuewatercraft.eu` always 301s to the apex.

## Go-live on rescuewatercraft.eu

The zone `rescuewatercraft.eu` is in our Cloudflare account and the registry delegates to
it (verified 22-10-2026). Remaining steps:

1. Dashboard → DNS for the zone: delete the apex `A 91.184.0.200` record (Hostnet's old
   server). A Workers custom domain will not attach to a hostname that already has a
   record. Leave the `notify` / `cf-bounce` records alone: they carry the form mail.
2. `wrangler.jsonc`: uncomment the two `rescuewatercraft.eu` routes, set `LIVE` to
   `"true"`, and set `DEFAULT_LANG` to the language that goes on `/` (see above). Then
   `pnpm --filter @jiw/resq-protec ship`.
3. Zone redirect rule `www` → apex (301), like the other client domains (Rulesets API,
   `http_request_dynamic_redirect`; no `kind` field on the PUT). The Worker also does
   it, so this is belt and braces.
4. Zone setting "Always Use HTTPS" on: a new zone serves `http://` as a plain 200.
5. Set `LEAD_RECIPIENT` to the client's mailbox once they confirm which one.
   **Never send a test submission after that.**
6. Search Console: add the domain property and submit `/sitemap.xml`.
7. Apex mail: the Cloudflare zone has no MX, SPF or DMARC on the apex. Hostnet used to
   publish `v=spf1 … -all` and `p=reject`, and those disappear as resolver caches
   expire. If the client does not send mail from `@rescuewatercraft.eu`, add a null MX,
   `v=spf1 -all` and `_dmarc` `v=DMARC1; p=reject`.
