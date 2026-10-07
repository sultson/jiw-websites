// Kijkt alleen naar het merkteken in de balk en in de voet.
// node _ref/logo-kiek.mjs
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import http from 'node:http'
import path from 'node:path'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const SRC = path.join(HIER, '..', 'src')

const TYPE = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
}

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
    res.writeHead(404)
    res.end('nee')
  }
})
await new Promise((k) => s.listen(0, k))
const poort = s.address().port

const b = await chromium.launch()
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 3 })
await p.goto(`http://127.0.0.1:${poort}/`)
await p.waitForTimeout(900)
await p.locator('.nav .brand').screenshot({ path: path.join(HIER, 'kiek', 'logo-balk.png') })
await p.locator('.voet__brand').screenshot({ path: path.join(HIER, 'kiek', 'logo-voet.png') })
await b.close()
s.close()
console.log('ok')
