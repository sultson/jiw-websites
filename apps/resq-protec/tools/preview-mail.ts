// Renders the visitor's confirmation (nl, en, de) and the owner's notification through
// the real worker, with a mail binding that writes HTML files instead of sending.
// Usage: npx tsx tools/preview-mail.ts <out-dir>
import { writeFileSync, mkdirSync } from 'node:fs';
import worker from '../worker/index';

const out = process.argv[2] ?? 'mail-preview';
mkdirSync(out, { recursive: true });
let n = 0;
const env = {
  LEAD_EMAIL: { send: async (m: { to: string; subject: string; html: string }) => { writeFileSync(`${out}/${++n}-${m.to.includes('jouwidealewebsite@') ? 'confirmation' : 'lead'}.html`, m.html); console.log(n, m.to, '|', m.subject); } },
  FORM_UPLOADS: { put: async () => undefined },
  SITE_ID: 'resq-protec', LEAD_RECIPIENT: 'hallo@jouwidealewebsite.nl', LEAD_SENDER: 'no-reply@notify.rescuewatercraft.eu', CANONICAL_HOST: 'rescuewatercraft.eu', TURNSTILE_SECRET_KEY: '',
} as never;
for (const [path, lang, subject] of [['/api/forms/course', 'nl', 'Rescue watercraft operator'], ['/api/forms/en/equipment', 'en', 'The IONIC Pro Matrix'], ['/api/forms/de/contact', 'de', 'Vorführung']]) {
  const body = new FormData();
  for (const [k, v] of Object.entries({ firstName: 'Anna', lastName: 'Jansen', email: 'jouwidealewebsite@gmail.com', phone: '+31 6 12345678', subject, organisation: 'Brandweer Gelderland-Zuid', message: 'Wij willen graag meer weten.\nTweede regel.', privacyConsent: 'Akkoord', language: lang, __jiw_confirmation_locale: lang, pageUrl: 'https://rescuewatercraft.eu/', website: '' })) body.append(k, v);
  const res = await worker.fetch(new Request(`https://rescuewatercraft.eu${path}`, { method: 'POST', body }), env, { waitUntil() {}, passThroughOnException() {} } as never);
  console.log(path, res.status);
}
