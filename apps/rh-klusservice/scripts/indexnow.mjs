/* Meldt de adressen uit dist/sitemap.xml aan bij IndexNow (Bing, Yandex, Seznam, Naver).
   Google doet hier niet aan mee: daar blijft Search Console de weg. Bing is hier geen
   bijzaak, want die voedt ook de zoekresultaten van ChatGPT.

   Draai na een deploy:  pnpm --filter @jiw/rh-klusservice indexnow
   De sleutel is de naam van het .txt-bestand in dist/; dat bestand moet op het live
   adres opvraagbaar zijn, anders weigert IndexNow de hele lijst. */
import { readFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, '..', 'dist')
const HOST = 'rhklusservice.nl'

const sleutel = (await readdir(DIST))
  .filter((f) => /^[0-9a-f]{16,}\.txt$/.test(f))
  .map((f) => f.replace(/\.txt$/, ''))[0]
if (!sleutel) throw new Error('geen sleutelbestand in dist/ gevonden')

const sitemap = await readFile(path.join(DIST, 'sitemap.xml'), 'utf8')
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!urls.length) throw new Error('geen adressen in dist/sitemap.xml — eerst bouwen')

// De sleutel moet eerst live staan, anders is de hele melding voor niets
const proef = await fetch(`https://${HOST}/${sleutel}.txt`)
if (!proef.ok) throw new Error(`de sleutel staat niet live (${proef.status}) — eerst uitrollen`)

const antwoord = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: sleutel, keyLocation: `https://${HOST}/${sleutel}.txt`, urlList: urls }),
})
console.log(`${urls.length} adressen gemeld, IndexNow antwoordde ${antwoord.status} ${antwoord.statusText}`)
if (!antwoord.ok) {
  console.log(await antwoord.text())
  process.exit(1)
}
