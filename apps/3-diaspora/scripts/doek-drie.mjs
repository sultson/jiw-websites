/**
 * Het doek voor de gedeelde vlakken, geweven uit alle drie de zegels.
 *
 * Tot nu toe lag daar het zegel van 3 Diaspora, maar dat IS het zegel van de
 * Bonairiaanse stichting. Op een gedeelde pagina leest dat alsof Bonaire boven de
 * andere twee staat. Daarom nu een tegel van drie bij drie velden waarin elk
 * zegel precies drie keer voorkomt, en nooit twee dezelfde in een rij of kolom.
 */
import sharp from 'sharp';
import {readFileSync} from 'node:fs';

const OUT = 'public/img';
const MAAT = 168;         /* zelfde zegelmaat als in doek.mjs */
const VAK = Math.round(MAAT / 0.44);
const RIJEN = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];

const bronnen = ['logo-bonaire-vorm', 'logo-curacao-vorm', 'logo-nederland-vorm'];
const zegels = [];
for (const naam of bronnen) {
  zegels.push(
    await sharp(readFileSync(`${OUT}/${naam}.png`))
      .resize({width: MAAT, height: MAAT, fit: 'contain', background: {r: 0, g: 0, b: 0, alpha: 0}})
      .toBuffer(),
  );
}

const lagen = [];
RIJEN.forEach((rij, y) =>
  rij.forEach((welk, x) =>
    lagen.push({
      input: zegels[welk],
      left: x * VAK + Math.round((VAK - MAAT) / 2),
      top: y * VAK + Math.round((VAK - MAAT) / 2),
    }),
  ),
);

const uit = await sharp({create: {width: VAK * 3, height: VAK * 3, channels: 4, background: {r: 0, g: 0, b: 0, alpha: 0}}})
  .composite(lagen)
  .png({compressionLevel: 9, palette: true, colours: 16, effort: 10})
  .toFile(`${OUT}/merk-doek-drie.png`);
console.log('merk-doek-drie.png', `${uit.width}x${uit.height}`, (uit.size / 1024).toFixed(0) + 'kB');
