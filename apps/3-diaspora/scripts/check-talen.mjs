/**
 * Controle bij het toevoegen van een taal: is er per ongeluk aan de bestaande
 * Nederlandse of Engelse tekst gekomen, en heeft elk stukje tekst nu alle drie
 * de talen? Draaien met: node scripts/check-talen.mjs [oudbestand nieuwbestand]
 */
import fs from 'fs';

const TALEN = ['en', 'nl', 'pap'];
const STRING = String.raw`'(?:[^'\\]|\\.)*'`;

/** Alle nl- en en-teksten uit een bestand, gesorteerd, om twee versies te vergelijken. */
function bestaande(pad) {
  const bron = fs.readFileSync(pad, 'utf8');
  const re = new RegExp(String.raw`\b(nl|en):\s*(` + STRING + `)`, 'g');
  const uit = [];
  let m;
  while ((m = re.exec(bron))) uit.push(`${m[1]}=${m[2]}`);
  return uit.sort();
}

/** Elk blok {..} dat een taalsleutel bevat moet ze alle drie hebben. */
function ontbrekend(pad) {
  const bron = fs.readFileSync(pad, 'utf8');
  const re = new RegExp(String.raw`\{[^{}]*\b(?:en|nl|pap):[^{}]*\}`, 'g');
  const gaten = [];
  for (const [blok] of bron.matchAll(re)) {
    const mist = TALEN.filter((t) => !new RegExp(String.raw`\b` + t + `:`).test(blok));
    if (mist.length) gaten.push({mist, blok: blok.replace(/\s+/g, ' ').slice(0, 90)});
  }
  return gaten;
}

const [oud, nieuw] = process.argv.slice(2);

if (oud && nieuw) {
  const a = bestaande(oud);
  const b = bestaande(nieuw);
  const sa = new Set(a);
  const sb = new Set(b);
  const weg = a.filter((x) => !sb.has(x));
  const bij = b.filter((x) => !sa.has(x));
  console.log(`nl/en teksten: ${a.length} oud, ${b.length} nieuw`);
  console.log(`verdwenen of veranderd: ${weg.length}`);
  weg.forEach((x) => console.log('  -', x));
  console.log(`nieuw erbij: ${bij.length}`);
  bij.forEach((x) => console.log('  +', x));
  process.exit(weg.length ? 1 : 0);
}

let fout = 0;
for (const pad of ['src/tekst.ts', 'src/data.ts', 'src/ui.tsx']) {
  const gaten = ontbrekend(pad);
  console.log(`${pad}: ${gaten.length ? `${gaten.length} blok(ken) met een ontbrekende taal` : 'alle drie de talen compleet'}`);
  for (const g of gaten) console.log(`  mist ${g.mist.join(', ')}: ${g.blok}`);
  fout += gaten.length;
}
process.exit(fout ? 1 : 0);
