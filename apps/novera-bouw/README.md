# Novera Bouw

Live: **https://noverabouw.nl** — `www.` stuurt met een 301 door naar het adres zonder www
(redirect rule op de zone, niet in de worker). Het oude conceptadres
`novera-bouw-concept.jouwidealewebsite.nl` 301't hier ook per pad naartoe; die worker staat nog
in `jiw-concepts/novera-bouw/`.

Op 03-10-2026 overgezet uit `jiw-concepts/`. Geen Vite, geen React: dertig statische pagina's die
`bouw.mjs` uit `pagina/` en `src/` schrijft, uitgeleverd als Cloudflare Static Assets. Dat is hier
geen afwijking om de afwijking: elke pagina staat volledig in de HTML, dus een crawler hoeft niets
uit te voeren om hem te lezen. Zie [SEO.md](SEO.md) voor de nulmeting.

Dertig pagina's: vijftien in het Nederlands op `/` en dezelfde vijftien in het Engels onder
`/en`. Let op de Engelse startpagina: die is `/en` en niet `/en/`. Cloudflare laat de slash op
het eind vallen, dus `/en/` is een omleiding — schrijf je dat ergens als adres, dan wijst een
canonical of een sitemapregel naar een omleiding. Zie [SEO.md](SEO.md).

| Nederlands           | Engels                      |
| -------------------- | --------------------------- |
| `/`                  | `/en`                       |
| `/badkamer`          | `/en/bathroom`              |
| `/werkzaamheden`     | `/en/services`              |
| `/cv-ketel`          | `/en/boiler`                |
| `/materialen`        | `/en/materials`             |
| `/aanbod`            | `/en/products`              |
| `/werkwijze`         | `/en/how-we-work`           |
| `/contact`           | `/en/contact`               |
| `/toilet`            | `/en/toilet`                |
| `/tegelwerk`         | `/en/tiling`                |
| `/stucwerk`          | `/en/plastering`            |
| `/schilderwerk`      | `/en/painting`              |
| `/laminaat`          | `/en/flooring`              |
| `/traprenovatie`     | `/en/stairs`                |
| `/vloerverwarming`   | `/en/underfloor-heating`    |

Draai alles vanaf de root van de monorepo, want wrangler heeft `CLOUDFLARE_API_TOKEN` uit de
root-`.env` nodig (`set -a && source .env && set +a`).

```bash
pnpm --filter @jiw/novera-bouw build          # pagina/ + src/  ->  dist/
pnpm --filter @jiw/novera-bouw lint           # tsc over worker/
pnpm --filter @jiw/novera-bouw dev            # bouwt en start wrangler dev op :3068
pnpm --filter @jiw/novera-bouw ship:dry-run   # bindings en routes nalopen
pnpm --filter @jiw/novera-bouw ship           # bouwt en rolt uit
pnpm --filter @jiw/novera-bouw kijk           # meten in een echte browser, tegen dist/
pnpm --filter @jiw/novera-bouw indexnow       # de adressen aanmelden bij Bing c.s.
node _ref/kijk.mjs https://noverabouw.nl      # hetzelfde tegen het live adres
node _ref/maak-beeld.mjs [naam]               # ons eigen beeld (opnieuw) genereren
node _ref/maak-mailbeeld.mjs                  # het logo voor de bevestigingsmail
node _ref/maak-handtekening-logo.mjs          # het logo voor Ekrems mailhandtekening
node _ref/eigen.mjs                           # de foto's die Ekrem zelf stuurde -> src/img/
```

**Bewerk `pagina/` en `src/`, nooit iets in `dist/`.** Die map wordt bij elke build weggegooid en
opnieuw geschreven. `src/` is wél bron: `styles.css`, `app.js`, `404.html`, `favicon.svg` en `img/`
gaan ongewijzigd mee naar `dist/`.

`src/handtekening.html` is net zo'n handgeschreven bestand buiten `bouw.mjs`: een hulppagina op
`/handtekening` waar Ekrem zijn mailhandtekening kopieert. Geen pagina van de site — niet in het
menu, niet in de sitemap, `noindex`. Het logo erin wijst naar `/img/handtekening-logo.png`
(ingebakken witte achtergrond, uit `_ref/maak-handtekening-logo.mjs`), want een ingebakken
`data:`-beeld verdwijnt bij de ontvanger of komt als bijlage mee.

`src/404.html` is handwerk en staat buiten `bouw.mjs`: hij heeft geen tegenhanger in de andere taal
en hoort niet in de sitemap. Cloudflare levert hem uit mét status 404
(`not_found_handling: "404-page"`), want een onbekend pad dat de startpagina met status 200
teruggeeft leest Google als een soft 404.

## Twee talen

Eén schil (`pagina/_schil.html`) voor beide talen. Alles wat in die schil staat en niet uit een
pagina komt — skiplink, menulabels, voetkoppen, voetlinks, de knoptekst, het actielint, het
JSON-LD — staat in de tabel `SCHIL` in `bouw.mjs`.

`PAAR` in `bouw.mjs` koppelt elke Nederlandse pagina aan zijn Engelse tegenhanger. Daar komen
`hreflang` (nl, en, x-default=nl), de taalknop in de kopbalk en de `xhtml:link`-regels in de
sitemap uit. Ontbreekt een tegenhanger, dan stopt de build — een losse hreflang is erger dan geen.

## Wat er bij de overzetting veranderd is

Vier dingen die in `jiw-concepts` konden en in `jiw-websites` niet meer, allemaal omdat ze inhoud
achter JavaScript zetten (zie `CLAUDE.md`, "Never gate content visibility on JS"):

- **Contactgegevens staan nu in de HTML.** Het telefoonnummer, de WhatsApp-knoppen en de
  contactkaarten werden door `app.js` op de pagina gezet. Daarmee stond het nummer nergens in de
  HTML, en dat is precies wat een zoekmachine van een plaatselijk bouwbedrijf wil lezen. `bouw.mjs`
  schrijft ze nu in (`contactInvullen`), en valt om als er één leeg blijft.
- **`.reveal` is geen observer meer.** De halve pagina stond op `opacity: 0` te wachten op een
  `IntersectionObserver`. Die is eruit; de klasse bestaat nog en doet niets.
- **Vijf vaste pagina's per taal hadden geen `h1`.** Hun inleidende kop stond er als `h2`. Die is
  nu een `h1` met `class="kop--sec"`, wat hem op zijn oude formaat houdt.
- **Het formulier verstuurt echt iets.** Er stond een leeg Formspark-adres in `app.js`, dus een
  aanvraag kwam nergens aan. Zie hieronder.

## Het formulier

`worker/index.ts` draait op `@jiw/cloudflare-forms`, één worker per taal
(`/api/forms/offerte` en `/api/forms/en/quote`). Aanvragen gaan naar `info@noverabouw.nl` —
Ekrem zelf, op het eigen domein — en worden verstuurd vanaf `offers@notify.noverabouw.nl`.

Dat adres staat op drie plekken en die moeten gelijk blijven: `LEAD_RECIPIENT` in
`wrangler.jsonc`, de reply-to op de bevestiging (die zet het pakket zelf uit `LEAD_RECIPIENT`),
en `MAIL` in `worker/confirmation-email.ts`, waar het als klikbaar contactadres in de
bevestiging staat. Wijzig je het op één plek, dan drukt de mail een ander adres af dan waar een
antwoord heen gaat.

De aanvrager krijgt een bevestiging in het merk van Novera
(`worker/confirmation-email.ts`, kleuren uit `_ref/branding-kit/guidelines/palette.json`). Het
logo daarin is een PNG en geen SVG, want Outlook op Windows toont geen SVG; maken met
`node _ref/maak-mailbeeld.mjs`. De regel `contactPrompt` loopt bewust open af ("… of mail naar"):
het pakket zet `brand.contactEmail` erachter. Haal je dat adres weg, maak er dan weer een hele
zin van.

Twee dingen om te weten als je eraan komt:

- **Geen Turnstile.** In plaats daarvan het lokveld `bedrijf`, buiten beeld. Vult iets dat in, dan
  neemt de worker de aanvraag stil aan en doet er niets mee.
- **De tien vinkjes bij "Waar gaat het om" heten allemaal `werk`.** `parseFields` in het pakket
  leest per naam één waarde, dus `app.js` voegt ze client-side samen tot één regel. Hetzelfde geldt
  voor `materiaal_item`. Haal je dat weg, dan verdwijnen negen van de tien vinkjes zonder melding.

`_ref/kijk.mjs` onderschept het verzoek en meet precies dat: welke velden verplicht zijn, wat er
de deur uit gaat en of `werk` samengevoegd is.
