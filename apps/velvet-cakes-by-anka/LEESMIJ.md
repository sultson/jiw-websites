# Velvet Cakes by Anka

Luxe taarten en patisserie, Bergen op Zoom. Live op **https://velvetcakesbyanka.nl**
sinds 18-10-2026.

Ecaterina (Anka) Heijnen maakt bruidstaarten, verjaardags- en kindertaarten,
patisserie, macarons, cozonac en dessert tables. Haar klanten zitten in Bergen op
Zoom en omgeving, en een deel van haar kring is Roemeens — vandaar dat Roemeens
hier een volwaardige taal is en niet een vertaalknop.

## Waar het vandaan komt

Dit was tot 18-10-2026 `claudius/playground/velvet-cakes-2`, het tweede van twee
concepten (concept 1 staat nog los, zie onderaan). Die map was tien losse
html-bestanden naast elkaar, met adressen op `.html` en met de Engelse en
Roemeense versie die pas **in de browser** ontstond: `i18n.js` wisselde de tekst
om op basis van `localStorage`.

Dat werkt voor een bezoeker en niet voor een zoekmachine. Er was precies één
adres per pagina, met `lang="nl"` erop, en twee van de drie talen bestonden
nergens als pagina. Niet te indexeren en niet te delen: wie de Roemeense versie
doorstuurde, stuurde een Nederlandse pagina door.

Wat de verhuizing daaraan veranderd heeft staat in SEO.md. In één regel: 31 echte
voorgerenderde pagina's in plaats van 10 pagina's met een vertaalscript, en een
formulier dat verstuurt in plaats van een WhatsApp-bericht opstelt.

## De bouw

```
pnpm --filter @jiw/velvet-cakes-by-anka build        productiebouw, indexeerbaar
pnpm --filter @jiw/velvet-cakes-by-anka build:concept  met noindex op alles
pnpm --filter @jiw/velvet-cakes-by-anka dev          wrangler dev op :3074
pnpm --filter @jiw/velvet-cakes-by-anka ship         bouwt en rolt uit
pnpm --filter @jiw/velvet-cakes-by-anka lint         tsc over worker/
```

`build` is drie stappen:

1. `tools/gen-mail-logo.mjs` — het woordmerk als png voor de bevestigingsmail.
   Moet vóór de bouw, want een svg wordt door Outlook en Gmail niet getoond en
   dan staat er een leeg vak waar haar naam hoort.
2. `bouw.mjs --prod` — schrijft `dist/`.
3. `tools/vooraf.mjs` — de poort. **Faalt de bouw.**

### Wat bouw.mjs doet

Alle inhoud staat in `bouw.mjs` zelf: de zeven soortpagina's met hun groepen,
foto's en prijzen, de smaakkaart, en per blok de Engelse en Roemeense vertaling
ernaast in hetzelfde object. Haar dertien algemene voorwaarden staan in
`voorwaarden.mjs`, de bijschriften van de 41 oudere foto's in
`bijschriften.json` (de 57 die ze zelf aanleverde staan in `bouw.mjs`).

De startpagina is de uitzondering: die heeft blokken die geen andere pagina heeft
(de opener, de waarden, het assortiment, Over mij, het atelier, de fotostrook) en
staat daarom als template in `bron/index.html`. Kop, voet, het aanvraagblok en de
meelopende balk komen daar als markers in (`<!--vc:kop-->`, `<!--vc:aanvraag-->`,
`<!--vc:voet-->`) en worden door `bouw.mjs` gevuld. **Zet die markers niet terug
naar echte html.** Ze stonden eerst dubbel — één keer in `index.html` en één keer
in het bouwscript — en dat is al een keer misgegaan: `index.html` werd niet
gebouwd, dus toen haar mailadres wisselde bleef de startpagina op het oude adres
staan terwijl de andere negen pagina's het nieuwe gaven.

Per pagina per taal gaat de body door drie stappen:

| stap | doet |
| --- | --- |
| `vertaal()` | zet de tekst in de taal van de pagina |
| `adressen()` | maakt elk intern adres absoluut en in de juiste taal |
| `hoofd()` | de kop van het document: canonical, hreflang, og, JSON-LD |

`vertaal()` werkt op dezelfde sleutels die `i18n.js` in de browser gebruikte
(`data-i18n`, `data-i18n-html`, `data-i18n-attr`). Dat is bewust: die tabellen
zijn maandenlang op de live site nagemeten, tot en met de Roemeense
schrijfletters en de html-entiteiten, en ze worden nog steeds uit dezelfde bron
naast het Nederlands gebouwd. Wat verandert is alleen het moment waarop ze worden
toegepast. De sleutels blijven als attribuut in de html staan; ze doen niets meer
maar maken wel leesbaar waar een regel vandaan komt.

**`vertaal()` telt wat hij oppakt en gooit als dat niet klopt.** Dat is de
belangrijkste regel in dit bestand. Een vertaling die stil overslaat laat de
pagina heel en zet er alleen een Nederlandse regel tussen het Roemeens, en dat
ziet niemand. Die telling vond bij de verhuizing meteen een echte fout: de
tagnaam matchte als `[a-z]+`, en dan matcht `<h1>` niet, want `\b` wil een
woordgrens tussen de `h` en de `1`. Elke **kop** op de site bleef daardoor
Nederlands terwijl de rest vertaald werd — 55 van de 64 sleutels opgepakt. Nu is
het `[a-z][a-z0-9]*`.

## De poort (tools/vooraf.mjs)

Dertien controles per pagina. De bouw stopt op elke klacht. Een poort die je kunt
overslaan is geen poort, dus hij zit in `build` en niet ernaast.

De drie die hier specifiek zijn:

- **`lang` is de taal van de map.** Dit was precies de fout van de conceptsite:
  `lang="nl"` op alle dertig varianten. Onzichtbaar in een browser.
- **De hreflang-set is rond.** Drie talen plus `x-default`, elk adres bestaat ook
  echt als bestand, en de pagina staat in zijn eigen set — anders is de set niet
  wederkerig en negeert Google hem.
- **Geen `.html` in een intern adres.** Dat werkt wel (de worker 301't het) maar
  kost elke klik een omleiding.

Daarnaast de gewone: title, description, precies één gevulde `<h1>`, een
canonical die naar zichzelf wijst, een woordvloer van 150, `noindex` alleen op de
404, elk `<form>` met een action die in de worker bestaat, elke `src` en `href`
die in `dist/` staat, de sitemap die precies de indexeerbare pagina's dekt, en
geen link meer naar de drie verhuisde adressen.

`bouw.mjs` heeft zijn eigen poort erbovenop: geen adres van het conceptdomein of
van ons eigen domein in de html, geen conceptwoorden, geen ander
WhatsApp-nummer, en **27 formulieren** — negen pagina's in drie talen. Niet 30:
de voorwaardenpagina heeft bewust geen formulier en geen offerteknop. Een knop
"offerte aanvragen" onder de annuleringsvoorwaarden leest als aanzetten tot
bestellen terwijl iemand juist zit te lezen wat er gebeurt als hij afzegt.

Alle poorten zijn bij de verhuizing getest door ze expres te laten zakken.

Er loopt ook een ai-poort (`tools/aipoort.mjs`, meeverhuisd uit de playground)
over de copy in alle drie de talen. Die blokkeert de bouw op em-dashes, drie
puntjes en de rest van de ai-ismes. Twee geregistreerde uitzonderingen, allebei
dezelfde: `oproep.schrift` is een vertaling van haar eigen regel en niet onze
copy.

## Het formulier

Eén adres: `POST /api/forms/aanvraag`, via `@jiw/cloudflare-forms`.

Tot de verhuizing verstuurde het formulier **niets**. `site.js` bundelde de
antwoorden tot een WhatsApp-bericht en opende `wa.me` in een nieuw tabblad. Dat
werkte, maar de bezoeker hield zelf niets over, de inspiratiefoto moest hij
daarna nog los sturen, en bij een geblokkeerde pop-up verdween de aanvraag zonder
dat iemand het merkte.

Nu krijgt Anka een mail met de aanvraag en de bezoeker een bevestiging in de taal
van de pagina. De inspiratiefoto gaat als `files` echt mee naar de R2-bak en
staat als link in de mail.

Twee velden zijn erbij gekomen die het WhatsApp-bericht niet nodig had: een
mailadres (daar gaat de bevestiging naartoe, en het pakket eist het) en een
telefoonnummer. Dat tweede is niet verplicht — wie alleen wil mailen hoeft zijn
nummer niet af te geven voor een taart.

De WhatsApp-knop blijft staan, in de kop van het aanvraagblok en in de
meelopende balk. Dat was haar kanaal en dat blijft het; het formulier is er voor
wie liever een formulier invult, en dat is niet dezelfde bezoeker.

Geen Turnstile maar een lokvink (`website`, buiten beeld). Geen extra resource,
geen secret, geen verzoek naar een derde voor iemand die een taart wil aanvragen.
Een bot die het veld vult krijgt `{"ok":true}` en er wordt niets opgeslagen en
niets gemaild.

De taal van de bevestiging staat als `__jiw_confirmation_locale` in de html van
de pagina zelf en wordt **niet** uit de browser gelezen: wie de Roemeense pagina
invult hoort Roemeens terug te krijgen, ook met een Nederlandse browser.

### De bevestigingsmail

`worker/confirmation.ts`, in haar huisstijl en in alle drie de talen. Creme met
een cacaoband en massief goud — geen css-verloop op tekst, want Outlook tekent
dat niet, en haar metallic verloop loopt door tot bijna wit en valt op creme weg.

Wat die mail bewust **niet** zegt: geen bedrag (haar prijzen gaan per kilo en de
decoratie wordt apart begroot, dus wat een taart kost hangt af van een ontwerp
dat nog niet bestaat — en een prijs in een mail is een aanbod), geen levertijd
(ze heeft nooit gezegd hoe lang zij nodig heeft) en niets over bezorgen of
afhalen (dat staat in haar voorwaarden en luistert per bestelling).

`brand.contactEmail` staat er bewust **niet** in. De aanvragen komen vandaag bij
ons binnen, en het adres van wie de aanvragen ontvangt in haar eigen mail aan
haar eigen klant zetten is ons merk in de hare. De mail draagt al een reply-to
naar datzelfde adres.

## Cloudflare

| wat | waarde |
| --- | --- |
| worker | `velvet-cakes-by-anka` |
| hostnamen | `velvetcakesbyanka.nl` (canoniek), `www.velvetcakesbyanka.nl` (301 naar de apex) |
| zone | `0685f890a99e10dacce8ce8a18e4cbc3` |
| afzender | `no-reply@notify.velvetcakesbyanka.nl` |
| bestemming | `hallo@jouwidealewebsite.nl` (`LEAD_RECIPIENT`) |
| R2 | `jiw-form-uploads-prod`, prefix `velvet-cakes-by-anka/` |
| dev-poort | 3074 |

**De apex is canoniek, niet www.** Dit domein heeft geen geschiedenis — er stond
nooit een site op, alleen haar Purelymail-mailbox — dus geldt de huisregel uit de
root CLAUDE.md. Dat is bewust andersom dan bij framemedia, waar `www` al jaren
uitgeleverd werd. `www` hangt er als custom domain aan en gaat met een
zone-regel (`http_request_dynamic_redirect`) met een 301 naar de apex. Blijft
die regel ooit weg, dan levert `www` de site uit in plaats van een foutmelding:
dubbele inhoud is een betere dag dan een storing.

### Let op bij de mail op deze zone

Het verzenddomein `notify.velvetcakesbyanka.nl` stond er **al vóór** deze
verhuizing. De records hangen aan `cf-bounce.notify.velvetcakesbyanka.nl` en
`_dmarc.notify.velvetcakesbyanka.nl`, **niet** aan `notify.velvetcakesbyanka.nl`
zelf. Een dns-controle op dat tweede adres geeft leeg terug, en dat is géén
bewijs dat het verzenddomein mist — die conclusie is bij deze verhuizing eerst
getrokken en was fout.

De DKIM-sleutel is accountbreed: dezelfde als op `notify.framemedia.tv`.

Haar eigen mail loopt via **Purelymail op de apex** (MX, SPF, DKIM, DMARC). Dat
staat los van dit subdomein en mag er niet door geraakt worden. `info@velvetcakesbyanka.nl`
is het adres dat op de site staat en in artikel 1 van haar voorwaarden.

Een caveat die voor elke site hier geldt: een **lead**mail die niet verstuurt
gooit en de bezoeker ziet een fout, maar een **bevestiging** die faalt wordt
alleen `console.error`'d. `{"ok":true}` bewijst dus niet dat de kopie van de
bezoeker de deur uit is. `wrangler tail velvet-cakes-by-anka` en zoeken op
`Confirmation email failed` als je zekerheid wil. Bij de verhuizing zo nagemeten:
`form_accepted` en geen enkele fout.

### Wrangler 4.85 en Email Sending

De gepinde wrangler in deze repo (4.85.0) geeft op `wrangler email sending
settings|enable|dns` een **404**, ook op een zone waar het verzenddomein
aantoonbaar werkt. De endpoints in die versie zijn verouderd; alleen `email
sending list` werkt. Gebruik voor dat werk eenmalig `npx wrangler@4.151.1 email
sending ...`. De gepinde versie blijft voor bouwen en uitrollen.

## Omleidingen

De adressen zijn zonder `.html`. Alles wat erop eindigt gaat met een 301 naar de
schone vorm — een regel in `worker/index.ts`, geen lijst van tien, dus er kan
geen adres buiten vallen. Drie adressen krijgen een eigen bestemming omdat die
niet uit de naam volgt:

| oud | nieuw | waarom |
| --- | --- | --- |
| `eclairs` | `vruchtengebak` | Anka maakt geen eclairs meer en wilde vruchtengebak op die plek (18-10-2026) |
| `choux` | `choux-cupcakes` | samengevoegd op haar verzoek, haar eigen indeling |
| `cupcakes` | `choux-cupcakes` | idem |

Die werken ook per taal: `/ro/choux.html` komt op `/ro/choux-cupcakes` uit en
niet op de Nederlandse pagina.

`velvet-cakes-2-concept.klantenkraan.nl` gaat sinds 18-10-2026 met een 301 naar
`velvetcakesbyanka.nl`, pad en query intact, via een regel op de
`klantenkraan.nl`-zone. Zonder dat stonden er twee complete kopieën van dezelfde
site online, en die oude had een `robots.txt` die alles toestond. Een `.html`-pad
loopt daarbij over twee 301's (concept → apex `.html` → schoon adres); dat is
bewust, want één eenvoudige padbehoudende regel is minder stuk te maken dan een
`regex_replace` in een zone-expressie.

## Wat nog open staat

- **Haar annuleringsstaffel spreekt zichzelf tegen op precies twee dagen
  vooraf.** Artikel: "2 t/m 3 dagen vooraf 50 procent restitutie" en een regel
  lager "2 dagen of korter vooraf geen restitutie". Op precies twee dagen gelden
  die allebei. Bij onduidelijkheid in voorwaarden wint wettelijk de uitleg die
  voor de klant het gunstigst is, dus in de praktijk 50 procent. Haar tekst, dus
  zij kiest welke van de twee regels verschuift. Staat er nu woordelijk zoals ze
  het aanleverde.
- **`LEAD_RECIPIENT` staat op ons adres.** Zodra Anka zegt dat de aanvragen bij
  haar mogen binnenkomen: `wrangler.jsonc` naar `info@velvetcakesbyanka.nl`, en
  dan verhuist `brand.contactEmail` in `worker/confirmation.ts` mee. Daarna
  **nooit meer een testinzending tegen de uitgerolde config** zonder
  `LEAD_RECIPIENT` eerst terug te zetten.
- **Concept 1 staat nog los.** `velvet-cakes-concept.klantenkraan.nl` levert nog
  een complete, indexeerbare Velvet Cakes-site uit, in een ander ontwerp. Dat
  concurreert op dezelfde zoektermen als haar echte site. Niet aangeraakt: het is
  een ontwerp dat Armando actief naast dit gebruikt heeft, dus weghalen of
  omleiden is zijn keuze en niet die van de bouw.
- **Vier foto's van haar aanlevering liggen er nog uit**, bewust: op twee staan
  mensen herkenbaar in beeld die daar niet om gevraagd hebben, één is te smal
  voor een staande uitsnede en één was een dubbele.
- **Haar logo** bestaat als vector sinds 25-09-2026, dus dat is geen open punt
  meer. De oude korrelige Facebook-profielfoto van 200 pixels wordt nergens meer
  gebruikt.

## Verwante bestanden

- `SEO.md` — wat de verhuizing aan vindbaarheid veranderd heeft, en de stand
- `bron/huisstijl-bron/` — de aangeleverde logoplaten, waar het palet uit komt
- `statisch/` — de 109 foto's, het merk, `styles.css`, `site.js`, `galerij.js`
