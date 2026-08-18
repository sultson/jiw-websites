/**
 * Meet de drie beelden in het oprichtingsblok op de NL-pagina: staan de
 * bovenkanten en de onderkanten van film en foto's echt op gelijke hoogte?
 *
 *   node scripts/meet-oprichting.mjs <url> [breedte]
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [url, b = '1440'] = process.argv.slice(2);
import {CHROME} from './chrome.mjs';
const poort = 9700 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'meet-'));
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
      const l = await r.json();
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

await stuur('Runtime.enable');
await stuur('Page.enable');
await stuur('Emulation.setDeviceMetricsOverride', {
  width: Number(b),
  height: 1000,
  deviceScaleFactor: 1,
  mobile: Number(b) < 700,
});
await stuur('Page.navigate', {url});
await wacht(3500);

const expr = `(() => {
  const v = document.querySelector('video');
  if (!v) return 'geen video';
  const blok = v.closest('section');
  const media = [v, ...blok.querySelectorAll('figure img')];
  const bij = [...blok.querySelectorAll('figcaption')];
  const r = (el) => { const b = el.getBoundingClientRect(); return {t: Math.round(b.top + scrollY), b: Math.round(b.bottom + scrollY), h: Math.round(b.height), w: Math.round(b.width)}; };
  return JSON.stringify({
    sectieTop: Math.round(blok.getBoundingClientRect().top + scrollY),
    media: media.map(r),
    bijschriften: bij.map(r),
  }, null, 1);
})()`;
const res = await stuur('Runtime.evaluate', {expression: expr, returnByValue: true});
console.log(res.result?.value ?? JSON.stringify(res));
chrome.kill();
process.exit(0);
