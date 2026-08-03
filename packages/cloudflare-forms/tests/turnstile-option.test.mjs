import assert from 'node:assert/strict';
import test from 'node:test';

import { createFormWorker } from '../src/index.ts';

function createHarness({ turnstile, honeypotField } = {}) {
  const emails = [];
  const stored = new Map();
  const worker = createFormWorker({
    formPath: '/api/forms/test',
    siteName: 'Test site',
    senderName: 'Test site',
    subjectPrefix: 'New inquiry',
    ...(turnstile === undefined ? {} : { turnstile }),
    ...(honeypotField === undefined ? {} : { honeypotField }),
    requireLastName: false,
    requiredFields: [{ name: 'message', label: 'message' }],
  });
  const env = {
    SITE_ID: 'test-site',
    LEAD_RECIPIENT: 'owner@example.com',
    LEAD_SENDER: 'forms@example.com',
    TURNSTILE_SECRET_KEY: '',
    LEAD_EMAIL: { async send(message) { emails.push(message); } },
    FORM_UPLOADS: { async put(key, value) { stored.set(key, value); } },
  };

  return {
    emails,
    stored,
    async submit(values = {}) {
      const form = new FormData();
      form.set('firstName', 'Ada');
      form.set('email', 'ada@example.com');
      form.set('message', 'Please contact me.');
      if (values.company) form.set('company', values.company);
      const originalLog = console.log;
      console.log = () => {};
      try {
        return await worker.fetch(
          new Request('https://example.com/api/forms/test', { method: 'POST', body: form }),
          env,
          {},
        );
      } finally {
        console.log = originalLog;
      }
    },
  };
}

test('Turnstile remains enabled by default', async () => {
  const harness = createHarness();
  const response = await harness.submit();

  assert.equal(response.status, 400);
  assert.equal(harness.emails.length, 0);
  assert.equal(harness.stored.size, 0);
});

test('a client can explicitly disable Turnstile without a development bypass', async () => {
  const harness = createHarness({ turnstile: false });
  const response = await harness.submit();

  assert.equal(response.status, 200, await response.text());
  assert.equal(harness.emails.length, 2);
  assert.ok(harness.stored.size > 0);
});

test('a configured honeypot silently drops bot submissions', async () => {
  const harness = createHarness({ turnstile: false, honeypotField: 'company' });
  const response = await harness.submit({ company: 'Spam Incorporated' });

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(harness.emails.length, 0);
  assert.equal(harness.stored.size, 0);
});
