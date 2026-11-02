// Meet of de tekening in het vakmanblok HEEL in beeld staat.
//
// Waarom dit een eigen poort is: een foto die door `object-fit:cover` wordt
// bijgesneden steekt nergens buiten het scherm, staat niet scheef en is niet te
// klein. Elke bestaande meting (breedte, contrast, lucht) stond dus groen terwijl
// er links en rechts een stuk van de tekening af was. Zie de regel "Een foto in
// een vast vak" in playground/CLAUDE.md: wat je mist is alleen te zien door de
// GETOONDE verhouding naast de NATUURLIJKE verhouding van het bestand te leggen.
//
//   node tools/meet-vakman.mjs          meet dist/ en zakt bij bijsnijden
//   node tools/meet-vakman.mjs --toon   print de getallen per breedte
//
// De meting rekent met naturalWidth/naturalHeight uit de browser en niet met een
// verhouding op schrift: zet iemand morgen een andere uitsnede in fotos.py, dan
// schuift deze poort mee in plaats van de oude verhouding in stand te houden.

import { chromium } from 'playwright'
import { dien } from '../dienen.mjs'

const BREEDTES = [360, 390, 768, 1024, 1280, 1440]
const MARGE = 0.01 // 1 procent speling voor afronding van de layout

const toon = process.argv.includes('--toon')

const { basis, stop } = await dien('dist')
const browser = await chromium.launch()
const fouten = []
const rijen = []

try {
  for (const breedte of BREEDTES) {
    const pagina = await browser.newPage({ viewport: { width: breedte, height: 900 } })
    await pagina.goto(basis + '/', { waitUntil: 'domcontentloaded' })
    await pagina.waitForLoadState('load')

    const m = await pagina.evaluate(() => {
      const img = document.querySelector('.vakman-foto img')
      if (!img) return null
      const vak = img.getBoundingClientRect()
      const stijl = getComputedStyle(img)
      return {
        natuurlijk: img.naturalWidth / img.naturalHeight,
        getoond: vak.width / vak.height,
        breedte: Math.round(vak.width),
        hoogte: Math.round(vak.height),
        fit: stijl.objectFit,
        geladen: img.complete && img.naturalWidth > 0,
      }
    })
    await pagina.close()

    if (!m) { fouten.push(`${breedte}: geen tekening in het vakmanblok gevonden`); continue }
    if (!m.geladen) { fouten.push(`${breedte}: de tekening is niet geladen, dus er is niets gemeten`); continue }

    // Hoeveel procent van de bron valt buiten het vak. Bij `cover` is dat precies
    // het verschil tussen de twee verhoudingen; welke kant eraf gaat hangt ervan af
    // of het vak breder of hoger is dan de bron.
    const v = m.getoond / m.natuurlijk
    const weg = v > 1 ? 1 - 1 / v : 1 - v
    rijen.push({ breedte, ...m, weg })

    // Zakken op het VERSCHIL in verhouding en niet op de waarde van object-fit:
    // `cover` snijdt dat verschil eraf, `contain` zet er lege banden voor in de
    // plaats. Allebei fout, en een poort die alleen naar `cover` kijkt keurt de
    // tweede goed zodra iemand dat woord verandert in plaats van de layout.
    if (weg > MARGE) {
      const kant = v > 1 ? 'boven en onder' : 'links en rechts'
      const wat = m.fit === 'cover'
        ? `${(weg * 100).toFixed(1)}% van de tekening valt ${kant} weg`
        : `het vak is ${(weg * 100).toFixed(1)}% ruimer dan de tekening (lege band ${kant}), object-fit ${m.fit}`
      fouten.push(`${breedte}: ${wat} (vak ${m.breedte}x${m.hoogte} = ${m.getoond.toFixed(3)}, bron ${m.natuurlijk.toFixed(3)})`)
    }
  }
} finally {
  await browser.close()
  await stop()
}

if (toon) {
  console.log(`gemeten op ${basis}`)
  for (const r of rijen) {
    console.log(
      `${String(r.breedte).padStart(5)}  vak ${String(r.breedte + 'x' + r.hoogte).padEnd(10)}` +
      ` getoond ${r.getoond.toFixed(3)}  bron ${r.natuurlijk.toFixed(3)}` +
      `  weg ${(r.weg * 100).toFixed(1)}%  object-fit ${r.fit}`
    )
  }
}

if (fouten.length) {
  console.error('\nDe tekening in het vakmanblok wordt bijgesneden:')
  for (const f of fouten) console.error('  - ' + f)
  process.exit(1)
}

console.log(`vakman: tekening heel in beeld op ${BREEDTES.length} breedtes`)
