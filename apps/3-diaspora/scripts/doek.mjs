/**
 * Maskers van de zegels, in twee vormen.
 *
 * 1. merk-vorm.png: het zegel van 3 Diaspora als masker (wit waar inkt zit),
 *    zodat het net als de drie stichtingslogo's in de kleur van het vlak kan
 *    staan waar het op ligt. De andere drie hadden dit al.
 * 2. *-doek.png: hetzelfde masker, maar met lucht eromheen. Dat is nodig om het
 *    als doek te kunnen herhalen: css tegelt een masker zonder tussenruimte, dus
 *    de tussenruimte moet in het bestand zelf zitten.
 */
import sharp from 'sharp';
import {readFileSync} from 'node:fs';

const OUT = 'public/img';

/** Wit waar inkt zit, doorzichtig waar niets zit. */
async function naarVorm(bron, doel) {
  const {data, info} = await sharp(readFileSync(bron)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const masker = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    masker[i] = 255;
    masker[i + 1] = 255;
    masker[i + 2] = 255;
    masker[i + 3] = data[i + 3];
  }
  const uit = await sharp(masker, {raw: {width: info.width, height: info.height, channels: 4}})
    .png({compressionLevel: 9, palette: true})
    .toFile(doel);
  console.log(doel, `${uit.width}x${uit.height}`, (uit.size / 1024).toFixed(0) + 'kB');
}

/** Zelfde tekening, met lucht eromheen, zodat het als doek herhaald kan worden. */
async function naarDoek(bron, doel, deel = 0.44) {
  const maat = 168;
  const zegel = await sharp(readFileSync(bron)).resize({width: maat, height: maat, fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}}).toBuffer();
  const vak = Math.round(maat / deel);
  const uit = await sharp({create: {width: vak, height: vak, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}}})
    .composite([{input: zegel, gravity: 'center'}])
    .png({compressionLevel: 9})
    .toFile(doel);
  console.log(doel, `${uit.width}x${uit.height}`, (uit.size / 1024).toFixed(0) + 'kB');
}

await naarVorm(`${OUT}/merk.png`, `${OUT}/merk-vorm.png`);

for (const naam of ['merk-vorm', 'logo-bonaire-vorm', 'logo-curacao-vorm', 'logo-nederland-vorm']) {
  await naarDoek(`${OUT}/${naam}.png`, `${OUT}/${naam.replace('-vorm', '')}-doek.png`);
}

/**
 * De kern van het zegel: alleen de tekening in het midden, zonder de letterring.
 * Op een teken van twintig pixels wordt die ring een grijze veeg, en dan is het
 * geen logo meer maar een vlek. De kaart zelf blijft wel herkenbaar.
 */
async function naarKern(bron, doel, deel = 0.62) {
  const buf = readFileSync(bron);
  const {width, height} = await sharp(buf).metadata();
  const b = Math.round(width * deel);
  const h = Math.round(height * deel);
  const uit = await sharp(buf)
    .extract({left: Math.round((width - b) / 2), top: Math.round((height - h) / 2), width: b, height: h})
    .trim({threshold: 1})
    .png({compressionLevel: 9, palette: true})
    .toFile(doel);
  console.log(doel, `${uit.width}x${uit.height}`, (uit.size / 1024).toFixed(0) + 'kB');
}

for (const naam of ['merk-vorm', 'logo-bonaire-vorm', 'logo-curacao-vorm', 'logo-nederland-vorm']) {
  await naarKern(`${OUT}/${naam}.png`, `${OUT}/${naam.replace('-vorm', '')}-kern.png`);
}
