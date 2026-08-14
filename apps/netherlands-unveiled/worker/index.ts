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
    'We will reply by email or Messenger with tour options, timing and availability.',
  messageField: 'message',
  requireLastName: false,
  requiredFields: [
    { name: 'tourInterest', label: 'tour interest', message: 'Choose the tour you are interested in.' },
    { name: 'travelDate', label: 'travel date', message: 'Add your preferred date or travel period.' },
    { name: 'groupSize', label: 'group size', message: 'Add the expected group size.' },
    { name: 'message', label: 'message', message: 'Tell us what kind of tour you have in mind.' },
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

// Three hostnames resolve to this Worker. Only one of them should ever be
// indexed, so the other two send readers and crawlers to the canonical one
// instead of serving a second copy of every page.
const CANONICAL_HOST = 'netherlandsunveiled.com';
const REDIRECT_HOSTS = new Set([
  'www.netherlandsunveiled.com',
  'netherlandsunveiledtours.jouwidealewebsite.nl',
]);

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext) {
    const url = new URL(request.url);

    // Only redirect reads: a form POST carries a body that a 301 would drop.
    if (
      REDIRECT_HOSTS.has(url.hostname) &&
      (request.method === 'GET' || request.method === 'HEAD')
    ) {
      url.hostname = CANONICAL_HOST;
      url.protocol = 'https:';
      url.port = '';
      return new Response(null, {
        status: 301,
        headers: {
          Location: url.toString(),
          'Cache-Control': 'public, max-age=3600',
        },
      });
    }

    if (url.pathname.startsWith('/api/forms/contact')) {
      const workerRequest = request as Parameters<NonNullable<typeof contactWorker.fetch>>[0];
      return contactWorker.fetch!(workerRequest, env, ctx);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
