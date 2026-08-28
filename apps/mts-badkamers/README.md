# MTS Badkamers

Live: **https://mts-badkamers.nl**

**MTS Badkamers is een handelsnaam van M. Techno Service.** De handelsnaam is
wat de site laat zien: title, og:site_name, de lockup in de nav en de footer,
alle vier de talen. De statutaire naam hoort alleen op de plekken waar de
inschrijving telt en staat daar ook: de handelsnaamregel onderin de footer, het
FAQ-antwoord over garantie en `legalName`/`alternateName` in de JSON-LD. In code
is dat `BIZ.name` tegenover `BIZ.legalName` (`projects.mjs`); gebruik nooit een
letterlijke naam in een template.

Vier hostnamen wijzen naar dezelfde Worker en `worker/index.ts` stuurt er drie
met een 301 door naar de eerste, zodat de site op precies een adres in de index
staat:

| host | wat er gebeurt |
| --- | --- |
| `mts-badkamers.nl` | de canonieke host, gelijk aan `ORIGIN` in `build.mjs` |
| `www.mts-badkamers.nl` | 301 naar de kale domeinnaam |
| `m-techno-service.jouwidealewebsite.nl` | 301, was het vorige adres |
| `m-techno-service-concept.jouwidealewebsite.nl` | 301, was het adres daarvoor |

Statische site, gegenereerd uit de aangeleverde WhatsApp-media (264 bestanden in
`assets/media`). Elke pagina staat als complete HTML op schijf; er wordt op de
client niets nagerenderd.

## Bouwen

Vanuit de root van de monorepo:

```bash
pnpm --filter @jiw/mts-badkamers build         # media (alleen wat ontbreekt) + de vier talen
pnpm --filter @jiw/mts-badkamers dev           # bouwt en serveert site/ op :3066
pnpm --filter @jiw/mts-badkamers audit:seo     # sitemap, canonicals, hreflang, titels
pnpm --filter @jiw/mts-badkamers audit:js-off  # alle 88 pagina's met JavaScript uit
set -a && source .env && set +a                # wrangler leest de root-.env niet zelf
pnpm --filter @jiw/mts-badkamers ship          # build + audit + wrangler deploy
```

`pnpm build` draait `work/media.mjs` eerst, maar die slaat over wat er al ligt en
op tijd is; alleen `pnpm media` (met `--force`) rekent alles opnieuw uit. De
losse stappen (`node work/media.mjs`, `node build.mjs`) werken nog gewoon vanuit
deze map.

`build.mjs` leest `MAPBOX_TOKEN` uit de `.env` op de root van de monorepo, of uit
de omgeving als die er staat. De generatiescripts in `work/gen/` willen
`RUNWARE_API_KEY` in de omgeving.

De controlescripts in `work/` draaien op Playwright. De browsers komen niet met
`pnpm install` mee (de monorepo blokkeert postinstall-scripts), dus eenmalig:
`pnpm --filter @jiw/mts-badkamers exec playwright install chromium webkit`.

## Bestanden

| bestand | rol |
| --- | --- |
| `projects.mjs` | de 16 projecten: titels, fasen, captions, media-indices, `BIZ` (namen, KvK) |
| `content.mjs` | voor/na-paren, werkgebied, FAQ en de vier dienstenpagina's (Nederlandse bron; vertalingen in `i18n-content*.mjs`) |
| `build.mjs` | alle HTML-generatie, JSON-LD, sitemap, robots, favicon. `railBlock()` maakt elke zijwaartse rail |
| `brand/logo-mark.svg` | het beeldmerk zonder kleur; `logoMark()` in `build.mjs` leest het in |
| `worker/index.ts` | de Worker: een adres voor de site, verder niets |
| `work/media.mjs` | mediapijplijn: watermerk-crops + webp/jpg-derivaten in `site/m/` |
| `work/posters.mjs` | posterbeeld op 1,000 s uit elke video naar `site/poster/` |
| `work/video-meta.mjs` | duur en afmetingen per video met ffprobe naar `_video.json` (input voor de VideoObject) |
| `work/audit-seo.mjs` | draait mee in `ship`: sitemap, canonicals, hreflang, titels, lastmod, videositemap, en of de HTML compleet is |
| `work/js-off.mjs` | dezelfde vraag met een echte browser en JavaScript uit |
| `_media.json` | afmetingen per bestand ná de crop (input voor `build.mjs`) |
| `_video.json` | duur en afmetingen per video; gemaakt door `work/video-meta.mjs`, gelezen door `build.mjs` |
| `site/` | half bron, half bouwsel (zie hieronder); `wrangler.jsonc` wijst hierheen |

### Wat er in `site/` bron is en wat gebouwd

`site/` is de map die Cloudflare serveert, maar hij is niet in zijn geheel
uitvoer. Bron (staat in git, met de hand geschreven of eenmalig gemaakt):
`styles.css`, `app.js`, `f/` (de fonts), `video/`, `poster/`, `logo.svg`,
`logo-light.svg`, `werkspot.svg`, `icon.png`.

Gebouwd (staat in de root-`.gitignore`, komt uit `build.mjs` en `work/media.mjs`):
`index.html`, `404.html`, `en/`, `tr/`, `ru/`, `werk/`, `badkamerrenovatie/`,
`toiletrenovatie/`, `tegelwerk/`, `loodgieter-en-cv/`, `m/`, `sitemap.xml`,
`sitemap-video.xml`, `robots.txt`, `favicon.svg`, `_headers`,
`styles.<hash>.css`, `app.<hash>.js`.

Wie hier iets bijzet: zet het in de goede helft en houd de `.gitignore` bij, want
een bronbestand dat per ongeluk onder een gegenereerde naam valt is na de
volgende `pnpm clean` weg.

## Media

- Bron: `assets/media/*.jpg|mp4` (volgnummer in de bestandsnaam = index in `projects.mjs`).
- `work/media.mjs` maakt per foto `-480/-900/-1600.webp` plus jpg-fallbacks in `site/m/`.
  De HTML gebruikt `<picture>` met srcset, dus mobiel laadt 480px in plaats van 900px.
- **Watermerken:** 16 foto's hadden een ingebrande "REDMI NOTE 6 PRO"-tekst linksonder.
  Die indices staan in `WATERMARKED` in `work/media.mjs` en worden op 84,5% hoogte afgesneden.
  Nieuwe media met watermerk? Draai `work/wm-detect.mjs`, controleer `work/wm-sheet.jpg`
  en vul de lijst aan.
- **Video's.** `site/video/` bevat de webklare versies (16 stuks, samen 83 MB, h264
  op ongeveer een derde van de bitrate van de bron). Die staan in git, want ze
  zijn wat de bezoeker krijgt. De ruwe telefoonopnames in `assets/media/*.mp4`
  (236 MB, tot 29 MB per stuk) staan er niet in: ze worden nergens geserveerd,
  en een enkele daarvan gaat zelfs over de bestandslimiet van 25 MiB die
  Cloudflare op een asset hanteert. Wie ze nodig heeft haalt ze bij de klant of
  uit `jiw-concepts/m-techno-service/assets/media`.
- **Posters.** `work/posters.mjs` snijdt uit elke video het beeld op **1,000 s**
  naar `site/poster/<zelfde naam>.jpg`, en `work/media.mjs` maakt daar dezelfde
  derivaten van als van een gewone foto. Niet frame nul: de eerste frames van
  een telefoonopname zijn de belichting die zichzelf nog instelt, en juist dat
  beeld blijft staan tot iemand op play drukt. `hero-build.jpg` is de uitzondering:
  die hoort bij de opbouwvideo in de hero, wordt rechtstreeks als
  `/poster/hero-build.jpg` geladen en wordt daarom in `work/media.mjs`
  overgeslagen.
- **Fotograaf in de spiegel.** In een deel van het archief staat Mike met zijn telefoon in
  de spiegel. Op een kaart- of heroshot leest dat als slordig: de hexagon-badkamer is
  daarom van 196 naar 210 gegaan (zelfde hoek, schoon). Alle spiegelselfies staan in `DROP`,
  inclusief 213 — dat stond eerst bij `over`, maar zie hieronder.
- **Portret bij "Over Mike"** = `OVER_IMG` in `build.mjs`, nu **27**: Mike met een klant en
  zijn gezin, duimen omhoog. Bewust een index uit de `DROP`-lijst; die lijst houdt hem uit
  de fases, opleveringen en bouwmap van de woonkamerklus (daar is het geen bewijs van het
  werk), maar het is het enige beeld met Mike én een klant erop, en dat verkoopt beter dan
  213 (Mike alleen, telefoon in de spiegel). Er staan herkenbare mensen op, waaronder twee
  kinderen: **toestemming van die klant is een voorwaarde voor livegang.**
- `work/hero-sheet.mjs` zet alle resultaatfoto's op één contactvel met hun index, handig
  als je een betere kaart- of heroshot zoekt. `work/range-sheet.mjs <van> <tot> <uit.jpg>`
  doet hetzelfde voor een aaneengesloten reeks, bijvoorbeeld om te kijken of er van een klus
  een foto van de intacte oude badkamer bestaat.
- **Dezelfde foto niet drie keer op één pagina.** 210 is sinds de laatste ronde de mobiele
  hero én de "na" van de hexagon-voor/na; de kaart van dat project staat daarom op 194.

## Layout: zijwaartse rails

Fotogrids bestaan niet meer. Alles wat een reeks beelden is, is een horizontale rail
(`railBlock()` in `build.mjs`, `.rail*` in `styles.css`, controller in `app.js`):

| plek | soort | vorm |
| --- | --- | --- |
| projecten op de home | `card` | kaarten van 370px |
| reviews op de home | `rev` | quotes van 372px (past op desktop, dus daar `rail-static`) |
| fase, resultaat, korte bouwmap | `ph` | fotostrip op vaste hoogte, breedte volgt de verhouding |
| video's | `vid` | 9:16 staand |
| bouwmap vanaf 8 foto's | `thumb` | vierkante duimnagels in twee rijen |

De rail bloedt door tot de schermrand; `padding-inline` in `.rail` zet het eerste item
weer uit onder de tekst. Daarom staat er `overflow-x: clip` op `html, body` — `clip`
en niet `hidden`, anders verliest de sticky nav zijn plakgedrag.

Pijlen staan **op elk formaat** in de voetregel van de rail. Vanaf 701px tilt de CSS ze
eruit en legt ze over de fotos; op een telefoon blijven ze eronder staan, want daar
vingen ze precies de veeg af die je rechts begint. Ze worden `disabled`, niet `hidden`,
anders verspringt de voetregel bij elke veeg. Past een rail helemaal in beeld, dan zet de
controller `.rail-static` en verdwijnen hint, teller, balk en verloop.

`scroll-snap-align` is **start**, niet center: een item dat breder is dan het scrollvenster
wordt bij center steeds teruggetrokken naar zijn midden, waardoor de rail na elke veeg
terugveert en zijwaarts scrollen kapot lijkt. `touch-action` staat expliciet op
`pan-x pan-y` (alleen `pan-y` zou zijwaarts scrollen juist uitschakelen).

Slepen met de muis telt pas vanaf 6px als sleep, anders werkt klikken (lightbox,
doorklikken naar een project) niet meer.

## Voor & na: een echte wipe

`makeWipe(stage, {range, start})` in `app.js` bedient elke voor/na. De "na"-foto staat
**links** van de lijn en wordt met `clip-path: inset(0 calc(100% - var(--wipe)) 0 0)` van
rechts weggeknipt; de scheidingslijn (`.ba-div`) staat op `left: var(--wipe)`, dus lijn en
beeld kunnen niet uit de pas lopen. `--wipe` = de stand van de lijn vanaf links = de stand
van de schuifknop: `0` = volledig voor, `100` = volledig na.

**Richting: knop naar rechts = het resultaat.** De gangbare variant elders (voor links, na
rechts, de na van rechts naar links opengetrokken) betekent dat je naar **links** moet
slepen om de nieuwe badkamer te zien, en dat je knop naar rechts terug in de tijd gaat.
Armando struikelde daar twee keer over, terecht: een schuifknop van voor naar na moet naar
rechts vooruit lopen. Daarom schuift de "na" nu van links naar rechts over de oude foto
heen, als een spaan over een wand.

**Labels staan op de as, niet op de helften.** Dit is de kern van drie ronden verwarring.
De linkerhelft is tijdens het slepen per definitie de nieuwe badkamer, dus:

- `VOOR` linksboven zou liegen (daar staat de na-foto);
- `NA` linksboven is waar en stond er ook even, maar leest als "de slider staat omgekeerd" —
  precies de klacht die eronder vandaan kwam.

Beide zijn hier langsgekomen en beide voelden fout, omdat een label op een helft die van
eigenaar wisselt niet kán kloppen. De VOOR/NA-aanduiding zit daarom op de **schuifbalk**
(`.ba-slide-lbl`: `← Voor` links, `Na →` rechts) plus een zin in de sectiekop. Dat is de
as van voor naar na, en die staat wél stil: knop links = de oude badkamer, knop rechts =
het resultaat. In het beeld zelf staat alleen nog de sleepknop.
`work/ba-dir.mjs` bewijst het per pixel (knop op 0 is de voor-foto, knop op 100 de
na-foto, met een fotodiff tegen de onafgeknipte lagen) en controleert dat de schuifbalk
`Voor → Na` loopt en er geen label meer op een helft staat.

Was eerst een **crossfade** (`na.style.opacity`), wat leest als een truc met de belichting
in plaats van als twee foto's naast elkaar. Nu een wipe met een sleepknop op het beeld.

- **Intro-veeg.** Bij het in beeld komen loopt de wipe één keer door (rAF-tween in
  `sweep()`, easeInOutCubic, 2,1 s) van volledig "voor" naar bijna volledig "na" en terug
  naar de rustpositie. Zo hoeft niemand te raden dat je kunt slepen. Afgebroken zodra
  iemand zelf sleept; met `prefers-reduced-motion` springt hij direct naar de rustpositie.
- **Slepen luistert op `window`, niet op de stage, en er is geen `setPointerCapture`.**
  Met capture op het beeld kwam alleen de eerste `pointermove` binnen en bleef de lijn na
  een centimeter staan. `work/wipe-check.mjs` test precies dat (intro-veeg beweegt, slepen
  van 50% naar 15% komt ook echt op 15% uit, de schuifknop stuurt hetzelfde beeld, en een
  tab laadt een ander paar), desktop en mobiel, tegen `BASE=...`.
- `pointerdown` doet `preventDefault()` en er hangt een `dragstart`-blokkade op, anders
  sleept de browser de `<img>` als plaatje mee.

- **`touched` en niet alleen `drag`.** De intro-veeg slaat over zodra iemand zelf heeft
  gesleept of geschoven, en een lopende veeg breekt af op dezelfde vlag. Met alleen `drag`
  hervatte de tween zodra je losliet en trok hij de foto alsnog terug naar de rustpositie.

De hero heeft **geen** wipe meer, zie hieronder.

**Paren komen uit dezelfde ruimte én hetzelfde standpunt.** Dat tweede is geen detail: staat
de "na" vanaf een andere plek, dan zie je twee foto's in plaats van één ruimte en doet de wipe
niets. Ligbad stond op 54 -> 50, en 50 is een close-up van het nieuwe bad in de hoek; dat is nu
54 -> **52**, vanaf dezelfde plek als 54 (zelfde raam, bad rechts, wastafel links).
`work/ba-shot.mjs` schiet elke tab met de lijn in het midden, zodat je in één beeld ziet welke
helft "voor" is en welke "na" — de vraag "staan de sliders niet omgekeerd?" beantwoord je
daarmee zonder te redeneren. `work/ba-verify.mjs` doet hetzelfde op de kale bronbeelden.
**Nagelopen op 17-08-2026: alle zes paren staan goed om** — eerst met voor links, en na de
richtingswissel opnieuw, nu met **het resultaat links van de lijn** en de oude situatie
rechts, zowel op de bronbeelden als in de pagina zelf.

## Ankers, en waarom er geen reveal meer is

Hier stond een scroll-reveal: `.reveal` op `opacity: 0` met een `translateY`, en
een IntersectionObserver die er `in` op zette zodra het blok in beeld kwam. Die
is eruit. Op een middenklasse Android telefoon loopt die JS achter op de vinger,
dus scroll je langs lege gaten die pas een halve seconde later een kaart worden,
en dat is precies wat het niet moet doen op een site waar de foto's het verhaal
zijn.

Het kostte hier ook echt iets. `work/anchor-check.mjs` landt op elk nav-anker in
chromium + webkit, mobiel + desktop, en klaagt over elk blok dat ruim in beeld
staat (>50% of >200px) en toch onzichtbaar is. Die vond er drie: wie via
`/#diensten` of `/#faq` binnenkwam kreeg blokken die op `opacity: 0` bleven
staan, ook met de reparatie die `in` alvast zette voor wat boven het scherm hing.
Dezelfde drie stonden op de live conceptsite.

Nu staat alles in de HTML en is alles bij de eerste paint zichtbaar. De klasse
`.reveal` staat nog wel in de opmaak (hij zit op tientallen plekken in
`build.mjs` en zegt nog steeds "dit is een blok"), alleen doet hij niets meer.
`work/anchor-check.mjs` blijft draaien: hij bewaakt nu dat het niet terugkomt.

Van vier van de zes projecten bestaat er **geen** foto van de intacte oude badkamer; daar is de
"voor" een sloopfoto. Dat is zwakker (de klant herkent zijn eigen badkamer niet in een kale
ruimte) maar het archief heeft niets beters. Zitbank en Inloopdouche hebben wél een intacte
voor-foto.

> **Val: geen `aspect-ratio` op een doos met alleen absolute kinderen.**
> `.ba-stage` had `aspect-ratio: 4/5` (mobiel 1/1) met twee `position: absolute` foto's
> erin. In Chromium klopt dat; **WebKit (dus elke iPhone) rekende de doos terug naar
> 0x0** en dan stond er in het hele Voor & na-blok geen foto — alleen de tekstkaart.
> Hoogte komt nu uit `padding-top: 125%` (mobiel 100%). Dat werkt in elke motor en
> overleeft ook het stretchen van de grid-rij. Zelfde aanpak in `.hero-shot`.
> `work/webkit-sweep.mjs` loopt alle 18 pagina's in WebKit na op 0-grote blokken,
> kapotte foto's, vastzittende rails en overloop — draai dat bij elke layoutwijziging.

## Hero

Eén opgeleverde badkamer, geen collage en geen sleepbare voor/na — maar **per breekpunt een
andere foto** (`heroPic()` in `build.mjs`, `HERO_BP = (max-width: 700px)`), met daarover een
video waarin diezelfde badkamer zichzelf opbouwt.

### De opbouwvideo

`heroVideo()` in `build.mjs` zet een `<video>` **over** de `<picture>`, niet in plaats ervan:
de foto blijft de LCP en het vangnet. 6 s, geen `loop`, geen geluid, `site/video/hero-build.mp4`
(370 KB) + `.webm` (206 KB), poster `site/poster/hero-build.jpg`.

Gemaakt met **`lightricks:ltx@2.5-pro`** op Runware. De truc zit niet in het model maar in de
twee frames eromheen:

1. `work/gen/bare.mjs` maakt uit de herofoto (index 107) een **kale bouwstaat** van dezelfde
   ruimte: `google:4@3` met `referenceImages` (dat model kent géén `seedImage`/`strength`, dat
   geeft `unsupportedParameter`) en een instructie om spiegel, meubel, wastafel, kraan en
   tegels weg te halen en er afgedopte leidingstubs en een inbouwdoos voor terug te zetten.
   Er komen er twee uit; **bare-1** is gekozen omdat die de deurstijlen, de linkerwand en de
   nis rechts van het origineel aanhoudt (bare-0 verzon een raam).
2. `work/gen/frames.mjs` snijdt beide (kale versie én de echte foto, allebei 3:4) met **exact
   dezelfde uitsnede** naar 1080x1920. Zelfde uitsnede is de hele voorwaarde: verspringt de
   ruimte tussen frame één en frame laatst, dan interpoleert het model een camerabeweging
   erbij en is het geen opbouw meer.
3. `work/gen/video.mjs` doet de `videoInference` met `frameImages` (`frame: "first"` /
   `"last"`), `deliveryMethod: "async"` + pollen met `getResponse`.

Harde grenzen van het model, alle drie uit de foutmeldingen gevist:
`duration` mag alleen **6, 8, 10 of `auto`** (3-5 s kan dus niet), afmetingen alleen
**1280x720 / 720x1280 / 1920x1080 / 1080x1920**, en `google:4@3` accepteert alleen maten uit
een vaste lijst (`896x1200` is de 3:4 die we gebruiken, `768x1024` bestaat daar niet).

Het **laatste frame is de echte herofoto**, dus als de video uit is staat er precies het beeld
dat er zonder video ook stond. Er valt niets te vervangen en er is geen sprong op het eind.

Zichtbaar pas op `playing` (`.is-live` in `app.js`), niet op `canplay`. De poster is namelijk
het eerste frame en dat is de bouwput: gaat de video níet spelen, dan is een zichtbare video
de slechtst denkbare hero. Speelt hij na 2,5 s niet, dan haalt `app.js` hem weg en blijft de
foto staan. Bij `prefers-reduced-motion` wordt hij meteen verwijderd.

> **Headless WebKit speelt hem niet.** In `work/gen/live.mjs` komt mobiel terug als
> `"removed"` — headless WebKit heeft de codecs niet. Dat is de vangnet-route die werkt zoals
> bedoeld, geen bug; op een echte iPhone is `muted` + `playsinline` gewoon toegestaan. Chromium
> met `--autoplay-policy=no-user-gesture-required` op 390px speelt hem wel uit (`t=6.04`).
> Let op: `waitUntil: 'load'` komt op deze pagina niet meer af (de videostream houdt hem
> vast) — gebruik `domcontentloaded` + een wachttijd, en géén `python -m http.server`
> (enkeldradig, blijft hangen op de stream).

### Licht en rust

Twee klachten van Armando, allebei op de hero: *te donker* en *te druk op mobiel*.

- De hero stond op `--dark` (#111418), even donker als de footer. Nu `--hero-bg` (#1d2026),
  een warmere grafiettint, plus een zachte radiale opklaring. Die zit in de `background`-
  **shorthand** en niet in een `::before`: een gepositioneerde pseudo met `z-index: 0` legt
  zich over de niet-gepositioneerde tekstkolom en dan ligt er een waas over de kop.
- Het mobiele verloop stond op 54% al op 0,88 en op 66% op 0,97 — tweederde van het beeld was
  dichtgeverfd. Nu onaangeraakt tot 46% en pas onderaan de sectiekleur. De leesbaarheid komt
  daardoor van de tekstschaduwen (zwaarder gezet) in plaats van van een deken over de foto.
- Er stonden zes lagen tekst over het beeld. De **trust-chip is op mobiel uit** (zei "één
  vakman voor de hele klus", terwijl de subregel daar al "van sloop tot afmontage" zegt; op
  desktop staat hij náást het beeld en blijft hij) en de `.hero-strip` toont er **twee in
  plaats van vier** (garantie en KvK staan al in de FAQ en de footer). Gemeten op de live
  site: hero 474px op een scherm van 664.

| breekpunt | foto | waarom |
| --- | --- | --- |
| desktop | **107** | staat als kaartje van 4/5 naast de tekst en is helemaal zichtbaar: ronde spiegel, zwevend blad, niets op de vloer |
| mobiel | **48** | dezelfde spiegelwand van verder weg: de volle halo van de ronde spiegel, warm licht, geen glas ertussen |

Waarom twee foto's: op mobiel vult de hero het scherm in verhouding 0,66 terwijl het beeld
0,75 is, dus de browser toont de **volle hoogte** en snijdt links en rechts bij. `object-position`
werkt daar dus alleen horizontaal (**18%**, zodat de hele halo van de spiegel in beeld blijft --
op 38% liep de linkerrand het kader uit en was het een halve cirkel); een Y-percentage doet niets. En omdat de tekst over de onderste helft ligt, telt alleen de bovenste
helft van de foto. 107 is daar juist zwak — egale beige wand, geen contrast. Afgevallen: 180
(bad ligt in het onderste derde deel, precies achter de kop) en 155 (werkschoenen op de vloer).

- De wipe stond hier even, maar die vraagt eerst een handeling voordat een bezoeker weet
  wat hij ziet, en in rust toonde hij vooral de oude badkamer. Vergelijken kan bij Voor & na.
- `work/hero-try.mjs <idx…>` (desktopfoto) en `work/heromob-try.mjs <idx…>` (mobiele foto)
  zetten elke kandidaat écht in de pagina, schieten hem op een iPhone en zetten de resultaten
  naast elkaar. Kies hier, niet op een contactvel: een foto die goed staat op een 3:4-tegel kan
  in de hero volledig achter de kop verdwijnen. `work/heromob-sheet2.mjs <idx…>` doet de
  voorselectie: alle kandidaten als mobiele uitsnede met het verloop er al overheen, dus je
  ziet meteen wat er achter de tekst verdwijnt.
- **Twee preloads met `media`**, met exact dezelfde `imagesrcset`/`imagesizes` als de
  `<source>`. Wijkt de kandidatenlijst af, dan kiest de preload een andere breedte dan het
  beeld zelf en haalt de browser hem twee keer op. `work/hero-net.mjs` rekent na dat er per
  breekpunt precies één van beide foto's over de lijn gaat; die leest de twee indices uit
  de preload-regels van de gebouwde `index.html` en niet uit een lijst in het script zelf,
  anders faalt hij bij elke nieuwe herofoto.
- Het bijschrift (`.hero-cap`) hoort bij 107 en staat op mobiel uit.
- **Mobiel staat de foto bóven de kop** (`order: -1`) en vult hij het scherm.
- De hele hero moet op een iPhone 13 boven de vouw passen (664 - 64 nav). Dat wordt geregeld
  door `padding: 170px` op `.hero-grid` (was 214: de trust-chip verhuisde naar onder de
  knoppen en de kicker kwam erbij, dus er moest bovenaan ruimte terug); `work/hero-shot.mjs`
  meet het na - nu 602px op een iPhone 13. Staat hij hoger,
  dan valt de onderkant van de foto weg.

### Tekst op de foto

Volgorde in de kolom: **kicker, kop, subregel, knoppen, trust-chip** (`.hero-txt` is een
flexkolom, de `order`-regels staan in de basis en gelden dus ook op desktop). In de DOM staat
de chip nog steeds vóór de kop, zodat een schermlezer hem meteen bij de kop hoort.

- De **kicker** ("Badkamerspecialist in Apeldoorn") stond er niet. De kop alleen zegt niet dat
  dit een bedrijf uit Apeldoorn is, en dit is meteen de sterkste lokale zoekterm vlak bij de h1.
  Niet `.eyebrow` gebruikt: die staat op `var(--clay)` en dat is te donker op de hero.
- De **trust-chip** stond bovenaan. Dat kostte op mobiel een hele regel middenin de foto en
  zette het bewijs ver van de knop af; nu staat hij eronder, pal naast de handeling. Er stond
  de Werkspot-score in; die is eruit (zie hieronder) en de chip draagt nu de belofte die bij
  de knop hoort: "Opname aan huis, daarna een vaste prijs". Niet de KvK of "geverifieerd",
  want dat staat woordelijk al in de `.hero-strip` er direct onder.
- De **subregel** herhaalde de kop ("complete badkamers uit Apeldoorn"). Nu noemt hij het harde
  punt: alles door één vakman, vaste prijsopgave na de opname (klopt met de FAQ - eerst opname,
  dan vaste prijs).
- **Geen kleuraccent in de kop.** Het tweede zinsdeel in kleiwarm staat leuk op een egale
  ondergrond, maar op mobiel ligt de kop over een lichte tegelwand en zakt die tint weg. Op
  een foto wint contrast van een kleuraccent; alleen de kicker draagt de warme tint.

De kop stond op 2rem met normale regelafstand en een halfdoorzichtige chip: dat leest als
bijschrift, niet als belofte. Nu:

- `clamp(2.1rem, 8.8vw, 2.6rem)`, `line-height: 1.05`, `letter-spacing: -0.025em` en
  `text-wrap: balance` — zonder dat laatste bleef "voeg." als los woord op regel drie staan.
- Schaduw op de letter zelf (`0 1px 2px`) in plaats van een brede waas over het beeld.
- De trust-chip is een dichte pil (`rgba(12,10,8,0.72)`); doorzichtig grijs viel weg tegen
  een lichte tegelwand.
- Korte subregel op mobiel via `.only-narrow` (spiegelbeeld van `.only-wide`): twee regels
  in plaats van drie.
- Het verloop hield de foto eerder al vanaf 24% tegen en zat op 44% op 0,72 — de bovenste
  helft werd grijs terwijl de tekst pas veel lager begint. Nu blijft de foto tot 40% zo goed
  als onaangeraakt en gaat het verloop daarna in een korte klap naar de sectiekleur.

## Meelopende CTA

`ctaDock()` zet onderaan elke pagina een balk die omhoog komt zodra de hero uit beeld
is en weer wegduikt bij het contactblok (twee IntersectionObservers in `app.js`).
Onder 560px vervalt de tekst en blijven twee knoppen op halve breedte over.

## Paginalengte

De homepage was 24 schermen op een telefoon en is teruggebracht tot ~13 (desktop 12 -> 8).
Wat daarvoor is gedaan, zodat het niet ongemerkt terugkruipt:

- `intro` als eigen sectie is weg; de tekst zit nu in `over`.
- `diensten` en `werkwijze` zijn **één** sectie met twee kolommen (ids blijven bestaan
  voor de menu- en footerlinks). Diensten zijn een lijst met dunne scheidingen in plaats
  van tien kaarten; onder 620px vervallen de omschrijvingen en de stapteksten.
- `werkgebied` is een dichtgeklapt FAQ-item geworden (`#werkgebied`, `openHashDetails()`
  in `app.js` klapt het open als de hash erop staat). Dezelfde plaatsnamen, 60px in plaats
  van anderhalf scherm.
- Reviews staan in een rail in plaats van drie kaarten onder elkaar.
- `.over-img img` is vierkant, vanaf onderen gecropt (`object-position: center bottom`),
  met **`height: auto`**. Zonder die `height: auto` deed de vaste verhouding niets: de
  width/height-attributen op de `<img>` (bedoeld tegen layout shift) komen als CSS-hint
  binnen, dat is een definitieve hoogte, en dan negeert de browser `aspect-ratio`. De foto
  stond dus op zijn volle 1095px — de sectie was op mobiel bijna twee schermen hoog, exact
  wat die verhouding moest voorkomen. Gemeten in Chromium én WebKit: 358x358 mobiel,
  517x517 desktop (`work/over-shot.mjs`). Andere `aspect-ratio`-regels hebben wél een
  definitieve hoogte (`.ph img`, `.card-img img`) of al `height: auto` (`.rail-thumb`).
- Sectiepadding 96 -> 72 (mobiel 66 -> 48), `.sec-head` zet kop en lead naast elkaar.
- Projectpagina: `.story` 56 -> 34px padding, fotorail-hoogte `clamp(230px, 44vh, 480px)`.

`work/check.mjs` meet de hoogte per sectie, `work/smoke.mjs` loopt alle 23 paginas na op
JS-fouten, horizontale overloop, pijlknoppen, teller en lightbox. Beide tegen
`BASE=http://127.0.0.1:8788` (`python -m http.server 8788` in `site/`) of tegen de live URL.

Wat er verder aan tests staat (allemaal met hun eigen servertje, dus `node work/<x>.mjs`
vanuit de projectmap): `verify.mjs` (elke pagina in chromium + webkit), `wipe-check.mjs`
(beweegt de wipe: intro-veeg, slepen, schuifknop, tabwissel), `ba-dir.mjs` (welke kant de
wipe op loopt, per pixel, plus de labels), `anchor-check.mjs` (ankerlandingen laten geen
onzichtbare blokken achter), `ba-look.mjs` (schiet het Voor & na-blok met de lijn in het
midden, desktop + mobiel, om te beoordelen).

## Vindbaarheid: welke pagina's er zijn en waarom

De site had zeventien Nederlandse adressen: de home en zestien projecten. Dat is
te weinig. De home moest in haar eentje scoren op badkamerrenovatie,
toiletrenovatie, tegelwerk, loodgieterswerk, cv en negentien plaatsnamen
tegelijk, met per dienst een lijstje van een halve regel als enige tekst. Eén
pagina kan niet voor zes verschillende zoekopdrachten het beste antwoord zijn.

Daar zijn vijf adressen bij gekomen. De secties op de home zijn niet veranderd;
ze linken er nu naartoe.

| adres | wat het is | bron |
| --- | --- | --- |
| `/werk/` | de projecthub: alle zestien met kaart en telling, plus de vier diensten | `buildWerkHub()`, `L.hub` |
| `/badkamerrenovatie/` | complete badkamers | `SERVICES` in `content.mjs` |
| `/toiletrenovatie/` | toilet, inbouwreservoir, fonteintje | idem |
| `/tegelwerk/` | visgraat, chevron, hexagon, grootformaat | idem |
| `/loodgieter-en-cv/` | water, afvoer, radiatoren, cv-ketel | idem |

**`/werk/` gaf een 404.** De zestien projecten hingen onder die map maar het
adres zelf bestond niet: elke gedeelde of geraden link liep dood, en de enige
route naar de projecten was een anker op de home (`/#projecten`). De nav, het
kruimelpad, de footer en de 404-knop wijzen nu allemaal naar `/werk/`; dat anker
komt in de HTML niet meer voor.

Een dienstenpagina is opgebouwd uit wat er al lag: `omvat` (wat er onder valt),
de projecten uit `projects.mjs` die het bewijs zijn, en de FAQ-antwoorden die bij
die klus horen. Elke pagina draagt een `Service` met `hasOfferCatalog`, een
`BreadcrumbList` en een `FAQPage` met **alleen** de vragen die er ook echt op
staan. Een FAQPage met vragen die niet op de pagina staan is precies wat Google
als misleidend aanmerkt.

**Plaatspagina's zijn er bewust nog niet.** Deventer, Zutphen, Epe, Vaassen en
Twello zouden kunnen, maar alleen met eigen projecten, eigen foto's en eigen
tekst per plaats. Negentien plaatsen met dezelfde tekst en een andere naam erin
is een doorway en kost posities in plaats van dat het ze oplevert.

### Wat er in de structured data staat

- **LocalBusiness** op de home: `geo` en `serviceArea` (30 km rond Apeldoorn),
  `logo`, `areaServed` uit `AREA`, `sameAs` uit `BIZ.werkspot` plus alles wat er
  in `BIZ.profielen` is ingevuld, en het KvK-nummer als `identifier`.
  `aggregateRating` blijft er bewust uit (zie hieronder).
- **`email`, `priceRange` en `openingHoursSpecification` staan leeg.** Ze komen
  alleen in de JSON-LD als ze in `BIZ` zijn ingevuld, en elke bouw meldt welke
  er nog ontbreken. Niet invullen met een gok: Google legt ze naast het
  Google-bedrijfsprofiel en naast wat bezoekers melden.
- **Projectpagina's** dragen `og:type: article` met `datePublished` (de dag dat
  de site live ging, `BIZ.published`) en `dateModified` (uit de bronbestanden,
  zie hieronder). Niet de datum van de verbouwing zelf: die is nergens
  vastgelegd, WhatsApp haalt de EXIF uit elke foto.
- **`VideoObject` per video.** De zestien video's staan als `data-video` in de
  HTML en worden pas door `app.js` ingeladen, dus een crawler komt ze bij het
  lezen van de pagina nooit tegen. Zonder deze markup en zonder
  `sitemap-video.xml` bestaan ze voor Google niet. `duration` en de afmetingen
  komen uit `_video.json` (`node work/video-meta.mjs`, draait op ffprobe).
  Let op: `p.videos` is de lijst voor het videoblok en deugt **niet** als
  telling. Drie indices erin zijn in werkelijkheid foto's, en er staan video's
  in de fase-, opleverings- en bouwmaprails die er niet in staan.
  `buildProject()` verzamelt daarom wat er werkelijk gerenderd is in
  `videosPerProject`, en de hub, de JSON-LD en de videositemap lezen alle drie
  uit die map.

### lastmod

Er stond op geen enkel adres een `<lastmod>`. Google plant zijn hercrawl er mede
op. De datum komt uit de bronbestanden die de pagina maken (`build.mjs`,
`content.mjs`, `projects.mjs`, de i18n-bestanden) en niet uit de klok: een bouw
zonder inhoudelijke wijziging mag de datum niet vooruitschuiven, want dan is het
signaal binnen twee deploys niets meer waard. Per bestand de laatste van de
git-commitdatum en de mtime, zodat een aanpassing die nog niet gecommit is toch
meetelt en de bouw ook werkt zonder git-geschiedenis.

### Alt-teksten

43 van de 277 foto's droegen allemaal dezelfde tekst: "Werk van MTS Badkamers".
Dat waren de rails zonder bijschrift (oplevering, video's, bouwmap).
`figure()` heeft nu een vierde argument `alt`, en die rails geven er
"Bouwfoto 3 van 12: <projecttitel>" aan mee. Genummerd, zodat een schermlezer
twaalf foto's uit elkaar kan houden in plaats van twaalf keer dezelfde regel te
horen. De foto's mét bijschrift houden hun bijschrift als alt.

### De 404

Stond op `index, follow` en kon zo als lege pagina in de zoekresultaten
belanden. Staat nu op `noindex, follow`; `work/audit-seo.mjs` faalt als dat
terugdraait.

## Huisstijl, Werkspot en de kaart

De merkkaart (`brand/brandsheet.jpg`) is leidend geworden voor kleur en type:

- Palet `#111418 #5A6066 #BFC3C7 #C9B59B #F6F6F4`. `#C9B59B` op `#F6F6F4` haalt geen 2:1,
  dus tekst gebruikt `--clay` (#7d6849, 5:1) en de merktint zelf staat alleen decoratief
  op donker. WhatsApp-groen/teal blijft als knopkleur, dat is de enige actiekleur.
- Instrument Serif voor koppen, Satoshi voor tekst; beide zelfgehost in `site/f/` met
  `font-display: swap`, geen Google Fonts.
- **Het beeldmerk** is een bad met een kraan, een raam en een waterlijn in een
  cirkel, aangeleverd door de klant als `brand/logo-src.png`. Het is met potrace
  uit die PNG getrokken in twee lagen (`brand/logo-mark.svg`): `.lg-b` is de
  romp, `.lg-t` de kraan. `logoMark()` in `build.mjs` leest dat bestand in en
  zet het inline in de header, niet als `<img>`, en dat is hier geen detail:
  **het is een donker logo.** Op papier klopt dat, maar in de footer en op de
  dock staat hij op bijna zwart. Inline kan de romp op `currentColor` staan (dus
  donker in de nav, `--paper` in de footer) en de kraan op `--logo-teal`, die in
  de footer naar een lichtere teal gaat. Een platte PNG zou daar verdwijnen.
  Voor los gebruik staan beide varianten klaar: `site/logo.svg` op licht,
  `site/logo-light.svg` op donker, plus `brand/logo-mark-1024.png` en de
  bronafbeelding zonder witte achtergrond. De favicon en `icon.png` zijn hetzelfde
  merk in de lichte variant op `#111418`, want op een browsertab is een donker
  logo niet te zien. `brand/logo-src.jpg` is het oude M-beeldmerk van de
  merkkaart en wordt nergens meer gebruikt.
- De **wordmerkregel** is `MTS BADKAMERS` met `Apeldoorn` eronder. Op de
  merkkaart stond `M.TECHNO` boven `SERVICE`, maar bij deze naam is het tweede
  woord de naam zelf: dat op de kleine onderregel zetten zou de merknaam
  halveren.
- H1 op de home is de merktagline ("Een badkamer die klopt tot in de laatste voeg.").

Reviews staan in Werkspot-vorm: het Werkspot-logo boven het blok (`site/werkspot.svg`,
lichte variant voor donkere achtergrond), per review vijf sterren, datum, initiaal en
"Geverifieerde klus via Werkspot". Vijf sterren mag: Werkspot werkt met een schaal van 10
en deze drie klussen staan daar op 10. De **gemiddelde** score blijft eruit (zie onder).

`mapSection()` in `build.mjs` vervangt het dichtgeklapte FAQ-item door een Mapbox-kaart:
dark-v11, een cirkel van 30 km als GeoJSON (Mapbox kent geen straal), eigen markers en de
plaatsnamenlaag van Mapbox uit, anders staat Apeldoorn er dubbel. De kaart laadt pas als de
sectie in beeld komt (~250 KB) en valt terug op een tekstregel als WebGL of het script
faalt. Onder 480px dragen alleen de plaatsen buiten de ring een label: op een kaart van
350px liepen Ugchelen/Beekbergen en Voorst/Zutphen door elkaar. De plaatsnamen staan
sowieso als tekst onder de kaart, dus voor Google verandert er niets. De token komt uit
de `.env` op de root van de monorepo (`MAPBOX_TOKEN`, publieke pk-token, beperken doe je op domein).

Canonical, og:url, JSON-LD en sitemap wijzen alle naar `mts-badkamers.nl`. Het
woord "concept" en de jouwidealewebsite-adressen staan nergens meer in de HTML;
`work/audit-seo.mjs` faalt als er een terugkomt. De oude adressen blijven werken
als route op dezelfde Worker en sturen met een 301 door.

Tekst is nagelopen op AI-tics: geen kastlijntjes (`grep -c "—"` = 0), geen dubbele
beloftes, geen uitleg bij wat je al ziet.

## Talen (NL, EN, TR, RU)

NL is de bron en staat op de root; Engels, Turks en Russisch staan onder `/en/ /tr/ /ru/`.
Bestaande links en de Google-index veranderen dus niet.

| bestand | rol |
| --- | --- |
| `i18n.mjs` | UI-teksten per taal (menu, knoppen, koppen, formulier, footer, 404) plus `LOCALES`, `prefix()`, `fill()` |
| `i18n-tr.mjs` / `i18n-ru.mjs` | de Turkse en Russische UI, apart omdat een blok Turks of cyrillisch midden in `i18n.mjs` onleesbaar wordt |
| `i18n-content.mjs` | vertaalde **inhoud** (projecten, FAQ, voor/na, werkgebied, reviews) plus de getters |
| `i18n-content-tr.mjs` / `-ru.mjs` | diezelfde inhoud in het Turks en Russisch |

`build.mjs` houdt de actieve taal in twee module-variabelen (`LOC`, `L`) plus `PATH`, het pad
zonder taalprefix voor de wisselaar. `U(p)` maakt van elke interne link de versie in de
actieve taal, `outDir()` wijst naar `site/` of `site/<taal>/`. De hele bouw draait vier keer;
media, CSS en JS zijn gedeeld en staan maar een keer op schijf.

**Terugval per veld, niet per project.** `tProject/tFaq/tBa/tArea/tReview` pakken de
Nederlandse bron zodra een vertaling ontbreekt. Een nieuw project zonder vertaling levert dus
een Engelse pagina met een Nederlandse alinea op, en niet een lege plek of een build die
omvalt. Dat is precies wat je wilt als er een klus bijkomt.

**Wat bewust niet vertaald is** (afspraak met Armando, 17-08-2026, optie B van de twee die
voorlagen): de bijschriften onder de losse foto's en de fasekoppen op de projectpagina's. Dat
is het leeuwendeel van de tekst en verandert het vaakst; niemand kiest een badkamerbouwer op
een fotobijschrift. Wel vertaald: titel, kicker, tags, blurb en intro per project, en alle
verkooppagina's volledig.

**De wisselaar** (`langSwitch()`) staat binnen `#navLinks` en daarmee in een keer op beide
plekken: rechts in de balk op desktop, bovenaan het uitklapmenu op mobiel (`order: -1`, volle
breedte, knoppen van 81x45). Een tweede exemplaar buiten het menu zou naast de burger en de
app-knop moeten passen, en die ruimte is er op een telefoon niet. Alleen de landcode is
zichtbaar; de hele taalnaam staat er onzichtbaar bij voor schermlezers. Elke knop wijst naar
**dezelfde** pagina in die taal, niet naar de homepage.

Verder in de build: `lang` per pagina, `hreflang` voor alle vier plus `x-default` op de
NL-versie, canonical met prefix, `og:locale`, en een sitemap met `xhtml:link` per taal (88
adressen). De WhatsApp-voorinvulling staat in de taal van de pagina; de labels van het bericht
dat het formulier opbouwt komen als JSON mee in `#i18n`, want app.js kan ze niet uit de HTML
lezen.

`work/lang-check.mjs` controleert dit in chromium **en** webkit, desktop en mobiel:
taalattribuut, hreflang, canonical, of de wisselaar met het menu dicht buiten beeld staat en
open wel in beeld, en of doorklikken van elke taal naar elke taal op dezelfde pagina uitkomt.
Tegen de live site: `BASE=https://mts-badkamers.nl node work/lang-check.mjs`.
Let op: `/cdn-cgi/rum` (de meetpixel van Cloudflare) faalt in webkit op CORS en wordt
weggefilterd, dat is niet onze bug.

De patch die `build.mjs` van eentalig naar viertalig bracht staat in `work/_i18n-patch.mjs`,
met `work/_build.bak.mjs` als versie ervoor. Beide mogen weg zodra dit is bezonken.

## Aandachtspunten voor livegang

- De FAQ-antwoorden en de doorlooptijden zijn conceptteksten: laten bevestigen door Mike.
- Reviews zijn de drie meest recente van Werkspot. **De gemiddelde score staat er op verzoek
  van de klant nergens meer op** (was 4,3 uit 7): geen sterren in de hero, de dock, de
  reviewkop, de facts of de footer, en ook geen `aggregateRating` in de JSON-LD - anders zet
  Google hem alsnog als sterren in het zoekresultaat. `BIZ.rating`/`BIZ.reviews` zijn daarom
  uit `projects.mjs` verwijderd; zet ze niet terug zonder overleg. De losse quotes blijven.
- Het contactformulier verstuurt niets zelf: het bouwt een WhatsApp-bericht op en opent wa.me.
  Geen backend, geen AVG-verwerking.
- Het portret bij "Over Mike" (index 27) toont een klant en twee kinderen.
  **Toestemming van die klant is een voorwaarde voor livegang**; zie de opmerking
  bij `OVER_IMG` hierboven. De site staat inmiddels op het eigen domein, dus dit
  is nu een open punt en geen voorbehoud meer.

## Controles voor een deploy

`pnpm ship` draait `build` en `audit:seo` en stopt bij de eerste klacht. De rest
staat los, elk met zijn eigen servertje, dus `node work/<x>.mjs` vanuit deze map:

| script | wat het bewaakt |
| --- | --- |
| `audit-seo.mjs` | sitemap, canonicals, hreflang, titels, beschrijvingen, en of de HTML op zichzelf compleet is |
| `js-off.mjs` | dezelfde 88 pagina's in een echte browser met JavaScript uit |
| `smoke.mjs` | JS-fouten, horizontale overloop, pijlknoppen, teller, lightbox |
| `verify.mjs` | elke pagina in chromium en webkit, mobiel en desktop |
| `webkit-sweep.mjs` | blokken die in WebKit op 0 uitkomen, kapotte foto's, vastzittende rails |
| `anchor-check.mjs` | ankerlandingen laten niets onzichtbaars achter |
| `lang-check.mjs` | taalattribuut, hreflang, canonical, de wisselaar en het doorklikken |
| `wipe-check.mjs` | of de voor/na echt beweegt: intro-veeg, slepen, schuifknop, tabwissel |
| `ba-dir.mjs` | welke kant de wipe op loopt, per pixel, plus de labels |
| `check.mjs` | de hoogte per sectie, tegen het terugkruipen van de paginalengte |

Tegen een lokale bouw: `pnpm preview` in een tweede terminal en dan
`BASE=http://127.0.0.1:4766 node work/smoke.mjs`. Tegen de live site:
`BASE=https://mts-badkamers.nl node work/lang-check.mjs`. Let op dat
`/cdn-cgi/rum` (de meetpixel van Cloudflare) in webkit op CORS faalt en wordt
weggefilterd; dat is niet onze bug.
