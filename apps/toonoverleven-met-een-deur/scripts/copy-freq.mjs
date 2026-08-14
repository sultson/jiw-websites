/**
 * Woordfrequentie over de tekst die een bezoeker echt ziet.
 *
 * Een variant die de bron leest en de opmaak eruit probeert te filteren gaat
 * mis zodra een zin over meerdere regels loopt of er {VARIABELEN} in staan.
 * Daarom hier de gerenderde pagina zelf: innerText uit de browser, dus precies
 * wat er op het scherm staat, inclusief de agenda.
 *
 *   node scripts/copy-freq.mjs http://localhost:4931/
 */
import {spawn} from 'node:child_process';
import {mkdtempSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

const url = process.argv[2] ?? 'http://localhost:4931/';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const poort = 9723 + (process.pid % 200);
const profiel = mkdtempSync(join(tmpdir(), 'freq-'));

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  `--remote-debugging-port=${poort}`,
  `--user-data-dir=${profiel}`,
  '--no-first-run',
  'about:blank',
]);

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

let page;
for (let i = 0; i < 40 && !page; i++) {
  try {
    const lijst = await (await fetch(`http://127.0.0.1:${poort}/json/list`)).json();
    page = lijst.find((t) => t.type === 'page');
  } catch {}
  if (!page) await wacht(250);
}

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

await stuur('Page.enable');
await stuur('Page.navigate', {url});
await wacht(4000);
const res = await stuur('Runtime.evaluate', {
  expression: 'document.body.innerText',
  returnByValue: true,
});
ws.close();
chrome.kill();

const tekst = (res.result.value ?? '')
  .toLowerCase()
  .replace(/[^a-zà-ÿ0-9 ]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

/* Lidwoorden en voorzetsels zeggen niets over herhaling in de boodschap. */
const STOP = new Set(
  (
    'de het een en of van voor met je jij we wij ons onze u uw is zijn was er die dat wat als ook niet ' +
    'naar op in te bij om aan door dan nog al zo hier daar heeft hebt hebben kan kun kunt wil wilt want ' +
    'iemand worden wordt geen meer over uit per tot toe zich hun haar hij ze maar'
  ).split(' '),
);

const woorden = tekst.split(' ').filter((w) => w.length > 2 && !STOP.has(w));
const tel = (lijst) => {
  const m = new Map();
  for (const x of lijst) m.set(x, (m.get(x) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

const losse = tekst.split(' ');
const paren = losse.slice(0, -1).map((w, i) => `${w} ${losse[i + 1]}`);
const drie = losse.slice(0, -2).map((w, i) => `${w} ${losse[i + 1]} ${losse[i + 2]}`);

const toon = (kop, rijen, drempel) => {
  const raak = rijen.filter(([, n]) => n >= drempel).slice(0, 14);
  console.log(`\n--- ${kop} ---`);
  if (!raak.length) console.log('  niets dat opvalt');
  for (const [w, n] of raak) console.log(`  ${String(n).padStart(3)}  ${w}`);
};

toon('WOORDEN', tel(woorden), 6);
toon('WOORDPAREN', tel(paren), 4);
toon('DRIE WOORDEN', tel(drie), 3);
console.log(`\n${losse.length} woorden op de pagina`);
