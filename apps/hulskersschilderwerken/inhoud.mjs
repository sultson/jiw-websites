// Alle tekst van de site op een plek, plus per regel waar hij vandaan komt.
//
// TEKST gaat door de ai-poort (machinetaal) en door de bronpoort (klopt de bewering).
// MERKEN zegt per sleutel wat voor soort bewering het is; een regel met risico
// (ik-vorm, belofte, getal) zonder merk laat de build zakken. Zie playground/CLAUDE.md.
//
// Pascal schrijft zelf "u" en niet "je" (zie bron/zijn-tekst/marktplaats-advertentie.txt),
// dus de site doet dat ook.

export const BEDRIJF = {
  naam: 'Pascal Hulskers Schilderwerken',
  kort: 'Hulskers Schilderwerken',
  telWeergave: '06-20 41 82 67',
  telLink: '+31620418267',
  wa: '31620418267',
  mail: 'hulskersschilderwerken@gmail.com',
  straat: 'Krimweg 109',
  postcode: '7741 MC',
  plaats: 'Coevorden',
  kvk: '04084180',
  // Zijn eigen domein sinds 26-10-2026. Was hulskers-renovlies-concept.jouwconcept.app;
  // dat adres blijft als custom domain aan deze Worker hangen en 301't hierheen, zodat
  // een gedeelde conceptlink niet doodloopt en er geen tweede kopie van de site
  // indexeerbaar blijft staan (het concept had `Allow: /` in robots.txt).
  domein: 'hulskersschilderwerken.nl',
  // Openingstijden, doorgegeven via Armando (27-10-2026). Drie losse waarden en geen
  // object, want ze gaan als NAP-waarde door de bronpoort en die krijgt een string.
  //
  // Ze staan ALLEEN in de structured data op de startpagina, in geen enkele zin op de
  // pagina - zie de noot in bron/zijn-tekst/doorgegeven-armando-27-10-2026.txt. Het
  // aantal dagen staat hier als getal en wordt in build.mjs tegen de dagenlijst van de
  // JSON-LD gelegd: anders is "7 dagen per week" een bewering die niemand nameet en kan
  // de lijst op zes dagen staan terwijl dit getal 7 blijft zeggen.
  //
  // Sinds 27-10-2026 zijn deze drie waarden GEMETEN en niet meer alleen doorgegeven: zijn
  // eigen geclaimde Google-profiel zegt zeven dagen 07:00-23:00 (bron/gbp.json). Dat is
  // een bron buiten ons om, dus ze zijn van de nalooplijst af. bron/gbp.mjs zakt zodra het
  // profiel iets anders gaat zeggen dan deze waarden.
  openDagen: 7,
  openVan: '07:00',
  openTot: '23:00',
}

/**
 * Zijn Google-bedrijfsprofiel, gemeten in bron/gbp.mjs (uitkomst in bron/gbp.json).
 *
 * De `cid` is het nummer waarmee Google het profiel zelf aanduidt, en
 * `maps.google.com/?cid=<cid>` is het stabiele adres ervan. Daarom staat hier de cid en
 * niet de kant-en-klare url: er is dan een plek waar hij staat, en build.mjs en
 * tools/vooraf.mjs zetten hem allebei uit dit getal in elkaar.
 *
 * De doorgegeven `share.google`-link staat er NIET in. Die is een omleider: hij zegt niet
 * welk profiel het is, en wat hij morgen uitwijst beslist Google. In `sameAs` hoort het
 * adres dat de entiteit zelf benoemt, want dat is wat Google naast deze site legt.
 *
 * De kgmid (het nummer van de entiteit in de Knowledge Graph) staat erbij omdat het de
 * enige manier is om terug te vinden welk profiel er doorgegeven is.
 */
export const GBP = {
  cid: '11940519625446020035',
  kgmid: '/g/11zz__vl20',
  place_id: 'ChIJG-w4hhfqZ2QRw1NK9FU_taU',
  get url() { return `https://maps.google.com/?cid=${this.cid}` },
}

/**
 * Waar het offerteformulier naartoe post.
 *
 * Staat hier en niet in build.mjs, want vier dingen moeten het hierover eens zijn en
 * ze staan in vier bestanden: de `action` van het formulier (build.mjs), de route in
 * worker/index.ts, de controle op de gebouwde pagina (controleer.mjs) en de poort op
 * de bouw (tools/vooraf.mjs). Lopen die uit de pas, dan landt de aanvraag op een 404 -
 * en dat is precies het soort fout dat maanden onopgemerkt blijft, omdat niemand zijn
 * eigen contactformulier invult.
 *
 * worker/index.ts kan dit bestand niet importeren (typescript tegen een .mjs met
 * nederlandse exports), dus daar staat het adres los. tools/vooraf.mjs leest het
 * daarom uit de worker en vergelijkt het hiermee.
 */
export const FORM_PAD = '/api/forms/offerte'

/**
 * De adressen die geindexeerd mogen worden, en dus precies de adressen die in de
 * sitemap horen.
 *
 * Staat hier omdat drie dingen het eens moeten zijn en ze van elkaar los kunnen raken:
 * de pagina's die build.mjs schrijft, de regels in de sitemap, en wat er aan .html in
 * dist/ ligt. tools/vooraf.mjs legt die drie naast elkaar en zakt bij het eerste
 * verschil. Zonder dat kan er een derde pagina bijkomen die nergens in de sitemap
 * belandt - en dat is de fout die niemand opmerkt, want de pagina zelf werkt prima.
 *
 * De 404 staat er bewust NIET in: die draagt altijd noindex en hoort niet in een
 * sitemap.
 */
export const INDEXEERBAAR_PADEN = ['/', '/werkwijze/']

// De prijzen. Staan hier los zodat er een plek is om ze bij te werken als Pascal ze
// verandert, in plaats van verspreid door de pagina.
//
// Wat de 16 euro precies was stond nergens: zijn advertentie zegt alleen "wilt u het
// echter ook getext hebben, dan kan ik u een totaalprijs aanbieden vanaf EUR 16,00".
// Armando gaf op 20-10-2026 door dat dat EEN keer texen is, en dat er een derde optie
// bestaat die niet in de advertentie staat: 23 euro voor twee keer texen.
//
// Sinds het overleg van 25-10-2026 komen de eerste twee bedragen NIET meer uit zijn
// advertentie: 10 ging naar 11 en 16 naar 17,50. De 23 is in dat overleg niet genoemd
// en blijft staan op de doorgegeven regel van 20-10-2026. Drie bedragen, drie bronnen,
// en dat staat zo op de nalooplijst.
//
// 17,5 is het eerste bedrag dat geen heel getal is. De centen stonden tot nu toe als
// ",00" hardgecodeerd in de opmaak; build.mjs heeft daarom een `eur()` die het bedrag
// opmaakt. Zet hier dus het GETAL en niet de tekst, anders rekent de rekenhulp met een
// string.
export const PRIJZEN = {
  plakken: 11,
  plakkenTexen: 17.5,
  plakkenTexen2: 23,
  vanafM2: 100,
}

// De drie wandafwerkingen die Pascal plakt, en wat ze van elkaar onderscheidt.
//
// Dit stond tot 25-10-2026 nergens als eigen begrip, en daar ging de site op mis: zijn
// advertentie van 2018 noemt renovlies, vliesbehang en glasweefselbehang in een adem
// ("deze soorten behang zijn er in verschillende printen & designs en is in alle
// kleuren over te texen") en gebruikt "vliesbehang" ook voor het materiaal dat je
// overtext. In het overleg van 25-10-2026 legde Pascal uit dat dat drie verschillende
// dingen zijn en dat vliesbehang gewoon normaal behang is. Zijn eigen oudere tekst is
// op dit punt dus los geformuleerd, en de site volgde die losheid.
//
// Daarom staan de drie hier als waarden met een eigen bron, naast de prijzen en de
// productnamen: dan is "wat is renovlies" een plek in dit bestand en geen zin die in
// twaalf alinea's net anders is opgeschreven. De gramgewichten zijn ZIJN getallen
// (215 wat hij gebruikt, 165 wat de meeste bedrijven gebruiken).
export const SOORTEN = {
  gram: 215,
  gramGangbaar: 165,
}

// De drie Sikkens-producten waarmee Pascal werkt. De NAMEN en de eigenschappen komen
// van de fabrikant (bron/sikkens-producten.txt, nagekeken op sikkens.nl 20-10-2026),
// DAT hij ermee werkt is doorgegeven via Armando. Dat zijn twee verschillende bronnen
// en ze staan daarom apart op de nalooplijst.
//
// Drie dingen uit het nakijken, want ze stonden anders in de doorgegeven tekst:
//   - "Anti Marx" heet bij Sikkens Alpha Rezisto Anti Marks.
//   - "Resisto" is bij Sikkens Rezisto, met een z, en de lijn heet Alpha Rezisto.
//   - de VORM heet op de pagina coating. Sikkens zet ze onder "binnenmuurverf" en de
//     site zei daarom eerst muurverf; Armando kwam er later die dag op terug, want
//     Pascal zelf zegt coating. Dat is het woord van de man die het aanbrengt en dus
//     het woord dat hier hoort - muurverf is een coating, dus er wordt niets beweerd
//     wat niet waar is. Wat er NIET uit volgt: dat het een los laagje over de verf
//     heen is, of een aparte behandeling met een eigen prijs. Zelfde emmer.
// En let op de eigenschap van Anti Marks: de fabrikant claimt bestand tegen strepen,
// vegen en stoten (schoenen, koffers, tassen) plus schrobklasse 1. Niet "krasvast" -
// dat is een andere claim en die staat nergens.
//
// Die claim is op 25-10-2026 ingeperkt. Pascal zei in het overleg: "de Anti Marks kan
// niet zonder schade van koffers." Hij brengt het aan en ziet de wand daarna terug, dus
// zijn ervaring gaat voor de folder van de fabrikant. Koffers, tassen en "stoten" zijn
// daarmee van de pagina; wat blijft staan is strepen en vegen. Dit is precies de kant
// waar een poort niet helpt: het getal en de woorden STAAN in de bron, alleen is de
// bron hier de verkeerde.
//
// Uit datzelfde overleg: er wordt EEN van de drie gekozen, niet twee. Tot die dag zei
// de site op vier plekken dat Anti Marks en Easy Clean samen aangebracht kunnen worden
// bij twee keer texen (doorgegeven via Armando, 20-10-2026, en dat bleek onjuist).
export const VERF = {
  merk: 'Sikkens',
  a: 'Alpha Rezisto Anti Marks',
  b: 'Alpha Rezisto Easy Clean',
  c: 'Alphacryl Pure Mat SF',
}

export const TEKST = {
  nl: {
    // "Renovliesbehang" in plaats van "renovlies": gemeten op 25-10-2026 is dat het
    // grootste woord (14.800 per maand tegen 8.100), en het is ook ZIJN woord - zijn
    // advertentie schrijft "Renovlies behang is een zeer gewilde behangsoort". Het
    // bevat "renovlies" bovendien letterlijk, dus het ene woord kost het andere niets.
    // Zie README, "Zoekwoorden".
    titel: 'Renovliesbehang en glasweefselbehang | Pascal Hulskers Coevorden',
    // De ondergrens van 100 m2 stond hier ook, en dit is de regel die Google als
    // zoekresultaat toont. Daar hoort een voorwaarde niet als eerste indruk.
    omschrijving:
      'Renovliesbehang van 215 gram, glasweefselbehang en vliesbehang door Pascal ' +
      'Hulskers uit Coevorden. Scheuroverbruggend en over te texen in elke kleur.',

    // De smalle donkere topbalk boven het logo is op 20-10-2026 weggehaald (Armando
    // streepte hem door op /werkwijze/). Zijn twee regels stonden allebei al elders:
    // "Renovlies, vliesbehang en glasweefselbehang" in de voet en de paginatitel,
    // "Geen betalingen vooruit" in de lopende balk eronder. Het telefoonnummer staat
    // in de hero, de menulade, de zwevende knoppen en de voet.

    nav: {
      renovlies: 'Renovlies',
      prijzen: 'Prijzen',
      werkwijze: 'Werkwijze',
      werk: 'Eerder werk',
      vragen: 'Vragen',
      contact: 'Contact',
      knop: 'Vrijblijvende offerte',
      menu: 'Menu',
      sluit: 'Menu sluiten',
      bellen: 'Bellen',
      appen: 'WhatsApp',
    },

    hero: {
      // Geen "boven" meer: die kopregel is op 20-10-2026 door Armando doorgestreept.
      //
      // De h1 was tot 25-10-2026 "Gladde wanden, zonder scheurtjes" en noemde het
      // onderwerp van de site niet. Dat is de grootste gemiste kans op een pagina die
      // op renovliesbehang moet ranken: de h1 is na de title het sterkste signaal, en
      // deze had er geen enkel woord van. Het staat er nu voor de belofte, niet in
      // plaats van: wat hij oplevert (gladde wanden zonder scheurtjes) blijft de kop.
      h1a: 'Renovliesbehang: gladde wanden',
      h1b: 'zonder scheurtjes',
      lead:
        'Renovliesbehang en glasweefselbehang overbruggen de krimpscheurtjes in nieuwbouw. ' +
        'Pascal plakt uw wanden strak en text ze in uw kleur.',
      // De hero gaat over zijn aanbod, het blok "Waarom renovlies" over het materiaal.
      // Tot 20-10-2026 stonden hier dezelfde drie eigenschappen als in dat blok
      // (scheuroverbruggend, naadloos, over te texen), waardoor de lezer het twee keer
      // kreeg en geen van beide blokken een reden gaf om Pascal te bellen.
      punt1: 'U betaalt pas als het werk klaar is',
      punt2: 'Een duidelijke offerte, zwart op wit',
      punt3: 'Kleuradvies van de schilder zelf',
    },

    // De rekenhulp loopt in drie stappen, net als bij de referentiesite: eerst het
    // pakket, dan de m2, dan de uitkomst. Elke stap heeft zijn eigen label.
    kaart: {
      kop: 'Richtprijs berekenen',
      badge: 'Indicatie',
      s1: 'Pakket',
      s2: 'Aantal m2',
      s3: 'Richtprijs',
      kies: 'Kies uw afwerking',
      pakket1: 'Renovliesbehang plakken',
      pakket1sub: 'Inclusief behang en lijm',
      // "Plakken en texen" stond hier tot 20-10-2026 zonder te zeggen hoeveel keer er
      // getext wordt, omdat zijn advertentie dat niet zegt. Doorgegeven via Armando:
      // de 16 euro is een keer texen, en er is een derde optie van 23 euro voor twee
      // keer. Dat verschil hoort in het label zelf te staan, niet in een voetnoot:
      // iemand die twee bedragen naast elkaar ziet wil weten waarom het ene duurder is.
      pakket2: 'Plakken en 1x texen',
      pakket2sub: 'Inclusief alle materialen',
      pakket3: 'Plakken en 2x texen',
      // Stond tot 20-10-2026 als "Inclusief alle materialen en Sikkens-coating" (streep
      // door de staart in een schermfoto, feedback Armando). Het merk hoort in het
      // verfblok, waar de drie producten met naam staan; hier is het een tweede
      // onderwerp in een regel die alleen hoeft te zeggen wat er in het bedrag zit.
      pakket3sub: 'Inclusief alle materialen',
      perM2: 'per m2',
      eenheid: 'm2',
      verder: 'Verder',
      m2vraag: 'Hoeveel m2 wand?',
      m2hulp: 'Typ het aantal m2, of gebruik de knoppen',
      minder: 'Minder m2',
      meer: 'Meer m2',
      terug: 'Terug',
      toon: 'Toon richtprijs',
      leeg: 'Vul eerst het aantal m2 in',
      uitkomst: 'Uw richtprijs',
      vanaf: 'vanaf',
      obv: 'o.b.v.',
      knop: 'Offerte aanvragen',
      btw: 'Prijzen ex btw. Woningen van 2 jaar en ouder vallen in de 9% btw-regeling.',
      klein: 'Een richtprijs is geen offerte. Pascal kijkt naar uw wanden en rekent het na.',
      // Zijn advertentie zegt dat zijn prijzen vanaf 100 m2 gelden, en dat hij vanaf
      // 100 m2 in heel Nederland plakt. Niet dat hij kleiner werk weigert of er een
      // aparte prijs voor maakt - dat stond er tot 20-10-2026 en was onze aanname
      // (feedback Armando). Wat er nu staat is zijn eigen uitnodiging.
      //
      // Het gat dat zijn advertentie liet (wat gebeurt er onder de 100 m2?) vulde
      // Armando op 20-10-2026: dan rijdt Pascal binnen 30 kilometer van Coevorden.
      // Dat is een eigen regel met een eigen bron, want het gaat over het werkgebied
      // en niet over de prijs - wat kleiner werk kost staat nergens.
      ondergrens: 'Deze prijzen gelden vanaf 100 m2. Minder wand? Vraag vrijblijvend naar een prijs.',
      straal: 'Onder de 100 m2 werkt Pascal binnen 30 kilometer van Coevorden.',
      // Doorgegeven via Armando, 20-10-2026: Pascal zei dat zijn prijzen schuren en
      // lichte reparaties al bevatten. Dat hoort bij het bedrag en niet in een vraag
      // onderaan, want het is precies wat iemand met een bestaande wand zich afvraagt
      // als hij 11 euro per m2 ziet staan.
      //
      // Voorstrijken stond hier bewust NIET bij: hij doet het wel, maar of het in het
      // bedrag zat was een vraag die openstond (het is een prijsafspraak, en die vul je
      // niet in op horen zeggen). Armando gaf het antwoord op 25-10-2026: de prijs is
      // inclusief voorstrijken. Egaliseren blijft er los van staan - dat doet Pascal
      // helemaal niet (controleer.mjs 13b1).
      inbegrepen: 'Schuren, lichte reparaties en voorstrijken zitten in de prijs.',
      // Hier hing tot 20-10-2026 een regel onder stap 01: "Bij twee keer texen kunnen de
      // twee Sikkens-coatings samen aangebracht worden." Weggehaald op aanwijzing van
      // Armando (streep door de hele zin). Hij staat woordelijk in de lead van het
      // verfblok, dus de uitleg is niet weg - alleen niet meer in de rekenhulp, waar
      // iemand een bedrag kiest en geen productuitleg zoekt.
    },

    loper: {
      a: 'Scheuroverbruggend',
      b: 'Over te texen in elke kleur',
      c: 'Geen betalingen vooruit',
      d: 'Kleuradvies',
      e: 'Binnen- en buitenschilderwerk',
      // Traprenovatie stond hier tot 20-10-2026. Die dienst doet Pascal niet meer
      // (doorgegeven via Armando), dus hij is van de hele site af - ook al staat hij
      // nog in zijn advertentie van 2018. Op die plek staat nu zijn verfmerk, want dat
      // is sinds diezelfde dag wel bekend en het is de sterkste van de twee.
      f: 'Sauswerk plafonds en wanden',
      g: 'Getext met Sikkens',
    },

    // De volgnummers (01, 02, ...) staan bewust niet hier: dat is opmaak en geen
    // bewering. build.mjs telt ze zelf, anders staat er straks een rij losse cijfers
    // op de nalooplijst waar Pascal niets aan heeft.
    // Vijf redenen die alleen over renovlies gaan. Waarom je voor Pascal kiest staat
    // in het vakmanblok en bij de stappen; dat door elkaar heen zetten maakte dit blok
    // lang en zei twee dingen tegelijk (feedback Armando, 20-10-2026).
    // Vijf punten die een keuze maken in plaats van renovlies beschrijven: wat de
    // bezoeker eraan overhoudt, en bij 05 wat het kost.
    //
    // Maat en toon komen van de referentiesite (Armando, 20-10-2026: "ik vind het bij
    // die andere website beter, kunnen we niet letterlijk hetzelfde schrijven?").
    // Hun model is twee tot drie woorden kop en een regel van hooguit zes a zeven
    // woorden eronder; dat leest sneller dan onze volzinnen en dat is de echte winst.
    // Overgenomen is dus de VORM, niet de tekst: letterlijk hun zinnen plaatsen zet
    // de copy van de concurrent waar wij tegen moeten ranken op onze pagina (dubbele
    // tekst die niets eigens toevoegt, en het is hun werk).
    //
    // Drie van hun vijf staan hier bewust niet, omdat ze over het BEDRIJF gaan en
    // niet over renovlies, en Pascal ze nergens over zichzelf zegt: "nieuwbouw binnen
    // een werkweek", "A-merk materialen o.a. Sikkens" en "40% voordeliger dan
    // stucwerk". Zegt hij ze wel, dan zijn het meteen de drie sterkste punten van de
    // pagina; het zijn vraag 2, 3 en 4 in de README.
    // Wat er nu staat komt alle vijf uit zijn eigen advertentie: naadloos plakken,
    // scheuroverbruggend, vrij dik en stevig, behangklaar opgeleverd, "relatief
    // goedkoop want ... kunnen ten alle tijden overgetext worden", en zijn prijzen.
    usp: {
      boven: 'Waarom renovlies',
      kop: 'Vijf redenen voor renovlies',
      // De regel onder elke kop is op 20-10-2026 geschrapt (Armando streepte alle vijf
      // door). Wat erin stond is nergens verloren: de prijzen staan in de rekenhulp en
      // in de lopende balk, de behangklare wand bij het voorwerk op /werkwijze/, en
      // "overgetext worden" bij de kleurvraag.
      a_t: 'Naadloos & scheurvrij',
      // "Dik en stevig" waren zijn eigen woorden maar zeggen niets narekenbaars. Sinds
      // het overleg van 25-10-2026 is het getal bekend, en 215 tegen de 165 gram die
      // gangbaar is, is het enige punt op deze pagina dat een concurrent niet ook kan
      // opschrijven. Vandaar in de kop en niet in een bijzin.
      b_t: 'Dik: 215 gram per m2',
      c_t: 'Geen stucbeurt nodig',
      // "Relatief goedkoop" zijn zijn eigen twee woorden uit 2018, inclusief de reden
      // erachter ("want ... kunnen ten alle tijden overgetext worden").
      //
      // Deze kop is op 25-10-2026 twee keer gewijzigd en staat nu weer op het
      // origineel. Die twee rondes zijn de les, dus ze staan hier:
      //   1. "Elke volgende kleur goedkoper" - Armando vroeg om 16:00 de toekomstkant
      //      expliciet te maken. Onze formulering, niet de zijne.
      //   2. "Altijd weer over te texen" - om 18:33 trok Armando punt 1 in, en ik las
      //      daarin dat het prijsargument er helemaal uit moest. Dat was te breed:
      //      Pascal streepte EEN zin door (de vergelijking met stucen of schilderen,
      //      zie sVoet en b2_b) en niet zijn eigen twee woorden. Armando 18:40: "je
      //      hoefde alleen weg te halen wat klant zei dat weg moest ... op de
      //      homepagina kon alles dus hetzelfde blijven."
      // Wat eruit blijft is dus de VERGELIJKING, niet het woord. controleer.mjs 15e
      // gaat af op elk prijswoord met deze twee woorden als enige uitzondering, en
      // zakt ook als die uitzondering nergens meer op slaat.
      d_t: 'Relatief goedkoop',
      e_t: 'Afgerekend per m2',
    },

    vakman: {
      boven: 'De vakman',
      kop: 'Aangebracht door Pascal zelf',
      b1:
        'Pascal Hulskers Schilderwerken is een eenmanszaak uit Coevorden. Wie belt, krijgt ' +
        'de schilder die ook op de steiger staat.',
      // "Behangklaar maken ... doet hij zelf" stond hier tot 20-10-2026 en was onze
      // aanname: zijn advertentie noemt het voorwerk nergens. Het staat er sinds
      // 20-10-2026 weer, maar nu met een bron: Armando gaf door dat Pascal egaliseren,
      // schuren en voorstrijken zelf doet indien nodig. Dat is doorgegeven en niet van
      // hem op schrift, dus het draagt bron ARM en staat apart op de nalooplijst.
      // Traprenovatie stond hier tot 20-10-2026 en is eruit: die dienst doet Pascal
      // niet meer (doorgegeven via Armando). Zijn advertentie van 2018 noemt hem nog
      // wel, met twee foto's erbij, dus dit is een plek waar de oudste bron de
      // verkeerde is. Zie de kop van marktplaats-advertentie.txt.
      // Tot 25-10-2026: "Renovlies, vliesbehang en glasweefsel plakt en text hij zelf."
      // Dat was fout: vliesbehang is gewoon behang en wordt niet getext (overleg met
      // Pascal). Nu staat het getexte werk apart van het behangwerk.
      // "gewoon vliesbehang hangt hij ook" is op 25-10-2026 "hij behangt ook met gewoon
      // vliesbehang" geworden (Armando). Behang hangen is spreektaal; het vak heet
      // behangen, en dit is de zin waarin hij zijn eigen diensten opsomt.
      b2:
        'Renovliesbehang en glasweefselbehang plakt en text hij zelf, en hij behangt ook ' +
        'met gewoon vliesbehang. Daarnaast binnen- en buitenschilderwerk en sauswerk ' +
        'op plafonds en wanden.',
      // Deze regel heeft het drie rondes mis gehad, en de laatste ronde is van Pascal
      // zelf op schrift (25-10-2026). Hij stond er als "Is uw wand nog niet behangklaar,
      // dan doet hij het voorwerk er zelf bij" - eerst met egaliseren erbij, toen zonder.
      // Fout is de hele strekking: hij maakt een wand die niet behangklaar is ook NIET
      // behangklaar ("Ik ga wanden die niet behangklaar zijn, niet behangklaar maken !!").
      // Wat hij wel doet gaat over een wand die al behangklaar IS, en dat is precies
      // andersom: nalopen met de wandschuurmachine, en repareren of voorstrijken waar
      // nodig. De wandschuurmachine is nu zijn eigen woord; tot vandaag stond hij er
      // bewust niet, omdat hij van de werkwijzepagina van renovliesdirect kwam.
      b3:
        'Uw wanden moeten wel behangklaar zijn. Zijn ze dat, dan loopt Pascal ze langs ' +
        'met een wandschuurmachine voor een nog gladder eindresultaat, en repareert hij ' +
        'de laatste kleine beschadigingen of strijkt hij voor waar dat nodig is. ' +
        'Schuren, lichte reparaties en voorstrijken zitten in de prijs.',
      citaat: 'We gaan pas naar huis als de klant tevreden is.',
      citaatBron: 'Pascal Hulskers',
      knop: 'Vraag een offerte aan',
    },

    kleuren: {
      boven: 'Kleur naar keuze',
      kop: 'Strak getext, in iedere gewenste kleur',
      lead: 'Wanden uit eigen werk, elk in de kleur die de klant koos.',
      a: 'Warm taupe',
      a_sub: 'Overloop',
      b: 'Diep grijs',
      b_sub: 'Hal en trapopgang',
      c: 'Olijfgroen',
      c_sub: 'Woonkeuken',
      voet: 'Elke andere kleur op aanvraag, met kleuradvies van Pascal',
    },

    // Het verfmerk stond tot 20-10-2026 als vraag in de README: de referentiesite heeft
    // "A-merk materialen o.a. Sikkens" als USP en wij konden dat niet overnemen, want
    // het was hun bewering. Armando gaf het die dag door, mét de twee producten, en dan
    // is dit het sterkste eigen punt op de pagina: niet welk merk er in de emmer zit,
    // maar wat de bewoner eraan heeft (een wand waar een stoel tegenaan kan en waar
    // ketchup van af te vegen is).
    //
    // De eigenschappen zijn hier WOORDELIJK de claims van de fabrikant, niet onze
    // samenvatting. Dat is bewust: "krasvast" stond in de doorgegeven tekst en dat
    // claimt Sikkens nergens - Anti Marks gaat over strepen, vegen en stoten. Een
    // vakman leest zijn eigen materiaal na, dus dit is precies het soort regel waar
    // een halve graad overdrijving opvalt.
    verf: {
      boven: 'De coating',
      kop: 'Getext met Sikkens',
      // Tot 25-10-2026: "Bij twee keer texen kunnen deze twee coatings samen aangebracht
      // worden." Dat is onjuist (overleg met Pascal): u kiest er EEN. De lead zegt dat
      // nu zelf, want dat is de vraag die drie kaarten naast elkaar oproepen.
      lead:
        'Pascal text met Sikkens. U kiest een van deze drie coatings, afhankelijk van ' +
        'de ruimte en van wat de wand moet kunnen verdragen.',
      // De productNAMEN staan niet hier maar in VERF bovenaan, samen met de prijzen en
      // de registergegevens: het zijn waarden met een eigen bron (de fabrikant) en geen
      // zinnen van ons. Zo staan ze op een plek en komen ze langs dezelfde poort.
      // Tot 25-10-2026 stond hier de claim van de fabrikant voluit: "strepen, vegen en
      // stoten van schoenen, koffers en tassen". Pascal zei in het overleg dat een koffer
      // wel schade geeft, dus koffers, tassen en stoten zijn eruit. Wat overblijft is wat
      // hij zelf onderschrijft: strepen en vegen. Een halve graad minder, en precies de
      // halve graad waar een bewoner met een beschadigde wand op terugkomt.
      a_b: 'Bestand tegen strepen en vegen, bijvoorbeeld van schoenen in een gang of hal.',
      a_vlag: 'Strepen en vegen',
      // "Ketchupbestendig, dus ideaal voor de keuken" is Pascals eigen voorbeeld uit het
      // overleg van 25-10-2026. Dat is sterker dan "vlekafstotend", want het noemt de
      // ruimte waar iemand het probleem heeft.
      b_b:
        'Vlekafstotend en makkelijk te reinigen: water, vuil en vet trekken er niet in. ' +
        'Ketchupbestendig, dus ideaal voor de keuken.',
      b_vlag: 'Afneembaar',
      c_b: 'Schrobvast zonder op te glanzen. De matste van de drie.',
      // Vlag was "Op aanvraag" tot 25-10-2026 (streep van Armando). Die stond op een
      // andere as dan de twee ernaast: die zeggen wat de wand kan hebben, deze zei iets
      // over bestellen. Naast de regel dat je er EEN kiest las hij bovendien alsof deze
      // derde geen gewone keuze is. Nu dezelfde as: wat de afwerking doet.
      // "Diep mat" werd op 25-10-2026 "Extreem mat" (Armando, met een schermfoto van
      // dit blok). Het woord stond toen ook in c_b ("Extreem mat en schrobvast zonder
      // op te glanzen"), en dan leest de kaart hem twee keer in twee regels; c_b zegt
      // nu alleen nog wat de verf doet.
      c_vlag: 'Extreem mat',
      // Onder de drie kaarten stond tot 25-10-2026 nog een vetgedrukte regel: "U kiest
      // een van deze drie, niet twee. Pascal adviseert erin mee." Weg op aanwijzing van
      // Armando (streep door de regel). Hij zei woordelijk hetzelfde als de lead erboven
      // ("U kiest een van deze drie coatings, afhankelijk van..."), dus hij stond er twee
      // keer in een blok van een half scherm. De EIS blijft staan - zie controleer.mjs
      // nummer 16, die toetst nu dat de lead hem draagt.
      // Schrobklasse 1 stond hier tot 20-10-2026 als "de hoogste klasse volgens DIN EN
      // 13300" en ging er toen uit op een streep van Armando: een norm uit een
      // fabrikantblad zegt een bewoner niets. Pascal noemde hem in het overleg van
      // 25-10-2026 weer, en Armando gaf die avond door dat de klant hem er wel op wil
      // hebben. Hij staat er dus terug - maar andersom opgeschreven dan de eerste keer:
      // eerst wat de bewoner eraan heeft (schrobben mag), dan pas de norm die het
      // narekenbaar maakt. Dat is ook het verschil met de regel die hier sneuvelde.
      voet: 'Alle drie schrobvast: schrobklasse 1, de hoogste van de vijf klassen in DIN EN 13300.',
    },

    // De ondertitel onder deze kop is op 20-10-2026 weggehaald (feedback Armando, met
    // een streep door de regel in een schermfoto). Hij zei niets wat de foto's niet al
    // zeggen: de bijschriften noemen per foto wat je ziet, en de kop noemt Pascal.
    werk: {
      boven: 'Eerder werk',
      kop: 'Werk van Pascal',
      a: 'Nieuwbouw, hal en trapopgang',
      b: 'Hoge woonkamer, wanden en plafond gesausd',
      c: 'Fotobehang op vlies in de hal',
      d: 'Witgelakte taatsdeuren in de woonkamer',
      e: 'Zwart geschilderde houten gevel',
      f: 'Voordeur en kozijnen, zwart geschilderd',
    },

    // Wie de startpagina leest ziet alleen renovlies en denkt dat Pascal verder niets
    // doet (feedback Armando, 20-10-2026). Zijn advertentie begint juist met "Voor al uw
    // Schilderwerk & Renovlies": schilderwerk is de helft van zijn bedrijf en de reden
    // dat hij mond-tot-mond al vol zit. Dit blok is BEWUST geen volle sectie met foto's
    // en een eigen offerteblok: het noemt in vier regels wat er nog meer is en stuurt
    // door naar hetzelfde offerteblok, zodat renovlies blijft waar de pagina over gaat.
    // Stond eerst onder de werkfoto's, maar daar vond Armando hem zelf niet terug; sinds
    // 20-10-2026 staat hij boven de kop "Eerder werk" en is de kop een maat groter.
    // Dat is ook de betere plek: twee van de zes foto's eronder zijn buitenschilderwerk,
    // dus de strook kondigt aan wat de lezer daar vervolgens ziet staan.
    //
    // De lead is de formulering die Armando op 20-10-2026 woordelijk doorgaf. Alles wat
    // ze beweert staat in zijn advertentie (de drie diensten en de duidelijke offerte),
    // dus hij blijft "afgeleid" op MP en niet "doorgegeven".
    diensten: {
      boven: 'Ook door Pascal',
      kop: 'Voor al uw schilderwerk, binnen en buiten',
      // Armando's eigen formulering van 20-10-2026, met traprenovatie eruit: die dienst
      // doet Pascal niet meer (doorgegeven via Armando, diezelfde dag). Dat is ook de
      // reden dat de lijst drie regels is en geen vier - er is geen vierde dienst, en
      // er een verzinnen om het blok te vullen is precies wat hier niet mag.
      lead:
        'Naast renovlies doet Pascal schilderwerk en sauswerk er gewoon bij. Ook daarvoor ' +
        'krijgt u een duidelijke offerte.',
      a: 'Binnenschilderwerk',
      b: 'Buitenschilderwerk',
      c: 'Sauswerk, plafonds en wanden',
      knop: 'Vraag er een prijs voor op',
    },

    stappen: {
      boven: 'Zo werkt het',
      kop: 'Van aanvraag tot strakke wand',
      a_t: 'U vraagt een prijs op',
      a_b: 'Bellen, appen of het formulier invullen.',
      b_t: 'U krijgt een duidelijke offerte',
      b_b: 'Zwart op wit wat het kost, inclusief materiaal.',
      c_t: 'Pascal plakt en text',
      c_b: 'Plakken en texen in de kleur die u kiest.',
      d_t: 'U betaalt achteraf',
      d_b: 'Geen betalingen vooruit, pas als de werkzaamheden zijn verricht.',
      meer: 'De hele werkwijze stap voor stap',
    },

    vragen: {
      boven: 'Veelgestelde vragen',
      kop: 'Vragen over renovlies',
      lead: 'Staat uw vraag er niet bij? Bel of app Pascal, hij antwoordt zelf.',
      // Deze vier antwoorden gingen tot 25-10-2026 door elkaar heen: a1 noemde renovlies
      // "een vliesbehang", a3 zei dat vliesbehang overgetext kan worden, en a4 zei alleen
      // dat Pascal met alle soorten werkt zonder te zeggen wat het verschil is. Alle drie
      // fout volgens het overleg met Pascal. Ze volgen nu de begrippen uit SOORTEN, en
      // het uitgewerkte verschil staat op /werkwijze/ - daar is het ook de tekst waarmee
      // die pagina moet ranken (zie README, "Zoekwoorden").
      q1: 'Wat is renovliesbehang precies?',
      a1:
        'Behang dat op de wand geplakt wordt en waar daarna over getext wordt. Het is dik ' +
        'en stevig: Pascal gebruikt 215 gram per m2, waar de meeste bedrijven 165 gram ' +
        'gebruiken. Daardoor komen er geen krimpscheurtjes in.',
      q2: 'Waarom renovliesbehang bij een nieuwbouwwoning?',
      a2:
        'Nieuwbouw droogt de eerste jaren nog na, en daarbij ontstaan kleine ' +
        'krimpscheurtjes in de wanden. ' +
        'Renovliesbehang en glasweefselbehang zijn scheuroverbruggend, zodat die ' +
        'scheurtjes onzichtbaar blijven.',
      q3: 'Kan ik later een andere kleur kiezen?',
      a3:
        // De slotzin is woordelijk van hem uit 2018. Hij is op 25-10-2026 een ronde
        // weg geweest, omdat ik Armando's intrekking van 18:33 las als "het
        // prijsargument helemaal eruit". Pascal streepte alleen de vergelijking met
        // stucen of schilderen door; zie de noot bij usp.d_t.
        'Ja. Een wand met renovliesbehang of glasweefselbehang kan ten alle tijden ' +
        'overgetext worden, zonder dat er eerst scheurtjes gerepareerd moeten worden. ' +
        'Dat maakt het relatief goedkoop.',
      q4: 'Wat is het verschil met glasweefselbehang en vliesbehang?',
      a4:
        'Renovliesbehang en glasweefselbehang gaan allebei op de wand en worden daarna ' +
        'getext; bij glasweefselbehang blijft het patroon zichtbaar, ook na het texen. ' +
        'Vliesbehang is gewoon behang, in alle soorten en maten. Op de werkwijzepagina ' +
        'staan de drie naast elkaar.',
      q5: 'Vanaf hoeveel wand gelden deze prijzen?',
      a5:
        'Vanaf 100 m2. Heeft u minder wand, vraag dan vrijblijvend naar informatie of prijzen.',
      q6: 'Komt Pascal ook buiten Drenthe?',
      // Twee werkgebieden, en de grens ertussen is de 100 m2. De eerste zin is van hem
      // (advertentie), de tweede is doorgegeven via Armando op 20-10-2026.
      a6:
        'Vanaf 100 m2 plakt hij in heel Nederland. Onder de 100 m2 werkt hij binnen 30 ' +
        'kilometer van Coevorden. Tijdig reserveren is gewenst.',
      q7: 'Wanneer moet ik betalen?',
      a7: 'Geen betalingen vooruit, pas als de werkzaamheden zijn verricht.',
      q8: 'Val ik onder het lage btw-tarief?',
      a8: 'Woningen van 2 jaar en ouder vallen in de 9% btw-regeling. De prijzen zijn ex btw.',
      q9: 'Doet Pascal ook gewoon schilderwerk?',
      a9: 'Ja. Binnen- en buitenschilderwerk en sauswerk op plafonds en wanden horen er allemaal bij.',
      q10: 'Hoe snel kan het ingepland worden?',
      a10: 'Dat hangt van de planning af. Tijdig reserveren is gewenst, dus vraag op tijd een prijs op.',
      q11: 'Zit het schuren in de prijs?',
      // De tweede zin beweerde tot 25-10-2026 het omgekeerde van wat Pascal doet: dat
      // hij een wand die nog niet behangklaar is zelf behangklaar maakt. Zie b1_a op
      // /werkwijze/ en pascal-whatsapp-25-10-2026.txt.
      a11:
        'Ja. Schuren, lichte reparaties en voorstrijken zitten in de prijs. Pascal ' +
        'loopt een behangklare wand na met een wandschuurmachine voor een nog gladder ' +
        'eindresultaat en repareert daarbij de laatste kleine beschadigingen.',
      // Nieuw op 25-10-2026, en de belangrijkste vraag die de site tot vandaag verkeerd
      // beantwoordde. Pascal zette er zelf twee uitroeptekens achter, dus hij hoort niet
      // alleen in een alinea op de tweede pagina maar ook hier, waar iemand hem stelt.
      q13: 'Moeten mijn wanden behangklaar zijn?',
      a13:
        'Ja. Pascal plakt op een behangklare wand; wanden die dat niet zijn, maakt hij ' +
        'niet behangklaar. Zijn ze wel behangklaar opgeleverd, dan loopt hij ze eerst ' +
        'na: door timmermannen, elektriciens en keukenbouwers raken wanden nog wel eens ' +
        'beschadigd.',
      // Tot 20-10-2026 vraag 8 in de README: welk merk verf, en mag dat genoemd worden?
      // Armando gaf het antwoord, dus de vraag staat nu op de pagina in plaats van op
      // de lijst. Twee keer texen krijgt hier zijn eigen regel, want dat is het verschil
      // tussen de 16 en de 23 euro en dus de vraag die de rekenhulp oproept.
      // Tot 25-10-2026 stond hier dat Anti Marks en Easy Clean samen aangebracht kunnen
      // worden bij twee keer texen. Onjuist: er wordt EEN coating gekozen (overleg met
      // Pascal). Het aantal keer texen en de keuze van de coating zijn daarmee twee
      // losse dingen, en dat moet de vraag ook zeggen - anders leest 23 euro als "dan
      // krijg ik ze allebei".
      // "Op aanvraag" voor Pure Mat is op 25-10-2026 geschrapt (streep van Armando,
      // zelfde beweging als de vlag op de kaart eerder die dag): de zin zegt dat u er
      // EEN kiest uit drie, en dan zet "op aanvraag" de derde buiten die keuze. Zie
      // AANVRAAG_UIT in controleer.mjs - dat geldt voor beide paginas.
      q12: 'Met welke coating wordt er getext?',
      a12:
        'Met Sikkens, en u kiest er een: Alpha Rezisto Anti Marks tegen strepen en vegen, ' +
        'Alpha Rezisto Easy Clean voor een afneembare wand, of Alphacryl Pure Mat SF voor ' +
        'een extreem matte wand. Hoe vaak er getext wordt, een of twee keer, is een ' +
        'aparte keuze.',
    },

    offerte: {
      boven: 'Offerte',
      kop: 'Vraag vrijblijvend een prijs op',
      lead: 'Vul in wat u weet. Pascal belt of appt u terug met een prijs.',
      naam: 'Uw naam',
      plaats: 'Plaats',
      tel: 'Telefoon',
      m2: 'Ongeveer aantal m2',
      soort: 'Wat heeft u nodig?',
      // Dezelfde drie pakketten als in de rekenhulp, met "1x texen" en "2x texen"
      // woordelijk erin: iemand die daar "2x texen" heeft aangeklikt moet dat hier
      // terugvinden, anders kiest hij in het formulier per ongeluk iets anders dan hij
      // net uitrekende.
      //
      // De lijst is op 25-10-2026 herzien (Armando: "beetje rare opties", met een
      // schermfoto van de uitgeklapte keuzelijst). Twee dingen waren raar:
      //  - de eerste optie noemde het materiaal en de twee eronder niet, dus "Plakken
      //    en 1x texen" leek een andere dienst in plaats van hetzelfde met een stap
      //    erbij. Alle drie noemen nu renovliesbehang.
      //  - glasweefselbehang en gewoon behangwerk ontbraken, terwijl de site ze sinds
      //    het soortenblok van vanochtend als volwaardige keuzes naast elkaar zet. Wie
      //    glasweefsel wil moest dus "Weet ik nog niet" aanklikken.
      // "Weet ik nog niet" staat nu onderaan: het is de uitweg en geen dienst, en
      // tussen de concrete opties in las het als een vierde product.
      soort1: 'Renovliesbehang plakken',
      soort2: 'Renovliesbehang plakken en 1x texen',
      soort3: 'Renovliesbehang plakken en 2x texen',
      soort4: 'Glasweefselbehang plakken en texen',
      soort5: 'Behangen met vliesbehang',
      soort6: 'Schilderwerk binnen of buiten',
      soort7: 'Weet ik nog niet',
      bericht: 'Waar gaat het om?',
      berichtHulp: 'Bijvoorbeeld: nieuwbouw, woonkamer en hal, oplevering in maart.',
      // Het e-mailadres is er bij de verhuizing van 26-10-2026 bij gekomen. Het
      // formulier verstuurde tot die dag niets: het bundelde de antwoorden tot een
      // WhatsApp- of mailbericht en opende dat venster. Nu gaat de aanvraag echt weg,
      // en dan is een adres nodig - niet voor ons, maar omdat de bezoeker zelf een
      // bevestiging terugkrijgt met wat hij heeft ingevuld.
      mail: 'E-mail',
      knopVerstuur: 'Verstuur de aanvraag',
      // De WhatsApp-knop blijft staan als tweede weg en niet als de eerste. Hij vult
      // nog steeds hetzelfde bericht voor; wie liever appt dan een formulier invult
      // hoeft zijn gegevens niet twee keer te typen.
      knopWa: 'Liever via WhatsApp',
      bezig: 'Bezig met versturen',
      gelukt: 'Uw aanvraag is binnen. U krijgt er een bevestiging van per mail, en Pascal neemt contact met u op.',
      mislukt: 'Het versturen lukte niet. Probeer het nog eens, of app of bel Pascal rechtstreeks.',
      bellen: 'Liever direct bellen?',
      // Deze regel stond er tot 26-10-2026 als "Uw gegevens gaan rechtstreeks naar
      // Pascal en worden nergens anders opgeslagen". Dat was waar zolang het formulier
      // niets verstuurde en alleen een WhatsApp-venster opende. Sinds de verhuizing
      // gaat de aanvraag door onze Worker, komt er een mail bij Pascal en een
      // bevestiging bij de bezoeker, en wordt de aanvraag opgeslagen. Dezelfde zin
      // laten staan zou een onwaarheid zijn op de enige plek waar de site over
      // privacy spreekt - en nog wel op het moment dat iemand zijn gegevens afgeeft.
      privacy: 'Uw gegevens gebruiken we alleen om uw aanvraag te beantwoorden. U krijgt een kopie per mail.',
    },

    // De 404, erbij op 26-10-2026 bij de verhuizing. Hij bestaat omdat
    // `not_found_handling` in wrangler.jsonc op "404-page" staat: zonder bestand geeft
    // Workers Assets dan een kale foutmelding, en met de andere instelling zou een
    // onbekend adres de startpagina met status 200 uitleveren - wat Google als een
    // soft 404 leest. Deze pagina staat altijd op noindex en nooit in de sitemap.
    nf: {
      titel: 'Deze pagina bestaat niet',
      kop: 'Deze pagina bestaat niet',
      // Geen aantal in deze regel. Hij zei eerst "de twee pagina's van de site", en de
      // bronpoort gooide daarop ("getal zonder merk") - terecht, en om een tweede reden
      // die de poort niet kan weten: een derde pagina maakt dat getal stil onwaar.
      lead: 'Het adres klopt niet meer, of er is een letter weggevallen. Hieronder komt u verder.',
      naarHome: 'Naar de startpagina',
      naarWerkwijze: 'Zo werkt het',
    },

    slot: {
      kop: 'Klaar voor een strakke wand zonder scheurtjes?',
      lead: 'Vraag vrijblijvend naar informatie of prijzen.',
      knop: 'Offerte aanvragen',
    },

    // ------------------------------------------------- tweede pagina: /werkwijze/
    // Tegenhanger van renovliesdirect.nl/werkwijze/ (verzoek Armando, 20-10-2026).
    // Die pagina werkt vijf technische stappen uit: egaliseren en schuren met een
    // wandschuurmachine, 200-grams vlies, naden opvullen, naden afkitten, sausen met
    // een genoemd verfmerk. Daarvan staat niets in Pascal zijn eigen tekst, dus het
    // staat ook niet op deze pagina; zie README.md, "Wat hier bewust NIET staat".
    // Wat hij zelf wel opschrijft is de route van aanvraag tot oplevering, en dat is
    // waar deze pagina uit bestaat.
    // Deze pagina moet gaan ranken voor renovlies (verzoek Armando, 25-10-2026). Wat
    // dat betekent is gemeten en niet aangenomen, en de meting draaide het verzoek
    // half om - zie README, "Zoekwoorden". Kort: de rij op "renovlies" (8.100) en
    // "renovliesbehang" (14.800) bestaat uit webshops die rollen verkopen (Hornbach,
    // Praxis, Gamma, Karwei, behangloods, glasvezelbehang.nl), met een kaartblok
    // erboven op "renovlies". Dat is de categorie van een verkoper, niet van een
    // schilder, en geen pagina verandert een categorie.
    //
    // Wat deze pagina WEL kan winnen is het vraagcluster, en daar staat geen webshop
    // bovenaan en geen kaartblok boven: "wat is renovlies" (260, alleen uitlegpagina's),
    // "renovlies of glasweefsel" (30, alleen vergelijkingen), "renovlies of vliesbehang"
    // (30), "renovlies dikte" (20), "renovlies gram", "krimpscheuren nieuwbouw" (110),
    // "muren glad maken" (1.300) en "texen" (590). Dat is precies de inhoud die Armando
    // diezelfde dag vroeg: een blok dat de drie soorten uit elkaar houdt. De twee
    // verzoeken vallen samen, en de pagina is daarop gebouwd.
    //
    // Let op wat dat betekent voor de startpagina: die houdt het kopwoord
    // (renovliesbehang + Coevorden) en deze pagina gaat er niet mee concurreren. Twee
    // pagina's op hetzelfde woord wegen elkaar weg.
    werkwijze: {
      titel: 'Renovliesbehang: wat is het en hoe werkt het | Hulskers Schilderwerken',
      omschrijving:
        'Wat renovliesbehang is, het verschil met glasweefselbehang en vliesbehang, en ' +
        'hoe Pascal Hulskers het aanbrengt: 215 gram, scheuroverbruggend, met zijn prijzen.',
      kruimelHome: 'Startpagina',
      boven: 'Werkwijze',
      h1a: 'Renovliesbehang: wat het is',
      h1b: 'en hoe het bij Pascal gaat',
      lead:
        'Wat renovliesbehang, glasweefselbehang en vliesbehang van elkaar onderscheidt, ' +
        'wat er aan uw wand gebeurt en in welke volgorde, en wanneer u betaalt.',

      // ---------------------------------------------- de drie soorten naast elkaar
      // Het blok waar Armando op 25-10-2026 om vroeg: "we need to have a section
      // whereby it explains the differences". De drie definities komen woordelijk uit
      // het overleg met Pascal; de gramgewichten zijn zijn getallen.
      //
      // Vorm: drie kaarten naast elkaar, in de volgorde waarin een bezoeker ze tegen
      // het lichaam houdt - eerst waar hij voor kwam, dan de buur die erop lijkt, dan
      // het woord waarmee hij ze verwart. Onder de rij de reden waarom de eerste twee
      // goedkoper uitvallen dan stucen of schilderen, want dat is het antwoord op
      // "waarom zou ik dit nemen" en het staat nergens anders op de site.
      sBoven: 'De drie soorten',
      sKop: 'Renovliesbehang, glasweefselbehang of vliesbehang?',
      // sLead stond hier tot 25-10-2026: "Ze worden door elkaar gebruikt, ook door
      // bedrijven die ze aanbrengen. Dit is het verschil, en Pascal plakt alle drie."
      // Doorgestreept door Armando. De kop stelt de vraag al en de drie kaarten geven
      // het antwoord; dat hij alle drie plakt staat in het vakmanblok op de startpagina.

      s_a_kop: 'Renovliesbehang',
      s_a_wat: 'Behang op de wand, daarna texen',
      s_a_b:
        'Behang dat op de wand geplakt wordt en waar daarna over getext wordt. Pascal ' +
        'gebruikt 215 gram per m2, waar de meeste bedrijven 165 gram gebruiken. Het is ' +
        'daardoor dik en stevig, en scheuroverbruggend: er komen geen krimpscheurtjes in.',
      // s_a_vlag / s_b_vlag / s_c_vlag stonden hier tot 25-10-2026 als vlaggetje in
      // kapitalen boven elke kaart (SCHEUROVERBRUGGEND, PATROON BLIJFT ZICHTBAAR,
      // NIET OM OVER TE TEXEN). Alle drie doorgestreept door Armando. Ze zeiden in
      // hoofdletters wat de alinea eronder in gewone zinnen zegt, dus het blok las
      // het onderscheid twee keer voor.

      s_b_kop: 'Glasweefselbehang',
      s_b_wat: 'Behang op de wand, daarna texen',
      s_b_b:
        'Gaat net als renovliesbehang op de wand en wordt daarna getext, en is ook ' +
        'scheuroverbruggend. Het verschil zit in het aanzien: het is als echt behang met ' +
        'een patroon, en dat patroon blijft u zien, ook als er getext of geschilderd over is.',

      s_c_kop: 'Vliesbehang',
      s_c_wat: 'Gewoon behang',
      // Deze twee zinnen zijn op 25-10-2026 om 20:01 woordelijk aangeleverd door de
      // klant ("Deze tekst mag aangepast worden naar deze"), met een schermfoto van
      // precies deze kaart erbij. Alleen de opsomming is uit zijn kapitalen en zijn
      // streepje gehaald ("zowel Effen - Patroon of Fotobehang"), want dat streepje is
      // de vorm waar de ai-poort op afgaat en kapitalen midden in een zin leest een
      // bezoeker als nadruk die er niet is.
      //
      // Wat zijn versie NIET meer zegt: "er wordt niet over getext en het overbrugt
      // geen scheurtjes". Dat was de zin die het onderscheid hardop maakte. Hij staat
      // er niet voor terug, want hij schreef deze kaart zelf opnieuw - maar het
      // onderscheid zelf is niet weg: de twee kaarten hiernaast dragen "Behang op de
      // wand, daarna texen" als hun wat-regel, deze draagt "Gewoon behang", en
      // vragen.a4 op de startpagina zegt het nog voluit. Zie NALEZEN-PASCAL.md.
      s_c_b:
        'Normaal behang: effen, met patroon of fotobehang. Pascal behangt hier ook mee, ' +
        'het doet net iets anders met het aanzicht dan de twee soorten behang hiernaast.',

      // sVoet stond hier tot 25-10-2026: "Renovliesbehang en glasweefselbehang vallen
      // goedkoper uit dan stucen of schilderen, omdat er geen scheurtjes in komen die
      // eerst gerepareerd moeten worden voordat er een andere kleur over kan. Dat
      // herstelwerk valt dus weg." Die zin kwam woordelijk uit de notulen van het
      // overleg van diezelfde dag, en Pascal haalde hem er zelf weer uit toen hij hem
      // op de pagina zag ("Deze mag er wel uit."). De vergelijking met stucen of
      // schilderen staat daarmee nergens meer; controleer.mjs 15e is de bodem.
      // Wat blijft is zijn eigen regel uit 2018: een wand die eenmaal geplakt is kan
      // altijd weer overgetext worden, en dat maakt het relatief goedkoop. Die staat
      // een blok verderop (b3_b), een keer. Weg is dus de VERGELIJKING en niet het
      // woord - ik had dat op 25-10-2026 een ronde te breed opgevat en alle drie de
      // plekken met "goedkoop" geschrapt (zie usp.d_t voor de hele gang).
      // Onze eigen formulering van de toekomstkant ("elke volgende kleur goedkoper")
      // blijft er wel uit: die kwam van ons, niet van hem (Armando 18:33).

      stapBoven: 'In zes stappen',
      stapKop: 'Van aanvraag tot oplevering',
      s1_t: 'U vraagt vrijblijvend een prijs op',
      s1_b: 'Bellen, appen of het formulier invullen. Vertel om wat voor wanden het gaat.',
      s2_t: 'Pascal kijkt wat er nodig is',
      s2_b: 'Welke wandafwerking bij uw wanden past, en hoeveel wand het is.',
      s3_t: 'U krijgt een duidelijke offerte',
      s3_b: 'Zwart op wit wat het kost, inclusief materiaal.',
      s4_t: 'Het werk wordt ingepland',
      s4_b: 'Tijdig reserveren is gewenst, dus vraag op tijd een prijs op.',
      s5_t: 'Plakken en texen',
      // Tot 25-10-2026 stond vliesbehang in deze opsomming, en dat is precies de fout
      // die het overleg aanwees: vliesbehang wordt niet getext.
      s5_b: 'Renovliesbehang of glasweefselbehang op de wand, daarna texen in uw kleur.',
      s6_t: 'Oplevering, daarna de rekening',
      s6_b: 'Geen betalingen vooruit, pas als de werkzaamheden zijn verricht.',

      // Dit blok ging twee rondes over de keuze van de wandafwerking, omdat er tot
      // 20-10-2026 "Dat is het punt waar Pascal begint" stond bij een behangklaar
      // opgeleverde wand. Dat was onze zin: zijn advertentie noemt die wand als
      // situatie van de klant en zegt niets over wie het voorwerk doet, dus hij ging
      // eruit. Armando gaf diezelfde dag het antwoord: Pascal doet egaliseren, schuren
      // en voorstrijken zelf, indien nodig. Daarmee gaat dit blok weer over het
      // voorwerk - de eerste vraag van iemand met een kale of beschadigde wand - en
      // verhuist de keuze naar b2, waar hij hoort. Doorgegeven tekst, dus bron ARM.
      b1_boven: 'Het voorwerk',
      // "Muren glad maken" is met 1.300 per maand het grootste woord dat deze pagina
      // realistisch kan winnen (gemeten 25-10-2026, geen webshop en geen kaartblok
      // bovenaan). De kop was "Muren glad maken, dan het vlies" en dat beloofde precies
      // wat Pascal op 25-10-2026 met twee uitroeptekens afwees: een wand die niet
      // behangklaar is, maakt hij niet behangklaar. Het zoekwoord blijft staan, maar
      // de grens staat nu in dezelfde regel - anders komt er iemand op af met een kale
      // of gestuukte wand en moet hij die aanvraag weigeren.
      b1_kop: 'Muren glad maken op een behangklare wand',
      // Dit blok is drie keer verkeerd geweest en dit is de versie van Pascal zelf
      // (zie pascal-whatsapp-25-10-2026.txt). De oude tekst stond het omgekeerde te
      // beweren: dat hij een wand die nog niet behangklaar was eerst behangklaar maakt.
      // Wat hij doet is een wand die AL behangklaar is nog gladder maken.
      b1_a:
        'Uw wanden moeten behangklaar zijn. Zijn ze dat, dan loopt Pascal ze langs met ' +
        'een wandschuurmachine voor een nog gladder eindresultaat, en repareert hij de ' +
        'laatste kleine beschadigingen of strijkt hij voor waar dat nodig is. Schuren, ' +
        'lichte reparaties en voorstrijken zitten in de prijs.',
      // Dit blok heeft sinds 25-10-2026 maar EEN alinea, en wBlokken in build.mjs zakt
      // als er hier alsnog een b1_b bijkomt zonder dat die daar ook geteld wordt.
      // Geschiedenis van de tweede alinea, want hij is twee keer vervangen en een keer
      // geschrapt: eerst "Hij kijkt bij u welke wandafwerking het beste past..." (dat
      // zei Pascal dubbel, de keuze staat in het soortenblok bovenaan en in stap 2),
      // daarna de grens zelf ("Wanden die niet behangklaar zijn, maakt hij niet
      // behangklaar. Opgeleverde wanden loopt hij wel na: door timmermannen,
      // elektriciens en keukenbouwers raken ze nog wel eens beschadigd."). Armando
      // streepte die op 25-10-2026 door: de eerste regel van b1_a zegt al dat de wanden
      // behangklaar moeten zijn, dus de grens stond er twee keer in vier regels. Zijn
      // reden waarom een OPGELEVERDE wand toch nalopen moet, staat nog wel in het
      // vakmanblok op de startpagina (sVakman.b) - die streep ging alleen over deze
      // pagina. De grens zelf blijft een eis: controleer.mjs 13b5 vraagt om "wanden
      // moeten ... behangklaar zijn" en 13b zakt op elke zin die het omgekeerde beweert.

      // Dit blok ging tot 25-10-2026 over de keuze tussen de drie soorten, en dat is
      // sindsdien een eigen sectie bovenaan deze pagina (en een uitgebreidere). Wat
      // hier overblijft is de reden dat iemand hiernaar zoekt: de krimpscheurtjes in
      // nieuwbouw. Gemeten woorden: "krimpscheuren nieuwbouw" (110) en "scheuren in de
      // muur nieuwbouw".
      b2_boven: 'Nieuwbouw',
      b2_kop: 'Krimpscheurtjes die u niet meer ziet',
      // "Een nieuwbouwwoning gaat werken" stond hier tot 25-10-2026. Vaktaal: een
      // aannemer weet wat het betekent, een bewoner leest er een huis dat iets doet.
      // Zelfde reden bij vragen.a2, waar dezelfde uitleg in het kort staat.
      // De slotzin ("Renovliesbehang van 215 gram is daarbij dikker dan de 165 gram die
      // de meeste bedrijven gebruiken") is er op 25-10-2026 uit op aanwijzing van
      // Armando. De twee gramgewichten staan op deze pagina al in de kaart van
      // renovliesbehang, vier blokken hoger - dit blok gaat over de krimpscheurtjes en
      // niet over de dikte. Ze blijven dus gewoon op beide pagina's staan
      // (controleer.mjs 15b en 15c zijn daar de bodem); alleen deze herhaling is weg.
      b2_a:
        'Een nieuwbouwwoning droogt de eerste jaren nog na, en daar komen kleine ' +
        'krimpscheurtjes van in de wanden. ' +
        'Renovliesbehang en glasweefselbehang zijn scheuroverbruggend, zodat die ' +
        'scheurtjes niet meer zichtbaar zijn.',
      // Tot 25-10-2026 stond hier dezelfde vergelijking met stucen of schilderen als in
      // sVoet, en die is er op aanwijzing van Pascal uit. Dat hij hem maar op een plek
      // doorstreepte betekent niet dat hij er op de andere wel mag staan: een fout die
      // op twee plekken staat komt op een derde terug (zie playground/CLAUDE.md).
      // Wat hij WEL zelf zegt ("relatief goedkoop", omdat de wand altijd weer
      // overgetext kan worden) staat er nog, maar zonder vergelijking: zie usp.d_t,
      // vragen.a3 en b3_b, en controleer.mjs 15e voor de grens ertussen.
      b2_b:
        'Zijn uw wanden behangklaar opgeleverd, nieuwbouw of bestaande woning, dan kan ' +
        'het vlies er zo op. Renovliesbehang kan bovendien zonder naden geplakt worden, ' +
        'dus u ziet geen overgangen in de wand.',

      b3_boven: 'De afwerking',
      b3_kop: 'Texen in uw kleur',
      // Hier hoort het verfmerk: dit blok gaat over wat er na het plakken op de wand
      // komt. Een keer of twee keer texen is het verschil tussen de 16 en de 23 euro,
      // en de twee Sikkens-coatings horen bij die tweede laag (doorgegeven via
      // Armando, 20-10-2026). De eigenschappen staan niet hier maar in het blok op de
      // startpagina, met de fabrikant als bron.
      // Tot 25-10-2026 stond hier dat de twee coatings samen aangebracht kunnen worden
      // bij twee keer texen. Onjuist (overleg met Pascal): er wordt EEN gekozen. Dit
      // was ook de plek die Armando bij naam noemde ("Werkwijze de afwerking niet beide
      // tex opties maar of"). Het aantal keer texen en de keuze van de coating staan nu
      // als twee losse zinnen, want het zijn twee losse keuzes.
      b3_a:
        'Na het plakken wordt de wand getext in de kleur die u kiest, een of twee keer. ' +
        'Pascal text met Sikkens en u kiest daarbij een van de drie coatings: Alpha ' +
        'Rezisto Anti Marks, Alpha Rezisto Easy Clean of Alphacryl Pure Mat SF. ' +
        'Kleuradvies hoort erbij.',
      // De slotzin is zijn eigen formulering uit 2018 en staat hier weer na twee
      // rondes op 25-10-2026: eerst "elke volgende kleur is daarmee goedkoper dan de
      // eerste" (onze formulering, op verzoek van Armando om 16:00), daarna helemaal
      // weg omdat ik zijn intrekking van 18:33 te breed las. Zie de noot bij usp.d_t.
      // Wat hier NIET staat is de vergelijking met stucen of schilderen: die heeft
      // Pascal zelf doorgestreept, en die stond in sVoet en b2_b.
      b3_b:
        'Wilt u er later een andere kleur op? Een wand die eenmaal voorzien is van ' +
        'renovliesbehang of glasweefselbehang kan ten alle tijden overgetext worden: ' +
        'het plakwerk blijft liggen, er komt alleen nog een texbeurt overheen. Dat ' +
        'maakt het relatief goedkoop.',

      afsprBoven: 'Prijs en afspraken',
      afsprKop: 'Wat het kost en wanneer u betaalt',
      // De bedragen gingen op 25-10-2026 omhoog (overleg met Pascal): 10 naar 11 en 16
      // naar 17,50. Die twee komen daarmee niet meer uit zijn advertentie van 2018.
      a1_t: 'Plakken',
      a1_b: 'Renovliesbehang of glasweefselbehang plakken kost vanaf 11 euro per m2, inclusief behang en lijm.',
      a2_t: 'Plakken en 1x texen',
      a2_b: 'Plakken en een keer texen is een totaalprijs vanaf 17,50 euro per m2, inclusief alle materialen.',
      // Achtste afspraak sinds 20-10-2026, doorgegeven via Armando: de 23 euro staat
      // niet in zijn advertentie en de 16 euro bleek een keer texen te zijn. Hij staat
      // direct achter a2, want de twee bedragen zijn alleen naast elkaar te begrijpen.
      //
      // Tot 25-10-2026 stond hier "in die prijs kunnen de twee Sikkens-coatings samen
      // aangebracht worden". Onjuist (overleg met Pascal), en de tweede plek die Armando
      // bij naam noemde ("Wat het kost > ook weer of en niet beide"). Twee keer texen is
      // twee lagen; welke coating erin gaat is een losse keuze uit drie.
      a8_t: 'Plakken en 2x texen',
      a8_b:
        'Twee keer texen is een totaalprijs vanaf 23 euro per m2. U kiest daarbij een van ' +
        'de drie Sikkens-coatings, niet twee.',
      a3_t: 'Prijzen vanaf 100 m2',
      a3_b:
        'De genoemde prijzen gelden vanaf 100 m2. Heeft u minder wand? Vraag vrijblijvend ' +
        'naar informatie of prijzen.',
      a4_t: 'Btw',
      a4_b: 'De prijzen zijn ex btw. Woningen van 2 jaar en ouder vallen in de 9% btw-regeling.',
      a5_t: 'Betalen',
      a5_b: 'Geen betalingen vooruit, pas als de werkzaamheden zijn verricht.',
      a6_t: 'Werkgebied',
      // Tweede zin doorgegeven via Armando, 20-10-2026. Zijn advertentie noemt alleen
      // het gebied vanaf 100 m2 en laat open wat daaronder gebeurt.
      a6_b:
        'Vanaf 100 m2 plakt Pascal in heel Nederland. Onder de 100 m2 werkt hij binnen ' +
        '30 kilometer van Coevorden. Tijdig reserveren is gewenst.',
      // Zevende afspraak sinds 20-10-2026, doorgegeven via Armando. Hij staat tussen de
      // prijzen en de btw omdat hij over hetzelfde bedrag gaat: wat er al in zit.
      a7_t: 'Inbegrepen',
      // Wat "schuren" hier is, is op 25-10-2026 scherp geworden: nalopen met de
      // wandschuurmachine op een wand die al behangklaar is, en niet het behangklaar
      // maken van een wand die dat niet is. Voorstrijken stond tot 25-10-2026 achter
      // een puntkomma en bewust NIET in de opsomming van wat in de prijs zit, want dat
      // was niet gezegd. Armando gaf die avond door dat het er wel in zit, dus het
      // staat nu in de eerste zin - en de tweede zegt nog steeds wat het inhoudt.
      a7_b:
        'Schuren, lichte reparaties en voorstrijken zitten in de prijs. Schuren is nalopen met de ' +
        'wandschuurmachine op een al behangklare wand; voorstrijken doet Pascal waar ' +
        'dat nodig is.',
      rekenKnop: 'Zelf een richtprijs berekenen',

      // Onder het citaat stond een naregel over de volgorde van deze pagina. Weg op
      // 20-10-2026 (doorgestreept door Armando): een zin die uitlegt hoe de pagina is
      // opgebouwd gaat over ons en niet over zijn werk.

      slotKop: 'Nog een vraag over renovlies?',
      slotLead: 'Vraag vrijblijvend naar informatie of prijzen.',
      vragenKnop: 'Bekijk de veelgestelde vragen',
    },

    voet: {
      over: 'Renovliesbehang, glasweefselbehang en vliesbehang, binnen- en buitenschilderwerk en sauswerk op plafonds en wanden.',
      diensten: 'Diensten',
      // "Renovlies en vliesbehang" op een regel zette de twee op een hoop, en dat is
      // precies de verwarring die het overleg van 25-10-2026 opruimde. Nu drie regels.
      d1: 'Renovliesbehang',
      d1b: 'Vliesbehang',
      d2: 'Glasweefselbehang',
      d3: 'Sauswerk plafonds en wanden',
      d4: 'Binnenschilderwerk',
      d5: 'Buitenschilderwerk',
      contact: 'Contact',
      kvkLabel: 'KVK',
      rechten: 'Pascal Hulskers Schilderwerken',
    },
  },
}

// --------------------------------------------------------------------- merken
//
// Per sleutel: waar de bewering vandaan komt.
//   eigen     woordelijk van hem
//   afgeleid  zijn feiten, onze woorden (elk getal moet in zijn zin staan)
//   stem      onze woorden in zijn ik-vorm, nooit met een getal
//   feit      narekenbaar registergegeven met een bron
//   ons       van ons, geen bewering over hem
//   bezoeker  de ik is de lezer
//
// Registergegevens (adres, KVK, telefoon) staan als `feit` met het uittreksel als
// bron. Ze gaan daarmee naar de nalooplijst, en dat is precies de bedoeling: een
// verkeerd telefoonnummer op een site is de duurste fout die er is.
const MP = 'bron/zijn-tekst/marktplaats-advertentie.txt'
const KVK = 'bron/zijn-tekst/kvk-en-vindplaatsen.txt'
// Doorgegeven via Armando, niet van Pascal zelf op schrift. Eigen bron-constante zodat
// elke regel die hierop rust als zodanig op de nalooplijst komt: Armando spreekt hem,
// dus het is geen gok, maar het is ook niet zijn eigen formulering.
const ARM = 'bron/zijn-tekst/doorgegeven-armando.txt (doorgegeven via Armando, 20-10-2026)'
// Tweede doorgegeven regel, vijf dagen later en op een punt in tegenspraak met de
// eerste: voorstrijken zit wel in de prijs. Eigen constante en een eigen bestand, want
// een bron die zichzelf tegenspreekt moet dat zichtbaar doen - niet als bijzin in de
// kop van het oudere bestand.
const ARM2 = 'bron/zijn-tekst/doorgegeven-armando-25-10-2026.txt (doorgegeven via Armando, 25-10-2026)'
// Derde doorgegeven regel: de openingstijden, voor de structured data. Eigen constante
// en eigen bestand om dezelfde reden als ARM2 - die twee bestanden dragen een kop met
// wat er achterhaald is, en een nieuwe regel eronder plakken maakt zo'n kop onleesbaar.
const ARM3 = 'bron/zijn-tekst/doorgegeven-armando-27-10-2026.txt (doorgegeven via Armando, 27-10-2026)'
// Zijn eigen Google-bedrijfsprofiel, geclaimd en door hem ingericht, gemeten met
// bron/gbp.mjs. Sterker dan ARM3: wat daar staat publiceert hij zelf over zijn eigen
// zaak, net als zijn Marktplaats-advertentie, en het is narekenbaar. De openingstijden
// rusten daarom niet meer op de doorgegeven regel en staan niet meer op de nalooplijst.
//
// Let op bij het hergebruiken: de OMSCHRIJVING in dat profiel is woordelijk de copy van
// deze site. Die staat met opzet niet in het bronbestand - anders verantwoordt onze
// eigen tekst zichzelf en is de poort er een die zichzelf de hand boven het hoofd houdt
// (de val van cdlf, 09-10-2026). Alleen de zaakgegevens staan erin.
const GPROF = 'bron/zijn-tekst/google-profiel-27-10-2026.txt (zijn eigen Google-bedrijfsprofiel, geclaimd, gemeten 27-10-2026)'
// De fabrikant. Dit bestand staat BEWUST buiten bron/zijn-tekst: het is de tekst van
// AkzoNobel en niet van Pascal, dus het mag geen woord in een zin van hem dekken. Wat
// de verf doet is daarmee een `feit` met een eigen bron, en dat Pascal ermee werkt is
// een aparte bewering op ARM. Twee bronnen, twee regels op de nalooplijst.
const SIK = 'bron/sikkens-producten.txt (fabrikant, sikkens.nl, nagekeken 20-10-2026)'
// Notulen van een overleg MET Pascal, 25-10-2026, doorgegeven door Armando. Sterker dan
// ARM (dat was van horen zeggen uit een los gesprek) en sterker dan MP waar ze elkaar
// tegenspreken, want het is het nieuwste en Pascal legde er de begrippen zelf uit. Nog
// steeds niet zijn eigen schrift, dus elke regel hierop gaat naar de nalooplijst.
const OVL = 'bron/zijn-tekst/overleg-pascal-25-10-2026.txt (notulen overleg met Pascal, 25-10-2026)'
// Pascal zelf, op schrift, over deze pagina's: hij las de site na en corrigeerde regel
// voor regel in WhatsApp (doorgestuurd door Armando op 25-10-2026). Dit is de sterkste
// bron in het korpus en gaat voor op alle andere - ook op de notulen van datzelfde
// overleg, want daar schreef iemand anders op wat hij zei. Hij schreef het wel als
// correctie in een chat en niet als copy, dus het gaat nog gewoon naar de nalooplijst.
const PAS = 'bron/zijn-tekst/pascal-whatsapp-25-10-2026.txt (Pascal zelf in WhatsApp, 25-10-2026)'
// Een regel die half uit zijn advertentie en half uit wat Armando doorgaf bestaat.
// Zo'n regel moet op de nalooplijst allebei de bronnen dragen, anders staat er een
// doorgegeven zin achter een label dat naar zijn eigen tekst wijst.
const MP_ARM = MP + ' + ' + ARM
const MP_OVL = MP + ' + ' + OVL
const ARM_OVL = ARM + ' + ' + OVL
// Wat er in de prijs zit is doorgegeven (ARM); hoe het voorwerk er echt uitziet schreef
// Pascal zelf (PAS). Twee bronnen in een regel, dus allebei op de nalooplijst.
const ARM_PAS = ARM + ' + ' + PAS
// De fabrikant, ingeperkt door Pascal. Anti Marks en Easy Clean dragen dit en niet SIK
// alleen: de claim komt van AkzoNobel, maar de grens eromheen (koffers geven wel schade,
// ketchup in de keuken) is van de man die het aanbrengt.
const SIK_OVL = SIK + ' + ' + OVL

export const MERKEN = {
  'nl.titel': { merk: 'ons' },
  'nl.omschrijving': { merk: 'afgeleid', bron: MP_OVL },

  'nl.hero.lead': { merk: 'afgeleid', bron: MP_OVL },
  'nl.hero.punt1': { merk: 'afgeleid', bron: MP },
  'nl.hero.punt2': { merk: 'afgeleid', bron: MP },
  'nl.hero.punt3': { merk: 'afgeleid', bron: MP },

  'nl.kaart.pakket1sub': { merk: 'afgeleid', bron: MP },
  'nl.kaart.pakket2sub': { merk: 'afgeleid', bron: MP },
  // Hoe vaak er getext wordt is doorgegeven; "inclusief alle materialen" is zijn eigen
  // formulering uit de advertentie. Vandaar beide bronnen op de twee pakketlabels.
  'nl.kaart.pakket2': { merk: 'afgeleid', bron: MP_ARM },
  'nl.kaart.pakket3': { merk: 'afgeleid', bron: ARM },
  'nl.kaart.pakket3sub': { merk: 'afgeleid', bron: MP_ARM },
  'nl.kaart.ondergrens': { merk: 'afgeleid', bron: MP },
  'nl.kaart.straal': { merk: 'afgeleid', bron: ARM },
  // Sinds 25-10-2026 twee doorgegeven regels onder een zin: schuren en lichte
  // reparaties (20-10) plus voorstrijken (25-10).
  'nl.kaart.inbegrepen': { merk: 'afgeleid', bron: ARM + ' + ' + ARM2 },
  'nl.kaart.btw': { merk: 'afgeleid', bron: MP },
  'nl.kaart.s2': { merk: 'ons' },
  'nl.kaart.m2vraag': { merk: 'ons' },
  'nl.kaart.m2hulp': { merk: 'ons' },
  'nl.kaart.minder': { merk: 'ons' },
  'nl.kaart.meer': { merk: 'ons' },
  'nl.kaart.leeg': { merk: 'ons' },
  'nl.kaart.perM2': { merk: 'ons' },
  'nl.kaart.eenheid': { merk: 'ons' },
  'nl.kaart.klein': { merk: 'ons' },

  'nl.loper.c': { merk: 'eigen', bron: MP },
  'nl.loper.d': { merk: 'afgeleid', bron: MP },

  // "Vijf" is ons eigen aantal punten in dit blok en geen bewering over Pascal.
  'nl.usp.kop': { merk: 'ons' },
  'nl.usp.a_t': { merk: 'afgeleid', bron: MP },
  // 215 gram is zijn getal uit het overleg van 25-10-2026, niet uit zijn advertentie.
  'nl.usp.b_t': { merk: 'afgeleid', bron: OVL },
  'nl.usp.c_t': { merk: 'afgeleid', bron: MP },
  // "Relatief goedkoop" zijn zijn eigen twee woorden, inclusief de reden erachter.
  'nl.usp.d_t': { merk: 'afgeleid', bron: MP },
  'nl.usp.e_t': { merk: 'afgeleid', bron: MP },

  'nl.vakman.b1': { merk: 'afgeleid', bron: KVK },
  'nl.vakman.b2': { merk: 'afgeleid', bron: MP_OVL },
  // Zijn eigen correctie van 25-10-2026: de wand moet behangklaar zijn, hij loopt hem
  // na met de wandschuurmachine. Wat er in de prijs zit is nog steeds doorgegeven.
  'nl.vakman.b3': { merk: 'afgeleid', bron: ARM_PAS + ' + ' + ARM2 },
  'nl.vakman.citaat': { merk: 'eigen', bron: MP },

  // De verf: de eigenschappen zijn claims van AkzoNobel (`feit`, bron SIK), dat Pascal
  // met dit merk werkt is doorgegeven via Armando (`afgeleid`, bron ARM). De vlaggen
  // zijn onze samenvatting van de eigenschap in twee woorden.
  'nl.verf.kop': { merk: 'afgeleid', bron: ARM },
  // Dat er EEN gekozen wordt komt uit het overleg van 25-10-2026 en niet van de
  // fabrikant; dat hij met Sikkens werkt is doorgegeven op 20-10-2026.
  'nl.verf.lead': { merk: 'afgeleid', bron: ARM_OVL },
  // a_b en b_b dragen twee bronnen: de claim is van AkzoNobel, de grens eromheen van
  // Pascal (koffers geven wel schade; ketchup in de keuken is zijn voorbeeld).
  'nl.verf.a_b': { merk: 'feit', bron: SIK_OVL },
  'nl.verf.b_b': { merk: 'feit', bron: SIK_OVL },
  'nl.verf.c_b': { merk: 'feit', bron: SIK },
  'nl.verf.a_vlag': { merk: 'ons' },
  'nl.verf.b_vlag': { merk: 'ons' },
  'nl.verf.c_vlag': { merk: 'ons' },
  // Schrobklasse 1 is een claim van de fabrikant (SIK) en Pascal noemde hem zelf in het
  // overleg; de klant vroeg er op 25-10-2026 om. `feit`, want het gaat over de verf en
  // niet over hem.
  'nl.verf.voet': { merk: 'feit', bron: SIK_OVL },

  'nl.kleuren.lead': { merk: 'afgeleid', bron: MP },
  // Kleuradvies staat als dienst in de kenmerken van zijn advertentie.
  'nl.kleuren.voet': { merk: 'afgeleid', bron: MP },

  // Zijn advertentie opent met "Voor al uw Schilderwerk & Renovlies" en zegt verderop
  // "Voor al uw schilderwerk binnen en buiten, krijgt u een duidelijke offerte". De kop
  // is die zin bijna woordelijk; de vier diensten staan er als zijn eigen opsomming.
  'nl.diensten.kop': { merk: 'eigen', bron: MP },
  'nl.diensten.lead': { merk: 'afgeleid', bron: MP },
  'nl.diensten.c': { merk: 'afgeleid', bron: MP },

  'nl.stappen.a_b': { merk: 'afgeleid', bron: MP },
  'nl.stappen.b_b': { merk: 'afgeleid', bron: MP },
  'nl.stappen.c_b': { merk: 'afgeleid', bron: MP },
  'nl.stappen.d_b': { merk: 'eigen', bron: MP },

  'nl.vragen.lead': { merk: 'ons' },
  // De "ik" in een veelgestelde vraag is de bezoeker en niet Pascal.
  'nl.vragen.q3': { merk: 'bezoeker' },
  'nl.vragen.q7': { merk: 'bezoeker' },
  'nl.vragen.q8': { merk: 'bezoeker' },
  'nl.offerte.soort2': { merk: 'afgeleid', bron: MP_ARM },
  'nl.offerte.soort3': { merk: 'afgeleid', bron: ARM },
  'nl.offerte.soort4': { merk: 'afgeleid', bron: OVL },
  'nl.offerte.soort5': { merk: 'afgeleid', bron: MP_OVL },
  'nl.offerte.soort7': { merk: 'bezoeker' },
  // De vier vragen die de drie soorten uit elkaar houden. Ze rustten tot 25-10-2026
  // alleen op zijn advertentie van 2018, en juist die gebruikt de woorden door elkaar.
  'nl.vragen.a1': { merk: 'afgeleid', bron: OVL },
  'nl.vragen.a2': { merk: 'afgeleid', bron: MP_OVL },
  'nl.vragen.a3': { merk: 'afgeleid', bron: MP_OVL },
  'nl.vragen.a4': { merk: 'afgeleid', bron: OVL },
  'nl.vragen.a5': { merk: 'afgeleid', bron: MP },
  'nl.vragen.a6': { merk: 'afgeleid', bron: MP_ARM },
  'nl.vragen.a7': { merk: 'eigen', bron: MP },
  'nl.vragen.a8': { merk: 'afgeleid', bron: MP },
  'nl.vragen.a9': { merk: 'afgeleid', bron: MP },
  'nl.vragen.a10': { merk: 'afgeleid', bron: MP },
  'nl.vragen.a11': { merk: 'afgeleid', bron: ARM_PAS + ' + ' + ARM2 },
  'nl.vragen.q13': { merk: 'bezoeker' },
  'nl.vragen.a13': { merk: 'afgeleid', bron: PAS },
  'nl.vragen.a12': { merk: 'afgeleid', bron: ARM_OVL },
  'nl.vragen.q5': { merk: 'afgeleid', bron: MP },

  // --- tweede pagina: /werkwijze/
  'nl.werkwijze.titel': { merk: 'ons' },
  'nl.werkwijze.omschrijving': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.lead': { merk: 'ons' },

  // Het blok met de drie soorten naast elkaar (25-10-2026). De definities zijn
  // woordelijk uit het overleg, dus alles hier draagt OVL. s_c_b is de enige waar
  // zijn advertentie meespeelt: dat hij vliesbehang ook hangt staat daar.
  // "Drie" is ons eigen aantal kaarten in dit blok en geen bewering over Pascal,
  // net als "Vijf" bij de redenen en "Zes" bij de stappen.
  'nl.werkwijze.sBoven': { merk: 'ons' },
  'nl.werkwijze.sKop': { merk: 'ons' },
  'nl.werkwijze.s_a_wat': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.s_a_b': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.s_b_wat': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.s_b_b': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.s_c_wat': { merk: 'afgeleid', bron: OVL },
  // Sinds 25-10-2026 20:01 zijn eigen aangeleverde tekst voor deze kaart, dus PAS en
  // niet meer MP_OVL: die bron is hier niet meer aan de orde.
  'nl.werkwijze.s_c_b': { merk: 'afgeleid', bron: PAS },
  // "Zes" is ons eigen aantal stappen op deze pagina en geen bewering over Pascal.
  'nl.werkwijze.stapBoven': { merk: 'ons' },
  'nl.werkwijze.s1_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.s2_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.s3_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.s4_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.s5_b': { merk: 'afgeleid', bron: MP_OVL },
  'nl.werkwijze.s6_b': { merk: 'eigen', bron: MP },
  'nl.werkwijze.b1_a': { merk: 'afgeleid', bron: ARM_PAS + ' + ' + ARM2 },
  // b1_b bestaat niet meer (25-10-2026, zie de noot bij dat blok). Het merk moest mee
  // eruit: build.mjs zakt op een MERKEN-sleutel die nergens meer op slaat.
  'nl.werkwijze.b2_a': { merk: 'afgeleid', bron: MP_OVL },
  'nl.werkwijze.b2_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.b3_a': { merk: 'afgeleid', bron: ARM_OVL },
  'nl.werkwijze.b3_b': { merk: 'afgeleid', bron: MP_OVL },
  // De twee bedragen die op 25-10-2026 omhoog gingen. Niet meer MP: zijn advertentie
  // noemt 10 en 16.
  'nl.werkwijze.a1_b': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.a2_t': { merk: 'afgeleid', bron: MP_ARM },
  'nl.werkwijze.a2_b': { merk: 'afgeleid', bron: OVL },
  'nl.werkwijze.a8_t': { merk: 'afgeleid', bron: ARM },
  'nl.werkwijze.a8_b': { merk: 'afgeleid', bron: ARM_OVL },
  'nl.werkwijze.a3_t': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.a3_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.a4_b': { merk: 'afgeleid', bron: MP },
  'nl.werkwijze.a5_b': { merk: 'eigen', bron: MP },
  'nl.werkwijze.a6_b': { merk: 'afgeleid', bron: MP_ARM },
  'nl.werkwijze.a7_b': { merk: 'afgeleid', bron: ARM_OVL + ' + ' + ARM2 },
  'nl.werkwijze.slotLead': { merk: 'eigen', bron: MP },

  'nl.offerte.lead': { merk: 'ons' },
  'nl.offerte.m2': { merk: 'ons' },
  'nl.offerte.berichtHulp': { merk: 'ons' },
  'nl.offerte.privacy': { merk: 'ons' },
  // De meldingen van het formulier, erbij op 26-10-2026. Ze staan hier expliciet
  // omdat ze langs de bronpoort kwamen ZONDER merk: "Pascal neemt contact met u op"
  // is een belofte in zijn naam, maar niet in de ik-vorm en zonder getal, dus geen
  // van de drie risicokenmerken ging af. Dat ze doorkwamen was dus geen goedkeuring
  // maar een gat, en een regel die per ongeluk door een poort komt is precies de
  // regel die er volgende maand anders in staat. Merk `ons`: dit is onze tekst over
  // ons eigen systeem (de bevestigingsmail is van de Worker), in dezelfde toon als
  // nl.offerte.lead, die hetzelfde zegt en er al stond.
  'nl.offerte.gelukt': { merk: 'ons' },
  'nl.offerte.mislukt': { merk: 'ons' },
  'nl.offerte.bezig': { merk: 'ons' },
  'nl.offerte.knopVerstuur': { merk: 'ons' },
  'nl.offerte.knopWa': { merk: 'ons' },
  'nl.offerte.mail': { merk: 'ons' },

  'nl.slot.lead': { merk: 'eigen', bron: MP },

  'nl.voet.over': { merk: 'afgeleid', bron: MP_OVL },
}

// Registergegevens die als losse waarde in de pagina komen.
export const NAP_MERKEN = {
  'bedrijf.telWeergave': { merk: 'feit', bron: KVK },
  'bedrijf.mail': { merk: 'feit', bron: KVK },
  'bedrijf.straat': { merk: 'feit', bron: KVK },
  'bedrijf.postcode': { merk: 'feit', bron: KVK },
  'bedrijf.kvk': { merk: 'feit', bron: KVK },
  // De openingstijden. `afgeleid` en niet `feit`: een openingstijd is geen algemeen
  // controleerbaar gegeven zoals een KVK-nummer, het is een uitspraak van de zaak zelf.
  // Ze staan niet in het KVK-uittreksel en niet in zijn advertentie, dus ze rusten
  // volledig op wat Armando doorgaf - en daarmee staan ze op de nalooplijst.
  'bedrijf.openDagen': { merk: 'afgeleid', bron: ARM3 },
  'bedrijf.openVan': { merk: 'afgeleid', bron: ARM3 },
  'bedrijf.openTot': { merk: 'afgeleid', bron: ARM3 },
  // Drie bedragen, drie bronnen. 11 en 17,50 komen uit het overleg van 25-10-2026 en
  // niet meer uit zijn advertentie (daar staat 10 en 16); de 23 staat op de doorgegeven
  // regel van 20-10-2026 en is in dat overleg niet aangeroerd.
  'prijzen.plakken': { merk: 'afgeleid', bron: OVL },
  'prijzen.plakkenTexen': { merk: 'afgeleid', bron: OVL },
  'prijzen.plakkenTexen2': { merk: 'afgeleid', bron: ARM },
  'prijzen.vanafM2': { merk: 'afgeleid', bron: MP },
  // Zijn gramgewichten uit het overleg: 215 wat hij gebruikt, 165 wat volgens hem
  // gangbaar is. Het tweede getal is een bewering over ANDERE bedrijven, dus het staat
  // apart op de nalooplijst - dat is het getal waar een concurrent op terugkomt.
  'soorten.gram': { merk: 'afgeleid', bron: OVL },
  'soorten.gramGangbaar': { merk: 'afgeleid', bron: OVL },
  // De productnamen van de fabrikant. Ze staan hier en niet in TEKST omdat het waarden
  // zijn met een eigen bron, net als het KVK-nummer: een verkeerd gespelde productnaam
  // op de site van een schilder is hetzelfde soort fout als een verkeerd telefoonnummer.
  'verf.merk': { merk: 'feit', bron: SIK },
  'verf.a': { merk: 'feit', bron: SIK },
  'verf.b': { merk: 'feit', bron: SIK },
  'verf.c': { merk: 'feit', bron: SIK },
}

// --------------------------------------------------------- uitzonderingen ai-poort
// Sleutels zijn hier per taal (de ai-poort loopt per taal), dus zonder `nl.` ervoor.
export const AI_TOEGESTAAN = {
  // Naadloos is hier zijn eigen woord en een vakterm: renovlies "kan naadloos worden
  // geplakt" staat woordelijk in zijn advertentie. Tot 20-10-2026 stond het alleen in
  // de uitleggende zin en heette de kop "Een wand zonder naden", omdat naadloos in een
  // kop van drie woorden brochuretaal is. Het staat sinds 20-10-2026 in de kop zelf
  // (Armando wil de kortere koppen van de referentiesite), en dan is dit de plek waar
  // de reden blijft staan. De uitzondering voor hero.punt2 is op 20-10-2026
  // weggehaald: die hero-regel gaat nu over zijn offerte en niet meer over naden.
  'nl:usp.a_t':
    'zijn eigen woord voor renovlies: het "kan naadloos worden geplakt" staat in zijn advertentie.',
}
