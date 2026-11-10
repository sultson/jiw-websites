// Haalt de ECHTE bevestigingsmail en de melding aan ons door de renderer van
// @jiw/cloudflare-forms, in alle drie de talen, en schiet er een plaat van. Zo kijk
// je naar wat een aanmelder krijgt in plaats van het aan te nemen.
//
//   pnpm mail   (= node --experimental-strip-types tools/preview-mail.mjs)
//
// Zelfde truc als apps/jasm-flowers/tools/preview-mail.mjs: een nep-env die de
// uitgaande berichten opvangt. De config is worker/form.ts zelf, niet een kopie,
// dus dit kan niet uit de pas lopen met wat er live staat. Alleen Turnstile gaat
// hier uit, want dat vraagt Cloudflare om een echt token.
//
// Het logo wijst in de mail naar de live site. Voor de plaat wordt dat adres
// omgezet naar het bestand in dist/, zodat dit ook werkt voor de eerste uitrol.
//
// Daarna rekent het de contrasten van het palet na (COLORS in confirmation.ts).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createFormWorker } from '@jiw/cloudflare-forms';
import { PG_FORM } from '../worker/form.ts';
import { COLORS } from '../worker/confirmation.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'dist-preview');
fs.mkdirSync(OUT, { recursive: true });

const SAMPLE = {
  nl: { firstName: 'Marieke de Vries', bedrijf: 'Wellness Resort De Veluwe', tel: '06 12 34 56 78', branche: 'Wellness & spa' },
  en: { firstName: 'Marieke de Vries', bedrijf: 'Wellness Resort De Veluwe', tel: '+31 6 12 34 56 78', branche: 'Wellness & spa' },
  de: { firstName: 'Anna Weber', bedrijf: 'Ferienpark Sauerland GmbH', tel: '+49 151 234 567 89', branche: 'Wellness & Spa' },
};

const sent = [];
const worker = createFormWorker({ ...PG_FORM, turnstile: false });
const env = {
  SITE_ID: 'puurgenieten',
  LEAD_RECIPIENT: 'info@puurgenieten.tv',
  LEAD_SENDER: 'no-reply@notify.puurgenieten.tv',
  LEAD_EMAIL: { async send(message) { sent.push(message); } },
  FORM_UPLOADS: { async put() {} },
};

const logo = pathToFileURL(path.join(ROOT, 'dist/assets/mail/puurgenieten-email.png')).href;
const log = console.log;
for (const [locale, velden] of Object.entries(SAMPLE)) {
  const form = new FormData();
  form.set('email', 'jouwidealewebsite@gmail.com');
  for (const [k, v] of Object.entries(velden)) form.set(k, v);
  form.set('lang', locale);
  form.set('herkomst', 'Puur Genieten (puurgenieten.tv)');
  form.set('__jiw_confirmation_locale', locale);

  console.log = () => {};
  const res = await worker.fetch(new Request('http://localhost/api/forms/puurgenieten', { method: 'POST', body: form }), env, {});
  console.log = log;
  if (res.status !== 200) throw new Error(`${locale}: ${res.status} ${await res.text()}`);

  const bevestiging = sent.at(-1);
  const melding = sent.at(-2);
  const lokaal = h => h.split('https://puurgenieten.tv/assets/mail/puurgenieten-email.png').join(logo);
  fs.writeFileSync(path.join(OUT, `mail-${locale}.html`), lokaal(bevestiging.html));
  fs.writeFileSync(path.join(OUT, `mail-${locale}.txt`), bevestiging.text);
  fs.writeFileSync(path.join(OUT, `melding-${locale}.html`), lokaal(melding.html));
  console.log(`${locale}: aan ${bevestiging.to} | van ${bevestiging.from?.email ?? bevestiging.from} | reply-to ${bevestiging.replyTo} | ${bevestiging.subject}`);
  console.log(`    melding -> ${melding.to} | ${melding.subject}`);
  if (/jouwidealewebsite\.nl/.test(bevestiging.html.replace(/mailto:[^"]*/g, ''))) {
    // Alleen in de reply-to mag ons adres staan, niet zichtbaar in de mail van de klant.
    throw new Error(`${locale}: jouwidealewebsite.nl staat zichtbaar in de bevestiging`);
  }
}

const { chromium } = await import('playwright');
const browser = await chromium.launch();
for (const [b, h] of [[680, 1200], [390, 900]]) {
  const page = await browser.newPage({ viewport: { width: b, height: h }, deviceScaleFactor: 2 });
  for (const locale of Object.keys(SAMPLE)) {
    await page.goto(pathToFileURL(path.join(OUT, `mail-${locale}.html`)).href);
    await page.screenshot({ path: path.join(OUT, `mail-${locale}-${b}.png`), fullPage: true });
  }
  await page.close();
}
await browser.close();

// Contrast (WCAG): de paren die in de mail echt op elkaar liggen.
const lum = hex => {
  const [r, g, b] = hex.replace('#', '').match(/../g).map(x => parseInt(x, 16) / 255)
    .map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const PAREN = [
  ['wit op de band', COLORS.onInk, COLORS.ink],
  ['oranje accent op de band', COLORS.accent, COLORS.ink],
  ['knoptekst op de knop', COLORS.onButton, COLORS.button],
  ['lopende tekst op wit', COLORS.inkSoft, COLORS.surface],
  ['grijze regel op wit', COLORS.muted, COLORS.surface],
  ['grijze regel op de achtergrond', COLORS.muted, COLORS.pageBackground],
  ['grijs op het tabelvlak', COLORS.mutedSoft, COLORS.surfaceAlt],
];
let te_laag = 0;
for (const [naam, v, a] of PAREN) {
  const r = ratio(v, a);
  if (r < 4.5) te_laag++;
  console.log(`  ${r.toFixed(1).padStart(5)}:1  ${naam}${r < 4.5 ? '  <- onder 4,5' : ''}`);
}
console.log(`\nplaten in dist-preview/`);
if (te_laag) process.exit(1);
