/**
 * Zet de twee letters uit node_modules in public/fonts.
 *
 * In het concept stonden ze als @import boven index.css, rechtstreeks bij
 * Google vandaan. Dat is de duurste vorm die er is: de browser haalt eerst het
 * stijlblad op, leest dat, en ziet pas dan dat er nog twee letterbestanden bij
 * een andere server vandaan moeten komen. Twee extra DNS-opzoekingen en twee
 * extra handdrukken, allemaal voordat er een letter op het scherm staat.
 *
 * Nu staan ze hier onder een vaste naam, zodat er in de HTML een preload op kan
 * (een bestand met een hash in zijn naam kun je niet vooraf noemen) en
 * public/_headers ze een jaar mag bewaren.
 *
 *   node scripts/fonts.mjs
 */
import {copyFile, mkdir, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const UIT = path.join(APP, 'public/fonts');

/* Alleen de as voor het gewicht en alleen het latijnse deel. Fraunces heeft ook
   assen voor optische grootte en voor "wonk"; met alles erin is het bestand
   drie keer zo groot voor een verschil dat hier niemand ziet. */
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
