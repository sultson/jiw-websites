// Controleert dat de hero per breekpunt precies één foto ophaalt (de juiste),
// en niet allebei. Een verkeerde preload kost een dubbele download op mobiel.
// De twee indices worden uit de preload-regels van de gebouwde index.html gelezen,
// niet hier hardgecodeerd: anders faalt deze test zodra iemand een andere herofoto
// kiest, en dat is precies wat er gebeurde toen mobiel van 210 naar 48 ging.
import { chromium, devices } from 'playwright';
import fs from 'node:fs';
const BASE = process.env.BASE || 'http://127.0.0.1:8788';
const html = fs.readFileSync('site/index.html', 'utf8');
const pre = [...html.matchAll(/<link rel="preload"[^>]*media="\(([^)]+)\)"[^>]*imagesrcset="\/m\/(\d{3})_/g)];
const MOB = pre.find((m) => m[1].startsWith('max-width'))?.[2];
const DESK = pre.find((m) => m[1].startsWith('min-width'))?.[2];
if (!MOB || !DESK) { console.log('geen twee hero-preloads gevonden in site/index.html'); process.exit(1); }
const RE = new RegExp(`/m/(${MOB}|${DESK})_`);
const b = await chromium.launch();
let bad = 0;
for (const [lbl, opts, want, avoid] of [
  ['mob ', { ...devices['iPhone 13'] }, `${MOB}_`, `${DESK}_`],
  ['desk', { viewport: { width: 1440, height: 900 } }, `${DESK}_`, `${MOB}_`],
]) {
  const ctx = await b.newContext(opts); const pg = await ctx.newPage();
  const hits = [];
  pg.on('request', (r) => { const u = r.url(); if (RE.test(u)) hits.push(u.split('/').pop()); });
  await pg.goto(BASE + '/', { waitUntil: 'networkidle' });
  const got = hits.filter((h) => h.startsWith(want));
  const nope = hits.filter((h) => h.startsWith(avoid));
  const shown = await pg.evaluate(() => document.querySelector('.hero-shot img').currentSrc.split('/').pop());
  const ok = shown.startsWith(want) && nope.length === 0;
  console.log(lbl, 'toont', shown, '| opgehaald:', got.join(' ') || '-', '| ongewenst:', nope.join(' ') || '-', ok ? 'OK' : 'FOUT');
  if (!ok) bad++;
  await ctx.close();
}
await b.close();
console.log(bad ? `${bad} probleem(en)` : 'hero laadt per breekpunt precies één foto');
process.exit(bad ? 1 : 0);
