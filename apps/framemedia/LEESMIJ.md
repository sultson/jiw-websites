# FRAME MEDIA

Live: **https://www.framemedia.tv**
Gemaakt: 27-09-2026 als concept, op verzoek van Armando.
Verhuisd naar deze monorepo en op het echte domein gezet: 17-10-2026.

Statische site met een eigen bouwstapje. `bouw.mjs` zet `inhoud/` om naar
`dist/`, `dist/` gaat als Workers Static Assets naar Cloudflare. Er zit een
worker voor `/api/*` die de formulieren aanneemt (`worker/index.ts`), en verder
komt elke pagina rechtstreeks van de edge.

Drie talen: Nederlands op de wortel, Engels op `/en/`, Duits op `/de/`. Zie
"Drie talen, elk met eigen adressen".

| Commando | Wat het doet |
|---|---|
| `pnpm --filter @jiw/framemedia build` | Het mail-logo, de productiebouw en de poort erna |
| `pnpm --filter @jiw/framemedia ship` | Bouwt en zet live op www.framemedia.tv |
| `pnpm --filter @jiw/framemedia ship:dry-run` | Zelfde zonder uploaden |
| `pnpm --filter @jiw/framemedia lint` | `tsc` over `worker/` |
| `pnpm --filter @jiw/framemedia build:concept` | Dezelfde bron, maar met noindex en robots dicht |
| `node serveer.mjs` | Proefserver op http://localhost:4174 |
| `node kijk.mjs [url]` | Loopt alles na met Playwright, desktop + telefoon |
| `node meet-360.mjs` | Alleen de breedte en de actiebalk, op 360 in plaats van 390 |
| `node maak-branches.mjs` | Zet de aangeleverde branche-clips om naar web (`--posters` = alleen de posterbeelden) |
| `node maak-logo.mjs` | Maakt de vier logobestanden uit `raw/framemedia-logo.svg` |
| `node tools/gen-mail-logo.mjs` | Het logo als png voor de bevestigingsmail |

**`node kijk.mjs` zonder adres meet het LIVE adres, niet je bouwsel.** Voor het
uploaden is het dus altijd `node kijk.mjs http://localhost:4174` naast een
draaiende `node serveer.mjs` - anders meet je de vorige versie en lijkt alles
goed te gaan.

`raw/` staat in de gitignore van de root: 242 MB bronmateriaal (de aangeleverde
clips, de brochure, de tussenbestanden van de beeldscripts). Alles wat de site
uitlevert staat gegenereerd in `inhoud/assets/`. `oud/` staat er wel in, en dat
is bewust - zie SEO.md.

## Van concept naar het echte domein (17-10-2026)

De site stond tot die dag op `framemedia-concept.jouwconcept.app` in
`claudius/playground/framemedia`. Wat er bij de verhuizing is veranderd:

1. **De formulieren versturen nu echt iets.** Daarvoor ving `site.js` het
   versturen af en liet een regel zien die er zelf bij zei dat dit een
   conceptversie was. Nu post elk formulier naar zijn eigen pad op dezelfde
   hostnaam (`/api/forms/...`), aangenomen door `@jiw/cloudflare-forms`. Zie
   "De formulieren" hieronder.
2. **Het domein.** `www.framemedia.tv` is canoniek, de apex 301't ernaartoe met
   een Redirect Rule op de zone. Allebei hangen als custom domain aan deze
   Worker. Zie SEO.md voor waarom www en niet de apex.
3. **Structured data.** `Organization` op de drie startpagina's, `FAQPage` op de
   drie branded-content-pagina's. Er stond eerst geen enkele JSON-LD op de site.
4. **Een poort erbij**: `tools/vooraf.mjs`. Die kijkt na of elke pagina echt
   helemaal in de html staat en of elk formulier een action heeft die in de
   worker bestaat. `pnpm build` draait hem en stopt bij de eerste klacht.
5. **`_headers`** met `nosniff`, `Referrer-Policy` en een jaar cache op
   `/assets/*`.
6. **De lichte uitvoering is er al op 11-10-2026 uit** (de klant koos donker),
   dus het controlescript meet nog maar een weergave.

## De formulieren

Vier formulieren, vier adressen op de worker. Een pagina heeft er maximaal een,
dus `bouw.mjs` hangt ze aan hun action op de sleutel van de pagina (zie
`FORMULIEREN` daar). De bouw telt ze en stopt als het er geen 10 zijn (nl heeft
vier pagina's met een formulier, en + de elk drie).

| Pad | Waar | Onderwerpregel begint met |
|---|---|---|
| `/api/forms/snel` | Het snelformulier in de hero van de startpagina | `Snelformulier framemedia.tv` |
| `/api/forms/contact` | `/contact`, `/en/contact`, `/de/kontakt` | `Contactformulier framemedia.tv` |
| `/api/forms/puurgenieten` | De drie `puurgenieten`-landingspagina's | `Aanmelding Puur Genieten` |
| `/api/forms/programma-idee` | `/programma-idee/` | `Programma-idee via framemedia.tv` |

Het zijn er vier en niet een, omdat de vier vragen ver uit elkaar liggen: "ik
wil mijn bedrijf op televisie", "meld mij aan voor Puur Genieten", "ik heb een
programma-idee", en een snelformulier dat alleen een bedrijfsnaam en een adres
opvraagt. Die horen met hun eigen onderwerpregel in de mailbox aan te komen.

Twee dingen die `bouw.mjs` in elk formulier zet:

- **Het lokvink** (`website`): staat wel in de html, maar buiten beeld en buiten
  de tabvolgorde (`.lokvink` in `style.css`). Een bot die het vult krijgt
  `{"ok":true}` en er wordt niets opgeslagen en niets gemaild. Daarom geen
  Turnstile: geen extra resource, geen secret, en geen verzoek naar een derde
  voor iemand die alleen een vraag wil stellen.
- **`__jiw_confirmation_locale`**: de taal waarin de bezoeker zijn eigen
  bevestiging terugkrijgt. Die staat per pagina vast en wordt niet uit de browser
  gelezen - wie de Duitse pagina invult hoort Duits terug te krijgen, ook met een
  Engelse browser.

De veldnamen in de html zijn `firstName` en `email` en niet `naam` en `mail`.
Dat is het contract van `@jiw/cloudflare-forms` voor zijn drie ingebouwde
regels; de labels die de bezoeker leest zijn gewoon Nederlands gebleven.
`firstName` heet in beide mails "Contactpersoon", want deze formulieren vragen
geen voor- en achternaam.

**Aanvragen komen sinds 17-10-2026 op `info@framemedia.tv`**, dus bij FRAME MEDIA
zelf (`LEAD_RECIPIENT` in `wrangler.jsonc`, op aanwijzing van Alfred). Dat adres
is ook de reply-to op de bevestiging, dus wie daarop antwoordt komt bij Frans
uit. Vanaf nu geen testinzending meer tegen de live config: zet `LEAD_RECIPIENT`
eerst terug op `hallo@jouwidealewebsite.nl`.

Verstuurd wordt er vanaf `no-reply@notify.framemedia.tv` (verzenddomein met
DKIM, SPF en een `p=reject` DMARC op de zone). Er komt niets aan op dat adres.

Let op bij testen: `{"ok":true}` bewijst dat onze eigen melding eruit is, niet
dat de bevestiging aan de bezoeker is gelukt - dat laatste wordt in het pakket
alleen ge-`console.error`'d. Zekerheid komt uit `wrangler tail`: geen regel
`Confirmation email failed` en `exceptions: []`.

## De bevestigingsmail

`worker/confirmation.ts`, drie sets tekst (bericht, aanmelding, idee) in nl/en/de
met een gedeeld merk. De site is donker, deze mail niet: een donkere mailkaart
wordt door een deel van de mailprogramma's zelf nog eens omgekeerd. Dus een
lichte kaart met hun marine als band en hun rood als enige accent, Arial in
plaats van Archivo en Inter, en het logo als platte png
(`tools/gen-mail-logo.mjs`) omdat geen mailprogramma svg tekent.

Wat die mail bewust niet zegt: geen bedrag, niets over twee uitzendingen (dat
geldt voor Puur Genieten en niet voor branded content), en geen presentatrice bij
naam. Zie de kop van dat bestand.

## Bouw

| Bestand | Wat het doet |
|---|---|
| `bouw.mjs` | `<head>`, het merk, de menubalk, de voettekst en de paginalijst per taal |
| `inhoud/data.mjs` | Alle inhoud die op meer dan een pagina terugkomt, in het Nederlands |
| `inhoud/taal/nl.mjs` | Schermteksten, menu, voettekst, titels - het Nederlands als contract |
| `inhoud/taal/en.mjs` | Hetzelfde in het Engels, plus de vertaalde data |
| `inhoud/taal/de.mjs` | Hetzelfde in het Duits |
| `inhoud/blokken.mjs` | Maakt HTML van die data, in de taal die `zetTaal()` heeft ingezet |
| `inhoud/*.html` | Alleen de `<main>` van elke Nederlandse pagina |
| `inhoud/en/*.html`, `inhoud/de/*.html` | Dezelfde `<main>`, vertaald |
| `inhoud/assets/` | css, js, logo's, favicon, `fotos/` - wordt ongewijzigd (en recursief) naar `dist/assets/` gekopieerd |
| `oud/` | De bestanden van de oude WordPress-site op hun oude pad; wordt ongewijzigd naar `dist/` gekopieerd. Ophalen met `haal-oude-media.mjs` |
| `haal-oude-media.mjs` | Haalt die 57 bestanden van www.framemedia.tv |

Een pagina in `inhoud/` roept een blok aan met `<!--#naam-->`. Een onbekende naam
gooit een fout in plaats van stil niets in te vullen, anders valt er een halve
pagina weg zonder dat je het merkt.

## Paginas

| Pagina | Wat erop staat |
|---|---|
| `index.html` | Hero, zenders, cijfers, drie routes, spot-tegenover-non-spot, waarom het werkt, werkwijze, formats, referenties, CTA |
| `branded-content.html` | De vergelijking, werkwijze in zes stappen, wat erin zit, tarieven, veelgestelde vragen |
| `studio.html` | Vijf ruimtes met foto, kerncijfers, inbegrepen-lijst en toelichting per onderdeel; tips voor op tv |
| `formats.html` | Nu op RTL 4, eigen formats, eerdere programma's, en een korte aanloop naar programma-idee |
| `over-ons.html` | Wat zij doen, waarom televisie, wat hen onderscheidt, ruim honderd referenties, vacature |
| `contact.html` | Formulier, bereikbaarheid, waarvoor je kunt bellen |
| `puurgenieten/index.html` | Landingspagina Puur Genieten: aanmeldformulier, het item, de acht branches, voor wie het is, de tarieven, de zes stappen, wat het oplevert |
| `programma-idee/index.html` | Formulier, het eerlijke verhaal over een format, de route in zes stappen |
| `vacature.html` | De zzp-accountmanager |
| `404.html` | Foutpagina, zonder menu en voettekst |

Hun eigen site heeft negen pagina's in een menu met uitklappers. Hier zijn het
er zeven in het menu, met de vacature in de voettekst. Mondzorg.TV was bij hen
een losse pagina; die staat nu als format tussen de andere formats, want het is
een format. Puur Genieten staat er ook als format bij, en sinds 10-10-2026
bovendien als eigen menuknop - zie hieronder.

### `/programma-idee/` staat op hetzelfde adres als bij hen

Op verzoek van Armando (10-10-2026): "qua SEO moet het identiek zijn aan
elkaar". Hun eigen pagina staat op `framemedia.tv/programma-idee/`, dus deze
staat op `/programma-idee/` - zelfde pad, zelfde slash. Dat adres staat in
Google en in hun eigen menu; een concept dat de pagina op een ander pad zet
gooit dat weg bij het overzetten. De `<title>` begint met dezelfde woorden als
de hunne (`Programma idee? - FrameMedia`), in onze eigen opmaak met
`| FRAME MEDIA` erachter, zodat alle pagina's hier dezelfde vorm houden. Wij
schrijven het met een streepje, want zo is het Nederlands; Google ziet een
streepje als een woordgrens, dus op het zoekwoord maakt dat niets uit.

**De tekst stond eerst twee keer.** Het hele verhaal zat als blok `#idee`
onderaan `formats.html`. Dezelfde alinea's op twee adressen van dezelfde site
zijn twee pagina's die om dezelfde zoekopdracht vechten, dus dat blok is nu
drie regels met een knop naar de nieuwe pagina. Het `id="idee"` staat er nog,
want daar kon naartoe gelinkt worden. Drie links wijzen nu naar de pagina zelf:
de knop in de hero van `formats.html`, die aanloop onderaan, en de voettekst
(`voet.programmaIdee`, stond op `formats.html#idee`). Ook de derde routekaart op
de startpagina ("Van idee tot uitzending", `ROUTES` nr 03) gaat er nu heen in
plaats van naar de formatpagina - dat is waar die kaart over gaat. Het Engels en
Duits hebben deze pagina niet en houden daar hun eigen contactpagina (`href` in
`taal/en.mjs`).

Het formulier heeft dezelfde vier velden als dat van hen (naam, telefoon,
e-mail, een tekstvak met hun eigen aanhef "Vertel ons vast iets meer."). Bij hen
zit het achter een pop-up onder de knop "Neem direct contact op"; hier staat het
naast de kop, want een landingspagina die eerst een pop-up vraagt verliest de
helft. De zes stappen van de route zijn van ons - afgeleid van hun eigen zin
over redactie, scripting, opnemen, editen, de Mediawet, de zender, de sponsoring
en het uitzenden. De rest van de tekst is de hunne.

## Drie talen, elk met eigen adressen

Op verzoek van Armando (10-10-2026). Het Nederlands staat op de wortel, het
Engels onder `/en/` en het Duits onder `/de/`. **Geen vlaggetje dat met
JavaScript de tekst omwisselt**: elke pagina heeft een eigen adres met een
eigen `<title>`, eigen `description`, een eigen `lang` op `<html>`, een
`canonical` naar zichzelf en `hreflang` naar de andere twee (`x-default` op het
Nederlands, dat is de thuistaal van het bedrijf). `dist/sitemap.xml` zet
dezelfde drie-eenheid er nog een keer in. Dat is wat "uniek vindbaar" betekent:
een Duitse zoeker kan de Duitse pagina vinden zonder langs de Nederlandse te
gaan.

De bestandsnamen zijn per taal vertaald, want een Duitser zoekt niet op
`over-ons`:

| | nl | en | de |
|---|---|---|---|
| start | `/` | `/en/` | `/de/` |
| branded content | `/branded-content.html` | `/en/branded-content.html` | `/de/branded-content.html` |
| studio | `/studio.html` | `/en/studio.html` | `/de/studio.html` |
| over ons | `/over-ons.html` | `/en/about-us.html` | `/de/ueber-uns.html` |
| contact | `/contact.html` | `/en/contact.html` | `/de/kontakt.html` |
| Puur Genieten | `/puurgenieten/` | `/en/puur-genieten/` | `/de/puur-genieten/` |
| formats | `/formats.html` | - | - |
| programma-idee | `/programma-idee/` | - | - |
| vacature | `/vacature.html` | - | - |
| voorwaarden | `/voorwaarden.html` | (NL) | (NL) |

**Vier pagina's staan bewust alleen in het Nederlands.** De formatpagina is een
lijst Nederlandse programmatitels, en programma-idee is de route daarnaartoe -
dat is een gesprek met een Nederlandse zender over een Nederlandstalig
programma, en de Mediawet is Nederlands recht. De vacature is een zzp-rol in
Nederland. En de voorwaarden zijn een juridisch stuk: een vertaalde
aansprakelijkheidsbepaling is een andere bepaling, dus daar blijft de
Nederlandse tekst staan met `(NL)` erachter in de voettekst. Het Engelse en
Duitse menu heeft daarom vijf knoppen in plaats van zes, en de voettekst laat
alleen zien wat in die taal bestaat. Dat is de reden dat `paden` per taal
bestaat: een taal die een pagina niet heeft krijgt er ook geen link naar, en de
taalkeuze stuurt je in dat geval naar de startpagina van die taal in plaats van
naar een 404.

### Hoe het in de bouw zit

`blokken.mjs` stond rechtstreeks op de Nederlandse data. Nu zet `bouw.mjs` per
taal `zetTaal({ data, ui, basis })` en lopen alle blokken daar op: `D` is de
data, `U` zijn de losse schermteksten, `BASIS` is `''`, `/en` of `/de`. Twee
dingen die daarin verwerkt zitten:

- **Een taal overschrijft alleen wat taal is.** `zetTaal` legt de
  taaldata over `data.mjs` heen (`{ ...NL, ...data }`), dus logo's, afmetingen,
  video-id's, bedragen en de ruim honderd bedrijfsnamen staan nog op een plek.
  Een nieuwe video verschijnt daardoor in alle drie de talen; alleen het
  labeltje eronder (`VIDEOS_BIJ`, op id) is vertaald. Een vergeten sleutel valt
  terug op het Nederlands in plaats van als `undefined` op de pagina te komen.
- **Elke interne link in een blok gaat door `link()`.** Anders stapt de
  bezoeker halverwege over naar het Nederlands: de knop "Bekijk de studio" in
  `studioband` stond hard op `/studio.html`.

`site.js` is voor alle drie de talen hetzelfde bestand en komt met `defer`
binnen, dus het kan niet zelf weten in welke taal de pagina staat. De acht
teksten die het nodig heeft (menu openen, de twee foutmeldingen van het
formulier, "Stap 1 van 2") staan als `window.FM_T` in het scriptje in de
`<head>`, met de Nederlandse waarde als terugval in `site.js` zelf.

De taalkeuze staat in de menubalk: de talen horen bij de site zelf. (Onderin
stond tot 11-10-2026 de weergaveknop, die bij de conceptversie hoorde en daarom
juist niet in de balk.) Drie korte codes
(NL / EN / DE) en geen vlaggetjes - een vlag zegt een land en niet een taal, en
Duits is niet alleen Duitsland.

### Wat er bij het vertalen niet is verzonnen

- **Programmatitels blijven staan zoals ze heten.** Puur Genieten blijft Puur
  Genieten, ook op de Duitse pagina: het is de naam van een Nederlands
  SBS 6-programma. Op de Engelse en Duitse landingspagina staat er daarom
  bij het item wel "Spoken in Dutch" / "Gesprochen auf Niederlandisch".
- **Over Purer Genoss Deutschland staat er niets.** Dat is een pilot (zie
  `VIDEOS`), geen lopende Duitse uitzending. De Duitse pagina's verkopen dus
  hetzelfde als de Nederlandse: een item in een Nederlandse uitzending. Wordt
  die pilot ooit een Duitse reeks, dan is dat een eigen pagina en een eigen
  verhaal.
- **"Mediawet" is wel vertaald** ("Dutch Media Act", "niederlandisches
  Mediengesetz"), want dat is een wet en geen merk, en een Engelse lezer kent
  het woord niet.
- **De zenders heten hoe ze heten**, maar er staat nu "the Dutch commercial
  channels" in plaats van "de commerciele zenders" - zonder dat woord weet een
  buitenlandse lezer niet in welk land hij op televisie komt. Om dezelfde reden
  staat bij Studio op contact "Hilversum, the Netherlands" en staat het
  telefoonnummer er in de internationale vorm (+31 6 3486 1375).
- **De technische namen in de regie zijn vaktermen geworden en geen
  woordenboekvertaling**: Regie A is Gallery A in het Engels, beeldmenger is
  vision mixer, zendlijnprocessing is broadcast processing. In het Duits blijft
  Regie A gewoon Regie A.

## Waar de inhoud vandaan komt

Bijna alles komt letterlijk van framemedia.tv, uitgelezen op 27-09-2026. De
ruwe pagina's staan in `raw/` zodat na te lopen is wat van hen was.

Wel van ons:

- **De vergelijkingstabel** spot tegenover non-spot. Hun argument, maar zij
  zetten het in een lopende alinea. De zes rijen zijn onze formulering.
- **De zes stappen** in de werkwijze. Afgeleid van hun lijst "Wat zit allemaal
  standaard in de prijs?" plus de tekst eromheen.
- **De acht veelgestelde vragen.** Elk antwoord is te herleiden tot iets dat
  feitelijk op hun site staat, maar de vraagstelling en de formulering zijn van
  ons.
- **De drie kaarten** "Wij zitten aan beide kanten van de tafel" op Over ons.
- De hero-koppen en de tussenkoppen.

## Huisstijl

Geen merkblad beschikbaar, dus afgeleid uit hun eigen logobestand. Daar zitten
precies vijf kleuren in: `#2e3e50` en `#324a5e` (de bogen van het beeldmerk),
`#7e8e8c` en `#95a4a3` (de lensvormen) en `#bf2027` (de naam).

De site is donker. Dat is geen smaak maar het onderwerp: dit is een bedrijf dat
televisiebeeld maakt, en een studio is donker. `#0d1117` als basis, hun
`#2e3e50` als de warme band ertussen, het rood als accent. Er stond van
10-10-2026 tot 11-10-2026 een lichte uitvoering naast om te vergelijken; de
klant heeft donker gekozen. Zie "Een weergave" hieronder.

Op donker haalt `#bf2027` maar 3,2:1, dus voor tekst en randen gebruiken we
`#ff4d57` (5,8:1) en blijft `#bf2027` alleen staan waar er wit overheen komt -
daar haalt hij 6,1:1.

Letters: Archivo voor de koppen, Inter voor de lopende tekst.

### Een weergave: donker (11-10-2026)

De site heeft een uitvoering en dat is de donkere. Tot 11-10-2026 stond er
naast de donkere ook een lichte, met een knopje linksonder, `?thema=` in het
adres en de keuze in `localStorage`. Armando: "de toggle voor de witte optie
kan weg; de klant heeft definitief gekozen voor de donkere thema."

Wat er daarmee uit is, zodat je niet half iets terugvindt:

- de laag `[data-thema="licht"]` onderaan `style.css` (ruim 200 regels), het
  blok met de donkere eilanden dat alleen in die laag iets deed, en de twee
  regels die het lichte of donkere merk verborgen;
- `.thema-schakel` in de css, het knopje in `bouw.mjs` en in `inhoud/404.html`,
  en het stukje in `site.js` dat erop luisterde;
- het scriptje in de `<head>` dat `?thema=` las, plus `data-thema` op `<html>`;
- de tweede ronde in `kijk.mjs`, `meet-360.mjs` en `meet-balk.mjs`.

Drie dingen zijn gebleven, en met reden:

1. **`color-scheme: dark` staat nu op `:root`.** Het stond eerder alleen op de
   vijf vlakken die in de lichte weergave donker bleven. Zonder die regel komt
   de uitklap van een `<select>` of een scrollbalk licht binnen op een donkere
   pagina.
2. **De opgehelderde tonen op `.sec-marine`.** Die band is zelf lichter dan de
   pagina (#2e3e50 tegen #0d1117), dus zachte tekst zakt daar naar 3,80:1. Dat
   heeft niets met de weergave te maken en moet blijven staan.
3. **`--vlak-wit` en `--donker-vast`.** Die bestonden omdat `--wit` meekantelde
   in de lichte weergave. Nu kantelt er niets meer, maar de namen staan door de
   hele css en zeggen nog steeds wat ze zeggen.

Het merk staat daardoor nog maar een keer in de pagina: de lichte uitvoering,
voor een donkere ondergrond. De donkere logobestanden liggen er nog wel,
`logo.svg` en `logo-woord.svg`.

### Het vormidee: de kaderhoek

Het bedrijf heet Frame. Dus is het kader het merk en niet een versiering. Vier
hoekjes zoals de markering in een camerazoeker komen terug op de kaarten
(`.kader`) en groot in de hero (`.zoeker`). In de hero staat er ook een
opnamelampje en een tijdcode bij.

In dat vlak staat hun insigne heel, op 52% van de kaderbreedte. Even hun eigen
Studio A erin geprobeerd - een zoeker hoort immers een opname te tonen - maar
dat gaf de hero minder rust en de klant vond de merkversie beter. De foto staat
nu in `studioband` halverwege de startpagina en per ruimte op de studiopagina.
Zet je hier ooit toch beeld terug, dan is een donker verloop over de boven- en
onderrand nodig, anders valt REC weg tegen het lichtplafond.

### De logo's (`maak-logo.mjs`)

Het bronbestand stuurt zijn kleuren via een `<style>`-blok met classes aan.
Dat is onhandig in een `<img>` en gevaarlijk als je het inline zet: `.cls-1`
botst dan met elk ander ingesloten svg-bestand op de pagina. Dus zet het script
de vulling per pad als attribuut neer en gooit het blok weg.

Vier bestanden uit een bron:

| Bestand | Waarvoor |
|---|---|
| `logo.svg` | Het hele insigne, voor lichte achtergronden |
| `logo-licht.svg` | Het hele insigne, donker - voettekst en 404, op 104 beeldpunten |
| `logo-woord.svg` | Alleen het woordmerk, lichte achtergrond |
| `logo-woord-licht.svg` | Alleen het woordmerk, donker - menubalk |

**Klein is het woordmerk, groot is het insigne.** Hun logo is een insigne van
311 bij 193: FRAME MEDIA loopt dwars door een ring heen, met de regel eronder
er ook nog binnenin. Op menuhoogte (44, op de telefoon 32) wordt de naam
daarin zeven beeldpunten hoog, en dat is een vlek.

Hier stond eerst een liggende variant: het merkteken links, de naam ernaast.
Dat was fout, en het opmeten in `maak-logo.mjs` laat zien waarom. De twee
bogen zijn maar kappen van een veel grotere cirkel - 169 breed, de bogen samen
92 hoog met 100 ertussen. De naam loopt niet toevallig voor de ring langs; de
ring bestaat alleen doordat de naam er doorheen gaat. Haal je hem eruit, dan
houd je twee losse maantjes over. Ze weer naar elkaar toe schuiven maakt het
erger: dan raken de lensvormen elkaar en wordt het een strik. Die variant is
weg, inclusief `logo-breed*.svg`.

Dus staat in de menubalk alleen het woordmerk met de regel eronder, in hun
eigen letters en hun eigen onderlinge maatvoering (de afstand tussen naam en
regel is letterlijk overgenomen). Daar is de naam op 40 beeldpunten hoogte 20
punten hoog. Het insigne blijft heel en staat waar de ruimte er wel is: in de
voettekst en op de foutpagina.

Geen letter is opnieuw gezet. Om te weten waar elk onderdeel staat meet het
script de echte vorm op met `getBBox()` in een headless browser -
padcoordinaten uitrekenen met een regex gaat bij bogen mis.

Het tabicoontje is wel van ons: een logo van 311 bij 193 met een tagline erin
is op 16 beeldpunten een vlek. Nu een witte F met een rood opnamestipje in een
donkere tegel.

## De meebewegende actiebalk op de telefoon

Onder 880px staat er een vaste balk onderaan met **Bellen** en **Plan een
gesprek**. Reden: op de telefoon zit de contactknop in het ingeklapte menu, dus
na de hero is er geen zichtbare actie meer.

Hij komt op na 0,6 schermhoogte en gaat weg zodra er een echte actie in beeld
staat: de `.cta-band`, het formulier op contact, of de voettekst. Die laatste
hoort er ook bij, want daar staan het telefoonnummer en het mailadres al -
zonder die regel bleef de balk onderaan de pagina over de voettekst hangen.

`kijk.mjs` toetst niet een losse scrollpositie maar de afspraak zelf: op vijf
posities per pagina moet gelden dat de balk zichtbaar is **precies wanneer** je
de hero voorbij bent en er geen echte actie in beeld staat. Dat is per pagina
anders - op contact vult het formulier het halve scherm - dus een vaste positie
afvinken zou op de ene pagina terecht en op de andere onterecht klagen.

## Contactgegevens en de WhatsApp-knop

Sinds 10-10-2026 staat het 020-nummer er niet meer op: dat heeft FRAME MEDIA
niet meer. Het mobiele nummer (06 3486 1375) is nu het enige telefoonnummer op
de site en ook het nummer achter de WhatsApp-knop
(`wa.me/31634861375`, met een korte regel voorgevuld). **Dat tweede is een
aanname** - zie "Nog open", punt 13.

De knop staat op elke pagina naast het telefoonnummer in de cta-band, in de
voettekst, in de bereikbaarheidslijst op contact, en als derde knop in de
meebewegende balk op de telefoon.

Het WhatsApp-teken is een merkteken van iemand anders en is dus niet
hertekend in onze getekende lijnstijl. Het staat een keer als bestand in
`inhoud/assets/wa.svg` en wordt met een `mask` gekleurd met `currentColor`
(`.ico-wa`), niet als `<img>` ingeladen: een `img` houdt zijn eigen kleur en
dan klopt hij in een van de twee weergaves niet. In de bereikbaarheidslijst
krijgt hij via `.ico-wa-lijst` hetzelfde rood als de iconen ernaast.

**De actiebalk op de telefoon heeft nu drie knoppen**, en daar zit de valkuil.
`.btn` draagt `white-space: nowrap`, dus bepaalde "Plan een gesprek" ineens de
smalste maat van de pagina. Op de balk mag een label daarom afbreken. Eerst
met `overflow-wrap: anywhere`, maar dan staat er `WhatsA` / `pp` - dus nu
`break-word` plus een kleinere maat (0,82rem), zodat alleen "Plan een gesprek"
op de spatie afbreekt. `meet-360.mjs` meet dat na op 360 breed, want `kijk.mjs`
kent alleen 390 en ziet dit dus niet.

## Wat `kijk.mjs` nameet

4920 metingen over 23 pagina's (11 nl, 6 en, 6 de), op desktop en telefoon:

- consolefouten, mislukte requests, statuscodes
- kapotte afbeeldingen (na een keer door de pagina scrollen, anders tellen de
  `loading="lazy"`-foto's onder de vouw allemaal als kapot)
- horizontaal scrollen (met de schuldige elementen erbij)
- contrast van elke zichtbare knop en van de lopende tekst, met een drempel die
  van de lettermaat afhangt (4,5:1 gewoon, 3:1 bij grote tekst)
- de meebewegende balk, het menu op de telefoon
- elk `#anker`: bestaat het doel, en landt het vrij van de vastgezette menubalk
- een `h1` per pagina
- elke interne link nagelopen op statuscode

Die ronde liep tot 11-10-2026 twee keer, een keer per weergave. De site is nu
alleen donker, dus het is een ronde.

**De paginalijst staat met de hand in `kijk.mjs` en in `meet-360.mjs`**, dus
zet een nieuwe pagina daar ook neer. Een taalmap die je vergeet wordt stil niet
opgevraagd, en dan meldt het script nul fouten over iets wat het nooit gezien
heeft - dat gebeurde eerder met `/voorwaarden.html`, die er vier uur op stond
zonder ooit gemeten te zijn. `meet-360.mjs` moet er ook alle drie de talen in
hebben, want een Duits knoplabel is langer dan het Nederlandse
("Gesprach vereinbaren" tegen "Plan een gesprek") en de smalste maat van de
pagina kan dus per taal ergens anders zitten.

Vier dingen die daarmee zijn gevonden en gerepareerd:

1. De knop in de menubalk stond grijs op rood (3,98:1). `.nav > a` weegt
   (0,1,1) en `.btn-primair` maar (0,1,0), dus de menukleur won van de
   knopkleur. Opgelost met `.nav > a:not(.btn)`. Precies dezelfde valkuil als
   bij de Anne van Zon-site; het is kennelijk een terugkerende.
2. De ankers landden onder de vastgezette menubalk, dus `#tarieven`,
   `#studio-a` en de rest lieten een halve kop zien. Opgelost met
   `[id] { scroll-margin-top: 104px }`.
3. **De marineband mat zichzelf niet.** Hij tekende zijn kleur alleen in een
   verloop, en een verloop is een `background-image`: de gemeten achtergrond
   was dus doorzichtig en het contrastscript keek dwars door de band heen naar
   de pagina eronder. Op donker viel dat niet op omdat die toevallig ook donker
   is. In de lichte weergave meldde hij ineens 1,06:1 op een band die in het
   echt gewoon donker is. Met `background-color` eronder klopt de meting weer -
   en toen bleek de band een echte fout te verbergen die er altijd al zat: hij
   is zelf lichter dan de pagina (`#2e3e50` tegen `#0d1117`), dus zachte tekst
   haalt daar 3,80:1 in plaats van de 5,8:1 van de pagina. Beide tonen zijn op
   die band opgehelderd, in allebei de weergaves.
4. **De contrastmeting keek niet naar de kaarttitels.** Twee gaten tegelijk:
   ze stonden in een `<span>` en de meting pakte alleen `p, li, dd, dt`, en er
   zat een bovengrens van 60 elementen op waar de startpagina al overheen was -
   dus nieuwe blokken werden sowieso niet meer gemeten. Dat liep op 10-10-2026
   meteen mis: de branchekaarten kregen alleen hun eigen klasse en niet
   `.video-kaart`, dus stond er witte tekst op de grijze knopkleur van de
   browser (1,14:1) en meldde het script nul fouten. De meting pakt nu ook
   `.video-titel`, `.video-bij`, `.branche-regel` en `.video-duur`, met een
   grens van 250. Nagemeten door de fout er met de hand weer in te zetten: nu
   slaat hij wel aan.

## De branches van Puur Genieten

Acht verticale clips (720x1280, 14 tot 29 seconden), 08-10-2026 door de klant
via WeTransfer aangeleverd. Ze staan op de startpagina onder "Dit zijn de
branches voor het programma Puur Genieten". Daar stond eerst een regel onder
("Acht branches waarin Puur Genieten draait..."); die is er op 10-10-2026 op
verzoek van Armando afgehaald - de kaarten zeggen het zelf al.

- De aangeleverde bestanden staan **buiten de projectmap**, in
  `playground/.aangeleverd-framemedia/puur-genieten/` (210 MB). Alles wat in de
  projectmap ligt kan met een verkeerd ingesteld `[assets]` de Worker op.
- `maak-branches.mjs` maakt er een mp4 van (h264, crf 28, 1 tot 7 MB per clip)
  plus een posterbeeld van 480 breed. Geen webm: vp9 kwam er bij deze clips
  groter uit dan h264.
- **Het tijdstip van elk posterbeeld staat met de hand in dat script.** Elke
  clip heeft een ondertitel die regel voor regel opbouwt en een logo dat in
  beeld draait, dus een vast tijdstip geeft kaarten met een halve zin erin. Let
  ook op de overgangen: rond 8 seconden heeft Eten en drinken een zwarte naad
  over het midden en Golfen zwarte balken boven en onder.
- De kaart laadt alleen het posterbeeld. Pas na een klik komt er een `<video>`
  met bediening in de plaats - een mp4 van een paar megabyte haal je niet op
  voor iemand die langs scrolt. Dit zijn eigen bestanden, dus geen YouTube.
- De kaart draagt `.video-kaart` **en** `.branche-kaart`. De eerste levert de
  kaart zelf (achtergrond, rand, zweefstand), de tweede maakt hem staand.

## De landingspagina /puurgenieten/

Op verzoek van Armando (10-10-2026), op hetzelfde adres als bij hen:
`framemedia.tv/puurgenieten/`. Daarom `inhoud/puurgenieten.html` dat naar
`dist/puurgenieten/index.html` gaat en niet naar `puurgenieten.html` - dan
klopt de slash die de klant al rondstuurt. Workers stuurt `/puurgenieten`
zelf met een 307 door naar de versie met slash, dus allebei de vormen werken.

**Hij staat sinds 10-10-2026 in de menubalk**, als tweede knop, net als op hun
eigen site. Hij stond er eerst bewust niet: dit is de pagina waar verkeer
naartoe gestuurd wordt en elke menuknop erop is een uitgang. Armando wilde hem
er toch in ("put it also in the menu"), en dat is zijn keuze - de pagina is dan
ook te vinden voor wie via een andere ingang binnenkomt. Verder staat hij in de
voettekst ("Wat wij doen") en onder de branchekaarten op de startpagina.

Dat is wel een knop erbij in een balk die al vol stond, in alle drie de talen.
Twee dingen zijn daarvoor aangepast, allebei in `style.css`:

- De ruimte om de woorden heen is krapper (`.nav` gap `.2rem` -> `.1rem`,
  linkpadding `.78rem` -> `.58rem`, letter `.93rem` -> `.9rem`, en de rode
  streep onder de huidige pagina mee). De rij is daarmee 883 breed in plaats
  van 987, en past dus naast het merk binnen de `--wrap` van 1180.
- **Het menu klapt nu in onder 1180 in plaats van onder 880.** De
  meebewegende contactbalk hoort daar níet bij - die is voor de telefoon en
  staat nog steeds op 880, anders schuift hij op een laptop van 1000 breed in
  beeld. Daarom staan de twee grenzen nu in losse media-queries; wie er een
  verandert moet de ander met rust laten.

`meet-balk.mjs` bewaakt dat: het meet de balk op twaalf breedtes in allebei de
weergaves en zakt zowel als de rij uitsteekt boven de grens als wanneer hij
nog een rij is eronder.

Hun eigen pagina is een kop, een regel en een formulier met vijf velden. Die
vijf velden staan er in dezelfde volgorde (bedrijfsnaam, contactpersoon,
telefoon, e-mail, branche); de rest van de pagina is van ons en bestaat uit
blokken die elders op deze site al staan: het item van SBS 6, de acht
branchekaarten, de inbegrepen-lijst, de drie tarieven en de zes stappen.

Twee dingen die afwijken van hun formulier:

- **Branche is een keuzelijst geworden** (blok `brancheOpties`), met "Mijn
  branche staat er niet bij" als laatste optie. Bij hen was het een leeg
  tekstveld, dus de bezoeker moest gokken hoe wij een branche noemen.
  Stond eerst op `BRANCHES` (de acht kaarten met een voorbeeldfilm); sinds de
  brochure hieronder komt hij uit `PG_CATEGORIEEN`.
- **De kop boven het formulier is ingekort.** Bij hen staat er "Ja, wij willen
  graag meer informatie hebben over PUUR GENIETEN op SBS6, KIJK en social
  media." Dat staat hier als "Ja, ik wil meer informatie" met de rest als regel
  eronder - als kop over twee regels in hoofdletters leest het niet.

Het item is `deTdhbPWHEw`, dezelfde kaart als in `videoGrid` maar een breed
(blok `pgVideo`, klasse `.videos-een`, max 860px). De kaart laadt alleen de
thumbnail; pas na een klik komt er een youtube-nocookie-insluiting.

### `deTdhbPWHEw` is geen uitzending (10-10-2026)

Armando: die video is een **introductiefilm die met AI is gemaakt**, bedoeld om
een indruk te geven van hoe een item eruitziet. Hij stond hier als een echt
uitgezonden item, met `bij: 'SBS 6'`. Dat is op drie plekken rechtgezet:

- `data.mjs` + `taal/en.mjs` + `taal/de.mjs`: het label onder de kaart is nu
  "Introductie, met AI gemaakt". De kaart staat op de startpagina, op formats
  en op de landingspagina, dus een label is genoeg voor alle drie.
- De kop op de landingspagina was "Een item uit Puur Genieten" met
  "Tweeenhalve minuut op SBS 6". Dat is nu "Een indruk van Puur Genieten", met
  erbij dat het beeld met AI is gemaakt en dat het eigen item echt wordt
  opgenomen. In alle drie de talen.
- Het heroboeld op `branded-content` was een uitsnede uit precies deze video
  (`assets/gen/interview-item-*.webp`, 1:09, Roxanna buiten voor een ingang) en
  stond onderschreven als "Beeld uit een non-spot item voor Puur Genieten,
  SBS 6". Dat was dus een AI-beeld met een uitzendclaim eronder. Vervangen door
  een echt beeld uit het Kempkes Mode-item (`hph7jDwIAck`, 0:30,5), met de
  naambalk "Jose Kempkes / Kempkes Mode" er gewoon in beeld. Staat nu in
  `assets/fotos/interview-kempkes-{800,1280}.webp`; het bronbestand is 1280x720,
  dus er is geen 1600 meer. De oude AI-beelden liggen in `raw/gen-archief/`.

### De verkoopbrochure van de klant (10-10-2026)

Armando stuurde een pdf van vier pagina's door die FRAME MEDIA zelf gebruikt om
Puur Genieten te verkopen ("Proost op het leven!"). Die ligt in
`raw/brochure-puur-genieten.pdf`. Dit is het eerste materiaal over Puur
Genieten dat van henzelf komt en niet uit hun oude site geschraapt is, dus waar
de brochure iets zegt, wint de brochure.

Wat eruit op de pagina staat, allemaal in `data.mjs` onder `PG_*` en per taal
vertaald in `taal/en.mjs` en `taal/de.mjs`:

- `PG_KIJKER` - wie er kijkt (mannen en vrouwen van circa 20 tot 70, met de
  zeven interesses die zij noemen). Stond nergens op hun site.
- `PG_CATEGORIEEN` - de tien lifestylecategorieen die zij verkopen. Dit is
  iets anders dan de acht `BRANCHES`: die acht zijn de aangeleverde
  voorbeeldfilms, deze tien zijn het aanbod. Ze staan in een eigen sectie
  `#voor-wie` en vullen sinds nu de keuzelijst van het formulier.
- `PG_ANDERS` - hun eigen regel dat andere branches ook kunnen.
- `PG_OPBRENGST` - hun blok "Waarom deelnemen?", vijf punten.
- `PG_GEBRUIK` - hun blok "Wat ontvang je als deelnemer?", waar het rechtenvrije
  item daarna mag staan. Samen staan die twee in de sectie na de tarieven.

Verder noemt de brochure **presentatrice Roxanna**, die met de eigen filmcrew
langskomt. Die naam stond nergens op de site en staat nu in de opsomming onder
de hero, in alle drie de talen.

Drie dingen die van ons zijn en niet van hen:

1. **De aanspreekvorm.** De brochure wisselt tussen "je/jouw" en "u"; de site
   is overal "u", dus alles is omgezet.
2. **"Persoonlijke verzorging".** Hun lijst zegt "Persoonlijke, zoals huid,
   haar, nagels en parfums" - daar is een woord weggevallen.
3. **De naam Roxanna.** De lopende tekst in de brochure schrijft "Roxana", de
   handtekening eronder "Roxanna". Wij houden de handtekening aan. Dit moet
   langs FRAME MEDIA (zie hieronder).

### De brochure is de enige bron over Puur Genieten (11-10-2026)

Armando: "verwijder alle informatie over puur genieten die je dus zelf
verzonnen hebt en niet uit de pdf kwam". Terecht, en groter dan het leek. Hun
eigen `/puurgenieten/` is namelijk **alleen een formulier** - geen zin tekst
(zie `raw/puurgenieten.html`). Alles wat er verder over Puur Genieten op deze
site stond kwam dus of uit de brochure, of van de Mondzorg.TV-pagina (een
**ander format**), of uit mijn eigen pen.

Wat er nu nog over Puur Genieten mag staan, en de enige drie bronnen:

1. **De brochure** (`raw/brochure-puur-genieten.pdf`).
2. **De acht branchefilms** + het logo, aangeleverd via WeTransfer (08-10 en
   10-10-2026). Alleen de bestandsnamen, niets eromheen.
3. **De AI-introductiefilm** op YouTube, door Armando zelf gestuurd.

Wat eruit is, met waar het vandaan kwam:

| Weg | Kwam van |
| --- | --- |
| "Een redactioneel item van drie tot vijf minuten" | Mondzorg-tarieven |
| "Opname in uw eigen bedrijf, of in onze studio in Hilversum" | Mondzorg; de brochure zegt alleen "bij u op locatie" |
| "Uitzending op twee weekenddagen, de zenderfee zit in de prijs" | Mondzorg |
| "All-in vanaf 2990" in de hero en in de omschrijving | Armando's prijzen voor branded content |
| De hele sectie "Alles wat er voor nodig is, in een prijs" (`INBEGREPEN` + `TARIEVEN`) | Mondzorg |
| De sectie "Van aanmelding tot uitzending" (`STAPPEN`) | Mondzorg |
| De regel onder elke branchenaam ("Makelaars en aanbieders van een tweede huis") | van mij, afgeleid uit de clip - was punt 10 hieronder |
| ~~"Wij reageren binnen een werkdag, geen kosten en geen verplichtingen"~~ **teruggezet 11-10-2026** | was van mij, maar Armando: "dat is vanzelfsprekend". Staat weer onder het formulier in alle drie de talen, in **allebei** de versies. Dezelfde regel staat ook op contact en op programma-idee, dus hij is sitebreed consistent |
| "Meld u aan, dan kijken we samen of uw branche past en wanneer er zendtijd is" | van mij |
| "Ruim honderd bedrijven gingen u voor" boven de logoband | waar: het is hun referentielijst, maar op **deze** pagina leest het als honderd deelnemers aan Puur Genieten. Nu "Opdrachtgevers van FRAME MEDIA" |
| `EIGEN_FORMATS` > Puur Genieten: "voor merken die zich met eten, drinken en beleving willen verbinden" | van mij; hun formatpagina noemt Puur Genieten alleen in het menu |
| alt-tekst "Beeld uit de Puur Genieten-**aflevering**" | van mij; die clips dragen zelf een AI-merkje, het zijn geen uitzendingen. Nu "-film" |

Op de plek van de tarieven staat nu alleen **Tarieven op aanvraag** met een
knop naar het formulier en een naar contact (Armando koos optie 1). De lege
plekken zijn gevuld met wat de brochure wel zegt: de alinea over inspirerende
verhalen (ondernemers, experts, marketingmanagers), het interview en de
professionele impressie, tweemaal op SBS6 plus KIJK, en de social-regel. De
cta-band draagt nu hun eigen "Proost op het leven" en hun eigen vraag
("Interesse in deelname of meer informatie over PUUR GENIETEN op SBS6, KIJK en
social media?").

`INBEGREPEN`, `TARIEVEN` en `STAPPEN` blijven bestaan: die horen bij branded
content en staan daar nog gewoon op de pagina. Ze staan alleen niet meer onder
een Puur Genieten-kop.

### Een versie van de landingspagina: de uitgebreide (11-10-2026)

De pagina stond een halve dag in twee uitvoeringen naast elkaar, met een
schakelbalk erboven: optie 1 (alles) en optie 2 (alleen wat uit de brochure
komt). Armando heeft diezelfde dag gekozen: "de beknopte versie kan ook weg van
puur genieten." Optie 1 staat nu op `/puurgenieten/` (en `/en/puur-genieten/`,
`/de/puur-genieten/`), optie 2 is weg, en met hem de schakelbalk
(`versieSchakel`, `VERSIE_SLEUTELS`, `.versie-schakel` in de css, `versie` in
de drie taalbestanden en de `puurgenietenVol`-paden en -meta).

**Let op wat die keuze inhoudt.** De beknopte versie was de versie waar alles
uit was gehaald wat niet in de brochure van de klant staat. Wat daarmee weer
live staat en dus niet uit de brochure komt:

- "een redactioneel item van drie tot vijf minuten", "opname in uw eigen
  bedrijf of in onze studio in Hilversum" en de zes stappen van aanmelding tot
  uitzending - dat komt van hun Mondzorg.TV-pagina en geldt daar voor dat
  format;
- de regel onder elke branchenaam (`branchesVol`) - die is van ons, afgeleid
  uit wat er in de clip te zien is;
- "Ruim honderd bedrijven gingen u voor" boven de logoband: waar voor hun hele
  referentielijst, maar op deze pagina leest het als honderd deelnemers aan
  Puur Genieten.

Een ding is daarmee wel bevestigd: "uitzending op twee weekenddagen" stond er
als Mondzorg-claim en is nu het uitgangspunt van de klant zelf, zie hieronder.

Twee dingen zijn bewust **niet** teruggedraaid: de alt-tekst onder de
branchekaarten zegt "Puur Genieten-film" en niet "-aflevering" (die clips
dragen zelf een AI-merkje), en de zin over Puur Genieten in `EIGEN_FORMATS` op
de formatpagina blijft de zin uit de brochure.

### De prijs is voor twee uitzendingen (11-10-2026)

Armando: "maak heel duidelijk bij de prijs dat het is voor twee losse
uitzendingen voor puur genieten; zowel de zaterdag als de zondag > dus een keer
voor 3 minuten betalen, is 6 minuten zendtijd."

Dat staat nu op vier hoogtes, van de kaart tot de kleine letters:

- **Op de prijskaart zelf**, als eigen veld `zendtijd` in `TARIEVEN`:
  "2 x 3 minuten = 6 minuten zendtijd", met een lijntje onder het bedrag
  (`.tarief-zendtijd`). Dat is geen voetnoot maar een deel van de prijs.
- **In de alinea boven de kaarten**, vet, op `branded-content.html` en op de
  landingspagina.
- **In een `prijs-noot` onder de kaarten** op branded content: twee losse
  uitzendingen, de lengte op de kaart is de lengte van het item en de zendtijd
  die je krijgt is het dubbele.
- **In de opsomming in de hero** van de landingspagina, in `INBEGREPEN`, in
  stap 5 van `STAPPEN`, in de twee vragen over prijs en uitzendmoment, en in de
  `description` van de landingspagina. "Twee weekenddagen" is overal "zaterdag
  en zondag" geworden: hetzelfde, maar het laat zich niet anders lezen.

Alles in alle drie de talen.

### 6 en 9 minuten: op aanvraag (11-10-2026)

Armando: "op de branded content pagina kan bij 6 en 9 minuten de prijs
weggehaald worden en dan kan erbij gezet worden dat de prijs op aanvraag is. De
opmerking dat alle extra's erbij zitten kan ook weg want dat is niet standaard
zo."

`TARIEVEN_GROOT` draagt dus geen bedrag meer (6990 en 9990 zijn eruit, die
kwamen van hun Mondzorg.TV-pagina) maar "Op aanvraag", en de regel "Inclusief
alle extra's" is "Zaterdag en zondag uitgezonden" geworden. De kop erboven zegt
nu dat de prijs van een langer item afhangt van wat erin komt. Een woord in de
maat van een getal van vier cijfers loopt over zijn kaart heen, vandaar
`.tarief-prijs-woord`, een maat kleiner.

Dat raakte ook de vraag "Wat kost het?" in `VRAGEN`: die noemde 9990 en "alle
extra's inbegrepen". Daar staan nu de bedragen die Armando zelf gaf, de twee
uitzendingen, en dat de langere lengtes op aanvraag gaan.

### Ook 5 minuten op aanvraag (11-10-2026)

Armando: "5 minuten moet op aanvraag, zowel bij branded content als bij puur
genieten." De 4990 die hij er diezelfde dag zelf op had gezet is er dus weer
af. Er staat nu een bedrag bij 3 en 4 minuten, en "Op aanvraag" bij 5, 6 en 9.

Beide pagina's trekken dezelfde `TARIEVEN` uit `data.mjs` (via `<!--#tarieven-->`),
dus dit is een regel per taal. De zendtijdregel op die kaart blijft staan:
twee uitzendingen is nog steeds 10 minuten zendtijd, ook zonder bedrag.

`tarieven()` in `blokken.mjs` zet `.tarief-prijs-woord` er nu zelf bij als de
prijs niet met een cijfer begint - dezelfde kleinere maat die `tarievenGroot()`
al had. Zo hoeft niemand bij een volgend "op aanvraag" aan de opmaak te denken.

De vraag "Wat kost het?" noemt in alle drie de talen alleen 2990 en 3990 meer,
met 5, 6 en 9 minuten op aanvraag.

## Klaar om naar www.framemedia.tv te gaan (17-10-2026)

Alfred leverde een analyse van de oude site en van waar die in Google staat. Wat
daaruit kwam zit nu in de bouw. De conceptversie blijft wat hij was: noindex,
robots dicht, conceptadres. De verhuizing is een vlaggetje.

### Twee bouwen uit dezelfde bron

```bash
node bouw.mjs                                        # concept: noindex, robots dicht
FM_FORM_ENDPOINT=https://... node bouw.mjs --prod    # www.framemedia.tv
```

`--prod` doet vier dingen: canonicals en sitemap op `https://www.framemedia.tv`,
geen `noindex`, een robots.txt die opengaat met de sitemap erin, en de regel
"Conceptversie - teksten, tarieven en gegevens nog niet definitief" uit de
voettekst. Het lint gaat er dus met een vlaggetje af en niet met de hand - een
conceptadres dat per ongeluk opengaat is twee complete kopieen van dezelfde site
in Google, en dat is precies wat de analyse wil voorkomen.

**De productiebouw heeft twee poorten die hem laten vallen.** De eerste: zonder
`FM_FORM_ENDPOINT` stopt hij. De formulieren vangen het versturen nu af in
site.js en laten alleen een bedankregel zien; op het conceptadres is dat eerlijk,
op de echte site verdwijnt elke aanvraag - ook die van `/programma-idee/`, en dat
is hun sterkste pagina in Google. De tweede: hij leest `dist/` daarna zelf na op
`conceptversie`, `concept version`, `Konzeptversion`, `jouwconcept.app` en
`noindex` en valt op elke treffer. De foutpagina is de enige uitzondering, want
die hoort op noindex (hij geeft een 404).

Staat er een endpoint, dan post site.js de FormData daarheen en komt de
bedankregel pas als dat gelukt is; mislukt het, dan blijft het ingevulde
formulier staan met de reden erbij. De bedankregels zelf staan woordelijk in
`DANKREGELS` in `bouw.mjs` - "uw bericht", "uw idee" en "uw aanmelding" zijn drie
verschillende dingen. Een regel in die tabel die niets meer raakt laat de bouw
ook vallen, anders dekt hij morgen stilletjes iets anders toe.

### De adressen staan zonder .html

Tot 17-10-2026 waren het `/studio.html`, `/branded-content.html` enzovoort.
Workers assets stuurt `/studio.html` met een 307 door naar `/studio`, dus elke
canonical, elke hreflang en elke sitemap-url van onze eigen site wees naar een
omleiding. Nu heten de adressen `/studio`, `/formats`, `/branded-content`,
`/over-ons`, `/contact`, `/vacature`, `/voorwaarden` - de bestanden in `dist/`
heten nog wel `*.html`, want dat is wat assets zoekt. `/puurgenieten/`,
`/programma-idee/`, `/en/` en `/de/` eindigen op een slash en hadden dat al.

`kijk.mjs`, `meet-360.mjs` en `serveer.mjs` kennen die adressen ook, dus wat
gemeten wordt is wat er gepubliceerd staat.

### `_redirects` - de oude WordPress-adressen

`bouw.mjs` schrijft `dist/_redirects`. Workers assets leest dat net als
Cloudflare Pages (nagemeten op het conceptadres: alle dertien 301, en het bestand
zelf geeft een 404 - het wordt niet uitgeleverd). Twee regels uit de analyse
staan er bewust anders in:

- `/puurgenieten/` zou naar `/formats` wijzen. Dat adres is hier een **echte
  pagina** op precies hetzelfde adres als bij hen; een omleiding zou de
  landingspagina wegvangen. Staat er dus niet in.
- `/algemene-leveringsvoorwaarden/` zou naar de startpagina gaan. Die tekst
  staat hier op `/voorwaarden`, dus daar gaat hij naartoe. Een omleiding naar de
  pagina die hetzelfde zegt houdt de kracht vast, een omleiding naar de
  startpagina gooit hem weg.

De zes studio-pdf's gaan naar `/studio`, `/category/*` en `/author/*` naar de
startpagina.

### De oude afbeeldingen blijven op hun oude pad

Het logo en de studiofoto's staan in Google Afbeeldingen op hun eigen
`/wp-content/uploads/...`-adres. Verandert het pad, dan is het voor Google een
nieuwe afbeelding en begint die bij nul. `node haal-oude-media.mjs` haalt die 57
bestanden (18 MB) van www.framemedia.tv naar `oud/` op hetzelfde pad; `bouw.mjs`
kopieert die map ongewijzigd in `dist/`. Ze worden nergens vanaf gelinkt en staan
niet in de sitemap - ze moeten alleen blijven antwoorden. Het script kijkt naar
het content-type dat binnenkomt, want een WordPress die een 200 met een
foutpagina teruggeeft is erger dan een 404: dan staat er html onder een `.jpeg`.

**Haal ze op voordat de oude site offline gaat.** Daarna bestaat de bron niet
meer en is `oud/` het enige exemplaar.

### Programma idee staat in het menu

`/programma-idee/` is bij hen het sterkste adres van de hele site: nummer 1 tot 2
in Google op "tv programma idee", "programma idee" en "programma idee insturen".
Hier stond het alleen in de voettekst en in een knop op de formatpagina, en nu
ook in de menubalk, als achtste knop na Formats. Bij hen is het een subitem onder
Formats; wij hebben geen uitklapmenu, dus het staat plat.

Titel en H1 beginnen met dezelfde woorden als bij hen: `<title>Programma idee
insturen? | FRAME MEDIA`, `<h1>Programma idee?`. Zonder streepje, en dat is een
keuze tegen het Nederlands in - "programma-idee" is de juiste spelling, maar
"programma idee" is de zoekopdracht waar die pagina op staat en bij een
verhuizing verander je niet precies dat. In de lopende tekst staat het wel met
streepje.

Een achtste knop kostte wel ruimte. De maten in de menubalk zijn krapper
(`.9rem` naar `.86rem`, padding `.58rem` naar `.46rem`, kopgat `1.5rem` naar
`1.15rem`) en de balk klapt eerder in: onder 1220 in plaats van onder 1180. De
rij is naast het merk 972 beeldpunten breed en er is boven 1220 precies 991 - dat
is nagemeten met `meet-balk.mjs` op veertien schermbreedtes, in vier talen.
`GRENS` in dat script en de media query in `style.css` moeten dezelfde maat
houden, anders meet het script iets anders dan de site doet.

### Wat hierna in Cloudflare moet, en niet in de bouw kan

1. **Always Use HTTPS** aan op de zone framemedia.tv.
2. Een **Redirect Rule** `framemedia.tv/*` naar `https://www.framemedia.tv/$1`
   (301). Zonder die twee staat dezelfde site op meer dan een hostnaam.
3. De **sitemap aanmelden** in Search Console zodra de site live staat.

De productiebouw zet deze drie ook op het scherm, zodat niemand ze hoeft te
onthouden.

## Nog open - moet langs FRAME MEDIA

0. **Heet zij Roxanna of Roxana?** Hun eigen brochure doet het allebei: de
   lopende tekst schrijft "Presentatrice Roxana", de handtekening eronder
   "Roxanna". Haar naam staat nu met dubbele n op de landingspagina in drie
   talen. Een verkeerd gespelde presentatrice is het soort fout dat de klant er
   meteen uit haalt.
1. **De vier extra's.** 490 (custom item), 990 (interview in de studio), 590
   en 1490 (break-bumper) staan openbaar op hun eigen Mondzorg.TV-pagina en
   gelden daar voor **dat format**. Hier staan ze als algemene extra's bij
   branded content, en dat is na 11-10-2026 de enige aanname die er over de
   prijzen nog is. Armando is er vier keer naar gevraagd en heeft nog niet
   gezegd of die bedragen kloppen of dat er extra's bij moeten. De twee
   bedragen die er nog staan (2990 en 3990) gaf hij zelf; 4990, 6990 en 9990
   zijn er op zijn verzoek af en staan nu op aanvraag. Openlijk prijzen tonen
   is wel de sterkste kant van het concept: bijna geen enkele concurrent doet
   dat.
2. **Het aantal zenders.** De cijferbalk zegt zeven. RTL 4, RTL 7, SBS 6 en AT5
   staan op hun homepagina; RTL Z, Net 5 en Veronica komen uit hun
   vacaturetekst. Alle zeven zijn dus van hen, maar ze staan nergens bij elkaar
   in een rij. Even bevestigen dat dit nog actueel is.
3. **1981.** Komt van hun formatpagina, bij Rolo Commercial: "Wij maken tv
   reclame sinds 1981." Dat gaat over die tak. Op deze site staat het als
   "maken wij televisie sinds 1981" in de cijferbalk. Als FRAME MEDIA zelf
   jonger is dan Rolo, moet dat anders.
4. **Het adres.** De studio staat op de site als "Hilversum", want dat is wat
   hun eigen tekst zegt ("Interview in studio Hilversum"). Een straat en
   huisnummer staan nergens op hun site en die heb ik niet verzonnen. Ook geen
   KvK-nummer gevonden; dat hoort wel op een zakelijke site.
5. **Het logo klein.** In de menubalk staat alleen hun woordmerk, want hun
   insigne is op die hoogte onleesbaar (zie hierboven). Hebben zij zelf een
   officiele liggende of compacte versie, dan is die beter - vervang dan
   `logo-woord*.svg` en draai `maak-logo.mjs` niet opnieuw.
6. **"Million Euro Listing".** Op hun site staat "Milion Euro Listing", met een
   l. Hier staat het met twee, aangenomen dat het een tikfout is.
7. **Beeldmateriaal.** De zes studiofoto's van hun eigen site (april 2023)
   staan er nu op: in de studioband op de startpagina en per ruimte op de
   studiopagina. In de hero staat het insigne, niet een foto.
   Ruw in `raw/fotos/`, als webp op twee breedtes in `inhoud/assets/fotos/`.
   Wat nog ontbreekt: beeld bij de formats en bij branded content, en
   bewegend beeld. Zij maken televisie, dus stills en fragmenten uit eigen
   producties liggen er. Een videofragment in de hero zou het af maken.
8. **Formulier.** Verstuurt niets op het conceptadres, toont alleen een
   bedankscherm dat dat er zelf bij zegt. Dit is sinds 17-10-2026 het enige
   wat de productiebouw tegenhoudt: `node bouw.mjs --prod` stopt met een
   foutmelding zolang er geen `FM_FORM_ENDPOINT` is. Zie de sectie over de
   verhuizing.
9. **Social.** Hun site linkt naar Facebook, Twitter, YouTube en LinkedIn. Die
   links staan hier nog niet in de voettekst, want de doel-URL's stonden niet
   in de opgehaalde pagina.
10. ~~De regel onder elke branchenaam.~~ **Opgelost 11-10-2026**: die acht
    regels zijn eruit, zie hierboven. Onder de kaart staat nu alleen nog de
    branchenaam, en die is letterlijk hun bestandsnaam.
11. **Het AI-merkje in de clips.** Rechtsonder in elk filmpje staat een rond
    `AI`-label, dat zit in het aangeleverde beeld zelf en staat dus ook op de
    kaarten. Dat is hun eigen keuze en ik haal het er niet uit; wel goed om te
    weten dat het op de site zichtbaar is.
12. **"2nd home".** Dat is letterlijk de bestandsnaam. Op een Nederlandse
    pagina tussen Massage, Reizen en Tuinen valt dat op. "Tweede huis" zou
    passender zijn, maar dat is hun naam en niet de mijne.
13. **Staat WhatsApp op 06 3486 1375?** Armando vroeg om een WhatsApp-knop en
    tegelijk om het 020-nummer eraf. Het mobiele nummer is daarmee het enige
    nummer dat er nog staat, dus die knop wijst daarheen. Niet bevestigd dat
    WhatsApp op dat nummer draait, en ook niet of het hun zakelijke
    WhatsApp is. Is het een ander nummer, dan staat het op een plek:
    `WA` in `bouw.mjs` plus de `wa.me`-links in de pagina's.
14. **De extra's.** Armando zei op 10-10-2026 "de extra's zitten er niet bij in"
    vlak na de nieuwe prijzen (3/4/5 minuten). De kaarten zeggen nu
    "All-in, zonder extra's" en de vier losse opties staan eronder met hun
    eigen bedrag. Of hij bedoelde dat die bedragen nog moeten komen, of dat
    de zin op de kaart moest kloppen, is niet uitgezocht - dat ligt bij hem.
15. **De Engelse en Duitse tekst is van ons.** De Nederlandse copy komt van
    framemedia.tv; de vertaling is door mij gemaakt en door niemand van FRAME
    MEDIA nagelezen. Een Duitse klant leest zijn eigen vak na, dus dit hoort
    langs iemand die de taal spreekt voordat het live gaat. Twee plekken om
    extra naar te kijken: de vaktermen in de regie (Gallery A, vision mixer,
    broadcast processing) en de branchenamen van Puur Genieten, want die
    waren in het Nederlands ook al onze woorden (punt 10).
16. **Wie beantwoordt een Engels of Duits formulier?** De site belooft nu in
    drie talen antwoord binnen een werkdag. Als er niemand is die een Duitse
    aanvraag in het Duits terug kan bellen, is een taal erbij een belofte die
    niet wordt ingelost. Voor wie ze de talen wil, bepaalt dat ook of er een
    apart telefoonnummer of mailadres bij hoort.
17. **`2nd home` blijft `2nd home`** in alle drie de talen, net als in het
    Nederlands (punt 12). Het is hun eigen bestandsnaam, dus ik heb er geen
    "Zweitwohnsitz" van gemaakt.

De hele site staat op `noindex` plus een `robots.txt` die alles dichtzet. Dat
geldt ook voor de Engelse en Duitse pagina's: de `hreflang`-set en de sitemap
staan er goed in, maar zolang het lint erop zit doet een zoekmachine er niets
mee. Gaat het eraf, dan is dat een regel in `bouw.mjs` plus de `robots.txt`. Het
rode lint bovenaan elke pagina is er op verzoek afgehaald (27-09-2026); dat het
een concept is staat nog in de onderste voetregel en in de bevestiging van het
contactformulier.
