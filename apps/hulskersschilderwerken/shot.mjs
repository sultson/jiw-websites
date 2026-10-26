// Schermfoto's van de gebouwde site. Scrollt eerst de hele pagina door, anders
// staan de lazy foto's er niet op en lijkt de pagina leeg.
// Playwright uit de devDependencies van deze app. Stond tot de verhuizing van
// 26-10-2026 als absoluut pad naar claudius/node_modules - dat werkt op deze machine
// en breekt elke verse kloon, zelfde val als de MAPBOX_TOKEN bij dagmar-voss.
import { chromium } from 'playwright'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { dien } from './dienen.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const server = await dien(path.join(HIER, 'dist'))
const PAGINAS = [['', '/'], ['werkwijze-', '/werkwijze/']]
const b = await chromium.launch()
for (const [voorvoegsel, pad] of PAGINAS) {
  for (const [naam, w] of [['desk', 1440], ['tel', 390]]) {
    const p = await b.newPage({ viewport: { width: w, height: 1000 } })
    await p.goto(server.basis + pad, { waitUntil: 'networkidle' })
    await p.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 90))
      }
      window.scrollTo(0, 0)
    })
    await p.waitForLoadState('networkidle')
    await p.waitForTimeout(900)
    const stuk = await p.evaluate(() => [...document.images].filter((i) => !i.complete || !i.naturalWidth).map((i) => i.currentSrc || i.src))
    if (stuk.length) console.log('  NIET GELADEN:', stuk)
    await p.screenshot({ path: `schermfoto-${voorvoegsel}${naam}.png`, fullPage: true })
    console.log(pad, naam, w, 'hoogte', await p.evaluate(() => document.body.scrollHeight))
    await p.close()
  }
}
await b.close()
await server.stop()
