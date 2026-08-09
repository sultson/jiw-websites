/**
 * The picture a shared link shows.
 *
 * Made here rather than by hand so it cannot drift from what the site says: the
 * museum's name, its tagline, and one of its own paintings, on the same gallery
 * black the site is built on. Run it again after a rename.
 *
 *   node scripts/og-image.mjs
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const app = path.resolve(fileURLToPath(new URL('.', import.meta.url)), '..');
const bron = path.join(app, 'public/art/pearl-earring-full.webp');
const doel = path.join(app, 'public/og-preview.jpg');

const W = 1200;
const H = 630;
const BACK = '#0e0d0c';
const BONE = '#efe9dc';
const RED = '#d24b3f';

/** The painting fills the right half, cropped to the face. */
const schilderij = await sharp(readFileSync(bron))
  .resize({ width: Math.round(W * 0.52), height: H, fit: 'cover', position: 'top' })
  .toBuffer();

/**
 * A soft edge into the dark on the left, so the type never sits on paint.
 * Drawn as a gradient mask rather than a hard seam: a straight cut through a
 * face reads as a mistake.
 */
// `dest-in` reads the alpha channel, not the brightness, so the gradient has
// to be in opacity. A white-to-white gradient masks nothing at all.
const vervaging = Buffer.from(
  `<svg width="${Math.round(W * 0.52)}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <defs>
       <linearGradient id="fade" x1="0" x2="1">
         <stop offset="0" stop-color="#fff" stop-opacity="0"/>
         <stop offset="0.3" stop-color="#fff" stop-opacity="1"/>
       </linearGradient>
     </defs>
     <rect width="100%" height="100%" fill="url(#fade)"/>
   </svg>`,
);

const gemaskeerd = await sharp(schilderij)
  .composite([{ input: vervaging, blend: 'dest-in' }])
  .png()
  .toBuffer();

const tekst = Buffer.from(
  `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
     <style>
       .naam { font-family: 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 86px; letter-spacing: 1px; fill: ${BONE}; }
       .tag { font-family: 'Arial Narrow', Arial, sans-serif; font-weight: 700; font-size: 38px; letter-spacing: 6px; fill: ${RED}; }
     </style>
     <text class="naam" x="64" y="300">KLASHORST</text>
     <text class="naam" x="64" y="382">MUSEUM</text>
     <text class="tag" x="68" y="438">LUST FOR LIFE</text>
   </svg>`,
);

await sharp({ create: { width: W, height: H, channels: 3, background: BACK } })
  .composite([
    { input: gemaskeerd, left: W - Math.round(W * 0.52), top: 0 },
    { input: tekst, left: 0, top: 0 },
  ])
  .jpeg({ quality: 86 })
  .toFile(doel);

console.log(`og-preview.jpg opnieuw gemaakt: ${doel}`);
console.log('Vergeet de ?v=YYYYMMDD in index.html niet, anders blijft de oude in de cache.');
