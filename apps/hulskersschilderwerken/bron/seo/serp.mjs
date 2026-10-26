// Wie staat er nu op de renovlies-woorden, en WAT voor pagina is dat?
//
// Zelfde les als bij noordmolen (25-10-2026): een categorie is geen pagina. Voor
// je belooft dat een werkwijzepagina gaat ranken, meet je welk SOORT pagina de rij
// vult - een productpagina van een webshop, een uitlegpagina of een bedrijfspagina.
// En of er een kaartblok boven staat, want dan kiest Google op afstand tot de zoeker
// en kan geen pagina die wedstrijd winnen.
//
// serp/google/organic/live/advanced -> ~$0.002 per call
import { writeFileSync, readFileSync } from 'fs'

const AUTH = readFileSync('C:/Users/nieuw/dev/jiw-scraper/.env', 'utf8')
  .match(/^DATAFORSEO_AUTH=(.+)$/m)[1].trim()

const WOORDEN = [
  'renovliesbehang',
  'renovlies',
  'wat is renovlies',
  'renovlies aanbrengen',
  'renovlies of glasweefsel',
  'muren glad maken',
]

const uit = {}
for (const kw of WOORDEN) {
  const r = await fetch('https://api.dataforseo.com/v3/serp/google/organic/live/advanced', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify([{
      keyword: kw, location_code: 2528, language_code: 'nl',
      device: 'desktop', depth: 20,
    }]),
  })
  const j = await r.json()
  const taak = j.tasks?.[0]
  if (taak?.status_code !== 20000) {
    console.log(`! ${kw}: taakcode ${taak?.status_code} ${taak?.status_message}`)
    continue
  }
  const items = taak.result?.[0]?.items || []
  // Bewaar de hele item, niet alleen de titel: dan is "wat voor pagina is dat"
  // geen tweede opvraging.
  uit[kw] = {
    soorten: [...new Set(items.map((i) => i.type))],
    organisch: items.filter((i) => i.type === 'organic').map((i) => ({
      pos: i.rank_absolute, url: i.url, titel: i.title, beschrijving: i.description,
    })),
    overig: items.filter((i) => i.type !== 'organic').map((i) => ({ type: i.type, pos: i.rank_absolute })),
  }
  console.log(`\n=== ${kw} ===`)
  console.log('bloktypes:', uit[kw].soorten.join(', '))
  for (const o of uit[kw].organisch.slice(0, 10)) console.log(String(o.pos).padStart(3), o.url)
}

writeFileSync('bron/seo/serp.json', JSON.stringify(uit, null, 1))
