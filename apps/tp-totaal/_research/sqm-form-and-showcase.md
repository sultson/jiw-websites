# tp-totaal — porting SQM's form and showcase

Field notes from reading `apps/sqm/` so the same pattern can be lifted into `apps/tp-totaal/` with minimal churn. References to actual files use absolute paths under the monorepo so you can `Read` them quickly when wiring this up.

Sources read:

- `/Users/alfred/Projects/jiw-websites/apps/sqm/wrangler.jsonc`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/worker/index.ts`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/tsconfig.worker.json`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/IntakeModal.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/Showcase.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/Lightbox.tsx`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/src/data/portfolio.ts`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/src/data/services.ts`
- `/Users/alfred/Projects/jiw-websites/apps/sqm/package.json`
- `/Users/alfred/Projects/jiw-websites/packages/cloudflare-forms/src/index.ts`
- `/Users/alfred/Projects/jiw-websites/docs/cloudflare-forms.md`

---

## 1. `wrangler.jsonc`

SQM uses the jouwidealewebsite default email convention: sender `offerte@notify.jouwidealewebsite.nl`, recipient `hallo@jouwidealewebsite.nl`. No production custom domain is wired yet — only the `<site>.jouwidealewebsite.nl` route. Mirror that for tp-totaal.

```jsonc
{
  "$schema": "../../node_modules/wrangler/config-schema.json",
  "name": "tp-totaal",
  "account_id": "aec64586d4d04a644f4f9b8225d7ca28",
  "main": "./worker/index.ts",
  "compatibility_date": "2026-04-24",
  "observability": { "enabled": true },
  "assets": {
    "directory": "./dist",
    "binding": "ASSETS",
    "not_found_handling": "single-page-application",
    "run_worker_first": true
  },
  "routes": [
    { "pattern": "tp-totaal.jouwidealewebsite.nl", "custom_domain": true }
    // Add production custom domain(s) here when wired:
    // { "pattern": "tp-totaal.nl",     "custom_domain": true },
    // { "pattern": "www.tp-totaal.nl", "custom_domain": true }
  ],
  "r2_buckets": [
    {
      "binding": "FORM_UPLOADS",
      "bucket_name": "jiw-form-uploads-prod"
    }
  ],
  "send_email": [
    {
      "name": "LEAD_EMAIL",
      "allowed_sender_addresses": ["offerte@notify.jouwidealewebsite.nl"]
    }
  ],
  "vars": {
    "SITE_ID": "tp-totaal",
    "LEAD_RECIPIENT": "hallo@jouwidealewebsite.nl",
    "LEAD_SENDER": "offerte@notify.jouwidealewebsite.nl"
  }
}
```

Notes:

- `SITE_ID = "tp-totaal"` is what the package uses to scope the R2 prefix → submissions land under `tp-totaal/YYYY/MM/<submission-id>/` in `jiw-form-uploads-prod`. Per `docs/cloudflare-forms.md`, an R2 lifecycle rule for the `tp-totaal/` prefix should be added in the Cloudflare dashboard.
- `assets.run_worker_first: true` is what makes `/api/*` hit the worker before static assets. SQM uses the boolean form (not the `["/api/*"]` array). Match it exactly.
- `compatibility_date` 2026-04-24 is fine to copy.
- SQM does **not** set a `TURNSTILE_SECRET_KEY` secret. The package treats `secret === 'dev'` and the token `'dev'` as auto-pass, and loopback hostnames bypass Turnstile entirely. As long as the client doesn't render a Turnstile widget and the secret is unset, all production submissions will be rejected by `validateTurnstile`. **Action item:** for production tp-totaal, either (a) set `TURNSTILE_SECRET_KEY` via `wrangler secret put`, set `VITE_TURNSTILE_SITE_KEY` in `.env.production`, and render a widget like rn-schilders does, or (b) set the secret to literally `dev` and inject a hidden `cf-turnstile-response=dev` field. Until that decision is made, copy SQM's behavior verbatim — it's the same gap.

## 2. `package.json` additions

Add to `apps/tp-totaal/package.json`:

```jsonc
"scripts": {
  "ship": "pnpm build && wrangler deploy",
  "ship:dry-run": "pnpm build && wrangler deploy --dry-run",
  "lint": "tsc --noEmit && tsc --noEmit -p tsconfig.worker.json"
},
"dependencies": {
  "@jiw/cloudflare-forms": "workspace:*"
}
```

Pick a free dev port (current ports in use end at 3008 for sqm — 3009/3010 are open). Reference: `apps/sqm/package.json` lines 7-15.

## 3. `tsconfig.worker.json`

Copy `apps/sqm/tsconfig.worker.json` verbatim — it scopes the worker compile to `worker/` with `@cloudflare/workers-types`, separate from the Vite/React tsconfig. SQM's `lint` script runs both.

## 4. `worker/index.ts`

The worker file is tiny — it composes `createFormWorker(...)` and delegates `/api/*` to it, everything else to `ASSETS`. Trailing-slash redirects at top. Copy SQM's structure 1:1; only the config object needs tp-totaal-specific copy.

```ts
import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const formWorker = createFormWorker({
  formPath: '/api/forms/intake',
  siteName: 'TP Totaal',                      // tweak to brand display name
  senderName: 'TP Totaal',
  subjectPrefix: 'Nieuwe aanvraag TP Totaal',
  confirmationFollowUpSentence:
    'Wij nemen binnen een werkdag contact op om uw vraag door te nemen.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'postalCode', label: 'postcode', message: 'Vul uw postcode in.' },
    { name: 'city', label: 'plaatsnaam', message: 'Vul uw plaatsnaam in.' },
    { name: 'service', label: 'dienst', message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'toelichting dienst',
      message: 'Beschrijf kort waar het om gaat.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'message', label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'serviceOther', label: 'Toelichting dienst', when: { field: 'service', equals: 'other' } },
    { name: 'propertyType', label: 'Type object' },
    { name: 'urgency', label: 'Urgentie' },
  ],
  attachmentMaxFiles: 8,
  attachmentMaxFileBytes: 12 * 1024 * 1024,
  attachmentMaxTotalBytes: 60 * 1024 * 1024,
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname.length > 1 && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1);
      return Response.redirect(url.toString(), 301);
    }

    if (url.pathname.startsWith('/api/')) {
      return formWorker.fetch!(request, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
```

### `@jiw/cloudflare-forms` API surface (relevant slices)

`CloudflareFormsEnv` requires these bindings/vars to exist:

| Binding/var            | Source                     | Required for                                  |
| ---------------------- | -------------------------- | --------------------------------------------- |
| `FORM_UPLOADS`         | r2 binding                 | storing attachments + `submission.json`       |
| `LEAD_EMAIL`           | `send_email` binding       | sending lead + confirmation emails            |
| `TURNSTILE_SECRET_KEY` | `wrangler secret put`      | spam validation (see Turnstile note above)    |
| `SITE_ID`              | `vars`                     | R2 prefix scoping (`<SITE_ID>/YYYY/MM/...`)   |
| `LEAD_RECIPIENT`       | `vars`                     | inbox where lead emails land                  |
| `LEAD_SENDER`          | `vars`                     | the `from` address (must match allowed list)  |

`firstName`, `lastName`, and `email` are hardcoded as required in the package — only add the rest via `requiredFields`. The package handles: turnstile, R2 storage, `submission.json` manifest, signed attachment download URLs, owner email (with `Reply-To: <submitter>`), and submitter confirmation email.

The Worker also exposes `${formPath}/log` (POST) for client error reporting and `${formPath}/attachments/...` (GET, token-gated) for owners to download attachments. Both come for free from `createFormWorker`.

## 5. Intake form — `src/components/IntakeModal.tsx`

The full file at `/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/IntakeModal.tsx` is ~345 lines. Copy it verbatim, then tune:

- `t('ct.*')` keys → ensure tp-totaal's i18n source has equivalent strings (`ct.kicker`, `ct.title`, `ct.intro`, `ct.firstName`, `ct.lastName`, `ct.email`, `ct.phone`, `ct.postalCode`, `ct.city`, `ct.service`, `ct.servicePick`, `ct.serviceOther`, `ct.serviceOtherPlaceholder`, `ct.propertyType`, `ct.propertyPick`, `ct.propertyHome`, `ct.propertyApt`, `ct.propertyBiz`, `ct.propertyOther`, `ct.urgency`, `ct.urgencyPick`, `ct.urgencyPlanned`, `ct.urgencySoon`, `ct.urgencyUrgent`, `ct.message`, `ct.messagePh`, `ct.attachments`, `ct.attachmentsHint`, `ct.optional`, `ct.consent`, `ct.submit`, `ct.submitting`, `ct.errorGeneric`, `ct.successTitle`, `ct.successBody`, `ct.successAgain`).
- `src/data/services.ts` → port `serviceFormOptions` with tp-totaal's services. The shape is `{ value: string; labelKey: string }[]`, with one option carrying `value: 'other'` to trigger the conditional `serviceOther` field.
- Tailwind utility classes used (`btn-orange`, `btn-outline`, `field`, `field-area`, `label`, `kicker`, `bg-cream`, `bg-cream-soft`, `text-charcoal-ink`, `text-charcoal/75`, `border-charcoal/10`, `accent-orange`, `text-orange-deep`, etc.) come from tp-totaal's design tokens. Either replicate sqm's tokens or remap to tp-totaal's palette before pasting.

Submission contract (do not change — must match worker):

- POST `multipart/form-data` to `/api/forms/intake`.
- Fields: `firstName`, `lastName`, `email`, `phone`, `postalCode`, `city`, `service`, `serviceOther?`, `propertyType?`, `urgency?`, `message`.
- File field name **must** be `files` (repeated, up to 8 files; 12 MB each; 60 MB total).
- Response: `{ ok: true, submissionId }` on success, `{ ok: false, error, message }` on failure.
- Errors are displayed inline; `ok` triggers the `SuccessPanel`.
- If Turnstile is added later, append `cf-turnstile-response` to the FormData; the package picks it up automatically.

## 6. Showcase + Lightbox

`/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/Showcase.tsx` (165 lines) and `/Users/alfred/Projects/jiw-websites/apps/sqm/src/components/Lightbox.tsx` (87 lines) can be copied unchanged except for:

1. The `portfolio` import (replace SQM's array with tp-totaal's images placed under `public/portfolio/`).
2. The `altKey` union in `PortfolioItem` — tighten it to tp-totaal's actual i18n keys.
3. The hard-coded "Hoeksche Waard · Voorne-Putten · West-Brabant" region label (line 28).
4. The "View all" link (line 88) currently points at SQM's Werkspot profile — swap it for tp-totaal's review profile or remove if not applicable.
5. The translation keys: `show.kicker`, `show.title`, `show.intro`, `show.openImage`, `show.viewAll`, plus the `show.alt.*` set used as captions.

Layout pattern in one line: **mobile = uniform 2/3-col square grid, desktop ≥ lg = 12-column bento with `auto-rows-[160px]` and a 20-tile cadence of (col-span, row-span) tuples cycled with `idx % layouts.length`.** Tile 0 gets a "Featured" pill. Each `<button>` opens the lightbox at its index. Hover reveals a gradient overlay, the alt text bottom-left, and an ArrowUpRight badge top-right.

Key snippet (the desktop layout grid driving the bento — adapt to fewer tiles if tp-totaal has fewer photos by truncating `layouts`):

```tsx
<div className="hidden lg:grid grid-cols-12 auto-rows-[160px] gap-3">
  {portfolio.map((p, idx) => {
    const layouts: Array<{ col: number; row: number }> = [
      { col: 6, row: 3 }, // hero lead
      { col: 3, row: 2 },
      { col: 3, row: 2 },
      { col: 3, row: 1 },
      { col: 3, row: 1 },
      { col: 4, row: 2 },
      { col: 4, row: 2 },
      { col: 4, row: 2 },
      { col: 3, row: 2 },
      { col: 6, row: 2 },
      { col: 3, row: 2 },
      { col: 4, row: 1 },
      { col: 4, row: 1 },
      { col: 4, row: 1 },
      { col: 6, row: 2 },
      { col: 3, row: 2 },
      { col: 3, row: 2 },
      { col: 4, row: 2 },
      { col: 4, row: 2 },
      { col: 4, row: 2 },
    ];
    const l = layouts[idx % layouts.length];
    return (
      <Tile
        key={p.src}
        p={p}
        idx={idx}
        t={t}
        onOpen={setOpenIdx}
        eager={idx < 6}
        style={{
          gridColumn: `span ${l.col} / span ${l.col}`,
          gridRow: `span ${l.row} / span ${l.row}`,
        }}
        isLead={idx === 0}
      />
    );
  })}
</div>
```

Lightbox is self-contained — Escape closes, ArrowLeft / ArrowRight cycle, click outside closes. It locks `document.body.style.overflow` while open. Just import it from Showcase as `import Lightbox from './Lightbox';` and pass `{ open, images, index, onClose, onPrev, onNext }`.

`portfolio.ts` shape (place in `src/data/portfolio.ts`, images under `public/portfolio/`):

```ts
export type PortfolioItem = { src: string; altKey: 'show.alt.foo' | 'show.alt.bar' };
export const portfolio: PortfolioItem[] = [
  { src: '/portfolio/p-xxxxx.webp', altKey: 'show.alt.foo' },
  // ...
];
```

Use the existing `scripts/optimize-images.ts` pattern from sqm to crunch sources to WebP before referencing them.

## 7. Deploy checklist

1. `cd /Users/alfred/Projects/jiw-websites && pnpm install` (after adding `@jiw/cloudflare-forms` dep).
2. `pnpm --filter @jiw/tp-totaal lint` — verifies both tsconfigs.
3. `set -a && source .env && set +a` (wrangler does not autoload root `.env`).
4. `pnpm --filter @jiw/tp-totaal ship:dry-run` — confirms build + bundle.
5. Decide Turnstile strategy and either `wrangler secret put TURNSTILE_SECRET_KEY` or document the gap as an open item (SQM has the same gap).
6. Add the R2 lifecycle rule for the `tp-totaal/` prefix in Cloudflare dashboard.
7. Confirm `offerte@notify.jouwidealewebsite.nl` sender is already verified in Email Service (it is for sqm — should be reusable).
8. `pnpm --filter @jiw/tp-totaal ship`.
