import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * The confirmation a buyer gets back after sending the enquiry form, in JASM's own
 * brand and in the language they were reading the site in.
 *
 * Until this site moved into the monorepo the form had no backend: it opened the
 * visitor's own mail client with a prefilled message, so nothing was ever confirmed
 * and nothing was ever stored. This is the first mail anyone receives from JASM, and
 * the audience is professional flower buyers in Europe and the Middle East deciding
 * whether a Kenyan exporter they have never dealt with is worth a trial order. It has
 * to look like it came from the business, not from a form.
 *
 * Shaped by two constraints. It carries the brand, and it has to reach an inbox
 * unmangled: no scripts, no webfonts (Instrument Serif and Satoshi do not exist in a
 * mail client, so this mail is Arial and does not pretend otherwise), no background
 * images, a button that is a real filled cell with text in it, and a plain-text part
 * alongside. The logo is a flat PNG with the cream baked in; see tools/gen-mail-logo.mjs.
 *
 * What this mail deliberately does NOT say:
 *
 * - Any quote turnaround. "A written price inside one working day" was on this site
 *   in four places until the client took it out on 30-09-2026. It is not going back in
 *   through the mail nobody reviewed.
 * - Any delivery or transit time. Same instruction, same date.
 * - Any certification. The client has been asked three times which they hold and has
 *   not answered.
 *
 * What it does promise is only what the contact page already promises, which is a
 * written quotation per line with stem length, bunch spec, box count, FOB Nairobi
 * price and the freight rate. That is a deliverable rather than a deadline, so it
 * survives the client's own note about not publishing what cannot be guaranteed.
 */

const SITE_URL = 'https://jasmflowers.jouwidealewebsite.nl';
const PHONE = '+254 710 693 400';

/** 480 wide for a rendered 240, so it stays sharp on a retina screen. */
const LOGO_URL = `${SITE_URL}/mail/jasm-flowers-email.png`;
const LOGO_WIDTH = 240;

/* The field labels are lifted verbatim from src/lang/nl.tsv and de.tsv, which is
   what the form itself shows. A buyer who filled in "Steellengte / specificatie"
   should read those same words back, not a second translation of the same idea. */

const EN: ConfirmationEmailCopy = {
  subject: 'We have your enquiry - {siteName}',
  preheader: 'Your enquiry is with us. We are checking availability with our growing partners.',
  greeting: 'Dear {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Buyer enquiry',
  receiptMessage: 'Your enquiry is with us',
  followUpMessage:
    'We check availability with our growing partners and come back to you with a written quotation for the lines you asked about, with stem length, bunch specification, box count, the FOB Nairobi price and the freight rate for your shipment. If something in your requirements is easier to settle by phone, we will call you.',
  detailsHeading: 'What you sent us',
  messageHeading: 'Your message',
  referenceLabel: 'Reference',
  fieldLabels: {
    firstName: 'Name',
    email: 'Email',
    company: 'Company',
    country: 'Country',
    phone: 'Phone or WhatsApp',
    flowers: 'Flowers required',
    volume: 'Estimated quantity',
    spec: 'Stem length / specification',
    dest: 'Delivery destination',
    freq: 'Shipment frequency',
  },
  contactPrompt: `Anything to add to your enquiry? Reply to this email, or call us on ${PHONE}.`,
  ctaLabel: 'Back to the website',
  footerText: `JASM Flowers Ltd, Airport North Road, P.O. Box 5212-100, Nairobi, Kenya. You received this email because you sent an enquiry on jasmflowers.jouwidealewebsite.nl.`,
};

const NL: ConfirmationEmailCopy = {
  subject: 'Wij hebben uw aanvraag ontvangen - {siteName}',
  preheader: 'Uw aanvraag is bij ons binnen. Wij controleren de beschikbaarheid bij onze telerspartners.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Inkoopaanvraag',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  followUpMessage:
    'Wij controleren de beschikbaarheid bij onze telerspartners en komen bij u terug met een schriftelijke offerte voor de door u gevraagde regels, met steellengte, bunchspecificatie, aantal dozen, de prijs FOB Nairobi en het vrachttarief voor uw zending. Is iets in uw wensen telefonisch sneller te regelen, dan bellen wij u.',
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Uw bericht',
  referenceLabel: 'Kenmerk',
  fieldLabels: {
    firstName: 'Naam',
    email: 'E-mail',
    company: 'Bedrijf',
    country: 'Land',
    phone: 'Telefoon of WhatsApp',
    flowers: 'Gewenste bloemen',
    volume: 'Geschatte hoeveelheid',
    spec: 'Steellengte / specificatie',
    dest: 'Afleverbestemming',
    freq: 'Verzendfrequentie',
  },
  contactPrompt: `Wilt u iets aan uw aanvraag toevoegen? Antwoord op deze mail, of bel ons op ${PHONE}.`,
  ctaLabel: 'Terug naar de website',
  footerText: `JASM Flowers Ltd, Airport North Road, P.O. Box 5212-100, Nairobi, Kenia. U ontvangt deze mail omdat u een aanvraag heeft verstuurd op jasmflowers.jouwidealewebsite.nl.`,
};

const DE: ConfirmationEmailCopy = {
  subject: 'Wir haben Ihre Anfrage erhalten - {siteName}',
  preheader: 'Ihre Anfrage liegt bei uns. Wir prüfen die Verfügbarkeit bei unseren Anbaupartnern.',
  greeting: 'Guten Tag {name},',
  greetingWithoutName: 'Guten Tag,',
  kicker: 'Einkaufsanfrage',
  receiptMessage: 'Ihre Anfrage liegt bei uns',
  followUpMessage:
    'Wir prüfen die Verfügbarkeit bei unseren Anbaupartnern und melden uns mit einem schriftlichen Angebot für die von Ihnen angefragten Positionen, mit Stiellänge, Bundspezifikation, Anzahl der Kartons, dem Preis FOB Nairobi und der Frachtrate für Ihre Sendung. Lässt sich etwas an Ihren Anforderungen telefonisch schneller klären, rufen wir Sie an.',
  detailsHeading: 'Ihre Angaben',
  messageHeading: 'Ihre Nachricht',
  referenceLabel: 'Referenz',
  fieldLabels: {
    firstName: 'Name',
    email: 'E-Mail',
    company: 'Firma',
    country: 'Land',
    phone: 'Telefon oder WhatsApp',
    flowers: 'Benötigte Blumen',
    volume: 'Geschätzte Menge',
    spec: 'Stiellänge / Spezifikation',
    dest: 'Lieferziel',
    freq: 'Versandfrequenz',
  },
  contactPrompt: `Möchten Sie Ihrer Anfrage etwas hinzufügen? Antworten Sie auf diese E-Mail, oder rufen Sie uns an unter ${PHONE}.`,
  ctaLabel: 'Zurück zur Website',
  footerText: `JASM Flowers Ltd, Airport North Road, P.O. Box 5212-100, Nairobi, Kenia. Sie erhalten diese E-Mail, weil Sie auf jasmflowers.jouwidealewebsite.nl eine Anfrage gesendet haben.`,
};

/**
 * The site's own palette, from the custom properties at the top of src/styles.css:
 * the deep green it uses for every dark band, paper and sand for the light panels,
 * and the gold as the only accent.
 *
 * Two values are deliberately NOT the site's own. `muted` and `accent` had to be
 * darkened: --sage (#8A9189) holds 3.2:1 on white and the gold (#8A7550) is darker
 * still against the green band, both under the 4.5:1 that small text needs. A mail
 * is read once, often on a phone in daylight, and there is no stylesheet to fix it
 * afterwards. Measured against this palette: gold on green 5.0:1, muted on white
 * 4.8:1, body copy on white 7.7:1, everything on the green band 16.6:1.
 */
const COLORS = {
  pageBackground: '#EDE9E1',
  surface: '#ffffff',
  surfaceAlt: '#F7F5F1',
  border: '#DFDACF',
  ink: '#15211B',
  onInk: '#ffffff',
  inkSoft: '#4A554E',
  muted: '#6B7570',
  mutedSoft: '#4A554E',
  accent: '#A08A5E',
  button: '#15211B',
  onButton: '#ffffff',
};

export const jasmConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'en',
  translations: { en: EN, nl: NL, de: DE },
  brand: {
    logoUrl: LOGO_URL,
    logoAlt: 'JASM Flowers',
    logoWidth: LOGO_WIDTH,
    wordmark: 'JASM Flowers',
    websiteUrl: SITE_URL,
    // Deliberately no contactEmail. Enquiries land in hallo@jouwidealewebsite.nl
    // for now, and printing that address in JASM's own mail to their buyer would put
    // our brand in it. The mail already carries a reply-to pointing there, so
    // "reply to this email, or call us" is true as written.
    colors: COLORS,
  },
};
