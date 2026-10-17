// Proefvel: elk logobestand op een witte tegel en los op donker, zodat je ziet
// welke op wit wegvallen (witte vulling) en welke op donker wegvallen (zwarte
// vulling). Zonder dit kijken ga je nat op een logo met een uitsparing.
//   node proef-logos.mjs
import { chromium } from 'playwright';
import { readdirSync } from 'fs';
import { pathToFileURL } from 'url';

const groups = [['raw/zenders', 'ZENDERS'], ['raw/klanten', 'KLANTEN']];

let html = `<html><body style="margin:0;font:12px system-ui;background:#fff">`;
for (const [dir, label] of groups) {
  const files = readdirSync(dir).filter(n => /\.(svg|png)$/.test(n));
  html += `<h2 style="padding:8px 12px;margin:0;background:#061f41;color:#fff">${label} - witte tegel</h2>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:10px;padding:12px;background:#0d1117">`;
  for (const f of files) {
    html += `<div style="width:170px"><div style="background:#fff;border-radius:6px;height:72px;display:grid;place-items:center;padding:10px">`
      + `<img src="${dir}/${f}" style="max-height:48px;max-width:140px;width:auto;height:auto">`
      + `</div><div style="color:#8b9aab;text-align:center;padding-top:4px">${f}</div></div>`;
  }
  html += `</div>`;
  html += `<h2 style="padding:8px 12px;margin:0;background:#061f41;color:#fff">${label} - los op donker</h2>`;
  html += `<div style="display:flex;flex-wrap:wrap;gap:10px;padding:12px;background:#161e28">`;
  for (const f of files) {
    html += `<div style="width:170px"><div style="height:72px;display:grid;place-items:center;padding:10px">`
      + `<img src="${dir}/${f}" style="max-height:48px;max-width:140px;width:auto;height:auto">`
      + `</div><div style="color:#8b9aab;text-align:center;padding-top:4px">${f}</div></div>`;
  }
  html += `</div>`;
}
html += `</body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
// Eerst naar de projectmap navigeren, dan pas de HTML erin zetten - anders zijn
// de relatieve src-paden nergens op gebaseerd en laadt geen enkel logo.
await page.goto(pathToFileURL(process.cwd() + '/').href);
await page.setContent(html);
await page.waitForTimeout(1500);
await page.screenshot({ path: 'shots/logoproef-nieuw.png', fullPage: true });
await browser.close();
console.log('shots/logoproef-nieuw.png');
