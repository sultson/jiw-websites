/* De herofoto die Marjon bedoelt: de lachende foto uit haar instagrampost
   (img_index=6). Die stond al op de site, maar alleen als deelkaartje, en de
   bron daarvan was een halve tegel uit een carrousel-collage (~480x740).
   Armando's screenshot van de post zelf is groter: 732x1182 echte beeldpunten.
   Die gaat door de opschaler en wordt daarna VERKLEIND naar leveringsmaat.

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

const CRM = 'C:/Users/nieuw/dev/jiw-crm/uploads';

/* de foto uit de screenshot snijden: links langs de bladerknop van de
   carrousel, rechts en onder langs de rand van het beeld zelf */
const uitsnede = await sharp(`${CRM}/p96jz7vu91ey7ipx52knts54.jpg`)
  .extract({left: 98, top: 242, width: 730, height: 1182})
  .png()
  .toBuffer();

const groot = await opschalen(uitsnede, 2, 'glimlach');
const m = await sharp(groot).metadata();
console.log('opgeschaald', m.width + 'x' + m.height);

/* 4:5, van de bovenkant af zodat er ruimte boven haar hoofd blijft voor de bloem */
const hoogte45 = Math.round(m.width * 1.25);
const basis = sharp(groot).extract({left: 0, top: 0, width: m.width, height: Math.min(hoogte45, m.height)});

const webp = await basis.clone().resize(900, 1125, {fit: 'cover', kernel: 'lanczos3'}).webp({quality: 82, effort: 6}).toBuffer();
writeFileSync(`${UP}/hero-glimlach.webp`, webp);
const jpg = await basis.clone().resize(900, 1125, {fit: 'cover', kernel: 'lanczos3'}).jpeg({quality: 84}).toBuffer();
writeFileSync(`${UP}/hero-glimlach.jpg`, jpg);

console.log(`hero-glimlach.webp 900x1125 ${(webp.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(webp)).toFixed(0)}`);
console.log(`oud marjon-glimlach.webp scherpte ${(await scherpte(readFileSync(UP + '/marjon-glimlach.webp'))).toFixed(0)}`);
