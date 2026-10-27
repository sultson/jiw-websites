/**
 * Meet zijn Google-bedrijfsprofiel en legt de uitkomst vast in bron/gbp.json.
 *
 * Armando gaf op 27-10-2026 een `share.google`-link door met de vraag of het profiel in
 * de LocalBusiness kon. Zo'n link is een omleider: hij zegt niet WELK profiel het is en
 * hij kan morgen iets anders uitwijzen. Voor `sameAs` wil je het adres dat de entiteit
 * zelf benoemt, en daarvoor moet je de cid hebben.
 *
 * Wat NIET werkt, zodat de volgende het niet opnieuw probeert:
 *   - curl op de bestemming van de share-link: de paneelgegevens komen via een XHR
 *     binnen, dus je krijgt een pagina zonder cid.
 *   - diezelfde pagina in Playwright vanaf deze machine: Google zet er een captcha voor
 *     (/sorry/index).
 *   - Maps zoeken op "Hulskers Schilderwerken Coevorden", in Playwright en via
 *     DataForSEO: zijn profiel staat NIET in die resultaten. Je krijgt Wim Hulskers
 *     (architect), Hulskers Automotive en acht andere schilders. Dat is zelf de vondst,
 *     zie de noot onderaan.
 *
 * Wat wel werkte: de bestemming van de share-link gerenderd ophalen via Apify
 * (apify/web-fetch), en daar staat `ludocid=11940519625446020035` in de link onder
 * Openingstijden. Dat is de cid. Die staat hieronder als constante, want zonder
 * draaiende browser-met-proxy is hij hier niet opnieuw af te leiden - en de regel
 * eronder TOETST hem, dus een verkeerde cid komt niet door.
 *
 *   node bron/gbp.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { BEDRIJF } from '../inhoud.mjs'

const AUTH = readFileSync('C:/Users/nieuw/dev/jiw-scraper/.env', 'utf8')
  .match(/^DATAFORSEO_AUTH=(.+)$/m)[1].trim()
const post = (p, b) => fetch('https://api.dataforseo.com/v3' + p, {
  method: 'POST',
  headers: { Authorization: 'Basic ' + AUTH, 'Content-Type': 'application/json' },
  body: JSON.stringify(b),
}).then(r => r.json())

const DEEL = 'https://share.google/XjpciNy3nGTGTWVGu'   // doorgegeven door Armando, 27-10-2026
const CID = '11940519625446020035'                      // uit ludocid in het kennispaneel
const zak = m => { console.error('GEZAKT: ' + m); process.exit(1) }

// 1. Welke entiteit wijst de doorgegeven link uit. Alleen de kgmid is daar bruikbaar.
const res = await fetch(DEEL, { redirect: 'follow' })
const kgmid = new URL(res.url).searchParams.get('kgmid')
if (!kgmid) zak(`de share-link wijst naar ${res.url} en daar staat geen kgmid in`)

// 2. Het profiel zelf, op de cid. Dit is de enige oproep die werkt: zoeken op naam plus
//    coordinaat geeft "No Search Results" (zelfde val als bij lijffull, 23-10-2026).
const j = await post('/business_data/google/my_business_info/live',
  [{ keyword: 'cid:' + CID, language_code: 'nl', location_code: 2528 }])
const taak = j?.tasks?.[0]
if (taak?.status_code !== 20000) zak(`my_business_info: ${taak?.status_code} ${taak?.status_message}`)
const r = taak.result?.[0]?.items?.[0]
if (!r) zak(`cid:${CID} geeft geen profiel terug - de cid is verouderd of het profiel is weg`)

// 3. Is dit zijn profiel. Het domein in het profiel is de harde toets: een cid die bij
//    de verkeerde zaak hoort zet in `sameAs` een link naar een ander bedrijf, en dat
//    ziet niemand terug op de pagina.
if (r.domain !== BEDRIJF.domein) {
  zak(`het profiel op cid:${CID} wijst naar ${r.domain || '(geen site)'} en niet naar ${BEDRIJF.domein}`)
}
if (!/hulskers/i.test(r.title || '')) zak(`het profiel heet "${r.title}" - dat is een ander bedrijf`)
if (r.phone && r.phone.replace(/\D/g, '') !== BEDRIJF.telLink.replace(/\D/g, '')) {
  zak(`het profiel noemt ${r.phone}, de site noemt ${BEDRIJF.telLink}`)
}

const uur = t => `${String(t.open.hour).padStart(2, '0')}:${String(t.open.minute).padStart(2, '0')}` +
  `-${String(t.close.hour).padStart(2, '0')}:${String(t.close.minute).padStart(2, '0')}`
const tt = r.work_time?.work_hours?.timetable || {}
const dagen = Object.fromEntries(Object.entries(tt).map(([d, v]) => [d, (v || []).map(uur).join(', ')]))

const uit = {
  gemeten: new Date().toISOString().slice(0, 10),
  doorgegeven_link: DEEL,
  kgmid,
  cid: r.cid,
  place_id: r.place_id,
  feature_id: r.feature_id,
  profiel_url: `https://maps.google.com/?cid=${r.cid}`,
  kennispaneel_url: `https://www.google.com/search?kgmid=${kgmid}`,
  naam: r.title,
  geclaimd: r.is_claimed,
  site: r.url,
  telefoon: r.phone,
  soort: r.category,
  soorten_extra: r.additional_categories || [],
  // null = geen openbaar adres. Dat betekent dat het als service-area business staat
  // ingericht, en het verklaart waarom hij niet in Maps te vinden is.
  adres: r.address,
  coordinaat: [r.latitude, r.longitude],
  beoordeling: r.rating?.value ?? null,
  beoordelingen: r.rating?.votes_count ?? 0,
  fotos: r.total_photos ?? 0,
  logo: !!r.logo,
  omschrijving: r.description || null,
  attributen: r.attributes || null,
  openingstijden: dagen,
}
writeFileSync(new URL('./gbp.json', import.meta.url), JSON.stringify(uit, null, 1) + '\n')

console.log(`${uit.naam}  (${uit.geclaimd ? 'geclaimd' : 'NIET geclaimd'})`)
console.log(`  cid ${uit.cid} | kgmid ${uit.kgmid} | place_id ${uit.place_id}`)
console.log(`  ${uit.profiel_url}`)
console.log(`  site ${uit.site} | tel ${uit.telefoon}`)
console.log(`  soort ${uit.soort}${uit.soorten_extra.length ? ' + ' + uit.soorten_extra.join(', ') : ''}`)
console.log(`  adres ${uit.adres ?? '(geen - service-area business)'} | ${uit.coordinaat.join(', ')}`)
console.log(`  ${uit.beoordelingen} beoordelingen | ${uit.fotos} foto's | logo ${uit.logo} | omschrijving ${uit.omschrijving ? 'ja' : 'nee'} | attributen ${uit.attributen ? 'ja' : 'nee'}`)
console.log(`  openingstijden: ${Object.entries(uit.openingstijden).map(([d, u]) => `${d.slice(0, 2)} ${u}`).join('  ')}`)

// De openingstijden van 27-10-2026 kwamen van Armando en stonden daarom als doorgegeven
// op de nalooplijst. Zijn eigen geclaimde profiel zegt nu hetzelfde, en dat is een tweede
// bron die niet van ons komt. Deze regel houdt dat vast: wijkt het profiel af van wat de
// site in zijn structured data zet, dan zakt de meting en niet de pagina stil.
const uitSite = `${BEDRIJF.openVan}-${BEDRIJF.openTot}`
const afwijkend = Object.entries(dagen).filter(([, u]) => u !== uitSite)
if (Object.keys(dagen).length !== BEDRIJF.openDagen) {
  zak(`het profiel noemt ${Object.keys(dagen).length} dagen, inhoud.mjs zegt ${BEDRIJF.openDagen}`)
}
if (afwijkend.length) {
  zak(`het profiel wijkt af van de site (${uitSite}): ${afwijkend.map(([d, u]) => `${d} ${u}`).join(', ')}`)
}

// En de vondst die geen poort is maar wel in het antwoord hoort: het profiel is
// geclaimd, ingericht en open, maar heeft NUL beoordelingen en geen openbaar adres. Het
// komt daardoor in geen enkele Maps-zoekopdracht vanuit Coevorden voor - ook niet op zijn
// eigen naam. Zie SEO.md.
if (uit.beoordelingen === 0) {
  console.log('\nLET OP: nul beoordelingen. Dat is de sterkste knop die er nu is voor lokale vindbaarheid.')
}
if (!uit.adres) {
  console.log('LET OP: geen openbaar adres in het profiel (service-area business), dus geen vaste plek in Maps.')
}
