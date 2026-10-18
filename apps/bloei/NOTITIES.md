# Bloei! Ouddorp — wat klopt en wat nog niet

Concept, gebouwd 7 oktober 2026. Live op <https://bloei-concept.jouwconcept.app>.

De opdracht: de eigenaren van Fleurig! (Oud-Beijerland, `apps/fleurig`, inmiddels
`TIJDELIJK_GESLOTEN`) beginnen onder de naam Bloei! en waren tevreden over de site
van Fleurig!. Deze app is daar een kopie van, met één gevraagde wijziging: licht
groen in plaats van zwart, naar het logo toe.

## Dit moet langs de klant voordat er iets live gaat

Alles hieronder staat wél op de site, want een winkelpagina zonder adres, nummer
en openingstijden is niet te beoordelen. Op de openingstijden na is niets ervan
door de eigenaren zelf doorgegeven.

| Wat | Wat er nu staat | Waar het vandaan komt |
| --- | --- | --- |
| Adres | Hogepad 9, 3253 BH Ouddorp | Openbare vermelding van **Vershal Ouddorp** |
| Telefoon | 06 86 19 45 17 | Idem |
| Openingstijden | ma t/m za 9:00-17:30, zo dicht | Doorgegeven door Armando, 14-10-2026; zaterdag apart bevestigd 15-10-2026 |
| Coördinaten kaart | 51.81876, 3.93414 | Afgeleid van het adres hierboven |

**Er staat geen e-mailadres op de site.** Hier stond `info@bloei-ouddorp.nl`, en dat
was verzonnen: er staat er geen op hun Facebook en nergens anders openbaar. Op
verzoek van Armando is hij overal weg — uit de voet, uit het blok bij de
openingstijden, uit de contactregel bij het formulier, uit het schema.org-blok op
de homepage en uit de bevestigingsmail. Contact loopt nu via telefoon en WhatsApp,
en dat zijn de twee die wél bevestigd zijn. Geeft de winkel een adres door, dan is
het één regel in `site.config.mjs` (`WINKEL.email`) plus de plekken terugzetten.

Het verband tussen Bloei! en Vershal Ouddorp is een gevolgtrekking, geen
bevestigd feit: de Facebookpagina die is doorgestuurd staat op naam van "Vershal
ouddorp", en op de foto's staat naast de planten een saprek en een
`SMAAK BLOKJE`-vlag. Dat past bij een vershal. Maar niemand heeft gezegd dat
Bloei! op datzelfde adres zit.

De plaatsnamen in `STREEKKERNEN` (src/ui.tsx) zijn de kernen van
Goeree-Overflakkee, en staan er nadrukkelijk **niet** als bezorggebied. Of Bloei!
bezorgt en wat dat kost is onbekend, dus daar belooft de site niets over; het
formulier zegt bij "Bezorgen" alleen "in overleg".

Er staan ook **geen prijzen** op de site. Fleurig! had drie vaste bedragen bij
het abonnement (15/20/35 euro); van Bloei! is geen enkel bedrag bekend, dus het
budgetveld in het formulier is één vrij invulveld geworden.

## Het logo

**Sinds 18-10-2026 een echte vector**, aangeleverd door Alfred bij de huisstijl.
Daarmee is de vraag om een vectorversie die hier stond afgehandeld.

Eén bronbestand: `public/img/logo-bloei-wit.svg` — witte letters, lindegroen
blad, 680 × 410. Al het andere wordt daaruit gemaakt door `node scripts/icons.mjs`:

| bestand | wat | waar |
| --- | --- | --- |
| `img/logo-bloei-wit.svg` | de bron | balk bovenaan, voet (alles op dennengroen) |
| `img/logo-bloei-kleur.svg` | wit → dennengroen, linde → salie | lichte vlakken |
| `favicon.svg` | alleen de scheut, op dennengroen | tabblad |
| `img/icon-*.png`, `apple-touch-icon.png` | idem, als PNG | startknop, zoekresultaat |
| `logo-email.png` | de gekleurde versie, 480 px, ingebakken op `surfaceAlt` | bevestigingsmail |

De gekleurde versie kwam er ook als PNG bij, maar die gebruiken we niet: twee
bestanden van hetzelfde merk naast elkaar lopen vroeg of laat uit de pas. Het
script leidt hem af en schrijft er een `<desc>` in dat hij gegenereerd is.

Het pictogram is de **scheut** (de twee blaadjes boven de letters), niet de hele
bladgroep: daar zit ook het losse blad in dat door de O valt, en dat zweeft in
een vierkant pictogram als een vlek zonder verband onder de scheut. Welke vormen
bij de scheut horen wordt gemeten en niet geteld — zie de toelichting in
`scripts/icons.mjs`.

Eerdere oplossingen, alle drie weg: een los bestand van 358 × 252 (te klein),
een uitsnede uit de foto van de gevel (bracht het bord als rechthoek mee), en
een PNG op fel magenta die wij vrijmaakten (`logo-bloei.webp`, verwijderd —
`raw/maak-logo.mjs` staat als achterhaald gemarkeerd maar blijft staan voor de
truc met de randpixels).

Let op bij hoogtes: dit logo is 1,66 : 1 — het blad steekt boven de letters uit
en de vuurtoren staat eronder. Een balk die op 3 : 1 gemaakt is snijdt de punt
van het blad eraf. Vandaar dat de balk bovenaan een hogere, zwevende kaart is.

Nog te melden aan de klant:

1. **De letters zelf.** In het logo loopt het blad over de O en de E heen, waardoor
   er eerder `BLŒI!` dan `BLOEI!` staat. Op een gevel van tien meter afstand valt
   dat weg, op een scherm van 50 pixels hoog niet. Dat is iets om te melden voordat
   het op briefpapier en op een bestelbus staat. De vector lost dit niet op — het
   zit in de tekening, niet in de resolutie.

## De foto's

23 foto's, allemaal van de winkel zelf, aangeleverd op 7 oktober. De bronbestanden
staan in `raw/`, de bewerkte in `public/img/`. Opnieuw maken:
`node raw/maak-beelden.mjs`.

**Wat ontbreekt: kerst.** Er is geen enkele kerstfoto. Kerst is volgens de
aantekeningen juist het seizoen waar de winkel het van moet hebben, dus het blok
op de homepage en de pagina `/kerst/` staan er wel, maar als tekst op hun eigen
groen. Bewust geen gekochte sfeerfoto van een andere kerstafdeling: die zet een
verwachting die de winkel daarna moet waarmaken. Zodra er foto's zijn kunnen ze
er zo in.

Ontbreekt verder: een foto van de eigenaren, en een foto van een boeket dat zij
zelf gemaakt hebben.

## Wat er van de aantekeningen in zit

De lijst die Armando doorgaf, punt voor punt:

- *abonnementen > opgemaakte plantenbakken bij restaurants/bedrijven > of vazen* →
  `/abonnement/` plus het blok op de homepage. Dit heette eerst "Zakelijk", omdat
  het iets anders is dan het bloemenabonnement van Fleurig!; de winkel wil de naam
  abonnement houden, dus heet het weer zo. Het adres is meeverhuisd, want een
  menu-item Abonnement dat naar `/zakelijk/` wijst is een halve hernoeming.
  `/zakelijk/` geeft een 301 naar het nieuwe adres (`VERHUISD` in
  `worker/index.ts`); die regel mag weg zodra dit een echte site is.
- *cadeaubonnen* en *cadeaupakketjes* → `/cadeau/`, allebei als eigen blok.
- *bloemen/planten/tuin en woon ass / binnen en buiten potten, mest stoffen;
  potgrond tuinaarde hydro korrels mest, houtsnippers* → `/assortiment/`, vier
  afdelingen plus een apart blok "Grond en mest".
- *gras zaden* → eerst één regel, op verzoek (07-10) een eigen blok, op 08-10
  breed getrokken naar zes tegels met graszaad uitgesplitst eronder. Op 14-10 is
  dat hele blok er weer uit ("zaden kan helemaal weg (kopje)"). Zaden staan nu
  als twee regels in de lijst bij Tuin (gras/groente/kruiden en bloembollen) en
  als korte vraag bij Veelgesteld. Daarmee is ook de uitsplitsing verdwenen die
  niemand bevestigd had.
- *november/december > focus op kerst, groot op de website* → `/kerst/` plus een
  blok hoog op de homepage, boven de seizoenen en boven het abonnement.
- *bloemen assortiment is aan het groeien ... kan je niet vinden wat je zoekt laat
  het ons weten > boeketten zijn te bestellen* → staat op drie plekken, telkens
  waar iemand anders zou afhaken: in de strip bovenaan, in het blok "Bloemen" op
  de assortimentspagina, en in het formulier bij de keuze "Boeket".
- *fleurig aanhouden > achtergrond hele lichte tint groen > naar het logo toe* →
  zie hieronder.

## De kleuren

**Sinds 18-10-2026 de aangeleverde huisstijl.** Daarvoor waren ze van de foto
van de gevel afgelezen, omdat er toen niets anders was; die hele reeks is weg.

| | | rol |
| --- | --- | --- |
| Dennengroen | `#173F2B` | `ink` — balk bovenaan (gevraagd), voet, formulier, lopende tekst |
| Saliegroen | `#4F784B` | `salie` — vullingen; verdiept als `accent-dark` voor tekst |
| Lindegroen | `#B1C2A2` | `accent` — het accent op donker; dit is de bladkleur uit het logo |
| Ivoor | `#F3EEDC` | `ivoor` — spaarzaam: kerstkaarten en de lampjes in het snoer |
| Zandbruin | `#B99D71` | `zand` — de hoofdknop en de zwevende belknop |

Drie dingen die niet letterlijk uit de reeks komen en waarom:

- **De achtergrond.** `cream` `#f2f6ef`, met `creme-diep` en `line` eronder. Dat
  is uitgewassen lindegroen (dezelfde kleurhoek, 92°), niet ivoor — de klant
  vroeg om een lichte tint groen, en ivoor is gevraagd als markeerkleur. Twee
  lichte tinten door elkaar leest als een fout in plaats van als een keuze.
- **De tekst op de hoofdknop is dennengroen, niet wit.** Wit op zandbruin haalt
  2,6:1. Dennengroen erop haalt 4,6:1. Om dezelfde reden gaat hover omhóóg in
  plaats van een slag dieper: indikken zakt naar 3,4:1, oplichten gaat naar 5,5:1.
- **`accent-dark` is `#42653f`, saliegroen een slag verdiept.** Saliegroen zelf
  haalt alleen op de lichtste van de drie achtergronden de norm (4,6:1 op
  `cream`, maar 4,3:1 op `creme-diep` en 4,0:1 op de randkleur). De echte
  `#4F784B` staat wel onvermengd op de site: in het logo voor lichte vlakken, in
  de blaadjes aan de hoofdknop en als `--color-salie`.

**Het framboosroze van Fleurig! is weg**, net als het oranje van de belknop. Die
twee waren na de omkleuring de enige kleuren op de site die nergens meer uit de
reeks kwamen.

### Contrast

`#25D366` met witte letters (de WhatsApp-knop) haalt 1,98:1 en staat daar
bewust: dat is het merkteken van WhatsApp zelf, en "de WhatsApp-knop moet eruit
zien als WhatsApp" was een expliciet verzoek (09-10). Verder staat elke tekst op
de site op minstens 4,5:1 — nagemeten op de gebouwde pagina's, niet geschat.

Bij die meting bleek ook dat de halfdoorzichtige tekstkleuren (`text-ink/55` tot
`/80`) niet houdbaar waren: met dennengroen als basis zakt verdunde tekst onder
75% dekking overal onder de norm. Ze zijn vervangen door twee gemeten stappen,
`ink-zacht` en `ink-vaag`. Zie de toelichting in `src/index.css`.

**Twee vlakken zijn nog donker, en dat is een keuze om voor te leggen:** het
aanvraagformulier en de voet. Zonder die twee loopt het formulier mee als vierde
lichtgroene vlak op rij en heeft de enige plek waar de bezoeker iets moet dóén
niets dat hem van de rest scheidt. Ze staan in het groen van hun eigen bord
(`#27351b`), niet in zwart. Wil de klant het overal licht, dan is dat
`tone="ink"` → `tone="wit"` op twee plekken.

Sinds 09-10 is de balk bovenaan de derde donkere plek: die stond op licht groen,
maar het logo staat er nu vrijstaand in en crème letters horen op donker. Hij
staat op `#3b4c2b`, het bord zelf.

## Revisieronde 9 oktober

Punten van Alfred, met wat er gebeurd is:

- *frosted glass op de kaarten in de hero* → de twee panelen staan op 78 %
  dekking met `backdrop-blur` plus `brightness` en `saturate` (constante `GLAS`
  in `App.tsx`). Die laatste twee doen het werk dat de oude 95 % deed: ze maken
  van wat er doorheen schijnt een lichte, kleurloze toon, zodat de foto zichtbaar
  blijft als vorm maar niet als contrast. Alleen op die twee panelen en op de
  balk bovenaan — `backdrop-filter` op tientallen kaarten tegelijk maakt het
  scrollen op een middenklasse-telefoon stroperig.
- *balk bovenaan als kaart, zachtere overgang naar de volgende sectie* → de balk
  is een zwevende kaart met afgeronde hoeken; de kopfoto loopt er nu onderdoor tot
  de bovenrand van het scherm. De overgang is een `kraag` op `Section`: het vlak
  eronder schuift met afgeronde bovenhoeken over het vlak erboven. Staat op drie
  naden waar donker of foto overgaat in licht (onder de hero, onder het kerstblok,
  onder het formulier).
- *"Kom gerust even rondkijken": kaarten veel te smal op desktop* → vijf kaarten
  op één rij gaven 200 px per kaart. Nu een raster van zes kolommen: boven drie
  kaarten van 2 kolommen (~350 px), onder twee van 3 (~535 px), met een liggender
  uitsnede op die twee zodat de onderste rij niet zwaarder weegt dan de bovenste.
- *kerst moet er ook als kerst uitzien* → `tone="kerst"` plus `kerst` op `Section`:
  een dieper groen (`#1b2d15`), een lichtsnoer langs de bovenrand (`.kerstsnoer`
  in `index.css`, een tegel van 300 px die zichzelf herhaalt), warm lamplicht dat
  daaronder het vlak in zakt, en vurentakken in plaats van het gewone blad
  (`Kerstgroen` in `ui.tsx`). Staat op het kerstblok op de homepage en op de
  onderste sectie van `/kerst/`. **Nog steeds geen kerstfoto's** — dit is kleur en
  vorm, het belooft nergens iets.
- *Facebook-logo is een camera* → was `Camera` uit lucide; staat nu op `Facebook`,
  op alle vier de plekken (voet, kerstblok, "Over ons", `/kerst/`).

## Revisieronde 14 oktober

Negentien aangestreepte schermafdrukken van Armando. Wat er gebeurd is:

- **Openingstijden** 9:00 - 17:30, overal: de statuskaart, het rooster bij
  "Waar u ons vindt", de voet, het schema.org-blok en de bevestigingsmail. Het
  onderscheid zaterdag-een-uur-eerder was een aanname van mij en is weg.
  Zaterdag loopt inderdaad tot 17:30 — bevestigd door Armando op 15-10-2026.
- **"Hal" bestaat niet meer.** Elf plekken, overal "winkel" geworden: homepage,
  kerstblok, "Over ons", de veelgestelde vragen, `/assortiment/`, `/kerst/` en
  de og-teksten in de HTML.
- **Hero.** De opsomming van het assortiment is een uitnodiging geworden ("Loop
  gerust binnen en kijk rond"). **Nog te bevestigen:** het punt was *"tekst kan
  eigenlijk wel weg; of iets uitnodigenders"* bij een afdruk van het hele
  heropaneel — ik heb aangenomen dat het om die alinea ging en niet om de
  tekstlink "Bekijk wat er staat" eronder.
- **Kerst staat nu direct onder de hero**, met de kraag erop. Stond een sectie
  lager.
- *Zoekt u iets bepaalds* → *specifieks*.
- **Nieuwe teksten** voor "In de winkel" (binnen/buiten), de tegels Bloemen,
  Planten, Tuin en Wonen op de homepage, en voor de blokken Bloemen, Planten,
  Wonen en Tuin op `/assortiment/`. Letterlijk aangeleverd; alleen
  "woonassecoires" is als "woonaccessoires" gespeld.
- **Nieuw in het assortiment:** boomschors, openhaardhout en bloembollen. Die
  stonden er nog niet op.
- **"Grond en mest" is geen eigen sectie meer.** De kop, de intro en de belknop
  zijn weg; de lijst zelf staat nu onder Tuin als "Grondsoorten en meststoffen".
  Hydrokorrels zijn nu drainage onderin de pot in plaats van kweken op water.
- **De violenfoto bij Tuin is eruit** (blauw doorgekruist) en vervangen door de
  foto van het buitenterrein zelf. **Nog te bevestigen:** bij die afdruk stond
  "en ipv daarvan"; welke foto daar bedoeld werd is mijn gok.
- **Abonnement is nu ook voor particulieren.** Stond helemaal op restaurants en
  bedrijven; thuis staat nu overal vooraan, op de homepage, op `/abonnement/`
  (met "Thuis" als eerste tegel onder "Voor wie") en in de vraag bij Veelgesteld.
- **Eigen tegel voor het abonnement** bij "Kom gerust even rondkijken", met een
  link naar `/abonnement/`. Zes tegels nu, twee rijen van drie.
- **Abonnement als vijfde keuze in het aanvraagformulier.** Wie op "Vraag een
  voorstel aan" klikte, kwam eerst in een formulier waarin zijn eigen vraag
  ontbrak. Stap 2 toont bij die keuze geen ophalen-of-bezorgen maar "Wij komen
  bij u langs".

## Revisieronde 15 oktober

Zesentwintig aangestreepte schermafdrukken van Armando — deels pagina's, deels
pagina's uit een eigen document met "> moet worden >" erin. Wat er gebeurd is:

- **Het kerstvlak is crème.** Stond op `#1b2d15`, het donkerste vlak van de hele
  pagina, pal onder de kopfoto; dat las als een balk die er overheen lag. Nu
  `tone="kerstroom"` (`#f7f3e4`, de letterkleur van hun bord een slag
  opgelicht). Kerst komt er van vorm in plaats van diepte: hetzelfde lichtsnoer
  bovenaan maar met de lampjes op volle kleur (`.kerstsnoer-licht`), de
  vurentakken in het groen van de bomen, en een rij vurenbomen met ballen langs
  de onderrand (`.kerstbomenrij`, een tegel van 360 px die zichzelf herhaalt).
  `tone="kerst"` staat nog in `ui.tsx`, ongebruikt, zodat de donkere versie
  terug kan. **Teruggedraaid op 16-10 — zie hieronder.**
- **`/kerst/` heeft zijn introzin en de sectie "Vanaf begin november" verloren.**
  Daarmee stond er op de pagina die over kerst gaat niets meer dat er ook naar
  uitzag; het kerstdecor zit nu op de sectie met de drie kaarten. De regel over
  iets op bestelling in eigen kleuren, die in die weggehaalde sectie stond,
  staat als vierde vak in dat raster — anders bleef er een gat rechtsonder en
  verdween de stap naar het formulier van de pagina.
- **Kerstkaarten:** Accessoires eruit ("voor nu weglaten"). De drie die blijven
  noemen nu soorten in plaats van omschrijvingen: Nordmann, Nobilis, Picea en
  besneeuwde kunststof bomen; Nordmann- en Nobiliskransen; verlichting in
  verschillende lengtes. "Nobellis" is als **Nobilis** gespeld.
- **`/abonnement/`:** kop is *Verse bloemen op tafel, zonder omkijken* (was
  *Groen op tafel*). Ook op de homepage, want twee koppen boven hetzelfde
  aanbod leest als twee dingen. Kicker "Twee vormen abonnement" en de intro
  eronder weg, net als de secties "Vier stappen" en "Waar het meestal staat".
- **`/cadeau/`:** sectie "Drie stappen" weg. Nieuwe teksten voor de intro, de
  cadeaubon en het cadeaupakketje, letterlijk aangeleverd. Daarin staan voor het
  eerst producten van buiten het eigen assortiment: **Schulp** (sap), wijn,
  noten, kaas en **Hoeksche** chips. "Welkom bij de buren" → "Welkom heten van
  nieuwe buren".
- **Homepage:** hero zegt *meststoffen* in plaats van *de zakken grond*. Nieuwe
  teksten voor alle drie de alinea's van "Over ons" (woonaccessoires,
  meststoffen, "van klassiek tot plukboeket", *woning* in plaats van *kamer*).
  De bijschriften "Binnen in de winkel aan het Hogepad" en "Zo staan we erbij
  aan het Hogepad" zijn weg, en bij "Waar u ons vindt" blijft alleen *Parkeren
  kan voor de deur* staan.
- **Veelgesteld:** "Kan ik zomaar binnenlopen?" en "Wanneer begint het
  kerstseizoen?" eruit. Nieuwe antwoorden op bestellen, boeketten op bestelling,
  de tuin en de zaden.
- **Zwevende knoppen rechtsonder**, naar het voorbeeld van
  winterswijkvakantiehuis.nl: WhatsApp in zijn eigen groen, Bellen in oranje
  (`BEL_ORANJE`, een tint dieper dan het voorbeeld — wit op licht oranje haalt
  de leesnorm niet). Alleen vanaf `md`: daaronder doet `MobielBalk` hetzelfde.
- **"Nog geen bestelling"** in stap 7 van het formulier staat nu in amber met
  een rand eromheen, in plaats van in dezelfde grijstint als de rest. Amber en
  niet rood: er is niets misgegaan, er moet alleen iets opvallen.

**Cadeau en Kerst zijn uit het aanvraagformulier.** Dat laat een gat dat het
tegenovergestelde is van wat er op 14-10 gerepareerd werd: `/cadeau/` heeft nog
een knop "Een pakketje laten maken" en `/kerst/` een knop "Iets laten maken",
en die komen allebei uit bij een formulier waarin hun eigen onderwerp niet meer
als keuze staat. De bezoeker kan het alleen nog bij de wensen kwijt.
**Voorgelegd aan Armando op 15-10-2026; terugzetten is het omkeren van één
commit.**

## Kerst weer groen — 16 oktober

"Doe toch terug in groen." Het kerstvlak staat weer op `tone="kerst"`
(`#1b2d15`, op een breed scherm `#27401c`), op de homepage en op `/kerst/`, met
de gloed, de witte takken en de doorschijnende kaarten die daarbij horen. De
crèmevariant blijft compleet in de code staan — `tone="kerstroom"`, de lichte
tak van `Section`, `.kerstsnoer-licht` en de drie kleuren in `index.css` — want
dit is nu twee keer omgezet en de derde keer is één woord werk.

Wat er van de crèmeronde blijft: **de rij vurenbomen** langs de onderrand, nu
wit op het groen (`.kerstbomenrij-donker`). Die kwam er toen bij en zonder die
rij loopt de sectie onderaan leeg af.

**De naad met de hero is opnieuw dichtgelegd, en anders dan op 15-10.** Het
verloop onder de kopfoto loopt weer naar het kerstgroen toe, maar daarmee was
het niet opgelost: de warme gloed stond op volle sterkte op de bovenrand van de
sectie zelf. Gemeten over die lijn sprong het in één beeldpunt van `#27401c`
naar `#48552b` — het verloop deed zijn werk en de gloed zette er alsnog een
streep. De gloed heeft nu een masker (`mask-image`, doorzichtig tot 32% van zijn
hoogte), dus het licht komt pas onder het snoer op gang en lijkt van de lampjes
te komen in plaats van van de rand. Nagemeten op de live pagina: `#27401c` aan
beide kanten van de naad.

## De naam staat nog op Vershal Ouddorp — 16 oktober

Doorgegeven door Armando: de winkel heet op dit moment nog **Vershal Ouddorp** en
gaat pas over een paar weken over op Bloei!. Dat is precies de periode waarin
deze site al Bloei! heet, dus een bezoeker die via Google of Facebook binnenkomt
ziet twee namen en weet niet of hij bij dezelfde winkel is.

Daarom een melding op de site, op vier plekken:

| Waar | Wat |
| --- | --- |
| Boven in het heropaneel en boven elke paginakop | `NaamMelding` in `src/layout.tsx`: één regel plus een link naar de uitleg |
| Bij "Waar u ons vindt" (staat onder elke pagina) | `NaamUitleg`, `id="naam"` — het hele verhaal |
| Veelgesteld | "Heet deze winkel niet Vershal Ouddorp?", laatste vraag |
| `index.html` | `"alternateName": "Vershal Ouddorp"` in het `GardenStore`-blok, zodat Google het als dezelfde zaak leest en niet als een tweede winkel op hetzelfde adres |

De tekst noemt alleen wat te controleren valt: bij **Google en op Facebook**
staat de winkel onder de oude naam (nagekeken 16-10-2026). Over wat er op dit
moment op de gevel staat belooft hij niets — de foto op deze site toont het
nieuwe bord, en of dat er al hangt weten wij niet.

**Dit is tijdelijk.** Zodra de naam is overgegaan: de twee componenten plus hun
aanroepen in `Hero` en `PaginaKop`, het blok in `Bezoek`, de laatste vraag in
`VRAGEN` (`App.tsx`) en `alternateName` weghalen.

## Techniek

Kopie van `apps/fleurig`, dus hetzelfde recept: Vite + React 19 + Tailwind v4,
elke pagina als kant-en-klare HTML gebakken (`scripts/prerender.mjs`), Worker met
`@jiw/cloudflare-forms` ervoor.

```
pnpm --filter @jiw/bloei dev      # :3065
pnpm --filter @jiw/bloei lint     # tsc, app + worker
pnpm --filter @jiw/bloei ship     # build + audit:seo + wrangler deploy
```

`scripts/audit-seo.mjs` controleert op `GardenStore` en niet op `Florist`: Bloei!
verkoopt bloemen, maar het zwaartepunt ligt bij planten, tuin en wonen.

**De ontvanger van het formulier staat op `hallo@jouwidealewebsite.nl`**, niet op
een adres van de klant (`LEAD_RECIPIENT` in `wrangler.jsonc`). Dit is een concept
en het e-mailadres van de winkel is niet bevestigd; een testaanvraag hoort niet in
de inbox van een klant te belanden.

Het conceptadres staat op `jouwconcept.app` en niet op `jouwidealewebsite.nl`:
die zone zit op de grens van 100 custom domains.

Wordt dit een echte site, dan:

1. `SITE_URL` in `site.config.mjs` naar het eigen domein.
2. In `wrangler.jsonc` de apex én de `www`-variant als `custom_domain` erbij.
3. Een zone-redirect van `www` naar de apex (301); een canonical alleen laat twee
   hosts 200 geven.
4. `bloei-concept.jouwconcept.app` in `ANDERE_HOSTS` (`worker/index.ts`), dan
   stuurt het conceptadres door in plaats van een tweede kopie te serveren.
5. Afzenderdomein `notify.<domein>` aanmelden bij Cloudflare Email Service, en
   `LEAD_RECIPIENT` op het echte adres van de winkel.
