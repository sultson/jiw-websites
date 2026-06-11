// Cross-check t('...') usage in components against translations.ts keys.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const src = join(root, 'src');

const used = new Set();
const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    if (e.isDirectory()) walk(join(d, e.name));
    else if (/\.(tsx?|ts)$/.test(e.name) && e.name !== 'translations.ts') files.push(join(d, e.name));
  }
};
walk(src);
for (const f of files) {
  const text = readFileSync(f, 'utf8');
  for (const m of text.matchAll(/\bt\(\s*['"`]([^'"`]+)['"`]\s*\)/g)) used.add(m[1]);
}

const trans = readFileSync(join(src, 'translations.ts'), 'utf8');
const langs = { nl: new Set(), en: new Set() };
let current = null;
for (const line of trans.split('\n')) {
  const langMatch = line.match(/^\s{2}(nl|en):\s*\{/);
  if (langMatch) current = langMatch[1];
  const keyMatch = line.match(/^\s*['"]([\w.\-]+)['"]\s*:/);
  if (current && keyMatch) langs[current].add(keyMatch[1]);
}

let fail = false;
for (const k of [...used].sort()) {
  if (!langs.nl.has(k)) { console.log(`MISSING nl: ${k}`); fail = true; }
  if (!langs.en.has(k)) { console.log(`MISSING en: ${k}`); fail = true; }
}
for (const k of [...langs.nl].sort()) {
  if (!used.has(k)) console.log(`unused (info): ${k}`);
}
const emDash = [];
for (const f of [...files, join(src, 'translations.ts')]) {
  const text = readFileSync(f, 'utf8');
  if (/[—–]/.test(text)) emDash.push(f);
}
if (emDash.length) { console.log('EM/EN DASH found in:', emDash.join(', ')); fail = true; }
console.log(fail ? 'FAIL' : `OK (${used.size} keys used, nl=${langs.nl.size}, en=${langs.en.size})`);
process.exit(fail ? 1 : 0);
