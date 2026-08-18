import type {ConfirmationEmailCopy, LocalizedConfirmationEmailConfig} from '@jiw/cloudflare-forms';
import {SITE_URL, WINKEL} from '../site.config.mjs';

/**
 * De bevestiging die de klant terugkrijgt.
 *
 * Twee dingen sturen alles hier: hij moet eruitzien alsof de winkel hem stuurde,
 * en hij moet ongehinderd door Outlook en Gmail komen.
 *
 * Voor dat tweede: geen scripts, geen webfonts, geen achtergrondafbeeldingen,
 * geen knop die alleen een plaatje is. Tabellen met stijl in het attribuut zelf,
 * één logo als PNG (Outlook op Windows toont geen WebP), en een echte
 * platte-tekstversie ernaast, want een mail die alleen uit HTML bestaat scoort
 * bij elk filter slechter. Onderaan staan het adres en het telefoonnummer van de
 * winkel: een zakelijke afzender die niet zegt wie hij is, leest voor een filter
 * als een mail die dat liever niet vertelt.
 *
 * Wat er niet in staat is net zo belangrijk: geen woorden als gratis of actie,
 * geen uitroeptekens in de onderwerpregel, geen verkorte links, en niets dat om
 * een klik vraagt behalve de eigen website. Dit is een ontvangstbevestiging en
 * hij hoort er ook als een te lezen.
 */

const COPY: ConfirmationEmailCopy = {
  subject: 'Uw aanvraag is bij ons binnen - {siteName}',
  preheader: 'We hebben uw aanvraag ontvangen en laten u weten wat we voor u kunnen maken.',
  greeting: 'Beste {name},',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  followUpMessage:
    'We kijken ernaar en laten u weten wat we voor u kunnen maken en wat het kost. Meestal is dat nog dezelfde of de eerstvolgende winkeldag. Dit is een aanvraag en nog geen bestelling: u zit nergens aan vast.',
  detailsHeading: 'Uw aanvraag',
  messageHeading: 'Uw wensen',
  referenceLabel: 'Kenmerk',
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    soort: 'Wat',
    gelegenheid: 'Toelichting',
    levering: 'Ophalen of bezorgen',
    adres: 'Bezorgadres',
    datum: 'Wanneer',
    budget: 'Budget',
  },
  contactPrompt: `Wilt u er iets aan toevoegen? Beantwoord deze mail, of bel ons op ${WINKEL.telefoonWeergave}.`,
  ctaLabel: 'Terug naar de winkel',
  footerText: `Fleurig! Bloemenwinkel, ${WINKEL.straat}, ${WINKEL.postcode} ${WINKEL.plaats}. Woensdag tot en met zaterdag van 8:00 tot 17:30. U ontvangt deze mail omdat u een aanvraag deed op onze website.`,
};

/**
 * Het logo als PNG, buiten public/img: dat is de map die scripts/optimize-images
 * langsloopt, en een logo dat daar ooit WebP wordt is in Outlook een leeg vak.
 * Aangeleverd op 480 px voor een weergave van 240, dus scherp op een retina.
 * scripts/prerender.mjs controleert of het bestand in de build zit.
 */
export const EMAIL_LOGO_PATH = '/logo-email.png';
const EMAIL_LOGO_WIDTH = 240;

export const fleurigConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: {nl: COPY},
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PATH}`,
    logoAlt: 'Fleurig! Bloemenwinkel',
    logoWidth: EMAIL_LOGO_WIDTH,
    websiteUrl: SITE_URL,
    contactEmail: WINKEL.email,
    /* De kleuren van de winkel: het diepe groen van de pui, het framboos van de
       knoppen, room als papier. Het roze van de knop is #c22a5f met witte
       letters (5,3:1); het lichtere bloesemroze staat alleen op het donkere
       vlak, waar het wel leesbaar is. */
    colors: {
      pageBackground: '#fbf7f2',
      surface: '#ffffff',
      surfaceAlt: '#fdfaf6',
      border: '#ebe2d8',
      ink: '#0d2a21',
      onInk: '#ffffff',
      inkSoft: '#3c4a44',
      muted: '#6b7a74',
      mutedSoft: '#55635d',
      accent: '#ffb1c8',
      button: '#c22a5f',
      onButton: '#ffffff',
    },
  },
};
