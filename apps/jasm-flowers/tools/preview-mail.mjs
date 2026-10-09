// Renders the real confirmation email to dist-preview/mail-<locale>.html and shoots a
// PNG of each, so the thing a buyer receives can be looked at instead of assumed.
//
// Run: node --experimental-strip-types tools/preview-mail.mjs
//
// It drives the actual worker from worker/index.ts config through a stub env that
// captures the outgoing message, which is the same trick the package's own tests use
// (packages/cloudflare-forms/tests/confirmation-branding.test.mjs). So what it shows
// is what the renderer really produces, not a second copy of the template that could
// drift from it.
//
// The logo is loaded from the live site, so this also catches a broken logo URL.
import fs from 'node:fs';
import path from 'node:path';
import { createFormWorker } from '@jiw/cloudflare-forms';
import { jasmConfirmationEmail } from '../worker/confirmation.ts';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, '$1'), '..');
const OUT = path.join(ROOT, 'dist-preview');
fs.mkdirSync(OUT, { recursive: true });

/* Same configuration as worker/index.ts. Kept in step by hand, because importing the
   worker would also import its default export and try to serve assets. */
const CONFIG = {
  formPath: '/api/forms/enquiry',
  locale: 'en',
  siteName: 'JASM Flowers',
  senderName: 'JASM Flowers',
  subjectPrefix: 'New buyer enquiry JASM Flowers',
  subjectFields: ['company', 'country'],
  subjectSeparator: ' | ',
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  messageField: 'message',
  turnstile: false,
  honeypotField: 'website',
  requiredFields: [
    { name: 'company', label: 'company' },
    { name: 'country', label: 'country' },
  ],
  emailFields: [
    { name: 'company', label: 'Company' },
    { name: 'country', label: 'Country' },
    { name: 'phone', label: 'Phone or WhatsApp' },
    { name: 'flowers', label: 'Flowers required' },
    { name: 'volume', label: 'Estimated quantity' },
    { name: 'spec', label: 'Stem length / specification' },
    { name: 'dest', label: 'Delivery destination' },
    { name: 'freq', label: 'Shipment frequency' },
  ],
  leadOnlyEmailFields: [{ name: 'lang', label: 'Site language' }],
  leadEmail: {
    heading: 'New buyer enquiry for JASM Flowers',
    messageHeading: 'Message',
    nameLabels: { firstName: 'Name', email: 'Email' },
    includeAttachments: false,
  },
  confirmationEmail: jasmConfirmationEmail,
};

const SAMPLE = {
  en: { company: 'Van Dijk Flowers BV', country: 'Netherlands', phone: '+31 6 12 34 56 78',
    flowers: 'Solidago, Eucalyptus Baby Blue, Limonium', volume: '4 full boxes per week',
    spec: '60-70 cm, 250 g bunches, tight cut', dest: 'Schiphol (AMS)', freq: 'Weekly',
    message: 'We would like to start with a trial before a standing programme. Can you quote\nthe three lines above at 60 cm and at 70 cm?' },
  nl: { company: 'Van Dijk Bloemen BV', country: 'Nederland', phone: '+31 6 12 34 56 78',
    flowers: 'Solidago, Eucalyptus Baby Blue, Limonium', volume: '4 volle dozen per week',
    spec: '60-70 cm, bossen van 250 g', dest: 'Schiphol (AMS)', freq: 'Wekelijks',
    message: 'Wij willen graag met een proefzending beginnen. Kunt u de drie regels hierboven\nop 60 cm en op 70 cm offreren?' },
  de: { company: 'Blumenhandel Weber GmbH', country: 'Deutschland', phone: '+49 151 234 567 89',
    flowers: 'Solidago, Eucalyptus Silver Dollar', volume: '3 Kartons pro Woche',
    spec: '65 cm, Bunde zu 250 g', dest: 'Frankfurt (FRA)', freq: 'Woechentlich',
    message: 'Wir moechten mit einer Probesendung beginnen. Koennen Sie die oben genannten\nPositionen auf 65 cm anbieten?' },
};

const sent = [];
const worker = createFormWorker(CONFIG);
const env = {
  SITE_ID: 'jasm-flowers',
  LEAD_RECIPIENT: 'hallo@jouwidealewebsite.nl',
  LEAD_SENDER: 'no-reply@notify.jasmflowers.com',
  TURNSTILE_SECRET_KEY: 'dev',
  LEAD_EMAIL: { async send(message) { sent.push(message); } },
  FORM_UPLOADS: { async put() {} },
};

const log = console.log;
for (const [locale, extra] of Object.entries(SAMPLE)) {
  const form = new FormData();
  form.set('firstName', 'Marieke de Vries');
  form.set('email', 'buyer@example.com');
  for (const [k, v] of Object.entries(extra)) form.set(k, v);
  form.set('lang', locale);
  form.set('__jiw_confirmation_locale', locale);

  console.log = () => {};
  const res = await worker.fetch(
    new Request('http://localhost/api/forms/enquiry', { method: 'POST', body: form }), env, {});
  console.log = log;
  if (res.status !== 200) throw new Error(`${locale}: ${res.status} ${await res.text()}`);

  // Two mails go out per submission: the notification to the office first, then the
  // confirmation to the buyer. The confirmation is the last one pushed.
  const confirmation = sent.at(-1);
  const lead = sent.at(-2);
  fs.writeFileSync(path.join(OUT, `mail-${locale}.html`), confirmation.html);
  fs.writeFileSync(path.join(OUT, `mail-${locale}.txt`), confirmation.text);
  fs.writeFileSync(path.join(OUT, `lead-${locale}.html`), lead.html);
  console.log(`${locale}: to ${confirmation.to} | reply-to ${confirmation.replyTo} | ${confirmation.subject}`);
  console.log(`    lead -> ${lead.to} | ${lead.subject}`);
}

const { chromium } = await import('playwright');
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 760, height: 1200 }, deviceScaleFactor: 2 });
for (const locale of Object.keys(SAMPLE)) {
  await page.goto('file:///' + path.join(OUT, `mail-${locale}.html`).replace(/\\/g, '/'));
  await page.screenshot({ path: path.join(OUT, `mail-${locale}.png`), fullPage: true });
}
await browser.close();
console.log(`\nwrote ${Object.keys(SAMPLE).length} previews to dist-preview/`);
