import { useEffect, useState } from 'react';
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  X,
} from 'lucide-react';
import { useLang } from './hooks/useLang';
import LangToggle from './components/LangToggle';
import type { Lang } from './translations';

const bookingUrl =
  'https://soul-touch-2.salonized.com/widget_bookings/new?utm_source=site&utm_medium=widget&layout=embed';
const bookingPlainUrl =
  'https://soul-touch-2.salonized.com/widget_bookings/new?utm_source=site&utm_medium=widget';
const instagramUrl = 'https://www.instagram.com/soultouch.sneek/';
const facebookUrl = 'https://www.facebook.com/101661342733400';
const tiktokUrl = 'https://www.tiktok.com/@soultouch.sneek';
const phoneDisplay = '06 41150906';
const phoneHref = 'tel:+31641150906';
const whatsappUrl = 'https://wa.me/31641150906';
const mailHref = 'mailto:info@soultouchsneek.nl';
const mapsUrl =
  'https://www.google.com/maps/place/Soul+Touch+Sneek/@53.0326359,5.6624605,17z/data=!4m6!3m5!1s0x47c8f1b3c0657401:0x76e8ac3eaded3847!8m2!3d53.0326359!4d5.6624605';
const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Gedempte+Poortezijlen+4,+8601+BW+Sneek';
const mapEmbedUrl =
  'https://www.google.com/maps?q=Soul+Touch+Sneek+Gedempte+Poortezijlen+4+Sneek&output=embed';

type Copy = {
  navTreatments: string;
  navAtelier: string;
  navWork: string;
  navReviews: string;
  navTraining: string;
  navVisit: string;
  bookCta: string;
  messageCta: string;
  heroEyebrow: string;
  heroTitlePart1: string;
  heroTitleEm: string;
  heroSub: string;
  heroPortraitCaption: string;
  toc: { num: string; title: string; tag: string; href: string }[];
  atelierEyebrow: string;
  atelierTitle: string;
  atelierLead: string;
  atelierBody: string[];
  atelierSign: string;
  momentEyebrow: string;
  momentQuote: string;
  momentAttr: string;
  menuEyebrow: string;
  menuTitle: string;
  menuIntro: string;
  menuItems: { num: string; title: string; body: string }[];
  menuFoot: string;
  galleryEyebrow: string;
  galleryTitle: string;
  galleryIntro: string;
  reviewsEyebrow: string;
  reviewsTitle: string;
  reviews: { quote: string; name: string }[];
  reviewsLink: string;
  trainingEyebrow: string;
  trainingTitle: string;
  trainingBody: string;
  trainingDmCta: string;
  trainingWaCta: string;
  visitEyebrow: string;
  visitTitle: string;
  visitIntro: string;
  visitAddressLabel: string;
  visitPhoneLabel: string;
  visitMailLabel: string;
  visitInstaLabel: string;
  visitDirections: string;
  hoursTitle: string;
  hours: { day: string; time: string; closed?: boolean }[];
  footerTagline: string;
  footerExploreTitle: string;
  footerContactTitle: string;
  footerSocialTitle: string;
  footerCopy: string;
  bookingClose: string;
};

const copy: Record<Lang, Copy> = {
  nl: {
    navTreatments: 'Behandelingen',
    navAtelier: 'Atelier',
    navWork: 'Werk',
    navReviews: 'Reviews',
    navTraining: 'Training',
    navVisit: 'Bezoek',
    bookCta: 'Online boeken',
    messageCta: 'Stuur bericht',
    heroEyebrow: 'Slow Beauty Atelier, Sneek',
    heroTitlePart1: 'A slower approach',
    heroTitleEm: 'to beauty.',
    heroSub:
      'Een klein atelier aan de Gedempte Poortezijlen, gericht op brows en lashes. Met de tijd die jouw gezicht verdient.',
    heroPortraitCaption: 'Anna, eigenaresse',
    toc: [
      { num: '01', title: 'Atelier', tag: 'Over Anna', href: '#atelier' },
      { num: '02', title: 'Behandelingen', tag: 'De kaart', href: '#behandelingen' },
      { num: '03', title: 'Werk', tag: 'Recente resultaten', href: '#werk' },
      { num: '04', title: 'Reviews', tag: 'Klantverhalen', href: '#reviews' },
      { num: '05', title: 'Een moment', tag: 'Grand Prix 2025', href: '#moment' },
      { num: '06', title: 'Privé training', tag: '1-op-1, op aanvraag', href: '#training' },
      { num: '07', title: 'Bezoek', tag: 'Sneek · openingstijden', href: '#bezoek' },
    ],
    atelierEyebrow: 'Atelier',
    atelierTitle: 'Hi, ik ben Anna.',
    atelierLead:
      'Een klein atelier aan de Gedempte Poortezijlen. Wenkbrauwen en wimpers, met aandacht.',
    atelierBody: [
      'Van mijn eerste opleiding tot de specialisaties daarna heb ik me toegelegd op één vak: brows en lashes. Schoonheid is voor mij geen behandeling op de loop. Het is een moment dat jouw uitstraling versterkt, in een ruimte waar je jezelf kunt zijn.',
      'Ik werk rustig en precies. Vorm, kleur en wens bepalen we samen, voordat ik begin.',
    ],
    atelierSign: 'Black is my color. · Anna',
    momentEyebrow: 'Een moment in 2025',
    momentQuote:
      'Het draait niet om perfect zijn. Het draait om durven groeien.',
    momentAttr: 'Anna · 1e plaats Grand Prix, WULOP 2025',
    menuEyebrow: 'Behandelingen',
    menuTitle: 'De kaart.',
    menuIntro:
      'Live tarieven en beschikbaarheid zie je bij het boeken.',
    menuItems: [
      {
        num: '01',
        title: 'Brow lamination',
        body: 'Verzorgt, lift en vormt de haartjes voor een zachte, volle lijn. Wekenlang draagbaar.',
      },
      {
        num: '02',
        title: 'Hybrid brows',
        body: 'Brow lamination met hybrid tint. Haartje én huid krijgen kleur, voor extra definitie en een strakke, draagbare shape.',
      },
      {
        num: '03',
        title: 'Lash lift',
        body: 'Een lift en verven van je eigen wimpers. Open ogen, een wakkere blik en de mascara-look zonder mascara.',
      },
      {
        num: '04',
        title: 'Korean lash lift',
        body: 'Een fijnere techniek uit Zuid-Korea: intensere krul, natuurlijker effect en gemiddeld langer houdbaar dan de standaard lash lift.',
      },
      {
        num: '05',
        title: 'Powder brows',
        body: 'Semi-permanente make-up met een zachte schaduwtechniek. Subtiel ingepoederde wenkbrauwen, gemiddeld 1,5 tot 2 jaar mooi.',
      },
      {
        num: '06',
        title: 'Wenkbrauwen verven & shape',
        body: 'De klassieker, ingezet met aandacht voor symmetrie en de juiste kleur bij jouw huidtoon.',
      },
    ],
    menuFoot: 'Niet zeker wat past? Stuur een berichtje en ik denk graag mee.',
    galleryEyebrow: 'Werk',
    galleryTitle: 'Een greep uit recente behandelingen.',
    galleryIntro: 'Direct uit de salon.',
    reviewsEyebrow: 'In hun woorden',
    reviewsTitle: 'Wat klanten zeggen',
    reviews: [
      {
        quote:
          'Ik liet recent een Korean lash lift doen bij Anna, en ben helemaal verkocht. Ik had niet verwacht dat het resultaat zo mooi en zo lang houdbaar zou zijn.',
        name: 'Mariëta',
      },
      {
        quote:
          'Ik kom al verschillende keren bij Anna voor lash lifts en zou nergens anders heen gaan. Mijn wimpers blijven echt heel lang mooi.',
        name: 'Hindrika',
      },
      {
        quote:
          'Anna is zo lief, geduldig en rustig, en legt alles helder en stap voor stap uit. Geen vraag was te veel.',
        name: 'Arpine',
      },
      {
        quote:
          'Met veel twijfel liet ik mijn wenkbrauwen voor het eerst doen. Nu ben ik zó tevreden dat ik vaste klant wil blijven.',
        name: 'Lusine',
      },
      {
        quote:
          'Een warme, gezellige salon. Anna werkt met aandacht en het resultaat is fantastisch. Een aanrader.',
        name: 'M.R.',
      },
    ],
    reviewsLink: 'Lees alle reviews op Google',
    trainingEyebrow: 'Privé training',
    trainingTitle: '1-op-1 trainingen, op aanvraag.',
    trainingBody:
      'Voor lash lift, Korean lash lift en brow lamination geef ik privé trainingen met volledige begeleiding. Theorie, techniek, werken op modellen en een terugkommoment voor perfectionering. Stuur een berichtje voor data en informatie.',
    trainingDmCta: 'DM op Instagram',
    trainingWaCta: 'WhatsApp',
    visitEyebrow: 'Bezoek',
    visitTitle: 'Soul Touch in Sneek.',
    visitIntro:
      'In het hart van Sneek, op afspraak.',
    visitAddressLabel: 'Adres',
    visitPhoneLabel: 'Telefoon',
    visitMailLabel: 'Mail',
    visitInstaLabel: 'Instagram',
    visitDirections: 'Open route',
    hoursTitle: 'Openingstijden',
    hours: [
      { day: 'Maandag', time: 'gesloten', closed: true },
      { day: 'Dinsdag', time: '09:00 – 18:00' },
      { day: 'Woensdag', time: '09:00 – 17:00' },
      { day: 'Donderdag', time: '09:00 – 18:00' },
      { day: 'Vrijdag', time: '09:00 – 17:00' },
      { day: 'Zaterdag', time: '12:00 – 18:00' },
      { day: 'Zondag', time: 'gesloten', closed: true },
    ],
    footerTagline:
      'Een slow beauty atelier voor brows en lashes, in Sneek.',
    footerExploreTitle: 'Verkennen',
    footerContactTitle: 'Contact',
    footerSocialTitle: 'Sociaal',
    footerCopy: '© Soul Touch Sneek. Alle rechten voorbehouden.',
    bookingClose: 'Sluiten',
  },
  en: {
    navTreatments: 'Treatments',
    navAtelier: 'Atelier',
    navWork: 'Work',
    navReviews: 'Reviews',
    navTraining: 'Training',
    navVisit: 'Visit',
    bookCta: 'Book online',
    messageCta: 'Send a message',
    heroEyebrow: 'Slow Beauty Atelier, Sneek',
    heroTitlePart1: 'A slower approach',
    heroTitleEm: 'to beauty.',
    heroSub:
      'A small atelier on Gedempte Poortezijlen, focused on brows and lashes. With the time your face deserves.',
    heroPortraitCaption: 'Anna, owner',
    toc: [
      { num: '01', title: 'Atelier', tag: 'About Anna', href: '#atelier' },
      { num: '02', title: 'Treatments', tag: 'The menu', href: '#behandelingen' },
      { num: '03', title: 'Work', tag: 'Recent results', href: '#werk' },
      { num: '04', title: 'Reviews', tag: 'Client stories', href: '#reviews' },
      { num: '05', title: 'A moment', tag: 'Grand Prix 2025', href: '#moment' },
      { num: '06', title: 'Private training', tag: '1-on-1, on request', href: '#training' },
      { num: '07', title: 'Visit', tag: 'Sneek · opening hours', href: '#bezoek' },
    ],
    atelierEyebrow: 'Atelier',
    atelierTitle: "Hi, I'm Anna.",
    atelierLead:
      'A small atelier on Gedempte Poortezijlen. Brows and lashes, with care.',
    atelierBody: [
      'From my first training to the specialisations after, I have devoted myself to one craft: brows and lashes. Beauty for me is not a treatment on the run. It is a moment that strengthens your presence, in a room where you can be yourself.',
      'I work calmly and precisely. Shape, colour and wishes are decided together before I begin.',
    ],
    atelierSign: 'Black is my color. · Anna',
    momentEyebrow: 'A moment in 2025',
    momentQuote:
      "It's not about being perfect. It's about daring to grow.",
    momentAttr: 'Anna · 1st place Grand Prix, WULOP 2025',
    menuEyebrow: 'Treatments',
    menuTitle: 'The menu.',
    menuIntro:
      'Live rates and availability appear when you book.',
    menuItems: [
      {
        num: '01',
        title: 'Brow lamination',
        body: 'Cares for, lifts and shapes the hairs for a soft, full line. Wearable for weeks.',
      },
      {
        num: '02',
        title: 'Hybrid brows',
        body: 'Brow lamination with hybrid tint. Both hair and skin receive colour, for added definition and a clean, wearable shape.',
      },
      {
        num: '03',
        title: 'Lash lift',
        body: "A lift and tint of your own lashes. Open eyes, an awake gaze, and the mascara look without mascara.",
      },
      {
        num: '04',
        title: 'Korean lash lift',
        body: 'A finer technique from South Korea: more intense curl, a more natural effect and on average a longer-lasting result than the standard lift.',
      },
      {
        num: '05',
        title: 'Powder brows',
        body: 'Semi-permanent make-up using a soft shading technique. Subtly powdered brows, beautiful for around 1.5 to 2 years.',
      },
      {
        num: '06',
        title: 'Brow tint & shape',
        body: 'The classic, performed with attention to symmetry and the right colour for your skin tone.',
      },
    ],
    menuFoot: "Not sure what suits you? Send a message and I'll think along.",
    galleryEyebrow: 'Work',
    galleryTitle: 'A look at recent treatments.',
    galleryIntro: 'No filters, no retouching. Straight from the salon.',
    reviewsEyebrow: 'In their words',
    reviewsTitle: 'What clients say',
    reviews: [
      {
        quote:
          "I recently had a Korean lash lift by Anna and I'm absolutely thrilled. I hadn't expected the result to be so beautiful or so long-lasting.",
        name: 'Mariëta',
      },
      {
        quote:
          "I've had lash lifts done by Anna several times and I wouldn't go anywhere else. My lashes stay beautiful for a really long time.",
        name: 'Hindrika',
      },
      {
        quote:
          'Anna is so sweet, patient and calm, and explains everything clearly, step by step. No question was too much.',
        name: 'Arpine',
      },
      {
        quote:
          'With great hesitation I had my brows done for the first time. Now I am so happy I want to become a regular.',
        name: 'Lusine',
      },
      {
        quote:
          'A warm, welcoming salon. Anna works with care and the result is fantastic. Highly recommended.',
        name: 'M.R.',
      },
    ],
    reviewsLink: 'Read all reviews on Google',
    trainingEyebrow: 'Private training',
    trainingTitle: '1-on-1 trainings, on request.',
    trainingBody:
      'For lash lift, Korean lash lift and brow lamination I offer private trainings with full guidance. Theory, technique, working on models, and a follow-up moment for perfection. Send a message for dates and details.',
    trainingDmCta: 'DM on Instagram',
    trainingWaCta: 'WhatsApp',
    visitEyebrow: 'Visit',
    visitTitle: 'Soul Touch in Sneek.',
    visitIntro:
      'In the heart of Sneek, by appointment.',
    visitAddressLabel: 'Address',
    visitPhoneLabel: 'Phone',
    visitMailLabel: 'Mail',
    visitInstaLabel: 'Instagram',
    visitDirections: 'Open route',
    hoursTitle: 'Opening hours',
    hours: [
      { day: 'Monday', time: 'closed', closed: true },
      { day: 'Tuesday', time: '09:00 – 18:00' },
      { day: 'Wednesday', time: '09:00 – 17:00' },
      { day: 'Thursday', time: '09:00 – 18:00' },
      { day: 'Friday', time: '09:00 – 17:00' },
      { day: 'Saturday', time: '12:00 – 18:00' },
      { day: 'Sunday', time: 'closed', closed: true },
    ],
    footerTagline: 'A slow beauty atelier for brows and lashes, in Sneek.',
    footerExploreTitle: 'Explore',
    footerContactTitle: 'Contact',
    footerSocialTitle: 'Social',
    footerCopy: '© Soul Touch Sneek. All rights reserved.',
    bookingClose: 'Close',
  },
};

const galleryImages: { src: string; alt: Record<Lang, string> }[] = [
  {
    src: '/gallery-1-korean-lashlift.webp',
    alt: { nl: 'Korean lash lift resultaat', en: 'Korean lash lift result' },
  },
  {
    src: '/gallery-2-brow-lamination.webp',
    alt: { nl: 'Brow lamination met hybrid tint', en: 'Brow lamination with hybrid tint' },
  },
  {
    src: '/gallery-3-brow-transformation.webp',
    alt: { nl: 'Brow transformatie', en: 'Brow transformation' },
  },
  {
    src: '/gallery-4-powder-brows.webp',
    alt: { nl: 'Powder brows resultaat', en: 'Powder brows result' },
  },
  {
    src: '/gallery-5-lash-lift.webp',
    alt: { nl: 'Lash lift met wimperverf', en: 'Lash lift with tint' },
  },
  {
    src: '/gallery-6-combi.webp',
    alt: { nl: 'Brows en lashes gecombineerd', en: 'Brows and lashes combined' },
  },
];

function BookingModal({
  open,
  onClose,
  closeLabel,
}: {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="booking-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Online boeken"
      onClick={onClose}
    >
      <div className="booking-frame" onClick={event => event.stopPropagation()}>
        <button type="button" className="booking-close" onClick={onClose} aria-label={closeLabel}>
          <X size={20} />
        </button>
        <iframe src={bookingUrl} title="Online boeken" allow="payment; geolocation" />
      </div>
    </div>
  );
}

function StickyBook({ label, onBook }: { label: string; onBook: () => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 480);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!show) return null;

  return (
    <div className="sticky">
      <button type="button" onClick={onBook} className="btn btn-solid btn-wide">
        <CalendarCheck size={16} />
        {label}
      </button>
    </div>
  );
}

function Lightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.classList.remove('no-scroll');
    };
  }, [onClose]);

  return (
    <div className="lightbox-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <img src={src} alt={alt} />
    </div>
  );
}

export default function App() {
  const { lang, setLang } = useLang();
  const c = copy[lang];
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [zoomImage, setZoomImage] = useState<{ src: string; alt: string } | null>(null);

  const openBooking = () => {
    setMenuOpen(false);
    setBookingOpen(true);
  };

  useEffect(() => {
    document.body.classList.toggle('no-scroll', menuOpen);
    return () => document.body.classList.remove('no-scroll');
  }, [menuOpen]);

  const reviewCount = c.reviews.length;
  const review = c.reviews[reviewIdx];
  const prevReview = () => setReviewIdx(i => (i - 1 + reviewCount) % reviewCount);
  const nextReview = () => setReviewIdx(i => (i + 1) % reviewCount);

  const navItems = [
    [c.navTreatments, '#behandelingen'],
    [c.navAtelier, '#atelier'],
    [c.navWork, '#werk'],
    [c.navReviews, '#reviews'],
    [c.navVisit, '#bezoek'],
  ] as const;

  return (
    <>
      <header className="site-head">
        <a href="#top" className="brand-mark" aria-label="Soul Touch Sneek">
          <img src="/logo.png" alt="" />
          <span className="wordmark">
            <strong>Soul Touch</strong>
            <span>Sneek · Slow Beauty</span>
          </span>
        </a>

        <nav className="nav-links" aria-label="Hoofdnavigatie">
          {navItems.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="nav-lang">
            <LangToggle lang={lang} setLang={setLang} />
          </div>
          <button type="button" className="btn btn-outline nav-book" onClick={openBooking}>
            <CalendarCheck size={16} />
            {c.bookCta}
          </button>
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(v => !v)}
            aria-label="Menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {navItems.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
            <div className="mobile-menu-foot">
              <LangToggle lang={lang} setLang={setLang} variant="wide" />
              <button type="button" className="btn btn-solid btn-wide" onClick={openBooking}>
                <CalendarCheck size={18} />
                {c.bookCta}
              </button>
            </div>
          </div>
        )}
      </header>

      <main id="top">
        {/* HERO */}
        <section className="hero">
          <div className="hero-grid">
            <div>
              <p className="hero-eyebrow">{c.heroEyebrow}</p>
              <h1 className="hero-title">
                {c.heroTitlePart1}
                <em>{c.heroTitleEm}</em>
              </h1>
              <p className="hero-sub">{c.heroSub}</p>
              <div className="hero-cta">
                <button type="button" className="btn btn-solid" onClick={openBooking}>
                  <CalendarCheck size={18} />
                  {c.bookCta}
                </button>
                <a className="btn btn-ghost" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />
                  {c.messageCta}
                </a>
              </div>
            </div>
            <div>
              <figure className="hero-portrait">
                <img
                  src="/portrait-anna.webp"
                  alt="Anna, eigenaresse van Soul Touch"
                  fetchPriority="high"
                />
              </figure>
              <p className="hero-caption">{c.heroPortraitCaption}</p>
            </div>
          </div>
        </section>

        {/* TOC */}
        <nav className="toc" aria-label="Inhoud">
          <div className="toc-inner">
            {c.toc.map(item => (
              <a key={item.num} href={item.href} className="toc-row">
                <span className="toc-num">{item.num}</span>
                <span className="toc-title">{item.title}</span>
                <span className="toc-tag">{item.tag}</span>
              </a>
            ))}
          </div>
        </nav>

        {/* ATELIER */}
        <section id="atelier" className="about">
          <div className="about-grid">
            <figure className="about-figure">
              <img
                src="/atelier-anna.webp"
                alt="Anna aan het werk: brow lamination in het atelier"
                loading="lazy"
              />
            </figure>
            <div className="about-copy">
              <span className="eyebrow">{c.atelierEyebrow}</span>
              <h2>{c.atelierTitle}</h2>
              <p className="lead" style={{ marginTop: '1rem' }}>
                {c.atelierLead}
              </p>
              <div className="about-text">
                <p>{c.atelierBody[0]}</p>
                <p>{c.atelierBody[1]}</p>
              </div>
              <p className="about-sign">{c.atelierSign}</p>
            </div>
          </div>
        </section>

        {/* TREATMENTS */}
        <section id="behandelingen" className="menu">
          <div className="menu-inner">
            <div className="menu-head">
              <span className="eyebrow">{c.menuEyebrow}</span>
              <h2>{c.menuTitle}</h2>
              <p className="muted">{c.menuIntro}</p>
            </div>
            <ol className="menu-list">
              {c.menuItems.map(item => (
                <li key={item.num} className="menu-item">
                  <span className="menu-num">{item.num}</span>
                  <div className="menu-body">
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="menu-foot">{c.menuFoot}</p>
            <div className="menu-cta">
              <button type="button" className="btn btn-solid" onClick={openBooking}>
                <CalendarCheck size={18} />
                {c.bookCta}
              </button>
            </div>
          </div>
        </section>

        {/* GALLERY */}
        <section id="werk" className="gallery">
          <div className="gallery-head">
            <span className="eyebrow">{c.galleryEyebrow}</span>
            <h2>{c.galleryTitle}</h2>
            <p className="muted" style={{ maxWidth: '40ch' }}>
              {c.galleryIntro}
            </p>
          </div>
          <div className="gallery-grid">
            {galleryImages.map(img => (
              <figure
                key={img.src}
                onClick={() => setZoomImage({ src: img.src, alt: img.alt[lang] })}
              >
                <img src={img.src} alt={img.alt[lang]} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        {/* REVIEWS */}
        <section id="reviews" className="reviews">
          <div className="reviews-inner">
            <span className="eyebrow">{c.reviewsEyebrow}</span>
            <p className="reviews-quote" key={reviewIdx}>
              {review.quote}
            </p>
            <p className="reviews-attr">{review.name}</p>
            <div className="reviews-controls">
              <button type="button" onClick={prevReview} aria-label="Vorige review">
                <ChevronLeft size={18} />
              </button>
              <div className="reviews-dots" role="tablist" aria-label="Reviews">
                {c.reviews.map((_, i) => (
                  <span key={i} className={i === reviewIdx ? 'is-active' : ''} />
                ))}
              </div>
              <button type="button" onClick={nextReview} aria-label="Volgende review">
                <ChevronRight size={18} />
              </button>
            </div>
            <a className="reviews-link" href={mapsUrl} target="_blank" rel="noreferrer">
              {c.reviewsLink}
              <ChevronRight size={14} />
            </a>
          </div>
        </section>

        {/* MOMENT, WULOP 2025 */}
        <section id="moment" className="moment">
          <div className="moment-grid">
            <figure className="moment-figure">
              <img
                src="/wulop-trophy.webp"
                alt="Anna's hand op de Grand Prix WULOP 2025 trophy"
                loading="lazy"
              />
            </figure>
            <div className="moment-copy">
              <span className="eyebrow">{c.momentEyebrow}</span>
              <blockquote className="moment-quote">{c.momentQuote}</blockquote>
              <p className="moment-attr">{c.momentAttr}</p>
            </div>
          </div>
        </section>

        {/* TRAINING */}
        <section id="training" className="training">
          <div className="training-inner">
            <figure className="training-figure">
              <img src="/training-private.webp" alt="Privé training in het atelier" loading="lazy" />
            </figure>
            <div className="training-copy">
              <span className="eyebrow">{c.trainingEyebrow}</span>
              <h2>{c.trainingTitle}</h2>
              <p>{c.trainingBody}</p>
              <div className="training-actions">
                <a className="btn btn-solid" href={instagramUrl} target="_blank" rel="noreferrer">
                  <Instagram size={16} />
                  {c.trainingDmCta}
                </a>
                <a className="btn btn-outline" href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle size={16} />
                  {c.trainingWaCta}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* VISIT */}
        <section id="bezoek" className="visit">
          <div className="visit-grid">
            <div className="visit-copy">
              <span className="eyebrow">{c.visitEyebrow}</span>
              <h2>{c.visitTitle}</h2>
              <p>{c.visitIntro}</p>

              <div className="visit-list">
                <div className="visit-row">
                  <span className="label">{c.visitAddressLabel}</span>
                  <a className="value" href={directionsUrl} target="_blank" rel="noreferrer">
                    Gedempte Poortezijlen 4, 8601 BW Sneek
                  </a>
                </div>
                <div className="visit-row">
                  <span className="label">{c.visitPhoneLabel}</span>
                  <a className="value" href={phoneHref}>
                    {phoneDisplay}
                  </a>
                </div>
                <div className="visit-row">
                  <span className="label">{c.visitMailLabel}</span>
                  <a className="value" href={mailHref}>
                    info@soultouchsneek.nl
                  </a>
                </div>
                <div className="visit-row">
                  <span className="label">{c.visitInstaLabel}</span>
                  <a className="value" href={instagramUrl} target="_blank" rel="noreferrer">
                    @soultouch.sneek
                  </a>
                </div>
              </div>

              <div className="hours-list">
                {c.hours.map(row => (
                  <div key={row.day} className={`hours-row${row.closed ? ' closed' : ''}`}>
                    <span>{row.day}</span>
                    <span>{row.time}</span>
                  </div>
                ))}
              </div>

              <div className="visit-cta">
                <button type="button" className="btn btn-solid" onClick={openBooking}>
                  <CalendarCheck size={18} />
                  {c.bookCta}
                </button>
                <a className="btn btn-outline" href={directionsUrl} target="_blank" rel="noreferrer">
                  <MapPin size={16} />
                  {c.visitDirections}
                </a>
              </div>
            </div>
            <div className="map-wrap">
              <iframe
                title="Soul Touch Sneek op Google Maps"
                src={mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="foot">
        <div className="foot-inner">
          <div className="foot-brand">
            <img src="/logo.png" alt="" />
            <strong>Soul Touch Sneek</strong>
            <p>{c.footerTagline}</p>
          </div>
          <div className="foot-links">
            <div className="foot-col">
              <strong>{c.footerExploreTitle}</strong>
              {navItems.map(([label, href]) => (
                <a key={href} href={href}>
                  {label}
                </a>
              ))}
              <a href={bookingPlainUrl} target="_blank" rel="noreferrer">
                {c.bookCta}
              </a>
            </div>
            <div className="foot-col">
              <strong>{c.footerContactTitle}</strong>
              <a href={phoneHref}>
                <Phone size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />
                {phoneDisplay}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a href={mailHref}>
                <Mail size={12} style={{ display: 'inline', marginRight: '0.4rem' }} />
                info@soultouchsneek.nl
              </a>
              <a href={directionsUrl} target="_blank" rel="noreferrer">
                Gedempte Poortezijlen 4
              </a>
            </div>
            <div className="foot-col">
              <strong>{c.footerSocialTitle}</strong>
              <a href={instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
              <a href={facebookUrl} target="_blank" rel="noreferrer">
                Facebook
              </a>
              <a href={tiktokUrl} target="_blank" rel="noreferrer">
                TikTok
              </a>
              <a href={mapsUrl} target="_blank" rel="noreferrer">
                Google
              </a>
            </div>
          </div>
        </div>
        <div className="foot-fine container" style={{ marginTop: '3rem' }}>
          <span>{c.footerCopy}</span>
        </div>
      </footer>

      <StickyBook label={c.bookCta} onBook={openBooking} />
      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        closeLabel={c.bookingClose}
      />
      {zoomImage && (
        <Lightbox
          src={zoomImage.src}
          alt={zoomImage.alt}
          onClose={() => setZoomImage(null)}
        />
      )}
    </>
  );
}
