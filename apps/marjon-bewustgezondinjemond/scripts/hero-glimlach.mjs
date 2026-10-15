/* De herofoto die Marjon bedoelt: de lachende foto uit de fotosessie-post op
   haar instagram (shortcode DWlQE1yjfSp, eerste tegel van de carrousel).

   BRON, 15-10-2026. Tot vandaag was de bron Armando's schermafdruk van die post:
   732x1182 beeldpunten, met alle vervorming die een schermafdruk meebrengt. De
   tegel is nu rechtstreeks bij instagram opgehaald (apify/instagram-scraper) en
   is daar 1440x1440 met een witte rand; het beeld zelf meet 999x1381 echte
   beeldpunten. Dat is 1,9x zoveel beeldpunten als de schermafdruk, en het is de
   webp die instagram zelf uitlevert in plaats van een foto van een scherm.

   Daardoor hoeft de opschaler nog maar EEN keer te draaien in plaats van twee.
   Die tweede slag was wat de huid glad en plastic-achtig maakte.

   Dit blijft een afgeleide: instagram levert zelf maximaal 1440 breed uit, dus
   het bestand van de fotograaf is nog altijd beter. Zie raw/ig-sessie/.

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

/* De witte rand van de instagram-tegel eraf. trim() zoekt zelf de randen van
   het beeld op, zodat er geen handmatige maten in dit bestand staan die stuk
   gaan als de tegel ooit opnieuw wordt opgehaald. */
const tegel = await sharp('raw/ig-sessie/f01.webp').trim({threshold: 12}).png().toBuffer();
const mt = await sharp(tegel).metadata();
console.log('instagram-tegel zonder rand', mt.width + 'x' + mt.height);
if (mt.width < 900) throw new Error('tegel onverwacht klein, trim heeft te veel weggesneden');

/* 4:5, van de bovenkant af zodat er ruimte boven haar hoofd blijft voor de bloem */
const hoogte45 = Math.round(mt.width * 1.25);
const uitsnede45 = await sharp(tegel)
  .extract({left: 0, top: 0, width: mt.width, height: Math.min(hoogte45, mt.height)})
  .png()
  .toBuffer();
const mu = await sharp(uitsnede45).metadata();
console.log('uitsnede 4:5', mu.width + 'x' + mu.height);

/* Een enkele slag door de opschaler. 999 -> 1998 breed dekt de grootste
   leveringsmaat (1800) ruim, dus alles wordt daarna VERKLEIND en niets
   uitgerekt. Verkleinen behoudt detail, uitrekken verzint het. */
const groot = await opschalen(uitsnede45, 2, 'glimlach-ig');
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
