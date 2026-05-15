# Shared forms guide for tp-totaal

Canonical sources:
- `/Users/alfred/Projects/jiw-websites/docs/cloudflare-forms.md`
- `/Users/alfred/Projects/jiw-websites/packages/cloudflare-forms/src/index.ts`
- Best analog: `apps/sqm/` (sub-of `jouwidealewebsite.nl`, default email addresses) — and `apps/mt-bouw/` (same pattern, painter-adjacent)
- Reference with full options (custom domain + per-site email): `apps/rn-schilders/`

## Default `jouwidealewebsite.nl` addresses (the convention)

When a client does NOT have a verified Cloudflare Email Service sender on their own domain (i.e. when deploying to `<site>.jouwidealewebsite.nl`), use the shared JIW addresses:

- `LEAD_SENDER` (FROM, also listed in `allowed_sender_addresses`): `offerte@notify.jouwidealewebsite.nl`
- `LEAD_RECIPIENT` (TO): `hallo@jouwidealewebsite.nl` (this is the default JIW inbox used by `sqm`, `kok`, `xenon`, `de-vest`, and others; `mt-bouw` overrides it to a personal Gmail).

For tp-totaal, start with these defaults. When TP Totaal eventually wants leads in their own inbox, change only `LEAD_RECIPIENT` (e.g. `info@tp-totaal.nl`). The sender stays on `notify.jouwidealewebsite.nl` until/if they verify their own sender subdomain in Cloudflare Email Service (then mirror what rn-schilders does: `offerte@notify.tp-totaal.nl`).

## Minimal Worker setup for tp-totaal

1. Scaffold a Vite + React TS app under `apps/tp-totaal/` (port already reserved via INFO; pick an unused dev port).
2. Add deps in `apps/tp-totaal/package.json`:
   - `"@jiw/cloudflare-forms": "workspace:*"` (the workspace is auto-discovered via `pnpm-workspace.yaml` which globs `packages/*`).
   - Add `ship` / `ship:dry-run` scripts that run `pnpm build && wrangler deploy [--dry-run]`.
   - Add `tsconfig.worker.json` (copy from `apps/sqm/tsconfig.worker.json` verbatim — it just sets `WebWorker` lib + `@cloudflare/workers-types` and `include: ["worker"]`).
   - Update `lint` to `tsc --noEmit && tsc --noEmit -p tsconfig.worker.json`.
3. Create `apps/tp-totaal/worker/index.ts` modelled on `apps/sqm/worker/index.ts`. The Worker entry must:
   - Import `createFormWorker` and `CloudflareFormsEnv` from `@jiw/cloudflare-forms`.
   - Export `Env = CloudflareFormsEnv & { ASSETS: Fetcher }`.
   - Route `request.url.pathname.startsWith('/api/')` to `formWorker.fetch(...)`.
   - Otherwise fall through to `env.ASSETS.fetch(request)` (optionally trailing-slash redirect, optional HTMLRewriter for per-route meta like rn-schilders).
4. Pick a `formPath` (e.g. `/api/forms/prijsindicatie`) and use it consistently in the frontend `fetch(...)` call.
5. Confirmation follow-up sentence (Dutch, no em dash, no fillers — per repo style memory). Example: `"Wij nemen binnen één werkdag contact op om uw aanvraag door te nemen."`

## `wrangler.jsonc` shape (copy-paste)

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
    // Production custom domain to be added when wired:
    // { "pattern": "tp-totaal.nl",     "custom_domain": true },
    // { "pattern": "www.tp-totaal.nl", "custom_domain": true }
  ],
  "r2_buckets": [
    { "binding": "FORM_UPLOADS", "bucket_name": "jiw-form-uploads-prod" }
  ],
  "send_email": [
    {
      "name": "LEAD_EMAIL",
      "allowed_sender_addresses": ["offerte@notify.jouwidealewebsite.nl"]
    }
  ],
  "vars": {
    "SITE_ID": "tp-totaal",
    "LEAD_RECIPIENT": "hallo@jouwidealewebsite.nl",  // <TODO: switch to TP Totaal inbox when they want leads direct>
    "LEAD_SENDER": "offerte@notify.jouwidealewebsite.nl"
  }
}
```

## Bindings, vars, secrets

What the Worker needs (consumed by `@jiw/cloudflare-forms`):

| Kind         | Name                       | Source                                    | Value for tp-totaal                                            |
|--------------|----------------------------|-------------------------------------------|----------------------------------------------------------------|
| R2 binding   | `FORM_UPLOADS`             | `r2_buckets` in wrangler.jsonc            | bucket `jiw-form-uploads-prod`                                 |
| send_email   | `LEAD_EMAIL`               | `send_email` in wrangler.jsonc            | sender allow-list = `offerte@notify.jouwidealewebsite.nl`      |
| var          | `SITE_ID`                  | `vars` in wrangler.jsonc                  | `tp-totaal` (used as R2 prefix)                                |
| var          | `LEAD_RECIPIENT`           | `vars` in wrangler.jsonc                  | `hallo@jouwidealewebsite.nl` (default JIW inbox)               |
| var          | `LEAD_SENDER`              | `vars` in wrangler.jsonc                  | `offerte@notify.jouwidealewebsite.nl`                          |
| secret       | `TURNSTILE_SECRET_KEY`     | `wrangler secret put TURNSTILE_SECRET_KEY`| from the per-site Turnstile widget                             |
| asset binding| `ASSETS`                   | `assets.binding` in wrangler.jsonc        | served from `./dist`                                           |

Frontend env (Vite):
- `VITE_TURNSTILE_SITE_KEY` — public site key. Commit to `.env` in the app, or set in CI. Only required if you wire the Turnstile widget into the form (sqm currently does not — see "Pitfalls").

R2 prefix per submission: the lib auto-generates `tp-totaal/YYYY/MM/<submissionId>/...`. Add an R2 lifecycle rule for the `tp-totaal/` prefix (rn-schilders uses 90 days; pick the same unless told otherwise).

Deploy (from repo root):
```
set -a && source .env && set +a
pnpm --filter @jiw/tp-totaal ship:dry-run
pnpm --filter @jiw/tp-totaal ship
```
Root `.env` provides `CLOUDFLARE_API_TOKEN`. Some commands also want `CLOUDFLARE_ACCOUNT_ID` exported.

## Frontend payload + endpoint shape

POST to the `formPath` you chose (suggested: `/api/forms/prijsindicatie`) as `multipart/form-data`.

Hard-required by the lib (always validated):
- `firstName`
- `lastName`
- `email` (must match a simple email regex)

Optional but expected by the lib:
- `cf-turnstile-response` — Turnstile token. If you do not wire Turnstile, the lib still requires this field unless either (a) the request comes from `localhost`, or (b) the secret is the literal string `dev` AND the field equals `dev`. For production on the public domain you MUST wire a Turnstile widget (or temporarily mirror sqm's approach — see Pitfalls).
- `files` (zero or more) — defaults: max 5 files, 10 MB per file, 50 MB total. Override per-app via `attachmentMaxFiles`, `attachmentMaxFileBytes`, `attachmentMaxTotalBytes` in `createFormWorker(...)`.
- Any field name you list in `requiredFields` / `emailFields` / `subjectFields`. Conditional fields use `when: { field, equals }` (e.g. `serviceOther` shown when `service === 'other'`).
- `message` — the long-form description (or whatever you set as `messageField`).

Response shape:
- Success: `200 { ok: true, submissionId }`
- Error: `4xx/500 { ok: false, error: 'validation'|'turnstile'|'attachments'|'email'|'server', message }`

Frontend pattern (lifted from `apps/sqm/src/components/IntakeModal.tsx`):
```ts
const formData = new FormData(form);
formData.delete('files');
for (const f of files) formData.append('files', f, f.name);
// if using Turnstile: formData.set('cf-turnstile-response', token);
const res = await fetch('/api/forms/prijsindicatie', { method: 'POST', body: formData });
const result = await res.json();
if (!res.ok || !result.ok) throw new Error(result.message);
```

The lib also exposes:
- `POST <formPath>/log` — JSON sink for client-side error telemetry (optional).
- `GET <formPath>/attachments/YYYY/MM/<submissionId>/<attachmentId>/<filename>?token=...` — signed-ish download links embedded in the lead email.

## Pitfalls / gotchas

1. **Turnstile vs. sqm.** `apps/sqm/src/components/IntakeModal.tsx` ships WITHOUT a Turnstile widget. Inspecting the lib (`validateTurnstile` in `packages/cloudflare-forms/src/index.ts`), production requests on a real hostname will be rejected with `error: 'turnstile'` unless a valid token is present. Either copy rn-schilders' `TurnstileWidget` (see `apps/rn-schilders/src/App.tsx` around line 2160+) and set `VITE_TURNSTILE_SITE_KEY` + the `TURNSTILE_SECRET_KEY` secret, or verify how sqm is actually working live before shipping tp-totaal without it. Do not assume sqm's omission is safe.
2. **No `.dev.vars`.** Neither sqm nor rn-schilders commits one; for local dev the lib short-circuits Turnstile on loopback. If you run via `wrangler dev` on a non-loopback host, set a `.dev.vars` with `TURNSTILE_SECRET_KEY=dev` and submit the literal token `dev`.
3. **R2 bucket pre-exists.** `jiw-form-uploads-prod` is shared. Do not create a new bucket. Only add a lifecycle rule for the `tp-totaal/` prefix.
4. **Sender verification.** `offerte@notify.jouwidealewebsite.nl` must be already verified in Cloudflare Email Service for this account (`aec64586d4d04a644f4f9b8225d7ca28`). The wrangler `allowed_sender_addresses` array just narrows what the binding can send AS — it does not register the address.
5. **`run_worker_first: true`** sends every request through the Worker (matches sqm/rn-schilders). Docs mention `assets.run_worker_first = ["/api/*"]` as the narrow form; the working examples use the boolean form and route `/api/*` inside the handler. Stick with the working examples.
6. **Naming.** The wrangler `name` is the Worker name in Cloudflare. Pick something globally unique on the account — `tp-totaal` is fine.
7. **Trailing-slash redirect.** Both reference workers strip trailing slashes before serving assets. Keep it; it matches the SPA routing.
8. **No per-app `.gitignore`** and don't commit `TURNSTILE_SECRET_KEY` (use `wrangler secret put`).
9. **CTA naming.** Per `INFO.md`, use "Gratis prijsindicatie" / "prijsindicatie", not "offerte" in UI copy — but the email/lib internals still say "offerteaanvraag". That's fine, just don't try to override every Dutch string in the lib; only `siteName`, `subjectPrefix`, `senderName`, `ownerName`, and `confirmationFollowUpSentence` are configurable.
