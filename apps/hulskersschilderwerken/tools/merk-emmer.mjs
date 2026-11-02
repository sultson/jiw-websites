/* Zet ZIJN ECHTE woordmerk op de grote emmer in de tekening.
 *
 * Voorgeschiedenis in twee stappen, want zonder die twee is dit script onbegrijpelijk.
 *
 *  1. Het model had zijn woordmerk op vijf plekken NAGESCHREVEN en de onderregel elke
 *     keer anders verkeerd gespeld: schilderwerkobn op de polo, schilderwerknd op de
 *     grote emmer, en drie andere varianten. Zijn eigen bedrijfsnaam, vijf keer fout,
 *     op zijn eigen site. poets-woordmerk.py haalde ze er alle vijf uit.
 *  2. Armando, 02-11-2026: "Haal de vakman weg zodat je de tekst ziet die op die emmer
 *     staat." Hij wil dat merk op de emmer dus juist WEL zien - het weghalen loste de
 *     spelfout op door het onderwerp af te schaffen.
 *
 * De uitweg is geen van beide: niet het nageschreven merk terugzetten (dan staat zijn
 * naam weer fout) en niet leeg laten. Hier gaat zijn ECHTE logo op de emmer, uit
 * public/logo.svg - dezelfde bron als de kopbalk, de mail en de handtekening. Daarmee
 * is de spelling per definitie goed en blijft hij goed als dat bestand verandert.
 *
 * Opnieuw laten tekenen was geen optie en dat is gemeten (02-11-2026): twee rondes met
 * de opdracht "alleen de letters, laat de man staan" gaven allebei een ander gezicht.
 * Zie de regel over de aircofoto's van Woudenberg in playground/CLAUDE.md - een model
 * bewerkt niet, het tekent opnieuw.
 *
 *   node tools/merk-emmer.mjs            schrijft fotos/pascal-tekening-merk.jpg
 *   node tools/merk-emmer.mjs --kijk     schrijft er een uitsnede naast om naar te kijken
 *
 * Daarna fotos.py draaien; die leest de plaat met het merk erop.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const APP = path.join(HIER, '..')
const FOTOS = path.join(APP, '..', '.aangeleverd-hulskers', 'fotos')
const BRON = path.join(FOTOS, 'pascal-tekening-schoon.jpg')
const UIT = path.join(FOTOS, 'pascal-tekening-merk.jpg')
const LOGO = path.join(APP, 'public', 'logo.svg')

// Hetzelfde vak als 'emmer-groot' in poets-woordmerk.py: daar stond het nageschreven
// merk, dus daar hoort het echte te staan. Staat het vak daar niet meer, dan is de
// tekening vervangen en klopt dit script ook niet meer - vandaar de maatcontrole.
const PLAAT = { b: 1448, h: 1086 }
const VAK = { x: 56, y: 903, b: 262, h: 109 }

// Multiply en niet gewoon eroverheen: de emmerwand heeft lichtval, een schaduwrand en
// verfspatten. Plak je het logo ondoorzichtig op, dan ligt er een rechthoekige witte
// sticker op een getekende emmer. Met multiply laat het wit van het logo de emmer door
// en pakken alleen de letters zelf.
const MENG = 'multiply'

const kijk = process.argv.includes('--kijk')

if (!fs.existsSync(BRON)) {
  console.error(`merk-emmer: ${BRON} ligt er niet - draai eerst poets-woordmerk.py`)
  process.exit(1)
}

const plaat = sharp(BRON)
const maat = await plaat.metadata()
if (maat.width !== PLAAT.b || maat.height !== PLAAT.h) {
  console.error(
    `merk-emmer: de tekening is ${maat.width}x${maat.height} en niet ${PLAAT.b}x${PLAAT.h}. ` +
      'Het vak hieronder is in pixels van DIE plaat gemeten, dus het staat nu ergens anders.'
  )
  process.exit(1)
}

// Op breedte schalen. Het logo is 1420x540 (2,63:1) en het vak 262x109 (2,40:1), dus op
// breedte passen laat onder en boven een paar pixels lucht - dat is goed, want de
// onderregel is handschrift en wil ruimte.
const merk = await sharp(LOGO).resize({ width: VAK.b }).png().toBuffer()
const merkMaat = await sharp(merk).metadata()
if (merkMaat.height > VAK.h) {
  console.error(`merk-emmer: het logo wordt ${merkMaat.height} hoog en het vak is ${VAK.h}`)
  process.exit(1)
}
const top = VAK.y + Math.round((VAK.h - merkMaat.height) / 2)

await sharp(BRON)
  .composite([{ input: merk, left: VAK.x, top, blend: MENG }])
  .jpeg({ quality: 95 })
  .toFile(UIT)

// --- drie eisen, want een plaat waar je niet naar kijkt is een plaat die stil fout staat

// De vergelijking gaat NIET tegen het bronbestand maar tegen dezelfde bron die
// opnieuw als jpeg is weggeschreven, zonder het logo erop. Jpeg hercomprimeert de
// hele plaat, dus "byte voor byte gelijk aan de bron" haalt geen enkele bewerking en
// een losse drempel per pixel (eerst 12) is een gok die je net zo lang bijstelt tot
// hij groen staat. Tegen die ijkplaat moet het BUITEN de aangeraakte blokken wel
// precies gelijk zijn, want jpeg codeert per blok van 8x8 en een blok dat het logo
// niet raakt komt er identiek uit. Alles wat daar toch afwijkt is echte lekkage.
const ijk = await sharp(BRON).jpeg({ quality: 95 }).toBuffer()
const voor = await sharp(ijk).raw().toBuffer({ resolveWithObject: true })
const na = await sharp(UIT).raw().toBuffer({ resolveWithObject: true })
if (voor.info.channels !== na.info.channels) {
  console.error('merk-emmer: kanalen verschillen, dat kan niet')
  process.exit(1)
}

const kan = na.info.channels
const binnen = (x, y) => x >= VAK.x && x < VAK.x + VAK.b && y >= VAK.y && y < VAK.y + VAK.h
// Het vak opgerekt tot hele jpeg-blokken; 16 en niet 8 omdat de kleurkanalen in een
// gewone jpeg half zo fijn worden opgeslagen als de helderheid.
// De 2 px eromheen horen er ook bij: die halve kleurresolutie wordt bij het uitpakken
// weer uitgesmeerd, dus een blok aan de rand kleurt zijn buurpixel een paar waarden
// mee. Gemeten op deze plaat: 45 pixels, alle vier tegen de blokrand aan, grootste
// afwijking 4 van de 255. Een letter die buiten het vak valt ziet er heel anders uit.
const BLOK = 16
const SMEER = 2
const rand = {
  x1: Math.floor(VAK.x / BLOK) * BLOK - SMEER,
  y1: Math.floor(VAK.y / BLOK) * BLOK - SMEER,
  x2: Math.ceil((VAK.x + VAK.b) / BLOK) * BLOK + SMEER,
  y2: Math.ceil((VAK.y + VAK.h) / BLOK) * BLOK + SMEER,
}
const inBlok = (x, y) => x >= rand.x1 && x < rand.x2 && y >= rand.y1 && y < rand.y2

let buitenMis = 0
let blauwIn = 0
let donkerIn = 0
for (let y = 0; y < na.info.height; y++) {
  for (let x = 0; x < na.info.width; x++) {
    const i = (y * na.info.width + x) * kan
    if (binnen(x, y)) {
      const [r, , b] = [na.data[i], na.data[i + 1], na.data[i + 2]]
      if (b - r > 30) blauwIn++
      if (r < 170 && b - r > 30) donkerIn++
    } else if (!inBlok(x, y)) {
      if (
        na.data[i] !== voor.data[i] ||
        na.data[i + 1] !== voor.data[i + 1] ||
        na.data[i + 2] !== voor.data[i + 2]
      ) {
        buitenMis++
      }
    }
  }
}
if (buitenMis > 0) {
  console.error(`merk-emmer: ${buitenMis} pixels buiten het vak zijn veranderd`)
  process.exit(1)
}

// 2. In het vak moet nu merkblauw staan. Zonder deze eis levert een logo dat niet
//    gerenderd is (lege svg, verkeerd pad) een plaat op die er schoon uitziet, en dan
//    staat de emmer weer blanco zonder dat iets klaagt.
const vakVlak = VAK.b * VAK.h
const deel = blauwIn / vakVlak
if (deel < 0.05 || deel > 0.6) {
  console.error(`merk-emmer: ${(deel * 100).toFixed(1)}% van het vak is merkblauw - dat klopt niet`)
  process.exit(1)
}

// 3. En het moet de DONKERE navy van het woordmerk zijn en niet alleen de felblauwe
//    verfstreek-S. Valt de onderregel weg (een font dat niet laadt, een pad dat leeg
//    rendert), dan haalt de plaat eis 2 wel en staat "Schilderwerken" er toch niet.
if (donkerIn / vakVlak < 0.02) {
  console.error('merk-emmer: nauwelijks donkerblauw in het vak - staat de onderregel er wel?')
  process.exit(1)
}

console.log(
  `merk-emmer: logo ${VAK.b}x${merkMaat.height} op (${VAK.x},${top}), ` +
    `${(deel * 100).toFixed(1)}% merkblauw in het vak -> ${path.basename(UIT)}`
)

if (kijk) {
  // handgereedschap: de emmer uitvergroot, om naar te KIJKEN. Een poort is een filter,
  // geen blik - zie de regel daarover in playground/CLAUDE.md.
  const pad = path.join(FOTOS, '_kijk-emmer-merk.png')
  await sharp(UIT)
    .extract({ left: 20, top: 860, width: 340, height: 190 })
    .resize({ width: 1020 })
    .toFile(pad)
  console.log('kijk:', pad)
}
