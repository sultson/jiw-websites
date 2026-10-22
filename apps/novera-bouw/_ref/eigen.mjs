// Zet de foto's die Ekrem zelf stuurde (_ref/eigen/ek-NN.jpg) om naar webp in src/img/,
// en schrijft meteen het galerijblok in pagina/werkzaamheden.html en het voor-en-na-blok
// in pagina/stucwerk.html (allebei ook in het Engels).
// Alles wat hier uit komt heet eigen-* of foto-NN: dat is echt werk van hem.
// Draai: node _ref/eigen.mjs
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { mkdir, stat, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { GALERIJ, KAART, HERO, VOORNA } from './eigen-lijst.mjs'

const uitvoer = promisify(execFile)
const HIER = path.dirname(fileURLToPath(import.meta.url))
const BRON = path.join(HIER, 'eigen')
const UIT = path.join(HIER, '..', 'src', 'img')
const PAG = path.join(HIER, '..', 'pagina', 'werkzaamheden.html')
const PAG_EN = path.join(HIER, '..', 'pagina', 'en', 'services.html')
const STUC = path.join(HIER, '..', 'pagina', 'stucwerk.html')
const STUC_EN = path.join(HIER, '..', 'pagina', 'en', 'plastering.html')
// De Engelse alt-teksten, op bron gezet. Stond een galerijfoto hier niet in, dan ging
// er vroeger stilzwijgend een Nederlandse zin op de Engelse pagina staan.
const ALT_EN = JSON.parse(await readFile(path.join(HIER, 'en-alt.json'), 'utf8'))
const ontbreekt = GALERIJ.map((g) => g.bron).filter((b) => !ALT_EN[b])
if (ontbreekt.length) throw new Error(`geen Engelse alt in en-alt.json voor: ${ontbreekt.join(', ')}`)
// Hetzelfde voor de voor-en-na-klussen: die dragen hun Engelse kop, alt en bijschrift zelf.
for (const klus of VOORNA) {
  if (!klus.kopEn || !klus.introEn) throw new Error(`geen kopEn/introEn voor klus ${klus.naam}`)
  for (const p of klus.paren) {
    for (const k of [p.voor, p.na]) if (!k.altEn) throw new Error(`geen altEn voor ${k.bron} in VOORNA`)
    if (!p.bijEn) throw new Error(`geen bijEn voor ${p.naam} in VOORNA`)
  }
  for (const l of klus.los ?? []) {
    if (!l.altEn) throw new Error(`geen altEn voor ${l.bron} in los van ${klus.naam}`)
    if (!l.bijEn) throw new Error(`geen bijEn voor ${l.bron} in los van ${klus.naam}`)
  }
}
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

/* ── voor en na: 4:5 uit een staande foto ──────────────────
   Allebei de helften krijgen dezelfde uitsnede en dezelfde maat, anders vergelijk
   je twee kaders in plaats van twee muren. */
const VN_B = 900
const VN_H = 1125
const LOS = 760 // vierkant
const vnBlok = { nl: [], en: [] }
for (const klus of VOORNA) {
  for (const [taal, woord] of [['nl', 'kop'], ['en', 'kopEn']]) {
    vnBlok[taal].push(
      `      <header class="vn__klus reveal">\n` +
        `        <h3>${klus[woord]}</h3>\n` +
        `        <p>${taal === 'nl' ? klus.intro : klus.introEn}</p>\n` +
        `      </header>`
    )
  }
  for (const paar of klus.paren) {
    for (const [kant, k] of [['voor', paar.voor], ['na', paar.na]]) {
      const in_ = path.join(BRON, `${k.bron}.jpg`)
      const { w, h } = await maat(in_)
      const hoog = Math.round((w * 5) / 4)
      if (hoog > h) throw new Error(`${k.bron} is te laag voor een 4:5 uitsnede (${w}x${h})`)
      const y = Math.round((h - hoog) * k.y)
      const uit = path.join(UIT, `${paar.naam}-${kant}.webp`)
      await ff([
        '-i', in_,
        '-vf', `crop=${w}:${hoog}:0:${y},scale=${VN_B}:${VN_H}:flags=lanczos`,
        '-quality', '74', uit,
      ])
      console.log(`ok   ${paar.naam}-${kant}  ${VN_B}x${VN_H}  ${await kb(uit)}kB  (${k.bron})`)
      n++
    }
    for (const [taal, woord] of [['nl', ['Voor', 'Na']], ['en', ['Before', 'After']]]) {
      const kaart = (kant, i, k) =>
        `          <div class="vn__k">\n` +
        `            <img loading="lazy" src="/img/${paar.naam}-${kant}.webp" alt="${taal === 'nl' ? k.alt : k.altEn}" width="${VN_B}" height="${VN_H}" />\n` +
        `            <span class="vn__tag vn__tag--${kant}">${woord[i]}</span>\n` +
        `          </div>`
      vnBlok[taal].push(
        `      <figure class="vn__paar reveal">\n` +
          `        <div class="vn__beeld">\n${kaart('voor', 0, paar.voor)}\n${kaart('na', 1, paar.na)}\n        </div>\n` +
          `        <figcaption>${taal === 'nl' ? paar.bij : paar.bijEn}</figcaption>\n` +
          `      </figure>`
      )
    }
  }
  // De losse foto's van dezelfde klus: vierkant, drie naast elkaar onder het paar.
  // Liggende bron -> x stuurt de uitsnede, staande bron -> y.
  if (klus.los?.length) {
    const losNl = []
    const losEn = []
    for (const l of klus.los) {
      const in_ = path.join(BRON, `${l.bron}.jpg`)
      const { w, h } = await maat(in_)
      const zij = Math.min(w, h)
      const x = Math.round((w - zij) * (l.x ?? 0.5))
      const y = Math.round((h - zij) * (l.y ?? 0.5))
      const uit = path.join(UIT, `${klus.naam}-los-${l.bron}.webp`)
      await ff([
        '-i', in_,
        '-vf', `crop=${zij}:${zij}:${x}:${y},scale=${LOS}:${LOS}:flags=lanczos`,
        '-quality', '74', uit,
      ])
      console.log(`ok   ${klus.naam}-los-${l.bron}  ${LOS}x${LOS}  ${await kb(uit)}kB`)
      n++
      const fig = (alt, bij) =>
        `        <figure>\n` +
        `          <img loading="lazy" src="/img/${klus.naam}-los-${l.bron}.webp" alt="${alt}" width="${LOS}" height="${LOS}" />\n` +
        `          <figcaption>${bij}</figcaption>\n` +
        `        </figure>`
      losNl.push(fig(l.alt, l.bij))
      losEn.push(fig(l.altEn, l.bijEn))
    }
    vnBlok.nl.push(`      <div class="vn__los reveal">\n${losNl.join('\n')}\n      </div>`)
    vnBlok.en.push(`      <div class="vn__los reveal">\n${losEn.join('\n')}\n      </div>`)
  }
}

const merkVn = /<!-- voorna -->[\s\S]*?<!-- \/voorna -->/
for (const [pad, lijnen, naam] of [
  [STUC, vnBlok.nl, 'stucwerk.html'],
  [STUC_EN, vnBlok.en, 'en/plastering.html'],
]) {
  const bron = await readFile(pad, 'utf8')
  if (!merkVn.test(bron)) throw new Error(`merktekens <!-- voorna --> staan niet in ${naam}`)
  await writeFile(
    pad,
    bron.replace(merkVn, `<!-- voorna -->\n    <div class="vn">\n${lijnen.join('\n')}\n    </div>\n    <!-- /voorna -->`)
  )
}

// ── galerij: hele foto, niets weggesneden. Twee maten: raster en groot. ──
const regels = []
const regelsEn = []
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
  const knop = (alt) =>
    `      <button class="gal__k" type="button" data-groot="/img/foto-${nr}-groot.webp">\n` +
    `        <img loading="lazy" src="/img/foto-${nr}.webp" alt="${alt}" width="${w}" height="${h}" />\n` +
    `      </button>`
  regels.push(knop(GALERIJ[i].alt))
  regelsEn.push(knop(ALT_EN[GALERIJ[i].bron]))
  console.log(`ok   foto-${nr}  (${GALERIJ[i].bron})`)
}

// Hetzelfde blok in twee talen, tussen dezelfde merktekens.
const merk = /<!-- galerij -->[\s\S]*?<!-- \/galerij -->/
for (const [pad, lijnen, naam] of [
  [PAG, regels, 'werkzaamheden.html'],
  [PAG_EN, regelsEn, 'en/services.html'],
]) {
  const blok = `    <div class="gal reveal" id="gal">\n${lijnen.join('\n')}\n    </div>`
  const bron = await readFile(pad, 'utf8')
  if (!merk.test(bron)) throw new Error(`merktekens <!-- galerij --> staan niet in ${naam}`)
  await writeFile(pad, bron.replace(merk, `<!-- galerij -->\n${blok}\n    <!-- /galerij -->`))
}

console.log(`\n${n} beelden weggeschreven naar src/img/, ${GALERIJ.length} in de galerij (nl + en)`)
