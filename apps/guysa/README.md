# GuySa Inboedels & Opruimingen

Inboedels opruimen, opkopen en schoonmaken in de regio Antwerpen.
Live op `https://guysa.jouwidealewebsite.nl`.

Verhuisd uit `jiw-concepts/guysa` op 01-11-2026. Daar ligt een `VERHUISD.md`
en geen `wrangler.toml` meer: die Worker heette ook `guysa` en zou bij een
deploy de oude, niet-voorgerenderde kopie terugzetten op hetzelfde adres.

Vite + React 19 + TypeScript + Tailwind v4, zoals de meeste apps hier, maar met
een prerenderstap. Dev-poort 3076, preview 4376.

## Opdrachten

```
pnpm dev            # ontwikkelen
pnpm build          # vite build + ssr-build + prerender + sitemap/robots
pnpm lint           # tsc voor de browser en voor de Worker apart
pnpm audit:seo      # de controle die `ship` tegenhoudt
pnpm ship           # build + audit + wrangler deploy
pnpm ship:dry-run   # hetzelfde, zonder te deployen
pnpm indexnow       # de sitemap aanmelden bij Bing/Yandex, na een deploy
```

Eenmalig of na het vervangen van bronmateriaal:

```
pnpm beeld          # raw/*.jpg -> public/img/*.webp, plus het deelplaatje
pnpm fonts          # de twee letterbestanden uit node_modules naar public/fonts
pnpm mail-logo      # public/logo-email.png voor de bevestigingsmail
```

Wrangler leest de root `.env` niet zelf: `set -a && source ../../.env && set +a`
vóór een deploy, anders faalt hij op `Failed to fetch auth token`.

## Hoe de pagina's ontstaan

Er zijn twee echte HTML-bestanden, `index.html` en `404.html`, elk met zijn
eigen `title`, `description`, `canonical` en schema.org. `%SITE_URL%` daarin
wordt bij het bouwen ingevuld uit `site.config.mjs`.

`pnpm build` doet vier dingen achter elkaar:

1. `vite build` — de gewone build, met de twee HTML-bestanden als ingang.
   Het stijlblad wordt daarbij in de pagina gezet (plugin in `vite.config.ts`).
2. `vite build --ssr src/entry-server.tsx` — dezelfde componenten, maar om op
   de server uit te tekenen.
3. `scripts/prerender.mjs` — vervangt `<div id="root"></div>` door de
   uitgetekende pagina. Hierna staat alles in de HTML en heeft een crawler geen
   JavaScript nodig. In de browser neemt React het over (`src/mount.tsx`).
4. `scripts/seo.mjs` — schrijft `sitemap.xml` en `robots.txt`.

Een nieuwe pagina meldt zich aan op één plek: `PAGINAS` in `site.config.mjs`.
Daar komen de vite-ingang, de prerender, de sitemap en de audit uit. Vergeet
niet hem ook in `entry-server.tsx` te zetten, anders breekt de build — met
opzet, want een stille overslag levert een lege pagina op die er in `dist` net
zo uitziet als een goede.

### Waarom `PadContext` en niet `window.location`

De balk en de voet springen naar ankers op de startpagina (`#diensten`). Op de
404 moet daar `/#diensten` staan. Dat na het laden bepalen kan niet meer nu de
pagina's als kant-en-klare HTML de deur uit gaan: in die HTML zou bij elke
pagina hetzelfde anker staan, en dat is precies wat een crawler leest. Het pad
komt daarom uit `src/pad.tsx`, zowel bij het bakken als in de browser.

## Het formulier

`/api/forms/aanvraag`, afgehandeld door `worker/index.ts` met
`@jiw/cloudflare-forms`. In het concept stond daar geen endpoint en bewaarde
het formulier de aanvraag in `localStorage`.

- Geen Turnstile. Een verborgen veld `bedrijf` vangt de bots; wat daarmee
  binnenkomt wordt zonder spoor weggegooid.
- Tot zes foto's, naar R2 (`jiw-form-uploads-prod`, prefix `guysa/`). De
  browser brengt ze eerst terug tot 1600 px (`lichter` in `src/Aanvraag.tsx`),
  want zes telefoonfoto's op een mobiele verbinding is een upload waar mensen
  halverwege mee stoppen.
- De melding aan ons gaat naar `hallo@jouwidealewebsite.nl`, de bevestiging aan
  de aanvrager vanaf `no-reply@notify.jouwidealewebsite.nl`.
- `scripts/audit-seo.mjs` controleert dat het adres waar het formulier op post
  hetzelfde is als het adres waar de Worker op luistert.

**Testen mag hier gewoon**: de ontvanger is onze eigen inbox. Dat verandert op
de dag dat `LEAD_RECIPIENT` in `wrangler.jsonc` een adres van GuySa wordt —
vanaf dan komt elke testaanvraag in hun mailbox terecht.

De bevestiging staat in `worker/confirmation-email.ts`: eigen kleuren
(het goud en het bijna-zwart van het logo, contrasten nagerekend), eigen tekst,
en het logo op een donkere tegel omdat het merk goud op doorzichtig is en op
een licht vlak wegvalt.

Een ding om te weten bij elke site hier: een **melding** die niet verstuurd kan
worden gooit een fout en de bezoeker ziet dat, maar een **bevestiging** die
faalt wordt alleen gelogd. `{"ok":true}` bewijst dus niet dat de kopie van de
aanvrager de deur uit is. `wrangler tail` en zoeken op `Confirmation email
failed` als je het zeker wilt weten.

## Beeld

De bronbestanden staan in `raw/` en zijn gegenereerd, dus nergens anders te
halen — niet weggooien. `public/img` is het resultaat van `pnpm beeld` en wordt
overschreven. Wie een foto vervangt draait dat script opnieuw; verwijst de bron
daarna nog naar een `.jpg`, dan stopt het script, en anders de prerender.

## Zie ook

`SEO.md` — de beginstand, wat er bewust niet in zit, en waarom de site nog één
pagina is.
