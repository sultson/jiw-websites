import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';
import { expatConfirmationEmails } from './confirmation-email';

export type Env = CloudflareFormsEnv;

function matchesFormRoute(pathname: string, formPath: string) {
  return pathname === formPath || pathname.startsWith(`${formPath}/`);
}

// One tailored form per visitor path (immigration / relocation & packages /
// VIP), instead of a single generic contact form.
const immigrationWorker = createFormWorker({
  formPath: '/api/forms/immigration',
  siteName: 'E & I Expat & Immigration Services',
  ownerName: 'Johanna',
  senderName: 'E & I Expat & Immigration Services',
  subjectPrefix: 'New immigration inquiry',
  turnstile: false,
  honeypotField: 'company',
  confirmationEmail: expatConfirmationEmails.immigration,
  confirmationFollowUpSentence:
    'Johanna will personally review your situation and reply within one business day, usually much sooner.',
  messageField: 'message',
  requireLastName: false,
  subjectFields: ['service'],
  requiredFields: [
    { name: 'message', label: 'message', message: 'Briefly describe your situation.' },
  ],
  emailFields: [
    { name: 'service', label: 'Service' },
    { name: 'nationality', label: 'Nationality' },
    { name: 'currentLocation', label: 'Current country of residence' },
    { name: 'status', label: 'Immigration status' },
    { name: 'phone', label: 'Phone / WhatsApp' },
    { name: 'timeline', label: 'Timeline' },
  ],
});

const relocationWorker = createFormWorker({
  formPath: '/api/forms/relocation',
  siteName: 'E & I Expat & Immigration Services',
  ownerName: 'Johanna',
  senderName: 'E & I Expat & Immigration Services',
  subjectPrefix: 'New relocation inquiry',
  turnstile: false,
  honeypotField: 'company',
  confirmationEmail: expatConfirmationEmails.relocation,
  confirmationFollowUpSentence:
    'Johanna will personally review your plans and reply within one business day, usually much sooner.',
  messageField: 'message',
  requireLastName: false,
  subjectFields: ['service'],
  requiredFields: [
    { name: 'message', label: 'message', message: 'Briefly describe what you need.' },
  ],
  emailFields: [
    { name: 'service', label: 'Service' },
    { name: 'movingFrom', label: 'Moving from' },
    { name: 'household', label: 'Who is relocating' },
    { name: 'phone', label: 'Phone / WhatsApp' },
    { name: 'timeline', label: 'Timeline' },
  ],
});

const vipWorker = createFormWorker({
  formPath: '/api/forms/vip',
  siteName: 'E & I Expat & Immigration Services',
  ownerName: 'Johanna',
  senderName: 'E & I VIP Relocation',
  subjectPrefix: 'New VIP relocation inquiry',
  turnstile: false,
  honeypotField: 'company',
  confirmationEmail: expatConfirmationEmails.vip,
  confirmationFollowUpSentence:
    'Johanna will contact you personally, day or night. For immediate assistance, message us on WhatsApp.',
  messageField: 'message',
  requireLastName: false,
  subjectFields: ['package'],
  requiredFields: [
    { name: 'message', label: 'message', message: 'Briefly describe your relocation.' },
  ],
  emailFields: [
    { name: 'package', label: 'Package' },
    { name: 'movingFrom', label: 'Moving from' },
    { name: 'phone', label: 'Phone / WhatsApp' },
    { name: 'preferredContact', label: 'Preferred contact' },
    { name: 'arrival', label: 'Planned arrival' },
  ],
});

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (matchesFormRoute(url.pathname, '/api/forms/immigration')) {
      return immigrationWorker.fetch!(request, env, ctx);
    }
    if (matchesFormRoute(url.pathname, '/api/forms/relocation')) {
      return relocationWorker.fetch!(request, env, ctx);
    }
    if (matchesFormRoute(url.pathname, '/api/forms/vip')) {
      return vipWorker.fetch!(request, env, ctx);
    }

    return new Response(JSON.stringify({ success: false, error: 'not_found' }), {
      status: 404,
      headers: { 'content-type': 'application/json; charset=utf-8' },
    });
  },
} satisfies ExportedHandler<Env>;
