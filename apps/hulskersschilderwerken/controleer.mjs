// Leest de GEBOUWDE pagina's na. Draai hem na build.mjs en voor een deploy.
//
//   node build.mjs && node controleer.mjs
//
// Dit is de tweede lat. De poorten in build.mjs keuren de copy; dit script keurt
// wat er uiteindelijk in de html staat, inclusief de dingen die build.mjs zelf
// genereert (links, alt-teksten, prijzen, telefoonnummer).
//
// Sinds 20-10-2026 zijn het twee pagina's. De algemene eisen gelden voor allebei,
// de haakjes van de rekenhulp en de stroken alleen voor de startpagina.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { BEDRIJF, FORM_PAD, PRIJZEN, VERF } from './inhoud.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, 'dist')

const PAGINAS = [
  { naam: '/', bestand: 'index.html', start: true },
  { naam: '/werkwijze/', bestand: 'werkwijze/index.html', start: false },
]
for (const p of PAGINAS) p.html = fs.readFileSync(path.join(DIST, p.bestand), 'utf8')
const HOME = PAGINAS[0].html
const ALLES = PAGINAS.map((p) => p.html).join('\n')

const fouten = []
const zak = (m) => fouten.push(m)

// Een pad uit de html naar een bestand in dist/. De pagina's gebruiken absolute
// paden (/f/..., /styl.<hash>.css, /werkwijze/), want /werkwijze/ ligt een map diep.
function bestandVan(url) {
  const schoon = url.split(/[?#]/)[0]
  const rel = schoon.replace(/^\//, '')
  return path.join(DIST, rel.endsWith('/') || rel === '' ? rel + 'index.html' : rel)
}

for (const pagina of PAGINAS) {
  const { html, naam } = pagina
  const zakP = (m) => zak(`${naam} ${m}`)

  // 1. Interne tekst mag nooit mee de deur uit. Dit toetst de zichtbare tekst en niet
  //    de html eromheen: `placeholder="..."` is een geldig attribuut, het woord
  //    placeholder in een zin is dat niet.
  const zichtbaar = html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    // Alleen de WAARDE van de tekstdragende attributen, niet de attribuutnaam zelf:
    // anders vindt de controle hieronder het woord placeholder in `placeholder="..."`.
    .replace(/<[^>]+>/g, (tag) =>
      ' ' + [...tag.matchAll(/(?:alt|placeholder|title|content)="([^"]*)"/g)].map((m) => m[1]).join(' ') + ' ')
  for (const woord of ['TODO', 'FIXME', 'ARMANDO', 'nog checken', 'XXX', 'Lorem ipsum', 'placeholder', 'voorbeeldtekst']) {
    if (new RegExp(`\\b${woord}\\b`, 'i').test(zichtbaar)) zakP(`interne tekst in de pagina: "${woord}"`)
  }

  // 2. Het woord "concept" hoort nergens in de pagina te staan. Een concept zegt niet
  //    dat het een concept is (zie playground/CLAUDE.md). In het domein mag het wel.
  const zonderDomein = html.replaceAll(BEDRIJF.domein, '')
  if (/\bconcept\b/i.test(zonderDomein)) zakP('de pagina noemt zichzelf een concept')

  // 3. Foto's: alleen webp en svg, en elke img heeft een alt die geen bestandsnaam is.
  for (const m of html.matchAll(/<img\b[^>]*>/g)) {
    const tag = m[0]
    const src = (tag.match(/src="([^"]+)"/) || [])[1] || ''
    if (!/\.(webp|svg)$/.test(src)) zakP(`img met een ander formaat dan webp of svg: ${src}`)
    const alt = (tag.match(/alt="([^"]*)"/) || [])[1]
    if (alt === undefined) zakP(`img zonder alt: ${src}`)
    else if (!alt.trim()) zakP(`img met een lege alt: ${src}`)
    else if (/\.(jpe?g|png|webp)|^[a-z0-9-]+-\d+$|©/i.test(alt)) zakP(`alt leest als een bestandsnaam of credit: "${alt}"`)
    if (!/width="\d+"/.test(tag) || !/height="\d+"/.test(tag)) zakP(`img zonder width/height, dat springt bij het laden: ${src}`)
    if (!/sizes="/.test(tag) && /srcset=/.test(tag)) zakP(`img met srcset maar zonder sizes: ${src}`)
  }

  // 4. Contactgegevens staan overal hetzelfde. Twee verschillende nummers op een site
  //    betekent dat er een fout is en de bezoeker kan niet zien welke.
  const nummers = new Set([...html.matchAll(/\b0?6[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}[\s-]?\d{2}\b/g)].map((m) => m[0].replace(/\D/g, '')))
  nummers.delete(BEDRIJF.telWeergave.replace(/\D/g, ''))
  if (nummers.size) zakP(`er staat nog een ander 06-nummer in de pagina: ${[...nummers].join(', ')}`)
  const mails = new Set([...html.matchAll(/[\w.+-]+@[\w.-]+\.\w+/g)].map((m) => m[0].toLowerCase()))
  mails.delete(BEDRIJF.mail.toLowerCase())
  if (mails.size) zakP(`er staat nog een ander mailadres in de pagina: ${[...mails].join(', ')}`)
  if (!html.includes(`tel:${BEDRIJF.telLink}`)) zakP('geen klikbaar telefoonnummer in de pagina')

  // 5. De stylesheet heeft een hash in zijn naam, zodat nieuwe html nooit met een oude
  //    stylesheet gepaard kan worden.
  const css = (html.match(/href="\/?(styl\.[a-f0-9]{8}\.css)"/) || [])[1]
  if (!css) zakP('geen stylesheet met een hash in de naam')
  else if (!fs.existsSync(path.join(DIST, css))) zakP(`verwijst naar ${css}, maar dat bestand staat niet in dist/`)

  // 6. Elk bestand waar de pagina naar wijst, ligt er ook.
  for (const m of html.matchAll(/(?:src|href)="(?!https?:|mailto:|tel:|#)([^"]+)"/g)) {
    if (!fs.existsSync(bestandVan(m[1]))) zakP(`verwijst naar ${m[1]}, maar dat bestand bestaat niet`)
  }

  // 7. Ankers bestaan echt. Een anker op deze pagina zelf (#offerte) hoort hier te
  //    staan, een anker met een pad ervoor (/#offerte) op de pagina waar het heen wijst.
  for (const m of html.matchAll(/href="#([a-z-]+)"/g)) {
    if (m[1] === 'top') continue
    if (!new RegExp(`id="${m[1]}"`).test(html)) zakP(`link naar #${m[1]}, maar er is geen element met dat id`)
  }
  for (const m of html.matchAll(/href="\/#([a-z-]+)"/g)) {
    if (!new RegExp(`id="${m[1]}"`).test(HOME)) zakP(`link naar /#${m[1]}, maar dat id staat niet op de startpagina`)
  }

  // 8. Een label moet bij een veld horen, anders is het formulier onbruikbaar met
  //    een schermlezer.
  for (const m of html.matchAll(/<label[^>]*for="([^"]+)"/g)) {
    if (!new RegExp(`id="${m[1]}"`).test(html)) zakP(`label wijst naar #${m[1]}, dat veld bestaat niet`)
  }

  // 9. Vaste eisen aan de kop van het document.
  if (!/<html lang="nl">/.test(html)) zakP('geen lang="nl" op het html-element')
  if (!/<meta name="viewport"/.test(html)) zakP('geen viewport-meta')
  const canon = (html.match(/rel="canonical" href="([^"]+)"/) || [])[1]
  if (!canon) zakP('geen canonical')
  else if (canon !== `https://${BEDRIJF.domein}${naam}`) zakP(`canonical wijst naar ${canon} in plaats van naar ${naam}`)
  const h1 = [...html.matchAll(/<h1\b/g)].length
  if (h1 !== 1) zakP(`${h1} h1-elementen, dat moet er precies een zijn`)

  // 10. Het telefoonmenu en de zwevende knoppenbalk staan op elke pagina: een bezoeker
  //     die op /werkwijze/ binnenkomt heeft dezelfde navigatie nodig.
  for (const [wat, re] of [
    ['burger', /id="burger"/],
    ['lade', /id="lade"/],
    ['sluitknop van de lade', /id="lade-sluit"/],
    ['zwevende knoppenbalk', /id="zwevend"/],
  ]) {
    if (!re.test(html)) zakP(`${wat} staat niet in de pagina`)
  }
  // De lade moet naar de andere pagina kunnen, anders zit een bezoeker op zijn telefoon
  // vast op de pagina waar hij begon.
  if (!html.includes('href="/werkwijze/"')) zakP('geen link naar /werkwijze/ in de pagina')
  if (!pagina.start && !/class="merk" href="\//.test(html)) zakP('het logo linkt niet terug naar de startpagina')

  // 11. Alleen op de startpagina: de haakjes van de rekenhulp en de stroken.
  if (pagina.start) {
    for (const [wat, re] of [
      ['stappenbalk van de rekenhulp', /id="rail"/],
      ['schuifstrook met eerder werk', /id="werkrail"/],
      ['duimnagels onder de werkstrook', /id="werkduim"/],
      ['teller boven de werkstrook', /id="werk-nu"/],
      ['melding bij een aantal onder de ondergrens', /id="m2-laag"/],
    ]) {
      if (!re.test(html)) zakP(`${wat} staat niet in de pagina`)
    }
    const kaarten = [...html.matchAll(/class="werkkaart"/g)].length
    const duimen = [...html.matchAll(/class="werkduim-k/g)].length
    if (kaarten !== duimen) zakP(`${kaarten} werkkaarten maar ${duimen} duimnagels`)
    const panelen = [...html.matchAll(/data-p="(\d)"/g)].map((m) => m[1])
    if (panelen.join(',') !== '1,2,3') zakP(`de rekenhulp heeft geen drie stappen maar: ${panelen.join(', ') || 'geen'}`)
  }
}

// 12. Uitgaande links, over beide pagina's samen. Pascal heeft geen eigen site, dus
//     elke externe link moet een bewuste uitzondering zijn.
const TOEGESTANE_HOSTS = {
  'wa.me': 'zijn eigen WhatsApp, het formulier stuurt het bericht daarheen',
  'fonts.googleapis.com': 'stylesheet van het lettertype',
  'fonts.gstatic.com': 'het lettertype zelf',
  'schema.org': 'alleen de naamruimte in de structured data, geen link op de pagina',
  // Zijn eigen Google-bedrijfsprofiel in `sameAs`. Dit is geen link op de pagina maar
  // een verwijzing in de structured data, en juist daar is naar buiten wijzen de hele
  // bedoeling: zo weet Google dat deze site en die entiteit hetzelfde bedrijf zijn. De
  // regel die hierboven staat ("Pascal heeft geen eigen site, dus elke externe link is
  // een uitzondering") gaat over een bezoeker die wegklikt, en dat kan hier niet.
  'maps.google.com': 'zijn eigen Google-bedrijfsprofiel in sameAs, alleen in de structured data',
}
const geraakt = new Set()
for (const m of ALLES.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) {
  const host = m[1].toLowerCase()
  if (host === BEDRIJF.domein) continue
  if (host in TOEGESTANE_HOSTS) { geraakt.add(host); continue }
  zak(`uitgaande link naar ${host}. Bouw de bestemming hier of zet hem met reden in TOEGESTANE_HOSTS.`)
}
for (const host of Object.keys(TOEGESTANE_HOSTS)) {
  if (!geraakt.has(host)) zak(`TOEGESTANE_HOSTS noemt ${host}, maar die staat niet meer in de pagina's. Haal hem weg.`)
}
/*
 * En de uitzondering mag niet meer toelaten dan haar reden draagt. Twee hosts staan
 * hierboven met "alleen in de structured data" als reden, en zonder deze regel is dat
 * een reden en geen eis: een knop "bekijk ons op Google Maps" zou er morgen stil
 * langskomen, en dat is precies de uitgaande link waarvoor controle 12 bestaat.
 *
 * Getoetst op href en src, want dat is wat een bezoeker kan aanklikken.
 */
for (const host of ['maps.google.com', 'schema.org']) {
  for (const m of ALLES.matchAll(/(?:href|src)="(https?:\/\/[^"]+)"/gi)) {
    if (m[1].toLowerCase().includes(host)) {
      zak(`${host} staat in een href of src (${m[1]}) en hoort alleen in de structured data te staan`)
    }
  }
}

// 13. De prijzen komen uit PRIJZEN en nergens anders vandaan. Dit geldt over beide
//     pagina's: op /werkwijze/ staan ze in een zin, op de startpagina in de kaart.
const TARIEVEN = [
  ['plakken', PRIJZEN.plakken],
  ['plakkenTexen', PRIJZEN.plakkenTexen],
  ['plakkenTexen2', PRIJZEN.plakkenTexen2],
]
// Het bedrag zoals het op de pagina staat: 11,00 en 17,50. Deze test zocht tot
// 25-10-2026 naar `${bedrag},00` en was daarmee blind voor elk bedrag met centen - hij
// ging af op de 17,50, maar zou net zo goed "17.5,00" hebben goedgekeurd als de opmaak
// dat had opgeleverd. Zelfde rekensom als eur() in build.mjs, en dat is bewust: dit is
// de controle en niet de bron.
const alsEuro = (n) => n.toFixed(2).replace('.', ',')
for (const [naam, bedrag] of TARIEVEN) {
  if (!HOME.includes(`&euro;&nbsp;${alsEuro(bedrag)}`)) zak(`prijs ${naam} (${alsEuro(bedrag)}) staat niet in de rekenhulp`)
}
const bedragen = new Set([...ALLES.matchAll(/&euro;&nbsp;(\d+),00/g)].map((m) => Number(m[1])))
for (const b of bedragen) {
  if (!TARIEVEN.some(([, bedrag]) => bedrag === b)) zak(`onbekend bedrag in de pagina's: ${b}`)
}

// 13a1. Hoe vaak er getext wordt staat in het label zelf. Tot 20-10-2026 heette het
//       tweede pakket "Plakken en texen" zonder getal, omdat zijn advertentie niet zegt
//       hoe vaak. Nu er twee texpakketten naast elkaar staan is dat verschil het enige
//       dat de 16 van de 23 euro onderscheidt: valt "1x" of "2x" weg, dan staan er twee
//       bedragen voor hetzelfde en lijkt de duurste een fout.
for (const stuk of ['Plakken en 1x texen', 'Plakken en 2x texen']) {
  if (!HOME.includes(stuk)) zak(`/ noemt het pakket "${stuk}" niet meer in de rekenhulp`)
}
// En het derde pakket moet ook echt te kiezen zijn: het label zonder bijbehorende
// radio is een prijs waar je niet op kunt rekenen.
if (!new RegExp(`name="pakket" value="${PRIJZEN.plakkenTexen2}"`).test(HOME)) {
  zak('/ heeft geen keuzerondje voor het pakket van 2x texen')
}

// 13a2. Het verfmerk. Doorgegeven via Armando op 20-10-2026, en volgens hem de sterkste
//       USP die Pascal heeft. De NAMEN komen van de fabrikant en zijn nagekeken op
//       sikkens.nl: "Anti Marx" en "Resisto" (zonder z) waren de doorgegeven vormen en
//       die bestaan niet. Deze controle gaat af zodra er weer zo'n vorm in de pagina
//       staat, want een verkeerd gespeld product is precies wat een vakman naleest.
for (const naam of [VERF.a, VERF.b, VERF.c]) {
  if (!HOME.includes(`${VERF.merk} ${naam}`)) zak(`/ noemt ${VERF.merk} ${naam} niet meer`)
}
if (!/id="verf"/.test(HOME)) zak('/ heeft geen verfblok meer')
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ')
  for (const fout of [/\bAnti\s*Marx\b/i, /\bResisto\b/, /\bkrasvast\b/i]) {
    if (fout.test(plat)) zak(`${p.naam} gebruikt een vorm die niet klopt: ${fout}`)
  }
}
// 13a3. Coating, niet muurverf. Dit woord is twee keer omgedraaid en daarom staat het
//       nu in twee richtingen in de controle. Eerst zei de site muurverf, want Sikkens
//       zet dat op de emmer en een vakman leest zijn eigen materiaal na. Armando meldde
//       daarna dat Pascal zelf coating zegt (20-10-2026), en in een zin die namens hem
//       spreekt gaat zijn vakwoord voor het etiket van de fabrikant. Niet fout: een
//       muurverf is een coating.
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ')
  if (/muurverf|muurverven/i.test(plat)) zak(`${p.naam} zegt muurverf; Pascal zegt coating`)
  // En de vertaling mag niet doorslaan naar iets wat hij niet aanbiedt: een coating als
  // los laagje over de verf heen, of als aparte behandeling met een eigen bedrag. Het
  // is dezelfde emmer, dus geen prijs of toeslag die aan het woord hangt.
  if (/coating[^.]{0,60}\b(extra|apart|meerprijs|toeslag|erbij gerekend)\b/i.test(plat)) {
    zak(`${p.naam} maakt van de coating een aparte post; dat heeft niemand gezegd`)
  }
}
if (!/\bcoating/i.test(HOME.replace(/<[^>]+>/g, ' '))) zak('/ noemt de coating niet meer')
// De ondergrens zit sinds 20-10-2026 niet meer als `min` op het invoerveld: wie minder
// dan 100 m2 heeft mag het gewoon uitrekenen en leest dat Pascal daar een aparte prijs
// voor maakt. Maar hij moet er wel ergens staan, anders belooft de pagina een prijs per
// m2 die in zijn eigen advertentie pas vanaf 100 m2 geldt.
for (const p of PAGINAS) {
  if (!p.html.includes(`${PRIJZEN.vanafM2} m2`)) zak(`${p.naam} noemt de ondergrens van ${PRIJZEN.vanafM2} m2 nergens`)
}

// 13b. Het voorwerk staat op beide pagina's. Het is de eerste vraag van iemand met een
//      kale of beschadigde wand, en het is er twee keer uitgevallen: eerst als onze
//      aanname (die hoorde eruit), daarna omdat er geen bron voor was. Sinds Armando
//      het op 20-10-2026 doorgaf staat het er met bron, en deze regel zorgt dat het
//      niet bij de volgende inkorting stil verdwijnt.
//
//      En hier is precies gebeurd wat er in de oude versie van dit commentaar stond:
//      "hoort Pascal straks zelf te zeggen dat hij het NIET doet, dan gaat deze
//      controle eruit, niet de tekst stil." In het overleg van 25-10-2026 zei Pascal
//      dat hij GEEN egaliseren doet. Egaliseren is daarmee uit deze lijst gehaald en
//      staat hieronder in de tegenhanger: hij mag nergens meer voorkomen. Schuren en
//      voorstrijken blijven geeist, die zijn niet weersproken.
//
//      Op 25-10-2026 is de wandschuurmachine erbij gekomen. Dat woord stond hier
//      bewust NIET, omdat het van de werkwijzepagina van renovliesdirect kwam - de
//      concurrent waar deze pagina tegen moet ranken, en geen bron. Pascal schreef het
//      die avond zelf op, dus nu is het van hem en hoort het erin te blijven.
//      De check is sindsdien hoofdletterongevoelig: "Schuren" aan het begin van een zin
//      telde niet mee, dus deze regel hing aan het toeval dat het woord ergens ook
//      middenin een zin stond.
for (const p of PAGINAS) {
  for (const woord of ['schuren', 'voorstrijken', 'wandschuurmachine']) {
    if (!new RegExp(woord, 'i').test(p.html)) zak(`${p.naam} noemt het voorwerk niet meer (${woord} ontbreekt)`)
  }
}

// 13b1. Egaliseren staat NERGENS meer. Pascal doet het niet (overleg 25-10-2026), en
//       dit is precies het soort woord dat terugkomt: het stond op 20-10-2026 nog in
//       doorgegeven-armando.txt als iets wat hij wel doet, dus wie uit dat bestand
//       werkt zet het zo weer terug. Zelfde val als traprenovatie. De kop van dat
//       bronbestand zegt nu dat die regel achterhaald is; deze controle is de bodem.
for (const p of PAGINAS) {
  if (/egalis/i.test(p.html)) zak(`${p.naam} noemt egaliseren - dat doet Pascal niet (overleg 25-10-2026)`)
}

// 13b2. Wat er in de prijs zit staat op beide pagina's. Doorgegeven via Armando op
//       20-10-2026: Pascal zei dat schuren en lichte reparaties in zijn prijs zitten.
//       Dat is het antwoord op de vraag die de prijs per m2 oproept bij iemand met een
//       bestaande wand, dus hij mag niet stil wegvallen bij een volgende inkorting.
//
//       Voorstrijken is er op 25-10-2026 bijgekomen: Armando gaf door dat de prijs ook
//       dat bevat. Het staat in DEZELFDE zin geeist en niet als los woord ergens op de
//       pagina, want het gaat om een bedrag: "voorstrijken" los kan ook in een zin over
//       wat hij doet staan, en dan zegt de site nog steeds niet dat het erin zit.
for (const p of PAGINAS) {
  if (!/schuren, lichte reparaties en voorstrijken zitten in de prijs/i.test(p.html)) {
    zak(`${p.naam} zegt niet meer dat schuren, lichte reparaties en voorstrijken in de prijs zitten`)
  }
}

// 13b3. Hier stond de tegenhanger: nergens mocht staan dat voorstrijken in de prijs
//       zit, want dat was een bedrag en dat had niemand gezegd. Die regel is op
//       25-10-2026 vervallen - Armando gaf door dat het er wel in zit, en dan is de
//       poort de kant op streng die de klant tegenspreekt. De eis staat nu in 13b2.
//
//       Wat er NIET voor in de plaats komt is een regel over egaliseren in de prijs:
//       dat woord mag sowieso nergens staan (13b1), dus een prijsregel erover kan niet
//       bestaan. En wat ook niet mag uitgroeien is het behangklaar maken van een wand
//       die dat niet is - dat is 13b4, en dat is iets anders dan voorwerk op een wand
//       die het al is.

// 13b4. En de grootste van de reeks: de site mag NERGENS beweren dat Pascal een wand
//       behangklaar maakt. Hij schreef het op 25-10-2026 zelf, met twee uitroeptekens:
//       "Ik ga wanden die niet behangklaar zijn, niet behangklaar maken !!" De site
//       zei acht dagen lang het omgekeerde, op drie plekken, en elke poort keurde het
//       goed - het stond immers zo in doorgegeven-armando.txt. Dit is dus precies een
//       geval waarin de bron de verkeerde was en niet de bewering onherleidbaar.
//
//       Een ontkenning moet er WEL doorheen ("wanden die niet behangklaar zijn, maakt
//       hij niet behangklaar" is juist de goede zin), anders is de enige manier om deze
//       poort te passeren het onderwerp helemaal niet aanroeren - zelfde reden als bij
//       15a. Maar de ontkenning mag hier niet per ZIN gewogen worden zoals daar: de
//       oude foute zin was "Is dat nog niet zo, dan maakt Pascal de wand eerst zelf
//       behangklaar", en die draagt een "niet" in een andere bijzin. Een zinsbrede
//       ontkenningscheck laat precies de regel door die deze controle moet vangen.
//       Daarom wordt het VENSTER gewogen: de woorden tussen "maken" en "behangklaar".
//
//       En let op de woordvolgorde. Nederlands zet het werkwoord meestal voor het
//       bijvoeglijk naamwoord ("maakt de wand behangklaar") en soms erachter
//       ("behangklaar maken"). Een patroon dat er maar een van kent, mist de fout die
//       er echt stond.
//
//       En de alt-teksten gaan mee. Die zitten in een attribuut, dus ze verdwijnen bij
//       het strippen van de tags - en daar stond het precies fout: "Rolsteiger tegen een
//       kale, behangklaar gemaakte wand". Een alt-tekst wordt voorgelezen en staat in
//       Google Afbeeldingen, dus hij is gewoon copy (zie de Klinkhamer-regel in
//       playground/CLAUDE.md).
for (const p of PAGINAS) {
  const alts = [...p.html.matchAll(/alt="([^"]*)"/g)].map((m) => m[1]).join('. ')
  const plat = p.html.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ') + ' ' + alts
  const re = /maak\w*(?:\s+\S+){0,6}\s+behangklaar|(?:\S+\s+){0,4}behangklaar\s+(?:te\s+)?(?:maakt|maken|gemaakt)/gi
  for (const m of plat.match(re) || []) {
    if (/\b(niet|geen|nooit)\b/i.test(m)) continue
    zak(`${p.naam} beweert dat Pascal een wand behangklaar maakt: "${m.slice(0, 110)}"`)
  }
}

// 13b5. De kant die er wel moet staan: dat de wanden behangklaar MOETEN zijn. Dat is
//       de eerste vraag van iemand met een kale wand en het bepaalt of hij Pascal
//       uberhaupt moet bellen. Zonder deze eis is 13b4 met een schaar op te lossen -
//       het onderwerp weglaten - en dan staat er een site die er stilzwijgend van
//       uitgaat dat elke bezoeker het weet.
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  if (!/wanden moeten.{0,20}behangklaar zijn/i.test(plat)) {
    zak(`${p.naam} zegt niet dat de wanden behangklaar moeten zijn`)
  }
}

// 13c. Zijn andere diensten staan op de startpagina. Op 20-10-2026 zag Armando dat een
//      bezoeker de site las als "hij doet alleen renovlies": schilderwerk stond alleen
//      in de lopende balk, een vraag onderaan en de voet, en dat leest niemand als een
//      aanbod. De strook onder de werkfoto's noemt ze nu bij naam. Zodra iemand die
//      strook inkort is dit de regel die afgaat.
for (const woord of ['Binnenschilderwerk', 'Buitenschilderwerk', 'Sauswerk']) {
  if (!new RegExp(`<li>${woord}`, 'i').test(HOME)) zak(`/ noemt ${woord} niet in de dienstenstrook`)
}
// En de tegenhanger: traprenovatie staat er NIET meer. Pascal doet die dienst niet meer
// (doorgegeven via Armando, 20-10-2026), maar hij staat nog wel in zijn Marktplaats-
// advertentie van 2018, met twee foto's en als trefwoord. Dat is de val: wie de volgende
// keer uit het korpus werkt zet hem zo weer terug. Deze regel dekt beide pagina's en ook
// de structured data, want daar stond hij ook.
for (const p of PAGINAS) {
  if (/traprenovatie/i.test(p.html)) zak(`${p.naam} noemt traprenovatie weer - die dienst doet Pascal niet meer`)
}
if (!/id="diensten"/.test(HOME)) zak('/ heeft geen dienstenstrook meer')
// En hij staat BOVEN de kop van de werksectie. Onder de foto's en de duimnagels vond
// Armando hem zelf niet terug (20-10-2026) - een blok dat je moet zoeken doet zijn werk
// niet. Daarom is de plek nu een eis en geen smaak: zakt deze regel, dan is de strook
// weer naar onderen gezakt bij het herschikken van die sectie.
{
  const iStrook = HOME.indexOf('id="diensten"')
  const iWerkkop = HOME.indexOf('>Werk van Pascal<')
  if (iWerkkop === -1) zak('/ heeft geen kop "Werk van Pascal" meer')
  else if (iStrook > iWerkkop) zak('/ zet de dienstenstrook onder de kop van de werksectie')
}

// 13d. De zwevende knoppen zijn twee pillen met een label, zoals bij
//      winterswijkvakantiehuis.nl (nagemeten in meet-winterswijk.mjs): appen en bellen,
//      geen ronde icoontjes zonder woord. Een icoon zonder label is op een telefoon een
//      raadseltje, en dit is precies het onderdeel dat Armando twee keer heeft
//      bijgestuurd. Zakt deze regel, dan is er een knop uit gevallen of is het label weg.
for (const p of PAGINAS) {
  const zweef = (p.html.match(/<div class="zwevend"[\s\S]*?<\/div>\s*\n/) || [''])[0]
  if (!/class="zwevend-wa"[\s\S]*?<span>WhatsApp<\/span>/.test(zweef)) {
    zak(`${p.naam} heeft geen zwevende WhatsApp-knop met label`)
  }
  if (!/class="zwevend-bel"[\s\S]*?<span>Bellen<\/span>/.test(zweef)) {
    zak(`${p.naam} heeft geen zwevende belknop met label`)
  }
  if (/zwevend-rond/.test(p.html)) zak(`${p.naam} heeft weer ronde zwevende icoontjes zonder label`)
}

// 13e. De smalle donkere topbalk boven het logo blijft weg (doorgestreept door Armando
//      op 20-10-2026). Zijn twee regels staan elders, dus terugzetten levert alleen een
//      derde donkere strook op boven een pagina die al een donkere kop heeft.
for (const p of PAGINAS) {
  if (/class="topbalk"/.test(p.html)) zak(`${p.naam} heeft de topbalk weer boven het logo`)
}

// 13f. Het blok prijs en afspraken op /werkwijze/ staat op een lichte band. Het stond op
//      de donkere en dat vond Armando te donker (20-10-2026): met de donkere paginakop
//      erboven en het blauwe slot eronder was het drie zware vlakken op een pagina.
{
  const w = PAGINAS.find((p) => p.naam === '/werkwijze/')
  if (w && /<section class="op-nacht" id="afspraken"/.test(w.html)) {
    zak('/werkwijze/ zet prijs en afspraken weer op de donkere band')
  }
}

// 13g. Onder de 100 m2 hoort erbij te staan hoe ver Pascal rijdt. De ondergrens stond
//       er drie rondes als een kale voorwaarde, en wat eronder gebeurt liet zijn
//       advertentie open; op 20-10-2026 gaf Armando door dat hij dan binnen 30 km van
//       Coevorden werkt. Een site die alleen "vanaf 100 m2" zegt stuurt iedereen met
//       een kleinere klus weg, dus deze regel gaat af zodra die aanvulling verdwijnt.
//       Startpagina: in de rekenhulp zodra iemand minder dan 100 invult, plus vraag 6.
for (const p of PAGINAS) {
  if (!/binnen 30 kilometer van Coevorden/i.test(p.html)) {
    zak(`${p.naam} zegt niet hoe ver Pascal rijdt voor werk onder de 100 m2`)
  }
}

// 13g2. De tegenhanger: die 30 km gaat over het WERKGEBIED en niet over de prijs. Wat
//       kleiner werk kost is niet doorgegeven, en "onder de 100 m2 kost het X" is
//       precies het soort zin dat er bij een volgende inkorting van gemaakt wordt.
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  if (/30 kilometer[^.]{0,60}(euro|prijs per|tarief)/i.test(plat)) {
    zak(`${p.naam} hangt een prijs aan de 30 kilometer - dat is niet doorgegeven`)
  }
}

// 13h. Elke pagina sluit af met het offerteblok en gaat dan naar de voet (Armando,
//       20-10-2026). Drie dingen moeten kloppen, en ze kunnen los van elkaar stuk:
//       het blok staat er, het javascript dat het formulier vult staat erbij, en het
//       is het laatste inhoudsblok - een blok dat halverwege de pagina belandt is geen
//       afsluiting. Het slot (de blauwe band met twee knoppen) mag er nog onder, dat
//       is de afsluiting van het offerteblok zelf en staat op beide pagina's zo.
for (const p of PAGINAS) {
  if (!/<section class="op-mist" id="offerte"/.test(p.html)) {
    zak(`${p.naam} eindigt niet met het offerteblok`)
    continue
  }
  if (!/id="aanvraag"/.test(p.html) || !/id="naar-wa"/.test(p.html) || !/id="verstuur"/.test(p.html)) {
    zak(`${p.naam} heeft het offerteblok zonder formulier of zonder verstuurknoppen`)
  }
  // Het formulier is een stuk html plus een stuk javascript. Staat alleen het eerste
  // op een pagina, dan staat er een formulier dat niets doet: de WhatsApp-knop stuurt
  // dan een leeg bericht in plaats van wat de bezoeker invulde.
  if (!/form\.addEventListener\('input',bij\)/.test(p.html)) {
    zak(`${p.naam} heeft het offerteformulier zonder het javascript dat het vult`)
  }
  // 13h-2. Sinds de verhuizing van 26-10-2026 VERSTUURT het formulier echt. Vier dingen
  //        die los van elkaar stuk kunnen en die je allemaal niet ziet door naar de
  //        pagina te kijken - een formulier dat niets doet ziet er precies hetzelfde
  //        uit als een dat werkt:
  //
  //        - de action. Staat die er niet, dan post de browser naar de pagina zelf en
  //          komt de aanvraag nergens aan. Het adres moet bovendien hetzelfde zijn als
  //          de route in worker/index.ts; tools/vooraf.mjs toetst die kant.
  //        - de submit-handler. Zonder die regel doet de knop niets, of post hij
  //          ouderwets met een json-pagina als resultaat.
  //        - het e-mailveld. Dat is het enige nieuwe verplichte veld, en de hele
  //          bevestigingsmail hangt eraan. Zonder adres keurt de worker de aanvraag af
  //          en krijgt de bezoeker een foutmelding op een formulier dat compleet lijkt.
  //        - het lokvink. Verdwijnt dat, dan staat het formulier open voor bots en
  //          loopt het postvak vol; dat merk je pas als het gebeurt.
  if (!new RegExp(`<form[^>]*id="aanvraag"[^>]*action="${FORM_PAD}"`).test(p.html)) {
    zak(`${p.naam} heeft een offerteformulier zonder action="${FORM_PAD}" - de aanvraag komt nergens aan`)
  }
  if (!/form\.addEventListener\('submit'/.test(p.html)) {
    zak(`${p.naam} heeft het offerteformulier zonder submit-handler - de knop verstuurt niets`)
  }
  if (!/name="email"[^>]*required|required[^>]*name="email"/.test(p.html) && !/<input[^>]*type="email"[^>]*required/.test(p.html)) {
    zak(`${p.naam} mist het verplichte e-mailveld - dan kan er geen bevestiging terug`)
  }
  if (!/name="website"/.test(p.html)) {
    zak(`${p.naam} mist het lokvink (name="website") - het formulier staat open voor bots`)
  }
  // 13h-3. Een getalveld mag geen `step` dragen die ronde getallen afkeurt.
  //
  //        Dit stond er echt: `min="1" step="10"` op het m2-veld. Voor de browser zijn
  //        dan alleen 1, 11, 21, 31 ... geldig, dus 100, 120, 140 en 85 waren alle vier
  //        ongeldig - en 100 is het getal dat een bezoeker hier het eerst intypt, want
  //        dat is de ondergrens die Pascal zelf noemt. Zolang het formulier niets
  //        valideerde viel het niet op; vanaf het moment dat er echt verstuurd wordt
  //        blokkeerde het stil de hele aanvraag.
  //
  //        De regel is daarom niet "zet step op any bij dit ene veld" maar "geen step
  //        die rekent", want de volgende die hier een getalveld bijzet (een aantal
  //        kamers, een hoogte) maakt dezelfde fout. Alleen "any" en "1" keuren nooit een
  //        heel getal af.
  for (const m of p.html.matchAll(/<input\b[^>]*type="number"[^>]*>/g)) {
    const step = (m[0].match(/step="([^"]+)"/) || [])[1]
    const naamVeld = (m[0].match(/name="([^"]+)"/) || m[0].match(/id="([^"]+)"/) || [])[1] || '?'
    if (step !== undefined && step !== 'any' && step !== '1') {
      zak(`${p.naam} heeft een getalveld (${naamVeld}) met step="${step}" - dat keurt ronde getallen af en blokkeert de aanvraag`)
    }
  }
  const na = p.html.slice(p.html.indexOf('<section class="op-mist" id="offerte"'))
  const volgende = [...na.matchAll(/<section[^>]*\bid="([a-z-]+)"/g)].map((m) => m[1]).slice(1)
  if (volgende.length) zak(`${p.naam} zet ${volgende.join(', ')} na het offerteblok`)
}

// 13i. De kopregel boven de h1 van de startpagina blijft weg (doorgestreept door
//       Armando op 20-10-2026). "Renovlies en glasweefsel" stond vlak boven een kop
//       die hetzelfde zegt; de woorden zelf staan in de titel, de lopende balk en de
//       voet, dus er ging niets verloren.
{
  const h = PAGINAS.find((p) => p.start)
  if (h && /<p class="boven">[^<]*<\/p>\s*<h1>/.test(h.html)) {
    zak('de startpagina heeft weer een kopregel boven de h1')
  }
}

// --------------------------------------------------------- 15. de drie soorten
//
// Dit hele blok komt uit het overleg met Pascal van 25-10-2026. De site haalde
// renovlies, glasweefselbehang en vliesbehang door elkaar, en dat kwam niet uit de
// lucht vallen: zijn eigen advertentie van 2018 doet het ook. Die zet de drie in een
// adem ("deze soorten behang zijn er in verschillende printen & designs en is in alle
// kleuren over te texen") en gebruikt "vliesbehang" voor het materiaal dat je
// overtext. Wie uit dat korpus werkt krijgt de fout er dus gratis bij, en geen poort
// ziet het: elke zin die er stond KLOPTE tegen de bron. Vandaar regels hier.

/**
 * De pagina in losse zinnen, met de elementgrenzen erin.
 *
 * Dit is de reden dat deze functie bestaat en er niet gewoon `html.replace(/<[^>]+>/g,
 * ' ')` staat. Een tekstcontrole op platgeslagen html heeft GEEN zinsgrenzen meer waar
 * de opmaak ze had: de lopende balk wordt een regel, de json-ld plakt tegen de laatste
 * alinea, en een kaartkopje loopt door in de alinea eronder. De eerste versie van de
 * controle hieronder ging daardoor drie keer af op zinnen die niet bestaan - een vlag
 * ("Niet om over te texen") die tegen een kop ("Vliesbehang") aanlag, en een
 * meta-omschrijving die tegen een telefoonnummer uit de structured data aanlag.
 *
 * Dus: eerst de blokken en de json-ld eruit, dan per blok op zinnen knippen.
 */
function zinnen(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<\/(p|li|h1|h2|h3|h4|div|td|dd|dt|figcaption|blockquote|cite|span|b|i|a)>/gi, '. ')
    .replace(/<[^>]+>/g, ' ')
    .split(/[.!?;]+/)
    .map((z) => z.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
}

// 15a. Vliesbehang is gewoon behang. Er wordt niet over getext en het overbrugt geen
//      scheuren. Deze regel gaat af op elke zin die het tegendeel zegt.
for (const p of PAGINAS) {
  for (const zin of zinnen(p.html)) {
    // "renovliesbehang" bevat "vliesbehang" als deel van het woord. Alleen een los
    // vliesbehang telt, dus het langere woord gaat er eerst uit.
    const schoon = zin.replace(/renovliesbehang|renovlies behang/gi, 'RENOVLIES')
    if (!/vliesbehang/i.test(schoon)) continue
    // Een ontkenning is juist de goede zin ("er wordt niet over getext"). Die mag niet
    // afgaan, anders is de enige manier om deze poort te passeren het onderwerp
    // helemaal niet aanroeren.
    if (/\b(niet|geen|nooit)\b/i.test(schoon)) continue
    for (const fout of [/\bgetext\b/i, /\btexen\b/i, /scheuroverbrug/i]) {
      if (fout.test(schoon)) {
        zak(`${p.naam} zet vliesbehang in een zin over texen of scheuroverbrugging: "${zin.slice(0, 110)}"`)
        break
      }
    }
  }
}

// 15b. Het blok dat de drie uit elkaar houdt staat op /werkwijze/, met alle drie de
//      namen en met de twee gramgewichten. Dit is wat Armando op 25-10-2026 vroeg, en
//      het is tegelijk de inhoud waarmee die pagina kan ranken - dus het mag niet bij
//      een volgende inkorting sneuvelen.
{
  const w = PAGINAS.find((p) => !p.start)
  if (w) {
    if (!/id="soorten"/.test(w.html)) zak('/werkwijze/ heeft het blok met de drie soorten niet meer')
    for (const naam of ['Renovliesbehang', 'Glasweefselbehang', 'Vliesbehang']) {
      if (!new RegExp(`<h3>${naam}</h3>`).test(w.html)) zak(`/werkwijze/ noemt ${naam} niet als kaart in het soortenblok`)
    }
    for (const g of [215, 165]) {
      if (!new RegExp(`\\b${g} gram`).test(w.html)) zak(`/werkwijze/ noemt ${g} gram niet meer`)
    }
    // Het patroon is het ENE kenmerk waarop glasweefselbehang van renovliesbehang te
    // onderscheiden is. Valt die regel weg, dan staan er twee kaarten die hetzelfde
    // zeggen en is het blok zijn bestaansreden kwijt.
    if (!/patroon/i.test(w.html)) zak('/werkwijze/ noemt het patroon van glasweefselbehang niet meer')
  }
}

// 15c. 215 gram staat ook op de startpagina, in de vijf redenen en bij de vragen. Dat
//      is het enige punt op deze site dat een concurrent niet ook kan opschrijven.
for (const g of [215, 165]) {
  if (!new RegExp(`\\b${g} gram`).test(HOME)) zak(`/ noemt ${g} gram niet meer`)
}

// 15d. Behangen heet behangen. "Vliesbehang hangt hij ook" was spreektaal in de zin
//      waarin hij zijn eigen diensten opsomt (Armando, 25-10-2026). De regel gaat af op
//      elke vorm van hangen met behang als lijdend voorwerp, niet op het woord hangen
//      zelf - een lamp of een schilderij hangen mag gewoon.
for (const p of PAGINAS) {
  for (const zin of zinnen(p.html)) {
    for (const fout of [/behang\w*\s+(hangt|hangen|hing)\b/i, /\b(hangt|hangen)\s+(hij|wij|ik|het)?\s*\w*behang/i]) {
      if (fout.test(zin)) {
        zak(`${p.naam} zegt behang hangen in plaats van behangen: "${zin.slice(0, 110)}"`)
        break
      }
    }
  }
}

// 15e. De PRIJSVERGELIJKING staat er niet, maar zijn eigen twee woorden wel. Deze
//      regel is op 25-10-2026 vier keer verzet en de gang erheen is de les:
//
//        1. "goedkoper dan stucen en schilderen" kwam woordelijk uit de notulen van
//           datzelfde overleg, dus elke poort stond groen. Pascal haalde hem er zelf
//           uit toen hij hem op de pagina zag ("Deze mag er wel uit.").
//        2. De regel toetste daarna op goedko* SAMEN MET stucen/schilderen, want de
//           "later goedkoper"-kant was op dat moment juist gevraagd (Armando 16:00).
//        3. Die kant werd om 18:33 ingetrokken. Toen ging de regel op het prijswoord
//           zelf, want de voorwaarde in stap 2 was een gat: "elke volgende kleur
//           goedkoper" noemt geen stucwerk en liep er zo langs.
//        4. En dat was te breed. Armando 18:40: "je hoefde alleen weg te halen wat
//           klant zei dat weg moest." Pascal streepte EEN zin door. Stap 3 schrapte
//           daarnaast "relatief goedkoop" op drie plekken - zijn eigen twee woorden
//           uit zijn advertentie van 2018.
//
//      Een poort die te streng staat is net zo fout als een die te ruim staat: deze
//      haalde de tekst van de klant van zijn eigen site af. Dus: het prijswoord zakt,
//      met een uitzondering die bij naam genoemd staat en haar reden draagt - en die
//      uitzondering zakt zelf zodra ze nergens meer op slaat, anders dekt ze morgen
//      iets anders toe (zelfde opzet als `toegestaan` in de aipoort).
const PRIJSWOORD = /goedko|voordeliger|scheelt u|bespaart/i
const PRIJS_TOEGESTAAN = [
  {
    sleutel: /relatief goedkoop/gi,
    waarom: 'zijn eigen twee woorden uit zijn advertentie van 2018, zonder vergelijking',
    geraakt: 0,
  },
]
// De vergelijking die hij doorstreepte, en die blijft ook binnen een toegestane zin
// verboden - anders is "relatief goedkoop, goedkoper dan stucwerk" een vrijbrief.
const VERGELIJKING = /(goedko|voordeliger|scheelt|bespaar)[^.]{0,80}(stuc|schilderwerk|schilderen|behangen|verven)|((stuc|schilderwerk|schilderen)[^.]{0,80}(goedko|voordeliger|duurder))/i
for (const p of PAGINAS) {
  for (const zin of zinnen(p.html)) {
    if (VERGELIJKING.test(zin)) {
      zak(`${p.naam} vergelijkt de prijs met stucen of schilderen, en die zin heeft Pascal doorgestreept: "${zin.slice(0, 110)}"`)
      continue
    }
    let rest = zin
    for (const t of PRIJS_TOEGESTAAN) {
      const n = (zin.match(t.sleutel) || []).length
      if (n) { t.geraakt += n; rest = rest.replace(t.sleutel, ' ') }
    }
    if (!PRIJSWOORD.test(rest)) continue
    zak(`${p.naam} voert de prijs als argument op in onze eigen woorden: "${zin.slice(0, 110)}"`)
  }
}
for (const t of PRIJS_TOEGESTAAN) {
  if (!t.geraakt) zak(`de uitzondering "${t.sleutel.source}" raakt niets meer (${t.waarom}) - haal hem weg of zet de regel terug`)
}

// --------------------------------------------------------- 16. een coating, niet twee
//
// Tot 25-10-2026 stond op VIER plekken dat Anti Marks en Easy Clean samen aangebracht
// kunnen worden bij twee keer texen (doorgegeven via Armando op 20-10-2026, en dat
// bleek onjuist). Armando noemde er twee bij naam: "Werkwijze de afwerking" en "Wat
// het kost". De andere twee stonden in het verfblok en bij de vragen. Een fout die op
// vier plekken staat komt op een vijfde terug, dus dit is een regel en geen correctie.
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  for (const fout of [
    /(beide|twee|allebei)[^.]{0,60}coatings?[^.]{0,40}samen/i,
    /coatings?[^.]{0,40}samen aangebracht/i,
    /(Anti Marks|Easy Clean)[^.]{0,50}(en|\+)[^.]{0,50}(Easy Clean|Anti Marks)[^.]{0,40}samen/i,
  ]) {
    if (fout.test(plat)) zak(`${p.naam} zegt dat er twee coatings samen aangebracht worden - het is er een`)
  }
}
// En de kant die het wel moet zeggen: de startpagina zegt dat er EEN gekozen wordt.
// Drie kaarten naast elkaar lezen zonder die regel als een lijst die je kunt stapelen.
//
// Tot 25-10-2026 stond die regel twee keer in hetzelfde blok: in de lead boven de
// kaarten en nog eens vetgedrukt eronder. De tweede is weg op aanwijzing van Armando.
// Deze eis toetst daarom de LEAD en niet de hele pagina - anders zou hij ook groen
// blijven als de zin alleen nog in een voetnoot of in een vraag ergens beneden staat,
// en dan is de eis geen eis meer maar een woordentelling.
const VERFLEAD = (HOME.match(/<div class="verfkop">[\s\S]*?<\/div>\s*<p>([\s\S]*?)<\/p>/) || [])[1] || ''
if (!/kiest een van deze drie/i.test(VERFLEAD)) {
  zak('/ zegt in de lead boven de verfkaarten niet dat er EEN coating gekozen wordt')
}

// 16b. De claim op Anti Marks is ingeperkt: Pascal zei dat een koffer wel schade geeft.
//      Koffers, tassen en "stoten" zijn daarmee van de pagina. Dit is de ene plek waar
//      een poort niet helpt - de woorden staan letterlijk in het blad van AkzoNobel,
//      dus de bronpoort keurt ze goed. Alleen is de fabrikant hier de verkeerde bron.
for (const p of PAGINAS) {
  const plat = p.html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  for (const woord of ['koffer', 'tassen']) {
    if (new RegExp(woord, 'i').test(plat)) {
      zak(`${p.naam} claimt nog bestand tegen ${woord} - Pascal zegt dat dat wel schade geeft`)
    }
  }
}
// 16c. En de kant die erbij moest: ketchup in de keuken, Pascals eigen voorbeeld. Dat
//      is sterker dan "vlekafstotend", want het noemt de ruimte waar iemand het
//      probleem heeft.
if (!/ketchup/i.test(HOME)) zak('/ noemt het ketchupvoorbeeld bij Easy Clean niet')
if (!/keuken/i.test(HOME)) zak('/ noemt de keuken niet bij Easy Clean')

// 16d. Schrobklasse 1 staat onder de drie kaarten. Deze regel is er twee keer uit en
//      een keer in geweest: hij stond er tot 20-10-2026, Armando streepte hem door
//      (een norm uit een fabrikantblad zegt een bewoner niets), Pascal noemde hem in
//      het overleg van 25-10-2026 weer, en die avond gaf Armando door dat de klant hem
//      er wel op wil hebben. Een regel die drie keer van richting wisselt haal je niet
//      nog eens weg op gevoel - vandaar een eis, met de reden erbij.
if (!/schrobklasse 1/i.test(HOME)) zak('/ noemt schrobklasse 1 niet meer - de klant wil hem erop')

// 16e. Geen "op aanvraag" aan een coating. Dat stond bij Pure Mat op de kaart (vlag),
//      in vraag 12 en in "De afwerking" op /werkwijze/, en het is er in drie stappen
//      af gegaan (Armando, 25-10-2026). De reden is elke keer dezelfde: de zin ernaast
//      zegt dat u er EEN kiest uit drie, en "op aanvraag" zet de derde dan buiten die
//      keuze - op een andere as dan wat de twee andere kaarten beloven.
//
//      De regel kijkt naar het GEZELSCHAP en niet naar de woorden zelf, want "Elke
//      andere kleur op aanvraag" onder de kleurkaarten is juist goed: daar gaat het
//      over een kleur bestellen en niet over een keuze uit drie.
//
//      Hij loopt daarom per TEKSTBLOK en niet over de platgeslagen pagina. Dat is geen
//      detail: die kleurregel staat vlak boven het verfblok, dus op de platte tekst
//      raakte "op aanvraag ... De coating" elkaar binnen zestig tekens en ging de
//      poort af op precies de regel die moet blijven staan.
for (const p of PAGINAS) {
  const namen = `(${[VERF.a, VERF.b, VERF.c].join('|')}|Pure Mat|coating)`
  const fouten2 = [
    new RegExp(`op aanvraag[^.]{0,60}${namen}`, 'i'),
    new RegExp(`${namen}[^.]{0,60}op aanvraag`, 'i'),
  ]
  for (const blok of p.html.split(/<[^>]+>/)) {
    const tekst = blok.replace(/\s+/g, ' ')
    if (fouten2.some((f) => f.test(tekst))) {
      zak(`${p.naam} hangt "op aanvraag" aan een coating - het is een keuze uit drie`)
      break
    }
  }
}
// En de kant die moet blijven staan: de kleurregel onder de kleurkaarten. Die MAG
// "op aanvraag" zeggen, dus hij is het bewijs dat de regel hierboven niet te breed is.
if (!/andere kleur op aanvraag/i.test(HOME)) {
  zak('/ mist de kleurregel "Elke andere kleur op aanvraag" - die hoort juist te blijven')
}

// --------------------------------------------------------- 17. de oude prijzen
//
// 10 en 16 euro gingen op 25-10-2026 naar 11 en 17,50. De oude bedragen staan nog in
// zijn Marktplaats-advertentie van 2018, dus dit is dezelfde val als traprenovatie en
// egaliseren: wie uit het korpus werkt zet ze terug. De kop van dat bronbestand zegt
// nu dat ze achterhaald zijn; deze regel is de bodem.
for (const p of PAGINAS) {
  // De entiteiten eerst eruit. Op de startpagina staat het bedrag in de rekenhulp als
  // `&euro;&nbsp;11,00`, en een patroon met `\s*` tussen het teken en het getal loopt
  // daar langs: `&nbsp;` is geen witruimte zolang het een entiteit is. Deze regel ging
  // daardoor wel af op /werkwijze/ (waar het bedrag in een zin staat) en niet op de
  // startpagina, en dat is precies de helft waar het tarief echt uit PRIJZEN komt.
  const plat = p.html
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&euro;/g, '€')
    .replace(/\s+/g, ' ')
  for (const oud of [10, 16]) {
    for (const re of [
      new RegExp(`(vanaf|v\\.a\\.|€)\\s*${oud}[,.]00`, 'i'),
      new RegExp(`\\b${oud} euro per m2`, 'i'),
    ]) {
      if (re.test(plat)) zak(`${p.naam} noemt het oude tarief van ${oud} euro per m2`)
    }
  }
}

// --------------------------------------------------------- 18. zoekwoorden
//
// De werkwijzepagina moet ranken voor renovlies (Armando, 25-10-2026). Wat dat kan
// betekenen is gemeten (bron/seo/kw.json en serp.json) en staat in de README. Twee
// eisen volgen eruit, en ze hangen aan elkaar:
//
//   a. "renovliesbehang" staat in de titel en de h1 van beide pagina's. Dat is met
//      14.800 per maand het grootste woord (tegen 8.100 voor "renovlies") en het is
//      ook zijn eigen woord: "Renovlies behang is een zeer gewilde behangsoort" staat
//      in zijn advertentie. Het bevat "renovlies" letterlijk, dus het ene kost het
//      andere niets.
//   b. De twee pagina's mikken NIET op hetzelfde. De startpagina pakt het kopwoord met
//      zijn plaats erbij, /werkwijze/ pakt het vraagcluster ("wat is", "verschil").
//      Twee pagina's op een woord wegen elkaar weg, en dat is hier makkelijk per
//      ongeluk gedaan: beide pagina's gaan over hetzelfde onderwerp.
for (const p of PAGINAS) {
  const titel = p.html.match(/<title>([^<]+)<\/title>/)?.[1] || ''
  const h1 = (p.html.match(/<h1>([\s\S]*?)<\/h1>/)?.[1] || '').replace(/<[^>]+>/g, ' ')
  if (!/renovliesbehang/i.test(titel)) zak(`${p.naam} heeft geen "renovliesbehang" in de title`)
  if (!/renovliesbehang/i.test(h1)) zak(`${p.naam} heeft geen "renovliesbehang" in de h1`)
}
{
  const h = PAGINAS.find((p) => p.start)
  const w = PAGINAS.find((p) => !p.start)
  if (h && w) {
    const titelH = h.html.match(/<title>([^<]+)<\/title>/)?.[1] || ''
    const titelW = w.html.match(/<title>([^<]+)<\/title>/)?.[1] || ''
    if (titelH === titelW) zak('beide pagina\'s hebben dezelfde title')
    // De startpagina is de lokale pagina: zijn plaats hoort in de titel, want daar is
    // hij wel te vinden. /werkwijze/ is de uitlegpagina en moet juist de vraag pakken.
    if (!new RegExp(BEDRIJF.plaats, 'i').test(titelH)) zak(`/ heeft ${BEDRIJF.plaats} niet in de title`)
    if (!/wat is|verschil|hoe/i.test(titelW)) zak('/werkwijze/ heeft geen vraagwoord in de title')
  }
}

// 14. De sitemap noemt elke pagina die er is, en niets anders.
const sitemap = fs.readFileSync(path.join(DIST, 'sitemap.xml'), 'utf8')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
for (const p of PAGINAS) {
  const url = `https://${BEDRIJF.domein}${p.naam}`
  if (!locs.includes(url)) zak(`${url} staat niet in de sitemap`)
}
if (locs.length !== PAGINAS.length) zak(`de sitemap heeft ${locs.length} adressen voor ${PAGINAS.length} pagina's`)

// --------------------------------------------------------- 18. geen bouwnotitie in de pagina
//
// Gevonden op 25-10-2026 bij het weghalen van de regel onder de verfkaarten: de notitie
// WAAROM hij weg moest ging als <!-- --> mee de pagina op, en daarmee stond de
// geschrapte zin alsnog in de broncode. Drie andere deden hetzelfde, en die noemden
// Armando bij naam en beschreven welke foto "niet zo best" was. Dat is intern overleg
// op een pagina die een klant opent - precies wat de taalpoort in een document blokkeert.
//
// De oplossing is structureel en niet per notitie: een uitleg hoort in build.mjs of
// inhoud.mjs, waar hij in de BOUWER staat. Binnen een template-literal kan dat met
// ${/* ... */ ''}, dus de notitie hoeft niet te verdwijnen om niet mee te gaan.
for (const p of PAGINAS) {
  const commentaar = [...p.html.matchAll(/<!--([\s\S]*?)-->/g)]
    // Twee uitzonderingen die geen notitie zijn en wel in html horen.
    .filter((m) => !/^\s*\[if |^\s*</.test(m[1]))
  if (commentaar.length) {
    zak(
      `${p.naam} draagt ${commentaar.length} html-commentaar in de broncode: ` +
        `"${commentaar[0][1].trim().slice(0, 70)}..." - zet die uitleg in build.mjs`,
    )
  }
}

// 24. Geen leeg tekstelement in de html. Dit is de bodem onder de alineatelling in
// wBlokken (build.mjs): een blok waar de tweede alinea uit gaat, liet tot 25-10-2026
// een lege <p> achter. Die is in de browser onzichtbaar op een stukje witruimte na,
// steekt nergens buiten en staat in geen enkele meting - dus hij blijft staan. Breed
// gehouden (p, h2, h3, li, figcaption) omdat dit niet aan dat ene blok ligt: elke
// bouwer hier plakt een element om een waarde uit inhoud.mjs heen.
//
// Een uitzondering, erbij op 26-10-2026: een `role="status"` HOORT leeg te zijn. Dat is
// het vakje waarin het offerteformulier zijn uitkomst meldt, en een live region die al
// tekst draagt bij het laden van de pagina laat een schermlezer die tekst voorlezen
// zodra hij in beeld komt - dus precies de melding die er nog niet is. Hij staat op
// `:empty{display:none}`, dus hij neemt ook geen witruimte in. De uitzondering is zo
// smal als hij kan: alleen dit ene attribuut, niet "een p zonder tekst mag soms".
for (const p of PAGINAS) {
  const leeg = [...p.html.matchAll(/<(p|h2|h3|li|figcaption)\b[^>]*>\s*<\/\1>/gi)]
    .filter((m) => !/\brole="status"/.test(m[0]))
  // En de uitzondering zakt zelf zodra hij nergens meer op slaat, net als een
  // uitzondering in de ai-poort: anders dekt hij over een maand een echte lege alinea
  // toe die toevallig dat attribuut heeft meegekregen.
  if (!/<p[^>]*\brole="status"[^>]*>\s*<\/p>/i.test(p.html)) {
    zak(`${p.naam} heeft geen leeg role="status"-vakje meer - haal de uitzondering in regel 24 weg`)
  }
  if (leeg.length) {
    zak(`${p.naam} heeft ${leeg.length} leeg tekstelement: "${leeg[0][0].slice(0, 70)}"`)
  }
}

if (fouten.length) {
  console.error(`\ncontroleer: ${fouten.length} probleem(en)\n`)
  for (const f of fouten) console.error('  - ' + f)
  process.exit(1)
}
console.log(`controleer: ${PAGINAS.length} pagina's schoon`)
