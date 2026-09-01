import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

// The confirmation the visitor receives used to call every submission an
// offerteaanvraag, which is wrong for a museum's newsletter opt-in and reads to
// the person who signed up as a mistake. It is now overridable per form, and
// these tests pin both halves: an override reaches the subject, the text and the
// HTML, and a config without one is what this package has always sent.

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
    async submit(values = {}) {
      const form = new FormData();
      form.set('firstName', values.firstName ?? 'Ada');
      form.set('lastName', values.lastName ?? 'Lovelace');
      form.set('email', values.email ?? 'ada@example.com');
      form.set('service', values.service ?? 'Vakantiehuis');
      form.set('message', values.message ?? 'Graag informatie.');
      for (const [name, value] of Object.entries(values.extra ?? {})) form.set(name, value);

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
      return { owner: emails.at(-2), confirmation: emails.at(-1) };
    },
  };
}

test('a config without confirmationCopy keeps the original Dutch quote-request wording', async () => {
  const { confirmation } = await createHarness(createConfig()).submit();

  assert.equal(confirmation.subject, 'Uw offerteaanvraag is ontvangen - Test Site');
  assert.match(confirmation.text, /^Beste Ada Lovelace,$/m);
  assert.match(confirmation.text, /^Uw offerteaanvraag voor Test Site is verstuurd\.$/m);
  assert.match(confirmation.text, /^Uw aanvraag:$/m);
  assert.match(confirmation.text, /^Projectomschrijving:$/m);
  assert.match(confirmation.text, /^Voornaam: Ada$/m);
  assert.match(confirmation.text, /^Referentie: /m);
  assert.match(confirmation.html, /<p>Uw offerteaanvraag voor Test Site is verstuurd\. /);
  assert.match(confirmation.html, /<h1 style="font-size: 20px;">Uw aanvraag<\/h1>/);
  assert.match(confirmation.html, /<h2 style="font-size: 16px;">Projectomschrijving<\/h2>/);
});

test('a config without confirmationCopy keeps the original English wording', async () => {
  const { confirmation } = await createHarness(createConfig({ locale: 'en' })).submit();

  assert.equal(confirmation.subject, 'Your request has been received - Test Site');
  assert.match(confirmation.text, /^Dear Ada Lovelace,$/m);
  assert.match(confirmation.text, /^Your request to Test Site has been sent\.$/m);
  assert.match(confirmation.text, /^Your request:$/m);
  assert.match(confirmation.text, /^Message:$/m);
  assert.match(confirmation.text, /^Reference: /m);
  assert.match(confirmation.html, /<h1 style="font-size: 20px;">Your request<\/h1>/);
});

test('confirmationCopy renames what was sent in the subject, the text and the HTML', async () => {
  const { confirmation } = await createHarness(
    createConfig({
      confirmationFollowUpSentence: 'Het museum neemt contact met u op.',
      confirmationCopy: {
        subject: 'Uw vraag is ontvangen - {siteName}',
        openingSentence: 'Uw vraag aan het {siteName} is verstuurd.',
        detailsHeading: 'Uw gegevens',
        messageHeading: 'Uw vraag',
      },
    }),
  ).submit();

  assert.equal(confirmation.subject, 'Uw vraag is ontvangen - Test Site');
  assert.match(confirmation.text, /^Uw vraag aan het Test Site is verstuurd\.$/m);
  assert.match(confirmation.text, /^Uw gegevens:$/m);
  assert.match(confirmation.text, /^Uw vraag:$/m);
  assert.doesNotMatch(confirmation.text, /offerteaanvraag|aanvraag:|Projectomschrijving/);
  assert.match(confirmation.html, /<h1 style="font-size: 20px;">Uw gegevens<\/h1>/);
  assert.match(confirmation.html, /<h2 style="font-size: 16px;">Uw vraag<\/h2>/);
  assert.doesNotMatch(confirmation.html, /offerteaanvraag|Projectomschrijving/);
});

test('includeSubmission false drops the read-back but keeps the greeting and the reference', async () => {
  const { confirmation, owner } = await createHarness(
    createConfig({
      confirmationCopy: {
        openingSentence: 'Uw aanmelding voor de nieuwsbrief is verstuurd.',
        includeSubmission: false,
      },
    }),
  ).submit();

  assert.match(confirmation.text, /^Beste Ada Lovelace,$/m);
  assert.match(confirmation.text, /^Uw aanmelding voor de nieuwsbrief is verstuurd\.$/m);
  assert.match(confirmation.text, /^Referentie: /m);
  assert.doesNotMatch(confirmation.text, /Uw aanvraag:|Projectomschrijving:|Voornaam: Ada/);
  assert.doesNotMatch(confirmation.html, /<table|Projectomschrijving/);
  // The owner still gets everything that was filled in.
  assert.match(owner.text, /^Voornaam: Ada$/m);
  assert.match(owner.text, /^Dienst: Vakantiehuis$/m);
});

test('owner-only rows stay out of the confirmation', async () => {
  const { owner, confirmation } = await createHarness(
    createConfig({ leadOnlyEmailFields: [{ name: 'utm_campaign', label: 'Campagne' }] }),
  ).submit({ extra: { utm_campaign: 'zomer-2026' } });

  assert.match(owner.text, /^Campagne: zomer-2026$/m);
  assert.doesNotMatch(confirmation.text, /Campagne|zomer-2026/);
  assert.doesNotMatch(confirmation.html, /Campagne|zomer-2026/);
});

test('a name the form never asks for gets no row in either email', async () => {
  const { owner, confirmation } = await createHarness(
    createConfig({ requireLastName: false, emailFields: [] }),
  ).submit({ lastName: '' });

  assert.match(owner.text, /^Voornaam: Ada$/m);
  assert.doesNotMatch(owner.text, /Achternaam/);
  assert.doesNotMatch(confirmation.text, /Achternaam/);
  assert.doesNotMatch(confirmation.html, /Achternaam/);
});

test('a form with no free-text field and no uploads can drop those blocks from the notification', async () => {
  const { owner } = await createHarness(
    createConfig({
      emailFields: [],
      leadEmail: { heading: 'Nieuwe aanmelding', includeMessage: false, includeAttachments: false },
    }),
  ).submit();

  assert.match(owner.text, /^Nieuwe aanmelding$/m);
  assert.match(owner.text, /^Voornaam: Ada$/m);
  assert.match(owner.text, /^Inzending: /m);
  assert.doesNotMatch(owner.text, /Projectomschrijving|Bijlagen/);
  assert.doesNotMatch(owner.html, /Projectomschrijving|Bijlagen/);
});

// A form that does not demand a name greeted whoever left it out as "Beste ,".
// A newsletter opt-in is exactly that form: it needs an address and takes a
// name if one is offered.
test('a submission without a name is greeted without one, in both languages', async () => {
  const nameless = { firstName: '', lastName: '' };
  const config = { requireFirstName: false, requireLastName: false };

  const dutch = await createHarness(createConfig(config)).submit(nameless);
  assert.match(dutch.confirmation.text, /^Goedendag,$/m);
  assert.match(dutch.confirmation.html, /<p>Goedendag,<\/p>/);
  assert.doesNotMatch(dutch.confirmation.text, /Beste ,/);
  assert.doesNotMatch(dutch.confirmation.html, /Beste ,/);

  const english = await createHarness(createConfig({ ...config, locale: 'en' })).submit(nameless);
  assert.match(english.confirmation.text, /^Hello,$/m);
  assert.match(english.confirmation.html, /<p>Hello,<\/p>/);
  assert.doesNotMatch(english.confirmation.text, /Dear ,/);
});

test('a name that is given is still used in the greeting', async () => {
  const { confirmation } = await createHarness(createConfig()).submit();

  assert.match(confirmation.text, /^Beste Ada Lovelace,$/m);
  assert.match(confirmation.html, /<p>Beste Ada Lovelace,<\/p>/);
});
