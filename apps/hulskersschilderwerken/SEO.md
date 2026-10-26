# SEO — hulskersschilderwerken.nl

Stand 26-10-2026, de dag van de livegang. Dit is de beginstand, niet een rapport over
resultaat: de site stond tot vandaag op een conceptadres en het eigen domein droeg nog
geen site.

## Wat er live staat

| | |
|---|---|
| Canoniek | `https://hulskersschilderwerken.nl` (apex) |
| `www` | 301 naar de apex, via een Redirect Rule op de zone **en** via `ANDERE_HOSTS` in de worker |
| `http` | 301 naar `https` (in de worker — Always Use HTTPS staat niet aan en het token mag zone-instellingen alleen lezen) |
| Oud conceptadres | `hulskers-renovlies-concept.jouwconcept.app` 301't padbehoudend naar de apex |
| Indexeerbare pagina's | 2: `/` en `/werkwijze/` |
| Adresvorm | met sluitende slash (`html_handling: "force-trailing-slash"`) |
| 404 | echte `dist/404.html` met status 404, altijd `noindex`, geen canonical, niet in de sitemap |
| Sitemap | `/sitemap.xml`, precies die 2 adressen |
| robots.txt | open, met de sitemap erin |
| IndexNow | aangemeld op 26-10-2026 (202). Sleutel: het `.txt`-bestand in `public/` |

**Nog te doen door een mens:** de site aanmelden in Google Search Console en daar de
sitemap indienen. Dat kan dit project niet zelf; Google doet niet mee aan IndexNow.

### Eén schakelaar, niet drie

`robots.txt`, de `noindex`-meta en de sitemap komen alle drie uit de vlag `LIVE` in
`build.mjs` (`--prod`, wat `pnpm build` meegeeft). Dat is de regel uit
`playground/CLAUDE.md`, en die staat daar omdat het bij `jh-schilderwerken` fout ging:
robots.txt lag er als los bestand terwijl de noindex uit een vlag kwam, en twee
schakelaars lopen gegarandeerd uit de pas. Dan haalt de vlag de noindex uit de pagina's
terwijl robots.txt de hele site blijft verbieden — en dan ziet niemand die noindex ooit.

`pnpm build:dev` bouwt dicht: noindex op alles, `Disallow: /`, geen sitemap.
`tools/vooraf.mjs` zakt op elke combinatie die niet bij de bouw past.

## Voorgerenderd, en waarom daar een poort op zit

Elke pagina staat volledig in de html — geen hydratie, geen tekst die pas in de browser
ontstaat. Voor een statische bouw is dat geen stap maar een eigenschap, en precies
daarom hoort er een poort op: een eigenschap waar niemand op toetst is een eigenschap
tot de eerste keer dat iemand er een `<script>` in hangt.

`tools/vooraf.mjs` hangt in `pnpm build` en zakt op:

1. een lege of ontbrekende `<title>` of meta description
2. niet precies één `<h1>`, of een lege
3. een canonical die niet naar de pagina zelf wijst (en een canonical op de 404)
4. een woordvloer per pagina (400 woorden; de 404 heeft 15) — staat de tekst in de html?
5. `noindex` op de verkeerde plek voor deze bouw
6. een ontbrekende `lang="nl"`
7. een `<form>` zonder action, of met een action die **de worker niet kent**
8. een interne link naar een adres dat niet bestaat
9. `.html` in een intern adres (dat is een 301 per klik)
10. een `src`/`href` naar een bestand dat niet in `dist/` ligt
11. een sitemap die niet exact de indexeerbare pagina's dekt
12. een robots.txt die niet bij de bouw past
13. JSON-LD die niet parseert
14. html-commentaar in de pagina (bouwnotities — zie 25-10-2026)
15. het oude conceptadres ergens in de html

Alle vijftien zijn op 26-10-2026 getest door ze expres stuk te maken; alle vijftien gaan
af. Een poort die je niet hebt zien zakken, is een poort waarvan je hoopt dat hij werkt.

Het formulieradres staat op **één** plek (`FORM_PAD` in `inhoud.mjs`) en de poort leest
het adres waarop de worker luistert uit `worker/index.ts` en legt die twee naast elkaar.
Zonder dat kan de action stil uit de pas lopen met de route, en dan landt elke aanvraag
op een 404 — het soort fout dat maanden blijft staan, omdat niemand zijn eigen
contactformulier invult.

## Zoekwoorden: waarom /werkwijze/ de vraag pakt en niet "renovlies"

Gemeten op 25-10-2026 (DataForSEO, `bron/seo/kw.json` + `serp.json`). De vraag van
Armando was: laat `/werkwijze/` hoog ranken op renovlies.

Dat kan die pagina niet, en dat is geen kwestie van beter schrijven:

- `renovliesbehang` 14.800/mnd en `renovlies` 8.100/mnd zijn groot, maar die hele rij
  bestaat uit **webshops die rollen verkopen**: Hornbach, Praxis, Gamma, Karwei,
  behangloods, glasvezelbehang.nl. Op `renovlies` staat er bovendien een kaartblok.
  Dat is de categorie van een verkoper, niet van een schilder.
- `renovlies aanbrengen` heeft met € 10,36 de hoogste klikprijs van de lijst, maar die
  rij is `zelfrenovliesaanbrengen.nl`, een stappenplan en een Reddit-draad. Dat zijn
  mensen die het zelf willen doen.

Waar geen webshop en geen kaartblok staat is het **vraagcluster**, en daar staan alleen
uitlegpagina's: `wat is renovlies` (260), `renovlies of glasweefsel` (30),
`renovlies of vliesbehang` (30), `renovlies dikte` (20), plus `muren glad maken`
(1.300), `krimpscheuren nieuwbouw` (110) en `texen` (590). Daarop is `/werkwijze/`
gebouwd: titel *Renovliesbehang: wat is het en hoe werkt het*, het soortenblok bovenaan,
en de koppen eronder pakken `muren glad maken` en `krimpscheurtjes`.

Drie dingen die daar uit volgden:

- **`renovliesbehang` staat nu in de titel en de h1 van beide pagina's.** Dat woord is
  bijna twee keer zo groot als `renovlies`, bevat het letterlijk, en het is ook zijn
  eigen woord ("Renovlies behang is een zeer gewilde behangsoort" staat in zijn
  advertentie). De h1 van de startpagina noemde het onderwerp van de site helemaal niet;
  dat was de grootste gemiste kans die er lag.
- **De startpagina pakt het kopwoord met Coevorden erbij, `/werkwijze/` de vraag.** Twee
  pagina's op hetzelfde woord wegen elkaar weg.
- **De kop van het voorwerkblok heet "Muren glad maken op een behangklare wand".** Dat
  is het grootste zoekwoord dat die pagina kan winnen, maar het beloofde precies het werk
  dat Pascal afwijst ("ik ga wanden die niet behangklaar zijn, niet behangklaar maken!!").
  Een pagina die rankt op werk dat hij niet doet, levert aanvragen op die hij moet
  weigeren — dus staat de grens in de kop.

### Zijn sterkste punt

De webshops adverteren renovlies van **150 gram**. Pascal gebruikt 215 en noemt zelf de
165 die de meeste bedrijven gebruiken. Zijn 215 staat dus niet alleen tegenover zijn
eigen vergelijking maar tegenover een markt die op 150 zit. Op de pagina staat alleen
**zijn** vergelijking met 165 — die 150 is onze research en geen bewering van hem.

## Structured data

Één JSON-LD-blok per pagina: `LocalBusiness` met naam, telefoon, mail, adres, KVK,
`areaServed` Nederland en `knowsAbout` (renovlies, vliesbehang, glasweefselbehang,
binnen- en buitenschilderwerk, sauswerk). Traprenovatie staat er sinds 20-10-2026 **niet**
meer in: die dienst doet hij niet meer, en een dienst in de structured data laten staan
die hij niet levert is vragen om een aanvraag die hij moet weigeren.

## Wat de volgende hierop kan doen

- Search Console aanzetten en de sitemap indienen (zie boven).
- Echte renovlies-reviews. Het beoordelingsblok van de referentiesite staat hier bewust
  leeg: hij heeft 5,0 uit 32 reviews op Marktplaats, maar die gaan over tuinstoelen, een
  servies en een magnetron, en bij de meeste staat "betaalt snel" omdat hij de koper was.
  Een cijfer kan waar zijn en tegelijk een leugen over zijn vakwerk.
- De open vragen uit `NALEZEN-PASCAL.md`. De vaktechniek die de referentiesite op zijn
  werkwijzepagina heeft (schuurmachine, gramgewicht van het vlies, naden, verfmerk) is
  precies de inhoud die zo'n pagina sterk maakt, en precies wat je niet mag verzinnen.
