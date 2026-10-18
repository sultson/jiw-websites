import type { ConfirmationEmailBrand, ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die een bezoeker terugkrijgt, in de huisstijl van Velvet Cakes
 * by Anka en in de taal van de pagina die hij invulde.
 *
 * Tot deze verhuizing verstuurde het formulier niets: site.js bundelde de
 * antwoorden tot een WhatsApp-bericht en opende de chat. Dat werkte, maar het
 * liet de bezoeker met niets achter - geen kopie, geen bevestiging, en bij een
 * blokkeerde pop-up ook geen aanvraag. Dit is dus de eerste mail die iemand ooit
 * van Velvet Cakes krijgt, en de lezer is iemand die net de datum van zijn
 * bruiloft of de naam van zijn kind heeft afgegeven. Die mail moet eruitzien
 * alsof hij van haar komt en niet van een formulier.
 *
 * Twee randvoorwaarden geven hem zijn vorm. Hij draagt haar merk, en hij moet
 * ongeschonden in een postvak aankomen: geen script, geen webfont (Cormorant
 * Garamond en Parisienne bestaan niet in een mailprogramma, dus dit is Georgia
 * met Arial en doet niet anders voorkomen), geen achtergrondfoto, een knop die
 * een echt gevuld vakje met tekst is, en een platte-tekstversie ernaast.
 *
 * Over het goud, want daar zit dezelfde valkuil als op de site. Haar metallic
 * verloop loopt door tot bijna wit (#FFF2CB). Dat is schitterend op cacao en
 * volstrekt onleesbaar op creme. Een mail kan geen css-verloop op tekst dragen
 * (Outlook tekent dat niet), dus staat hier overal de massieve diepe goudtint
 * --goud-diep uit styles.css, die op wit en op creme ruim boven 4,5:1 blijft.
 *
 * Gemeten tegen dit palet: goud op wit 5,6:1, goud op de creme tint 5,2:1,
 * creme op de cacaoband 11,8:1, de knop 11,8:1, lopende tekst op wit 12,4:1 en
 * de zachtste grijze regel 5,1:1.
 *
 * Wat deze mail bewust NIET zegt:
 *
 * - Geen bedrag en geen prijsindicatie. Haar prijzen gaan per kilo en de
 *   decoratie wordt apart begroot; wat een taart kost hangt dus af van een
 *   ontwerp dat op dit moment nog niet bestaat. Een prijs in een mail is een
 *   aanbod.
 * - Geen levertijd en geen "binnen x dagen klaar". Ze heeft nooit gezegd hoe
 *   lang zij nodig heeft, en een belofte daarover is de hare om te doen.
 * - Niets over bezorgen of afhalen. Dat staat in haar voorwaarden en luistert
 *   per bestelling; het hoort in haar antwoord en niet in een automaat.
 *
 * Wat hij wel belooft is wat haar eigen aanvraagblok op de site al zegt: ze
 * komt terug met een voorstel voor ontwerp en prijs.
 */

const SITE_URL = 'https://velvetcakesbyanka.nl';
const TEL = '06 83 67 40 69';

/** 440 breed voor een weergave op 220, zodat hij scherp blijft op een retina-scherm. */
const LOGO_URL = `${SITE_URL}/photos/merk/logo-mail.png`;

/* De voetregel is haar eigen bedrijfsgegeven, letterlijk zoals het in artikel 1
   van haar algemene voorwaarden staat. Het hoort in een bevestigingsmail: het
   maakt zichtbaar met wie de bezoeker zaken doet. */
const VOET_NL = 'Velvet Cakes by Anka, Bergen op Zoom, Nederland. U ontvangt deze mail omdat u een aanvraag heeft verstuurd op velvetcakesbyanka.nl.';
const VOET_EN = 'Velvet Cakes by Anka, Bergen op Zoom, the Netherlands. You received this email because you sent a request on velvetcakesbyanka.nl.';
const VOET_RO = 'Velvet Cakes by Anka, Bergen op Zoom, Țările de Jos. Primești acest e-mail pentru că ai trimis o cerere pe velvetcakesbyanka.nl.';

/**
 * Het palet van de mail, uit dezelfde bron als de site: de creme (#FCF8F1) en de
 * cacao (#312B25) komen exact uit haar aangeleverde logoplaten, het goud is de
 * massieve diepe tint die styles.css voor tekst op licht gebruikt.
 */
const COLORS = {
  pageBackground: '#F7F0E4',
  surface: '#ffffff',
  surfaceAlt: '#FCF8F1',
  border: '#E4D8C2',
  ink: '#312B25',
  onInk: '#F3EADB',
  inkSoft: '#2F2823',
  muted: '#6E6257',
  mutedSoft: '#5B5048',
  accent: '#7F5C1D',
  button: '#312B25',
  onButton: '#F3EADB',
};

const BRAND: ConfirmationEmailBrand = {
  logoUrl: LOGO_URL,
  logoAlt: 'Velvet Cakes by Anka',
  logoWidth: 220,
  wordmark: 'Velvet Cakes by Anka',
  websiteUrl: SITE_URL,
  /* Stond hier tot 18-10-2026 bewust niet: zolang de aanvragen bij ons
     binnenkwamen was het printen van dat adres ons merk in het hare. Sinds
     LEAD_RECIPIENT naar haar eigen postvak gaat is dit haar adres, hetzelfde
     dat in artikel 1 van haar voorwaarden en in de voet van de site staat. */
  contactEmail: 'info@velvetcakesbyanka.nl',
  colors: COLORS,
};

/* De veldnamen die de bezoeker op de pagina zag. Wie "Aantal personen" heeft
   ingevuld hoort datzelfde woord terug te lezen en niet een tweede vertaling
   van hetzelfde idee. */
const VELDEN_NL = {
  firstName: 'Naam',
  email: 'E-mail',
  tel: 'Telefoonnummer',
  datum: 'Datum van het feest',
  personen: 'Aantal personen',
  soort: 'Gelegenheid',
};
const VELDEN_EN = {
  firstName: 'Name',
  email: 'Email',
  tel: 'Phone',
  datum: 'Date of the party',
  personen: 'Number of people',
  soort: 'Occasion',
};
const VELDEN_RO = {
  firstName: 'Nume',
  email: 'E-mail',
  tel: 'Telefon',
  datum: 'Data petrecerii',
  personen: 'Număr de persoane',
  soort: 'Ocazia',
};

const NL: ConfirmationEmailCopy = {
  subject: 'Je aanvraag is binnen - {siteName}',
  preheader: 'Je aanvraag is bij Anka binnen. Je krijgt een voorstel met ontwerp en prijs terug.',
  greeting: 'Hallo {name},',
  greetingWithoutName: 'Hallo,',
  kicker: 'Aanvraag via de website',
  receiptMessage: 'Je aanvraag is binnen',
  followUpMessage:
    /* Tweede zin ("heb je een inspiratiefoto, stuur hem gerust mee") er op
       18-10-2026 uit (Alfred). Hij vroeg om werk dat de bezoeker net gedaan
       heeft: de foto zit al in het formulier, en wie hem oversloeg heeft dat
       bewust gedaan. */
    'Anka leest je aanvraag en komt bij je terug met een voorstel voor het ontwerp en de prijs.',
  detailsHeading: 'Wat je hebt ingevuld',
  messageHeading: 'Je smaak en idee',
  referenceLabel: 'Kenmerk',
  fieldLabels: VELDEN_NL,
  contactPrompt: `Wil je iets toevoegen? Antwoord op deze mail, of stuur een WhatsApp naar ${TEL}.`,
  ctaLabel: 'Terug naar de website',
  footerText: VOET_NL,
};

const EN: ConfirmationEmailCopy = {
  subject: 'Your request is in - {siteName}',
  preheader: 'Your request is with Anka. You get a proposal with a design and a price.',
  greeting: 'Hello {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Request via the website',
  receiptMessage: 'Your request is in',
  followUpMessage:
    'Anka reads your request and comes back to you with a proposal for the design and the price.',
  detailsHeading: 'What you filled in',
  messageHeading: 'Your flavour and idea',
  referenceLabel: 'Reference',
  fieldLabels: VELDEN_EN,
  contactPrompt: `Anything to add? Reply to this email, or send a WhatsApp to ${TEL}.`,
  ctaLabel: 'Back to the website',
  footerText: VOET_EN,
};

const RO: ConfirmationEmailCopy = {
  subject: 'Cererea ta a ajuns - {siteName}',
  preheader: 'Cererea ta a ajuns la Anka. Primești o propunere cu design și preț.',
  greeting: 'Bună {name},',
  greetingWithoutName: 'Bună,',
  kicker: 'Cerere prin site',
  receiptMessage: 'Cererea ta a ajuns',
  followUpMessage:
    'Anka îți citește cererea și revine cu o propunere pentru design și preț.',
  detailsHeading: 'Ce ai completat',
  messageHeading: 'Aroma și ideea ta',
  referenceLabel: 'Referință',
  fieldLabels: VELDEN_RO,
  contactPrompt: `Vrei să adaugi ceva? Răspunde la acest e-mail sau trimite un WhatsApp la ${TEL}.`,
  ctaLabel: 'Înapoi la site',
  footerText: VOET_RO,
};

export const aanvraagConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: { nl: NL, en: EN, ro: RO },
  brand: BRAND,
};
