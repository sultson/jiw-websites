// Zet de eigen foto's van Ekrem (_ref/werkspot/ws-*.jpg) om naar webp in src/img/.
// Alles wat hier uit komt heet echt-* of werk-*: dat is echt werk van hem.
// De beelden die hier NIET uit komen zijn door ons gemaakt. Draai: node _ref/echt.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, stat } from 'node:fs/promises'
import { FOTOS } from './foto-lijst.mjs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const uitvoer = promisify(execFile)
const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, 'werkspot')
const UIT = path.join(HIER, '..', 'src', 'img')
const FFMPEG = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin/ffmpeg.exe'
)

// ── kaartbeeld: 4:3 uit een staande foto, dus de hoogte wordt gekozen ──
// y = waar de uitsnede begint. Bron is 1536x2048, uitsnede 1536x1152, dus y loopt 0..896.
const KAART = [
  { naam: 'echt-badkamer', bron: 'ws-05', y: 300 }, // inloopdouche tegen de marmerlook wand
  { naam: 'echt-toilet', bron: 'ws-12', y: 430 }, // hangtoilet met ronde spiegel
  { naam: 'echt-tegelwerk', bron: 'ws-17', y: 540 }, // visgraat wandtegel, kruisjes staan er nog in
  { naam: 'echt-vloerverwarming', bron: 'ws-01', y: 700 }, // verwarmingsmat op de kale vloer
  { naam: 'echt-douche', bron: 'ws-11', y: 380 }, // inloopdouche met nis
  { naam: 'echt-tegels', bron: 'ws-16', y: 460 }, // grootformaat wandtegel met zitbank
  { naam: 'echt-tegelzetten', bron: 'ws-15', y: 430 }, // tegelwerk halverwege
  { naam: 'echt-afwerking', bron: 'ws-03', y: 500 }, // marmerlook naast een lamellenwand in noten
]

// ── hero: breder dan 4:3, want de kop is een brede band ──
const HERO = { naam: 'echt-hero', bron: 'ws-04', h: 1080, y: 400 }


async function ff(args) {
  await uitvoer(FFMPEG, ['-v', 'error', '-y', ...args])
}
const kb = async (p) => Math.round((await stat(p)).size / 1024)

await mkdir(UIT, { recursive: true })
let n = 0

for (const k of KAART) {
  const uit = path.join(UIT, `${k.naam}.webp`)
  await ff([
    '-i', path.join(BRON, `${k.bron}.jpg`),
    '-vf', `crop=iw:iw*3/4:0:${k.y},scale=1200:900:flags=lanczos`,
    '-quality', '82', uit,
  ])
  console.log(`ok   ${k.naam}  1200x900  ${await kb(uit)}kB  (${k.bron})`)
  n++
}

{
  const uit = path.join(UIT, `${HERO.naam}.webp`)
  await ff([
    '-i', path.join(BRON, `${HERO.bron}.jpg`),
    '-vf', `crop=iw:${HERO.h}:0:${HERO.y}`,
    '-quality', '84', uit,
  ])
  console.log(`ok   ${HERO.naam}  1536x${HERO.h}  ${await kb(uit)}kB  (${HERO.bron})`)
  n++
}

let i = 0
// ── galerij: hele foto, niets weggesneden. Twee maten: raster en groot. ──
for (const { bron } of FOTOS) {
  i++
  const nr = String(i).padStart(2, '0')
  for (const [achter, lang, kwal] of [['', 560, 78], ['-groot', 1400, 84]]) {
    const uit = path.join(UIT, `werk-${nr}${achter}.webp`)
    await ff([
      '-i', path.join(BRON, `${bron}.jpg`),
      '-vf', `scale=w=${lang}:h=${lang}:force_original_aspect_ratio=decrease:flags=lanczos`,
      '-quality', String(kwal), uit,
    ])
    n++
  }
  console.log(`ok   werk-${nr}  (${bron})`)
}

console.log(`\n${n} beelden weggeschreven naar src/img/`)
