# RH Klusservice — SEO, beginstand

Dit is de nulmeting. Wat hier staat is wat er op **07-10-2026** waar was, zodat latere
veranderingen ergens tegen afgezet kunnen worden. Bijwerken bij elke meting, niets weggooien.

## Beginstand 07-10-2026

| | |
| --- | --- |
| Domein | `rhklusservice.nl` |
| Zone in Cloudflare | staat sinds 06-10-2026 in het account, actief |
| Eerste deploy op het echte adres | 07-10-2026 ~10:10 UTC, nog mét `noindex` |
| **Noindex eraf** | 07-10-2026 ~18:25 UTC — dit is de datum waarop de site voor zoekmachines begint te bestaan |
| Geïndexeerde pagina's | **0** — de site heeft tot vandaag `X-Robots-Tag: noindex` meegestuurd |
| Backlinks | geen, op het Werkspot-profiel na (dat linkt niet naar dit domein) |
| Google Search Console | **nog niet aangemeld** — zie "Wat er nog moet" |
| Bing Webmaster Tools | nog niet aangemeld, maar de 11 adressen zijn via IndexNow gemeld (202 Accepted, 07-10-2026) |
| Google Bedrijfsprofiel | bestaat, maar het websiteveld wijst nog niet naar dit domein |

Het domein is dus nieuw voor zoekmachines. Niet "we moeten posities terugwinnen", maar "we
moeten eerst bestaan". Reken op weken, niet dagen, voor de eerste vertoningen.

## Wat er technisch staat

Alles hieronder is gemeten op het live adres, niet aangenomen.

- **Volledig pre-rendered.** Twaalf statische HTML-pagina's, geen React en geen buildstap die
  HTML in JavaScript stopt. Opgehaald als Googlebot staat de hele tekst, de koppen, het menu,
  de voet en het JSON-LD in de HTML van de eerste byte af. Gemeten: 54,7 KB HTML op de
  homepagina, 20,2 KB op projecten, 29,7 KB op de slotpagina, 17,5 KB op een plaatspagina.
  Dit is de reden dat de site bij de overzetting niet naar Vite + React is omgebouwd.
- **Eén host.** `www.rhklusservice.nl` → **301** → apex, met pad en querystring. Dat loopt via
  een redirect rule op de zone (`http_request_dynamic_redirect`), dus vóór de Worker en ook op
  paden die de Worker niet ziet. Een canonical alleen is niet genoeg: dan serveren twee hosts
  een 200.
- **Eén adres per pagina.** `html_handling: "force-trailing-slash"`. De canonical, de sitemap
  en elke interne link gebruiken diezelfde vorm met slash. `/projecten` zonder slash geeft een
  redirect naar `/projecten/` — let op: Cloudflare doet dat met een **307**, niet een 301.
  Niets linkt naar de vorm zonder slash en de canonical wijst de goede kant op, dus dit is geen
  probleem; wel iets om te weten voordat iemand zich erover verbaast in Search Console.
- **Oude adressen leiden om.** `rh-klusservice.jouwconcept.app` en
  `rh-klusservice-concept.alfredsultson.workers.dev` serveerden tot vandaag dezelfde site met
  status 200. Die Worker levert nu geen pagina's meer uit en 301't per pad naar
  `rhklusservice.nl` (`jiw-concepts/rh-klusservice/omleiding.mjs`). Getest op `/projecten/` en
  `/timmerman-eindhoven/`.
- **Het derde adres is weg.** `rh-klusservice.klantenkraan.nl` serveerde een **oude** versie van
  de site met status 200 (wel `noindex`, dus nooit een zoekprobleem, maar een verouderde kopie
  online). Worker `rh-klusservice-kk` is op 07-10-2026 verwijderd; de custom domain is daarmee
  los en het DNS-record uit de zone `klantenkraan.nl` verdwenen — de naam geeft nu NXDOMAIN.
  Geen omleiding: het adres bestond alleen intern en er linkte niets naar.
  De bron staat nog in `claudius/playground/rh-klusservice-kk/`, met de route uitgezet zodat een
  deploy daar het adres niet terugbrengt.
- **Echte 404.** Een onbekend pad geeft `dist/404.html` mét status 404, niet de startpagina met
  200 — dat laatste leest Google als een soft 404. Die pagina heeft zelf `noindex,follow`.
- **Sitemap** op `/sitemap.xml`: 11 adressen, startpagina eerst, met `lastmod` per pagina uit de
  laatste wijziging van het HTML-bestand zelf. Niet de builddatum — dan betekent `lastmod`
  niets. `/bedankt/` en `/404.html` staan er niet in.
- **robots.txt** laat alles toe behalve `/api/` en `/bedankt/`, en wijst naar de sitemap.
- **Structured data**, geldig JSON geparseerd op elke pagina:
  `HomeAndConstructionBusiness` overal, met telefoon, e-mail, logo, beeld, btw-nummer,
  openingstijden (07:00–23:00, zeven dagen) en `sameAs` naar het Werkspot- en het
  Google-profiel. Plaats is Valkenswaard, **zonder straatadres en zonder geo** — dit is een
  servicegebiedbedrijf, een straatadres erin zou om een kaartvermelding vragen. Projecten heeft
  er `CollectionPage` + `BreadcrumbList` bij, de slotpagina `Service` met `OfferCatalog` en
  `FAQPage`.
- **Deelplaatje.** `og:image` 1200x630 op alle elf pagina's, plus
  `twitter:card=summary_large_image`. Sinds 08-10-2026 het witte woordmerk op zwart
  (`og-rh-klusservice-logo.jpg`, keuze van Robbin). Het `image` in het schema blijft de foto
  van de overkapping.
- **Snel en licht.** De homepagina gaat over de lijn in **10,6 KB gzip**. 328 KB aan
  HTML/CSS/JS in totaal, 8,1 MB foto's (lazy, met vaste afmetingen in het HTML tegen
  verschuiven). Uitgeleverd als Workers Static Assets vanaf de rand; de Worker draait alleen
  op `/api/*`.
- **Beveiligingskoppen** via `dist/_headers`: `Referrer-Policy: strict-origin-when-cross-origin`
  en `X-Content-Type-Options: nosniff`. Gemeten op het live adres, dus Workers Static Assets
  honoreert dat bestand.

## Waar de site op mikt

Elf indexeerbare pagina's, drie soorten:

1. **De homepagina** — merknaam en de brede termen (klusbedrijf, verbouwing, dakramen,
   binnendeuren) in Valkenswaard en omgeving.
2. **Acht plaatspagina's** `/timmerman-<plaats>/` — Valkenswaard, Eindhoven, Breda, Tilburg,
   Utrecht, Amsterdam, Rotterdam, Roermond. Het offerteformulier staat meteen in de hero.
   **Let op de onderbouwing:** van zijn 49 Werkspot-beoordelingen komt er geen enkele uit
   Utrecht, Amsterdam of Rotterdam. Die drie pagina's zeggen dat ook zo ("staat in ons
   werkgebied", niet "al jaren actief"), en het reviewblok valt daar weg in plaats van dat er
   iets van elders wordt neergezet. Eindhoven is de sterkste: 17 van de 49.
3. **Eén losse pagina** `/slot-vervangen-valkenswaard/` — buitengesloten en slot vervangen.
   Op verzoek van Armando (07-10-2026) staat hier **geen link vanaf de homepagina** naartoe: de
   klant wil er wel op gevonden worden, maar het niet groot op de homepagina. Google komt er
   langs twee wegen bij: de sitemap, en één regel in de voet van de acht plaatspagina's. Een
   pagina zonder enkele interne link is een weespagina en komt bijna nooit omhoog; dit is de
   lichtste vorm die dat voorkomt.
   Het woord **slotenmaker** staat er bewust niet in: wie daarop zoekt verwacht 24-uursdienst.
   Spoed staat er wel in, want Armando heeft op 07-10-2026 bevestigd dat hij uitrijdt.

## Wat er nog moet

In deze volgorde, en geen van deze drie kan vanuit deze map:

1. **Search Console.** Het domein aanmelden en `sitemap.xml` indienen. Zonder dat duurt het
   weken voordat een pagina die alleen in de sitemap staat (de slotpagina) wordt opgepikt.
   De DNS-verificatie kan via de zone, de rest is handwerk in de interface.
2. **Google Bedrijfsprofiel.** Het websiteveld naar `https://rhklusservice.nl`. Dat profiel
   staat al in het JSON-LD als `sameAs`; de koppeling is pas hard als hij van twee kanten komt.
   Daarbij: de link die we hebben is een `share.google`-doorverwijzer, geen echte profiel-URL.
   De nette vorm (`google.com/maps/place/...` met de CID erin) staat in het profiel zelf onder
   delen en matcht Google direct. Vervangen is één regel in `onderdelen.mjs` (`GOOGLE`).
3. **Bing Webmaster Tools** aanmelden. IndexNow is gemeld, maar zonder account zie je niets
   terug.

## Wat de klant nog moet bevestigen

Niet SEO, maar het staat wél op pagina's die nu geïndexeerd mogen worden. Zie de lijst onderaan
de README; de kern: "10+ jaar ervaring" heeft Robbin nooit gezegd, net als een vaste prijs
vooraf en vrijblijvend langskomen. En drie van de negen dienstkaarten dragen een foto die een
vervanger is.
