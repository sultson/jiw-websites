// Loopt de nieuwe onderdelen echt door in een browser en maakt er schermfoto's van:
// het telefoonmenu, de rekenhulp in drie stappen en de zwevende knoppenbalk.
// Een meting die alleen naar breedtes kijkt ziet namelijk niet of een knop iets doet.
//
//   node proef.mjs
//
// Zakt hij, dan is er een haakje hernoemd zonder dat de rest meeging.

import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
// Playwright uit de devDependencies van deze app. Stond tot de verhuizing van
// 26-10-2026 als absoluut pad naar claudius/node_modules - dat werkt op deze machine
// en breekt elke verse kloon, zelfde val als de MAPBOX_TOKEN bij dagmar-voss.
import { chromium } from 'playwright'
import { dien } from './dienen.mjs'
import { PRIJZEN } from './inhoud.mjs'

// De tarieven stonden in dit script als losse getallen ("200 m2 maal 16 euro geeft
// 3.200"). Op 25-10-2026 ging de 16 naar 17,50 en toen zakte deze proef op een
// uitkomst die juist goed was. Een controle die zijn eigen cijfers bijhoudt is de
// verkeerde kant op streng: hij houdt de oude prijs in stand. Nu komt het tarief uit
// PRIJZEN en wordt het bedrag hier uitgerekend.
const geld = (x) => x.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

const HIER = path.dirname(fileURLToPath(import.meta.url))
// Over een server, want sinds 20-10-2026 zijn het twee pagina's met absolute paden
// en moet een link van /werkwijze/ naar /#offerte echt kunnen worden gevolgd.
const server = await dien(path.join(HIER, 'dist'))
const DOEL = server.basis + '/'
const UIT = path.join(HIER, 'proef')
fs.mkdirSync(UIT, { recursive: true })

const fouten = []
const eis = (ok, wat) => { if (!ok) fouten.push(wat) }

const browser = await chromium.launch()
const p = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
await p.goto(DOEL, { waitUntil: 'networkidle' })
await p.waitForTimeout(400)

// ---- 1. telefoonmenu
eis(await p.locator('#burger').isVisible(), 'de burger staat niet in beeld op 390px')
await p.locator('#burger').click()
await p.waitForTimeout(400)
eis(await p.locator('#lade').evaluate((el) => el.classList.contains('aan')), 'het menu gaat niet open')
eis(await p.locator('.lade-w').first().isVisible(), 'de menuregels zijn niet zichtbaar')
await p.screenshot({ path: path.join(UIT, 'menu.png') })

await p.locator('.lade-uit').click()
await p.waitForTimeout(350)
eis(await p.locator('.lade-pak').first().isVisible(), 'het prijsblok in het menu klapt niet uit')
await p.screenshot({ path: path.join(UIT, 'menu-prijzen.png') })

// een link sluit het menu weer
await p.locator('.lade-pak').first().click()
await p.waitForTimeout(400)
eis(!(await p.locator('#lade').evaluate((el) => el.classList.contains('aan'))), 'het menu blijft open na een klik op een link')

// ---- 2. rekenhulp in drie stappen
await p.locator('#prijzen').scrollIntoViewIfNeeded()
await p.waitForTimeout(300)
eis(await p.locator('[data-p="1"]').isVisible(), 'stap 1 staat niet in beeld')
await p.screenshot({ path: path.join(UIT, 'reken-1.png') })

await p.locator('.pakket').nth(1).click()           // plakken en texen
await p.locator('[data-p="1"] [data-naar="2"]').click()
await p.waitForTimeout(300)
eis(await p.locator('[data-p="2"]').isVisible(), 'stap 2 opent niet')
await p.locator('#m2').fill('80')
eis(await p.locator('#m2-laag').isVisible(), 'onder de ondergrens komt er geen melding')
await p.locator('[data-stap="10"]').click()
eis((await p.locator('#m2').inputValue()) === '90', 'de plusknop telt niet op')
await p.locator('#m2').fill('200')
await p.waitForTimeout(150)
eis(!(await p.locator('#m2-laag').isVisible()), 'de melding blijft staan boven de ondergrens')
await p.screenshot({ path: path.join(UIT, 'reken-2.png') })

await p.locator('[data-p="2"] [data-naar="3"]').click()
await p.waitForTimeout(300)
eis(await p.locator('[data-p="3"]').isVisible(), 'stap 3 opent niet')
const bedrag = await p.locator('#res-bedrag').textContent()
const wacht1 = geld(200 * PRIJZEN.plakkenTexen)
eis(bedrag.includes(wacht1), `200 m2 maal ${PRIJZEN.plakkenTexen} geeft niet ${wacht1} maar "${bedrag}"`)
// En het tarief eronder, want DAT is waar de centen stuk gingen: tot 25-10-2026 stond
// er ',00' hardgecodeerd achter een toLocaleString, en 17,5 werd daarmee "17,5,00".
// Een bedrag dat geen poort ziet, want het is geen overloop en geen onjuiste bewering.
const tarief = await p.locator('#res-tarief').textContent()
eis(
  tarief.includes(geld(PRIJZEN.plakkenTexen)) && !/,\d+,/.test(tarief),
  `het tarief staat er niet als ${geld(PRIJZEN.plakkenTexen)} maar als "${tarief}"`
)
// Een oneven aantal m2 op een tarief met centen: 101 x 17,50 is 1.767,50 en niet
// 1.767,5. Dit is het geval dat 200 m2 verstopt, want 200 maal 17,5 is rond.
await p.locator('[data-p="3"] [data-naar="2"]').click()
await p.locator('#m2').fill('101')
await p.locator('[data-p="2"] [data-naar="3"]').click()
await p.waitForTimeout(250)
const oneven = await p.locator('#res-bedrag').textContent()
eis(
  oneven.includes(geld(101 * PRIJZEN.plakkenTexen)),
  `101 m2 maal ${PRIJZEN.plakkenTexen} geeft niet ${geld(101 * PRIJZEN.plakkenTexen)} maar "${oneven}"`
)
await p.locator('[data-p="3"] [data-naar="2"]').click()
await p.locator('#m2').fill('200')
await p.locator('[data-p="2"] [data-naar="3"]').click()
await p.waitForTimeout(250)
const meta = await p.locator('.res-meta').textContent()
eis(/200 m2/.test(meta), `het aantal m2 staat niet in de uitkomst: "${meta}"`)
await p.screenshot({ path: path.join(UIT, 'reken-3.png') })

// het derde pakket (2x texen, 23 euro) rekent met zijn eigen tarief. Dit is er op
// 20-10-2026 bijgekomen en de rekenhulp leest het tarief uit de `value` van het
// keuzerondje: staat daar het verkeerde bedrag, dan klopt de uitkomst stil niet.
await p.locator('[data-p="3"] [data-naar="2"]').click()
await p.locator('[data-p="2"] [data-naar="1"]').click()
await p.locator('.pakket').nth(2).click()           // plakken en 2x texen
await p.locator('[data-p="1"] [data-naar="2"]').click()
await p.locator('#m2').fill('200')
await p.locator('[data-p="2"] [data-naar="3"]').click()
await p.waitForTimeout(300)
const bedrag2 = await p.locator('#res-bedrag').textContent()
const wacht2 = geld(200 * PRIJZEN.plakkenTexen2)
eis(bedrag2.includes(wacht2), `200 m2 maal ${PRIJZEN.plakkenTexen2} geeft niet ${wacht2} maar "${bedrag2}"`)
const meta2 = await p.locator('.res-meta').textContent()
eis(/2x texen/.test(meta2), `de uitkomst noemt het gekozen pakket niet: "${meta2}"`)

// leeg veld mag niet doorlopen naar de uitkomst
await p.locator('[data-p="3"] [data-naar="2"]').click()
await p.locator('#m2').fill('')
await p.locator('[data-p="2"] [data-naar="3"]').click()
await p.waitForTimeout(200)
eis(await p.locator('#m2-leeg').isVisible(), 'een leeg aantal m2 loopt stil door')
eis(!(await p.locator('[data-p="3"]').isVisible()), 'stap 3 opent met een leeg aantal m2')

// ---- 3. zwevende knoppenbalk: hij hangt aan een vaste scrollafstand (310 px, de
// maat van mts-vloerverwarming) en niet aan het einde van de hero. Daarom wordt hij
// hier net onder en net boven die drempel getoetst: scrollen tot ver voorbij de hero
// zou ook slagen als hij weer pas na twee schermen zou komen.
await p.evaluate(() => window.scrollTo(0, 0))
await p.waitForTimeout(600)
eis(!(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan'))), 'de zwevende balk staat al in beeld boven de hero')
await p.evaluate(() => window.scrollTo(0, 240))
await p.waitForTimeout(400)
eis(!(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan'))), 'de zwevende balk komt al na 240 px in beeld')
await p.evaluate(() => window.scrollTo(0, 400))
await p.waitForTimeout(400)
eis(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan')), 'de zwevende balk is er na 400 px scrollen nog niet, en dat is de klacht van 20-10-2026')
await p.evaluate(() => window.scrollTo(0, 2400))
await p.waitForTimeout(700)
eis(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan')), 'de zwevende balk komt niet in beeld na het scrollen')
// via evaluate en niet via boundingBox(): de balk kan hier met goed recht onzichtbaar
// zijn (hij gaat weg als hij een knop afdekt) en boundingBox geeft dan null.
const balk = await p.locator('#zwevend').evaluate((el) => {
  const r = el.getBoundingClientRect(); return { x: r.x, width: r.width }
})
eis(balk.x >= -1 && balk.x + balk.width <= 391, `de zwevende balk loopt buiten het scherm: ${JSON.stringify(balk)}`)
await p.screenshot({ path: path.join(UIT, 'zwevend.png') })

// ---- 3b. de zwevende balk mag nooit over een knop staan waar je op moet tikken
// (Armando, 20-10-2026: "staat bellen en whatsapp op de knoppen waar je op moet
// drukken om terug of verder te gaan"). Hij gaat weg zodra hij een .vrijhouden-rij
// raakt en zodra er in een veld getypt wordt - met het toetsenbord open kruipt een
// vaste balk op iOS mee omhoog en staat hij precies over het veld.
const wegNu = () => p.locator('#zwevend').evaluate((el) => el.classList.contains('weg'))

// a. stap 02 mag op een telefoon zelf geen toetsenbord oproepen. Dat deed het wel, en
// dat was de bron van allebei de klachten: iOS zoomt bij focus de pagina in en het
// toetsenbord duwt de vaste balk omhoog, precies over de stapknoppen.
await p.locator('#prijzen').scrollIntoViewIfNeeded()
if (await p.locator('[data-p="2"]').isVisible()) await p.locator('[data-p="2"] [data-naar="1"]').click()
await p.locator('[data-p="1"] [data-naar="2"]').click()
await p.waitForTimeout(300)
eis(
  (await p.evaluate(() => document.activeElement && document.activeElement.id)) !== 'm2',
  'stap 02 zet op een telefoon zelf focus in het m2-veld, dus het toetsenbord springt omhoog'
)

// b. tikt de bezoeker er wel zelf in, dan gaat de balk weg zolang hij typt
await p.evaluate(() => window.scrollTo(0, 700))
await p.waitForTimeout(350)
eis(!(await wegNu()), 'de zwevende balk is weg terwijl er niets te bedekken valt')
await p.locator('#m2').focus()
await p.waitForTimeout(250)
eis(await wegNu(), 'de zwevende balk blijft staan terwijl er in het m2-veld getypt wordt')
await p.locator('#m2').blur()
await p.waitForTimeout(300)
eis(!(await wegNu()), 'de zwevende balk komt na het typen niet terug')

// c. en hij wijkt als hij over de stapknoppen zou vallen. Op een scherm van 844 px
// kan dat niet gebeuren, met het toetsenbord open wel: dat maakt het zichtbare deel
// een stuk korter. Een kort scherm bootst dat na.
await p.setViewportSize({ width: 390, height: 430 })
await p.evaluate(() => {
  const r = document.querySelector('[data-p="2"] .paneel-knoppen').getBoundingClientRect()
  window.scrollBy(0, r.top - (window.innerHeight - 96))
})
await p.waitForTimeout(450)
const vak = await p.evaluate(() => {
  const r = document.querySelector('[data-p="2"] .paneel-knoppen').getBoundingClientRect()
  return { top: r.top, bottom: r.bottom }
})
eis(await wegNu(), 'de zwevende balk blijft staan terwijl hij over Terug / Toon richtprijs valt')
const dekt = await p.locator('#zwevend').evaluate((el, r) => {
  const z = el.getBoundingClientRect()
  return getComputedStyle(el).visibility === 'visible' && z.bottom > r.top && z.top < r.bottom
}, vak)
eis(!dekt, 'de knoppen van stap 02 zitten nog onder de zwevende balk')
await p.screenshot({ path: path.join(UIT, 'zwevend-stap2.png') })

// d. een balk die daarna wegblijft is net zo stuk. De vijf redenen hebben geen
// knoppen, dus daar hoort hij gewoon te staan.
await p.setViewportSize({ width: 390, height: 844 })
await p.locator('#renovlies').scrollIntoViewIfNeeded()
await p.waitForTimeout(450)
eis(!(await wegNu()), 'de zwevende balk blijft weg op een plek waar hij niets afdekt')
eis(await p.locator('#zwevend').isVisible(), 'de zwevende balk komt niet meer terug')

// ---- 4. kleurstrook
await p.locator('#kleur').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
await p.screenshot({ path: path.join(UIT, 'kleur.png') })
await p.evaluate(() => { const s = document.getElementById('kleuren'); s.scrollLeft = s.children[0].offsetWidth + 12 })
await p.waitForTimeout(400)
eis(await p.locator('#kleurstippen span').nth(1).evaluate((el) => el.classList.contains('aan')), 'de stippen lopen niet mee met de kleurstrook')

// ---- 5. werkstrook: schuift opzij, teller en duimnagels lopen mee
await p.locator('#werk').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
const rail = p.locator('#werkrail')
eis(await rail.evaluate((el) => el.scrollWidth > el.clientWidth + 20), 'de werkstrook schuift niet opzij')
eis((await p.locator('#werk-nu').textContent()) === '01', 'de teller begint niet op 01')
await p.screenshot({ path: path.join(UIT, 'werk.png') })

await p.locator('#werkduim button').nth(2).click()
await p.waitForTimeout(700)
eis((await p.locator('#werk-nu').textContent()) === '03', `een klik op de derde duimnagel zet de teller niet op 03 maar op ${await p.locator('#werk-nu').textContent()}`)
eis(await p.locator('#werkduim button').nth(2).evaluate((el) => el.classList.contains('aan')), 'de aangeklikte duimnagel krijgt geen kader')
const k3 = await p.locator('.werkkaart').nth(2).boundingBox()
eis(k3.x > -2 && k3.x < 40, `de derde foto staat niet links in beeld: x=${Math.round(k3.x)}`)
await p.screenshot({ path: path.join(UIT, 'werk-3.png') })

// de laatste foto: de duimnagelrij moet zelf meeschuiven, anders staat de actieve
// duimnagel buiten beeld
await p.locator('#werkduim button').nth(5).click()
await p.waitForTimeout(900)
eis((await p.locator('#werk-nu').textContent()) === '06', 'de laatste foto zet de teller niet op 06')
const [duim6, rij] = [await p.locator('#werkduim button').nth(5).boundingBox(), await p.locator('#werkduim').boundingBox()]
eis(duim6.x >= rij.x - 2 && duim6.x + duim6.width <= rij.x + rij.width + 2,
  `de actieve duimnagel staat buiten de rij: ${Math.round(duim6.x)} in ${Math.round(rij.x)}..${Math.round(rij.x + rij.width)}`)

// ---- 6. de tweede pagina: /werkwijze/
// Een bezoeker kan hier binnenkomen via Google, dus de navigatie moet het hier net
// zo goed doen, en elke knop moet terug naar het blok op de startpagina waar hij
// hoort. Een kaal #offerte wijst hier naar niets.
await p.goto(server.basis + '/werkwijze/', { waitUntil: 'networkidle' })
await p.waitForTimeout(400)
eis((await p.locator('h1').count()) === 1, 'de werkwijzepagina heeft niet precies een h1')
eis(await p.locator('#burger').isVisible(), 'de burger staat niet in beeld op /werkwijze/')
await p.locator('#burger').click()
await p.waitForTimeout(400)
eis(await p.locator('#lade').evaluate((el) => el.classList.contains('aan')), 'het menu gaat niet open op /werkwijze/')
await p.screenshot({ path: path.join(UIT, 'werkwijze-menu.png') })
await p.locator('#lade-sluit').click()
await p.waitForTimeout(300)

eis(!(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan'))),
  'de zwevende balk staat al in beeld boven de paginakop van /werkwijze/')
await p.evaluate(() => window.scrollTo(0, 400))
await p.waitForTimeout(400)
eis(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan')),
  'de zwevende balk komt op /werkwijze/ niet na 400 px in beeld')
await p.evaluate(() => window.scrollTo(0, 1600))
await p.waitForTimeout(700)
eis(await p.locator('#zwevend').evaluate((el) => el.classList.contains('aan')),
  'de zwevende balk komt niet in beeld op /werkwijze/')
eis((await p.locator('.rijen > div').count()) === 6, 'de werkwijzepagina heeft geen zes stappen')
// Acht sinds 20-10-2026: "Inbegrepen" kwam erbij toen Pascal doorgaf dat schuren en
// lichte reparaties in zijn prijs zitten, en "Plakken en 2x texen" toen bleek dat de
// 16 euro een keer texen is en er een derde tarief van 23 euro bestaat.
eis((await p.locator('.afspraak').count()) === 8, 'het blok met prijs en afspraken heeft geen acht punten')
await p.locator('#afspraken').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
await p.screenshot({ path: path.join(UIT, 'werkwijze-afspraken.png') })

// ---- 6b. het offerteblok onderaan /werkwijze/ (Armando, 20-10-2026: elke pagina
// sluit af zoals de startpagina). Html alleen is hier niet genoeg: het formulier
// bouwt zijn WhatsApp-link in javascript, en dat stond tot nu toe in het blok dat
// alleen op de startpagina staat. Zonder dat script staat er een formulier dat een
// leeg bericht verstuurt - en dat ziet er van buiten precies hetzelfde uit.
await p.locator('#offerte').scrollIntoViewIfNeeded()
await p.waitForTimeout(400)
eis(await p.locator('#aanvraag').isVisible(), 'het offerteformulier staat niet op /werkwijze/')
await p.fill('#f-naam', 'Testpersoon')
await p.fill('#f-plaats', 'Emmen')
await p.fill('#f-m2', '120')
await p.waitForTimeout(250)
const waLink = await p.locator('#naar-wa').getAttribute('href')
eis(waLink.includes('Testpersoon') && waLink.includes('Emmen') && waLink.includes('120'),
  `de WhatsApp-knop op /werkwijze/ neemt het ingevulde niet mee: ${waLink}`)
/* De mailknop is er sinds de verhuizing van 26-10-2026 niet meer: het formulier
   VERSTUURT nu zelf naar /api/forms/offerte, en dat is wat de mailknop deed, alleen
   beter (de aanvraag wordt opgeslagen en de bezoeker krijgt een bevestiging). De
   WhatsApp-knop is gebleven als tweede weg en houdt zijn voorgevulde bericht.

   In plaats daarvan toetst dit nu het echte verzendpad, maar ZONDER te versturen: de
   action moet kloppen en de submit-handler moet eraan hangen. Een echte proefaanvraag
   staat in tools/live.mjs en loopt tegen de live site, want een verzending hoort niet
   in een script dat je tien keer per middag draait. */
eis((await p.locator('#aanvraag').getAttribute('action')) === '/api/forms/offerte',
  'het formulier op /werkwijze/ post niet naar /api/forms/offerte')
eis(await p.locator('#verstuur').isVisible(), 'de verstuurknop staat niet op /werkwijze/')
eis(await p.evaluate(() => !document.getElementById('f-website').offsetParent),
  'het lokvink staat in beeld op /werkwijze/')
/* Het m2-veld mag geen ronde getallen afkeuren. `min="1" step="10"` deed dat wel, en
   dan blokkeert de browser de aanvraag bij 100 - precies het getal dat iemand hier
   intypt. Gevonden op 26-10-2026 op de live site; hier staat het als gedrag en niet
   alleen als html-regel in controleer.mjs. */
for (const waarde of ['100', '120', '85']) {
  await p.fill('#f-m2', waarde)
  eis(await p.evaluate(() => document.getElementById('f-m2').checkValidity()),
    `het m2-veld keurt ${waarde} af - dan komt de aanvraag niet weg`)
}
await p.fill('#f-m2', '120')
await p.screenshot({ path: path.join(UIT, 'werkwijze-offerte.png') })

// En de contactregel in het telefoonmenu moet naar DIT formulier springen, niet naar
// de startpagina: anders raakt een bezoeker kwijt wat hij net heeft ingevuld.
await p.locator('#burger').click()
await p.waitForTimeout(400)
await p.locator('.lade-link[href="#offerte"]').click()
await p.waitForTimeout(600)
eis(new URL(p.url()).pathname === '/werkwijze/', `de contactregel springt van /werkwijze/ weg: ${p.url()}`)
eis(await p.locator('#aanvraag').isVisible(), 'de contactregel komt niet bij het formulier uit')

// de rekenknop moet echt bij de rekenhulp uitkomen
await p.locator('#afspraken a.knop').first().click()
await p.waitForTimeout(900)
eis(new URL(p.url()).pathname === '/', `de rekenknop blijft op /werkwijze/ staan: ${p.url()}`)
eis(await p.locator('#prijzen').isVisible(), 'de rekenhulp staat niet in beeld na een klik op de rekenknop')

await p.close()

// ---- 7. de zwevende bel- en appknoppen op een LAPTOP (Armando, 20-10-2026: "moet
// ook op desktop zijn zoals bij winterswijk"). Tot dan stonden ze alleen onder 720 px,
// en dat ziet een breedtemeting niet: display:none loopt nergens buiten het scherm.
// Winterswijk nagemeten met meet-winterswijk-desk.mjs: twee pillen ONDER elkaar in de
// rechteronderhoek, 24 px van de randen, elk 48 hoog en zo breed als hun label. Dus
// niet alleen "staat er", maar ook die vorm - anders is het de telefoonbalk die over
// de volle breedte van een laptop ligt.
for (const breed of [1440, 1024]) {
  const d = await browser.newPage({ viewport: { width: breed, height: 900 } })
  await d.goto(DOEL, { waitUntil: 'networkidle' })
  await d.waitForTimeout(400)
  eis(!(await d.locator('#zwevend').evaluate((el) => el.classList.contains('aan'))),
    `de zwevende knoppen staan op ${breed}px al boven de hero in beeld`)
  await d.evaluate(() => window.scrollTo(0, 1200))
  await d.waitForTimeout(600)
  eis(await d.locator('#zwevend').isVisible(), `de zwevende knoppen ontbreken op ${breed}px`)
  const vorm = await d.locator('#zwevend').evaluate((el) => {
    const b = el.getBoundingClientRect()
    const k = [...el.children].map((c) => c.getBoundingClientRect())
    return {
      rechts: Math.round(innerWidth - b.right), onder: Math.round(innerHeight - b.bottom),
      breed: Math.round(b.width), richting: getComputedStyle(el).flexDirection,
      hoogtes: k.map((x) => Math.round(x.height)),
      // staan ze echt onder elkaar en niet naast elkaar?
      gestapeld: k.length === 2 && k[1].top >= k[0].bottom - 1,
    }
  })
  eis(vorm.richting === 'column' && vorm.gestapeld,
    `de zwevende knoppen staan op ${breed}px niet onder elkaar: ${JSON.stringify(vorm)}`)
  eis(vorm.rechts === 24 && vorm.onder === 24,
    `de zwevende knoppen staan op ${breed}px niet 24px van de hoek: ${JSON.stringify(vorm)}`)
  eis(vorm.hoogtes.every((h) => h === 48), `de zwevende knoppen zijn op ${breed}px niet 48 hoog: ${JSON.stringify(vorm)}`)
  // Zo breed als hun label, niet zo breed als het scherm: dat is het verschil met de
  // telefoonbalk. Winterswijk meet hier 148; alles onder een derde van het scherm is
  // het goede soort, daarboven ligt de telefoonbalk er dwars overheen.
  eis(vorm.breed < breed / 3, `de zwevende knoppen beslaan op ${breed}px de volle breedte: ${JSON.stringify(vorm)}`)
  if (breed === 1440) await d.screenshot({ path: path.join(UIT, 'zwevend-desktop.png') })
  await d.close()
}

await browser.close()
await server.stop()

if (fouten.length) {
  console.error(`\nproef: ${fouten.length} probleem(en)\n`)
  for (const f of fouten) console.error('  - ' + f)
  process.exit(1)
}
console.log('proef: menu, rekenhulp, zwevende balk, kleurstrook, werkstrook en /werkwijze/ doen wat ze moeten doen')
