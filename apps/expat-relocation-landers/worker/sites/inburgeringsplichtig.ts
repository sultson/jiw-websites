import { createFormWorker } from '@jiw/cloudflare-forms';
import type { LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

const DOMAIN = 'inburgeringsplichtig.nl';
const SITE_NAME = 'Immigration Services NL';
const PREVIEW_ORIGIN = 'https://inburgeringsplichtig.jouwidealewebsite.nl';

const brandColors = {
  pageBackground: '#f7f8fb',
  surface: '#ffffff',
  surfaceAlt: '#f7f8fb',
  border: '#e3e7ef',
  ink: '#16305a',
  onInk: '#ffffff',
  inkSoft: '#1d2735',
  muted: '#566179',
  mutedSoft: '#566179',
  accent: '#c9560d',
  button: '#c9560d',
  onButton: '#ffffff',
};

const confirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  brand: {
    logoUrl: `${PREVIEW_ORIGIN}/images/email-logo.png`,
    logoAlt: SITE_NAME,
    logoWidth: 240,
    websiteUrl: PREVIEW_ORIGIN,
    contactEmail: 'info@expat-relocation.nl',
    colors: brandColors,
  },
  translations: {
    nl: {
      subject: 'Wij hebben uw bericht ontvangen - {siteName}',
      preheader: 'Dank u wel. Wij nemen persoonlijk contact met u op.',
      greeting: 'Beste {name},',
      receiptMessage: 'Dank u voor uw bericht aan {siteName}. Wij hebben uw gegevens goed ontvangen.',
      followUpMessage:
        'Wij nemen persoonlijk contact met u op om uw situatie te bespreken, meestal binnen één werkdag.',
      detailsHeading: 'Uw gegevens',
      messageHeading: 'Uw bericht',
      referenceLabel: 'Referentie',
      fieldLabels: {
        firstName: 'Naam',
        lastName: 'Achternaam',
        email: 'E-mailadres',
        phone: 'Telefoon of WhatsApp',
      },
      contactPrompt: 'Heeft u in de tussentijd een vraag? Beantwoord deze e-mail of neem contact op via',
      ctaLabel: 'Naar de website',
      footerText:
        'Immigration Services NL is een onafhankelijke particuliere dienstverlener en is niet verbonden aan de IND, DUO of de Nederlandse overheid.',
    },
    en: {
      subject: 'We received your message - {siteName}',
      preheader: 'Thank you. We will contact you personally.',
      greeting: 'Dear {name},',
      receiptMessage: 'Thank you for contacting {siteName}. We have safely received your details.',
      followUpMessage:
        'We will contact you personally to discuss your situation, usually within one business day.',
      detailsHeading: 'Your details',
      messageHeading: 'Your message',
      referenceLabel: 'Reference',
      fieldLabels: {
        firstName: 'Name',
        lastName: 'Last name',
        email: 'Email address',
        phone: 'Telephone or WhatsApp',
      },
      contactPrompt: 'A question in the meantime? Reply to this email or contact us at',
      ctaLabel: 'Visit the website',
      footerText:
        'Immigration Services NL is an independent private immigration service provider and is not affiliated with the IND, DUO or the Dutch Government.',
    },
  },
};

/**
 * Campaign attribution and routing context. These reach the owner's inbox but
 * never the visitor's confirmation (brief §27).
 */
const attributionFields = [
  { name: 'situation', label: 'Aangeklikte situatie' },
  { name: 'language', label: 'Taal van de pagina' },
  { name: 'domain', label: 'Domein' },
  { name: 'pageUrl', label: 'Pagina-URL' },
  { name: 'referrer', label: 'Verwijzende website' },
  { name: 'utmSource', label: 'UTM source' },
  { name: 'utmMedium', label: 'UTM medium' },
  { name: 'utmCampaign', label: 'UTM campaign' },
  { name: 'utmTerm', label: 'UTM term' },
  { name: 'utmContent', label: 'UTM content' },
  { name: 'gclid', label: 'Google Ads (gclid)' },
  { name: 'consent', label: 'Akkoord privacybeleid' },
];

/** Primary lead form: name, email, phone, optional message (brief §5). */
const lead = createFormWorker({
  formPath: '/api/forms/inburgering',
  siteName: SITE_NAME,
  senderName: SITE_NAME,
  ownerName: 'Johanna',
  subjectPrefix: `NEW LEAD | ${DOMAIN}`,
  subjectSeparator: ' | ',
  subjectFields: ['firstName'],
  turnstile: false,
  honeypotField: 'company',
  messageField: 'message',
  requireLastName: false,
  requiredFields: [
    { name: 'phone', label: 'telefoonnummer', message: 'Vul uw telefoon- of WhatsApp-nummer in.' },
  ],
  emailFields: [{ name: 'phone', label: 'Telefoon of WhatsApp' }],
  leadOnlyEmailFields: attributionFields,
  leadEmail: {
    heading: `Nieuwe lead via ${DOMAIN}`,
    messageHeading: 'Toelichting van de aanvrager',
    nameLabels: { firstName: 'Naam', lastName: 'Achternaam', email: 'E-mailadres' },
  },
  confirmationEmail,
});

/**
 * Optional qualification answers submitted on the thank-you page. No email
 * address is collected here, so no confirmation is sent; the reference field
 * ties it back to the lead that was already delivered.
 */
const qualify = createFormWorker({
  formPath: '/api/forms/inburgering-qualify',
  siteName: SITE_NAME,
  senderName: SITE_NAME,
  ownerName: 'Johanna',
  subjectPrefix: `AANVULLING | ${DOMAIN}`,
  subjectSeparator: ' | ',
  subjectFields: ['reference'],
  turnstile: false,
  honeypotField: 'company',
  messageField: 'message',
  requireLastName: false,
  requireEmail: false,
  emailFields: [
    { name: 'reference', label: 'Referentie van de aanvraag' },
    { name: 'location', label: 'Woont op dit moment' },
    { name: 'situation', label: 'Situatie' },
    { name: 'exam', label: 'Basisexamen buitenland' },
    { name: 'nationality', label: 'Nationaliteit' },
    { name: 'arrival', label: 'In Nederland sinds' },
    { name: 'language', label: 'Taal van de pagina' },
    { name: 'domain', label: 'Domein' },
  ],
  leadEmail: {
    heading: `Aanvullende antwoorden via ${DOMAIN}`,
    messageHeading: 'Toelichting',
    nameLabels: { firstName: 'Kenmerk', lastName: 'Achternaam', email: 'E-mailadres' },
  },
});

export const inburgeringsplichtigForms = [
  { path: '/api/forms/inburgering-qualify', worker: qualify },
  { path: '/api/forms/inburgering', worker: lead },
];
