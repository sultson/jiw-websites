// Maakt het logo voor de bevestigingsmail: node _ref/maak-mailbeeld.mjs
//
// Waarom een PNG en niet de SVG die al in src/img/merk/ staat: Outlook op Windows
// toont geen SVG, en een mailprogramma in donkere modus kan een doorzichtige
// achtergrond op navy zetten waardoor het navy woordmerk verdwijnt. Daarom wordt
// de achtergrond (chalk) in het bestand gebakken.
//
// 480 breed voor een weergave van 240, dus scherp op een retinascherm.
import { chromium } from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright/index.mjs'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, '..', 'src', 'img', 'merk', 'novera-horizontal-primary.svg')
const UIT = path.join(HIER, '..', 'src', 'img', 'merk', 'novera-logo-email.png')

const BREED = 480 // weergave 240
const CHALK = '#F7F3EC'

const svg = await readFile(BRON, 'utf8')
// het bronbestand is 1400 x 380
const hoog = Math.round((BREED * 380) / 1400)

const browser = await chromium.launch()
const pagina = await browser.newPage({ viewport: { width: BREED, height: hoog }, deviceScaleFactor: 1 })
await pagina.setContent(
  `<!doctype html><html><head><style>
     html,body{margin:0;padding:0;background:${CHALK}}
     svg{display:block;width:${BREED}px;height:${hoog}px}
   </style></head><body>${svg}</body></html>`
)
const beeld = await pagina.screenshot({ type: 'png' })
await browser.close()

await writeFile(UIT, beeld)
console.log(`${path.relative(path.join(HIER, '..'), UIT)}  ${BREED}x${hoog}  ${(beeld.length / 1024).toFixed(1)} kB`)
