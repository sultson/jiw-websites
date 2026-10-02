// Genereert al het beeld voor yanis-klussenbedrijf met Runware.
// Niets op deze site komt van een andere website. Draai: node _ref/maak-beeld.mjs [naam ...]
import { writeFile, mkdir, unlink } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const eis = createRequire('C:/Users/nieuw/dev/jiw-crm/package.json')
const sharp = eis('sharp')

const API = 'https://api.runware.ai/v1'
const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC'
const MODEL = 'google:4@3'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const UIT = path.join(HIER, '..', 'src', 'img')

const STIJL =
  'professional interior photography, natural daylight, realistic, sharp, clean composition, ' +
  'no text, no lettering, no watermark, no logos, no brand names, no signage'

// google:4@3 accepteert alleen een vaste lijst maten. 2752x1536 = 16:9, 1200x896 = 4:3.
const BEELD = [
  {
    // Een kop is 16:9 maar op een telefoon staat hij bijna staand: dan blijft er nog geen
    // derde van de breedte over, precies het midden. De eerste versie had daar een lege
    // wand staan, dus op mobiel was de kop een witte muur. Daarom nu een compositie met
    // het onderwerp midden in beeld: de deuropening en het raam op de as.
    naam: 'hero',
    w: 2752,
    h: 1536,
    breed: 1920,
    p: `Wide interior view straight down the length of a freshly renovated bright Dutch apartment, completely empty of furniture and people, perfectly symmetrical one-point perspective. In the exact centre of the frame an open white internal door leads through to a further light room with a tall window at the far end letting in soft daylight. A newly laid warm oak floor runs from the bottom of the frame straight towards that doorway, smooth off-white plastered walls on both sides, clean white ceiling. Calm, sober, high quality, just finished and handed over. ${STIJL}`,
  },
  {
    naam: 'winkel-hero',
    w: 2752,
    h: 1536,
    breed: 1920,
    p: `Wide interior view of a small empty retail shop unit just after renovation, nobody present. Light polished concrete floor, smooth white walls, a fitted white counter along one side, a row of modern track spotlights on a black rail across the ceiling, a large shopfront window at the back with daylight coming in. Completely empty of goods, no text, no price cards, no signage anywhere. ${STIJL}`,
  },
  {
    // De kop van /appartementen droeg eerst w-badkamer: een badkamer boven de titel
    // Appartementen. Eigen beeld, en 16:9 zoals de andere twee koppen.
    naam: 'appartement-hero',
    w: 2752,
    h: 1536,
    breed: 1920,
    p: `Wide interior view of a renovated apartment living room on an upper floor, completely empty of furniture and people. Large sliding balcony doors along one side with a glass balustrade and a narrow balcony behind them, daylight coming in, and through the glass the facades and balconies of other apartment blocks across the street. Smooth off-white walls, a newly laid light oak floor, a slim white radiator, clean white ceiling. Calm, sober, just finished and handed over, no text or signage anywhere. ${STIJL}`,
  },
  {
    // Derde kop, voor /woningen. Een woning moet je als woning kunnen lezen en niet als
    // appartement: daarom de trap en de tuindeuren met de tuin erachter, en net als bij de
    // andere twee koppen staat het onderwerp op de as zodat de smalle mobiele uitsnede klopt.
    naam: 'woning-hero',
    w: 2752,
    h: 1536,
    breed: 1920,
    p: `Wide interior view of the ground floor of a renovated Dutch terraced family house, completely empty of furniture and people. In the exact centre of the frame a set of tall white French doors leads out to a small green back garden with daylight streaming in. A straight white staircase with an oak handrail runs up along the right-hand wall, smooth off-white plastered walls, a newly laid warm oak floor running towards the garden doors, clean white ceiling. Calm, sober, just finished and handed over, no text or signage anywhere. ${STIJL}`,
  },
  {
    // Het blok Woningen op de startpagina. Zelfde eis: trap en tuindeuren, zodat het niet
    // voor een appartement door kan gaan.
    naam: 'w-woning',
    p: `Interior of the renovated ground floor of a Dutch terraced house seen from the hallway, completely empty of furniture and people. A straight staircase with a white balustrade and an oak handrail along one side, an open doorway through to a light living room with French doors to a small back garden at the far end, smooth off-white walls, a newly laid oak floor, daylight. Calm, sober, just finished and handed over, no text or signage anywhere. ${STIJL}`,
  },
  {
    naam: 'w-renovatie',
    p: `An apartment mid-renovation seen from the hallway, nobody present: stripped walls with fresh plaster patches, new electrical conduit chased into a wall, a clean dust sheet over the floor, a step ladder and a neat stack of tools against the wall, daylight from a bare window. Tidy, organised building site. ${STIJL}`,
  },
  {
    naam: 'w-elektra',
    // Met handen in beeld gaf dit model een merknaam op de schroevendraaier. Geen mensen
    // meer in deze vier, dan kan dat niet meer en loopt de hele set gelijk.
    // De eerste versie zonder mensen kwam er raar uit: een losse wandcontactdoos op de
    // vloer naast een beitel, tegen een half gesloopte muur met bloot metselwerk. Dat leest
    // als rommel en niet als werk. Nu het werk zelf: een strak gefreesde wand waar de
    // buis in ligt, met één doos al gemonteerd ernaast. Niets los op de vloer.
    p: `Close view of neat new electrical first-fix work on a smooth freshly plastered interior wall in a Dutch home under renovation, nobody present and no hands in frame. A straight, cleanly chased vertical channel in the wall with white electrical conduit laid neatly into it, running up to an orange flush-mounted wall box at socket height with brown, blue and green-yellow wires carefully folded inside it. Beside it a second box already closed with a plain white double socket fitted flush and level. The floor below is swept clean and empty. Calm, tidy, precise craftsmanship, soft daylight from the side. No people, no loose tools, no rubble, no text or lettering anywhere. ${STIJL}`,
  },
  {
    naam: 'w-schilderwerk',
    p: `Interior painting in progress in an empty room, nobody present and no hands in frame: half of a smooth wall rolled in soft off-white paint with a crisp wet edge, blue masking tape along the white window woodwork, a paint roller resting in a tray of white paint and a brush laid across it on a clean dust sheet over the oak floor. No people anywhere. ${STIJL}`,
  },
  {
    naam: 'w-loodgieter',
    p: `New copper and chrome pipework freshly fitted to a bathroom wall under renovation, nobody present and no hands in frame: two vertical copper pipes on wall clips with a shut-off valve, bare plaster wall, a pipe wrench and a spirit level lying on the timber below, a capped drain in the floor. Tidy work, no people anywhere. ${STIJL}`,
  },
  {
    naam: 'w-tegelwerk',
    p: `A bathroom wall half tiled, nobody present and no hands in frame: large-format light tiles set on a combed grey adhesive bed, the next bare stretch of comb marks waiting, yellow and red tile levelling clips in the joints, a notched trowel resting against the wall, work light from the side. No people anywhere. ${STIJL}`,
  },
  {
    naam: 'w-badkamer',
    p: `A completed compact Dutch bathroom renovation seen from the doorway: large light stone-look tiles, a walk-in shower with a slim black framed glass panel, a wall-hung toilet, a slim oak vanity with a white basin, a towel radiator. Warm daylight from a small frosted window, nobody present. ${STIJL}`,
  },
  {
    naam: 'w-keuken',
    p: `A newly fitted simple modern kitchen in a renovated Dutch apartment, matte light grey handleless fronts, a light worktop, a white tiled splashback, a window above the sink with daylight. Completely empty and clean, nobody present, no appliances with visible brand names, no text anywhere. ${STIJL}`,
  },
  {
    naam: 'w-vloer',
    p: `A new oak floor half laid in an empty renovated room, nobody present and no hands in frame: finished planks on one side, the bare subfloor on the other, one loose plank waiting at the open edge, yellow spacers along the skirting, a tapping block and a hammer lying on the finished floor, a few spare planks stacked by the wall, daylight from a window. No people anywhere. ${STIJL}`,
  },
  {
    naam: 'w-winkel',
    // De eerste versie ("commercial unit being fitted out") werd door Google's moderatie
    // afgewezen. Dat is deterministisch, dus anders geschreven in plaats van opnieuw geprobeerd.
    p: `An empty light room with a newly built partition wall of fresh plasterboard, taped and filled seams, electric cables pulled down to points in the ceiling for a lighting rail, a swept smooth concrete floor, a step ladder and a neat stack of building boards along the wall. Daylight from a large window, nobody in sight, no text anywhere. ${STIJL}`,
  },
  {
    // Op de startpagina droeg het blok Appartementen een badkamer. Een badkamer zegt niet
    // dat het om een appartement gaat; de balkondeuren en de blokken aan de overkant wel.
    naam: 'w-appartement',
    p: `Interior of a renovated apartment living room on an upper floor seen from the hallway doorway, completely empty of furniture and people. Sliding balcony doors along the far wall with a glass balustrade and a narrow balcony behind them, and through the glass the facades and balconies of the apartment block across the street. Smooth off-white walls, a newly laid light oak floor, a slim white radiator, daylight. Calm, sober, just finished and handed over, no text or signage anywhere. ${STIJL}`,
  },
  {
    // Idem voor het blok Winkels: daar stond een nieuw opgebouwde wand, dat leest als
    // klussen en niet als winkel. De pui en de spots maken er wel een winkel van.
    naam: 'w-winkelruimte',
    p: `Interior of a small empty shop unit just after renovation, nobody present. A fitted plain counter of light wood along one side, a row of modern track spotlights on a black rail across the ceiling, smooth white walls, a light polished concrete floor, and a large shopfront window onto a quiet street with daylight coming in. Completely empty of goods, no text, no price cards, no signage anywhere. ${STIJL}`,
  },
  {
    naam: 'w-oplevering',
    p: `An empty freshly renovated Dutch apartment hallway at handover: a new oak floor swept clean, white walls, a new white internal door standing open to a light room, no tools and no dust left anywhere, soft daylight. Nobody present. ${STIJL}`,
  },
  {
    naam: 'advies',
    p: `A flat overhead view on a light oak table: a folded floor plan drawing without any readable text, tile samples in beige and grey, two oak floor plank samples, a folding ruler, a tape measure, a pencil and a plain notebook, a mug of coffee. Warm daylight. No readable words or numbers anywhere. ${STIJL}`,
  },
]

const alleen = process.argv.slice(2)
const werk = alleen.length ? BEELD.filter((b) => alleen.includes(b.naam)) : BEELD

async function maak(b) {
  const w = b.w ?? 1200
  const h = b.h ?? 896
  const body = [
    {
      taskType: 'imageInference',
      taskUUID: randomUUID(),
      model: MODEL,
      positivePrompt: b.p,
      width: w,
      height: h,
      numberResults: 1,
      outputFormat: 'WEBP',
    },
  ]
  for (let poging = 1; poging <= 3; poging++) {
    try {
      const r = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${KEY}` },
        body: JSON.stringify(body),
      })
      const j = await r.json()
      const url = j?.data?.[0]?.imageURL
      if (!url) throw new Error(JSON.stringify(j).slice(0, 300))
      const bin = Buffer.from(await (await fetch(url)).arrayBuffer())
      // Runware levert licht gecomprimeerd en groot. Altijd zelf terugzetten, anders
      // draagt de pagina megabytes. Op Windows via .tmp, sharp houdt de bron open.
      const doel = path.join(UIT, `${b.naam}.webp`)
      const tmp = doel + '.tmp'
      await sharp(bin)
        .resize({ width: b.breed ?? 1200, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(tmp)
      if (existsSync(doel)) await unlink(doel)
      const { renameSync } = await import('node:fs')
      renameSync(tmp, doel)
      const meta = await sharp(doel).metadata()
      return { naam: b.naam, ok: true, kb: Math.round((await sharp(doel).toBuffer()).length / 1024), w: meta.width, h: meta.height }
    } catch (e) {
      if (poging === 3) return { naam: b.naam, ok: false, fout: String(e).slice(0, 220) }
      await new Promise((res) => setTimeout(res, 2000 * poging))
    }
  }
}

if (!existsSync(UIT)) await mkdir(UIT, { recursive: true })

const rij = [...werk]
const uit = []
const lopers = Array.from({ length: 4 }, async () => {
  while (rij.length) {
    const b = rij.shift()
    const r = await maak(b)
    uit.push(r)
    console.log(r.ok ? `ok   ${r.naam} ${r.w}x${r.h} ${r.kb}kB` : `FOUT ${r.naam} ${r.fout}`)
  }
})
await Promise.all(lopers)

const stuk = uit.filter((r) => !r.ok)
console.log(`\n${uit.length - stuk.length}/${uit.length} gelukt`)
if (stuk.length) process.exit(1)
