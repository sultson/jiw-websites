/* Screenshot + meting via CDP, zonder extra pakketten.
   Chrome op Windows klemt --window-size op een minimumbreedte, dus een echte
   telefoonbreedte kun je alleen met device metrics nabootsen.

   gebruik: node scripts/shot.mjs <url> <breedte> <uitvoer.png> [selector]  */

import {spawn} from 'node:child_process';
import {writeFileSync} from 'node:fs';

const [url, breedteArg, uit, selector] = process.argv.slice(2);
const breedte = Number(breedteArg || 390);
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const POORT = 9222 + (Number(process.env.SHOT_POORT_OFFSET) || 0);

const chrome = spawn(CHROME, [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  `--remote-debugging-port=${POORT}`,
  '--user-data-dir=' + process.env.TEMP + '/shot-profiel-' + POORT,
  'about:blank',
]);

const wacht = (ms) => new Promise((r) => setTimeout(r, ms));

async function doelUrl() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${POORT}/json/version`);
      return (await r.json()).webSocketDebuggerUrl;
    } catch {
      await wacht(250);
    }
  }
  throw new Error('chrome start niet');
}

const ws = new WebSocket(await doelUrl());
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
const cmd = (method, params = {}, sessionId) =>
  new Promise((res) => {
    const n = ++id;
    open.set(n, res);
    ws.send(JSON.stringify({id: n, method, params, sessionId}));
  });

const {targetId} = await cmd('Target.createTarget', {url: 'about:blank'});
const {sessionId} = await cmd('Target.attachToTarget', {targetId, flatten: true});

await cmd('Page.enable', {}, sessionId);
await cmd('Runtime.enable', {}, sessionId);
await cmd('Emulation.setDeviceMetricsOverride', {
  width: breedte,
  height: 900,
  deviceScaleFactor: 2,
  mobile: breedte < 700,
}, sessionId);
await cmd('Page.navigate', {url}, sessionId);
await wacht(6000);

const meting = await cmd(
  'Runtime.evaluate',
  {
    returnByValue: true,
    expression: `(() => {
      const d = document.documentElement;
      const breed = [...document.querySelectorAll('body *')]
        .filter((el) => el.getBoundingClientRect().right > d.clientWidth + 1)
        .slice(0, 8)
        .map((el) => el.tagName + '.' + (el.className.baseVal ?? el.className ?? '').toString().slice(0, 60)
              + ' → ' + Math.round(el.getBoundingClientRect().right));
      return {viewport: d.clientWidth, scrollWidth: d.scrollWidth, overloop: breed};
    })()`,
  },
  sessionId,
);
console.log(JSON.stringify(meting.value?.value ?? meting.result?.value, null, 2));

let clip;
if (selector) {
  const r = await cmd(
    'Runtime.evaluate',
    {
      returnByValue: true,
      expression: `(() => { const e = document.querySelector(${JSON.stringify(selector)});
        if (!e) return null; const b = e.getBoundingClientRect();
        return {x: b.x + scrollX, y: b.y + scrollY, width: b.width, height: b.height, scale: 1}; })()`,
    },
    sessionId,
  );
  clip = r.result?.value ?? r.value?.value;
}

const shot = await cmd(
  'Page.captureScreenshot',
  {format: 'png', captureBeyondViewport: true, ...(clip ? {clip} : {})},
  sessionId,
);
writeFileSync(uit, Buffer.from(shot.data, 'base64'));
console.log('geschreven:', uit);

ws.close();
chrome.kill();
process.exit(0);
