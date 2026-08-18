/**
 * Controleert twee dingen echt in een browser in plaats van op het oog:
 *
 * 1. De taal bij een eerste bezoek. De tijdzone geeft alleen een eerste gok;
 *    het echte antwoord komt van het land dat Cloudflare op /cdn-cgi/trace
 *    meldt. Dat land bootsen we hier na door dat verzoek te onderscheppen, dus
 *    we testen precies wat een bezoeker op Bonaire krijgt.
 * 2. Het zegel linksboven: op de pagina van een stichting hoort dat van haarzelf
 *    te staan, elders dat van 3 Diaspora.
 *
 *   node scripts/geotest.mjs https://diaspora.jouwidealewebsite.nl
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const basis = process.argv[2] ?? 'https://diaspora.jouwidealewebsite.nl';
import {CHROME} from './chrome.mjs';
const poort = 9800 + (process.pid % 150);
const profiel = mkdtempSync(join(tmpdir(), 'geo-'));
const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${poort}`,
  `--user-data-dir=${profiel}`,
  '--lang=en-US',
  '--no-first-run',
  'about:blank',
]);
const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

async function doel() {
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

const page = await doel();
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const open = new Map();
const fouten = [];
/** Het land dat we op dit moment nabootsen, of null om niet te onderscheppen. */
let land = null;

ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && open.has(m.id)) {
    open.get(m.id)(m.result);
    open.delete(m.id);
  }
  if (m.method === 'Runtime.exceptionThrown') fouten.push(m.params.exceptionDetails.exception?.description);
  if (m.method === 'Fetch.requestPaused') {
    const body = `fl=test\nloc=${land}\nwarp=off\n`;
    stuur('Fetch.fulfillRequest', {
      requestId: m.params.requestId,
      responseCode: 200,
      responseHeaders: [{name: 'content-type', value: 'text/plain'}],
      body: Buffer.from(body).toString('base64'),
    });
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
await stuur('Fetch.enable', {patterns: [{urlPattern: '*cdn-cgi/trace*'}]});
await stuur('Emulation.setDeviceMetricsOverride', {width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false});

/* --------------------------------------------------- 1. taal van de bezoeker */
console.log('--- eerste bezoek: land bepaalt de taal ---');

for (const [plek, code, zone, browsertaal, verwacht] of [
  ['Bonaire', 'BQ', 'America/Curacao', 'nl-NL', 'pap'],
  ['Bonaire (tz als PR)', 'BQ', 'America/Puerto_Rico', 'en-US', 'pap'],
  ['Curacao', 'CW', 'America/Curacao', 'en-US', 'pap'],
  ['Aruba', 'AW', 'America/Aruba', 'nl-NL', 'pap'],
  ['Nederland', 'NL', 'Europe/Amsterdam', 'nl-NL', 'nl'],
  ['Belgie', 'BE', 'Europe/Brussels', 'nl-BE', 'en'],
  ['Verenigde Staten', 'US', 'America/New_York', 'en-US', 'en'],
]) {
  land = code;
  await stuur('Emulation.setTimezoneOverride', {timezoneId: zone});
  await stuur('Emulation.setLocaleOverride', {locale: browsertaal});
  await stuur('Page.navigate', {url: basis + '/'});
  await wacht(900);
  await eval_('localStorage.clear()');
  await stuur('Page.navigate', {url: basis + '/'});
  await wacht(2600);
  const lang = await eval_('document.documentElement.lang');
  const hash = await eval_('location.hash || "(leeg)"');
  console.log(
    `${plek.padEnd(20)} loc=${code} ${zone.padEnd(20)} -> ${String(lang).padEnd(4)} ${String(hash).padEnd(12)} ${
      lang === verwacht ? 'ok' : `FOUT, verwacht ${verwacht}`
    }`,
  );
}

/* ------------------------------------------------- 2. eigen keuze wint altijd */
console.log('--- eigen keuze wint van het land ---');
land = 'BQ';
await stuur('Page.navigate', {url: basis + '/'});
await wacht(2200);
await eval_(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'NL').click()`);
await wacht(1200);
console.log('na klik NL: hash        ', await eval_('location.hash'));
console.log('na klik NL: bewaard     ', await eval_('localStorage.getItem("taalkeuze")'));
await stuur('Page.navigate', {url: basis + '/'});
await wacht(2600);
console.log('opnieuw geopend: lang   ', await eval_('document.documentElement.lang'), '(hoort nl te blijven)');

/* een automatische gok mag juist NIET blijven plakken */
await eval_('localStorage.clear()');
await stuur('Page.navigate', {url: basis + '/'});
await wacht(2600);
console.log('na wissen: lang         ', await eval_('document.documentElement.lang'), '(hoort pap te zijn)');
console.log('automatisch bewaard?    ', await eval_('localStorage.getItem("taalkeuze")'), '(hoort null te zijn)');

/* --------------------------------------------------- 3. het zegel linksboven */
console.log('--- zegel linksboven per pagina ---');
land = null;
await stuur('Fetch.disable');
const zegel = `(() => {
  const el = document.querySelector('header a span[style*="mask-image"], header a span[class*="inline-block"]');
  const s = el && getComputedStyle(el);
  return s ? (s.maskImage || s.webkitMaskImage || '').replace(/^.*\\/img\\//, '').replace(/["')].*$/, '') + '  kleur=' + s.backgroundColor : 'geen';
})()`;
for (const pad of ['/', '/bonaire', '/curacao', '/nederland', '/agenda', '/galerij', '/contact', '/steun']) {
  await eval_(`location.hash = "${pad}"`);
  await wacht(900);
  console.log(pad.padEnd(12), await eval_(zegel));
}

console.log('js-fouten:', fouten.length ? fouten : 'geen');
ws.close();
chrome.kill();
process.exit(0);
