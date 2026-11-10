# SEO — puurgenieten.tv (stand 10-11-2026)

Wat er staat, en wat `tools/vooraf.mjs` bij elke bouw afdwingt:

- **Voorgerenderd.** Statische html, geen hydratie. Elke pagina 400+ woorden in de html.
- **Een adres per taal**: `/` (nl, x-default), `/en/`, `/de/`. Eigen `<html lang>`, eigen
  canonical naar zichzelf, volledige hreflang-set die heen en terug wijst (ook in de sitemap).
- **Sitemap** `/sitemap.xml` met `lastmod` (bouwdatum) en `xhtml:link`-alternates; `robots.txt`
  open met de sitemapregel. Een host: www, http en het conceptadres 301'en naar de apex.
- **404** echt met status 404 (`not_found_handling: 404-page`), op noindex.
- **Titels** ~55 tekens, **descriptions** ~145 (waren 360; de poort zakt boven 170).
- **Open Graph + Twitter-card** met een 1200x630 deelplaat, `og:locale` + alternates.
- **JSON-LD** (`@graph`): WebSite, WebPage, TVSeries "Puur Genieten" met FRAME MEDIA als
  `productionCompany` (Organization met adres, KvK, telefoon). Bewust geen Offer/prijs en
  geen VideoObject (uploaddatum onbekend; zonder die datum keurt Google hem af).
- **IndexNow**: sleutelbestand op de wortel, `pnpm indexnow` na elke uitrol (10-11: 202).

Niet te regelen vanuit de code:

1. **Dubbele inhoud met framemedia.tv/puurgenieten/.** Zolang die pagina's een 200 geven
   staat dezelfde tekst op twee domeinen en kiest Google er zelf een — waarschijnlijk het
   oudere framemedia-adres. Een 301 vanaf framemedia neemt ook de links en de positie mee.
2. **Search Console** voor puurgenieten.tv, sitemap indienen, en de framemedia-property
   gebruiken om de verhuizing te volgen.
