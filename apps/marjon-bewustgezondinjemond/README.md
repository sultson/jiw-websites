# Marjon Ooteman - Bewust Gezond in je Mond

Site van Marjon Ooteman, integraal mondhygiënist in Schagen.
Live op **bewustgezondinjemond.nl**. Verhuisd uit `jiw-concepts/marjon` op 12-10-2026.

```
pnpm --filter @jiw/marjon-bewustgezondinjemond dev     # localhost:3072
pnpm --filter @jiw/marjon-bewustgezondinjemond build
pnpm --filter @jiw/marjon-bewustgezondinjemond ship    # bouwt, controleert, deployt
```

## Hoe de pagina's werken

De site is één React-component (`src/App.tsx`) die zelf kijkt welk adres er in de
adresbalk staat. Op het conceptadres betekende dat: één `index.html` met een lege
`<div id="root">`, en Cloudflare die elk onbekend pad daarheen stuurde. Voor een
bezoeker werkte dat; voor een crawler of een taalmodel was de hele site nul woorden.

Nu bakt `scripts/prerender.mjs` elk adres als eigen bestand in `dist/`, met de hele
pagina al als HTML erin:

| adres | bestand |
| --- | --- |
| `/` | `index.html` |
| `/aanpak/<slug>` (5x) | `aanpak/<slug>/index.html` |
| `/privacy` | `privacy/index.html` |
| `/privacyverklaring` | `privacyverklaring/index.html` (canonical naar `/privacy`) |
| `/aanpak/<oude-slug>` (12x) | canonical naar de opvolger, niet in de sitemap |
| `/reviews-voorbeeld` | noindex, werkoverleg |
| 404 | `404.html`, echte 404 in plaats van de voorpagina met een 200 |

Het pad komt daarbij uit `PadContext` (`src/pad.tsx`) en niet uit `window`, zodat het
bakken en de browser op dezelfde waarde uitkomen. In de browser neemt React de
bestaande HTML over (`src/mount.tsx`); een klik binnen de site wisselt daarna gewoon
weer zonder herladen, en `src/kop.ts` zet de title en de canonical mee.

**Controleer na elke wijziging aan de routering of `pnpm build` nog 22 pagina's
bakt.** Zakt dat getal, dan is er een adres uit de lijst gevallen en staat er een
dode link of een 404 op een pagina die wel geïndexeerd is.

## Eén plek voor het adres

`site.config.mjs` draagt `SITE_URL`, haar gegevens en de lijst pagina's met hun
titel en omschrijving. Dat bestand wordt gelezen door `vite.config.ts`, de scripts,
de Worker én de componenten. Er staat nergens anders een domeinnaam; bij de
verhuizing uit het concept stonden die op zeven plekken en waren er twee vergeten.

De titel en omschrijving van de vijf pijlerpagina's komen uit `src/specmeta.ts`,
afgeleid van `SPECIALISATIES` in `src/specialisaties.tsx` - haar eigen woorden, dus
niet nog een keer overgeschreven.

## Het formulier

Het contactformulier post naar `/api/forms/contact` op `@jiw/cloudflare-forms`
(`worker/index.ts`). Het mailt naar `info@marjonooteman.nl` vanaf
`no-reply@notify.bewustgezondinjemond.nl`, en stuurt de afzender een bevestiging in
haar eigen opmaak (`worker/confirmation-email.ts`).

- Geen Turnstile. Het verborgen veld `bedrijf` doet het werk; een widget van
  Cloudflare op elke pagina zou langs de cookiemelding heen laden.
- Eén naamveld, dus `requireLastName: false`: de naam komt als `firstName` binnen.
- `LEAD_RECIPIENT` staat sinds 12-10-2026 op haar eigen mailbox
  (`info@marjonooteman.nl`). **Stuur geen testbericht meer tegen de live
  configuratie**; zet het eerst terug naar `hallo@jouwidealewebsite.nl`.

Het logo in die mail is `public/logo-email.png`, getekend door
`scripts/mail-logo.mjs` (een echte browser, met haar eigen Quicksand). Opnieuw
draaien alleen als het merk verandert; het bestand staat in git.

## Merk

`merk/` is het logo als vector: SVG, PDF voor de drukker en PNG's in een paar
maten. `pnpm merk` tekent ze opnieuw, `pnpm merk-meet` rekent na of het nog
hetzelfde merk is als `public/img/bloem.png`. Zie `merk/LEES-MIJ.md`.

De bloem is de Flower of Life en dus uit te rekenen in plaats van over te
trekken. Het aangeleverde bestand is een scan: de ring daarin is 1,3% ovaal en
de lijndikte loopt van 4,3 tot 7,0 px. Dat is in de vector rechtgezet.

Let op: de naam staat in `merk/` in Cormorant Garamond (zoals `.merknaam` op de
site) en in `public/logo-email.png` in Quicksand. Die twee spreken elkaar tegen;
welke wint is een vraag voor Marjon.

## SEO

`scripts/seo.mjs` schrijft `sitemap.xml` en `robots.txt` na de build - niet in
`public/`, want daar stond nog een sitemap met het conceptadres in.
`scripts/audit-seo.mjs` draait vóór elke deploy en laat `ship` vallen op een lege
pagina, een dubbele title, een canonical naar het oude domein, een te lange
omschrijving of een formulier dat naar een ander adres post dan de Worker bedient.

Zie `SEO.md` voor de stand bij livegang en wat er nog open staat.

## Wat nog niet van ons is

- De teksten gaan nog over een behandelpraktijk en over patiënten, terwijl Marjon
  sinds 10-10-2026 alleen online coaching doet. Dat is een eigen copyronde en raakt
  de hele site; bij de verhuizing is er niets aan veranderd.
