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
const uitsnede45 = await sharp(groot)
  .extract({left: 0, top: 0, width: m.width, height: Math.min(hoogte45, m.height)})
  .png()
  .toBuffer();

/* Tweede slag door de opschaler, 15-10-2026. Reden: sinds 12-10 vult deze foto
   op een telefoon het hele scherm in plaats van een halve kolom. Een telefoon van
   430 punten breed met driedubbele beeldpuntdichtheid vraagt ~1290 echte punten;
   er stond er 900. Het verschil vulde de browser zelf op met uitrekken, en dat
   zag Marjon als pixels. Niet oplosbaar met een scherpteregel: er moeten echt
   meer punten in het bestand. Dus de 4:5-uitsnede nog een keer x2 en daarna
   VERKLEINEN naar leveringsmaat - verkleinen behoudt detail, uitrekken verzint het. */
const extra = await opschalen(uitsnede45, 2, 'glimlach-45');
const me = await sharp(extra).metadata();
console.log('tweede slag', me.width + 'x' + me.height);

const basis = sharp(extra);

/* Drie maten in de srcset van App.tsx: 900 voor een oud toestel, 1350 voor een
   gewone telefoon, 1800 voor een telefoon met hoge dichtheid en voor het
   bureaublad op dubbele dichtheid. */
/* Verscherpen na het verkleinen, 15-10-2026. De opschaler is twee keer over
   deze foto gegaan en laat daardoor een gladde, plastic-achtige huid achter:
   wel genoeg beeldpunten, maar weinig tekening erin. Een lichte onscherptemasker
   na de lanczos-verkleining haalt de randen terug zonder halo's. Vergeleken met
   een enkelvoudige opschaling (1408 breed) en die bleef zachter, dus de dubbele
   slag blijft, mét deze regel erachter. */
const VERSCHERP = {sigma: 0.8, m1: 0.6, m2: 1.6};

for (const breedte of [900, 1350, 1800]) {
  const hoogte = Math.round(breedte * 1.25);
  const buf = await basis
    .clone()
    .resize(breedte, hoogte, {fit: 'cover', kernel: 'lanczos3'})
    .sharpen(VERSCHERP)
    .webp({quality: 86, effort: 6})
    .toBuffer();
  const naam = breedte === 900 ? 'hero-glimlach.webp' : `hero-glimlach-${breedte}.webp`;
  writeFileSync(`${UP}/${naam}`, buf);
  console.log(`${naam} ${breedte}x${hoogte} ${(buf.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(buf)).toFixed(0)}`);
}

/* De jpg is het deelkaartje (og:image in kop.mjs), niet de hero zelf. Die mag
   nu ook groter: WhatsApp en LinkedIn schalen hem toch naar hun eigen maat, en
   een scherpe bron geeft een scherp kaartje. */
const jpg = await basis.clone().resize(1200, 1500, {fit: 'cover', kernel: 'lanczos3'}).sharpen(VERSCHERP).jpeg({quality: 86}).toBuffer();
writeFileSync(`${UP}/hero-glimlach.jpg`, jpg);
console.log(`hero-glimlach.jpg 1200x1500 ${(jpg.length / 1024).toFixed(0)}kB`);

/* De vergelijking met marjon-glimlach.webp stond hier, maar dat bestand is er
   niet meer - alleen de jpg. Die regel liet het script met een foutmelding
   eindigen nadat alles al geschreven was. */
console.log(`oud marjon-glimlach.jpg scherpte ${(await scherpte(readFileSync(UP + '/marjon-glimlach.jpg'))).toFixed(0)}`);
