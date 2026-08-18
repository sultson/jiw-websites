import type {ConfirmationEmailCopy, LocalizedConfirmationEmailConfig} from '@jiw/cloudflare-forms';
import {CONTACT_EMAIL, SITE_NAAM, SITE_URL} from '../site.config.mjs';

/**
 * De bevestiging die de afzender van het contactformulier terugkrijgt.
 *
 * Drie talen, want de site heeft er drie en wie in het Papiamentu schrijft hoort
 * geen Engelse mail terug te krijgen. Welke het wordt bepaalt het veld
 * `__jiw_confirmation_locale`, dat het formulier meestuurt met de taal die op dat
 * moment in de adresbalk staat.
 *
 * De vorm is er een die door Outlook en Gmail komt: tabellen met de stijl in het
 * attribuut zelf, geen scripts, geen webfonts, geen achtergrondafbeeldingen, één
 * logo als PNG (Outlook op Windows toont geen WebP) en een echte platte-
 * tekstversie ernaast, want een mail die alleen uit HTML bestaat scoort bij elk
 * filter slechter.
 *
 * De afzender is no-reply@notify.3diaspora.org, maar het antwoordadres van deze
 * mail is de stichting zelf. Beantwoorden werkt dus gewoon, en dat staat er ook
 * zo in.
 */

const EN: ConfirmationEmailCopy = {
  subject: 'We have received your message - {siteName}',
  preheader: 'Your message has reached the Diaspora Of Africa foundations. Here is a copy of what you sent.',
  greeting: 'Dear {name},',
  receiptMessage: 'Your message has reached us',
  followUpMessage:
    'Someone from the foundations will read it and get back to you as soon as we can. We are a volunteer organisation, so that can take a few days. Below is a copy of what you sent, so you know exactly what is with us.',
  detailsHeading: 'Your message',
  messageHeading: 'What you wrote',
  referenceLabel: 'Reference',
  fieldLabels: {
    firstName: 'First name',
    lastName: 'Last name',
    email: 'Email address',
    telefoon: 'Phone number',
    onderwerp: 'Subject',
  },
  contactPrompt: 'Would you like to add something? Reply to this email, or write to',
  ctaLabel: 'Back to 3 Diaspora',
  footerText:
    'Bonaire, Curaçao and the Netherlands Diaspora Of Africa Foundations. You are receiving this email because you sent a message through 3diaspora.org.',
};

const NL: ConfirmationEmailCopy = {
  subject: 'Uw bericht is bij ons binnen - {siteName}',
  preheader: 'Uw bericht is bij de Diaspora Of Africa stichtingen aangekomen. Hieronder staat een kopie.',
  greeting: 'Beste {name},',
  receiptMessage: 'Uw bericht is bij ons binnen',
  followUpMessage:
    'Iemand van de stichtingen leest het en neemt zo snel mogelijk contact met u op. Wij werken met vrijwilligers, dus dat kan een paar dagen duren. Hieronder staat een kopie van wat u stuurde, zodat u precies weet wat er bij ons ligt.',
  detailsHeading: 'Uw bericht',
  messageHeading: 'Wat u schreef',
  referenceLabel: 'Kenmerk',
  fieldLabels: {
    firstName: 'Voornaam',
    lastName: 'Achternaam',
    email: 'E-mailadres',
    telefoon: 'Telefoonnummer',
    onderwerp: 'Onderwerp',
  },
  contactPrompt: 'Wilt u er iets aan toevoegen? Beantwoord deze mail, of schrijf naar',
  ctaLabel: 'Terug naar 3 Diaspora',
  footerText:
    'Bonaire, Curaçao en Nederland Diaspora Of Africa Foundations. U ontvangt deze mail omdat u een bericht stuurde via 3diaspora.org.',
};

const PAP: ConfirmationEmailCopy = {
  subject: 'Nos a risibí bo mensahe - {siteName}',
  preheader: 'Bo mensahe a yega serka e fundashonnan Diaspora Of Africa. Akinan bo ta haña un kopia.',
  greeting: 'Estimado {name},',
  receiptMessage: 'Bo mensahe a yega serka nos',
  followUpMessage:
    'Un hende di e fundashonnan lo lesa e i lo tuma kontakto ku bo mas lihé posibel. Nos ta traha ku boluntario, pues esaki por dura algun dia. Akinan bo ta haña un kopia di loke bo a manda, pa bo sa eksaktamente kiko tin serka nos.',
  detailsHeading: 'Bo mensahe',
  messageHeading: 'Loke bo a skirbi',
  referenceLabel: 'Referensia',
  fieldLabels: {
    firstName: 'Nòmber',
    lastName: 'Fam',
    email: 'Adres di e-mail',
    telefoon: 'Number di telefòn',
    onderwerp: 'Tema',
  },
  contactPrompt: 'Bo ke agregá algu? Kontestá e mensahe aki, of skirbi na',
  ctaLabel: 'Bai bèk na 3 Diaspora',
  footerText:
    'Boneiru, Kòrsou i Hulanda Diaspora Of Africa Foundations. Bo ta risibí e mensahe aki pasobra bo a manda un mensahe via 3diaspora.org.',
};

/**
 * Het zegel als PNG op een dichte zandkleur. Transparant zou in Outlook op een
 * wit vlak vallen en het goud is daar te licht voor; het vlak eronder is
 * dezelfde kleur als de balk waar het in staat. Aangeleverd op 320 px voor een
 * weergave van 160, dus scherp op een retina.
 */
export const EMAIL_LOGO_PATH = '/logo-email.png';
const EMAIL_LOGO_WIDTH = 160;

export const diasporaConfirmationEmail: LocalizedConfirmationEmailConfig = {
  /* Engels is ook op de site de taal van het kale adres. */
  defaultLocale: 'en',
  translations: {en: EN, nl: NL, pap: PAP},
  brand: {
    logoUrl: `${SITE_URL}${EMAIL_LOGO_PATH}`,
    logoAlt: SITE_NAAM,
    logoWidth: EMAIL_LOGO_WIDTH,
    websiteUrl: SITE_URL,
    contactEmail: CONTACT_EMAIL,
    /* Dezelfde kleuren als de site: het warme bruin van de donkere vlakken, het
       goud uit hun eigen zegel, zand als papier. Het goud draagt hier geen
       leestekst, alleen de knop en de haarlijnen; de knop is goud met de donkere
       inkt erop, en dat leest wel (7,4:1). */
    colors: {
      pageBackground: '#f0e2c9',
      surface: '#ffffff',
      surfaceAlt: '#f8f0e0',
      border: '#ddcbaa',
      ink: '#1b110a',
      onInk: '#f8f0e0',
      inkSoft: '#3d2a1b',
      muted: '#6f5b44',
      mutedSoft: '#5a4633',
      accent: '#b89838',
      button: '#b89838',
      onButton: '#1b110a',
    },
  },
};
