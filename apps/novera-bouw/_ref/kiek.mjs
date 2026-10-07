// Snelle blik: schiet een paar pagina's op 1440 en 390, zonder de hele meting.
// node _ref/kiek.mjs [basis-url]
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import http from 'node:http'
import path from 'node:path'
import { readFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HIER, '..', 'src')
const SHOTS = path.join(HIER, 'kiek')

const TYPE = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

function server() {
  return new Promise((klaar) => {
    const s = http.createServer(async (req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0])
      if (p.endsWith('/')) p += 'index.html'
      let bestand = path.join(SRC, p)
      if (!path.extname(bestand)) bestand += '.html'
      try {
        const buf = await readFile(bestand)
        res.writeHead(200, { 'content-type': TYPE[path.extname(bestand)] || 'application/octet-stream' })
        res.end(buf)
      } catch {
        res.writeHead(404).end('weg')
      }
    })
    s.listen(0, () => klaar({ s, url: `http://127.0.0.1:${s.address().port}` }))
  })
}

const basis = process.argv[2]
const eigen = basis ? null : await server()
const wortel = basis || eigen.url

await mkdir(SHOTS, { recursive: true })
const br = await chromium.launch()

const paden = ['/', '/badkamer', '/werkzaamheden', '/contact']
for (const [naam, maat] of [
  ['breed', { width: 1440, height: 950 }],
  ['smal', { width: 390, height: 844 }],
]) {
  const ctx = await br.newContext({ viewport: maat, deviceScaleFactor: 1 })
  const pg = await ctx.newPage()
  for (const pad of paden) {
    await pg.goto(wortel + pad, { waitUntil: 'networkidle' })
    await pg.waitForTimeout(500)
    const bestand = (pad === '/' ? 'home' : pad.slice(1).replace(/\//g, '-')) + '-' + naam + '.png'
    await pg.screenshot({ path: path.join(SHOTS, bestand), fullPage: naam === 'breed' ? false : false })
    console.log('shot', bestand)
  }
  await ctx.close()
}
await br.close()
if (eigen) eigen.s.close()
