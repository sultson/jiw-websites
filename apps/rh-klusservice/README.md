# RH Klusservice

Live op **https://rhklusservice.nl**. Zie `SEO.md` voor de nulmeting en wat er bij
zoekmachines nog moet.

Statische site: geen Vite, geen React. `dist/` is wat er live staat. `dist/index.html` en
`dist/projecten/index.html` zijn handwerk, de andere tien pagina's komen uit een generator.
Zo gehouden bij de overzetting uit `jiw-concepts` (07-10-2026) omdat elke pagina al volledig in
de HTML staat — zie "Volledig pre-rendered" in `SEO.md`.

**`bron/` is wel bron en geen uitvoer.** `bron/stijl.css`, `bron/site.js` en de drie TTF's in
`bron/lettertype/` zijn waar je in werkt; de build zet er de verkleinde en omgezette versie van
in `dist`. Die drie stonden tot 07-10-2026 zelf in `dist` en gingen onverkort de deur uit.

```
pnpm --filter @jiw/rh-klusservice build         # de generatoren, de media en de sitemap
pnpm --filter @jiw/rh-klusservice ship          # build + wrangler deploy
pnpm --filter @jiw/rh-klusservice ship:dry-run
pnpm --filter @jiw/rh-klusservice lint          # tsc over worker/
pnpm --filter @jiw/rh-klusservice indexnow      # na een deploy: Bing c.s. melden
node scripts/kijk.mjs [adres] [--verstuur] [--zichtbaar]   # echte browser, pagina's + formulier
node scripts/meet-plaatjes.mjs [adres]          # echte browser, de <picture>-omzetting
```

Zonder adres kijken die twee scripts naar de live site. Geef `http://127.0.0.1:3069` mee om
eerst tegen `wrangler dev` te kijken.

De build draait negen stappen, in deze volgorde:

| stap | doet |
| --- | --- |
| `maak-reviews.mjs` | alle 41 beoordelingen met tekst in de schuifrij op `dist/index.html` |
| `maak-plaatspaginas.mjs` | de acht `dist/timmerman-<plaats>/` |
| `maak-slotpagina.mjs` | `dist/slot-vervangen-valkenswaard/` |
| `maak-404.mjs` | `dist/404.html` |
| `maak-lettertypen.mjs` | de drie TTF's naar WOFF2, uitgedund tot de tekens die hier staan |
| `maak-plaatjes.mjs` | AVIF + WebP in een reeks breedtes naast elke foto, plus `plaatjes.json` |
| `maak-snel.mjs` | elke `<img>` in een `<picture>`, en het preload-blok in de `<head>` |
| `maak-bundel.mjs` | `bron/stijl.css` en `bron/site.js` verkleind naar `dist` |
| `maak-sitemap.mjs` | `dist/sitemap.xml` + `robots.txt`, met `lastmod` uit de mtime |

De laatste vijf moeten in die volgorde: `maak-plaatjes` kijkt in de HTML welke foto's er staan,
`maak-snel` bewerkt die HTML, en `maak-sitemap` leest de mtime die daar uit komt. `maak-snel` is
idempotent — het pelt elke `<picture data-pic>` en elk `<!--snel-->`-blok eerst weer weg — dus je
bewerkt in `dist/index.html` gewoon de `<img>` binnenin en de build maakt er weer een picture van.

`ship` vereist `CLOUDFLARE_API_TOKEN` uit de root `.env`; wrangler laadt die niet zelf, dus
eerst `set -a && source .env && set +a` vanuit de repo-root.

## Overgezet uit jiw-concepts (07-10-2026)

Op verzoek van Alfred. Wat er bij die overzetting is veranderd:

- **Worker `rh-klusservice`** in dit pakket, `wrangler.jsonc` in plaats van `wrangler.toml`.
  Workers Static Assets met `html_handling: "force-trailing-slash"`,
  `not_found_handling: "404-page"` en `run_worker_first: ["/api/*"]`.
- **Het formulier gaat naar onze eigen worker** op `@jiw/cloudflare-forms`, niet meer naar
  formsubmit.co. Zie "Het formulier" hieronder. Daarmee is ook de bevestigingsmail-stap van
  formsubmit van de baan: er hoeft niemand meer op een linkje te klikken voordat er een
  aanvraag binnenkomt.
- **`noindex` is eraf.** Stond als `X-Robots-Tag` over de hele site in `dist/_headers` zolang
  het een concept was. Dat bestand draagt nu alleen nog `Referrer-Policy` en
  `X-Content-Type-Options`, en dat werkt: gemeten op het live adres.
- **Eigen 404-pagina** (`maak-404.mjs` → `dist/404.html`), mét status 404.
- **Sitemap met `lastmod`** per pagina uit de mtime van het HTML-bestand, en `Disallow: /api/`
  in robots.txt.
- **De twee conceptadressen leiden om.** `rh-klusservice.jouwconcept.app` en
  `rh-klusservice-concept.alfredsultson.workers.dev` leverden tot die dag dezelfde site met
  status 200 uit; dat zijn twee complete kopieën van één site online. Die Worker
  (`jiw-concepts/rh-klusservice/omleiding.mjs`) stuurt nu per pad met een 301 door en levert
  zelf geen pagina's meer uit. De map `jiw-concepts/rh-klusservice/` heeft nog de oude `dist/`
  en de generatoren staan: dood gewicht, mag weg, maar daar staat niets meer live op.
- **Het derde adres is weg.** `rh-klusservice.klantenkraan.nl` serveerde een oudere versie van de
  site met status 200 (wel mét `noindex`). Worker `rh-klusservice-kk` is op 07-10-2026 verwijderd
  en het DNS-record is uit de zone `klantenkraan.nl` verdwenen; de naam geeft NXDOMAIN. Geen
  omleiding — het adres bestond alleen intern. De bron staat nog in
  `claudius/playground/rh-klusservice-kk/` met de route uitgezet.

De zone `rhklusservice.nl` staat sinds 06-10-2026 in het Cloudflare-account. Apex en `www` zijn
Workers custom domains in `wrangler.jsonc`; ze zijn op 07-10-2026 met
`override_existing_origin` van de conceptworker naar deze overgezet.

De 301 van `www` naar apex staat op de zone als **redirect rule**, niet in de Worker:
ruleset-fase `http_request_dynamic_redirect`, regel `(http.host eq "www.rhklusservice.nl")` naar
`concat("https://rhklusservice.nl", http.request.uri.path)` met `preserve_query_string`. Die
fase draait vóór Workers, dus de Worker ziet `www` niet meer. `www` blijft als custom domain in
`wrangler.jsonc` staan, anders heeft het geen DNS.

**De zone heeft buiten de mailrecords niets:** wel de DNS onder
`notify.rhklusservice.nl` (cf-bounce MX, DKIM, SPF, DMARC `p=reject`) voor het versturen, maar
**geen MX op het domein zelf, dus geen mailbox.** Dat is bewust en afgehandeld: Alfred heeft op
07-10-2026 bevestigd dat de klant geen mailbox op `@rhklusservice.nl` nodig heeft. Zijn adres op
de site is `rhklusservice@outlook.com`. Wie later toch `@rhklusservice.nl` wil, moet eerst MX
toevoegen — nu komt zulke post nergens aan.

## Het formulier

Sinds 07-10-2026 gaat de aanvraag naar `worker/index.ts` op `@jiw/cloudflare-forms`, endpoint
`/api/forms/offerte`. De worker legt de aanvraag in R2 (`jiw-form-uploads-prod`, prefix
`rh-klusservice/`, 90 dagen) en mailt ons de lead.

- **naar** `rhklusservice@outlook.com` — Robbin zelf. Alfred zette dat om op 07-10-2026;
  daarvoor kwamen de leads bij ons binnen (`hallo@jouwidealewebsite.nl`, en een paar uur op
  `jouwidealewebsite@gmail.com`). **Geen testaanvragen meer versturen**: elke inzending komt
  nu bij de klant in de mailbox
- **van** `offerte@notify.rhklusservice.nl` via Cloudflare Email Service. Was `offers@`; Alfred
  koos op 07-10-2026 `offerte@`. Dat adres is zelf nergens ingericht en ontvangt niets: DKIM,
  SPF en DMARC staan op het hele domein `notify.rhklusservice.nl`, dus elk adres daarachter mag
  versturen. Wie op de bevestiging antwoordt komt via de reply-to bij `LEAD_RECIPIENT` uit
- Velden: **naam, telefoon, e-mailadres (optioneel), omschrijving, foto's (optioneel).**
  Armando heeft op 06-10-2026 soort klus, soort pand, wanneer, plaats én e-mail eruit laten
  halen ("form needs to be more simple"); Alfred zette het e-mailadres er op 07-10-2026 weer
  bij voor de bevestiging, als optioneel veld. Dat is wat die twee verenigt: wie het invult
  krijgt een bevestiging, wie het overslaat kan gewoon versturen. De namen in het HTML zijn die
  van het pakket: `firstName` (opschrift "Naam"), `telefoon`, `email`, `bericht`, `files`.
  `lastName` staat er niet op; met `requireLastName: false` en `requireEmail: false` laat het
  pakket die lege regels zelf uit de mail, dus er komt geen "Achternaam: -" in de melding.
  **Wil je het adres verplicht maken**, dan is dat `requireEmail: true` in `worker/index.ts`
  plus `required` op het veld in het HTML (vier plekken, zie onderaan deze lijst)
- **Bevestigingsmail aan de aanvrager in zijn eigen merk**, `worker/bevestigingsmail.ts`. Het
  logo, zwart-wit zoals de site, en eigen woorden in plaats van de standaardopmaak van het
  pakket (marineblauw met goud). Het logo is `dist/logo/rh-klusservice-email.png`: een PNG met
  het zwart erin gebakken, want Outlook op Windows toont geen SVG en het logo is wit.
  `maak-mailmerk.mjs` schrijft dat uit de SVG; dat plaatje staat bewust in geen enkele pagina,
  zodat `maak-plaatjes.mjs` er geen AVIF en WebP van maakt die geen mailclient leest.
  Wat er bewust **niet** in staat: een aanrijtijd, een termijn ("binnen 24 uur"), een vaste
  prijs vooraf en het woord vrijblijvend. Dat zijn vier beloftes die Robbin nooit heeft gedaan
- **Zonder e-mailadres geen bevestiging**; het pakket slaat hem dan over. De pagina zegt daarom
  zelf wat er gebeurt: het formulier wordt na het versturen vervangen door "Uw aanvraag is
  binnen — we bellen u op het nummer dat u heeft ingevuld", met het telefoonnummer eronder.
  Vulde iemand wél een adres in, dan staat de regel "U krijgt er een bevestiging van per
  e-mail" ervoor, zodat niemand zijn inbox in gaat zoeken naar een mail die nooit komt
- **Verborgen veld `herkomst`**, per pagina anders ("Homepagina", "Homepagina (bovenste
  formulier)", "Projectenpagina", "Pagina Eindhoven"). Dat staat in de onderwerpregel en als
  eigen regel in de mail, dus Robbin ziet welke pagina de aanvraag opleverde. Via
  `leadOnlyEmailFields`, dus het zou nooit in een bevestiging aan de aanvrager terechtkomen
- **Foto's gaan niet als bijlage mee** maar als downloadlink naar R2. Dat was bij formsubmit
  het hele probleem: daar zat een maximum aan de bestandsgrootte en een telefoonfoto liep er
  tegenaan. Nu: maximaal vijf bestanden van 10 MB, samen 50 MB
- **Geen Turnstile.** In plaats daarvan het lokveld `bedrijf`, buiten beeld via `.valstrik`:
  vult iets dat in, dan antwoordt de worker `{"ok":true}` en bewaart en mailt niets. Getest
- **`.valstrik` en niet `.lok`.** Die naam lag voor de hand, maar `.lok` is op deze site al de
  hero van de plaatspagina's en de slotpagina. `.lok{display:none}` erbij zou daar de halve
  pagina hebben weggehaald. `scripts/kijk.mjs` meet daarom elke keer of `section.lok` nog
  zichtbaar is
- **Het formulier staat op vier plekken in het HTML**, waarvan er maar één gegenereerd wordt.
  `FORMULIER()` in `onderdelen.mjs` maakt het voor de acht plaatspagina's; dezelfde HTML staat
  met de hand in `dist/index.html` (twee keer: `#offerte-boven` en `#offerte`) en in
  `dist/projecten/index.html`. Verander je het formulier, dan moeten die drie mee

Getest op het live adres, 07-10-2026: een aanvraag met een foto van 110 KB komt door
(`form_accepted` in de logs, geen `Lead email failed`), het bestand staat in R2 met zijn
manifest, een aanvraag zonder telefoon of zonder naam wordt geweigerd met de juiste Nederlandse
melding, een gevuld lokveld wordt stil weggegooid, en `GET` op het endpoint geeft 404. In een
echte browser (`scripts/kijk.mjs --verstuur`) komt de bevestiging in beeld, zonder fouten in de
console.

Na het terugzetten van het e-mailadres opnieuw getest op het live adres, 07-10-2026, met
`jouwidealewebsite@gmail.com` als afzender: `63a3b284` (met adres en een foto), `e45f1a5b`
(bewust zonder adres, dus alleen de melding aan ons) en `dc844643` (met adres, terwijl
`wrangler tail` meelas: `form_accepted`, geen uitzonderingen en geen `Confirmation email
failed`, dus beide mails zijn aangenomen). Een onleesbaar adres wordt geweigerd met "Vul een
geldig e-mailadres in", een gevuld lokveld blijft stil. Hoe de bevestiging eruitziet is apart
nagekeken door de worker met een nepbinding te draaien en de HTML in een browser te schieten;
dat renderde goed op 720px.

`/bedankt/` staat er nog maar is nergens meer de bestemming van: dat was waar formsubmit naartoe
doorstuurde. De pagina doet geen kwaad, staat niet in de sitemap en is uitgesloten in robots.txt.

**Waarom het conceptadres op jouwconcept.app staat en niet jouwidealewebsite.nl.** Die zone zit
op de Cloudflare-limiet van 100 Workers custom domains. `jouwconcept.app` heeft ruimte.

## Eén stijl: Midnight clean

Er waren drie stijlen naast elkaar (Midnight, Midnight clean, Carbon) met een wisselaar in de
balk. Armando koos op 07-10-2026 **Midnight clean**; de andere twee zijn er diezelfde dag
uitgehaald. Weg zijn: `dist/carbon.css`, de `<link>` ernaar op elke pagina, de
`<div class="balk__stijl">` met de drie puntjes, het inline `localStorage`-script in elke
`<head>`, het themadeel van `dist/site.js` en de wisselaar-CSS.

`<html>` draagt nog `data-thema="midnight-clean"`, vast op alle twaalf pagina's. De regels
onder `[data-thema=midnight-clean]` onderaan `dist/stijl.css` zijn de laag die clean
onderscheidde van de andere twee; die staat er nog zo in. Ze gelden nu altijd. Wil je ze ooit
platslaan, dan moet het attribuut overal tegelijk eruit én uit die selectors, anders valt de
halve pagina-opbouw weg.

Wat deze stijl is:
- **Strikt zwart-wit**, de logokleuren. Afwisselend witte, lichtgrijze en zwarte vlakken.
- **Volgorde** (06-10-2026, verzoek Armando): hero, wat we doen, contact, wat klanten zeggen,
  werkwijze, ons werk, contact. Met `order` op de flex-`main`, dus de HTML-volgorde is een
  andere dan wat je ziet. De vlakken zijn daarop afgestemd: beoordelingen blijft grijs (anders
  vallen de witte reviewkaarten weg) en ons werk heeft de lichte huid, want zwart tegen het
  zwarte contactblok loopt in elkaar over. Dat zet ook `.knop--licht` daar om naar zwart op grijs.
- **Contactblok staat er twee keer in**: `#contact` onderaan en `#contact-boven` (zelfde HTML,
  formulier `#offerte-boven`) direct onder de werkzaamheden. Pas je de tekst of het formulier
  aan, dan moeten **beide** mee.
- **Eén herofoto**, geen carrousel. De vier andere foto's, de pijlen en de stippen zijn
  07-10-2026 uit het HTML gehaald; ze waren `display:none` maar werden wél opgehaald.
- **Dienstkaarten dragen een lijnicoon in wit**, geen foto. De iconen staan in `iconen.mjs` en
  zijn in het HTML een `<span class="tegel tegel--dienst">`. De negen foto's zijn 07-10-2026 uit
  het HTML gehaald, zelfde reden. Een kaart zonder foto heeft niets te vergroten, dus
  `.diensten .dienst` zit niet meer in de lichtbak van `dist/site.js`.
- **Dienstenblok** (keuze Armando 06-10-2026, optie 2 van drie): `#diensten` is zelf zwart en de
  kaart is `#141414` met een rand van `rgba(255,255,255,.14)`. Negen zwarte kaarten op het
  lichtgrijze vlak lazen als gaten in de pagina, nu liggen ze erop.
- **Geen** sectie "Over RH Klusservice" (`#over`), **geen** "Woning, bedrijfspand of
  opslagruimte" (`#inzetbaar`), **geen** grijze slotbalk onder de dienstkaarten (`.slot`), en
  **geen** schuine grafietkaart achter de herofoto (`.hero__beeld::after`). Allemaal stond het
  op `display:none` in clean; het HTML is 07-10-2026 opgeruimd.
- **Werkwijze** toont alleen de vier koppen op de tijdlijn, geen uitleg eronder.

Dat opruimen scheelde **1,36 MB** aan foto's die wel werden opgehaald maar nooit in beeld
kwamen. De homepagina haalt nu 782 KB op desktop en 626 KB op telefoon, tegen ruim 2 MB ervoor.

Wat blijft staan in `dist/stijl.css` en nergens meer bij hoort: de regels voor `.dia__pijl`,
`.dia__stip*`, `.slot`, `.lood--clean`/`.lood--standaard`, `.feiten`, `.vak--over`, `.nav--over`
en `#inzetbaar`, plus `.streep` (die hoorde bij Carbon) en `<div class="streep">` in het HTML.
Dood maar onschadelijk; een paar kB. `.over`/`.over__beeld`/`.inzet` moeten juist blijven, die
gebruikt de slotpagina.

De balk gaat op 860px naar zijn telefoonvorm. Dat stond eerst op 720px, terwijl de menulinks en
de belknop er onder 860px niet meer naast passen: op een tablet was de hele pagina zijwaarts te
slepen (77px over op 900, 197px op 780). De belknop op de telefoon staat rechts met
`margin-left:auto` op `.balk__mob`; dat deed eerst de wisselaar.

## Opbouw

- `dist/index.html` — één doorlopende homepagina. Volgorde zoals je hem ziet: hero, wat we
  doen, contact, Werkspot-beoordelingen, werkwijze, Klusinzicht, contact. In het HTML staan
  die secties in een andere volgorde; `order` op de flex-`main` zet ze goed (zie "Eén stijl").
  "Wat we doen" was een tekstraster van 10 blokken; op verzoek van Armando (04-10-2026)
  zijn dat fotokaarten geworden (foto 4:3 + kop + regel), nog steeds niet doorklikbaar.
  Negen kaarten, want op 1180px geeft `auto-fit minmax(290px,1fr)` drie kolommen: 9 vult
  precies 3x3, 10 laat een losse kaart achter. Losse kozijnen hebben daarom geen eigen
  kaart; die staan in de regel bij "Binnen- en buitendeuren".
  **Drie kaarten dragen een foto die niet de dienst is die erboven staat.** Robbin stuurde
  geen foto van schilderwerk, sloten of klein onderhoud; op verzoek van Armando
  (04-10-2026) staat er nu de dichtstbijzijnde foto uit zijn eigen set, te vervangen zodra
  hij beter materiaal aanlevert:
  schilderwerk → `binnendeur-wit` (wit afgeschilderde deur, kozijn en plint),
  sloten → `buitendeur-gevel` (nieuwe buitendeur met zichtbaar slot in een gemetselde gevel),
  klein onderhoud → `dakraam-pannendak` (dakraam in het pannendak van een bestaande woning).
  Die drie staan ook in de lijst "nog niet bevestigd" onderaan.
  **"Lichtkoepels en lichtstraten" is eruit (07-10-2026, de klant via Armando)** en vervangen
  door **"Sloten en hang-en-sluitwerk"**. Armando's omschrijving was "sloten vervangen /
  buitensluitingen" en vroeg om een goede benaming; hang-en-sluitwerk is de vakterm en dekt
  ook cilinders, sloten op ramen en scharnieren, en "buitengesloten" is het woord waar mensen
  op zoeken. De kaart staat op plek 8 en niet op plek 6 waar lichtkoepels stond: de rij loopt
  sinds 04-10-2026 van duur naar goedkoop, en een slot is kleiner werk dan schilderwerk of een
  deur. `plafond-dakraam` is daarmee vrij en staat alleen nog in de galerij.
  Fotocontrole 04-10-2026: `dakkapel-buiten` en `overkapping-tuin` stonden allebei twee keer
  op de homepagina (bij "over ons" / in een dienstkaart en nog eens in Klusinzicht). Klusinzicht
  toont nu `dakraam-zolder-vloer`, `keuken-wit-zwart` en `tuinhuis-hottub`; geen enkele foto
  staat nog dubbel op één pagina. Bij klein onderhoud stond `dakraam-badkamer` (gele muren,
  gedateerde badkamer, de zwakste foto van de set); die staat nu alleen nog in de galerij.
- `dist/projecten/index.html` — gegenereerd uit `fotos.json` (zie onder), 37 foto's in
  5 categorieën met filterknoppen.
- `dist/timmerman-<plaats>/index.html` — acht plaatspagina's, **gegenereerd door
  `maak-plaatspaginas.mjs`** (`node maak-plaatspaginas.mjs`). Niet met de hand bewerken.
  Opzet per pagina: het offerteformulier staat meteen in de hero naast de kop, daaronder
  zes dienstkaarten, dan de beoordelingen uit die hoek van het land en contact. Er gaat een
  verborgen veld "Aangevraagd via" mee, dus Robbin ziet in de mail welke pagina de aanvraag
  opleverde. De beoordelingen komen uit
  `werkspot-reviews.json`, gefilterd op `nabij` per plaats. Utrecht, Amsterdam en Rotterdam
  hebben er nul: daar heeft hij nog nooit een klus gedaan, dus dat blok valt daar weg.
  Linkjes naar alle acht staan in de voet van elke pagina.
- `onderdelen.mjs` — de bovenbalk, de voet, de zwevende WhatsApp-knop en de gegevens die
  op elke gegenereerde pagina hetzelfde zijn. Op 07-10-2026 uit `maak-plaatspaginas.mjs`
  gehaald, zodat de slotpagina en de sitemap dezelfde balk en voet gebruiken. De
  homepagina (`dist/index.html`) is handwerk en staat hier buiten: verandert de balk of de
  voet, dan moet die met de hand mee.
- `dist/slot-vervangen-valkenswaard/index.html` — **gegenereerd door `maak-slotpagina.mjs`**
  (`node maak-slotpagina.mjs`). Eén losse pagina over slot vervangen en buitensluiting,
  op verzoek van Armando (07-10-2026) na een gesprek met Robbin: dat werk doet hij, maar het
  loopt via via en nooit via Google. Hij wil er wel op gevonden worden, zonder dat het groot
  op de homepagina staat.
  **Daarom staat er geen enkele link vanaf de homepagina naar deze pagina.** De dienstkaart
  "Sloten en hang-en-sluitwerk" blijft daar staan zoals hij is en linkt bewust nergens heen.
  Google komt er langs twee wegen bij: `dist/sitemap.xml`, en één regel in de voet van de
  acht plaatspagina's (zie `onderdelen.mjs`). Die plaatspagina's staan wél in de voet van de
  homepagina, dus de pagina is in twee stappen te bereiken zonder dat hij op de homepagina
  staat. Een pagina zonder enige interne link is voor Google een weespagina en komt moeilijk
  omhoog; dit is de lichtste vorm die dat voorkomt. Moet ook die regel weg, dan blijft alleen
  de sitemap over.
  Opbouw: hero met een foto ernaast, de spoedsectie, zes blokken werk (buitengesloten,
  cilinder vervangen, slot kapot of sleutel afgebroken, gelijksluitend maken, raam- en
  deurbeslag, de deur zelf), zeven beoordelingen over snelheid en deurwerk, een blok over
  waarom een klusbedrijf, vier veelgestelde vragen en contact. Structured data:
  `HomeAndConstructionBusiness`, `Service` met `OfferCatalog` en `FAQPage`.
  **Spoed staat vooraan** (verzoek Armando 07-10-2026: "is vooral voor spoed, dus dat mag
  ook belicht worden"). Dat zit op vijf plekken: de titel en de h1 beginnen met
  buitengesloten, een strook `.spoed` in de hero met het telefoonnummer erin, een eigen
  sectie `#spoed` direct onder de hero, de spoedvraag staat bovenaan bij de veelgestelde
  vragen, en de drie beoordelingen over snel reageren staan vooraan in de schuifrij.
  Wat er bewust **niet** staat: een aanrijtijd ("binnen 30 minuten"), 24-uurs bereikbaarheid
  en avond- of weekenddienst. Daar heeft Robbin nog niets over gezegd (zie de openstaande
  vragen onderaan). Wat er wel staat is wat zijn eigen klanten op Werkspot schrijven:
  binnen vijf minuten reactie (Julisca, 801925) en dezelfde dag geholpen (827235 uit Gemonde
  en 799114 uit Waalre). Die twee staan als `.citaat` onder de spoedsectie, ingekort tot de
  zin die over snelheid gaat, met naam, maand en bron eronder; de hele tekst staat verderop
  in de schuifrij op dezelfde pagina, dus er wordt niets weggelaten dat de zin anders maakt.
  Er stond onder die citaten nog een regel `.spoed__nuance` ("een vaste tijd beloven we niet,
  wel of het vandaag lukt"). Die is er op verzoek van Armando (07-10-2026) uit; dezelfde nuance
  staat nog in het antwoord op de spoedvraag bij de veelgestelde vragen, dus de pagina belooft
  nog steeds geen aanrijtijd.
  `reviewkaart()` gebruikt sinds deze ronde dezelfde `wie()`-afhandeling als
  `maak-reviews.mjs`: 15 van de 41 beoordelingen kwamen zonder naam uit de scrape en worden
  "Klant uit Gemonde". Daarvoor stond er `naam[0]` zonder die afhandeling, en dat liep stuk
  op de eerste naamloze beoordeling in `REVIEW_IDS`.
  **Het zoekwoord "slotenmaker" staat er bewust niet in.** Dat is de grootste zoekterm, maar
  wie daarop zoekt verwacht iemand die 24 uur per dag uitrijdt, en dat heeft Robbin nooit
  gezegd. "Slot vervangen" en "buitengesloten" zijn wel waar te maken. Zegt hij dat hij ook
  's avonds en in het weekend uitrijdt, dan is `slotenmaker-valkenswaard` de volgende pagina.
  Geen foto's van slotwerk: hij heeft er geen. Dit raster draagt daarom een lijnicoon en
  geen foto, dus er staat geen beeld bij dat de klus niet is.
  Drie dingen op verzoek van Armando (07-10-2026, na de eerste versie):
  1. **Geen offerteformulier.** Deze pagina is voor spoed; wie buiten staat belt. Bellen en
     WhatsApp zijn de enige twee acties. In de hero staat nu `buitendeur-gevel` (de enige
     foto met een zichtbaar slot); het blok "een klusbedrijf dat ook sloten doet" draagt
     daarom `binnendeur-gang`, zodat geen foto twee keer op de pagina staat.
  2. **De plaatsnaam staat niet meer in de h1** ("Buitengesloten of slot vervangen"), omdat
     dit werk breder gaat dan Valkenswaard. Valkenswaard staat nog in de titel, de
     omschrijving, de inleiding, de veelgestelde vragen en de structured data, dus voor
     Google blijft de pagina lokaal. Wil hij het toch in de kop, dan is "in Valkenswaard en
     omgeving" de variant die allebei doet.
  3. **De zes werkblokken zijn losse opgetilde kaarten** met het icoon zichtbaar, zoals de
     dienstkaarten op de homepagina (`.inzet--kaarten` in `stijl.css`). Het haarlijnraster
     staat nog wel onder de veelgestelde vragen.
- `maak-404.mjs` — schrijft `dist/404.html`, de pagina die een onbekend pad krijgt mét status
  404. Zelf `noindex,follow` en niet in de sitemap.
- `maak-sitemap.mjs` — schrijft `dist/sitemap.xml` (11 pagina's) en `dist/robots.txt`.
  Zit in `pnpm build`, dus hij loopt bij elke deploy mee. `lastmod` komt uit de mtime van het
  HTML-bestand zelf en niet uit de builddatum, anders zou elke deploy elke pagina als "net
  gewijzigd" melden. `/bedankt/` en `/404.html` staan er niet in; robots.txt sluit `/api/` en
  `/bedankt/` uit. De sitemap moet nog in Search Console ingediend worden (zie `SEO.md`),
  anders duurt het weken voordat de slotpagina wordt opgepikt — die heeft bewust bijna geen
  interne links.
- `dist/site.js` — op alle pagina's: de zwevende WhatsApp-knop, de fotocarrousel, de schuifrij
  met beoordelingen, het schermvullend openen van foto's, het offerteformulier en de
  cookiemelding. De losse inline scripts in `index.html` zijn hierheen verhuisd (05-10-2026),
  anders zouden de plaatspagina's ze alle acht moeten herhalen. Het themadeel (de
  stijlwisselaar) is er 07-10-2026 uit; er is nog maar één stijl.
- **Hero wisselt van foto** (05-10-2026, verzoek Alfred). Vijf foto's die nergens anders op
  de homepagina staan: `dakkapel-pannendak`, `tuinhuis-hottub`, `saunacabine`,
  `keuken-eiland`, `zolder-kamer`. Elke 6,5 s de volgende, met een langzame zoom die per
  foto van richting wisselt (in, uit, in, ...). De oude foto blijft tijdens het overvloeien
  staan en de zoom wordt bevroren op de stand van dat moment; haal je alleen de klasse weg,
  dan springt hij zichtbaar terug naar zijn beginformaat. Stopt bij hover, bij een
  achtergrondtabblad en bij `prefers-reduced-motion`. Stippen rechtsonder om zelf te kiezen,
  pijlen links en rechts, en op de telefoon vegen (alleen als de veeg duidelijk horizontaal
  is, anders vangen we het verticale scrollen van de pagina af).
  Let op: plek 1 en 2 waren `dakkapel-pannendak` en `dak-dakkapel-boven`, en dat is dezelfde
  foto met een andere uitsnede. Plek 2 is nu `tuinhuis-hottub`; in Klusinzicht staat daarom
  `barrel-sauna` in plaats daarvan.
- **Foto's schermvullend** (05-10-2026, verzoek Alfred). Elke dienstkaart, het mozaiek bij
  Klusinzicht, de foto bij over ons en de hele galerij op projecten openen in een venster met
  de beschrijving eronder; met de pijlen loop je door die reeks. De kaart is bewust géén
  `<button>`: dan zou de `h3` met de dienstnaam uit de koppenlijst van de pagina vallen.
  `site.js` geeft hem `role=button`, `tabindex` en de toetsenbediening. Schermvullend wordt
  de grote foto geladen, niet de `-klein`-versie; dat gebeurt door `-klein` uit de bestandsnaam
  te halen, dus elke `-klein.jpg` moet een broer zonder achtervoegsel hebben.
- **Cookiemelding** (05-10-2026, verzoek Alfred). Zit in `site.js`, verschijnt onderaan tot
  iemand op Akkoord klikt (`localStorage` sleutel `rh-koek`). De tekst zegt dat er alleen
  functionele opslag is en dat er niets gevolgd of gedeeld wordt. **Dat klopt nu ook**: geen
  analytics, geen beacon, lettertypen staan lokaal en er gaat geen enkel verzoek naar een
  derde partij. Sinds 07-10-2026 geldt dat ook voor het formulier: dat ging naar
  `formsubmit.co`, nu naar onze eigen worker op hetzelfde adres. Zet er ooit een
  bezoekersteller op, dan moet die tekst mee veranderen. Zolang de melding staat schuift de zwevende WhatsApp-knop erboven; `site.js`
  meet de hoogte en zet die als `--koek-h`.
- **Zwevende WhatsApp-knop.** Op de telefoon alleen nog een rond groen belletje rechtsonder
  (een pil over de volle breedte maakte het onderaan te druk), op desktop met het woord erbij.
  Verdwijnt zodra er al een WhatsApp-knop in beeld staat, bijvoorbeeld in de hero of bij
  contact: een IntersectionObserver over `.knop--wa, .rij--wa` in `site.js`.
- **Werkspot-chip.** Stond op 26px logo + 8/16px padding, dat was te fors. Nu 15px met
  5/11px padding (totaal 25px hoog), in het reviewblok 19px.
  Let op: `.ws__mark` staat op `box-sizing:content-box`, anders eet de padding het logo op.
  Het zwevende kaartje met 5,0 op de herofoto is er 05-10-2026 uit: het cijfer stond vlak
  ernaast ook al in de tekstkolom.
- **Koppen in gewone schrijfwijze** (05-10-2026, verzoek Alfred). `text-transform:uppercase`
  is van h1/h2/h3 af, en van de formulierlabels en de kleine kopjes bij contact. Hele regels
  kapitaal in Barlow Condensed lezen als schreeuwen. De regelafstand moest daarbij van 0.95
  naar 1.02: onderlengtes (g, j, p) liepen anders over de volgende regel. De h1 op de
  homepagina staat nu op drie regels op desktop (was vier), door de bovengrens van de
  `clamp` van 5,2 naar 4,8 rem te zetten: "Van dakraam tot" past zo op één regel in een
  kolom van 561px.
- **Eén ronding-schaal.** `--rond-s/m/l` (10/16/22px) in `stijl.css`, beide stijlen gebruiken
  dezelfde. Scherpe hoeken zaten vooral op de formuliervelden, de haarlijnroosters en de
  galerij. Bij de roosters (`.inzet`, `.feiten`, `.stappen`, `.contact__blok`) zit de ronding
  op het vlak eromheen met `overflow:hidden`, want de haarlijnen zijn 1px gaten in dat vlak.
- **Dienstkaart: tekst onder de foto** (05-10-2026, verzoek Armando en Alfred). Was tekst óp
  de foto met een donkere sluier; dat las slechter. Nu een kaart met de foto 4:3 bovenin en
  kop plus regel eronder, in beide stijlen hetzelfde. `height:auto` op `.dienst img` is niet
  optioneel: het `height`-attribuut in de HTML telt als opmaak en zolang dat een waarde heeft
  doet `aspect-ratio` niets.
- **Beoordelingen even hoog, van rand tot rand** (05-10-2026, verzoek Alfred). Elke kaart
  toont zes regels (`-webkit-line-clamp` plus een `min-height` van `6 * 1.65em`, zodat ook
  korte beoordelingen die hoogte halen); wat langer is krijgt een knop Lees meer. `site.js`
  meet pas na `document.fonts.ready`, want met de terugvalletter passen er andere aantallen
  regels in. De schuifrij hangt in `.ws__rand`, een laag buiten `.binnen`, met
  `padding:max(24px, (100% - var(--breed))/2 + 24px)`: de eerste kaart blijft in de rooilijn
  en rechts loopt de rij door tot de schermrand in plaats van afgekapt tegen de kolom.
  Bewust zonder `100vw`: dat telt op Windows de schuifbalk mee en geeft overloop.
- De bovenbalk is op de telefoon krap met de stijlwisselaar erbij. Onder 620px wordt de
  belknop een rond telefoonicoon, onder 400px gaat alles een maatje kleiner en onder 345px
  valt de belknop uit de balk (die staat vlak eronder in de hero).
- De voet had dezelfde menulinks als de bovenbalk. Op verzoek van Armando (04-10-2026) weg:
  de voet is nu logo, contactregel en KvK/BTW. Niet terugzetten zonder te vragen.
- `dist/stijl.css` — alles. Lettertypen en basiskleuren komen uit de brandingkit
  (zwart, wit, grafiet #555555, lichtgrijs #F2F2F2; Barlow Condensed Bold koppen, Inter tekst).
  Het goud #C8A24C dat hier kort in zat (hero van mhainstallaties.nl als voorbeeld) is er op
  verzoek van Armando weer uit; het palet is strikt zwart-wit-grafiet. De enige kleuren die
  er nog zijn, zijn van een ander merk: Werkspot-oranje `--ster` #F5A623 en WhatsApp-groen
  `--wa` #25D366.
  Grafiet #555555 is op verzoek van Armando (04-10-2026) breder toegepast: als vlak onder
  `.slot`, als rasterlijn in `.inzet` en `.contact__blok`, als rand om de hero-badge en de
  formuliervelden, als scheidingslijn onder de balk en boven de voet, als stapnummer in
  `.stap::before`, als initiaalcirkel in de reviewkaarten en als actieve filterknop.
  Op zwart is #555555 niet leesbaar als tekst (3,1:1), dus daar staan `--op-zwart` #cfcfcf
  en `--op-zwart-zacht` #9a9a9a; die twee vervangen de tien losse grijstinten die er stonden.
  De fotocollage bij "Bekijk ons werk" (`.inzicht__beeld`) liep op 04-10-2026 over de tekst
  eronder heen: op een telefoon stond de kop "Bekijk ons werk" bovenop de foto's en was hij
  onleesbaar. Oorzaak is geen tikfout maar het standaardgedrag van grid: een grid-item krijgt
  `min-height:auto`, dus de foto's duwden de rijen voorbij de vaste `height` van het blok en
  schilderden eroverheen. Gemeten op 360/390/430/768/1200/1440px: overal mis, tot 657px over.
  Opgelost met `min-width:0;min-height:0` op de foto's plus `overflow:hidden` op het blok.
  **Die twee regels niet weghalen** — zonder is het blok weer stuk, ook al ziet de CSS er dan
  schoner uit. Ditzelfde patroon (vaste hoogte + `1fr`-rijen + foto's) staat verder nergens
  op de site.
- `dist/_headers` — `Referrer-Policy` en `X-Content-Type-Options`. Hier stond tot 07-10-2026
  `X-Robots-Tag: noindex` over alles, zolang het een concept was. Die is eraf.
- `dist/<32 hex>.txt` — de IndexNow-sleutel. Moet op het live adres opvraagbaar zijn, anders
  weigert IndexNow de hele lijst. `scripts/indexnow.mjs` leest de bestandsnaam uit `dist/`,
  dus de sleutel staat nergens dubbel.

Bewust zo gedaan, op verzoek van de klant: geen losse dienstpagina's, geen before/after-sliders,
geen portret of naam van Robbin, foto's niet op de homepagina maar achter "Klusinzicht".

## Foto's

`fotos.json` koppelt slug → categorie → alt-tekst. De bronbestanden zijn de 38 foto's die Robbin
op 04-10-2026 stuurde, uit `~/dev/jiw-crm/uploads/`. Zeven daarvan vielen af (collages,
screenshots van Werkspot-reviews, een VELUX-logo). Van de resterende 30 bleken er twee
dubbel (`binnendeur-paneel` = `binnendeur-wit`, `binnendeur-kast` = `binnendeur-gang`,
identieke md5); die stonden twee keer in de galerij en zijn er op 04-10-2026 uit gehaald.
De overige 28 staan in `dist/foto/` als `<slug>.jpg` (max 1400px) en
`<slug>-klein.jpg` (max 760px).

Eén afgevallen foto is géén collage of screenshot: een stompe witte deur tegen een witte wand,
kale ruimte met een kabel op de vloer. Bewust niet gebruikt, maar het is echt werk van hem, dus
als hij er een wil bijzetten is dat de kandidaat.

Uit twee afgevallen screenshots zijn op 04-10-2026 op verzoek van Armando de foto's gesneden:
twee Werkspot-reviewfoto's van Teun uit Oirschot (9 feb 2025, "Binnendeuren: 9 deuren"),
een groene hal met een witte glasdeur en dezelfde hal met een paneeldeur bij de trapopgang.
De enige beelden met echte kleur in de hele set.
Bron: `jiw-crm/uploads/zmnelt7v6t5yks579mwdhwzs.jpg` en `e2bge27n60w0kwuf3h7kl9w7.jpg`,
beide 738x1600. Snede `crop=520:925:118:336` — die uitsnede ligt binnen de pijlknoppen van de
Werkspot-fotoviewer, die staan ingebrand in de screenshot en zijn er niet uit te retoucheren.
Resultaat is daardoor maar 520px breed, onder de 760 van de andere `-klein` bestanden; op een
retinascherm is dat zichtbaar zachter. **Vragen om het origineel bij Robbin of bij Teun.**
Slugs: `binnendeur-glas-groen`, `binnendeur-paneel-groen`. De eerste staat ook op de homepagina
als foto bij de dienstkaart "Binnen- en buitendeuren"; `deuren-gang` (klus halverwege,
afdekpapier, los peertje) stond daar eerst en staat nu alleen nog in de galerij.

**Tweede levering, 07-10-2026.** Robbin stuurde negen beelden na ("als je het iets vind").
Zeven daarvan zijn nieuw en staan nu in de galerij, slugs `dakkapel-steiger-voor`,
`binnendeur-kachel`, `deuren-overloop`, `binnendeur-overloop`, `barrel-sauna-vlonder`,
`tuinhuis-veranda`, `sauna-badkamer`. Bron: `jiw-crm/uploads/`, allemaal 1200x1600 behalve
het tuinhuis (1600x1200), geschaald met het ffmpeg-commando uit de git-historie.
Twee vielen af en dat is bewust:
`zj28drt3cik011ntdd7sqjzp.jpg` is een before/after-collage op felblauw met de tekst "Beafter"
erin gezet, en `aetg4twuk1t0vfmlqlc4c60p.jpg` is een collage van drie waarvan er één is
volgekrabbeld met stift (opnametekening). Van die tweede hebben we de rechterfoto wel schoon
los gekregen: dat is `binnendeur-kachel`.
Wat deze levering oplevert dat de eerste set miste: `sauna-badkamer`, `barrel-sauna-vlonder`
en `tuinhuis-veranda` zijn afgewerkt werk met kleur en daglicht erin, waar ruim de helft van
de eerste 28 een halfafgebouwde ruimte met grijs licht is. `dakkapel-steiger-voor` is de
enige foto die een dakkapelklus vanaf de straat laat zien in plaats van vanaf de steiger.
**Nog niet op de homepagina gezet** — die fotokeuze is door Armando stuk voor stuk
goedgekeurd, dus daar eerst over afstemmen. Kandidaten voor de hero-carrousel:
`barrel-sauna-vlonder` in plaats van `barrel-sauna-gazon` (zelfde onderwerp, blauwe lucht,
nieuwe vlonder eronder) en `dakkapel-steiger-voor` in plaats van `dakkapel-pannendak`.

Categorie gecorrigeerd 04-10-2026: `zolder-balken` stond onder dakramen maar toont een
afgewerkte zolder met balken en een dakkapelraam, nu verbouwing. `zolder-kamer` stond onder
verbouwing maar is een dakraam, nu dakramen.

Opnieuw genereren na een wijziging in `fotos.json`: zie het node-script in de git-historie van
deze map, of handmatig `dist/projecten/index.html` bijwerken — het is platte HTML.

## Wat van de klant komt en wat nog niet

Bevestigd (eigen opgave of openbaar op het Werkspot-profiel):

- 06 31 29 51 56, rhklusservice@outlook.com, btw NL004973060B79, KvK 92724418
- vestiging Valkenswaard; werkgebied Valkenswaard, Eindhoven, Breda, Tilburg, Utrecht,
  Amsterdam, Rotterdam, Roermond
- 5,0 gemiddeld uit 49 beoordelingen; de drie citaten staan letterlijk op het profiel
  (Jesse juli 2026, Harry Nelissen augustus 2026, Michael juni 2026)

Door Armando goedgekeurd 04-10-2026:

- de twee alinea's boven de dienstkaarten ("Met vakmanschap en oog voor detail ..." en
  "U krijgt heldere communicatie, een eerlijke prijs en werk dat klopt. Afspraak is afspraak.")
  zijn letterlijk van Armando. Hij is akkoord met "een eerlijke prijs" als belofte
- de hele site spreekt met u. Ook de herotekst, die eerst "kan je bellen" zei

Nog niet bevestigd — eerst voorleggen:

- de teksten bij "wat we doen", "over ons" en de vier stappen zijn door ons geschreven
- de foto's bij schilderwerk, lichtkoepels en klein onderhoud zijn vervangers uit zijn eigen
  set, geen foto van die dienst. Vragen om echte foto's voordat dit live gaat
- "vaste prijs vooraf" en "vrijblijvend langskomen zonder kosten" zijn beloftes die hij zelf
  moet onderschrijven
- **"Ook als u buitengesloten bent" op de slotenkaart is de enige regel op de site die om
  snelheid vraagt.** Wie buitengesloten staat belt binnen vijf minuten drie bedrijven en gaat
  met de eerste in zee die kan. Robbin moet dus zeggen of hij daar überhaupt voor uitrijdt,
  en zo ja binnen welke tijd en of dat ook 's avonds en in het weekend is. Zegt hij nee, dan
  wordt de regel "Cilinders en sloten vervangen, hang-en-sluitwerk op deuren en ramen" en
  blijft buitensluiting eraf. Uit zijn beoordelingen blijkt wel dat hij snel kan zijn
  (Julisca: met spoed, dezelfde dag; Gemonde: zelfde dag; Waalre: nog dezelfde dag), alleen
  is dat iets anders dan een spoeddienst beloven. In zijn 49 beoordelingen staat geen enkele
  slotenklus; hang-en-sluitwerk komt alleen voor bij de buitendeur van Marianne (juli 2025)
- opruimen en afvoeren staat nu in "over ons", maar dat is geen belofte van ons: Julisca,
  Kees en de buitendeurklant van juli 2025 schrijven het zelf in hun beoordeling. Idem het
  regelen van een stukadoor (Milad, feb 2025)
- "10+ jaar ervaring" staat als derde vinkje in de hero. Op verzoek van Armando
  (04-10-2026), overgenomen uit mhainstallaties.nl. Robbin heeft nooit een aantal jaren
  genoemd en het staat ook niet op zijn Werkspot-profiel. Laten bevestigen of weghalen
- **de acht plaatspagina's gaan ervan uit dat hij er ook echt naartoe rijdt.** Het werkgebied
  staat zo op zijn Werkspot-profiel, dus de plaatsnamen zijn van hem, maar van Utrecht,
  Amsterdam en Rotterdam staat geen enkele klus in zijn 49 beoordelingen. Laten bevestigen
  vóór ze de lucht in gaan, anders staat er een pagina online voor werk dat hij niet wil.
  De reistijden in de intro ("een kwartier", "ruim een uur", "anderhalf uur") zijn van mij,
  gemeten vanaf Valkenswaard. De zin "in Valkenswaard en de dorpen eromheen werken we het
  vaakst" is een aanname; wat wél hard is, staat op de Eindhoven-pagina: 17 van de 49
  beoordelingen komen uit Eindhoven, meer dan uit welke andere plaats ook.
- **de slotpagina wacht op drie antwoorden van Robbin.** Zonder die antwoorden kan de pagina
  blijven staan zoals hij nu is, maar er staat wel iets op dat hij niet gezegd heeft:
  1. *Spoed.* **Dit is sinds 07-10-2026 de belangrijkste vraag van de drie**, want op verzoek
     van Armando staat spoed nu vooraan op de pagina: in de titel, de h1, de strook in de
     hero, een eigen sectie en de eerste veelgestelde vraag. Wat er staat is wat aan de
     telefoon waar te maken is ("bel, dan hoort u direct of we vandaag kunnen komen",
     "een vaste tijd kunnen we niet beloven"). Wat er níét staat is een aanrijtijd,
     24-uurs bereikbaarheid of een avond- en weekenddienst.
     Rijdt hij daarvoor uit, en ook 's avonds en in het weekend? Zegt hij ja, dan kan
     "slotenmaker" erbij en wordt de pagina een stuk sterker, want dat is waar echt op
     gezocht wordt. Zegt hij nee, dan moet de spoedsectie terug naar "op korte termijn" en
     gaat buitengesloten uit de h1 en de titel; dan blijft het slot vervangen op afspraak.
  2. *Prijs.* "Wat er nodig is en wat het kost, hoort u voordat we beginnen" en "dan hoort u
     wat het wordt voordat we komen". Dat hoort bij de lijst met "vaste prijs vooraf".
  3. *Hoe ver rijdt hij hiervoor?* De pagina noemt Valkenswaard, Dommelen, Waalre, Leende,
     Bergeijk, Veldhoven en Eindhoven, en zegt dat sloten verder weg alleen in combinatie met
     ander werk gaan. Dat is mijn keuze, niet de zijne: voor een cilinder rijd je geen
     anderhalf uur naar Amsterdam, maar hij mag die grens zelf trekken.
  Ook hier: **in zijn 49 beoordelingen staat geen enkele slotenklus.** De zeven beoordelingen
  op de pagina gaan over snel reageren, deuren, kozijnen en hang-en-sluitwerk (Maaike noemt
  hang- en sluitwerk letterlijk). Dat is het dichtstbijzijnde bewijs dat er is. Krijgt hij
  één review over een slot, dan hoort die hier als eerste.
  De drie over snelheid zijn de enige drie in alle 41 die dezelfde dag of een reactietijd
  met zoveel woorden noemen: 801925 (Julisca, "binnen 5 minuten"), 827235 (Gemonde, "kon de
  zelfde dag al") en 799114 (Waalre, "nog dezelfde dag"). Meer bewijs voor snelheid is er
  niet; wordt dat gevraagd, dan moet het van nieuwe reviews komen.
- `binnendeur-glas-groen` en `binnendeur-paneel-groen` zijn uit de Werkspot-review van Teun
  uit Oirschot gesneden. Het werk is van Robbin, de foto's zijn door de klant gemaakt en
  geüpload. Voor een concept prima, voor go-live eerst het origineel én toestemming vragen
- geen keurmerken (zegt hij zelf), verzekering onbekend. Op zijn Werkspot-profiel staat wel
  een badge "Biedt garantie". Navragen wat die garantie precies dekt, dan kan dat op de site
- **alle beoordelingen met tekst staan sinds 07-10-2026 op de homepagina** (wens van Robbin
  zelf, via Armando). Dat zijn er 41 van de 49; de andere acht gaven alleen sterren en hebben
  dus niets te laten zien. De kaarten zijn **gegenereerd door `maak-reviews.mjs`**
  (`node maak-reviews.mjs`) uit `werkspot-reviews.json`, in het blok tussen
  `<!-- beoordelingen:begin -->` en `<!-- beoordelingen:einde -->` in `dist/index.html`.
  Die kaarten niet met de hand bewerken, de volgende ronde overschrijft het.
  Drie dingen die uit die set komen en niet uit ons hoofd:
  - **één beoordeling is geen vijf sterren.** Soumitra (Eindhoven, oktober 2024) staat op 8
    van de 10 en krijgt dus vier sterren op de kaart. Het gemiddelde over alle 49 is 4,98;
    Werkspot rondt dat zelf af naar 5,0, dus de claim op de site blijft kloppen.
  - **13 van de 41 kwamen zonder naam uit de scrape.** Die kaart zet de plaats op de naamregel
    ("Klant uit Eindhoven"), en als ook die ontbreekt "Klant via Werkspot". Er wordt geen naam
    bij verzonnen. Staan ze op het profiel wél met naam, dan kan dat alsnog.
  - de namen Marc (nov 2025) en Marianne uit Maarheeze (juli 2025) zaten in de eerste scrape
    maar niet in `werkspot-reviews.json`. Die staan als uitzondering in `NAMEN` in
    `maak-reviews.mjs`, anders waren ze bij het genereren weggevallen.
  De pijlen in de rij schuiven sinds 07-10-2026 een heel scherm vol op in plaats van één
  kaart; met 41 kaarten was dat anders 40 keer klikken (`stap()` in `dist/site.js`).
  De acht plaatspagina's houden hun drie beoordelingen uit die hoek van het land.
  De regelafbrekingen van Tom en Marianne staan er nog, letterlijk zoals op Werkspot.
  `werkspot-reviews.json` is de volledige set van 04-10-2026: alle 49 beoordelingen, met
  datum, plaats en het soort klus. Daar zitten de enige reviews in die iets anders dan deuren
  bewijzen:
  Guido & Ester (twee dakramen plus lood), Kees uit Esch (boeiboorden), Bert Schellekens
  (twee dakkapellen trespa), Milad (verlaagd plafond zolder), Sigfried (balustrade trap)
- een veelgestelde-vragen-blok is er niet; die vraag heeft hij nooit beantwoord
- op Werkspot staat zijn naam als "Rh klusservice" met kleine k, en schilderwerk en aanbouw
  staan daar niet bij de diensten terwijl ze hier wel op de site staan
- het formulier vraagt sinds 06-10-2026 alleen naam, telefoon, omschrijving en foto's
  (keuze door Armando). Soort klus, soort pand, wanneer, plaats en e-mail zijn eruit. Er komt
  dus geen mailadres meer binnen: Robbin kan alleen terugbellen of appen. De plaats kan hij
  alleen uit de omschrijving halen, daar staat nu een voorbeeld met een plaatsnaam in.
  Sinds 07-10-2026 gaat de aanvraag naar onze eigen worker; zie "Het formulier" bovenaan.
  Nog niet getest met een echte telefoonfoto van een paar MB — de grens ligt nu op 10 MB per
  bestand en 50 MB samen, dus de kans dat het klemt is klein, maar gemeten is het niet.
- de leads gaan sinds 07-10-2026 rechtstreeks naar Robbin (`rhklusservice@outlook.com`). Wij
  zien ze dus niet meer meekijken; een kapot formulier merkt alleen hij. En: niet meer testen
  met een echte inzending, die landt in zijn mailbox.

## Naar live: wat klaar is en wat nog moet (07-10-2026)

Gedaan op 07-10-2026, na de vragen van Alfred over SEO:
- **og-plaatje.** 1200x630, met `og:image`, `og:url`, `og:site_name`, `og:locale` en
  `twitter:card` op alle elf pagina's. Daarvoor kwam er bij het delen in WhatsApp helemaal geen
  plaatje mee. Eerst was dat een uitsnede van `overkapping-tuin.jpg`; sinds 08-10-2026 is het
  **`dist/foto/og-rh-klusservice-logo.jpg`**, het witte woordmerk op zwart, 1020 van de 1200
  breed. Robbin koos die variant via Armando uit vier proeven (foto zonder logo, logo klein,
  logo groot, foto met logo in de hoek), die elk een eigen tijdelijk adres hadden omdat WhatsApp
  een kaartje per URL onthoudt. Die drie proefadressen zijn weg; een redirect rule op de zone
  stuurt `/deel-logo*` en `/deel-foto-logo*` met 301 naar de homepagina, want ze zijn nog
  gedeeld in WhatsApp. Gebouwd door `maak-deelplaatje.mjs` (was `maak-deelproef.mjs`).
  De foto-uitsnede blijft bestaan als `FOTO_BEELD` en staat in het schema: Google wil in
  `image` zien wat hij maakt, geen bedrijfsnaam in witte letters.
- **Schema.** De homepagina had geen `url`, `logo`, `image` en geen openingstijden, projecten had
  helemaal geen schema. De gedeelde velden staan nu één keer in `BEDRIJF` in `onderdelen.mjs` en
  worden door beide generatoren gebruikt; de homepagina en projecten hebben dezelfde JSON met de
  hand (die twee zijn handwerk, zie de kop van `onderdelen.mjs`). Projecten heeft nu
  `CollectionPage` + `BreadcrumbList` die aan `#bedrijf` hangen.
- **Openingstijden** 7 dagen per week, `07:00`-`23:00`. Bevestigd door Armando 07-10-2026.
  Stond eerst op `00:00`-`23:59`: zijn "07/23 7 dagen in de week" had ik als 24/7 gelezen.
- **sameAs** heeft nu ook het Google-profiel: `https://share.google/A8lQXq9hEHgqI43vI`.
  Dat is de deel-link; die kaatst door naar het profiel maar is zelf geen maps-URL. De nette
  variant is de `https://www.google.com/maps/place/?q=place_id:...` link uit het profiel zelf.
- Geen React, dus pre-rendering is niet van toepassing: elke pagina levert zijn volle tekst uit.
  `sitemap.xml` (11 pagina's) en `robots.txt` stonden er al.

De lanceerlijst is op 07-10-2026 afgewerkt:
1. ~~**Domein.**~~ `rhklusservice.nl` en `www` staan op de Worker `rh-klusservice`, alle URL's
   omgezet. ~~301 van `www` naar apex~~ staat er ook (redirect rule, zie boven).
   ~~Conceptadres~~ 301't nu naar het echte domein.
2. ~~**Eén stijl.**~~ Alleen **Midnight clean** nog over. Zie "Eén stijl" hierboven voor wat er
   precies uit is.
3. ~~**FormSubmit.**~~ Van de baan: het formulier gaat naar onze eigen worker, dus er hoeft
   niemand meer een bevestigingsmail aan te klikken. Live getest.
4. ~~**noindex eraf.**~~ `dist/_headers` draagt hem niet meer. IndexNow gemeld (202).
5. **Google-profiel**: het websiteveld moet naar het nieuwe domein wijzen. Dat is backendwerk
   bij de klant, daar heeft Claudius geen toegang toe. **Nog open.**
6. **Search Console**: domein aanmelden en de sitemap indienen. **Nog open**, zie `SEO.md`.
