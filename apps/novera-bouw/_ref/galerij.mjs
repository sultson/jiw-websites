// Zet het galerijblok voor pagina/werkzaamheden.html in elkaar, met de echte maten
// van de bestanden erin. Draai: node _ref/galerij.mjs  (plakt zichzelf tussen de merktekens)
import { readFile, writeFile } from 'node:fs/promises'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import path from 'node:path'
import { FOTOS } from './foto-lijst.mjs'
import { fileURLToPath } from 'node:url'

const uitvoer = promisify(execFile)
const HIER = path.dirname(fileURLToPath(import.meta.url))
const IMG = path.join(HIER, '..', 'src', 'img')
const PAG = path.join(HIER, '..', 'pagina', 'werkzaamheden.html')
const FFPROBE = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin/ffprobe.exe'
)


async function maat(bestand) {
  const { stdout } = await uitvoer(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0',
    path.join(IMG, bestand),
  ])
  const [w, h] = stdout.trim().split(',').map(Number)
  return { w, h }
}

const regels = []
for (let i = 0; i < FOTOS.length; i++) {
  const nr = String(i + 1).padStart(2, '0')
  const { w, h } = await maat(`werk-${nr}.webp`)
  regels.push(
    `      <button class="gal__k" type="button" data-groot="/img/werk-${nr}-groot.webp">\n` +
      `        <img loading="lazy" src="/img/werk-${nr}.webp" alt="${FOTOS[i].alt}" width="${w}" height="${h}" />\n` +
      `      </button>`
  )
}

const blok = `    <div class="gal reveal" id="gal">\n${regels.join('\n')}\n    </div>`

const bron = await readFile(PAG, 'utf8')
const merk = [/<!-- galerij -->[\s\S]*?<!-- \/galerij -->/]
if (!merk[0].test(bron)) throw new Error('merktekens <!-- galerij --> staan niet in werkzaamheden.html')
await writeFile(PAG, bron.replace(merk[0], `<!-- galerij -->\n${blok}\n    <!-- /galerij -->`))
console.log(`ok   ${FOTOS.length} foto's in het galerijblok`)
