import type { ConfirmationEmailBrand, ConfirmationEmailCopy, LocalizedConfirmationEmailConfig } from '@jiw/cloudflare-forms';

/**
 * De bevestiging die een bezoeker terugkrijgt na een offerteaanvraag, in de huisstijl
 * van Pascal Hulskers Schilderwerken.
 *
 * Tot de verhuizing van 26-10-2026 verstuurde het formulier niets: build.mjs bundelde
 * de antwoorden tot een WhatsApp- of mailbericht en opende dat venster. Dat werkte,
 * maar het liet de bezoeker met niets achter - geen kopie, geen bevestiging, en bij een
 * geblokkeerd venster ook geen aanvraag. Dit is dus de eerste mail die iemand ooit van
 * Hulskers Schilderwerken krijgt, en de lezer is iemand die net heeft opgegeven hoeveel
 * vierkante meter wand hij heeft en wat hij ermee wil. Die mail moet eruitzien alsof hij
 * van Pascal komt en niet van een formulier.
 *
 * Twee randvoorwaarden geven hem zijn vorm. Hij draagt zijn merk, en hij moet
 * ongeschonden in een postvak aankomen: geen script, geen webfont (Barlow Condensed en
 * Inter bestaan niet in een mailprogramma, dus dit is Arial en doet niet anders
 * voorkomen), geen achtergrondfoto, een knop die een echt gevuld vakje met tekst is, en
 * een platte-tekstversie ernaast.
 *
 * Wat deze mail bewust NIET zegt, en dat is de helft van het werk:
 *
 *  - GEEN bedrag en geen richtprijs. De rekenhulp op de site rekent met 11, 17,50 en 23
 *    euro per m2, maar dat zijn tarieven vanaf 100 m2 en zonder dat iemand de wand
 *    gezien heeft. Een bedrag in een bevestigingsmail is een aanbod, en dat is Pascals
 *    werk en niet dat van een automaat.
 *  - GEEN reactietermijn. Hij heeft nooit gezegd binnen hoeveel dagen hij terugbelt, en
 *    een belofte daarover is de zijne om te doen. "Pascal neemt contact met u op" is wat
 *    de site al zegt; daar blijft het bij.
 *  - NIETS over of de wand behangklaar is of niet. Dat is precies het punt waarop deze
 *    site op 25-10-2026 acht dagen lang het tegenovergestelde beweerde van wat hij zelf
 *    schrijft ("ik ga wanden die niet behangklaar zijn, niet behangklaar maken!!"). Dat
 *    hoort in zijn eigen antwoord na een blik op de foto's, niet in een mail die
 *    niemand heeft gelezen.
 *
 * Wat hij wel draagt is zijn eigen motto, woordelijk uit zijn Marktplaats-advertentie:
 * "We gaan pas naar huis als de klant tevreden is." Dat is zijn zin en niet de onze.
 */

const SITE_URL = 'https://hulskersschilderwerken.nl';
const TEL = '06-20 41 82 67';

/** 440 breed voor een weergave op 220, zodat hij scherp blijft op een retina-scherm. */
const LOGO_URL = `${SITE_URL}/logo-mail.png`;

/*
 * Het palet komt uit :root in build.mjs, dus uit dezelfde bron als de site - en die
 * kleuren komen uit de zip die Armando op 19-10-2026 doorgaf.
 *
 *   --navy  #0B1E8A   de donkere band, koppen, links, de knop
 *   --blauw #2D6BFF   zijn felle accentblauw
 *   --inkt  #1F2937   lopende tekst
 *   --mist  #F3F4F6   achter de mail
 *   --lijn  #E3E6EC   randen
 *   --grijs #6B7280   de zachtste regel
 *
 * Twee afwijkingen van de site, en allebei om dezelfde reden: in een mail kun je het
 * contrast niet nameten met een script zoals meet.mjs dat op de pagina doet, dus is het
 * hier met de hand uitgerekend en staat het getal erbij.
 *
 *  - `accent` is NIET --blauw. Dat is de kleine regel boven de kop OP de donkere band,
 *    en #2D6BFF op #0B1E8A haalt 2,97:1 - onleesbaar. Het is een lichtere tint van
 *    dezelfde kleur (#93B4FF), die 6,5:1 haalt.
 *  - `button` is --navy en niet --blauw. Wit op #2D6BFF is 4,51:1 en gaat dus net over
 *    de grens; wit op #0B1E8A is 13,4:1. Een knop die een halve punt boven de lat
 *    hangt, is een knop die bij de volgende kleurwijziging eronder zakt.
 *
 * De rest, gemeten op wit: navy 13,4:1, inkt 14,7:1, grijs 4,8:1, de band 13,4:1.
 */
const COLORS = {
  pageBackground: '#F3F4F6',
  surface: '#ffffff',
  surfaceAlt: '#F7F8FB',
  border: '#E3E6EC',
  ink: '#0B1E8A',
  onInk: '#ffffff',
  inkSoft: '#1F2937',
  muted: '#6B7280',
  mutedSoft: '#4B5563',
  accent: '#93B4FF',
  button: '#0B1E8A',
  onButton: '#ffffff',
};

const BRAND: ConfirmationEmailBrand = {
  logoUrl: LOGO_URL,
  logoAlt: 'Pascal Hulskers Schilderwerken',
  logoWidth: 220,
  wordmark: 'Hulskers Schilderwerken',
  websiteUrl: SITE_URL,
  /*
   * Zijn eigen adres, en niet dat van LEAD_RECIPIENT.
   *
   * Dat is hier anders dan bij een site waar het pakket aanraadt dit weg te laten. De
   * reden om het weg te laten is dat je het adres van wie de leads vandaag ontvangt
   * (hallo@jouwidealewebsite.nl) in de mail van de klant aan ZIJN klant zet, en dat is
   * ons merk in het zijne. Dat geldt hier niet: dit is Pascals eigen adres, het staat
   * al openbaar op zijn site, in de voet en in de bedrijvengidsen.
   *
   * Dat was tot 27-10-2026 zijn gmail, terwijl de reply-to al naar
   * info@hulskersschilderwerken.nl ging: twee adressen van hem in een mail, waarbij
   * antwoorden op het ene uitkwam en aanklikken op het andere. Die open vraag is die dag
   * beantwoord (Armando: "we hebben inmiddels een info@hulskersschilderwerken.nl
   * aangemaakt"), dus het geprinte adres is nu hetzelfde adres.
   *
   * Het staat hier als tekst en niet als import uit inhoud.mjs, om dezelfde reden als
   * SITE_URL hierboven: dit bestand gaat de worker-bundel in en inhoud.mjs is de hele
   * sitecopy. Een adres op twee plekken is wel precies hoe deze twee een dag uit elkaar
   * konden lopen, dus er staat een poort op in plaats van een afspraak: tools/vooraf.mjs
   * regel 19 legt deze regel naast BEDRIJF.mail en zakt bij verschil (zelfde aanpak als
   * regel 7, die het formulieradres tegen worker/index.ts legt).
   */
  contactEmail: 'info@hulskersschilderwerken.nl',
  colors: COLORS,
};

/*
 * De veldnamen zoals de bezoeker ze op de pagina zag (T.offerte in inhoud.mjs). Wie
 * "Ongeveer aantal m2" heeft ingevuld hoort datzelfde woord terug te lezen en niet een
 * tweede formulering van hetzelfde idee.
 */
const VELDEN = {
  firstName: 'Uw naam',
  email: 'E-mail',
  tel: 'Telefoon',
  plaats: 'Plaats',
  m2: 'Ongeveer aantal m2',
  soort: 'Wat heeft u nodig?',
};

const NL: ConfirmationEmailCopy = {
  subject: 'Uw aanvraag is binnen - {siteName}',
  preheader: 'Uw offerteaanvraag is bij Pascal binnen. Hij neemt contact met u op.',
  greeting: 'Beste {name},',
  greetingWithoutName: 'Goedendag,',
  // `kicker` is de kleine regel boven de kop in de donkere band. Zonder deze regel
  // zet het pakket daar `detailsHeading` neer, en dan staat "Wat u heeft ingevuld"
  // twee keer op dezelfde mail: een keer in de band en een keer boven de tabel.
  kicker: 'Offerteaanvraag via de website',
  receiptMessage: 'Uw aanvraag is binnen',
  /*
   * Tweede zin: het formulier neemt geen bestanden aan, dus een foto van de wand is
   * iets wat de bezoeker nog NIET heeft kunnen geven en wat Pascal wel nodig heeft om
   * een prijs te kunnen noemen. Dat is iets anders dan de inspiratiefoto die bij
   * velvet-cakes uit deze mail ging: die vroeg om werk dat al in het formulier zat.
   *
   * Let op de apostrof in "foto's" - deze regel stond eerst tussen enkele quotes en
   * brak daar de string op. Vandaar dubbele quotes.
   */
  followUpMessage:
    "Pascal leest uw aanvraag en neemt contact met u op voor een prijs. Heeft u foto's van de wand, stuur ze dan gerust mee als antwoord op deze mail.",
  detailsHeading: 'Wat u heeft ingevuld',
  messageHeading: 'Waar het om gaat',
  referenceLabel: 'Kenmerk',
  fieldLabels: VELDEN,
  contactPrompt: `Wilt u iets toevoegen? Antwoord op deze mail, of bel of app ${TEL}.`,
  ctaLabel: 'Terug naar de website',
  // Zijn motto, woordelijk uit bron/zijn-tekst/marktplaats-advertentie.txt. Armando gaf
  // het op 19-10-2026 in zijn eigen woorden door ("mijn klussen zijn pas afgerond als
  // de klant tevreden is"); de advertentie heeft Pascals eigen formulering en die is
  // beter, dus die staat hier. Daaronder zijn bedrijfsgegevens, zodat zichtbaar is met
  // wie de bezoeker zaken doet.
  footerText:
    'We gaan pas naar huis als de klant tevreden is. - Pascal Hulskers Schilderwerken, Krimweg 109, 7741 MC Coevorden. KVK 04084180. U ontvangt deze mail omdat u een aanvraag heeft verstuurd op hulskersschilderwerken.nl.',
};

export const offerteConfirmationEmail: LocalizedConfirmationEmailConfig = {
  // De site is eentalig Nederlands, dus een tabel met een taal. Het pakket vraagt er
  // toch om, en dat is prima: komt er ooit een tweede taal bij, dan is dit de plek.
  defaultLocale: 'nl',
  translations: { nl: NL },
  brand: BRAND,
};
