/**
 * Zet de logo's van de sponsoren om naar wat de site nodig heeft.
 *
 * De bestanden komen van hun eigen site (toonoverleven.nl, blok "Onze
 * sponsoren") en staan in raw/sponsors. Ze zijn allemaal anders: png met
 * transparantie, jpg met witte rand, webp, en twee vectors. Ze komen hier
 * op een gelijke hoogte en in webp terecht, zodat de logowand rustig oogt en
 * niet zwaarder is dan een enkele foto.
 *
 * De vectors gaan ongewijzigd mee: die zijn op elk formaat scherp.
 *
 * Draaien met: node scripts/sponsors.mjs
 */
import sharp from 'sharp';
import {mkdirSync, copyFileSync, writeFileSync} from 'node:fs';

const UIT = 'public/img/sponsors';
mkdirSync(UIT, {recursive: true});

/* Namen zijn overgenomen uit de alt-teksten op hun eigen site. De lijst is die
   van Ron Wille (penningmeester), 21-10-2026: elf sponsoren eraf, vier erbij
   (die vier met de logo's die hij zelf aanleverde, zonder website). De vier
   fondsen en acties die hij voor de homepage noemde staan vooraan. */
const SPONSOREN = [
  {naam: 'Vaillant Fonds', web: 'https://vaillantfonds.nl/', bron: 'Vaillant_logo_center_RGB1-ai.png'},
  {naam: 'Windpark Zeewolde', web: 'https://windparkzeewolde.nl/', bron: 'Logo-Windpark-Zeewolde.jpg'},
  {naam: 'Swim to Fight Cancer Zeewolde', web: null, bron: 'Swim-to-fight-cancer-Zeewolde.png', cirkel: true},
  {naam: 'Oranje Fonds', web: null, bron: 'Oranje Fonds Logo Landscape Orange Small RGB.jpg'},
  {naam: '2 Way', web: 'https://2-way.nl/', bron: '2way-300x180-1.png'},
  {naam: 'Burko Transport', web: null, bron: 'Burko-Transport.jpg'},
  {naam: 'Condoor', web: 'https://www.condoor.com/', bron: 'Condoor-logo.png'},
  {naam: 'Flevotin', web: 'https://www.flevotin.nl/', bron: 'logo-flevotin.png'},
  {naam: 'JNS Montage', web: 'https://www.jnsmontage.nl/', bron: 'LogoColorTextBelowNW_Web-1.jpg'},
  {naam: 'Loop Coaching', web: 'https://www.loop-coaching.nl/', bron: 'Loop-Logo-smal.png'},
  {naam: 'Notaris Vriesinga', web: null, bron: 'Notaris Vriesinga logo.png'},
  {naam: 'Tolhoek', web: 'https://www.tolhoek.nl/', bron: 'Tolhoek.png'},
  {naam: 'Trendy Woodshop', web: 'https://www.trendywoodshop.nl/nl/', bron: 'TRrendy-woodshop.jpg'},
  {naam: 'Vakgarage JWS', web: null, bron: 'logo vakgarage JWS.jpeg'},
];

/** Het logo van Swim to Fight Cancer is een rond embleem op een blauw vlak; alleen het embleem gaat mee. */
async function embleem(bestand) {
  const {data, info} = await sharp(bestand).flatten({background: '#fff'}).raw().toBuffer({resolveWithObject: true});
  let x0 = Infinity, y0 = Infinity, x1 = 0, y1 = 0;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++) {
      const i = (y * info.width + x) * info.channels;
      if (Math.abs(data[i] - data[0]) + Math.abs(data[i + 1] - data[1]) + Math.abs(data[i + 2] - data[2]) > 40) {
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
      }
    }
  const width = x1 - x0 + 1, height = y1 - y0 + 1;
  const masker = Buffer.from(`<svg width="${width}" height="${height}"><circle cx="${width / 2}" cy="${height / 2}" r="${Math.min(width, height) / 2}" fill="#fff"/></svg>`);
  return sharp(bestand).extract({left: x0, top: y0, width, height}).composite([{input: masker, blend: 'dest-in'}]).png().toBuffer();
}

const slug = (n) =>
  n
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

const lijst = [];

for (const s of SPONSOREN) {
  const naam = slug(s.naam);
  if (s.bron.endsWith('.svg')) {
    copyFileSync(`raw/sponsors/${s.bron}`, `${UIT}/${naam}.svg`);
    lijst.push({...s, beeld: `/img/sponsors/${naam}.svg`});
    console.log(`${naam}.svg (vector, ongewijzigd)`);
    continue;
  }
  /* Alles binnen een vak van 320 bij 120, zonder bij te snijden. Wat overblijft
     wordt wit: de logowand staat op witte kaarten, dus dat valt weg. */
  const uit = `${UIT}/${naam}.webp`;
  const info = await sharp(s.cirkel ? await embleem(`raw/sponsors/${s.bron}`) : `raw/sponsors/${s.bron}`)
    .flatten({background: '#ffffff'})
    .resize(320, 120, {fit: 'inside', withoutEnlargement: false})
    .webp({quality: 88})
    .toFile(uit);
  lijst.push({...s, beeld: `/img/sponsors/${naam}.webp`});
  console.log(`${naam}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} kB`);
}

writeFileSync('src/sponsoren.json', JSON.stringify(lijst.map(({naam, web, beeld}) => ({naam, web, beeld})), null, 2) + '\n');
console.log(`\n${lijst.length} logo's, lijst weggeschreven naar src/sponsoren.json`);
