// Bronpoort - houdt verzonnen beweringen uit klantteksten.
//
// Waarom hij bestaat: op 04-10-2026 stond er op het Klinkhamer-concept in Michael
// zijn eigen ik-vorm dat je "dezelfde dag" antwoord krijgt, dat hij de barbier en de
// marktverkopers persoonlijk kent, en dat het laatste half uur van een hele dag in de
// schaduw met een koud drankje naar je foto's kijken is. Geen van die drie staat in zijn
// materiaal. Ze waren van mij, in zijn stem, en hij wordt er wel op afgerekend.
//
// De poort kent drie merken per regel tekst:
//   eigen     - letterlijk van de klant. Moet bijna woordelijk in het bronkorpus staan.
//   afgeleid  - feiten van de klant, formulering van ons. Elk getal, bedrag, tijdstip
//               en eigennaam erin moet in het korpus voorkomen.
//   ons       - van ons. Mag dan GEEN ik-vorm en GEEN belofte bevatten.
//   feit      - een algemeen controleerbaar feit dat niet over de klant gaat: een
//               filmformaat, een klimaatcijfer, een jaartal uit de geschiedenis. Bron
//               verplicht, ik-vorm verboden. Komt op de nalooplijst, want een feit dat
//               niemand nakijkt is net zo goed een verzinsel.
//   bezoeker  - de ik is de bezoeker, niet de klant: een vraag in de faq, een label in
//               een formulier, een voorgevuld whatsapp-bericht. Geen bewering OVER de
//               klant, dus niets te verantwoorden. Mag geen belofte bevatten.
//   stem      - onze formulering in de ik-vorm van de klant, zonder narekenbare
//               bewering. Mag GEEN getal bevatten, ook niet uitgeschreven: zodra er
//               iets concreets in staat moet het afgeleid worden en dus langs het
//               korpus. Komt altijd op de goedkeuringslijst voor de klant.
//
// Een risicovolle regel zonder merk zakt. Dat is de hele truc: je kan een ik-bewering
// niet meer per ongeluk toevoegen, alleen bewust registreren.
//
// Gebruik (hang hem in het buildscript, niet ernaast):
//   import { bronpoort } from '../.gereedschap/bronpoort.mjs'
//   bronpoort({ korpusMap: 'bron/zijn-tekst', beweringen, taal: 'en' })   // gooit = build stopt
//
// `beweringen` is een lijst { sleutel, tekst, merk, bron }. `bron` is vrije tekst:
// welk bestand of welke post het vandaan komt. Zie klinkhamer-tours/tekst/bron.mjs.

import fs from 'fs'
import path from 'path'

// ---------------------------------------------------------------- risicopatronen
// Een regel is risicovol als hij in de ik-vorm van de klant staat of iets belooft.
// Alleen Engels en Nederlands: de vertalingen erven het merk van hun Engelse sleutel,
// dus die hoeven hier niet door.
const IK_VORM = [
  /\bI\b/, /\bI'(m|ve|ll|d)\b/, /\bmy\b/i, /\bme\b/i, /\bmyself\b/i,
  /\bik\b/i, /\bmijn\b/i, /\bmij\b/i, /\bme\b/i,
]

const BELOFTE = [
  /\bsame day\b/i, /\bwithin \d+\s*(hour|day|minute|uur|dag|minut)/i,
  /\bguarantee/i, /\bgegarandeerd/i, /\bgarantie/i,
  /\balways\b/i, /\baltijd\b/i, /\bnever\b/i, /\bnooit\b/i,
  /\bevery (time|day)\b/i, /\belke (keer|dag)\b/i,
  /\bpersonally\b/i, /\bpersoonlijk\b/i,
  /\bdezelfde dag\b/i, /\bbinnen \d+/i,
  /\bwe know\b/i, /\bI know\b/, /\bik ken\b/i,
]

// Woorden die niets onderscheidend zeggen. Een getal of eigennaam is wel onderscheidend.
const STOPWOORDEN = new Set(
  (
    'a an the and or but if of to in on at for with from by as is are was were be been being ' +
    'this that these those it its he she they we you your my our их his her them us me i do does ' +
    'did have has had will would can could shall should may might must not no yes so than then ' +
    'there here what which who whom whose when where why how all any both each few more most ' +
    'other some such only own same too very just about into over under again once up down out off ' +
    'de het een en of maar als van tot in op aan voor met uit door bij is zijn was waren wordt ' +
    'worden dit dat die deze daar hier wat wie waar waarom hoe alle elk sommige ander meer meest ' +
    'niet geen ja nee dan toen er ook nog al wel om te je jij jouw mijn ik we wij ons u uw hij ' +
    'zij ze hem haar hun kan kunnen zal zullen moet moeten mag mogen heeft hebben had hadden'
  ).split(/\s+/)
)

const normaliseer = (s) =>
  s
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    // 8am en 14h los trekken, anders vindt \b8\b zijn eigen "8am-11am" niet terug.
    .replace(/(\d)(\p{L})/gu, '$1 $2')
    .replace(/(\p{L})(\d)/gu, '$1 $2')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()

const woorden = (s) =>
  normaliseer(s)
    .split(' ')
    .filter((w) => w.length > 2 && !STOPWOORDEN.has(w))

// Getallen, bedragen en tijdstippen. Dit is waar een verzinsel het hardst opvalt:
// "the last half hour", "within 24 hours", "USD 75", "08:00". Uitgeschreven telt mee,
// want "de laatste twaalf jaar" is net zo goed een cijfer als "12".
const NUMMERWOORDEN = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, twenty: 20, thirty: 30,
  forty: 40, fifty: 50, hundred: 100, thousand: 1000,
  // 'een' staat er bewust niet in: dat is ook het Nederlandse lidwoord.
  twee: 2, drie: 3, vier: 4, vijf: 5, zes: 6, zeven: 7, acht: 8, negen: 9, tien: 10,
  elf: 11, twaalf: 12, dertien: 13, veertien: 14, vijftien: 15, twintig: 20, dertig: 30,
  veertig: 40, vijftig: 50, honderd: 100, duizend: 1000,
  vijfentwintig: 25, zestig: 60, zeventig: 70, tachtig: 80, negentig: 90,
}

const TIENTALLEN = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 }
const EENHEDEN = { one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9 }

function CIJFERS(s) {
  // Namen met een cijfer erin zijn geen bewering: S-21, Tri-X, 35mm. Eerst eruit.
  let ruw = s.replace(/\b[A-Za-z]+-\d+\b/g, ' ').replace(/\b\d+\s?mm\b/gi, ' ')
  // Tijden: alleen het uur telt, en de minuten alleen als ze niet 00 zijn.
  ruw = ruw.replace(/\b(\d{1,2})[:.](\d{2})\b/g, (_, u, m) => (Number(m) ? `${Number(u)} ${Number(m)}` : `${Number(u)}`))
  const plat = normaliseer(ruw)

  const uit = [...plat.matchAll(/\b\d+\b/g)].map((m) => String(Number(m[0])))
  // Samengestelde telwoorden eerst: "eighty eight" is 88 en niet 80 plus 8.
  const samen = new Set()
  for (const [t, tv] of Object.entries(TIENTALLEN)) {
    for (const [e, ev] of Object.entries(EENHEDEN)) {
      if (new RegExp(`\\b${t}[ -]${e}\\b`).test(plat)) {
        uit.push(String(tv + ev))
        samen.add(t)
        samen.add(e)
      }
    }
  }
  for (const [w, n] of Object.entries(NUMMERWOORDEN)) {
    if (samen.has(w)) continue
    if (new RegExp(`\\b${w}\\b`).test(plat)) uit.push(String(n))
  }
  // Nul is nooit een bewering.
  return [...new Set(uit)].filter((c) => c !== '0')
}

// Een cijfer is verantwoord als het als cijfer OF als woord in het korpus staat.
function cijferInKorpus(c, korpusPlat) {
  if (new RegExp(`\\b${c}\\b`).test(korpusPlat)) return true
  // Prefix, want "duizenden lichtjes" hoort bij duizend.
  for (const [w, n] of Object.entries(NUMMERWOORDEN)) {
    if (String(n) === c && new RegExp(`\\b${w}`).test(korpusPlat)) return true
  }
  return false
}

function risico(tekst) {
  const r = []
  if (IK_VORM.some((p) => p.test(tekst))) r.push('ik-vorm')
  if (BELOFTE.some((p) => p.test(tekst))) r.push('belofte')
  // Een getal is de derde categorie en de gemeenste. Hij staat vaak in een zin zonder
  // ik-vorm en zonder belofte - "elf dagen en twaalf nachten" - en is precies wat een
  // klant als eerste naleest. Dus: elk getal in klanttekst moet verantwoord zijn.
  if (CIJFERS(tekst).length) r.push('getal')
  return r
}

// Een korpusbestand begint meestal met een kopje van ons: waar de tekst vandaan
// komt, wanneer het binnenkwam, waar op te letten. Dat kopje is ONZE tekst en hij
// hoorde nooit mee te tellen als woorden van de klant. Gebeurde op 09-10-2026 bij
// cdlf: in het kopje schreef ik "geen bevestiging van de Belastingdienst", en
// daarmee was precies dat woord in onze copy ineens "verantwoord" door het korpus.
// Een poort die zichzelf de hand boven het hoofd houdt is geen poort.
//
// Afspraak: staat er een regel die alleen uit --- bestaat, dan is alles erboven
// van ons en telt alleen wat eronder staat. Geen streep = het hele bestand, zodat
// een bestaand korpus zonder kopje blijft werken.
function zonderKopje(tekst) {
  const m = /^-{3,}[ \t]*$/m.exec(tekst)
  return m ? tekst.slice(m.index + m[0].length) : tekst
}

function leesKorpus(korpusMap) {
  const abs = path.resolve(korpusMap)
  if (!fs.existsSync(abs)) throw new Error(`bronpoort: korpusmap ${abs} bestaat niet`)
  const bestanden = fs.readdirSync(abs).filter((f) => f.endsWith('.txt'))
  if (!bestanden.length) throw new Error(`bronpoort: geen .txt in ${abs}. Eerst het bronkorpus opslaan.`)
  const ruw = bestanden
    .map((f) => zonderKopje(fs.readFileSync(path.join(abs, f), 'utf8')))
    .join('\n')
  // Per zin, zodat een getal niet "verantwoord" is omdat het elders op de pagina in een
  // keuzelijstje stond. Een korpus van 100k tekens bevat vrijwel elk klein getal ergens.
  const zinnen = ruw
    .split(/(?<=[.!?:;])\s+|\n+/)
    .map(normaliseer)
    .filter((z) => z.length > 8)
  return { ruw, plat: normaliseer(ruw), zinnen, bestanden }
}

/**
 * @param {object} o
 * @param {string} o.korpusMap   map met .txt van de klant zijn eigen woorden
 * @param {Array}  o.beweringen  [{ sleutel, tekst, merk, bron }]
 * @param {number} [o.dekkingAfgeleid=0.5] aandeel onderscheidende woorden dat in het korpus moet staan
 * @returns {{ gekeurd: number, nalopen: Array }}
 */
export function bronpoort({ korpusMap, beweringen, dekkingAfgeleid = 0.5 }) {
  const korpus = leesKorpus(korpusMap)
  const fouten = []
  const nalopen = []

  for (const b of beweringen) {
    const { sleutel, tekst, merk, bron } = b
    const risicos = risico(tekst)

    if (!merk) {
      if (risicos.length) {
        fouten.push(
          `${sleutel}: ${risicos.join(' + ')} zonder merk. Zet eigen/afgeleid/ons in bron.mjs.\n    "${tekst}"`
        )
      }
      continue
    }

    if (!['eigen', 'afgeleid', 'ons', 'bezoeker', 'stem', 'feit'].includes(merk)) {
      fouten.push(`${sleutel}: onbekend merk "${merk}"`)
      continue
    }

    // Van ons: onze eigen woorden, geen bewering over de klant. Een ik-vorm of een
    // belofte kan dat nooit zijn. Een getal wel - "acht tours op deze site", "twee
    // vingers op een aanraakscherm" - maar dan moet je er bewust voor kiezen, en het
    // komt op de nalooplijst zodat niemand het ongezien laat staan.
    if (merk === 'ons') {
      if (risicos.includes('ik-vorm') || risicos.includes('belofte')) {
        fouten.push(
          `${sleutel}: gemerkt als ons, maar bevat ${risicos.join(' + ')}. ` +
            `Van ons mag geen klantbewering zijn.\n    "${tekst}"`
        )
      } else if (risicos.includes('getal')) {
        nalopen.push({ sleutel, tekst, bron: bron || 'ons eigen getal', dekking: null, onbekend: [] })
      }
      continue
    }

    // Bezoekersstem: de ik is de lezer. Een belofte hoort daar niet in, want die gaat
    // altijd over de klant ("je krijgt binnen een dag antwoord").
    if (merk === 'bezoeker') {
      if (risicos.includes('belofte')) {
        fouten.push(
          `${sleutel}: gemerkt als bezoekersstem, maar bevat een belofte over de klant.\n    "${tekst}"`
        )
      }
      continue
    }

    // Algemeen feit, niet over de klant. Mag een getal bevatten, maar niet zijn ik-vorm
    // en niet zonder bron.
    if (merk === 'feit') {
      if (risicos.includes('ik-vorm') || risicos.includes('belofte')) {
        fouten.push(
          `${sleutel}: gemerkt als algemeen feit, maar staat in de ik-vorm van de klant of belooft iets.\n    "${tekst}"`
        )
      } else if (!bron) {
        fouten.push(`${sleutel}: merk feit zonder bron. Noem waar het feit vandaan komt.`)
      } else {
        nalopen.push({ sleutel, tekst, bron, dekking: null, onbekend: [] })
      }
      continue
    }

    // Onze woorden die als zijn tekst lezen, met of zonder ik-vorm, zonder narekenbare
    // bewering. Mag, maar nooit met een getal erin en nooit met een belofte, en hij moet
    // het zelf lezen. Een regel die deels woordelijk van hem komt en deels van ons hoort
    // hier ook: afgeleid toetst alleen de dekking en laat zo iets van ons stil passeren.
    if (merk === 'stem') {
      const cijfers = CIJFERS(tekst)
      if (risicos.includes('belofte')) {
        fouten.push(`${sleutel}: gemerkt als stem, maar bevat een belofte.\n    "${tekst}"`)
      } else if (cijfers.length) {
        fouten.push(
          `${sleutel}: gemerkt als stem, maar noemt ${cijfers.join(', ')}. ` +
            `Iets concreets hoort afgeleid te zijn, met een bron.\n    "${tekst}"`
        )
      } else {
        nalopen.push({ sleutel, tekst, bron: bron || 'onze formulering', dekking: null, onbekend: [] })
      }
      continue
    }

    if ((merk === 'eigen' || merk === 'afgeleid') && !bron) {
      fouten.push(`${sleutel}: merk ${merk} zonder bron. Noem het bestand of de post.`)
      continue
    }

    if (merk === 'eigen') {
      // Letterlijk citaat: moet als aaneengesloten stuk in het korpus staan.
      const kern = normaliseer(tekst)
      const stuk = kern.length > 120 ? kern.slice(0, 120) : kern
      if (!korpus.plat.includes(stuk)) {
        fouten.push(
          `${sleutel}: gemerkt als letterlijk van de klant, maar staat niet in het korpus.\n    "${tekst}"`
        )
      }
      continue
    }

    // afgeleid: elk getal moet in het korpus staan, en de onderscheidende woorden
    // moeten grotendeels herkenbaar zijn.
    const w = woorden(tekst)

    // Elk getal moet in het korpus staan IN EEN ZIN die ook een van de kernwoorden van
    // deze regel bevat. Anders is "5 tot 19 dagen" verantwoord omdat er elders op de
    // pagina een keuzelijstje met 19 in stond. Heeft de regel geen kernwoorden (een
    // kaal tijdvak als "07:00 - 11:00"), dan valt hij terug op het hele korpus.
    // Korte regels als "5 tot 12 dagen" houden na het wegstrepen van stopwoorden maar
    // een woord over. Dan telt elk woord van drie letters mee, zodat "dagen" alsnog
    // het onderwerp is waarop de zin moet matchen. Blijft er niets over (een kaal
    // tijdvak als "07:00 - 11:00"), dan is het hele korpus de toets.
    const wMatch = w.length >= 3 ? w : normaliseer(tekst).split(' ').filter((x) => x.length > 2 && !/^\d+$/.test(x))
    const missendeCijfers = CIJFERS(tekst).filter((c) => {
      if (!cijferInKorpus(c, korpus.plat)) return true
      if (!wMatch.length) return false
      return !korpus.zinnen.some((z) => cijferInKorpus(c, z) && wMatch.some((x) => new RegExp(`\\b${x}`).test(z)))
    })
    if (missendeCijfers.length) {
      fouten.push(
        `${sleutel}: getal ${missendeCijfers.join(', ')} staat niet in een zin van de klant ` +
          `die ook over dit onderwerp gaat.\n    "${tekst}"`
      )
      continue
    }

    if (w.length) {
      const gevonden = w.filter((x) => new RegExp(`\\b${x}`).test(korpus.plat))
      const dekking = gevonden.length / w.length
      if (dekking < dekkingAfgeleid) {
        nalopen.push({
          sleutel,
          tekst,
          bron,
          dekking: Math.round(dekking * 100),
          onbekend: w.filter((x) => !new RegExp(`\\b${x}`).test(korpus.plat)),
        })
      }
    }
  }

  if (fouten.length) {
    throw new Error(
      `\nBRONPOORT: ${fouten.length} bewering(en) niet te verantwoorden\n\n` +
        fouten.map((f) => `  - ${f}`).join('\n\n') +
        `\n\nKorpus: ${korpus.bestanden.length} bestanden, ${korpus.plat.length} tekens.\n` +
        `Een bewering in de ik-vorm van de klant hoort of van hem te komen, of niet op de site.\n`
    )
  }

  return { gekeurd: beweringen.length, nalopen }
}

/** Alleen de risicoscan, zonder te gooien. Om te zien wat er geregistreerd moet worden. */
export function risicoscan(beweringen) {
  return beweringen
    .map((b) => ({ ...b, risico: risico(b.tekst) }))
    .filter((b) => b.risico.length)
}

// Losse controle: node ../.gereedschap/bronpoort.mjs <korpusmap> <bestand.json>
if (process.argv[1] && import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const [korpusMap, lijst] = process.argv.slice(2)
  if (!korpusMap || !lijst) {
    console.error('gebruik: node bronpoort.mjs <korpusmap> <beweringen.json>')
    process.exit(2)
  }
  try {
    const { gekeurd, nalopen } = bronpoort({
      korpusMap,
      beweringen: JSON.parse(fs.readFileSync(lijst, 'utf8')),
    })
    console.log(`bronpoort: ${gekeurd} beweringen ok, ${nalopen.length} om na te lopen`)
  } catch (e) {
    console.error(e.message)
    process.exit(1)
  }
}
