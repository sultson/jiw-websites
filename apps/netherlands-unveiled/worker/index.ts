/// <reference types="@cloudflare/workers-types" />

import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

const contactWorker = createFormWorker({
  formPath: '/api/forms/contact',
  siteName: 'Netherlands Unveiled',
  ownerName: 'Marion',
  senderName: 'Netherlands Unveiled',
  subjectPrefix: 'New Netherlands Unveiled tour request',
  confirmationFollowUpSentence:
    'Marion will reply by email or Messenger with tour options, timing and availability.',
  messageField: 'message',
  requireLastName: false,
  requiredFields: [
    { name: 'tourInterest', label: 'tour interest', message: 'Choose the tour you are interested in.' },
    { name: 'travelDate', label: 'travel date', message: 'Add your preferred date or travel period.' },
    { name: 'groupSize', label: 'group size', message: 'Add the expected group size.' },
    { name: 'message', label: 'message', message: 'Tell Marion what kind of tour you have in mind.' },
  ],
  subjectFields: ['tourInterest'],
  emailFields: [
    { name: 'tourInterest', label: 'Tour interest' },
    { name: 'travelDate', label: 'Preferred date or period' },
    { name: 'groupSize', label: 'Group size' },
    { name: 'language', label: 'Preferred language' },
    { name: 'contactPreference', label: 'Preferred contact' },
  ],
});

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    if (url.pathname.startsWith('/api/forms/contact')) {
      const workerRequest = request as Parameters<NonNullable<typeof contactWorker.fetch>>[0];
      return contactWorker.fetch!(workerRequest, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
