# Bloei! Ouddorp — wat klopt en wat nog niet

Gebouwd 7 oktober 2026 als concept. **Sinds 19 oktober 2026 live op het eigen
domein <https://bloei-ouddorp.nl>** (zie `SEO.md` voor de nulmeting van die dag).
`www` en het oude conceptadres `bloei-concept.jouwconcept.app` sturen er met één
301 naartoe.

Let op: dat de site op een eigen domein staat verandert niets aan de lijst
hieronder. Het adres, het nummer en de openingstijden zijn bevestigd, maar er is
nog steeds geen mailadres en geen vectorlogo, en de winkel heet voorlopig nog
Vershal Ouddorp. Sinds 20-10-2026 is er wél een kerstfoto.

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

**Sinds 20-10-2026 de tweekleurige versie**, op verzoek van Armando: de map
`01-Logos/Extras-tweekleurig` uit de huisstijl. Daarvoor stond de eenkleurige
erop — hetzelfde merk, maar het blad in één vlakke tint lindegroen (`#B1C2A2`).
In de tweekleurige is elk blaadje gesplitst in een donkere helft (saliegroen
`#4F784B`) en een lichte (`#A9C58D`), waardoor het blad over de letters heen
ligt in plaats van ernaast te staan.

Eén bronbestand: `public/img/logo-bloei-wit.svg` — witte letters, tweekleurig
blad, 680 × 410. Al het andere wordt daaruit gemaakt door `node scripts/icons.mjs`:

| bestand | wat | waar |
| --- | --- | --- |
| `img/logo-bloei-wit.svg` | de bron | balk bovenaan, voet (alles op dennengroen) |
| `img/logo-bloei-kleur.svg` | wit → dennengroen, salie → dennengroen, licht blijft | lichte vlakken |
| `favicon.svg` | alleen de scheut, op dennengroen, in één tint | tabblad |
| `img/icon-96.png` | idem, in één tint | zoekresultaat (Google zet hem op ~16 px) |
| `img/icon-192/512.png`, `apple-touch-icon.png` | de scheut in twee tinten, als PNG | startknop |
| `logo-email.png` | de gekleurde versie, 480 px, ingebakken op `surfaceAlt` | bevestigingsmail |

De gekleurde versie zit ook in de huisstijlmap, maar die gebruiken we niet: twee
bestanden van hetzelfde merk naast elkaar lopen vroeg of laat uit de pas. Het
script leidt hem af en schrijft er een `<desc>` in dat hij gegenereerd is. De
afleiding is op 20-10-2026 pad voor pad naast hun eigen
`bloei-primair-kleur-transparant.svg` gelegd: dezelfde vormen, dezelfde kleuren,
alleen staan bij hen de twee dennengroene groepen samengevoegd.

Het pictogram is de **scheut** (de blaadjes boven de letters), niet het hele
blad: daar zit ook het losse blad in dat door de O valt, en dat zweeft in een
vierkant pictogram als een vlek zonder verband onder de scheut. Welke vormen bij
de scheut horen wordt gemeten en niet geteld — zie de toelichting in
`scripts/icons.mjs`. Met de tweekleurige versie zijn dat er acht in plaats van
drie, want elke helft is een eigen vorm; het clusteren vangt dat vanzelf op.

**Waarom het tabbladteken in één tint staat.** Saliegroen haalt op dennengroen
2,3:1. Op een logo van 58 pixels hoog is dat prima — de lichte helft draagt de
vorm — maar op 16 pixels valt die donkere helft weg en houd je een halve scheut
over die eruitziet als een vlekje. De 16/24/32/48 zijn naast elkaar gezet; tot
ongeveer 48 pixels wint het silhouet, daarboven wint het tweekleurige blad.
Vandaar `favicon.svg` en `icon-96.png` plat, de rest niet.

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

**Op 20-10-2026 kwamen er zes bij**, door Armando aangeleverd met de afdeling
erbij waar ze horen:

| Bron | Waar hij staat |
| --- | --- |
| `bloemen-tafel.jpg` | `kaart-bloemen` (tegel op de home, keuze Boeket in het formulier) en `afdeling-bloemen` (liggend, blok Bloemen op `/assortiment/`) |
| `planten-rij.jpg` | `kaart-planten` (tegel, blok Planten, keuze Plant of bak) |
| `wonen-decoratie.jpg` | `kaart-wonen` (tegel, blok Wonen) |
| `wonen-tafel.jpg`, `wonen-vaas.jpg`, `wonen-potten.jpg` | `wonen-1/2/3`, de strook van drie onder het blok Wonen |
| `kerst-snowtree.jpg` | `kerst-bomen` (kop van `/kerst/`) en `og-kerst` |

De bloemenfoto is de enige liggende van de zes. In de staande tegel blijft er een
smalle strook van over; daarom staat er op de assortimentspagina een eigen
uitsnede van 4:3.

**Kerst is daarmee niet langer alleen tekst.** De pagina `/kerst/` stond op een
najaarsfoto met chrysanten omdat er van kerst geen enkel beeld was; nu staat de
verlichte kunstboom erop. Armando noemde die foto zelf bij "wonen" — hij is naar
kerst verplaatst omdat het de eerste echte kerstfoto is, en dat is een keuze die
teruggedraaid mag worden. Het kerstdecor in groen (lichtsnoer, gloed, vurenbomen)
staat er ongewijzigd bij.

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
| Lindegroen | `#B1C2A2` | `accent` — het accent op donker. Was tot 20-10-2026 ook letterlijk de bladkleur van het logo; het tweekleurige blad gebruikt `#4F784B` en `#A9C58D`, maar lindegroen blijft als accentkleur staan, want die staat zo in de aangeleverde reeks |
| Ivoor | `#F3EEDC` | `ivoor` — spaarzaam: kerstkaarten en de lampjes in het snoer |
| Zandbruin | `#B99D71` | `zand` — de zwevende belknop en de lampjes in het kerstsnoer |
| Framboos | `#c22a5f` | `roze` — de hoofdknop; komt niet uit de reeks, zie hieronder |

Vier dingen die niet letterlijk uit de reeks komen en waarom:

- **De achtergrond.** `cream` `#f2f6ef`, met `creme-diep` en `line` eronder. Dat
  is uitgewassen lindegroen (dezelfde kleurhoek, 92°), niet ivoor — de klant
  vroeg om een lichte tint groen, en ivoor is gevraagd als markeerkleur. Twee
  lichte tinten door elkaar leest als een fout in plaats van als een keuze.
- **De hoofdknop is de framboos van Fleurig!, `#c22a5f` met witte letters.**
  Teruggezet op verzoek, 18-10-2026, na een halve dag in zandbruin. De winkel
  was bij Fleurig! tevreden over deze kleur. Wit erop haalt 5,4:1 en hover
  (`roze-diep` `#a81f4f`) 7,0:1, dus die gaat de gewone kant op: een slag dieper.
- **De zwevende belknop is wél zandbruin, en die heeft dennengroene letters.**
  Wit op zandbruin haalt 2,6:1, dennengroen 4,6:1. Om dezelfde reden gaat hover
  daar omhóóg: indikken zakt naar 3,4:1, oplichten gaat naar 5,5:1. Zet de
  letters daar niet op wit omdat het er in een ontwerp beter uitziet.
- **`accent-dark` is `#42653f`, saliegroen een slag verdiept.** Saliegroen zelf
  haalt alleen op de lichtste van de drie achtergronden de norm (4,6:1 op
  `cream`, maar 4,3:1 op `creme-diep` en 4,0:1 op de randkleur). De echte
  `#4F784B` staat wel onvermengd op de site: in het logo voor lichte vlakken, in
  de blaadjes aan de hoofdknop en als `--color-salie`.

**Het oranje van de belknop is weg** (`#c9741f`, naar het voorbeeld van
winterswijkvakantiehuis.nl). Die knop staat nu in zandbruin. Het framboosroze
ging er bij de huisstijl ook uit, maar is op verzoek dezelfde dag teruggezet op
de hoofdknop — dat is nu de enige kleur op de site die niet uit de reeks komt.

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

**De ontvanger van het formulier staat sinds 19-10-2026 op
`info@bloei-ouddorp.nl`**, de mailbox van de winkel zelf (`LEAD_RECIPIENT` in
`wrangler.jsonc`; die loopt over de Purelymail-records van de apex). Daarmee
geldt hier wat bij elke andere klantensite geldt: **nooit een testaanvraag tegen
de live config**, want die komt in hun inbox. Moet er getest worden, zet
`LEAD_RECIPIENT` eerst terug op `hallo@jouwidealewebsite.nl`.

Dat adres staat nergens op de site en ook niet in de bevestiging aan de klant: de
winkel heeft ons geen adres gegeven om te publiceren, alleen een inbox om de
aanvragen in te ontvangen. Contact loopt voor de bezoeker via telefoon en
WhatsApp.

## De verhuizing naar bloei-ouddorp.nl — 19 oktober

Hier stond een lijstje van vijf dingen die moesten gebeuren "wordt dit een echte
site". Dat is nu gedaan:

1. `SITE_URL` in `site.config.mjs` op `https://bloei-ouddorp.nl`. Elke canonical,
   `og:url`, schema.org-blok en sitemapregel komt daaruit, dus dit was één regel.
   De kale host is de canonieke: dit domein had geen A-record en nooit een site,
   dus er is geen www-verleden om te sparen zoals bij `framemedia`.
2. Apex én `www` als `custom_domain` in `wrangler.jsonc`, plus het conceptadres.
   Die laatste hing aan de oude Worker en is met
   `PUT /accounts/{id}/workers/domains` (`override_existing_origin: true`)
   overgezet; die Worker is daarna weggehaald.
3. De Worker heet nu `bloei` en niet meer `bloei-concept`.
4. Zoneregel op `bloei-ouddorp.nl`: `www` → apex, 301, pad en querystring
   behouden. Diezelfde omleiding staat ook in `ANDERE_HOSTS` in
   `worker/index.ts`, als tweede slot.
5. Afzender op `no-reply@notify.bloei-ouddorp.nl`. Dat domein was al in
   Cloudflare Email Service aangemeld en ingeschakeld (DKIM, SPF, DMARC op
   `p=reject`) — er was geen DNS-werk nodig. De records hangen onder
   `cf-bounce.notify.bloei-ouddorp.nl`, niet onder `notify.bloei-ouddorp.nl`
   zelf; een lookup op die laatste naam geeft niets en dat is geen fout.
6. `pnpm indexnow` erbij, met sleutelbestand in `public/`. Op de dag van de
   verhuizing gemeld: 202 Accepted voor vijf adressen.

Eén testaanvraag verstuurd tegen de live site, met
`jouwidealewebsite@gmail.com` als klant. `form_accepted` in `wrangler tail` en
geen `Confirmation email failed` — dat laatste is de enige manier om zeker te
weten dat de bevestiging aan de klant ook werkelijk weg is, want een mislukte
bevestiging wordt alleen gelogd en geeft de bezoeker nog steeds `{"ok":true}`.

Diezelfde avond is `LEAD_RECIPIENT` naar `info@bloei-ouddorp.nl` gezet en is de
regel "Dit is een aanvraag en nog geen bestelling: u zit nergens aan vast" uit de
bevestiging aan de klant gehaald. Die testaanvraag hierboven is dus de laatste
die tegen deze config mocht. Op de site zelf staat die regel nog wel, als vinkje
bij het formulier.

Wat er niet mee verhuisd is: de disclaimer over de oude naam, die juist nu nodig
is. Zie
`SEO.md` voor wat er nog openstaat — Search Console en het Google
Bedrijfsprofiel zijn de twee die er het meest uit halen, en die liggen beide
buiten deze repo.
