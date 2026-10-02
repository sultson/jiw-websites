import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die de aanvrager terugkrijgt, in zijn eigen merk.
 *
 * Tot nu toe ging die eruit in de standaardkleuren van het pakket (marineblauw met
 * goud) en in de standaardwoorden. Dat is de eerste mail die iemand van dit bedrijf
 * krijgt, vaak binnen een minuut na het versturen, en hij hoort eruit te zien alsof
 * Yanis hem stuurde en niet een formulier.
 *
 * Twee dingen sturen alles hier. Hij moet eruitzien als het merk, en hij moet
 * ongehinderd door Outlook en Gmail komen. Voor dat tweede: geen scripts, geen
 * webfonts (Barlow Condensed en Manrope bestaan niet in een mailprogramma, dus de
 * mail is bewust Arial en doet niet alsof), geen achtergrondafbeeldingen, geen knop
 * die alleen een plaatje is, en een echte platte-tekstversie ernaast. Het logo is
 * een PNG en geen SVG: Outlook op Windows toont geen SVG, en de achtergrond zit in
 * het bestand gebakken zodat de donkere modus van een mailprogramma het navy niet
 * op navy kan zetten.
 *
 * Onderaan staan adres en KvK. Een zakelijke afzender die niet zegt wie hij is leest
 * voor een spamfilter als een afzender die dat liever niet vertelt.
 */

/* Zijn eigen gegevens. Dezelfde opgave als in bouw.mjs (Alfred, 02-10-2026); daar
   dragen ze de voet, de contactpagina en de structured data. Staan hier apart omdat
   bouw.mjs een bouwscript is dat bij importeren meteen gaat bouwen, en een worker
   die dat importeert bouwt de site bij elk verzoek. */
const SITE_URL = 'https://yanisklussenbedrijf.nl';
const TEL_TOON = '06 11 41 67 36';
const ADRES = 'Kromhoutlaan 3, 2033 WJ Haarlem';
const KVK = '91589924';

/**
 * Het logo als PNG, 480 breed voor een weergave van 240, dus scherp op een retina.
 * Gemaakt uit src/merk/yanis-logo.svg, platgeslagen op koel wit. bouw.mjs valt om
 * als het bestand niet in de build zit: een bevestiging met een leeg vak bovenaan
 * is erger dan geen logo.
 */
export const EMAIL_LOGO_PAD = '/merk/yanis-logo-email.png';
const EMAIL_LOGO_BREEDTE = 240;

const NL: ConfirmationEmailCopy = {
  subject: 'Uw offerteaanvraag is binnen - {siteName}',
  preheader: 'Wij hebben uw aanvraag ontvangen en nemen snel contact met u op voor een afspraak op locatie.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Offerteaanvraag',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  followUpMessage:
    'Wij nemen snel contact met u op om uw aanvraag door te nemen en een opname op locatie in te plannen. Daar zien wij wat er precies moet gebeuren, en daarna krijgt u een prijs op papier. Dit is een aanvraag en nog geen opdracht: u zit nergens aan vast.',
  detailsHeading: 'Uw aanvraag',
  messageHeading: 'Uw omschrijving',
  referenceLabel: 'Kenmerk',
  /* De namen van de velden zoals ze in het formulier staan. firstName, lastName en
     email zijn de ingebouwde velden van het pakket; die namen kunnen geen Nederlands
     zijn, de labels eromheen wel. */
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    adres: 'Adres van het pand',
    pand: 'Soort pand',
    werk: 'Waar het over gaat',
  },
  contactPrompt: `Wilt u er iets aan toevoegen? Beantwoord deze mail, of bel ons op ${TEL_TOON}.`,
  ctaLabel: 'Terug naar de website',
  footerText: `Yanis Klussenbedrijf, ${ADRES}. KvK ${KVK}. Werkgebied Amsterdam, Haarlem en heel Noord-Holland. U ontvangt deze mail omdat u een offerte aanvroeg op onze website.`,
};

/* Dezelfde mail voor wie het formulier op /en invulde. De labels van de velden staan
   in de lead-mail aan ons in het Nederlands — die lezen wij — maar wat de aanvrager
   terugkrijgt hoort in zijn eigen taal te staan. */
const EN: ConfirmationEmailCopy = {
  subject: 'Your request has been received - {siteName}',
  preheader: 'We have received your request and will be in touch shortly to arrange a survey on site.',
  greeting: 'Dear {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Quote request',
  receiptMessage: 'Your request has reached us',
  followUpMessage:
    'We will be in touch shortly to go through your request and book in a survey on site. That is where we see exactly what needs doing, and you get a price in writing afterwards. This is a request and not yet an order: you are not committed to anything.',
  detailsHeading: 'Your request',
  messageHeading: 'Your description',
  referenceLabel: 'Reference',
  fieldLabels: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    telefoon: 'Phone',
    adres: 'Address of the property',
    pand: 'Type of property',
    werk: 'What it is about',
  },
  contactPrompt: `Would you like to add something? Reply to this email, or call us on ${TEL_TOON}.`,
  ctaLabel: 'Back to the website',
  footerText: `Yanis Klussenbedrijf, ${ADRES}. Chamber of Commerce ${KVK}. We work in Amsterdam, Haarlem and across Noord-Holland. You are receiving this email because you requested a quote on our website.`,
};

const VERTALINGEN = { nl: NL, en: EN };

/**
 * De kleuren uit de merkhandleiding, met dezelfde regel als op de site: oranje haalt
 * op koel wit maar 2,65:1 en kan dus geen tekst dragen. Daarom is de knop een oranje
 * vlak met navy letters (4,83:1) in plaats van wit, en draagt oranje verder alleen
 * de streep bovenaan, het opschrift op het navy vlak (4,83:1) en het randje langs de
 * geciteerde omschrijving.
 */
const KLEUREN = {
  pageBackground: '#e7edf3',
  surface: '#ffffff',
  surfaceAlt: '#f4f6f8',
  border: '#dbe2ea',
  ink: '#142d4e',
  onInk: '#ffffff',
  inkSoft: '#3a4a63',
  muted: '#55657c',
  mutedSoft: '#4a5a73',
  accent: '#f27435',
  button: '#f27435',
  onButton: '#142d4e',
};

/* Geen contactEmail. De leads gaan nu naar het privé-gmail van de eigenaar, en dat
   is geen adres om in een mail van het bedrijf aan zijn eigen klant af te drukken.
   De bevestiging draagt wel een reply-to naar LEAD_RECIPIENT, dus "beantwoord deze
   mail" komt bij hem uit. Krijgt hij een adres op het eigen domein, dan komt dat
   hier en in LEAD_RECIPIENT tegelijk. */
export const yanisConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: VERTALINGEN,
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PAD}`,
    logoAlt: 'Yanis Klussenbedrijf',
    logoWidth: EMAIL_LOGO_BREEDTE,
    websiteUrl: SITE_URL,
    colors: KLEUREN,
  },
};

/* Het Engelse endpoint is een eigen worker, dus de taal hoeft niet uit een verborgen
   veld in het formulier te komen: het adres waar de aanvraag op binnenkomt bepaalt
   hem al. Beide talen zitten in beide, zodat er niets omvalt als er ooit alsnog een
   taalveld wordt meegestuurd. */
export const yanisConfirmationEmailEn: LocalizedConfirmationEmailConfig = {
  ...yanisConfirmationEmail,
  defaultLocale: 'en',
};
