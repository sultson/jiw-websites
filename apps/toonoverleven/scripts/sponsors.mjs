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

/* Namen zijn overgenomen uit de alt-teksten op hun eigen site. */
const SPONSOREN = [
  {naam: '2 Way', web: 'https://2-way.nl/', bron: '2way-300x180-1.png'},
  {naam: 'Auto Zuiderzee', web: 'https://autozuiderzee.nl/', bron: 'auto-zuiderzee.png'},
  {naam: 'Bevri', web: 'https://www.bevri.eu/', bron: 'bevri-logo.jpg'},
  {naam: 'Burko Transport', web: null, bron: 'Burko-Transport.jpg'},
  {naam: 'Visspecialist Chris Koelewijn', web: 'https://www.onlinevishandel.nl/', bron: 'Chris-Koelewijn.webp'},
  {naam: 'Condoor', web: 'https://www.condoor.com/', bron: 'Condoor-logo.png'},
  {naam: 'Diergigant', web: 'https://diergigant.nl/', bron: 'Logo_diergigant_menu.webp'},
  {naam: 'Flevotin', web: 'https://www.flevotin.nl/', bron: 'logo-flevotin.png'},
  {naam: 'Harton', web: 'https://harton.nl/', bron: 'Harton.svg'},
  {naam: 'JNS Montage', web: 'https://www.jnsmontage.nl/', bron: 'LogoColorTextBelowNW_Web-1.jpg'},
  {naam: 'Kinderveiligheidswinkel', web: 'https://www.kinderveiligheidswinkel.nl/', bron: 'Kinderveiligheidswinkel-scaled.png'},
  {naam: 'Loop Coaching', web: 'https://www.loop-coaching.nl/', bron: 'Loop-Logo-smal.png'},
  {naam: 'Oog van de Dag', web: 'https://oogvandedag.nl/', bron: 'cropped-Logo-voor-in-menu-1.png'},
  {naam: 'Ribbootwinkel', web: 'https://ribbootwinkel.nl/', bron: 'ribbootwinkel_logo.jpg'},
  {naam: 'Secondant2', web: 'https://secondant2.nl', bron: 'secondant2-groen-1024x238-1.png'},
  {naam: 'Tegeldepot', web: 'https://www.tegeldepot.nl/', bron: 'logo.svg'},
  {naam: 'Tolhoek', web: 'https://www.tolhoek.nl/', bron: 'Tolhoek.png'},
  {naam: 'Trendy Woodshop', web: 'https://www.trendywoodshop.nl/nl/', bron: 'TRrendy-woodshop.jpg'},
  {naam: 'Vaillant Fonds', web: 'https://vaillantfonds.nl/', bron: 'Vaillant_logo_center_RGB1-ai.png'},
  {naam: 'Windpark Zeewolde', web: 'https://windparkzeewolde.nl/', bron: 'Logo-Windpark-Zeewolde.jpg'},
];

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
  const info = await sharp(`raw/sponsors/${s.bron}`)
    .flatten({background: '#ffffff'})
    .resize(320, 120, {fit: 'inside', withoutEnlargement: false})
    .webp({quality: 88})
    .toFile(uit);
  lijst.push({...s, beeld: `/img/sponsors/${naam}.webp`});
  console.log(`${naam}.webp ${info.width}x${info.height} ${(info.size / 1024).toFixed(0)} kB`);
}

writeFileSync('src/sponsoren.json', JSON.stringify(lijst.map(({naam, web, beeld}) => ({naam, web, beeld})), null, 2) + '\n');
console.log(`\n${lijst.length} logo's, lijst weggeschreven naar src/sponsoren.json`);
