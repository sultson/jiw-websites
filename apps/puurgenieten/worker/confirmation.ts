import type { ConfirmationEmailBrand, ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die een bezoeker terugkrijgt na zijn aanmelding, in het merk van
 * Puur Genieten en in de taal van de pagina die hij invulde.
 *
 * Tekst: overgenomen van de Puur Genieten-bevestiging op framemedia.tv
 * (apps/framemedia/worker/confirmation.ts, PG_NL/EN/DE). Dat is hetzelfde
 * formulier met dezelfde belofte, dus een tweede formulering zou alleen een
 * tweede versie van dezelfde afspraak zijn. Wat anders is: het merk (het rondje
 * van Puur Genieten in plaats van het FRAME MEDIA-woordmerk), de kleuren, de
 * voetregel en het adres onder de prompt.
 *
 * Hij moet ongeschonden in een postvak aankomen: geen script, geen webfont, geen
 * achtergrondfoto, een knop die een gevuld vakje met tekst is, en een
 * platte-tekstversie ernaast (die maakt het pakket).
 *
 * De site is donker, deze mail niet: een donkere mailkaart wordt door een deel
 * van de mailprogramma's zelf nog eens omgekeerd. Dus een lichte, warme kaart,
 * de inktkleur van de site als band, het oranje uit het logo als accent op die
 * band en het rood van de Aanmelden-knop op de site als knop. Gemeten met
 * tools/preview-mail.mjs --contrast (zie LEESMIJ.md voor de getallen).
 *
 * Wat deze mail bewust NIET zegt, om dezelfde redenen als op framemedia.tv:
 * geen bedrag (een prijs in een mail is een aanbod), geen uitzenddatum, en geen
 * presentatrice bij naam (Roxanna/Roxana staat in de brochure twee keer anders).
 */

const SITE_URL = 'https://puurgenieten.tv';
const TEL = '06 3486 1375';

/** 240 breed voor een weergave op 120: scherp op een retina-scherm. tools/gen-beeld.mjs. */
const LOGO_URL = `${SITE_URL}/assets/mail/puurgenieten-email.png`;

/* Puur Genieten is een programma van FRAME MEDIA, dus de wettelijke afzender is
   hun bedrijf, zoals het ook in de voet van de site staat. */
const VOET_NL = 'Puur Genieten is een productie van FRAME MEDIA (Frame Productions & Management), John Blankensteinstraat 23 A, 1095 MB Amsterdam. KvK 85865346. U ontvangt deze mail omdat u zich heeft aangemeld op puurgenieten.tv.';
const VOET_EN = 'Puur Genieten is produced by FRAME MEDIA (Frame Productions & Management), John Blankensteinstraat 23 A, 1095 MB Amsterdam, the Netherlands. Chamber of Commerce 85865346. You received this email because you applied on puurgenieten.tv.';
const VOET_DE = 'Puur Genieten ist eine Produktion von FRAME MEDIA (Frame Productions & Management), John Blankensteinstraat 23 A, 1095 MB Amsterdam, Niederlande. Handelsregister 85865346. Sie erhalten diese E-Mail, weil Sie sich auf puurgenieten.tv angemeldet haben.';

/**
 * Het palet. Inkt en rood komen uit style.css (--inkt, --rood-vast), het oranje
 * uit het logo zelf (gemeten op bron/puur-genieten-logo-2048.png, het meest
 * voorkomende oranje is #e06020; dit is de lichtere toon uit de rand van het
 * rondje, want op de donkere band moet hij leesbaar zijn). Het warme grijs is de
 * lichte tegenhanger van de creme letters in het logo.
 */
export const COLORS = {
  pageBackground: '#F5F0EA',
  surface: '#ffffff',
  surfaceAlt: '#FBF8F4',
  border: '#E6DDD2',
  ink: '#0d1117',
  onInk: '#ffffff',
  inkSoft: '#2A333D',
  muted: '#5E6670',
  mutedSoft: '#454D57',
  accent: '#F0883E',
  button: '#bf2027',
  onButton: '#ffffff',
};

const BRAND: ConfirmationEmailBrand = {
  logoUrl: LOGO_URL,
  logoAlt: 'Puur Genieten',
  logoWidth: 120,
  wordmark: 'Puur Genieten',
  websiteUrl: SITE_URL,
  // Het adres dat op de site zelf staat (Armando, 10-11-2026). De reply-to van
  // deze mail is LEAD_RECIPIENT, en dat is nu nog ons eigen postvak.
  contactEmail: 'info@puurgenieten.tv',
  colors: COLORS,
};

/* De veldnamen die de bezoeker op de pagina zag, woordelijk. */
const VELDEN_NL = { firstName: 'Contactpersoon', email: 'E-mail', bedrijf: 'Bedrijfsnaam', tel: 'Telefoonnummer', branche: 'Branche' };
const VELDEN_EN = { firstName: 'Contact person', email: 'Email', bedrijf: 'Company name', tel: 'Phone number', branche: 'Sector' };
const VELDEN_DE = { firstName: 'Ansprechpartner', email: 'E-Mail', bedrijf: 'Firmenname', tel: 'Telefonnummer', branche: 'Branche' };

const NL: ConfirmationEmailCopy = {
  subject: 'Uw aanmelding voor Puur Genieten is binnen',
  preheader: 'Uw aanmelding is bij ons binnen. Wij reageren binnen een werkdag.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Aanmelding Puur Genieten',
  receiptMessage: 'Uw aanmelding is bij ons binnen',
  followUpMessage:
    'Wij nemen binnen een werkdag contact met u op om door te nemen wat er bij u te filmen valt en wat het item zou moeten vertellen. Aan dat eerste gesprek zitten geen kosten en geen verplichtingen.',
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Uw bericht',
  referenceLabel: 'Kenmerk',
  fieldLabels: VELDEN_NL,
  contactPrompt: `Wilt u iets toevoegen? Antwoord op deze mail, of bel ons op ${TEL}.`,
  ctaLabel: 'Terug naar Puur Genieten',
  footerText: VOET_NL,
};

const EN: ConfirmationEmailCopy = {
  subject: 'Your application for Puur Genieten is in',
  preheader: 'Your application is with us. We reply within one working day.',
  greeting: 'Dear {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Application Puur Genieten',
  receiptMessage: 'Your application is with us',
  followUpMessage:
    'We contact you within one working day to go through what there is to film at your company and what the item should tell. That first conversation carries no cost and no obligation.',
  detailsHeading: 'What you sent us',
  messageHeading: 'Your message',
  referenceLabel: 'Reference',
  fieldLabels: VELDEN_EN,
  contactPrompt: `Anything to add? Reply to this email, or call us on ${TEL}.`,
  ctaLabel: 'Back to Puur Genieten',
  footerText: VOET_EN,
};

const DE: ConfirmationEmailCopy = {
  subject: 'Ihre Anmeldung für Puur Genieten ist eingegangen',
  preheader: 'Ihre Anmeldung liegt bei uns. Wir antworten innerhalb eines Werktags.',
  greeting: 'Guten Tag {name},',
  greetingWithoutName: 'Guten Tag,',
  kicker: 'Anmeldung Puur Genieten',
  receiptMessage: 'Ihre Anmeldung liegt bei uns',
  followUpMessage:
    'Wir melden uns innerhalb eines Werktags bei Ihnen, um zu besprechen, was es bei Ihnen zu filmen gibt und was der Beitrag erzählen soll. Das erste Gespräch ist kostenlos und unverbindlich.',
  detailsHeading: 'Ihre Angaben',
  messageHeading: 'Ihre Nachricht',
  referenceLabel: 'Referenz',
  fieldLabels: VELDEN_DE,
  contactPrompt: `Möchten Sie etwas ergänzen? Antworten Sie auf diese E-Mail, oder rufen Sie uns an unter ${TEL}.`,
  ctaLabel: 'Zurück zu Puur Genieten',
  footerText: VOET_DE,
};

export const puurGenietenConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: { nl: NL, en: EN, de: DE },
  brand: BRAND,
  // Het formulier heeft geen tekstvak, dus geen blok 'Uw bericht' met een streepje.
  includeMessage: false,
};
