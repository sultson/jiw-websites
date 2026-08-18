// Posters uit de video's: een stilstaand beeld op 1,000 s.
//
// Invoer:  assets/media/*.mp4
// Uitvoer: site/poster/<zelfde naam>.jpg
//
// Waarom 1 seconde en niet frame nul: de eerste frames van een telefoonopname
// zijn de belichting die zichzelf nog aan het instellen is, en dat is precies
// het beeld dat blijft staan tot iemand op play drukt. Op 1 s staat de
// belichting en beweegt de camera nog nauwelijks.
//
// Deze stap is de invoer voor work/media.mjs: die maakt van elke poster
// dezelfde webp/jpg-derivaten als van een gewone foto, en de projectpagina
// gebruikt /m/<base>-1600.jpg als posterbeeld bij de video.
//
// ffmpeg komt van het systeem (brew install ffmpeg); het is een stap die alleen
// draait als er video bijkomt, dus geen npm-afhankelijkheid waard.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'assets/media';
const OUT = 'site/poster';
const AT = '1.000'; // seconde in de video waar het posterbeeld vandaan komt

fs.mkdirSync(OUT, { recursive: true });

const videos = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith('.mp4'));
if (!videos.length) {
  console.log(`geen video's in ${SRC}/ - de ruwe bestanden staan niet in git, zie README`);
  process.exit(0);
}

let n = 0;
for (const file of videos.sort()) {
  const out = path.join(OUT, file.replace(/\.mp4$/i, '.jpg'));
  execFileSync(
    'ffmpeg',
    ['-v', 'error', '-y', '-ss', AT, '-i', path.join(SRC, file), '-frames:v', '1', '-q:v', '1', out],
    { stdio: ['ignore', 'inherit', 'inherit'] },
  );
  n++;
}
console.log(`klaar: ${n} posters op ${AT}s in ${OUT}/ - draai hierna node work/media.mjs`);
