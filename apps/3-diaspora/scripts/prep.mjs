/**
 * Zet het bronmateriaal van bonairediaspora.org om naar webbeelden.
 *
 * Alle bronnen komen van hun eigen site (BrandCrowd-uploads). De vier vlakken
 * uit het collagebeeld worden apart uitgesneden, want los zijn ze bruikbaar en
 * als collage niet.
 */
import sharp from 'sharp';
import {mkdirSync} from 'node:fs';
import path from 'node:path';

const SRC = 'C:/Users/nieuw/AppData/Local/Temp/diaspora-img';
const OUT = 'public/img';
mkdirSync(OUT, {recursive: true});

const bron = (n) => path.join(SRC, n);
const doel = (n) => path.join(OUT, n);

/* Bestuursportretten. Vierkant, uitgesneden op het gezicht. */
const bestuur = [
  ['src6.jpg', 'bestuur-eusenia.webp'],
  ['src9.jpg', 'bestuur-yguara.webp'],
  ['src1.jpg', 'bestuur-coffie.webp'],
  ['src2.jpg', 'bestuur-silie-s.webp'],
  ['src3.jpg', 'bestuur-silie-i.webp'],
];
for (const [src, uit] of bestuur) {
  await sharp(bron(src))
    .resize({width: 640, height: 640, fit: 'cover', position: sharp.strategy.attention})
    .webp({quality: 80})
    .toFile(doel(uit));
}

/* Liggende en staande beelden. */
const beelden = [
  ['src7.jpg', 'zoutpannen.webp', 1200, 80],
  ['src5.jpg', 'ondertekening.webp', 1200, 78],
  ['src10.jpg', 'handdruk.webp', 1200, 78],
  ['src11.jpg', 'samen.webp', 1400, 78],
  ['src13.jpg', 'leren.webp', 1600, 78],
  ['src4.jpg', 'portret-werk.webp', 1000, 78],
];
for (const [src, uit, w, q] of beelden) {
  await sharp(bron(src)).resize({width: w, withoutEnlargement: true}).webp({quality: q}).toFile(doel(uit));
}

/**
 * De collage is 1536x1024, vier vlakken van 768x512. De losse foto's vullen hun
 * vak niet helemaal: eromheen staat de crememkleurige collageachtergrond
 * (244,237,221) en soms zuiver wit. Elke uitsnede wordt daarom naar binnen
 * bijgeknipt tot de eerste rij of kolom die echt beeld is.
 */
{
  const {data, info} = await sharp(bron('src8.png')).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const W = info.width;
  const achtergrond = (x, y) => {
    const i = (y * W + x) * 4;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]];
    return Math.abs(r - 244) < 14 && Math.abs(g - 237) < 14 && Math.abs(b - 221) < 20;
  };
  const knip = (X, Y, QW, QH) => {
    let l = 0, r = QW - 1, t = 0, o = QH - 1;
    const kolomLeeg = (x) => {
      let n = 0;
      for (let y = t; y <= o; y++) if (achtergrond(X + x, Y + y)) n++;
      return n / (o - t + 1) > 0.9;
    };
    const rijLeeg = (y) => {
      let n = 0;
      for (let x = l; x <= r; x++) if (achtergrond(X + x, Y + y)) n++;
      return n / (r - l + 1) > 0.9;
    };
    while (t < o && rijLeeg(t)) t++;
    while (o > t && rijLeeg(o)) o--;
    while (l < r && kolomLeeg(l)) l++;
    while (r > l && kolomLeeg(r)) r--;
    return {left: X + l, top: Y + t, width: r - l + 1, height: o - t + 1};
  };

  const vlakken = [
    [0, 0, 'slavenhuisjes.webp'],
    [768, 0, 'afrika-kaart.webp'],
    [0, 512, 'vlag-bonaire.webp'],
    [768, 512, 'portret-afrika.webp'],
  ];
  for (const [X, Y, uit] of vlakken) {
    const vak = knip(X, Y, 768, 512);
    await sharp(bron('src8.png')).extract(vak).resize({width: 1100}).webp({quality: 82}).toFile(doel(uit));
  }
}

/**
 * Het logo staat als goud op wit. De witte achtergrond eruit halen met een
 * drempel geeft kartelranden op die dunne letterring, dus de dekking wordt per
 * pixel afgeleid uit hoe ver de pixel van wit af ligt. Daardoor blijft de
 * antialiasing van hun eigen bestand staan.
 */
{
  const {data, info} = await sharp(bron('src12.png')).ensureAlpha().raw().toBuffer({resolveWithObject: true});
  const uit = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // hoe donkerder ten opzichte van wit, hoe dekkender
    const dekking = Math.max(0, Math.min(255, 255 - Math.min(r, g, b)));
    uit[i] = r;
    uit[i + 1] = g;
    uit[i + 2] = b;
    uit[i + 3] = dekking < 6 ? 0 : Math.min(255, Math.round(dekking * 1.6));
  }
  await sharp(uit, {raw: {width: info.width, height: info.height, channels: 4}})
    .trim({threshold: 1})
    .resize({width: 512})
    .png()
    .toFile(doel('logo-bonaire.png'));
  await sharp(uit, {raw: {width: info.width, height: info.height, channels: 4}})
    .trim({threshold: 1})
    .resize({width: 180})
    .png()
    .toFile(doel('merk.png'));
}

console.log('klaar');
