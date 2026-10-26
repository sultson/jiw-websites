// Zoekvolume NL/nl voor renovlies en zijn buren, plus de vraagwoorden waarmee
// mensen het opzoeken. Dit is de meting onder de vraag van 25-10-2026: de
// werkwijzepagina moet hoog ranken voor renovlies.
//
// keywords_data/google_ads/search_volume/live -> $0.05 per call (max 1000 kw)
//
// Let op (les uit lijffull, 23-10-2026): deze endpoint geeft bij drukte status
// 50301 "Too many requests" MET status_code 20000 op het hoogste niveau en
// cost 0. Een script dat alleen tasks[0].result leest schrijft dan een lege
// lijst weg en dat leest als "niemand zoekt hierop". Dus: taakcode nakijken en
// opnieuw proberen met een oplopende pauze.
import { writeFileSync, readFileSync } from 'fs'

const AUTH = readFileSync('C:/Users/nieuw/dev/jiw-scraper/.env', 'utf8')
  .match(/^DATAFORSEO_AUTH=(.+)$/m)[1].trim()

// Wat het materiaal is en hoe het heet. "renovlies" is de kern, de rest zijn de
// vormen waarin mensen hem typen.
const KERN = [
  'renovlies', 'renovliesbehang', 'renovlies behang', 'reno vlies',
  'glasweefselbehang', 'glasweefsel behang', 'glasvliesbehang', 'glasvlies',
  'vliesbehang', 'vlies behang', 'spackspuiten', 'spachtelputz',
]

// De vragen die iemand stelt voordat hij belt. Dit is de kop van de pagina:
// een werkwijzepagina antwoordt op "hoe" en "wat".
const VRAGEN = [
  'wat is renovlies', 'hoe werkt renovlies', 'renovlies aanbrengen',
  'renovlies plakken', 'renovlies laten plakken', 'renovlies zelf plakken',
  'renovlies texen', 'renovlies overtexen', 'renovlies verven',
  'renovlies of glasweefsel', 'glasweefsel of renovlies',
  'renovlies of vliesbehang', 'renovlies of stucwerk', 'renovlies of spackspuiten',
  'verschil renovlies glasweefsel', 'verschil renovlies vliesbehang',
  'renovlies nadelen', 'renovlies ervaringen', 'renovlies gram',
  'renovlies 215 gram', 'renovlies dikte', 'renovlies scheuroverbruggend',
  'scheuroverbruggend behang', 'renovlies verwijderen',
  'renovlies behangklaar', 'wand behangklaar maken', 'behangklaar maken',
  'glasweefselbehang aanbrengen', 'glasweefselbehang overschilderen',
  'vliesbehang plakken', 'vliesbehang aanbrengen',
  'texen', 'muren texen', 'wanden texen', 'texen muur', 'wand texen',
  'krimpscheuren nieuwbouw', 'scheuren in de muur nieuwbouw',
  'scheurtjes in de muur', 'scheuren muur nieuwbouw voorkomen',
  'gladde wanden nieuwbouw', 'strakke wanden', 'muren glad maken',
  'nieuwbouw wanden afwerken', 'wandafwerking nieuwbouw',
]

// Wat het kost. Dit zijn bij elk vak de woorden die het verst in de trechter
// staan, en de pagina heeft ze (zijn prijzen staan erop).
const PRIJS = [
  'renovlies prijs', 'renovlies prijs per m2', 'renovlies kosten',
  'renovlies m2 prijs', 'renovlies aanbrengen prijs', 'renovlies prijs per m2 inclusief',
  'renovlies laten aanbrengen prijs', 'glasweefselbehang prijs',
  'vliesbehang prijs', 'wanden texen prijs', 'texen prijs per m2',
  'spackspuiten prijs', 'spackspuiten prijs per m2', 'stucen prijs per m2',
  'renovlies inclusief texen', 'renovlies werkwijze',
]

// Zijn werkgebied. Vanaf 100 m2 heel Nederland, daaronder 30 km om Coevorden.
const PLAATSEN = [
  'coevorden', 'emmen', 'hoogeveen', 'assen', 'meppel', 'hardenberg',
  'zwolle', 'groningen', 'drenthe', 'overijssel', 'nieuw-amsterdam',
  'dalen', 'sleen', 'zweeloo', 'gramsbergen', 'de krim', 'ommen',
]
const PLAATSWOORDEN = ['renovlies', 'renovlies specialist', 'glasweefselbehang', 'schilder', 'behanger']

const kws = new Set([...KERN, ...VRAGEN, ...PRIJS])
for (const w of PLAATSWOORDEN) for (const p of PLAATSEN) kws.add(`${w} ${p}`)
const lijst = [...kws].slice(0, 1000)
console.log('zoekwoorden:', lijst.length)

async function haal(poging = 1) {
  const r = await fetch('https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live', {
    method: 'POST',
    headers: { Authorization: 'Basic ' + AUTH, 'Content-Type': 'application/json' },
    body: JSON.stringify([{ keywords: lijst, location_code: 2528, language_code: 'nl' }]),
  })
  const j = await r.json()
  const taak = j.tasks?.[0]
  // DIT is de regel die de lijffull-les draagt: niet j.status_code maar taak.status_code.
  if (!taak || taak.status_code !== 20000) {
    const code = taak?.status_code, msg = taak?.status_message
    if (poging >= 6) throw new Error(`taak blijft falen: ${code} ${msg}`)
    const pauze = poging * 20
    console.log(`taakcode ${code} (${msg}) - opnieuw over ${pauze}s, poging ${poging + 1}`)
    await new Promise((r) => setTimeout(r, pauze * 1000))
    return haal(poging + 1)
  }
  return taak.result || []
}

const result = await haal()
const rijen = result
  .map((x) => ({
    kw: x.keyword,
    volume: x.search_volume,
    cpc: x.cpc,
    comp: x.competition_index,
    maanden: x.monthly_searches?.slice(0, 3),
  }))
  .sort((a, b) => (b.volume || 0) - (a.volume || 0))

writeFileSync('bron/seo/kw.json', JSON.stringify(rijen, null, 1))
console.log('gemeten:', rijen.length, 'met volume:', rijen.filter((r) => r.volume).length)
for (const r of rijen.filter((x) => x.volume).slice(0, 60)) {
  console.log(String(r.volume).padStart(6), (r.cpc == null ? '-' : '\u20ac' + r.cpc.toFixed(2)).padStart(7), ' ', r.kw)
}
