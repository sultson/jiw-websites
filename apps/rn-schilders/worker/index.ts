import { createFormWorker, type CloudflareFormsEnv } from '@jiw/cloudflare-forms';

export type Env = CloudflareFormsEnv;

export default createFormWorker({
  formPath: '/api/forms/offerte',
  siteName: 'RN Schilders & Renovatie',
  ownerName: 'Richard',
  senderName: 'RN Schilders',
  subjectPrefix: 'Nieuwe offerteaanvraag RN Schilders',
  confirmationFollowUpSentence: 'Richard neemt binnen 24 tot 48 uur contact met u op om uw project en de volgende stap door te spreken.',
  messageField: 'message',
  serviceOtherField: 'serviceOther',
  subjectFields: ['service', 'postalCode', 'city'],
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoonnummer in.' },
    { name: 'postalCode', label: 'postcode', message: 'Vul uw postcode in.' },
    { name: 'streetName', label: 'straatnaam', message: 'Vul uw straatnaam in.' },
    { name: 'houseNumber', label: 'huisnummer', message: 'Vul uw huisnummer in.' },
    { name: 'city', label: 'plaatsnaam', message: 'Vul uw plaatsnaam in.' },
    { name: 'service', label: 'dienst', message: 'Kies een dienst.' },
    {
      name: 'serviceOther',
      label: 'dienst toelichting',
      message: 'Vul de gewenste dienst in.',
      when: { field: 'service', equals: 'other' },
    },
    { name: 'preferredExecutionDate', label: 'gewenste uitvoeringsdatum', message: 'Kies een gewenste uitvoeringsdatum.' },
    { name: 'message', label: 'projectomschrijving', message: 'Beschrijf kort wat er moet gebeuren.' },
  ],
  emailFields: [
    { name: 'phone', label: 'Telefoon' },
    { name: 'postalCode', label: 'Postcode' },
    { name: 'streetName', label: 'Straatnaam' },
    { name: 'houseNumber', label: 'Huisnummer' },
    { name: 'city', label: 'Plaatsnaam' },
    { name: 'service', label: 'Dienst' },
    { name: 'preferredExecutionDate', label: 'Gewenste uitvoeringsdatum' },
    { name: 'urgent', label: 'Spoed' },
  ],
});
