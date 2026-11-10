// Controleert de lichtbak die sinds 08-11-2026 over de pagina open klapt als
// iemand op een videokaart klikt. Per schermbreedte en per taal: komt hij open,
// is hij groot genoeg, blijft hij binnen het venster, sluit hij met Escape, met
// het kruisje en met een klik op de waas, en komt de focus terug op de kaart.
//   node tools/meet-lichtbak.mjs [url]
import { chromium } from 'playwright';

const basis = process.argv[2] || 'http://localhost:4174';
// Een pagina met branchekaarten (eigen mp4) en een met YouTube-kaarten, in
// alle drie de talen.
const PADEN = [
  ['/', '.branche-kaart'],
  ['/formats', '[data-video]'],
  ['/en/', '.branche-kaart'],
  ['/en/', '[data-video]'],
  ['/de/', '.branche-kaart'],
  ['/de/', '[data-video]'],
];
const BREEDTES = [[1600, 900], [1440, 900], [1100, 800], [900, 700], [390, 844]];

const browser = await chromium.launch();
let fout = 0, metingen = 0;
const mis = (m) => { console.log('! ' + m); fout++; };

for (const [breedte, hoogte] of BREEDTES) {
  const ctx = await browser.newContext({ viewport: { width: breedte, height: hoogte } });
  const page = await ctx.newPage();
  for (const [pad, kies] of PADEN) {
    await page.goto(basis + pad, { waitUntil: 'domcontentloaded' });
    const kaart = page.locator(kies).first();
    if (!await kaart.count()) { mis(`geen kaart ${kies} op ${pad}`); continue; }
    await kaart.scrollIntoViewIfNeeded();

    // 1. komt hij open, en ligt de speler binnen het venster en groot in beeld
    await kaart.click();
    await page.waitForTimeout(500);
    const bak = page.locator('.lichtbak:not([hidden])');
    metingen++;
    if (!await bak.count()) { mis(`${breedte} ${pad}: lichtbak gaat niet open`); continue; }
    const film = page.locator('.lichtbak-film');
    const m = await film.boundingBox();
    const deel = (m.width * m.height) / (breedte * hoogte);
    metingen += 4;
    if (m.x < -1 || m.y < -1 || m.x + m.width > breedte + 1 || m.y + m.height > hoogte + 1) {
      mis(`${breedte} ${pad}: speler valt buiten het venster (${JSON.stringify(m)})`);
    }
    if (deel < 0.2) mis(`${breedte} ${pad}: speler vult maar ${(deel * 100).toFixed(0)}% van het scherm`);
    // De YouTube-speler komt uit de iframe-api en staat er dus niet op het
    // moment van de klik, maar zodra dat script binnen is. Daarom wachten en
    // niet eenmalig kijken - anders zag dit een leeg vakje en viel het om zodra
    // het net wat langer duurde.
    const inhoud = await film.evaluate(e => new Promise(klaar => {
      const kijk = () => {
        const t = e.firstElementChild?.tagName || '';
        if (['VIDEO', 'IFRAME'].includes(t)) return klaar(t);
        if (Date.now() - start > 8000) return klaar(t);
        setTimeout(kijk, 100);
      };
      const start = Date.now();
      kijk();
    }));
    if (!['VIDEO', 'IFRAME'].includes(inhoud)) mis(`${breedte} ${pad}: geen speler in de lichtbak (${inhoud})`);

    // 1b. en loopt hij ook, of staat er een stilstaand beeld met een afspeelpijl
    // erop? Alleen te meten voor onze eigen clips; bij YouTube zit de speler in
    // een insluiting van een ander domein en komt hij er van buiten niet bij.
    if (inhoud === 'VIDEO') {
      metingen++;
      const stil = await film.evaluate(e => new Promise(klaar => {
        const v = e.querySelector('video');
        const start = Date.now();
        const kijk = () => {
          if (!v) return klaar('geen video');
          if (!v.paused && v.currentTime > 0) return klaar('');
          if (Date.now() - start > 6000) {
            return klaar(`stil (paused=${v.paused}, t=${v.currentTime}, readyState=${v.readyState})`);
          }
          setTimeout(kijk, 100);
        };
        kijk();
      }));
      if (stil) mis(`${breedte} ${pad}: clip start niet van zichzelf - ${stil}`);
    }
    const sluit = page.locator('.lichtbak-sluit');
    const s = await sluit.boundingBox();
    if (s.x < 0 || s.y < 0 || s.x + s.width > breedte || s.y + s.height > hoogte) {
      mis(`${breedte} ${pad}: kruisje valt buiten het venster (${JSON.stringify(s)})`);
    }

    // 2. de pagina eronder mag niet meescrollen
    metingen++;
    const slot = await page.evaluate(() => getComputedStyle(document.body).overflow);
    if (!slot.includes('hidden')) mis(`${breedte} ${pad}: pagina scrollt door achter de lichtbak (${slot})`);

    // 3. Escape sluit, de inhoud gaat er echt uit en de focus komt terug
    metingen += 3;
    await page.keyboard.press('Escape');
    await page.waitForTimeout(250);
    const na = await page.evaluate(() => {
      const l = document.querySelector('.lichtbak');
      return { open: !l.hidden, kinderen: l.querySelector('.lichtbak-film').childElementCount,
               focus: document.activeElement?.className || '' };
    });
    if (na.open) mis(`${breedte} ${pad}: blijft open na Escape`);
    if (na.kinderen) mis(`${breedte} ${pad}: speler blijft staan na Escape (${na.kinderen})`);
    if (!na.focus.includes('kaart')) mis(`${breedte} ${pad}: focus komt niet terug op de kaart (${na.focus})`);

    // 4. het kruisje sluit ook
    metingen++;
    await kaart.click();
    await page.waitForTimeout(400);
    await page.locator('.lichtbak-sluit').click();
    await page.waitForTimeout(250);
    if (await page.locator('.lichtbak:not([hidden])').count()) mis(`${breedte} ${pad}: kruisje sluit niet`);

    // 5. een klik op de waas sluit, een klik op de speler zelf niet
    metingen += 2;
    await kaart.click();
    await page.waitForTimeout(400);
    await page.locator('.lichtbak-film').click({ position: { x: 5, y: 5 }, force: true });
    await page.waitForTimeout(200);
    if (!await page.locator('.lichtbak:not([hidden])').count()) mis(`${breedte} ${pad}: klik op de speler sluit hem`);
    await page.locator('.lichtbak-waas').click({ position: { x: 3, y: 3 } });
    await page.waitForTimeout(250);
    if (await page.locator('.lichtbak:not([hidden])').count()) mis(`${breedte} ${pad}: klik op de waas sluit niet`);
  }
  await ctx.close();
}
await browser.close();
console.log(`${metingen} metingen, ${fout} fouten`);
process.exit(fout ? 1 : 0);
