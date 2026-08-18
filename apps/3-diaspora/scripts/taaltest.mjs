/**
 * Controleert de taalwissel echt in een browser in plaats van op het oog:
 * blijft de pagina staan, verandert het pad, klopt <html lang>, en krijgt een
 * bezoeker uit Curacao, Nederland of elders vanzelf de juiste taal.
 *
 * De plek van de bezoeker wordt nagebootst met de tijdzone en de browsertaal,
 * want dat is precies waar de site zelf ook op afgaat.
 *
 * De taal staat in het pad (/nl/bonaire) en niet meer achter een hekje. Oude
 * gedeelde links met #/nl erin horen nog steeds te werken; de laatste twee
 * stappen hieronder controleren dat.
 *
 *   node scripts/taaltest.mjs http://localhost:4365
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const basis = process.argv[2] ?? 'http://localhost:4365';
import {CHROME} from './chrome.mjs';
const poort = 9700 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'taal-'));
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
const fouten = [];
ws.onmessage = (e) => {
  const m = JSON.parse(e.data);
  if (m.id && open.has(m.id)) {
    open.get(m.id)(m.result);
    open.delete(m.id);
  }
  if (m.method === 'Runtime.exceptionThrown') fouten.push(m.params.exceptionDetails.exception?.description);
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
await stuur('Emulation.setDeviceMetricsOverride', {width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false});

const stap = async (naam, expr) => console.log(naam.padEnd(48), await eval_(expr));

/* ------------------------------------------------------ 1. plek bepaalt taal */
console.log('--- eerste bezoek, taal van de plek ---');

/**
 * Een verse bezoeker uit een land: nieuwe tijdzone, nieuwe browsertaal, geen
 * opgeslagen keuze. Chrome onthoudt localStorage per origin, dus die moet leeg.
 */
async function versBezoek(zone, browsertaal) {
  await stuur('Emulation.setTimezoneOverride', {timezoneId: zone});
  await stuur('Emulation.setLocaleOverride', {locale: browsertaal});
  await stuur('Page.navigate', {url: basis + '/'});
  await wacht(800);
  await eval_('localStorage.clear()');
  await stuur('Page.navigate', {url: basis + '/'});
  await wacht(2500);
}

for (const [plek, zone, browsertaal, verwacht] of [
  ['Curacao', 'America/Curacao', 'en-US', 'pap'],
  ['Bonaire', 'America/Kralendijk', 'nl-NL', 'pap'],
  ['Nederland', 'Europe/Amsterdam', 'en-US', 'nl'],
  ['Verenigde Staten', 'America/New_York', 'en-US', 'en'],
  ['Duitsland', 'Europe/Berlin', 'de-DE', 'en'],
]) {
  await versBezoek(zone, browsertaal);
  const lang = await eval_('document.documentElement.lang');
  const pad = await eval_('location.pathname');
  console.log(`${plek.padEnd(18)} ${zone.padEnd(20)} -> ${String(lang).padEnd(5)} ${pad}  ${lang === verwacht ? 'ok' : `FOUT, verwacht ${verwacht}`}`);
}

/* ------------------------------------------------------- 2. wisselen en link */
console.log('--- wisselen, links, ankers ---');
await stuur('Emulation.setTimezoneOverride', {timezoneId: 'America/New_York'});
await stuur('Page.navigate', {url: basis + '/'});
await wacht(800);
await eval_('localStorage.clear()');

await stuur('Page.navigate', {url: basis + '/pap/contact'});
await wacht(1500);
await stap('pap/contact: html lang', 'document.documentElement.lang');
await stap('pap/contact: titel', 'document.title');
await stap('pap/contact: h1', 'document.querySelector("h1")?.innerText.replace("\\n"," ")');
await stap('pap/contact: eerste veldlabel', '[...document.querySelectorAll("label")].map(l=>l.innerText.trim()).filter(Boolean)[1]');

/* naar Nederlands via de knop: moet op contact blijven staan */
await eval_(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'NL').click()`);
await wacht(1200);
await stap('na klik NL: pad', 'location.pathname');
await stap('na klik NL: h1', 'document.querySelector("h1")?.innerText.replace("\\n"," ")');
await stap('na klik NL: onthouden', 'localStorage.getItem("taalkeuze")');

/* naar Engels via de knop: Engels heeft geen voorvoegsel */
await eval_(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'EN').click()`);
await wacht(1200);
await stap('na klik EN: pad', 'location.pathname');
await stap('na klik EN: h1', 'document.querySelector("h1")?.innerText.replace("\\n"," ")');

/* interne link houdt de taal vast */
await eval_(`[...document.querySelectorAll('button')].find(b => b.textContent.trim() === 'PAP').click()`);
await wacht(1200);
await eval_(`document.querySelector('a[href="/pap/agenda"]')?.click()`);
await wacht(1200);
await stap('link in PAP: pad', 'location.pathname');
await stap('link in PAP: h1', 'document.querySelector("h1")?.innerText.replace("\\n"," ")');

/* ankerlink in de hero mag de taal niet slopen */
await stuur('Page.navigate', {url: basis + '/pap'});
await wacht(1500);
await eval_(`[...document.querySelectorAll('a')].find(a => a.getAttribute('href') === '#stichtingen')?.click()`);
await wacht(1200);
await stap('na anker: pad', 'location.pathname');
await stap('na anker: anker', 'location.hash');
await stap('na anker: html lang', 'document.documentElement.lang');

/* oude gedeelde links met een hekje erin moeten blijven werken: ze worden bij
   het openen eenmalig omgezet naar hun echte adres. */
for (const oud of ['/#/nl/agenda', '/#/pap/contact', '/#/en/agenda']) {
  await stuur('Page.navigate', {url: basis + oud});
  await wacht(1600);
  const pad = await eval_('location.pathname');
  const lang = await eval_('document.documentElement.lang');
  const titel = await eval_('document.title');
  console.log(`${oud.padEnd(18)} -> ${String(pad).padEnd(16)} lang=${String(lang).padEnd(4)} ${titel}`);
}

/* ------------------------------------------------------------- 3. de datums */
console.log('--- datums in de agenda ---');
/* De onthouden keuze van hierboven staat nog in localStorage, en een adres
   zonder taal erin (/agenda) volgt die keuze. Zonder deze regel meet de
   Engelse rij hieronder dus Papiamentu. */
await eval_('localStorage.clear()');
for (const [naam, pad] of [
  ['en', '/agenda'],
  ['nl', '/nl/agenda'],
  ['pap', '/pap/agenda'],
]) {
  await stuur('Page.navigate', {url: basis + pad});
  await wacht(1500);
  const soort = await eval_('document.querySelector("article .kicker")?.innerText');
  const datum = await eval_('[...document.querySelectorAll("article p, article time, article div")].map(e=>e.innerText).find(x=>/\\d{4}/.test(x||""))?.split("\\n")[0]');
  const blok = await eval_('document.querySelector("article .font-display")?.innerText');
  console.log(`${naam.padEnd(4)} soort=${String(soort).padEnd(16)} kalenderblok=${String(blok).replace(/\n/g, ' ').padEnd(12)} datum=${datum}`);
}

console.log('js-fouten:', fouten.length ? fouten : 'geen');
ws.close();
chrome.kill();
process.exit(0);
