/*
 * De klikproef op /handtekening/.
 *
 *   node tools/handtekening-kijk.mjs            na een bouw, tegen dist/
 *   node tools/handtekening-kijk.mjs --plaat    plus een schermafdruk per maat
 *   node tools/handtekening-kijk.mjs --live     plus: haalt het logo echt van het live adres
 *
 * tools/vooraf.mjs keurt de html: staat alles erin, klopt het logo-adres, draagt de
 * pagina noindex. Wat dat niet ziet is of de pagina ook DOET wat er staat, en dat is
 * precies het stuk waar een handtekening aan ophangt:
 *
 *  - zet de knop de handtekening als HTML op het klembord, mét het logo en de kleuren?
 *    Een knop die alleen platte tekst kopieert ziet er hetzelfde uit en levert bij
 *    Pascal een handtekening zonder logo op. Dat merkt hij pas als de ontvanger het zegt.
 *  - volgt het voorbeeld zijn naam? De pagina bouwt de handtekening twee keer met
 *    dezelfde functie (hier in de bouw, en in de browser), dus die twee kunnen uit
 *    elkaar lopen zodra iemand er een van aanpast.
 *  - staan het logo en de tekst echt NAAST elkaar, gemeten in de browser? De bouwpoort
 *    telt de vakken van de tabel, en dat is de vorm. Of ze ook naast elkaar LANDEN is
 *    iets anders: een cel die te breed wordt duwt de tekst eronder zonder dat de html
 *    verandert. Dus hier de echte vakken vergelijken.
 *  - steekt er niets buiten het scherm op een telefoon?
 *
 * Over een server en niet over file://, zelfde reden als bij meet.mjs: de pagina haalt
 * zijn logo van een volledig adres en dat moet een echte host zijn.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { dien } from '../dienen.mjs'
import { handtekeningGegevens } from '../handtekening.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const PLAAT = process.argv.includes('--plaat')
const LIVE = process.argv.includes('--live')
const MATEN = [
  { naam: 'telefoon', breed: 390, hoog: 844 },
  { naam: 'laptop', breed: 1280, hoog: 900 },
]

const G = handtekeningGegevens()
const fouten = []
const zak = (m) => fouten.push(m)

const { basis, stop } = await dien(path.join(HIER, '..', 'dist'))
const browser = await chromium.launch()

try {
  for (const maat of MATEN) {
    const context = await browser.newContext({ viewport: { width: maat.breed, height: maat.hoog } })
    await context.grantPermissions(['clipboard-read', 'clipboard-write'], { origin: basis })
    const pagina = await context.newPage()

    /*
     * Het logo hangt in de handtekening aan het LIVE adres, want daar moet het
     * mailprogramma van de ontvanger het vandaan halen. Voor deze proef komt het uit
     * dist/, zodat de uitslag niet van een internetverbinding afhangt en hij ook een
     * plaat meet die nog niet uitgerold is. Of dat adres het echt doet is een andere
     * vraag, en die staat onderaan onder --live.
     */
    if (!LIVE) {
      await pagina.route(G.logo, (route) =>
        route.fulfill({ contentType: 'image/png', body: fs.readFileSync(path.join(HIER, '..', 'dist', 'logo-mail.png')) }),
      )
    }
    await pagina.goto(`${basis}/handtekening/`, { waitUntil: 'domcontentloaded' })

    // 1. het voorbeeld volgt het naamveld
    await pagina.fill('#naam', 'Jan Hulskers')
    const tekst = await pagina.textContent('#voorbeeld')
    if (!tekst.includes('Jan Hulskers')) {
      zak(`${maat.naam}: het voorbeeld volgt het naamveld niet (${tekst.slice(0, 60)})`)
    }
    /*
     * Er is geen functieveld meer (zie de kop van handtekening.mjs). Zodra er weer een
     * veld bijkomt moet deze proef mee, anders typt Pascal straks in een veld dat niets
     * doet - precies het geval dat hier niet opvalt, want het voorbeeld ziet er goed uit.
     */
    if (await pagina.$('#functie')) {
      zak(`${maat.naam}: er staat weer een functieveld op de pagina en deze proef toetst het niet`)
    }
    // en de gegevens uit inhoud.mjs blijven staan terwijl hij typt
    for (const waarde of [G.telToon, G.mail, G.domein, G.kvk]) {
      if (!tekst.includes(waarde)) zak(`${maat.naam}: ${waarde} staat niet meer in het voorbeeld na het typen`)
    }

    // 2. een lege naam valt terug op de zijne, en niet op niets
    await pagina.fill('#naam', '   ')
    if (!(await pagina.textContent('#voorbeeld')).includes(G.naam)) {
      zak(`${maat.naam}: een leeg naamveld geeft geen handtekening op naam van ${G.naam}`)
    }
    await pagina.fill('#naam', 'Pascal Hulskers')

    // 3. de knop zet HTML op het klembord, met het logo erin
    await pagina.click('#kopieer')
    await pagina.waitForFunction(() => document.getElementById('melding').textContent !== '')
    const klembord = await pagina.evaluate(async () => {
      const items = await navigator.clipboard.read()
      for (const i of items) {
        if (i.types.includes('text/html')) return await (await i.getType('text/html')).text()
      }
      return ''
    })
    if (!klembord.includes('<table')) zak(`${maat.naam}: er staat geen tabel op het klembord, alleen platte tekst`)
    if (!klembord.includes(G.logo)) zak(`${maat.naam}: het logo staat niet op het klembord`)
    if (!klembord.includes(G.telToon)) zak(`${maat.naam}: het telefoonnummer staat niet op het klembord`)
    if (/\sclass=/.test(klembord)) zak(`${maat.naam}: er staat een class op het klembord`)

    /*
     * 3b. logo en tekst naast elkaar, in de browser gemeten.
     *
     * Niet op de html maar op de vakken: het logo moet LINKS van de naam eindigen en de
     * twee moeten elkaar in de hoogte overlappen. Alleen "de naam staat rechts van het
     * logo" is niet genoeg - dan slaagt een gestapelde handtekening ook, want daar staat
     * de naam ook rechts van de linkerrand van het logo.
     */
    const naast = await pagina.evaluate(() => {
      const beeld = document.querySelector('#voorbeeld img')
      const vak = document.querySelector('#voorbeeld td:nth-child(2)')
      if (!beeld || !vak) return null
      const a = beeld.getBoundingClientRect()
      const b = vak.getBoundingClientRect()
      return {
        rechtsVan: Math.round(b.left - a.right),
        overlap: Math.round(Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top)),
      }
    })
    if (!naast) zak(`${maat.naam}: de handtekening heeft geen tweede vak met de tekst erin`)
    else if (naast.rechtsVan < 0 || naast.overlap <= 0) {
      zak(
        `${maat.naam}: logo en tekst staan niet naast elkaar (tekst begint ${naast.rechtsVan} px na het logo, overlap in hoogte ${naast.overlap} px)`,
      )
    }

    /*
     * 4. niets buiten het scherm.
     *
     * De handtekening zelf telt hier NIET mee: die is zo breed als hij in de mail is
     * (ongeveer 395 px, logo naast de tekst) en schuift binnen zijn eigen vak. Hem laten
     * meetellen zou betekenen dat zijn logo in elke mail kleiner wordt om deze
     * hulppagina te laten passen. Het VAK eromheen telt wel mee - anders schuift straks
     * de hele pagina opzij en heet dat hetzelfde.
     */
    const over = await pagina.evaluate((breed) => {
      const uit = []
      const kader = document.getElementById('voorbeeld')
      for (const el of document.querySelectorAll('body *')) {
        if (el !== kader && kader.contains(el)) continue
        const r = el.getBoundingClientRect()
        if (r.width && (r.right > breed + 1 || r.left < -1)) {
          uit.push(`${el.tagName.toLowerCase()} ${Math.round(r.left)}-${Math.round(r.right)}`)
        }
      }
      return uit.slice(0, 4)
    }, maat.breed)
    if (over.length) zak(`${maat.naam}: steekt buiten de ${maat.breed} px: ${over.join(', ')}`)

    // en het vak schuift ook echt, in plaats van de handtekening af te knippen
    const schuift = await pagina.evaluate(() => {
      const k = document.getElementById('voorbeeld')
      return { kan: k.scrollWidth > k.clientWidth, stijl: getComputedStyle(k).overflowX }
    })
    if (schuift.kan && schuift.stijl !== 'auto' && schuift.stijl !== 'scroll') {
      zak(`${maat.naam}: de handtekening past niet in het vak en is niet te schuiven (overflow-x: ${schuift.stijl})`)
    }

    // 5. het logo is echt geladen en staat niet uitgerekt
    await pagina
      .waitForFunction(() => {
        const i = document.querySelector('#voorbeeld img')
        return i && i.complete
      }, { timeout: 10000 })
      .catch(() => {})
    const beeld = await pagina.evaluate(() => {
      const i = document.querySelector('#voorbeeld img')
      return { ok: i.complete && i.naturalWidth > 0, breed: i.naturalWidth, hoog: i.naturalHeight, b: i.width, h: i.height }
    })
    if (!beeld.ok) zak(`${maat.naam}: het logo in het voorbeeld laadt niet`)
    else {
      const scheef = Math.abs(beeld.breed / beeld.hoog - beeld.b / beeld.h)
      if (scheef > 0.02) zak(`${maat.naam}: het logo staat uitgerekt (${beeld.breed}x${beeld.hoog} getoond als ${beeld.b}x${beeld.h})`)
    }

    if (PLAAT) {
      await pagina.screenshot({ path: path.join(HIER, `handtekening-${maat.naam}.png`), fullPage: true })
    }
    await context.close()
  }
} finally {
  await browser.close()
  await stop()
}

if (fouten.length) {
  console.error(`\nhandtekening-kijk: ${fouten.length} probleem(en)\n`)
  for (const f of fouten) console.error(`  - ${f}`)
  console.error('')
  process.exit(1)
}
console.log(`handtekening-kijk: schoon op ${MATEN.map((m) => m.breed).join(' en ')} px`)
