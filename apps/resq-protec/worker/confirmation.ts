import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

// The confirmation every visitor receives, in the language of the page they sent it
// from (the form posts `__jiw_confirmation_locale`). Colours are the site's own:
// warm black, the lime of the logo mark, the mist grey of the footer.
const colors = {
  pageBackground: '#f2f2f0',
  surface: '#ffffff',
  surfaceAlt: '#f7f7f5',
  border: '#d0d0cf',
  ink: '#0f0f0f',
  onInk: '#ffffff',
  inkSoft: '#4b4b49',
  muted: '#6b6b68',
  mutedSoft: '#4b4b49',
  accent: '#c6d040',
  button: '#c6d040',
  onButton: '#0f0f0f',
};

// Non-breaking spaces keep the number on one line in narrow mail clients.
const phone = '+31\u00a06\u00a0133\u00a0658\u00a040';
const footer = `Rescue Watercraft B.V. · Bellefleurstraat 32 · 6515\u00a0BJ Nijmegen · ${phone}`;

const translations: Record<'nl' | 'en' | 'de', ConfirmationEmailCopy> = {
  nl: {
    subject: 'Uw aanvraag is ontvangen | {siteName}',
    preheader: 'Een specialist van Rescue Watercraft neemt binnen 24 tot 48 uur contact met u op.',
    greeting: 'Beste {name},',
    greetingWithoutName: 'Beste,',
    kicker: 'Advancing Global Water Rescue',
    receiptMessage: 'Bedankt, we hebben uw aanvraag ontvangen.',
    followUpMessage: 'Een specialist van Rescue Watercraft neemt binnen 24 tot 48 uur contact met u op.',
    detailsHeading: 'Uw aanvraag',
    messageHeading: 'Uw vraag of toelichting',
    referenceLabel: 'Referentie',
    fieldLabels: { firstName: 'Voornaam', lastName: 'Achternaam', email: 'E-mailadres', phone: 'Telefoonnummer', organisation: 'Organisatie', subject: 'Onderwerp' },
    contactPrompt: `Wilt u iets toevoegen? Beantwoord deze e-mail of bel ons op ${phone}.`,
    ctaLabel: 'Naar de website',
    footerText: footer,
  },
  en: {
    subject: 'Your request has been received | {siteName}',
    preheader: 'A Rescue Watercraft specialist will contact you within 24 to 48 hours.',
    greeting: 'Dear {name},',
    greetingWithoutName: 'Hello,',
    kicker: 'Advancing Global Water Rescue',
    receiptMessage: 'Thank you, we have received your request.',
    followUpMessage: 'A Rescue Watercraft specialist will contact you within 24 to 48 hours.',
    detailsHeading: 'Your request',
    messageHeading: 'Your question or notes',
    referenceLabel: 'Reference',
    fieldLabels: { firstName: 'First name', lastName: 'Last name', email: 'Email address', phone: 'Phone number', organisation: 'Organisation', subject: 'Subject' },
    contactPrompt: `Anything to add? Reply to this email or call us on ${phone}.`,
    ctaLabel: 'Visit the website',
    footerText: footer,
  },
  de: {
    subject: 'Ihre Anfrage ist eingegangen | {siteName}',
    preheader: 'Ein Spezialist von Rescue Watercraft meldet sich innerhalb von 24 bis 48 Stunden bei Ihnen.',
    greeting: 'Guten Tag {name},',
    greetingWithoutName: 'Guten Tag,',
    kicker: 'Advancing Global Water Rescue',
    receiptMessage: 'Vielen Dank, wir haben Ihre Anfrage erhalten.',
    followUpMessage: 'Ein Spezialist von Rescue Watercraft meldet sich innerhalb von 24 bis 48 Stunden bei Ihnen.',
    detailsHeading: 'Ihre Anfrage',
    messageHeading: 'Ihre Frage oder Anmerkungen',
    referenceLabel: 'Referenz',
    fieldLabels: { firstName: 'Vorname', lastName: 'Nachname', email: 'E-Mail-Adresse', phone: 'Telefonnummer', organisation: 'Organisation', subject: 'Betreff' },
    contactPrompt: `Möchten Sie etwas ergänzen? Antworten Sie auf diese E-Mail oder rufen Sie uns an: ${phone}.`,
    ctaLabel: 'Zur Website',
    footerText: footer,
  },
};

/**
 * Built per origin, so the logo and the website button point at the host that served
 * the form: the concept host today, rescuewatercraft.eu from go-live, with no edit.
 * No `contactEmail`: replies go to LEAD_RECIPIENT via reply-to, which is our inbox
 * until the client's own address takes over.
 */
export function confirmationEmail(origin: string, lang: 'nl' | 'en' | 'de', defaultLang: 'nl' | 'en' | 'de'): LocalizedConfirmationEmailConfig {
  return {
    defaultLocale: lang,
    translations,
    brand: {
      logoUrl: `${origin}/images/mail-logo.png`,
      logoAlt: 'Rescue Watercraft',
      logoWidth: 260,
      websiteUrl: `${origin}${lang === defaultLang ? '/' : `/${lang}`}`,
      colors,
    },
  };
}
