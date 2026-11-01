import type {ConfirmationEmailCopy, LocalizedConfirmationEmailConfig} from '@jiw/cloudflare-forms';
import {SITE_URL, ZAAK} from '../site.config.mjs';

/**
 * De bevestiging die de aanvrager terugkrijgt.
 *
 * Twee dingen sturen alles hier: hij moet eruitzien alsof GuySa hem stuurde, en
 * hij moet ongehinderd door Outlook en Gmail komen.
 *
 * Voor dat tweede: geen scripts, geen webfonts, geen achtergrondafbeeldingen,
 * geen knop die alleen een plaatje is. Het pakket tekent tabellen met de stijl
 * in het attribuut zelf en zet er een echte platte-tekstversie naast, want een
 * mail die alleen uit HTML bestaat scoort bij elk filter slechter. Onderaan
 * staan de naam, het telefoonnummer en het mailadres van de zaak: een zakelijke
 * afzender die niet zegt wie hij is, leest voor een filter als een mail die dat
 * liever niet vertelt.
 *
 * Wat er niet in staat is net zo belangrijk: geen woorden als gratis of actie,
 * geen uitroeptekens in de onderwerpregel, geen verkorte links, en niets dat om
 * een klik vraagt behalve de eigen website.
 */

const COPY: ConfirmationEmailCopy = {
  subject: 'Uw aanvraag is bij ons binnen - {siteName}',
  preheader: 'We hebben uw aanvraag ontvangen en nemen binnen 24 uur contact met u op.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Beste,',
  receiptMessage: 'Uw aanvraag is bij ons binnen',
  kicker: 'Bevestiging',
  followUpMessage:
    'We nemen binnen 24 uur contact met u op om een vrijblijvend bezoek in te plannen. Daarna weet u wat het kost, en pas dan beslist u.',
  detailsHeading: 'Uw aanvraag',
  messageHeading: 'Wat u ons meegaf',
  referenceLabel: 'Kenmerk',
  /* Dezelfde namen als de velden die het formulier verstuurt (zie
     src/Aanvraag.tsx) en dezelfde labels als in de mail aan de zaak (zie
     emailFields in worker/index.ts). Een veld dat hier ontbreekt komt in de
     bevestiging onder zijn technische naam te staan. */
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoon',
    opdracht: 'Waarvoor',
    details: 'Waar het over gaat',
    postcode: 'Postcode',
    gemeente: 'Gemeente',
    termijn: 'Wanneer',
    toelichting: 'Wat u ons meegaf',
  },
  /* Eindigt op een dubbele punt: het pakket zet het mailadres er direct achter
     als `brand.contactEmail` gevuld is. Haalt iemand dat adres weg, dan hoort
     deze zin mee te veranderen. */
  contactPrompt: `Wilt u er iets aan toevoegen? Beantwoord deze mail of bel ons op ${ZAAK.telefoonWeergave}. Schrijven mag ook:`,
  ctaLabel: 'Terug naar de site',
  footerText:
    `GuySa Inboedels & Opruimingen, regio Antwerpen. Telefoon ${ZAAK.telefoonWeergave}. ` +
    'U ontvangt deze mail omdat u een offerte aanvroeg op onze website.',
};

/**
 * Het logo als PNG, buiten public/img: dat is de map die scripts/beeld.mjs
 * omzet naar webp, en een logo dat daar ooit webp wordt is in Outlook op
 * Windows een leeg vak. Het staat op zijn eigen donkere tegel omdat het merk
 * goud op doorzichtig is; zie scripts/mail-logo.mjs.
 *
 * Aangeleverd op 480 px voor een weergave van 240, dus scherp op een retina.
 * scripts/audit-seo.mjs controleert of het bestand in de build zit — een
 * mailprogramma haalt het daar op, dus is het weg, dan is het logo weg.
 */
export const EMAIL_LOGO_PATH = '/logo-email.png';
const EMAIL_LOGO_WIDTH = 240;

export const guysaConfirmationEmail: LocalizedConfirmationEmailConfig = {
  defaultLocale: 'nl',
  translations: {nl: COPY},
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PATH}`,
    logoAlt: 'GuySa Inboedels & Opruimingen',
    logoWidth: EMAIL_LOGO_WIDTH,
    websiteUrl: SITE_URL,
    /* Het eigen adres van de zaak, en niet dat van ons. Dit adres staat al
       openbaar op hun eigen site, dus het is hun merk; het antwoordadres van
       de mail gaat wel naar LEAD_RECIPIENT, waar de aanvragen op dit moment
       binnenkomen. */
    contactEmail: ZAAK.mail,
    /* Het goud en het bijna-zwart uit het logo, dezelfde waarden als
       --color-gold en --color-ink in src/index.css. De contrasten zijn
       nagerekend, want in een mailprogramma is er geen stijlblad dat ze later
       nog rechttrekt:
         ink op surface            17,9:1
         inkSoft op surface         9,7:1
         muted op surface           5,2:1
         onInk op ink              17,9:1
         accent op ink              8,5:1
         onButton op button         8,5:1
       De knop is goud met bijna-zwarte letters, net als op de site: goud met
       wit haalt 2,1:1 en is onleesbaar. */
    colors: {
      pageBackground: '#f7f4ef',
      surface: '#ffffff',
      surfaceAlt: '#faf8f4',
      border: '#e6e0d5',
      ink: '#111010',
      onInk: '#ffffff',
      inkSoft: '#3b3733',
      muted: '#6f6862',
      mutedSoft: '#5a544f',
      accent: '#d1a957',
      button: '#d1a957',
      onButton: '#111010',
    },
  },
};
