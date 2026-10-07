# Novera Bouw — SEO, beginstand

Dit is de nulmeting. Wat hier staat is wat er op **03-10-2026** waar was, zodat latere
veranderingen ergens tegen afgezet kunnen worden. Bijwerken bij elke meting, niets weggooien.

## Beginstand 03-10-2026

| | |
| --- | --- |
| Domein | `noverabouw.nl` |
| Zone in Cloudflare | aangemaakt 30-09-2026 18:47 UTC, actief 19:20 UTC |
| Eerste deploy naar het echte adres | 03-10-2026 ~10:30 UTC |
| Geïndexeerde pagina's op dit domein | **0 voor zover wij kunnen zien** — het domein is op 30-09 bij Cloudflare gekomen en heeft vóór vandaag geen site uitgeleverd |
| Eerder geïndexeerd materiaal | `novera-bouw-concept.jouwidealewebsite.nl` heeft van 28-09 t/m 03-10-2026 open en indexeerbaar gestaan, met canonicals naar zichzelf. Dat adres 301't sinds vandaag per pad hierheen, dus wat Google erover weet verhuist mee |
| Backlinks | geen |
| Google Search Console | **nog niet aangemeld** (zie hieronder, punt 1) |
| Bing Webmaster Tools | nog niet aangemeld, maar de 30 adressen zijn via IndexNow gemeld (200 OK, 03-10-2026) |
| Google Bedrijfsprofiel | nog niet gecontroleerd (zie punt 3) |

Het domein is dus zo goed als nieuw voor zoekmachines. Niet "we moeten posities terugwinnen",
maar "we moeten eerst bestaan". Reken op weken, niet dagen, voor de eerste vertoningen.

## Wat er technisch staat

Alles hieronder is gemeten op het live adres, niet aangenomen.

- **Volledig pre-rendered.** Dertig statische HTML-pagina's, vijftien per taal. Geen JS nodig om
  de inhoud te lezen: tekst, koppen, menu, telefoonnummer, prijzen en JSON-LD staan in de HTML
  van de eerste byte af. Dit is de reden dat de site bij de overzetting niet naar Vite + React is
  omgebouwd. Bij die overzetting zijn vier dingen uit `app.js` naar de HTML gehaald die anders
  achter JavaScript bleven staan — de contactgegevens waren daarvan de belangrijkste.
- **Eén adres per pagina.** `html_handling: "drop-trailing-slash"`. De canonical, de drie
  hreflang-regels en de sitemap gebruiken allemaal die vorm, dus geen enkel geïndexeerd adres
  hoeft om te leiden. De Engelse startpagina is `/en`, niet `/en/` — zie "Opgelost op 03-10".
- **Eén host.** `www.noverabouw.nl` → 301 → apex, met pad en querystring, via een redirect rule
  op de zone (dus vóór de worker, en ook op paden die de worker niet ziet).
- **Oude conceptadres leidt om.** `novera-bouw-concept.jouwidealewebsite.nl` 301't per pad naar
  het nieuwe adres (worker in `jiw-concepts/novera-bouw/omleiding.mjs`), met `/en/` → `/en`.
  Tot vandaag leverde dat adres nog een complete tweede kopie van de site met status 200 uit;
  dat is precies de situatie waarin Google zelf moet kiezen welke van de twee hij toont.
- **Twee talen, netjes gekoppeld.** `hreflang` nl / en / x-default=nl op elke pagina, in beide
  richtingen, plus `xhtml:link` per adres in de sitemap. De build stopt als een pagina zijn
  tegenhanger mist — een losse hreflang is erger dan geen.
- **Sitemap** op `/sitemap.xml`: 30 adressen, startpagina's eerst, met `lastmod` per pagina uit
  de laatste wijziging van de bron zelf (niet de builddatum — dan betekent `lastmod` niets).
  Alle 30 zijn op het live adres nagelopen en geven 200: geen omleiding, geen 404 in de sitemap.
- **robots.txt** laat alles toe behalve `/api/`.
- **Structured data**: `GeneralContractor` per pagina met telefoon, volledig postadres
  (Albertine Agneslaan 350, 3136 NJ Vlaardingen), KvK 83882057 als `identifier`, `areaServed`
  Vlaardingen, `knowsLanguage` nl + en, en de negen diensten als `makesOffer`. De JSON-LD is op
  drie pagina's door een parser gehaald, dus het is geldige JSON en geen bijna-JSON.
- **Echte 404.** Een onbekend pad geeft `404.html` mét status 404, niet de startpagina met 200.
  Dat laatste leest Google als een soft 404.
- **Twee oude adressen blijven omleiden.** `/airco` en `/en/air-conditioning` zijn op 30-09 van
  de site gehaald en 301'en naar het dienstenoverzicht in plaats van op een 404 te lopen.
- **Snel en licht.** 42,74 KiB totaal (11,02 KiB gzip), uitgeleverd als Static Assets vanaf de
  rand; de worker draait alleen op `/api/*` en de twee airco-adressen. Beeld is webp met vaste
  `width`/`height`, kopbeeld `fetchpriority="high"` en vooraf geladen.
- **Geen JS-gated inhoud.** Niets staat op `opacity:0` te wachten op een observer.
- **IndexNow staat aan.** `pnpm --filter @jiw/novera-bouw indexnow` meldt de adressen uit
  `dist/sitemap.xml` aan bij Bing, Yandex, Seznam en Naver. De sleutel is het `.txt`-bestand in
  `src/`; die is openbaar bedoeld. Google doet niet mee aan IndexNow — daar blijft Search Console
  de enige weg, en dat is de reden dat punt 1 hieronder het belangrijkste punt is.
  Draai dit na elke inhoudelijke wijziging.

Gemeten: **6984 controles** in een echte browser (`_ref/kijk.mjs`), beide talen, desktop en
telefoon, tegen het live adres. Zonder fout.

## Opgelost op 03-10-2026

- **De Engelse startpagina stond op twee adressen.** De canonical van `/en` wees naar
  `https://noverabouw.nl/en/`, de sitemap zette datzelfde adres als `<loc>`, en 48 links in de
  site (elke taalknop) gingen erheen. Maar Cloudflare laat de slash op het eind vallen en stuurt
  `/en/` met een 307 naar `/en`. Daarmee wees de canonical van die pagina naar een omleiding naar
  zichzelf, stond er in de sitemap een omleiding in plaats van een pagina, en liep elke taalknop
  via een extra sprong. Dat is precies het signaal waardoor Google een startpagina kan laten
  staan. `pad()` in `bouw.mjs` geeft nu `/en`; de Nederlandse startpagina blijft `/`, want de
  root heeft geen slash om te laten vallen. `_ref/kijk.mjs` stond op het oude adres en keurde de
  goede situatie af — ook rechtgetrokken.
- **Het conceptadres leverde een tweede complete kopie uit.** Zie hierboven.
- **Geen KvK en geen `areaServed` in de JSON-LD.** Toegevoegd.

## Wat nog niet kan zonder jou

Dit zijn de stappen die een Google-account of een besluit nodig hebben; ik kan ze niet zelf doen.

1. **Google Search Console**: property voor `noverabouw.nl` aanmaken (domain property,
   verifiëren via een TXT-record — dat record kan ik erin zetten zodra je de waarde doorgeeft),
   daarna `https://noverabouw.nl/sitemap.xml` indienen en de startpagina via URL-inspectie laten
   ophalen. Dit is de snelste route naar een eerste crawl. Zet in dezelfde sessie het oude
   conceptadres er ook in, dan zie je de 301's verwerkt worden.
2. **Bing Webmaster Tools**: zelfde twee stappen. Bing is hier geen bijzaak — het voedt ook
   ChatGPT's zoekresultaten.
3. **Google Bedrijfsprofiel**: bestaat er al een profiel op Albertine Agneslaan 350? Zo ja, dan
   moet de website daarin naar `https://noverabouw.nl` en moeten naam, adres en telefoon
   letterlijk gelijk zijn aan wat er nu op de site en in het JSON-LD staat. Voor een bouwbedrijf
   in Vlaardingen levert dat profiel meer op dan alle on-page werk bij elkaar. Let op: het adres
   is een woonadres, dus Ekrem moet zelf besluiten of hij dat als bedrijfsadres wil tonen of met
   een servicegebied zonder adres wil werken.
4. **Welke plaatsen bedient hij echt?** Op de hele site staat alleen Vlaardingen, dus dat is ook
   het enige dat in `areaServed` staat. Schiedam, Maassluis en Rotterdam liggen om de hoek en
   zitten vermoedelijk in zijn bereik, maar dat heeft hij nooit gezegd en ik zet geen gebied in
   de structured data dat hij niet zelf noemt. Eén appje en dit wordt een stuk sterker.
5. **Beslissing: blijft Engels erin?** Twee talen betekent twee keer zoveel te indexeren voor een
   publiek dat grotendeels Nederlands zoekt. Het staat er omdat Ekrem Engels spreekt en in de
   regio Rotterdam veel expats wonen. Goede reden om het te houden, maar het is wel een keuze.

## Open punten die ik wel zie maar niet alleen moet besluiten

- **Dekt de pakketprijs het materiaal?** Dit staat al sinds 29-09 open en het is geen SEO-punt
  maar het grootste punt op de site: op de kaarten staat "Inclusief materiaal en btw" en dat
  hebben wij op Armando's woord gezet, niet op dat van Ekrem. Het staat op de startpagina.
- **Twee foto-eisen.** Al het beeld op de site is door ons gegenereerd, op elf telefoonfoto's van
  Ekrem na. Voor een bouwbedrijf zijn echte projectfoto's het sterkste dat er is, voor zoeken én
  voor overtuigen. Eén liggende foto van een opgeleverde badkamer lost het kopbeeld en het
  badkamerblok in één keer op.
- **Geen plaatspagina's.** De site heeft negen dienstpagina's plus een badkamerpagina, geen
  pagina's per stad. Voor "badkamer renoveren Vlaardingen" is dat op termijn wat ontbreekt. Dat
  is echt werk, geen knop, en het moet van echte klussen komen — niet van tien keer dezelfde
  tekst met een andere stadsnaam erin. Zie ook punt 4 hierboven: zonder servicegebied van Ekrem
  is er geen lijst om zulke pagina's op te baseren.
- **Trailing-slash redirect is een 307.** Cloudflare stuurt `/contact/` met een 307 naar
  `/contact`, niet met een 301. Geen enkel gepubliceerd adres heeft een slash op het eind, dus
  niemand komt daar langs; een 301 zou een worker-aanroep op elk paginaverzoek kosten. Bewust zo
  gelaten.
- **Webfonts komen van Google.** Plus Jakarta Sans en Inter worden van `fonts.googleapis.com`
  geladen. Zelf hosten is sneller en netter voor de AVG; het is niet gedaan omdat het de
  merkhandleiding-letters precies moet blijven treffen. Los op te pakken.
