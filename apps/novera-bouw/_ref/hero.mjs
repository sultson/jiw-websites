// Zet de vijf herofoto's uit _ref/hero/ om naar webp in src/img/ (hero-1..5.webp).
// Deze vijf kwamen op 03-10-2026 binnen via WhatsApp. Ze staan hier zodat de bron
// bewaard blijft: de webp's in src/img/ zijn afgeleid, deze jpg's zijn het origineel.
//
// Let op de verhouding. Drie van de vijf staan rechtop (0,74 tot 0,76) en de hero is
// breed. Rechtop gesneden op een brede kop houdt alleen een strook over, dus die drie
// krijgen op de pagina een trage kanteling van boven naar beneden (zie .hero__dia--kantel
// in styles.css). Daarvoor moeten ze hoog genoeg blijven: niet naar de heroverhouding
// snijden, gewoon de hele foto op breedte zetten.
//
// Draai: node _ref/hero.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const uitvoer = promisify(execFile)
const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, 'hero')
const UIT = path.join(HIER, '..', 'src', 'img')
const BIN = path.join(
  process.env.USERPROFILE || process.env.HOME,
  'dev/tools/ffmpeg/ffmpeg-9.0-essentials_build/bin'
)
const FFMPEG = path.join(BIN, 'ffmpeg.exe')
const FFPROBE = path.join(BIN, 'ffprobe.exe')

// breed: waar de foto op uitkomt. De bronnen zijn klein (1093 tot 1448 px breed),
// dus hier zit een lichte opschaling in. Dat moet: op 1440 px scherm wordt de kop
// op volle breedte getoond, en kijk.mjs keurt een beeld af dat meer dan 1,35x
// uitgerekt staat.
const FOTOS = [
  { n: 1, breed: 1600, kwal: 80 }, // marmeren badkamer, dubbele wastafel (1317x1194)
  { n: 2, breed: 1280, kwal: 80 }, // marmeren douche met zwart hangtoilet (1093x1439)
  { n: 3, breed: 1280, kwal: 78 }, // badkamer onder houten balken (1200x1600)
  { n: 4, breed: 1280, kwal: 78 }, // toilet met grote grijze tegels (1189x1600)
  { n: 5, breed: 1600, kwal: 80 }, // woonkamer, sierstuc tv-wand (1448x1086)
]

async function maat(bestand) {
  const { stdout } = await uitvoer(FFPROBE, [
    '-v', 'error', '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height', '-of', 'csv=p=0', bestand,
  ])
  const [w, h] = stdout.trim().split(',').map(Number)
  return { w, h }
}

for (const f of FOTOS) {
  const in_ = path.join(BRON, `hero-${f.n}.jpg`)
  const uit = path.join(UIT, `hero-${f.n}.webp`)
  await uitvoer(FFMPEG, [
    '-v', 'error', '-y', '-i', in_,
    '-vf', `scale=${f.breed}:-2:flags=lanczos`,
    '-quality', String(f.kwal), '-compression_level', '6',
    uit,
  ])
  const { w, h } = await maat(uit)
  const kb = Math.round((await stat(uit)).size / 1024)
  console.log(`hero-${f.n}.webp  ${w}x${h}  ${kb} kB  (${(w / h).toFixed(2)})`)
}
