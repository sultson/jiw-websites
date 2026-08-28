/**
 * Wordmark used in the confirmation email. Email clients need a raster image,
 * and the brand has no logo file yet, so the wordmark is rendered from type.
 * Matches the on-page wordmark: humanist sans, harbour blue, "NL" in a chip.
 */
import { writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1040" height="200" viewBox="0 0 1040 200">
  <rect width="1040" height="200" fill="#ffffff"/>
  <text x="0" y="128" font-family="Helvetica, Arial, sans-serif" font-weight="600" font-size="88" letter-spacing="-2" fill="#143a5e">Immigration Services</text>
  <rect x="892" y="62" width="120" height="76" rx="12" fill="#143a5e"/>
  <text x="914" y="119" font-family="Helvetica, Arial, sans-serif" font-weight="bold" font-size="52" fill="#ffffff">NL</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).resize({ width: 520 }).png().toBuffer();
await writeFile(new URL('../public/images/email-logo.png', import.meta.url), png);
console.log(`email-logo.png: ${(png.length / 1024) | 0}kB`);
