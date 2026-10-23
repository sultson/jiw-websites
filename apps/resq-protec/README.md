# Rescue Watercraft

Astro, fully static: every page is complete in the HTML (60 pages: the default language
on `/`, the other two under `/<lang>`, 15 product pages per language, plus a 404). The Worker
(`worker/index.ts`) serves the lead forms, the brand films from R2, the LinkedIn feed,
and the host rules. Dev: `pnpm --filter @jiw/resq-protec dev` (port 3014).

## Default language

`DEFAULT_LANG` in `wrangler.jsonc` decides which language sits on `/`. It is `en` since
23-10-2026: English on `/`, Dutch on `/nl` (`/nl/opleidingen-en-trainingen`,
`/nl/equipment/alpine`, ...), German on `/de`. With `nl`, Dutch is on `/` and English on
`/en`. While English is the default, an old Dutch-only address on `/` (`/actueel`) 301s to
its `/nl/` page instead of a 404. One value drives
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

## Live on rescuewatercraft.eu (since 23-10-2026)

- Apex canonical. `www` is attached as a custom domain and 301s onto the apex twice
  over: a zone redirect rule (`http_request_dynamic_redirect`) and the Worker. The
  concept hosts stay attached and 301 onto the apex, path preserved (`LIVE` = `"true"`).
- Zone: Always Use HTTPS on, minimum TLS 1.2, bot fight mode / AI-crawler blocking /
  managed robots.txt all off, so Googlebot, Bingbot, GPTBot, OAI-SearchBot, ClaudeBot
  and PerplexityBot all get the pages (verified: every sitemap URL 200, self-canonical,
  no noindex, for each of them). Hostnet's parking `A 91.184.0.200` was deleted.
- `rescuewatercraft.nl` + `www` (the client's older domain, zone on our account since
  23-10-2026) are attached to this Worker and 301 every URL to the **Dutch** version on
  .eu in one hop (`DUTCH_HOSTS`): `/` -> `/nl`, a Dutch page that exists -> its `/nl/`
  page, another existing path (`/de/kontakt`) -> itself, anything else -> `/nl`. That
  zone also carries the Purelymail records (MX, SPF, DKIM, DMARC) for
  info@rescuewatercraft.nl: do not touch them. Always Use HTTPS + TLS 1.2 are on there too.
- Forms go to `info@rescuewatercraft.nl`, the client's own mailbox and the reply-to on
  the visitor's confirmation. **Never send a test submission against the deployed
  config**: point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first.
- IndexNow (Bing, which also feeds ChatGPT search and Copilot): `pnpm indexnow` after a
  deploy that adds or changes pages. The key is the `.txt` file in `public/`.
  `node tools/indexnow.mjs --host <concept host>` resubmits a concept host's old URLs
  (incl. the Dutch-on-`/` and `/en/` addresses) so Bing recrawls them and finds the 301;
  done for both concept hosts on 23-10-2026. The key file is the one path the concept
  hosts answer without redirecting. Every old address 301s in one hop to where the page
  lives now.

Still open:

1. Search Console: add the domain property (TXT record on this zone) and submit
   `https://rescuewatercraft.eu/sitemap.xml`. Same in Bing Webmaster Tools (it can
   import from Search Console).
2. Apex mail: the zone has no MX, SPF or DMARC on the apex, so nothing stops a third
   party spoofing mail from `@rescuewatercraft.eu`. The client mails from
   `@rescuewatercraft.nl`; if they confirm the `.eu` apex never sends, add a null MX,
   `v=spf1 -all` and `_dmarc` `v=DMARC1; p=reject`. Leave the `notify` / `cf-bounce`
   records alone: they carry the form mail.
