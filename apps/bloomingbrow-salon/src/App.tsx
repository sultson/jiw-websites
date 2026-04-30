import {
  Award,
  CalendarCheck,
  ChevronRight,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  Sparkles,
  Star,
} from 'lucide-react';
import { useLang } from './hooks/useLang';
import LangToggle from './components/LangToggle';

const bookingUrl = 'https://bloomingbrow-salon.salonized.com/widget_bookings/new';
const instagramUrl = 'https://www.instagram.com/bloomingbrow_/';
const mapsUrl =
  'https://www.google.com/maps/search/?api=1&query=Bloomingbrow%20salon&query_place_id=ChIJ9zf7HQNPz0cRWu2_Y02tiLg';
const phoneDisplay = '06 51720796';
const phoneHref = 'tel:+31651720796';
const whatsappUrl = 'https://wa.me/31651720796';

const copy = {
  nl: {
    nav: ['Over Bloem', 'Behandelingen', 'Reviews', 'Bezoek'],
    book: 'Boek via Salonized',
    whatsapp: 'App Bloem',
    kicker: 'PMU brows en browstyling in Schagen',
    title: 'Brows die je gezicht rustig laten spreken.',
    intro:
      'Bloomingbrow salon is de browstudio van Bloem Boekel aan het Tanjagroenplein 6 in Schagen. Voor powderbrows, hybrid brows, brow lamination, shaping, verven en lashlift.',
    proof: '5,0 op Google uit 22 reviews',
    profile: '562 Instagram-volgers',
    posts: '105 Instagram-posts',
    salonized: 'Afspraken via Salonized',
    aboutTitle: 'Bloem bouwde haar salon zichtbaar met liefde op.',
    about1:
      'In haar eigen voorstelpost noemt Bloem zichzelf 22 jaar, woonachtig in Schagen en sinds 2025 eigenaar van Bloomingbrow salon. Ze schrijft dat beauty en verzorging al van jongs af aan bij haar passen.',
    about2:
      'De research laat een duidelijke browfocus zien: PMU powderbrows, hybrid tint, brow lamination, basis browstyling met hars en verf, shaping en lashlift. In mei 2025 behaalde Bloem haar certificaat allround wenkbrauw stylist na training bij By Shay.',
    aboutDetail: 'Adres uit Instagram en Google: Tanjagroenplein 6, 1741 CZ Schagen.',
    servicesTitle: 'Behandelingen die terugkomen in posts en reviews',
    servicesIntro:
      'Geen losse prijslijst gevonden. Voor actuele opties en beschikbaarheid verwijst de site naar de Salonized boeking of direct contact.',
    reviewsTitle: 'Klanten noemen vooral precisie, sfeer en vertrouwen',
    reviewsIntro:
      'Google Maps toont 22 reviews, allemaal 5 sterren. Hieronder staan echte tekstreviews uit de scrape.',
    visitTitle: 'Bezoek Bloomingbrow in Schagen',
    address: 'Tanjagroenplein 6, 1741 CZ Schagen',
    addressNote: 'Volgens Bloems Instagram-post: achter de Picobello, parkeren voor de deur.',
    route: 'Route openen',
    socials: 'Volg op Instagram',
    footer:
      'Conceptwebsite voor Bloomingbrow salon, gebaseerd op openbare Google en Instagram research.',
  },
  en: {
    nav: ['About Bloem', 'Treatments', 'Reviews', 'Visit'],
    book: 'Book via Salonized',
    whatsapp: 'WhatsApp Bloem',
    kicker: 'PMU brows and brow styling in Schagen',
    title: 'Brows that frame your face with calm precision.',
    intro:
      'Bloomingbrow salon is Bloem Boekel’s brow studio at Tanjagroenplein 6 in Schagen. For powder brows, hybrid brows, brow lamination, shaping, tinting and lash lift.',
    proof: '5.0 on Google from 22 reviews',
    profile: '562 Instagram followers',
    posts: '105 Instagram posts',
    salonized: 'Appointments via Salonized',
    aboutTitle: 'Bloem visibly built her salon with care.',
    about1:
      'In her own introduction post, Bloem describes herself as 22, living in Schagen and owner of Bloomingbrow salon since 2025. She writes that beauty and care have interested her from a young age.',
    about2:
      'The research shows a clear brow focus: PMU powder brows, hybrid tint, brow lamination, basic brow styling with wax and tint, shaping and lash lift. In May 2025 Bloem earned her all-round brow stylist certificate after training with By Shay.',
    aboutDetail: 'Address from Instagram and Google: Tanjagroenplein 6, 1741 CZ Schagen.',
    servicesTitle: 'Treatments found in posts and reviews',
    servicesIntro:
      'No standalone price list was found. For current options and availability, the site links to Salonized booking or direct contact.',
    reviewsTitle: 'Clients mention precision, atmosphere and trust',
    reviewsIntro:
      'Google Maps shows 22 reviews, all 5 stars. These are real written reviews from the scrape.',
    visitTitle: 'Visit Bloomingbrow in Schagen',
    address: 'Tanjagroenplein 6, 1741 CZ Schagen',
    addressNote: 'According to Bloem’s Instagram post: behind Picobello, parking at the door.',
    route: 'Open route',
    socials: 'Follow on Instagram',
    footer: 'Concept website for Bloomingbrow salon, based on public Google and Instagram research.',
  },
};

const services = {
  nl: [
    ['Powderbrows', 'PMU brows worden veel genoemd in posts en reviews. Bloem post meerdere nieuwe sets en touch-ups.'],
    ['Hybrid brows', 'Hybrid tint kleurt volgens Bloems post zowel haartjes als huid voor een strakkere browlook.'],
    ['Brow lamination', 'Genoemd in Bloems certificaatpost als behandeling die in de salon beschikbaar komt.'],
    ['Shaping, harsen en verven', 'Google reviews noemen shapen en verven; Instagram noemt basis browstyling met hars en verf.'],
    ['Lashlift', 'Genoemd in Bloems voorstelpost en in een Google review in combinatie met browbehandeling.'],
  ],
  en: [
    ['Powder brows', 'PMU brows are prominent in posts and reviews. Bloem posts several new sets and touch-ups.'],
    ['Hybrid brows', 'According to Bloem’s post, hybrid tint colours both brow hairs and skin for a defined look.'],
    ['Brow lamination', 'Mentioned in Bloem’s certificate post as a treatment becoming available in the salon.'],
    ['Shaping, waxing and tinting', 'Google reviews mention shaping and tinting; Instagram mentions basic brow styling with wax and tint.'],
    ['Lash lift', 'Mentioned in Bloem’s introduction post and in a Google review alongside brow treatment.'],
  ],
};

const reviews = [
  {
    name: 'Maaike De Groot',
    text:
      'Ik ben bij bloem langs geweest voor het zetten van powder brows en ik ben onwijs blij met mijn nieuwe wenkbrauwen! Bloem is super vriendelijk en stelt je echt op je gemak.',
  },
  {
    name: 'Demi de Vos',
    text:
      'Bloem werkt super netjes en precies. Tijdens de afspraak werd ik goed verzorgd met drinken, snacks en gezelligheid:) Het eindresultaat is ook echt prachtig.',
  },
  {
    name: 'Floor Bellis',
    text:
      'Bloem luistert goed naar je wensen en neemt echt de tijd om de juiste vorm van je wenkbrauwen te tekenen voordat ze begint. Ze is heel precies.',
  },
  {
    name: 'Myrthe',
    text:
      'Bloem legt alles goed uit en denkt goed mee over je wensen! Je voelt je gelijk op je gemak bij Bloem, super fijn.',
  },
];

const gallery = [
  ['/owner-bloem-intro-2025-12-05.webp', 'Bloem Boekel, eigenaar van Bloomingbrow salon'],
  ['/owner-brand-cards-2026-04-09.webp', 'Bloem met eigen Bloomingbrow visitekaartjes'],
  ['/brows-hybrid-result-2026-04-13.webp', 'Browresultaat uit Instagram-post'],
  ['/brows-pmu-collage-2026-04-03.webp', 'PMU brows collage uit Instagram-post'],
  ['/google-salon-front-2026-04-30.webp', 'Google-foto van de salonlocatie'],
];

function Stars() {
  return (
    <span className="stars" aria-label="5 sterren">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} fill="currentColor" />
      ))}
    </span>
  );
}

export default function App() {
  const { lang, setLang } = useLang();
  const c = copy[lang];
  const serviceList = services[lang];

  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Bloomingbrow salon">
          <span>Bloomingbrow</span>
          <small>Schagen</small>
        </a>
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          {['over', 'behandelingen', 'reviews', 'bezoek'].map((id, i) => (
            <a key={id} href={`#${id}`}>
              {c.nav[i]}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <LangToggle lang={lang} setLang={setLang} compact />
          <a className="book-link" href={bookingUrl} target="_blank" rel="noreferrer">
            <CalendarCheck size={16} />
            <span>{c.book}</span>
          </a>
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <p className="kicker">{c.kicker}</p>
            <h1>{c.title}</h1>
            <p className="lead">{c.intro}</p>
            <div className="cta-row">
              <a className="btn primary" href={bookingUrl} target="_blank" rel="noreferrer">
                <CalendarCheck size={18} />
                {c.book}
              </a>
              <a className="btn ghost" href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                {c.whatsapp}
              </a>
            </div>
            <div className="trust-row">
              <span>{c.proof}</span>
              <span>{c.profile}</span>
              <span>{c.salonized}</span>
            </div>
          </div>
          <div className="hero-media" aria-label="Bloomingbrow sfeerbeelden">
            <img className="hero-main" src="/owner-brand-cards-2026-04-09.webp" alt="" />
            <img src="/brows-hybrid-result-2026-04-13.webp" alt="" />
            <img src="/owner-bloem-intro-2025-12-05.webp" alt="" />
          </div>
        </section>

        <section className="proof-strip" aria-label="Vertrouwen">
          <div>
            <strong>5,0</strong>
            <span>Google rating</span>
          </div>
          <div>
            <strong>22</strong>
            <span>Google reviews</span>
          </div>
          <div>
            <strong>105</strong>
            <span>Instagram posts</span>
          </div>
          <div>
            <strong>2025</strong>
            <span>Eigen salon gestart</span>
          </div>
        </section>

        <section id="over" className="split-section">
          <div>
            <p className="kicker">Bloem Boekel</p>
            <h2>{c.aboutTitle}</h2>
          </div>
          <div className="text-stack">
            <p>{c.about1}</p>
            <p>{c.about2}</p>
            <p className="note">
              <MapPin size={16} />
              {c.aboutDetail}
            </p>
          </div>
        </section>

        <section id="behandelingen" className="band">
          <div className="section-head">
            <p className="kicker">Brow menu</p>
            <h2>{c.servicesTitle}</h2>
            <p>{c.servicesIntro}</p>
          </div>
          <div className="service-grid">
            {serviceList.map(([title, body]) => (
              <article className="service-card" key={title}>
                <Sparkles size={20} />
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gallery" aria-label="Sfeerbeelden">
          {gallery.map(([src, alt]) => (
            <img key={src} src={src} alt={alt} loading="lazy" />
          ))}
        </section>

        <section id="reviews" className="reviews-section">
          <div className="section-head">
            <p className="kicker">Google reviews</p>
            <h2>{c.reviewsTitle}</h2>
            <p>{c.reviewsIntro}</p>
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
          <a className="inline-link" href={mapsUrl} target="_blank" rel="noreferrer">
            Lees alle reviews op Google
            <ChevronRight size={16} />
          </a>
        </section>

        <section id="bezoek" className="visit-section">
          <div>
            <p className="kicker">Schagen</p>
            <h2>{c.visitTitle}</h2>
            <p className="lead small">{c.address}</p>
            <p>{c.addressNote}</p>
            <div className="contact-list">
              <a href={phoneHref}>
                <Phone size={18} />
                {phoneDisplay}
              </a>
              <a href={whatsappUrl} target="_blank" rel="noreferrer">
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a href={instagramUrl} target="_blank" rel="noreferrer">
                <Instagram size={18} />
                @bloomingbrow_
              </a>
            </div>
          </div>
          <div className="visit-card">
            <Award size={28} />
            <h3>{c.proof}</h3>
            <p>
              {c.posts}. {c.profile}. {c.salonized}.
            </p>
            <a className="btn primary full" href={mapsUrl} target="_blank" rel="noreferrer">
              <MapPin size={18} />
              {c.route}
            </a>
            <a className="btn ghost full" href={instagramUrl} target="_blank" rel="noreferrer">
              <Instagram size={18} />
              {c.socials}
            </a>
          </div>
        </section>
      </main>

      <footer>
        <span>Bloomingbrow salon</span>
        <p>{c.footer}</p>
      </footer>
    </div>
  );
}
