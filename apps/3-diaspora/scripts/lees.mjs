/* Leest een willekeurige uitdrukking uit een live pagina, om te controleren wat er
 * echt op het scherm staat in plaats van wat er in de bron staat.
 *
 *   node scripts/lees.mjs <url> "<js-uitdrukking>" */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const url = process.argv[2];
const expr = process.argv[3];
import {CHROME} from './chrome.mjs';
const poort = 9223 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'meet-'));
const chrome = spawn(CHROME, ['--headless=new','--disable-gpu',`--remote-debugging-port=${poort}`,`--user-data-dir=${profiel}`,'--no-first-run','about:blank']);
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));
async function doel() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${poort}/json/list`);
      const l = await r.json();
      const p = l.find((x) => x.type === 'page');
      if (p) return p.webSocketDebuggerUrl;
    } catch {}
    await wacht(250);
  }
  throw new Error('geen chrome');
}
const ws = new (await import('ws')).default(await doel());
let id = 0;
const open = new Map();
ws.on('message', (m) => {
  const d = JSON.parse(m);
  if (d.id && open.has(d.id)) open.get(d.id)(d.result);
});
await new Promise((r) => ws.on('open', r));
const send = (method, params) => new Promise((r) => { const i = ++id; open.set(i, r); ws.send(JSON.stringify({id: i, method, params})); });
await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {width: 1440, height: 1200, deviceScaleFactor: 1, mobile: false});
await send('Page.navigate', {url});
await wacht(4000);
const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true});
console.log(JSON.stringify(r.result.value, null, 1));
chrome.kill();
process.exit(0);
