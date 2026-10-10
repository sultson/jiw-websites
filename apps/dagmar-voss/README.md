# Dagmar Voss — KOPP coaching Haarlem

Acht pagina's over KOPP-coaching (opgegroeid met een psychisch zieke of
verslaafde ouder) voor Dagmar Voss, praktijk aan de Grote Houtstraat in
Haarlem.

Overgekomen uit `claudius/playground/dagmarvoss` op 10-10-2026. Daar is hij
gebouwd in vijf rondes met Armando en Alfred; de merkgids die eronder ligt zit
als bron in `branding-kit/`.

## Geen Vite, geen React — en dat is het punt

Dit is de vierde uitzondering op de Vite-regel van de monorepo, naast
`yanis-klussenbedrijf`, `rh-klusservice` en `jasm-flowers`. `build.mjs` schrijft
acht complete HTML-pagina's naar `dist/`: 394 tot 1536 woorden tekst per
pagina, in de eerste byte, zonder hydratatie.

Er staat één script in elke pagina en dat is meelaag, geen inhoud — het menu,
de kopbalk die tot een eiland krimpt, de onderbalk die onder de hero omhoog
komt, en de kaart op `/contact/` die pas op een tik `mapbox-gl` ophaalt. Zet
javascript uit en er verdwijnt geen woord:

```
pagina          zonder js   met js    hoogte z/m
/               669         669       7737/7737
/wat-is-kopp/   442         442       4487/4487
/klachten/      373         373       4331/4331
/coaching/      391         391       4905/4988
/cursus/        433         433       4129/4129
/over-dagmar/   447         447       4549/4633
/boeken/        374         374       4591/4650
/contact/       268         268       3606/3606
```

Dat is `pnpm zonder-js`, met een echte Chromium en een Googlebot-UA. De
hoogteverschillen van een paar procent zijn de sectiescheidingen, die zich met
javascript aan in beeld tekenen; er staat geen tekst in.

## Bouwen en deployen

```bash
pnpm --filter @jiw/dagmar-voss build          # dist/ + de pre-render-poort
pnpm --filter @jiw/dagmar-voss dev            # wrangler dev op :3071
pnpm --filter @jiw/dagmar-voss ship:dry-run
pnpm --filter @jiw/dagmar-voss ship
```

Wrangler leest de root `.env` niet zelf, dus eerst exporteren:
`set -a && source .env && set +a` vanaf de repo-root.

`build.mjs` heeft **`MAPBOX_TOKEN`** nodig (staat in de root `.env`, naast
`CLOUDFLARE_API_TOKEN`) voor de statische kaart op `/contact/`. Het is een
publieke `pk.`-token en die hoort in de pagina — zo werkt Mapbox — maar niet in
de broncode, anders staat hij op twee plekken en loopt er een achter zodra hij
vervangen wordt. In het milieu meegeven kan ook: `MAPBOX_TOKEN=pk... pnpm build`.

## De poort in de build

`pnpm build` is `node build.mjs && node tools/prerender.mjs`. Die tweede zakt de
build als een pagina niet meer compleet in de HTML staat, en dat is bewust geen
los scriptje ernaast: een poort die je kunt overslaan is geen poort. Hij kijkt
naar acht dingen, zonder browser, dus het kost niks:

- doctype, `lang`, titel, een description van minstens 70 tekens
- minstens 250 woorden tekst in het bestand (een React-omhulsel haalt dat
  nooit — dat is een lege `<div id="root">`)
- precies één `h1`, en niet leeg
- geen `<script src=...>`, en maximaal één gedragsscript
- geen tekst in een element dat verborgen begint
- JSON-LD die parseert, met een `@type` per knoop
- canonical en `og:url` die naar deze pagina op dit adres wijzen
- elke interne link komt ergens aan; `robots.txt` en `sitemap.xml` dekken
  precies de acht pagina's

Nagemeten dat hij ook echt afgaat: een pagina vervangen door een JS-omhulsel
geeft vijf punten, een dode menulink plus een JSON-LD met een komma te veel
plus een verschoven sitemap geeft vier.

## De andere meetscripts

Allemaal tegen `dist/`, met een eigen serveertje op een vrije poort
(`tools/serve.mjs`). Ze leenden Playwright tot de verhuizing met een absoluut
pad uit `claudius/node_modules`; nu is het een devDependency van deze app.

| | |
|---|---|
| `pnpm zonder-js` | javascript uit naast javascript aan, per pagina |
| `pnpm contrast` | elke tekstregel tegen WCAG AA — haalt alle 8 pagina's |
| `pnpm draad` | geen draad-element wordt afgesneden, 8 pagina's x 8 breedtes (320 t/m 1920, met 360 erbij) |
| `pnpm perf` | schokken bij het scrollen op een 4x afgeknepen cpu: **0 van de 158 frames**, p95 16,7 ms. De oude regels er weer bovenop geplakt geeft 26-29 schokken — dat is wat `background-attachment: fixed`, een `mix-blend-mode`-korrel over de hele pagina en `backdrop-filter` op de balken kostten |
| `pnpm verifieer` | menu, onderbalk en kaart in een browser, met schermafdrukken |
| `pnpm shots` | schermafdrukken om naar te kijken |
| `pnpm live` | hetzelfde als `verifieer`, maar tegen de live site |

`shots/` staat in `.gitignore`: meetresultaat, elke run schrijft het opnieuw.

## Het adres

Staat op `dagmarvoss-concept.jouwidealewebsite.nl`, de worker heet
`dagmar-voss`. Dat adres is met de klant gedeeld en moet dus blijven
antwoorden; het hing tot 10-10-2026 aan de worker `dagmarvoss-concept` in
`claudius/playground` en is met de API-route uit de root CLAUDE.md overgezet
(die zone zit op precies 100 custom domains, dus eerst de oude vermelding
weghalen, dan de nieuwe erin — een `override_existing_origin` alleen wordt daar
met 100122 geweigerd).

**`dagmarvoss.nl` is nog van de klant zelf.** Daar staat op dit moment haar
eigen site live, met haar mail (Purelymail) op dezelfde zone. Omzetten is dus
geen bouwstap maar een knip die zij meemaakt. Als het zover is:

1. `SITE.origin` in `build.mjs` op `https://dagmarvoss.nl` (of
   `SITE_ORIGIN=... pnpm build`) — daar hangen alle canonicals, og:url's,
   sitemap-items en `@id`'s aan, dus dat is de hele tekstkant.
2. `dagmarvoss.nl` en `www.dagmarvoss.nl` als `custom_domain` in
   `wrangler.jsonc`, en op die zone een 301-regel van `www` naar de apex. Een
   canonical alleen laat twee hosts met een 200 naast elkaar staan.
3. Het concept-adres eraan laten hangen zolang de link rondgaat, of er een 301
   naar de apex op zetten.
4. De MX-, DKIM-, SPF- en DMARC-records van Purelymail op die zone niet
   aanraken — anders valt haar mail om terwijl de site goed gaat.

Zolang die knip niet gemaakt is, staat onze kopie indexeerbaar naast haar eigen
site op hetzelfde merk. Wil je dat liever niet, dan is dat één regel
`X-Robots-Tag: noindex` in de `_headers` die `build.mjs` schrijft.
