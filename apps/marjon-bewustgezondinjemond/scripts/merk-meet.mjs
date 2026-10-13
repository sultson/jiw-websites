/**
 * Meet public/img/bloem.png na en legt merk/bloem.svg er overheen.
 *
 * Dit is het bewijs onder scripts/merk-vector.mjs. Die tekent de bloem opnieuw
 * uit een formule in plaats van hem over te trekken, en dan is de enige vraag
 * die telt: is het nog hetzelfde merk. Deze meet dat in plaats van het te
 * beweren.
 *
 * Wat hij doet:
 *   1. zoekt de cirkels in het aangeleverde bestand door voor elke straal en
 *      elk middelpunt te kijken hoeveel van die cirkel op inkt ligt. Een echte
 *      cirkel haalt 100%, de rest blijft onder 80%. Hij vindt er 19: dat zijn
 *      de cirkels die er heel op staan. De bogen daarbuiten zijn stukken van
 *      cirkels die maar voor een deel getekend zijn, en die ziet hij dus niet -
 *      daarvoor is stap 4.
 *   2. legt een ellips door de buitenste ring om te zien hoe rond die is.
 *   3. meet de lijndikte loodrecht op een bekende cirkel.
 *   4. rendert merk/bloem.svg op 640 px en telt de overlap met het origineel.
 *
 *   node scripts/merk-meet.mjs
 */
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sharp = createRequire(path.join(APP, 'package.json'))('sharp');

const BRON = path.join(APP, 'public/img/bloem.png');
const {data, info} = await sharp(BRON).ensureAlpha().raw().toBuffer({resolveWithObject: true});
const {width: W, height: H, channels: K} = info;

const dekking = (x, y) => (x < 0 || y < 0 || x >= W || y >= H ? 0 : data[(y * W + x) * K + 3]);
const inkt = (x, y) => dekking(x, y) > 70;

/* Eén pixel verdikken, anders telt een cirkel die er een halve pixel naast ligt
   al als mis. */
const dik = new Uint8Array(W * H);
for (let y = 1; y < H - 1; y++)
  for (let x = 1; x < W - 1; x++) {
    let v = 0;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v |= inkt(x + dx, y + dy) ? 1 : 0;
    dik[y * W + x] = v;
  }

/* ------------------------------------------------- 1. cirkels terugvinden */

const N = 360;
function opInkt(cx, cy, r) {
  let raak = 0;
  for (let t = 0; t < N; t++) {
    const a = (2 * Math.PI * t) / N;
    const x = Math.round(cx + r * Math.cos(a));
    const y = Math.round(cy + r * Math.sin(a));
    if (x >= 0 && y >= 0 && x < W && y < H && dik[y * W + x]) raak++;
  }
  return raak / N;
}

const kandidaten = [];
for (let cy = 30; cy <= H - 30; cy++)
  for (let cx = 30; cx <= W - 30; cx++) {
    let best = 0;
    let bestR = 0;
    for (let r = 92; r <= 95; r += 0.5) {
      const d = opInkt(cx, cy, r);
      if (d > best) ((best = d), (bestR = r));
    }
    if (best >= 0.995) kandidaten.push({cx, cy, r: bestR});
  }

const gebruikt = new Array(kandidaten.length).fill(false);
const centra = [];
for (let i = 0; i < kandidaten.length; i++) {
  if (gebruikt[i]) continue;
  const groep = [];
  for (let j = i; j < kandidaten.length; j++) {
    if (gebruikt[j]) continue;
    if (Math.hypot(kandidaten[j].cx - kandidaten[i].cx, kandidaten[j].cy - kandidaten[i].cy) < 8) {
      gebruikt[j] = true;
      groep.push(kandidaten[j]);
    }
  }
  const m = groep.length;
  centra.push({
    x: groep.reduce((s, g) => s + g.cx, 0) / m,
    y: groep.reduce((s, g) => s + g.cy, 0) / m,
    r: groep.reduce((s, g) => s + g.r, 0) / m,
  });
}

const gem = (v) => v.reduce((s, x) => s + x, 0) / v.length;
const hart = {x: gem(centra.map((c) => c.x)), y: gem(centra.map((c) => c.y))};
const straal = gem(centra.map((c) => c.r));
console.log(`cirkels      ${centra.length}`);
console.log(`straal       ${straal.toFixed(2)} px`);
console.log(`hart         ${hart.x.toFixed(1)}, ${hart.y.toFixed(1)}`);

/* De afstand tot de dichtstbijzijnde buur moet gelijk zijn aan de straal: dat
   is wat een Flower of Life een Flower of Life maakt. */
const buren = centra.map((c) => {
  let d = Infinity;
  for (const o of centra) if (o !== c) d = Math.min(d, Math.hypot(o.x - c.x, o.y - c.y));
  return d;
});
console.log(`buurafstand  ${gem(buren).toFixed(2)} px  (= straal: ${(gem(buren) / straal).toFixed(3)}x)`);

/* ------------------------------------------------------ 2. de buitenring */

const ring = [];
for (let t = 0; t < 720; t++) {
  const a = (2 * Math.PI * t) / 720;
  const cs = Math.cos(a);
  const sn = Math.sin(a);
  let buiten = null;
  let binnen = null;
  for (let r = 330; r > 240; r -= 0.25) {
    if (inkt(Math.round(hart.x + r * cs), Math.round(hart.y + r * sn))) {
      if (buiten === null) buiten = r;
      binnen = r;
    } else if (buiten !== null) break;
  }
  if (buiten !== null) ring.push({a, mid: (buiten + binnen) / 2, dik: buiten - binnen + 0.25});
}
const Rmid = gem(ring.map((p) => p.mid));
let A = 0;
let B = 0;
{
  let Suu = 0;
  let Suv = 0;
  let Svv = 0;
  let Su = 0;
  let Sv = 0;
  for (const p of ring) {
    const u = (p.mid * Math.cos(p.a)) ** 2;
    const v = (p.mid * Math.sin(p.a)) ** 2;
    Suu += u * u;
    Suv += u * v;
    Svv += v * v;
    Su += u;
    Sv += v;
  }
  const det = Suu * Svv - Suv * Suv;
  A = 1 / Math.sqrt((Su * Svv - Sv * Suv) / det);
  B = 1 / Math.sqrt((Sv * Suu - Su * Suv) / det);
}
console.log(`ring         ${Rmid.toFixed(1)} px  (= 3x straal: ${(Rmid / straal).toFixed(3)}x)`);
console.log(`ring ovaal   ${A.toFixed(1)} x ${B.toFixed(1)} px  (${(((B - A) / A) * 100).toFixed(1)}% uit het lood)`);

/* -------------------------------------------------------- 3. lijndikte */

const dikten = [];
for (let t = 0; t < 360; t++) {
  const a = (2 * Math.PI * t) / 360;
  let n = 0;
  for (let d = -6; d <= 6; d += 0.25)
    if (inkt(Math.round(hart.x + (straal + d) * Math.cos(a)), Math.round(hart.y + (straal + d) * Math.sin(a)))) n++;
  dikten.push(n * 0.25);
}
dikten.sort((p, q) => p - q);
console.log(`lijn binnen  ${dikten[180].toFixed(2)} px`);
console.log(`lijn ring    ${gem(ring.map((p) => p.dik)).toFixed(2)} px`);

/* --------------------------------------------------- 4. overlap met de svg */

const svg = readFileSync(path.join(APP, 'merk/bloem.svg'));
const nieuw = await sharp(svg, {density: 600}).resize(W, H).ensureAlpha().extractChannel(3).raw().toBuffer();

/* Allebei met dezelfde pet op: 1 px verdikt, dan vergelijken. Een lijn van 5 px
   die er 1 px naast ligt haalt anders al geen 70% overlap, en dat zegt niets
   over of het hetzelfde merk is. */
function verdik(bron) {
  const uit = new Uint8Array(W * H);
  for (let y = 1; y < H - 1; y++)
    for (let x = 1; x < W - 1; x++) {
      let v = 0;
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) v |= bron[(y + dy) * W + x + dx] > 70 ? 1 : 0;
      uit[y * W + x] = v;
    }
  return uit;
}
const oudD = dik;
const nieuwD = verdik(nieuw);

let oudOpNieuw = 0;
let oudTotaal = 0;
let nieuwOpOud = 0;
let nieuwTotaal = 0;
for (let i = 0; i < W * H; i++) {
  const o = dekking(i % W, Math.floor(i / W)) > 70 ? 1 : 0;
  const n = nieuw[i] > 70 ? 1 : 0;
  if (o) {
    oudTotaal++;
    if (nieuwD[i]) oudOpNieuw++;
  }
  if (n) {
    nieuwTotaal++;
    if (oudD[i]) nieuwOpOud++;
  }
}
console.log(`\noverlap      ${((100 * oudOpNieuw) / oudTotaal).toFixed(1)}% van de oude inkt ligt op de nieuwe`);
console.log(`             ${((100 * nieuwOpOud) / nieuwTotaal).toFixed(1)}% van de nieuwe inkt ligt op de oude`);
