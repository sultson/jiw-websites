// Snijdt de witte randen weg die zijn overgebleven bij het uitsnijden uit de
// Canva-beelden. Detecteert per zijde hoeveel regels vrijwel volledig wit zijn
// en snijdt precies die weg. Draai daarna scripts/webp.mjs opnieuw.
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';

const dir = 'public/img';
const files = (await readdir(dir)).filter(f => /\.jpe?g$/i.test(f));
/* Niet alleen zuiver wit: de randen uit Canva zijn soms lichtgrijs of iets
   vergeeld. Vandaar helder EN vrijwel kleurloos, want een lichte lucht of een
   witte muur in de foto zelf heeft altijd nog een kleurzweem. */
const isWit = (d, i) => {
  const mn = Math.min(d[i], d[i + 1], d[i + 2]);
  const mx = Math.max(d[i], d[i + 1], d[i + 2]);
  return mn > 170 && mx - mn < 28;
};

for (const f of files) {
  const src = `${dir}/${f}`;
  const { data, info } = await sharp(src).raw().toBuffer({ resolveWithObject: true });
  const { width: w, height: h, channels: ch } = info;
  const rij = y => { let c = 0; for (let x = 0; x < w; x++) if (isWit(data, (y * w + x) * ch)) c++; return c / w; };
  const kol = x => { let c = 0; for (let y = 0; y < h; y++) if (isWit(data, (y * w + x) * ch)) c++; return c / h; };
  /* Alleen een echte rand: de regels moeten vrijwel volledig wit zijn, de rand
     mag niet dik zijn, en er moet een harde overgang naar de foto volgen. Zonder
     die laatste twee eisen sneed hij ook de lichte bovenkant van een heldere
     foto weg (het ontbijt op een wit tafelblad). */
  const tel = (fn, max) => {
    let k = 0;
    while (k < max && fn(k) >= 0.7) k++;
    return k > 0 && fn(k) < 0.4 ? k : 0;
  };

  const top = tel(y => rij(y), 3);
  const bot = tel(y => rij(h - 1 - y), 3);
  const lft = tel(x => kol(x), 3);
  const rgt = tel(x => kol(w - 1 - x), 3);
  if (!(top || bot || lft || rgt)) continue;

  const nw = w - lft - rgt, nh = h - top - bot;
  await sharp(src)
    .extract({ left: lft, top, width: nw, height: nh })
    .jpeg({ quality: 92 })
    .toFile(`${src}.tmp`);
  const { rename } = await import('node:fs/promises');
  await rename(`${src}.tmp`, src);
  console.log(`${f}: boven ${top}, onder ${bot}, links ${lft}, rechts ${rgt} -> ${nw}x${nh}`);
}
