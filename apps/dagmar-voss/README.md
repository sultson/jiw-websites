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

## De sitemap

`lastmod` is de dag waarop de pagina veranderde, niet de dag waarop we bouwden.
Dat stond fout tot 10-10-2026: elke build zette de bouwdatum op alle acht, dus
de sitemap riep elke keer "alle acht zijn vernieuwd" terwijl er een komma in
één pagina was gewijzigd. Een crawler die dat een paar keer naloopt gaat
lastmod van deze site negeren, en dan is het signaal weg op het moment dat er
écht iets verandert.

`build.mjs` hasht daarom de html van elke pagina en houdt in
**`sitemap-datums.json`** (staat in git, naast `dist/` want het is bron en geen
uitvoer) bij welke hash bij welke datum hoorde. De datum verzet alleen als de
hash wijzigt. De Mapbox-sleutel gaat vóór het hashen uit de html — die rouleert
en zegt niets over de inhoud van `/contact/`. De build meldt op hoeveel
pagina's lastmod verzet is; bij een herbouw zonder wijziging is dat 0.

Nagemeten in beide richtingen: alle acht datums teruggezet naar 2026-09-01 en
opnieuw gebouwd houdt ze op 2026-09-01 (0 verzet), en één hash vervalsen verzet
precies die ene pagina.

`changefreq` en `priority` staan er niet meer in. Google gebruikt ze niet — dat
zegt het zelf — en `priority` was hier bovendien verzonnen: `/coaching/` en
`/contact/` stonden beide op 0.8 omdat ze niet de startpagina zijn, niet omdat
iemand ze had afgewogen.

## De drie adressen

De worker heet `dagmar-voss` en draait op drie hosts. `worker.mjs` doet de
hostlogica, `wrangler.jsonc` de routes:

| host | wat het doet |
|---|---|
| `dagmarvoss.nl` | de site |
| `www.dagmarvoss.nl` | 301 naar de apex, pad en zoekreeks mee |
| `dagmarvoss-concept.jouwidealewebsite.nl` | de site, maar met `X-Robots-Tag: noindex` |

Waarom www een 301 krijgt in plaats van dezelfde site: twee hosts met een 200
op dezelfde inhoud is voor een zoekmachine twee sites. De canonical is een
advies, een 301 is een feit. `http` gaat hier ook naar `https` — Always Use
HTTPS staat niet vanzelf aan op een nieuwe zone en het wrangler-token mag
zone-instellingen alleen lezen (zie de root CLAUDE.md, cdlf liep daar op
10-10-2026 tegenaan met een gewone 200 op http).

Het conceptadres is met de klant gedeeld en blijft dus antwoorden, maar
`noindex` — anders staan er twee indexeerbare kopieën van dezelfde acht
pagina's en is die van ons de kopie zonder autoriteit. Een 301 zou netter zijn
en staat klaar als `CONCEPT_OMLEIDEN` in `worker.mjs`; die kan pas aan als de
nameservers om zijn (zie hieronder), want tot dan maakt een 301 onze site
onbereikbaar, ook voor wie hem komt nakijken.

**Dit werkt alleen met `run_worker_first: true`.** Workers assets levert een
bestand dat in `dist/` staat zelf uit en draait de worker dan niet — die is
standaard alleen de terugval voor wat er niet ligt. Zonder die vlag gaat de
omleiding van www nooit af en geven www en het conceptadres allebei een gewone
200 met de hele site erop: precies de twee kopieën die dit moet voorkomen.
Let op bij het testen: **`wrangler dev` emuleert `run_worker_first` niet** (4.85
gemeten) — lokaal levert assets alles uit, de worker komt er niet aan te pas en
`--local-protocol=https` verandert daar niets aan. Meet het dus na op de live
site, met `curl`:

```bash
curl -s -o /dev/null -w "%{http_code} [%header{x-robots-tag}]\n" \
  https://dagmarvoss-concept.jouwidealewebsite.nl/        # 200 [noindex, nofollow]
```

Die ene meting bewijst dat de worker vóór assets draait.

## De knip naar dagmarvoss.nl is nog niet gemaakt

`dagmarvoss.nl` en `www.dagmarvoss.nl` hangen als custom domain aan deze worker
(10-10-2026) en de build schrijft alle canonicals, og:url's, sitemap-items en
`@id`'s al naar het kale adres. **Toch serveren ze nog niet van ons**, en dat
heeft één oorzaak:

> De nameservers van `dagmarvoss.nl` staan bij Antagonist
> (`webhostingserver.g1-dns.one` / `.com`). De zone staat in ons Cloudflare op
> **`pending`** — Cloudflare is niet gezaghebbend, dus onze routes worden niet
> gevraagd. Op de apex staat nu haar eigen site (Carrd) en www 301't daar al
> naar de apex.

Zolang dat zo is, is het conceptadres het enige dat onze site uitlevert, en
staan de canonicals naar een adres dat nog van haar is. Dat is bewust: het
houdt onze kopie uit de index en zet het doel alvast goed.

**Wat er moet gebeuren, en door wie:** bij de registrar (Antagonist, haar
account) de nameservers omzetten naar `dean.ns.cloudflare.com` en
`lindsey.ns.cloudflare.com`. Dat is geen bouwstap maar een knip die zij
meemaakt: op dat moment is onze zone gezaghebbend, verdwijnt haar Carrd-site
van het adres en komt deze site ervoor.

Haar mail breekt daar niet op, want de zone is al ingericht. Nagemeten tegen de
Antagonist-nameservers, alle tien records staan gelijk in onze zone:

- `MX 10 mailserver.purelymail.com`
- `TXT v=spf1 include:_spf.purelymail.com ~all`
- `TXT purelymail_ownership_proof=df51879466…` (woordelijk gelijk)
- `_dmarc` → `dmarcroot.purelymail.com`
- `purelymail1/2/3._domainkey` → `key1/2/3.dkimroot.purelymail.com`
- `autoconfig` → `autoconfig.purelymail.com`, `_autodiscover._tcp` SRV → `autodiscover.purelymail.com`
- `TXT google-site-verification=tqS515PfAVsbm26rMQTXy-4QgWyiH8N_2JcgwNgDdcY`
  (die laatste betekent dat het domein al in een Search Console-account
  geverifieerd is — niet in het onze)

**Van die records afblijven.** Een MX of DKIM die onderweg sneuvelt valt niet
op aan de site maar aan post die niet aankomt, en dat merkt ze dagen later.

Eén verschil dat wél opvalt na de knip: `mail`, `ftp` en `smtp` wijzen bij
Antagonist naar `2a03:3c00:a002:175::1000` (hun webhosting) en staan niet in
onze zone, dus die namen gaan niet meer resolven. Haar site staat op Carrd en
haar mail op Purelymail, dus er hangt niets van af — maar gebruikt ze
`ftp.dagmarvoss.nl` of een mailclient die `smtp.dagmarvoss.nl` heeft staan, dan
is dat het ding om eerst te vragen.

Na de knip: `pnpm --filter @jiw/dagmar-voss ship` (de build staat al op het
goede adres), `CONCEPT_OMLEIDEN` in `worker.mjs` op `true` voor de 301 van het
conceptadres, en in Search Console het kale adres als property toevoegen.

Het conceptadres hing tot 10-10-2026 aan de worker `dagmarvoss-concept` in
`claudius/playground` en is met de API-route uit de root CLAUDE.md overgezet
(die zone zit op precies 100 custom domains, dus eerst de oude vermelding
weghalen, dan de nieuwe erin — een `override_existing_origin` alleen wordt daar
met 100122 geweigerd).
