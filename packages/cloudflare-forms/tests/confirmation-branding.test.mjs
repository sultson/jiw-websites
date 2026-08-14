import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

// The localized confirmation renderer used to hardcode one site's navy-and-gold
// palette and a 360px-wide logo slot, so every other brand's guests received an
// email in someone else's colours. Both are configurable now; these tests pin
// the override and the untouched default.

const COPY = {
  subject: 'Received - {siteName}',
  preheader: 'Thanks for your message.',
  greeting: 'Dear {name},',
  receiptMessage: 'Thank you for contacting {siteName}.',
  followUpMessage: 'We will reply shortly.',
  detailsHeading: 'Your request',
  messageHeading: 'Your message',
  referenceLabel: 'Reference',
  fieldLabels: { firstName: 'First name', lastName: 'Last name', email: 'Email address' },
  contactPrompt: 'Questions? Reach us at',
  ctaLabel: 'Visit the website',
  footerText: 'A footer.',
};

function confirmationConfig(brand = {}) {
  return {
    defaultLocale: 'en',
    translations: { en: COPY },
    brand: {
      logoUrl: 'https://example.com/logo.png',
      logoAlt: 'Example',
      websiteUrl: 'https://example.com',
      contactEmail: 'hello@example.com',
      ...brand,
    },
  };
}

async function confirmationHtml(brand) {
  const emails = [];
  const worker = createFormWorker({
    formPath: '/api/forms/test',
    siteName: 'Test Site',
    senderName: 'Test Site',
    subjectPrefix: 'Nieuwe aanvraag',
    turnstile: false,
    confirmationEmail: confirmationConfig(brand),
  });
  const env = {
    SITE_ID: 'test-site',
    LEAD_RECIPIENT: 'owner@example.com',
    LEAD_SENDER: 'forms@example.com',
    TURNSTILE_SECRET_KEY: 'dev',
    LEAD_EMAIL: { async send(message) { emails.push(message); } },
    FORM_UPLOADS: { async put() {} },
  };

  const form = new FormData();
  form.set('firstName', 'Ada');
  form.set('lastName', 'Lovelace');
  form.set('email', 'ada@example.com');
  form.set('message', 'Hello.');

  const originalLog = console.log;
  console.log = () => {};
  let response;
  try {
    response = await worker.fetch(new Request('http://localhost/api/forms/test', { method: 'POST', body: form }), env, {});
  } finally {
    console.log = originalLog;
  }
  assert.equal(response.status, 200, await response.text());
  return emails.at(-1).html;
}

test('a brand without colors keeps the original navy-and-gold palette', async () => {
  const html = await confirmationHtml();

  assert.match(html, /background-color: #f4f1e8/); // page
  assert.match(html, /background-color: #00143a/); // dark band
  assert.match(html, /border-top: 4px solid #d4af37/); // accent rule
  assert.match(html, /background-color: #d4af37; color: #00143a/); // cta
  assert.match(html, /border-bottom: 1px solid #e6e0d4/); // table rules
});

test('a brand without logoWidth keeps the 360px logo slot', async () => {
  const html = await confirmationHtml();

  assert.match(html, /width="360"/);
  assert.match(html, /max-width: 360px/);
});

test('a supplied palette replaces every colour in the template', async () => {
  const html = await confirmationHtml({
    colors: {
      pageBackground: '#f7f4ec',
      surface: '#ffffff',
      surfaceAlt: '#fbf8f1',
      border: '#efe7d8',
      ink: '#1f4a37',
      onInk: '#f7f4ec',
      inkSoft: '#44403c',
      muted: '#78716c',
      mutedSoft: '#57534e',
      accent: '#d98b4a',
      button: '#2f6b4f',
      onButton: '#ffffff',
    },
  });

  assert.match(html, /background-color: #f7f4ec/);
  assert.match(html, /background-color: #1f4a37/);
  assert.match(html, /border-top: 4px solid #d98b4a/);
  assert.match(html, /background-color: #2f6b4f; color: #ffffff/);
  // None of the previous brand's colours survive.
  assert.doesNotMatch(html, /#00143a|#d4af37|#f4f1e8|#e6e0d4|#fffdf8/);
});

test('a partial palette falls back to the defaults for the rest', async () => {
  const html = await confirmationHtml({ colors: { accent: '#d98b4a' } });

  assert.match(html, /border-top: 4px solid #d98b4a/);
  assert.match(html, /background-color: #00143a/); // still the default ink
});

test('logoWidth drives both the attribute and the max-width', async () => {
  const html = await confirmationHtml({ logoWidth: 120 });

  assert.match(html, /width="120"/);
  assert.match(html, /max-width: 120px/);
  assert.doesNotMatch(html, /width="360"/);
});
