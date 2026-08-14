import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

// The lead notification's wording used to be hardcoded for quote requests. It is
// now overridable per site, and these tests pin both halves of that: an override
// reaches every renderer, and a config without one is byte-for-byte what this
// package has always sent (twenty apps depend on that).

function createConfig(overrides = {}) {
  return {
    formPath: '/api/forms/test',
    siteName: 'Test Site',
    senderName: 'Test Site',
    subjectPrefix: 'Nieuwe aanvraag',
    turnstile: false,
    messageField: 'message',
    emailFields: [{ name: 'service', label: 'Dienst' }],
    ...overrides,
  };
}

function createHarness(config) {
  const emails = [];
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
      async put() {},
    },
  };

  return {
    async submit() {
      const form = new FormData();
      form.set('firstName', 'Ada');
      form.set('lastName', 'Lovelace');
      form.set('email', 'ada@example.com');
      form.set('service', 'Vakantiehuis');
      form.set('message', 'Graag informatie.');

      const originalLog = console.log;
      console.log = () => {};
      let response;
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
      return emails.at(-2) ?? emails.at(-1);
    },
  };
}

test('a config without leadEmail keeps the original Dutch quote-request wording', async () => {
  const owner = await createHarness(createConfig()).submit();

  assert.match(owner.text, /^Nieuwe offerteaanvraag voor Test Site$/m);
  assert.match(owner.text, /^Projectomschrijving:$/m);
  assert.match(owner.text, /^Voornaam: Ada$/m);
  assert.match(owner.text, /^Achternaam: Lovelace$/m);
  assert.match(owner.text, /^E-mail: ada@example\.com$/m);
  assert.match(owner.html, /<h1 style="font-size: 20px;">Nieuwe offerteaanvraag voor Test Site<\/h1>/);
  assert.match(owner.html, /<h2 style="font-size: 16px;">Projectomschrijving<\/h2>/);
});

test('a config without leadEmail keeps the original English wording', async () => {
  const owner = await createHarness(createConfig({ locale: 'en' })).submit();

  assert.match(owner.text, /^New request for Test Site$/m);
  assert.match(owner.text, /^Message:$/m);
  // The three built-in row labels have always been Dutch, locale or not.
  assert.match(owner.text, /^Voornaam: Ada$/m);
  assert.match(owner.html, /<h1 style="font-size: 20px;">New request for Test Site<\/h1>/);
  assert.match(owner.html, /<h2 style="font-size: 16px;">Message<\/h2>/);
});

test('leadEmail overrides reach the text and html notification', async () => {
  const owner = await createHarness(createConfig({
    leadEmail: {
      heading: 'Nieuwe aanvraag voor Winterswijk Vakantiehuis',
      messageHeading: 'Bericht van de gast',
      nameLabels: { firstName: 'Naam', lastName: 'Achternaam gast', email: 'E-mailadres' },
    },
  })).submit();

  assert.match(owner.text, /^Nieuwe aanvraag voor Winterswijk Vakantiehuis$/m);
  assert.match(owner.text, /^Bericht van de gast:$/m);
  assert.match(owner.text, /^Naam: Ada$/m);
  assert.match(owner.text, /^Achternaam gast: Lovelace$/m);
  assert.match(owner.text, /^E-mailadres: ada@example\.com$/m);
  assert.doesNotMatch(owner.text, /offerteaanvraag|Projectomschrijving/);
  assert.match(owner.html, /<h1 style="font-size: 20px;">Nieuwe aanvraag voor Winterswijk Vakantiehuis<\/h1>/);
  assert.match(owner.html, /<h2 style="font-size: 16px;">Bericht van de gast<\/h2>/);
  assert.doesNotMatch(owner.html, /offerteaanvraag|Projectomschrijving/);
});

test('a partial leadEmail override leaves the other fields at their defaults', async () => {
  const owner = await createHarness(createConfig({
    leadEmail: { messageHeading: 'Bericht van de gast' },
  })).submit();

  assert.match(owner.text, /^Nieuwe offerteaanvraag voor Test Site$/m);
  assert.match(owner.text, /^Bericht van de gast:$/m);
  assert.match(owner.text, /^Voornaam: Ada$/m);
});

test('leadEmail wording is escaped before it reaches the html notification', async () => {
  const owner = await createHarness(createConfig({
    leadEmail: { heading: 'Aanvraag <script>alert(1)</script>' },
  })).submit();

  assert.match(owner.html, /Aanvraag &lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.doesNotMatch(owner.html, /<script>alert\(1\)<\/script>/);
});
