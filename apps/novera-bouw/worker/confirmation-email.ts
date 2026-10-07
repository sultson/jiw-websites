import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die de aanvrager terugkrijgt, in het merk van Novera Bouw.
 *
 * Dit is de eerste mail die iemand van dit bedrijf krijgt, meestal binnen een minuut
 * na het versturen. Hij hoort eruit te zien alsof Ekrem hem stuurde en niet alsof een
 * formulier iets terugkaatst.
 *
 * Twee dingen sturen alles hier. Hij moet eruitzien als het merk, en hij moet
 * ongehinderd door Outlook en Gmail komen. Voor dat tweede: geen scripts, geen
 * webfonts (Plus Jakarta Sans en Inter bestaan niet in een mailprogramma, dus de mail
 * is bewust Arial en doet niet alsof), geen achtergrondafbeeldingen, geen knop die
 * alleen een plaatje is. Het logo is een PNG en geen SVG: Outlook op Windows toont
 * geen SVG, en de chalk-achtergrond zit in het bestand gebakken zodat de donkere
 * modus van een mailprogramma het navy woordmerk niet op navy kan zetten.
 *
 * Onderaan staan adres en KvK. Een zakelijke afzender die niet zegt wie hij is leest
 * voor een spamfilter als een afzender die dat liever niet vertelt.
 */

/* Dezelfde opgave als in bouw.mjs en in pagina/_schil.html, waar ze de voet, de
   contactpagina en de structured data dragen. Ze staan hier apart omdat bouw.mjs een
   bouwscript is dat bij importeren meteen gaat bouwen — een worker die dat importeert
   zou de site bij elk verzoek opnieuw bouwen. */
const SITE_URL = 'https://noverabouw.nl';
/* Hetzelfde adres als LEAD_RECIPIENT in wrangler.jsonc — zie de opmerking bij brand. */
const MAIL = 'info@noverabouw.nl';
const TEL_TOON = '06 48 56 90 40';
const ADRES = 'Albertine Agneslaan 350, 3136 NJ Vlaardingen';
const KVK = '83882057';

/**
 * Het logo als PNG, 480 breed voor een weergave van 240, dus scherp op een retina.
 * Gemaakt uit src/img/merk/novera-horizontal-primary.svg met _ref/maak-mailbeeld.mjs,
 * platgeslagen op chalk.
 */
const EMAIL_LOGO_PAD = '/img/merk/novera-logo-email.png';
const EMAIL_LOGO_BREEDTE = 240;

const NL: ConfirmationEmailCopy = {
  subject: 'Uw offerteaanvraag is binnen - {siteName}',
  preheader: 'Wij hebben uw aanvraag ontvangen en nemen snel contact met u op om te komen kijken.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Offerteaanvraag',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  followUpMessage:
    'Wij bellen u snel om uw aanvraag door te nemen en een moment af te spreken om te komen kijken. Daar zien wij wat er precies moet gebeuren, en daarna krijgt u een prijs op papier. Dit is een aanvraag en nog geen opdracht: u zit nergens aan vast.',
  detailsHeading: 'Uw aanvraag',
  messageHeading: 'Uw toelichting',
  referenceLabel: 'Kenmerk',
  /* De namen van de velden zoals ze in het formulier staan. firstName, lastName en
     email zijn de ingebouwde velden van het pakket; die namen kunnen geen Nederlands
     zijn, de labels eromheen wel. */
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    postcode: 'Postcode',
    plaats: 'Plaats',
    werk: 'Waar het over gaat',
    materiaal: 'Materiaal via onze inkoop',
    materiaal_item: 'Uit onze lijst',
  },
  /* Loopt bewust open af: het pakket zet brand.contactEmail erachter als klikbaar
     adres. Zet je contactEmail weg, maak hier dan weer een hele zin van. */
  contactPrompt: `Wilt u er iets aan toevoegen? Beantwoord deze mail, bel ons op ${TEL_TOON}, of mail naar`,
  ctaLabel: 'Terug naar de website',
  footerText: `Novera Bouw, ${ADRES}. KvK ${KVK}. U ontvangt deze mail omdat u een offerte aanvroeg op onze website.`,
};

/* Dezelfde mail voor wie het formulier op /en invulde. De labels in de lead-mail aan
   ons blijven Nederlands — die lezen wij — maar wat de aanvrager terugkrijgt hoort in
   zijn eigen taal te staan. */
const EN: ConfirmationEmailCopy = {
  subject: 'Your request has been received - {siteName}',
  preheader: 'We have received your request and will be in touch shortly to come and take a look.',
  greeting: 'Dear {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Quote request',
  receiptMessage: 'Your request has reached us',
  followUpMessage:
    'We will call you shortly to go through your request and arrange a time to come and take a look. That is where we see exactly what needs doing, and you get a price in writing afterwards. This is a request and not yet an order: you are not committed to anything.',
  detailsHeading: 'Your request',
  messageHeading: 'Your description',
  referenceLabel: 'Reference',
  fieldLabels: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    telefoon: 'Phone',
    postcode: 'Postcode',
    plaats: 'Town',
    werk: 'What it is about',
    materiaal: 'Materials through us',
    materiaal_item: 'From our range',
  },
  contactPrompt: `Would you like to add something? Reply to this email, call us on ${TEL_TOON}, or write to`,
  ctaLabel: 'Back to the website',
  footerText: `Novera Bouw, ${ADRES}. Chamber of Commerce ${KVK}. You are receiving this email because you requested a quote on our website.`,
};

const VERTALINGEN = { nl: NL, en: EN };

/**
 * De vijf kleuren uit de merkhandleiding (_ref/branding-kit/guidelines/palette.json),
 * met dezelfde regel als op de site: copper haalt op wit maar 3,38:1 en kan dus geen
 * witte tekst dragen. Daarom is de knop een koperen vlak met navy letters (4,53:1),
 * en draagt copper verder alleen het opschrift op het navy vlak (4,53:1) en de
 * hairlines.
 */
const KLEUREN = {
  pageBackground: '#F7F3EC', // chalk
  surface: '#ffffff',
  surfaceAlt: '#FBF9F5',
  border: '#E6DFD4',
  ink: '#182339', // navy
  onInk: '#ffffff',
  inkSoft: '#3A4455',
  muted: '#56616D', // slate
  mutedSoft: '#4A5462',
  accent: '#C47A43', // copper
  button: '#C47A43',
  onButton: '#182339',
};

/* contactEmail staat er wél, anders dan bij Yanis. Dit is een adres op Novera's eigen
   domein en niet een privé-gmail of een adres van ons, dus het hoort thuis in een mail
   van Novera aan zijn eigen klant: het staat achter "beantwoord deze mail of bel ons"
   als klikbaar mailadres. Hetzelfde adres is LEAD_RECIPIENT in wrangler.jsonc, en het
   pakket zet LEAD_RECIPIENT als reply-to op deze bevestiging — wat de aanvrager ziet en
   waar een antwoord heen gaat is dus één adres. Wijzigt het, wijzig het op beide
   plekken, anders drukt de mail een ander adres af dan waar hij op terugkomt. */
export const noveraConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: VERTALINGEN,
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PAD}`,
    logoAlt: 'Novera Bouw',
    logoWidth: EMAIL_LOGO_BREEDTE,
    websiteUrl: SITE_URL,
    contactEmail: MAIL,
    colors: KLEUREN,
  },
};

/* Het Engelse endpoint is een eigen worker, dus de taal hoeft niet uit een verborgen
   veld te komen: het adres waar de aanvraag binnenkomt bepaalt hem al. Beide talen
   zitten in beide, zodat er niets omvalt als er ooit alsnog een taalveld meekomt. */
export const noveraConfirmationEmailEn: LocalizedConfirmationEmailConfig = {
  ...noveraConfirmationEmail,
  defaultLocale: 'en',
};
