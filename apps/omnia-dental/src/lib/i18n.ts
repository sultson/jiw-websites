export type Lang = 'nl' | 'en';
export const LANGS: Lang[] = ['nl', 'en'];
export const DEFAULT_LANG: Lang = 'nl';

/** Resolve the active language from a page URL pathname. */
export function langFromPath(pathname: string): Lang {
  return pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'nl';
}

/** Pick the value for the active language from a localized field. */
export function pick<T>(value: { nl: T; en: T }, lang: Lang): T {
  return value[lang];
}

/* ------------------------------------------------------------------ *
 * Route map — every page keyed once, localized slug per language.
 * NL lives at the root, EN under /en/. Treatment detail pages are
 * resolved separately from treatment slugs (see data/treatments.ts).
 * ------------------------------------------------------------------ */
type RouteKey =
  | 'home'
  | 'treatments'
  | 'tarieven'
  | 'spoed'
  | 'contact'
  | 'about'
  | 'reviews'
  | 'faq'
  | 'privacy'
  | 'cookie'
  | 'terms'
  | 'conduct'
  | 'complaints';

const ROUTES: Record<RouteKey, { nl: string; en: string }> = {
  home: { nl: '/', en: '/en' },
  treatments: { nl: '/behandelingen', en: '/en/treatments' },
  tarieven: { nl: '/tarieven', en: '/en/rates' },
  spoed: { nl: '/spoed', en: '/en/emergency' },
  contact: { nl: '/contact', en: '/en/contact' },
  about: { nl: '/over-omnia-dental', en: '/en/about' },
  reviews: { nl: '/ervaringen', en: '/en/reviews' },
  faq: { nl: '/veelgestelde-vragen', en: '/en/faq' },
  privacy: { nl: '/privacyverklaring', en: '/en/privacy-policy' },
  cookie: { nl: '/cookieverklaring', en: '/en/cookie-statement' },
  terms: { nl: '/algemene-voorwaarden', en: '/en/terms' },
  conduct: { nl: '/gedragscode', en: '/en/code-of-conduct' },
  complaints: { nl: '/klachtenregeling', en: '/en/complaints' },
};

export function route(key: RouteKey, lang: Lang): string {
  return ROUTES[key][lang];
}

/** Treatment detail page path for a given (already localized) slug. */
export function treatmentPath(slug: string, lang: Lang): string {
  return lang === 'nl' ? `/behandelingen/${slug}` : `/en/treatments/${slug}`;
}

/* ------------------------------------------------------------------ *
 * UI string dictionary — chrome, CTAs, labels, form copy.
 * Page-body content lives in data/*.ts; this is the furniture.
 * ------------------------------------------------------------------ */
export const ui = {
  nl: {
    skipToContent: 'Direct naar de inhoud',
    nav: {
      treatments: 'Behandelingen',
      tarieven: 'Tarieven',
      about: 'Over ons',
      reviews: 'Ervaringen',
      faq: 'Veelgestelde vragen',
      contact: 'Contact',
      spoed: 'Spoed',
    },
    cta: {
      intake: 'Afspraak aanvragen',
      intakeShort: 'Afspraak maken',
      whatsapp: 'WhatsApp',
      call: 'Bel ons',
      callPractice: 'Bel de praktijk',
      directions: 'Route',
      allTreatments: 'Alle behandelingen',
      readMore: 'Lees meer',
      moreInfo: 'Meer over deze behandeling',
      viewTarieven: 'Bekijk de tarieven',
      planNow: 'Plan uw afspraak',
      backToTreatments: 'Terug naar behandelingen',
    },
    common: {
      phone: 'Telefoon',
      email: 'E-mail',
      address: 'Adres',
      openingHours: 'Openingstijden',
      closed: 'Gesloten',
      today: 'Vandaag',
      openNow: 'Nu geopend',
      closedNow: 'Nu gesloten',
      emergency: 'Spoed',
      newPatients: 'Nieuwe patiënten welkom',
      langName: 'Nederlands',
      otherLang: 'English',
    },
    footer: {
      practiceInfo: 'Praktijk',
      treatments: 'Behandelingen',
      service: 'Service & info',
      legal: 'Juridisch',
      hoursHeading: 'Openingstijden',
      bigLabel: 'BIG-registratie',
      kvk: 'Tandartspraktijk',
      rightsReserved: 'Alle rechten voorbehouden.',
      builtBy: 'Website door',
      disclaimerEmergency:
        'Levensbedreigende situatie? Bel direct 112.',
    },
    form: {
      firstName: 'Voornaam',
      lastName: 'Achternaam',
      email: 'E-mailadres',
      phone: 'Telefoonnummer',
      subject: 'Onderwerp',
      message: 'Uw bericht',
      preferredContact: 'Voorkeur contact',
      preferredTime: 'Voorkeur dagdeel',
      newPatient: 'Bent u al patiënt bij ons?',
      yes: 'Ja',
      no: 'Nee, ik wil mij inschrijven',
      optional: 'optioneel',
      send: 'Aanvraag versturen',
      sending: 'Versturen…',
      successTitle: 'Bedankt, uw aanvraag is verstuurd',
      successBody:
        'We hebben uw bericht ontvangen en nemen zo snel mogelijk contact met u op, meestal binnen één werkdag.',
      errorTitle: 'Er ging iets mis',
      errorBody:
        'Uw aanvraag kon niet worden verstuurd. Probeer het opnieuw of bel ons direct.',
      required: 'Dit veld is verplicht.',
      consent:
        'Door te versturen gaat u akkoord met onze privacyverklaring.',
    },
  },
  en: {
    skipToContent: 'Skip to content',
    nav: {
      treatments: 'Treatments',
      tarieven: 'Rates',
      about: 'About',
      reviews: 'Reviews',
      faq: 'FAQ',
      contact: 'Contact',
      spoed: 'Emergency',
    },
    cta: {
      intake: 'Request an appointment',
      intakeShort: 'Make an appointment',
      whatsapp: 'WhatsApp',
      call: 'Call us',
      callPractice: 'Call the practice',
      directions: 'Directions',
      allTreatments: 'All treatments',
      readMore: 'Read more',
      moreInfo: 'More about this treatment',
      viewTarieven: 'View the rates',
      planNow: 'Book your appointment',
      backToTreatments: 'Back to treatments',
    },
    common: {
      phone: 'Phone',
      email: 'Email',
      address: 'Address',
      openingHours: 'Opening hours',
      closed: 'Closed',
      today: 'Today',
      openNow: 'Open now',
      closedNow: 'Closed now',
      emergency: 'Emergency',
      newPatients: 'New patients welcome',
      langName: 'English',
      otherLang: 'Nederlands',
    },
    footer: {
      practiceInfo: 'Practice',
      treatments: 'Treatments',
      service: 'Service & info',
      legal: 'Legal',
      hoursHeading: 'Opening hours',
      bigLabel: 'BIG registration',
      kvk: 'Dental practice',
      rightsReserved: 'All rights reserved.',
      builtBy: 'Website by',
      disclaimerEmergency: 'Life-threatening situation? Call 112 immediately.',
    },
    form: {
      firstName: 'First name',
      lastName: 'Last name',
      email: 'Email address',
      phone: 'Phone number',
      subject: 'Subject',
      message: 'Your message',
      preferredContact: 'Preferred contact',
      preferredTime: 'Preferred time of day',
      newPatient: 'Are you already our patient?',
      yes: 'Yes',
      no: 'No, I would like to register',
      optional: 'optional',
      send: 'Send request',
      sending: 'Sending…',
      successTitle: 'Thank you, your request has been sent',
      successBody:
        'We have received your message and will contact you as soon as possible, usually within one business day.',
      errorTitle: 'Something went wrong',
      errorBody:
        'Your request could not be sent. Please try again or call us directly.',
      required: 'This field is required.',
      consent: 'By submitting you agree to our privacy policy.',
    },
  },
} as const;

export function t(lang: Lang) {
  return ui[lang];
}
