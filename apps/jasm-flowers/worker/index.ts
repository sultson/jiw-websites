import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { jasmConfirmationEmail } from './confirmation';

export type Env = CloudflareFormsEnv & {
  ASSETS: Fetcher;
};

/* One form, one place: the buyer enquiry at the bottom of /contact/ (and /nl/contact/,
   /de/contact/ - the same page in three languages, so one endpoint serves all three).
   Every other quote button on the site is a link that lands on it.

   Until this graduation the form had no backend at all. It built a message and handed
   it to the visitor's own mail client or WhatsApp, which meant a buyer on a locked-down
   corporate desktop with no mail handler registered could fill the whole thing in and
   have nothing happen. The WhatsApp button is still there, because for this audience it
   genuinely is the faster channel, but the primary button now posts here.

   `locale: 'en'` governs the validation messages a visitor could see and the wording of
   our own notification. The site is authored in English and its buyers are spread across
   Europe and the Middle East, so English is the right fallback for the one case the
   client-side check misses. The confirmation the buyer receives is separate and does
   follow the language of the page they were on; see confirmation.ts. */
const enquiry = createFormWorker({
  formPath: '/api/forms/enquiry',
  locale: 'en',
  siteName: 'JASM Flowers',
  senderName: 'JASM Flowers',
  subjectPrefix: 'New buyer enquiry JASM Flowers',
  // So the subject line already says which company, from which country. For a B2B
  // enquiry those two decide whether it gets opened now or after lunch.
  subjectFields: ['company', 'country'],
  subjectSeparator: ' | ',

  /* The form asks for one name, not a first and last name: these are company buyers
     writing on behalf of a business, and splitting it would be asking a Dutch
     wholesaler to file "van der Berg" correctly for no benefit. `firstName` is the
     name the package gives that field, not what the buyer reads - the page says
     "Your name". The package drops a built-in row that is not required and came back
     empty, so neither mail prints "Last name: -". */
  requireFirstName: true,
  requireLastName: false,
  requireEmail: true,
  messageField: 'message',

  // No Turnstile, a hidden field instead - no extra Cloudflare resource, no secret,
  // and no third-party request for a buyer who just wants a price. A bot that fills
  // `website` gets {"ok":true} and nothing is stored or mailed.
  turnstile: false,
  honeypotField: 'website',

  /* Company and country carry an asterisk on the page, so the server enforces them
     too. Without this a bot or a stale cached page could post past the client-side
     check and we would get an enquiry we cannot price or route. */
  requiredFields: [
    { name: 'company', label: 'company', message: 'Enter your company name.' },
    { name: 'country', label: 'country', message: 'Enter the country you buy for.' },
  ],

  /* Same order as the form itself: who you are, then what you need. These rows go in
     both mails, so the buyer reads back exactly what they typed. */
  emailFields: [
    { name: 'company', label: 'Company' },
    { name: 'country', label: 'Country' },
    { name: 'phone', label: 'Phone or WhatsApp' },
    { name: 'flowers', label: 'Flowers required' },
    { name: 'volume', label: 'Estimated quantity' },
    { name: 'spec', label: 'Stem length / specification' },
    { name: 'dest', label: 'Delivery destination' },
    { name: 'freq', label: 'Shipment frequency' },
  ],

  /* Which language the buyer was reading the site in. It belongs in our notification
     because it decides which language to answer in, and it has no business in the
     confirmation: telling someone the language of the page they just used reads as a
     system leaking its own plumbing. */
  leadOnlyEmailFields: [
    { name: 'lang', label: 'Site language' },
  ],

  leadEmail: {
    heading: 'New buyer enquiry for JASM Flowers',
    messageHeading: 'Message',
    // The package's three built-in row labels are Dutch whatever the locale, which
    // would put Voornaam and E-mail in the middle of an otherwise English notification.
    nameLabels: { firstName: 'Name', email: 'Email' },
    // This form takes no uploads, so without this every notification would carry an
    // attachments block saying there are none.
    includeAttachments: false,
  },

  confirmationEmail: jasmConfirmationEmail,
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // The worker only runs ahead of /api/* (run_worker_first in wrangler.jsonc). All
    // 18 pages come straight off the edge as static assets with no worker in between.
    if (url.pathname.startsWith('/api/forms/')) return enquiry.fetch!(request, env, ctx);

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
