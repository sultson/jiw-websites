import type { ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die de aanvrager terugkrijgt, in het merk van RH Klusservice.
 *
 * Tot 07-10-2026 vroeg het formulier geen e-mailadres, dus ging er helemaal geen
 * bevestiging uit: de aanvrager hoorde niets tot Robbin belde. Nu het veld er wel
 * is (optioneel) is dit de eerste mail die iemand van dit bedrijf krijgt, vaak
 * binnen een minuut na het versturen. Hij hoort eruit te zien alsof Robbin hem
 * stuurde en niet een formulier.
 *
 * Twee dingen sturen de vorm. Hij moet het merk dragen, en hij moet ongehinderd
 * door Gmail en Outlook komen. Voor dat tweede: geen scripts, geen webfonts
 * (Barlow Condensed en Inter bestaan niet in een mailprogramma, dus deze mail is
 * Arial en doet niet alsof), geen achtergrondafbeeldingen, een knop die een echt
 * vlak met tekst is, en een platte-tekstversie ernaast. Het logo is een PNG met
 * het zwart erin gebakken; zie maak-mailmerk.mjs voor waarom.
 *
 * Onderaan staan plaats en KvK. Een zakelijke afzender die niet zegt wie hij is
 * leest voor een spamfilter als een afzender die dat liever niet vertelt.
 *
 * Wat hier bewust NIET staat: een aanrijtijd, een termijn ("binnen 24 uur"), een
 * vaste prijs vooraf en het woord vrijblijvend. Dat zijn alle vier beloftes die
 * Robbin nooit heeft gedaan. De mail zegt alleen wat de site al zegt en wat aan
 * de telefoon waar te maken is.
 */

/* Zijn eigen gegevens. Dezelfde opgave als in onderdelen.mjs, waar ze de voet, de
   contactblokken en de structured data dragen. Ze staan hier apart omdat
   onderdelen.mjs een bouwbestand is: een worker die dat importeert sleept de hele
   paginabouw mee in zijn bundel. */
const SITE_URL = 'https://rhklusservice.nl';
const TEL_TOON = '06 31 29 51 56';
const MAIL = 'rhklusservice@outlook.com';
const KVK = '92724418';

/** 480 breed voor een weergave van 240, dus scherp op een retinascherm. */
const LOGO_PAD = `${SITE_URL}/logo/rh-klusservice-email.png`;
const LOGO_BREEDTE = 240;

const NL: ConfirmationEmailCopy = {
  subject: 'Uw aanvraag is binnen - {siteName}',
  preheader: 'Wij hebben uw aanvraag ontvangen. We bellen u op het nummer dat u heeft ingevuld.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Offerteaanvraag',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  followUpMessage:
    'We bellen u op het nummer dat u heeft ingevuld om de klus door te nemen. Vaak komen we daarna even langs om te zien wat er precies moet gebeuren; pas dan weten we wat het kost. U zit aan deze aanvraag nergens aan vast.',
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Uw omschrijving',
  referenceLabel: 'Kenmerk',
  /* De namen van de velden zoals het pakket ze kent. firstName is het enige
     naamveld op het formulier en draagt daar het opschrift "Naam"; die naam kan
     geen Nederlands zijn, het label eromheen wel. */
  fieldLabels: {
    firstName: 'Naam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
  },
  contactPrompt: `Wilt u er iets aan toevoegen, of heeft u haast? Bel ons op ${TEL_TOON}. We zijn bereikbaar van 07:00 tot 23:00, zeven dagen per week.`,
  ctaLabel: 'Terug naar de website',
  footerText: `RH Klusservice, Valkenswaard. KvK ${KVK}. U ontvangt deze mail omdat u een offerte aanvroeg op rhklusservice.nl.`,
};

/**
 * De kleuren van de site: strikt zwart-wit met lichtgrijs ertussen, zijn eigen
 * logokleuren. Het accent is een grijs en geen kleur, want de site heeft er geen.
 * Het draagt hier drie dingen: de streep boven de kaart, het opschrift op het
 * zwarte vlak (6,3:1 op zwart) en het randje langs de geciteerde omschrijving.
 */
const KLEUREN = {
  pageBackground: '#f2f2f2',
  surface: '#ffffff',
  surfaceAlt: '#fafafa',
  border: '#e2e2e2',
  ink: '#000000',
  onInk: '#ffffff',
  inkSoft: '#333333',
  muted: '#767676',
  mutedSoft: '#555555',
  accent: '#9a9a9a',
  button: '#000000',
  onButton: '#ffffff',
};

export const rhBevestigingsmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: { nl: NL },
  brand: {
    logoUrl: LOGO_PAD,
    logoAlt: 'RH Klusservice',
    logoWidth: LOGO_BREEDTE,
    wordmark: 'RH Klusservice',
    websiteUrl: SITE_URL,
    contactEmail: MAIL,
    colors: KLEUREN,
  },
};
