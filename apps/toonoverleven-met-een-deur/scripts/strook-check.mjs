/**
 * Controle op de socialstrook: schuift hij vanzelf, kun je hem zelf slepen,
 * doen de knoppen het, en loopt hij rond zonder tegen een rand te lopen?
 *
 *   node scripts/strook-check.mjs <url> [breedte]
 *
 * Eenmalig hulpje bij de fix van 6 augustus (klik om te scrollen kon niet).
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const [url = 'https://toonoverleven.jouwidealewebsite.nl/', b = '1440'] = process.argv.slice(2);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const poort = 9223 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'strook-'));

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
      const p = lijst.find((t) => t.type === 'page');
      if (p) return p;
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
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && open.has(m.id)) (open.get(m.id)(m.result), open.delete(m.id));
};
const stuur = (method, params = {}) =>
  new Promise((res) => {
    const eigen = ++id;
    open.set(eigen, res);
    ws.send(JSON.stringify({id: eigen, method, params}));
  });

const evalueer = async (expr) => {
  const r = await stuur('Runtime.evaluate', {expression: expr, awaitPromise: true, returnByValue: true});
  return r.result?.value;
};

await stuur('Emulation.setDeviceMetricsOverride', {width: Number(b), height: 900, deviceScaleFactor: 1, mobile: Number(b) < 700});
await stuur('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'no-preference'}]});
await stuur('Page.enable');
await stuur('Page.navigate', {url});
await wacht(4000);

// In beeld brengen, anders staan de plaatjes (lazy) er nog niet in.
await evalueer(`document.querySelector('#socials').scrollIntoView(); true`);
await wacht(1500);

const meet = `(() => { const s = document.querySelector('.strook'); return {links: s.scrollLeft, breed: s.scrollWidth, vak: s.clientWidth, scrollbaar: s.scrollWidth > s.clientWidth}; })()`;

const a = await evalueer(meet);
await wacht(2000);
const c = await evalueer(meet);
console.log('vanzelf:', a.links.toFixed(1), '->', c.links.toFixed(1), '| spoor', a.breed, 'in vak', a.vak);

// Slepen met de muis.
const y = await evalueer(`(() => { const r = document.querySelector('.strook').getBoundingClientRect(); return Math.round(r.top + r.height/2); })()`);
const x = Math.round(Number(b) / 2);
const voor = (await evalueer(meet)).links;
await stuur('Input.dispatchMouseEvent', {type: 'mousePressed', x, y, button: 'left', clickCount: 1, buttons: 1, pointerType: 'mouse'});
for (let i = 1; i <= 10; i++) {
  await stuur('Input.dispatchMouseEvent', {type: 'mouseMoved', x: x - i * 20, y, button: 'left', buttons: 1, pointerType: 'mouse'});
  await wacht(30);
}
await stuur('Input.dispatchMouseEvent', {type: 'mouseReleased', x: x - 200, y, button: 'left', clickCount: 1, buttons: 0, pointerType: 'mouse'});
const na = (await evalueer(meet)).links;
console.log('slepen 200px:', voor.toFixed(1), '->', na.toFixed(1));

// De knoppen.
const knop = async (label) => {
  const voorK = (await evalueer(meet)).links;
  await evalueer(`document.querySelector('[aria-label="${label}"]').click(); true`);
  await wacht(1200);
  const naK = (await evalueer(meet)).links;
  console.log(`${label}:`, voorK.toFixed(1), '->', naK.toFixed(1));
};
await knop('Volgende berichten');
await knop('Vorige berichten');

// Terug naar het begin en dan naar links: mag niet tegen de rand lopen.
await evalueer(`document.querySelector('.strook').scrollLeft = 0; true`);
await wacht(300);
await knop('Vorige berichten');

ws.close();
chrome.kill();
process.exit(0);
