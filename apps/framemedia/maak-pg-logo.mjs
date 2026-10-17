// Bouwt het Puur Genieten-logo opnieuw op uit raw/logo-puur-genieten-1600.jpg.
//   node maak-pg-logo.mjs
//
// Het bronbestand is zelf al een opgeblazen versie van een klein logo: 1600
// beeldpunten breed, maar de randen zijn zacht en de cirkel is aan de buitenkant
// rafelig. Gewoon nog groter maken helpt niet - dan wordt de wazigheid groter.
// Een AI-upscaler helpt ook niet: die verzint letterkanten en maakt deuken in de
// cirkelrand.
//
// Wat wel werkt, is het ding uit elkaar halen. Dit logo bestaat uit drie dingen
// die allemaal exact te beschrijven zijn:
//   1. een perfecte cirkel
//   2. een radiaal verloop van geel (midden) naar oranje (rand)
//   3. roomwitte letters erop
//
// Dus: het verloop meten we op als mediaan per straal (de letters zijn in elke
// ring een minderheid, dus de mediaan ziet ze niet), de cirkel tekenen we
// wiskundig opnieuw, en van de letters maken we een masker dat we met een harde
// S-curve weer scherp trekken. Niets verzonnen - alles komt uit het bronbestand,
// alleen zonder de wazigheid eromheen.
import sharp from '../../../jiw-crm/node_modules/sharp/lib/index.js';
import { mkdirSync, writeFileSync } from 'fs';

const BRON = 'raw/logo-puur-genieten-1600.jpg';
const UIT = 'inhoud/assets/download';
const WERK = 3072;                 // interne werkmaat, daarna netjes terugschalen
const INKT = [252, 252, 240];      // opgemeten letterkleur

const klem = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
const sCurve = (a, b, x) => { const t = klem((x - a) / (b - a)); return t * t * (3 - 2 * t); };

const { data: src, info } = await sharp(BRON).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;

// --- 1. de cirkel opmeten --------------------------------------------------
let x0 = 1e9, y0 = 1e9, x1 = -1, y1 = -1;
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const i = (y * W + x) * 3;
  if (src[i] > 238 && src[i + 1] > 238 && src[i + 2] > 238) continue;  // wit papier
  if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
}
const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, R = ((x1 - x0) + (y1 - y0)) / 4;

// --- 2. het verloop opmeten ------------------------------------------------
// Per straal van 1 beeldpunt de mediaan van de achtergrondpixels. Alleen pixels
// met genoeg kleurverzadiging tellen mee, zodat de letters er zeker buiten vallen.
const bakken = Math.ceil(R) + 1;
const verzameling = Array.from({ length: bakken }, () => [[], [], []]);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy);
  if (d > R) continue;
  const i = (y * W + x) * 3, r = src[i], g = src[i + 1], b = src[i + 2];
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  if (!mx || (mx - mn) / mx < 0.55) continue;
  const k = Math.round(d);
  verzameling[k][0].push(r); verzameling[k][1].push(g); verzameling[k][2].push(b);
}
const mediaan = a => { a.sort((p, q) => p - q); return a.length ? a[a.length >> 1] : null; };
const ruw = verzameling.map(k => k.map(mediaan));
// Lege bakken (helemaal binnenin, en de rafelrand buiten) opvullen met de buren.
for (let k = 0; k < bakken; k++) if (ruw[k][0] === null) {
  let a = k; while (a >= 0 && ruw[a][0] === null) a--;
  let b = k; while (b < bakken && ruw[b][0] === null) b++;
  ruw[k] = ruw[a >= 0 ? a : b] ?? ruw[b];
}
// De buitenste 2% is in het origineel de zachte rand van de cirkel - daar is de
// mediaan al met wit vermengd. Die stralen krijgen de kleur van 0.97R.
const randVanaf = Math.floor(bakken * 0.97);
for (let k = randVanaf; k < bakken; k++) ruw[k] = ruw[randVanaf - 1];
// Glad strijken: voortschrijdend gemiddelde over +/- 9 stralen.
const verloop = ruw.map((_, k) => [0, 1, 2].map(c => {
  let som = 0, n = 0;
  for (let j = Math.max(0, k - 9); j <= Math.min(bakken - 1, k + 9); j++) { som += ruw[j][c]; n++; }
  return som / n;
}));

// --- 3. het lettermasker ---------------------------------------------------
// Hoe ver ligt deze pixel van de achtergrondkleur op zijn eigen straal, op weg
// naar roomwit? Het blauwkanaal geeft het grootste verschil (oranje heeft weinig
// blauw, de letters veel), dus daar meten we op.
const masker = Buffer.alloc(W * H, 0);
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
  const d = Math.hypot(x - cx, y - cy);
  if (d > R * 0.985) continue;                       // rafelrand niet meenemen
  const i = (y * W + x) * 3;
  const achter = verloop[Math.min(bakken - 1, Math.round(d))][2];
  masker[y * W + x] = Math.round(255 * klem((src[i + 2] - achter) / (INKT[2] - achter)));
}

const vak = {
  left: Math.round(cx - R), top: Math.round(cy - R),
  width: Math.round(2 * R), height: Math.round(2 * R),
};
// toColourspace('b-w') is geen opsmuk: zonder die regel geeft sharp het masker
// als drie kanalen terug en leest de lus hieronder er een scheve diagonaal van.
const groot = await sharp(masker, { raw: { width: W, height: H, channels: 1 } })
  .extract(vak).resize(WERK, WERK, { kernel: 'lanczos3' })
  .toColourspace('b-w').raw().toBuffer();

if (process.env.DEBUG) {
  await sharp(masker, { raw: { width: W, height: H, channels: 1 } }).png().toFile('dbg-masker.png');
  await sharp(groot, { raw: { width: WERK, height: WERK, channels: 1 } }).png().toFile('dbg-masker-groot.png');
}

// --- 4. opnieuw tekenen ----------------------------------------------------
// Cirkel + verloop wiskundig, letters uit het masker met een S-curve die de
// wazige overgang weer tot een rand terugbrengt.
const rgba = Buffer.alloc(WERK * WERK * 4);
const straal = WERK / 2;
for (let y = 0; y < WERK; y++) for (let x = 0; x < WERK; x++) {
  const d = Math.hypot(x + 0.5 - straal, y + 0.5 - straal) / straal;   // 0..1
  const o = (y * WERK + x) * 4;
  const binnen = 1 - sCurve(1 - 2.5 / straal, 1, d);                   // zachte buitenrand
  if (binnen <= 0) continue;
  const kleur = verloop[Math.min(bakken - 1, Math.round(d * R))];
  const m = sCurve(0.38, 0.58, groot[y * WERK + x] / 255);
  for (let c = 0; c < 3; c++) rgba[o + c] = Math.round(kleur[c] * (1 - m) + INKT[c] * m);
  rgba[o + 3] = Math.round(255 * binnen);
}

// --- 5. wegschrijven -------------------------------------------------------
mkdirSync(UIT, { recursive: true });
const beeld = () => sharp(rgba, { raw: { width: WERK, height: WERK, channels: 4 } });

await beeld().resize(2048, 2048, { kernel: 'lanczos3' }).png({ compressionLevel: 9 })
  .toFile(`${UIT}/puur-genieten-logo-2048.png`);                       // doorzichtig, voor alles

// Vol: de cirkel raakt precies de rand. TikTok snijdt rond uit, dus dan blijft
// er niets van het merk weg.
await beeld().resize(1080, 1080, { kernel: 'lanczos3' }).flatten({ background: '#ffffff' })
  .jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(`${UIT}/puur-genieten-logo-vol-1080.jpg`);

// Met rand: voor plekken die zelf vierkant tonen.
const binnenin = await beeld().resize(950, 950, { kernel: 'lanczos3' }).png().toBuffer();
await sharp({ create: { width: 1080, height: 1080, channels: 3, background: '#ffffff' } })
  .composite([{ input: binnenin, left: 65, top: 65 }])
  .jpeg({ quality: 94, chromaSubsampling: '4:4:4' }).toFile(`${UIT}/puur-genieten-logo-1080.jpg`);

console.log(`cirkel: midden ${cx} ${cy}, straal ${R.toFixed(1)} (bron ${W}x${H})`);
console.log(`verloop: midden rgb ${verloop[0].map(Math.round)}, rand rgb ${verloop[randVanaf - 1].map(Math.round)}`);
console.log(`geschreven naar ${UIT}/`);
