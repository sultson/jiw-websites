// Genereert al het beeld voor novera-bouw met Runware.
// Niets op deze site komt van een andere website. Draai: node _ref/maak-beeld.mjs [naam ...]
import { writeFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { randomUUID } from 'node:crypto'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const API = 'https://api.runware.ai/v1'
const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC'
const MODEL = 'google:4@3'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const UIT = path.join(HIER, '..', 'src', 'img')

const STIJL =
  'professional interior photography, natural daylight, realistic, sharp, clean composition, ' +
  'no text, no lettering, no watermark, no logos, no brand names, no signage'

const BEELD = [
  // ── hero
  {
    naam: 'hero',
    // google:4@3 accepteert alleen een vaste lijst maten. 16:9 2K en 4:3 1K zijn de twee die wij hier gebruiken.
    w: 2752,
    h: 1536,
    p: `A freshly renovated modern Dutch bathroom, wide interior view. Large-format warm grey porcelain wall tiles, a walk-in shower with a slim black framed glass panel, a wall-hung toilet, an oak vanity with a white basin. Soft daylight from a frosted window on the left. Calm, warm, high-end but sober. ${STIJL}`,
  },
  // ── materialen (assortiment)
  {
    naam: 'm-tegels',
    p: `Large-format porcelain floor and wall tiles standing upright and leaning against a light plastered wall in a bright empty room, several finishes side by side: concrete look, warm beige, soft marble veining. Daylight raking across the surfaces. ${STIJL}`,
  },
  {
    naam: 'm-laminaat',
    p: `A newly laid oak laminate floor in an empty light living room, planks running towards a window, warm natural grain, skirting boards along the wall. A few loose planks stacked neatly in the corner. ${STIJL}`,
  },
  {
    naam: 'm-pvc',
    p: `A herringbone PVC click floor in warm smoked oak in an empty modern room, low afternoon light across the pattern, white walls. ${STIJL}`,
  },
  {
    naam: 'm-badmeubel',
    p: `A modern wall-hung bathroom vanity in warm oak veneer with a white solid-surface basin, matte black tap, a large rectangular mirror above it, soft grey tiled wall behind. ${STIJL}`,
  },
  {
    naam: 'm-douche',
    p: `A walk-in shower with a slim matte black framed clear glass panel, large ribbed stone-look wall tiles, a black rain shower head and a linear drain in the floor. Bright and dry, nobody present. ${STIJL}`,
  },
  {
    naam: 'm-bad',
    p: `A freestanding oval white bathtub against a soft beige micro-cement wall, matte black floor-standing bath tap, warm oak floor, a folded towel on a stool. Calm daylight. ${STIJL}`,
  },
  {
    naam: 'm-toilet',
    p: `A small modern toilet room, wall-hung white toilet with a concealed cistern, a slim matte black flush plate, dark green tiled lower wall and a warm plastered upper wall, a small corner basin. ${STIJL}`,
  },
  {
    naam: 'm-radiator',
    p: `One single vertical flat-panel designer radiator in anthracite, mounted on a plain white plastered wall in a light hallway with an oak floor. One radiator only, centred, seen straight on, nothing else in the frame. ${STIJL}`,
  },
  {
    naam: 'm-kranen',
    p: `Close-up of a matte black basin mixer tap on a white ceramic washbasin, water droplets, soft grey tiled wall behind, shallow depth of field. ${STIJL}`,
  },
  {
    naam: 'm-vloerverwarming',
    p: `Close view of a finished underfloor heating layout in an empty renovated room, nobody present, no people, no figures. Red PEX pipes clipped in tight even loops onto white insulation panels covering the whole floor evenly wall to wall, a white manifold cabinet on the plastered wall behind. Even daylight from a window, calm and tidy, everything level and flat. ${STIJL}`,
  },
  {
    naam: 'm-cvketel',
    p: `A modern white wall-hung combi boiler in a clean utility cupboard, copper and flexible pipework neatly run, an expansion vessel beside it, tidy installation. ${STIJL}`,
  },
  // ── werk / diensten
  {
    naam: 'w-badkamer',
    p: `A completed compact Dutch bathroom renovation seen from the doorway: light stone-look tiles, a walk-in shower, a wall-hung toilet, a slim oak vanity, a towel radiator. Warm daylight from a small window. ${STIJL}`,
  },
  {
    naam: 'w-toilet',
    p: `A completed small toilet renovation: warm terracotta hexagon floor tiles, white wall tiles to half height, wall-hung toilet, small fountain basin with a black tap, a round mirror. ${STIJL}`,
  },
  {
    naam: 'w-tegelwerk',
    p: `A tiler's hands setting a large-format wall tile onto a combed adhesive bed, notched trowel and tile levelling clips visible, bathroom wall under construction, work light from the side. No face in frame. ${STIJL}`,
  },
  {
    naam: 'w-stucwerk',
    p: `A plasterer smoothing a wall with a stainless steel trowel, fresh smooth plaster catching the light, empty room, dust sheet on the floor. Hands and arms only, no face. ${STIJL}`,
  },
  {
    naam: 'w-schilderwerk',
    p: `Interior painting in progress: a hand rolling soft off-white paint onto a wall, crisp masking tape along white window woodwork, paint tray and dust sheet on the oak floor. No face in frame. ${STIJL}`,
  },
  {
    naam: 'w-laminaat',
    // Het eerste beeld hier klopte niet: planken lagen rechtstreeks op de dekvloer
    // zonder ondervloer, de wiggen lagen los midden op het beton en er werd met een
    // hamer op de zichtzijde geslagen. Daarom staat dat nu alle drie in de opdracht.
    p: `Laying a laminate floor in an empty light Dutch room: a grey foam underlay membrane already rolled out flat over the concrete screed ahead of the work, the finished warm oak plank floor behind it, a kneeling fitter angling a new plank down into the click joint along the leading edge of the last laid row, both hands flat on the plank. Red wedge spacers sit in the expansion gap between the finished floor and the white wall, a tapping block and a pull bar rest on the finished floor. No face in frame, no hammer and no chisel touching the surface of a plank. ${STIJL}`,
  },
  {
    naam: 'w-trap',
    p: `A renovated straight indoor staircase in a light Dutch hallway, seen from the bottom looking up. The treads and risers are clad with warm oak overlay panels, crisp edges, a slim matte black handrail along the plastered wall, white stringers. The lowest two treads still show the old grey painted wood, so the difference is visible. Calm daylight from the hall, nobody present, no tools in frame. ${STIJL}`,
  },
  // ── cv-ketel (eigen pagina)
  {
    naam: 'cv-hero',
    w: 2752,
    h: 1536,
    p: `Wide interior view of a clean Dutch utility room. On the RIGHT side of the frame a modern plain white wall-hung combi boiler with a completely blank unmarked front panel, mounted on a light plastered wall, neat copper and stainless flexible pipework running down to a white expansion vessel. The LEFT half of the frame is empty light plastered wall and a tiled floor with a floor drain, soft daylight. Calm, tidy, nobody present. No appliances with visible brand names, absolutely no text or letters anywhere in the image. ${STIJL}`,
  },
  {
    naam: 'cv-monteur',
    p: `A heating engineer in a clean dark work jacket servicing an opened wall-hung combi boiler, front cover removed and resting against the wall, hands adjusting a component with a spanner, a small tool case open on a dust sheet on the floor. Seen from behind and to the side, no face in frame. Warm work light. ${STIJL}`,
  },
  {
    naam: 'cv-onderhoud',
    p: `Close-up of gloved hands checking the pressure gauge and filling loop of a wall-hung combi boiler, the front panel removed showing clean internal pipework and the heat exchanger, a soft brush and a cloth on a folded dust sheet. Shallow depth of field, no face in frame. ${STIJL}`,
  },
  {
    naam: 'cv-vervangen',
    p: `A light plastered wall in a clean Dutch utility room where an old boiler has just been taken off: a bare steel mounting bracket, four neatly capped copper pipe ends, a pale rectangular patch on the otherwise clean wall. The old grey wall-hung boiler laid on a clean grey dust sheet on the tiled floor to the left, a new plain white boiler still in its cardboard box standing to the right. Tidy worksite, good daylight, nobody present. No text or letters anywhere in the image. ${STIJL}`,
  },
  // ── koppen van de negen eigen dienstpagina's (16:9, onderwerp rechts, links ruimte voor de tekst)
  {
    naam: 'h-badkamer',
    w: 2752,
    h: 1536,
    p: `Wide interior view of a completed modern Dutch bathroom. On the RIGHT of the frame a walk-in shower behind a slim matte black framed glass panel with large warm grey stone-look wall tiles, a wall-hung toilet and an oak vanity with a white basin. The LEFT third is calm empty tiled wall in soft shadow. Daylight from a frosted window. Nobody present, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-toilet',
    w: 2752,
    h: 1536,
    p: `Wide interior view of a small completed Dutch toilet room seen from the doorway. On the RIGHT a wall-hung white toilet with a concealed cistern and a slim matte black flush plate, warm concrete-look wall tiles and a lit recessed niche, a small corner fountain basin with a black tap. The LEFT of the frame is quiet plastered wall in soft shadow. Nobody present, absolutely no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-tegelwerk',
    w: 2752,
    h: 1536,
    p: `Wide view of a bathroom wall being tiled. On the RIGHT large-format porcelain wall tiles already set in a neat grid with levelling clips still in place, a notched trowel and a stack of tiles leaning nearby. The LEFT half is bare grey levelled wall waiting for tiles, a chalk line across it. Work light from the side, nobody in frame, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-stucwerk',
    w: 2752,
    h: 1536,
    p: `Wide view of an empty light Dutch room during plastering. On the RIGHT a wall freshly finished in smooth plaster catching the daylight, a stainless steel trowel and a hawk resting on a trestle, a mixing bucket on a dust sheet. The LEFT half is calm finished wall in soft even light. Nobody present, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-schilderwerk',
    w: 2752,
    h: 1536,
    p: `Wide interior view of a light Dutch room being painted. On the RIGHT a white window frame crisply masked with tape, a paint roller on an extension pole leaning against the wall and a paint tray on a canvas dust sheet on an oak floor. The LEFT half is a calm freshly painted off-white wall. Soft daylight, nobody present, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-laminaat',
    w: 2752,
    h: 1536,
    p: `Wide view of an empty light Dutch living room with a newly laid warm oak laminate floor running towards a window on the RIGHT, where a few loose planks, spacers and a tapping block lie neatly on the floor. The LEFT half is finished floor and plain white wall with a fitted skirting board. Low daylight raking across the grain, nobody present, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-trap',
    w: 2752,
    h: 1536,
    p: `Wide view of a light Dutch hallway with a renovated straight staircase on the RIGHT of the frame, treads and risers clad in warm oak overlay panels with crisp edges, a slim matte black handrail along the plastered wall, white stringers. The LEFT half is calm empty hallway wall and an oak floor in soft daylight. Nobody present, no tools, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'h-vloerverwarming',
    w: 2752,
    h: 1536,
    p: `Wide view of an empty Dutch room with underfloor heating pipework laid out across the floor in even loops on red tacker insulation panels, running towards a white manifold cabinet mounted low on the wall at the RIGHT of the frame. The LEFT half is calm plastered wall and the same neat loops receding. Bright even daylight, nobody present, no text or letters anywhere. ${STIJL}`,
  },
  // ── detailbeeld bij de dienstpagina's
  {
    naam: 'd-stuc-plafond',
    p: `A plasterer's trowel drawing a smooth finish across a ceiling in an empty light room, fresh plaster catching the light, a work platform and a dust sheet below. Hands and arms only, no face in frame. ${STIJL}`,
  },
  {
    naam: 'd-stuc-sier',
    p: `Close view of a wall finished in fine textured decorative plaster in a warm off-white, raking daylight showing the grain of the finish, the corner of a plain white skirting board at the bottom. Nothing else in frame. ${STIJL}`,
  },
  {
    naam: 'd-verf-kozijn',
    p: `Close view of a brush cutting a crisp line of white paint along an interior door frame, masking tape on the adjacent wall, a small pot of paint on a folded dust sheet. Hand only, no face in frame. ${STIJL}`,
  },
  {
    naam: 'd-verf-plafond',
    p: `An empty light Dutch room freshly painted: plain white ceiling, soft warm off-white walls, oak floor, a roller on an extension pole and a covered stepladder standing to one side. Calm daylight, nobody present. ${STIJL}`,
  },
  {
    naam: 'd-trap-overzet',
    p: `Close view of an oak stair overlay tread being set onto an existing stair tread, the new panel resting in place with a thin bead of adhesive visible at the edge, the old grey painted step underneath still showing on the next step down. Hands only, no face in frame. ${STIJL}`,
  },
  {
    naam: 'd-trap-af',
    p: `Close view of the finished edge of a renovated staircase: warm oak tread nosing, a matching riser panel, a white painted stringer beside it and a slim matte black handrail bracket on the plastered wall. Soft daylight, nothing else in frame. ${STIJL}`,
  },
  {
    naam: 'd-vv-verdeler',
    p: `Close view of a stainless steel underfloor heating manifold in an open white wall cabinet, rows of flow meters on top, coloured pipe loops running down neatly into the floor, an actuator block on the return bar. Clean installation, nobody present, no text or letters anywhere. ${STIJL}`,
  },
  {
    naam: 'd-vv-frezen',
    p: `Close view of an existing concrete floor screed with neat milled channels cut in an even loop pattern, underfloor heating pipe already pressed into part of the channels, the rest still open, a vacuum hose and dust on the floor beside it. Nobody in frame. ${STIJL}`,
  },
  // ── aanbod: losse artikelen, als voorbeeld van wat hij kan leveren
  // Productbeeld: het artikel zelf groot in beeld, rustige achtergrond, geen prijskaartje.
  {
    naam: 'p-wit10',
    p: `Product photograph of small square glossy white ceramic wall tiles, 10 by 10 centimetres, laid in a neat grid with thin light grey grout, filling the frame straight on. Clean reflections, soft even studio daylight, nothing else in the frame. ${STIJL}`,
  },
  {
    naam: 'p-metro',
    p: `Product photograph of classic white bevelled metro wall tiles in a running bond pattern, glossy glaze, thin grey grout lines, seen straight on filling the frame. Soft even studio daylight, nothing else in the frame. ${STIJL}`,
  },
  {
    naam: 'p-antraciet',
    p: `Product photograph of large matt anthracite dark grey porcelain wall tiles, rectangular 30 by 60 centimetres, laid in a neat grid with dark grout, seen straight on filling the frame. Fine stone texture, soft raking studio daylight. ${STIJL}`,
  },
  {
    naam: 'p-mozaiek',
    p: `Product photograph of small anthracite dark grey square mosaic tiles on a mesh sheet, 5 by 5 centimetres each, matt finish, seen straight on filling the frame, soft even studio daylight. ${STIJL}`,
  },
  {
    naam: 'p-betonlook',
    p: `Product photograph of large square concrete-look porcelain floor tiles in mid grey, 60 by 60 centimetres, matt, subtle cloudy texture, laid in a grid seen straight on filling the frame. Soft even studio daylight. ${STIJL}`,
  },
  {
    naam: 'p-marmer',
    p: `Product photograph of a large white marble-look porcelain tile with soft grey veining, polished, seen straight on filling the frame, soft even studio daylight, nothing else in the frame. ${STIJL}`,
  },
  {
    naam: 'p-toilet',
    p: `Product photograph of a single wall-hung white rimless ceramic toilet with a soft-close seat, mounted on a plain light plastered wall, seen from a slight angle, nothing else in the frame, soft even daylight, plain background. ${STIJL}`,
  },
  {
    naam: 'p-fontein',
    p: `Product photograph of a small white ceramic corner fountain basin for a toilet room with a slim matte black cold-water tap, mounted on a plain light wall, seen from a slight angle, nothing else in the frame, soft even daylight. ${STIJL}`,
  },
  {
    naam: 'p-plaat',
    p: `Close-up product photograph of a slim matte black rectangular dual-flush plate on a plain light plastered toilet wall, seen straight on, nothing else in the frame, soft even daylight, absolutely no text or symbols on the plate. ${STIJL}`,
  },
  {
    naam: 'p-kraan',
    p: `Product photograph of a single matte black basin mixer tap standing on a plain white ceramic washbasin against a plain light background, seen from a slight angle, sharp, nothing else in the frame, soft studio daylight. ${STIJL}`,
  },
  {
    naam: 'p-doucheset',
    p: `Product photograph of a matte black shower set: a large round rain shower head on a ceiling arm with a hand shower on a slide bar and a thermostatic mixer, mounted on a plain light tiled wall, seen straight on, nothing else in the frame, soft daylight. ${STIJL}`,
  },
  {
    naam: 'p-handdoek',
    p: `Product photograph of a single anthracite dark grey ladder-style towel radiator mounted on a plain white plastered wall, seen straight on, nothing else in the frame, soft even daylight. ${STIJL}`,
  },
  // ── advies / inkoop
  {
    naam: 'advies',
    p: `A flat overhead view on a light oak table: tile samples in beige and grey, three laminate plank samples, a folding ruler, a tape measure, a notebook with a pencil, a mug of coffee. Warm daylight. ${STIJL}`,
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
      await writeFile(path.join(UIT, `${b.naam}.webp`), bin)
      return { naam: b.naam, ok: true, kb: Math.round(bin.length / 1024), w, h }
    } catch (e) {
      if (poging === 3) return { naam: b.naam, ok: false, fout: String(e).slice(0, 200) }
      await new Promise((res) => setTimeout(res, 2000 * poging))
    }
  }
}

if (!existsSync(UIT)) await mkdir(UIT, { recursive: true })

const rij = [...werk]
const uit = []
const lopers = Array.from({ length: 5 }, async () => {
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
