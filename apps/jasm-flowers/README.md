# JASM Flowers

B2B site for a Kenyan flower exporter selling to professional buyers in Europe, the
Middle East, Africa and Asia. English, Dutch and German. Live on
`jasmflowers.jouwidealewebsite.nl`.

Graduated into the monorepo on 09-10-2026 from `~/dev/claudius/playground/flower`
(the directory was called `flower`, which is why nothing ever grepped for "jasm").

## The exception

Like `yanis-klussenbedrijf` and `rh-klusservice`, this is not a Vite + React app. It is
a node script that writes static HTML. Kept that way on graduation for the same reason:
every page is already complete in the HTML at first paint, which is what we want for
bots and for a buyer on a bad connection, and a rewrite would risk the content rather
than improve it.

`src/build.mjs` writes `dist/`:

- Six page templates from `src/pages.mjs`, rendered in three languages = 18 pages,
  plus a noindex print sheet per language that the PDF is printed from.
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
node tools/smoke.mjs <url>               # 776 checks; no url = local dist/
node --experimental-strip-types tools/preview-mail.mjs   # render the emails to look at
```

`build` runs three steps and all three matter. The build wipes `dist/`, which takes the
catalogue PDFs with it — deploying after a build that skipped `gen-pdf.mjs` leaves all
three download links serving a 404. `gen-pdf.mjs` needs Playwright's Chromium.

## The enquiry form

One form, on `/contact/` in each language. It posts to `/api/forms/enquiry`, handled by
`worker/index.ts` on top of `@jiw/cloudflare-forms` (see `docs/cloudflare-forms.md`).
Only `/api/*` runs the worker; the pages come straight off the edge.

Before graduation the form had no backend at all: it handed the enquiry to the
visitor's own mail client, which does nothing on a desktop with no mail handler
registered. The WhatsApp button still works that way on purpose — for this audience it
is often the faster channel.

- Leads go to `hallo@jouwidealewebsite.nl`. **Not** to JASM yet: they have two office
  lines and two mailboxes on `jasmflowers.co.ke`, but nobody has confirmed which should
  receive web enquiries, and a guess would drop real buyers into an unwatched mailbox.
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

## Still owed by the client

- Which mailbox should receive web enquiries (see above).
- A close-up of each eucalyptus line. Baby Blue and Silver Dollar are two cards now and
  both photos are field shots that look near-identical at card size.
- A proper packhouse shot.
- A straight-from-the-phone copy of the tinted gypsophila photo. The one we have is
  810x1080 after WhatsApp compression, the lowest-resolution image on the site.
