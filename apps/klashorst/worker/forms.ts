import { createFormWorker, type ConfirmationEmailCopy, type LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';
import type { Lang } from '../src/meta';

/** The museum's own name, as the site now carries it. */
const MUSEUM = 'Peter Klashorst Museum';

/**
 * The confirmation a visitor receives, in the museum's colours.
 *
 * Light paper with the site's ink bands and its one red accent, rather than
 * the navy-and-gold this renderer defaults to, which belongs to another
 * client. There is no logo file to point at: the museum's mark is lettering,
 * so the bar carries the name set in type.
 */
const merk = {
  wordmark: MUSEUM,
  websiteUrl: 'https://klashorst.jouwidealewebsite.nl',
  contactEmail: 'klashorstmuseum@gmail.com',
  colors: {
    pageBackground: '#f3efe7',
    surface: '#ffffff',
    surfaceAlt: '#faf7f1',
    border: '#e4ded2',
    // The site's own ink and bone, so the dark band is the wall of the museum.
    ink: '#171513',
    onInk: '#efe9dc',
    inkSoft: '#3a3532',
    muted: '#7a736c',
    mutedSoft: '#55504b',
    accent: '#d24b3f',
    button: '#d24b3f',
    onButton: '#ffffff',
  },
};

/** One branded confirmation, in one language. */
const bevestiging = (
  locale: Lang,
  copy: ConfirmationEmailCopy,
  includeSubmission = true,
): LocalizedConfirmationEmailConfig => ({
  defaultLocale: locale,
  translations: { [locale]: copy },
  brand: merk,
  includeSubmission,
});

const vraagCopy: Record<Lang, ConfirmationEmailCopy> = {
  nl: {
    subject: `Uw vraag is ontvangen - ${MUSEUM}`,
    preheader: 'Het museum heeft uw vraag binnen en neemt contact met u op.',
    greeting: 'Beste {name},',
    greetingWithoutName: 'Goedendag,',
    kicker: 'Uw vraag',
    receiptMessage: 'Uw vraag is bij het museum binnengekomen.',
    followUpMessage: 'Het museum neemt contact met u op via dit e-mailadres.',
    detailsHeading: 'Uw gegevens',
    messageHeading: 'Wat u schreef',
    referenceLabel: 'Referentie',
    fieldLabels: { firstName: 'Naam', email: 'E-mailadres' },
    contactPrompt: 'Liever zelf een mail versturen?',
    ctaLabel: 'Naar het museum',
    footerText: `${MUSEUM} - het werk van Peter Klashorst.`,
  },
  en: {
    subject: `Your question has been received - ${MUSEUM}`,
    preheader: 'The museum has your question and will get in touch.',
    greeting: 'Dear {name},',
    greetingWithoutName: 'Hello,',
    kicker: 'Your question',
    receiptMessage: 'Your question has reached the museum.',
    followUpMessage: 'The museum will reply to this email address.',
    detailsHeading: 'Your details',
    messageHeading: 'What you wrote',
    referenceLabel: 'Reference',
    fieldLabels: { firstName: 'Name', email: 'Email address' },
    contactPrompt: 'Prefer to send an email yourself?',
    ctaLabel: 'To the museum',
    footerText: `${MUSEUM} - the work of Peter Klashorst.`,
  },
};

const nieuwsbriefCopy: Record<Lang, ConfirmationEmailCopy> = {
  nl: {
    subject: `Uw aanmelding voor de nieuwsbrief is ontvangen - ${MUSEUM}`,
    preheader: 'U staat op de lijst voor het nieuws van het museum.',
    // The name is optional on this form, so the greeting never leans on it.
    greeting: 'Beste {name},',
    greetingWithoutName: 'Goedendag,',
    kicker: 'Nieuwsbrief',
    receiptMessage: 'U bent aangemeld voor de nieuwsbrief.',
    followUpMessage: 'U hoort van ons zodra er museumnieuws is.',
    detailsHeading: 'Uw gegevens',
    messageHeading: '',
    referenceLabel: 'Referentie',
    fieldLabels: { firstName: 'Naam', email: 'E-mailadres' },
    contactPrompt: 'Liever zelf een mail versturen?',
    ctaLabel: 'Naar het museum',
    footerText: `${MUSEUM} - het werk van Peter Klashorst.`,
  },
  en: {
    subject: `Your newsletter sign-up has been received - ${MUSEUM}`,
    preheader: 'You are on the list for news from the museum.',
    greeting: 'Dear {name},',
    greetingWithoutName: 'Hello,',
    kicker: 'Newsletter',
    receiptMessage: 'You are signed up for the newsletter.',
    followUpMessage: 'You will hear from us as soon as there is museum news.',
    detailsHeading: 'Your details',
    messageHeading: '',
    referenceLabel: 'Reference',
    fieldLabels: { firstName: 'Name', email: 'Email address' },
    contactPrompt: 'Prefer to send an email yourself?',
    ctaLabel: 'To the museum',
    footerText: `${MUSEUM} - the work of Peter Klashorst.`,
  },
};

/**
 * Two forms, and each of them twice: a Dutch visitor gets a Dutch confirmation
 * and an English visitor an English one. Which it is rides along in a hidden
 * `taal` field, because the language is in the address the form was filled in on.
 *
 * Both forms spell out their own wording. The package's default confirmation is
 * written for quote requests, and a museum sends neither: someone who signs up
 * for the newsletter is not asking for a quote, and neither is someone asking a
 * question. Left alone it confirms an "offerteaanvraag", which the museum read
 * as a mistake, and it was right to.
 */
export const newsletterWorkers: Record<Lang, ReturnType<typeof createFormWorker>> = {
  nl: createFormWorker({
    formPath: '/api/forms/newsletter',
    locale: 'nl',
    siteName: MUSEUM,
    ownerName: 'het museum',
    senderName: MUSEUM,
    subjectPrefix: 'Nieuwe aanmelding nieuwsbrief',
    // The address is in the subject, so the museum can tell one sign-up from
    // the next in a list of them without opening any.
    subjectFields: ['email'],
    confirmationFollowUpSentence: 'U hoort van ons zodra er museumnieuws is.',
    // An opt-in has nothing worth reading back: it would return the visitor
    // their own address and then an empty message under a heading.
    confirmationEmail: bevestiging('nl', nieuwsbriefCopy.nl, false),
    leadEmail: {
      heading: 'Nieuwe aanmelding voor de nieuwsbrief',
      nameLabels: { firstName: 'Naam', email: 'E-mailadres' },
      // The opt-in asks for a name and an address. Without this the museum is
      // mailed an empty project description and a note about the attachments
      // the form cannot take.
      includeMessage: false,
      includeAttachments: false,
    },
    // An opt-in only needs an address; a name is welcome but never demanded.
    requireFirstName: false,
    requireLastName: false,
    requireEmail: true,
    honeypotField: 'company',
  }),
  en: createFormWorker({
    formPath: '/api/forms/newsletter',
    locale: 'en',
    siteName: MUSEUM,
    ownerName: 'the museum',
    senderName: MUSEUM,
    subjectPrefix: 'Newsletter sign-up',
    subjectFields: ['email'],
    confirmationFollowUpSentence: 'You will hear from us as soon as there is museum news.',
    // An opt-in has nothing worth reading back: it would return the visitor
    // their own address and then an empty message under a heading.
    confirmationEmail: bevestiging('en', nieuwsbriefCopy.en, false),
    leadEmail: {
      heading: 'New newsletter sign-up',
      nameLabels: { firstName: 'Name', email: 'Email address' },
      includeMessage: false,
      includeAttachments: false,
    },
    requireFirstName: false,
    requireLastName: false,
    requireEmail: true,
    honeypotField: 'company',
  }),
};

export const vraagWorkers: Record<Lang, ReturnType<typeof createFormWorker>> = {
  nl: createFormWorker({
    formPath: '/api/forms/vraag',
    locale: 'nl',
    siteName: MUSEUM,
    ownerName: 'het museum',
    senderName: MUSEUM,
    subjectPrefix: 'Vraag via de site',
    // Who is asking, in the subject: the museum answers these by hand and a
    // list of identical subjects tells it nothing about which to open first.
    subjectFields: ['firstName'],
    confirmationFollowUpSentence: 'Het museum neemt contact met u op via dit e-mailadres.',
    confirmationEmail: bevestiging('nl', vraagCopy.nl),
    leadEmail: {
      heading: 'Nieuwe vraag via de site',
      messageHeading: 'De vraag',
      nameLabels: { firstName: 'Naam', email: 'E-mailadres' },
      includeAttachments: false,
    },
    messageField: 'bericht',
    requireFirstName: true,
    requireLastName: false,
    requireEmail: true,
    honeypotField: 'company',
  }),
  en: createFormWorker({
    formPath: '/api/forms/vraag',
    locale: 'en',
    siteName: MUSEUM,
    ownerName: 'the museum',
    senderName: MUSEUM,
    subjectPrefix: 'Question via the site',
    subjectFields: ['firstName'],
    confirmationFollowUpSentence: 'The museum will reply to this email address.',
    confirmationEmail: bevestiging('en', vraagCopy.en),
    leadEmail: {
      heading: 'New question via the site',
      messageHeading: 'The question',
      nameLabels: { firstName: 'Name', email: 'Email address' },
      includeAttachments: false,
    },
    messageField: 'bericht',
    requireFirstName: true,
    requireLastName: false,
    requireEmail: true,
    honeypotField: 'company',
  }),
};
