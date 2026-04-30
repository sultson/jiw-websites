import { useEffect, useMemo, useState } from 'react';
import {
  Award,
  CalendarCheck,
  Check,
  ChevronDown,
  ExternalLink,
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
      'Bij Bloomingbrow salon maakt Bloem zachte, strakke en draagbare brows die passen bij jouw gezicht. Van shape en hybrid tint tot powderbrows: rustig gezet, precies uitgemeten en altijd met aandacht voor jou.',
    heroTrust: ['5,0 op Google', '22 reviews', 'Online boeken'],
    proof: [
      { value: '5,0', label: 'Google rating' },
      { value: '22', label: 'Reviews' },
      { value: '2025', label: 'Eigen salon' },
      { value: '6 dagen', label: 'Per week open' },
    ],
    introKicker: 'Bloomingbrow salon',
    introTitle: 'Een browstudio waar je niet alleen mooier weggaat, maar ook zekerder binnenkomt.',
    introText:
      'Bloomingbrow is klein, persoonlijk en precies. Bloem neemt de tijd om te kijken naar je gezicht, je natuurlijke haargroei en wat jij mooi vindt, zodat je brows niet gemaakt ogen maar verzorgd, fris en in balans.',
    introPoints: ['Persoonlijke browmapping', 'Rustige uitleg voor elke stap', 'PMU en styling op een plek'],
    aboutKicker: 'Bloem Boekel',
    aboutTitle: 'Jong, ambitieus en precies de specialist die je bij je gezicht wilt laten werken.',
    aboutLead:
      'Bloem bouwde Bloomingbrow vanuit haar liefde voor beauty en verzorging. Je voelt dat aan alles: de rustige ontvangst, de nette voorbereiding, de duidelijke uitleg en het geduld waarmee ze elke vorm opbouwt.',
    aboutBody: [
      'In haar salon aan het Tanjagroenplein draait het niet om snel even wenkbrauwen doen. Bloem kijkt naar symmetrie, kleur, huid, gezichtsuitdrukking en vooral naar wat jij spannend of belangrijk vindt. Daardoor voelt een afspraak persoonlijk, ook als je voor de eerste keer PMU laat zetten.',
      'Haar kracht zit in zachte perfectie: brows die zichtbaar verschil maken zonder hard te worden. Strakker in de ochtend, frisser op foto, minder bijtekenen en meer vertrouwen in je eigen gezicht.',
      'Sinds 2025 staat ze met haar eigen naam op de deur. Dat maakt Bloomingbrow geen grote, anonieme salon, maar een plek waar Bloem zelf de lat legt en waar elke tevreden klant ook haar reputatie draagt.',
    ],
    aboutTags: ['Allround brow stylist', 'PMU powderbrows', 'Hybrid tint', 'Lashlift', 'Schagen'],
    signatureKicker: 'Meest gekozen',
    signatureTitle: 'Voor een zachte, verzorgde browlook die blijft hangen.',
    signatureSub:
      'Kies een snelle touch-up voor meer definitie, of ga voor powderbrows als je elke dag wakker wilt worden met vorm.',
    priceKicker: 'Behandelingen en prijzen',
    priceTitle: 'Alles wat je nodig hebt om direct te kiezen.',
    priceSub:
      'Actuele prijzen overzichtelijk bij elkaar. Boek online je moment, dan zie je meteen de beschikbare tijden.',
    popular: 'Populair',
    min: 'min',
    processKicker: 'Jouw afspraak',
    processTitle: 'Rustig, duidelijk en precies.',
    galleryKicker: 'Sfeer en resultaten',
    galleryTitle: 'Een kijkje in de wereld van Bloomingbrow.',
    gallerySub:
      'Van Bloem zelf tot browresultaten en de salon: de uitstraling blijft zacht, vrouwelijk en professioneel.',
    reviewsKicker: 'Google reviews',
    reviewsTitle: 'Klanten voelen zich op hun gemak en zien het verschil.',
    reviewsSub:
      'De reviews noemen vooral Bloems precisie, haar rustige uitleg en het mooie eindresultaat.',
    allReviews: 'Bekijk reviews',
    visitKicker: 'Schagen',
    visitTitle: 'Boek jouw browmoment aan het Tanjagroenplein.',
    visitSub: 'Je vindt Bloomingbrow salon aan Tanjagroenplein 6 in Schagen. Volgens de salon: achter de Picobello, parkeren voor de deur.',
    route: 'Route openen',
    contact: 'Contact',
    hours: 'Openingstijden',
    faqKicker: 'Goed om te weten',
    faqTitle: 'Veelgestelde vragen',
    footer: 'Bloomingbrow salon - PMU brows, browstyling en lashes in Schagen.',
  },
  en: {
    nav: ['About Bloem', 'Treatments', 'Results', 'Reviews', 'Visit'],
    book: 'Book now',
    app: 'WhatsApp Bloem',
    heroKicker: 'PMU brows and brow styling in Schagen',
    heroTitle: 'Brows that softly frame your face.',
    heroSub:
      'At Bloomingbrow salon, Bloem creates soft, polished and wearable brows that suit your face. From shaping and hybrid tint to powder brows: calm, precise and fully personal.',
    heroTrust: ['5.0 on Google', '22 reviews', 'Online booking'],
    proof: [
      { value: '5.0', label: 'Google rating' },
      { value: '22', label: 'Reviews' },
      { value: '2025', label: 'Own salon' },
      { value: '6 days', label: 'Open weekly' },
    ],
    introKicker: 'Bloomingbrow salon',
    introTitle: 'A brow studio where you leave prettier and arrive more confident.',
    introText:
      'Bloomingbrow is small, personal and precise. Bloem takes time to look at your face, natural brow growth and personal taste, so the result feels polished instead of overdone.',
    introPoints: ['Personal brow mapping', 'Calm step-by-step guidance', 'PMU and styling in one place'],
    aboutKicker: 'Bloem Boekel',
    aboutTitle: 'Young, ambitious and exactly the specialist you want near your face.',
    aboutLead:
      'Bloem built Bloomingbrow from her love for beauty and care. You feel it in the welcome, preparation, clear explanation and patience behind every shape.',
    aboutBody: [
      'At her salon on Tanjagroenplein, brows are never rushed. Bloem studies symmetry, colour, skin, facial expression and what matters to you, so even a first PMU appointment feels personal and calm.',
      'Her strength is soft perfection: brows that make a visible difference without looking harsh. Cleaner mornings, fresher photos, less filling in and more confidence in your own face.',
      'Since 2025, her own name is on the door. Bloomingbrow is not a large anonymous salon, but a place where Bloem sets the standard herself.',
    ],
    aboutTags: ['All-round brow stylist', 'PMU powder brows', 'Hybrid tint', 'Lash lift', 'Schagen'],
    signatureKicker: 'Most booked',
    signatureTitle: 'For a soft, groomed brow look that lasts.',
    signatureSub:
      'Choose a quick touch-up for more definition, or powder brows if you want to wake up with shape every day.',
    priceKicker: 'Treatments and prices',
    priceTitle: 'Everything you need to choose directly.',
    priceSub:
      'Current prices in one clear overview. Book online to see available time slots immediately.',
    popular: 'Popular',
    min: 'min',
    processKicker: 'Your appointment',
    processTitle: 'Calm, clear and precise.',
    galleryKicker: 'Atmosphere and results',
    galleryTitle: 'A look inside Bloomingbrow.',
    gallerySub:
      'From Bloem herself to brow results and the salon: soft, feminine and professional.',
    reviewsKicker: 'Google reviews',
    reviewsTitle: 'Clients feel at ease and see the difference.',
    reviewsSub:
      'Reviews often mention Bloem\'s precision, calm explanation and beautiful results.',
    allReviews: 'View reviews',
    visitKicker: 'Schagen',
    visitTitle: 'Book your brow moment at Tanjagroenplein.',
    visitSub: 'Bloomingbrow salon is located at Tanjagroenplein 6 in Schagen. According to the salon: behind Picobello, parking at the door.',
    route: 'Open route',
    contact: 'Contact',
    hours: 'Opening hours',
    faqKicker: 'Good to know',
    faqTitle: 'Frequently asked questions',
    footer: 'Bloomingbrow salon - PMU brows, brow styling and lashes in Schagen.',
  },
};

const signatureTreatments = {
  nl: [
    {
      title: 'Powderbrows new set',
      text: 'Voor wie elke ochtend vorm wil zonder hard getekende wenkbrauwen. Bloem tekent eerst rustig uit en stemt de kleur af op jouw gezicht.',
      price: '€250',
      duration: '240 min',
      image: '/brows-pmu-collage-2026-04-03.webp',
      badge: 'PMU',
    },
    {
      title: 'Hybrid tint incl. shape',
      text: 'Meer definitie doordat zowel haartjes als huid worden meegenomen. Ideaal als je brows voller en strakker mogen ogen.',
      price: '€37,50',
      duration: '60 min',
      image: '/brows-hybrid-result-2026-04-13.webp',
      badge: 'Brow styling',
    },
    {
      title: 'Browlamination + hybrid tint & shape',
      text: 'Voor een gelifte, volle browlook met styling, kleur en shape in een behandeling.',
      price: '€45',
      duration: '90 min',
      image: '/brow-lamination-result.webp',
      badge: 'Full brow',
    },
  ],
  en: [
    {
      title: 'Powder brows new set',
      text: 'For anyone who wants to wake up with shape every morning. Bloem maps first and matches the colour to your face.',
      price: '€250',
      duration: '240 min',
      image: '/brows-pmu-collage-2026-04-03.webp',
      badge: 'PMU',
    },
    {
      title: 'Hybrid tint incl. shape',
      text: 'More definition because both hair and skin are tinted. Ideal when your brows can look fuller and cleaner.',
      price: '€37.50',
      duration: '60 min',
      image: '/brows-hybrid-result-2026-04-13.webp',
      badge: 'Brow styling',
    },
    {
      title: 'Brow lamination + hybrid tint & shape',
      text: 'For a lifted, fuller brow look with styling, colour and shape in one treatment.',
      price: '€45',
      duration: '90 min',
      image: '/brow-lamination-result.webp',
      badge: 'Full brow',
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

const gallery = [
  ['/owner-brand-cards-2026-04-09.webp', 'Bloem met Bloomingbrow visitekaartjes'],
  ['/brows-hybrid-result-2026-04-13.webp', 'Hybrid brow resultaat'],
  ['/owner-bloem-intro-2025-12-05.webp', 'Bloem Boekel in de salon'],
  ['/brows-pmu-collage-2026-04-03.webp', 'Powderbrows resultaat'],
  ['/lash-lift-result.webp', 'Lashlift resultaat'],
  ['/salon-treatment-room.webp', 'Behandelruimte'],
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
      a: 'Wil je vooral een nette vorm, kies dan shape of shape & verven. Wil je meer huidafdruk en definitie, dan is hybrid tint mooi. Wil je langer wakker worden met vorm, dan zijn powderbrows de meest complete keuze.',
    },
    {
      q: 'Kan ik powderbrows boeken als ik oude PMU heb?',
      a: 'Stuur altijd eerst een duidelijke foto van je wenkbrauwen zonder make-up. Bloem kan dan beoordelen of er overheen gewerkt kan worden.',
    },
    {
      q: 'Waar zit de salon precies?',
      a: 'Bloomingbrow salon zit aan Tanjagroenplein 6 in Schagen, achter de Picobello. Parkeren kan voor de deur.',
    },
  ],
  en: [
    {
      q: 'Which treatment should I choose?',
      a: 'For a clean shape, choose shape or shape & tint. For more skin stain and definition, hybrid tint is a good option. For longer lasting shape, powder brows are the most complete choice.',
    },
    {
      q: 'Can I book powder brows if I have old PMU?',
      a: 'Always send a clear photo of your brows without make-up first. Bloem can then check whether she can work over it.',
    },
    {
      q: 'Where is the salon located?',
      a: 'Bloomingbrow salon is located at Tanjagroenplein 6 in Schagen, behind Picobello. Parking is available at the door.',
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

  return (
    <div className="site-shell">
      <header className="site-nav">
        <a href="#top" className="brand" aria-label="Bloomingbrow salon">
          <span>Blooming<span>brow</span></span>
          <small>Salon Schagen</small>
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
          <img src="/owner-brand-cards-2026-04-09.webp" alt="" className="hero-bg" fetchPriority="high" />
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
                <img src="/owner-brand-cards-2026-04-09.webp" alt="" />
              </div>
              <div className="hero-photo hero-photo-portrait">
                <img src="/owner-bloem-intro-2025-12-05.webp" alt="" />
              </div>
              <div className="hero-photo hero-photo-result">
                <img src="/brows-hybrid-result-2026-04-13.webp" alt="" />
              </div>
              <div className="hero-note">
                <Stars />
                <strong>5,0 Google</strong>
                <span>{lang === 'nl' ? '22 reviews' : '22 reviews'}</span>
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
            <img src="/owner-bloem-intro-2025-12-05.webp" alt="Bloem Boekel in haar salon" loading="lazy" />
            <div className="about-mini">
              <img src="/owner-brand-cards-2026-04-09.webp" alt="Bloem met Bloomingbrow visitekaartjes" loading="lazy" />
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

        <section id="resultaten" className="gallery-section">
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
