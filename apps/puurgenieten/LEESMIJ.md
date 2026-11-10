# Puur Genieten — puurgenieten.tv

De landingspagina van het programma Puur Genieten (SBS 6), losgekoppeld van
framemedia.tv op 10-11-2026 (Armando) en dezelfde dag hierheen verhuisd uit
`claudius/playground/puurgenieten` (Alfred). Een pagina in drie talen: `/`, `/en/`,
`/de/`, plus een 404.

Live: https://puurgenieten.tv (apex canoniek). `www.puurgenieten.tv`, `http://` en het
oude conceptadres `puurgenieten-concept.jouwconcept.app` geven een 301 naar de apex,
pad en query intact — dat doet de worker (`ANDERE_HOSTS`), daarom `run_worker_first:
true` in `wrangler.jsonc`.

## Bouwen en uitrollen

```bash
pnpm --filter @jiw/puurgenieten build     # gen-beeld + bouw --prod + vooraf
pnpm --filter @jiw/puurgenieten ship      # build + wrangler deploy (root .env exporteren)
pnpm --filter @jiw/puurgenieten indexnow  # na een uitrol: adressen melden bij Bing/IndexNow
pnpm --filter @jiw/puurgenieten mail      # bevestigingsmail renderen naar dist-preview/
pnpm --filter @jiw/puurgenieten live      # ECHTE aanmelding op de live site (zie onder)
```

Statische html uit `bouw.mjs` (overgenomen van `apps/framemedia`), geen Vite, geen
hydratie: elke pagina staat compleet in de html. `tools/vooraf.mjs` laat de bouw
zakken als dat niet zo is, of als canonical, hreflang (wederkerig), og-tags, lang per
map, JSON-LD, sitemap, robots of het formulier niet klopt. Zie SEO.md.

`tools/gen-beeld.mjs` maakt uit `bron/puur-genieten-logo-2048.png` het maillogo
(`assets/mail/puurgenieten-email.png`) en de deelplaat (`assets/og/puurgenieten-og.png`).

## Formulier

Een endpoint, `/api/forms/puurgenieten`, via `@jiw/cloudflare-forms` (`worker/form.ts`).

- Melding naar `LEAD_RECIPIENT` = **hallo@jouwidealewebsite.nl** (ons postvak, Alfred
  10-11-2026). Afzender `no-reply@notify.puurgenieten.tv`. De Email Service-records
  staan op de zone onder `cf-bounce.notify.*` en `_dmarc.notify.*`, niet onder
  `notify.puurgenieten.tv` zelf.
- Bevestiging aan de aanmelder in het merk van Puur Genieten, in de taal van de pagina
  (`worker/confirmation.ts`). Tekst gelijk aan de PG-bevestiging op framemedia.tv.
  Contrasten (pnpm mail): wit op band 18,9, oranje op band 7,5, knop 6,1, tekst 12,8,
  grijs 5,1-8,1. `includeMessage: false`: het formulier heeft geen tekstvak.
- Turnstile aan (widget "Puur Genieten formulieren", secret `TURNSTILE_SECRET_KEY`) plus
  lokvink `website`. Framemedia kreeg zonder Turnstile dagelijks spam.
- Op de apex staan de Purelymail-records van info@puurgenieten.tv (MX, SPF, DKIM, DMARC).
  Niet aankomen.

**Testen:** `tools/live.mjs` vult het echte formulier in met `jouwidealewebsite@gmail.com`
als aanmelder, en weigert zodra `LEAD_RECIPIENT` geen postvak van ons meer is. Hij opent
een zichtbare Chromium: headless krijgt van Turnstile geen token (op framemedia.tv
precies zo gemeten). Proeven van 10-11-2026: nl en en, allebei 200 + bedankkaart.

## Open

- **framemedia.tv/puurgenieten/ (+ /en/, /de/) staat er nog**, met dezelfde inhoud. Twee
  kopieen concurreren in Google. De oplossing is een 301 vanaf framemedia naar hier, maar
  dat formulier gaat naar info@framemedia.tv en dit naar ons postvak — dus dat is een
  besluit voor Armando/Alfred, niet iets voor een bouwstap.
- Search Console: property puurgenieten.tv aanmaken (DNS-TXT op de zone) en de sitemap
  indienen. Google heeft geen ping meer; IndexNow dekt alleen Bing c.s.
- LEAD_RECIPIENT naar info@puurgenieten.tv of info@framemedia.tv zodra de klant dat wil.
- De oude playground-worker `puurgenieten-concept` en D1-database `puurgenieten` bestaan
  nog maar dragen niets meer. Niet opnieuw uitrollen: zie `VERHUISD.md` daar.

## Geschiedenis (concept, 10-11-2026)

- Woordmerk linksboven (letters uit het rondje, `tools/maak-woordmerk.py`), rondje in de voet.
- Zwevend WhatsApp/bel-paar 1:1 Winterswijk, bellen in het rood van de site.
- `tools/los-van-framemedia.mjs` en `tools/talen-los.mjs`: eenmalig, bewaard als verslag.
