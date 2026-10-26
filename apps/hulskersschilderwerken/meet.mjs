// Meet de gebouwde pagina na in een echte browser.
//
//   node meet.mjs            alle breedtes
//   node meet.mjs --zichtbaar   met de browser in beeld
//
// Waarom 360 en niet alleen 390: een knop met een lang label maakt zichzelf de
// smalste maat van zijn kolom en daarmee van de pagina. Op 390 valt dat niet op.
// Zie playground/CLAUDE.md.

import path from 'node:path'
import { fileURLToPath } from 'node:url'
// Playwright uit de devDependencies van deze app. Stond tot de verhuizing van
// 26-10-2026 als absoluut pad naar claudius/node_modules - dat werkt op deze machine
// en breekt elke verse kloon, zelfde val als de MAPBOX_TOKEN bij dagmar-voss.
import { chromium } from 'playwright'
import { dien } from './dienen.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const BREEDTES = [360, 390, 414, 768, 1024, 1280, 1440]
const MIN_TEKST = 12 // px, kleiner dan dit is op een telefoon niet te lezen
const MAX_KAPITAAL = 25 // px, onder deze maat mag de smalle kopletter geen kapitalen

// Over een server en niet over file://: de pagina's gebruiken absolute paden, en
// zonder stylesheet meet je een pagina die er niet is. Zie dienen.mjs.
const server = await dien(path.join(HIER, 'dist'))
const PADEN = process.env.MEET_URL ? [process.env.MEET_URL] : ['/', '/werkwijze/']

const browser = await chromium.launch({ headless: !process.argv.includes('--zichtbaar') })
const fouten = []

for (const pad of PADEN) {
 const DOEL = pad.startsWith('http') ? pad : server.basis + pad
 console.log(`\n${pad}`)
 for (const breedte of BREEDTES) {
  const pagina = await browser.newPage({ viewport: { width: breedte, height: 900 } })
  await pagina.goto(DOEL, { waitUntil: 'networkidle' })
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await pagina.waitForLoadState('networkidle')

  const uitkomst = await pagina.evaluate(({ min, maxKap }) => {
    const r = { paginabreedte: document.documentElement.scrollWidth, telt: 0, breed: [], klein: [], buiten: [], kapitaal: [], zoomt: [] }
    for (const el of document.querySelectorAll('body *')) {
      const vak = el.getBoundingClientRect()
      if (!vak.width || !vak.height) continue
      r.telt++
      // 1. Steekt het element buiten het scherm?
      if (vak.right > window.innerWidth + 1 || vak.left < -1) {
        const stijl = getComputedStyle(el)
        if (stijl.position === 'fixed' || el.closest('[aria-hidden="true"]')) continue
        r.breed.push({ wat: el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : ''),
          links: Math.round(vak.left), rechts: Math.round(vak.right), tekst: (el.textContent || '').trim().slice(0, 40) })
      }
      // 2. Te kleine tekst in een element dat zelf tekst draagt.
      const kinderen = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())
      if (kinderen) {
        const px = parseFloat(getComputedStyle(el).fontSize)
        if (px < min) r.klein.push({ wat: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0],
          px: Math.round(px * 10) / 10, tekst: (el.textContent || '').trim().slice(0, 40) })
      }
      // 3. Valt een kind buiten zijn eigen kaart? Alle VIER de randen, want boven en
      //    onder is precies waar zoiets misgaat.
      const ouder = el.parentElement
      if (ouder && /kaart|kleurkaart|werkkaart|stap|zijpaneel|vakman/.test(String(ouder.className))) {
        const o = ouder.getBoundingClientRect()
        const speling = 1.5
        if (vak.left < o.left - speling || vak.right > o.right + speling ||
            vak.top < o.top - speling || vak.bottom > o.bottom + speling) {
          if (getComputedStyle(ouder).overflow === 'visible') {
            r.buiten.push({ wat: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0],
              in: String(ouder.className).split(' ')[0] })
          }
        }
      }
      // 4. Kapitalen in de smalle kopletter mogen alleen op displaymaat. Klein zijn ze
      //    slecht leesbaar (feedback Armando 20-10-2026: "WARM TAUPE" en de kopjes van
      //    de vijf redenen). Dit meet de GERENDERDE stijl en niet de css-bron, want een
      //    regel verderop kan hem alsnog omzetten. De bodyletter met letterspatiëring
      //    blijft toegestaan: dat is het kopje-boven-de-kop, en de referentiesite doet
      //    dat ook. Hier gaat het om de condensed letter.
      if (kinderen) {
        const s = getComputedStyle(el)
        const px = parseFloat(s.fontSize)
        const smal = /condensed|impact|haettenschweiler|narrow/i.test(s.fontFamily)
        const kapitaal = s.textTransform === 'uppercase' ||
          ((el.textContent || '').trim().length > 3 &&
           !/[a-zàâäéèêëîïôöùûüç]/.test((el.textContent || '').replace(/[^\p{L}]/gu, '')))
        const letters = (el.textContent || '').replace(/[^\p{L}]/gu, '').length
        if (smal && kapitaal && px < maxKap && letters > 3) {
          r.kapitaal.push({ wat: el.tagName.toLowerCase() + '.' + String(el.className).split(' ')[0],
            px: Math.round(px * 10) / 10, tekst: (el.textContent || '').trim().slice(0, 40) })
        }
      }
    }
    // 5. Invoervelden onder 16px. Dat is geen leesbaarheidskwestie maar een harde
    //    grens van Safari op iOS: krijgt zo'n veld focus, dan zoomt de browser de
    //    HELE pagina in en die zoom blijft staan. De bezoeker kan de pagina daarna
    //    opzij slepen en ziet rechts het witte paginavlak naast de secties
    //    (Armando, 20-10-2026: "zie witte rechts daar"). Chromium doet dat niet, dus
    //    met het oog of met een breedtemeting vind je dit nooit.
    for (const veld of document.querySelectorAll('input,select,textarea')) {
      if (veld.type === 'radio' || veld.type === 'checkbox' || veld.type === 'hidden') continue
      const px = parseFloat(getComputedStyle(veld).fontSize)
      if (px < 16) r.zoomt.push({ wat: veld.id || veld.tagName.toLowerCase() + '[' + veld.type + ']', px })
    }
    return r
  }, { min: MIN_TEKST, maxKap: MAX_KAPITAAL })

  const scheef = uitkomst.paginabreedte > breedte
  console.log(
    `${String(breedte).padStart(5)}px  pagina ${String(uitkomst.paginabreedte).padStart(5)}px  ` +
    `${uitkomst.telt} elementen  ${scheef ? 'TE BREED' : 'ok'}` +
    (uitkomst.klein.length ? `  tekst<${MIN_TEKST}px: ${uitkomst.klein.length}` : '') +
    (uitkomst.buiten.length ? `  buiten kaart: ${uitkomst.buiten.length}` : '') +
    (uitkomst.kapitaal.length ? `  kleine kapitalen: ${uitkomst.kapitaal.length}` : '') +
    (uitkomst.zoomt.length ? `  velden<16px: ${uitkomst.zoomt.length}` : '')
  )
  if (scheef) {
    fouten.push(`${pad} ${breedte}px: pagina is ${uitkomst.paginabreedte}px breed, dus opzij te slepen`)
    for (const b of uitkomst.breed.slice(0, 6)) console.log(`         ${b.wat} ${b.links}..${b.rechts}  "${b.tekst}"`)
  }
  for (const k of uitkomst.klein.slice(0, 5)) {
    fouten.push(`${pad} ${breedte}px: ${k.wat} is ${k.px}px  "${k.tekst}"`)
  }
  for (const b of uitkomst.buiten.slice(0, 5)) {
    fouten.push(`${pad} ${breedte}px: ${b.wat} valt buiten .${b.in}`)
  }
  for (const k of uitkomst.kapitaal.slice(0, 8)) {
    fouten.push(`${pad} ${breedte}px: ${k.wat} is ${k.px}px kapitaal in de smalle kopletter  "${k.tekst}"`)
  }
  for (const z of uitkomst.zoomt.slice(0, 8)) {
    fouten.push(`${pad} ${breedte}px: veld ${z.wat} is ${z.px}px; onder 16px zoomt iOS de hele pagina in bij focus`)
  }
  // HET GRIJZE VAK. Armando zag op 25-10-2026 op /werkwijze/ dat een van de vakken bij
  // "Wat het kost" grijs was in plaats van wit. Het was geen kleurfout: de lijnen
  // tussen die kaarten zijn de achtergrond van het raster die door een gat van 1 px
  // schijnt, en acht kaarten in drie kolommen lieten twee cellen leeg. Een lege cel
  // heeft geen witte kaart in zich, dus daar stond de achtergrond op volle grootte.
  //
  // Dat is precies het soort fout dat langs elke bestaande meting heen loopt: er stak
  // niets buiten het scherm, geen tekst was te klein, niets stond scheef. Vandaar een
  // eigen meting, en wel op de OORZAAK en niet op de kleur: een rasterregel moet van
  // links naar rechts gevuld zijn. Dan gaat hij ook af als er een negende afspraak bij
  // komt, en niet alleen bij dit ene aantal.
  {
    const gaten = await pagina.evaluate(() => {
      const uit = []
      for (const raster of document.querySelectorAll('.afspraken, .soorten, .verfkaarten')) {
        const rb = raster.getBoundingClientRect()
        const kinderen = [...raster.children].map((k) => k.getBoundingClientRect())
        if (!kinderen.length) continue
        // Per rasterregel groeperen op de bovenkant (afronden: subpixels verschillen).
        const regels = new Map()
        for (const k of kinderen) {
          const sleutel = Math.round(k.top)
          if (!regels.has(sleutel)) regels.set(sleutel, [])
          regels.get(sleutel).push(k)
        }
        for (const [top, cellen] of regels) {
          const links = Math.min(...cellen.map((c) => c.left))
          const rechts = Math.max(...cellen.map((c) => c.right))
          // 2 px marge voor de rand van het raster en afrondingen.
          const gat = Math.round(rb.right - rechts) + Math.round(links - rb.left)
          if (gat > 4) {
            uit.push({ raster: raster.className, top: Math.round(top), gat })
          }
        }
      }
      return uit
    })
    for (const g of gaten) {
      fouten.push(
        `${pad} ${breedte}px: rasterregel in .${g.raster} laat ${g.gat}px leeg ` +
        `(een lege cel laat de achtergrond zien: dat is het grijze vak)`
      )
    }
  }

  // Onder de voet mag niets meer komen. De ruimte voor de zwevende knoppenbalk zat
  // tot 20-10-2026 als padding onder de BODY, en die is wit: achter de knoppen stond
  // dus een witte strook onder een donkere voet. Die ruimte hoort in de voet zelf.
  if (breedte <= 720) {
    const onder = await pagina.evaluate(() => {
      const f = document.querySelector('footer')
      if (!f) return null
      return Math.round(document.documentElement.scrollHeight - (f.getBoundingClientRect().bottom + window.scrollY))
    })
    if (onder !== null && onder > 2) {
      fouten.push(`${pad} ${breedte}px: ${onder}px lege (witte) ruimte onder de voet, achter de zwevende balk`)
    }
  }
  await pagina.close()
 }
}

await browser.close()
await server.stop()

if (fouten.length) {
  console.error(`\nmeet: ${fouten.length} probleem(en)\n`)
  for (const f of fouten) console.error('  - ' + f)
  process.exit(1)
}
console.log('\nmeet: alles binnen het scherm, geen tekst onder de ondergrens, geen kleine kapitalen')
