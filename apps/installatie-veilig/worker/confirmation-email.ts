import type {ConfirmationEmailCopy, LocalizedConfirmationEmailConfig} from '@jiw/cloudflare-forms';
import {CONTACT, SITE_URL} from './site';

/**
 * De bevestiging die de aanvrager terugkrijgt.
 *
 * Twee dingen sturen alles hier: hij moet eruitzien alsof InstallatieVeilig hem
 * stuurde, en hij moet ongehinderd door Outlook en Gmail komen.
 *
 * Voor dat tweede: geen scripts, geen webfonts, geen achtergrondafbeeldingen,
 * geen knop die alleen een plaatje is. Tabellen met de stijl in het attribuut
 * zelf, het logo als PNG (Outlook op Windows toont geen WebP) en een echte
 * platte-tekstversie ernaast, want een mail die alleen uit HTML bestaat scoort
 * bij elk filter slechter. Onderaan staan de naam en het werkgebied: een
 * zakelijke afzender die niet zegt wie hij is, leest voor een filter als een
 * mail die dat liever niet vertelt.
 *
 * Wat er niet in staat is net zo belangrijk: geen woorden als gratis of actie,
 * geen uitroeptekens in de onderwerpregel, geen verkorte links, en niets dat om
 * een klik vraagt behalve de eigen website. Dit is een ontvangstbevestiging en
 * hij hoort er ook als een te lezen.
 */
const COPY: ConfirmationEmailCopy = {
  subject: 'Uw aanvraag is binnen - {siteName}',
  preheader: 'Uw aanvraag is binnen. U hoort binnen een werkdag wat het kost en wanneer het kan.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  kicker: 'Ontvangstbevestiging',
  receiptMessage: 'Uw aanvraag is binnen',
  followUpMessage:
    'Jasper kijkt ernaar en laat u binnen een werkdag weten wat het kost en wanneer het kan. ' +
    'Dit is een aanvraag en nog geen opdracht: u zit nergens aan vast.',
  detailsHeading: 'Uw aanvraag',
  messageHeading: 'Uw toelichting',
  referenceLabel: 'Kenmerk',
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    klus: 'Waarvoor',
    keuze: 'Wat precies',
    adres: 'Adres',
  },
  contactPrompt: `Wilt u er iets aan toevoegen? Beantwoord deze mail, bel of app naar ${CONTACT.telefoonWeergave}, of mail`,
  ctaLabel: 'Terug naar de website',
  footerText:
    'InstallatieVeilig, Jasper Mijvis. Groepenkasten en laadpalen in en rond Breda, ' +
    'aangelegd en doorgemeten volgens NEN 1010. U ontvangt deze mail omdat u een aanvraag deed op installatieveilig.nl.',
};

/**
 * Het logo op de lichte balk bovenin: de donkere letterversie, dezelfde als op
 * de witte vlakken van de site. Aangeleverd op 868 px voor een weergave van
 * 260, dus scherp op een retinascherm. scripts/prerender.mjs controleert of het
 * bestand in de build zit.
 */
const LOGO_PAD = '/img/logo-dark.png';
const LOGO_BREEDTE = 260;

export const installatieVeiligConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: {nl: COPY},
  brand: {
    logoUrl: `${SITE_URL}${LOGO_PAD}`,
    logoAlt: 'InstallatieVeilig Elektrotechniek',
    logoWidth: LOGO_BREEDTE,
    websiteUrl: `${SITE_URL}/`,
    contactEmail: CONTACT.email,
    /* De kleuren van de site: het bijna-zwart van de donkere vlakken en het
       groen van het aardteken uit het logo. Het groen staat alleen op zwart of
       met zwarte letters erop (#45d62f met #0c0e0d geeft ruim 12:1), nooit als
       tekst op wit; daar is het te licht voor. */
    colors: {
      pageBackground: '#f5f6f5',
      surface: '#ffffff',
      surfaceAlt: '#fafbfa',
      border: '#e5e7e6',
      ink: '#0c0e0d',
      onInk: '#ffffff',
      inkSoft: '#2c3230',
      muted: '#646b6c',
      mutedSoft: '#4b5250',
      accent: '#45d62f',
      button: '#45d62f',
      onButton: '#0c0e0d',
    },
  },
};
