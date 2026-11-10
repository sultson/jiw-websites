import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

// A form with no free-text field (Puur Genieten's sign-up) mailed every visitor a
// heading "Your message" over a lone "-". `includeMessage: false` on the branded
// confirmation drops that block in both the html and the text part; leaving it
// out keeps the block exactly as before.

const COPY = {
  subject: 'Received - {siteName}',
  preheader: 'Thanks.',
  greeting: 'Dear {name},',
  receiptMessage: 'Thank you.',
  followUpMessage: 'We will reply shortly.',
  detailsHeading: 'What you sent us',
  messageHeading: 'Your message heading',
  referenceLabel: 'Reference',
  fieldLabels: { firstName: 'Contact', email: 'Email' },
  contactPrompt: 'Questions?',
  ctaLabel: 'Visit the website',
  footerText: 'A footer.',
};

async function confirmation(extra) {
  const emails = [];
  const worker = createFormWorker({
    formPath: '/api/forms/test',
    siteName: 'Test Site',
    senderName: 'Test Site',
    subjectPrefix: 'Aanmelding',
    requireLastName: false,
    turnstile: false,
    confirmationEmail: {
      defaultLocale: 'en',
      translations: { en: COPY },
      brand: { websiteUrl: 'https://example.com' },
      ...extra,
    },
  });
  const env = {
    SITE_ID: 'test-site',
    LEAD_RECIPIENT: 'owner@example.com',
    LEAD_SENDER: 'forms@example.com',
    LEAD_EMAIL: { async send(message) { emails.push(message); } },
    FORM_UPLOADS: { async put() {} },
  };
  const form = new FormData();
  form.set('firstName', 'Ada');
  form.set('email', 'ada@example.com');
  const log = console.log;
  console.log = () => {};
  try {
    const res = await worker.fetch(new Request('http://localhost/api/forms/test', { method: 'POST', body: form }), env, {});
    assert.equal(res.status, 200, await res.text());
  } finally {
    console.log = log;
  }
  return emails.at(-1);
}

test('includeMessage: false drops the message block from html and text', async () => {
  const mail = await confirmation({ includeMessage: false });
  assert.ok(!mail.html.includes('Your message heading'));
  assert.ok(!mail.text.includes('Your message heading'));
  // The rest of the read-back stays.
  assert.ok(mail.html.includes('What you sent us'));
  assert.ok(mail.text.includes('What you sent us'));
});

test('without includeMessage the message block is still there', async () => {
  const mail = await confirmation({});
  assert.ok(mail.html.includes('Your message heading'));
  assert.ok(mail.text.includes('Your message heading'));
});
