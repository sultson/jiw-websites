/**
 * Copy frequency analysis. Surfaces phrases that are repeated so often across the
 * page that they read as filler rather than as a claim.
 * Run: node scripts/copy-freq.mjs
 */
import {readFileSync} from 'node:fs';

/* Strip everything that is styling or markup: only the prose a visitor reads counts. */
const src = readFileSync(new URL('../src/App.tsx', import.meta.url), 'utf8')
  .replace(/className=(\{[^}]*\}|"[^"]*")/g, ' ')
  .replace(/\b(className|class|href|src|alt|placeholder|aria-label|title)\s*[:=]\s*(\{[^}]*\}|'[^']*'|"[^"]*")/g, ' ')
  .replace(/`[^`]*`/g, ' ');

const strings = src.match(/'[^'\n]{12,}'|"[^"\n]{12,}"/g) || [];
const jsxText = src.match(/>[^<>{}]{15,}</g) || [];
const txt = [...strings, ...jsxText]
  .join(' ')
  .toLowerCase()
  .replace(/[^a-zà-ÿ0-9 ]/g, ' ')
  .replace(/\s+/g, ' ');

const words = txt.split(' ').filter(Boolean);

const count = (n) => {
  const m = {};
  for (let i = 0; i <= words.length - n; i++) {
    const k = words.slice(i, i + n).join(' ');
    m[k] = (m[k] || 0) + 1;
  }
  return m;
};

const report = (label, map, min) => {
  console.log(`\n--- ${label} ---`);
  Object.entries(map)
    .filter(([, c]) => c >= min)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 30)
    .forEach(([k, c]) => console.log(String(c).padStart(3), k));
};

report('BIGRAMS', count(2), 3);
report('TRIGRAMS', count(3), 3);

const uni = count(1);
const stop = new Set(['een', 'het', 'van', 'die', 'dat', 'met', 'voor', 'niet', 'wat', 'als', 'aan', 'ook', 'wordt', 'meer', 'over', 'naar', 'door', 'maar', 'heeft', 'kunt', 'krijgt']);
report('WORDS', Object.fromEntries(Object.entries(uni).filter(([w]) => w.length > 4 && !stop.has(w))), 5);
