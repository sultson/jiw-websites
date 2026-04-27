import {
  CalendarCheck,
  ChevronRight,
  Clock,
  Heart,
  Instagram,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
  Wifi,
} from 'lucide-react';

const phoneDisplay = '06 37194877';
const telHref = 'tel:+31637194877';
const whatsappHref = 'https://wa.me/31637194877';
const instagramHref = 'https://www.instagram.com/lashtistic.nl/';
const mapsHref =
  'https://www.google.com/maps/search/?api=1&query=Lashtistic&query_place_id=ChIJEbW-ctwRuEcR8WFoniyT14s';
const directionsHref =
  'https://www.google.com/maps/dir/?api=1&destination=Elsschotplantsoen%2016%2C%207552%20JH%20Hengelo';
const mapEmbed =
  'https://www.google.com/maps?q=Lashtistic%20Elsschotplantsoen%2016%20Hengelo&output=embed';

const nav = [
  ['Behandelingen', '#behandelingen'],
  ['Werk', '#werk'],
  ['Reviews', '#reviews'],
  ['Bezoek', '#bezoek'],
];

const services = [
  {
    title: 'UV lashes',
    body: 'Wimperextensions met UV techniek. Genoemd in reviews als passend bij klanten die gevoelig zijn voor reguliere extensions.',
  },
  {
    title: 'One by one',
    body: 'Een natuurlijke set voor wie verzorgde wimpers wil met een zachte, klassieke uitstraling.',
  },
  {
    title: 'Volume lashes',
    body: 'Meer volheid met aandacht voor isolatie, symmetrie en een resultaat dat mooi blijft zitten.',
  },
  {
    title: 'Lash lift',
    body: 'Ook Korean lash lift en tint worden gedeeld op Instagram. Geschikt als je je eigen wimpers wilt liften.',
  },
  {
    title: 'Brow lamination',
    body: 'Brow lamination met hybrid brows of hybrid tint. Vorm en kleur worden volgens de captions op wens afgestemd.',
  },
  {
    title: 'BIAB en nagels',
    body: 'Sinds februari 2026 kun je bij Lashtistic ook terecht voor nagels met producten van Dutch Nail Cosmetics.',
  },
  {
    title: 'Cursussen',
    body: 'Cursussen zijn mogelijk. Reviews noemen onder andere een pre-made volume cursus.',
  },
];

const gallery = [
  ['salon-treatment-room.webp', 'Rustige behandelruimte van Lashtistic'],
  ['salon-lash-bed.webp', 'Behandelstoel voor lash behandelingen'],
  ['lash-products-shelf.webp', 'Producten en salon details'],
  ['lash-volume-result.webp', 'Volume lashes resultaat'],
  ['lash-lift-result.webp', 'Lash lift resultaat'],
  ['brow-lamination-result.webp', 'Brow lamination resultaat'],
  ['nails-pink-floral.webp', 'Roze BIAB nagels met bloemdetail'],
  ['nails-clean-french.webp', 'Verzorgde lichte nagelset'],
];

const featuredReviews = [
  {
    name: 'Ayoka M.',
    text: 'Ik ben elke keer ontzettend blij met het resultaat van mijn lash extensions! Ze werkt super zorgvuldig, is altijd heel vriendelijk en de sfeer in de salon is heerlijk ontspannen. Ik blijf hier zeker nog heel lang komen. Echt een aanrader! 🌟',
  },
  {
    name: 'Ineke Bouman',
    text: 'Na jaren geen extensions te hebben gedragen i.v.m. contact allergie de uv techniek geprobeerd. En wauw! Nu bijna twee weken verder en ze zijn nog perfect!! Daarnaast is het in de thuis salon super knus en gezellig 🩷',
  },
  {
    name: 'Lotte Geerdink',
    text: 'Ik kom al ruim anderhalf jaar bij Selena! Ze geeft super goede adviezen en haar kwaliteit van werk is top! Ik heb hier mijn wimperextensions, lashlift en browlamination laten doen en dit beviel allemaal super goed! Echt een aanrader!!',
  },
  {
    name: 'Kayleigh Taylor',
    text: 'Hele fijne salon, ik ben altijd tevreden als ik hier weg kom. Ze zet hele mooie sets & haar browlifts zijn ook heel mooi. Selena is heel lief en denkt altijd met je mee.',
  },
  {
    name: 'Anouk oude Egbrink',
    text: 'Ik kom elke drie weken bij Selena en elke keer weer ga ik tevreden weg! Ze werkt snel en secuur. Als je wilt kletsen is dit prima, maar als je van de rust wilt genieten ook. Ik vind dit echt een pluspunt!',
  },
  {
    name: 'Hieke Reilink',
    text: 'Selena is een super lieve en gezellige meid, ze levert fantastisch werk en is mega goed in wat ze doet.',
  },
];

const ratingOnlyReviews = ['Jeniver Wakji', 'Hengelo 1974'];

const hours = [
  ['Maandag', '09:00-20:30'],
  ['Dinsdag', '09:00-16:00'],
  ['Woensdag', '09:00-20:30'],
  ['Donderdag', '09:00-20:30'],
  ['Vrijdag', '09:00-16:00'],
  ['Zaterdag', 'Gesloten'],
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

function App() {
  return (
    <div className="min-h-screen bg-ivory text-ink">
      <header className="site-header">
        <a href="#top" className="brand" aria-label="Lashtistic">
          <span>Lashtistic</span>
          <small>Hengelo</small>
        </a>

        <nav aria-label="Hoofdnavigatie">
          {nav.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a className="icon-button" href={telHref} aria-label="Bel Lashtistic">
          <Phone size={18} />
        </a>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-media" aria-hidden="true">
            <img src="/salon-treatment-room.webp" alt="" />
          </div>
          <div className="hero-content">
            <p className="eyebrow">Schoonheidssalon in Hengelo</p>
            <h1>UV lashes, brows en BIAB met rustige precisie.</h1>
            <p>
              Lashtistic is de salon van Selena aan het Elsschotplantsoen. Klanten waarderen haar
              zorgvuldige werk, de ontspannen sfeer en een perfecte Google score van 5,0 uit 27 reviews.
            </p>
            <div className="hero-actions">
              <a className="button primary" href={whatsappHref}>
                <MessageCircle size={18} />
                WhatsApp
              </a>
              <a className="button secondary" href={instagramHref}>
                <Instagram size={18} />
                DM via Instagram
              </a>
            </div>
          </div>
          <aside className="hero-panel" aria-label="Salon gegevens">
            <div>
              <Stars />
              <strong>5,0 op Google</strong>
              <span>27 reviews</span>
            </div>
            <div>
              <MapPin size={18} />
              <span>Elsschotplantsoen 16, 7552 JH Hengelo</span>
            </div>
            <div>
              <CalendarCheck size={18} />
              <span>Op afspraak. Instagram vermeldt: afspraken via DM.</span>
            </div>
          </aside>
        </section>

        <section className="strip" aria-label="Kernpunten">
          <div>
            <ShieldCheck size={20} />
            <span>Gecertificeerd</span>
          </div>
          <div>
            <Heart size={20} />
            <span>LGBTQ+ vriendelijk</span>
          </div>
          <div>
            <Wifi size={20} />
            <span>Gratis wifi</span>
          </div>
          <div>
            <MapPin size={20} />
            <span>Gratis parkeren</span>
          </div>
        </section>

        <section className="section split">
          <div>
            <p className="eyebrow">Over de salon</p>
            <h2>Een knusse thuissalon waar secuur werk centraal staat.</h2>
          </div>
          <div className="copy-stack">
            <p>
              Uit de reviews komt steeds hetzelfde beeld naar voren: Selena werkt netjes, denkt mee
              en maakt tijd voor een behandeling die ontspannen voelt. Je kunt kletsen, maar ook juist
              rustig liggen.
            </p>
            <p>
              De salon is gericht op wimpers, wenkbrauwen en sinds 2026 ook nagels. Voor tarieven of
              passend advies stuur je een DM, WhatsApp of bel je direct.
            </p>
          </div>
        </section>

        <section id="behandelingen" className="section">
          <div className="section-heading">
            <p className="eyebrow">Behandelingen</p>
            <h2>Wat je bij Lashtistic kunt boeken</h2>
            <p>
              Geen prijslijst gevonden. Daarom staan hier alleen behandelingen die uit Google of
              Instagram blijken.
            </p>
          </div>
          <div className="service-grid">
            {services.map((service) => (
              <article className="service-card" key={service.title}>
                <Sparkles size={18} />
                <h3>{service.title}</h3>
                <p>{service.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="werk" className="section gallery-section">
          <div className="section-heading">
            <p className="eyebrow">Werk en salon</p>
            <h2>Resultaten en sfeer</h2>
            <p>Beelden uit Google Maps en recente Instagram posts van Lashtistic.</p>
          </div>
          <div className="gallery-grid">
            {gallery.map(([src, alt]) => (
              <figure key={src}>
                <img src={`/${src}`} alt={alt} loading="lazy" />
              </figure>
            ))}
          </div>
        </section>

        <section id="reviews" className="section reviews-section">
          <div className="section-heading">
            <p className="eyebrow">Reviews</p>
            <h2>27 keer vijf sterren</h2>
            <p>
              Lashtistic heeft op Google een uitzonderlijke 5,0 score. Hieronder staan echte reviews
              uit de scrape.
            </p>
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
          <div className="rating-tiles">
            {ratingOnlyReviews.map((name) => (
              <div key={name}>
                <Stars />
                <span>{name}</span>
              </div>
            ))}
          </div>
          <a className="button secondary reviews-link" href={mapsHref}>
            Lees op Google
            <ChevronRight size={18} />
          </a>
        </section>

        <section id="bezoek" className="section visit-section">
          <div className="visit-content">
            <p className="eyebrow">Bezoek</p>
            <h2>Lashtistic in Hengelo</h2>
            <div className="contact-list">
              <a href={directionsHref}>
                <MapPin size={19} />
                <span>Elsschotplantsoen 16, 7552 JH Hengelo</span>
              </a>
              <a href={telHref}>
                <Phone size={19} />
                <span>{phoneDisplay}</span>
              </a>
              <a href={whatsappHref}>
                <MessageCircle size={19} />
                <span>WhatsApp sturen</span>
              </a>
              <a href={instagramHref}>
                <Instagram size={19} />
                <span>@lashtistic.nl</span>
              </a>
            </div>
            <div className="hours">
              <div className="hours-title">
                <Clock size={18} />
                <strong>Openingstijden</strong>
              </div>
              {hours.map(([day, time]) => (
                <div key={day}>
                  <span>{day}</span>
                  <span>{time}</span>
                </div>
              ))}
            </div>
          </div>
          <iframe
            title="Lashtistic op Google Maps"
            src={mapEmbed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </main>

      <footer className="footer">
        <div>
          <strong>Lashtistic</strong>
          <span>UV lashes, brows en BIAB in Hengelo.</span>
        </div>
        <div>
          <a href={telHref}>Bel</a>
          <a href={whatsappHref}>WhatsApp</a>
          <a href={instagramHref}>Instagram</a>
          <a href={mapsHref}>Google</a>
        </div>
      </footer>

      <a className="sticky-cta" href={whatsappHref}>
        <MessageCircle size={18} />
        Afspraak via WhatsApp
      </a>
    </div>
  );
}

export default App;
