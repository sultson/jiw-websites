// Kijkt of de wisselende kop echt doet wat hij moet doen: schiet de hero op een
// aantal momenten in de cyclus van 40s, en meet per dia welke zichtbaar is en hoe
// ver de foto gekanteld staat. node _ref/hero-kiek.mjs [basis-url]
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import http from 'node:http'
import path from 'node:path'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, '..', 'dist')
const SHOTS = path.join(HIER, 'hero-shots')

const TYPE = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

function server() {
  return new Promise((klaar) => {
    const s = http.createServer(async (req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0])
      if (p.endsWith('/')) p = p.slice(0, -1)
      if (p === '') p = '/index'
      let bestand = path.join(DIST, p)
      if (!path.extname(bestand)) bestand += '.html'
      try {
        const buf = await readFile(bestand)
        res.writeHead(200, { 'content-type': TYPE[path.extname(bestand)] || 'application/octet-stream' })
        res.end(buf)
      } catch {
        res.writeHead(404, { 'content-type': 'text/html' })
        res.end('<h1>404</h1>')
      }
    })
    s.listen(0, '127.0.0.1', () => klaar([s, `http://127.0.0.1:${s.address().port}`]))
  })
}

const arg = process.argv[2]
let stop = null
let basis = arg
if (!basis) {
  const [s, url] = await server()
  stop = () => s.close()
  basis = url
}

await mkdir(SHOTS, { recursive: true })
const browser = await chromium.launch()

for (const [naam, breed, hoog] of [['desktop', 1440, 1000], ['telefoon', 390, 844]]) {
  const pg = await browser.newPage({ viewport: { width: breed, height: hoog } })
  await pg.goto(basis + '/', { waitUntil: 'networkidle' })

  // De animatie loopt op 40s. Per moment: welke dia is zichtbaar, en waar staat hij.
  for (const t of [0, 4, 8, 12, 16, 20, 24, 28, 32, 36]) {
    await pg.evaluate((ms) => {
      document.getAnimations().forEach((a) => {
        a.pause()
        a.currentTime = ms
      })
    }, t * 1000)
    const stand = await pg.$$eval('.hero__dia', (els) =>
      els.map((e, i) => {
        const img = e.querySelector('img')
        const r = img.getBoundingClientRect()
        const vak = e.getBoundingClientRect()
        return {
          i,
          dek: Number(getComputedStyle(e).opacity).toFixed(2),
          // hoeveel van de foto hangt onder/boven het vak: 0 = bovenrand gelijk
          boven: Math.round(r.top - vak.top),
          onder: Math.round(r.bottom - vak.bottom),
          hoog: Math.round(r.height),
          vakhoog: Math.round(vak.height),
        }
      })
    )
    const zicht = stand.filter((s) => Number(s.dek) > 0.02)
    console.log(
      `${naam} t=${String(t).padStart(2)}s  ` +
        zicht.map((s) => `dia${s.i} dek=${s.dek} boven=${s.boven} onder=${s.onder} (foto ${s.hoog} in vak ${s.vakhoog})`).join('  |  ')
    )
    // gat? dan is er op dit moment geen enkele dia vol zichtbaar
    if (!zicht.some((s) => Number(s.dek) > 0.99)) console.log(`   LET OP ${naam} t=${t}s: geen dia op volle sterkte`)
    // rand in beeld? boven mag niet positief zijn, onder niet negatief
    for (const s of zicht) {
      if (s.boven > 1) console.log(`   LET OP ${naam} t=${t}s dia${s.i}: bovenrand ${s.boven}px in beeld`)
      if (s.onder < -1) console.log(`   LET OP ${naam} t=${t}s dia${s.i}: onderrand ${-s.onder}px in beeld`)
    }
    if (naam === 'desktop' && t % 8 === 0) {
      await pg.screenshot({ path: path.join(SHOTS, `t${String(t).padStart(2, '0')}.png`), clip: { x: 0, y: 0, width: breed, height: 860 } })
    }
  }
  await pg.close()
}

await browser.close()
if (stop) stop()
