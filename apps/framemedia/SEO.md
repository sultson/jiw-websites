# FRAME MEDIA - SEO, beginstand

Dit is de nulmeting bij de overgang van WordPress naar deze site, zodat er over
een maand iets is om tegen te vergelijken. Opgeschreven op **17-10-2026**, de dag
dat www.framemedia.tv van hun oude hosting op deze Worker kwam.

## Wat er die dag gebeurde

De nameservers van `framemedia.tv` zijn op 17-10-2026 om 11:33 op Cloudflare
overgegaan. De zone kwam leeg binnen: geen A, geen AAAA, geen CNAME voor de apex
of voor `www`. Tussen dat moment en de eerste deploy van deze Worker gaf
`www.framemedia.tv` dus NXDOMAIN - de oude WordPress-site was onbereikbaar. Dat
is het gat dat deze deploy heeft gedicht, en het is ook de reden dat er geen
"eerst naast elkaar laten lopen" heeft plaatsgevonden: er was niets om naast te
laten lopen.

Gevolg voor de oude site: hij is niet meer op te halen. De 57 bestanden die er
nog van over zijn, zijn op 17-10-2026 om 10:59 opgehaald en staan in `oud/` (zie
`haal-oude-media.mjs`). **Dat is nu de enige kopie.** `node haal-oude-media.mjs`
nog eens draaien levert niets meer op.

## Canonieke hostnaam: www, niet de apex

`www.framemedia.tv` is canoniek. Alle canonicals, alle hreflangs en elke regel in
de sitemap wijzen daarheen. De apex `framemedia.tv` is als custom domain
gebonden en wordt met een 301 naar www gestuurd door een Redirect Rule op de zone
(`http_request_dynamic_redirect`, pad en query intact).

Dat is bewust andersom dan de huisregel in de root `CLAUDE.md`, die voor een
nieuw domein apex-canoniek voorschrijft. De reden: hun WordPress-site leverde
jaren `www` uit, dus dat is wat er in Google staat en wat er in links van buiten
staat. Een migratie is niet het moment om ook nog van hostnaam te wisselen - elke
hop die je toevoegt is een hop waar iets in kan blijven hangen.

## Adressen die moesten blijven werken

De analyse van de oude site leverde 13 adressen op die in Google of in een link
naar buiten stonden. Ze staan in `dist/_redirects`, geschreven door `bouw.mjs`,
en zijn alle 13 live nagekeken (301 per stuk, en `/_redirects` zelf geeft een 404
en wordt dus niet uitgeleverd).

Twee regels uit die analyse staan er bewust **niet** in:

- `/puurgenieten/` zou naar `/formats` wijzen. Dat adres is hier een echte
  landingspagina op precies dat pad; een omleiding zou hem wegvangen.
- `/algemene-leveringsvoorwaarden/` zou naar de startpagina gaan. Die tekst staat
  hier op `/voorwaarden`, dus daar gaat hij heen. Een omleiding naar de pagina
  die hetzelfde zegt houdt de kracht vast; een omleiding naar de startpagina
  gooit hem weg.

Daarnaast staan de 57 oude afbeeldingen en het oude svg-logo op hun oude
`/wp-content/uploads/...`-pad. Ze worden nergens vanaf gelinkt en staan niet in
de sitemap - ze moeten alleen blijven antwoorden, want ze staan in Google
Afbeeldingen. Nagekeken: `/wp-content/uploads/2021/04/SVGlogo-01.svg` geeft 200.

## De pagina die het meeste te verliezen had

`/programma-idee/` stond bij hen op de eerste of tweede plek op "programma idee".
Daarom:

- Zelfde pad, inclusief de slash. Niet `/programma-idee` en niet `/idee`.
- De `<title>` begint met dezelfde woorden als de hunne.
- De `<h1>` is `Programma idee?`, zonder streepje. Dat is fout Nederlands en dat
  is opzettelijk: "programma idee" is de zoekopdracht waar die pagina op staat,
  en dat is niet het ding dat je tijdens een migratie verandert.
- Het formulier erop post naar `/api/forms/programma-idee`. Tot 17-10-2026
  verstuurde het niets; op dit adres is dat de duurste aanvraag die deze site kan
  laten lopen.

## Wat er nu staat en er bij hen niet stond

| | oude site | nu |
|---|---|---|
| talen | alleen Nederlands | nl op de wortel, en op `/en/`, de op `/de/`, met hreflang naar elkaar |
| indexeerbare pagina's | 9 | 22 |
| sitemap | - | `dist/sitemap.xml`, 22 regels, elk met hreflang-alternates |
| robots.txt | - | open, met de sitemap erin |
| structured data | geen | `Organization` op de drie startpagina's, `FAQPage` (8 vragen) op de drie branded-content-pagina's |
| adres per pagina | `/studio.html`-stijl | zonder `.html`; `/studio.html` geeft een 307 naar `/studio` |
| formulieren | mailto / niets | 4 endpoints op de Worker, met bevestiging aan de inzender |

Geen `Offer` of `PriceSpecification` bij de tarieven, en dat is een keuze. Die
bedragen zijn deels van Armando en deels van hun eigen Mondzorg.TV-pagina, en de
vier extra's (490 / 990 / 590 / 1490) zijn nog niet bevestigd. Een prijs in
structured data is een aanbod in het zoekresultaat zelf.

## Poorten die dit zo houden

`pnpm build` draait drie dingen achter elkaar en stopt bij de eerste klacht:

1. `bouw.mjs --prod` weigert te eindigen als er `conceptversie`, `concept
   version`, `Konzeptversion`, `jouwconcept.app` of `noindex` in `dist/` staat,
   en als het aantal gekoppelde formulieren niet 10 is.
2. `tools/vooraf.mjs` kijkt per pagina na of hij echt helemaal in de html staat:
   title, description, precies een gevulde `<h1>`, een canonical die naar
   zichzelf wijst, een woordvloer van 180, JSON-LD die parseert, elk `<form>` met
   een action die in de worker bestaat, geen dode interne link, en een sitemap die
   precies de indexeerbare pagina's dekt.
3. `kijk.mjs` is de losse ronde met een echte browser: status, afbeeldingen,
   breedte, contrast.

## Wat nog met de hand moet

- [ ] **Search Console.** `framemedia.tv` als domain property toevoegen (dat dekt
      apex, www en alle subdomeinen in een keer; het TXT-record kan op de zone
      waar wij bij kunnen) en `https://www.framemedia.tv/sitemap.xml` aanmelden.
      Bestaat er al een property van hen voor de oude site, dan is die
      waardevoller dan een nieuwe: daar staat de geschiedenis in. Vragen voordat
      er een tweede naast komt.
- [ ] **Bing Webmaster Tools**, zelfde twee stappen. Kost tien minuten en Bing
      voedt ook ChatGPT-zoekresultaten.
- [ ] **De 13 omleidingen nakijken in Search Console** zodra er crawl-data is.
      Een 301 die wij live zien werken is nog geen 301 die Google heeft gevolgd.
- [ ] **Google Bedrijfsprofiel.** Niet gecontroleerd of FRAME MEDIA er een heeft.
      Als er een is, moet de website-url daarin naar `https://www.framemedia.tv`
      wijzen.
- [ ] **De apex heeft geen eigen mailbeveiliging.** `notify.framemedia.tv` heeft
      DKIM, SPF en een `p=reject` DMARC, maar `framemedia.tv` zelf niet. Er staan
      sinds 17-10-2026 wel Purelymail-records op de zone, dus de klant zet daar
      een mailbox op; wie dat afmaakt hoort SPF en DMARC op de apex mee te nemen.
      Dat is geen SEO, maar het is wel dezelfde zone en hetzelfde moment.
- [ ] **De conceptversie.** `framemedia-concept.jouwconcept.app` staat nog en
      levert nog pagina's uit. Hij staat op `noindex` en zijn robots.txt houdt
      alles dicht, dus hij vecht niet met de echte site in Google, maar het zijn
      twee kopieen online. Zodra Frans de site heeft goedgekeurd hoort die Worker
      een 301 naar `https://www.framemedia.tv` te worden - zoals bij de andere
      gegradueerde concepten (zie `jiw-concepts/novera-bouw/omleiding.mjs`).

## Openstaande inhoudelijke vragen die het zoekresultaat raken

Deze staan al langer open bij Armando en ze staan hier omdat ze letterlijk op de
pagina's staan die nu geindexeerd gaan worden:

1. De vier extra's op de tarievenpagina (490 custom item, 990 interview in de
   studio, 590 break-bumper, 1490 break-bumper of billboard) komen van hun
   Mondzorg.TV-pagina en gelden daar voor dat ene format.
2. Heet de presentatrice Roxanna of Roxana? De brochure doet het allebei. Haar
   naam staat nergens op de site, juist daarom.
3. De landingspagina `/puurgenieten/` is de uitgebreide versie: daar staat ook in
   wat niet in de brochure van de klant stond (opname in de studio in Hilversum,
   de zes stappen, de regel onder elke branchenaam). Dat is een bewuste keuze van
   Armando van 11-10-2026, maar het is wel de pagina waar Frans het scherpst naar
   moet kijken.
