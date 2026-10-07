/* Schrijft AVIF- en WebP-varianten naast elke foto die in een pagina staat, plus
   plaatjes.json met de maten. maak-snel.mjs bouwt daar de <picture> van.
   Dat bestand staat naast dit script en niet in dist: het is bouwafval, geen pagina.

   Waarom: de homepagina leverde 226 KB aan plaatjes uit waarvan 137 KB onnodig.
   De foto in de hero is de LCP van de pagina — dat is het beeld waar Google de
   laadtijd aan afmeet — en die stond als 196 KB jpg van 1050 breed in een vak van
   ruim 500. Twee dingen fout in een: te zwaar formaat en te groot voor zijn vak.

   Wat dit oplost:
   - AVIF en WebP naast de jpg. De jpg blijft als terugval in de <img> staan, dus
     een browser die geen van de twee kent krijgt nog steeds een foto.
   - Een reeks breedtes per foto, zodat een telefoon niet het formaat voor een
     desktop binnenhaalt.

   De kwaliteit is niet op gevoel gekozen maar gemeten. Per stap is de PSNR van de
   variant tegen de verkleinde bron bepaald; AVIF 46 en WebP 68 komen bij de
   zwaarste foto op de site (de dakkapel, met pannen en een steiger erin, het
   lastigste wat er is om te comprimeren) allebei op 34,6 dB uit. Gelijke meetbare
   kwaliteit dus, maar AVIF doet het in 82 KB waar WebP 119 KB nodig heeft. Lager
   dan dit gaan de dakpannen korrelen, en daar zit op een klussite het bewijs.

   Logo's gaan apart: vlakke vormen met een doorzichtige rand lopen op dezelfde
   instelling vies uit, dus die krijgen WebP zonder verlies.

   Idempotent: een variant die jonger is dan zijn bron wordt overgeslagen. */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const eis = createRequire(import.meta.url);
const sharp = eis('sharp');

const hier = dirname(fileURLToPath(import.meta.url));
const DIST = join(hier, 'dist');

const FOTO = { avif: { quality: 46, effort: 6 }, webp: { quality: 68, effort: 5 } };
const LOGO = { avif: { quality: 80, effort: 6 }, webp: { lossless: true, effort: 5 } };

/* ---------- welke plaatjes staan er in een pagina ---------- */

function paginas(map = DIST) {
  const uit = [];
  for (const naam of readdirSync(map, { withFileTypes: true })) {
    const pad = join(map, naam.name);
    if (naam.isDirectory()) uit.push(...paginas(pad));
    else if (naam.name.endsWith('.html')) uit.push(pad);
  }
  return uit;
}

const gevonden = new Set();
for (const pagina of paginas()) {
  const html = readFileSync(pagina, 'utf8');
  for (const m of html.matchAll(/(?:src|data-groot)="(\/(?:foto|logo)\/[^"]+\.(?:jpg|jpeg|png))"/g)) {
    gevonden.add(m[1]);
  }
}

/* De grote versie achter elke -klein: die gaat schermvullend open als je op een
   kaart klikt. Zonder dit staat alleen de kleine in de reeks en krijgt de lightbox
   een foto van 570 breed op een scherm van 1920. */
for (const pad of [...gevonden]) {
  if (!/-klein\.(jpg|jpeg|png)$/.test(pad)) continue;
  const groot = pad.replace(/-klein(\.\w+)$/, '$1');
  if (existsSync(join(DIST, groot))) gevonden.add(groot);
}

/* ---------- welke breedtes per plaatje ---------- */

/* De foto in de hero vult op een telefoon de volle breedte en op een desktop een
   kolom van ongeveer 510. Met beeldverdubbeling erbij is dat 420 tot 1050, dus een
   reeks van vier. De rest van de foto's staat in een raster van drie en wordt nooit
   breder dan ~370 getoond; die hebben twee stappen genoeg. De grote versies zijn
   alleen voor schermvullend en hebben er een nodig. */
function breedtes(naam, breed) {
  if (HERO[naam]) return [440, 640, 880, 1050].filter((b) => b <= breed);
  if (naam === 'werkspot.png') return [187, 359].filter((b) => b <= breed);
  if (/-klein\./.test(naam)) return [...new Set([Math.round(breed * 0.55), breed])].filter((b) => b >= 120);
  return [Math.min(breed, 1400)];
}

/* ---------- de staande herofoto, liggend gesneden voor de telefoon ----------

   Op een telefoon staat die foto in een vak van ongeveer 412 bij 300 met
   object-fit:cover erop. De bron is 3:4 staand, dus de browser haalde 880x1173
   binnen en gooide er twee derde van weg: 84 KB voor wat 27 KB had moeten zijn,
   en dat is precies het beeld waar de laadtijd van de pagina aan afgemeten wordt.

   Daarom een eigen snede voor onder de 860px. 3:2 ligt midden in wat die vakken
   op telefoonbreedtes vragen (1,2 bij 360px tot 1,8 bij 768px), en het is een
   ruimere uitsnede dan wat een telefoon nu te zien krijgt: cover laat daar het
   middelste stukje over, deze snede houdt de middelste driekwart.

   Welke foto's dit zijn moet met de hand: het gaat om de foto met
   fetchpriority=high in de hero, en die staat niet in dit script. De grens erbij,
   want die is per pagina anders: de hero op de homepagina valt bij 860px naar één
   kolom (.hero__grid), die op de slotpagina bij 980px (.lok__grid). */
const HERO = {
  'dakkapel-pannendak.jpg': 860,   // homepagina
  'buitendeur-gevel.jpg': 980,     // slotpagina
};
const MOB_BREED = [440, 640, 740];
const MOB_VERHOUDING = 3 / 2;

/* ---------- omzetten ---------- */

const manifest = {};
let gemaakt = 0;
let overgeslagen = 0;

for (const webpad of [...gevonden].sort()) {
  const bron = join(DIST, webpad);
  if (!existsSync(bron)) {
    console.warn(`  ontbreekt: ${webpad}`);
    continue;
  }

  const meta = await sharp(bron).metadata();
  const naam = basename(webpad);
  const kaal = webpad.slice(0, -extname(webpad).length);
  const lijst = breedtes(naam, meta.width);

  const instelling = webpad.startsWith('/logo/') ? LOGO : FOTO;

  async function maak(naarPad, breed, snijden) {
    const naarBestand = join(DIST, naarPad);
    mkdirSync(dirname(naarBestand), { recursive: true });
    const ext = naarPad.endsWith('.avif') ? 'avif' : 'webp';

    if (existsSync(naarBestand) && statSync(naarBestand).mtimeMs >= statSync(bron).mtimeMs) {
      overgeslagen++;
    } else {
      let p = snijden
        ? sharp(bron).resize({
            width: breed,
            height: Math.round(breed / MOB_VERHOUDING),
            fit: 'cover',
            position: 'center',
            withoutEnlargement: true,
          })
        : sharp(bron).resize({ width: breed, withoutEnlargement: true });
      // Het Werkspot-logo is een png met doorzichtige rand; die moet mee,
      // anders staat er een zwart blok op de witte pil.
      p = ext === 'avif'
        ? p.avif(instelling.avif)
        : p.webp({ ...instelling.webp, alphaQuality: 90 });
      await p.toFile(naarBestand);
      gemaakt++;
    }
  }

  const varianten = [];
  for (const breed of lijst) {
    const hoog = Math.round((meta.height / meta.width) * breed);
    for (const ext of ['avif', 'webp']) {
      const naarPad = `${kaal}-${breed}.${ext}`;
      await maak(naarPad, breed, false);
      varianten.push({ pad: naarPad, ext, breed, hoog });
    }
  }

  const mobiel = [];
  if (HERO[naam]) {
    for (const breed of MOB_BREED.filter((b) => b <= meta.width)) {
      const hoog = Math.round(breed / MOB_VERHOUDING);
      for (const ext of ['avif', 'webp']) {
        const naarPad = `${kaal}-mob-${breed}.${ext}`;
        await maak(naarPad, breed, true);
        mobiel.push({ pad: naarPad, ext, breed, hoog });
      }
    }
  }

  manifest[webpad] = {
    breed: meta.width,
    hoog: meta.height,
    varianten,
    mobiel,
    mobielTot: HERO[naam] || null,
    // waar schermvullend naartoe moet: de grote versie als webp, want die is bij
    // deze foto's drie keer lichter dan de jpg en wordt overal ondersteund
    groot: null,
  };
}

/* De lightbox-verwijzing per kleine foto, nu alle varianten bekend zijn. */
for (const [webpad, info] of Object.entries(manifest)) {
  const grootPad = webpad.replace(/-klein(\.\w+)$/, '$1');
  const bron = manifest[grootPad] || info;
  const webps = bron.varianten.filter((v) => v.ext === 'webp');
  if (webps.length) info.groot = webps[webps.length - 1].pad;
}

writeFileSync(join(hier, 'plaatjes.json'), JSON.stringify(manifest, null, 1), 'utf8');

const bytesBron = Object.keys(manifest).reduce((s, p) => s + statSync(join(DIST, p)).size, 0);
console.log(`plaatjes: ${Object.keys(manifest).length} bronnen, ${gemaakt} nieuw, ${overgeslagen} al bij (${(bytesBron / 1024 / 1024).toFixed(1)} MB aan originelen)`);
