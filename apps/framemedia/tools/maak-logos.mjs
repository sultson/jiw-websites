// Maakt de zender- en klantlogo's klaar voor de site.
//   node maak-logos.mjs
//
// Wat er gebeurt:
//  1. SVG's worden ontdaan van XML-declaratie, DOCTYPE, metadata en de
//     Inkscape/Sodipodi-rommel. Scheelt ruim de helft aan bytes.
//  2. Ontbreekt er een viewBox, dan komt die er uit width/height bij. Zonder
//     viewBox schaalt een <img> het bestand niet mee en staat het logo op zijn
//     eigen pixelmaat.
//  3. Een paar bestanden zijn wit ingekleurd (bedoeld voor een donkere
//     ondergrond). Die worden omgekleurd, want ze komen op een witte tegel.
//  4. De verhouding wordt opgemeten en in een manifest gezet, zodat de bouw
//     per logo de juiste breedte kan zetten.
//
// Waarom een witte tegel: zie shots/logoproef-nieuw.png. Op donker vallen
// AIRBUS, BANG & OLUFSEN, CHINA AIRLINES en de 4 van RTL 4 vrijwel weg - dat
// zijn donkerblauwe/zwarte logo's. Omsleutelen naar een eenkleurige variant
// kan niet: de N van Jaarbeurs en de ring van Vivera zijn uitsparingen, die
// worden dan een klodder (dezelfde valkuil als bij het MTS-logo).

import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { chromium } from 'playwright';
import { pathToFileURL } from 'url';

// hoogte = optische hoogte in beeldpunten op de tegel. Een kaal woordmerk als
// AIRBUS mag lager dan een merk met een regel eronder (GROHE, RAI) of een
// staand merkteken (SBS 6, Vivera), anders lijkt het ene logo twee keer zo
// groot als het andere terwijl ze even hoog zijn.
const ZENDERS = [
  { slug: 'rtl4', bestand: 'rtl4.svg', naam: 'RTL 4', hoogte: 17 },
  { slug: 'rtl7', bestand: 'rtl7.svg', naam: 'RTL 7', hoogte: 19 },
  { slug: 'rtlz', bestand: 'rtlz.svg', naam: 'RTL Z', hoogte: 17 },
  { slug: 'sbs6', bestand: 'sbs6.svg', naam: 'SBS 6', hoogte: 34 },
  { slug: 'net5', bestand: 'net5.png', naam: 'Net 5', hoogte: 32 },
  { slug: 'veronica', bestand: 'veronica.svg', naam: 'Veronica', hoogte: 24 },
  { slug: 'at5', bestand: 'at5.png', naam: 'AT5', hoogte: 28 },
];

const KLANTEN = [
  { slug: 'airbus', bestand: 'airbus.svg', naam: 'Airbus', hoogte: 17 },
  { slug: 'febo', bestand: 'febo.png', naam: 'Febo', hoogte: 22, keerOm: true },
  { slug: 'etos', bestand: 'etos.svg', naam: 'Etos', hoogte: 30 },
  { slug: 'bangolufsen', bestand: 'bangolufsen.svg', naam: 'Bang &amp; Olufsen', hoogte: 26 },
  { slug: 'grohe', bestand: 'grohe.svg', naam: 'Grohe Nederland', hoogte: 28 },
  { slug: 'rai', bestand: 'rai.svg', naam: 'RAI Amsterdam', hoogte: 30 },
  { slug: 'soliver', bestand: 'soliver.svg', naam: 'S. Oliver', hoogte: 24 },
  { slug: 'chinaairlines', bestand: 'chinaairlines.svg', naam: 'China Airlines', hoogte: 14 },
  { slug: 'jaarbeurs', bestand: 'jaarbeurs.svg', naam: 'Jaarbeurs', hoogte: 22 },
  { slug: 'electroworld', bestand: 'electroworld.svg', naam: 'Electroworld', hoogte: 34 },
  { slug: 'vivera', bestand: 'vivera.svg', naam: 'Vivera', hoogte: 34 },
  { slug: 'culimaat', bestand: 'culimaat.svg', naam: 'Culimaat Keukens', hoogte: 24, hertint: '#1b2430' },
];

function schoon(svg, hertint) {
  let s = svg
    .replace(/<\?xml[^>]*\?>/g, '')
    .replace(/<!DOCTYPE[^>]*>/g, '')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<metadata[\s\S]*?<\/metadata>/g, '')
    .replace(/<sodipodi:namedview[\s\S]*?(\/>|<\/sodipodi:namedview>)/g, '')
    .replace(/\s(?:inkscape|sodipodi):[\w-]+\s*=\s*"[^"]*"/g, '')
    .replace(/\sxmlns:(?:inkscape|sodipodi|dc|cc|rdf)\s*=\s*"[^"]*"/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  // Ontbreekt de viewBox, dan uit width/height halen - anders schaalt hij niet.
  if (!/viewBox\s*=/.test(s)) {
    const w = parseFloat((s.match(/\swidth\s*=\s*"([\d.]+)/) || [])[1]);
    const h = parseFloat((s.match(/\sheight\s*=\s*"([\d.]+)/) || [])[1]);
    if (w && h) s = s.replace(/<svg/, `<svg viewBox="0 0 ${w} ${h}"`);
  }
  // Een witte vulling verdwijnt op een witte tegel. Omkleuren naar donker.
  if (hertint) s = s.replace(/#(?:fff|FFF|ffffff|FFFFFF)\b/g, hertint);
  return s;
}

mkdirSync('inhoud/assets/logos/zenders', { recursive: true });
mkdirSync('inhoud/assets/logos/klanten', { recursive: true });

const alles = [];
for (const [lijst, map, bron] of [[ZENDERS, 'zenders', 'raw/zenders'], [KLANTEN, 'klanten', 'raw/klanten']]) {
  for (const item of lijst) {
    const uit = `inhoud/assets/logos/${map}/${item.slug}${item.bestand.endsWith('.png') ? '.png' : '.svg'}`;
    if (item.bestand.endsWith('.png')) {
      copyFileSync(`${bron}/${item.bestand}`, uit);
    } else {
      const voor = readFileSync(`${bron}/${item.bestand}`, 'utf8');
      const na = schoon(voor, item.hertint);
      writeFileSync(uit, na);
      console.log(`${item.slug.padEnd(14)} ${voor.length} -> ${na.length} bytes`);
    }
    alles.push({ ...item, groep: map, pad: '/' + uit.replace(/^inhoud\//, '') });
  }
}

// Verhouding opmeten in een echte browser. Uitrekenen uit de viewBox gaat mis
// bij bestanden waar width/height en viewBox niet overeenkomen (hastens had
// width=4.37 bij een viewBox van 249 breed).
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(pathToFileURL(process.cwd() + '/').href);
for (const item of alles) {
  const src = item.pad.replace(/^\//, 'inhoud/assets/'.replace('inhoud/assets/', '') + 'inhoud/');
  const verhouding = await page.evaluate(src => new Promise(res => {
    const img = new Image();
    img.onload = () => res(img.naturalWidth / img.naturalHeight);
    img.onerror = () => res(null);
    img.src = src;
  }), 'inhoud' + item.pad);
  item.verhouding = verhouding ? Math.round(verhouding * 1000) / 1000 : null;
}
await browser.close();

writeFileSync('inhoud/logos.json', JSON.stringify(alles, null, 2));
console.log('\n' + alles.map(a => `${a.groep}/${a.slug}`.padEnd(24) + `verhouding ${a.verhouding}  breedte ${a.verhouding ? Math.round(a.hoogte * a.verhouding) : '?'}px bij h${a.hoogte}`).join('\n'));
