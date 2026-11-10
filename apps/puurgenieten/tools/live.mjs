/**
 * Vult het ECHTE aanmeldformulier op de LIVE site in, in een echte browser, en
 * kijkt wat de bezoeker te zien krijgt (de bedankkaart of een foutregel).
 *
 *   node tools/live.mjs              Nederlands, op /
 *   node tools/live.mjs --taal=en    of de, op /en/ of /de/
 *   node tools/live.mjs --droog      alles behalve de klik op versturen
 *
 * Een browser en geen curl: Turnstile, de CSP en het javascript dat de post doet
 * zitten allemaal tussen de bezoeker en de worker, en een losse POST slaat ze over.
 *
 * Dit verstuurt ECHT: een melding naar LEAD_RECIPIENT en een bevestiging naar het
 * adres hieronder. Daarom is dat adres een postvak van ons (Alfred, 10-11-2026),
 * en weigert het script zodra LEAD_RECIPIENT in wrangler.jsonc niet meer ons
 * eigen postvak is, tenzij je dat adres woordelijk meegeeft met --naar-klant=.
 */
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

const vlag = naam => (process.argv.find(a => a.startsWith(`--${naam}=`)) || '').split('=').slice(1).join('=');
const DROOG = process.argv.includes('--droog');
const TAAL = vlag('taal') || 'nl';
const PAD = { nl: '/', en: '/en/', de: '/de/' }[TAAL];
if (!PAD) throw new Error(`live: onbekende taal ${TAAL}`);
const ADRES = `https://puurgenieten.tv${PAD}`;

const ONS = /@jouwidealewebsite\.nl$|^jouwidealewebsite@gmail\.com$/;
const PROEF_MAIL = vlag('mail') || 'jouwidealewebsite@gmail.com';
if (!ONS.test(PROEF_MAIL)) throw new Error(`live: ${PROEF_MAIL} is geen postvak van ons`);

const wrangler = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
const ontvanger = (wrangler.match(/"LEAD_RECIPIENT":\s*"([^"]+)"/) || [])[1];
if (!ontvanger) throw new Error('live: LEAD_RECIPIENT niet gevonden in wrangler.jsonc');
if (!DROOG && !ONS.test(ontvanger) && vlag('naar-klant') !== ontvanger) {
  throw new Error(`live: LEAD_RECIPIENT is ${ontvanger}, een klantpostvak. Draai --droog, of geef --naar-klant=${ontvanger}.`);
}

// Turnstile geeft headless Chromium geen token, en een zichtbare ook niet zolang
// hij zich als geautomatiseerd meldt. Gemeten 10-11-2026, op framemedia.tv precies
// hetzelfde: headless 0 tekens, zichtbaar zonder AutomationControlled 773. Dus
// standaard zichtbaar; --headless alleen voor --droog. En geen eigen locale of
// viewport op de pagina: daarmee kreeg dezelfde zichtbare browser weer geen token.
const browser = await chromium.launch({
  headless: process.argv.includes('--headless'),
  args: ['--disable-blink-features=AutomationControlled'],
});
const page = await browser.newPage();
const fouten = [];
page.on('console', m => { if (m.type() === 'error') fouten.push(m.text()); });
let antwoord = null;
page.on('response', async r => {
  if (r.url().includes('/api/forms/')) antwoord = { status: r.status(), body: await r.text().catch(() => '') };
});

console.log(`live: ${ADRES}`);
await page.goto(ADRES, { waitUntil: 'domcontentloaded' });
const form = page.locator('#aanmelden form');
await form.locator('[name="bedrijf"]').fill('PROEF jouwidealewebsite - niet bellen');
await form.locator('[name="firstName"]').fill('Proef Claudius');
await form.locator('[name="tel"]').fill('0612345678');
await form.locator('[name="email"]').fill(PROEF_MAIL);
const select = form.locator('[name="branche"]');
const keuze = await select.locator('option').evaluateAll(o => o.map(x => x.value).filter(Boolean)[0]);
await select.selectOption(keuze);
console.log(`ingevuld, branche "${keuze}", bevestiging naar ${PROEF_MAIL}, melding naar ${ontvanger}`);

if (DROOG) {
  console.log('droog: niet verstuurd');
} else {
  await page.waitForFunction(() => document.querySelector('#aanmelden [name="cf-turnstile-response"]')?.value, null, { timeout: 30000 }).catch(() => {});
  const token = await form.locator('[name="cf-turnstile-response"]').inputValue().catch(() => '');
  console.log(`turnstile-token: ${token ? token.length + ' tekens' : 'GEEN'}`);
  await form.locator('[type="submit"]').click();
  const kaart = page.locator('#aanmelden');
  await page.waitForFunction(() => {
    const k = document.querySelector('#aanmelden');
    return k?.classList.contains('verstuurd') || k?.querySelector('.form-mis, [data-melding]:not([hidden])');
  }, null, { timeout: 45000 }).catch(() => {});
  const gelukt = await kaart.evaluate(k => k.classList.contains('verstuurd'));
  const dank = await kaart.locator('.form-dank').innerText().catch(() => '');
  const mis = await kaart.locator('.form-mis, [data-melding]:not([hidden])').allInnerTexts().catch(() => []);
  console.log(`worker: ${antwoord ? `${antwoord.status} ${antwoord.body}` : 'geen antwoord gezien'}`);
  console.log(gelukt ? `bezoeker ziet: ${dank.replace(/\s+/g, ' ').trim()}` : `MISLUKT, bezoeker ziet: ${mis.join(' | ') || '(niets)'}`);
  if (!gelukt) process.exitCode = 1;
}
if (fouten.length) console.log('console-fouten:\n  ' + fouten.join('\n  '));
await browser.close();
