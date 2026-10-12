/* Beeldbewerking voor de ronde van 13 augustus: de foto's uit Marjons mail.

   Kleine bronbestanden gaan eerst door de opschaler van Runware (echte
   detailherstelling) en worden daarna VERKLEIND naar leveringsmaat. Andersom
   (eerst snijden op leveringsmaat, dan vergroten) maakt geen detail bij, alleen
   zachte randen.

   gebruik: node scripts/beeld.mjs            */

import sharp from 'sharp';
import {writeFileSync, existsSync, readFileSync} from 'node:fs';

const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const UP = 'public/img';
const CACHE = 'raw/nieuw';

/* De opschaler kost tijd en geld, dus het resultaat blijft op schijf staan. */
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
  /* de opschaler geeft af en toe een inferenceError terug, dus een paar keer
     proberen voordat we het opgeven */
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

/* scherptemaat: variantie van de laplaciaan, om vergelijkbaar te meten in
   plaats van op het oog te kijken */
async function scherpte(buf) {
  const {data, info} = await sharp(buf).greyscale().resize(600, null, {fit: 'inside'}).raw().toBuffer({resolveWithObject: true});
  const {width: w, height: h} = info;
  let som = 0;
  let som2 = 0;
  let n = 0;
  for (let y = 1; y < h - 1; y++) {
    for (let x = 1; x < w - 1; x++) {
      const i = y * w + x;
      const l = -4 * data[i] + data[i - 1] + data[i + 1] + data[i - w] + data[i + w];
      som += l;
      som2 += l * l;
      n++;
    }
  }
  return som2 / n - (som / n) ** 2;
}

async function lever(buf, naam, breedte, hoogte) {
  const klaar = await sharp(buf)
    .resize(breedte, hoogte, {fit: 'cover', kernel: 'lanczos3'})
    .webp({quality: 80, effort: 6})
    .toBuffer();
  writeFileSync(`${UP}/${naam}.webp`, klaar);
  console.log(
    `${naam}.webp  ${breedte}x${hoogte}  ${(klaar.length / 1024).toFixed(0)}kB  scherpte ${(await scherpte(klaar)).toFixed(0)}`,
  );
}

const CRM = 'C:/Users/nieuw/dev/jiw-crm/uploads';

/* 1. hero: de foto uit haar eerste instagrampost. 1200x1600, dus groot genoeg
   voor 900 breed zonder opschalen. De bloem des levens staat als etsing op het
   glas; de uitsnede houdt die heel. */
{
  const bron = sharp(`${CRM}/pvs28dz5wsn7snhjbhouwq60.jpg`).extract({left: 0, top: 20, width: 1200, height: 1500});
  await lever(await bron.png().toBuffer(), 'hero-uitzicht', 900, 1125);
}

/* 2. Marjon in groen pak, in de praktijk. Aangeleverd als 640x480 liggend en
   een kwartslag gedraaid, dus rechtzetten, uitsnijden en opschalen. */
{
  const gedraaid = await sharp(`${CRM}/aufe2sa39okifh3sypv1d9d4.jpg`)
    .rotate(90)
    .extract({left: 80, top: 40, width: 400, height: 533})
    .png()
    .toBuffer();
  await lever(await opschalen(gedraaid, 4, 'groen'), 'marjon-groen-pak', 700, 933);
}

/* 3. natuurlijke voeding: haar eigen saladefoto. De uitsnede loopt bewust
   rechts van haar Canva-tekst 'Withlove Salad' langs. */
{
  const uitsnede = await sharp('raw/ig-salade.jpg')
    .extract({left: 420, top: 290, width: 650, height: 650})
    .png()
    .toBuffer();
  await lever(await opschalen(uitsnede, 2, 'salade'), 'wereld-voeding', 800, 800);
}

/* 4. essentiële olie: conceptbeeld, want van haar eigen flesjes is geen foto. */
await lever(readFileSync(`${CACHE}/olie.png`), 'wereld-olie', 800, 800);

/* 5. het gebit met de meridianen en organen, uit haar eigen bijlage. */
{
  const bron = await sharp(`${CRM}/zc54goze2q9suxzazciudtyn.jpg`).png().toBuffer();
  await lever(await opschalen(bron, 2, 'gebit'), 'gebit-meridianen', 760, 1126);
}

/* 6. de brug bij 'De brug tussen twee werelden': conceptbeeld. */
await lever(readFileSync(`${CACHE}/brug.png`), 'brug', 1400, 939);
