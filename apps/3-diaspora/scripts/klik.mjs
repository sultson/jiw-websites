/**
 * Zoals shot.mjs, maar met een klik en een toets erin, om te controleren of het
 * vergrootvenster van de galerij echt opent, bladert en sluit.
 *
 *   node scripts/klik.mjs <url> <uit.png> <breedte> <hoogte> <scroll> <kaart#> [toets...]
 */
import {spawn} from 'node:child_process';
import {writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [url, uit, b = '1440', h = '900', y = '0', kaart = '0', ...toetsen] = process.argv.slice(2);

import {CHROME} from './chrome.mjs';
const poort = 9223 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'klik-'));

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${poort}`,
  `--user-data-dir=${profiel}`,
  '--no-first-run',
  'about:blank',
]);

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

async function doel() {
  for (let i = 0; i < 40; i++) {
    try {
      const lijst = await (await fetch(`http://127.0.0.1:${poort}/json/list`)).json();
      const page = lijst.find((t) => t.type === 'page');
      if (page) return page;
    } catch {}
    await wacht(250);
  }
  throw new Error('Chrome kwam niet op');
}

const page = await doel();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));

let id = 0;
const open = new Map();
const fouten = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') fouten.push(m.params.entry.text);
  if (m.method === 'Runtime.exceptionThrown') fouten.push(m.params.exceptionDetails.text);
  if (m.id && open.has(m.id)) {
    open.get(m.id)(m.result);
    open.delete(m.id);
  }
};
const stuur = (method, params = {}) =>
  new Promise((res) => {
    const eigen = ++id;
    open.set(eigen, res);
    ws.send(JSON.stringify({id: eigen, method, params}));
  });

const js = async (expr) => {
  const r = await stuur('Runtime.evaluate', {expression: expr, returnByValue: true});
  return r?.result?.value;
};

await stuur('Emulation.setDeviceMetricsOverride', {
  width: Number(b),
  height: Number(h),
  deviceScaleFactor: 2,
  mobile: Number(b) < 700,
});
await stuur('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'no-preference'}]});
await stuur('Log.enable');
await stuur('Runtime.enable');
await stuur('Page.enable');
await stuur('Page.navigate', {url});
await wacht(6000);

if (Number(y) > 0) {
  await js(`window.scrollTo(0, ${Number(y)})`);
  await wacht(600);
}

console.log('kaarten:', await js(`document.querySelectorAll('figure > button').length`));
await js(`document.querySelectorAll('figure > button')[${Number(kaart)}].click()`);
await wacht(1200);
console.log('venster open:', await js(`!!document.querySelector('[role="dialog"]')`));

for (const toets of toetsen) {
  await js(`window.dispatchEvent(new KeyboardEvent('keydown',{key:'${toets}'}))`);
  await wacht(700);
  console.log(`na ${toets}: open=${await js(`!!document.querySelector('[role="dialog"]')`)}, titel=${await js(
    `(document.querySelector('[role="dialog"] h2')||{}).textContent||''`,
  )}`);
}

console.log('body overflow:', await js(`document.body.style.overflow`));
const {data} = await stuur('Page.captureScreenshot', {format: 'png'});
writeFileSync(uit, Buffer.from(data, 'base64'));
console.log(uit, `${b}x${h}`);
if (fouten.length) console.log('FOUTEN:', fouten);

ws.close();
chrome.kill();
process.exit(0);
