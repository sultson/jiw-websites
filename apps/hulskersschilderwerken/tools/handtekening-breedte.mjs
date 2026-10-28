/*
 * Hoe breed is de handtekening echt, en breekt er een regel?
 *
 *   node tools/handtekening-breedte.mjs
 *   node tools/handtekening-breedte.mjs --proef=120,13     andere logobreedte / lettermaat
 *
 * Armando, 28-10-2026, met een schermafdruk uit Mail op de iPhone: "Het is vervelend dat
 * ie over twee regels gaat." Het mailadres stond er als info@hulskersschilderwer / ken.nl
 * en het webadres als hulskersschilderwerken / .nl - midden in het woord afgebroken.
 *
 * Dat is geen opmaakfout op /handtekening/ maar een rekensom die niet uitkomt. De pagina
 * zelf heeft een kaart van 720 px en daar past alles; het VELD in Mail is op een telefoon
 * ongeveer 320 tot 360 px, en daar moeten het logo, de tussenruimte en de langste
 * tekstregel samen in. Een schermafdruk van deze pagina laat dat nooit zien, en de
 * klikproef ook niet: die meet op 390 px zonder de kaart van Mail eromheen.
 *
 * Daarom meet dit script de twee dingen die er in dat veld toe doen:
 *
 *  1. De NATUURLIJKE breedte van elke regel (zonder afbreken) plus die van het logovak.
 *     Samen zijn dat de pixels die de handtekening minstens nodig heeft.
 *  2. Of er in een veld van MAIL_BREED px iets over twee regels gaat. Gemeten met een
 *     Range over de tekst zelf (getClientRects geeft een vak per regel), niet met de
 *     hoogte van het element - een element dat groeit kan ook een andere oorzaak hebben.
 *
 * Het mailadres en het webadres dragen white-space:nowrap, dus ze KUNNEN niet meer
 * midden in het woord breken. Dat is de helft van de reparatie: zonder de maat eronder
 * zou de tabel dan gewoon buiten het veld steken. Deze poort bewaakt die andere helft.
 */
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { handtekeningGegevens, handtekeningHtml } from '../handtekening.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))

/*
 * De smalste plek waar deze handtekening terechtkomt: het berichtveld van Mail op een
 * iPhone. Een toestel van 375 pt (SE, mini, 13 mini) houdt na de marges van Mail
 * ongeveer 340 px over; 320 is dat met een reserve, en het is ook de oude ondergrens
 * waar een mailhandtekening traditioneel op gebouwd wordt. Haal dit getal niet omlaag om
 * een poort groen te krijgen - dan staat de afbreking er morgen weer.
 */
const MAIL_BREED = 320

const proef = (process.argv.find((a) => a.startsWith('--proef=')) || '').split('=')[1]
const G = handtekeningGegevens()
if (proef) {
  const [breed, maat] = proef.split(',').map(Number)
  if (breed) {
    G.breed = breed
    G.hoog = Math.round((breed * 167) / 440)
  }
  if (maat) G.maatTekst = maat
}

const browser = await chromium.launch()
const pagina = await browser.newPage({ viewport: { width: 900, height: 900 } })

/*
 * --zonder-nowrap haalt white-space:nowrap er weer uit. Dat is geen stand die we willen,
 * het is de manier om te zien DAT de regelteller afgaat: zonder nowrap hakt Mail het
 * mailadres doormidden, precies zoals op de schermafdruk van Armando. Zonder zo'n uitgang
 * is die helft van de poort niet te toetsen, en een poort die nooit afgaat is geen poort.
 */
const html = process.argv.includes('--zonder-nowrap')
  ? handtekeningHtml('Pascal Hulskers', G).replaceAll('white-space:nowrap;', '')
  : handtekeningHtml('Pascal Hulskers', G)

const uitslag = await pagina.evaluate(
  ({ html, breed }) => {
    const meet = (ruimte, breek) => {
      /*
       * `overflow-wrap:anywhere` is hoe het berichtveld van Mail zich gedraagt: een
       * woord dat niet past wordt doormidden gehakt. Zonder die regel laat Chromium een
       * te lang woord gewoon buiten het vak steken en breekt er niets - dan meet je de
       * klacht niet na maar eromheen.
       */
      const stijl = breek ? `width:${ruimte}px;overflow-wrap:anywhere` : `width:${ruimte}px`
      document.body.innerHTML = `<div id="veld" style="${stijl}">${html}</div>`
      const veld = document.getElementById('veld')
      const regels = []
      const loop = (knoop) => {
        for (const kind of knoop.childNodes) {
          if (kind.nodeType === 3 && kind.textContent.trim()) {
            const r = document.createRange()
            r.selectNodeContents(kind)
            const vakken = [...r.getClientRects()].filter((v) => v.width > 0)
            regels.push({
              tekst: kind.textContent.trim(),
              vakken: vakken.length,
              breed: Math.max(0, ...vakken.map((v) => v.width)),
            })
          } else if (kind.nodeType === 1) loop(kind)
        }
      }
      loop(veld)
      const tabel = veld.querySelector('table')
      const beeld = veld.querySelector('img')
      return {
        regels,
        tabel: Math.ceil(tabel.getBoundingClientRect().width),
        logovak: Math.ceil(beeld.closest('td').getBoundingClientRect().width),
      }
    }
    // Ruim: wat heeft hij nodig? En krap: breekt er iets, zoals Mail het zou breken?
    return { ruim: meet(900, false), krap: meet(breed, true) }
  },
  { html, breed: MAIL_BREED },
)

await browser.close()

const fouten = []
console.log(`logo ${G.breed} px breed, tekst ${G.maatTekst} px\n`)
console.log(`nodig : tabel ${uitslag.ruim.tabel} px (logovak ${uitslag.ruim.logovak} px)`)
console.log(`ruimte: ${MAIL_BREED} px in Mail op een telefoon\n`)

for (const r of uitslag.krap.regels) {
  const nodig = uitslag.ruim.regels.find((x) => x.tekst === r.tekst)
  const kort = r.tekst.length > 34 ? r.tekst.slice(0, 32) + '..' : r.tekst
  console.log(`  ${r.vakken > 1 ? 'BREEKT' : '  ok  '}  ${String(Math.ceil(nodig.breed)).padStart(4)} px  ${kort}`)
  if (r.vakken > 1) fouten.push(`"${kort}" gaat in een veld van ${MAIL_BREED} px over ${r.vakken} regels`)
}

if (uitslag.ruim.tabel > MAIL_BREED) {
  fouten.push(`de handtekening is ${uitslag.ruim.tabel} px breed en past niet in ${MAIL_BREED} px`)
}

/*
 * Hoeveel ruimte houdt de NAAM over? Pascal typt die zelf in op /handtekening/, dus dat
 * is het enige wat na vandaag nog kan groeien. De tekstkolom is wat er na het logo, de
 * streep en de kier overblijft; het mailadres vult daar nu 177 px van.
 */
const kolom = MAIL_BREED - uitslag.ruim.logovak - 2 - G.kier
const naam = uitslag.ruim.regels[0]
console.log(`\nruimte voor de naam: ${kolom} px, nu ${Math.ceil(naam.breed)} px ("${naam.tekst}")`)
if (naam.breed > kolom) {
  fouten.push(`de naam "${naam.tekst}" is ${Math.ceil(naam.breed)} px en dat is breder dan de kolom (${kolom} px)`)
}

if (fouten.length) {
  console.error('\nhandtekening-breedte ZAKT:')
  for (const f of fouten) console.error(`  - ${f}`)
  process.exit(1)
}
console.log('\nhandtekening-breedte: schoon.')
