// Bouwt de site naar dist/. Beide poorten hangen IN dit script, niet ernaast:
// zakt de copy, dan komt er geen pagina uit.
//
//   node fotos.py && node build.mjs
//
// De stylesheet krijgt een hash in zijn naam, zodat een browser nieuwe html nooit
// met een oude stylesheet kan paren (zie playground/CLAUDE.md).

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
// De twee poorten stonden in playground/.gereedschap/ en zijn bij de verhuizing
// (26-10-2026) meegekomen naar tools/poorten/. Een absoluut of omhoog-wijzend pad naar
// de gereedschapsmap van een andere repo werkt hier op deze machine prima en breekt
// elke verse kloon - zelfde val als de MAPBOX_TOKEN bij dagmar-voss. Dit is dus een
// kopie en geen deelbestand: wijkt er iets af in de playground-versie, dan is dat
// vanaf nu een bewuste keuze en geen achterstand.
import { aipoort, platteTekst } from './tools/poorten/aipoort.mjs'
import { bronpoort } from './tools/poorten/bronpoort.mjs'
import { BEDRIJF, GBP, FORM_PAD, INDEXEERBAAR_PADEN, HULP_PADEN, PRIJZEN, SOORTEN, VERF, TEKST, MERKEN, NAP_MERKEN, AI_TOEGESTAAN } from './inhoud.mjs'
// De mailhandtekening op /handtekening/. Een hulppagina met zijn eigen opmaak en zijn
// eigen ai-poort; hij deelt alleen de gegevens uit inhoud.mjs met de site.
import { paginaHandtekening } from './handtekening.mjs'

const HIER = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(HIER, 'dist')
const PUBLIC = path.join(HIER, 'public')
const T = TEKST.nl

/**
 * EEN schakelaar voor alles wat met indexeren te maken heeft: robots.txt, de
 * noindex-meta en de sitemap. Niet drie.
 *
 * Dit is de regel uit playground/CLAUDE.md, en hij staat daar omdat het bij
 * jh-schilderwerken fout ging: robots.txt lag er als los bestand met de livegang-versie
 * als commentaar erboven, terwijl de noindex uit een vlag kwam. Twee schakelaars lopen
 * gegarandeerd uit de pas, en dan haalt de vlag de noindex uit de pagina's terwijl
 * robots.txt de hele site blijft verbieden - en dan ziet niemand die noindex ooit.
 *
 * `--prod` (wat `pnpm build` doet) is live: indexeerbaar, met sitemap.
 * Zonder vlag (wat `pnpm build:dev` doet, voor `wrangler dev`) staat alles dicht, zodat
 * een lokale bouw die per ongeluk wordt uitgerold geen tweede kopie in Google zet.
 */
const LIVE = process.argv.includes('--prod')

/**
 * Een bedrag in euro's, Nederlands, met centen. De centen stonden tot 25-10-2026 als
 * ",00" hardgecodeerd achter elke `${PRIJZEN.x}` in de opmaak, en dat ging goed zolang
 * alle drie de bedragen hele getallen waren. Op 25-10-2026 werd de 16 een 17,50 en dan
 * levert diezelfde opmaak "17.5,00" op: een bedrag dat door geen enkele poort wordt
 * gezien, want het is geen overloop, geen ai-isme en geen onjuiste bewering. Vandaar
 * een functie, en niet drie plekken waar je eraan moet denken.
 */
const eur = (n) => n.toFixed(2).replace('.', ',')
/** Hetzelfde bedrag zoals het in een ZIN staat: "11" en "17,50", zonder lege centen. */
const eurTekst = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2).replace('.', ','))

// Na hoeveel pixels scrollen de zwevende knoppenbalk op de telefoon omhoog komt.
// Gemeten bij mts-vloerverwarming (meet-mts.mjs): tussen 300 en 320 px. proef.mjs
// toetst hierop, dus dit getal staat op een plek.
const ZWEEF_NA = 310

// ----------------------------------------------------------------- 1. poorten
console.log('ai-poort')
aipoort({ talen: TEKST, toegestaan: AI_TOEGESTAAN })

console.log('\nbronpoort')
const PLAT = platteTekst(TEKST)
const beweringen = PLAT.map(([sleutel, tekst]) => ({
  sleutel,
  tekst,
  ...(MERKEN[sleutel] || {}),
}))
// Een merk dat nergens meer op slaat moet zakken, net als een uitzondering in de
// ai-poort. Gevonden op 25-10-2026: `nl.verf.keus` stond er nog terwijl die regel op
// aanwijzing van Armando van de pagina was. Zo'n weesregel is niet onschuldig - hij
// zegt dat er een bron is voor een zin die niemand meer kan lezen, en de volgende die
// hier een sleutel hergebruikt erft stilzwijgend die bron.
{
  const bestaat = new Set(PLAT.map(([s]) => s))
  const wees = Object.keys(MERKEN).filter((s) => !bestaat.has(s))
  if (wees.length) {
    throw new Error(`build: MERKEN noemt ${wees.length} sleutel(s) die niet meer bestaan: ${wees.join(', ')}`)
  }
}
// De losse registergegevens, prijzen en productnamen gaan er ook doorheen. Ze staan
// niet in TEKST omdat ze waarden zijn en geen zinnen, maar ze komen wel op de pagina
// terecht - en dat is precies waar een typefout in een KVK-nummer of in "Alpha Rezisto
// Anti Marks" ongezien blijft staan.
const NAP_GROEPEN = { bedrijf: BEDRIJF, prijzen: PRIJZEN, soorten: SOORTEN, verf: VERF }
for (const [sleutel, m] of Object.entries(NAP_MERKEN)) {
  const [groep, veld] = sleutel.split('.')
  const bron = NAP_GROEPEN[groep]
  if (!bron) throw new Error(`build: NAP_MERKEN noemt groep "${groep}", die bestaat niet`)
  if (bron[veld] === undefined) throw new Error(`build: NAP_MERKEN noemt ${sleutel}, die bestaat niet`)
  // Een prijs gaat als NEDERLANDS bedrag door de poort en niet als javascript-getal.
  // `String(17.5)` is "17.5", en daar leest de bronpoort "17" en "5" in; die 5 staat
  // nergens in zijn korpus, dus de build zakte op een getal dat niemand zo opschrijft.
  // Op de pagina staat 17,50 en dat is ook wat er getoetst moet worden.
  const tekst = groep === 'prijzen' ? eurTekst(bron[veld]) : String(bron[veld])
  beweringen.push({ sleutel, tekst, ...m })
}
const { gekeurd, nalopen } = bronpoort({ korpusMap: path.join(HIER, 'bron/zijn-tekst'), beweringen })

// Doorgegeven tekst moet Pascal ALTIJD zelf nalezen, ook als de bronpoort er geen
// probleem in ziet. Die poort zet een `afgeleid`-regel alleen op de lijst als de
// dekking onder de helft blijft, en dat zegt alleen iets over woorden, niet over wie
// het gezegd heeft. Armando spreekt hem, dus het is geen gok; het is ook niet zijn
// eigen formulering, en dat verschil hoort zichtbaar te blijven tot hij het bevestigt.
const doorgegeven = beweringen.filter((b) => b.bron && b.bron.includes('doorgegeven via'))
for (const b of doorgegeven) {
  if (!nalopen.some((n) => n.sleutel === b.sleutel)) {
    nalopen.push({ sleutel: b.sleutel, tekst: b.tekst, bron: b.bron, dekking: null, onbekend: [] })
  }
}
if (!doorgegeven.length) {
  throw new Error('build: geen doorgegeven beweringen meer. Haal ARM uit inhoud.mjs en deze regel hier.')
}
console.log(
  `bronpoort: ${gekeurd} beweringen gekeurd, ${nalopen.length} voor de nalooplijst ` +
  `(${doorgegeven.length} doorgegeven via Armando)`
)

// ----------------------------------------------------------------- 2. foto's
const manifest = JSON.parse(fs.readFileSync(path.join(PUBLIC, 'f/manifest.json'), 'utf8'))

/** <img> met srcset uit het manifest. `sizes` is verplicht: zonder gaat de browser uit van 100vw. */
function img(naam, alt, sizes, { klasse = '', laden = 'lazy', prio = false } = {}) {
  const maten = manifest[naam]
  if (!maten || !maten.length) throw new Error(`build: foto ${naam} staat niet in het manifest`)
  const grootste = maten[maten.length - 1]
  // Absolute paden: /werkwijze/ ligt een map diep, en `f/...` wijst daar naar
  // /werkwijze/f/... Dat is ook de reden dat de meetscripts een kleine server
  // starten in plaats van de html over file:// te openen (zie dienen.mjs).
  const srcset = maten.map((m) => `/${m.bestand} ${m.w}w`).join(', ')
  return (
    `<img src="/${grootste.bestand}" srcset="${srcset}" sizes="${sizes}" ` +
    `width="${grootste.w}" height="${grootste.h}" alt="${esc(alt)}"` +
    (klasse ? ` class="${klasse}"` : '') +
    ` loading="${laden}" decoding="async"${prio ? ' fetchpriority="high"' : ''}>`
  )
}

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

// ----------------------------------------------------------------- 3. css
const CSS = `
:root{
  --navy:#0B1E8A; --blauw:#2D6BFF; --inkt:#1F2937; --mist:#F3F4F6; --wit:#fff;
  --nacht:#0A1020; --nacht-2:#111A33; --lijn:#E3E6EC; --grijs:#6B7280;
  --kop:'Barlow Condensed',Impact,'Haettenschweiler','Arial Narrow',sans-serif;
  --body:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;
  --breed:1240px; --rand:clamp(16px,4vw,40px);
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;scroll-behavior:smooth}
body{margin:0;font-family:var(--body);color:var(--inkt);background:var(--wit);
  font-size:16px;line-height:1.65;overflow-x:hidden}
img{max-width:100%;height:auto;display:block}
a{color:inherit}
/* De smalle kopletter (Barlow Condensed) staat ALLEEN in kapitalen op displaymaat.
   Klein is hij in kapitalen slecht leesbaar - de letters zijn smal, even hoog en
   missen de stok-en-staart waar een lezer woorden aan herkent (feedback Armando
   20-10-2026 over "WARM TAUPE" en de kopjes van de vijf redenen). De referentiesite
   doet het net zo: grote koppen in kapitaal, kaartkopjes in de gewone letter.
   Daarom: h1 en h2 in kapitaal, h3 in de bodyletter met gewone kapitalisatie.
   controleer.mjs rekent dit na, zodat het niet stil terugkomt. */
h1,h2{font-family:var(--kop);text-transform:uppercase;line-height:.95;
  letter-spacing:-.01em;margin:0;font-weight:800;color:var(--navy)}
h3{font-family:var(--body);text-transform:none;line-height:1.25;letter-spacing:0;
  margin:0;font-weight:700;color:var(--navy)}
p{margin:0 0 1em}
.wrap{max-width:var(--breed);margin:0 auto;padding-inline:var(--rand)}
.boven{font-family:var(--body);font-size:12px;font-weight:700;letter-spacing:.16em;
  text-transform:uppercase;color:var(--blauw);margin:0 0 14px}
.op-nacht .boven{color:#7FA6FF}

/* knoppen: op een telefoon mag een label over twee regels, anders bepaalt de
   knop de breedte van de pagina (zie playground/CLAUDE.md, meet op 360) */
.knop{display:inline-flex;align-items:center;justify-content:center;gap:.5em;
  font-weight:700;font-size:15px;text-decoration:none;padding:14px 26px;border:0;
  border-radius:4px;cursor:pointer;transition:background .15s,color .15s;
  white-space:normal;overflow-wrap:anywhere;text-align:center;font-family:var(--body)}
.knop-p{background:var(--blauw);color:#fff}
.knop-p:hover{background:var(--navy)}
.knop-d{background:var(--navy);color:#fff}
.knop-d:hover{background:#07145D}
.knop-l{background:#fff;color:var(--navy)}
.knop-l:hover{background:var(--mist)}
.knop-o{background:transparent;color:#fff;box-shadow:inset 0 0 0 1.5px rgba(255,255,255,.45)}
.knop-o:hover{background:rgba(255,255,255,.12)}

/* ---------- header ----------
   De smalle donkere topbalk erboven is er op 20-10-2026 uit (doorgestreept door
   Armando). Hij droeg niets eigens: beide regels staan elders op de pagina. */
.kop-site{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid var(--lijn)}
/* De kop blijft boven in beeld staan, dus een sprong naar een anker legt de bovenkant
   van dat blok eronder: de kop "Vraag vrijblijvend een prijs op" viel half weg achter
   de balk. Gemeten: 67 px hoog op een telefoon, 81 op een laptop. Sinds het
   offerteblok op elke pagina staat (20-10-2026) wordt er veel vaker binnen dezelfde
   pagina gesprongen, dus dit telt nu bij elke knop. */
[id]{scroll-margin-top:72px}
@media(min-width:721px){[id]{scroll-margin-top:88px}}
.kop-site .wrap{display:flex;align-items:center;gap:18px;min-height:76px;flex-wrap:wrap}
.merk{display:block;flex:0 0 auto}
.merk img{width:clamp(150px,20vw,210px)}
.hoofdnav{display:flex;gap:clamp(12px,1.6vw,26px);margin-left:auto;flex-wrap:wrap}
.hoofdnav a{font-size:14px;font-weight:600;text-decoration:none;color:var(--inkt);
  padding:6px 0;border-bottom:2px solid transparent}
.hoofdnav a:hover{color:var(--navy);border-bottom-color:var(--blauw)}
.kop-site .knop{padding:12px 20px;font-size:14px}

/* ---------- burger + lade (telefoonmenu) ----------
   De referentiesite heeft op een telefoon een heel scherm met genummerde regels en
   een uitklapbaar prijsblok. Hier stond eerst niets: de nav verdween onder 720px en
   alleen de offerteknop bleef. */
.burger{display:none;width:46px;height:46px;flex:0 0 auto;margin-left:auto;padding:0;
  border:1px solid var(--lijn);border-radius:4px;background:#fff;color:var(--navy);
  cursor:pointer;align-items:center;justify-content:center}
.burger:hover{background:var(--mist)}
.burger svg{display:block}
.lade{position:fixed;inset:0;z-index:95;background:#fff;color:var(--inkt);
  overflow-y:auto;overscroll-behavior:contain;
  opacity:0;visibility:hidden;transform:translateY(-10px);
  transition:opacity .18s ease,transform .18s ease,visibility .18s}
.lade.aan{opacity:1;visibility:visible;transform:none}
@media (prefers-reduced-motion:reduce){.lade{transition:none}}
.lade-in{min-height:100%;display:flex;flex-direction:column;
  padding:16px var(--rand) calc(24px + env(safe-area-inset-bottom))}
.lade-top{display:flex;align-items:center;justify-content:space-between;gap:14px;
  padding-bottom:14px;border-bottom:1px solid var(--lijn)}
.lade-top img{width:min(190px,52vw)}
.lade-sluit{width:46px;height:46px;flex:0 0 auto;padding:0;border:1px solid var(--lijn);
  border-radius:4px;background:#fff;color:var(--navy);cursor:pointer;
  display:inline-flex;align-items:center;justify-content:center}
.lade-sluit:hover{background:var(--navy);border-color:var(--navy);color:#fff}
.lade-nav{flex:1;padding:6px 0 10px}
.lade-item{border-bottom:1px solid var(--lijn)}
.lade-link{display:flex;align-items:center;gap:14px;width:100%;padding:15px 2px;
  background:none;border:0;cursor:pointer;text-align:left;color:var(--inkt);
  text-decoration:none;font-family:var(--body)}
.lade-n{flex:0 0 auto;font-size:12px;font-weight:700;letter-spacing:.12em;color:var(--grijs)}
.lade-w{flex:1;font-family:var(--kop);font-weight:800;text-transform:uppercase;
  font-size:clamp(26px,7vw,34px);line-height:.95;color:var(--navy)}
/* Het plusje is een svg en geen letter: een gedraaide + uit de smalle kopletter
   wordt een dikke ster in plaats van een kruisje. */
.lade-plus{flex:0 0 auto;display:inline-flex;color:var(--blauw);transition:transform .15s}
.lade-item.open .lade-plus{transform:rotate(45deg)}
.lade-sub{display:none;padding:0 0 16px 30px}
.lade-item.open .lade-sub{display:block}
.lade-pak{display:flex;align-items:center;justify-content:space-between;gap:12px;
  padding:11px 13px;margin-bottom:8px;border:1.5px solid var(--lijn);border-radius:5px;
  text-decoration:none}
.lade-pak b{display:block;font-size:14.5px;color:var(--navy);line-height:1.3}
.lade-pak small{display:block;font-size:12px;color:var(--grijs);line-height:1.4}
.lade-pak .prijs{font-family:var(--kop);font-size:23px;font-weight:800;color:var(--navy);
  line-height:1;white-space:nowrap;text-align:right}
.lade-pak .prijs i{display:block;font-family:var(--body);font-size:12px;font-style:normal;
  font-weight:700;letter-spacing:.09em;text-transform:uppercase;color:var(--grijs)}
.lade-voet{display:grid;gap:12px;padding-top:16px;border-top:1px solid var(--lijn)}
.lade-voet .knop{width:100%}
.lade-tel{text-align:center;font-weight:700;font-size:15px;color:var(--navy);text-decoration:none}
body.op-slot{overflow:hidden}

/* ---------- zwevende bel- en appknoppen ----------
   Opbouw van winterswijkvakantiehuis.nl, nagemeten met meet-winterswijk.mjs (telefoon)
   en meet-winterswijk-desk.mjs (laptop). Twee gelijke pillen van 48 px hoog, 12 px
   ertussen, label naast het icoon en geen donkere balk eromheen. Hun belknop is oranje;
   hier is dat zijn blauw (feedback Armando 20-10-2026).

   Zij zetten ze op BEIDE maten neer en wisselen alleen van vorm: op een laptop twee
   pillen onder elkaar rechtsonder, 24 px van de randen, zo breed als hun label; op een
   telefoon naast elkaar over de volle breedte, 16 px van de randen. Dat is hier nu ook
   zo (Armando 20-10-2026: "whatsapp / bel moet ook op desktop zijn zoals bij
   winterswijk") - tot dan stonden ze alleen onder 720 px.

   Komt omhoog zodra de hero voorbij is; hij staat altijd in de dom en gaat met
   visibility weg, zodat hij ook voor een schermlezer verdwijnt als hij niet zichtbaar
   is. De verschuiving is horizontaal op een laptop (hij glijdt de rechterrand uit) en
   verticaal op een telefoon, want een kolom die van onderen opkomt duikt daar achter
   de rand van het scherm. */
.zwevend{position:fixed;right:24px;bottom:24px;z-index:60;display:flex;gap:12px;
  flex-direction:column;align-items:flex-end;
  transform:translateX(calc(100% + 34px));visibility:hidden;
  transition:transform .22s ease,visibility .22s,opacity .18s ease}
.zwevend.aan{transform:none;visibility:visible}
/* Weg zonder te verschuiven: zodra hij over een knop valt waar de bezoeker op moet
   tikken (Terug / Toon richtprijs, de knoppen onder het formulier) of zodra er in een
   veld getypt wordt. Armando, 20-10-2026: "staat bellen en whatsapp op de knoppen waar
   je op moet drukken om terug of verder te gaan". Met het toetsenbord open kruipt een
   position:fixed balk op iOS mee omhoog en staat hij precies over die knoppen.
   Bewust GEEN transform hier: de balk moet op zijn plek blijven staan, anders meet de
   botsingstest een verschoven balk, ziet geen botsing meer en knippert hij aan en uit. */
.zwevend.aan.weg{visibility:hidden;opacity:0;pointer-events:none}
@media (prefers-reduced-motion:reduce){.zwevend{transition:none}}
.zwevend a{flex:0 0 auto;min-width:0;height:48px;padding:0 20px;display:inline-flex;
  align-items:center;justify-content:center;gap:8px;border-radius:999px;color:#fff;
  text-decoration:none;
  font-size:16px;font-weight:600;line-height:1;box-shadow:0 10px 26px rgba(10,16,32,.3)}
.zwevend svg{flex:0 0 auto}
.zwevend-wa{background:#20B85A}
.zwevend-wa:hover{background:#199A4B}
.zwevend-bel{background:var(--blauw)}
.zwevend-bel:hover{background:var(--navy)}

/* ---------- hero ---------- */
.hero{position:relative;background:var(--nacht);color:#fff;overflow:hidden}
.hero-foto{position:absolute;inset:0}
.hero-foto img{width:100%;height:100%;object-fit:cover;opacity:.72}
.hero-foto::after{content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,rgba(10,16,32,.94) 0%,rgba(10,16,32,.78) 42%,rgba(10,16,32,.30) 100%)}
.hero .wrap{position:relative;display:grid;gap:clamp(28px,4vw,56px);
  grid-template-columns:minmax(0,1.03fr) minmax(0,.97fr);align-items:center;
  padding-block:clamp(44px,6vw,86px)}
.hero h1{color:#fff;font-size:clamp(42px,7.4vw,88px)}
.hero h1 span{display:block;color:var(--blauw)}
.hero-lead{font-size:clamp(16px,1.7vw,18.5px);color:#D3DAEA;max-width:34em;margin-top:20px}
.vinkjes{list-style:none;margin:26px 0 30px;padding:0;display:grid;gap:11px}
.vinkjes li{display:grid;grid-template-columns:22px 1fr;gap:11px;align-items:start;
  font-size:15.5px;font-weight:500;color:#EAEEF7}
.vinkjes svg{margin-top:3px}
.hero-knoppen{display:flex;gap:12px;flex-wrap:wrap}
.hero-onder{margin:26px 0 0;font-size:13px;letter-spacing:.07em;text-transform:uppercase;
  color:#8FA0C4;font-weight:600}

/* ---------- prijskaart: rekenhulp in drie stappen ----------
   Zelfde opbouw als de referentiesite: 01 pakket, 02 aantal m2, 03 richtprijs, met
   een balkje erboven dat laat zien waar je bent. De prijzen zijn die van Pascal. */
.kaart{background:#fff;color:var(--inkt);border-radius:6px;padding:clamp(20px,2.4vw,30px);
  box-shadow:0 26px 60px rgba(0,0,0,.4)}
.kaart h2{font-size:clamp(25px,2.5vw,30px)}  /* niet lager: onder 25px zijn de
   kapitalen van de smalle kopletter niet goed leesbaar, zie meet.mjs */
.kaart-kop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.kaart-badge{flex:0 0 auto;font-size:12px;font-weight:700;letter-spacing:.14em;
  text-transform:uppercase;color:var(--grijs);padding-top:4px}
.rail{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;
  list-style:none;margin:16px 0 18px;padding:0}
.rail li{border:1.5px solid var(--lijn);border-radius:5px;padding:9px 11px;
  color:var(--grijs);transition:background .15s,border-color .15s,color .15s}
.rail li i{display:block;font-style:normal;font-size:12px;font-weight:700;letter-spacing:.12em}
.rail li span{display:block;font-size:13px;font-weight:700;line-height:1.25;
  overflow-wrap:anywhere}
.rail li.aan{background:var(--blauw);border-color:var(--blauw);color:#fff}
.rail li.af{border-color:#B9C5E8;color:var(--navy)}
.paneel-l{font-size:12px;font-weight:700;letter-spacing:.13em;text-transform:uppercase;
  color:var(--blauw);margin:0 0 11px}
.paneel-l label{font:inherit;color:inherit}
.paneel-knoppen{display:flex;gap:10px;margin-top:16px}
.paneel-knoppen .knop{flex:1}
.knop-t{background:#fff;color:var(--navy);box-shadow:inset 0 0 0 1.5px var(--lijn)}
.knop-t:hover{background:var(--mist)}
.teller{display:grid;grid-template-columns:48px minmax(0,1fr) auto 48px;gap:8px;align-items:center}
/* input[type=number] hieronder is even specifiek en staat later, dus die won. Daardoor
   stond dit veld op 15px en zoomde iOS de hele pagina in zodra stap 02 het focus gaf.
   Vandaar het attribuut erbij: nu wint deze regel. */
.teller input[type=number]{text-align:center;font-weight:700;font-size:17px}
.teller input::-webkit-outer-spin-button,.teller input::-webkit-inner-spin-button{
  -webkit-appearance:none;margin:0}
.teller input[type=number]{-moz-appearance:textfield;appearance:textfield}
.teller-k{width:48px;height:46px;border:1.5px solid var(--lijn);border-radius:4px;
  background:#fff;color:var(--navy);font-size:21px;font-weight:700;line-height:1;cursor:pointer}
.teller-k:hover{background:var(--mist);border-color:#B9C5E8}
.teller-e{font-size:13px;font-weight:700;color:var(--grijs)}
.paneel-h{display:block;font-size:12px;color:var(--grijs);margin-top:8px;line-height:1.45}
.paneel-waarschuwing{margin:12px 0 0;padding:10px 12px;border-radius:4px;background:var(--mist);
  font-size:12.5px;color:var(--navy);font-weight:600;line-height:1.45}
.res{border:1.5px solid var(--lijn);border-radius:5px;padding:16px 17px;background:var(--mist)}
.res-meta{margin:0;font-size:13.5px;font-weight:700;
  color:var(--grijs);line-height:1.5}
.res-meta b{color:var(--navy)}
.res-bedrag{margin:6px 0 0;font-family:var(--kop);font-weight:800;line-height:1;
  font-size:clamp(34px,4.4vw,46px);color:var(--navy)}
.res-obv{margin:8px 0 0;font-size:12.5px;color:var(--grijs)}
.pakket{display:grid;grid-template-columns:1fr auto;gap:10px;align-items:center;
  border:1.5px solid var(--lijn);border-radius:5px;padding:13px 15px;margin-bottom:10px;
  cursor:pointer;transition:border-color .15s,background .15s}
.pakket:hover{border-color:#B9C5E8}
.pakket input{position:absolute;opacity:0;pointer-events:none}
.pakket:has(input:checked){border-color:var(--blauw);background:#F3F7FF}
.pakket:has(input:focus-visible){outline:2px solid var(--navy);outline-offset:2px}
.pakket b{display:block;font-size:15.5px;font-weight:700;color:var(--navy);line-height:1.3}
.pakket small{display:block;font-size:12.5px;color:var(--grijs);line-height:1.4}
.pakket .prijs{font-family:var(--kop);font-size:27px;font-weight:800;color:var(--navy);
  white-space:nowrap;line-height:1;text-align:right}
.pakket .prijs i{display:block;font-family:var(--body);font-size:12px;font-style:normal;
  font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--grijs)}
.veld{margin:0}
.veld label{display:block;font-size:13px;font-weight:700;margin-bottom:6px;color:var(--inkt)}
.veld small{display:block;font-size:12px;color:var(--grijs);margin-top:5px;line-height:1.45}
/* 16px is hier geen smaak maar een ondergrens: Safari op iOS zoomt de HELE pagina in
   zodra een veld onder 16px focus krijgt, en die zoom blijft staan. De bezoeker kan de
   pagina dan opzij slepen en ziet rechts het witte paginavlak naast de secties staan
   (Armando, 20-10-2026: "zie witte rechts daar"). Stap 02 van de rekenhulp zette zelf
   focus op het m2-veld, dus dat gebeurde zonder dat je ergens op tikte.
   meet.mjs zakt op elk veld onder 16px.

   De selector noemde tot 26-10-2026 de types een voor een (number, text, tel). Daar
   ging het bij de verhuizing meteen mis: het nieuwe e-mailveld is type="email", stond
   dus in geen van die drie, en kwam op de 13,3px van de browser uit - precies de bug van
   20-10 terug, op een veld dat er die dag bij kwam. Een lijst met types mist stil de
   volgende die je toevoegt.

   Nu een selector die niets kan missen: alles wat een invoerveld is, behalve de types
   waar tekstmaat niet over gaat. :where() telt niet mee voor de specificiteit, dus
   ".teller input[type=number]" hierboven (die 17px en gecentreerd wil) wint nog steeds -
   met een gewone :not()-ketting zou deze regel die stil overrulen.

   Let op: geen backticks in dit commentaar. Dit blok staat IN de css-template-literal,
   dus een backtick hier sluit die literal en de bouw valt om met een syntaxfout een
   paar honderd regels verderop. Dat gebeurde op 26-10-2026 twee keer achter elkaar, en
   het kostte tijd omdat de bouw stil faalde achter een omleiding naar /dev/null en de
   meting daarna tegen de oude dist liep - die gaf dus nog de oude uitkomst. Draai een
   bouw zonder zijn uitvoer weg te gooien. */
input:where(:not([type=hidden],[type=radio],[type=checkbox],[type=submit],[type=button])),select,textarea{
  width:100%;font:inherit;font-size:16px;padding:11px 13px;border:1.5px solid var(--lijn);
  border-radius:4px;background:#fff;color:var(--inkt)}
input:focus,select:focus,textarea:focus{outline:2px solid var(--blauw);outline-offset:0;border-color:var(--blauw)}
.kleine-regel{font-size:12px;color:var(--grijs);margin:14px 0 0;line-height:1.5}

/* ---------- loper ---------- */
.loper{background:var(--navy);color:#fff;overflow:hidden;padding:13px 0}
.loper-spoor{display:flex;gap:0;width:max-content;animation:schuif 34s linear infinite}
@keyframes schuif{to{transform:translateX(-50%)}}
@media (prefers-reduced-motion:reduce){.loper-spoor{animation:none}}
.loper-spoor span{font-size:12.5px;font-weight:700;letter-spacing:.15em;text-transform:uppercase;
  padding:0 22px;white-space:nowrap;display:flex;align-items:center;gap:22px}
.loper-spoor span::after{content:"";width:5px;height:5px;border-radius:50%;background:var(--blauw)}

/* ---------- secties ---------- */
section{padding-block:clamp(50px,6.4vw,96px)}
.op-mist{background:var(--mist)}
.op-nacht{background:var(--nacht);color:#DDE3F0}
.op-nacht h2{color:#fff}
.sectiekop{max-width:46em;margin-bottom:clamp(28px,3.4vw,46px)}
.sectiekop :is(h1,h2){font-size:clamp(29px,4.1vw,50px)}
.sectiekop p{margin-top:14px;font-size:16.5px;color:var(--grijs)}
.op-nacht .sectiekop p{color:#A9B5D0}

/* 5 genummerde punten */
.punten{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;
  border-top:1px solid var(--lijn)}
.punten>div{padding:26px clamp(12px,1.6vw,22px) 26px;border-right:1px solid var(--lijn)}
.punten>div:last-child{border-right:0}
.punten .n{font-family:var(--kop);font-size:34px;font-weight:800;color:var(--blauw);line-height:1}
.punten h3{font-size:16px;margin:11px 0 0;color:var(--navy);line-height:1.3}

/* vakman */
.vakman{display:grid;grid-template-columns:minmax(0,.95fr) minmax(0,1.05fr);
  gap:clamp(22px,3.2vw,48px);align-items:center;background:#fff;border-radius:6px;
  overflow:hidden;box-shadow:0 18px 44px rgba(11,30,138,.09)}
.vakman-foto{position:relative;align-self:stretch;min-height:260px}
.vakman-foto img{width:100%;height:100%;object-fit:cover}
.vakman-foto .vlag{position:absolute;left:0;bottom:22px;background:var(--blauw);color:#fff;
  font-size:12px;font-weight:800;letter-spacing:.13em;text-transform:uppercase;padding:9px 16px}
.vakman-tekst{padding:clamp(22px,3vw,40px) clamp(22px,3vw,44px) clamp(22px,3vw,40px) 0}
.vakman h2{font-size:clamp(26px,3.3vw,40px)}
.vakman p{margin-top:14px;font-size:16px;color:#4B5563}
blockquote{margin:22px 0;padding:16px 20px;border-left:4px solid var(--blauw);
  background:var(--mist);border-radius:0 4px 4px 0}
blockquote p{margin:0;font-size:17px;font-weight:600;color:var(--navy);font-style:italic}
blockquote cite{display:block;margin-top:7px;font-size:12.5px;font-style:normal;
  letter-spacing:.09em;text-transform:uppercase;color:var(--grijs);font-weight:700}

/* kleurkaarten ----------------------------------------------------------------
   Opbouw van de referentiesite: kop links en de lead rechts ernaast, drie staande
   foto's met een eigen bijschriftbalk ONDER de foto (geen verloop eroverheen) en
   een vierkant kleurvlakje ervoor. Op een telefoon schuiven ze opzij met stippen
   eronder, zodat de derde kaart niet onder de vouw verdwijnt. */
.kleurkop{display:flex;align-items:flex-end;justify-content:space-between;
  gap:clamp(18px,3vw,36px);flex-wrap:wrap;margin-bottom:clamp(22px,2.8vw,34px)}
.kleurkop h2{font-size:clamp(29px,4.1vw,50px)}
.kleurkop .boven{margin-bottom:12px}
.kleurkop p{margin:0;font-size:15.5px;color:#A9B5D0;max-width:38ch;line-height:1.6}
.kleuren{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.6vw,20px)}
.kleurkaart{margin:0;background:var(--nacht-2);border:1px solid rgba(255,255,255,.12);
  border-radius:5px;overflow:hidden}
.kleurkaart img{width:100%;aspect-ratio:4/5;object-fit:cover}
.kleurkaart figcaption{display:flex;align-items:center;gap:12px;padding:14px 16px;
  background:#0E1730}
.kleurkaart .stip{width:16px;height:16px;flex:0 0 auto;border-radius:3px;
  box-shadow:0 0 0 1px rgba(255,255,255,.35)}
.kleurkaart b{display:block;font-family:var(--body);font-weight:700;font-size:16px;
  text-transform:none;line-height:1.25;color:#fff}
.kleurkaart small{display:block;margin-top:2px;font-size:13.5px;
  text-transform:none;color:#8FA0C4;font-weight:500}
.kleurstippen{display:none}
.kleurvoet{margin:16px 0 0;font-size:14px;color:#8FA0C4;font-weight:500}

/* de verf: drie kaarten met de Sikkens-producten waarmee Pascal text (doorgegeven via
   Armando, 20-10-2026 - tot die dag stond het verfmerk als vraag in de README, omdat
   "A-merk materialen o.a. Sikkens" een USP van de referentiesite was en niet van hem).
   Een lichte sectie tussen de donkere kleurensectie en de witte werksectie, zodat er
   geen twee witte blokken tegen elkaar aan komen te staan.
   De vlag ("Strepen en stoten") staat in de gewone letter met ruimte ertussen, niet in
   de smalle kopletter: die mag op 12 px niet in kapitalen (zie de regel bij h1/h2). */
.verfkop{display:flex;align-items:flex-end;justify-content:space-between;
  gap:clamp(18px,3vw,36px);flex-wrap:wrap;margin-bottom:clamp(22px,2.8vw,34px)}
.verfkop h2{font-size:clamp(29px,4.1vw,50px)}
.verfkop .boven{margin-bottom:12px}
.verfkop p{margin:0;font-size:15.5px;color:var(--grijs);max-width:46ch;line-height:1.6}
.verfkaarten{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));
  gap:clamp(12px,1.6vw,20px)}
.verfkaart{background:#fff;border:1px solid var(--lijn);border-radius:5px;
  padding:clamp(16px,1.9vw,22px);display:flex;flex-direction:column;align-items:flex-start;gap:9px}
.verfvlag{margin:0;font-size:12px;font-weight:700;letter-spacing:.08em;
  text-transform:uppercase;color:var(--blauw);background:#EDF3FF;border-radius:3px;
  padding:4px 9px;line-height:1.5}
.verfkaart h3{font-size:17px;overflow-wrap:anywhere}
.verfkaart .verfregel{margin:0;font-size:14.5px;color:var(--grijs);line-height:1.6}
@media (max-width:759px){
  .kleuren{display:flex;gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;
    scrollbar-width:none;-webkit-overflow-scrolling:touch}
  .kleuren::-webkit-scrollbar{display:none}
  .kleurkaart{flex:0 0 78%;scroll-snap-align:center}
  .kleurstippen{display:flex;gap:8px;justify-content:center;margin-top:14px}
  .kleurstippen span{width:9px;height:9px;border-radius:50%;background:rgba(255,255,255,.25)}
  .kleurstippen span.aan{background:var(--blauw)}
}

/* werk: een strook die opzij schuift, zoals de projectenstrook van de referentiesite
   (verzoek Armando, 20-10-2026). Boven de strook de teller, eronder de duimnagels met
   een blauw kader om de foto die in beeld staat. De tussenruimte is BEWUST een vast
   getal en geen clamp(): het javascript rekent de scrollpositie uit met
   kaartbreedte + WERK_GAT, en dat klopt alleen als beide hetzelfde zijn. */
.werkteller{margin:0 0 14px;font-family:var(--kop);font-size:15px;font-weight:800;
  letter-spacing:.14em;color:var(--grijs)}
.werkteller b{color:var(--navy)}
.werk{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;
  scrollbar-width:none;-webkit-overflow-scrolling:touch}
.werk::-webkit-scrollbar{display:none}
.werkkaart{margin:0;flex:0 0 calc((100% - 32px)/3);scroll-snap-align:start;
  background:#fff;border-radius:5px;overflow:hidden;border:1px solid var(--lijn)}
.werkkaart img{width:100%;aspect-ratio:4/3;object-fit:cover}
.werkkaart figcaption{padding:14px 17px 16px}
.werkkaart .n{font-family:var(--kop);font-size:25px;font-weight:800;color:var(--blauw);line-height:1}
.werkkaart p{margin:6px 0 0;font-size:14.5px;font-weight:600;color:var(--navy);line-height:1.4}
.werkduim{display:flex;gap:8px;margin-top:clamp(14px,1.8vw,20px);overflow-x:auto;
  scrollbar-width:none;-webkit-overflow-scrolling:touch}
.werkduim::-webkit-scrollbar{display:none}
.werkduim button{flex:0 0 auto;padding:0;line-height:0;cursor:pointer;background:none;
  border:2px solid transparent;border-radius:4px;overflow:hidden;opacity:.5;transition:opacity .18s}
.werkduim button.aan{border-color:var(--blauw);opacity:1}
.werkduim button:focus-visible{outline:2px solid var(--blauw);outline-offset:2px}
.werkduim img{width:84px;height:56px;object-fit:cover;display:block}

/* dienstenstrook: wat Pascal nog meer doet, zonder de pagina van renovlies af te halen
   (feedback Armando, 20-10-2026). Bewust GEEN volle sectie: geen eigen achtergrond, geen
   foto's, geen tweede offerteblok. Hij staat nu bovenaan de werksectie, boven de kop
   "Eerder werk", met de scheidslijn ERONDER: een lijn boven zou hier vlak onder de
   donkere kleurensectie komen te staan, en dan scheidt hij niets. De kop is een maat
   groter dan eerst (hij was op zijn oude plek niet terug te vinden) maar blijft onder
   .sectiekop h2, zodat "Werk van Pascal" eronder nog steeds de kop van de sectie is. */
.dband{margin-bottom:clamp(30px,3.8vw,50px)}
/* De volgorde in de html is tekst, lijst, knop: op een telefoon stapelt dat in de
   leesvolgorde die je wilt. Op een breed scherm zet grid-template-areas de lijst
   rechts naast tekst en knop samen. */
.dband .rand{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  grid-template-areas:"tekst lijst" "knop lijst";
  gap:4px clamp(16px,2.6vw,40px);align-items:start;border-bottom:1px solid var(--lijn);
  padding-bottom:clamp(22px,2.6vw,32px)}
.dband .dtekst{grid-area:tekst}
.dband .dknop{grid-area:knop}
.dband .dlijst{grid-area:lijst;align-self:center}
.dband h2{font-size:clamp(25px,3.2vw,38px);max-width:24ch}
.dband .boven{margin-bottom:10px}
.dband .dtekst p{margin:10px 0 0;font-size:15px;color:var(--grijs);line-height:1.6;max-width:46ch}
/* Drie diensten sinds 20-10-2026 (traprenovatie doet Pascal niet meer), dus een kolom
   in plaats van twee: 3 in een raster van 2 geeft twee regels van 2 en 1, en dat leest
   als een vergeten vierde. Er is geen vierde dienst, en een blok vullen met iets dat
   hij niet doet is precies wat hier niet mag. */
.dlijst{list-style:none;margin:0;padding:0;display:grid;
  grid-template-columns:minmax(0,auto);justify-content:start;
  gap:11px clamp(14px,2vw,26px)}
.dlijst li{display:flex;align-items:center;gap:10px;font-size:15.5px;font-weight:600;
  color:var(--navy);line-height:1.35}
.dlijst li::before{content:"";width:7px;height:7px;flex:0 0 auto;border-radius:2px;
  background:var(--blauw)}
.dband .dknop{display:inline-flex;align-items:center;gap:7px;margin-top:14px;
  justify-self:start;font-size:14.5px;font-weight:700;color:var(--blauw);text-decoration:none}
.dband .dknop:hover{text-decoration:underline}

/* stappen: genummerde regels in plaats van kaarten. Armando vergeleek op 20-10-2026
   de lijst van de referentiesite met onze kaartjes: de lijst is duidelijker in
   structuur en minder leeswerk. Cijfer links, korte kop, een regel eronder. */
.rijen{display:grid;max-width:940px;border-top:2px solid var(--navy)}
.rijen>div{display:grid;grid-template-columns:clamp(52px,6.5vw,82px) minmax(0,1fr);
  gap:clamp(8px,1.6vw,20px);align-items:baseline;
  padding:clamp(15px,1.9vw,21px) 0;border-bottom:1px solid var(--lijn)}
.rijen .n{font-family:var(--kop);font-size:clamp(28px,3.6vw,38px);font-weight:800;
  color:var(--blauw);line-height:1}
.rijen h3{font-size:clamp(16px,1.7vw,18px);margin:0 0 5px}
.rijen p{margin:0;font-size:15px;color:var(--grijs);line-height:1.55}

/* vragen */
.vragenlijst{display:grid;gap:9px;max-width:900px}
details{background:#fff;border:1px solid var(--lijn);border-radius:5px}
details[open]{border-color:#C3D0F2}
summary{cursor:pointer;list-style:none;padding:16px 50px 16px 18px;font-weight:600;
  font-size:15.5px;color:var(--navy);position:relative}
summary::-webkit-details-marker{display:none}
summary::after{content:"";position:absolute;right:20px;top:50%;width:10px;height:10px;
  margin-top:-7px;border-right:2px solid var(--blauw);border-bottom:2px solid var(--blauw);
  transform:rotate(45deg);transition:transform .18s}
details[open] summary::after{transform:rotate(225deg);margin-top:-3px}
summary:focus-visible{outline:2px solid var(--blauw);outline-offset:-2px}
details p{margin:0;padding:0 18px 17px;font-size:15px;color:#4B5563;line-height:1.65}

/* offerte */
.offerte{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);
  gap:clamp(22px,3.2vw,46px);align-items:start}
.formulier{display:grid;gap:14px;grid-template-columns:1fr 1fr}
.formulier .heel{grid-column:1/-1}
.formulier .knop{width:100%}
textarea{min-height:110px;resize:vertical}
/* De verstuurknop is sinds 26-10-2026 een <button> en geen <a>. Een knop erft de
   .knop-opmaak niet helemaal: een browser zet zijn eigen rand, achtergrond en
   lettertype op een button, dus die drie moeten hier expliciet terug. */
button.knop{border:0;font:inherit;cursor:pointer}
button.knop[disabled]{opacity:.6;cursor:default}
/* Het lokvink. display:none, want dat houdt hem ook uit de toetsvolgorde en uit wat
   een schermlezer voorleest - een veld buiten beeld schuiven met left:-9999px laat
   hem dat allebei nog wel halen. Een bot die het formulier uitleest ziet hem en vult
   hem; een bezoeker komt er nooit bij. */
.lokvink{display:none}
.uitkomst{grid-column:1/-1;margin:0;font-size:15px;font-weight:600;line-height:1.5}
.uitkomst:empty{display:none}
.uitkomst.goed{color:#15803D}
.uitkomst.mis{color:#B42318}
.uitkomst.bezig{color:var(--grijs)}
.zijpaneel{background:var(--nacht);color:#DDE3F0;border-radius:6px;padding:clamp(22px,2.6vw,32px)}
.zijpaneel h3{color:#fff;font-size:20px}
.zijpaneel dl{margin:18px 0 0;display:grid;gap:14px}
.zijpaneel dt{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#8FA0C4;font-weight:700}
.zijpaneel dd{margin:3px 0 0;font-size:16px;font-weight:600;color:#fff;overflow-wrap:anywhere}
.zijpaneel dd a{text-decoration:none}
.zijpaneel dd a:hover{color:var(--blauw)}

/* slot + voet */
.slot{background:var(--navy);color:#fff}
.slot .wrap{display:flex;justify-content:space-between;align-items:center;
  gap:clamp(18px,3vw,40px);flex-wrap:wrap}
.slot h2{color:#fff;font-size:clamp(27px,3.7vw,44px);max-width:16em}
.slot p{margin:10px 0 0;color:#C6D2F5;font-size:16px}
.slot-knoppen{display:flex;gap:12px;flex-wrap:wrap}
footer{background:var(--nacht);color:#9BA7C2;padding-block:clamp(40px,5vw,64px) 0;font-size:14.5px}
.voet{display:grid;grid-template-columns:minmax(0,1.4fr) repeat(2,minmax(0,1fr));
  gap:clamp(24px,3vw,44px)}
footer img{width:200px;margin-bottom:16px}
footer h3{color:#fff;font-size:15px;margin:0 0 14px}
footer ul{list-style:none;margin:0;padding:0;display:grid;gap:8px}
footer a{text-decoration:none}
footer a:hover{color:var(--blauw)}
.voet-onder{margin-top:clamp(28px,3.4vw,44px);border-top:1px solid rgba(255,255,255,.1);
  padding-block:20px;display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;font-size:13px}

/* ---------- smaller ---------- */
@media (max-width:1040px){
  .hero .wrap{grid-template-columns:1fr}
  .vakman{grid-template-columns:1fr}
  .vakman-tekst{padding:0 clamp(20px,4vw,34px) clamp(26px,4vw,36px)}
  .punten{grid-template-columns:repeat(2,minmax(0,1fr));border-top:0}
  .punten>div{border-right:0;border-top:1px solid var(--lijn)}
  .werkkaart{flex:0 0 calc((100% - 16px)/2)}
  /* Drie verfkaarten naast elkaar worden hieronder te smal voor "Alpha Rezisto Anti
     Marks": twee kolommen, de derde (de optionele) over de volle breedte. */
  .verfkaarten{grid-template-columns:repeat(2,minmax(0,1fr))}
  .verfkaarten>:last-child{grid-column:1/-1}
  .dband .rand{grid-template-columns:1fr;grid-template-areas:"tekst" "lijst" "knop";gap:0}
  .dband .dlijst{align-self:start;margin-top:18px}
  .dband .dknop{margin-top:18px}
  .offerte{grid-template-columns:1fr}
  .voet{grid-template-columns:1fr 1fr}
}
/* Op een telefoon krijgen de vijf redenen dezelfde opbouw als de stappen: cijfer
   links naast de kop in plaats van twee kolommen met blokjes. */
@media (max-width:760px){
  .punten{grid-template-columns:1fr;border-top:2px solid var(--navy)}
  .punten>div{display:grid;grid-template-columns:52px minmax(0,1fr);gap:8px;
    align-items:baseline;padding:15px 0;border-top:0;border-bottom:1px solid var(--lijn)}
  .punten .n{font-size:28px}
  .punten h3{margin:0;font-size:16px}
}
@media (max-width:720px){
  .hoofdnav{display:none}
  .kop-site .wrap{min-height:66px;justify-content:space-between}
  .kop-site>.wrap>.knop{display:none}
  .burger{display:inline-flex}
  /* Op een telefoon worden het twee pillen naast elkaar over de volle breedte, zoals
     bij winterswijk. Daarboven blijven ze de kolom rechtsonder uit de basisregels. */
  .zwevend{flex-direction:row;align-items:stretch;left:16px;right:16px;
    bottom:calc(16px + env(safe-area-inset-bottom));
    transform:translateY(calc(100% + 26px))}
  .zwevend a{flex:1 1 0;padding:0 12px}
  /* ruimte onder de pagina, anders dekt de zwevende balk de laatste regel af.
     Alleen hier: op een laptop staan de knoppen in de hoek en dekken ze niets af.
     Die ruimte hoort IN de voet en niet onder de body (Armando, 20-10-2026): de
     body is wit, dus onder de donkere voet stond een witte strook achter de
     knoppen. In de voet is het dezelfde kleur als de voet zelf. */
  footer{padding-bottom:calc(86px + env(safe-area-inset-bottom))}
  .werkkaart{flex:0 0 86%}
  .verfkaarten{grid-template-columns:1fr}
  .formulier{grid-template-columns:1fr}
  .voet{grid-template-columns:1fr}
  .slot .wrap{align-items:flex-start}
}
@media (max-width:470px){
  /* "Sauswerk, plafonds en wanden" past op 360 niet in een halve kolom. */
  .dlijst{grid-template-columns:1fr;gap:9px}
}
@media (max-width:420px){
  /* De prijs blijft rechts naast de pakketnaam staan, net als bij de referentiesite.
     Stapelen maakte de kaart een stuk langer zonder dat het leesbaarder werd. */
  .pakket{padding:12px 13px}
  .pakket .prijs{font-size:23px}
  .rail li span{font-size:12px}
}

/* ---------- tweede pagina: /werkwijze/ ----------
   De referentiesite heeft hier een eigen pagina met een kop, een stappenlijst en
   daarna de stappen uitgewerkt met een foto ernaast. Zelfde opbouw, maar met de
   onderdelen die Pascal zelf opschrijft. */
.meerlink{margin:clamp(20px,2.4vw,28px) 0 0;font-size:15px;font-weight:700}
.meerlink a{display:inline-flex;align-items:center;gap:9px;color:var(--navy);
  text-decoration:none;border-bottom:2px solid var(--blauw);padding-bottom:3px}
.meerlink a:hover{color:var(--blauw)}

.paginakop{position:relative;background:var(--nacht);color:#fff;overflow:hidden}
.paginakop-foto{position:absolute;inset:0}
.paginakop-foto img{width:100%;height:100%;object-fit:cover;opacity:.62}
.paginakop-foto::after{content:"";position:absolute;inset:0;
  background:linear-gradient(100deg,rgba(10,16,32,.93) 0%,rgba(10,16,32,.78) 48%,rgba(10,16,32,.34) 100%)}
.paginakop .wrap{position:relative;padding-block:clamp(26px,3.4vw,44px) clamp(40px,5.4vw,74px)}
.paginakop h1{color:#fff;font-size:clamp(36px,6.2vw,70px);max-width:20ch}
.paginakop h1 span{display:block;color:var(--blauw)}
.paginakop .hero-lead{max-width:40em}
.paginakop .hero-knoppen{margin-top:28px}
.kruimels{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-bottom:clamp(18px,2.4vw,30px);
  font-size:12px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#8FA0C4}
.kruimels a{color:#C7D0E4;text-decoration:none}
.kruimels a:hover{color:#fff}
.kruimels b{color:#fff}

/* uitleg: tekst met de foto ernaast, om en om */
.uitleg{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);
  gap:clamp(22px,3.4vw,54px);align-items:center;padding-block:clamp(26px,3.4vw,44px);
  border-top:1px solid var(--lijn)}
.uitleg:first-child{border-top:0;padding-top:0}
.uitleg-om .uitleg-tekst{order:2}
.uitleg h2{font-size:clamp(25px,3.1vw,38px)}
.uitleg .boven{margin-bottom:11px}
.uitleg-tekst p{margin:14px 0 0;font-size:16px;color:#4B5563;max-width:46em}
.uitleg-foto{margin:0;border-radius:6px;overflow:hidden;border:1px solid var(--lijn);background:#fff}
.uitleg-foto img{width:100%;aspect-ratio:4/3;object-fit:cover}

/* de drie soorten naast elkaar (/werkwijze/, 25-10-2026). Drie gelijke kaarten die
   ELK hun eigen regel dragen: wat het is en wat het onderscheidt.
   Tot 25-10-2026 droeg elke kaart ook een vlaggetje met het ene kenmerk
   (SCHEUROVERBRUGGEND / PATROON BLIJFT ZICHTBAAR / NIET OM OVER TE TEXEN) en was de
   derde kaart gedempt. Armando streepte alle drie de vlaggen door en vroeg om een
   gelijke kleur voor vliesbehang. De vlag zei bovendien in kapitalen wat de alinea
   drie regels lager in gewone zinnen zegt, en de demping maakte van een uitlegkaart
   een afgekeurde optie - terwijl de kaart er staat omdat mensen het woord verwarren.
   Het onderscheid draagt de tekst nu alleen, en dat is waar controle 15b op zit. */
.soorten{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(12px,1.6vw,20px)}
.soort{background:#fff;border:1px solid var(--lijn);border-radius:6px;
  padding:clamp(18px,2.1vw,26px);display:flex;flex-direction:column;gap:10px}
.soort h3{font-size:19px;overflow-wrap:anywhere}
.soort .wat{margin:0;font-size:13px;font-weight:700;color:var(--navy);opacity:.72}
.soort p.soort-b{margin:0;font-size:15px;color:#4B5563;line-height:1.62}
/* Stond onder het soortenblok op /werkwijze/ (die regel is er op 25-10-2026 uit op
   aanwijzing van Pascal) en staat nu onder de verfkaarten op de startpagina. Vandaar
   een naam die niet meer naar een van de twee blokken verwijst. */
.blok-voet{margin:clamp(16px,2vw,24px) 0 0;font-size:15.5px;color:#4B5563;
  line-height:1.65;max-width:62em}
@media (max-width:860px){
  .soorten{grid-template-columns:1fr}
}

/* prijs en afspraken. Stond tot 20-10-2026 op de donkere band; die was te donker
   (Armando) en de pagina had daarmee drie zwarte vlakken onder elkaar. Nu een
   lichte band tussen de grijze uitleg en het blauwe slot.
   HET GRIJZE VAK (Armando, 25-10-2026: "bij wat het kost is er een vak grijs; dat
   moet wit worden net als de rest"). De oorzaak zat in deze twee regels samen. De
   lijnen tussen de kaarten waren geen randen maar de ACHTERGROND van het raster die
   door een gat van 1 px heen schijnt, en de laatste kaart liep over de volle breedte.
   Acht afspraken in drie kolommen is dan 3 + 3 + 1 + de volle regel: in die derde
   regel blijven twee cellen leeg, en een lege cel heeft geen witte kaart in zich, dus
   daar zie je de achtergrond op volle grootte. Precies een grijs vak, en het schoof
   mee met elke afspraak die erbij kwam.
   Twee dingen daarom veranderd. De achtergrond van het raster is wit en de lijnen
   komen nu van de kaarten zelf (een ring van 1 px, die in het gat van 1 px met de
   ring van de buur samenvalt en langs de buitenrand door overflow:hidden wordt
   weggeknipt) - dan is een lege cel wit in plaats van grijs, bij elk aantal. En de
   laatste twee kaarten delen de slotregel in plaats van een volle regel voor een
   kaart, zodat er helemaal geen lege cel meer is. Het zijn twee oplossingen voor een
   fout, en dat is hier bewust: de tweede is de nette indeling voor acht afspraken, de
   eerste is de bodem die ook houdt als het er negen worden.
   meet.mjs rekent na dat elke rasterregel helemaal gevuld is. */
.afspraken{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:1px;
  background:#fff;border:1px solid var(--lijn);border-radius:6px;
  overflow:hidden}
.afspraak{background:#fff;padding:clamp(18px,2.2vw,26px);grid-column:span 2;
  box-shadow:0 0 0 1px var(--lijn)}
/* acht kaarten: zes in twee volle regels van drie, de laatste twee elk een halve
   regel. Geen lege cel, dus ook geen vak dat van de rest afwijkt. */
.afspraak:nth-last-child(-n+2){grid-column:span 3}
.afspraak h3{font-size:16.5px;color:var(--navy);margin-bottom:8px}
.afspraak p{margin:0;font-size:15px;color:#4B5563;line-height:1.6}
.afspraak-voet{display:flex;align-items:center;gap:clamp(16px,2.6vw,34px);flex-wrap:wrap;
  margin-top:clamp(22px,2.8vw,34px)}
.afspraak-voet p{margin:0;font-size:14px;color:var(--grijs);max-width:40em}
#afspraken blockquote{margin:clamp(24px,3vw,38px) 0 0;background:var(--mist)}

@media (max-width:1040px){
  /* twee kolommen: acht kaarten vullen vier volle regels, dus hier mag de slotregel
     NIET gedeeld worden - anders staan de laatste twee op een halve kolom en blijft
     er weer een gat. Zelfde reden als hierboven, andere rekensom. */
  .afspraken{grid-template-columns:repeat(2,minmax(0,1fr))}
  .afspraak,.afspraak:nth-last-child(-n+2){grid-column:span 1}
}
@media (max-width:860px){
  .uitleg{grid-template-columns:1fr;gap:20px}
  .uitleg-om .uitleg-tekst{order:0}
}
@media (max-width:560px){
  .afspraken{grid-template-columns:1fr}
  .afspraak,.afspraak:nth-last-child(-n+2){grid-column:span 1}
}
`.trim()

// ----------------------------------------------------------------- 4. html
const vink = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><circle cx="10" cy="10" r="10" fill="#2D6BFF"/><path d="M5.6 10.2l2.9 2.9 5.9-6" stroke="#fff" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"/></svg>`

const loperItems = [T.loper.a, T.loper.b, T.loper.c, T.loper.d, T.loper.e, T.loper.f, T.loper.g]
const loperSpoor = [...loperItems, ...loperItems].map((x) => `<span>${esc(x)}</span>`).join('')

// De volgorde is de leesvolgorde en niet de nummering: 11 ("zit het schuren in de
// prijs?") hoort direct achter 5, want dat zijn twee vragen over hetzelfde bedrag.
// 12 (welke verf) staat achter de vragen over het materiaal en voor die over de prijs:
// hij gaat over wat er op de wand komt, en noemt het bedrag voor twee keer texen.
// 13 ("moeten mijn wanden behangklaar zijn?") staat direct achter 11, want dat zijn
// twee vragen over hetzelfde voorwerk - en het is de vraag waar Pascal op 25-10-2026
// zelf twee uitroeptekens achter zette.
const vragen = [1, 2, 3, 4, 12, 5, 11, 13, 6, 7, 8, 9, 10].map(
  (i) => `<details><summary>${esc(T.vragen['q' + i])}</summary><p>${esc(T.vragen['a' + i])}</p></details>`
).join('\n        ')

// Volgnummers worden hier geteld en staan niet in inhoud.mjs: 01 is opmaak en geen
// bewering, dus hij hoort niet door de bronpoort en niet op de nalooplijst.
const nr = (i) => String(i + 1).padStart(2, '0')

// Alleen de kop, geen regel eronder: Armando streepte op 20-10-2026 alle vijf de
// ondertitels door. Ze zeiden ook weinig dat de kop niet al zei ("Dik en stevig" /
// "Renovlies is een vrij dikke, stevige behangsoort"), en het blok leest nu als vijf
// redenen in plaats van vijf alinea's.
const punten = ['a', 'b', 'c', 'd', 'e'].map(
  (k, i) => `<div><div class="n">${nr(i)}</div><div><h3>${esc(T.usp[k + '_t'])}</h3></div></div>`
).join('\n        ')

// De drie verfkaarten. De merknaam staat op elke kaart ("Sikkens Alpha Rezisto ..."),
// want het product zonder het merk zegt een bezoeker niets - en het merk is het punt.
// VERF staat los in inhoud.mjs omdat de NAMEN van de fabrikant komen en niet van
// Pascal: zo is er een plek waar ze kloppen, en noemt de copy ze niet zelf.
const VERF_KAARTEN = ['a', 'b', 'c'].map((k) =>
  `<div class="verfkaart">
          <p class="verfvlag">${esc(T.verf[k + '_vlag'])}</p>
          <h3>${esc(VERF.merk)} ${esc(VERF[k])}</h3>
          <p class="verfregel">${esc(T.verf[k + '_b'])}</p>
        </div>`
).join('\n        ')

const stappen = ['a', 'b', 'c', 'd'].map(
  (k, i) => `<div><div class="n">${nr(i)}</div><div><h3>${esc(T.stappen[k + '_t'])}</h3><p>${esc(T.stappen[k + '_b'])}</p></div></div>`
).join('\n        ')

// De site heeft sinds 20-10-2026 twee pagina's, dus elk anker is afhankelijk van waar
// je staat: op de startpagina is `#offerte` een anker, op /werkwijze/ moet het eerst
// terug naar de startpagina. Een kale `#offerte` daar wijst naar een blok dat op die
// pagina niet bestaat, en dan doet de knop niets.
const PAD_WERKWIJZE = '/werkwijze/'
/** `basis` is '' op de startpagina en '/' op een onderpagina. */
const ank = (basis, id) => `${basis}#${id}`

/**
 * De adressen die in de sitemap horen, op een plek. De sitemap las dit eerst als een
 * losse lijst `['/', PAD_WERKWIJZE]` naast de lijst met pagina's die gebouwd worden;
 * twee lijsten voor hetzelfde ding is precies hoe een derde pagina er later wel komt
 * en niet in de sitemap belandt. tools/vooraf.mjs eist dat deze lijst exact gelijk is
 * aan wat er aan indexeerbare pagina's in dist/ ligt.
 */
// De lijst zelf staat in inhoud.mjs, zodat tools/vooraf.mjs hem ook kan lezen zonder
// build.mjs te draaien. Hier alleen de controle dat die lijst nog over deze site gaat:
// hernoemt iemand /werkwijze/, dan moet de sitemap mee en niet stil achterblijven.
const INDEXEERBAAR = INDEXEERBAAR_PADEN
if (!INDEXEERBAAR.includes(PAD_WERKWIJZE) || !INDEXEERBAAR.includes('/')) {
  throw new Error(`build: INDEXEERBAAR_PADEN (${INDEXEERBAAR.join(', ')}) dekt / en ${PAD_WERKWIJZE} niet`)
}


// Het telefoonmenu. Zes genummerde regels, waarvan "Prijzen" uitklapt naar de drie
// pakketten met hun prijs erbij: zo staat op een telefoon hetzelfde in het menu als
// in de rekenhulp, zonder dat je ernaartoe hoeft te scrollen. Het derde pakket (twee
// keer texen, 23 euro) kwam er op 20-10-2026 bij.
const ladePakketten = (basis) => [
  [T.kaart.pakket1, T.kaart.pakket1sub, PRIJZEN.plakken],
  [T.kaart.pakket2, T.kaart.pakket2sub, PRIJZEN.plakkenTexen],
  [T.kaart.pakket3, T.kaart.pakket3sub, PRIJZEN.plakkenTexen2],
].map(([titel, sub, bedrag]) =>
  `<a class="lade-pak" href="${ank(basis, 'prijzen')}"><span><b>${esc(titel)}</b><small>${esc(sub)}</small></span>` +
  `<span class="prijs">&euro;&nbsp;${eur(bedrag)}<i>v.a. ${esc(T.kaart.perM2)}</i></span></a>`
).join('\n          ')

const ladeItems = (basis) => [
  [ank(basis, 'renovlies'), T.nav.renovlies],
  [ank(basis, 'prijzen'), T.nav.prijzen, ladePakketten(basis)],
  [PAD_WERKWIJZE, T.nav.werkwijze],
  [ank(basis, 'werk'), T.nav.werk],
  [ank(basis, 'vragen'), T.nav.vragen],
  // Kaal #offerte, zonder basis: dat blok staat sinds 20-10-2026 onderaan ELKE pagina,
  // dus de menuregel hoort naar het formulier op de pagina zelf te springen en niet
  // naar de startpagina.
  ['#offerte', T.nav.contact],
].map(([href, woord, sub], i) => {
  const kop = `<span class="lade-n">${nr(i)}</span><span class="lade-w">${esc(woord)}</span>`
  if (!sub) return `<div class="lade-item"><a class="lade-link" href="${href}">${kop}</a></div>`
  return (
    `<div class="lade-item">` +
    `<button class="lade-link lade-uit" type="button" aria-expanded="false">${kop}` +
    `<span class="lade-plus" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></span></button>` +
    `<div class="lade-sub">\n          ${sub}\n        </div></div>`
  )
}).join('\n      ')

// De stip op elke kaart is de kleur die fotos.py uit die wand heeft gemeten, niet een
// kleur die hier is ingetypt. Zo kan de stip nooit iets anders beweren dan de foto.
const wandkleur = manifest._wandkleur || {}
const KLEUR_KAARTEN = [
  ['overloop-taupe', T.kleuren.a, T.kleuren.a_sub, 'Overloop met een warme taupe wand en een witte trapleuning'],
  ['hal-grijs-trap', T.kleuren.b, T.kleuren.b_sub, 'Hal met een diepgrijze wand onder een witte klassieke trap'],
  ['woonkeuken-staand', T.kleuren.c, T.kleuren.c_sub, 'Woonkeuken met een olijfgroen getexte wand tussen houten spanten'],
].map(([naam, titel, sub, alt]) => {
  const kleur = wandkleur[naam]
  if (!kleur) throw new Error(`build: geen gemeten wandkleur voor ${naam}, draai eerst fotos.py`)
  return (
    `<figure class="kleurkaart">${img(naam, alt, '(max-width:420px) 92vw, (max-width:720px) 46vw, 31vw')}` +
    `<figcaption><span class="stip" style="background:${kleur}"></span><span><b>${esc(titel)}</b><small>${esc(sub)}</small></span></figcaption></figure>`
  )
}).join('\n        ')

const WERK = [
  ['nieuwbouw-houten-trap', T.werk.a, 'Hal van een nieuwbouwwoning met een houten zwevende trap langs een witte wand'],
  ['nieuwbouw-rolsteiger', T.werk.b, 'Hoge woonkamer in aanbouw met een rolsteiger tegen de gesausde wand'],
  ['fotobehang-bos', T.werk.c, 'Hal met fotobehang van een bos over de volledige wand'],
  ['stalen-deuren-wit', T.werk.d, 'Woonkamer met witgelakte taatsdeuren met glasvlakken naar de keuken'],
  ['buiten-gevel-riet', T.werk.e, 'Zwart geschilderde houten gevel met witte kozijnen onder een rieten dak'],
  ['buiten-voordeur', T.werk.f, 'Entree van een woning met zwart geschilderde voordeur, kozijnen en stoep'],
]
const WERK_KAARTEN = WERK.map(([naam, bijschrift, alt], i) =>
  `<figure class="werkkaart">${img(naam, alt, '(max-width:720px) 86vw, (max-width:1040px) 46vw, 31vw')}` +
  `<figcaption><div class="n">${nr(i)}</div><p>${esc(bijschrift)}</p></figcaption></figure>`
).join('\n        ')

// De duimnagels onder de strook. Ze wijzen naar een kaart die al op de pagina staat,
// dus de knop draagt het label en de foto hoeft niet nog eens voorgelezen te worden.
const WERK_DUIMEN = WERK.map(([naam, bijschrift, alt], i) =>
  `<button type="button" class="werkduim-k${i === 0 ? ' aan' : ''}" aria-label="Foto ${nr(i)}: ${esc(bijschrift)}">` +
  `${img(naam, alt, '84px')}</button>`
).join('\n        ')

// De zeven dagen voor de openingstijden. EEN specificatie met alle dagen erin en niet
// zeven losse: dat is wat Google uitleest, en het is de enige vorm die niet half kan
// verschuiven. De telling eronder is de koppeling met inhoud.mjs: daar staat openDagen
// als getal (7), hier staat de lijst die in de pagina belandt, en zonder deze regel kan
// die lijst op zes dagen komen te staan terwijl het getal 7 blijft zeggen. Zelfde reden
// als bij FORM_PAD: twee plekken die hetzelfde moeten beweren lopen uit de pas.
const OPEN_DAGEN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
if (OPEN_DAGEN.length !== BEDRIJF.openDagen) {
  throw new Error(
    `build: inhoud.mjs zegt ${BEDRIJF.openDagen} open dagen, de structured data noemt er ${OPEN_DAGEN.length}`
  )
}

const ZAAK = {
  '@context': 'https://schema.org',
  '@type': 'HousePainter',
  name: BEDRIJF.naam,
  description: T.omschrijving,
  telephone: BEDRIJF.telLink,
  email: BEDRIJF.mail,
  url: `https://${BEDRIJF.domein}/`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BEDRIJF.straat,
    postalCode: BEDRIJF.postcode,
    addressLocality: BEDRIJF.plaats,
    addressCountry: 'NL',
  },
  areaServed: { '@type': 'Country', name: 'Nederland' },
  // Openingstijden (doorgegeven via Armando, 27-10-2026). Alleen hier en bewust in geen
  // enkele zin op de pagina: een zichtbare regel "elke dag open van 07:00 tot 23:00" is
  // een belofte over bereikbaarheid en die hoort hij zelf gezegd te hebben. De tijden
  // komen uit BEDRIJF, zodat een latere zichtbare regel uit dezelfde waarde komt en de
  // twee niet uit elkaar kunnen lopen - Google wil dat structured data de zichtbare
  // inhoud weergeeft, dus twee plekken betekent dat er een fout is.
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: OPEN_DAGEN,
    opens: BEDRIJF.openVan,
    closes: BEDRIJF.openTot,
  }],
  // Zijn Google-bedrijfsprofiel (vraag Armando, 27-10-2026). `sameAs` is de plek waar je
  // Google vertelt dat deze site en die entiteit hetzelfde bedrijf zijn; het profiel wijst
  // sinds de verhuizing al terug naar dit domein, dus hiermee wijzen ze naar elkaar.
  //
  // Het adres komt uit GBP.cid en staat hier niet uitgeschreven: de cid is het enige dat
  // Google zelf gebruikt om dit profiel aan te duiden, en een url met een getal erin dat
  // op twee plekken staat loopt uit de pas. tools/vooraf.mjs toetst op de gebouwde pagina
  // dat deze url er echt staat en dat de cid erin dezelfde is als in inhoud.mjs.
  sameAs: [GBP.url],
  // Schilderwerk stond hier niet in, terwijl het de helft van zijn bedrijf is en zijn
  // advertentie ermee opent. Google las de site daardoor net zo smal als een bezoeker
  // hem las (feedback Armando, 20-10-2026).
  // Traprenovatie stond hier tot 20-10-2026 en is eruit: die dienst doet Pascal niet
  // meer. Een dienst in de structured data laten staan die hij niet meer levert is
  // vragen om een aanvraag die hij moet weigeren.
  knowsAbout: [
    'Renovlies', 'Vliesbehang', 'Glasweefselbehang',
    'Binnenschilderwerk', 'Buitenschilderwerk', 'Sauswerk',
  ],
  identifier: { '@type': 'PropertyValue', name: 'KVK', value: BEDRIJF.kvk },
}

// Kop, topbalk, header, menulade, voet en zwevende balk staan sinds de tweede pagina
// in functies met `basis` erin, zodat er maar een versie van bestaat. De vorige vorm
// was een template met vaste `#ankers`: die klopt per definitie op een onderpagina niet.
/**
 * `noindex` staat op twee dingen tegelijk: op een niet-live bouw (de LIVE-vlag) en op
 * de 404. Die laatste draagt hem ALTIJD, ook in een live bouw, en heeft daarom ook geen
 * canonical: een foutpagina die naar zichzelf wijst vraagt Google om hem op te nemen.
 */
function hoofd({ titel, omschrijving, pad, data, noindex = false }) {
  const dicht = noindex || !LIVE
  return `<!doctype html>
<html lang="nl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(titel)}</title>
<meta name="description" content="${esc(omschrijving)}">
${noindex ? '' : `<link rel="canonical" href="https://${BEDRIJF.domein}${pad}">\n`}${dicht ? '<meta name="robots" content="noindex,nofollow">\n' : ''}<meta property="og:type" content="website">
<meta property="og:url" content="https://${BEDRIJF.domein}${pad}">
<meta property="og:site_name" content="${esc(BEDRIJF.kort)}">
<meta property="og:title" content="${esc(titel)}">
<meta property="og:description" content="${esc(omschrijving)}">
<meta property="og:locale" content="nl_NL">
<meta name="theme-color" content="#0B1E8A">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800&family=Inter:wght@400;500;600;700;800&display=swap">
<link rel="stylesheet" href="/__CSS__">
<script type="application/ld+json">${JSON.stringify(data)}</script>
</head>
<body>
`
}

/** `hier` is het pad van de pagina zelf, voor aria-current in de navigatie. */
function chroom(basis, hier) {
  const nu = (pad) => (pad === hier ? ' aria-current="page"' : '')
  return `
<header class="kop-site"><div class="wrap">
  <a class="merk" href="${basis || '#top'}" aria-label="${esc(BEDRIJF.naam)}"><img src="/logo.svg" width="1420" height="540" alt="${esc(BEDRIJF.naam)}"></a>
  <nav class="hoofdnav" aria-label="Hoofdmenu">
    <a href="${ank(basis, 'renovlies')}">${esc(T.nav.renovlies)}</a>
    <a href="${ank(basis, 'prijzen')}">${esc(T.nav.prijzen)}</a>
    <a href="${PAD_WERKWIJZE}"${nu(PAD_WERKWIJZE)}>${esc(T.nav.werkwijze)}</a>
    <a href="${ank(basis, 'werk')}">${esc(T.nav.werk)}</a>
    <a href="${ank(basis, 'vragen')}">${esc(T.nav.vragen)}</a>
  </nav>
  <a class="knop knop-p" href="#offerte">${esc(T.nav.knop)}</a>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="lade" aria-label="${esc(T.nav.menu)}">
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>
  </button>
</div></header>

<div class="lade" id="lade" role="dialog" aria-modal="true" aria-label="${esc(T.nav.menu)}">
  <div class="lade-in">
    <div class="lade-top">
      <img src="/logo.svg" width="1420" height="540" alt="${esc(BEDRIJF.naam)}">
      <button class="lade-sluit" id="lade-sluit" type="button" aria-label="${esc(T.nav.sluit)}">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="5" y1="5" x2="19" y2="19"/><line x1="19" y1="5" x2="5" y2="19"/></svg>
      </button>
    </div>
    <nav class="lade-nav" aria-label="${esc(T.nav.menu)}">
      ${ladeItems(basis)}
    </nav>
    <div class="lade-voet">
      <a class="knop knop-p" href="#offerte">${esc(T.nav.knop)}</a>
      <a class="lade-tel" href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a>
    </div>
  </div>
</div>
`
}

/**
 * Het offerteblok, op ELKE pagina het laatste blok voor de voet (Armando, 20-10-2026:
 * "op de homepagina eindig je hiermee en dan ga je naar de footer, ik zou graag elke
 * pagina zo afsluiten"). Stond eerst alleen op de startpagina; een bezoeker die via
 * Google op /werkwijze/ binnenkomt las daar de hele werkwijze en kwam dan uit bij een
 * knop die hem naar een andere pagina stuurde om pas daar iets te kunnen invullen.
 *
 * Het blok heeft geen `basis` nodig: alle links erin zijn tel:, mailto: of wa.me, dus
 * hij staat op beide pagina's letterlijk hetzelfde. Het formulier zelf werkt alleen
 * met JS_OFFERTE erbij - die twee horen bij elkaar en het controlescript zakt als er
 * een pagina is met het een zonder het ander.
 *
 * `pad` is het adres van de pagina waar het blok op staat; dat gaat als `herkomst`
 * mee in een verborgen veld, zodat de mail aan Pascal zegt of de aanvraag van de
 * startpagina of van /werkwijze/ komt.
 *
 * Drie velden die geen bezoeker ziet, en waarom ze er zo staan:
 *
 *  - `website` is het lokvink dat Turnstile vervangt. Geen extra resource, geen
 *    secret en geen verzoek naar een derde voor iemand die alleen een prijs wil. Een
 *    bot die dat veld vult krijgt {"ok":true} en er wordt niets opgeslagen en niets
 *    gemaild. Hij staat op display:none, want dat houdt hem ook uit de toetsvolgorde
 *    EN uit wat een schermlezer voorleest; buiten beeld schuiven met left:-9999px
 *    laat hem die twee nog wel halen.
 *  - `herkomst` staat in de mail aan Pascal en niet in de bevestiging: de bezoeker
 *    hoeft niet te lezen op welke pagina hij stond, dat is een systeem dat zijn eigen
 *    leidingwerk laat zien.
 *  - de uitkomstregel draagt role="status", dus een schermlezer leest de melding voor
 *    zonder dat de focus verspringt. Leeg tot er iets te melden is (`:empty`).
 *
 * Deze uitleg staat hier en NIET als html-commentaar in het blok. Dat is de les van
 * 25-10-2026: zo'n notitie gaat mee de pagina op, en toen stonden er vier in de
 * broncode van de live site, waarvan drie met Armando's naam erin en een die zei welke
 * foto niet zo best was. controleer.mjs zakt sindsdien op elk commentaar in dist/.
 */
function offerteBlok(pad) {
  return `
<section class="op-mist" id="offerte">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(T.offerte.boven)}</p>
      <h2>${esc(T.offerte.kop)}</h2><p>${esc(T.offerte.lead)}</p></div>
    <div class="offerte">
      <form class="formulier" id="aanvraag" method="post" action="${FORM_PAD}" novalidate>
        <div><label class="veld" for="f-naam">${esc(T.offerte.naam)}</label><input type="text" id="f-naam" name="firstName" autocomplete="name" required></div>
        <div><label class="veld" for="f-mail">${esc(T.offerte.mail)}</label><input type="email" id="f-mail" name="email" autocomplete="email" required></div>
        <div><label class="veld" for="f-tel">${esc(T.offerte.tel)}</label><input type="tel" id="f-tel" name="tel" autocomplete="tel"></div>
        <div><label class="veld" for="f-plaats">${esc(T.offerte.plaats)}</label><input type="text" id="f-plaats" name="plaats" autocomplete="address-level2"></div>
        ${/* step="any" en niet step="10".

              Hier zat tot 26-10-2026 een echte fout, en hij werd pas zichtbaar doordat
              het formulier die dag ging VALIDEREN. `min="1" step="10"` betekent voor de
              browser: geldig zijn 1, 11, 21, 31 ... Dus 100, 120, 140 en 85 waren alle
              vier stepMismatch - en 100 is precies het getal dat iemand hier het eerst
              intypt, want dat is de ondergrens die Pascal zelf noemt.

              Zolang het formulier alleen een WhatsApp-bericht opbouwde viel dat niemand
              op: er werd nooit iets gecontroleerd. Met `required` erbij en een
              checkValidity() in de verzendknop blokkeerde het stil de hele aanvraag, en
              de bezoeker las alleen "het versturen lukte niet" zonder te zien welk veld
              het was. Gevonden door de proef op de live site, niet door te kijken.

              step="any" neemt elk getal aan. Dat is wat dit veld hoort te doen: het is
              een schatting van een bezoeker en geen maat die in stappen van tien komt.
              controleer.mjs zakt nu op elke step die niet "any" of "1" is. */ ''}
        <div><label class="veld" for="f-m2">${esc(T.offerte.m2)}</label><input type="number" id="f-m2" name="m2" min="1" step="any" inputmode="numeric"></div>
        <div><label class="veld" for="f-soort">${esc(T.offerte.soort)}</label>
          <select id="f-soort" name="soort">
            <option>${esc(T.offerte.soort1)}</option>
            <option>${esc(T.offerte.soort2)}</option>
            <option>${esc(T.offerte.soort3)}</option>
            <option>${esc(T.offerte.soort4)}</option>
            <option>${esc(T.offerte.soort5)}</option>
            <option>${esc(T.offerte.soort6)}</option>
            <option>${esc(T.offerte.soort7)}</option>
          </select></div>
        <div class="heel"><label class="veld" for="f-bericht">${esc(T.offerte.bericht)}</label>
          <textarea id="f-bericht" name="bericht" placeholder="${esc(T.offerte.berichtHulp)}"></textarea></div>
        <div class="lokvink" aria-hidden="true"><label for="f-website">Website</label><input type="text" id="f-website" name="website" tabindex="-1" autocomplete="off"></div>
        <input type="hidden" name="herkomst" value="${esc(pad)}">
        <div class="heel vrijhouden"><button class="knop knop-p" type="submit" id="verstuur">${esc(T.offerte.knopVerstuur)}</button></div>
        <div class="heel vrijhouden"><a class="knop knop-l" id="naar-wa" href="https://wa.me/${BEDRIJF.wa}" target="_blank" rel="noopener">${esc(T.offerte.knopWa)}</a></div>
        <p class="uitkomst heel" id="uitkomst" role="status" aria-live="polite"></p>
        <p class="kleine-regel heel">${esc(T.offerte.privacy)}</p>
      </form>
      <aside class="zijpaneel">
        <h3>${esc(T.offerte.bellen)}</h3>
        <dl>
          <div><dt>Telefoon</dt><dd><a href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a></dd></div>
          <div><dt>E-mail</dt><dd><a href="mailto:${BEDRIJF.mail}">${esc(BEDRIJF.mail)}</a></dd></div>
          <div><dt>Adres</dt><dd>${esc(BEDRIJF.straat)}<br>${esc(BEDRIJF.postcode)} ${esc(BEDRIJF.plaats)}</dd></div>
          <div><dt>${esc(T.voet.kvkLabel)}</dt><dd>${esc(BEDRIJF.kvk)}</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</section>
`
}

/**
 * Het formulier verstuurt de aanvraag echt, sinds de verhuizing van 26-10-2026.
 *
 * Tot die dag bundelde dit script de antwoorden tot een bericht en opende het WhatsApp
 * of de mail. Dat werkte, maar het liet de bezoeker met niets achter: geen kopie, geen
 * bevestiging, en bij een geblokkeerd venster ook geen aanvraag - en dat laatste is
 * niet te onderscheiden van iemand die besloot niets te versturen.
 *
 * Nu gaat hij naar ${FORM_PAD} op onze eigen Worker (@jiw/cloudflare-forms): de
 * aanvraag wordt opgeslagen, Pascal krijgt een mail en de bezoeker een bevestiging in
 * zijn huisstijl.
 *
 * Drie dingen die hier bewust zo staan:
 *
 *  - Het `<form>` heeft een echte `method` en `action`. Dit script onderschept hem
 *    alleen; valt javascript weg, dan post de browser zelf en krijgt de bezoeker de
 *    json van de worker te zien. Dat is lelijk maar het is geen verloren aanvraag.
 *  - De WhatsApp-knop houdt zijn voorgevulde bericht. Wie liever appt hoeft zijn
 *    gegevens niet twee keer te typen.
 *  - Na een geslaagde verzending gaat de knop op slot. Zonder dat levert twee keer
 *    tikken op een trage verbinding twee aanvragen op, en dan belt Pascal twee keer
 *    over dezelfde wand.
 */
const JS_OFFERTE = `
  var v=function(id){var e=document.getElementById(id);return e&&e.value?e.value.trim():''};
  function bericht(){
    var r=[];
    if(v('f-naam'))r.push('Naam: '+v('f-naam'));
    if(v('f-mail'))r.push('E-mail: '+v('f-mail'));
    if(v('f-plaats'))r.push('Plaats: '+v('f-plaats'));
    if(v('f-tel'))r.push('Telefoon: '+v('f-tel'));
    if(v('f-m2'))r.push('Ongeveer '+v('f-m2')+' m2');
    r.push('Nodig: '+v('f-soort'));
    if(v('f-bericht'))r.push('',v('f-bericht'));
    return 'Offerteaanvraag via de website\\n\\n'+r.join('\\n');
  }
  var form=document.getElementById('aanvraag');
  var knop=document.getElementById('verstuur');
  var uit=document.getElementById('uitkomst');
  function bij(){
    document.getElementById('naar-wa').href='https://wa.me/${BEDRIJF.wa}?text='+encodeURIComponent(bericht());
  }
  form.addEventListener('input',bij);
  form.addEventListener('change',bij);
  bij();
  var klaar=false;
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(klaar)return;
    // De browser doet de eerste controle (required op naam en e-mail). novalidate
    // staat op het formulier zodat dit script de melding plaatst en niet de browser
    // een ballonnetje bij een veld dat onder de zwevende balk kan liggen.
    // reportValidity en niet checkValidity: die eerste laat de browser zijn eigen
    // melding bij het veld zelf zien ("vul een geldig e-mailadres in") en zet de focus
    // erheen. Met alleen checkValidity stond er een algemene regel onderaan het
    // formulier en moest de bezoeker zelf uitzoeken welk veld hij fout had - dat was op
    // 26-10-2026 precies wat de m2-fout zo lang onzichtbaar hield.
    if(!form.reportValidity()){
      uit.className='uitkomst heel mis';
      uit.textContent=${JSON.stringify(T.offerte.mislukt)};
      return;
    }
    knop.disabled=true;
    uit.className='uitkomst heel bezig';
    uit.textContent=${JSON.stringify(T.offerte.bezig)};
    fetch(form.action,{method:'POST',body:new FormData(form)})
      .then(function(r){return r.json().catch(function(){return {ok:r.ok}})})
      .then(function(d){
        if(d&&d.ok){
          klaar=true;
          uit.className='uitkomst heel goed';
          uit.textContent=${JSON.stringify(T.offerte.gelukt)};
          form.reset();
          bij();
          return;
        }
        knop.disabled=false;
        uit.className='uitkomst heel mis';
        // De worker stuurt bij een afgekeurd veld zijn eigen nederlandse melding mee.
        // Die is specifieker dan de onze ("vul een geldig e-mailadres in"), dus die
        // gaat voor; onze regel is de terugval.
        uit.textContent=(d&&d.message)?d.message:${JSON.stringify(T.offerte.mislukt)};
      })
      .catch(function(){
        knop.disabled=false;
        uit.className='uitkomst heel mis';
        uit.textContent=${JSON.stringify(T.offerte.mislukt)};
      });
  });`

// De voet en de zwevende knoppen hebben sinds 20-10-2026 geen anker meer nodig: de
// zwevende knoppen bellen en appen rechtstreeks, dus er is geen pad meer dat per
// pagina verschilt.
function voetBlok() {
  return `
<footer><div class="wrap">
  <div class="voet">
    <div>
      <img src="/logo-licht.svg" width="1420" height="540" alt="${esc(BEDRIJF.naam)}">
      <p>${esc(T.voet.over)}</p>
    </div>
    <div><h3>${esc(T.voet.diensten)}</h3><ul>
      ${['d1', 'd1b', 'd2', 'd3', 'd4', 'd5'].map((k) => `<li>${esc(T.voet[k])}</li>`).join('\n      ')}
    </ul></div>
    <div><h3>${esc(T.voet.contact)}</h3><ul>
      <li><a href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a></li>
      <li><a href="mailto:${BEDRIJF.mail}">${esc(BEDRIJF.mail)}</a></li>
      <li>${esc(BEDRIJF.straat)}<br>${esc(BEDRIJF.postcode)} ${esc(BEDRIJF.plaats)}</li>
      <li>${esc(T.voet.kvkLabel)} ${esc(BEDRIJF.kvk)}</li>
    </ul></div>
  </div>
  <div class="voet-onder">
    <span>&copy; ${new Date().getFullYear()} ${esc(T.voet.rechten)}</span>
    <span>${esc(BEDRIJF.plaats)}</span>
  </div>
</div></footer>

<div class="zwevend" id="zwevend">
  <a class="zwevend-wa" href="https://wa.me/${BEDRIJF.wa}" target="_blank" rel="noopener">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.7 4.8-1.3A10 10 0 1012 2zm0 2a8 8 0 016.6 12.5l-.3.4.7 2.5-2.6-.7-.4.2A8 8 0 1112 4zm-3.4 4c-.2 0-.5.1-.7.3-.3.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.7 2.7 4.2 3.7 2 .8 2.4.7 2.9.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2l-.5-.3-1.6-.8c-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.4.1-.5l.4-.5c.1-.2.2-.3.2-.5s0-.3-.1-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4z"/></svg>
    <span>${esc(T.nav.appen)}</span>
  </a>
  <a class="zwevend-bel" href="tel:${BEDRIJF.telLink}">
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 006.6 6.6l2.2-2.2a1 1 0 011-.24 11.4 11.4 0 003.6.58 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.4 11.4 0 00.58 3.6 1 1 0 01-.25 1z"/></svg>
    <span>${esc(T.nav.bellen)}</span>
  </a>
</div>
`
}

// Het javascript dat op BEIDE pagina's hoort: het telefoonmenu en de zwevende balk.
// De rest (rekenhulp, kleurstrook, werkstrook, formulier) staat alleen op de
// startpagina en blijft in dat ene blok onderaan die pagina.
const JS_CHROOM = `
  // ---- telefoonmenu
  var lade=document.getElementById('lade'),burger=document.getElementById('burger');
  function menu(aan){
    lade.classList.toggle('aan',aan);
    document.body.classList.toggle('op-slot',aan);
    burger.setAttribute('aria-expanded',aan?'true':'false');
    if(aan)document.getElementById('lade-sluit').focus();else burger.focus();
  }
  burger.addEventListener('click',function(){menu(!lade.classList.contains('aan'))});
  document.getElementById('lade-sluit').addEventListener('click',function(){menu(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&lade.classList.contains('aan'))menu(false)});
  lade.querySelectorAll('a[href*="#"]').forEach(function(a){a.addEventListener('click',function(){menu(false)})});
  lade.querySelectorAll('.lade-uit').forEach(function(b){
    b.addEventListener('click',function(){
      var item=b.parentNode,open=item.classList.toggle('open');
      b.setAttribute('aria-expanded',open?'true':'false');
    });
  });

  // ---- zwevende balk: komt omhoog na ${ZWEEF_NA} px scrollen. Dat is een vaste
  // afstand en niet "zodra de hero voorbij is": die hero is op een telefoon ruim
  // 800 px hoog, dus de balk kwam pas na twee schermen (feedback Armando,
  // 20-10-2026). Gemeten bij mts-vloerverwarming met meet-mts.mjs: daar verschijnt
  // hij tussen 300 en 320 px. Dezelfde drempel werkt op beide pagina's, ook op
  // /werkwijze/ waar de kop lager is.
  var zwevend=document.getElementById('zwevend'),bezig=false,typt=false;

  // De balk gaat weg zodra hij over een knop valt die de bezoeker nodig heeft, en
  // zodra er in een veld getypt wordt. De knoppenrijen dragen daarvoor .vrijhouden.
  var vrij=[].slice.call(document.querySelectorAll('.vrijhouden'));
  function botst(){
    var z=zwevend.getBoundingClientRect();
    if(!z.width)return false;
    for(var i=0;i<vrij.length;i++){
      var el=vrij[i];
      if(el.offsetParent===null)continue;            // zit in een verborgen stap
      var r=el.getBoundingClientRect();
      if(!r.width||!r.height)continue;
      if(r.bottom>z.top-14&&r.top<z.bottom+14&&r.right>z.left-14&&r.left<z.right+14)return true;
    }
    return false;
  }
  function zweef(){
    bezig=false;
    var aan=(window.pageYOffset||document.documentElement.scrollTop)>${ZWEEF_NA};
    zwevend.classList.toggle('aan',aan);
    zwevend.classList.toggle('weg',aan&&(typt||botst()));
  }
  function nameten(){if(!bezig){bezig=true;requestAnimationFrame(zweef)}}
  addEventListener('scroll',nameten,{passive:true});
  addEventListener('resize',nameten);
  // Het toetsenbord verkleint op iOS het zichtbare deel van het scherm, niet de
  // pagina: een vaste balk kruipt dan mee omhoog en komt over het veld te staan.
  addEventListener('focusin',function(e){
    if(e.target.matches('input,select,textarea')){typt=true;zweef()}
  });
  addEventListener('focusout',function(e){
    if(e.target.matches('input,select,textarea')){typt=false;setTimeout(zweef,60)}
  });
  // Een stap in de rekenhulp of een uitgeklapt blok verzet de knoppen zonder dat er
  // gescrold wordt, dus daar moet ook opnieuw gemeten worden.
  document.addEventListener('click',function(){setTimeout(zweef,80)});
  zweef();`

const htmlHome = hoofd({ titel: T.titel, omschrijving: T.omschrijving, pad: '/', data: ZAAK }) + chroom('', '/') + `
<main id="top">

<div class="hero">
  <div class="hero-foto">${img('woonkeuken-groen', 'Ruime woonkeuken met een olijfgroen getexte wand en houten spanten', '100vw', { laden: 'eager', prio: true })}</div>
  <div class="wrap">
    <div>
      ${/* Geen kopregel boven de h1: Armando streepte "Renovlies en glasweefsel" door
            op 20-10-2026. Het stond vlak boven een kop die hetzelfde zegt, en de woorden
            zelf staan in de paginatitel, de lopende balk en de voet. */ ''}<h1>${esc(T.hero.h1a)}<span>${esc(T.hero.h1b)}</span></h1>
      <p class="hero-lead">${esc(T.hero.lead)}</p>
      <ul class="vinkjes">
        ${[T.hero.punt1, T.hero.punt2, T.hero.punt3].map((p) => `<li>${vink}<span>${esc(p)}</span></li>`).join('\n        ')}
      </ul>
      <div class="hero-knoppen">
        <a class="knop knop-p" href="#offerte">${esc(T.nav.knop)}</a>
        <a class="knop knop-o" href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a>
      </div>
    </div>

    <div class="kaart" id="prijzen">
      <div class="kaart-kop">
        <h2>${esc(T.kaart.kop)}</h2>
        <span class="kaart-badge">${esc(T.kaart.badge)}</span>
      </div>
      <ol class="rail" id="rail">
        <li class="aan"><i>${nr(0)}</i><span>${esc(T.kaart.s1)}</span></li>
        <li><i>${nr(1)}</i><span>${esc(T.kaart.s2)}</span></li>
        <li><i>${nr(2)}</i><span>${esc(T.kaart.s3)}</span></li>
      </ol>

      <div class="paneel" data-p="1">
        <p class="paneel-l">${esc(T.kaart.kies)}</p>
        <label class="pakket">
          <input type="radio" name="pakket" value="${PRIJZEN.plakken}" checked>
          <span><b>${esc(T.kaart.pakket1)}</b><small>${esc(T.kaart.pakket1sub)}</small></span>
          <span class="prijs"><i>${esc(T.kaart.vanaf)}</i>&euro;&nbsp;${eur(PRIJZEN.plakken)}<i>${esc(T.kaart.perM2)}</i></span>
        </label>
        <label class="pakket">
          <input type="radio" name="pakket" value="${PRIJZEN.plakkenTexen}">
          <span><b>${esc(T.kaart.pakket2)}</b><small>${esc(T.kaart.pakket2sub)}</small></span>
          <span class="prijs"><i>${esc(T.kaart.vanaf)}</i>&euro;&nbsp;${eur(PRIJZEN.plakkenTexen)}<i>${esc(T.kaart.perM2)}</i></span>
        </label>
        <label class="pakket">
          <input type="radio" name="pakket" value="${PRIJZEN.plakkenTexen2}">
          <span><b>${esc(T.kaart.pakket3)}</b><small>${esc(T.kaart.pakket3sub)}</small></span>
          <span class="prijs"><i>${esc(T.kaart.vanaf)}</i>&euro;&nbsp;${eur(PRIJZEN.plakkenTexen2)}<i>${esc(T.kaart.perM2)}</i></span>
        </label>
        <div class="paneel-knoppen vrijhouden"><button class="knop knop-p" type="button" data-naar="2">${esc(T.kaart.verder)}</button></div>
      </div>

      <div class="paneel" data-p="2" hidden>
        <p class="paneel-l"><label for="m2">${esc(T.kaart.m2vraag)}</label></p>
        <div class="teller">
          <button class="teller-k" type="button" data-stap="-10" aria-label="${esc(T.kaart.minder)}">&minus;</button>
          ${/* Ook hier step="any" en niet step="10", om dezelfde reden als bij het
                m2-veld in het offerteformulier - en dit veld droeg de fout het duidelijkst:
                met min="1" step="10" is zijn EIGEN beginwaarde 120 ongeldig, want geldig
                waren alleen 1, 11, 21 ... Dat blokkeert hier niets (de rekenhulp leest de
                waarde rechtstreeks en er wordt niets gevalideerd), maar het zet het veld
                wel permanent op :invalid - dus zodra iemand ooit een regel als
                `input:invalid{border-color:red}` toevoegt, staat de rekenhulp bij het
                laden rood. Het stappen met tien was alleen voor de pijltjes van de
                browser, en die zijn hier bijzaak: de min- en plusknop ernaast zijn eigen
                javascript en stappen zelf met tien. */ ''}
          <input type="number" id="m2" min="1" step="any" value="120" inputmode="numeric">
          <span class="teller-e">${esc(T.kaart.eenheid)}</span>
          <button class="teller-k" type="button" data-stap="10" aria-label="${esc(T.kaart.meer)}">+</button>
        </div>
        <small class="paneel-h">${esc(T.kaart.m2hulp)}</small>
        <p class="paneel-waarschuwing" id="m2-laag" hidden>${esc(T.kaart.ondergrens)} ${esc(T.kaart.straal)}</p>
        <p class="paneel-waarschuwing" id="m2-leeg" hidden>${esc(T.kaart.leeg)}</p>
        <div class="paneel-knoppen vrijhouden">
          <button class="knop knop-t" type="button" data-naar="1">${esc(T.kaart.terug)}</button>
          <button class="knop knop-p" type="button" data-naar="3">${esc(T.kaart.toon)}</button>
        </div>
      </div>

      <div class="paneel" data-p="3" hidden>
        <p class="paneel-l">${esc(T.kaart.uitkomst)}</p>
        <div class="res">
          <p class="res-meta"><b id="res-pakket">${esc(T.kaart.pakket1)}</b> &middot; <span id="res-m2"></span> &middot; ${esc(T.kaart.vanaf)}</p>
          <p class="res-bedrag" id="res-bedrag">&euro; 0</p>
          <p class="res-obv">${esc(T.kaart.obv)} <span id="res-tarief"></span> ${esc(T.kaart.perM2)}</p>
        </div>
        <div class="paneel-knoppen vrijhouden">
          <button class="knop knop-t" type="button" data-naar="2">${esc(T.kaart.terug)}</button>
          <a class="knop knop-p" href="#offerte">${esc(T.kaart.knop)}</a>
        </div>
      </div>

      <p class="kleine-regel">${esc(T.kaart.inbegrepen)} ${esc(T.kaart.btw)} ${esc(T.kaart.klein)}</p>
    </div>
  </div>
</div>

<div class="loper" aria-hidden="true"><div class="loper-spoor">${loperSpoor}</div></div>

<section id="renovlies">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(T.usp.boven)}</p>
      <h2>${esc(T.usp.kop)}</h2></div>
    <div class="punten">
        ${punten}
    </div>
  </div>
</section>

<section class="op-mist">
  <div class="wrap">
    <div class="vakman">
      <div class="vakman-foto">
        ${img('pascal-portret', 'Pascal Hulskers in werkkleding met een plamuurmes in zijn hand', '(max-width:1040px) 100vw, 46vw')}
        <span class="vlag">${esc(T.vakman.boven)}</span>
      </div>
      <div class="vakman-tekst">
        <h2>${esc(T.vakman.kop)}</h2>
        <p>${esc(T.vakman.b1)}</p>
        <p>${esc(T.vakman.b2)}</p>
        <p>${esc(T.vakman.b3)}</p>
        <blockquote><p>&ldquo;${esc(T.vakman.citaat)}&rdquo;</p><cite>${esc(T.vakman.citaatBron)}</cite></blockquote>
        <a class="knop knop-d" href="#offerte">${esc(T.vakman.knop)}</a>
      </div>
    </div>
  </div>
</section>

<section class="op-nacht" id="kleur">
  <div class="wrap">
    <div class="kleurkop">
      <div><p class="boven">${esc(T.kleuren.boven)}</p><h2>${esc(T.kleuren.kop)}</h2></div>
      <p>${esc(T.kleuren.lead)}</p>
    </div>
    <div class="kleuren" id="kleuren">
        ${KLEUR_KAARTEN}
    </div>
    <div class="kleurstippen" id="kleurstippen" aria-hidden="true"><span class="aan"></span><span></span><span></span></div>
    <p class="kleurvoet">+ ${esc(T.kleuren.voet)}</p>
  </div>
</section>

<section class="op-mist" id="verf">
  <div class="wrap">
    <div class="verfkop">
      <div><p class="boven">${esc(T.verf.boven)}</p><h2>${esc(T.verf.kop)}</h2></div>
      <p>${esc(T.verf.lead)}</p>
    </div>
    <div class="verfkaarten">
        ${VERF_KAARTEN}
    </div>
    ${/* Schrobklasse 1 ging er op 20-10-2026 uit op een streep van Armando en staat er
         sinds 25-10-2026 weer op: de klant wil hem erop. Zelfde klasse als toen, andere
         volgorde - eerst wat de bewoner eraan heeft, dan de norm. */ ''}
    <p class="blok-voet">${esc(T.verf.voet)}</p>
  </div>
</section>

<section id="werk">
  <div class="wrap">
    <div class="dband" id="diensten">
      <div class="rand">
        <div class="dtekst">
          <p class="boven">${esc(T.diensten.boven)}</p>
          <h2>${esc(T.diensten.kop)}</h2>
          <p>${esc(T.diensten.lead)}</p>
        </div>
        <ul class="dlijst">
          <li>${esc(T.diensten.a)}</li>
          <li>${esc(T.diensten.b)}</li>
          <li>${esc(T.diensten.c)}</li>
        </ul>
        <a class="dknop" href="#offerte">${esc(T.diensten.knop)}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a>
      </div>
    </div>

    <div class="sectiekop"><p class="boven">${esc(T.werk.boven)}</p>
      <h2>${esc(T.werk.kop)}</h2></div>
    <p class="werkteller"><b id="werk-nu">01</b> / ${nr(WERK.length - 1)}</p>
    <div class="werk" id="werkrail" tabindex="0" role="group" aria-label="${esc(T.werk.kop)}">
        ${WERK_KAARTEN}
    </div>
    <div class="werkduim" id="werkduim">
        ${WERK_DUIMEN}
    </div>
  </div>
</section>

<section class="op-mist" id="werkwijze">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(T.stappen.boven)}</p>
      <h2>${esc(T.stappen.kop)}</h2></div>
    <div class="rijen">
        ${stappen}
    </div>
    <p class="meerlink"><a href="${PAD_WERKWIJZE}">${esc(T.stappen.meer)}
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" aria-hidden="true"><path d="M5 12h13M13 6l6 6-6 6"/></svg></a></p>
  </div>
</section>

<section id="vragen">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(T.vragen.boven)}</p>
      <h2>${esc(T.vragen.kop)}</h2><p>${esc(T.vragen.lead)}</p></div>
    <div class="vragenlijst">
        ${vragen}
    </div>
  </div>
</section>

${offerteBlok('/')}
<section class="slot">
  <div class="wrap">
    <div><h2>${esc(T.slot.kop)}</h2><p>${esc(T.slot.lead)}</p></div>
    <div class="slot-knoppen">
      <a class="knop knop-l" href="#offerte">${esc(T.slot.knop)}</a>
      <a class="knop knop-o" href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a>
    </div>
  </div>
</section>

</main>
` + voetBlok() + `
<script>
(function(){
${JS_CHROOM}

  // ---- kleurkaarten: welke stip brandt er op een telefoon
  var strook=document.getElementById('kleuren'),stippen=document.getElementById('kleurstippen');
  strook.addEventListener('scroll',function(){
    var k=strook.children[0];if(!k)return;
    var i=Math.round(strook.scrollLeft/(k.offsetWidth+12));
    [].forEach.call(stippen.children,function(s,n){s.classList.toggle('aan',n===i)});
  },{passive:true});

  // ---- werkstrook: teller en duimnagels lopen mee, een duimnagel schuift de strook
  var wrail=document.getElementById('werkrail'),wduim=document.getElementById('werkduim'),
      wnu=document.getElementById('werk-nu'),WGAT=16;
  function werkStap(){var k=wrail.children[0];return k?k.offsetWidth+WGAT:1}
  function werkToon(){
    var i=Math.max(0,Math.min(wrail.children.length-1,Math.round(wrail.scrollLeft/werkStap())));
    wnu.textContent=('0'+(i+1)).slice(-2);
    [].forEach.call(wduim.children,function(b,n){
      b.classList.toggle('aan',n===i);
      // De duimnagelrij schuift zelf ook: anders staat de actieve duimnagel bij
      // foto 5 en 6 op een telefoon buiten beeld en lijkt er niets te gebeuren.
      if(n!==i)return;
      if(b.offsetLeft<wduim.scrollLeft)wduim.scrollTo({left:Math.max(0,b.offsetLeft-8),behavior:'smooth'});
      else if(b.offsetLeft+b.offsetWidth>wduim.scrollLeft+wduim.clientWidth)
        wduim.scrollTo({left:b.offsetLeft+b.offsetWidth-wduim.clientWidth+8,behavior:'smooth'});
    });
  }
  wrail.addEventListener('scroll',werkToon,{passive:true});
  [].forEach.call(wduim.children,function(b,n){
    b.addEventListener('click',function(){wrail.scrollTo({left:n*werkStap(),behavior:'smooth'})});
  });
  window.addEventListener('resize',werkToon);

  // ---- rekenhulp in drie stappen
  var m2=document.getElementById('m2'),rail=document.getElementById('rail');
  var panelen=document.querySelectorAll('.paneel'),nu=1;
  function pakket(){
    var r=document.querySelector('input[name=pakket]:checked');
    return {tarief:r?Number(r.value):${PRIJZEN.plakken},naam:r?r.closest('.pakket').querySelector('b').textContent:''};
  }
  function aantal(){return Math.max(1,Math.round(Number(m2.value)||0))}
  function toon(s){
    nu=s;
    panelen.forEach(function(p){p.hidden=Number(p.dataset.p)!==s});
    [].forEach.call(rail.children,function(li,i){
      li.classList.toggle('aan',i+1===s);
      li.classList.toggle('af',i+1<s);
    });
    if(s===3)vul();
    // Alleen met een muis zelf focus geven. Op een telefoon trok dit het toetsenbord
    // omhoog zonder dat de bezoeker ergens op tikte, en dat deed twee dingen tegelijk
    // (Armando, 20-10-2026): Safari op iOS zoomde de hele pagina in, en de zwevende
    // bel- en appknoppen kwamen met het toetsenbord mee over Terug / Toon richtprijs
    // te staan. De min- en plusknoppen staan er juist zodat het zonder toetsenbord kan.
    if(s===2&&window.matchMedia('(hover:hover) and (pointer:fine)').matches)m2.focus();
  }
  // De centen stonden hier tot 25-10-2026 als +',00' achter een toLocaleString, en
  // dat klopte zolang elk tarief een heel getal was. Met 17,50 gaf het "17,5,00".
  // Nu rekent de browser het bedrag zelf af op twee decimalen; een heel bedrag houdt
  // daarmee ",00" en 17,5 wordt 17,50.
  function geld(x){return '\\u20AC '+x.toLocaleString('nl-NL',{minimumFractionDigits:2,maximumFractionDigits:2})}
  function vul(){
    var p=pakket(),n=aantal();
    document.getElementById('res-pakket').textContent=p.naam;
    document.getElementById('res-m2').textContent=n+' '+${JSON.stringify(T.kaart.eenheid)};
    document.getElementById('res-bedrag').textContent=geld(n*p.tarief);
    document.getElementById('res-tarief').textContent=geld(p.tarief);
  }
  // De 100 m2 is geen slot op het invoerveld: wie 40 m2 heeft rekent gewoon door en
  // leest erbij dat de genoemde prijzen vanaf 100 m2 gelden en dat hij vrijblijvend
  // naar een prijs mag vragen. Wat Pascal onder die grens rekent weten we niet.
  function grens(){document.getElementById('m2-laag').hidden=aantal()>=${PRIJZEN.vanafM2}}
  document.querySelectorAll('[data-naar]').forEach(function(b){
    b.addEventListener('click',function(){
      if(Number(b.dataset.naar)===3&&!(Number(m2.value)>0)){
        document.getElementById('m2-leeg').hidden=false;m2.focus();return;
      }
      document.getElementById('m2-leeg').hidden=true;
      toon(Number(b.dataset.naar));
    });
  });
  document.querySelectorAll('[data-stap]').forEach(function(b){
    b.addEventListener('click',function(){
      m2.value=Math.max(10,aantal()+Number(b.dataset.stap));grens();
    });
  });
  m2.addEventListener('input',grens);
  document.querySelectorAll('input[name=pakket]').forEach(function(r){
    r.addEventListener('change',function(){if(nu===3)vul()});
  });
  grens();

${JS_OFFERTE}
})();
</script>
</body>
</html>
`

// ------------------------------------------------- 4b. tweede pagina: /werkwijze/
const W = T.werkwijze

// De bedragen staan in PRIJZEN en de zinnen op deze pagina noemen ze voluit. Lopen
// die twee uit elkaar, dan stopt de build: anders staat er "vanaf 10 euro" in een zin
// terwijl de rekenhulp op de startpagina met een ander tarief rekent.
// Let op de vorm van het bedrag in de tekst: 11 maar 17,50. De oude test zette het
// getal rechtstreeks in een RegExp, en bij 17.5 werd dat `\b17.5\b` - waarin de punt
// elk teken matcht, dus ook de komma van "17,50". Dat werkte per ongeluk goed en zou
// net zo goed "17x50" hebben goedgekeurd. Nu wordt de tekstvorm gezocht en wordt de
// punt ontsnapt.
for (const [sleutel, bedrag] of [
  ['a1_b', PRIJZEN.plakken],
  ['a2_b', PRIJZEN.plakkenTexen],
  ['a8_b', PRIJZEN.plakkenTexen2],
  ['a3_t', PRIJZEN.vanafM2],
  ['a3_b', PRIJZEN.vanafM2],
  ['a6_b', PRIJZEN.vanafM2],
]) {
  const zoek = eurTekst(bedrag)
  if (!new RegExp(`(^|[^\\d,.])${zoek.replace(/[.,]/g, '[.,]')}([^\\d,.]|$)`).test(W[sleutel])) {
    throw new Error(
      `build: werkwijze.${sleutel} noemt ${zoek} niet meer. PRIJZEN en de tekst op /werkwijze/ lopen uit elkaar.`
    )
  }
}

// Hetzelfde voor de gramgewichten. Ze staan in SOORTEN en in de zinnen op beide
// pagina's; lopen die uit elkaar, dan staat er een ander getal in de uitleg dan in de
// vijf redenen, en dat is precies waar een vakman over valt.
// werkwijze.b2_a stond hier tot 25-10-2026 ook in. Die slotzin ("Renovliesbehang van
// 215 gram is daarbij dikker dan...") is er op aanwijzing van Armando uit: dat blok gaat
// over de krimpscheurtjes, en de twee gewichten staan vier blokken hoger al in de kaart
// van renovliesbehang. De eis dat ze op BEIDE pagina's staan verdwijnt daarmee niet -
// die zit in controleer.mjs 15b (werkwijze) en 15c (startpagina), op de gebouwde pagina.
for (const [waar, tekst] of [
  ['usp.b_t', T.usp.b_t],
  ['vragen.a1', T.vragen.a1],
  ['werkwijze.s_a_b', W.s_a_b],
]) {
  for (const g of [SOORTEN.gram, SOORTEN.gramGangbaar]) {
    // usp.b_t is een kop van vier woorden en noemt alleen zijn eigen 215.
    if (waar === 'usp.b_t' && g === SOORTEN.gramGangbaar) continue
    if (!new RegExp(`\\b${g}\\b`).test(tekst)) {
      throw new Error(`build: ${waar} noemt ${g} gram niet meer. SOORTEN en de tekst lopen uit elkaar.`)
    }
  }
}

// De drie soorten naast elkaar. Dit is het blok waar Armando op 25-10-2026 om vroeg,
// en tegelijk de inhoud waarmee deze pagina kan ranken: "wat is renovlies" en
// "renovlies of glasweefsel" worden allebei door uitlegpagina's gewonnen en niet door
// webshops (gemeten, zie bron/seo/serp.json).
//
// De volgorde is de volgorde waarin een bezoeker ze tegen het lichaam houdt: eerst
// waar hij voor kwam, dan de buur die erop lijkt, dan het woord waarmee hij ze
// verwart. Alle drie dezelfde kaart (Armando, 25-10-2026): de derde was gedempt om te
// laten zien dat vliesbehang hier geen optie is, maar dat leest als een afgekeurde
// keuze. Dat het iets anders doet staat in zijn eigen regel en in de alinea.
const wSoorten = ['a', 'b', 'c'].map((k) => `
        <div class="soort">
          <h3>${esc(W['s_' + k + '_kop'])}</h3>
          <p class="wat">${esc(W['s_' + k + '_wat'])}</p>
          <p class="soort-b">${esc(W['s_' + k + '_b'])}</p>
        </div>`).join('')

const wStappen = [1, 2, 3, 4, 5, 6].map(
  (n, i) => `<div><div class="n">${nr(i)}</div><div><h3>${esc(W['s' + n + '_t'])}</h3><p>${esc(W['s' + n + '_b'])}</p></div></div>`
).join('\n        ')

// De drie blokken waarin de referentiesite zijn stappen uitwerkt. Daar gaat het over
// schuurmachines, gramgewicht van het vlies en een verfmerk; dat staat niet in Pascal
// zijn tekst, dus hier staat wat we wel van hem hebben: het voorwerk (doorgegeven via
// Armando, 20-10-2026), de keuze tussen de drie soorten, en hoe het getext wordt.
const wBlokken = [
  // De rolsteiger: een klus in uitvoering tegen een kale wand, dus wat voorwerk is.
  // Hij is op 20-10-2026 even naar de paginakop gegaan en diezelfde dag weer terug,
  // toen de kop de olijfgroene woonkeuken kreeg.
  // De alt-tekst zei tot 25-10-2026 "behangklaar gemaakte wand", en dat is precies de
  // bewering die Pascal die avond afwees. Een alt-tekst wordt voorgelezen en staat in
  // Google Afbeeldingen, dus hij telt gewoon mee als copy (zie de Klinkhamer-regel).
  // Het laatste getal is het AANTAL alinea's. b1 heeft er sinds 25-10-2026 een (Armando
  // streepte de tweede door). Zonder die telling rendert een blok met een ontbrekende
  // _b stil een lege <p>, en een blok waar er juist een bijkomt levert stil een alinea
  // in die niemand besteld heeft. De telling staat hier en de tekst in inhoud.mjs, dus
  // ze moeten het eens zijn of de bouw stopt.
  ['b1', 'nieuwbouw-rolsteiger', 'Rolsteiger tegen een behangklare wand in een woonkamer in aanbouw', 1],
  ['b2', 'fotobehang-bos', 'Hal met fotobehang van een bos over de volledige wand', 2],
  ['b3', 'overloop-taupe', 'Overloop met een warme taupe wand en een witte trapleuning', 2],
].map(([k, foto, alt, alineas], i) => {
  const tweede = W[k + '_b']
  const heeftTweede = typeof tweede === 'string' && tweede.trim() !== ''
  if (heeftTweede !== (alineas === 2)) {
    throw new Error(
      `build: wBlokken telt ${alineas} alinea('s) voor ${k}, maar ${k}_b ` +
        `${heeftTweede ? 'staat er wel' : 'staat er niet'}`
    )
  }
  return `
      <div class="uitleg${i % 2 ? ' uitleg-om' : ''}">
        <div class="uitleg-tekst">
          <p class="boven">${esc(W[k + '_boven'])}</p>
          <h2>${esc(W[k + '_kop'])}</h2>
          <p>${esc(W[k + '_a'])}</p>${heeftTweede ? `
          <p>${esc(tweede)}</p>` : ''}
        </div>
        <figure class="uitleg-foto">${img(foto, alt, '(max-width:860px) 92vw, 46vw')}</figure>
      </div>`
}).join('\n')

// Ook hier leesvolgorde boven nummering: 8 ("plakken en 2x texen") staat direct achter
// 2, want de 16 en de 23 euro zijn alleen naast elkaar te begrijpen, en 7 ("inbegrepen")
// staat achter die drie, want het gaat over wat er in die bedragen zit.
const wAfspraken = [1, 2, 8, 7, 3, 4, 5, 6].map(
  (n) => `<div class="afspraak"><h3>${esc(W['a' + n + '_t'])}</h3><p>${esc(W['a' + n + '_b'])}</p></div>`
).join('\n        ')

const KRUIMELS = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { name: W.kruimelHome, item: `https://${BEDRIJF.domein}/` },
    { name: W.boven, item: `https://${BEDRIJF.domein}${PAD_WERKWIJZE}` },
  ].map((x, i) => ({ '@type': 'ListItem', position: i + 1, name: x.name, item: x.item })),
}

const htmlWerkwijze =
  hoofd({ titel: W.titel, omschrijving: W.omschrijving, pad: PAD_WERKWIJZE, data: KRUIMELS }) +
  chroom('/', PAD_WERKWIJZE) + `
<main id="top">

<div class="paginakop">
  ${/* Vierde foto op deze plek, en de laatste poging is de keuze van Armando zelf:
       dezelfde olijfgroene woonkeuken als de hero van de startpagina. Eerst de
       trapfoto (te donker, bleef een bruine vlek), daarna de taatsdeuren, daarna een
       eigen onderuitsnede van de rolsteiger - die drie waren allemaal "niet zo best".
       Dat is geen toeval: dit is de enige foto in de set die bij 1600 px nog scherp is
       en een vlakke, egale wand laat zien, en dat is wat een kop nodig heeft.
       Twee keer dezelfde foto op EEN pagina leest als een foutje; over twee pagina's
       is het een herkenbare kop. De rolsteiger is daarom weer terug bij het voorwerk,
       waar hij vandaan kwam. Dit gebruikt het bestand van de hero, geen tweede
       uitsnede: zelfde verhouding, zelfde plek, dus ook geen extra download. */ ''}
  <div class="paginakop-foto">${img('woonkeuken-groen', 'Ruime woonkeuken met een olijfgroen getexte wand en houten spanten', '100vw', { laden: 'eager', prio: true })}</div>
  <div class="wrap">
    <nav class="kruimels" aria-label="Kruimelpad">
      <a href="/">${esc(W.kruimelHome)}</a><span aria-hidden="true">/</span><b>${esc(W.boven)}</b>
    </nav>
    <p class="boven">${esc(W.boven)}</p>
    <h1>${esc(W.h1a)}<span>${esc(W.h1b)}</span></h1>
    <p class="hero-lead">${esc(W.lead)}</p>
    <div class="hero-knoppen">
      <a class="knop knop-p" href="#offerte">${esc(T.nav.knop)}</a>
      <a class="knop knop-o" href="tel:${BEDRIJF.telLink}">${esc(BEDRIJF.telWeergave)}</a>
    </div>
  </div>
</div>

<div class="loper" aria-hidden="true"><div class="loper-spoor">${loperSpoor}</div></div>

${/* De drie soorten staan BOVEN de stappen, en dat is geen opmaakkeuze. Wie hier via
     "wat is renovlies" of "renovlies of glasweefsel" binnenkomt, wil het verschil en
     niet eerst zes stappen van een offertetraject. Zelfde reden als bij de opening
     van lijffull-seo: een opening die uitlegt, diagnosticeert niet. */ ''}
<section class="op-mist" id="soorten">
  <div class="wrap">
    <div class="verfkop">
      <div>
        <p class="boven">${esc(W.sBoven)}</p>
        <h2>${esc(W.sKop)}</h2>
      </div>
    </div>
    <div class="soorten">${wSoorten}
    </div>
  </div>
</section>

<section id="stappen">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(W.stapBoven)}</p>
      <h2>${esc(W.stapKop)}</h2></div>
    <div class="rijen">
        ${wStappen}
    </div>
  </div>
</section>

<section class="op-mist" id="uitleg">
  <div class="wrap">
${wBlokken}
  </div>
</section>

<section id="afspraken">
  <div class="wrap">
    <div class="sectiekop"><p class="boven">${esc(W.afsprBoven)}</p>
      <h2>${esc(W.afsprKop)}</h2></div>
    <div class="afspraken">
        ${wAfspraken}
    </div>
    <div class="afspraak-voet">
      <a class="knop knop-p" href="/#prijzen">${esc(W.rekenKnop)}</a>
      <p>${esc(T.kaart.btw)} ${esc(T.kaart.klein)}</p>
    </div>
    <blockquote><p>&ldquo;${esc(T.vakman.citaat)}&rdquo;</p><cite>${esc(T.vakman.citaatBron)}</cite></blockquote>
  </div>
</section>
${offerteBlok(PAD_WERKWIJZE)}
<section class="slot">
  <div class="wrap">
    <div><h2>${esc(W.slotKop)}</h2><p>${esc(W.slotLead)}</p></div>
    <div class="slot-knoppen">
      <a class="knop knop-l" href="#offerte">${esc(T.slot.knop)}</a>
      <a class="knop knop-o" href="/#vragen">${esc(W.vragenKnop)}</a>
    </div>
  </div>
</section>

</main>
` + voetBlok() + `
<script>
(function(){
${JS_CHROOM}
${JS_OFFERTE}
})();
</script>
</body>
</html>
`

// ----------------------------------------------------------------- 5. wegschrijven
fs.rmSync(DIST, { recursive: true, force: true })
fs.mkdirSync(path.join(DIST, 'f'), { recursive: true })

const hash = crypto.createHash('sha256').update(CSS).digest('hex').slice(0, 8)
const cssNaam = `styl.${hash}.css`
fs.writeFileSync(path.join(DIST, cssNaam), CSS)

/*
 * De 404. Dezelfde kop, navigatie en voet als de rest, zodat iemand die hier belandt
 * verder kan in plaats van op een kale foutmelding te stuiten.
 *
 * Geen offerteblok, en dat is de ene plek waar de regel van Armando ("elke pagina
 * eindigt met het offerteblok") niet geldt: dit is geen pagina waar iemand naartoe
 * komt, het is een pagina waar iemand per ongeluk uitkomt. Een formulier aanbieden
 * aan wie net een dood adres aanklikte is het verkeerde moment. De navigatie, de
 * zwevende bel- en appknoppen en de voet staan er wel, dus de weg naar Pascal is er
 * drie keer.
 *
 * controleer.mjs loopt over PAGINAS, en die lijst bevat alleen de twee inhoudspagina's
 * - dus de eisen die bij een inhoudspagina horen (offerteblok, canonical, h1-telling)
 * gaan hier niet over. tools/vooraf.mjs keurt hem apart, met zijn eigen eisen: noindex
 * aanwezig, geen canonical, en niet in de sitemap.
 */
const html404 =
  hoofd({ titel: `${T.nf.titel} - ${BEDRIJF.kort}`, omschrijving: T.nf.lead, pad: '/404', data: ZAAK, noindex: true }) +
  chroom('/', '/404') + `
<section class="op-mist" id="nietgevonden">
  <div class="wrap">
    <div class="sectiekop">
      <p class="boven">404</p>
      <h1>${esc(T.nf.kop)}</h1>
      <p>${esc(T.nf.lead)}</p>
    </div>
    <p class="vrijhouden">
      <a class="knop knop-p" href="/">${esc(T.nf.naarHome)}</a>
      <a class="knop knop-l" href="${PAD_WERKWIJZE}">${esc(T.nf.naarWerkwijze)}</a>
    </p>
  </div>
</section>
${voetBlok()}
<script>
(function(){
${JS_CHROOM}
})();
</script>
</body>
</html>
`

const PAGINAS = [
  ['index.html', htmlHome],
  [path.join('werkwijze', 'index.html'), htmlWerkwijze],
  ['404.html', html404],
]
for (const [bestand, inhoud] of PAGINAS) {
  const uit = path.join(DIST, bestand)
  fs.mkdirSync(path.dirname(uit), { recursive: true })
  fs.writeFileSync(uit, inhoud.replace('__CSS__', cssNaam))
}
const alleHtml = PAGINAS.map(([, h]) => h).join('\n')

/*
 * De hulppagina's. Ze staan NIET in PAGINAS en niet in alleHtml, en dat is met opzet:
 * die lijst voedt de foto-opruiming en de eisen die bij een inhoudspagina horen. Een
 * hulppagina heeft geen kop, geen voet, geen offerteblok en geen plek in de sitemap.
 *
 * De bouw zakt zodra deze lijst en HULP_PADEN in inhoud.mjs uit elkaar lopen, want
 * tools/vooraf.mjs keurt ze op die lijst: een hulppagina die daar niet in staat wordt
 * als inhoudspagina gekeurd en zakt dan op de canonical, de woordvloer en de sitemap.
 */
const HULPPAGINAS = [[path.join('handtekening', 'index.html'), '/handtekening/', paginaHandtekening()]]
{
  const gebouwd = HULPPAGINAS.map(([, adres]) => adres).sort().join('|')
  const verwacht = [...HULP_PADEN].sort().join('|')
  if (gebouwd !== verwacht) {
    throw new Error(`build: hulppagina's ${gebouwd || '(geen)'} komen niet overeen met HULP_PADEN ${verwacht}`)
  }
  for (const [bestand, , inhoud] of HULPPAGINAS) {
    const uit = path.join(DIST, bestand)
    fs.mkdirSync(path.dirname(uit), { recursive: true })
    fs.writeFileSync(uit, inhoud)
  }
}

/*
 * En geen enkele pagina van de site mag ernaartoe linken. Dat is wat een hulppagina
 * hulppagina houdt: hij hangt niet in het menu en niet in de voet, dus hij komt alleen
 * bij wie het adres krijgt toegestuurd. Een link die er stil bij komt zet hem alsnog in
 * de zichtbare site en in de crawl.
 */
for (const adres of HULP_PADEN) {
  if (alleHtml.includes(`href="${adres}"`) || alleHtml.includes(`href="${adres.replace(/\/$/, '')}"`)) {
    throw new Error(`build: een pagina van de site linkt naar de hulppagina ${adres}`)
  }
}

// Alleen foto's die de pagina's ook echt gebruiken gaan mee. Een webp die blijft liggen
// nadat je een kaart vervangen hebt, wordt anders stil mee de Worker op geupload.
const gebruikt = new Set([...alleHtml.matchAll(/f\/([a-z0-9-]+)-\d+\.webp/g)].map((m) => m[1]))
const blijftLiggen = []
for (const f of fs.readdirSync(path.join(PUBLIC, 'f'))) {
  if (!f.endsWith('.webp')) continue
  const naam = f.replace(/-\d+\.webp$/, '')
  if (!gebruikt.has(naam)) { blijftLiggen.push(f); continue }
  fs.copyFileSync(path.join(PUBLIC, 'f', f), path.join(DIST, 'f', f))
}
if (blijftLiggen.length) {
  console.log(`\nniet gebruikt, dus niet meegenomen naar dist/: ${[...new Set(blijftLiggen.map((f) => f.replace(/-\d+\.webp$/, '')))].join(', ')}`)
}

// Logo. De lichte variant is een echte uitknipversie en geen css-filter: de donkere
// letters worden wit, de helderblauwe S houdt zijn kleur. Zie playground/CLAUDE.md.
const logo = fs.readFileSync(path.join(PUBLIC, 'logo.svg'), 'utf8')
fs.writeFileSync(path.join(DIST, 'logo.svg'), logo)
const licht = logo.replace('fill="#0B1E8A"', 'fill="#FFFFFF"').replace('fill="#111827"', 'fill="#E8ECF6"')
if (licht === logo) throw new Error('build: lichte logovariant niet gemaakt, de fills zijn veranderd')
fs.writeFileSync(path.join(DIST, 'logo-licht.svg'), licht)

// Het logo voor de bevestigingsmail (png, want een mailprogramma toont geen svg).
// Gemaakt door tools/gen-mail-logo.mjs, dat vóór dit script loopt - zie `build` in
// package.json. De bouw ZAKT als die plaat er niet ligt: worker/confirmation.ts
// verwijst naar /logo-mail.png, en zonder dat bestand krijgt de bezoeker een gebroken
// plaatje in de enige mail die hij ooit van Pascal krijgt. Dat is precies het soort
// fout dat niemand ziet, want wij lezen die mail niet.
{
  const mailLogo = path.join(PUBLIC, 'logo-mail.png')
  if (!fs.existsSync(mailLogo)) {
    throw new Error('build: public/logo-mail.png ontbreekt - draai eerst `node tools/gen-mail-logo.mjs`')
  }
  fs.copyFileSync(mailLogo, path.join(DIST, 'logo-mail.png'))
}

// De IndexNow-sleutel. Dat is een .txt in public/ waarvan de NAAM de sleutel is en de
// inhoud diezelfde sleutel; hij moet op het live adres opvraagbaar zijn, anders weigert
// IndexNow de hele melding. tools/indexnow.mjs toetst dat voordat hij iets verstuurt.
// Hier alleen de eis dat er precies een is: twee sleutelbestanden betekent dat
// indexnow.mjs er willekeurig een pakt (hij neemt de eerste uit readdir).
{
  const sleutels = fs.readdirSync(PUBLIC).filter((f) => /^[0-9a-f]{16,}\.txt$/.test(f))
  if (sleutels.length !== 1) {
    throw new Error(`build: ${sleutels.length} IndexNow-sleutelbestand(en) in public/, dat moet er precies een zijn`)
  }
  fs.copyFileSync(path.join(PUBLIC, sleutels[0]), path.join(DIST, sleutels[0]))
}

fs.writeFileSync(
  path.join(DIST, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="10" fill="#0B1E8A"/>` +
  `<text x="32" y="45" font-family="Arial Black,Arial,sans-serif" font-size="38" font-weight="900" font-style="italic" fill="#2D6BFF" text-anchor="middle">S</text></svg>`
)
// robots.txt, de noindex-meta (in hoofd()) en de sitemap komen alle drie uit LIVE.
// Zie de noot bij die vlag bovenaan.
if (LIVE) {
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: https://${BEDRIJF.domein}/sitemap.xml\n`)
  fs.writeFileSync(
    path.join(DIST, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    INDEXEERBAAR.map((p) => `<url><loc>https://${BEDRIJF.domein}${p}</loc></url>`).join('\n') +
    `\n</urlset>\n`
  )
} else {
  fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nDisallow: /\n`)
  // Geen sitemap in een dichte bouw. Een sitemap die adressen opsomt die zichzelf op
  // noindex zetten is een tegenstrijdig signaal; tools/vooraf.mjs zakt daar ook op.
  fs.rmSync(path.join(DIST, 'sitemap.xml'), { force: true })
}

// ----------------------------------------------------------------- 6. nalooplijst
const regels = nalopen.map((n) => `- **${n.sleutel}** &mdash; ${n.bron}\n  > ${n.tekst}`).join('\n\n')
fs.writeFileSync(
  path.join(HIER, 'NALEZEN-PASCAL.md'),
  `# Nalezen met Pascal\n\n` +
  `Automatisch uit \`build.mjs\`. Dit zijn de regels op de site die een getal of een\n` +
  `registergegeven bevatten, of die niet woordelijk uit zijn eigen tekst komen. Alleen\n` +
  `deze hoeft hij na te lezen, niet de hele site.\n\n` +
  `Bronkorpus: \`bron/zijn-tekst/\` (zijn Marktplaats-advertentie, het KVK-uittreksel en\n` +
  `wat Armando doorgaf). Een regel met "doorgegeven via Armando" erachter staat hier\n` +
  `altijd op, ook als de woorden kloppen: die is van horen zeggen tot Pascal hem bevestigt.\n\n` +
  `## ${nalopen.length} regels\n\n${regels}\n`
)

console.log(
  `\ngebouwd: ${[...PAGINAS.map(([b]) => b), ...HULPPAGINAS.map(([b]) => b)]
    .map((b) => 'dist/' + b.replace(/\\/g, '/'))
    .join(' + ')} + ${cssNaam}`
)
console.log(`nalooplijst: NALEZEN-PASCAL.md (${nalopen.length} regels)`)
