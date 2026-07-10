import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CalendarCheck,
  Check,
  ChevronDown,
  ExternalLink,
  Flower2,
  Heart,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Scissors,
  Sparkles,
  Star,
  WandSparkles,
  X,
} from 'lucide-react';
import { useLang } from './hooks/useLang';
import LangToggle from './components/LangToggle';
import type { Lang } from './translations';

const bookingEmbedUrl = 'https://bloomingbrow-salon.salonized.com/bookings/new?layout=embed';
const instagramUrl = 'https://www.instagram.com/bloomingbrow/';
const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Bloomingbrow%20salon%20Tanjagroenplein%206%20Schagen';
const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Tanjagroenplein+6,+1741CZ+Schagen';
const phoneDisplay = '06 51720796';
const phoneHref = 'tel:+31651720796';
const whatsappUrl = 'https://wa.me/31651720796';
const email = 'bloomingbrowsalon@gmail.com';
const termsUrl = 'https://drive.google.com/file/d/1tSKFI6zEMIHyykQRMQ2Thdp4CoVJVoF6/view?usp=sharing';

type Copy = {
  nav: string[];
  book: string;
  app: string;
  heroKicker: string;
  heroTitle: string;
  heroSub: string;
  heroTrust: string[];
  proof: { value: string; label: string }[];
  introKicker: string;
  introTitle: string;
  introText: string;
  introPoints: string[];
  aboutKicker: string;
  aboutTitle: string;
  aboutLead: string;
  aboutBody: string[];
  aboutSignoff: string;
  aboutTags: string[];
  signatureKicker: string;
  signatureTitle: string;
  signatureSub: string;
  priceKicker: string;
  priceTitle: string;
  priceSub: string;
  popular: string;
  min: string;
  processKicker: string;
  processTitle: string;
  resultsKicker: string;
  resultsTitle: string;
  resultsSub: string;
  powderTab: string;
  hybridTab: string;
  trainingKicker: string;
  trainingTitle: string;
  trainingSub: string;
  trainingItems: { title: string; sub: string }[];
  galleryKicker: string;
  galleryTitle: string;
  gallerySub: string;
  reviewsKicker: string;
  reviewsTitle: string;
  reviewsSub: string;
  allReviews: string;
  visitKicker: string;
  visitTitle: string;
  visitSub: string;
  route: string;
  contact: string;
  hours: string;
  faqKicker: string;
  faqTitle: string;
  faqTermsText: string;
  faqTermsLink: string;
  ctaKicker: string;
  ctaTitle: string;
  ctaSub: string;
  footer: string;
};

const copy: Record<Lang, Copy> = {
  nl: {
    nav: ['Over Bloem', 'Behandelingen', 'Resultaten', 'Reviews', 'Bezoek'],
    book: 'Boek nu',
    app: 'App Bloem',
    heroKicker: 'PMU brows en browstyling in Schagen',
    heroTitle: 'Brows die jouw gezicht laten spreken.',
    heroSub:
      'Ik kijk niet alleen naar je wenkbrauwen, maar naar je hele gezicht. In mijn salon in Schagen neem ik de tijd voor vorm, kleur en uitleg, zodat je brows verzorgd voelen en echt bij jou passen.',
    heroTrust: ['5,0 op Google', 'Persoonlijke aandacht', 'Online boeken'],
    proof: [
      { value: '5,0', label: 'Google rating' },
      { value: 'PMU', label: 'Gecertificeerd' },
      { value: '1-op-1', label: 'Persoonlijk' },
      { value: '6 dagen', label: 'Per week open' },
    ],
    introKicker: 'Welkom bij Bloomingbrow',
    introTitle: 'Een salon waar je niet alleen mooier weggaat, maar ook stralender binnenkomt.',
    introText:
      'Bloomingbrow is klein, persoonlijk en precies. Bloem neemt de tijd om naar jouw gezicht, je natuurlijke haargroei en je voorkeur te kijken. Zo ogen je brows nooit gemaakt, maar verzorgd, fris en in balans.',
    introPoints: ['Persoonlijke browmapping', 'Rustige uitleg bij elke stap', 'Lashes, brows en PMU op één plek'],
    aboutKicker: 'Meet your PMU artist',
    aboutTitle: 'Hi, ik ben Bloem 🌸',
    aboutLead:
      'Ik ben Bloem Boekel, 22, en ik woon in het mooie Schagen. Een half jaar geleden zette ik een van de spannendste stappen van mijn leven: mijn eigen salon openen.',
    aboutBody: [
      'Al van jongs af aan ben ik gek op beauty en verzorging. Ik vind het geweldig hoe een beetje aandacht al zoveel verschil kan maken. Dat gevoel wil ik doorgeven.',
      'In mijn salon kan ik mijn creativiteit en passie kwijt. Elke klant geeft me nieuwe energie. Ik vind het bijzonder dat mensen mij vertrouwen met hun look en dat ik ze help om zich nog mooier, zelfverzekerder en stralender te voelen. Dat blijft speciaal.',
      'Het afgelopen half jaar is voorbij gevlogen. Ik heb veel geleerd, mooie mensen ontmoet, en ik hoop nog lang door te groeien om nog meer mensen blij te maken.',
    ],
    aboutSignoff: 'Op naar nog veel meer mooie momenten en glans ✨ Liefs, Bloem',
    aboutTags: ['Allround browstylist', 'Powderbrows basic course', 'PMU', 'Schagen'],
    signatureKicker: 'Wat ik aanbied',
    signatureTitle: 'Vier behandelingen, één doel: jouw look in balans.',
    signatureSub:
      'Voor strakke shape, frisse kleur, gelifte wimpers of langer wakker worden met vorm. Kies wat bij jou past.',
    priceKicker: 'Behandelingen en prijzen',
    priceTitle: 'Alle prijzen overzichtelijk bij elkaar.',
    priceSub:
      'Boek online jouw moment, dan zie je meteen de beschikbare tijden. Twijfel je over wat past? App me even.',
    popular: 'Populair',
    min: 'min',
    processKicker: 'Jouw afspraak',
    processTitle: 'Rustig, duidelijk en precies.',
    resultsKicker: 'Echte klanten · echte resultaten',
    resultsTitle: 'Brows die in jouw gezicht thuishoren.',
    resultsSub:
      'Een greep uit recente powderbrows en hybrid tint resultaten: geen filters, geen retouche, alleen mooi werk.',
    powderTab: 'Powderbrows',
    hybridTab: 'Hybrid tint',
    trainingKicker: 'Opgeleid en bijgehouden',
    trainingTitle: 'Het werk van Bloem rust op échte certificering.',
    trainingSub:
      'Voor PMU op je gezicht hoor je te weten wie er werkt. Bloem volgde haar opleidingen bij gecertificeerde academies en houdt haar werkwijze, kleurkennis en hygiëne actueel.',
    trainingItems: [
      { title: 'Allround browstylist', sub: 'Browmapping, shape, hybrid tint, browlamination' },
      { title: 'Powderbrows basic course', sub: 'PMU pigment, machine en huidkennis' },
    ],
    galleryKicker: 'In de salon',
    galleryTitle: 'Een kijkje in Bloomingbrow.',
    gallerySub:
      'Van de salon en behandelingen tot de kleine details: de uitstraling blijft zacht, vrouwelijk en professioneel.',
    reviewsKicker: 'Google reviews',
    reviewsTitle: 'Klanten voelen zich op hun gemak en zien het verschil.',
    reviewsSub:
      'De reviews noemen vooral Bloems precisie, haar rustige uitleg en het mooie eindresultaat.',
    allReviews: 'Bekijk reviews',
    visitKicker: 'Schagen',
    visitTitle: 'Boek jouw browmoment aan het Tanjagroenplein.',
    visitSub:
      'Bloomingbrow salon zit aan Tanjagroenplein 6 in Schagen, achter de Picobello. Parkeren kan voor de deur.',
    route: 'Route openen',
    contact: 'Contact',
    hours: 'Openingstijden',
    faqKicker: 'Goed om te weten',
    faqTitle: 'Veelgestelde vragen',
    faqTermsText:
      'Belangrijk: Lees vóór het maken van je afspraak onze algemene voorwaarden zorgvuldig door. Bij het bevestigen van je afspraak ga je akkoord met deze voorwaarden.',
    faqTermsLink: 'Algemene voorwaarden',
    ctaKicker: 'Zin in een nieuwe look?',
    ctaTitle: 'Boek met mij. Ik kijk er naar uit.',
    ctaSub: 'Boek online of stuur me even een appje. Ik denk graag mee over wat bij jou past.',
    footer: 'Bloomingbrow salon · PMU brows, browstyling en lashes in Schagen.',
  },
  en: {
    nav: ['About Bloem', 'Treatments', 'Results', 'Reviews', 'Visit'],
    book: 'Book now',
    app: 'WhatsApp Bloem',
    heroKicker: 'PMU brows and brow styling in Schagen',
    heroTitle: 'Brows that let your face speak.',
    heroSub:
      'I don\'t just look at your brows, I look at your whole face. In my salon in Schagen I take the time for shape, colour and explanation, so your brows feel groomed and truly suit you.',
    heroTrust: ['5.0 on Google', 'Personal attention', 'Online booking'],
    proof: [
      { value: '5.0', label: 'Google rating' },
      { value: 'PMU', label: 'Certified' },
      { value: '1-on-1', label: 'Personal' },
      { value: '6 days', label: 'Open weekly' },
    ],
    introKicker: 'Welcome to Bloomingbrow',
    introTitle: 'A studio where you leave prettier and arrive feeling lighter.',
    introText:
      'Bloomingbrow is small, personal and precise. Bloem takes time to look at your face, natural growth and your wishes. So brows look groomed and balanced, never overdone.',
    introPoints: ['Personal brow mapping', 'Calm, step-by-step explanation', 'Lashes, brows and PMU in one place'],
    aboutKicker: 'Meet your PMU artist',
    aboutTitle: 'Hi, I\'m Bloem 🌸',
    aboutLead:
      'I\'m Bloem Boekel, 22, and I live in beautiful Schagen. Half a year ago I took one of the most exciting steps of my life: opening my own salon.',
    aboutBody: [
      'I\'ve loved beauty and skincare since I was little. I love how a bit of attention can make such a difference. That\'s the feeling I want to pass on.',
      'In my salon I get to channel my creativity and passion. Every client gives me new energy. It\'s special that people trust me with their look and let me help them feel even more beautiful, confident and radiant.',
      'The past six months have flown by. I\'ve learned so much, met wonderful people, and I hope to keep growing so I can make many more clients smile.',
    ],
    aboutSignoff: 'Here\'s to many more lovely moments and glow ✨ Love, Bloem',
    aboutTags: ['All-round brow stylist', 'Powder brows basic course', 'PMU', 'Schagen'],
    signatureKicker: 'What I offer',
    signatureTitle: 'Four treatments, one goal: your look in balance.',
    signatureSub:
      'For a clean shape, fresh colour, lifted lashes or waking up with shape. Pick what suits you.',
    priceKicker: 'Treatments and prices',
    priceTitle: 'All prices in one clear overview.',
    priceSub:
      'Book online and you\'ll see live availability. Not sure what suits you? Send me a quick message.',
    popular: 'Popular',
    min: 'min',
    processKicker: 'Your appointment',
    processTitle: 'Calm, clear and precise.',
    resultsKicker: 'Real clients · real results',
    resultsTitle: 'Brows that belong on your face.',
    resultsSub:
      'A look at recent powder brows and hybrid tint results: no filters, no retouching, just clean work.',
    powderTab: 'Powder brows',
    hybridTab: 'Hybrid tint',
    trainingKicker: 'Trained and up to date',
    trainingTitle: 'Bloem\'s work rests on real certification.',
    trainingSub:
      'For PMU on your face, you should know who is working on you. Bloem trained at certified academies and keeps her technique, colour knowledge and hygiene current.',
    trainingItems: [
      { title: 'All-round brow stylist', sub: 'Brow mapping, shape, hybrid tint, brow lamination' },
      { title: 'Powder brows basic course', sub: 'PMU pigment, machine and skin knowledge' },
    ],
    galleryKicker: 'Inside the salon',
    galleryTitle: 'A look inside Bloomingbrow.',
    gallerySub:
      'From the salon and treatments to the small details: soft, feminine and professional throughout.',
    reviewsKicker: 'Google reviews',
    reviewsTitle: 'Clients feel at ease and see the difference.',
    reviewsSub:
      'Reviews often mention Bloem\'s precision, calm explanation and beautiful results.',
    allReviews: 'View reviews',
    visitKicker: 'Schagen',
    visitTitle: 'Book your brow moment at Tanjagroenplein.',
    visitSub:
      'Bloomingbrow salon is at Tanjagroenplein 6 in Schagen, behind Picobello. Parking right at the door.',
    route: 'Open route',
    contact: 'Contact',
    hours: 'Opening hours',
    faqKicker: 'Good to know',
    faqTitle: 'Frequently asked questions',
    faqTermsText:
      'Important: Please read our terms and conditions carefully before making your appointment. By confirming your appointment, you agree to these terms.',
    faqTermsLink: 'Terms and conditions',
    ctaKicker: 'Ready for a new look?',
    ctaTitle: 'Book with me. I can\'t wait.',
    ctaSub: 'Book online or send me a quick message. I\'m happy to think along about what suits you.',
    footer: 'Bloomingbrow salon · PMU brows, brow styling and lashes in Schagen.',
  },
};

const signatureTreatments = {
  nl: [
    {
      title: 'Powderbrows',
      text: 'Voor wie elke ochtend wakker wil worden met vorm. Bloem mapt eerst rustig uit en stemt de kleur af op jouw gezicht.',
      price: 'vanaf €250',
      duration: '240 min',
      image: '/powderbrows-new-3.webp',
      badge: 'PMU',
    },
    {
      title: 'Hybrid brows',
      text: 'Hybrid tint inclusief shape. Meer definitie doordat zowel haartjes als huid worden meegenomen, voor een vollere, strakkere en draagbare look.',
      price: '€37,50',
      duration: '60 min',
      image: '/hybrid-tint-new-1.webp',
      badge: 'Brow styling',
    },
    {
      title: 'Harsen & verven',
      text: 'De klassieker: shape met hars en een nette kleur. Voor een opgeruimde, frisse browlook in een kort half uurtje.',
      price: '€30,00',
      duration: '45 min',
      image: '/harsen-verven-result.webp',
      badge: 'Shape & tint',
    },
    {
      title: 'Lashlift',
      text: 'Een lift én verven van je eigen wimpers, voor open ogen en een wakker gezicht zonder mascara.',
      price: '€45,00',
      duration: '60 min',
      image: '/lashlift-result.webp',
      badge: 'Lashes',
    },
  ],
  en: [
    {
      title: 'Powder brows',
      text: 'For anyone who wants to wake up with shape every morning. Bloem maps first and matches the colour to your face.',
      price: 'from €250',
      duration: '240 min',
      image: '/powderbrows-new-3.webp',
      badge: 'PMU',
    },
    {
      title: 'Hybrid brows',
      text: 'Hybrid tint including shape. More definition because both hair and skin are tinted, for a fuller, cleaner and very wearable look.',
      price: '€37.50',
      duration: '60 min',
      image: '/hybrid-tint-new-1.webp',
      badge: 'Brow styling',
    },
    {
      title: 'Shape & tint',
      text: 'The classic: shape with wax and a neat tint. For a tidy, fresh brow look in a quick half hour.',
      price: '€30.00',
      duration: '45 min',
      image: '/harsen-verven-result.webp',
      badge: 'Shape & tint',
    },
    {
      title: 'Lash lift',
      text: 'A lift and tint of your own lashes, for open eyes and an awake face without mascara.',
      price: '€45.00',
      duration: '60 min',
      image: '/lashlift-result.webp',
      badge: 'Lashes',
    },
  ],
};

const serviceCategories = {
  nl: [
    {
      title: 'Brow behandelingen',
      icon: Scissors,
      services: [
        ['Only shape', '30', '€17,50'],
        ['Only tint', '45', '€18,50'],
        ['Shape & verven', '45', '€30,00'],
        ['Browlamination inclusief shape', '60', '€35,00'],
        ['Hybrid tint inclusief shape', '60', '€37,50'],
        ['Verven & shape PPD verf', '60', '€37,50'],
        ['Browlamination + hybrid tint & shape', '90', '€45,00'],
      ],
    },
    {
      title: 'Permanente make-up',
      icon: WandSparkles,
      services: [
        ['Powderbrows new set', '240', '€250,00'],
        ['Touch up', '120', '€50,00'],
        ['Extra touch up', '60', '€35,00'],
        ['Touch up binnen 10 maanden', '120', '€110,00'],
        ['Touch up binnen 12/18 maanden', '120', '€135,00'],
        ['Touch up binnen 18/24 maanden', '120', '€160,00'],
        ['Touch up binnen 24/30 maanden', '120', '€185,00'],
        ['Touch up andere salon', '180', '€195,00'],
      ],
    },
    {
      title: 'Lashes',
      icon: Sparkles,
      services: [
        ['Lashlift incl. verven', '60', '€45,00'],
        ['Wimpers verven', '20', '€15,00'],
      ],
    },
    {
      title: 'Extra behandelingen',
      icon: Check,
      services: [
        ['Kin harsen', '5', '€5,00'],
        ['Bovenlip harsen', '5', '€5,00'],
      ],
    },
  ],
  en: [
    {
      title: 'Brow treatments',
      icon: Scissors,
      services: [
        ['Only shape', '30', '€17.50'],
        ['Only tint', '45', '€18.50'],
        ['Shape & tint', '45', '€30.00'],
        ['Brow lamination incl. shape', '60', '€35.00'],
        ['Hybrid tint incl. shape', '60', '€37.50'],
        ['Tint & shape PPD dye', '60', '€37.50'],
        ['Brow lamination + hybrid tint & shape', '90', '€45.00'],
      ],
    },
    {
      title: 'Permanent make-up',
      icon: WandSparkles,
      services: [
        ['Powder brows new set', '240', '€250.00'],
        ['Touch up', '120', '€50.00'],
        ['Extra touch up', '60', '€35.00'],
        ['Touch up within 10 months', '120', '€110.00'],
        ['Touch up within 12/18 months', '120', '€135.00'],
        ['Touch up within 18/24 months', '120', '€160.00'],
        ['Touch up within 24/30 months', '120', '€185.00'],
        ['Touch up from another salon', '180', '€195.00'],
      ],
    },
    {
      title: 'Lashes',
      icon: Sparkles,
      services: [
        ['Lash lift incl. tint', '60', '€45.00'],
        ['Lash tint', '20', '€15.00'],
      ],
    },
    {
      title: 'Extras',
      icon: Check,
      services: [
        ['Chin waxing', '5', '€5.00'],
        ['Upper lip waxing', '5', '€5.00'],
      ],
    },
  ],
};

const processSteps = {
  nl: [
    ['Boek je moment', 'Kies online een tijd die past. Voor PMU kun je vooraf altijd eerst overleggen als je oude PMU hebt.'],
    ['Samen bepalen', 'Bloem bekijkt vorm, kleur en jouw wensen. Pas als de mapping klopt, begint de behandeling.'],
    ['Met nazorg naar huis', 'Je krijgt duidelijke uitleg, zodat je resultaat mooi kan genezen en langer verzorgd blijft.'],
  ],
  en: [
    ['Book your moment', 'Choose a time online. For PMU, always check first if you already have old permanent make-up.'],
    ['Map it together', 'Bloem looks at shape, colour and your wishes. The treatment starts once the mapping feels right.'],
    ['Leave with aftercare', 'You get clear guidance so the result can heal beautifully and stay polished longer.'],
  ],
};

const powderResults = [
  '/powderbrows-new-1.webp',
  '/powderbrows-new-2.webp',
  '/powderbrows-new-4.webp',
  '/powderbrows-new-5.webp',
  '/powderbrows-result-1.webp',
  '/powderbrows-result-2.webp',
  '/powderbrows-result-3.webp',
];

const hybridResults = [
  '/hybrid-tint-new-5.webp',
  '/hybrid-tint-new-2.webp',
  '/hybrid-tint-new-3.webp',
  '/hybrid-tint-new-4.webp',
  '/hybrid-tint-result-5.webp',
  '/hybrid-tint-result-1.webp',
  '/hybrid-tint-result-2.webp',
  '/hybrid-tint-result-3.webp',
  '/hybrid-tint-result-4.webp',
  '/hybrid-tint-result-6.webp',
];

const gallery = [
  ['/brand-shelf.webp', 'Sfeer in de salon'],
  ['/pmu-overhead.webp', 'PMU behandeling'],
  ['/bloem-with-cards.webp', 'Bloomingbrow visitekaartjes'],
  ['/brow-result-closeup.webp', 'Brow resultaat'],
  ['/hybrid-detail.webp', 'Hybrid tint detail'],
  ['/brand-business-card.webp', 'Bloomingbrow brand card'],
  ['/wax-application.webp', 'Harsen behandeling'],
  ['/products-conditioning.webp', 'Brow Code producten'],
];

const reviews = [
  {
    name: 'Maaike De Groot',
    text:
      'Ik ben bij Bloem langs geweest voor powder brows en ik ben onwijs blij met mijn nieuwe wenkbrauwen. Bloem is super vriendelijk en stelt je echt op je gemak.',
  },
  {
    name: 'Demi de Vos',
    text:
      'Bloem werkt super netjes en precies. Tijdens de afspraak werd ik goed verzorgd met drinken, snacks en gezelligheid. Het eindresultaat is ook echt prachtig.',
  },
  {
    name: 'Floor Bellis',
    text:
      'Bloem luistert goed naar je wensen en neemt echt de tijd om de juiste vorm van je wenkbrauwen te tekenen voordat ze begint.',
  },
  {
    name: 'Myrthe',
    text:
      'Bloem legt alles goed uit en denkt goed mee over je wensen. Je voelt je gelijk op je gemak bij Bloem, super fijn.',
  },
];

const hours = [
  ['Maandag', 'Monday', '14:00 - 21:00'],
  ['Dinsdag', 'Tuesday', '12:00 - 20:00'],
  ['Woensdag', 'Wednesday', '14:00 - 20:00'],
  ['Donderdag', 'Thursday', '14:00 - 20:00'],
  ['Vrijdag', 'Friday', '14:00 - 20:00'],
  ['Zaterdag', 'Saturday', '12:00 - 19:00'],
  ['Zondag', 'Sunday', 'gesloten'],
];

const faqs = {
  nl: [
    {
      q: 'Welke behandeling past bij mij?',
      a: 'Wil je vooral een nette vorm, kies dan shape of shape & verven. Wil je meer huidafdruk en definitie, dan is hybrid tint mooi. Wil je langer wakker worden met vorm, dan zijn powderbrows de meest complete keuze. Twijfel je? Stuur een appje, dan denk ik mee.',
    },
    {
      q: 'Kan ik powderbrows boeken als ik oude PMU heb?',
      a: 'Stuur altijd eerst een duidelijke foto van je wenkbrauwen zonder make-up. Dan kan ik beoordelen of er overheen gewerkt kan worden, of dat een touch up uit een andere salon beter past.',
    },
    {
      q: 'Waar zit de salon precies?',
      a: 'Bloomingbrow salon zit aan Tanjagroenplein 6 in Schagen, achter de Picobello. Parkeren kan voor de deur.',
    },
  ],
  en: [
    {
      q: 'Which treatment should I choose?',
      a: 'For a clean shape, choose shape or shape & tint. For more skin stain and definition, hybrid tint is a good option. For longer-lasting shape, powder brows are the most complete choice. Not sure? Send a message and I\'ll think along.',
    },
    {
      q: 'Can I book powder brows if I have old PMU?',
      a: 'Always send a clear photo of your brows without make-up first. I can then check whether I can work over it, or whether a touch up from another salon is the better path.',
    },
    {
      q: 'Where is the salon located?',
      a: 'Bloomingbrow salon is located at Tanjagroenplein 6 in Schagen, behind Picobello. Parking is available right at the door.',
    },
  ],
};

function Stars() {
  return (
    <span className="stars" aria-label="5 sterren">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} fill="currentColor" />
      ))}
    </span>
  );
}

function BookingModal({
  open,
  onClose,
  label,
}: {
  open: boolean;
  onClose: () => void;
  label: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="booking-modal" onClick={onClose} role="dialog" aria-modal="true" aria-label={label}>
      <div className="booking-frame" onClick={event => event.stopPropagation()}>
        <button type="button" className="booking-close" onClick={onClose} aria-label="Sluiten">
          <X size={20} />
        </button>
        <div className="booking-widget-shell">
          <iframe src={bookingEmbedUrl} title="Online boeken" allow="payment; geolocation" />
        </div>
      </div>
    </div>
  );
}

function StickyBook({ label, onBook }: { label: string; onBook: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 420);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky-book">
      <button type="button" onClick={onBook} className="btn btn-gold btn-wide">
        <CalendarCheck size={18} />
        {label}
      </button>
    </div>
  );
}

export default function App() {
  const { lang, setLang } = useLang();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [resultsTab, setResultsTab] = useState<'powder' | 'hybrid'>('powder');
  const c = copy[lang];
  const signature = signatureTreatments[lang];
  const categories = serviceCategories[lang];
  const steps = processSteps[lang];

  const navItems = useMemo(
    () => [
      ['#over', c.nav[0]],
      ['#behandelingen', c.nav[1]],
      ['#resultaten', c.nav[2]],
      ['#reviews', c.nav[3]],
      ['#bezoek', c.nav[4]],
    ],
    [c.nav],
  );

  const openBooking = () => {
    setMenuOpen(false);
    setBookingOpen(true);
  };

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  const activeResults = resultsTab === 'powder' ? powderResults : hybridResults;

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a href="#top" className="brand" aria-label="Bloomingbrow salon">
          <span>Blooming<span>brow</span></span>
          <small>Salon Schagen · est. 2025</small>
        </a>

        <nav className="nav-links" aria-label="Hoofdnavigatie">
          {navItems.map(([href, label]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <LangToggle lang={lang} setLang={setLang} compact />
          <button type="button" className="btn btn-gold nav-book" onClick={openBooking}>
            <CalendarCheck size={16} />
            {c.book}
          </button>
          <button
            className="menu-button"
            type="button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map(([href, label]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <button type="button" className="btn btn-gold btn-wide" onClick={openBooking}>
              <CalendarCheck size={18} />
              {c.book}
            </button>
          </div>
        )}
      </header>

      <main id="top">
        <section className="hero-section">
          <img src="/bloem-portrait-hero.webp" alt="" className="hero-bg" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="hero-content">
            <div className="hero-copy">
              <span className="kicker kicker-light">{c.heroKicker}</span>
              <h1>{c.heroTitle}</h1>
              <p>{c.heroSub}</p>
              <div className="hero-actions">
                <button type="button" className="btn btn-gold" onClick={openBooking}>
                  <CalendarCheck size={18} />
                  {c.book}
                </button>
                <a className="btn btn-light" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={18} />
                  {c.app}
                </a>
              </div>
              <div className="hero-trust">
                {c.heroTrust.map(item => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>

            <div className="hero-collage" aria-hidden="true">
              <div className="hero-photo hero-photo-main">
                <img src="/bloem-portrait-hero.webp" alt="" />
              </div>
              <div className="hero-photo hero-photo-portrait">
                <img src="/brow-result-closeup.webp" alt="" />
              </div>
              <div className="hero-photo hero-photo-result">
                <img src="/brand-business-card.webp" alt="" />
              </div>
              <div className="hero-note">
                <Stars />
                <strong>5,0 Google</strong>
                <span>{lang === 'nl' ? 'Bij Bloem zelf' : 'With Bloem herself'}</span>
              </div>
            </div>
          </div>
        </section>

        <section className="proof-strip" aria-label="Vertrouwen">
          {c.proof.map(item => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </section>

        <section className="intro-section">
          <div className="intro-copy">
            <span className="kicker">{c.introKicker}</span>
            <h2>{c.introTitle}</h2>
          </div>
          <div className="intro-text">
            <p>{c.introText}</p>
            <div className="check-list">
              {c.introPoints.map(point => (
                <span key={point}>
                  <Check size={16} />
                  {point}
                </span>
              ))}
            </div>
          </div>
        </section>

        <section id="over" className="about-section">
          <div className="about-images">
            <img src="/bloem-portrait-tablet.webp" alt="Bloem Boekel in haar salon" loading="lazy" />
            <div className="about-mini">
              <img src="/bloem-with-brushes.webp" alt="Bloem met browbrushes" loading="lazy" />
              <span>{lang === 'nl' ? 'Zacht, precies, persoonlijk' : 'Soft, precise, personal'}</span>
            </div>
          </div>
          <div className="about-copy">
            <span className="kicker">{c.aboutKicker}</span>
            <h2>{c.aboutTitle}</h2>
            <p className="section-lead">{c.aboutLead}</p>
            {c.aboutBody.map(paragraph => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <p className="about-signoff">
              <Heart size={16} />
              {c.aboutSignoff}
            </p>
            <div className="tag-row">
              {c.aboutTags.map(tag => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </div>
        </section>

        <section id="behandelingen" className="signature-section">
          <div className="section-head center">
            <span className="kicker">{c.signatureKicker}</span>
            <h2>{c.signatureTitle}</h2>
            <p>{c.signatureSub}</p>
          </div>
          <div className="signature-grid">
            {signature.map((item, index) => (
              <article className="signature-card" key={item.title}>
                <div className="signature-image">
                  <img src={item.image} alt="" loading="lazy" />
                  <span>{index === 0 ? c.popular : item.badge}</span>
                </div>
                <div className="signature-body">
                  <div>
                    <p className="eyebrow">{item.badge}</p>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <div className="price-line">
                    <strong>{item.price}</strong>
                    <span>{item.duration}</span>
                  </div>
                  <button type="button" className="btn btn-outline btn-wide" onClick={openBooking}>
                    <CalendarCheck size={16} />
                    {c.book}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="resultaten" className="results-section">
          <div className="section-head center">
            <span className="kicker">{c.resultsKicker}</span>
            <h2>{c.resultsTitle}</h2>
            <p>{c.resultsSub}</p>
          </div>
          <div className="results-tabs" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={resultsTab === 'powder'}
              className={resultsTab === 'powder' ? 'active' : ''}
              onClick={() => setResultsTab('powder')}
            >
              {c.powderTab}
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={resultsTab === 'hybrid'}
              className={resultsTab === 'hybrid' ? 'active' : ''}
              onClick={() => setResultsTab('hybrid')}
            >
              {c.hybridTab}
            </button>
          </div>
          <div className="results-grid">
            {activeResults.map(src => (
              <figure key={src} className="result-card">
                <img src={src} alt="" loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section className="price-section">
          <div className="section-head">
            <span className="kicker">{c.priceKicker}</span>
            <h2>{c.priceTitle}</h2>
            <p>{c.priceSub}</p>
          </div>
          <div className="price-board">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <article className="price-category" key={category.title}>
                  <div className="price-category-head">
                    <span>
                      <Icon size={18} />
                    </span>
                    <h3>{category.title}</h3>
                  </div>
                  <ul>
                    {category.services.map(([name, duration, price]) => (
                      <li key={name}>
                        <div>
                          <strong>{name}</strong>
                          <small>
                            {duration} {c.min}
                          </small>
                        </div>
                        <span>{price}</span>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>
          <div className="price-actions">
            <button type="button" className="btn btn-gold" onClick={openBooking}>
              <CalendarCheck size={18} />
              {c.book}
            </button>
          </div>
        </section>

        <section className="training-section">
          <div className="training-grid">
            <div className="training-copy">
              <span className="kicker">{c.trainingKicker}</span>
              <h2>{c.trainingTitle}</h2>
              <p>{c.trainingSub}</p>
              <div className="training-list">
                {c.trainingItems.map(item => (
                  <div key={item.title} className="training-item">
                    <Award size={20} />
                    <div>
                      <strong>{item.title}</strong>
                      <span>{item.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="training-images">
              <img src="/certificate-allround.webp" alt="Certificate Allround Browstylist - Bloem Boekel" loading="lazy" />
              <img src="/certificate-powderbrows.webp" alt="Certificate Powder Brows Basic Course - Bloem Boekel" loading="lazy" />
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="section-head center">
            <span className="kicker">{c.processKicker}</span>
            <h2>{c.processTitle}</h2>
          </div>
          <div className="process-grid">
            {steps.map(([title, text], index) => (
              <article key={title} className="process-card">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery-section">
          <div className="section-head center">
            <span className="kicker kicker-light">{c.galleryKicker}</span>
            <h2>{c.galleryTitle}</h2>
            <p>{c.gallerySub}</p>
          </div>
          <div className="gallery-grid">
            {gallery.map(([src, alt]) => (
              <img key={src} src={src} alt={alt} loading="lazy" />
            ))}
          </div>
        </section>

        <section id="reviews" className="reviews-section">
          <div className="section-head">
            <span className="kicker">{c.reviewsKicker}</span>
            <h2>{c.reviewsTitle}</h2>
            <p>{c.reviewsSub}</p>
          </div>
          <div className="reviews-grid">
            {reviews.map(review => (
              <article className="review-card" key={review.name}>
                <Stars />
                <p>"{review.text}"</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
          <a className="btn btn-outline review-link" href={mapsUrl} target="_blank" rel="noreferrer">
            <Star size={16} />
            {c.allReviews}
          </a>
        </section>

        <section id="bezoek" className="visit-section">
          <div className="section-head center visit-head">
            <span className="kicker">{c.visitKicker}</span>
            <h2>{c.visitTitle}</h2>
            <p className="section-lead">{c.visitSub}</p>
          </div>

          <div className="visit-grid">
            <div className="visit-card">
              <div className="contact-block">
                <span>
                  <MapPin size={18} />
                </span>
                <div>
                  <small>{c.visitKicker}</small>
                  <strong>Tanjagroenplein 6, 1741 CZ Schagen</strong>
                  <a href={directionsUrl} target="_blank" rel="noreferrer">
                    {c.route} <ExternalLink size={12} />
                  </a>
                </div>
              </div>
              <div className="contact-block">
                <span>
                  <Phone size={18} />
                </span>
                <div>
                  <small>{c.contact}</small>
                  <a href={phoneHref}>{phoneDisplay}</a>
                  <a href={`mailto:${email}`}>{email}</a>
                </div>
              </div>
              <div className="contact-block">
                <span>
                  <Instagram size={18} />
                </span>
                <div>
                  <small>Instagram</small>
                  <a href={instagramUrl} target="_blank" rel="noreferrer">
                    @bloomingbrow
                  </a>
                </div>
              </div>
              <div className="hours-card">
                <div className="hours-title">
                  <Award size={18} />
                  <strong>{c.hours}</strong>
                </div>
                <ul>
                  {hours.map(([nl, en, time]) => (
                    <li key={nl}>
                      <span>{lang === 'nl' ? nl : en}</span>
                      <strong>{lang === 'en' && time === 'gesloten' ? 'closed' : time}</strong>
                    </li>
                  ))}
                </ul>
              </div>
              <button type="button" className="btn btn-gold btn-wide" onClick={openBooking}>
                <CalendarCheck size={18} />
                {c.book}
              </button>
            </div>

            <div className="map-card">
              <iframe
                title="Bloomingbrow salon op Google Maps"
                src="https://maps.google.com/maps?q=Tanjagroenplein+6,+1741CZ+Schagen&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: 360 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section className="faq-section">
          <div className="section-head center">
            <span className="kicker">{c.faqKicker}</span>
            <h2>{c.faqTitle}</h2>
          </div>
          <div className="faq-list">
            {faqs[lang].map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <article className="faq-item" key={faq.q}>
                  <button type="button" onClick={() => setOpenFaq(isOpen ? -1 : index)} aria-expanded={isOpen}>
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={isOpen ? 'rotate' : ''} />
                  </button>
                  {isOpen && <p>{faq.a}</p>}
                </article>
              );
            })}
          </div>
          <div className="faq-terms">
            <p>{c.faqTermsText}</p>
            <a href={termsUrl} target="_blank" rel="noreferrer">
              {c.faqTermsLink}
              <ExternalLink size={13} />
            </a>
          </div>
        </section>

        <section className="closing-cta">
          <div className="closing-cta-inner">
            <Flower2 size={28} />
            <span className="kicker kicker-light">{c.ctaKicker}</span>
            <h2>{c.ctaTitle}</h2>
            <p>{c.ctaSub}</p>
            <div className="closing-cta-actions">
              <button type="button" className="btn btn-gold" onClick={openBooking}>
                <CalendarCheck size={18} />
                {c.book}
              </button>
              <a className="btn btn-light" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                {c.app}
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <span>Bloomingbrow salon</span>
          <p>{c.footer}</p>
        </div>
        <div className="footer-links">
          <button type="button" onClick={openBooking}>
            <CalendarCheck size={16} />
            {c.book}
          </button>
          <a href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle size={16} />
            WhatsApp
          </a>
          <a href={`mailto:${email}`}>
            <Mail size={16} />
            Mail
          </a>
        </div>
      </footer>

      <StickyBook label={c.book} onBook={openBooking} />
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} label={c.book} />
    </div>
  );
}
