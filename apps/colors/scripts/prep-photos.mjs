import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, '_research/gmaps-photos');
const OUT = path.join(ROOT, 'public');

// Curated mapping of source photos -> output filenames, sized for their context.
// width 1600 for hero/showcase, 1200 for project/gallery, 900 for gallery thumbs.
const recipes = [
  // Hero & about
  { in: 'photo-002.jpg', out: 'hero.webp', width: 1400, quality: 84 },
  { in: 'photo-020.jpg', out: 'about.webp', width: 1200, quality: 82 },

  // Showcase before/after stages (use a coherent house exterior sequence)
  { in: 'photo-024.jpg', out: 'stage-voor.webp', width: 1400, quality: 85 },
  { in: 'photo-025.jpg', out: 'stage-tijdens.webp', width: 1400, quality: 85 },
  { in: 'photo-019.jpg', out: 'stage-na.webp', width: 1400, quality: 85 },

  // Project 1: Tuinhuis (mahogany shed)
  { in: 'photo-012.jpg', out: 'tuinhuis-1.webp', width: 1400, quality: 82 },
  { in: 'photo-003.jpg', out: 'tuinhuis-2.webp', width: 1400, quality: 82 },
  { in: 'photo-011.jpg', out: 'tuinhuis-3.webp', width: 1400, quality: 82 },
  { in: 'photo-017.jpg', out: 'tuinhuis-4.webp', width: 1400, quality: 82 },

  // Project 2: Gevel & kozijnen (exterior house)
  { in: 'photo-022.jpg', out: 'gevel-1.webp', width: 1400, quality: 82 },
  { in: 'photo-002.jpg', out: 'gevel-2.webp', width: 1400, quality: 82 },
  { in: 'photo-019.jpg', out: 'gevel-3.webp', width: 1400, quality: 82 },
  { in: 'photo-014.jpg', out: 'gevel-4.webp', width: 1400, quality: 82 },

  // Project 3: Binnenwerk & deuren
  { in: 'photo-005.jpg', out: 'binnen-1.webp', width: 1400, quality: 82 },
  { in: 'photo-006.jpg', out: 'binnen-2.webp', width: 1400, quality: 82 },
  { in: 'photo-007.jpg', out: 'binnen-3.webp', width: 1400, quality: 82 },

  // Project 4: Plafonds & nieuwbouw
  { in: 'photo-008.jpg', out: 'plafond-1.webp', width: 1400, quality: 82 },
  { in: 'photo-009.jpg', out: 'plafond-2.webp', width: 1400, quality: 82 },
  { in: 'photo-010.jpg', out: 'plafond-3.webp', width: 1400, quality: 82 },
  { in: 'photo-013.jpg', out: 'plafond-4.webp', width: 1400, quality: 82 },

  // Gallery extras
  { in: 'photo-004.jpg', out: 'extra-tuin.webp', width: 1200, quality: 82 },
  { in: 'photo-016.jpg', out: 'extra-detail.webp', width: 1200, quality: 82 },
];

await mkdir(OUT, { recursive: true });

for (const r of recipes) {
  const inPath = path.join(SRC, r.in);
  const outPath = path.join(OUT, r.out);
  await sharp(inPath)
    .rotate()
    .resize({ width: r.width, withoutEnlargement: true })
    .webp({ quality: r.quality, effort: 5 })
    .toFile(outPath);
  console.log(`${r.in} -> ${r.out}`);
}

console.log('Done.');
