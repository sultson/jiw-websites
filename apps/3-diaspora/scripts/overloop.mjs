/**
 * Loopt er iets buiten het scherm op smalle telefoons? De taalknop kreeg er een
 * derde knop bij, dus de balk bovenaan is de plek waar dat als eerste misgaat.
 *
 *   node scripts/overloop.mjs http://localhost:4571 [breedtes...]
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const basis = process.argv[2] ?? 'http://localhost:4571';
const breedtes = process.argv.slice(3).map(Number);
const BREEDTES = breedtes.length ? breedtes : [320, 360, 390, 430, 768, 1024, 1440];
const PADEN = ['/pap', '/pap/bonaire', '/pap/curacao', '/pap/nederland', '/pap/agenda', '/pap/steun', '/pap/contact'];

import {CHROME} from './chrome.mjs';
const poort = 9350 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'over-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${poort}`,
  `--user-data-dir=${profiel}`,
  '--no-first-run',
  'about:blank',
]);
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
async function doelen() {
  for (let i = 0; i < 40; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${poort}/json/list`)).json();
      const p = l.find((t) => t.type === 'page');
      if (p) return p;
    } catch {}
    await wacht(250);
  }
  throw new Error('geen chrome');
}
const page = await doelen();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const open = new Map();
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && open.has(m.id)) {
    open.get(m.id)(m.result);
    open.delete(m.id);
  }
};
const stuur = (method, params = {}) =>
  new Promise((res) => {
    const e = ++id;
    open.set(e, res);
    ws.send(JSON.stringify({id: e, method, params}));
  });
const eval_ = async (expr) => (await stuur('Runtime.evaluate', {expression: expr, returnByValue: true})).result?.value;

await stuur('Runtime.enable');
await stuur('Page.enable');

/* Wat steekt er rechts uit, en hoe ver. Kleine afrondingen negeren we. */
const METING = `JSON.stringify({
  over: document.documentElement.scrollWidth - window.innerWidth,
  daders: [...document.querySelectorAll('header *, main *, footer *')]
    .filter(e => e.getBoundingClientRect().right > window.innerWidth + 1)
    .slice(0, 4)
    .map(e => e.tagName.toLowerCase() + '.' + String(e.className).split(' ').slice(0,2).join('.') + ' +' + Math.round(e.getBoundingClientRect().right - window.innerWidth))
})`;

let fout = 0;
for (const breedte of BREEDTES) {
  await stuur('Emulation.setDeviceMetricsOverride', {
    width: breedte,
    height: 900,
    deviceScaleFactor: 1,
    mobile: breedte < 768,
  });
  for (const pad of PADEN) {
    await stuur('Page.navigate', {url: `${basis}/#${pad}`});
    await wacht(1400);
    const {over, daders} = JSON.parse(await eval_(METING));
    if (over > 1) {
      fout++;
      console.log(`${String(breedte).padStart(4)}px ${pad.padEnd(16)} ${over}px buiten beeld  ${daders.join(' | ')}`);
    }
  }
  console.log(`${String(breedte).padStart(4)}px ${fout ? 'zie hierboven' : 'alles binnen beeld'}`);
}
console.log(fout ? `${fout} pagina('s) lopen over` : 'geen enkele pagina loopt over');
ws.close();
chrome.kill();
process.exit(fout ? 1 : 0);
