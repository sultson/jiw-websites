/**
 * Tekent public/logo-email.png: het merk zoals het in de bevestigingsmail
 * bovenaan staat. Haar bloem met de naam ernaast, in hetzelfde lettertype en
 * dezelfde kleur als de balk boven aan de site.
 *
 * Waarom een los bestand en niet een van de beelden uit public/img:
 *
 * 1. Een mailclient wil PNG. Outlook op Windows toont geen WebP, en dat is wat
 *    scripts/webp.mjs van alles in public/img maakt.
 * 2. Het adres moet vast blijven. Een mail die vorige maand verstuurd is wijst
 *    hier nog steeds naartoe; een naam met een hash erin is over een jaar een
 *    leeg vak in iemands archief.
 * 3. Geen doorzichtige achtergrond. Oudere Outlook tekent die als een zwart
 *    vlak. Daarom staat het merk op precies de kleur van de balk waar het in
 *    de mail op ligt (surfaceAlt in worker/confirmation-email.ts).
 *
 * De tekst wordt in een echte browser gezet, met haar eigen Quicksand uit
 * public/fonts erin. Dat is de enige manier om hetzelfde lettertype te krijgen
 * als op de site: sharp tekent tekst met de lettertypes die op deze machine
 * geinstalleerd staan, en Quicksand staat daar niet bij.
 *
 * Draaien als het merk verandert, verder nooit. Het bestand staat in git.
 *
 *   node scripts/mail-logo.mjs
 */
import {readFileSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const APP = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/* Playwright staat niet in de dependencies van deze app: het is gereedschap
   voor één bestand dat eens per jaar draait, en dat is het niet waard om bij
   elke install mee te slepen. Hij wordt geleend uit claudius, net als bij
   cashflow. */
const leen = createRequire('C:/Users/nieuw/dev/claudius/package.json');
const {chromium} = leen('playwright');

/* Moet gelijk zijn aan colors.surfaceAlt in worker/confirmation-email.ts. Lopen
   die uit elkaar, dan ligt het merk in de mail op een zichtbaar vlak van net de
   verkeerde tint. */
const BALK = '#f6f4ef';
const TEAL = '#316d78';
const INKT = '#2b4249';

/* Weergave op 260 px in de mail, dus op het dubbele tekenen: dan blijft het
   scherp op een telefoon met een retina-scherm. */
const BREEDTE = 520;

const bloem = readFileSync(path.join(APP, 'public/img/bloem.png')).toString('base64');
const quicksand = readFileSync(path.join(APP, 'public/fonts/quicksand-latin.woff2')).toString('base64');

const html = `<!doctype html>
<html><head><meta charset="utf-8"><style>
  @font-face {
    font-family: 'Quicksand';
    font-weight: 400 700;
    src: url(data:font/woff2;base64,${quicksand}) format('woff2');
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { background: ${BALK}; }
  .merk {
    display: inline-flex; align-items: center; gap: 22px;
    padding: 26px 30px; background: ${BALK};
  }
  .merk img { width: 86px; height: 86px; display: block; }
  .merk span {
    font-family: 'Quicksand', sans-serif; font-weight: 600; font-size: 38px;
    line-height: 1.1; color: ${INKT}; letter-spacing: 0.2px; white-space: nowrap;
  }
  .merk span em { font-style: normal; color: ${TEAL}; }
</style></head>
<body><div class="merk" id="merk">
  <img src="data:image/png;base64,${bloem}" alt="">
  <span>Bewust Gezond in je Mond</span>
</div></body></html>`;

const browser = await chromium.launch();
const pagina = await browser.newPage({deviceScaleFactor: 1});
await pagina.setContent(html, {waitUntil: 'load'});
await pagina.evaluate(() => document.fonts.ready);

const merk = pagina.locator('#merk');
const maat = await merk.boundingBox();
const schaal = BREEDTE / maat.width;

/* Opnieuw op de goede schaal, zodat de letters scherp gezet worden in plaats
   van een kleiner plaatje dat uitgerekt wordt. */
await pagina.setViewportSize({width: Math.ceil(maat.width), height: Math.ceil(maat.height)});
const plaat = await pagina.screenshot({
  clip: {x: maat.x, y: maat.y, width: maat.width, height: maat.height},
  scale: 'css',
});
await browser.close();

/* Sharp doet het verkleinen: hij schaalt netter dan een screenshot op
   deviceScaleFactor, en haalt meteen het alfakanaal eruit. */
const require2 = createRequire(path.join(APP, 'package.json'));
const sharp = require2('sharp');

const uit = path.join(APP, 'public/logo-email.png');
const klaar = await sharp(plaat)
  .resize({width: BREEDTE})
  .flatten({background: BALK})
  .png({compressionLevel: 9})
  .toBuffer();

writeFileSync(uit, klaar);

const {width, height} = await sharp(klaar).metadata();
console.log(
  `mail-logo: ${width}x${height} (schaal ${schaal.toFixed(2)}x), ${(klaar.length / 1024).toFixed(1)} kB -> public/logo-email.png`,
);
