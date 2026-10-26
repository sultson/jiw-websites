// Kleine statische server voor de meetscripts.
//
// De pagina's gebruiken absolute paden (/f/..., /styl.<hash>.css, /werkwijze/), want
// /werkwijze/ ligt een map diep en `f/...` zou daar naar /werkwijze/f/... wijzen. Over
// file:// werkt een absoluut pad niet: dan laadt de stylesheet niet en meet je een
// ongestyde pagina. Vandaar deze server; hij doet ook meteen de mapindex, zodat
// /werkwijze/ hetzelfde adres is als live.
//
//   const { basis, stop } = await dien('dist')
//   await pagina.goto(basis + '/werkwijze/')

import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8',
}

export function dien(map) {
  const wortel = path.resolve(map)
  const server = http.createServer((req, res) => {
    let pad = decodeURIComponent(req.url.split('?')[0])
    if (pad.endsWith('/')) pad += 'index.html'
    const doel = path.resolve(path.join(wortel, pad))
    if (!doel.startsWith(wortel)) {
      res.writeHead(403, { 'content-type': 'text/plain' })
      res.end('403')
      return
    }
    fs.readFile(doel, (fout, buf) => {
      if (fout) {
        res.writeHead(404, { 'content-type': 'text/plain' })
        res.end(`404 ${pad}`)
        return
      }
      res.writeHead(200, { 'content-type': TYPES[path.extname(doel)] || 'application/octet-stream' })
      res.end(buf)
    })
  })
  return new Promise((klaar) => {
    server.listen(0, '127.0.0.1', () => {
      klaar({
        basis: `http://127.0.0.1:${server.address().port}`,
        stop: () => new Promise((o) => server.close(o)),
      })
    })
  })
}
