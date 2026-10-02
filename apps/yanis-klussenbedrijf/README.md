# Yanis Klussenbedrijf

Live: **https://yanisklussenbedrijf.nl** — `www.` stuurt met een 301 door naar het adres zonder
www (redirect rule op de zone, niet in de worker). Het oude conceptadres
`yanis-klussenbedrijf-concept.jouwidealewebsite.nl` 301't hier ook naartoe; die worker staat nog
in `jiw-concepts/yanis-klussenbedrijf/`.

Op 02-10-2026 overgezet uit `jiw-concepts/`. Geen Vite, geen React: veertien statische pagina's
die `bouw.mjs` uit `pagina/` en `pagina-en/` schrijft, uitgeleverd als Cloudflare Static Assets.
Dat is hier geen afwijking om de afwijking: elke pagina staat volledig in de HTML, dus een crawler
hoeft niets uit te voeren om hem te lezen.

Veertien pagina's: zeven in het Nederlands op `/` en dezelfde zeven in het Engels op `/en`.

| Nederlands        | Engels              |
| ----------------- | ------------------- |
| `/`               | `/en`               |
| `/werkzaamheden`  | `/en/services`      |
| `/woningen`       | `/en/homes`         |
| `/appartementen`  | `/en/apartments`    |
| `/winkels`        | `/en/retail`        |
| `/werkwijze`      | `/en/how-we-work`   |
| `/contact`        | `/en/contact`       |

Draai alles vanaf de root van de monorepo, want wrangler heeft `CLOUDFLARE_API_TOKEN` uit de
root-`.env` nodig (`set -a && source .env && set +a`).

```bash
pnpm --filter @jiw/yanis-klussenbedrijf build          # pagina/ + pagina-en/ + src/  ->  dist/
pnpm --filter @jiw/yanis-klussenbedrijf lint           # tsc over worker/
pnpm --filter @jiw/yanis-klussenbedrijf dev            # bouwt en start wrangler dev op :3067
pnpm --filter @jiw/yanis-klussenbedrijf ship:dry-run   # bindings en routes nalopen
pnpm --filter @jiw/yanis-klussenbedrijf ship           # bouwt en rolt uit
pnpm --filter @jiw/yanis-klussenbedrijf kijk           # meten in een echte browser, tegen dist/
node scripts/kijk.mjs https://yanisklussenbedrijf.nl   # hetzelfde tegen het live adres
MAPNAAR=<ip> node scripts/kijk.mjs <url>               # als de router een vers adres nog niet kent
node scripts/maak-beeld.mjs [naam]                     # ons eigen beeld (opnieuw) genereren
```

**Bewerk `pagina/` (nl) en `pagina-en/` (en), nooit iets in `dist/`.** Die map wordt bij elke
build weggegooid en opnieuw geschreven. `src/` is wél bron: `styles.css`, `app.js`, `404.html`,
`img/` en `merk/` gaan ongewijzigd mee naar `dist/`. Beeld, merk en css zijn van de twee talen
samen; alleen de tekst ligt dubbel.

`src/404.html` is handwerk en staat buiten `bouw.mjs`: hij heeft geen tegenhanger in de andere
taal en hoort niet in de sitemap. Cloudflare levert hem uit mét status 404
(`not_found_handling: "404-page"`), want een onbekend pad dat de startpagina met status 200
teruggeeft leest Google als een soft 404.

## Twee talen

Één schil (`pagina/_schil.html`) voor beide talen. Alles wat in die schil staat en niet uit een
pagina komt — skiplink, menulabels, voetkoppen, voetlinks, de knoptekst, het JSON-LD — staat in de
tabel `TALEN` in `bouw.mjs`. Komt er een chromeregel bij, dan zie je meteen dat de Engelse kant
hem ook nodig heeft.

`PAAR` in `bouw.mjs` koppelt elke Nederlandse pagina aan zijn Engelse tegenhanger. Daar komen
`hreflang` (nl, en, x-default=nl), de taalknop in de kopbalk en de `xhtml:link`-regels in de
sitemap uit. Ontbreekt een tegenhanger, dan stopt de build — een losse hreflang is erger dan geen.

Nederlands is `x-default`: de klant zit in Nederland, dus dat blijft de hoofdversie. Engels is
erbij gezet omdat Yanis zelf Engels schrijft, en hij is de eerste die deze site moet kunnen lezen.

De teksten die uit `app.js` komen (formuliermeldingen, bevestiging) staan daar in de tabel
`WOORDEN` en volgen `<html lang>`. De veldnamen van het formulier blijven in beide talen hetzelfde
(`firstName`, `telefoon`, …), zodat de worker één set velden ziet. De waarden van de vinkjes zijn
wel vertaald, dus in de mail staat wat de bezoeker zelf aantikte.

`scripts/kijk.mjs` meet beide talen: 14 adressen op twee breedtes, plus per pagina `html lang`, de
drie hreflang-regels, waar de taalknop heen wijst, dat je binnen een taal blijft (de knop is de
enige overstap) en dat er geen tekst in de verkeerde taal is blijven staan. Het formulier wordt in
beide talen doorlopen. De lijst met verboden beloftes (bedrag, termijn, garantie, percentage) staat
er nu in het Nederlands én het Engels in. Adres en KvK worden per pagina nagelopen, zowel in de
tekst als in het JSON-LD, zodat die twee niet uit elkaar kunnen lopen.

Het formulier wordt gemeten zonder dat er iets de deur uit gaat: Playwright vangt
`**/api/forms/**` op en antwoordt zelf `{"ok":true}`. Daarna wordt het opgevangen verzoek zelf
nagekeken — het juiste endpoint, alle veldnamen, en de tien vinkjes samengevoegd tot één regel.

## Waar de inhoud vandaan komt

Uit het WhatsApp-gesprek dat Armando op 27-09-2026 met hem voerde (schermafdruk in de groep).
Alles wat wij van hem hebben, staat in deze vier regels:

- bedrijfsnaam, door hem getypt als **"Yanisklussenbedrijft"**
- *"I have a construcion company we do everything on a renovation for apartments or stores
  electrik work painting work lodhieter werk tewels"*
- *"Men i have no pictures unfotunatly"*
- zijn nummer: **+31 6 11416736** (WhatsApp staat vast: dat gesprek lóópt over dat nummer)
- *"he also does houses"* (Armando, 28-09-2026). Hij noemde zelf alleen appartementen en
  winkels; woningen zijn er daarna bij gekomen. Daarom staat `/woningen` gelijkwaardig naast
  `/appartementen` en `/winkels`, en noemt de kop van de startpagina alle drie

Uit het vervolg van datzelfde gesprek (schermafdrukken in de groep, 28-09-2026):

- werkgebied: *"North holland"*, *"Amsterdam and arround"* — staat nu op elke pagina en in
  het JSON-LD (`areaServed` + `addressRegion`). `kijk.mjs` valt om als het wegvalt én als er
  een provincie bij komt die hij niet genoemd heeft
- hij werkt met anderen: *"someone of them have 10+ years exeperiernce some of them have less
  and more so i can not say exact number for that"*. Daarom staat er "één ploeg" op de site en
  **nergens een aantal jaren of een teamgrootte** — dat getal bestaat bij hem zelf niet
- AI-beeld is akkoord: *"not something crazy, just something that shows a normal and nice
  work"*, en wordt vervangen zodra hij eigen foto's heeft
- hij koopt leads in bij twee partijen. Dat is zijn inkoop, niet iets voor de site

**Niets is overgenomen van een andere website.** Geen zin, geen foto, geen merknaam.

## Wat er bewust NIET op staat

Geen prijs, geen garantietermijn, geen reactietermijn, geen beoordelingen, geen projecten,
geen e-mailadres in de tekst, geen jaartal en geen teamgrootte. Niets daarvan heeft iemand ons
gegeven. `scripts/kijk.mjs` valt om zodra het er alsnog in sluipt — inclusief een mailadres in de
tekst en een percentage.

**KvK en adres staan er sinds 02-10-2026 wél op** (opgave Alfred): KvK `91589924`, Kromhoutlaan 3,
2033 WJ Haarlem. Ze staan in de voet van elke pagina en in het JSON-LD (`PostalAddress` +
`identifier`). De ban op het woord "kvk" in `kijk.mjs` is daarmee vervallen en omgedraaid: nu valt
de meting om als het nummer of het adres érgens wegvalt, of als de pagina en het JSON-LD iets
anders zeggen. Haarlem is er ook bij `areaServed` en in de werkgebiedregel gezet, want dat is de
plaats waar het bedrijf staat.

Eén plek voor die gegevens: `KVK` en `ADRES` bovenaan `bouw.mjs`. De voet en het JSON-LD vullen
zich daaruit.

De naam staat op de site als **Yanis Klussenbedrijf**. Zijn eigen spelling eindigt op -bedrijft.
Dat is vrijwel zeker een typefout, maar het moet door hem bevestigd worden voordat het ergens
in een domeinnaam of een KvK-regel belandt.

## Beeld

Alle beelden zijn van ons, gemaakt met `scripts/maak-beeld.mjs` (Runware, `google:4@3`).
Hij heeft zelf gezegd dat hij geen foto's heeft. Er staat daarom nergens een plaatsnaam, een
jaartal of het woord "project" bij een foto: het zijn geen klussen van hem.

Een kop is 16:9 maar staat op een telefoon bijna rechtop: van 1920 breed blijft er dan nog geen
derde over, precies het midden. `hero` had daar een lege wand staan, dus op mobiel was de kop een
witte muur. De prompt zet het onderwerp nu op de as (deuropening, raam), en dat is de eis voor elk
volgend kopbeeld.

De kop van de startpagina is schermvullend (Armando, 28-09-2026): `min-height:
calc(100svh - var(--naast-hero))`. Die variabele is alles wat er naast de kop op het scherm
staat — de kopbalk (72px), en onder 640px ook de vaste balk met WhatsApp en Offerte (74px
erbij). `svh` en niet `vh`, anders duwt de adresbalk van een telefoon hem te hoog.
`kijk.mjs` meet op beide breedtes of de kop echt van onder de kopbalk tot onderaan het
scherm loopt. De paginakoppen (`hero--kort`) blijven kort: dat zijn titelbanden, geen kop.

De tekst in die schermvullende kop staat gecentreerd (Armando, 28-09-2026), horizontaal én
verticaal: het onderwerp van het kopbeeld staat op de as, dus de tekst hoort daar ook. Het
verloop erboven is voor die kop apart gezet — middenin was het maar 0.3 dekkend, en daar
staat de tekst nu. De titelbanden op de andere pagina's blijven links uitlijnen, die lopen
door met de tekst eronder.

`w-elektra` is op 28-09-2026 opnieuw gemaakt. De eerste versie zonder mensen erin had een
losse wandcontactdoos op de vloer liggen naast een beitel, tegen een half gesloopte muur.
Dat leest als rommel. Nu ligt de buis in een strak gefreesde sleuf en zit de doos ernaast
al gemonteerd; niets los op de vloer.

`woning-hero` en `w-woning` horen bij `/woningen` (28-09-2026). Een woning moet als woning
te lezen zijn en niet als appartement: vandaar de trap en de tuindeuren met de tuin erachter.
In de kop staan die tuindeuren op de as, om dezelfde reden als bij `hero`.

`w-appartement` en `w-winkelruimte` zijn er op 28-09-2026 bij gekomen voor de twee splits op de
startpagina. Daar stonden `w-badkamer` (een badkamer boven de kop Appartementen) en `w-winkel`
(een opgebouwde wand boven de kop Winkels). `w-winkel` staat nog wel op `/winkels`, waar hij bij
"de planning is het echte werk" hoort. `w-badkamer` wordt nu nergens meer gebruikt.

`w-winkel` werd in de eerste versie door Google's moderatie geweigerd
(`invalidProviderContent`). Dat is deterministisch, dus de prompt is herschreven in plaats van
opnieuw geprobeerd. De prompt in het script is de werkende versie.

## De kopbalk

De pagina is `--wrap: 1180px`. Het menu had zeven punten en stond naast het logo, het
telefoonnummer, de taalknop en de offerteknop: samen ruim 1300px. Dat paste dus op **geen
enkele** schermbreedte, want die 1180 is een plafond. Op 1440 stak de balk 126px buiten de
pagina (nog net binnen het scherm, daarom viel het niet om), en vanaf 1280 naar beneden
schoof de hele site zijwaarts mee — 345px op 981. De oude grens van 980px was daar veel te
laag voor.

Drie dingen rechtgezet (Armando, 28-09-2026):

- de balk draagt het menu **zonder Home** (`{{menuBalk}}` in `bouw.mjs`). Het logo links is
  die link al. Het uitklapmenu houdt alle zeven punten
- het nummer staat er zonder het ☎-teken, en het menu staat iets strakker (0.9rem, 9px)
- onder **1220px** gaat het menu in de uitklapknop, niet pas onder 980

Samen: 1122px in een vak van 1180. `kijk.mjs` loopt de balk nu langs dertien breedtes van
1920 tot 360 in beide talen en valt om zodra hij buiten de pagina steekt, de pagina
zijwaarts schuift, de balk omklapt, of het menu en de menuknop allebei (of geen van beide)
zichtbaar zijn.

De balk is sinds het merk **88px** hoog (`--balk`) in plaats van 72. De merkhandleiding
vraagt de volledige logocombinatie vanaf circa 180px breed, en een versie zonder onderregel
bestaat niet — dus staat het logo er op 182px, en dat is 87px hoog inclusief de marge die in
het bestand zelf zit. `--balk` staat los van `--naast-hero`, want die telt onder 640px de
vaste knoppenbalk erbij; de kopbalk blijft daar even hoog.

## Het formulier

Sinds 02-10-2026 gaat de aanvraag naar onze eigen worker (`worker/index.ts`) op
`@jiw/cloudflare-forms`. Twee endpoints, omdat de bevestiging aan de aanvrager in zijn eigen taal
moet aankomen: `/api/forms/offerte` (nl) en `/api/forms/en/quote` (en). De worker legt de aanvraag
in R2 (`jiw-form-uploads-prod`, prefix `yanis-klussenbedrijf/`, 90 dagen), mailt ons de lead en
stuurt de aanvrager een bevestiging.

- **naar** `hallo@jouwidealewebsite.nl` — nog niet naar de klant zelf, eerst zien wat eruit komt
- **van** `offers@notify.yanisklussenbedrijf.nl` via Cloudflare Email Service. De DNS eronder
  (cf-bounce MX, DKIM, SPF, DMARC `p=reject`) stond er al
- De drie ingebouwde velden van het pakket heten `firstName`, `lastName` en `email`; de labels
  eromheen zijn Nederlands, de namen kunnen dat niet zijn. Voornaam, telefoon en e-mail zijn
  verplicht, achternaam niet — een lege achternaam laat het pakket zelf uit de mail
- **E-mail is nu verplicht** waar het eerst "mag leeg" was. Zonder adres kan de aanvrager geen
  bevestiging krijgen, en dan weet hij niet of zijn aanvraag ergens is aangekomen
- Geen Turnstile. In plaats daarvan het lokveld `bedrijf`, buiten beeld en buiten de tabvolgorde
  (`.lok`): vult iets dat in, dan antwoordt de worker `{"ok":true}` en bewaart en mailt niets.
  Dat is hoe de meeste sites hier het doen, en het scheelt de bezoeker een extra verzoek naar
  Cloudflare voor een offerteaanvraag
- De tien vinkjes staan alle tien onder de naam `werk`. De worker leest per naam één waarde, dus
  `app.js` voegt ze eerst samen tot één regel. Zonder dat raakt hij negen vinkjes kwijt
- De pagina leest de aanvraag niet meer terug na het versturen; dat deed de oude versie omdat er
  nog geen mailbox was en je hem zelf moest doorsturen

### De bevestiging aan de aanvrager

Sinds 02-10-2026 in zijn eigen merk (`worker/confirmation-email.ts`): het logo bovenaan, navy
en oranje, en eigen woorden in nl en en. Daarvoor ging hij eruit in de standaardkleuren van het
pakket — marineblauw met goud, van een andere klant. Dat is de eerste mail die iemand van dit
bedrijf krijgt, vaak binnen een minuut, dus die hoort van hem te zijn.

- Het logo is `src/merk/yanis-logo-email.png`: 480 breed voor een weergave van 240, uit
  `yanis-logo.svg` platgeslagen op koel wit. **Geen SVG** (Outlook op Windows toont die niet) en
  de achtergrond zit in het bestand gebakken, zodat de donkere modus van een mailprogramma het
  navy niet op navy zet. `bouw.mjs` valt om als het bestand niet in de build zit — het
  mailprogramma van de ontvanger haalt het hier op, en een ontbrekend bestand valt pas op in
  mails die al verstuurd zijn
- Geen webfonts: Barlow Condensed en Manrope bestaan niet in een mailprogramma, dus de mail is
  Arial en doet niet alsof
- Dezelfde kleurregel als op de site: de knop is een oranje vlak met navy letters (4,83:1),
  want wit op oranje haalt 2,87:1. Oranje draagt verder alleen de streep bovenaan, het
  opschrift op het navy vlak en het randje langs de omschrijving
- **Geen e-mailadres in de mail.** Het bedrijf heeft nog geen eigen mailbox; de leads komen op
  `hallo@jouwidealewebsite.nl` binnen en dat adres hoort niet in een mail van Yanis aan zijn
  eigen klant. De bevestiging draagt wel een reply-to naar dat adres, dus "beantwoord deze mail"
  klopt. Krijgt hij een eigen adres, dan komt het in `brand.contactEmail` én in
  `LEAD_RECIPIENT` tegelijk
- `confirmationFollowUpSentence` is weg uit `worker/index.ts`: die zin staat nu in
  `followUpMessage`, en het pakket negeert hem zodra `confirmationEmail` gezet is

## De WhatsApp-knop

Stond in een zelfbedacht groen (`#1f9d55`) en het woord lag dichtgevouwen achter het
merkteken: op desktop was het een groen rondje zonder tekst. Officiëler en pakkender
(Armando, 28-09-2026):

- **WhatsApp's eigen groen** `#25d366`, met hun donkere teal `#075e54` als letterkleur.
  Wit op dat groen haalt maar 2,0:1 en is dus niet te lezen — en de knoppen dragen kleine
  tekst ("via WhatsApp", "Stuur foto's van de ruimte mee"). Donker op groen haalt 3,9:1 en
  blijft binnen hun eigen palet. Dat groen staat ver genoeg van het merkoranje af, wat
  nodig is als de twee knoppen naast elkaar staan
- het merkteken staat in een wit rondje, zoals op hun eigen knop
- het woord staat er altijd: **App ons** / *via WhatsApp*, in het Engels **Chat with us** /
  *on WhatsApp*. Die twee staan in `TALEN` (`waKnop`, `waOnder`)
- drie rustige ringen bij het laden, daarna houdt het op. Uit bij `prefers-reduced-motion`

Dezelfde kleur op de vaste balk onderin en op de WhatsApp-kaart op `/contact`. `kijk.mjs`
meet dat het woord er zonder aanwijzen staat én dat de knop echt `rgb(37, 211, 102)` is.

## Merk

Sinds 29-09-2026 draait de site op de aangeleverde merkhandleiding (richting **02A
Daadkracht**), niet meer op het palet dat wij er zelf onder hadden gezet. Daarvoor stond er
warm wit `#f6f4f0` met groen `#0e6b5e`; dat is helemaal weg.

| | |
| --- | --- |
| Navy | `#142D4E` |
| Oranje | `#F27435` |
| Koel wit | `#F4F6F8` |
| Koppen | Barlow Condensed Bold 700 |
| Tekst | Manrope Regular 400, nadruk SemiBold 600 |

De merkbestanden staan in `src/merk/`: `yanis-logo.svg` (navy, kopbalk),
`yanis-logo-wit.svg` (omgekeerd, navy voet), `yanis-logo.png`, plus de `palette.json` en
`brand.css` uit de kit ongewijzigd, zodat te zien is waar het vandaan komt. Het logo is
**geplaatst, niet nagetekend** — het zijn de vectorpaden uit de kit. `src/favicon.svg`
gebruikt de Y uit datzelfde bestand, met het oranje vierkant.

**Waarom niet overal oranje.** Oranje haalt op koel wit 2,65:1. Dat is te weinig voor tekst
(4,5:1) en zelfs voor een focusrand (3:1). Navy op oranje haalt 4,83:1 en wit op navy
13,9:1. Dus:

- **hoofdknoppen**: oranje vlak met **navy letters** — het merkoranje draagt de actie en de
  tekst blijft leesbaar. Wit erop zou 2,87:1 zijn
- **strepen, vinkjes, stapcijfers, leesbalk, de streep onder de actieve menuknop**: oranje
  zelf. Geen tekst, dus geen eis
- **kleine tekst die oranje moet zijn** (opschriften, kaartpijlen, nummers): `--oranje-diep`
  `#b84c10`, het merkoranje verdiept tot 4,75:1. Alleen daarvoor
- **op de navy voet en de donkere secties** kan oranje wél gewoon tekst zijn (4,83:1); daar
  staat ook de focusrand in oranje, want navy valt daar weg

De WhatsApp-knoppen staan buiten het merk: die dragen WhatsApp's eigen `#25d366`.

**Let op:** Novera Bouw draait ook op marineblauw/oranje. De twee concepten leken expres
niet op elkaar; nu Yanis zijn eigen merk heeft, gaat dat niet meer op. Het merk van de klant
wint, maar zet ze niet naast elkaar in dezelfde presentatie.

Nog niet gebruikt uit de kit: de drie A4-PDF's (offerte, werkbon, briefpapier) en de
fontbestanden. Die zijn drukwerk, niet web — de site haalt Barlow Condensed en Manrope bij
Google Fonts.
