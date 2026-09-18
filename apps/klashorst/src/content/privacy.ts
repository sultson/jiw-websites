import { PRIVACY_TITLE, type Lang } from '../meta';

/**
 * The museum's privacy statement, in both languages.
 *
 * Not in the Studio, and deliberately so. This is a legal text the museum's own
 * administrator wrote and signed off; it is not copy anyone should be able to
 * reword by accident between two edits of a blog post. It changes when the law
 * or the list of processors changes, which is a deployment, not a Tuesday.
 *
 * Dutch is the original. The English version is the same document said again,
 * for the English half of the site, and says so at the foot.
 *
 * `**vet**` works the way it does everywhere else on the site, and `[woord](adres)`
 * is a link: the three addresses in here have to be clickable.
 */

export type PrivacyBlok =
  | { soort: 'tekst'; tekst: string }
  | { soort: 'lijst'; items: string[] };

export type PrivacySectie = { kop: string; blokken: PrivacyBlok[] };

export type Privacy = {
  titel: string;
  bijgewerkt: string;
  intro: string;
  secties: PrivacySectie[];
  /** Only on the translation: which version is the binding one. */
  noot?: string;
};

const MAIL = 'klashorstmuseum@gmail.com';

const nl: Privacy = {
  titel: PRIVACY_TITLE.nl,
  bijgewerkt: 'Laatst bijgewerkt: 14 september 2026',
  intro:
    'Het Peter Klashorst Museum hecht waarde aan uw privacy. In deze verklaring leggen wij uit welke persoonsgegevens wij verzamelen via onze website, waarom wij dat doen en welke rechten u heeft.',
  secties: [
    {
      kop: '1. Wie zijn wij',
      blokken: [
        { soort: 'tekst', tekst: 'Peter Klashorst Museum is een handelsnaam van:' },
        {
          soort: 'tekst',
          tekst: `**Administratiekantoor M.P. Vos**\nKvK-nummer: 02087328\nE-mail: [${MAIL}](mailto:${MAIL})`,
        },
        {
          soort: 'tekst',
          tekst:
            'Administratiekantoor M.P. Vos is verwerkingsverantwoordelijke voor de gegevens die via deze website worden verzameld.',
        },
      ],
    },
    {
      kop: '2. Welke gegevens wij verzamelen en waarom',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            '**Contactformulier** Wanneer u het contactformulier invult, verwerken wij uw naam, e-mailadres en de inhoud van uw bericht. Wij gebruiken deze gegevens om uw vraag te beantwoorden. Grondslag: gerechtvaardigd belang (het afhandelen van uw verzoek). Bewaartermijn: maximaal 1 jaar na afhandeling, tenzij er een verdere relatie ontstaat.',
        },
        {
          soort: 'tekst',
          tekst:
            '**Websitebezoek en statistieken** Alleen met uw toestemming laden wij Google Analytics voor bezoekersaantallen en bekeken pagina’s. De grondslag is uw toestemming. Advertentiepersonalisatie en Google Signals staan in onze websitecode uit. Wij sturen geen formulierinhoud naar Google Analytics. U kunt uw toestemming op elk moment intrekken via Cookievoorkeuren onderaan de website.',
        },
        {
          soort: 'tekst',
          tekst:
            '**Technische gegevens** Bij het bezoeken van de website verwerkt onze hostingpartij automatisch technische gegevens zoals uw IP-adres, browsertype en het tijdstip van bezoek. Dit is nodig om de website veilig en correct te laten werken. Deze gegevens worden niet langer bewaard dan nodig is voor beveiliging en het oplossen van storingen.',
        },
      ],
    },
    {
      kop: '3. Met wie wij gegevens delen',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'Wij verkopen uw gegevens nooit aan derden. Wij schakelen wel dienstverleners in die namens ons gegevens verwerken:',
        },
        {
          soort: 'lijst',
          items: [
            'Jouw Ideale Website (Doelio B.V.): bouw en beheer van de website',
            'Cloudflare (Cloudflare, Inc.): hosting en beveiliging van de website',
            'Sanity: het contentbeheersysteem waarmee de inhoud van de website wordt beheerd',
            'Google (Google Ireland Limited): websitestatistieken via Google Analytics',
          ],
        },
        {
          soort: 'tekst',
          tekst:
            'Sommige van deze partijen zijn gevestigd in de Verenigde Staten. Doorgifte van gegevens vindt plaats op basis van het EU-VS Data Privacy Framework of de standaardcontractbepalingen van de Europese Commissie.',
        },
      ],
    },
    {
      kop: '4. Cookies',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'Wij onthouden uw cookiekeuze 6 maanden in de lokale opslag van uw browser. Alleen na toestemming laden wij Google Analytics en mag Google analytische cookies plaatsen (_ga en _ga_*), met een ingestelde looptijd van maximaal 6 maanden die bij bezoek kan worden vernieuwd. Bij weigering laden wij Google Analytics niet. Via Cookievoorkeuren kunt u uw keuze wijzigen; bij intrekken verwijderen wij deze analytische cookies. Wij plaatsen geen advertentiecookies.',
        },
      ],
    },
    {
      kop: '5. Beveiliging',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'Wij nemen passende technische en organisatorische maatregelen om uw gegevens te beschermen tegen verlies, misbruik en onbevoegde toegang. De website maakt gebruik van een beveiligde verbinding (SSL/https).',
        },
      ],
    },
    {
      kop: '6. Uw rechten',
      blokken: [
        { soort: 'tekst', tekst: 'U heeft het recht om:' },
        {
          soort: 'lijst',
          items: [
            'uw persoonsgegevens in te zien',
            'onjuiste gegevens te laten corrigeren',
            'uw gegevens te laten verwijderen',
            'bezwaar te maken tegen de verwerking',
            'uw toestemming in te trekken',
            'uw gegevens over te laten dragen aan een andere partij',
          ],
        },
        {
          soort: 'tekst',
          tekst: `Stuur uw verzoek naar [${MAIL}](mailto:${MAIL}). Wij reageren binnen vier weken. Om misbruik te voorkomen kunnen wij u vragen om u te identificeren.`,
        },
        {
          soort: 'tekst',
          tekst:
            'Bent u niet tevreden over hoe wij met uw gegevens omgaan? Dan heeft u het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens via [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).',
        },
      ],
    },
    {
      kop: '7. Wijzigingen',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'Wij kunnen deze privacyverklaring aanpassen. De meest actuele versie staat altijd op deze pagina.',
        },
      ],
    },
  ],
};

const en: Privacy = {
  titel: PRIVACY_TITLE.en,
  bijgewerkt: 'Last updated: 14 September 2026',
  intro:
    'The Peter Klashorst Museum values your privacy. This statement explains which personal data we collect through our website, why we do so, and what rights you have.',
  secties: [
    {
      kop: '1. Who we are',
      blokken: [
        { soort: 'tekst', tekst: 'Peter Klashorst Museum is a trade name of:' },
        {
          soort: 'tekst',
          tekst: `**Administratiekantoor M.P. Vos**\nChamber of Commerce number: 02087328\nEmail: [${MAIL}](mailto:${MAIL})`,
        },
        {
          soort: 'tekst',
          tekst:
            'Administratiekantoor M.P. Vos is the controller for the data collected through this website.',
        },
      ],
    },
    {
      kop: '2. What we collect and why',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            '**Contact form** When you fill in the contact form, we process your name, email address and the content of your message. We use this data to answer your question. Legal basis: legitimate interest (handling your request). Retention: no more than 1 year after the matter is closed, unless a further relationship arises.',
        },
        {
          soort: 'tekst',
          tekst:
            '**Website visits and statistics** We load Google Analytics for visitor counts and page views only with your consent. The legal basis is your consent. Advertising personalisation and Google Signals are disabled in our website code. We do not send form contents to Google Analytics. You can withdraw consent at any time through Cookie preferences in the website footer.',
        },
        {
          soort: 'tekst',
          tekst:
            '**Technical data** When you visit the website, our hosting provider automatically processes technical data such as your IP address, browser type and the time of your visit. This is needed to keep the website working safely and correctly. This data is kept no longer than is necessary for security and for resolving faults.',
        },
      ],
    },
    {
      kop: '3. Who we share data with',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'We never sell your data to third parties. We do use service providers who process data on our behalf:',
        },
        {
          soort: 'lijst',
          items: [
            'Jouw Ideale Website (Doelio B.V.): building and maintaining the website',
            'Cloudflare (Cloudflare, Inc.): hosting and securing the website',
            'Sanity: the content management system the website’s content is managed with',
            'Google (Google Ireland Limited): website statistics through Google Analytics',
          ],
        },
        {
          soort: 'tekst',
          tekst:
            'Some of these parties are established in the United States. Transfers take place on the basis of the EU-US Data Privacy Framework or the European Commission’s standard contractual clauses.',
        },
      ],
    },
    {
      kop: '4. Cookies',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'We remember your cookie choice for 6 months in your browser’s local storage. Only after consent do we load Google Analytics and allow Google to place analytics cookies (_ga and _ga_*), with a configured lifetime of up to 6 months that may renew on visits. If you decline, we do not load Google Analytics. You can change your choice through Cookie preferences; withdrawing consent removes these analytics cookies. We do not place advertising cookies.',
        },
      ],
    },
    {
      kop: '5. Security',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'We take appropriate technical and organisational measures to protect your data against loss, misuse and unauthorised access. The website uses a secure connection (SSL/https).',
        },
      ],
    },
    {
      kop: '6. Your rights',
      blokken: [
        { soort: 'tekst', tekst: 'You have the right to:' },
        {
          soort: 'lijst',
          items: [
            'see your personal data',
            'have incorrect data corrected',
            'have your data deleted',
            'object to the processing',
            'withdraw your consent',
            'have your data transferred to another party',
          ],
        },
        {
          soort: 'tekst',
          tekst: `Send your request to [${MAIL}](mailto:${MAIL}). We respond within four weeks. To prevent misuse we may ask you to identify yourself.`,
        },
        {
          soort: 'tekst',
          tekst:
            'Are you unhappy with the way we handle your data? You then have the right to lodge a complaint with the Dutch Data Protection Authority through [autoriteitpersoonsgegevens.nl](https://autoriteitpersoonsgegevens.nl).',
        },
      ],
    },
    {
      kop: '7. Changes',
      blokken: [
        {
          soort: 'tekst',
          tekst:
            'We may amend this privacy statement. The most recent version is always on this page.',
        },
      ],
    },
  ],
  noot: 'This is a translation. The Dutch version of this statement is the binding one.',
};

export const privacyPerTaal: Record<Lang, Privacy> = { nl, en };
