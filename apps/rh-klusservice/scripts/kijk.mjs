/* Loopt de live site met een echte browser door en vult het offerteformulier in.
   Draaien:  node scripts/kijk.mjs            (alles, zonder te versturen)
             node scripts/kijk.mjs --verstuur (verstuurt echt een aanvraag)
             node scripts/kijk.mjs --zichtbaar

   Waarom dit er is: het formulier verstuurt sinds 07-10-2026 met fetch en zet zich
   daarna om in een bevestiging. Dat pad is met curl niet te testen — curl raakt de
   worker wel, maar niet het stukje JavaScript dat de bezoeker te zien krijgt.

   Chromium wordt geleend uit claudius/node_modules; die staat hier niet in de
   dependencies, zie de README. */
// playwright-core is CommonJS, dus via de default export en niet met een named import
import playwright from 'file:///C:/Users/nieuw/dev/claudius/node_modules/playwright-core/index.js'
const { chromium } = playwright

const ZICHTBAAR = process.argv.includes('--zichtbaar')
const VERSTUUR = process.argv.includes('--verstuur')
// Standaard de live site; geef een adres mee om eerst tegen `wrangler dev` te
// kijken (node scripts/kijk.mjs http://127.0.0.1:3069) voordat je deployt.
const SITE = (process.argv.find((a) => a.startsWith('http')) || 'https://rhklusservice.nl').replace(/\/$/, '')

const PADEN = [
  '/', '/projecten/', '/slot-vervangen-valkenswaard/',
  '/timmerman-valkenswaard/', '/timmerman-eindhoven/', '/timmerman-amsterdam/',
]

const browser = await chromium.launch({ headless: !ZICHTBAAR })
const pagina = await browser.newPage({ viewport: { width: 1440, height: 900 } })

const fouten = []
pagina.on('console', (m) => { if (m.type() === 'error') fouten.push(m.text()) })
pagina.on('pageerror', (e) => fouten.push(String(e)))
pagina.on('requestfailed', (r) => fouten.push(`${r.failure()?.errorText} ${r.url()}`))

for (const pad of PADEN) {
  const antwoord = await pagina.goto(SITE + pad, { waitUntil: 'load' })
  const hoogte = await pagina.evaluate(() => document.documentElement.scrollHeight)
  const h1 = (await pagina.locator('h1').first().textContent())?.trim().slice(0, 48)
  const formulieren = await pagina.locator('form.form--aanvraag').count()
  const lok = await pagina.locator('.valstrik').first().isVisible().catch(() => false)
  console.log(`${String(antwoord.status()).padEnd(4)} ${pad.padEnd(34)} ${String(hoogte).padStart(6)}px  ${formulieren} formulier(en)  lokveld zichtbaar: ${lok}  h1: ${h1}`)
}

// De hero van de slotpagina draagt class="lok"; die naam is ooit bijna op het
// lokveld van het formulier beland. Als die ooit alsnog display:none krijgt, is
// de halve pagina weg, dus dat wordt hier gemeten en niet aangenomen.
await pagina.goto(`${SITE}/slot-vervangen-valkenswaard/`)
const heroZichtbaar = await pagina.locator('section.lok').first().isVisible()
console.log(`\nslotpagina hero (section.lok) zichtbaar: ${heroZichtbaar}`)

// Het formulier
await pagina.goto(`${SITE}/timmerman-eindhoven/`)
await pagina.fill('#offerte [name=firstName]', 'Browsertest Claudius')
await pagina.fill('#offerte [name=telefoon]', '06 11 22 33 44')
await pagina.fill('#offerte [name=bericht]', 'Testaanvraag uit scripts/kijk.mjs, niet terugbellen.')

if (VERSTUUR) {
  await pagina.click('#offerte button[type=submit]')
  await pagina.waitForSelector('.form__klaar', { timeout: 20000 })
  const klaar = (await pagina.locator('.form__klaar').textContent())?.replace(/\s+/g, ' ').trim()
  console.log(`\nbevestiging in beeld: ${klaar}`)
} else {
  // Zonder te versturen toch het foutpad testen: telefoon leegmaken en op
  // verzenden drukken moet de melding opleveren, niet een lege post.
  // `required` moet er eerst af, anders houdt de browser het submit-event zelf
  // tegen met zijn eigen ballonnetje en komt onze melding nooit aan de beurt.
  // Dat is in een echte browser het normale pad; dit test de laag eronder.
  await pagina.fill('#offerte [name=telefoon]', '')
  await pagina.evaluate(() => {
    document.querySelectorAll('#offerte [required]').forEach((v) => v.removeAttribute('required'))
  })
  await pagina.click('#offerte button[type=submit]')
  await pagina.waitForSelector('#offerte .form__melding:not([hidden])', { timeout: 5000 })
  const melding = (await pagina.locator('#offerte .form__melding').textContent())?.trim()
  console.log(`\nmelding bij leeg telefoonveld: ${melding}`)
  console.log('(niets verstuurd — gebruik --verstuur om dat wel te doen)')
}

console.log(`\nfouten in de console: ${fouten.length}`)
fouten.slice(0, 10).forEach((f) => console.log(`  ${f}`))

await browser.close()
if (fouten.length) process.exit(1)
