import type { ConfirmationEmailBrand, ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die een bezoeker terugkrijgt, in het merk van FRAME MEDIA en in
 * de taal van de pagina die hij invulde.
 *
 * Tot de verhuizing naar deze monorepo verstuurden de formulieren niets: site.js
 * ving het af en liet een regel zien die er zelf bij zei dat het een conceptversie
 * was. Dit is dus de eerste mail die iemand ooit van FRAME MEDIA krijgt, en de
 * lezer is een ondernemer die net zijn bedrijfsnaam en telefoonnummer heeft
 * afgegeven voor een item op televisie. Die moet eruitzien alsof hij van het
 * bedrijf komt en niet van een formulier.
 *
 * Twee randvoorwaarden geven hem zijn vorm. Hij draagt het merk, en hij moet
 * ongeschonden in een postvak aankomen: geen script, geen webfont (Archivo en
 * Inter bestaan niet in een mailprogramma, dus dit is Arial en doet niet anders
 * voorkomen), geen achtergrondfoto, een knop die een echt gevuld vakje met tekst
 * is, en een platte-tekstversie ernaast.
 *
 * De site is donker, deze mail niet. Een donkere mailkaart wordt door een deel van
 * de mailprogramma's zelf nog eens omgekeerd en dan staat er grijs op grijs; dus
 * een lichte kaart met hun donkere marinevlak als band en hun rood als enige
 * accent. Dat rood is de opgehelderde variant (#ff4d57), want #bf2027 haalt op dat
 * donkere vlak maar 3,2:1. Gemeten tegen dit palet: rood op de band 5,8:1, wit op
 * de band 18,9:1, de knop 6,1:1, lopende tekst op wit 12,8:1 en de zachtste grijze
 * regel 5,8:1.
 *
 * Wat deze mail bewust NIET zegt:
 *
 * - Geen enkel bedrag. De tarieven op de site zijn deels van Armando en deels van
 *   hun eigen Mondzorg.TV-pagina, en de vier extra's zijn nog niet bevestigd. Een
 *   prijs in een mail is een aanbod.
 * - Niets over twee uitzendingen. Dat geldt voor Puur Genieten en niet voor
 *   branded content in het algemeen, en in deze mail is niet te zien welk van de
 *   twee iemand voor ogen heeft.
 * - Geen presentatrice bij naam. Haar naam staat in de brochure twee keer anders
 *   gespeld (Roxanna en Roxana) en daar is nog geen antwoord op.
 *
 * Wat hij wel belooft is wat op de pagina's zelf al staat: antwoord binnen een
 * werkdag, en geen kosten en geen verplichtingen aan het eerste gesprek.
 */

const SITE_URL = 'https://www.framemedia.tv';
const TEL = '06 3486 1375';

/** 480 breed voor een weergave op 240, zodat hij scherp blijft op een retina-scherm. */
const LOGO_URL = `${SITE_URL}/assets/mail/framemedia-email.png`;

/* De voetregel is hun eigen bedrijfsgegeven, zoals het ook boven de
   leveringsvoorwaarden staat: eenmanszaak, dus geen "statutair gevestigd". */
const VOET_NL = 'Frame Productions & Management, John Blankensteinstraat 23 A, 1095 MB Amsterdam. KvK 85865346. U ontvangt deze mail omdat u een formulier heeft verstuurd op www.framemedia.tv.';
const VOET_EN = 'Frame Productions & Management, John Blankensteinstraat 23 A, 1095 MB Amsterdam, the Netherlands. Chamber of Commerce 85865346. You received this email because you sent a form on www.framemedia.tv.';
const VOET_DE = 'Frame Productions & Management, John Blankensteinstraat 23 A, 1095 MB Amsterdam, Niederlande. Handelsregister 85865346. Sie erhalten diese E-Mail, weil Sie auf www.framemedia.tv ein Formular gesendet haben.';

/**
 * Het palet van de mail. De marine en het rood komen uit hun eigen logobestand,
 * net als op de site; het grijs eromheen is de lichte tegenhanger van de
 * paneelkleuren uit style.css.
 */
const COLORS = {
  pageBackground: '#EEF1F4',
  surface: '#ffffff',
  surfaceAlt: '#F4F6F8',
  border: '#DCE2E8',
  ink: '#0d1117',
  onInk: '#ffffff',
  inkSoft: '#2A333D',
  muted: '#5A6775',
  mutedSoft: '#44505C',
  accent: '#ff4d57',
  button: '#bf2027',
  onButton: '#ffffff',
};

const BRAND: ConfirmationEmailBrand = {
  logoUrl: LOGO_URL,
  logoAlt: 'FRAME MEDIA',
  logoWidth: 240,
  wordmark: 'FRAME MEDIA',
  websiteUrl: SITE_URL,
  // Staat er sinds 17-10-2026, toen LEAD_RECIPIENT naar info@framemedia.tv ging.
  // Hiervoor stond hier bewust niets: het adres van wie de aanvragen ontvangt
  // kwam toen bij ons uit, en dat in de eigen mail van FRAME MEDIA zetten is ons
  // merk in de hunne. Nu is het hun eigen adres, en dan hoort het er juist in -
  // de reply-to wijst naar hetzelfde adres, dus "antwoord op deze mail of mail
  // ons" komt op beide manieren bij Frans uit.
  contactEmail: 'info@framemedia.tv',
  colors: COLORS,
};

/* De veldnamen die de bezoeker op de pagina zag. Wie "Bedrijfsnaam" heeft
   ingevuld hoort datzelfde woord terug te lezen en niet een tweede vertaling van
   hetzelfde idee. */
const VELDEN_NL = {
  firstName: 'Contactpersoon',
  email: 'E-mail',
  bedrijf: 'Bedrijfsnaam',
  tel: 'Telefoonnummer',
  onderwerp: 'Waar het over gaat',
  branche: 'Branche',
};
const VELDEN_EN = {
  firstName: 'Contact',
  email: 'Email',
  bedrijf: 'Company',
  tel: 'Phone',
  onderwerp: 'Subject',
  branche: 'Sector',
};
const VELDEN_DE = {
  firstName: 'Ansprechpartner',
  email: 'E-Mail',
  bedrijf: 'Firmenname',
  tel: 'Telefon',
  onderwerp: 'Thema',
  branche: 'Branche',
};

/* --- het contactformulier en het snelformulier in de hero ----------------- */

const CONTACT_NL: ConfirmationEmailCopy = {
  subject: 'Wij hebben uw bericht ontvangen - {siteName}',
  preheader: 'Uw bericht is bij ons binnen. Wij reageren binnen een werkdag.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Bericht via de website',
  receiptMessage: 'Uw bericht is bij ons binnen',
  followUpMessage:
    'Wij lezen het en nemen binnen een werkdag contact met u op, per mail of telefonisch. Aan dat eerste gesprek zitten geen kosten en geen verplichtingen.',
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Uw bericht',
  referenceLabel: 'Kenmerk',
  fieldLabels: VELDEN_NL,
  contactPrompt: `Wilt u iets toevoegen? Antwoord op deze mail, of bel ons op ${TEL}.`,
  ctaLabel: 'Terug naar de website',
  footerText: VOET_NL,
};

const CONTACT_EN: ConfirmationEmailCopy = {
  subject: 'We have your message - {siteName}',
  preheader: 'Your message is with us. We reply within one working day.',
  greeting: 'Dear {name},',
  greetingWithoutName: 'Hello,',
  kicker: 'Message via the website',
  receiptMessage: 'Your message is with us',
  followUpMessage:
    'We read it and come back to you within one working day, by email or by phone. That first conversation carries no cost and no obligation.',
  detailsHeading: 'What you sent us',
  messageHeading: 'Your message',
  referenceLabel: 'Reference',
  fieldLabels: VELDEN_EN,
  contactPrompt: `Anything to add? Reply to this email, or call us on ${TEL}.`,
  ctaLabel: 'Back to the website',
  footerText: VOET_EN,
};

const CONTACT_DE: ConfirmationEmailCopy = {
  subject: 'Wir haben Ihre Nachricht erhalten - {siteName}',
  preheader: 'Ihre Nachricht liegt bei uns. Wir antworten innerhalb eines Werktags.',
  greeting: 'Guten Tag {name},',
  greetingWithoutName: 'Guten Tag,',
  kicker: 'Nachricht über die Website',
  receiptMessage: 'Ihre Nachricht liegt bei uns',
  followUpMessage:
    'Wir lesen sie und melden uns innerhalb eines Werktags bei Ihnen, per E-Mail oder telefonisch. Das erste Gespräch ist kostenlos und unverbindlich.',
  detailsHeading: 'Ihre Angaben',
  messageHeading: 'Ihre Nachricht',
  referenceLabel: 'Referenz',
  fieldLabels: VELDEN_DE,
  contactPrompt: `Möchten Sie etwas ergänzen? Antworten Sie auf diese E-Mail, oder rufen Sie uns an unter ${TEL}.`,
  ctaLabel: 'Zurück zur Website',
  footerText: VOET_DE,
};

export const contactConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: { nl: CONTACT_NL, en: CONTACT_EN, de: CONTACT_DE },
  brand: BRAND,
};

/* --- het aanmeldformulier op /puurgenieten/ -------------------------------- */
/* Hier staat "aanmelding" en niet "bericht": wie dat formulier invult meldt zijn
   bedrijf aan voor een item in een programma, en dat is een ander ding dan een
   vraag stellen. Wel zonder bedrag en zonder uitzenddatum - zie boven. */

const PG_NL: ConfirmationEmailCopy = {
  subject: 'Uw aanmelding voor Puur Genieten is binnen - {siteName}',
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

const PG_EN: ConfirmationEmailCopy = {
  subject: 'Your application for Puur Genieten is in - {siteName}',
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

const PG_DE: ConfirmationEmailCopy = {
  subject: 'Ihre Anmeldung für Puur Genieten ist eingegangen - {siteName}',
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
  translations: { nl: PG_NL, en: PG_EN, de: PG_DE },
  brand: BRAND,
};

/* --- het formulier op /programma-idee/ ------------------------------------- */
/* Alleen Nederlands: die pagina staat alleen in het Nederlands, want een format
   pitchen is een gesprek met een Nederlandse zender over een Nederlandstalig
   programma. De belangrijkste regel in deze mail is dat het idee tussen hen
   blijft - dat is wat iemand tegenhoudt die op "verstuur" wil drukken. */

const IDEE_NL: ConfirmationEmailCopy = {
  subject: 'Uw programma-idee is bij ons binnen - {siteName}',
  preheader: 'Uw idee is bij ons binnen en blijft tussen ons.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Programma-idee',
  receiptMessage: 'Uw idee is bij ons binnen',
  followUpMessage:
    'Wij lezen het en nemen zo snel mogelijk contact met u op. Uw idee blijft tussen ons: wij behandelen het vertrouwelijk en leggen het niet buiten ons voor zonder dat u daar ja op zegt. Aan het eerste gesprek zitten geen kosten en geen verplichtingen.',
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Uw idee',
  referenceLabel: 'Kenmerk',
  fieldLabels: { firstName: 'Naam', email: 'E-mail', tel: 'Telefoonnummer' },
  contactPrompt: `Wilt u iets toevoegen? Antwoord op deze mail, of bel ons op ${TEL}.`,
  ctaLabel: 'Terug naar de website',
  footerText: VOET_NL,
};

export const programmaIdeeConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: { nl: IDEE_NL },
  brand: BRAND,
};
