import { useEffect, useState } from 'react';
import {
  ArrowRight,
  CalendarCheck,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  Facebook,
  Flower2,
  Instagram,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { useLang } from './hooks/useLang';
import LangToggle from './components/LangToggle';
import BookingModal from './components/BookingModal';

const instagramUrl = 'https://www.instagram.com/nxkbeautyroom/';
const facebookUrl = 'https://www.facebook.com/p/NxkBeautyroom-61559652624932/';
const googleUrl = 'https://www.google.com/maps/search/?api=1&query=Nxkbeautyroom&query_place_id=ChIJlR2f4jhvyEcRP84WlUktn9Y';
const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Woldpromenade%2022%2C%208331%20JH%20Steenwijk';
const mapsEmbedUrl =
  'https://maps.google.com/maps?q=Woldpromenade%2022,%208331%20JH%20Steenwijk&t=&z=16&ie=UTF8&iwloc=&output=embed';

const nav = [
  ['nav.services', '#behandelingen'],
  ['nav.work', '#werk'],
  ['nav.reviews', '#reviews'],
  ['nav.visit', '#bezoek'],
  ['nav.faq', '#faq'],
];

type PriceItem = {
  name: string;
  duration: string;
  price: string;
};

type PriceCategory = {
  id: string;
  title: string;
  icon: typeof Sparkles;
  summaryKey: string;
  items: PriceItem[];
};

const priceCategories: PriceCategory[] = [
  {
    id: 'biab',
    title: 'BIAB',
    icon: Sparkles,
    summaryKey: 'price.biabSummary',
    items: [
      { name: 'BIAB nieuwe set', duration: '60 min', price: '€50,00' },
      { name: 'BIAB opvullen naturel', duration: '60 min', price: '€50,00' },
      { name: 'BIAB opvullen + gellak', duration: '60 min', price: '€50,00' },
      { name: 'BIAB nagelbijter nieuwe set', duration: '60 min', price: '€45,00' },
      { name: 'BIAB verwijderen', duration: '30 min', price: '€20,00' },
    ],
  },
  {
    id: 'acryl',
    title: 'Acryl',
    icon: ShieldCheck,
    summaryKey: 'price.acrylSummary',
    items: [
      { name: 'Nieuwe set acryl basis', duration: '120 min', price: '€60,00' },
      { name: 'Nieuwe set acryl + extreme nail art', duration: '120 min', price: '€60,00' },
      { name: 'Acryl opvullen', duration: '120 min', price: '€55,00' },
      { name: 'Acryl opvullen + freestyle nail art', duration: '120 min', price: '€55,00' },
      { name: 'Acryl verwijderen', duration: '30 min', price: '€25,00' },
    ],
  },
  {
    id: 'lashlift',
    title: 'Lashlift',
    icon: Eye,
    summaryKey: 'price.lashSummary',
    items: [{ name: 'Lashlift incl. verven', duration: '60 min', price: '€40,00' }],
  },
  {
    id: 'brows',
    title: 'Brows',
    icon: Flower2,
    summaryKey: 'price.browsSummary',
    items: [
      { name: 'Enkel wenkbrauwen verven', duration: '20 min', price: '€15,00' },
      { name: 'Enkel wenkbrauwen harsen & epileren', duration: '30 min', price: '€17,50' },
      { name: 'Classic brow treatment', duration: '45 min', price: '€27,50' },
      { name: 'Hennabrows treatment', duration: '60 min', price: '€32,50' },
      { name: 'Hybrid brow treatment', duration: '60 min', price: '€32,50' },
      { name: 'Browlift incl. verven', duration: '70 min', price: '€37,50' },
    ],
  },
  {
    id: 'combi',
    title: 'Combideals',
    icon: Star,
    summaryKey: 'price.combiSummary',
    items: [
      { name: 'Classic brow treatment + lashlift', duration: '65 min', price: '€60,00' },
      { name: 'Henna treatment + lashlifting', duration: '60 min', price: '€75,00' },
      { name: 'Browlifting + lashlifting', duration: '90 min', price: '€75,00' },
    ],
  },
  {
    id: 'extra',
    title: 'Teennagels, harsen & verwijderen',
    icon: Clock,
    summaryKey: 'price.extraSummary',
    items: [
      { name: 'Teennagels met gellak', duration: '60 min', price: '€30,00' },
      { name: 'Harsen bovenlip', duration: '10 min', price: '€7,50' },
      { name: 'Harsen kin', duration: '5 min', price: '€5,00' },
      { name: 'Harsen wenkbrauwen incl. epileren', duration: '30 min', price: '€17,50' },
      { name: 'Gellak verwijderen', duration: '15 min', price: '€15,00' },
      { name: 'Teennagels gel verwijderen', duration: '20 min', price: '€15,00' },
    ],
  },
];

type GalleryTab = 'nails' | 'brows' | 'lashes';
type GalleryImage = { src: string; alt: string; title: string; tag: string };

const galleryGroups: Record<GalleryTab, GalleryImage[]> = {
  nails: [
    { src: '/nails-clean-french-biab.webp', alt: 'Clean BIAB french nails', title: 'Clean french', tag: 'BIAB' },
    { src: '/nails-pink-gelx-art.webp', alt: 'Roze Gel-X nail art', title: 'Pink detail', tag: 'Gel-X' },
    { src: '/nails-gelx-yellow-art.webp', alt: 'Gele Gel-X set met nail art', title: 'Yellow art', tag: 'Gel-X art' },
    { src: '/nails-pink-gelx-ribbon.webp', alt: 'Roze Gel-X set met lintdetail', title: 'Ribbon nails', tag: 'Nail art' },
    { src: '/nails-gelx-floral-art.webp', alt: 'Gel-X nail art met bloemdetail', title: 'Soft florals', tag: 'Gel-X' },
    { src: '/nails-orange-koningsdag.webp', alt: 'Oranje Koningsdag nagels', title: 'Orange set', tag: 'Seasonal' },
    { src: '/nails-yellow-spring.webp', alt: 'Gele spring nails van Nxkbeautyroom', title: 'Spring yellow', tag: 'BIAB art' },
    { src: '/nails-glitter-biab.webp', alt: 'Glitter BIAB nagels', title: 'Glitter glow', tag: 'BIAB' },
    { src: '/nails-chrome-red.webp', alt: 'Chrome BIAB nagels', title: 'Chrome bloom', tag: 'BIAB' },
    { src: '/nails-red-acryl.webp', alt: 'Rode acryl nagels', title: 'Red acryl', tag: 'Acryl' },
    { src: '/nails-french-acryl.webp', alt: 'Acryl french nagels', title: 'Acryl french', tag: 'Acryl' },
    { src: '/nails-dots-biab.webp', alt: 'BIAB dots nail art', title: 'Dot detail', tag: 'BIAB' },
    { src: '/nails-blue-chrome.webp', alt: 'Blauwe chrome nagels', title: 'Blue chrome', tag: 'Chrome' },
    { src: '/nails-pink-dots-biab.webp', alt: 'Roze BIAB dots nagels', title: 'Pink dots', tag: 'BIAB' },
    { src: '/nails-deep-red-biab.webp', alt: 'Dieprode BIAB nagels', title: 'Deep red', tag: 'BIAB' },
  ],
  brows: [
    { src: '/brows-before-after.webp', alt: 'Brow treatment before and after', title: 'Brow resultaat', tag: 'Brows' },
    { src: '/brows-treatment-before-after.webp', alt: 'Brow treatment before and after', title: 'Defined brows', tag: 'Treatment' },
    { src: '/brows-soft-lift.webp', alt: 'Soft browlift result', title: 'Summer browlift', tag: 'Browlift' },
  ],
  lashes: [
    { src: '/lash-lift-result.webp', alt: 'Lashlift resultaat', title: 'Lifted lashes', tag: 'Lashlift' },
  ],
};

const featuredReviews = [
  {
    name: 'Joyce Rode',
    text: 'Noa denkt super goed met je mee! Ik had zelf nog nooit ervaring met nepnagels, maar voor mijn bruiloft wilde ik toch mooie nagels. De eerste keer koos ik voor BIAB en die bleven wekenlang mooi. Mijn trouwnagels waren echt perfect! Ik kijk met heel veel plezier terug naar de trouwfoto’s. Je kunt snel bij haar terecht, ze is super flexibel en de locatie is ook nog eens heel gezellig. Echt een aanrader!',
  },
  {
    name: 'Agnes Kapojos',
    text: "Ik kom nu al een aantal maanden bij Noa, ik ga altijd met plezier heen, en ga iedere keer met fantastische nagels weer de deur uit.. Noa weet wat ze doet, denkt mee en is erg netjes in het uitvoeren van haar werk. Ook m'n wimpers een keer laten liften, ook dit zag er nadien prachtig uit net zoals het harsen van m'n wenkbrauwen. Ik zou Noa zeker aanraden om naartoe te gaan 🩷",
  },
  {
    name: 'Annet de Ram',
    text: 'Elke keer zijn mijn nagels weer prachtig als ik hier vandaan kom! Ik ben er echt heel blij mee! Wimpers en wenkbrauwen is ook zeker een aanrader om hier te laten doen!',
  },
  {
    name: 'Noellia Voorn',
    text: 'Prachtige salon en ik ga altijd blij weg! Professioneel en gezellig. Dikke 5 sterren!',
  },
];

const compactReviews = ['sylvana Vos', 'Anna', 'Mae Ubak'];

const hours = [
  ['Maandag', 'Gesloten'],
  ['Dinsdag', 'Gesloten'],
  ['Woensdag', '09:00-20:00'],
  ['Donderdag', '09:00-21:00'],
  ['Vrijdag', '09:00-20:00'],
  ['Zaterdag', '14:00-17:00'],
  ['Zondag', 'Gesloten'],
];

function Stars() {
  return (
    <span className="stars" aria-label="5 sterren">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star key={index} size={16} fill="currentColor" strokeWidth={1.5} />
      ))}
    </span>
  );
}

function StickyBookCta({
  hidden,
  onBook,
  label,
}: {
  hidden: boolean;
  onBook: () => void;
  label: string;
}) {
  const [show, setShow] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 380);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;
    const observer = new IntersectionObserver(([entry]) => setFooterVisible(entry.isIntersecting), {
      rootMargin: '0px 0px -20% 0px',
    });
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  if (!show || hidden || footerVisible) return null;

  return (
    <div className="sticky-book">
      <button type="button" onClick={onBook}>
        <CalendarCheck size={18} />
        {label}
      </button>
    </div>
  );
}

function App() {
  const { lang, setLang, t } = useLang();
  const [bookingOpen, setBookingOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
  const [galleryTab, setGalleryTab] = useState<GalleryTab>('nails');
  const [openFaq, setOpenFaq] = useState(1);
  const [openPrice, setOpenPrice] = useState('biab');

  const gallery = galleryGroups[galleryTab];
  const faqItems = [1, 2, 3, 4, 5];
  const openLightbox = galleryIndex !== null;
  const treatmentHighlights = [
    {
      title: t('highlights.biabTitle'),
      body: t('highlights.biabBody'),
      image: '/nails-clean-french-biab.webp',
      meta: 'BIAB',
      price: 'vanaf €45',
    },
    {
      title: t('highlights.artTitle'),
      body: t('highlights.artBody'),
      image: '/nails-pink-gelx-ribbon.webp',
      meta: 'Gel-X',
      price: 'vanaf €50',
    },
    {
      title: t('highlights.acrylTitle'),
      body: t('highlights.acrylBody'),
      image: '/nails-red-acryl.webp',
      meta: 'Acryl',
      price: 'vanaf €55',
    },
    {
      title: t('highlights.browTitle'),
      body: t('highlights.browBody'),
      image: '/brows-treatment-before-after.webp',
      meta: 'Brows',
      price: 'vanaf €15',
    },
    {
      title: t('highlights.lashTitle'),
      body: t('highlights.lashBody'),
      image: '/lash-lift-result.webp',
      meta: 'Lashlift',
      price: '€40',
    },
    {
      title: t('highlights.combiTitle'),
      body: t('highlights.combiBody'),
      image: '/brows-before-after.webp',
      meta: 'Combideal',
      price: 'vanaf €60',
    },
  ];

  const navigateGallery = (dir: -1 | 1) => {
    setGalleryIndex((current) => {
      if (current === null) return current;
      return (current + dir + gallery.length) % gallery.length;
    });
  };

  return (
    <div className="site-shell">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Nxkbeautyroom">
          <img src="/nxk-logo-facebook.webp" alt="" />
          <span>Nxkbeautyroom</span>
        </a>

        <nav aria-label="Hoofdnavigatie">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {t(label)}
            </a>
          ))}
        </nav>

        <div className="header-actions">
          <LangToggle lang={lang} setLang={setLang} />
          <button type="button" className="button small" onClick={() => setBookingOpen(true)}>
            <CalendarCheck size={17} />
            {t('nav.book')}
          </button>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-bg" aria-hidden="true">
            <img src="/nails-clean-french-biab.webp" alt="" fetchPriority="high" />
          </div>
          <div className="hero-overlay" aria-hidden="true" />
          <div className="hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">{t('hero.kicker')}</p>
              <h1>{t('hero.title')}</h1>
              <p>{t('hero.body')}</p>
              <div className="hero-actions">
                <button type="button" className="button primary warm" onClick={() => setBookingOpen(true)}>
                  {t('hero.cta')}
                  <ArrowRight size={18} />
                </button>
                <a className="button glass" href="#behandelingen">
                  <Eye size={19} />
                  {t('hero.treatments')}
                </a>
              </div>
              <div className="hero-proof" aria-label={t('hero.rating')}>
                <span>{t('hero.rating')}</span>
                <span />
                <span>{t('hero.addressShort')}</span>
              </div>
            </div>
            <aside className="hero-card">
              <Stars />
              <strong>{t('hero.rating')}</strong>
              <span>{t('hero.reviews')}</span>
            </aside>
          </div>
        </section>

        <section className="strip" aria-label="Kernpunten">
          <div>
            <ShieldCheck size={20} />
            <strong>{t('strip.booking')}</strong>
            <span>{t('strip.bookingSub')}</span>
          </div>
          <div>
            <Star size={20} />
            <strong>{t('strip.rating')}</strong>
            <span>{t('strip.ratingSub')}</span>
          </div>
          <div>
            <MapPin size={20} />
            <strong>{t('strip.location')}</strong>
            <span>{t('strip.locationSub')}</span>
          </div>
          <div>
            <Clock size={20} />
            <strong>{t('strip.hours')}</strong>
            <span>{t('strip.hoursSub')}</span>
          </div>
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">{t('about.kicker')}</p>
            <h2>{t('about.title')}</h2>
          </div>
          <div className="copy-stack">
            <p>{t('about.body1')}</p>
            <p>{t('about.body2')}</p>
          </div>
        </section>

        <section id="studio" className="section studio-film" aria-label={t('studio.title')}>
          <div className="video-frame studio-video">
            <video
              src="/nxk-kerst-biab.mp4"
              autoPlay
              controls
              loop
              muted
              playsInline
              preload="metadata"
            />
          </div>
        </section>

        <section className="section highlight-section">
          <div className="section-heading">
            <p className="eyebrow">{t('highlights.kicker')}</p>
            <h2>{t('highlights.title')}</h2>
            <p>{t('highlights.sub')}</p>
          </div>
          <div className="highlight-grid">
            {treatmentHighlights.map((item) => (
              <article className="highlight-card" key={item.title}>
                <img src={item.image} alt="" loading="lazy" decoding="async" />
                <div>
                  <div className="highlight-meta">
                    <span>{item.meta}</span>
                    <b>{item.price}</b>
                  </div>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="behandelingen" className="section price-section">
          <div className="section-heading">
            <p className="eyebrow">{t('services.kicker')}</p>
            <h2>{t('services.title')}</h2>
            <p>{t('services.sub')}</p>
          </div>
          <div className="price-intro">
            <Sparkles size={18} />
            <span>{t('services.note')}</span>
          </div>
          <div className="price-list">
            {priceCategories.map((category) => {
              const Icon = category.icon;
              const isOpen = openPrice === category.id;
              return (
                <article className="price-category" key={category.id}>
                  <button
                    type="button"
                    onClick={() => setOpenPrice(isOpen ? '' : category.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="price-icon">
                      <Icon size={18} />
                    </span>
                    <span>
                      <strong>{category.title}</strong>
                      <small>{t(category.summaryKey)}</small>
                    </span>
                    <ChevronDown size={20} className={isOpen ? 'rotate' : ''} />
                  </button>
                  {isOpen && (
                    <ul>
                      {category.items.map((item) => (
                        <li key={`${category.id}-${item.name}`}>
                          <span>
                            <strong>{item.name}</strong>
                            <small>{item.duration}</small>
                          </span>
                          <b>{item.price}</b>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <section id="werk" className="section gallery-section">
          <div className="section-heading">
            <p className="eyebrow">{t('gallery.kicker')}</p>
            <h2>{t('gallery.title')}</h2>
            <p>{t('gallery.sub')}</p>
          </div>
          <div className="gallery-tabs" role="tablist" aria-label={t('gallery.tabs')}>
            {(['nails', 'brows', 'lashes'] as GalleryTab[]).map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => {
                  setGalleryTab(tab);
                  setGalleryIndex(null);
                }}
                aria-selected={galleryTab === tab}
                role="tab"
              >
                <span>{t(`gallery.${tab}`)}</span>
                <small>{galleryGroups[tab].length}</small>
              </button>
            ))}
          </div>
          <div className={`gallery-grid ${gallery.length === 1 ? 'single' : ''}`}>
            {gallery.map((image, index) => (
              <button
                type="button"
                className={`gallery-item ${gallery.length > 2 && index === 0 ? 'featured' : ''}`}
                key={image.src}
                onClick={() => setGalleryIndex(index)}
                aria-label={`${t('gallery.open')} ${index + 1}`}
              >
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" />
                <span className="gallery-caption">
                  <strong>{image.title}</strong>
                  <span>{image.tag}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section id="reviews" className="section reviews-section">
          <div className="section-heading">
            <p className="eyebrow">{t('reviews.kicker')}</p>
            <h2>{t('reviews.title')}</h2>
            <p>{t('reviews.sub')}</p>
          </div>
          <div className="review-grid">
            {featuredReviews.map((review) => (
              <article className="review-card" key={review.name}>
                <Stars />
                <p>{review.text}</p>
                <strong>{review.name}</strong>
              </article>
            ))}
          </div>
          <div className="compact-reviews">
            {compactReviews.map((name) => (
              <span key={name}>
                <Star size={15} fill="currentColor" />
                {name}
              </span>
            ))}
          </div>
          <a className="inline-link" href={googleUrl}>
            {t('reviews.google')}
            <ChevronRight size={17} />
          </a>
        </section>

        <section id="bezoek" className="section visit-block">
          <div className="section-heading">
            <p className="eyebrow">{t('visit.kicker')}</p>
            <h2>{t('visit.title')}</h2>
          </div>
          <div className="visit-grid">
            <div className="visit-card">
              <div className="visit-row">
                <span className="visit-icon">
                  <MapPin size={18} />
                </span>
                <div>
                  <small>{t('visit.addressLabel')}</small>
                  <p>{t('hero.address')}</p>
                  <a href={directionsUrl}>{t('visit.route')}</a>
                </div>
              </div>
              <div className="visit-row">
                <span className="visit-icon">
                  <CalendarCheck size={18} />
                </span>
                <div>
                  <small>{t('visit.booking')}</small>
                  <p>{t('visit.bookingSub')}</p>
                  <button type="button" onClick={() => setBookingOpen(true)}>
                    {t('hero.cta')}
                  </button>
                </div>
              </div>
              <div className="visit-row">
                <span className="visit-icon">
                  <Clock size={18} />
                </span>
                <div>
                  <small>{t('visit.hours')}</small>
                  <ul>
                    {hours.map(([day, time]) => (
                      <li key={day}>
                        <span>{day}</span>
                        <strong>{time}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="map-frame">
              <iframe
                title="Nxkbeautyroom op Google Maps"
                src={mapsEmbedUrl}
                width="100%"
                height="100%"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>

        <section id="faq" className="section faq-section">
          <div className="faq-heading">
            <p className="eyebrow">{t('faq.kicker')}</p>
            <h2>{t('faq.title')}</h2>
          </div>
          <div className="faq-list">
            {faqItems.map((item) => {
              const isOpen = openFaq === item;
              return (
                <div className="faq-item" key={item}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? 0 : item)}
                    aria-expanded={isOpen}
                  >
                    <span>{t(`faq.q${item}`)}</span>
                    <Plus size={20} className={isOpen ? 'rotate' : ''} />
                  </button>
                  {isOpen && <p>{t(`faq.a${item}`)}</p>}
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-inner">
          <div className="footer-grid">
            <div>
              <span className="footer-brand">
                Nxk<span>beautyroom</span>
              </span>
              <p>{t('footer.tagline')}</p>
            </div>
            <div className="footer-list">
              <small>{t('visit.kicker')}</small>
              <p>
                <MapPin size={15} />
                {t('hero.address')}
              </p>
              <button type="button" onClick={() => setBookingOpen(true)}>
                <Phone size={15} />
                {t('nav.book')}
              </button>
            </div>
            <div className="footer-list">
              <small>{t('footer.follow')}</small>
              <a href={instagramUrl}>
                <Instagram size={15} />
                @nxkbeautyroom
              </a>
              <a href={facebookUrl}>
                <Facebook size={15} />
                Nxkbeautyroom
              </a>
              <nav>
                <a href="#behandelingen">{t('nav.services')}</a>
                <a href="#werk">{t('nav.work')}</a>
                <a href="#reviews">{t('nav.reviews')}</a>
                <a href="#bezoek">{t('nav.visit')}</a>
              </nav>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{t('footer.rights')}</span>
            <span>Steenwijk · Overijssel</span>
          </div>
          <a className="jiw-credit" href="https://jouwidealewebsite.nl">
            <img src="/jiw-logo.png" alt="jouwidealewebsite.nl" />
            <span>Gemaakt met liefde door jouwidealewebsite.nl</span>
          </a>
        </div>
      </footer>

      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} t={t} />
      <StickyBookCta hidden={bookingOpen} onBook={() => setBookingOpen(true)} label={t('nav.book')} />

      {openLightbox && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={t('gallery.lightbox')} onClick={() => setGalleryIndex(null)}>
          <button
            type="button"
            className="lightbox-close"
            onClick={(event) => {
              event.stopPropagation();
              setGalleryIndex(null);
            }}
            aria-label={t('gallery.close')}
          >
            <X size={24} />
          </button>
          <button
            type="button"
            className="lightbox-nav prev"
            onClick={(event) => {
              event.stopPropagation();
              navigateGallery(-1);
            }}
            aria-label={t('gallery.previous')}
          >
            <ChevronLeft size={30} />
          </button>
          <img
            src={gallery[galleryIndex].src}
            alt={gallery[galleryIndex].alt}
            onClick={(event) => event.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav next"
            onClick={(event) => {
              event.stopPropagation();
              navigateGallery(1);
            }}
            aria-label={t('gallery.next')}
          >
            <ChevronRight size={30} />
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
