/**
 * Generates Doelio's brand raster assets from inline SVG (no source photos):
 *   public/favicon.png        192x192  tab / PWA icon
 *   public/apple-touch-icon.png 180x180 iOS home screen
 *   public/og.jpg             1200x630 social share card
 *
 * Run: pnpm --filter @jiw/doelio optimize-images
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC = resolve(__dirname, '../public');

const iconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
      <stop stop-color="#15161f"/><stop offset="1" stop-color="#0b0c13"/>
    </linearGradient>
    <linearGradient id="ring" x1="14" y1="14" x2="50" y2="50" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.95"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.4"/>
    </linearGradient>
    <radialGradient id="core" cx="0.4" cy="0.35" r="0.8">
      <stop stop-color="#aee3f5"/><stop offset="1" stop-color="#7a5cf0"/>
    </radialGradient>
  </defs>
  <rect width="64" height="64" rx="15" fill="url(#bg)"/>
  <circle cx="32" cy="32" r="19" fill="none" stroke="url(#ring)" stroke-width="3"/>
  <circle cx="32" cy="32" r="11" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="2.4"/>
  <circle cx="32" cy="32" r="5.5" fill="url(#core)"/>
</svg>`;

const ogSvg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="base" x1="0" y1="0" x2="1200" y2="630" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0e0f18"/><stop offset="1" stop-color="#0a0b11"/>
    </linearGradient>
    <radialGradient id="a1" cx="0.18" cy="0.1" r="0.7">
      <stop stop-color="#3b6ef5" stop-opacity="0.55"/><stop offset="1" stop-color="#3b6ef5" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a2" cx="0.92" cy="0.22" r="0.7">
      <stop stop-color="#8a5cf6" stop-opacity="0.5"/><stop offset="1" stop-color="#8a5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="a3" cx="0.6" cy="1.05" r="0.6">
      <stop stop-color="#37d0e0" stop-opacity="0.32"/><stop offset="1" stop-color="#37d0e0" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="ring" x1="70" y1="250" x2="170" y2="350" gradientUnits="userSpaceOnUse">
      <stop stop-color="#ffffff" stop-opacity="0.95"/><stop offset="1" stop-color="#ffffff" stop-opacity="0.45"/>
    </linearGradient>
    <radialGradient id="core" cx="0.4" cy="0.35" r="0.8">
      <stop stop-color="#aee3f5"/><stop offset="1" stop-color="#7a5cf0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#base)"/>
  <rect width="1200" height="630" fill="url(#a1)"/>
  <rect width="1200" height="630" fill="url(#a2)"/>
  <rect width="1200" height="630" fill="url(#a3)"/>

  <g transform="translate(96,236)">
    <circle cx="46" cy="46" r="42" fill="none" stroke="url(#ring)" stroke-width="6"/>
    <circle cx="46" cy="46" r="24" fill="none" stroke="#ffffff" stroke-opacity="0.28" stroke-width="5"/>
    <circle cx="46" cy="46" r="12" fill="url(#core)"/>
  </g>
  <text x="210" y="312" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
        font-size="84" font-weight="600" letter-spacing="-3" fill="#f4f5fa">doelio</text>

  <text x="98" y="430" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Helvetica Neue', Arial, sans-serif"
        font-size="58" font-weight="600" letter-spacing="-2" fill="#f4f5fa">AI met een doel.</text>
  <text x="100" y="490" font-family="-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif"
        font-size="27" font-weight="400" letter-spacing="6" fill="#9aa0b5">AI-CONSULTANCY &#183; NEDERLAND</text>
</svg>`;

async function main() {
  await sharp(Buffer.from(iconSvg)).resize(192, 192).png().toFile(resolve(PUBLIC, 'favicon.png'));
  await sharp(Buffer.from(iconSvg)).resize(180, 180).png().toFile(resolve(PUBLIC, 'apple-touch-icon.png'));
  await sharp(Buffer.from(ogSvg)).jpeg({ quality: 88 }).toFile(resolve(PUBLIC, 'og.jpg'));
  console.log('Generated favicon.png, apple-touch-icon.png, og.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
