# Google Analytics setup

Configured on 14 September 2026 in the existing Analytics account:

- Property: **Klashorst Museum**, ID `553995719` (account `401948362`).
- Web stream: **Klashorst Museum website**, ID `15774587449`.
- URL: `https://klashorstmuseum.nl`.
- Measurement ID: `G-52NBFYWENV`, stored as the default in `src/analytics.ts`; `VITE_GA_MEASUREMENT_ID` can override it at build time.
- Reporting: Netherlands time zone, EUR, web traffic objective.
- Enhanced Measurement: off. The app explicitly sends initial and client-side route page views; enabling automatic history measurement would double-count them.
- Google Signals and user-provided data collection: off.
- Granular location/device collection: off.
- Ads personalization: disallowed in all 307 regions.
- Event and user data retention: 2 months; reset on new activity off. Standard aggregated reports are not limited by this setting.
- Existing account settings for other properties were not changed.

Deployed through the existing `klashorst` Cloudflare Worker. No browser credentials or API secrets are needed in the website.

The tag loads only after consent, only on `klashorstmuseum.nl`, and never for preview sessions. Consent lasts 180 days. The footer reopens preferences. Withdrawal expires GA cookies and reloads to unload the tag. Query strings, URL fragments and form contents are not explicitly sent; referrers are reduced to their origin. No custom contact or form events are collected.

Live verification on 14 September 2026:

- No Google tag before consent or after refusal.
- Acceptance loads `G-52NBFYWENV`.
- Realtime confirmed one visitor and exactly two page views: museum home and the blog reached through client-side navigation, each with its correct page title.
- Withdrawal reloads the page without the Google tag.
- Dutch and English preference controls verified.
- Both About photographs open in the shared viewer; zoom and switching/reset verified against the live CMS images.
- Deployment version: `910ea2a9-1259-4804-8dc8-774de23a4db2`.

Checks:

```sh
pnpm --filter @jiw/klashorst lint
pnpm --filter @jiw/klashorst exec tsx scripts/verify-analytics.ts
pnpm --filter @jiw/klashorst build
```

Google documentation:
- https://developers.google.com/tag-platform/security/concepts/consent-mode
- https://developers.google.com/analytics/devguides/collection/ga4/views
