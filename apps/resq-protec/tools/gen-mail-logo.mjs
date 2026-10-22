// The logo for the confirmation email, as a flat PNG: mail clients render SVG
// inconsistently or not at all. The background is flattened onto the logo bar's
// colour (worker/confirmation.ts, surfaceAlt) instead of left transparent, because a
// client in dark mode puts a transparent PNG on black and the dark lettering vanishes.
// 520 wide for display at 260, so it stays sharp on retina screens.
import sharp from 'sharp';

const out = 'public/images/mail-logo.png';
await sharp('public/images/logo-rw.svg', { density: 300 })
  .resize({ width: 520 })
  .flatten({ background: '#f7f7f5' })
  .png({ compressionLevel: 9, palette: true })
  .toFile(out);
const meta = await sharp(out).metadata();
console.log(`${out}: ${meta.width}x${meta.height}`);
