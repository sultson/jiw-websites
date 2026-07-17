# RN Schilders — visitor-behaviour tracking setup

Goal: understand why `/buitenschilderwerk-aanvraag` (the Google Ads lander) converts poorly, and get proper behaviour data for the whole site, without disturbing the Google Ads conversion tracking that is already live and feeding the campaign.

## 1. Tool choice: GA4 + Microsoft Clarity. Yes.

Your instinct is right. For a lead-gen lander fed by Google Ads, this pair covers both halves of the question:

| Question | Tool |
|---|---|
| **Where** do people drop? (funnel: land → interact with form → step 2 → submit; traffic quality per campaign/keyword; mobile vs desktop; bounce) | **GA4** |
| **Why** do they drop? (watch real sessions: do they scroll past the form, rage-click chips, stall on the phone field, abandon after a validation error) | **Clarity** |

Why not something else:

- **Hotjar**: same category as Clarity but the free tier is capped (daily session limits, short retention) and the script is heavier. Clarity is free, unlimited recordings, and lighter. No reason to pay.
- **Plausible / Fathom / Simple Analytics**: privacy-friendly pageview counters. No session recordings, no heatmaps, weak/no Google Ads linkage. They answer "how many", not "why". Wrong tool for a conversion problem.
- **PostHog**: excellent, but built for product analytics (feature flags, cohorts, SQL). Overkill for a static lead page; recording quotas kick in fast.
- **GTM (Tag Manager)**: deliberately **not** recommended here. The site already runs a hand-placed gtag with three Ads conversion actions and enhanced conversions. Migrating that into GTM is exactly the kind of "config bites the campaign" risk you want to avoid, and GTM's value (marketers editing tags without deploys) doesn't apply — every change here goes through code anyway.

The real lever is not the tools, it is **event design**: both form steps live on the same URL, so without custom events GA4 sees one `page_view` and nothing else. Section 4 fixes that.

## 2. What is already live (do not break)

Inventory as of 2026-07-12, so future edits know what they are touching:

- `index.html:6-23` — gtag.js loader for **Google Ads ID `AW-18294027643`**, with Consent Mode v2 defaults (everything `granted`, no consent banner) and `allow_enhanced_conversions: true`. `index.html` is the SSG template: this `<head>` is prerendered into **every** route in `dist/`, so a change here ships site-wide on the next build.
- `src/App.tsx:46-49` — three Ads conversion actions:
  - **form lead** `tW9DCLfUrskcEPvqopNE` — fires on `/aanvraag-ontvangen` page load via `GoogleAdsPageLoadConversion` (App.tsx:168), deduped with the `sentPageLoadConversions` set.
  - **call click** `TNi-COeH3ckcEPvqopNE` and **WhatsApp click** `hB0lCOqH3ckcEPvqopNE` — fired from `onClick` handlers via `trackGoogleAdsConversion` (App.tsx:94).
- **Enhanced conversions** (App.tsx:131-166): lead's email/phone stashed in `sessionStorage` on submit, SHA-256-hashed and `gtag('set', 'user_data', …)` on the thank-you page, *before* the conversion event. Order matters — don't insert anything between `applyEnhancedConversionUserData()` and `trackGoogleAdsConversion()`.
- **gclid capture**: stored under `rn_schilders_gclid` and posted with the lead form, so every lead email already carries its click ID.
- Navigation is **full page loads** (prerendered MPA, no pushState). This makes GA4 and Clarity trivial: no SPA pageview plumbing needed.
- No CSP headers anywhere (`public/_headers` is cache-control only) — nothing blocks adding a Clarity script.
- The lander renders the lead form **three times**: `lead-form` (hero), `lead-form-na-zo-werkt-het`, `lead-form-onderaan` (App.tsx:1978, 2369, 2026). Events must carry which instance was used.

### Ground rules so the campaign doesn't get bitten

1. **One gtag loader.** GA4 rides on the existing `gtag/js?id=AW-…` script via an extra `config` line. Never add a second `gtag/js` script tag or a GTM container next to it.
2. **The consent block stays first.** `gtag('consent', 'default', …)` must run before any `config`. Append after it, never above or between.
3. **Ads conversions stay the source of truth for bidding.** After linking GA4 to Google Ads, do **not** import GA4 key events into Ads as Primary conversions — that double-counts against the existing `AW-18294027643` actions and corrupts Smart Bidding. If you import at all, set them to *Secondary* (observation only).
4. **Don't rename or reuse the `conversion` event.** GA4 custom events below get their own names; the Ads `send_to` calls stay untouched.
5. **Clarity is standalone.** It uses its own `window.clarity` global and no dataLayer — zero interaction with gtag. Just don't wrap it in anything that delays the gtag loader.

## 3. GA4 setup

### 3.1 Create the property

1. In Google Analytics (same Google account that owns the Ads account, or one with admin access): **Admin → Create property** — "RN Schilders", country Netherlands, currency EUR, timezone Amsterdam.
2. Create a **Web data stream** for `https://rnschilders.nl` → copy the **Measurement ID** (`G-XXXXXXXXXX`).
3. In the stream's **Enhanced measurement**, keep defaults on (page views, scrolls, outbound clicks). The built-in *scrolls* event fires at 90% depth — a first free signal for "do they even reach the bottom form".

### 3.2 Add GA4 to the existing tag (`index.html`)

One line, inside the existing second script block, after the AW config:

```html
<script>
  gtag('js', new Date());
  gtag('config', 'AW-18294027643', { 'allow_enhanced_conversions': true });
  gtag('config', 'G-KCQ46JJ7WH');   /* <- add this line only */
</script>
```

That's the entire GA4 install. Same loader, same consent state, no new request on the critical path. Rebuild propagates it to all prerendered routes.

### 3.3 Link to Google Ads

1. GA4 **Admin → Product links → Google Ads links** → link the Ads account.
2. In the link settings leave *Personalized advertising* on (consent defaults already grant it).
3. In **Google Ads → Tools → Conversions**: change nothing. Existing AW actions remain Primary. (Rule 3 above.)
4. Verify auto-tagging is on in Ads (it is — the site receives gclids). With the link in place, GA4 attributes sessions to campaign/ad group/keyword automatically; no UTMs needed on Ads final URLs. Use UTMs only for non-Google traffic (e.g. `?utm_source=facebook`).

### 3.4 Funnel events in `App.tsx`

Add a small helper next to `trackGoogleAdsConversion` (App.tsx:94):

```ts
function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
```

Then instrument `CampaignLeadForm` (App.tsx:2067). Every event carries `form_location: formId` so the three instances are distinguishable:

| Event | Where to fire | Params |
|---|---|---|
| `lead_form_start` | first chip toggled OR first field focus, once per form instance (a `useRef<boolean>` guard) | `form_location` |
| `lead_form_step1_complete` | in `handleStep1Next` after validation passes (App.tsx:2100, just before `changeStep(2)`) | `form_location`, `scopes: scopes.join(', ')` |
| `lead_form_step1_error` | in `handleStep1Next` when no chip selected | `form_location` |
| `lead_form_step2_error` | in `submitCampaignForm` where `validationErrors` is non-empty (App.tsx:2142) | `form_location`, `fields: Object.keys(validationErrors).join(', ')` |
| `lead_form_submit_error` | in the `catch` block (App.tsx:2176) — API/network failures are invisible today | `form_location`, `message` |
| `call_click` | inside `trackGoogleAdsConversion` callers is messy — instead add one line next to each existing `onClick={() => trackGoogleAdsConversion(googleAdsCallConversionSendTo)}` or extend the helper (below) | `link_location` if cheap to pass |
| `whatsapp_click` | same, next to the WhatsApp conversion calls | |

Least-invasive way to get `call_click`/`whatsapp_click` without touching ~10 call sites — extend `trackGoogleAdsConversion` itself:

```ts
function trackGoogleAdsConversion(sendTo: string) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', 'conversion', { send_to: sendTo, value: 1.0, currency: 'EUR' });
  const mirror =
    sendTo === googleAdsCallConversionSendTo ? 'call_click'
    : sendTo === googleAdsWhatsappConversionSendTo ? 'whatsapp_click'
    : null;
  if (mirror) window.gtag('event', mirror, {});
}
```

(The `send_to`-scoped conversion event does not show up in GA4 reports; the mirror event does.)

**The lead itself needs no code.** The thank-you page `/aanvraag-ontvangen` is a real navigation, so GA4 records its `page_view`. In GA4: **Admin → Events → Create event**: name `generate_lead`, condition `event_name equals page_view` AND `page_location contains /aanvraag-ontvangen`. Then mark `generate_lead` as a **key event**. Zero code, immune to the redirect race (a gtag event fired right before `window.location.href = …` can be dropped; the page-load approach can't be).

Also mark nothing else as a key event for now — call/WhatsApp clicks are useful engagement metrics, but as key events they'd muddy the conversion-rate read.

### 3.5 GA4 housekeeping

- **Admin → Data settings → Data retention** → set event data retention to **14 months** (default is 2).
- **Internal traffic filter**: Admin → Data streams → stream → Configure tag settings → Define internal traffic → add your own/office IPs; then Admin → Data filters → activate the internal filter. Otherwise your own lander QA sessions pollute a low-traffic dataset.
- Register `form_location` as a **custom dimension** (Admin → Custom definitions → event scope) so it's usable in reports.

## 4. Microsoft Clarity setup

### 4.1 Create the project

1. clarity.microsoft.com → sign in (Microsoft/Google account) → **New project** — "RN Schilders", `https://rnschilders.nl`.
2. Copy the tracking snippet with your project ID.

### 4.2 Install (`index.html`)

Place after the gtag blocks, still in `<head>` (Clarity's own script injects `async`, it won't block rendering):

```html
<!-- Microsoft Clarity -->
<script>
  (function(c,l,a,r,i,t,y){
    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "xlin4iqzro");
</script>
```

Use the snippet Clarity gives you verbatim (format is stable, project ID differs). Same file = ships to every prerendered route.

### 4.3 Configure the project

- **Masking (do first)**: Settings → Masking → keep **Balanced** (all input *content* masked by default — the lead form's name/phone/email never appear in recordings). Do not add `data-clarity-unmask` to anything in the form. This is the AVG-relevant bit.
- **IP blocking**: Settings → IP blocking → add the same internal IPs as in GA4.
- **Google Analytics integration**: Settings → Setup → connect the GA4 property. This pushes a `clarity_playback_url` into GA4 sessions — you can jump from a GA4 drop-off segment straight to the matching recordings.
- **Smart events**: Clarity auto-detects things like form submits; additionally the GA4 custom events from §3.4 arrive in Clarity automatically (Clarity ingests gtag events), so you can filter recordings by `lead_form_step1_complete` etc. without extra work.

### 4.4 How to actually use it for the lander

Build a saved **segment**: `Page URL contains /buitenschilderwerk-aanvraag`, split mobile vs desktop. Then work through, in order:

1. **Scroll heatmap** (mobile first — Ads traffic is mostly mobile): what % ever sees the hero form's step-2? The bottom form? If 60% never scroll past the hero, the page below the fold is irrelevant to the conversion problem.
2. **Click heatmap**: are chips getting clicked? Dead clicks on non-interactive elements (people trying to tap the progress bar, photos)? Rage clicks on "Verder"?
3. **Recordings filtered by** `lead_form_step1_complete` **without** `generate_lead`: these are the people who chose scopes and then bailed on name/phone. Watch 15–20. This exact cohort is where "conversion sucks" lives — common findings: phone-field keyboard friction, hesitation at giving a phone number, validation error confusion, Turnstile stalls.
4. **Recordings with** `lead_form_submit_error`: silent API/Turnstile failures you currently can't see at all.

## 5. Verification checklist (before trusting any data)

1. `pnpm --filter @jiw/rn-schilders build`, then check `dist/buitenschilderwerk-aanvraag/index.html` contains the `G-` config line and the Clarity snippet.
2. Deploy (`set -a && source .env && set +a && pnpm --filter @jiw/rn-schilders ship`).
3. **Google Tag Assistant** (tagassistant.google.com) on the live lander: one gtag loader, both `AW-18294027643` and `G-…` configs present, consent state granted.
4. **GA4 DebugView** (visit the lander with the Google Analytics Debugger extension, or `?debug_mode=1` via gtag config in a test): walk the funnel — chips → `lead_form_start`, `lead_form_step1_complete` → submit a test lead → `page_view` on `/aanvraag-ontvangen` → derived `generate_lead`.
5. **Critical — the campaign's existing tracking**: submit the test lead and confirm in Google Ads → Conversions that the form action still records (status "Recording conversions", may lag a few hours), and that enhanced-conversion status stays green. Also click test the call/WhatsApp buttons.
6. **Clarity**: dashboard shows the live session within ~10 minutes; open the recording and confirm form field contents are masked.
7. Quick perf sanity: Lighthouse on the lander before/after — both scripts are async so LCP should be unchanged; if it moved, check nothing landed above the preload of the hero image.

## 6. Compliance note (flagging, not blocking)

Current state: no cookie banner, Consent Mode defaults everything to `granted`, and Clarity will now record sessions. Under AVG/ePrivacy, analytics cookies and session recording in NL formally require prior consent. Mitigations already in place after this setup: Clarity input masking on, enhanced-conversion data hashed. If RN Schilders wants to be tighter later, the clean path is a minimal consent banner that flips the existing Consent Mode defaults to `denied` until accepted (GA4 then models conversions) and gates Clarity behind `clarity('consent')` — but that is a business decision with a real measurement cost; not part of this setup.

## 7. Order of work

1. GA4 property + one config line in `index.html` (§3.1–3.2) — data starts flowing same day.
2. Clarity project + snippet + masking check (§4.1–4.3) — recordings start immediately.
3. Ads link + `generate_lead` derived key event + retention/internal-traffic settings (§3.3, 3.5).
4. Funnel events in `App.tsx` (§3.4) — the only real code change; ship separately so a regression is easy to bisect.
5. Verification pass (§5).
6. Let it run ~1–2 weeks of ad spend, then do the §4.4 analysis loop before changing anything on the page. Change one thing at a time afterwards; with lander-level traffic volumes, multi-variable changes are unreadable.
