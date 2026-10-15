/* De herofoto van Marjon.

   BRON (15-10-2026). raw/nieuw/marjon-hek-fotograaf.jpg, 1067x1600, door
   Armando aangeleverd en afkomstig van de fotograaf van de fotosessie. Dit is
   het eerste echte fotobestand dat we van haar hebben. Alles ervoor was een
   afgeleide: eerst Armando's schermafdruk van een instagrampost (730x1182),
   daarna de linkerhelft van een collagetegel die we bij instagram ophaalden
   (654x1038). Laplace-variantie op de bron: 27 (schermafdruk), 46 (tegel),
   289 (dit bestand).

   Het is wel een ANDERE opname dan de hero tot 15-10: zij zit hier op het hek
   bij het water met het zwart-witte vest aan, in plaats van de close-up tussen
   de bladeren. Armando heeft daar op 15-10 ja op gezegd.

   TWEE UITSNEDES, want de hero staat op twee manieren op de pagina.
   - Vanaf lg is de foto de rechterkolom van het raster, 4:5, met de tekst
     ernaast. Daar wil je haar bovenlijf: dicht bij het beeld dat er stond.
   - Onder lg vult de foto de hele sectie en staat de tekst eroverheen (zoals
     smoothbylau, op verzoek van 12-10). Daar werkt juist de hele figuur.
   Eén bestand met object-position kan dit niet: in het 4:5-vak is 83 procent
   van de bronhoogte zichtbaar, dus daar valt niets weg te snijden. Vandaar een
   <picture> in App.tsx met twee echte uitsnedes.

   ÉÉN SLAG DOOR DE OPSCHALER, 2x, per uitsnede. Niet omdat het beeld het nodig
   heeft, maar omdat de grootste leveringsmaat breder is dan de uitsnede: een
   telefoon van 430 punten op driedubbele dichtheid vraagt 1290 beeldpunten en
   de staande uitsnede is er 900 breed. Door eerst op te schalen wordt élke
   leveringsmaat daarna VERKLEIND. Verkleinen behoudt detail, uitrekken verzint
   het. Dit is iets anders dan de twee slagen van 15-10 's ochtends: die gingen
   over een schermafdruk en maakten die plastic huid.

   gebruik: node scripts/hero.mjs   */

import sharp from 'sharp';
import {writeFileSync, existsSync, readFileSync} from 'node:fs';

const KEY = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const BRON = 'raw/nieuw/marjon-hek-fotograaf.jpg';
const UP = 'public/img';
const CACHE = 'raw/nieuw';

/* Met de hand opgemeten in de bron van 1067x1600. Haar hoofd begint op y=390,
   haar kin op 620, de riem op 1170, haar handen op het hek op 1380. */
const UITSNEDE = {
  /* 4:5. Boven het hoofd blijft ruimte, onder valt net onder de riem, zodat de
     handen op het hek erbuiten blijven - dat is de close-up die er stond. */
  portret: {left: 140, top: 255, width: 776, height: 970, maten: [560, 840, 1120], kwaliteit: 88},
  /* 9:16, de hele hoogte van de bron. Dat is de verhouding van een telefoon
     onder de menubalk. Links en rechts gaat er iets af zodat zij in het midden
     staat.

     Lagere kwaliteit dan de portretuitsnede, en de grootste maat blijft op
     1320. Deze foto vult op een telefoon het hele scherm, dus hij is daar het
     zwaarste onderdeel van de pagina, en hij ligt onder een donkere laag waar
     de kop overheen staat - ruis zie je er niet in. 1320 dekt een telefoon van
     440 punten op driedubbele dichtheid. */
  staand: {left: 65, top: 0, width: 900, height: 1600, maten: [720, 1020, 1320], kwaliteit: 80},
};

/* Lichte onscherptemasker na de lanczos-verkleining. Zacht mag hier: er zit
   echte tekening in de huid die niet teruggehaald hoeft te worden. */
const VERSCHERP = {sigma: 0.7, m1: 0.4, m2: 1.2};

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

/* Laplace-variantie: hoeveel tekening zit er in het beeld. Puur om te kunnen
   nameten of een ronde iets opgeleverd heeft, staat verder nergens in de site. */
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

const mb = await sharp(BRON).metadata();
console.log(`bron ${mb.width}x${mb.height} scherpte ${(await scherpte(readFileSync(BRON))).toFixed(0)}`);

for (const [naam, u] of Object.entries(UITSNEDE)) {
  const snee = await sharp(BRON).extract({left: u.left, top: u.top, width: u.width, height: u.height}).png().toBuffer();
  const groot = await opschalen(snee, 2, `hek-${naam}`);
  const mg = await sharp(groot).metadata();
  console.log(`\n${naam}: uitsnede ${u.width}x${u.height} -> opgeschaald ${mg.width}x${mg.height}`);

  const verhouding = u.height / u.width;
  for (const breedte of u.maten) {
    const hoogte = Math.round(breedte * verhouding);
    const buf = await sharp(groot)
      .resize(breedte, hoogte, {fit: 'cover', kernel: 'lanczos3'})
      .sharpen(VERSCHERP)
      .webp({quality: u.kwaliteit, effort: 6})
      .toBuffer();
    const bestand = breedte === u.maten[0] ? `hero-${naam}.webp` : `hero-${naam}-${breedte}.webp`;
    writeFileSync(`${UP}/${bestand}`, buf);
    console.log(`  ${bestand} ${breedte}x${hoogte} ${(buf.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(buf)).toFixed(0)}`);
  }

  /* Het deelkaartje (og:image in kop.mjs) komt uit de portretuitsnede. Een jpg,
     want niet elke chat- en socialeapp toont webp in een voorbeeldkaartje. */
  if (naam === 'portret') {
    const jpg = await sharp(groot).resize(1200, 1500, {fit: 'cover', kernel: 'lanczos3'}).sharpen(VERSCHERP).jpeg({quality: 82}).toBuffer();
    writeFileSync(`${UP}/hero-deelkaart.jpg`, jpg);
    console.log(`  hero-deelkaart.jpg 1200x1500 ${(jpg.length / 1024).toFixed(0)}kB scherpte ${(await scherpte(jpg)).toFixed(0)}`);
  }
}
