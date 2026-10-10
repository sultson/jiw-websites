# JASM Flowers

B2B site for a Kenyan flower exporter selling to professional buyers in Europe, the
Middle East, Africa and Asia. English, Dutch and German. Live on the client's own name,
`jasmflowers.com`, since 09-10-2026.

Graduated into the monorepo on 09-10-2026 from `~/dev/claudius/playground/flower`
(the directory was called `flower`, which is why nothing ever grepped for "jasm").

## The exception

Like `yanis-klussenbedrijf` and `rh-klusservice`, this is not a Vite + React app. It is
a node script that writes static HTML. Kept that way on graduation for the same reason:
every page is already complete in the HTML at first paint, which is what we want for
bots and for a buyer on a bad connection, and a rewrite would risk the content rather
than improve it.

`src/build.mjs` writes `dist/`:

- Ten page templates from `src/pages.mjs`, rendered in three languages = 30 pages,
  plus a noindex print sheet per language that the PDF is printed from. Six of the ten
  are the site proper (home, catalogue, shipping, about, contact, 404); the other four
  are the key-line pages below.
- Images: 34 PNG sources in `assets/img/` become WebP at five widths with a JPEG
  fallback, content-hashed into `dist/i/`.
- `sitemap.xml`, `robots.txt`, `_headers`, the favicon.

The site is authored once in English. `src/i18n.mjs` walks the built HTML and swaps
each text chunk for its entry in `src/lang/nl.tsv` / `de.tsv`, keyed on the English
source string. A missing entry falls back to English rather than blanking the page,
and the build prints the count of untranslated strings, so coverage is measured rather
than assumed. Keep it at zero.

## Commands

```
pnpm --filter @jiw/jasm-flowers build    # dist/ + mail logo + 3 PDFs
pnpm --filter @jiw/jasm-flowers dev      # build, then wrangler dev on :3070
pnpm --filter @jiw/jasm-flowers ship     # build, then wrangler deploy
pnpm --filter @jiw/jasm-flowers lint     # tsc over worker/
node tools/smoke.mjs <url>               # 1484 checks; no url = local dist/
node tools/seo.mjs <origin>              # 539 indexing checks, live only
node --experimental-strip-types tools/preview-mail.mjs   # render the emails to look at
```

`build` runs three steps and all three matter. The build wipes `dist/`, which takes the
catalogue PDFs with it — deploying after a build that skipped `gen-pdf.mjs` leaves all
three download links serving a 404. `gen-pdf.mjs` needs Playwright's Chromium.

## Domains

Live on the client's own name since 09-10-2026. Four hostnames are attached to the
Worker; exactly one of them ever returns a page.

| Hostname | Answers |
| --- | --- |
| `jasmflowers.com` | the site, 200 — canonical |
| `www.jasmflowers.com` | 301 to the apex, path and query kept |
| `jasmflowers.jouwidealewebsite.nl` | 301 to the apex |
| `flower.jouwidealewebsite.nl` | 301 to the apex |

The apex is canonical because that is what `company.domain` in `src/data.mjs` says, and
that single line is where every absolute URL on the site comes from: canonical, hreflang,
`x-default`, `og:url`, the schema.org `@id`s, the sitemap and the `Sitemap:` line in
`robots.txt`. Changing hostname again is that one line plus `SITE_URL` and the three
`footerText` strings in `worker/confirmation.ts`.

Watch out when you change it: two of the PDF footer lines in `src/lang/*.tsv` contain the
domain as *visible text*, and translation is keyed on the whole English string, so moving
the domain orphans those two keys and the build reports two untranslated strings. Fix the
left-hand column in both TSVs.

None of the three redirects lives in the Worker. They are 301s from
`http_request_dynamic_redirect` rulesets on the two zones, a phase Cloudflare evaluates
*before* Workers, so a redirected request never costs an invocation:

- `jasmflowers.com` zone, ruleset `e2e4c583dc094ae8b3ff25fdc2189b0d` — the `www` rule.
- `jouwidealewebsite.nl` zone, ruleset `f7d87eb6b65746658a7e67d0c998fda1` (the zone's
  shared entrypoint — **append** to it, a `PUT` of your own rule set wipes the other
  sites' rules) — the two old addresses, excluding `/api/`.

That `/api/` carve-out is deliberate. A 301 turns a `POST` into a `GET`, so a buyer who
had the old page open when the switch happened would have lost eleven filled-in fields
silently. Enquiries still post fine on the old hostnames; only documents redirect.

The old addresses stay bound as `custom_domain` routes rather than being swapped for a
discard-prefix `AAAA`. Both have been shared publicly and are in Google, so they have to
keep answering, and leaving them bound means that if someone deletes the redirect rule the
failure mode is duplicate content rather than a dead address. The cost is 2 of the 100
Workers custom domains on `jouwidealewebsite.nl`, a zone already at its cap.

## The enquiry form

One form, on `/contact/` in each language. It posts to `/api/forms/enquiry`, handled by
`worker/index.ts` on top of `@jiw/cloudflare-forms` (see `docs/cloudflare-forms.md`).
Only `/api/*` runs the worker; the pages come straight off the edge.

Before graduation the form had no backend at all: it handed the enquiry to the
visitor's own mail client, which does nothing on a desktop with no mail handler
registered. The WhatsApp button still works that way on purpose — for this audience it
is often the faster channel.

- Leads go to `sales@jasmflowers.co.ke` — the client's own mailbox, confirmed
  09-10-2026. That address is also the reply-to on the buyer's confirmation, so a reply
  to it reaches JASM and not us. **Never send a test submission against this config.**
  Point `LEAD_RECIPIENT` back at `hallo@jouwidealewebsite.nl` first.
- Sender is `no-reply@notify.jasmflowers.com`. The sending *domain* is verified in
  Cloudflare Email Service (DKIM, SPF, `p=reject` DMARC on the `jasmflowers.com` zone);
  the local part is free, so changing it is `LEAD_SENDER` plus `allowed_sender_addresses`
  in `wrangler.jsonc`, no DNS work.
- No Turnstile. A honeypot field named `website` instead.
- The ten "flowers required" pick buttons are not inputs. `app.js` joins them into one
  `flowers` field before posting, because the package walks FormData once per key and
  ten values under one name would lose nine.

### The confirmation email

`worker/confirmation.ts`, in EN/NL/DE. The language follows the page the buyer was on:
`app.js` reads `<html lang>` and sends it as `__jiw_confirmation_locale`.

Field labels are lifted verbatim from `src/lang/*.tsv`, so a buyer reads back the same
words the form showed them. The palette is the site's own, with two exceptions noted in
the file: `muted` and `accent` are darkened because the site's sage and gold fall under
4.5:1 at small sizes, and there is no stylesheet to fix an email after it is read.

`tools/gen-mail-logo.mjs` bakes `logo-light.png` onto the cream of the logo bar and
writes `dist/mail/jasm-flowers-email.png`. Three reasons it is not one of the `/i/`
variants: email clients need PNG, the URL has to stay stable (everything in `/i/` is
content-hashed, so a mail sent last month would point at a 404), and the alpha has to
go because older Outlook renders transparency as a black box.

`tools/preview-mail.mjs` renders the real thing — it drives the actual worker config
through a stub env that captures the outgoing message, the same trick the package's own
tests use, so what you look at is what the renderer produces. Output is gitignored.

## Key-line pages

`/wholesale/<slug>/` for Solidago, Eucalyptus Baby Blue, Eucalyptus Silver Dollar and
Limonium, in all three languages. One template, `P.keyLine` in `src/pages.mjs`; the copy
lives in `LINE_COPY` in `src/data.mjs`.

They exist for one reason: searches like "solidago wholesale kenya" have real buying
intent behind them and nobody answers them properly — the one competitor who ranks does
it with a near-empty page. The catalogue entry cannot win that search, because it is one
card among seventeen on a page about everything.

Two rules, both enforced in `tools/smoke.mjs`:

- **Footer only.** The single route in from the rest of the site is the `.ftr-lines`
  strip. They are not in the nav, and nothing in the `<main>` of the five core pages
  links to one. The four do link to each other — they are one cluster, and a buyer
  reading about Baby Blue usually wants Silver Dollar too.
- **Nothing new is claimed.** Every figure on them (altitude band, cold chain
  temperatures, pack spec, availability row, minimum order, order deadline, Incoterms)
  is read from the same data the rest of the site renders from.

Each carries `Product` schema with the spec as `additionalProperty` and no `offers`:
the price is quoted per shipment against a specification, and a number invented to
satisfy a validator would publish a price JASM has not agreed to.

## Analytics

Microsoft Clarity, project `yv1yjaux5r`, inline in `<head>` from `src/build.mjs`.

Session continuity across a click needed no work: this is 30 prerendered documents, not
an SPA, and every internal link is a plain same-origin `href`, so Clarity's own
first-party cookies stitch the pageviews into one session. The two things that would
break it are a page without the tag — hence one shared layout rather than five
hand-edited files — and a second hostname serving pages, which since the move to
`jasmflowers.com` no longer happens: `www` and both old `jouwidealewebsite.nl` addresses
301 at the edge before a document is served.

The three print sheets deliberately have no tag: `gen-pdf.mjs` renders them in headless
Chromium on every build, which would file three robot sessions per deploy. `smoke.mjs`
stubs `clarity.ms` in every browser context for the same reason.

### Open: sessions are not being stitched, and it is not the site

Measured against the deployed site on 09-10-2026. The tag loads, `window.clarity` is a
function on every page and `/collect` answers 204, so recording works. But **no `_clck`
or `_clsk` cookie is written**, which is what carries a session from one page load to
the next — so every page view currently files as its own session.

The cause is Clarity's consent gate, not anything here. Calling `clarity('consent')` in
the console writes both cookies immediately:

```
_clck=10qpzim^2^ga5^1^2473; _clsk=fywbc1^1791556031979^1^1^n.clarity.ms/collect
```

Two ways to fix it, and both are the same privacy decision:

1. Turn the cookie-consent requirement off in the Clarity dashboard (project settings →
   Setup). Nothing changes in this repo.
2. Add `clarity('consent')` to the snippet in `src/build.mjs`. One line.

Not done unilaterally: the site has no cookie banner, and either option asserts consent
that no visitor has been asked for. Worth checking before picking, because the same
gate presumably applies to `expat-relocation`, which runs the identical bare snippet.

## Claims we deliberately do not publish

Three rounds of client feedback took these out. They are not to come back in through a
new page, a meta description or an email without the client saying so:

- **Any quote turnaround.** "A written price inside one working day" was in four places
  until 30-09-2026.
- **Any delivery or transit time.** Including "48 hours field to door" and
  "night freighter to Europe".
- **Certifications.** The site named KFC Silver, Fairtrade, GLOBALG.A.P. and MPS-A as a
  target standard. The client's own brief says not to publish certifications they
  cannot substantiate, and they have not answered which they hold across three rounds.
- **Tinted solidago.** The swatch came off the catalogue card on 09-10-2026: the
  client's own answer to "do you supply dyed or tinted flowers?" is "yes, on gypsophila
  and roses", and the card was contradicting it one page away.
- **David Austin colours.** The client gave one colour list including tinted "bio
  colours" for all five rose lines. It is applied to four. David Austin are licensed
  named varieties in the breeder's own palette and are not tinted.

What the site does promise is a deliverable rather than a deadline: a written quote per
line with stem length, bunch spec, box count, FOB Nairobi price and the freight rate.

## Assets

`assets/img/` holds the 34 PNG build inputs. Also committed:

- `_src-0510/`, `_src-0910/` — the client's own files as delivered over WhatsApp.
- `_orig/` — pre-grading versions of the current images.

Left behind in `~/dev/claudius/playground/flower/assets/img/`: `_ai/`, `_prev-0510/`
and `_prev-2909/`, 135 MB of superseded renders that nothing builds from.

Real client photographs carry the site's claims, so they are graded with `sharp`
(exposure, contrast, unsharp) and never run through an image model. The one time that
rule matters most is the tinted gypsophila shot: the subject is a few hundred
individually tinted florets, and a model asked to "recover detail" redistributes the
colours, which would make our proof of what they can tint a guess.

## Search Console

Not set up, and it cannot be done from here: adding `jasmflowers.com` as a property needs
a verification token out of the Search Console UI, which needs a Google login. Once
someone has the token, a DNS-method TXT record on the apex is a one-line add to the zone
and then the sitemap can be submitted at `https://jasmflowers.com/sitemap.xml`.

Until that happens nothing is wrong — Google will find the site from `robots.txt` and
crawl it. Search Console only changes whether we can *see* what it found. `tools/seo.mjs`
checks the same things Search Console reports on, against the deployed site, so a clean
run there is the best read available without the property.

Worth expecting in the report for a few weeks after the move: the old
`jasmflowers.jouwidealewebsite.nl` URLs showing as "Page with redirect". That is the
correct state for a moved site, not an error.

## Still owed by the client

- A close-up of each eucalyptus line. Baby Blue and Silver Dollar are two cards now and
  both photos are field shots that look near-identical at card size.
- A proper packhouse shot.
- A straight-from-the-phone copy of the tinted gypsophila photo. The one we have is
  810x1080 after WhatsApp compression, the lowest-resolution image on the site.
