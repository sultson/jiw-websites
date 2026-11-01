// Wat zet de kopieerknop echt op het klembord? Mail haalt een remote plaatje
// niet altijd op; dan staat er een leeg vak. Dit script leest de flavors uit.
import { chromium } from '../../../../claudius/node_modules/playwright/index.mjs'
import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const DIST = new URL('../dist/', import.meta.url).pathname.replace(/^\//, '')
const MIME = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' }

const srv = createServer(async (req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0])
  if (p.endsWith('/')) p += 'index.html'
  if (!extname(p)) p += '/index.html'
  try {
    const buf = await readFile(join(DIST, p))
    res.writeHead(200, { 'content-type': MIME[extname(p)] || 'application/octet-stream' })
    res.end(buf)
  } catch { res.writeHead(404).end('404') }
})
await new Promise((ok, nee) => { srv.once('error', nee); srv.listen(0, '127.0.0.1', ok) })
const basis = `http://127.0.0.1:${srv.address().port}`
console.log('meet:', basis)

const br = await chromium.launch()
const ctx = await br.newContext({ permissions: ['clipboard-read', 'clipboard-write'] })
const pg = await ctx.newPage()
await pg.goto(`${basis}/handtekening/`, { waitUntil: 'domcontentloaded' })
await pg.locator('#kopieer').click()
await pg.waitForTimeout(400)

const uit = await pg.evaluate(async () => {
  const items = await navigator.clipboard.read()
  const out = []
  for (const it of items) {
    for (const t of it.types) {
      const b = await it.getType(t)
      out.push({ type: t, bytes: b.size, tekst: t.startsWith('text/') ? await b.text() : null })
    }
  }
  return out
})
for (const f of uit) {
  console.log(`\n== ${f.type}  (${f.bytes} bytes)`)
  if (f.tekst) console.log(f.tekst.slice(0, 1200))
}
await br.close(); srv.close()
