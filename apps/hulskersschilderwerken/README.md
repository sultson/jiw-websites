# Hulskers Schilderwerken

Site voor **Pascal Hulskers Schilderwerken** uit Coevorden, met renovlies als voorkant.
Pascal krijgt genoeg binnen- en buitenschilderwerk via mond-op-mond, maar geen
renovlies; dat is waar deze site op stuurt.

Live: <https://hulskersschilderwerken.nl>

De opdracht was: lijkt sprekend op <https://renovliesdirect.nl>, maar gepersonaliseerd.
De opbouw volgt die site (donkere hero met rekenkaart ernaast, lopende balk, vijf
genummerde punten, vakmanblok, kleurkaarten, werk, stappen, vragen, offerte), met zijn
eigen huisstijlkleuren uit de aangeleverde zip.

## Verhuisd uit de playground, 26-10-2026

Dit project is op 19-10-2026 gebouwd in `claudius/playground/hulskers-renovlies` en op
26-10-2026 hierheen verhuisd (opdracht Alfred). Wat die verhuizing inhield:

- **Zijn eigen domein.** `hulskersschilderwerken.nl` is canoniek, `www` 301't erheen.
  Het domein had geen geschiedenis - er stond nooit een site op, alleen zijn
  Purelymail-records voor de mailbox - dus geldt de huisregel uit de root `CLAUDE.md`:
  apex canoniek, en niet de framemedia-uitzondering.
- **Het oude conceptadres leidt om.** `hulskers-renovlies-concept.jouwconcept.app` hangt
  aan deze Worker en 301't padbehoudend naar de apex. Dat moest: dat adres stond een week
  online MET `Allow: /` in robots.txt, dus het was een complete tweede kopie van deze site
  die om dezelfde zoekwoorden concurreerde.
- **Het formulier verstuurt echt.** Tot de verhuizing bouwde het alleen een WhatsApp- of
  mailbericht op; nu gaat het door `@jiw/cloudflare-forms` naar `/api/forms/offerte`, komt
  er een mail bij ons binnen en krijgt de bezoeker een bevestiging in zijn huisstijl. Er is
  een e-mailveld bijgekomen, want zonder adres kan die bevestiging niet terug.
- **De twee poorten zijn meegekomen** naar `tools/poorten/` (waren
  `playground/.gereedschap/`). Dat is een kopie en geen deelbestand: een pad naar de
  gereedschapsmap van een andere repo werkt op deze machine en breekt elke verse kloon.
  Om dezelfde reden komt Playwright nu uit de devDependencies hier en niet meer uit
  `claudius/node_modules`.
- **Wat niet mee is:** de eenmalige `kijk-*.mjs`- en `shot-*.mjs`-scripts, de meetscripts
  die een site van een ander meten (`meet-mts.mjs`, `meet-winterswijk*.mjs`) en alle
  schermfoto's. Die hoorden bij het conceptwerk in de groep.

## Draaien

```bash
pnpm --filter @jiw/hulskersschilderwerken build     # poorten + dist/ + de voorafpoort
pnpm --filter @jiw/hulskersschilderwerken build:dev # zelfde, maar dicht (noindex, geen sitemap)
pnpm --filter @jiw/hulskersschilderwerken dev       # bouwt dicht + wrangler dev op :3075
pnpm --filter @jiw/hulskersschilderwerken ship      # bouwt en rolt uit
pnpm --filter @jiw/hulskersschilderwerken lint      # tsc over worker/
pnpm --filter @jiw/hulskersschilderwerken indexnow  # meldt de sitemap aan bij Bing c.s.
```

En de losse latten:

```bash
python fotos.py      # originelen -> webp + manifest.json (incl. gemeten wandkleuren)
node controleer.mjs  # leest de gebouwde pagina's na
node meet.mjs        # meet in Chromium op 360 t/m 1440, beide pagina's
node proef.mjs       # klikt menu, rekenhulp, stroken en /werkwijze/ echt door
node tools/live.mjs  # vult het ECHTE formulier op de LIVE site in (verstuurt!)
node shot.mjs        # schermfoto's van beide pagina's
```

`meet.mjs` kijkt naar breedtes, tekstgroottes en kleine kapitalen in de kopletter,
`proef.mjs` naar gedrag. Die tweede is er sinds 20-10-2026: een menu dat niet opengaat is
net zo stuk als een pagina die opzij te slepen is, en het eerste script ziet dat niet.
`tools/vooraf.mjs` hangt in `pnpm build` en is de derde: die kijkt of elke pagina echt
helemaal in de html staat. Zie `SEO.md`.

`fotos.py` eerst: `build.mjs` leest `public/f/manifest.json`.

**Let op bij het bewerken van de css in `build.mjs`:** die staat in een
template-literal, dus een backtick in een commentaarblok daarbinnen sluit de literal en
de bouw valt om met een syntaxfout een paar honderd regels verderop. Gooi de uitvoer van
een bouw ook niet weg - een stil gefaalde bouw laat de oude `dist/` staan, en dan meet je
daarna de vorige versie en denk je dat je wijziging niets deed.

## Waar de tekst vandaan komt

Alles wat de site beweert staat in `bron/zijn-tekst/`:

- `marktplaats-advertentie.txt` is zijn eigen advertentie (m1276829392, online sinds
  18-04-2018). Daar komen de prijzen, de ondergrens van 100 m2, de btw-regel, de
  betaalafspraak en zijn motto woordelijk vandaan.
- `kvk-en-vindplaatsen.txt` is het KVK-uittreksel plus de openbare bedrijvengidsen,
  voor adres, KVK-nummer, telefoon en mail.
- `doorgegeven-armando.txt` is wat Armando namens hem doorgaf in de groep. Van horen
  zeggen, dus elke regel die erop rust draagt dat label op de nalooplijst - zie
  "Ronde 6" hieronder.
- `doorgegeven-armando-25-10-2026.txt` is dezelfde soort bron, vijf dagen later, en
  spreekt dat bestand op een punt tegen: de prijs is inclusief voorstrijken. Eigen
  bestand, want een bron die zichzelf tegenspreekt moet dat zichtbaar doen.

Een vierde bestand staat er bewust **naast** en niet in: `bron/sikkens-producten.txt`,
de technische gegevens van AkzoNobel. Dat is de tekst van een fabrikant en niet van
Pascal, en een fabrikantclaim mag geen woord verantwoorden in een zin die namens hem
spreekt. Wat de verf doet draagt daarom merk `feit` met dat bestand als bron; dat
Pascal ermee werkt is een aparte bewering op Armando. Zie "Ronde 15".

Let op: **een korpus veroudert.** Zijn advertentie is van 2018 en noemt een dienst die
hij niet meer doet (traprenovatie, ronde 15). De kop van dat bestand - boven de `---`,
dus buiten het korpus - zegt nu welke stukken achterhaald zijn.

`inhoud.mjs` merkt elke regel (`eigen`, `afgeleid`, `stem`, `feit`, `ons`, `bezoeker`)
en `build.mjs` laat de bronpoort erop los. Een regel met een getal, een belofte of een
ik-vorm zonder merk laat de build zakken. Wat overblijft staat in `NALEZEN-PASCAL.md`:
dat zijn de regels die Pascal zelf moet nalezen, en niet de hele site.

## Ronde 2 (20-10-2026, feedback Armando)

Zeven punten, allemaal terug naar de referentiesite gemeten in plaats van op het oog:

- **Telefoonmenu.** Onder 720px verdween de navigatie helemaal en bleef alleen de
  offerteknop over. Nu een heel scherm met zes genummerde regels, waarvan "Prijzen"
  uitklapt naar de twee pakketten met hun prijs. Het plusje is een svg: een gedraaide
  `+` uit de smalle kopletter wordt een dikke ster.
- **Zwevende knoppenbalk** op de telefoon, zoals mts-vloerverwarming: offerteknop plus
  een bel- en een WhatsApp-rondje. Komt pas in beeld als de hero voorbij is
  (IntersectionObserver), en `body` krijgt onderaan ruimte zodat hij de laatste regel
  niet afdekt. Hij is weg uit de a11y-boom als hij niet zichtbaar is (`visibility`,
  geen `aria-hidden` op een blok met links erin).
- **Rekenhulp in drie stappen**, zoals de referentie: 01 pakket, 02 aantal m2 met een
  min/plus-teller, 03 de uitkomst met het bedrag en het tarief eronder. De prijzen
  blijven die van Pascal (10 en 16 euro); alleen de opbouw is overgenomen.
- **Waarom renovlies** gaat nu alleen nog over renovlies: vijf regels van een zin. De
  twee punten die eigenlijk "waarom voor ons" waren (duidelijke offerte, heel
  Nederland) stonden er doorheen en maakten het blok lang en dubbelzinnig.
- **Kleurblok** volgt de referentie: kop links met de lead ernaast, drie staande foto's
  met een bijschriftbalk ONDER de foto en een vierkant kleurvlakje ervoor, op een
  telefoon een schuifstrook met stippen.
- **Compactere copy** door de hele pagina: hero, vakmanblok, stappen en de antwoorden
  in de vragenlijst.
- **De ondergrens van 100 m2** is weg uit de bovenbalk, de hero, de lopende balk en de
  meta-omschrijving (dat laatste is de regel die Google toont). Hij staat nog op drie
  plekken: als melding in de rekenhulp zodra iemand minder dan 100 invult, en in twee
  antwoorden in de vragenlijst. Zie hieronder waarom hij niet helemaal weg kan.

## Ronde 3 (20-10-2026, twee losse berichten van Armando)

- **Stappen en de vijf redenen zijn genummerde regels** in plaats van kaartjes.
  Armando zette de lijst van de referentiesite naast onze kaartjes: de lijst is
  duidelijker in structuur en minder leeswerk. Cijfer links, korte kop, een regel
  eronder, een dunne streep ertussen (`.rijen` in build.mjs). De vijf redenen houden
  op een breed scherm hun vijf kolommen en worden onder 760px dezelfde rijen; twee
  kolommen met blokjes op een telefoon waren precies wat hij niet wilde.
  De drie stappenregels zijn daarbij ingekort; stap 04 is woordelijk zijn eigen zin
  uit de advertentie en blijft dus staan zoals hij is.
- **Eerder werk is een schuifstrook** zoals de projectenstrook van de referentiesite:
  teller erboven (`01 / 06`), de foto's schuiven opzij met snap, duimnagels eronder
  met een blauw kader om de foto die in beeld staat. Klikken op een duimnagel schuift
  de strook, en de duimnagelrij schuift zelf mee zodat foto 5 en 6 op een telefoon niet
  buiten beeld raken. Drie kaarten naast elkaar op een breed scherm, twee op een tablet,
  een kaart met een randje van de volgende op een telefoon.
  Let op bij wijzigen: de tussenruimte in `.werk` is een vast getal (16px) en geen
  `clamp()`, want het script rekent de scrollpositie uit met kaartbreedte + dat getal.

## Ronde 4 (20-10-2026, feedback Armando)

- **De rekenhulp houdt zijn eigen prijzen en pakketten.** Armando vroeg in ronde 2 om
  dezelfde opties en bedragen als de referentiesite en trok dat daarna zelf terug:
  Pascal heeft die gegevens zelf op Marktplaats staan. Er is dus niets veranderd aan
  de bedragen (10 en 16 euro) of aan de twee pakketten; alleen de opbouw in drie
  stappen is van de referentie overgenomen.
- **Tweede pagina: `/werkwijze/`**, de tegenhanger van
  <https://renovliesdirect.nl/werkwijze/>. Zelfde opbouw: een eigen kop met kruimelpad,
  de stappenlijst, de stappen daarna uitgewerkt met een foto ernaast, en onderaan prijs
  en afspraken. De startpagina houdt zijn korte stappenblok en linkt eronder door.

### Twee pagina's: wat dat in de code veranderde

- Kop, topbalk, header, menulade, voet en de zwevende balk staan nu in functies
  (`hoofd()`, `chroom(basis, hier)`, `voetBlok(basis)`), met `basis` als enige verschil:
  `''` op de startpagina, `'/'` op een onderpagina. Een kale `#offerte` op `/werkwijze/`
  wijst naar een blok dat daar niet staat, en dan doet de knop niets. `controleer.mjs`
  toetst elke `/#anker` tegen de id's van de startpagina.
- Alle paden zijn absoluut (`/f/...`, `/styl.<hash>.css`), want `/werkwijze/` ligt een
  map diep. Daardoor kunnen de meetscripts niet meer over `file://`: `dienen.mjs` start
  een kleine server en `meet.mjs`, `proef.mjs` en `shot.mjs` draaien daartegen. Dat is
  meteen dichter bij live, inclusief de map-index van `/werkwijze/`.
- `html_handling = "force-trailing-slash"` in `wrangler.toml`. Met de standaardwaarde
  kiest Workers zelf welke vorm 200 geeft en wordt de andere een 307; dan wijzen de
  canonical en de sitemap naar een omleiding. Nagemeten na de deploy: `/werkwijze/` is
  200, `/werkwijze` is een 307 daarheen.
- De bedragen staan in `PRIJZEN` en worden op `/werkwijze/` in een zin genoemd.
  `build.mjs` stopt als die twee uit elkaar lopen, zodat er geen "vanaf 10 euro" in een
  zin blijft staan terwijl de rekenhulp met een ander tarief rekent.

### Wat er op /werkwijze/ bewust NIET staat

De referentiesite werkt daar vijf technische stappen uit: egaliseren en schuren met een
wandschuurmachine, vlies van 200 gram, naden opvullen, naden afkitten en sausen met een
genoemd verfmerk, plus een cijfer van een reviewsite en een showroomadres. Daarvan staat
niets in Pascal zijn eigen tekst. Het staat er dus niet, want dat zou zijn werkwijze
verzinnen in zijn eigen vak, en dat is precies waar een klant overheen leest.

Dit is wat er van hem nodig is om die blokken wel te kunnen vullen:

1. ~~Maakt hij de wand eerst zelf behangklaar (egaliseren, schuren, voorstrijken)?~~
   **Definitief beantwoord op 25-10-2026 door Pascal zelf, en het antwoord is NEE.**
   "Ik ga wanden die niet behangklaar zijn, niet behangklaar maken !!" De site zei acht
   dagen het omgekeerde, op gezag van het doorgegeven antwoord van 20-10-2026 ("ja,
   indien nodig") - dat is dus ingetrokken, eerst half (egaliseren, overleg 25-10) en
   nu helemaal. Wat hij wel doet gaat over een wand die al behangklaar IS: nalopen met
   een wandschuurmachine, en de laatste kleine beschadigingen repareren of voorstrijken
   waar dat nodig is. Zie ronde 18 en `controleer.mjs` 13b4/13b5.
   **Nog open:** zit voorstrijken in de prijs per m2? Schuren en lichte reparaties wel
   (ronde 9), voorstrijken is nooit gezegd. En waar ligt bij hem de grens tussen een
   lichte reparatie en herstelwerk dat apart gerekend wordt?
2. Wat doet hij met de naden?
3. ~~Welke verf gebruikt hij bij het texen, en is dat een merk dat genoemd mag worden?~~
   **Beantwoord op 20-10-2026 door Armando: Sikkens.** Alpha Rezisto Anti Marks en
   Alpha Rezisto Easy Clean, die twee kunnen samen bij 2x texen; Alphacryl Pure Mat SF
   op aanvraag. Staat nu in een eigen blok op de startpagina (`#verf`), in de rekenhulp,
   bij De afwerking op `/werkwijze/` en als vraag 12. Zie ronde 15. Over de lijm is nog
   niets gezegd.
4. Hoe laat hij de woning achter, en wat verwacht hij van de klant (kamer leeg, vloer
   afgedekt)?
5. Zijn Marktplaats-kenmerken noemen "Garantie" zonder voorwaarden. Welke termijn?
6. Echte renovlies-reviews: zonder die blijft het beoordelingsblok leeg (zie hieronder).

Drie vragen erbij, uit ronde 11. Dit zijn de drie punten die de referentiesite op de
plek van de vijf redenen heeft en wij niet, en ze zijn alle drie sterker dan wat er nu
staat - maar het moeten zijn woorden zijn, want het zijn beloftes en cijfers:

7. Hoe snel levert hij op? Zij beloven "nieuwbouw binnen een werkweek". Haalt hij dat
   ook, en voor welke maat wand?
8. ~~Welk merk verf en lijm gebruikt hij? (Zij noemen Sikkens.)~~ **Beantwoord op
   20-10-2026: Sikkens, zie vraag 3.** Wat hun USP "A-merk materialen o.a. Sikkens"
   claimt, claimt hij nu zelf - alleen met de producten erbij, en dat is sterker.
   Over de lijm is nog niets gezegd.
9. Hoeveel scheelt renovlies bij hem ten opzichte van stucwerk? Zij zeggen 40%. Een
   cijfer van hem mag op de pagina, een cijfer van hen niet. **Let op sinds ronde 18:**
   de vergelijking met stucen of schilderen staat niet meer op de site - Pascal haalde
   hem er zelf af. Komt er een cijfer van hem, dan is dat een nieuw besluit van hem en
   niet het terugzetten van wat er stond (`controleer.mjs` 15e gaat er nu op af).
10. **Behangt hij ook met gewoon vliesbehang?** De site zegt op twee plekken van wel, en
    dat rust op een woord uit zijn advertentie van 2018: "Wandafwerking : Glasweefsel-
    behang, Renovlies & Vliesbehang". Precies in die tekst gebruikt hij "vliesbehang"
    ook voor het materiaal dat je overtext - dat is de verwarring die het overleg van
    25-10-2026 rechtzette. De regel is dus herleidbaar en tegelijk de minst zekere van
    de drie. Zegt hij dat hij geen gewoon behangwerk doet, dan gaat vliesbehang als
    dienst van de site (de uitlegkaart op `/werkwijze/` blijft: mensen verwarren het
    woord, dat is de reden dat die kaart er staat).

### Waarom de 100 m2 niet helemaal verdwijnt

De prijzen van 10 en 16 euro per m2 komen uit zijn eigen advertentie, en daar staat
"Prijzen gelden vanaf 100 m2" in dezelfde adem. Een pagina die die prijzen groot
noemt en de voorwaarde nergens, belooft iets wat de bron niet zegt. Daarom is hij
verplaatst in plaats van geschrapt: niet meer op de eerste schermen, wel precies waar
iemand een getal invult of ernaar vraagt. `controleer.mjs` zakt als hij helemaal
verdwijnt. Wil Pascal die ondergrens niet meer hanteren, dan is dat een echte wijziging
in zijn aanbod en gaat `PRIJZEN.vanafM2` eruit.

Sinds ronde 12 staat er ook bij wat er onder die grens gebeurt (30 km rond Coevorden,
doorgegeven via Armando), zodat het geen kale voorwaarde meer is die iedereen met een
kleinere klus wegstuurt.

## Ronde 5 (20-10-2026, feedback Armando)

- **Zwevende balk komt eerder.** Hij hing aan het einde van de hero, en die hero is op
  een telefoon ruim 800 px hoog: de balk kwam dus pas na twee schermen. Nu na een vaste
  310 px scrollen, op beide pagina's. Dat getal is gemeten en niet geschat:
  `meet-mts.mjs` scrollt mts-vloerverwarming in stapjes door en zijn balk verschijnt
  daar tussen 300 en 320 px. `proef.mjs` toetst nu net onder (240 px, mag niet) en net
  boven (400 px, moet) de drempel; de oude test scrollde 2400 px ver en zou dus ook
  slagen als de balk weer pas na twee schermen kwam.
- **De vijf redenen zijn redenen geworden.** Ze beschreven renovlies (dik en stevig,
  veel keus) en zeiden daarmee dezelfde drie dingen als de hero. Nu: scheuren blijven
  weg, een wand zonder naden, geen stucbeurt nodig, nooit meer behangen, afgerekend per
  m2. De hero ging die drie eigenschappen kwijt en gaat nu over zijn aanbod (betalen
  achteraf, duidelijke offerte, kleuradvies), zodat de twee blokken niet langer
  hetzelfde zeggen.
  Drie van de vijf van renovliesdirect zijn bewust **niet** overgenomen: "nieuwbouw
  binnen een werkweek" (opleverbelofte), "A-merk materialen, o.a. Sikkens" (verfmerk)
  en "40% voordeliger dan stucwerk" (cijfer). Dat zijn hun beloftes, hun materialen en
  hun berekening; van Pascal weten we er geen van drieen. De eerste twee staan als
  vraag in de lijst hieronder.
- **De ondergrens van 100 m2 beweert minder.** Er stond "Voor kleiner werk maakt Pascal
  een aparte prijs" en dat was onze aanname: zijn advertentie zegt alleen dat zijn
  prijzen vanaf 100 m2 gelden en dat hij vanaf 100 m2 in heel Nederland plakt, niet wat
  hij onder die grens doet. Op alle drie de plekken (rekenhulp, vraag 5,
  werkwijzepagina) staat nu zijn eigen uitnodiging: "Vraag vrijblijvend naar informatie
  of prijzen." De rekenhulp blijft gewoon doorrekenen onder de 100.

## Ronde 6 (20-10-2026): doorgegeven tekst is een derde soort bron

Armando's antwoord op de voorwerkvraag ("natuurlijk doet hij dat zelf, indien nodig")
is geen van de twee dingen waar het korpus tot nu toe uit bestond: het is niet Pascals
eigen tekst en het is ook geen registergegeven. Het is van horen zeggen, maar van iemand
die hem spreekt - dus wel bruikbaar, en niet op dezelfde voet als zijn advertentie.

Hoe dat nu zit:

- Eigen korpusbestand `bron/zijn-tekst/doorgegeven-armando.txt`, met het kopje boven de
  streep (de bronpoort negeert dat, zie `.gereedschap/bronpoort.mjs`) en alleen het
  doorgegeven zinnetje eronder.
- Eigen bron-constante `ARM` in `inhoud.mjs`, met "doorgegeven via Armando" in de tekst.
- `build.mjs` zet **elke** regel met zo'n bron op `NALEZEN-PASCAL.md`, ook als de
  bronpoort er niets op aan te merken heeft. Die poort kijkt naar woorddekking, en dat
  zegt niets over wie iets gezegd heeft. Zonder deze regel verdween het verschil tussen
  zijn eigen zin en een boodschap over hem.
- Datzelfde `build.mjs` **stopt** als er geen doorgegeven regels meer zijn. Anders blijft
  er een ongebruikte poort staan die niemand meer nakijkt, net als bij de uitzonderingen
  van de ai-poort.

Op de site: het vakmanblok op de startpagina noemt het voorwerk in een regel, en het
eerste uitlegblok op `/werkwijze/` heet nu "Het voorwerk" in plaats van "Welke
wandafwerking past bij uw wand?" - die vraag staat in het blok eronder, waar de keuze
tussen de drie soorten behang toch al werd uitgelegd. `controleer.mjs` zakt als
egaliseren, schuren of voorstrijken van een van de twee pagina's verdwijnt, want dit is
er nu twee keer uitgevallen.

## Ronde 7 (20-10-2026): zijn andere helft stond er wel, maar las niemand

Armando: "iemand die nu op de site kijkt denkt dat hij alleen renovlies doet." Dat klopte,
en het lag niet aan ontbrekende tekst. Binnen- en buitenschilderwerk, sauswerk en
traprenovatie stonden al in de lopende balk, in het vakmanblok, in vraag 9, in de keuzelijst
van het formulier en in de voet - allemaal plekken waar het als bijzin langskomt. Geen
daarvan leest als een aanbod, en de drie plekken waar de pagina wel hardop iets aanbiedt
(hero, de vijf redenen, de rekenhulp) gingen alle drie over renovlies.

Daarom een eigen strook, `#diensten`, met vier diensten bij naam en een link naar hetzelfde
offerteblok. Wat eraan bewust klein is gehouden, want het mag renovlies niet verdringen:

- **Geen volle sectie.** Halve verticale ruimte, kop op h3-formaat, een lijn erboven in
  plaats van een eigen achtergrondkleur, geen foto's en geen eigen offerteblok.
  (Grootte en lijn zijn in ronde 8 herzien - zie hieronder.)
- **Onder de werkfoto's en binnen diezelfde sectie**, niet ertussen. Twee van de zes foto's
  zijn buitenschilderwerk (gevel, voordeur), dus het bewijs staat er al; de strook zet er
  een naam onder. Zet hem hogerop en hij concurreert met de vijf redenen.
  (Die plek bleek onvindbaar; in ronde 8 verhuisd naar boven de kop "Eerder werk".)
- **Niet in de navigatie**, niet in de hero, niet in de titel of de Google-omschrijving.
  Die blijven van renovlies - dat is waar hij aanvragen voor mist.
- De kop is zijn eigen openingszin ("Voor al uw schilderwerk, binnen en buiten", bijna
  woordelijk uit zijn advertentie), dus er hoefde niets voor verzonnen te worden.

Ook aangepast: `knowsAbout` in de structured data noemde alleen wandafwerking, sauswerk en
traprenovatie. Binnen- en buitenschilderwerk staan er nu bij - Google las de site net zo
smal als een bezoeker hem las. `controleer.mjs` zakt als de strook of een van de vier
diensten uit de startpagina verdwijnt.

Tweede punt uit dezelfde ronde: de ondertitel "Foto's van zijn eigen klussen" onder **Werk
van Pascal** is weg (doorgestreept in een schermfoto). Hij zei niets wat de kop en de
bijschriften niet al zeggen.

## Ronde 8 (20-10-2026): een blok dat je moet zoeken doet zijn werk niet

Armando's eerste vraag na ronde 7 was "waar is die smalle strook?" - van de man die erom
gevraagd had. Dat is het antwoord op de ontwerpkeuze: zo klein en zo laag dat hij hem zelf
niet terugvond, en dan vindt een bezoeker die schilderwerk zoekt hem ook niet. Drie dingen
op zijn verzoek veranderd:

- **Boven de kop "Eerder werk"** in plaats van onder de foto's en de duimnagels, maar nog
  steeds binnen de werksectie. Dat is ook inhoudelijk de betere plek: twee van de zes foto's
  eronder zijn buitenschilderwerk, dus de strook kondigt nu aan wat je daar ziet staan in
  plaats van het achteraf te benoemen.
- **De kop een maat groter**: `clamp(25px,3.2vw,38px)` was `clamp(21px,2.4vw,28px)`.
  Bewust nog onder `.sectiekop h2` (29-50px), zodat "Werk van Pascal" eronder de kop van de
  sectie blijft en de strook geen eigen sectie wordt.
- **De lead is nu de formulering die Armando doorgaf**: "Naast renovlies doet Pascal
  schilderwerk, sauswerk en traprenovatie er gewoon bij. Ook daarvoor krijgt u een duidelijke
  offerte." Hij begon met "Deze site gaat over renovlies", en dat is een zin over onze site en
  niet over zijn aanbod. Alles wat de nieuwe lead beweert staat in zijn advertentie (de drie
  diensten, de duidelijke offerte), dus hij blijft `afgeleid` op de advertentie en wordt geen
  `doorgegeven`-regel.

Twee dingen die bij de verhuizing meeverhuisden. De scheidslijn zit nu **onder** de strook
(`border-bottom` op `.rand` in plaats van `border-top`): een lijn erboven zou hier vlak onder
de donkere kleurensectie staan en dan scheidt hij niets. En de plek is een **eis** geworden,
geen smaak - `controleer.mjs` vergelijkt de positie van `id="diensten"` met die van de kop
"Werk van Pascal" en zakt zodra de strook weer naar onderen schuift bij een herschikking.

`shot-strook.mjs` is erbij gekomen: een uitsnede van alleen de strook plus de kop eronder, op
1440 en 390. Een schermfoto van de hele pagina laat de verhouding tussen die twee koppen niet
zien, en dat is precies wat je hier wil beoordelen.

## Ronde 9 (20-10-2026): wat er in de prijs zit, en waar die regel moet stoppen

Armando gaf door wat Pascal zelf zei: "de prijzen zijn inclusief schuren en lichte
reparaties". Dat antwoordt op de vraag die zijn prijs per m2 oproept bij iemand met een
bestaande wand, dus het staat nu op vier plekken: onder de rekenhulp, in het vakmanblok,
als zevende afspraak op `/werkwijze/` ("Inbegrepen"), en als vraag achter de prijsvraag
in de vragenlijst. Tweede regel in `bron/zijn-tekst/doorgegeven-armando.txt`, dus bron
`ARM` en daarmee op de nalooplijst.

Het werk zat in de **grens** van die bewering, niet in het opschrijven. Pascal doet
egaliseren, schuren en voorstrijken zelf (ronde 6), en nu is gezegd dat schuren in de
prijs zit. Dat ligt een halve zin van "het voorwerk zit in de prijs" af, en dat is een
prijsafspraak die niemand gedaan heeft: over egaliseren en voorstrijken is alleen gezegd
dat hij ze doet. Daarom staan er twee controles tegenover elkaar in `controleer.mjs`:

- 13b2 zakt als "schuren en lichte reparaties zitten in de prijs" van een pagina
  verdwijnt - dezelfde reden als 13b, dit is er al twee keer uitgevallen bij inkorten.
- 13b3 zakte als er ergens "egaliseren ... in de prijs" of "voorstrijken ... in de prijs"
  kwam te staan. Getest door de twee beweringen in de gebouwde pagina samen te trekken:
  dan ging hij af.

Dezelfde reden staat ook boven de streep in het bronbestand, want de volgende die die
twee regels naast elkaar ziet staan trekt ze anders alsnog samen.

**Op 25-10-2026 is de helft hiervan ingehaald** (zie ronde 20): Armando gaf door dat de
prijs ook voorstrijken bevat. 13b3 is daarmee vervallen - een poort die de klant
tegenspreekt is geen poort - en 13b2 eist nu de langere zin "schuren, lichte reparaties
en voorstrijken zitten in de prijs", in een stuk, want "voorstrijken" los kan ook in een
zin staan over wat hij doet. Egaliseren blijft buiten de prijs en buiten de site: dat
doet hij helemaal niet (13b1).

## Ronde 10 (20-10-2026): vier dingen in schermfoto's aangestreept

Armando stuurde drie schermfoto's met strepen erdoor en een voorbeeld ernaast.

1. **De topbalk is weg.** Het smalle donkere strookje boven het logo
   ("Renovlies, vliesbehang en glasweefselbehang" links, "Geen betalingen vooruit" plus
   zijn nummer rechts) was doorgestreept. Beide regels stonden al elders: de eerste in de
   voet en de paginatitel, de tweede in de blauwe lopende balk direct eronder, en het
   nummer in de hero, de menulade, de zwevende knoppen en de voet. Er ging dus geen
   informatie verloren, alleen een derde donkere strook boven een donkere paginakop.
   `balk` is uit `inhoud.mjs` weg; controle 13e in `controleer.mjs` zakt als hij terugkomt.
2. **De zwevende knoppen zijn die van winterswijkvakantiehuis.nl**, in zijn blauw in
   plaats van hun oranje. Nagemeten met `meet-winterswijk.mjs` in plaats van nagebouwd op
   het oog: twee gelijke pillen van 48 px hoog, 16 px van de randen, 12 px ertussen, label
   naast het icoon, geen donkere balk eromheen. Onze versie meet nu precies hetzelfde
   (x 16, breedte 358, hoogte 48 op een scherm van 390).
   Dit haalde de offerteknop uit de zwevende balk: hun opzet heeft er twee en bellen en
   appen zijn de twee die direct iets doen. De offerteknop staat nog in de menulade en
   op de pagina zelf. `body` kreeg 86 px onderruimte in plaats van 72.
   Controle 13d zakt als een van de twee knoppen of zijn label wegvalt, en ook als de
   ronde icoontjes zonder woord terugkomen.
3. **Prijs en afspraken staat op een lichte band.** Het stond op de donkere en dat vond
   Armando te donker; met de donkere paginakop erboven en het blauwe slot eronder waren
   dat drie zware vlakken op een pagina van vijf blokken. De zeven afspraken zijn nu
   witte kaarten met grijze hairlines, en de laatste loopt over de volle breedte - zeven
   passen niet in drie kolommen en anders blijft er een leeg vak staan. Controle 13f.
4. **De foto in de kop van `/werkwijze/`** is de trapfoto niet meer. De rolsteigerfoto
   past daar thematisch het beste (een klus in uitvoering), maar die staat op diezelfde
   pagina al bij het voorwerk, en twee keer dezelfde foto op een pagina leest als een
   foutje. Het is daarom de foto met de witgelakte taatsdeuren geworden, en de donkere
   sluier eroverheen is iets lichter (dekking .5 naar .62, verloop rechts .5 naar .34),
   want die maakte van elke foto een vlek.
   *(Achterhaald in ronde 12: het is alsnog de rolsteiger geworden, met een eigen
   uitsnede, en bij het voorwerk staat nu de nieuwbouwhal.)*
   **Dit blijft het zwakste punt van de site:** alle foto's zijn via WhatsApp
   binnengekomen en daarmee teruggeschaald. Originelen lossen meer op dan een andere
   uitsnede.

De naregel onder het citaat ("Deze pagina staat in dezelfde volgorde als de klus") is
ook doorgestreept en weg. Dat was een zin over onze pagina-indeling en niet over zijn
werk.

## Ronde 11 (20-10-2026): de smalle kopletter staat niet meer klein in kapitalen

Armando stuurde de vijf redenen van de referentiesite naast die van ons, en een
schermfoto van de kleurkaarten. Twee dingen tegelijk, en het tweede is een regel voor
de hele site.

### 1. De regel: kapitalen alleen op displaymaat

Barlow Condensed is een smalle letter. In kapitalen zijn alle tekens even hoog en even
smal, en dan mist een lezer precies waar hij woorden aan herkent: de stok van de d, de
staart van de g. Groot kan dat (dat is het effect dat je wil in een kop), klein is het
gewoon slechter leesbaar. "WARM TAUPE" op 19 px was het voorbeeld; de kopjes van de
vijf redenen hadden hetzelfde. De referentiesite doet het net zo: grote koppen in
kapitaal, kaartkopjes in de gewone letter.

Dus: **de smalle kopletter staat alleen in kapitalen boven 25 px.** Daaronder de
bodyletter, met gewone kapitalisatie. Concreet veranderd:

| was | nu |
| --- | --- |
| `h1,h2,h3` allemaal condensed + uppercase | `h1,h2` condensed + uppercase, `h3` bodyletter, gewone kapitalisatie |
| `.punten h3` 19 px condensed caps | 16 px bodyletter |
| `.rijen h3` 17-20 px condensed caps | 16-18 px bodyletter |
| `.afspraak h3` 19 px, `footer h3` 17 px, `.zijpaneel h3` 24 px | 16,5 / 15 / 20 px bodyletter |
| `.kleurkaart b` 19 px condensed caps | 16 px bodyletter |
| `.kleurkaart small` + `.kleurvoet` + `.res-meta` in kapitalen | gewone kapitalisatie, een maat groter |
| `.kaart h2` vanaf 23 px | vanaf 25 px (onder de grens) |

De maten zijn omlaag gegaan omdat de bodyletter bij dezelfde px breder en optisch
groter is dan de condensed.

Wat **wel** in kapitalen blijft: het kopje-boven-de-kop (`.boven`, 12 px bodyletter met
letterspatiëring), de lopende balk, de kruimels en de kleine labels. Dat is de
bodyletter, die heeft het probleem niet, en de referentiesite doet daar hetzelfde.

Dit is een meting en geen afspraak: `meet.mjs` leest per element de **gerenderde**
`font-family`, `font-size` en `text-transform` en zakt op elke condensed tekst onder
25 px die in kapitalen staat (ook als de kapitalen in de tekst zelf zitten in plaats
van in `text-transform`). Getest door `h3` expres terug te zetten: 30+ treffers op
beide pagina's. De check vond meteen een geval dat ik met het oog gemist had,
`.kaart h2` op 23 px op een telefoon.

### 2. De vijf redenen: hun vorm, niet hun tekst

"Ik vind het bij die andere website beter. Kunnen we niet letterlijk hetzelfde
schrijven? Of heeft het geen impact op SEO?"

Wat er bij hen beter is, is de **maat**: kop van twee of drie woorden, eronder een
regel van hooguit zes a zeven woorden. Onze koppen waren even lang maar de regels
eronder waren volzinnen van 10 tot 13 woorden. Dat is overgenomen.

Letterlijk overnemen is geen goed idee, om twee redenen. Hun copy op onze pagina is
tekst die al ergens anders staat, en wel precies op de site waar we in Google tegen
moeten opboksen - dat voegt niets eigens toe en kan de pagina alleen maar zwakker
maken. En het is hun werk; copy is auteursrecht.

| nu | bron in zijn advertentie |
| --- | --- |
| Naadloos & scheurvrij - Geen naden, en krimpscheurtjes blijven onzichtbaar. | "kan naadloos worden geplakt" + "scheur overbruggend zodat kleine scheurtjes ... niet meer zichtbaar zijn" |
| Dik en stevig - Renovlies is een vrij dikke, stevige behangsoort. | "omdat deze vrij dik en stevig is" |
| Geen stucbeurt nodig - Op een behangklare wand kan het vlies er zo op. | "wanden behangklaar zijn opgeleverd" |
| Relatief goedkoop - Een gevliesde wand kan altijd weer overgetext worden. | "Relatief goedkoop want ... kunnen ten alle tijden overgetext worden" - zijn eigen woorden, inclusief de reden |
| Afgerekend per m2 - Plakken vanaf 10 euro per m2, texen vanaf 16, materiaal erbij. | zijn prijzen |

Drie van hun vijf staan hier nog steeds niet, en dat is dezelfde grens als in ronde 5:
ze gaan over het **bedrijf** en niet over renovlies, en Pascal zegt ze nergens over
zichzelf. "Nieuwbouw binnen een werkweek" is een opleverbelofte, "A-merk materialen,
o.a. Sikkens" is een verfmerk en "40% voordeliger dan stucwerk" is een cijfer. Zegt
Pascal ze wel, dan zijn het meteen de drie sterkste punten van de pagina - zie de
vragenlijst hieronder.

De ai-poort-uitzondering is meeverhuisd: "naadloos" stond als uitzondering op `usp.b_b`
(de uitleggende zin) en staat nu op `usp.a_t` (de kop). De poort gooit als een
uitzondering niets meer raakt, dus dat moest mee.

## Ronde 12 (20-10-2026): bellen en appen op elke maat, en het gat onder de 100 m2

### 1. De zwevende knoppen staan er nu ook op een laptop

Ze stonden alleen onder 720 px. Armando: "whatsapp / bel moet ook op desktop zijn zoals
bij winterswijk." Nagemeten in plaats van nagebouwd, met `meet-winterswijk-desk.mjs`:
winterswijk zet ze op beide maten neer en wisselt alleen van **vorm**.

| | telefoon | laptop |
| --- | --- | --- |
| richting | naast elkaar | onder elkaar |
| breedte | volle breedte, 16 px van de randen | zo breed als het label (winterswijk 148, hier 150) |
| hoek | onderaan | rechtsonder, 24 px van beide randen |
| hoogte | 48 px | 48 px |

Dat betekende de css omdraaien: de **basisregels** zijn nu de laptopvorm (kolom
rechtsonder) en de media-query onder 720 px maakt er de rij van. De verschuiving waarmee
hij wegvalt is op een laptop horizontaal (hij glijdt de rechterrand uit) en op een
telefoon verticaal; een kolom die van onderen opkomt duikt daar achter de schermrand.
De extra `padding-bottom` op `body` blijft alleen op de telefoon staan - in de hoek van
een laptop dekken ze niets af.

Dit is nu een **proef** en geen schermfoto: `proef.mjs` opent 1440 en 1024, scrollt
voorbij de drempel en toetst richting, hoek, hoogte en dat de knoppen niet de volle
breedte beslaan. Dat laatste is de echte val - een telefoonbalk die over de volle
breedte van een laptop ligt "staat er" ook. Getest door `right` op 16 px te zetten:
beide maten gaan af. Een breedtemeting zou hier niets van zien, want `display:none`
loopt nergens buiten het scherm.

### 2. Onder de 100 m2: 30 kilometer rond Coevorden

De ondergrens stond er drie rondes als een kale voorwaarde. Zijn advertentie zegt alleen
dat zijn prijzen vanaf 100 m2 gelden en dat hij vanaf 100 m2 door heel Nederland rijdt,
en laat open wat daaronder gebeurt (zie ronde 5: dat gat zelf invullen was precies de
fout die er toen uit moest). Armando gaf het antwoord door: **onder de 100 m2 werkt
Pascal binnen 30 kilometer van zijn woonplaats.**

Dat staat nu op drie plekken: in de rekenhulp zodra iemand minder dan 100 invult, in
vraag 6 ("Komt Pascal ook buiten Drenthe?") en bij Werkgebied op /werkwijze/. Derde
regel in `bron/zijn-tekst/doorgegeven-armando.txt`, dus hij draagt "doorgegeven via
Armando" op de nalooplijst.

Twee dingen zijn bewust begrensd:

- Het gaat over het **werkgebied**, niet over de prijs. Wat kleiner werk kost is niet
  doorgegeven en staat er dus niet. `controleer.mjs` gaat af zodra er een bedrag of
  tarief aan die 30 km gehangen wordt - zelfde constructie als bij "egaliseren in de
  prijs" in ronde 9.
- Regels die half uit zijn advertentie en half uit Armando's doorgeving komen dragen nu
  **allebei** de bronnen (`MP_ARM`). Anders staat een doorgegeven zin op de nalooplijst
  achter een label dat naar zijn eigen tekst wijst.

### 3. De kop van /werkwijze/ heeft een eigen uitsnede

Armando over de vorige kopfoto: "gewoon doen! huidige foto is niet zo best." De keuze
die hier thematisch hoort is de rolsteiger - een klus in uitvoering boven een pagina
over de werkwijze - en die stond bij het voorwerk op diezelfde pagina. Hij is verhuisd;
bij het voorwerk staat nu de nieuwbouwhal, en die laat zien waar het voorwerk op
uitkomt: een vlakke, behangklare wand.

Er zat wel iets in die foto. Bovenin staat het **rode werkbordes met het merk van de
steigerverhuur** er fel op, en in de kop werd dat het eerste dat je ziet: een
reclamebalk van een ander bedrijf boven zijn pagina. Een `object-position` lost dat op
een laptop op en op een telefoon niet - daar is de kop hoger dan de foto breed, dus
snijdt `cover` alleen links en rechts weg en blijft de hele hoogte staan. Een
`transform: scale()` erbij maakte het erger (schalen om een onderrand haalt juist het
bordes naar binnen) en vergroot een foto die al teruggeschaald is.

Dus opgelost bij de bron: `werkwijze-kop` in `fotos.py` is een eigen 16:9-uitsnede uit
de **onderkant** van dezelfde foto. Geen merk in beeld, en wat je ziet is precies het
onderwerp: een steiger tegen een kale wand die klaar is om geplakt te worden.

## Ronde 13 (20-10-2026): elke pagina sluit af met het offerteblok

### 1. Het offerteblok staat nu op beide pagina's

Armando stuurde een schermfoto van het offerteblok op de startpagina: *"hiermee eindig
je en dan ga je naar de footer, ik zou graag elke pagina zo afsluiten"*. Op
`/werkwijze/` stond daar alleen de blauwe slotband met een knop die je naar de
startpagina stuurde: iemand die via Google op die pagina binnenkomt, de hele werkwijze
leest en overtuigd is, moest eerst naar een andere pagina voordat hij iets kon invullen.

In de code is dat `offerteBlok()` naast `voetBlok()` geworden, met `JS_OFFERTE` ernaast.
Die twee horen bij elkaar: het formulier is html **plus** het script dat de
WhatsApp-link vult. Staat alleen het eerste op een pagina, dan verstuurt de knop een
leeg bericht, en van buiten ziet dat er precies hetzelfde uit. Daarom toetst
`proef.mjs` het ook echt door: naam, plaats en m2 invullen op `/werkwijze/` en kijken
of ze in de `href` van de WhatsApp-knop terechtkomen. Getest door het script weg te
halen - dan zakt hij.

Gevolg voor de ankers: `#offerte` is nu op elke pagina een anker **op die pagina zelf**,
dus zonder `/` ervoor. Dat geldt voor de knop in de kop, de contactregel in het
telefoonmenu en de knop in de slotband. De andere ankers (`/#prijzen`, `/#vragen`)
blijven naar de startpagina wijzen, want die blokken staan daar alleen.

`controleer.mjs` zakt nu als een pagina het blok mist, als het formulier er zonder zijn
script staat, of als er nog een blok **na** het offerteblok komt - dan is het geen
afsluiting meer.

### 2. De kopregel boven de h1 is weg

"Renovlies en glasweefsel" stond doorgestreept op zijn schermfoto. Er ging niets
verloren: diezelfde woorden staan in de paginatitel, de lopende balk en de voet, en de
kop eronder zegt hetzelfde. Ook dit zit in `controleer.mjs`, net als de topbalk uit
ronde 10.

### 3. Ankers landen niet meer achter de kop

Bij het nameten viel op dat de kop van het offerteblok half achter de plakkende
koptekstbalk viel na een sprong. Dat gold voor elk anker op de site en is er altijd al
geweest, maar sinds het offerteblok op beide pagina's staat wordt er veel vaker binnen
dezelfde pagina gesprongen. Opgelost met `scroll-margin-top` op elk element met een
`id`: 72 px op een telefoon, 88 op een laptop (de balk zelf meet 67 en 81).

## Ronde 14 (20-10-2026): de kop van /werkwijze/ krijgt de olijfgroene foto

Vierde foto op die plek, en nu de keuze van Armando zelf: *"alsnog niet goed claude,
doe anders gewoon weer de olijfgroene foto."* Daarvoor stonden er de trapfoto (te
donker, bleef een bruine vlek), de taatsdeuren, en de eigen onderuitsnede van de
rolsteiger uit ronde 12. Drie keer afgekeurd is geen pech: de woonkeuken is de enige
foto in de set die bij 1600 px nog scherp is **en** een groot, egaal wandvlak laat
zien, en dat is precies wat een kop nodig heeft - tekst eroverheen vraagt rust in het
beeld, niet een onderwerp.

Twee dingen die daarmee vervallen:

- **De eigen uitsnede `werkwijze-kop` is uit `fotos.py`.** De kop gebruikt nu hetzelfde
  bestand als de hero van de startpagina (zelfde 16:9, zelfde focus), dus er is geen
  tweede set webp's meer en een bezoeker die van de startpagina doorklikt downloadt
  niets nieuws. De hele redenering uit ronde 12 over het rode werkbordes van de
  steigerverhuur is daarmee niet meer van toepassing op de kop - maar hij blijft hier
  staan, want die foto staat nog wel op de pagina.
- **De rolsteiger is terug bij het voorwerk**, waar hij vandaan kwam. Hij was daar in
  ronde 12 weggehaald omdat dezelfde foto niet twee keer op een pagina moet staan; nu
  de kop hem niet meer gebruikt, vervalt die reden. Een klus in uitvoering tegen een
  kale wand is een betere illustratie bij "eerst de wand, dan het vlies" dan de
  nieuwbouwhal die er tijdelijk stond.

Dezelfde foto op twee pagina's is bewust: op **een** pagina leest dat als een foutje,
over twee pagina's leest het als een herkenbare kop. `na-live.mjs` toetst nu beide
kanten van de wissel (olijfgroen in de kop, rolsteiger bij het voorwerk, en nergens nog
een verwijzing naar `werkwijze-kop`), want dit paar is inmiddels twee keer omgedraaid.

## Wat hier bewust NIET staat

- **Geen beoordelingscijfer.** Pascal heeft 5,0 uit 32 reviews op Marktplaats, maar die
  gaan over tuinstoelen, servies en een magnetron, en bij de meeste staat "betaalt
  snel" (hij was de koper). Als bewijs voor zijn schilderwerk is dat onjuist, dus het
  staat er niet. De referentiesite heeft daar wel een blok voor; bij ons staat op die
  plek zijn eigen betaalafspraak. Echte renovlies-reviews zijn het eerste wat deze
  pagina sterker maakt.
- **Geen oprichtingsjaar.** Drimble noemt 01-01-2007, maar dat staat niet op het
  uittreksel dat wij hebben, dus het is niet nagerekend.
- **Geen team.** Hij is een eenmanszaak, dus er staat nergens "onze vakmensen".
- **Geen garantietermijn.** Zijn Marktplaats-kenmerken noemen "Garantie" zonder
  voorwaarden; zonder termijn is dat geen belofte om op te schrijven.

## Ronde 15 (20-10-2026): een dienst eruit, een derde tarief erbij, en een merk

Vier dingen van Armando tegelijk, en ze hangen aan elkaar: ze komen alle vier van
Pascal zelf en ze maken alle vier iets ongedaan dat uit zijn advertentie van 2018 kwam.

### 1. Traprenovatie is van de site af

Hij doet het niet meer. Het stond op zeven plekken: de lopende balk, het vakmanblok,
de dienstenstrook, vraag 9, de voet, de omschrijving en de `knowsAbout` in de
structured data. Allemaal weg.

De val hier is de bron, niet de tekst. Traprenovatie staat nog gewoon in zijn
Marktplaats-advertentie, met twee foto's erbij en als trefwoord onderaan - dus de
volgende die uit het korpus werkt zet hem er zo weer in, en die heeft dan zelfs gelijk
volgens zijn eigen bronregel. Daarom twee dingen:

- `controleer.mjs` zakt op het woord `traprenovatie`, op beide pagina's, html en
  structured data inbegrepen.
- De kop van `marktplaats-advertentie.txt` (boven de `---`, dus buiten het korpus)
  zegt nu welke stukken van die advertentie verouderd zijn.

Dat is de les die breder geldt: **een korpus veroudert, en het oudste bestand is
meestal het volledigste.** Een bron is niet waar omdat hij van de klant is, hij is
waar op de datum waarop hij geschreven is.

De dienstenstrook heeft daardoor drie regels in plaats van vier, en staat op een
kolom in plaats van twee (3 in een raster van 2 leest als een vergeten vierde). Er
is geen vierde dienst, en er een verzinnen om het blok te vullen is precies wat hier
niet mag.

### 2. De 16 euro is een keer texen, en er is een derde tarief van 23

Zijn advertentie zegt "wilt u het echter ook getext hebben, dan kan ik u een
totaalprijs aanbieden vanaf EUR 16,00" en zegt niet hoe vaak er getext wordt. Die 23
euro staat er helemaal niet in. Beide zijn doorgegeven via Armando en staan dus in
`doorgegeven-armando.txt`, niet bij zijn advertentie.

Op de pagina: de rekenhulp heeft drie pakketten in plaats van twee, het telefoonmenu
klapt uit naar drie, de keuzelijst in het offerteformulier noemt dezelfde drie in
dezelfde woorden (anders kiest iemand daar iets anders dan hij net uitrekende), en
`/werkwijze/` heeft een achtste afspraak direct achter de zevende.

Het getal `1x` en `2x` staat **in het label zelf** en niet in een voetnoot: twee
bedragen naast elkaar zonder dat verschil lezen als een fout. `controleer.mjs` zakt
als een van beide labels wegvalt, en `proef.mjs` rekent het derde tarief echt na
(200 m2 maal 23 is 4.600) - de rekenhulp leest het tarief uit de `value` van het
keuzerondje, dus een verkeerd bedrag daar is stil fout.

### 3. Sikkens, met de goede namen

Dit was vraag 3 en 8 in de lijst hierboven, en het is de USP die de referentiesite wel
had en wij niet ("A-merk materialen o.a. Sikkens"). Nu claimt hij hem zelf, met de
producten erbij, en dat is sterker dan het merk alleen.

Armando schreef ze fonetisch door en vroeg of het klopte. Drie correcties, nagekeken
op sikkens.nl:

| doorgegeven | klopt |
| --- | --- |
| Sikkens Anti Marx | **Alpha Rezisto Anti Marks** |
| Sikkens Resisto Easy Clean | **Alpha Rezisto Easy Clean** (met een z) |
| Sikkens puur mat | **Alphacryl Pure Mat SF** |

Een verkeerd gespeld product is dezelfde fout als een verkeerd telefoonnummer: dit is
precies het soort regel waar een schilder zijn eigen materiaal naleest.

**Coating of muurverf: het woord van de klant wint.** Sikkens zet alle drie onder
"binnenmuurverf", dus zei de site eerst muurverf - met precies het argument hierboven,
dat een vakman het etiket kent. Armando kwam er diezelfde dag op terug: Pascal zelf
zegt coating. Dat is nu het woord op de pagina, en de les is dat de twee argumenten
niet even zwaar wegen. Een fabrikantblad bepaalt hoe een product **heet**, de man die
het aanbrengt bepaalt hoe het **genoemd** wordt in een zin die namens hem spreekt. Hier
botsten ze niet eens echt: een muurverf *is* een coating, dus er wordt niets beweerd
wat niet waar is.

Wat er niet uit volgt, en wat `controleer.mjs` daarom tegenhoudt: een coating als los
laagje over de verf heen, of als aparte behandeling met een eigen bedrag. Het is
dezelfde emmer. De controle loopt in twee richtingen (zakt op `muurverf`, zakt als
`coating` van de startpagina verdwijnt), want dit woord is nu twee keer omgedraaid.

Ook bijgesteld: Anti Marks is volgens de fabrikant bestand tegen **strepen, vegen en
stoten** (schoenen, koffers, tassen) plus schrobklasse 1. "Krasvast" claimt Sikkens
nergens, dus dat staat er niet. De ketchup uit het doorgegeven bericht is wel precies
waar Easy Clean over gaat (vlekafstotend, vet en vuil trekken niet in de verf), maar
op de pagina staat de formulering van de fabrikant.

**Twee bronnen die niet door elkaar mogen lopen.** Dat Pascal met dit merk werkt is
doorgegeven via Armando; wat de verf doet is van AkzoNobel. Daarom staat
`bron/sikkens-producten.txt` **buiten** `bron/zijn-tekst/`: een fabrikantclaim mag geen
woord verantwoorden in een zin die namens Pascal spreekt. De eigenschappen dragen merk
`feit` met dat bestand als bron, dat hij ermee werkt draagt `afgeleid` op Armando, en
ze komen als twee aparte regels op `NALEZEN-PASCAL.md`.

De productnamen zelf staan in `VERF` in `inhoud.mjs`, naast `PRIJZEN` en `BEDRIJF`, en
gaan via `NAP_MERKEN` door dezelfde poort als het KVK-nummer. `controleer.mjs` zakt op
`Anti Marx`, op `Resisto` zonder z, op `krasvast` en op `muurverf`.

### 4. Waar het verfblok staat, en waarom daar

Een eigen lichte sectie (`#verf`) tussen de donkere kleurensectie en de witte
werksectie. Drie kaarten, de merknaam op elke kaart, en schrobklasse 1 als een regel
eronder in plaats van drie keer als etiket - zo is het een eigenschap van zijn werk en
geen productsticker.

Niet in de hero en niet bij de vijf redenen: die vijf gaan over renovlies als materiaal
en dit gaat over wat Pascal erop zet. Wel in de lopende balk ("Getext met Sikkens"), op
de plek die traprenovatie leeg achterliet.

## Ronde 16 (20-10-2026): een veld onder 16px en een balk op de knoppen

Twee klachten uit dezelfde twee schermfoto's, en ze hebben dezelfde bron: stap 02 van
de rekenhulp gaf zichzelf focus op het m2-veld.

### 1. "Zie witte rechts daar" - Safari zoomt bij een veld onder 16px

De gedeelde regel voor `input/select/textarea` stond op `font-size:15px`, en
`.teller input` (17px) verloor het van `input[type=number]` verderop: even specifiek,
later in de stylesheet. Het m2-veld stond dus op 15px.

Safari op iOS zoomt de **hele pagina** in zodra een veld onder 16px focus krijgt, en die
zoom blijft daarna staan. De pagina is dan opzij te slepen en rechts naast de secties
staat het witte paginavlak - dat is de witte strook op de schermfoto. Het is geen
overloop: `meet.mjs` mat 360 van 360 en dat klopte ook.

Opgelost: de gedeelde regel staat op 16px, en `.teller input[type=number]` (specifieker)
houdt zijn 17px. `meet.mjs` zakt nu op elk veld onder 16px, op beide pagina's. Chromium
zoomt niet, dus met het oog of met een breedtemeting vind je dit nooit - alleen door de
maat zelf te meten.

### 2. De bel- en appknoppen stonden op Terug / Toon richtprijs

Op een scherm van 844 px kan dat niet gebeuren: de stapknoppen staan daar ruim boven de
balk. Met het toetsenbord open wel - dat verkleint het zichtbare deel van het scherm en
een `position:fixed` balk kruipt op iOS mee omhoog, precies over de knoppen. En dat
toetsenbord kwam vanzelf, want stap 02 zette zelf focus.

Drie dingen:

- **Stap 02 zet alleen nog focus met een muis** (`(hover:hover) and (pointer:fine)`). Op
  een telefoon hoort het toetsenbord niet ongevraagd omhoog te komen; daar staan de min-
  en plusknoppen juist voor.
- **De balk gaat weg zolang er in een veld getypt wordt** (`focusin`/`focusout`).
- **En zodra hij een knoppenrij raakt.** Die rijen dragen `.vrijhouden`: de drie
  `.paneel-knoppen` van de rekenhulp en de twee knoppen onder het formulier. De balk
  meet bij elke scroll of hij er een raakt (14 px speling) en verdwijnt dan.

Let op bij het wegzetten: dat gebeurt met `opacity`/`visibility` en **niet** met de
`transform` die de balk ook gebruikt om op te komen. Verschuift hij, dan meet de
botsingstest een verschoven balk, ziet geen botsing meer, zet hem terug, en knippert hij
aan en uit.

`proef.mjs` toetst alle drie, plus dat hij daarna gewoon terugkomt - een balk die
wegblijft is net zo stuk. De botsing wordt gemeten op een scherm van 430 px hoog, want
zo kort maakt het toetsenbord het. Alle drie de controles zijn getest door het expres
stuk te maken.

## Ronde 17 (25-10-2026, notulen overleg met de klant)

De grootste ronde tot nu toe, en de eerste waarin de klant zelf de **begrippen**
rechtzette. Dat raakte de hele site, want de site haalde renovliesbehang,
glasweefselbehang en vliesbehang door elkaar.

De bron van die fout is leerzaam genoeg om op te schrijven: **zijn eigen advertentie
doet het ook.** Die van 2018 zet de drie in een adem ("deze soorten behang zijn er in
verschillende printen & designs en is in alle kleuren over te texen") en gebruikt
"vliesbehang" voor het materiaal dat je overtext. Wie uit dat korpus werkt krijgt de
verwarring er dus gratis bij, en **geen poort ziet het**: elke zin die er stond klopte
tegen de bron. De bronpoort controleert of een bewering te herleiden is, niet of het
begrip erachter deugt.

Daarom staat er een nieuw bronbestand, `bron/zijn-tekst/overleg-pascal-25-10-2026.txt`,
met een eigen merk (`OVL`) dat **voorgaat** op zijn advertentie en op de doorgegeven
regels van 20-10-2026. De kop van dat bestand noemt vijf dingen die elders in het
korpus nu achterhaald zijn.

### 1. De drie soorten, en een blok dat ze uit elkaar houdt

| | op de wand | overtexen | patroon | scheuroverbruggend |
| --- | --- | --- | --- | --- |
| renovliesbehang | ja | ja | nee | ja, 215 gram |
| glasweefselbehang | ja | ja | **ja, blijft zichtbaar** | ja |
| vliesbehang | ja | **nee** | ja | **nee** |

Nieuw blok `#soorten` bovenaan `/werkwijze/`, drie kaarten plus de reden waarom de
eerste twee goedkoper uitvallen dan stucen of schilderen (geen herstelwerk vooraf).
Vliesbehang krijgt de gedempte kaart: het hoort in het blok omdat het verward wordt,
niet omdat het hier een optie is. Een gelijke kaart zou het als derde optie neerzetten.

Rechtgezet op de rest van de site: `vragen.a1` noemde renovlies "een vliesbehang",
`a3` zei dat vliesbehang overgetext kan worden, `a4` zei alleen dat Pascal met alle
soorten werkt, `vakman.b2` zei dat hij alle drie "plakt en text", en `werkwijze.s5_b`
zette vliesbehang in de texen-opsomming.

Controle 15a in `controleer.mjs` gaat af op elke zin die vliesbehang met texen of
scheuroverbrugging combineert. Twee dingen die daarbij geleerd zijn:

- **Een tekstcontrole op platgeslagen html heeft geen zinsgrenzen meer.** De eerste
  versie ging drie keer af op zinnen die niet bestaan: een vlag ("Niet om over te
  texen") die tegen een kop ("Vliesbehang") aanlag, en een meta-omschrijving die tegen
  een telefoonnummer uit de json-ld aanlag. Vandaar `zinnen()`: eerst de blokgrenzen
  als punt terugzetten, dan pas knippen.
- **Een ontkenning moet door de poort heen mogen.** "Er wordt niet over getext" is
  juist de goede zin. Zonder die uitzondering is de enige manier om de poort te passeren
  het onderwerp helemaal niet aanroeren.

### 2. Een coating, niet twee

Op 20-10-2026 is doorgegeven dat Anti Marks en Easy Clean samen aangebracht kunnen
worden binnen het tarief van 23 euro. Dat is onjuist: **er wordt er een gekozen.**
Dat stond op vier plekken (het verfblok, vraag 12, `werkwijze.b3_a` en `a8_b`); Armando
noemde de laatste twee bij naam. Onder de drie kaarten staat nu "U kiest een van deze
drie, niet twee", want drie kaarten naast elkaar lezen zonder die regel als een lijst
die je kunt stapelen.

Een fout die op vier plekken stond komt op een vijfde terug, dus controle 16 gaat af op
drie formuleringen van "samen aangebracht" en eist de keus-regel op de startpagina.

### 3. Anti Marks: de fabrikant was hier de verkeerde bron

De claim stond er woordelijk van AkzoNobel: bestand tegen strepen, vegen en stoten van
"schoenen, koffers en tassen". Pascal zegt dat **een koffer wel schade geeft.** Hij
brengt het aan en ziet de wand terug, dus zijn ervaring gaat voor de folder. Koffers,
tassen en "stoten" zijn van de pagina; wat blijft is strepen en vegen.

Dit is de scherpste les van deze ronde: **het getal en de woorden stonden in de bron,
alleen was de bron de verkeerde.** Daar helpt geen poort tegen die vraagt of een
bewering te herleiden is. Controle 16b gaat af op "koffer" en "tassen".

Andersom erbij: Easy Clean is **ketchupbestendig, dus ideaal voor de keuken** - Pascals
eigen voorbeeld, en sterker dan "vlekafstotend", omdat het de ruimte noemt waar iemand
het probleem heeft.

### 4. Egaliseren doet hij niet

Het stond er sinds 20-10-2026 juist ín, op de doorgegeven mededeling dat hij het wel
deed. Nu eruit, op beide pagina's. Schuren en voorstrijken blijven: die zijn niet
weersproken. In het oude commentaar bij controle 13b stond letterlijk "hoort Pascal
straks zelf te zeggen dat hij het NIET doet, dan gaat deze controle eruit, niet de tekst
stil" - en dat is precies wat er gebeurd is. Egaliseren staat nu in de tegenhanger
(13b1): het mag nergens meer voorkomen, want het staat nog wel in
`doorgegeven-armando.txt` en wie daaruit werkt zet het zo weer terug. Zelfde val als
traprenovatie.

### 5. De prijzen: 11 en 17,50

En daarmee **het eerste bedrag dat geen heel getal is.** Dat kostte drie reparaties die
alle drie buiten het zicht van de bestaande poorten lagen:

- De centen stonden als `,00` hardgecodeerd achter elke `${PRIJZEN.x}` in de opmaak.
  Met 17,5 geeft dat `17.5,00`. Nu via `eur()` / `eurTekst()` in `build.mjs`.
- Hetzelfde in de browser: `p.tarief.toLocaleString('nl-NL')+',00'` gaf **"€ 17,5,00"**.
  Dat is nu `geld()`, dat zelf op twee decimalen afrondt. Getest door de oude regel
  terug te zetten: `proef.mjs` gaat er dan op af.
- De bronpoort kreeg `String(17.5)` = `"17.5"` binnen en las daar een getal 5 in dat
  nergens in zijn korpus staat. Een prijs gaat nu als Nederlands bedrag door de poort,
  want dat is ook wat op de pagina komt.

En twee controles die per ongeluk goed werkten en dus fout waren: de build zette het
bedrag rechtstreeks in een RegExp (`\b17.5\b`, waarin de punt elk teken matcht, dus ook
de komma), en `controleer.mjs` zocht naar `${bedrag},00` en was daarmee blind voor elk
bedrag met centen. `proef.mjs` hield zijn eigen cijfers bij ("200 m2 maal 16 euro geeft
3.200") en zakte daardoor op een uitkomst die juist goed was - **een controle die zijn
eigen getallen bijhoudt is de verkeerde kant op streng: hij houdt de oude prijs in
stand.** De tarieven komen daar nu uit `PRIJZEN`, en er staat een geval bij met een
oneven aantal m2 (101 x 17,50 = 1.767,50), want 200 x 17,5 is rond en verstopt het
probleem.

Controle 17 gaat af op de oude tarieven van 10 en 16 euro, op beide pagina's.
Let op de val die daar nog in zat: de entiteiten moeten er eerst uit. Op de startpagina
staat het bedrag als `&euro;&nbsp;11,00`, en een patroon met `\s*` tussen teken en getal
loopt daar langs - `&nbsp;` is geen witruimte zolang het een entiteit is. De regel ging
daardoor wel af op `/werkwijze/` en niet op de startpagina, en dat is net de helft waar
het tarief echt uit `PRIJZEN` komt.

### 6. Het grijze vak bij "Wat het kost"

Geen kleurfout. De lijnen tussen die kaarten zijn **de achtergrond van het raster die
door een gat van 1 px schijnt**, en acht kaarten in drie kolommen lieten twee cellen
leeg (3 + 3 + 1 + een volle regel voor de laatste). Een lege cel heeft geen witte kaart
in zich, dus daar stond de achtergrond op volle grootte: precies een grijs vak, dat
meeschoof met elke afspraak die erbij kwam.

Twee oplossingen voor een fout, en dat is bewust. De achtergrond van het raster is wit
en de lijnen komen nu van de kaarten zelf (een ring van 1 px die in het gat met de ring
van de buur samenvalt en langs de buitenrand wordt weggeknipt) - dat is de **bodem**,
die ook houdt als het er negen worden. En de laatste twee kaarten delen de slotregel in
plaats van een volle regel voor een kaart - dat is de **nette indeling** voor acht.

`meet.mjs` rekent nu per rasterregel na of hij van links naar rechts gevuld is, voor
`.afspraken`, `.soorten` en `.verfkaarten`. Getest door het oude raster terug te zetten:
hij gaat dan af op 1280 en 1440 met "laat 775px leeg". Op 1024 niet, want daar is het
raster twee kolommen en vullen acht kaarten vier volle regels - wat meteen verklaart
waarom dit een desktopmelding was.

Dit is het soort fout dat langs **elke** bestaande meting heen liep: niets stak buiten
het scherm, geen tekst was te klein, niets stond scheef. Vergelijk de `lijffull`-regel
over lucht meten in plaats van randen.

## Zoekwoorden (gemeten 25-10-2026)

"De werkwijze pagina moet hoog gaan ranken voor renovlies" (Armando). Gemeten met
`bron/seo/kw.mjs` (zoekvolume, NL/nl) en `bron/seo/serp.mjs` (wie staat er nu, en wat
voor pagina is dat). **De meting draaide het verzoek half om, en dat is de kern van dit
hoofdstuk.**

### Wat er gezocht wordt

Naaste varianten zijn samengevoegd: Google rekent ze als een zoekopdracht en geeft ze
daarom precies hetzelfde cijfer (zie de regel in `playground/CLAUDE.md`).

| zoekwoord | per maand | klikprijs |
| --- | --- | --- |
| renovliesbehang / renovlies behang | 14.800 | € 2,36 |
| vliesbehang | 12.100 | € 0,54 |
| renovlies | 8.100 | € 3,09 |
| glasvliesbehang | 3.600 | € 1,17 |
| glasweefselbehang | 1.300 | € 0,77 |
| muren glad maken | 1.300 | € 0,45 |
| wat is renovlies | 260 | € 1,64 |
| muren texen / texen muur | 210 | € 1,42 |
| renovlies aanbrengen | 140 | € 10,36 |
| krimpscheuren nieuwbouw | 110 | - |
| renovlies plakken | 70 | € 3,43 |
| renovlies of vliesbehang | 30 | € 2,92 |
| renovlies prijs (per m2) | 30 | € 3,93 |
| renovlies dikte | 20 | € 3,13 |
| renovlies of stucwerk | 10 | € 4,09 |

Eerste vondst: **"renovliesbehang" is bijna twee keer zo groot als "renovlies"** (14.800
tegen 8.100), het bevat "renovlies" letterlijk, en het is ook **zijn eigen woord** -
"Renovlies behang is een zeer gewilde behangsoort" staat in zijn advertentie. De site
zei overal alleen "renovlies". Dat staat nu in de titel en de h1 van beide pagina's, en
controle 18 eist het.

### Waarom de werkwijzepagina "renovlies" niet kan winnen

Dit is de meting die het antwoord op het verzoek verandert. De rij op de twee grote
woorden bestaat uit **webshops die rollen verkopen**:

- `renovliesbehang`: glasvezelbehang.nl (3), Hornbach (4), behangloods (5), Praxis (6),
  verfonline-xl (10), Gamma (14), hds.nl (15). Eén uitlegpagina ertussen (behang.nl, 7).
- `renovlies`: **een kaartblok bovenaan**, daaronder glasvezelbehang.nl (4), behangloods
  (6), karwei (9), hds.nl (10).

Dat is de categorie van een verkoper en niet van een schilder, en geen pagina verandert
een categorie (zelfde les als `noordmolen`: een categorie is geen pagina). Bovendien
staat er op `renovlies` een kaartblok, en daar kiest Google op afstand tot de zoeker.

Waar **geen** webshop en **geen** kaartblok staat, is het vraagcluster:

- `wat is renovlies`: alleen uitleg- en blogpagina's (renovlies-renovlies-behang.nl,
  uwglasvezelbehanger.nl, prowalls.nl, uwnieuwbouwwoning.nl).
- `renovlies of glasweefsel`: alleen vergelijkingen; renovliestotaal.nl staat op 6 met
  letterlijk "het verschil tussen renovlies, glasvlies en glasweefsel behang".

**Dat is precies de inhoud die Armando diezelfde dag vroeg.** De twee verzoeken vallen
samen, en de pagina is daarop gebouwd: `#soorten` bovenaan, de h1 draagt "wat het is",
en de blokken eronder pakken "muren glad maken" (1.300) en "krimpscheuren nieuwbouw".

Twee dingen die daaruit volgen en in de controle staan:

1. **De startpagina houdt het kopwoord** (renovliesbehang + Coevorden), `/werkwijze/`
   pakt het vraagcluster. Twee pagina's op hetzelfde woord wegen elkaar weg, en dat is
   hier makkelijk per ongeluk gedaan - beide pagina's gaan over hetzelfde onderwerp.
   Controle 18 eist dat de titels verschillen, dat zijn plaats in de ene staat en een
   vraagwoord in de andere.
2. **`renovlies aanbrengen` (140, € 10,36) is bewust niet het doelwoord**, ondanks de
   hoogste klikprijs in de hele lijst. Die rij is `zelfrenovliesaanbrengen.nl`,
   "stappenplan zelf renovlies behangen", een Reddit-draad en blogs van verfwinkels: de
   intentie is **het zelf doen**. Een werkwijzepagina die daarop mikt trekt bezoekers
   die geen schilder zoeken.

### Wat de SERP nog meer opleverde

`hds.nl` verkoopt "renovlies behang 150gr basisklasse" en glasvezelbehang.nl "Dutch
Wallcoverings renovlies 150 grams". **Pascals 215 gram staat dus niet alleen tegenover
de 165 gram die hij zelf noemt, maar tegenover een markt die op 150 gram adverteert.**
Dat getal is daarmee het sterkste punt op de site, en het staat nu in de vijf redenen
("Dik: 215 gram per m2"), in vraag 1, in het soortenblok en bij de nieuwbouwuitleg.
Op de pagina staat alleen *zijn* vergelijking (165); de 150 uit de webshops is onze
research en geen bewering van hem.

### Nog niet gedaan, met de reden

- **De slug blijft `/werkwijze/`.** `/renovlies-aanbrengen/` zou sterker zijn voor dat
  ene woord, maar dat woord is juist het doe-het-zelfcluster. Een slug die het
  vraagcluster dekt (`/wat-is-renovliesbehang/`) is te overwegen; dat is een keuze over
  de navigatie en de menulabels, en dus een vraag aan Armando en niet aan mij.
- **Geen FAQ-structured data op `/werkwijze/`.** De vragen staan op de startpagina; ze
  op twee pagina's zetten is dubbele inhoud.
- **Geen plaatspagina's.** Op `renovlies <plaats>` is het volume klein (Zwolle 90,
  Groningen 20, de rest 0-50) en op zijn eigen Coevorden meet Google niets. Vanaf
  100 m2 werkt hij door heel Nederland, dus plaatspagina's zijn hier niet de hefboom.

## Ronde 18 (25-10-2026, Pascal zelf op schrift)

Armando stuurde twee schermfoto's door van Pascals **eigen antwoorden in WhatsApp**: hij
had de site nagelezen en corrigeerde regel voor regel. Daarmee is er een vijfde bron, en
meteen de sterkste van allemaal - zijn advertentie is ook zijn eigen tekst maar acht
jaar oud, en de notulen van die ochtend zijn aantekeningen van iemand anders.
Zie `bron/zijn-tekst/pascal-whatsapp-25-10-2026.txt` (`PAS` in `inhoud.mjs`).

Zijn eigen woorden staan daar onder de streep; waar elke opmerking over ging staat
erboven. Dat onderscheid is niet cosmetisch: onze doorgestreepte zinnen **mee onder de
streep zetten** zou van onze copy zijn korpus maken, en dan verantwoordt de bronpoort
morgen een zin met een zin die wij zelf geschreven hebben (de cdlf-val, zie
playground/CLAUDE.md).

### 1. Het voorwerk stond er precies omgekeerd

De site zei acht dagen lang: "Is uw wand nog niet behangklaar, dan maakt Pascal hem
eerst zelf behangklaar." Pascal: **"Ik ga wanden die niet behangklaar zijn, niet
behangklaar maken !!"**

Wat hij wel doet gaat over een wand die het **al** is: nalopen met een
wandschuurmachine voor een nog gladder eindresultaat, en de laatste kleine
beschadigingen repareren of voorstrijken waar dat nodig is. Zijn reden erbij: door
timmermannen, elektriciens en keukenbouwers raken opgeleverde wanden nog wel eens
beschadigd.

Dit is de scherpste les van deze ronde, want **elke poort stond groen**. De bewering was
netjes herleidbaar - ze stond zo in `doorgegeven-armando.txt` van 20-10-2026 ("natuurlijk
doet Pascal egaliseren, schuren en voorstrijken zelf, indien nodig"). De bron was de
verkeerde, niet de bewering onherleidbaar. Vergelijk de Anti Marks-claim van die ochtend:
zelfde vorm, andere bron.

Vier plekken aangepast (vakmanblok, `/werkwijze/` het voorwerk, vraag 11, de afspraak
"Inbegrepen") en een vraag erbij: *Moeten mijn wanden behangklaar zijn?* Die hoort in de
vragenlijst en niet alleen in een alinea op de tweede pagina - het is de vraag die
bepaalt of iemand Pascal uberhaupt moet bellen.

Drie controles in plaats van vier tekstwijzigingen (`controleer.mjs` 13b, 13b4, 13b5):

- **13b4** gaat af op elke zin die zegt dat hij een wand behangklaar maakt. Twee dingen
  waren hier makkelijk mis te doen. De ontkenning mag niet per **zin** gewogen worden
  zoals bij 15a: de oude foute zin droeg zelf een "niet" in een andere bijzin ("Is dat
  nog **niet** zo, dan maakt Pascal..."), dus een zinsbrede check laat precies de regel
  door die hij moet vangen. Nu weegt hij het **venster** tussen "maken" en "behangklaar".
  En het Nederlands zet het werkwoord zowel voor als achter het bijvoeglijk naamwoord,
  dus beide volgordes staan in het patroon. Allebei getest door ze in `dist/` terug te
  zetten.
- **13b5** eist de andere kant: dat de wanden behangklaar **moeten** zijn. Zonder die eis
  is 13b4 met een schaar op te lossen - onderwerp weglaten - en dan gaat de site er
  stilzwijgend van uit dat elke bezoeker het weet.
- **13b** eist nu ook `wandschuurmachine`. Dat woord stond er tot vandaag bewust niet: het
  komt van de werkwijzepagina van renovliesdirect, en dat is de concurrent waar deze
  pagina tegen moet ranken, geen bron. Nu schreef hij het zelf op, dus nu mag het.
  Diezelfde regel is meteen hoofdletterongevoelig gemaakt: `includes('schuren')` liet
  "Schuren" aan het begin van een zin niet meetellen, dus hij hing aan het toeval dat het
  woord ergens ook middenin een zin stond.

De kop van dat blok op `/werkwijze/` was **"Muren glad maken, dan het vlies"** en dat
beloofde precies wat hij afwijst. Het zoekwoord (1.300/mnd, het grootste dat deze pagina
realistisch kan winnen) blijft staan, maar de grens staat nu in dezelfde regel: **"Muren
glad maken op een behangklare wand"**. Een pagina die rankt op werk dat hij niet doet,
levert aanvragen op die hij moet weigeren.

### 2. "Deze mag er wel uit" - en dus ook op de tweede plek

Over de zin onder de drie soorten: *"Renovliesbehang en glasweefselbehang vallen
goedkoper uit dan stucen of schilderen, omdat er geen scheurtjes in komen die eerst
gerepareerd moeten worden."* Die kwam woordelijk uit de notulen van datzelfde overleg -
hij heeft hem die ochtend zelf gezegd en haalde hem 's avonds van de pagina.

Hij streepte hem op **een** plek door; hij stond er op **twee** (ook in het
nieuwbouwblok). Hij las een pagina, geen codebase, dus allebei eruit.

Daarna hield ik de **later**-kant aan, want die stond in zijn advertentie van 2018
("relatief goedkoop want ... kan ten alle tijden overgetext worden") en Armando vroeg om
16:00 juist die kant expliciet te maken. De vierde reden werd daarom *"Elke volgende
kleur goedkoper"*. Om 18:33 trok Armando dat in: de klant wil het prijsargument niet, in
geen enkele vorm. Dus ook uit de vraag "Kan ik later een andere kleur kiezen?" en uit het
afwerkingsblok op /werkwijze/, en de vierde reden heet nu **"Altijd weer over te
texen"** - zijn feit zonder de waardering erover.

**Dat is ook waarom `controleer.mjs` 15e nu op het woord zelf gaat en niet meer op de
combinatie.** De oude regel toetste op `goedko*` *samen met* stucen/schilderen, omdat de
later-vorm op dat moment gewenst was. Precies die voorwaarde was het gat: "elke volgende
kleur goedkoper" noemt geen stucwerk en liep er zo langs. Een poort die een formulering
kent in plaats van een onderwerp, laat de volgende formulering door. Nu `goedko|
voordeliger|scheelt u|bespaart`, op beide pagina's, plus een eis in `na-live.mjs` op de
live html. Getest door de oude kop terug te zetten: hij gaat af.

### 3. Schrobklasse 1 staat er weer

Drie keer van richting gewisseld: er tot 20-10 (Armando streepte hem door - een norm uit
een fabrikantblad zegt een bewoner niets), in de notulen van 25-10 weer genoemd, en die
avond gaf Armando door dat de **klant** hem erop wil hebben.

Hij staat er daarom terug, maar andersom opgeschreven dan de eerste keer: eerst wat de
bewoner eraan heeft, dan de norm die het narekenbaar maakt. *"Alle drie schrobvast:
schrobklasse 1, de hoogste van de vijf klassen in DIN EN 13300."* Een regel die drie keer
van richting wisselt haal je niet nog eens weg op gevoel, dus hij is nu een eis
(`controleer.mjs` 16d).

### 4. Een doorgestreepte lead, en een merk dat nergens meer op sloeg

De lead boven de drie soorten (*"Ze worden door elkaar gebruikt, ook door bedrijven die ze
aanbrengen"*) was op 25-10-2026 door Armando doorgestreept en bleef in de drukte van die
ronde staan. Weg: de kop stelt de vraag al, de drie kaarten geven het antwoord.

Dat haalde iets anders boven water. `MERKEN` droeg nog twee sleutels van regels die al
van de pagina waren (`nl.verf.keus`, `nl.kaart.verf`). Zo'n weesregel is niet onschuldig:
hij zegt dat er een bron is voor een zin die niemand meer kan lezen, en wie die sleutel
later hergebruikt erft stilzwijgend die bron. **`build.mjs` zakt nu op een merk dat
nergens meer op slaat**, net zoals de ai-poort zakt op een uitzondering die niets meer
raakt. De tweede wees kwam alleen boven doordat de eerste de build stopte.

### Wat dit zegt over de bronnen

Het korpus heeft nu vijf lagen, en de volgorde is bijna omgekeerd aan de ouderdom:

| bron | wat | weegt |
| --- | --- | --- |
| `pascal-whatsapp-25-10-2026.txt` | zijn eigen schrift, over deze pagina's | gaat voor op alles |
| `overleg-pascal-25-10-2026.txt` | notulen van een overleg met hem | gaat voor op ARM en MP |
| `doorgegeven-armando-25-10-2026.txt` | van horen zeggen, 25-10-2026 | gaat voor op de regel van 20-10 |
| `doorgegeven-armando.txt` | van horen zeggen, 20-10-2026 | gaat voor op MP waar ze botsen |
| `marktplaats-advertentie.txt` | zijn eigen tekst, 2018 | de bodem |
| `sikkens-producten.txt` | de fabrikant | alleen `feit`, nooit zijn stem |

Elke laag draagt in zijn kop welke regels eronder achterhaald zijn, en bij elke
achterhaalde regel staat welke controle de bodem is. Dat is nodig omdat de oudste bron
de **volledigste** is: wie uit de advertentie van 2018 werkt krijgt traprenovatie, de
oude prijzen, de begripsverwarring en nu ook het voorwerk gratis terug.

## Ronde 19 (25-10-2026, de tweede alinea van het voorwerk)

Armando streepte op de werkwijzepagina de tweede alinea van **Het voorwerk** door:
"Wanden die niet behangklaar zijn, maakt hij niet behangklaar. Opgeleverde wanden loopt
hij wel na: door timmermannen, elektriciens en keukenbouwers raken ze nog wel eens
beschadigd." De eerste regel van `b1_a` zegt al dat de wanden behangklaar moeten zijn,
dus de grens stond er twee keer in vier regels.

Wat blijft staan: de grens zelf is een **eis** en geen tekstkeuze — `controleer.mjs` 13b5
vraagt om "wanden moeten ... behangklaar zijn" (staat in `b1_a`) en 13b zakt op elke zin
die het omgekeerde beweert. Zijn eigen reden waarom een opgeleverde wand tóch nalopen
moet, staat nog in het vakmanblok op de startpagina; die streep ging alleen over deze
pagina.

Twee dingen die eromheen zijn vastgezet, want een alinea weghalen is hier niet alleen
tekst wissen:

- **`wBlokken` in `build.mjs` telt nu per blok het aantal alinea's** (b1 = 1, b2 en b3 =
  2) en de bouw zakt als die telling en `inhoud.mjs` het oneens zijn. Zonder die telling
  rendert een ontbrekende `_b` stil een lege `<p>`, en een `_b` die er later bijkomt
  levert stil een alinea in die niemand besteld heeft. Getest door b1 op 2 te zetten.
- **Controle 24: geen leeg tekstelement** (`p`, `h2`, `h3`, `li`, `figcaption`) in de
  gebouwde html. Dat is de bodem eronder: een lege `<p>` is in de browser onzichtbaar op
  wat witruimte na, steekt nergens buiten en staat dus in geen enkele breedtemeting.
  Getest door er met de hand een in `dist/` te zetten.

Het merk `nl.werkwijze.b1_b` moest mee eruit: sinds ronde 18 zakt de bouw op een
MERKEN-sleutel die nergens meer op slaat.

## Ronde 20 (25-10-2026, vier berichten zonder antwoord + zijn eigen tekst)

Vier berichten van Armando stonden tussen 18:41 en 18:51 in de dispatcher en zijn nooit
door een sessie opgepakt (`claudius.db`, events 9749, 9752, 9755, 9757: inbound zonder
antwoord ertussen). Ze zijn hier alsnog verwerkt, samen met de tekst die de klant om
20:01 zelf aanleverde. Vijf dingen:

1. **De prijs is inclusief voorstrijken.** Dit draait ronde 6 half om, en daarmee ook
   een poort: 13b3 bestond juist om te voorkomen dat iemand "voorstrijken" en "in de
   prijs" samentrok. Die regel is vervallen en de eis staat nu in 13b2, als hele zin.
   Nieuw bronbestand `doorgegeven-armando-25-10-2026.txt`, want het spreekt de regel van
   20-10 tegen en dat hoort zichtbaar te zijn, niet als bijzin in de kop van het oudere
   bestand. Vier plekken op de site: `kaart.inbegrepen`, `vakman.b3`, `vragen.a11`,
   `werkwijze.b1_a` en de afspraak `a7_b`. Egaliseren blijft buiten alles: dat doet hij
   niet.
2. **"Diep mat" werd "Extreem mat"** op de derde Sikkens-kaart. Het woord stond ook in
   de regel eronder ("Extreem mat en schrobvast zonder op te glanzen"), en dan leest de
   kaart het twee keer in twee regels; die regel zegt nu alleen nog wat de verf doet.
3. **De slotzin van het nieuwbouwblok op `/werkwijze/` is weg** ("Renovliesbehang van
   215 gram is daarbij dikker dan de 165 gram die de meeste bedrijven gebruiken"). Dat
   blok gaat over krimpscheurtjes; de twee gewichten staan vier blokken hoger al in de
   kaart van renovliesbehang. De eis dat ze op beide pagina's staan is NIET gezakt: die
   zat in `build.mjs` aan `b2_a` vastgepind en staat nu alleen nog in `controleer.mjs`
   15b en 15c, op de gebouwde pagina. Dat is ook de betere plek - een eis die aan een
   bepaalde zin hangt, valt om zodra die zin verhuist.
4. **De keuzelijst "Wat heeft u nodig?"** ("beetje rare opties"). Twee dingen waren
   raar: de eerste optie noemde het materiaal en de twee eronder niet, dus "Plakken en
   1x texen" las als een andere dienst in plaats van hetzelfde met een stap erbij. En
   glasweefselbehang en gewoon behangwerk ontbraken, terwijl het soortenblok van die
   ochtend ze als volwaardige keuzes naast elkaar zet - wie glasweefsel wilde moest
   "Weet ik nog niet" aanklikken. Nu zeven opties, met "Weet ik nog niet" onderaan als
   uitweg. `kijk-soortlijst.mjs` leest de lijst uit de dom van beide pagina's en zakt op
   de volgorde en op een optie die geen dienst van de site noemt; getest door de laatste
   twee in `dist/` om te draaien. Zo'n lijst tekent het besturingssysteem, dus hij staat
   in geen enkele schermfoto van de pagina - dat is waarom dit zes rondes bleef staan.
5. **De vliesbehangkaart is zijn eigen tekst geworden.** Om 20:01 leverde de klant hem
   woordelijk aan, met een schermfoto van precies die kaart erbij: "Normaal behang,
   zowel Effen - Patroon of Fotobehang. Pascal behangt hier ook mee, het doet net iets
   anders met het aanzicht dan de twee soorten behang hiernaast." Alleen de opsomming is
   uit zijn kapitalen en zijn streepje gehaald - dat streepje is de vorm waar de
   ai-poort op afgaat. Merk `nl.werkwijze.s_c_b` is daarmee van `MP_OVL` naar `PAS`
   gegaan: die oudere bronnen zijn hier niet meer aan de orde.

   **Wat zijn versie niet meer zegt**, en dat is het nalezen waard: "er wordt niet over
   getext en het overbrugt geen scheurtjes". Dat was de zin die het onderscheid hardop
   maakte, en het onderscheid is precies waar het overleg van die ochtend om begonnen
   was. Hij staat er niet voor terug - hij schreef de kaart zelf opnieuw - maar het
   onderscheid leunt nu op de wat-regels van de drie kaarten ("Behang op de wand, daarna
   texen" tegen "Gewoon behang") en op `vragen.a4`. Controle 15a bewaakt nog wel de
   andere kant: nergens mag staan dat vliesbehang wél getext of scheuroverbruggend is.

## Aandachtspunten

- **De foto's zijn via WhatsApp binnengekomen** en daardoor teruggeschaald naar
  ~1178 px breed. `fotos.py` schaalt bewust niet op, dus de hero is op een grote
  laptop zachter dan gewenst. Originelen opvragen is de enige echte oplossing.
- **`http://` geeft nog 200 in plaats van een omleiding naar https.** Always Use HTTPS
  staat niet vanzelf aan op een nieuwe zone en het wrangler-token mag die instelling
  alleen lezen. Wordt dit een echte site, zet de omleiding dan in een worker
  (`main` + `run_worker_first = true`, zie `cdlf/worker.mjs`).
- **Het offerteformulier heeft geen server.** Het zet de antwoorden in een bericht en
  opent WhatsApp of de mail. Dat werkt echt, maar er wordt niets opgeslagen en er is
  dus ook geen opvolging als iemand halverwege afhaakt.

## Bestanden

| bestand | wat |
| --- | --- |
| `inhoud.mjs` | alle copy, de merken per regel, de prijzen, de NAP-gegevens |
| `build.mjs` | poorten, css, html, dist/, nalooplijst |
| `fotos.py` | uitsnedes, webp, manifest, gemeten wandkleuren |
| `controleer.mjs` | leest de gebouwde pagina's na |
| `meet.mjs` | breedtes en tekstgroottes in Chromium |
| `proef.mjs` | klikt menu, rekenhulp, zwevende balk, stroken en /werkwijze/ door |
| `shot.mjs` | schermfoto's van beide pagina's |
| `meet-mts.mjs` | eenmalig: wanneer komt de zwevende balk van mts-vloerverwarming in beeld |
| `meet-winterswijk.mjs` | eenmalig: maat, plek en kleur van de zwevende knoppen van winterswijkvakantiehuis.nl (telefoon) |
| `meet-winterswijk-desk.mjs` | eenmalig: dezelfde knoppen op 1440 en 1024 - kolom rechtsonder (ronde 12) |
| `shot-strook.mjs` | uitsnede van de dienstenstrook plus de kop eronder |
| `shot-kapitaal.mjs` | uitsnede van de vijf redenen en de kleurkaarten (ronde 11) |
| `kijk-verf.mjs` | uitsnede van het verfblok en de drie pakketten op 1440/768/360 (ronde 15) |
| `kijk-stap2.mjs` | meet stap 02 van de rekenhulp na: veldmaat, paginabreedte, botsing met de balk (ronde 16) |
| `kijk-live-zweef.mjs` | dezelfde twee punten op de LIVE site (ronde 16) |
| `shot-soorten.mjs` | uitsnede van het soortenblok, "Wat het kost" en het verfblok (ronde 17) |
| `kijk-soortlijst.mjs` | leest de keuzelijst "Wat heeft u nodig?" uit de dom van beide pagina's (ronde 20) |
| `bron/seo/kw.mjs` | zoekvolume + klikprijs voor renovlies en zijn buren (ronde 17) |
| `bron/seo/serp.mjs` | wie staat er nu op die woorden, en wat voor pagina is dat (ronde 17) |
| `dienen.mjs` | kleine statische server voor de browserscripts |
| `NALEZEN-PASCAL.md` | automatisch, wat Pascal moet nakijken |

Originelen staan in `../.aangeleverd-hulskers/` en horen daar te blijven:
`[assets] directory` uploadt alles wat in de projectmap ligt.
