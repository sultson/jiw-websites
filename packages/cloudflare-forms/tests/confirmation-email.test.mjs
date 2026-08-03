import assert from 'node:assert/strict';
import test from 'node:test';

import {
  CONFIRMATION_LOCALE_FIELD,
  createFormWorker,
} from '../src/index.ts';
import {
  EXPAT_CONFIRMATION_LOCALES,
  expatConfirmationEmails,
} from '../../../apps/expat-relocation/worker/confirmation-email.ts';
import { site } from '../../../apps/expat-relocation/src/data/site.ts';

const siteName = 'E & I Expat & Immigration Services';
const expatConfirmationEmail = expatConfirmationEmails.immigration;

function createConfig(overrides = {}) {
  return {
    formPath: '/api/forms/test',
    siteName,
    ownerName: 'Johanna',
    senderName: siteName,
    subjectPrefix: 'New immigration inquiry',
    confirmationFollowUpSentence: 'Johanna will reply within one business day.',
    requireLastName: false,
    messageField: 'message',
    subjectFields: ['service'],
    requiredFields: [{ name: 'message', label: 'message' }],
    emailFields: [
      { name: 'service', label: 'Service' },
      { name: 'phone', label: 'Phone / WhatsApp' },
    ],
    ...overrides,
  };
}

function createHarness(config) {
  const emails = [];
  const stored = new Map();
  const worker = createFormWorker(config);
  const env = {
    SITE_ID: 'test-site',
    LEAD_RECIPIENT: 'owner@example.com',
    LEAD_SENDER: 'forms@example.com',
    TURNSTILE_SECRET_KEY: 'dev',
    LEAD_EMAIL: {
      async send(message) {
        emails.push(message);
      },
    },
    FORM_UPLOADS: {
      async put(key, value) {
        stored.set(key, typeof value === 'string' ? value : String(value));
      },
    },
  };

  return {
    emails,
    stored,
    async submit(locale, values = {}) {
      const form = new FormData();
      form.set('firstName', values.firstName ?? 'Ada');
      form.set('lastName', values.lastName ?? 'Lovelace');
      form.set('email', values.email ?? 'ada@example.com');
      form.set('service', values.service ?? 'Residence permit');
      form.set('phone', values.phone ?? '+31 6 12345678');
      form.set('message', values.message ?? 'Please help with my application.');
      form.set('cf-turnstile-response', 'dev');
      if (locale !== undefined) form.set(CONFIRMATION_LOCALE_FIELD, locale);

      const originalLog = console.log;
      let response;
      console.log = () => {};
      try {
        response = await worker.fetch(
          new Request('http://localhost/api/forms/test', { method: 'POST', body: form }),
          env,
          {},
        );
      } finally {
        console.log = originalLog;
      }
      assert.equal(response.status, 200, await response.text());
      return {
        owner: emails.at(-2),
        confirmation: emails.at(-1),
        manifest: JSON.parse([...stored.values()].find((value) => value.includes('"submissionId"'))),
      };
    },
  };
}

function htmlEscape(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

test('legacy clients retain the original default confirmation behavior without opting in', async () => {
  const harness = createHarness(createConfig());
  const { owner, confirmation } = await harness.submit(undefined);

  assert.equal(owner.subject, 'New immigration inquiry - Residence permit');
  assert.match(owner.text, /^Nieuwe offerteaanvraag voor E & I Expat & Immigration Services/m);
  assert.match(owner.text, /Voornaam: Ada/);
  assert.match(owner.text, /Service: Residence permit/);
  assert.equal(confirmation.subject, 'Uw offerteaanvraag is ontvangen - E & I Expat & Immigration Services');
  assert.match(confirmation.text, /^Beste Ada Lovelace,/);
  assert.match(confirmation.html, /<body style="font-family: Arial, sans-serif;/);
  assert.doesNotMatch(confirmation.html, /images\/logo\.png/);
});

test('all nine locale selections localize the complete confirmation for every Expat form profile', async () => {
  for (const [kind, profile] of Object.entries(expatConfirmationEmails)) {
    assert.deepEqual(Object.keys(profile.translations), [...EXPAT_CONFIRMATION_LOCALES]);
    for (const [locale, copy] of Object.entries(profile.translations)) {
      const harness = createHarness(createConfig({ confirmationEmail: profile }));
      const { confirmation } = await harness.submit(locale);
      const expectedSubject = copy.subject.replace('{siteName}', siteName);
      const expectedGreeting = copy.greeting.replace('{name}', 'Ada Lovelace');
      const context = `${kind}/${locale}`;

      assert.equal(confirmation.subject, expectedSubject, context);
      assert.match(confirmation.html, new RegExp(`<html lang="${locale}">`), context);
      assert.ok(confirmation.html.includes(htmlEscape(copy.preheader)), `${context}: preheader`);
      assert.ok(confirmation.html.includes(htmlEscape(expectedGreeting)), `${context}: greeting`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.followUpMessage)), `${context}: follow-up`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.detailsHeading)), `${context}: details heading`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.messageHeading)), `${context}: message heading`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.referenceLabel)), `${context}: reference label`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.fieldLabels.service)), `${context}: field label`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.contactPrompt)), `${context}: contact copy`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.ctaLabel)), `${context}: CTA copy`);
      assert.ok(confirmation.html.includes(htmlEscape(copy.footerText)), `${context}: footer copy`);
      assert.ok(confirmation.text.includes(expectedGreeting), `${context}: plain-text greeting`);
      assert.ok(confirmation.text.includes(copy.followUpMessage), `${context}: plain-text follow-up`);
      assert.ok(confirmation.text.includes(`${copy.messageHeading}:`), `${context}: plain-text message label`);
      assert.ok(confirmation.text.includes(`${copy.ctaLabel}: ${profile.brand.websiteUrl}`), `${context}: plain-text CTA`);
    }
  }
});

test('missing and invalid locale values safely fall back to English', async () => {
  for (const locale of [undefined, '', 'xx', 'EN-us', '__proto__']) {
    const harness = createHarness(createConfig({ confirmationEmail: expatConfirmationEmail }));
    const { confirmation } = await harness.submit(locale);
    const english = expatConfirmationEmail.translations.en;

    assert.equal(confirmation.subject, english.subject.replace('{siteName}', siteName));
    assert.match(confirmation.html, /<html lang="en">/);
    assert.match(confirmation.text, /^Dear Ada Lovelace,/);
  }
});

test('localized HTML escapes user text and the reserved locale never leaks into stored or displayed fields', async () => {
  const config = createConfig({
    confirmationEmail: expatConfirmationEmail,
    subjectFields: [CONFIRMATION_LOCALE_FIELD, 'service'],
    emailFields: [
      { name: CONFIRMATION_LOCALE_FIELD, label: 'SECRET LOCALE' },
      { name: 'service', label: 'Service' },
    ],
  });
  const harness = createHarness(config);
  const maliciousName = '<img src=x onerror="alert(1)">';
  const maliciousMessage = '<script>alert("x")</script> & goodbye';
  const { owner, confirmation, manifest } = await harness.submit('zh', {
    firstName: maliciousName,
    lastName: '',
    message: maliciousMessage,
  });

  assert.ok(confirmation.html.includes(htmlEscape(maliciousName)));
  assert.ok(confirmation.html.includes(htmlEscape(maliciousMessage)));
  assert.doesNotMatch(confirmation.html, /<script>|<img src=x/);
  assert.doesNotMatch(owner.subject, /zh|SECRET LOCALE|__jiw_confirmation_locale/);
  assert.doesNotMatch(owner.text, /SECRET LOCALE|__jiw_confirmation_locale/);
  assert.doesNotMatch(owner.html, /SECRET LOCALE|__jiw_confirmation_locale/);
  assert.doesNotMatch(confirmation.text, /SECRET LOCALE|__jiw_confirmation_locale/);
  assert.doesNotMatch(confirmation.html, /SECRET LOCALE|__jiw_confirmation_locale/);
  assert.equal(Object.hasOwn(manifest.fields.fields, CONFIRMATION_LOCALE_FIELD), false);
});

test('the branded confirmation uses email-safe layout and absolute production assets', async () => {
  const harness = createHarness(createConfig({ confirmationEmail: expatConfirmationEmail }));
  const { confirmation } = await harness.submit('en');

  assert.match(confirmation.html, /role="presentation"/);
  assert.match(confirmation.html, /max-width: 640px/);
  assert.match(confirmation.html, /#00143a/);
  assert.match(confirmation.html, /#d4af37/);
  assert.equal(expatConfirmationEmail.brand.websiteUrl, site.url);
  assert.equal(expatConfirmationEmail.brand.logoUrl, `${site.url}/images/logo.png`);
  assert.equal(expatConfirmationEmail.brand.contactEmail, site.email);
  assert.ok(confirmation.html.includes(`src="${site.url}/images/logo.png"`));
  assert.match(confirmation.html, /alt="E &amp; I Expat &amp; Immigration Services"/);
  assert.doesNotMatch(confirmation.html, /<script|@font-face|background-image|<style/i);
  assert.ok(confirmation.text.includes(site.email));
});
