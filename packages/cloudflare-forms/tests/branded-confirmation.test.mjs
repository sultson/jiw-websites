import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

// The branded confirmation renderer used to assume every brand has a logo image
// and every form reads its submission back. A museum whose mark is lettering
// has no image to point at, and a newsletter opt-in has nothing worth
// repeating, so both are now choices rather than assumptions.

const copy = {
  subject: 'Ontvangen - {siteName}',
  preheader: 'Voorvertoning',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Uw vraag',
  receiptMessage: 'Uw vraag is binnengekomen.',
  followUpMessage: 'Wij nemen contact op.',
  detailsHeading: 'Uw gegevens',
  messageHeading: 'Wat u schreef',
  referenceLabel: 'Referentie',
  fieldLabels: { firstName: 'Naam', email: 'E-mailadres' },
  contactPrompt: 'Liever zelf mailen?',
  ctaLabel: 'Naar de site',
  footerText: 'Museum',
};

function harness(overrides = {}, brand = {}) {
  const emails = [];
  const worker = createFormWorker({
    formPath: '/api/forms/test',
    siteName: 'Test Museum',
    senderName: 'Test Museum',
    subjectPrefix: 'Nieuw',
    turnstile: false,
    messageField: 'bericht',
    requireFirstName: false,
    requireLastName: false,
    requireEmail: true,
    confirmationEmail: {
      defaultLocale: 'nl',
      translations: { nl: copy },
      brand: { websiteUrl: 'https://example.com', contactEmail: 'info@example.com', ...brand },
      ...overrides,
    },
  });
  const env = {
    SITE_ID: 'test', LEAD_RECIPIENT: 'owner@example.com', LEAD_SENDER: 'forms@example.com',
    TURNSTILE_SECRET_KEY: 'dev',
    LEAD_EMAIL: { async send(m) { emails.push(m); } }, FORM_UPLOADS: { async put() {} },
  };
  return async (values = {}) => {
    emails.length = 0;
    const form = new FormData();
    for (const [k, v] of Object.entries({ email: 'ada@example.com', ...values })) form.set(k, v);
    const log = console.log; console.log = () => {};
    let res;
    try {
      res = await worker.fetch(new Request('http://localhost/api/forms/test', { method: 'POST', body: form }), env, {});
    } finally { console.log = log; }
    assert.equal(res.status, 200, await res.text());
    return emails.at(-1);
  };
}

test('a brand with no logoUrl gets its name set in type, not a broken image', async () => {
  const mail = await harness()({ firstName: 'Ada' });

  assert.doesNotMatch(mail.html, /<img/);
  assert.match(mail.html, /Test Museum<\/p>/);
});

test('an explicit wordmark overrides the site name in the bar', async () => {
  const mail = await harness({}, { wordmark: 'Peter Klashorst Museum' })({ firstName: 'Ada' });

  assert.match(mail.html, /Peter Klashorst Museum<\/p>/);
});

test('a logoUrl still renders an image, as it always did', async () => {
  const mail = await harness({}, { logoUrl: 'https://example.com/logo.png', logoAlt: 'Logo' })({ firstName: 'Ada' });

  assert.match(mail.html, /<img src="https:\/\/example\.com\/logo\.png"/);
  assert.match(mail.html, /alt="Logo"/);
});

test('includeSubmission false drops the read-back but keeps the reference', async () => {
  const mail = await harness({ includeSubmission: false })({ firstName: 'Ada', bericht: 'Hallo' });

  assert.doesNotMatch(mail.html, /Uw gegevens|Wat u schreef/);
  assert.doesNotMatch(mail.text, /Uw gegevens|Wat u schreef/);
  assert.match(mail.html, /Referentie: /);
  assert.match(mail.text, /^Referentie: /m);
  // The band above it still says what arrived.
  assert.match(mail.html, /Uw vraag is binnengekomen\./);
});

test('includeSubmission defaults to showing the read-back', async () => {
  const mail = await harness()({ firstName: 'Ada', bericht: 'Hallo' });

  assert.match(mail.html, /Uw gegevens/);
  assert.match(mail.html, /Hallo/);
});

test('a name the form never asks for gets no row', async () => {
  const mail = await harness()({ firstName: 'Ada', bericht: 'Hallo' });

  assert.doesNotMatch(mail.html, /Last name/);
  assert.match(mail.html, /Naam/);
  assert.match(mail.html, /E-mailadres/);
});

test('a submission without a name uses the nameless greeting', async () => {
  const mail = await harness()({ firstName: '' });

  assert.match(mail.html, /Goedendag,/);
  assert.match(mail.text, /^Goedendag,$/m);
  assert.doesNotMatch(mail.html, /Beste ,/);
});

test('a kicker keeps the band from repeating the table heading', async () => {
  const mail = await harness()({ firstName: 'Ada' });

  assert.match(mail.html, /text-transform: uppercase;">Uw vraag<\/p>/);
  assert.match(mail.html, /<h1[^>]*>Uw gegevens<\/h1>/);
});
