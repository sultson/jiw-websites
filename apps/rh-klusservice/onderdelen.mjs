/* Gedeelde onderdelen voor de gegenereerde pagina's: de bovenbalk, de voet,
   de zwevende WhatsApp-knop en de gegevens die overal hetzelfde zijn.
   Gebruikt door maak-plaatspaginas.mjs, maak-slotpagina.mjs en maak-sitemap.mjs.
   De homepagina (dist/index.html) staat los en is handwerk; verandert hier de
   balk of de voet, dan moet die dus met de hand mee.
 */

export const TEL = '+31631295156';
export const TEL_TOON = '06 31 29 51 56';
export const WA = 'https://wa.me/31631295156';
export const MAIL = 'rhklusservice@outlook.com';
export const WERKSPOT = 'https://www.werkspot.nl/profiel/rh-klusservice';
export const GOOGLE = 'https://share.google/A8lQXq9hEHgqI43vI';
export const SITE = 'https://rhklusservice.nl';

/* Het endpoint van de eigen worker (worker/index.ts). Relatief, want hij zit op
   hetzelfde adres als de pagina; dat is ook de reden dat dit geen absolute URL
   meer hoeft te zijn zoals de `_next` van formsubmit dat wel moest. */
export const FORM_PAD = '/api/forms/offerte';

/* Deelplaatje voor WhatsApp, LinkedIn en Google. 1200x630, uitsnede van de
   overkapping aan het water: de enige liggende foto met blauwe lucht erin. */
export const OG_BEELD = `${SITE}/foto/og-rh-klusservice.jpg`;

export function ogTags({ titel, omschrijving, pad }) {
  const vlucht = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  return `<meta property="og:title" content="${vlucht(titel)}">
<meta property="og:description" content="${vlucht(omschrijving)}">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE}${pad}">
<meta property="og:site_name" content="RH Klusservice">
<meta property="og:locale" content="nl_NL">
<meta property="og:image" content="${OG_BEELD}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="Houten overkapping met vlonder, gebouwd door RH Klusservice">
<meta name="twitter:card" content="summary_large_image">`;
}

/* 07:00 tot 23:00, zeven dagen per week. Bevestigd door Armando 07-10-2026,
   samen met: ja, hij rijdt uit bij spoed. Eerst stond hier 00:00-23:59, dat
   was mijn verkeerde lezing van zijn "07/23". */
export const OPENINGSTIJDEN = [{
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '07:00',
  closes: '23:00'
}];

/* De velden die op elke pagina hetzelfde zijn. url en areaServed zet elke
   pagina er zelf bij, die verschillen per plaats. */
export const BEDRIJF = {
  '@type': 'HomeAndConstructionBusiness',
  name: 'RH Klusservice',
  telephone: TEL,
  email: MAIL,
  image: OG_BEELD,
  logo: `${SITE}/logo/rh-klusservice.svg`,
  address: { '@type': 'PostalAddress', addressLocality: 'Valkenswaard', addressCountry: 'NL' },
  vatID: 'NL004973060B79',
  openingHoursSpecification: OPENINGSTIJDEN,
  aggregateRating: { '@type': 'AggregateRating', ratingValue: '5', reviewCount: '49', bestRating: '5' },
  sameAs: [WERKSPOT, GOOGLE]
};

/* De losse slotpagina (verzoek Armando 07-10-2026). Staat hier omdat de voet,
   de sitemap en de pagina zelf hem allemaal nodig hebben. */
export const SLOT_SLUG = 'slot-vervangen-valkenswaard';

export const PLAATSEN = [
  {
    naam: 'Valkenswaard', slug: 'timmerman-valkenswaard', provincie: 'Noord-Brabant',
    nabij: ['Valkenswaard', 'Waalre', 'Leende', 'Luyksgestel', 'Eersel'],
    intro: 'RH Klusservice is gevestigd in Valkenswaard. Dit is onze eigen plaats. Van een deur die klemt tot een complete verbouwing, in woningen, bedrijfspanden en opslagruimtes.',
    bewijs: 'Hier staan we ingeschreven, en in Valkenswaard en de dorpen eromheen werken we het vaakst.'
  },
  {
    naam: 'Eindhoven', slug: 'timmerman-eindhoven', provincie: 'Noord-Brabant',
    nabij: ['Eindhoven', 'Veldhoven', 'Waalre', 'Best', 'Oirschot'],
    intro: 'Eindhoven ligt op een kwartier rijden van Valkenswaard. We werken er in woningen, bedrijfspanden en opslagruimtes, van losse klussen tot complete verbouwingen.',
    bewijs: 'Van onze 49 beoordelingen op Werkspot komen er 17 uit Eindhoven. Geen enkele plaats staat er vaker tussen.'
  },
  {
    naam: 'Breda', slug: 'timmerman-breda', provincie: 'Noord-Brabant',
    nabij: ['Goirle', 'Tilburg'],
    intro: 'Breda hoort bij ons werkgebied. We rijden er vanuit Valkenswaard naartoe voor timmerwerk, dakramen, deuren en grotere verbouwingen.',
    bewijs: 'Leg uw klus even voor, dan hoort u meteen of we hem kunnen doen en wanneer.'
  },
  {
    naam: 'Tilburg', slug: 'timmerman-tilburg', provincie: 'Noord-Brabant',
    nabij: ['Tilburg', 'Goirle', 'Oirschot'],
    intro: 'Tilburg hoort bij ons werkgebied. We komen er voor binnendeuren en kozijnen, dakramen en dakkapellen, timmerwerk en verbouwingen.',
    bewijs: 'In Tilburg en Goirle hebben we eerder gewerkt.'
  },
  {
    naam: 'Utrecht', slug: 'timmerman-utrecht', provincie: 'Utrecht',
    nabij: [],
    intro: 'Utrecht staat in ons werkgebied. Vanuit Valkenswaard is dat ruim een uur rijden. We komen er voor timmerwerk, dakramen, deuren en verbouwingen.',
    bewijs: 'Leg uw klus even voor, dan hoort u meteen of we hem kunnen doen en wanneer.'
  },
  {
    naam: 'Amsterdam', slug: 'timmerman-amsterdam', provincie: 'Noord-Holland',
    nabij: [],
    intro: 'Amsterdam staat in ons werkgebied. Vanuit Valkenswaard is dat anderhalf uur rijden. We komen er voor timmerwerk, dakramen, deuren en verbouwingen.',
    bewijs: 'Leg uw klus even voor, dan hoort u meteen of we hem kunnen doen en wanneer.'
  },
  {
    naam: 'Rotterdam', slug: 'timmerman-rotterdam', provincie: 'Zuid-Holland',
    nabij: [],
    intro: 'Rotterdam staat in ons werkgebied. Vanuit Valkenswaard is dat ruim een uur rijden. We komen er voor timmerwerk, dakramen, deuren en verbouwingen.',
    bewijs: 'Leg uw klus even voor, dan hoort u meteen of we hem kunnen doen en wanneer.'
  },
  {
    naam: 'Roermond', slug: 'timmerman-roermond', provincie: 'Limburg',
    nabij: ['Montfort', 'Weert'],
    intro: 'Roermond en de omgeving horen bij ons werkgebied. We komen er voor binnendeuren en buitendeuren, dakramen, timmerwerk en verbouwingen.',
    bewijs: 'In Montfort en Weert hebben we eerder gewerkt.'
  }
];

export const MAANDEN = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december'];

export const vlucht = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function maandJaar(iso){
  const d = new Date(iso);
  return `${MAANDEN[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/* Het offerteformulier. Sinds de overzetting naar jiw-websites (07-10-2026) gaat
   de aanvraag naar onze eigen worker op @jiw/cloudflare-forms, niet meer naar
   formsubmit.co. De veldnamen zijn daarmee die van het pakket: `firstName` is het
   enige naamveld (het opschrift blijft "Naam"), `email` het optionele adres,
   `bericht` het vrije tekstveld, `files` de foto's en `bedrijf` het lokveld dat
   buiten beeld staat.

   Het e-mailadres is optioneel en niet verplicht. Wie het invult krijgt meteen
   een bevestiging in het merk van RH Klusservice (worker/bevestigingsmail.ts);
   wie het overslaat kan gewoon versturen en wordt gebeld. Armando haalde het veld
   er op 06-10-2026 uit om het formulier korter te maken, Alfred zette het er op
   07-10-2026 weer bij voor die bevestiging. Optioneel is wat die twee verenigt.

   Verstuurd wordt er met fetch in dist/site.js, niet door de browser zelf: de
   worker antwoordt met JSON en de pagina zet het formulier om in een bevestiging.

   LET OP: ditzelfde HTML staat ook met de hand in dist/index.html (twee keer:
   #offerte-boven en #offerte) en in dist/projecten/index.html. Die drie zijn
   handwerk en komen hier niet uit; verandert dit, dan moeten ze mee. */
export function FORMULIER({ herkomst, kop, niveau = 'h3', id = 'offerte', klasse = '', plaats = 'Eindhoven' }) {
  const klassen = ['form--aanvraag', klasse].filter(Boolean).join(' ');
  return `        <form id="${id}" class="${klassen}" action="${FORM_PAD}" method="POST" enctype="multipart/form-data">
          <input type="hidden" name="herkomst" value="${vlucht(herkomst)}">
          <input type="text" name="bedrijf" class="valstrik" tabindex="-1" autocomplete="off" aria-hidden="true">
          <${niveau} class="form__kop">${vlucht(kop)}</${niveau}>
          <div class="tweekolom">
            <label>Naam<input type="text" name="firstName" required autocomplete="name"></label>
            <label>Telefoon<input type="tel" name="telefoon" required autocomplete="tel"></label>
          </div>
          <label><span class="veld__kop">E-mailadres <em>optioneel</em></span><input type="email" name="email" autocomplete="email" placeholder="Voor een bevestiging per mail"></label>
          <label>Omschrijving van de klus<textarea name="bericht" required placeholder="Bijvoorbeeld: twee dakramen plaatsen in een schuin dak, woning uit 1998 in ${vlucht(plaats)}."></textarea></label>
          <label class="veld--bestand">
            <span class="veld__kop">Foto&rsquo;s van de situatie <em>optioneel</em></span>
            <input type="file" name="files" accept="image/*" multiple>
          </label>
          <button class="knop knop--licht" type="submit">Offerte aanvragen</button>
          <p class="form__melding" role="alert" hidden></p>
          <p class="form__klein">Uw gegevens gebruiken we alleen om op deze aanvraag te reageren. Maximaal vijf foto&rsquo;s van 10 MB.</p>
        </form>`;
}

export const BALK = (titel) => `<header class="balk">
  <div class="binnen">
    <a class="balk__logo" href="/" aria-label="RH Klusservice"><img src="/logo/rh-klusservice-breed.svg" alt="RH Klusservice" width="193" height="34"></a>
    <nav>
      <a href="/#diensten">Wat we doen</a>
      <a href="/#werkwijze">Werkwijze</a>
      <a href="/projecten/">Projecten</a>
      <a href="/#beoordelingen">Beoordelingen</a>
      <a class="knop knop--licht" href="tel:${TEL}">Bel ${TEL_TOON}</a>
    </nav>
    <!-- "Bellen:" voorop en niet alleen het nummer: het opschrift dat je ziet moet in
         de voorleesnaam terugkomen, anders kan iemand die de site met zijn stem bedient
         "bellen" zeggen zonder dat deze knop reageert (label-content-name-mismatch). -->
    <a class="knop knop--licht balk__mob" href="tel:${TEL}" aria-label="Bellen: ${TEL_TOON}">
      <span class="balk__bel-lang">Bellen</span>
      <svg class="balk__bel-kort" viewBox="0 0 24 24" aria-hidden="true"><path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1l-2.3 2.2Z"/></svg>
    </a>
  </div>
</header><!-- ${vlucht(titel)} -->`;

export const VOET = `<footer class="voet">
  <div class="binnen">
    <div class="voet__top">
      <img src="/logo/rh-klusservice-breed.svg" alt="RH Klusservice" width="216" height="38">
    </div>
    <div class="voet__plaatsen">
      <p>Op zoek naar een timmerman of klusjesman in uw plaats?</p>
      <div class="plaatsen">
${PLAATSEN.map((p) => `        <a href="/${p.slug}/">${p.naam}</a>`).join('\n')}
      </div>
      <!-- De slotpagina staat bewust niet op de homepagina (verzoek Armando
           07-10-2026). Via deze voet is hij wel vanaf de plaatspagina's te
           bereiken, dus Google komt er in twee stappen bij zonder dat het op
           de homepagina staat. Weghalen = de pagina alleen nog in sitemap.xml. -->
      <p class="voet__los">Ook: <a href="/${SLOT_SLUG}/">slot vervangen of buitengesloten in Valkenswaard</a></p>
    </div>
    <div class="voet__onder">
      <span>RH Klusservice &middot; Valkenswaard &middot; <a href="tel:${TEL}">${TEL_TOON}</a> &middot; <a href="mailto:${MAIL}">${MAIL}</a></span>
      <span>KvK 92724418 &middot; BTW NL004973060B79</span>
    </div>
  </div>
</footer>`;

export const ZWEEF = `<a class="zweef" href="${WA}" rel="noopener" aria-label="WhatsApp RH Klusservice">
  <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15l-1.3 4.8 5-1.3A10 10 0 1 0 12 2Zm5.8 14.2c-.2.7-1.2 1.3-2 1.4-.5.1-1.2.2-3.5-.8-2.9-1.2-4.8-4.2-5-4.4-.1-.2-1.1-1.5-1.1-2.9 0-1.4.7-2 1-2.3.2-.3.6-.4.8-.4h.6c.2 0 .4 0 .7.5l.9 2.2c.1.2 0 .4-.1.6l-.4.5c-.1.2-.3.3-.1.6.1.3.6 1.2 1.4 1.9 1 .9 1.8 1.1 2.1 1.3.2.1.4 0 .6-.1l.8-1c.2-.2.4-.2.6-.1l2.1 1c.3.1.5.2.5.4.1.2.1.9-.1 1.6Z"/></svg>
  <span class="zweef__woord">WhatsApp</span>
</a>`;

