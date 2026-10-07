// Zet de foto's die Ekrem zelf stuurde (_ref/eigen/ek-NN.jpg) om naar webp in src/img/,
// en schrijft meteen het galerijblok in pagina/werkzaamheden.html.
// Alles wat hier uit komt heet eigen-* of foto-NN: dat is echt werk van hem.
// Draai: node _ref/eigen.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, stat, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GALERIJ, KAART, HERO } from './eigen-lijst.mjs'

const uitvoer = promisify(execFile)
const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, 'eigen')
const UIT = path.join(HIER, '..', 'src', 'img')
const PAG = path.join(HIER, '..', 'pagina', 'werkzaamheden.html')
const BIN = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin'
)
const FFMPEG = path.join(BIN, 'ffmpeg.exe')
const FFPROBE = path.join(BIN, 'ffprobe.exe')

const ff = (args) => uitvoer(FFMPEG, ['-v', 'error', '-y', ...args])
const kb = async (p) => Math.round((await stat(p)).size / 1024)

async function maat(bestand) {
  const { stdout } = await uitvoer(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', bestand,
  ])
  const [w, h] = stdout.trim().split(',').map(Number)
  return { w, h }
}

await mkdir(UIT, { recursive: true })
let n = 0

// ── kaarten: 4:3, 1200x900 ──
for (const k of KAART) {
  const in_ = path.join(BRON, `${k.bron}.jpg`)
  const { w, h } = await maat(in_)
  const breed = Math.round(w * (k.breed ?? 1))
  const hoog = Math.round((breed * 3) / 4)
  const x = Math.max(0, Math.round((w - breed) * (k.x ?? 0)))
  const y = Math.max(0, Math.round((h - hoog) * k.y))
  const uit = path.join(UIT, `${k.naam}.webp`)
  await ff(['-i', in_, '-vf', `crop=${breed}:${hoog}:${x}:${y},scale=1200:900:flags=lanczos`, '-quality', '82', uit])
  console.log(`ok   ${k.naam}  1200x900  ${await kb(uit)}kB  (${k.bron})`)
  n++
}

// ── hero: brede band. HERO is null, zie eigen-lijst.mjs: geen van zijn staande
//    foto's overleeft een 16:9 uitsnede. De kop draagt src/img/hero.webp. ──
if (HERO) {
  const in_ = path.join(BRON, `${HERO.bron}.jpg`)
  const { w, h } = await maat(in_)
  const hoog = Math.round(w / HERO.verhouding)
  const y = Math.max(0, Math.round((h - hoog) * HERO.y))
  const uit = path.join(UIT, `${HERO.naam}.webp`)
  await ff(['-i', in_, '-vf', `crop=${w}:${hoog}:0:${y}`, '-quality', '84', uit])
  console.log(`ok   ${HERO.naam}  ${w}x${hoog}  ${await kb(uit)}kB  (${HERO.bron})`)
  n++
}

// ── galerij: hele foto, niets weggesneden. Twee maten: raster en groot. ──
const regels = []
for (let i = 0; i < GALERIJ.length; i++) {
  const nr = String(i + 1).padStart(2, '0')
  const in_ = path.join(BRON, `${GALERIJ[i].bron}.jpg`)
  for (const [achter, lang, kwal] of [['', 560, 78], ['-groot', 1400, 84]]) {
    const uit = path.join(UIT, `foto-${nr}${achter}.webp`)
    await ff([
      '-i', in_,
      '-vf', `scale=w=${lang}:h=${lang}:force_original_aspect_ratio=decrease:flags=lanczos`,
      '-quality', String(kwal), uit,
    ])
    n++
  }
  const { w, h } = await maat(path.join(UIT, `foto-${nr}.webp`))
  regels.push(
    `      <button class="gal__k" type="button" data-groot="/img/foto-${nr}-groot.webp">\n` +
      `        <img loading="lazy" src="/img/foto-${nr}.webp" alt="${GALERIJ[i].alt}" width="${w}" height="${h}" />\n` +
      `      </button>`
  )
  console.log(`ok   foto-${nr}  (${GALERIJ[i].bron})`)
}

const blok = `    <div class="gal reveal" id="gal">\n${regels.join('\n')}\n    </div>`
const bron = await readFile(PAG, 'utf8')
const merk = /<!-- galerij -->[\s\S]*?<!-- \/galerij -->/
if (!merk.test(bron)) throw new Error('merktekens <!-- galerij --> staan niet in werkzaamheden.html')
await writeFile(PAG, bron.replace(merk, `<!-- galerij -->\n${blok}\n    <!-- /galerij -->`))

console.log(`\n${n} beelden weggeschreven naar src/img/, ${GALERIJ.length} in de galerij`)
