/**
 * Vult het ECHTE formulier op de LIVE site in, in een echte browser, en kijkt waar de
 * bezoeker uitkomt.
 *
 *   node tools/live.mjs            tegen de startpagina
 *   node tools/live.mjs --werkwijze
 *   node tools/live.mjs --droog    alles behalve de laatste tik op verstuur
 *
 * Waarom een browser en niet curl. Een formulier gaat stil stuk op twee dingen die je
 * met een losse POST niet ziet (zie marjon-mondhygienist, playground/CLAUDE.md):
 *
 *  - `form-action` in een CSP laat de BROWSER de post weigeren. Geen navigatie, geen
 *    foutpagina, en bij Cloudflare komt ook niets binnen - niet te onderscheiden van
 *    een bezoeker die niets verstuurde.
 *  - met `not_found_handling` levert Workers Assets een pad dat niet in dist/ ligt zelf
 *    als 404 uit, dus zonder `run_worker_first` draait de worker nooit. Een curl naar
 *    het adres laat dat wel zien; een curl naar de PAGINA niet.
 *
 * En dit script kijkt naar de uitkomst die de bezoeker leest (het role="status"-vakje),
 * niet naar de http-code van de fetch. Een worker die {"ok":true} teruggeeft terwijl het
 * javascript de melding niet plaatst, is voor de bezoeker een formulier dat niets deed.
 *
 * LET OP de ontvangers. Dit verstuurt echt: Pascal-mail naar LEAD_RECIPIENT en een
 * bevestiging naar het adres dat hier wordt ingevuld. Daarom staat hier ons eigen
 * gmail-adres (Alfred, 26-10-2026) en niet dat van een bezoeker, en daarom zakt het
 * script zodra LEAD_RECIPIENT in wrangler.jsonc niet meer ons eigen postvak is.
 */
import { readFileSync } from 'node:fs';
import { chromium } from 'playwright';

import { BEDRIJF } from '../inhoud.mjs';

const DROOG = process.argv.includes('--droog');
const PAD = process.argv.includes('--werkwijze') ? '/werkwijze/' : '/';
const ADRES = `https://${BEDRIJF.domein}${PAD}`;

/* Het adres van de bezoeker in deze proef. Ons eigen postvak, dus de bevestiging komt
   bij ons aan en niet bij iemand die er niet om vroeg. */
const PROEF_MAIL = 'jouwidealewebsite@gmail.com';

/* De veiligheidspal. Zodra LEAD_RECIPIENT Pascals eigen adres is, mag dit script niet
   meer versturen: dan komt elke proefaanvraag bij de klant binnen. Zelfde pal als
   tools/keur.mjs bij velvet-cakes, en om dezelfde reden - een afspraak die je moet
   onthouden is er geen. */
const wrangler = readFileSync(new URL('../wrangler.jsonc', import.meta.url), 'utf8');
const ontvanger = (wrangler.match(/"LEAD_RECIPIENT":\s*"([^"]+)"/) || [])[1];
if (!ontvanger) throw new Error('live: LEAD_RECIPIENT niet gevonden in wrangler.jsonc');
if (!DROOG && !/@jouwidealewebsite\.nl$/.test(ontvanger)) {
  throw new Error(
    `live: LEAD_RECIPIENT is ${ontvanger} - dat is niet ons eigen postvak meer. ` +
      'Zet het terug op hallo@jouwidealewebsite.nl voordat je een proefaanvraag verstuurt, of draai met --droog.',
  );
}

const fouten = [];
const eis = (goed, m) => { if (!goed) fouten.push(m); };

const browser = await chromium.launch();
const p = await browser.newPage();

/* De console en de mislukte verzoeken opvangen. Een CSP-blokkade is ALLEEN een regel in
   de console: in de pagina gebeurt er niets en dat ziet eruit als een bezoeker die niet
   verstuurde. */
const consoleFouten = [];
p.on('console', (m) => { if (m.type() === 'error') consoleFouten.push(m.text()); });
const mislukt = [];
p.on('requestfailed', (r) => mislukt.push(`${r.url()} ${r.failure()?.errorText}`));

const antwoord = await p.goto(ADRES, { waitUntil: 'domcontentloaded' });
eis(antwoord?.status() === 200, `${ADRES} gaf status ${antwoord?.status()}`);

// Het formulier moet er staan en naar de worker wijzen.
const action = await p.locator('#aanvraag').getAttribute('action');
eis(action === '/api/forms/offerte', `de action is ${action} in plaats van /api/forms/offerte`);

const stempel = new Date().toISOString().slice(0, 16).replace('T', ' ');
await p.fill('#f-naam', 'Proef JIW');
await p.fill('#f-mail', PROEF_MAIL);
await p.fill('#f-tel', '06-12345678');
await p.fill('#f-plaats', 'Coevorden');
await p.fill('#f-m2', '140');
await p.selectOption('#f-soort', { index: 1 });
await p.fill('#f-bericht', `PROEFAANVRAAG van tools/live.mjs, ${stempel}, pagina ${PAD}. Niet opvolgen.`);

// Het lokvink moet leeg BLIJVEN; vult dit script hem, dan hoort er niets te gebeuren.
eis((await p.locator('#f-website').inputValue()) === '', 'het lokvink was al gevuld');
eis(!(await p.locator('#f-website').isVisible()), 'het lokvink staat in beeld');

if (DROOG) {
  console.log(`droog: formulier op ${ADRES} ingevuld, niet verstuurd`);
  await browser.close();
  if (fouten.length) { for (const f of fouten) console.error(`  - ${f}`); process.exit(1); }
  process.exit(0);
}

// Het verzoek zelf afvangen, zodat we zowel de http-code als de melding op de pagina
// hebben. Die twee kunnen los van elkaar stuk.
const wacht = p.waitForResponse((r) => r.url().endsWith('/api/forms/offerte'), { timeout: 30000 });
await p.click('#verstuur');
const res = await wacht;
const json = await res.json().catch(() => null);

console.log(`POST /api/forms/offerte -> ${res.status()} ${JSON.stringify(json)}`);
eis(res.status() === 200, `de worker gaf status ${res.status()}`);
eis(json?.ok === true, `de worker gaf geen ok:true (${JSON.stringify(json)})`);

// En wat de bezoeker leest.
await p.waitForFunction(() => document.getElementById('uitkomst')?.textContent?.trim(), null, { timeout: 15000 });
const melding = (await p.locator('#uitkomst').textContent())?.trim();
const soort = await p.locator('#uitkomst').getAttribute('class');
console.log(`de bezoeker leest: "${melding}"`);
eis(/goed/.test(soort ?? ''), `de melding staat op "${soort}" in plaats van op goed`);
eis(/binnen/i.test(melding ?? ''), `de melding leest niet als een geslaagde verzending: "${melding}"`);

// Na een geslaagde verzending gaat de knop op slot, anders levert twee keer tikken twee
// aanvragen op en belt Pascal twee keer over dezelfde wand.
eis(await p.locator('#verstuur').isDisabled(), 'de verstuurknop zit niet op slot na verzending');

await p.screenshot({ path: `tools/live-${PAD === '/' ? 'home' : 'werkwijze'}.png`, fullPage: false });
await browser.close();

if (consoleFouten.length) console.log(`\nconsole-fouten:\n  ${consoleFouten.join('\n  ')}`);
if (mislukt.length) console.log(`\nmislukte verzoeken:\n  ${mislukt.join('\n  ')}`);
// Een CSP die form-action of connect-src dichtzet is precies hier te zien, en nergens
// anders.
eis(!consoleFouten.some((t) => /Content Security Policy|refused to connect/i.test(t)), 'een CSP blokkeerde het versturen');

if (fouten.length) {
  console.error(`\nlive: ${fouten.length} probleem(en)\n`);
  for (const f of fouten) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`\nlive: ${ADRES} verstuurt echt. Lead naar ${ontvanger}, bevestiging naar ${PROEF_MAIL}.`);
