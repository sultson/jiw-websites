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

- Destination: `info@rnschilders.nl`.
- Sender: `offerte@notify.rnschilders.nl`.
- Keep Purelymail untouched for normal mailbox hosting.
- Use the Email Service sender domain/subdomain configured in Cloudflare.

## Lead notification wording

The notification sent to the site owner defaults to quote-request wording
("Nieuwe offerteaanvraag voor {siteName}", "Projectomschrijving", and the row
labels Voornaam / Achternaam / E-mail, which stay Dutch whatever `locale` is).
Sites that are not selling a job override it per form with `leadEmail`:

```ts
leadEmail: {
  heading: 'Nieuwe aanvraag voor Winterswijk Vakantiehuis',
  messageHeading: 'Bericht van de gast',
  nameLabels: { firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres' },
}
```

Every field is optional and falls back to the original copy, so a form that
leaves `leadEmail` out is unchanged. `tests/lead-email-copy.test.mjs` pins both
the overrides and the defaults.

## Subject line and owner-only rows

Two options exist for sites whose owner wants the notification shaped their way:

- `subjectSeparator` replaces the default `' - '` between the subject prefix and
  the `subjectFields` values. The Immigration Services NL landers use `' | '` so
  the subject reads `NEW LEAD | inburgeringsplichtig.nl | Naam`.
- `leadOnlyEmailFields` adds rows to the owner notification only. Campaign
  attribution (UTM parameters, gclid, landing URL, referrer) belongs there:
  `emailFields` rows are also rendered in the confirmation the visitor receives,
  and nobody wants their own `utm_campaign` mailed back to them.

## Confirmation wording

The confirmation the visitor receives from the default renderer was written for
quote requests: subject "Uw offerteaanvraag is ontvangen - {siteName}", the line
"Uw offerteaanvraag voor {siteName} is verstuurd.", and the headings "Uw
aanvraag" and "Projectomschrijving". Any form that is not a quote request
confirms the wrong thing, and the visitor notices. Klashorst Museum's client
read back a newsletter opt-in confirmed as an offerteaanvraag and asked what the
quote was for. Override it per form with `confirmationCopy`:

```ts
confirmationCopy: {
  subject: 'Uw aanmelding voor de nieuwsbrief is ontvangen - {siteName}',
  openingSentence: 'Uw aanmelding voor de nieuwsbrief van het {siteName} is verstuurd.',
  detailsHeading: 'Uw gegevens',
  messageHeading: 'Uw vraag',
  // An opt-in that asks for a name and an address has nothing worth reading back.
  includeSubmission: false,
}
```

`{siteName}` is substituted in `subject` and `openingSentence`. Every field is
optional and falls back to the copy this package has always sent, and the whole
block is ignored when `confirmationEmail` is set: that renderer carries its own
translations. `leadEmail` gained the same treatment for the owner notification:
`includeMessage: false` and `includeAttachments: false` drop the blocks a form
with no free-text field and no uploads would otherwise mail empty every time.

Two rules the renderers now follow on their own:

- A built-in name row the form does not require and the visitor left empty is
  dropped, instead of mailing both parties "Achternaam: -".
- `leadOnlyEmailFields` stay out of the confirmation, which is what they were
  added for. They used to reach both emails.

`tests/confirmation-copy.test.mjs` pins the overrides and the defaults.

## Adding another site

1. Add `@jiw/cloudflare-forms` as a workspace dependency for the app.
2. Add `worker/index.ts` using `createFormWorker`, including a site-specific Dutch `confirmationFollowUpSentence` for the sender confirmation email.
3. Form submissions must include `firstName`, `lastName`, and `email`. Configure all client-specific required fields, conditional fields, subject fields, and email row order through `requiredFields`, `subjectFields`, and `emailFields`.
4. Add `wrangler.jsonc` with Static Assets, R2, `send_email`, and site vars.
5. Create a Turnstile widget and commit only the public `VITE_TURNSTILE_SITE_KEY`.
6. Upload `TURNSTILE_SECRET_KEY` with `wrangler secret put`.
7. Add or update the R2 lifecycle rule for the app prefix.
8. Verify the sender domain in Cloudflare Email Service before live cutover.
