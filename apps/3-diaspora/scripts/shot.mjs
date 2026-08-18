/**
 * Screenshot van een pagina op een echte viewportbreedte.
 *
 * Chrome --headless --screenshot houdt zich niet aan --window-size als
 * CSS-breedte, waardoor een mobiele opname te breed rendert en rechts wordt
 * afgesneden. Via CDP zetten we de device metrics wel exact.
 *
 *   node scripts/shot.mjs <url> <uit.png> [breedte] [hoogte]
 */
import {spawn} from 'node:child_process';
import {writeFileSync, mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [url, uit, b = '390', h = '844', y = '0'] = process.argv.slice(2);
const breedte = Number(b);
const hoogte = Number(h);

import {CHROME} from './chrome.mjs';
const poort = 9223 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'shot-'));

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
      const r = await fetch(`http://127.0.0.1:${poort}/json/list`);
      const lijst = await r.json();
      const page = lijst.find((t) => t.type === 'page');
      if (page) return page;
    } catch {}
    await wacht(250);
  }
  throw new Error('Chrome kwam niet op');
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
    const eigen = ++id;
    open.set(eigen, res);
    ws.send(JSON.stringify({id: eigen, method, params}));
  });

await stuur('Emulation.setDeviceMetricsOverride', {
  width: breedte,
  height: hoogte,
  deviceScaleFactor: 2,
  mobile: breedte < 700,
});
/* Headless Chrome zet standaard 'minder beweging' aan, en dan zie je precies
   niet wat een gewone bezoeker ziet. Zet BEWEGING=reduce om juist die stand te
   controleren. */
await stuur('Emulation.setEmulatedMedia', {
  features: [
    {name: 'prefers-reduced-motion', value: process.env.BEWEGING === 'reduce' ? 'reduce' : 'no-preference'},
  ],
});
await stuur('Page.enable');
await stuur('Page.navigate', {url});
await wacht(7000);
if (Number(y) > 0) {
  await stuur('Runtime.evaluate', {expression: `window.scrollTo(0, ${Number(y)})`});
  await wacht(900);
}
const {data} = await stuur('Page.captureScreenshot', {format: 'png'});
writeFileSync(uit, Buffer.from(data, 'base64'));
console.log(`${uit} (${breedte}x${hoogte})`);

ws.close();
chrome.kill();
process.exit(0);
