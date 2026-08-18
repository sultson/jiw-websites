/**
 * Bronmateriaal van de stichtingen zelf, aangeleverd via WhatsApp.
 *
 * Drie dingen:
 * 1. De logo's van alle drie de stichtingen. Ze staan als goud op wit; wij
 *    hebben ze los nodig, met een echte alfarand, zodat ze als watermerk in de
 *    achtergrond van hun eigen pagina kunnen staan.
 * 2. De echte foto's: een ondertekening op Curacao, en drie foto's van de
 *    oprichting van de Nederlandse stichting bij Team notarissen.
 * 3. Het posterbeeld van de oprichtingsvideo, zodat die video pas laadt als
 *    iemand hem echt wil zien.
 */
import sharp from 'sharp';
import {readFileSync} from 'node:fs';

const SRC = 'C:/Users/nieuw/dev/jiw-crm/uploads';
const OUT = 'public/img';

/**
 * Wit eruit, zonder drempel. Een harde drempel geeft kartelranden op die dunne
 * letterring; de dekking wordt daarom per pixel afgeleid uit hoe ver de pixel
 * van wit af ligt, waardoor de antialiasing van hun eigen bestand blijft staan.
 * Deze bestanden komen via WhatsApp en zijn dus jpeg: rond de letters zit
 * ruis van net-niet-wit. Alles onder de ondergrens gaat daarom hard naar nul.
 */
async function knipUitWit(bron) {
  const {data, info} = await sharp(readFileSync(bron)).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const uit = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const dekking = Math.max(0, 255 - Math.min(r, g, b));
    uit[i] = r;
    uit[i + 1] = g;
    uit[i + 2] = b;
    uit[i + 3] = dekking < 14 ? 0 : Math.min(255, Math.round((dekking - 14) * 1.7));
  }
  return {uit, info};
}

/** Wit waar inkt zit, doorzichtig waar niets zit. De site kan hem dan in de
    kleur van het vlak zetten waar hij op staat, in plaats van vast goud. */
async function naarVorm(kleurBuffer, doel) {
  const {data, info} = await sharp(kleurBuffer).ensureAlpha().raw().toBuffer({resolveWithObject: true});
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

const LOGOS = [
  ['fm02a712tk9xfm6gy7o5mw0s.jpg', 'logo-curacao'],
  ['lgrgh98pygisfwu20z8s819l.jpg', 'logo-nederland'],
];

for (const [bestand, naam] of LOGOS) {
  const {uit, info} = await knipUitWit(`${SRC}/${bestand}`);
  const rauw = {raw: {width: info.width, height: info.height, channels: 4}};

  /* het echte logo, in hun eigen goud. 320 is ruim genoeg: het staat op de
     pagina hooguit op 130 pixels, dus dit is al twee keer zo scherp. */
  const kleur = await sharp(uit, rauw).trim({threshold: 2}).resize({width: 320}).png({compressionLevel: 9}).toBuffer();
  await sharp(kleur).toFile(`${OUT}/${naam}.png`);
  console.log(naam, `${info.width}x${info.height}`, (kleur.length / 1024).toFixed(0) + 'kB');

  /* het watermerk staat groot achter de tekst, dus die mag ruimer */
  const groot = await sharp(uit, rauw).trim({threshold: 2}).resize({width: 560}).png().toBuffer();
  await naarVorm(groot, `${OUT}/${naam}-vorm.png`);
}

/* Bonaire had zijn logo al staan, van hun eigen site en scherper dan de
   WhatsApp-versie. Daar hoeft alleen de maskervorm nog bij. */
await naarVorm(await sharp('public/img/logo-bonaire.png').resize({width: 560}).png().toBuffer(), `${OUT}/logo-bonaire-vorm.png`);

/* De foto's. Staand blijft staand, de uitsnede laat sharp zelf op het
   onderwerp vallen waar een vaste verhouding nodig is. */
const FOTOS = [
  ['oprarvrfw8a5tlft9jh9ti65.jpg', 'curacao-ondertekening.webp', 1100],
  ['g0o32whutiwchs6ekal7p38r.jpg', 'nl-notaris-drie.webp', 1100],
  ['p91npvfjegufhqr81pvdmhtl.jpg', 'nl-fondsenboek.webp', 1100],
  ['uo3bbbc6144ltxuaqk0i2ip4.jpg', 'nl-ondertekening.webp', 1100],
];
for (const [bestand, naam, breedte] of FOTOS) {
  const info = await sharp(readFileSync(`${SRC}/${bestand}`))
    .resize({width: breedte, withoutEnlargement: true})
    .webp({quality: 80})
    .toFile(`${OUT}/${naam}`);
  console.log(naam, `${info.width}x${info.height}`, (info.size / 1024).toFixed(0) + 'kB');
}

/* Posterbeeld van de video: het frame waarin hij recht in beeld staat. */
{
  const info = await sharp('gen/vid/poster.png')
    .resize({width: 514, withoutEnlargement: true})
    .webp({quality: 76})
    .toFile(`${OUT}/nl-video-poster.webp`);
  console.log('nl-video-poster.webp', `${info.width}x${info.height}`, (info.size / 1024).toFixed(0) + 'kB');
}
