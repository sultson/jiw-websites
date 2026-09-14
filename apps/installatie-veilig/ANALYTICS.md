# Google Analytics

- Google login: `jouwidealewebsite@gmail.com`
- Analytics account: Default Account for Firebase (`401948362`)
- Property: InstallatieVeilig (`553462771`), Netherlands reporting time, EUR
- Web stream: InstallatieVeilig website (`15748471430`)
- Measurement ID: `G-MGZVJV1ELY`
- Website: https://installatieveilig.nl/
- Dashboard: https://analytics.google.com/analytics/web/?authuser=3#/a401948362p553462771/reports/intelligenthome

The centered consent dialog follows Winterswijkvakantiehuis. No Google tag is loaded until the visitor allows analytics. Declining is remembered; Escape on the initial prompt also declines. The footer's Privacy & cookies button reopens the dialog. Withdrawing consent removes GA cookies and reloads the page to unload Google's listeners.

Events: `page_view`, `contact_click` (phone, email, WhatsApp), `enquiry_click` (links to the enquiry section), and `generate_lead` only after a successful form response. No form values, uploaded files, arbitrary query parameters or full referrer paths are passed to Analytics. Enhanced measurement is disabled to avoid automatic collection of link URLs and form interactions. Advertising storage, ad user data and ad personalization are denied; Google signals are disabled in the tag configuration.

Consent is stored locally under `iv-analytics-consent-v1`. Localhost visits use GA debug mode.

Checks:

```sh
pnpm --filter @jiw/installatie-veilig lint
pnpm --filter @jiw/installatie-veilig build
node --experimental-strip-types apps/installatie-veilig/scripts/verify-analytics.ts
```

Deployed on 2026-09-09 to existing Cloudflare Worker `drukkeinstallatie`, version `9f22e46e-b5aa-4d0d-8036-22c95c9f3c68`.
