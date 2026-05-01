import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv;

export default createFormWorker({
  formPath: '/api/forms/offerte',
  siteName: 'RN Schilders & Renovatie',
  ownerName: 'Richard',
  senderName: 'RN Schilders offerteformulier',
  subjectPrefix: 'Nieuwe offerteaanvraag RN Schilders',
  confirmationFollowUpSentence: 'Richard neemt binnen 24 tot 48 uur contact met u op om uw project en de volgende stap door te spreken.',
});
