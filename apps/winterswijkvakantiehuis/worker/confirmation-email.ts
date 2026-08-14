import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';
import {
  BRAND_COLORS,
  CONTACT_EMAIL,
  EMAIL_LOGO_PATH,
  EMAIL_LOGO_WIDTH,
  SITE_URL,
} from '../src/site.ts';

/* The site runs in Dutch, English and German and defaults to Dutch, so the
   guest confirmation follows whichever language the form was filled in — the
   client sends it along as `__jiw_confirmation_locale`. The lead notification
   to JIW stays Dutch (see worker/index.ts). */
export const CONFIRMATION_LOCALES = ['en', 'nl', 'de'] as const;

type ConfirmationLocale = (typeof CONFIRMATION_LOCALES)[number];
type ConfirmationField =
  | 'firstName'
  | 'lastName'
  | 'email'
  | 'dates'
  | 'guests'
  | 'pets'
  | 'kids'
  | 'wheelchair';

type Copy = Omit<ConfirmationEmailCopy, 'fieldLabels'> & {
  fieldLabels: Record<ConfirmationField, string>;
};

const translations = {
  en: {
    subject: 'We received your request - {siteName}',
    preheader: 'Thank you for your message. We will get back to you shortly.',
    greeting: 'Dear {name},',
    receiptMessage: 'Thank you for your message to {siteName}.',
    followUpMessage: 'We will get back to you personally, usually the same day, with availability and everything you need to know about the homes.',
    detailsHeading: 'Your request',
    messageHeading: 'Your message',
    referenceLabel: 'Reference',
    fieldLabels: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      dates: 'Preferred dates',
      guests: 'Number of guests',
      pets: 'Bringing pets',
      kids: 'Bringing children',
      wheelchair: 'Wheelchair or aids needed',
    },
    contactPrompt: 'A question in the meantime? Reply to this email or contact us at',
    ctaLabel: 'Back to the website',
    footerText: 'Winterswijk Vakantiehuis, personally managed holiday homes in Winterswijk and the Achterhoek.',
  },
  nl: {
    subject: 'Wij hebben uw aanvraag ontvangen - {siteName}',
    preheader: 'Dank u voor uw bericht. Wij nemen snel contact met u op.',
    greeting: 'Beste {name},',
    receiptMessage: 'Dank u voor uw bericht aan {siteName}.',
    followUpMessage: 'Wij nemen persoonlijk contact met u op, meestal nog dezelfde dag, met de beschikbaarheid en alles wat u over de huizen wilt weten.',
    detailsHeading: 'Uw aanvraag',
    messageHeading: 'Uw bericht',
    referenceLabel: 'Referentie',
    fieldLabels: {
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      email: 'E-mailadres',
      dates: 'Gewenste periode',
      guests: 'Aantal personen',
      pets: 'Huisdieren mee',
      kids: 'Kinderen mee',
      wheelchair: 'Rolstoel of hulpmiddel nodig',
    },
    contactPrompt: 'Heeft u intussen een vraag? Beantwoord deze e-mail of neem contact op via',
    ctaLabel: 'Terug naar de website',
    footerText: 'Winterswijk Vakantiehuis, persoonlijk beheerde vakantiehuizen in Winterswijk en de Achterhoek.',
  },
  de: {
    subject: 'Wir haben Ihre Anfrage erhalten - {siteName}',
    preheader: 'Vielen Dank für Ihre Nachricht. Wir melden uns in Kürze bei Ihnen.',
    greeting: 'Guten Tag {name},',
    receiptMessage: 'Vielen Dank für Ihre Nachricht an {siteName}.',
    followUpMessage: 'Wir melden uns persönlich bei Ihnen, meist noch am selben Tag, mit der Verfügbarkeit und allem, was Sie über die Häuser wissen möchten.',
    detailsHeading: 'Ihre Anfrage',
    messageHeading: 'Ihre Nachricht',
    referenceLabel: 'Referenz',
    fieldLabels: {
      firstName: 'Vorname',
      lastName: 'Nachname',
      email: 'E-Mail-Adresse',
      dates: 'Wunschzeitraum',
      guests: 'Anzahl Personen',
      pets: 'Haustiere dabei',
      kids: 'Kinder dabei',
      wheelchair: 'Rollstuhl oder Hilfsmittel nötig',
    },
    contactPrompt: 'Haben Sie zwischenzeitlich eine Frage? Antworten Sie auf diese E-Mail oder schreiben Sie an',
    ctaLabel: 'Zurück zur Website',
    footerText: 'Winterswijk Vakantiehuis, persönlich betreute Ferienhäuser in Winterswijk und im Achterhoek.',
  },
} satisfies Record<ConfirmationLocale, Copy>;

export const winterswijkConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations,
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PATH}`,
    logoAlt: 'Winterswijk Vakantiehuis',
    logoWidth: EMAIL_LOGO_WIDTH,
    websiteUrl: SITE_URL,
    contactEmail: CONTACT_EMAIL,
    colors: BRAND_COLORS,
  },
};
