/* De herofoto die Marjon bedoelt: zij zittend tussen de herfstbladeren bij de
   berken. Die zit in de fotosessie-post op haar instagram (shortcode
   DWlQE1yjfSp), maar NIET als eigen tegel - hij is de LINKERHELFT van tegel 6,
   een collage van twee foto's. Dat maakt hem klein, en daar is niets aan te doen
   zolang we het bestand van de fotograaf niet hebben.

   LET OP bij een volgende ronde: tegel 1 is een ANDERE foto (zij lachend bij het
   water, met het zwart-witte vest). Die stond hier op 15-10-2026 een uur lang
   per ongeluk als hero. Dit is de verkeerde om te pakken, hoe verleidelijk ook -
   hij is wel een eigen tegel en dus veel groter.

   BRON. Tot 15-10-2026 was dit Armando's schermafdruk van die collage
   (730x1182). De tegel komt nu rechtstreeks bij instagram vandaan
   (apify/instagram-scraper); de linkerhelft meet daar 654x1038. Minder
   beeldpunten dan de schermafdruk, maar wel scherper, want een schermafdruk is
   een opgerekte weergave van ditzelfde bestand: laplace-variantie 46 tegen 27.

   Eén slag door de opschaler, 3x naar 1962 breed, zodat alle leveringsmaten
   VERKLEIND worden en niets wordt uitgerekt.

   Dit blijft een afgeleide. Het bestand van de fotograaf is beter en scheelt
   hier meer dan bij welke andere foto op de site ook. Zie raw/ig-sessie/.

   gebruik: node scripts/hero-glimlach.mjs   */

import sharp from 'sharp';
import {writeFileSync, existsSync, readFileSync} from 'node:fs';

const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const UP = 'public/img';
const CACHE = 'raw/nieuw';

async function opschalen(buf, factor, naam) {
  const pad = `${CACHE}/${naam}-${factor}x.png`;
  if (existsSync(pad)) return readFileSync(pad);
  const body = [
    {
      taskType: 'imageUpscale',
      taskUUID: crypto.randomUUID(),
      inputImage: 'data:image/png;base64,' + buf.toString('base64'),
      upscaleFactor: factor,
      outputFormat: 'PNG',
    },
  ];
  let j;
  for (let poging = 1; poging <= 4; poging++) {
    const r = await fetch('https://api.runware.ai/v1', {
      method: 'POST',
      headers: {'Content-Type': 'application/json', Authorization: 'Bearer ' + KEY},
      body: JSON.stringify(body),
    });
    j = await r.json();
    if (j.data?.[0]?.imageURL) break;
    await new Promise((res) => setTimeout(res, 2000 * poging));
  }
  if (!j.data?.[0]?.imageURL) throw new Error(naam + ': ' + JSON.stringify(j).slice(0, 300));
  const out = Buffer.from(await (await fetch(j.data[0].imageURL)).arrayBuffer());
  writeFileSync(pad, out);
  return out;
}

async function scherpte(buf) {
  const {data, info} = await sharp(buf).greyscale().resize(600, null, {fit: 'inside'}).raw().toBuffer({resolveWithObject: true});
  const {width: w, height: h} = info;
  let som = 0, som2 = 0, n = 0;
  for (let y = 1; y < h - 1; y++)
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const l = -4 * data[i] + data[i - 1] + data[i + 1] + data[i - w] + data[i + w];
      som += l; som2 += l * l; n++;
    }
  return som2 / n - (som / n) ** 2;
}

/* De linkerfoto uit de collage snijden. Deze maten zijn met de hand opgemeten in
   de tegel van 1440x1440 en lopen net binnen de rand van het kiekje, zodat er
   geen streepje van de buurfoto of van de wazige achtergrond meekomt. */
const tegel = await sharp('raw/ig-sessie/f06.webp')
  .extract({left: 42, top: 197, width: 654, height: 1038})
  .png()
  .toBuffer();
const mt = await sharp(tegel).metadata();
console.log('linkerhelft van tegel 6', mt.width + 'x' + mt.height);

/* 4:5, van de bovenkant af zodat er ruimte boven haar hoofd blijft voor de bloem */
const hoogte45 = Math.round(mt.width * 1.25);
const uitsnede45 = await sharp(tegel)
  .extract({left: 0, top: 0, width: mt.width, height: Math.min(hoogte45, mt.height)})
  .png()
  .toBuffer();
const mu = await sharp(uitsnede45).metadata();
console.log('uitsnede 4:5', mu.width + 'x' + mu.height);

/* Een enkele slag door de opschaler, 3x: 654 -> 1962 breed. Dat dekt de grootste
   leveringsmaat (1800), dus alles wordt daarna VERKLEIND en niets uitgerekt.
   Verkleinen behoudt detail, uitrekken verzint het. 2x zou op 1308 uitkomen en
   dan zou de 1800 alsnog opgerekt worden. */
const groot = await opschalen(uitsnede45, 3, 'glimlach-collage');
const mg = await sharp(groot).metadata();
console.log('opgeschaald', mg.width + 'x' + mg.height);

const basis = sharp(groot);

/* Lichte onscherptemasker na de lanczos-verkleining. Bij een enkele opschaalslag
   mag dit zachter dan bij de dubbele van 15-10 's ochtends: er zit nu echte
   tekening in de huid die niet teruggehaald hoeft te worden. */
const VERSCHERP = {sigma: 0.7, m1: 0.5, m2: 1.3};

/* Drie maten in de srcset van App.tsx: 900 voor een oud toestel, 1350 voor een
   gewone telefoon, 1800 voor een telefoon met hoge dichtheid en voor het
   bureaublad op dubbele dichtheid. */
for (const breedte of [900, 1350, 1800]) {
  const hoogte = Math.round(breedte * 1.25);
  const buf = await basis
    .clone()
    .resize(breedte, hoogte, {fit: 'cover', kernel: 'lanczos3'})
    .sharpen(VERSCHERP)
    .webp({quality: 88, effort: 6})
    .toBuffer();
  const naam = breedte === 900 ? 'hero-glimlach.webp' : `hero-glimlach-${breedte}.webp`;
  writeFileSync(`${UP}/${naam}`, buf);
  console.log(`${naam} ${breedte}x${hoogte} ${(buf.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(buf)).toFixed(0)}`);
}

/* De jpg is het deelkaartje (og:image in kop.mjs), niet de hero zelf. */
const jpg = await basis.clone().resize(1200, 1500, {fit: 'cover', kernel: 'lanczos3'}).sharpen(VERSCHERP).jpeg({quality: 88}).toBuffer();
writeFileSync(`${UP}/hero-glimlach.jpg`, jpg);
console.log(`hero-glimlach.jpg 1200x1500 ${(jpg.length / 1024).toFixed(0)}kB`);
