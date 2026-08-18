/**
 * Maakt de pictogrammen die een SVG-favicon niet dekt.
 *
 * Safari op iOS zet een startknop niet neer met een SVG maar met een PNG, en
 * doorschijnend wordt daar zwart. Google's favicon-crawler wil er bovendien een
 * van minstens 48 pixels bij hebben, anders staat er in de zoekresultaten een
 * grijze wereldbol naast de winkel in plaats van hun eigen madeliefje.
 *
 * Het madeliefje is hetzelfde als in public/favicon.svg, maar hier op het
 * donkergroen van de winkelpui: een roze schijf die tot de rand doorloopt wordt
 * op een afgerond vierkant een roze vlek zonder vorm.
 *
 *   node scripts/icons.mjs
 */
import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const IMG = path.join(APP, 'public/img');

const INK = '#0d2a21';
const ROZE = '#c22a5f';

/* De bloem op 62% van het vlak, zodat er rondom lucht staat en hij op een
   afgerond vierkant niet tegen de hoeken aanloopt. */
const merk = (formaat) => {
  const bloem = Math.round(formaat * 0.62);
  const marge = Math.round((formaat - bloem) / 2);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${formaat}" height="${formaat}" viewBox="0 0 ${formaat} ${formaat}">
  <rect width="${formaat}" height="${formaat}" fill="${INK}"/>
  <g transform="translate(${marge} ${marge}) scale(${bloem / 100})">
    <circle cx="50" cy="50" r="50" fill="${ROZE}"/>
    <g fill="#ffffff">
      <ellipse cx="50" cy="30" rx="12.5" ry="17"/>
      <ellipse cx="50" cy="30" rx="12.5" ry="17" transform="rotate(72 50 50)"/>
      <ellipse cx="50" cy="30" rx="12.5" ry="17" transform="rotate(144 50 50)"/>
      <ellipse cx="50" cy="30" rx="12.5" ry="17" transform="rotate(216 50 50)"/>
      <ellipse cx="50" cy="30" rx="12.5" ry="17" transform="rotate(288 50 50)"/>
    </g>
    <circle cx="50" cy="50" r="9" fill="${ROZE}"/>
  </g>
</svg>`);
};

const BESTANDEN = [
  ['apple-touch-icon.png', 180],
  ['icon-96.png', 96],
  ['icon-192.png', 192],
  ['icon-512.png', 512],
];

await mkdir(IMG, {recursive: true});

for (const [naam, formaat] of BESTANDEN) {
  const uit = path.join(IMG, naam);
  await sharp(merk(formaat)).png({compressionLevel: 9}).toFile(uit);
  console.log(`icons: ${naam} (${formaat}x${formaat})`);
}

/* Het manifest hoort bij de twee Android-formaten hierboven. Zonder manifest
   krijgt een bezoeker die de site op zijn beginscherm zet een schermafdruk met
   een grijs randje in plaats van het merkteken. */
const manifest = {
  name: 'Fleurig! Bloemenwinkel',
  short_name: 'Fleurig!',
  description: 'Bloemenwinkel aan de Molendijk in Oud-Beijerland.',
  lang: 'nl-NL',
  start_url: '/',
  display: 'browser',
  background_color: '#fbf7f2',
  theme_color: INK,
  icons: [
    {src: '/img/icon-192.png', sizes: '192x192', type: 'image/png'},
    {src: '/img/icon-512.png', sizes: '512x512', type: 'image/png'},
    {src: '/img/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable'},
  ],
};

await writeFile(path.join(APP, 'public/site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
console.log('icons: site.webmanifest');
