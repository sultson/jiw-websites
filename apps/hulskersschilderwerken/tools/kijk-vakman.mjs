// Schermfoto van alleen het vakmanblok, op twee breedtes. Los scriptje omdat een
// fullPage-plaat van 9.000 px terugkijken niemand doet - zelfde reden als het
// contactblad bij ramona. Draait tegen dist/ via het eigen servertje (poort 0).
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dien } from '../dienen.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const server = await dien(path.join(HIER, '..', 'dist'))
console.log('meet', server.basis)
const b = await chromium.launch()
for (const [naam, w] of [['desk', 1440], ['tel', 390]]) {
  const p = await b.newPage({ viewport: { width: w, height: 1000 } })
  await p.goto(server.basis + '/', { waitUntil: 'networkidle' })
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 80))
    }
  })
  await p.waitForLoadState('networkidle')
  await p.waitForTimeout(600)
  const vak = p.locator('.vakman')
  await vak.screenshot({ path: path.join(HIER, `vakman-${naam}.png`) })
  const maat = await p.evaluate(() => {
    const i = document.querySelector('.vakman-foto img')
    const r = i.getBoundingClientRect()
    return { src: i.currentSrc, css: [Math.round(r.width), Math.round(r.height)], nat: [i.naturalWidth, i.naturalHeight], klaar: i.complete }
  })
  console.log(naam, w, JSON.stringify(maat))
  await p.close()
}
await b.close()
await server.stop()
