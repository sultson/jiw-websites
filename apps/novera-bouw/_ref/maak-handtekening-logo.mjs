// Maakt het logo voor de mailhandtekening: node _ref/maak-handtekening-logo.mjs
//
// Zelfde reden als bij het mailbeeld (zie maak-mailbeeld.mjs): een mailprogramma
// toont geen SVG, en bij een doorzichtige achtergrond verdwijnt het navy woordmerk
// in donkere modus. Daarom staat de witte achtergrond in het bestand gebakken —
// wit en niet chalk, want een handtekening staat op het witte vel van de mail zelf.
//
// Het staande merk (huisje boven NOVERA BOUW), want in de handtekening staat het
// links naast de gegevens. 240 breed voor een weergave van 120, dus scherp op een
// retinascherm en op een telefoon.
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, '..', 'src', 'img', 'merk', 'novera-stacked-primary.svg')
const UIT = path.join(HIER, '..', 'src', 'img', 'handtekening-logo.png')

const BREED = 240 // weergave 120
const WIT = '#FFFFFF'

const svg = await readFile(BRON, 'utf8')
// het bronbestand is 1000 x 750
const hoog = Math.round((BREED * 750) / 1000)

const browser = await chromium.launch()
const pagina = await browser.newPage({ viewport: { width: BREED, height: hoog }, deviceScaleFactor: 1 })
await pagina.setContent(
  `<!doctype html><html><head><style>
     html,body{margin:0;padding:0;background:${WIT}}
     svg{display:block;width:${BREED}px;height:${hoog}px}
   </style></head><body>${svg}</body></html>`
)
const beeld = await pagina.screenshot({ type: 'png' })
await browser.close()

await writeFile(UIT, beeld)
console.log(`${path.relative(path.join(HIER, '..'), UIT)}  ${BREED}x${hoog}  ${(beeld.length / 1024).toFixed(1)} kB`)
