# SEO — Velvet Cakes by Anka

Stand 18-10-2026, de dag van de verhuizing naar `velvetcakesbyanka.nl`.

## Wat er stond, en waarom dat niet te indexeren was

De conceptsite op `velvet-cakes-2-concept.klantenkraan.nl` had tien pagina's. De
Engelse en de Roemeense versie ontstonden pas **in de browser**: `i18n.js`
wisselde per element de tekst om, op basis van `localStorage` en anders van de
browsertaal.

Voor een bezoeker werkte dat. Voor vindbaarheid betekende het:

| | concept | nu |
| --- | --- | --- |
| adressen | 10 | 31 (10 nl + 10 en + 10 ro + 404) |
| `lang` op `<html>` | `nl`, ook op de Roemeense tekst | de taal van de pagina |
| hreflang | geen | 3 talen + `x-default`, wederkerig |
| canonical | naar het conceptdomein | naar zichzelf op de apex |
| tekst in de html | nl; en/ro in een `.js`-bestand | alle drie voluit |
| sitemap | 10 adressen, conceptdomein | 30 adressen met hreflang per regel |
| og/twitter | geen | per pagina, met een echte foto |
| JSON-LD | geen | `Bakery` + `BreadcrumbList` |
| formulier | WhatsApp-bericht | `POST`, bevestiging per mail |

Het Engels en het Roemeens bestonden dus letterlijk nergens als pagina. Wie de
Roemeense versie doorstuurde, stuurde een Nederlandse pagina door — en Google
heeft die twee talen nooit kunnen zien.

## Voorgerenderd

Geen hydratie, geen framework, geen tekst die door JavaScript wordt ingevuld.
`i18n.js` is weg; dat was het enige script dat echte inhoud aanraakte. Wat er nog
aan JavaScript draait is `site.js` (uitklapmenu, meelopende balk, het versturen
van het formulier) en `galerij.js` (de grote fotoweergave) — allebei
progressieve verbetering op inhoud die al in de html staat.

Dat is te controleren met `curl` zonder browser: elke pagina geeft zijn volledige
tekst, in zijn eigen taal. `tools/vooraf.mjs` houdt het zo en faalt de bouw op
een pagina die niet heel is — inclusief een woordvloer van 150, zodat een blok
dat morgen door een script wordt ingevuld de bouw stilzet in plaats van stil weg
te vallen.

## Taalopzet

- Nederlands op de wortel (`/`, `/taarten`), want dat is de taal waarin de site
  geschreven is en waarin haar klanten in Bergen op Zoom zoeken.
- Engels onder `/en/`, Roemeens onder `/ro/`.
- `x-default` wijst naar het Nederlands.
- Een map en geen subdomein of queryparameter: een map erft het domein, dus alles
  wat de apex aan vertrouwen opbouwt werkt ook voor `/ro/`.

**Geen omleiding op de browsertaal.** Die zat in het concept wel (via
`localStorage` plus `navigator.language`). Hij is er bewust uit: zo'n omleiding
stuurt een Nederlandse bezoeker met een Engelse telefoon van de pagina af die hij
net aanklikte, en voor Google is het een adres dat per bezoek iets anders
uitlevert. De taalkiezer staat op elke pagina en is nu drie echte links — dus
deelbaar, en leesbaar als een set.

**De slug is in alle drie de talen hetzelfde** (`/en/taarten`, niet `/en/cakes`).
Bewuste keuze: een vertaalde slug is iets beter voor het Engels, maar hij
verandert ook elk intern adres, elke hreflang en elke sitemap-regel, en een fout
daarin kost een pagina uit de index. De hreflang-set vertelt Google al in welke
taal een pagina staat; de slug doet dat werk niet. Willen we het later wel, dan
is het een tabel in `bouw.mjs` en niet een verbouwing van de links.

## JSON-LD

`Bakery` op elke pagina: naam, omschrijving, url, foto, logo, telefoon, mail,
`priceRange`, plaats, `areaServed` en haar Instagram en Facebook als `sameAs`.
Dat is het blok waar Google een lokaal bedrijf uit haalt, en "Bergen op Zoom" is
precies waar haar klanten op zoeken.

### Haar Google-bedrijfsprofiel

Sinds 27-10-2026 staat haar profiel in `sameAs` en in `hasMap`, als
`https://maps.google.com/?cid=7038032441905336788`. De cid-vorm is de enige
stabiele: een `share.google`-link is een doorverwijzing die Google mag
intrekken, en een `/maps/place/`-url draagt de naam en de coordinaten in het pad
en breekt zodra ze iets in het profiel wijzigt. Het profiel is geclaimd,
categorie Taartenwinkel, en staat op zeven dagen 07:00–23:00 — gelijk aan
`openingHoursSpecification`. `tools/vooraf.mjs` controleert die twee samen en
stopt de bouw als er een van wegvalt.

> **Er is een tweede geclaimd profiel.** Cid `3187555844262572482`, zelfde
> telefoonnummer en zelfde website, zonder adres (Google zet zo'n profiel op het
> middelpunt van Nederland), ma–za 08:00–20:00, een foto. Zolang dat er staat
> splitst het reviews, foto's en lokale signalen over twee profielen en kiest
> Google zelf welk er bij een zoekopdracht verschijnt. Dat is iets voor Anka:
> het dubbele profiel laten verwijderen of samenvoegen in de profielbeheerder.
> Dit blok wijst bewust naar het profiel mét adres.

**De plaats loopt uiteen met het profiel.** Het profiel staat op Halsteren
(Dr. Ensinkstraat 16, 4661 EH), de site zegt Bergen op Zoom. Halsteren hoort bij
de gemeente Bergen op Zoom, dus geen van beide is onwaar, en Bergen op Zoom is
waar op gezocht wordt. Laat staan tenzij iemand bewust kiest om de site op
Halsteren te zetten.

Het adres is **alleen de plaats en niet de straat.** Haar huisadres staat in haar
algemene voorwaarden omdat dat wettelijk moet, maar het in de structured data van
elke pagina zetten is het breed rondsturen van het huisadres van iemand die thuis
werkt.

`BreadcrumbList` op elke pagina behalve de startpagina — hetzelfde kruimelpad dat
er in beeld al staat.

**Geen `aggregateRating` en geen `review`.** Ze heeft geen reviews op deze site,
en een sterrenblok zonder reviews is precies waar Search Console een handmatige
maatregel voor uitdeelt.

`priceRange` is `€€`, afgeleid van haar eigen prijslijst (29 tot 38 per kilo).

## Omleidingen en duplicaten

Een site die op twee hostnamen 200 geeft, concurreert met zichzelf.

- `www` → apex, 301, zone-regel. Een canonical alleen laat twee hosts 200 geven.
- Elk `.html`-adres → de schone vorm, 301 in de worker.
- `eclairs` → `vruchtengebak`, `choux`/`cupcakes` → `choux-cupcakes`, per taal.
- `velvet-cakes-2-concept.klantenkraan.nl` → `velvetcakesbyanka.nl`, 301,
  padbehoudend. Dit was de belangrijkste: die host leverde een complete kopie van
  dezelfde site uit, met een `robots.txt` die alles toestond.

**Nog open:** `velvet-cakes-concept.klantenkraan.nl` (concept 1) geeft nog 200 en
is indexeerbaar. Dat is een ander ontwerp van dezelfde onderneming en het
concurreert op dezelfde zoektermen. Omleiden of weghalen is een keuze voor
Armando, want hij heeft dat concept actief naast dit gebruikt.

## Beginstand

Nieuw domein, geen geschiedenis: er stond nooit een site op `velvetcakesbyanka.nl`,
alleen haar Purelymail-mailbox. Dus geen bestaande posities om te behouden, en
geen migratie-risico — alleen opbouw.

Waar de inhoud zich op richt, ongezocht en ongemeten, puur wat er feitelijk op de
pagina's staat:

- de plaats in elke titel en in de `Bakery`
- een eigen pagina per soort (taarten, vruchtengebak, desserts, macarons, choux &
  cupcakes, cozonac) in plaats van één assortimentspagina
- echte prijzen op een eigen pagina — iemand die zoekt wat een bruidstaart kost,
  vindt een bedrag en geen contactformulier
- een smaakkaart met haar negentien smaken
- cozonac in het Roemeens op een eigen adres: dat is een term waar in Nederland
  weinig op staat en waar haar eigen kring wél op zoekt

## Wat nog gedaan moet worden, en niet van hier kan

1. **Search Console.** Het domein aanmelden en `https://velvetcakesbyanka.nl/sitemap.xml`
   indienen. Dat vraagt toegang tot een Google-account; vanaf deze machine kan het
   niet. Dit is de snelste manier om de 30 adressen opgehaald te krijgen.
2. **Google Business Profile.** Voor een bakker in Bergen op Zoom weegt dat
   zwaarder dan alles op deze lijst bij elkaar. Hoort aan haar naam te staan, niet
   aan de onze.
3. **Haar Instagram en Facebook naar het nieuwe adres.** Daar staat nu nergens een
   link naar `velvetcakesbyanka.nl`, en dat zijn de twee plekken waar haar
   publiek al zit.

Niets gedaan met zoekvolume of concurrentieanalyse: er is geen onderzoek gedaan,
dus staat er ook geen bewering over.
