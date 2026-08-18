/**
 * Zet de twee letters uit node_modules in public/fonts.
 *
 * Ze stonden eerder als @import boven index.css, rechtstreeks bij Google
 * vandaan. Dat is de duurste vorm die er is: de browser moet eerst het
 * stijlblad ophalen, dat leest hij, en pas dan ziet hij dat er nog twee
 * letterbestanden bij een andere server vandaan moeten komen. Twee extra
 * DNS-opzoekingen en twee extra handdrukken, allemaal vóór de eerste letter op
 * het scherm staat. Bovendien ziet elke bezoeker van deze bloemenwinkel dan
 * ongevraagd een server van Google.
 *
 * Nu staan ze hier onder een vaste naam, zodat er in de HTML een preload op kan
 * (een bestand met een hash in zijn naam kun je niet vooraf noemen) en
 * public/_headers ze een jaar mag bewaren.
 *
 * De npm-pakketten blijven staan: die zijn de herkomst en de licentie, en
 * hiermee zijn ze in één opdracht bij te werken.
 *
 *   node scripts/fonts.mjs
 */
import {copyFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UIT = path.join(APP, 'public/fonts');

/* Alleen de as voor het gewicht en alleen het latijnse deel. Fraunces heeft ook
   assen voor optische grootte en voor "wonk", en met alles erin is het bestand
   drie keer zo groot voor een verschil dat op deze site niemand ziet. */
const LETTERS = [
  ['@fontsource-variable/inter/files/inter-latin-wght-normal.woff2', 'inter-latin-wght.woff2'],
  ['@fontsource-variable/fraunces/files/fraunces-latin-wght-normal.woff2', 'fraunces-latin-wght.woff2'],
];

await mkdir(UIT, {recursive: true});

for (const [bron, naam] of LETTERS) {
  const van = path.join(APP, 'node_modules', bron);
  const naar = path.join(UIT, naam);
  await copyFile(van, naar);
  const {size} = await stat(naar);
  console.log(`fonts: ${naam} (${(size / 1024).toFixed(0)} kB)`);
}
