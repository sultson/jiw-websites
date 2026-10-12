import type {ConfirmationEmailCopy, LocalizedConfirmationEmailConfig} from '@jiw/cloudflare-forms';
import {PRAKTIJK, SITE_NAAM, SITE_URL} from '../site.config.mjs';

/**
 * De bevestiging die iemand terugkrijgt na het contactformulier.
 *
 * Twee dingen sturen alles hier: hij moet eruitzien alsof Marjon hem stuurde,
 * en hij moet ongehinderd door Outlook en Gmail komen.
 *
 * Voor dat tweede: geen scripts, geen webfonts, geen achtergrondafbeeldingen,
 * geen knop die alleen een plaatje is. Tabellen met stijl in het attribuut
 * zelf, één logo als PNG (Outlook op Windows toont geen WebP), en een echte
 * platte-tekstversie ernaast, want een mail die alleen uit HTML bestaat scoort
 * bij elk filter slechter. Onderaan staat wie de afzender is: een zakelijke
 * mail die dat niet vertelt leest voor een filter als een mail die dat liever
 * niet wil.
 *
 * Wat er niet in staat is net zo belangrijk: geen woorden als gratis of actie,
 * geen uitroeptekens in de onderwerpregel, geen verkorte links, en niets dat om
 * een klik vraagt behalve haar eigen website. Dit is een ontvangstbevestiging
 * en hij hoort er ook als een te lezen.
 *
 * De toon is 'je' en niet 'u'. Dat is de hele site sinds 10-10-2026, en een
 * bevestiging die ineens 'u' zegt klinkt alsof hij van iemand anders komt.
 */

const COPY: ConfirmationEmailCopy = {
  subject: 'Je bericht is bij me binnen - {siteName}',
  preheader: 'Ik heb je bericht ontvangen en neem zelf contact met je op.',
  greeting: 'Hoi {name},',
  greetingWithoutName: 'Hoi,',
  receiptMessage: 'Je bericht is bij me binnen',
  followUpMessage:
    'Ik lees het zelf en neem contact met je op. Meestal binnen een paar werkdagen. ' +
    'Heb je haast, bel of app me dan gerust.',
  detailsHeading: 'Wat je me stuurde',
  /* Zonder deze regel staat er twee keer hetzelfde: in het donkere vlak en
     boven de tabel eronder. */
  kicker: 'Bevestiging',
  messageHeading: 'Je bericht',
  referenceLabel: 'Kenmerk',
  fieldLabels: {
    firstName: 'Naam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    bericht: 'Bericht',
  },
  contactPrompt: `Wil je er iets aan toevoegen? Beantwoord deze mail, of bel me op ${PRAKTIJK.telefoonWeergave}.`,
  ctaLabel: 'Terug naar de website',
  footerText:
    `${SITE_NAAM} - Marjon Ooteman, integraal mondhygiënist, ${PRAKTIJK.plaats}. ` +
    'Je ontvangt deze mail omdat je het contactformulier op de website invulde.',
};

/**
 * Het logo als PNG, buiten public/img: dat is de map die scripts/webp.mjs
 * langsloopt, en een logo dat daar ooit WebP wordt is in Outlook een leeg vak.
 * Getekend door scripts/mail-logo.mjs op 520 px voor een weergave van 260, dus
 * scherp op een retinascherm. scripts/prerender.mjs controleert of het bestand
 * echt in de build zit.
 */
export const EMAIL_LOGO_PATH = '/logo-email.png';
const EMAIL_LOGO_WIDTH = 260;

export const marjonConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: {nl: COPY},
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PATH}`,
    logoAlt: SITE_NAAM,
    logoWidth: EMAIL_LOGO_WIDTH,
    websiteUrl: SITE_URL,
    /* Geen contactEmail. De leads komen nu nog binnen op
       hallo@jouwidealewebsite.nl, en dat adres in haar mail aan haar eigen
       bezoeker zetten is ons briefpapier onder haar naam. De mail draagt al een
       reply-to, dus "beantwoord deze mail, of bel me" klopt zonder adres.
       Zodra de leads naar haar eigen mailbox gaan kan haar adres hier staan. */
    /* Haar palet, overgenomen uit src/index.css: het zand en het room van de
       site, de petrol van de knoppen, de teal uit haar eigen logobestand.
       Wit op petrol (#497b89) haalt 4,6:1 en is daarmee leesbaar; de knop staat
       op de diepere variant (#33606d, 6,8:1). */
    colors: {
      pageBackground: '#f6f4ef',
      surface: '#ffffff',
      surfaceAlt: '#f6f4ef',
      border: '#c9d3ce',
      ink: '#2b4249',
      onInk: '#ffffff',
      inkSoft: '#3c5059',
      muted: '#6b7a7f',
      mutedSoft: '#55666c',
      accent: '#7c8460',
      button: '#33606d',
      onButton: '#ffffff',
    },
  },
};
