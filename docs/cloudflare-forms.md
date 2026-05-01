# Cloudflare lead forms

Reusable pattern for client-site lead forms in this monorepo.

## App shape

- Static Vite app is deployed as a Cloudflare Worker with Static Assets.
- API routes live in the app's `worker/` folder and import `@jiw/cloudflare-forms`.
- Static assets use `assets.not_found_handling = "single-page-application"`.
- API requests are routed through the Worker with `assets.run_worker_first = ["/api/*"]`.

## Required Cloudflare resources

- One shared R2 bucket: `jiw-form-uploads-prod`.
- Per-site R2 prefix: `<site-id>/YYYY/MM/<submission-id>/`.
- R2 lifecycle rule per site prefix. RN Schilders uses 90 days on `rn-schilders/`.
- One Turnstile widget per site.
- One targeted `send_email` binding per site Worker.

## Email sending

Cloudflare Email Service sending can be used directly from Workers with a `send_email` binding. For RN Schilders:

- Destination: `info@rn-schilders.nl`.
- Sender: `offerte@notify.rn-schilders.nl`.
- Keep Purelymail untouched for normal mailbox hosting.
- Use the Email Service sender domain/subdomain configured in Cloudflare.

## Adding another site

1. Add `@jiw/cloudflare-forms` as a workspace dependency for the app.
2. Add `worker/index.ts` using `createFormWorker`, including a site-specific Dutch `confirmationFollowUpSentence` for the sender confirmation email.
3. Add `wrangler.jsonc` with Static Assets, R2, `send_email`, and site vars.
4. Create a Turnstile widget and commit only the public `VITE_TURNSTILE_SITE_KEY`.
5. Upload `TURNSTILE_SECRET_KEY` with `wrangler secret put`.
6. Add or update the R2 lifecycle rule for the app prefix.
7. Verify the sender domain in Cloudflare Email Service before live cutover.
