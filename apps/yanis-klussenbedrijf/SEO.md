# Yanis Klussenbedrijf — SEO, beginstand

Dit is de nulmeting. Wat hier staat is wat er op **02-10-2026** waar was, zodat latere
veranderingen ergens tegen afgezet kunnen worden. Bijwerken bij elke meting, niets weggooien.

## Beginstand 02-10-2026

| | |
| --- | --- |
| Domein | `yanisklussenbedrijf.nl` |
| Zone in Cloudflare | aangemaakt 02-10-2026 07:18 UTC, actief 07:49 UTC |
| Eerste deploy naar het echte adres | 02-10-2026 ~11:00 UTC |
| Geïndexeerde pagina's | **0** — het domein heeft tot vandaag nooit een A-record gehad, er is niets te indexeren geweest |
| Backlinks | geen |
| Google Search Console | **nog niet aangemeld** (zie hieronder) |
| Bing Webmaster Tools | nog niet aangemeld |
| Google Bedrijfsprofiel | nog niet gecontroleerd |

Het domein is dus nieuw voor zoekmachines. Niet "we moeten posities terugwinnen", maar "we
moeten eerst bestaan". Reken op weken, niet dagen, voor de eerste vertoningen.

## Wat er technisch staat

Alles hieronder is gemeten op het live adres, niet aangenomen.

- **Volledig pre-rendered.** Veertien statische HTML-pagina's. Geen JS nodig om de inhoud te
  lezen: de tekst, de koppen, het menu en het JSON-LD staan in de HTML van de eerste byte af.
  Dit is de reden dat de site niet naar React is omgebouwd bij de overzetting.
- **Eén adres per pagina.** `html_handling: "drop-trailing-slash"`. De canonical, de drie
  hreflang-regels en de sitemap gebruiken allemaal die vorm, dus geen enkel geïndexeerd adres
  hoeft om te leiden. De Engelse startpagina is `/en`, niet `/en/`.
- **Eén host.** `www.yanisklussenbedrijf.nl` → 301 → apex, met pad en querystring, via een
  redirect rule op de zone (dus vóór de worker, en ook op paden die de worker niet ziet).
- **Oude conceptadres leidt om.** `yanis-klussenbedrijf-concept.jouwidealewebsite.nl` heeft een
  paar dagen indexeerbaar opengestaan met canonicals naar zichzelf. Dat adres 301't nu per pad
  naar het nieuwe (worker in `jiw-concepts/yanis-klussenbedrijf/omleiding.mjs`). Weghalen zou
  een foutpagina geven en het oude adres juist laten staan.
- **Twee talen, netjes gekoppeld.** `hreflang` nl / en / x-default=nl op elke pagina, in beide
  richtingen, plus `xhtml:link` per adres in de sitemap. De build stopt als een pagina zijn
  tegenhanger mist — een losse hreflang is erger dan geen.
- **Sitemap** op `/sitemap.xml`: 14 adressen, startpagina's eerst, met `lastmod` per pagina uit
  de laatste wijziging van de bron zelf (niet de builddatum — dan betekent `lastmod` niets).
- **robots.txt** laat alles toe behalve `/api/`.
- **Structured data**: `GeneralContractor` per pagina met telefoon, volledig postadres
  (Kromhoutlaan 3, 2033 WJ Haarlem), KvK als `identifier`, `areaServed` Noord-Holland /
  Amsterdam / Haarlem, en de vijf diensten als `makesOffer`.
- **Echte 404.** Een onbekend pad geeft `404.html` mét status 404, niet de startpagina met 200.
  Dat laatste leest Google als een soft 404.
- **Snel en licht.** 38,67 KiB totaal (9,38 KiB gzip) aan HTML/CSS/JS, uitgeleverd als Static
  Assets vanaf de rand; de worker draait alleen op `/api/*`. Beeld is webp met vaste
  `width`/`height`, kopbeeld `fetchpriority="high"` en vooraf geladen.
- **Geen JS-gated inhoud.** Niets staat op `opacity:0` te wachten op een observer.

Gemeten: 3214 controles in een echte browser (`scripts/kijk.mjs`), beide talen, desktop en
telefoon, tegen het live adres. Zonder fout.

## Wat nog niet kan zonder jou

Dit zijn de stappen die een Google-account of een besluit nodig hebben; ik kan ze niet zelf doen.

1. **Google Search Console**: property voor `yanisklussenbedrijf.nl` aanmaken (domain property,
   verifiëren via een TXT-record — dat record kan ik erin zetten zodra je de waarde doorgeeft),
   daarna `https://yanisklussenbedrijf.nl/sitemap.xml` indienen en de startpagina via URL-inspectie
   laten ophalen. Dit is de snelste route naar een eerste crawl.
2. **Bing Webmaster Tools**: zelfde twee stappen. Bing is hier geen bijzaak — het voedt ook
   ChatGPT's zoekresultaten.
3. **Google Bedrijfsprofiel**: bestaat er al een profiel op Kromhoutlaan 3? Zo ja, dan moet de
   website daarin naar `https://yanisklussenbedrijf.nl` en moeten naam, adres en telefoon letterlijk
   gelijk zijn aan wat er nu op de site en in het JSON-LD staat. Voor een klussenbedrijf in Haarlem
   levert dat profiel meer op dan alle on-page werk bij elkaar.
4. **Beslissing: blijft Engels erin?** Twee talen betekent twee keer zoveel te indexeren voor een
   publiek dat grotendeels Nederlands zoekt. Engels staat er omdat Yanis zelf Engels schrijft. Dat
   is een goede reden om het te houden, maar het is wel een keuze.
5. **Lead-mail naar de klant.** Aanvragen gaan nu naar `hallo@jouwidealewebsite.nl`. Zodra je
   tevreden bent over wat eruit komt, `LEAD_RECIPIENT` in `wrangler.jsonc` naar zijn eigen adres
   zetten en opnieuw uitrollen.

## Open punten die ik wel zie maar niet alleen moet besluiten

- **Geen eigen foto's.** Al het beeld is door ons gegenereerd. Voor een bouwbedrijf zijn echte
  projectfoto's het sterkste dat er is, voor zoeken én voor overtuigen. Zolang die er niet zijn,
  staat er nergens een plaatsnaam of het woord "project" bij een foto, want het zijn geen klussen
  van hem.
- **Geen plaatspagina's.** De site heeft zeven pagina's op dienst en pandtype, geen pagina's per
  stad. Voor "badkamer renoveren Haarlem" is dat op termijn wat ontbreekt. Dat is echt werk, geen
  knop, en het moet van echte klussen komen — niet van twintig keer dezelfde tekst met een andere
  stadsnaam erin.
- **Trailing-slash redirect is een 307.** Cloudflare stuurt `/contact/` met een 307 naar
  `/contact`, niet met een 301. Geen enkel gepubliceerd adres heeft een slash op het eind, dus
  niemand komt daar langs; een 301 zou een worker-aanroep op elk paginaverzoek kosten. Bewust zo
  gelaten.
- **De naam.** Hij spelt zijn bedrijf zelf als "Yanisklussenbedrijft". Op de site staat
  **Yanis Klussenbedrijf**. Als de KvK-inschrijving op de andere spelling staat, moeten het
  bedrijfsprofiel en de site dat volgen, niet omgekeerd — die twee moeten gelijk zijn.
