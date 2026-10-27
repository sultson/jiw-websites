/**
 * Staat zijn profiel in Google Maps vanuit zijn eigen stad, en op welke plek.
 *
 * Waarom dit een script is en geen waarneming. Op 27-10-2026 bleek de pin van zijn
 * profiel 110 km van zijn adres te liggen (het zwaartepunt van "heel Nederland" als
 * servicegebied, zie SEO.md). Dat is dezelfde middag gerepareerd en `bron/gbp.mjs` liet
 * de coordinaat 113 km opschuiven. Maar "staat hij nu in Maps" is een TWEEDE vraag met
 * een eigen antwoord: een correcte pin is nodig, niet genoeg - nul beoordelingen en een
 * domein van een dag oud wegen ook mee, en Google heeft tijd nodig.
 *
 * Die vraag was de eerste keer met de hand gemeten en dus niet te herhalen. Een meting
 * die je niet kunt overdoen kan geen verschil aanwijzen, en juist het verschil is hier
 * het bewijs. Daarom staat hij nu vast, met de uitkomst per ronde in `bron/maps.json`.
 *
 * Meet vanaf zijn eigen deur en niet vanaf het centrum: Maps kiest op afstand tot de
 * zoeker (zelfde reden als bij lijffull, 22-10-2026). Twee zoomniveaus, want een
 * naamzoek op zoom 20 gaf bij lijffull niets terug terwijl 14 wel werkte.
 *
 *   node bron/maps.mjs            meet en schrijf de ronde bij
 *   node bron/maps.mjs --toon     alleen de laatste ronde tonen, geen nieuwe oproep
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { BEDRIJF } from '../inhoud.mjs'

const CID = JSON.parse(readFileSync(new URL('./gbp.json', import.meta.url), 'utf8')).cid
const UIT = new URL('./maps.json', import.meta.url)
const zak = (m) => { console.error('GEZAKT: ' + m); process.exit(1) }

/* Zijn eigen deur, niet het centrum van Coevorden. Krimweg 109 via Nominatim
   (27-10-2026); hardgecodeerd omdat een geocoder morgen een meter kan verschuiven en
   deze meting over rondes heen vergelijkbaar moet blijven. */
const DEUR = [52.6576, 6.7052]

/* Vier zoekopdrachten, elk met een eigen vraag:
   - zijn naam: komt hij voor als iemand hem letterlijk zoekt. Dit is de harde ondergrens;
     stond hij hier niet, dan bestaat hij in Maps niet.
   - zijn vak + stad: de zoekopdracht die een klant doet.
   - zijn specialisme: de term waar de hele site op mikt.
   - behanger: het woord van de klant voor wat hij doet. */
const WOORDEN = [
  'hulskers schilderwerken',
  'schilder coevorden',
  'renovlies coevorden',
  'behanger coevorden',
]
const ZOOM = [14, 11]

if (process.argv.includes('--toon')) {
  if (!existsSync(UIT)) zak('bron/maps.json bestaat nog niet - draai eerst zonder --toon')
  const r = JSON.parse(readFileSync(UIT, 'utf8'))
  toon(r.rondes.at(-1))
  process.exit(0)
}

const AUTH = readFileSync('C:/Users/nieuw/dev/jiw-scraper/.env', 'utf8')
  .match(/^DATAFORSEO_AUTH=(.+)$/m)[1].trim()
const post = (p, b) => fetch('https://api.dataforseo.com/v3' + p, {
  method: 'POST',
  headers: { Authorization: 'Basic ' + AUTH, 'Content-Type': 'application/json' },
  body: JSON.stringify(b),
}).then((r) => r.json())

const metingen = []
for (const woord of WOORDEN) {
  for (const zoom of ZOOM) {
    const j = await post('/serp/google/maps/live/advanced', [{
      keyword: woord,
      language_code: 'nl',
      location_coordinate: `${DEUR[0]},${DEUR[1]},${zoom}z`,
      device: 'desktop',
      depth: 100,
    }])
    const taak = j?.tasks?.[0]
    /* Een storing legt zijn eigen regel vast in plaats van stil weg te vallen, EN hij
       hoort niet in de noemer van een afnemer (les van lijffull, 25-10-2026). */
    if (taak?.status_code !== 20000) {
      metingen.push({ woord, zoom, fout: `${taak?.status_code} ${taak?.status_message}` })
      console.log(`${woord} (z${zoom}): FOUT ${taak?.status_code}`)
      continue
    }
    const items = (taak.result?.[0]?.items || []).filter((i) => i.type === 'maps_search')
    const ik = items.find((i) => String(i.cid) === String(CID))
    metingen.push({
      woord,
      zoom,
      resultaten: items.length,
      plek: ik ? ik.rank_absolute : null,
      /* De hele item bewaren van wie er WEL staat. "Je krijgt Wim Hulskers" was een
         waarneming; met naam, cid en beoordelingen erbij is het een feit. */
      top: items.slice(0, 5).map((i) => ({
        plek: i.rank_absolute,
        naam: i.title,
        cid: String(i.cid ?? ''),
        soort: i.category ?? null,
        beoordelingen: i.rating?.votes_count ?? 0,
      })),
    })
    console.log(`${woord} (z${zoom}): ${items.length} resultaten, hij ${ik ? 'op plek ' + ik.rank_absolute : 'NIET gevonden'}`)
  }
}

const bestand = existsSync(UIT) ? JSON.parse(readFileSync(UIT, 'utf8')) : { cid: CID, deur: DEUR, rondes: [] }
const ronde = { gemeten: new Date().toISOString().slice(0, 16), cid: CID, deur: DEUR, metingen }
bestand.rondes.push(ronde)
writeFileSync(UIT, JSON.stringify(bestand, null, 1) + '\n')

toon(ronde)

function toon(r) {
  console.log(`\n${BEDRIJF.kort} in Maps vanaf ${r.deur.join(', ')} - gemeten ${r.gemeten}`)
  const goed = r.metingen.filter((m) => !m.fout)
  const gevonden = goed.filter((m) => m.plek !== null)
  console.log(`  gevonden in ${gevonden.length} van de ${goed.length} metingen${r.metingen.length !== goed.length ? ` (${r.metingen.length - goed.length} storing)` : ''}`)
  for (const m of r.metingen) {
    if (m.fout) { console.log(`  ${m.woord} z${m.zoom}: storing ${m.fout}`); continue }
    console.log(`  ${m.woord} z${m.zoom}: ${m.plek ? 'plek ' + m.plek : 'niet in ' + m.resultaten + ' resultaten'}`)
    if (!m.plek) console.log(`     wel: ${m.top.map((t) => `${t.plek}. ${t.naam}`).join(' | ')}`)
  }
}
