// Curates scraped Instagram media into /public for the Beauty by Mariya site.
// Run from app root: node scripts/curate-media.mjs
// Requires: sharp (installed), ffmpeg (system).

import sharp from 'sharp';
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(__dirname, '..');
const IG = path.join(APP_ROOT, 'scraped-media/instagram');
const PUB = path.join(APP_ROOT, 'public');

const ig = (rel) => path.join(IG, rel);
const out = (name) => path.join(PUB, name);

// ── Encoders ─────────────────────────────────────────────────────────────────

async function webpFromImage(srcAbs, dst, { width, height, fit = 'cover', quality = 82, position, preExtract } = {}) {
  let pipe = sharp(srcAbs).rotate();
  if (preExtract) {
    const m = await sharp(srcAbs).rotate().metadata();
    const top = Math.round((m.height || 0) * (preExtract.topPct || 0));
    const h = Math.round((m.height || 0) * preExtract.heightPct);
    pipe = pipe.extract({ left: 0, top, width: m.width, height: h });
  }
  if (width || height) {
    pipe = pipe.resize({
      width,
      height,
      fit,
      position: position ?? 'attention',
      // For pre-extracted sources we need to allow upscale, otherwise the smaller
      // crop produces letterboxed output. For ordinary IG sources keep upscale off.
      withoutEnlargement: !preExtract,
    });
  }
  await pipe.webp({ quality, effort: 5 }).toFile(dst);
  return dst;
}

// Pad a portrait image into a wider canvas with a soft blush background.
async function ogImageFromSrc(srcAbs, dst) {
  const targetW = 1200, targetH = 630;
  const fg = await sharp(srcAbs).rotate().resize({
    height: targetH,
    fit: 'inside',
    withoutEnlargement: true,
  }).toBuffer();
  const meta = await sharp(fg).metadata();
  await sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 3,
      background: { r: 241, g: 225, b: 214 }, // #F1E1D6 blush
    },
  })
    .composite([{ input: fg, left: Math.max(0, Math.round((targetW - (meta.width || targetH)) / 2)), top: 0 }])
    .jpeg({ quality: 84, mozjpeg: true })
    .toFile(dst);
  return dst;
}

// Extract a frame from a video at a given timestamp, scaled to ~width.
function extractFrame(videoAbs, tmpJpg, t = '00:00:01.0', width = 1280) {
  execFileSync('ffmpeg', [
    '-y', '-ss', t, '-i', videoAbs,
    '-frames:v', '1',
    '-vf', `scale=${width}:-2`,
    '-q:v', '2',
    tmpJpg,
  ], { stdio: 'ignore' });
  return tmpJpg;
}

// Trim, scale, strip audio. Used for reels.
function compressVideo(srcAbs, dst, { duration = 6, width = 720, crf = 26 } = {}) {
  execFileSync('ffmpeg', [
    '-y', '-i', srcAbs,
    '-t', String(duration),
    '-c:v', 'libx264', '-preset', 'fast', '-crf', String(crf),
    '-vf', `scale=${width}:-2`,
    '-an',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    dst,
  ], { stdio: 'ignore' });
  return dst;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const portrait45 = (q = 82) => ({ width: 1200, height: 1500, fit: 'cover', quality: q });
const portraitTeam = (q = 82) => ({ width: 1000, height: 1200, fit: 'cover', quality: q });
const square = (q = 82) => ({ width: 1400, height: 1400, fit: 'cover', quality: q });
const wide = (q = 72) => ({ width: 1920, height: 1280, fit: 'cover', quality: q });
const gallery = (q = 82) => ({ width: 1200, height: 1200, fit: 'cover', quality: q });
const poster = (q = 78) => ({ width: 720, height: 1280, fit: 'cover', quality: q });

// Canonical selections: each entry maps output filename -> source descriptor.
// `type` controls how we process it.

const tmpDir = path.join(APP_ROOT, '.curation-tmp');
fs.mkdirSync(tmpDir, { recursive: true });
fs.mkdirSync(PUB, { recursive: true });

// ── HERO TILES ───────────────────────────────────────────────────────────────
const heroes = [
  { file: 'hero-01.webp', src: 'gel.lakkk/C1RXEYpNw9Z.jpg', opt: portrait45(80),
    cat: 'hero', account: 'gel.lakkk', shortCode: 'C1RXEYpNw9Z',
    alt_nl: 'Glanzende zwarte gelnagels met sparkle', alt_en: 'Glossy black gel nails with glitter accent' },
  { file: 'hero-02.webp', src: 'levytska.permanent/DWQqGumiMeb.jpg',
    // Crop bottom 22% to drop the watermark/logo before resize.
    preExtract: { topPct: 0, heightPct: 0.78 },
    opt: { ...portrait45(80), position: 'centre' },
    cat: 'hero', account: 'levytska.permanent', shortCode: 'DWQqGumiMeb',
    alt_nl: 'Permanente make-up lippen close-up', alt_en: 'Permanent makeup lips close-up' },
  { file: 'hero-03.webp', src: 'beauty_bymariya/Cz4duOHLFAk.jpg', opt: portrait45(80),
    cat: 'hero', account: 'beauty_bymariya', shortCode: 'Cz4duOHLFAk',
    alt_nl: 'Lange blonde highlights styling', alt_en: 'Long blonde highlights styling' },
  { file: 'hero-04.webp', src: 'gel.lakkk/CzMDfI9NR-x.jpg', opt: portrait45(80),
    cat: 'hero', account: 'gel.lakkk', shortCode: 'CzMDfI9NR-x',
    alt_nl: 'Donkere bordeaux nagels met shimmer', alt_en: 'Deep burgundy nails with shimmer' },
  { file: 'hero-05.webp', src: 'beauty_bymariya/CwdjIgHNXf2.jpg', opt: portrait45(80),
    cat: 'hero', account: 'beauty_bymariya', shortCode: 'CwdjIgHNXf2',
    alt_nl: 'Brow lamination behandeling', alt_en: 'Brow lamination treatment' },
  { file: 'hero-06.webp', src: 'gel.lakkk/CqIZ4iutVrp.jpg', opt: portrait45(80),
    cat: 'hero', account: 'gel.lakkk', shortCode: 'CqIZ4iutVrp',
    alt_nl: 'Natuurlijke nude manicure', alt_en: 'Natural nude manicure' },
];

// ── HERO FEATURE ─────────────────────────────────────────────────────────────
const heroFeature = {
  file: 'hero.webp', src: 'gel.lakkk/C1RW1G5NaEq.jpg', opt: wide(72),
  cat: 'hero-feature', account: 'gel.lakkk', shortCode: 'C1RW1G5NaEq',
  alt_nl: 'Winterse nagelkunst met sneeuwvlokken en glitter', alt_en: 'Winter nail art with snowflakes and glitter',
};

// ── TEAM PORTRAITS ───────────────────────────────────────────────────────────
// Some team members have no still photo posts; for those we extract a clean frame from a video.
const team = [
  { file: 'team-mariya.webp', kind: 'image', src: 'levytska.permanent/DXT1YcqCLXe.jpg', opt: portraitTeam(84),
    cat: 'team', account: 'levytska.permanent', shortCode: 'DXT1YcqCLXe',
    alt_nl: 'Mariya, eigenaresse en PMU-specialist', alt_en: 'Mariya, owner and PMU specialist',
    qualityNote: 'real face shot (in branded shirt)' },
  { file: 'team-maryna.webp', kind: 'video-frame', src: 'beauty_bymariya/C3p35tfNNoS.mp4', t: '00:00:01.5',
    opt: portraitTeam(82),
    cat: 'team', account: 'beauty_bymariya', shortCode: 'C3p35tfNNoS',
    alt_nl: 'Maryna, nagelstyliste bij Beauty by Mariya', alt_en: 'Maryna, nail technician at Beauty by Mariya',
    qualityNote: 'real face shot extracted from video (Beauty by Mariya jacket)' },
  { file: 'team-svitlana.webp', kind: 'video-frame', src: 'kohut.cosmetology/DXoLAF3guaB.mp4', t: '00:00:06.2',
    // Drop top 22% to remove the caption overlay before crop-resize.
    opt: { ...portraitTeam(84), position: 'top' },
    preExtract: { topPct: 0.22, heightPct: 0.78 },
    cat: 'team', account: 'kohut.cosmetology', shortCode: 'DXoLAF3guaB',
    alt_nl: 'Svitlana, schoonheidsspecialist', alt_en: 'Svitlana, beautician and skin therapist',
    qualityNote: 'real face shot extracted from her Q&A video (caption cropped out)' },
  { file: 'team-lyuba.webp', kind: 'video-frame', src: 'lyubanovosad/DUwLrEMCKam.mp4', t: '00:00:02.0',
    opt: portraitTeam(82),
    cat: 'team', account: 'lyubanovosad', shortCode: 'DUwLrEMCKam',
    alt_nl: 'Lyuba, haarstyliste en colorist', alt_en: 'Lyuba, hairstylist and colorist',
    qualityNote: 'real face shot extracted from kitchen video' },
];

// ── GALLERY ─────────────────────────────────────────────────────────────────
const gallNails = [
  { file: 'gal-nails-01.webp', src: 'gel.lakkk/CzMD4Y6t6SE.jpg', account: 'gel.lakkk', shortCode: 'CzMD4Y6t6SE',
    alt_nl: 'Donker plum cat-eye nagels', alt_en: 'Deep plum cat-eye nails' },
  { file: 'gal-nails-02.webp', src: 'gel.lakkk/CqNLaKKNZHg.jpg', account: 'gel.lakkk', shortCode: 'CqNLaKKNZHg',
    alt_nl: 'Klassieke bordeauxrode korte nagels', alt_en: 'Classic burgundy short nails' },
  { file: 'gal-nails-03.webp', src: 'beauty_bymariya/Cr8QssDr4E8.jpg', account: 'beauty_bymariya', shortCode: 'Cr8QssDr4E8',
    alt_nl: 'Felroze fuchsia manicure', alt_en: 'Bright fuchsia magnetic manicure' },
  { file: 'gal-nails-04.webp', src: 'gel.lakkk/CzMDlvPNgYs.jpg', account: 'gel.lakkk', shortCode: 'CzMDlvPNgYs',
    alt_nl: 'Romige nude amandelnagels', alt_en: 'Creamy nude almond nails' },
  { file: 'gal-nails-05.webp', src: 'beauty_bymariya/C7WZzo8tJEJ.jpg', account: 'beauty_bymariya', shortCode: 'C7WZzo8tJEJ',
    alt_nl: 'Roze magnetic manicure op denim', alt_en: 'Soft pink magnetic manicure on denim' },
  { file: 'gal-nails-06.webp', src: 'beauty_bymariya/DBuJZ3TtjUG.jpg', account: 'beauty_bymariya', shortCode: 'DBuJZ3TtjUG',
    alt_nl: 'Felrode magnetic nagels met nailart', alt_en: 'Bright red magnetic nails with art accent' },
  { file: 'gal-nails-07.webp', src: 'gel.lakkk/CwFdr5tt9vm.jpg', account: 'gel.lakkk', shortCode: 'CwFdr5tt9vm',
    alt_nl: 'Helder oranje pedicure', alt_en: 'Vibrant orange pedicure' },
  { file: 'gal-nails-08.webp', src: 'beauty_bymariya/C9kyjnGNAd2.jpg', account: 'beauty_bymariya', shortCode: 'C9kyjnGNAd2',
    alt_nl: 'Herfstige nailart met blad- en pompoenmotief', alt_en: 'Autumn nail art with leaf and pumpkin motif' },
];

const gallBrows = [
  { file: 'gal-brows-01.webp', src: 'levytska.permanent/DWQqGumiMeb.jpg', account: 'levytska.permanent', shortCode: 'DWQqGumiMeb',
    alt_nl: 'PMU lippen met natuurlijke glans', alt_en: 'PMU lips with natural glossy finish',
    preExtract: { topPct: 0, heightPct: 0.78 }, position: 'centre' },
  { file: 'gal-brows-02.webp', src: 'beauty_bymariya/CwdjIgHNXf2.jpg', account: 'beauty_bymariya', shortCode: 'CwdjIgHNXf2',
    alt_nl: 'Brow lamination resultaat', alt_en: 'Brow lamination result' },
  { file: 'gal-brows-03.webp', src: 'levytska.permanent/DVt_aZsiPh0.jpg', account: 'levytska.permanent', shortCode: 'DVt_aZsiPh0',
    alt_nl: 'Wenkbrauwarchitectuur, voorbereiding', alt_en: 'Brow architecture, preparation' },
  { file: 'gal-brows-04.webp', src: 'levytska.permanent/DW-sbs2iBLn.jpg', account: 'levytska.permanent', shortCode: 'DW-sbs2iBLn',
    alt_nl: 'Voor en na PMU-laser behandeling', alt_en: 'Before and after PMU laser treatment' },
  { file: 'gal-brows-05.webp', src: 'levytska.permanent/DWHkIPsiIDF.jpg', account: 'levytska.permanent', shortCode: 'DWHkIPsiIDF',
    alt_nl: 'PMU verwijdering, vergelijking', alt_en: 'PMU removal comparison' },
  { file: 'gal-brows-06.webp', src: 'levytska.permanent/DWmuki8iCQG.jpg', account: 'levytska.permanent', shortCode: 'DWmuki8iCQG',
    alt_nl: 'Specialist aan het werk met PMU-machine', alt_en: 'Specialist working with PMU machine' },
];

const gallHair = [
  { file: 'gal-hair-01.webp', src: 'beauty_bymariya/Cz4duOHLFAk.jpg', account: 'beauty_bymariya', shortCode: 'Cz4duOHLFAk',
    alt_nl: 'Stralende blonde highlights', alt_en: 'Bright blonde highlights' },
  { file: 'gal-hair-02.webp', src: 'beauty_bymariya/CsiEV_6Nn9w.jpg', account: 'beauty_bymariya', shortCode: 'CsiEV_6Nn9w',
    alt_nl: 'Levendige roodbruine haarkleuring', alt_en: 'Vibrant copper red color' },
  { file: 'gal-hair-03.webp', src: 'beauty_bymariya/CqS1TP3jnQ8.jpg', account: 'beauty_bymariya', shortCode: 'CqS1TP3jnQ8',
    alt_nl: 'Davines kleuring, vurig rood', alt_en: 'Davines color, fiery red portrait' },
  { file: 'gal-hair-04.webp', src: 'beauty_bymariya/CsUOGTPLRhk.jpg', account: 'beauty_bymariya', shortCode: 'CsUOGTPLRhk',
    alt_nl: 'AirTouch balayage', alt_en: 'AirTouch balayage' },
  { file: 'gal-hair-05.webp', src: 'beauty_bymariya/C8kHgJ7NI5Z.jpg', account: 'beauty_bymariya', shortCode: 'C8kHgJ7NI5Z',
    alt_nl: 'Subtiele blonde balayage', alt_en: 'Subtle blonde balayage' },
  { file: 'gal-hair-06.webp', src: 'lyubanovosad/DSgCduhCEZA.jpg', account: 'lyubanovosad', shortCode: 'DSgCduhCEZA',
    alt_nl: 'Aslook met fijne highlights', alt_en: 'Ashy look with fine highlights' },
];

const gallBeauty = [
  // Beauty category. Kohut's image posts are mostly graphic overlays, so we lean on clean
  // video frames + carefully cropped product images.
  { file: 'gal-beauty-01.webp', kind: 'video-frame', src: 'kohut.cosmetology/DW3OCFRApg4.mp4', t: '00:00:03.0',
    account: 'kohut.cosmetology', shortCode: 'DW3OCFRApg4',
    alt_nl: 'Klei-masker behandeling in de salon', alt_en: 'Clay mask treatment in progress' },
  { file: 'gal-beauty-02.webp', kind: 'video-frame', src: 'kohut.cosmetology/DYi-FLvCYOO.mp4', t: '00:00:10.0',
    account: 'kohut.cosmetology', shortCode: 'DYi-FLvCYOO',
    alt_nl: 'Behandelplek met Demax skincare producten', alt_en: 'Workstation with Demax skincare products' },
  { file: 'gal-beauty-03.webp', kind: 'image', src: 'kohut.cosmetology/DM7KNbSMzGG.jpg',
    account: 'kohut.cosmetology', shortCode: 'DM7KNbSMzGG',
    alt_nl: 'Demax verzorgingsproducten op houten tray', alt_en: 'Demax skincare products on wooden tray',
    preExtract: { topPct: 0.18, heightPct: 0.82 }, position: 'centre' },
  { file: 'gal-beauty-04.webp', kind: 'image', src: 'kohut.cosmetology/DYRFfcjgr60.jpg',
    account: 'kohut.cosmetology', shortCode: 'DYRFfcjgr60',
    alt_nl: 'Wimper close-up', alt_en: 'Eyelash close-up',
    preExtract: { topPct: 0, heightPct: 0.41 }, position: 'centre' },
];

// ── REELS ────────────────────────────────────────────────────────────────────
// Pick 10 short, varied clips. Trim each to 6s, scale to 720w, strip audio.
const reels = [
  { i: 1, src: 'beauty_bymariya/DCo6npMNhf9.mp4', account: 'beauty_bymariya', shortCode: 'DCo6npMNhf9',
    alt_nl: 'Magnetic nail art demo', alt_en: 'Magnetic nail art demo' },
  { i: 2, src: 'gel.lakkk/CzMEnnjNoVq.mp4', account: 'gel.lakkk', shortCode: 'CzMEnnjNoVq',
    alt_nl: 'Glanzende nail finish', alt_en: 'Glossy nail finish' },
  { i: 3, src: 'beauty_bymariya/CyYRMCyLJX4.mp4', account: 'beauty_bymariya', shortCode: 'CyYRMCyLJX4',
    alt_nl: 'Elegante manicure', alt_en: 'Elegant manicure' },
  { i: 4, src: 'levytska.permanent/DVHUxVdiM-P.mp4', account: 'levytska.permanent', shortCode: 'DVHUxVdiM-P',
    alt_nl: 'Wenkbrauwen styling', alt_en: 'Brow styling' },
  { i: 5, src: 'beauty_bymariya/C6TNgAUL34Y.mp4', account: 'beauty_bymariya', shortCode: 'C6TNgAUL34Y',
    alt_nl: 'AirTouch hair coloring', alt_en: 'AirTouch hair coloring' },
  { i: 6, src: 'lyubanovosad/DT3we2uCFum.mp4', account: 'lyubanovosad', shortCode: 'DT3we2uCFum',
    alt_nl: 'Sfeerbeeld', alt_en: 'Lifestyle moment' },
  { i: 7, src: 'beauty_bymariya/DFfX8kmtB8E.mp4', account: 'beauty_bymariya', shortCode: 'DFfX8kmtB8E',
    alt_nl: 'Salon kleuren showcase', alt_en: 'Salon color showcase' },
  { i: 8, src: 'beauty_bymariya/DC1sFebN0Gp.mp4', account: 'beauty_bymariya', shortCode: 'DC1sFebN0Gp',
    alt_nl: 'Nagels in warm licht', alt_en: 'Nails in warm light' },
  { i: 9, src: 'kohut.cosmetology/DYWgRlGCpPC.mp4', account: 'kohut.cosmetology', shortCode: 'DYWgRlGCpPC',
    alt_nl: 'Kosmetologie behandelkamer', alt_en: 'Cosmetology treatment room' },
  { i: 10, src: 'gel.lakkk/Cpn5djfjI5k.mp4', account: 'gel.lakkk', shortCode: 'Cpn5djfjI5k',
    alt_nl: 'Nagel design proces', alt_en: 'Nail design in progress' },
];

// ── EXECUTE ──────────────────────────────────────────────────────────────────

const curation = [];

async function doImage(rec) {
  const dst = out(rec.file);
  const opt = { ...rec.opt };
  if (rec.preExtract) opt.preExtract = rec.preExtract;
  if (rec.position) opt.position = rec.position;
  await webpFromImage(ig(rec.src), dst, opt);
  curation.push({
    file: rec.file, category: rec.cat ?? 'gallery',
    source: { account: rec.account, shortCode: rec.shortCode },
    alt: { nl: rec.alt_nl, en: rec.alt_en },
    ...(rec.qualityNote ? { note: rec.qualityNote } : {}),
  });
  console.log('img →', rec.file);
}

async function doVideoFrame(rec) {
  const tmp = path.join(tmpDir, `${rec.file}.jpg`);
  extractFrame(ig(rec.src), tmp, rec.t, 1400);
  const opt = { ...rec.opt };
  if (rec.preExtract) opt.preExtract = rec.preExtract;
  await webpFromImage(tmp, out(rec.file), opt);
  curation.push({
    file: rec.file, category: rec.cat ?? 'gallery',
    source: { account: rec.account, shortCode: rec.shortCode, type: 'video-frame' },
    alt: { nl: rec.alt_nl, en: rec.alt_en },
    ...(rec.qualityNote ? { note: rec.qualityNote } : {}),
  });
  console.log('frame →', rec.file);
}

async function doReel(rec) {
  const mp4 = out(`reel-${String(rec.i).padStart(2,'0')}.mp4`);
  const posterTmp = path.join(tmpDir, `reel-${rec.i}-poster.jpg`);
  compressVideo(ig(rec.src), mp4, { duration: 6, width: 720, crf: 26 });
  // Use the existing _thumb.jpg as poster, fallback to video frame
  const thumbPath = ig(rec.src.replace('.mp4', '_thumb.jpg'));
  if (fs.existsSync(thumbPath)) {
    await webpFromImage(thumbPath, out(`reel-${String(rec.i).padStart(2,'0')}-poster.webp`), poster(78));
  } else {
    extractFrame(ig(rec.src), posterTmp, '00:00:00.5', 720);
    await webpFromImage(posterTmp, out(`reel-${String(rec.i).padStart(2,'0')}-poster.webp`), poster(78));
  }
  curation.push({
    file: `reel-${String(rec.i).padStart(2,'0')}.mp4`, category: 'reel',
    source: { account: rec.account, shortCode: rec.shortCode },
    alt: { nl: rec.alt_nl, en: rec.alt_en },
    poster: `reel-${String(rec.i).padStart(2,'0')}-poster.webp`,
  });
  console.log('reel →', `reel-${String(rec.i).padStart(2,'0')}.mp4`);
}

(async () => {
  // Hero tiles
  for (const h of heroes) await doImage(h);

  // Hero feature wide
  await doImage(heroFeature);

  // Team
  for (const t of team) {
    if (t.kind === 'video-frame') await doVideoFrame({ ...t, cat: 'team' });
    else await doImage({ ...t, cat: 'team' });
  }

  // Galleries
  for (const g of gallNails) await doImage({ ...g, cat: 'gallery-nails', opt: gallery(82) });
  for (const g of gallBrows) await doImage({ ...g, cat: 'gallery-brows', opt: { ...gallery(82), position: g.position ?? 'attention' } });
  for (const g of gallHair) await doImage({ ...g, cat: 'gallery-hair', opt: gallery(82) });
  for (const g of gallBeauty) {
    if (g.kind === 'video-frame') await doVideoFrame({ ...g, cat: 'gallery-beauty', opt: gallery(82) });
    else await doImage({ ...g, cat: 'gallery-beauty', opt: gallery(82) });
  }

  // Reels
  for (const r of reels) await doReel(r);

  // Favicon — 256x256 square from hero-01 source
  await sharp(ig('gel.lakkk/C1RXEYpNw9Z.jpg'))
    .rotate()
    .resize(256, 256, { fit: 'cover', position: 'attention' })
    .png({ quality: 90 })
    .toFile(out('favicon.png'));
  curation.push({ file: 'favicon.png', category: 'favicon',
    source: { account: 'gel.lakkk', shortCode: 'C1RXEYpNw9Z' },
    alt: { nl: 'Favicon', en: 'Favicon' } });
  console.log('favicon → favicon.png');

  // OG image — pad portrait into 1200x630 with blush background
  await ogImageFromSrc(ig('gel.lakkk/C1RW1G5NaEq.jpg'), out('og-image.jpg'));
  curation.push({ file: 'og-image.jpg', category: 'social',
    source: { account: 'gel.lakkk', shortCode: 'C1RW1G5NaEq' },
    alt: { nl: 'Beauty by Mariya — Eindhoven', en: 'Beauty by Mariya — Eindhoven' } });
  console.log('og →  og-image.jpg');

  // JIW logo — copy from smooth-by-lau
  const logoSrc = path.resolve(APP_ROOT, '..', 'smooth-by-lau/public/jiw-logo.png');
  fs.copyFileSync(logoSrc, out('jiw-logo.png'));
  curation.push({ file: 'jiw-logo.png', category: 'branding',
    source: { account: 'jiw', shortCode: 'logo' },
    alt: { nl: 'Jouw Ideale Website logo', en: 'Jouw Ideale Website logo' } });
  console.log('logo → jiw-logo.png');

  fs.writeFileSync(out('_curation.json'), JSON.stringify({
    generatedAt: new Date().toISOString(),
    files: curation,
  }, null, 2));
  console.log('\nWrote', curation.length, 'entries to public/_curation.json');

  // Clean temp
  fs.rmSync(tmpDir, { recursive: true, force: true });
})();
