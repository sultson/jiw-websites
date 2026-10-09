// Writes dist/mail/jasm-flowers-email.png - the logo as it appears in the
// confirmation email. Run after src/build.mjs (which wipes dist), before deploy.
//
// Three reasons this is its own file rather than one of the /i/ variants the build
// already produces:
//
// 1. Email clients need PNG. The build emits WebP with a JPEG fallback; Outlook
//    shows WebP as a broken image.
// 2. The URL has to be stable. Everything in /i/ is content-hashed and served
//    immutable for a year, so its name changes whenever the file does - and a mail
//    sent last month would then point at a 404 forever. This path never changes.
// 3. The alpha has to go. The client's logo is keyed out to transparency, which
//    older Outlook renders as a black box. So the lettering is composited onto the
//    exact colour of the bar it sits on in the mail (surfaceAlt in confirmation.ts)
//    and shipped flat.
//
// logo-light is the file with the dark lettering - the one for light backgrounds,
// which is what the logo bar in the mail is. logo-dark (cream lettering) would
// disappear into it.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const SRC = path.join(ROOT, 'assets', 'img', 'logo-light.png');
const OUT = path.join(ROOT, 'dist', 'mail', 'jasm-flowers-email.png');

// Must match `colors.surfaceAlt` in worker/confirmation.ts. If they drift the logo
// sits on a visible rectangle of the wrong cream.
const BAR = { r: 0xf7, g: 0xf5, b: 0xf1 };

// Rendered at 240 in the mail, so twice that stays sharp on a retina screen.
const WIDTH = 480;
const PAD = 18;

if (!fs.existsSync(SRC)) throw new Error(`missing ${SRC}`);
fs.mkdirSync(path.dirname(OUT), { recursive: true });

// trim() first: the keyed-out source carries transparent margin, and without this
// the lettering ends up floating small in the middle of a wide cream band.
const art = await sharp(SRC)
  .trim()
  .resize({ width: WIDTH - PAD * 2, withoutEnlargement: true })
  .toBuffer();
const { width, height } = await sharp(art).metadata();

await sharp({
  create: {
    width: WIDTH,
    height: height + PAD * 2,
    channels: 3,
    background: BAR,
  },
})
  .composite([{ input: art, left: Math.round((WIDTH - width) / 2), top: PAD }])
  .png({ compressionLevel: 9, palette: true })
  .toFile(OUT);

const { size } = fs.statSync(OUT);
console.log(`mail logo: ${WIDTH}x${height + PAD * 2}, ${(size / 1024).toFixed(1)} kB -> dist/mail/jasm-flowers-email.png`);
