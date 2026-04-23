import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  Hammer,
  Home,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  MessageSquare,
  PaintRoller,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  Upload,
  Wrench,
  X,
} from 'lucide-react';

const phoneDisplay = '06 45172726';
const phoneHref = 'tel:+31645172726';
const whatsappHref = 'https://wa.me/31645172726?text=Hallo%20RN%20Schilders%2C%20ik%20wil%20graag%20een%20gratis%20prijsindicatie%20aanvragen.';
const email = 'info@rnschilders.nl';
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Kuipersweg+33+3449+JA+Woerden';

type Service = {
  title: string;
  text: string;
  image: string;
  icon: typeof PaintRoller;
  bullets: string[];
};

type Review = {
  name: string;
  date: string;
  quote: string;
};

const navLinks = [
  ['Diensten', '#diensten'],
  ['Werk', '#werk'],
  ['Reviews', '#reviews'],
  ['Werkwijze', '#werkwijze'],
  ['Contact', '#contact'],
] as const;

const stats = [
  ['15+', 'jaar ervaring'],
  ['5.0', 'Google score'],
  ['8', 'recente reviews'],
  ['1', 'vast aanspreekpunt'],
] as const;

const services: Service[] = [
  {
    title: 'Schilderwerk',
    text: 'Binnen en buiten strak afgewerkt met duurzame verfproducten, van muren en plafonds tot kozijnen, deuren en boeidelen.',
    image: '/schilderwerk.webp',
    icon: PaintRoller,
    bullets: ['Binnen en buiten', 'Kozijnen en boeidelen', 'Onderhoudsplanning'],
  },
  {
    title: 'Kozijnen',
    text: 'Renovatie, plaatsing en herstel van houten en kunststof kozijnen, inclusief hang- en sluitwerk met PKVW-focus.',
    image: '/kozijnen-3.webp',
    icon: Home,
    bullets: ['Hout en kunststof', 'Plaatsing en renovatie', 'PKVW hang- en sluitwerk'],
  },
  {
    title: 'Spuitwerk',
    text: 'Egaal spuitwerk voor woningen, kantoren en bedrijfspanden wanneer tempo en een moderne afwerking belangrijk zijn.',
    image: '/spuitwerk.webp',
    icon: Sparkles,
    bullets: ['Muren en plafonds', 'Kantoren en woningen', 'Glad eindresultaat'],
  },
  {
    title: 'Stucwerk',
    text: 'Gladde wanden en plafonds als sterke basis voor schilderwerk, renovatiestuc en reparaties in bestaande woningen.',
    image: '/stukadoor.webp',
    icon: Ruler,
    bullets: ['Pleisterwerk', 'Nieuwbouw en renovatie', 'Reparaties'],
  },
  {
    title: 'Houtrotherstel',
    text: 'Aangetast houtwerk duurzaam herstellen voordat vocht grotere schade veroorzaakt aan kozijnen, deuren of boeidelen.',
    image: '/houtrotherstel.webp',
    icon: Wrench,
    bullets: ['Inspectie en herstel', 'Schuren en gronden', 'Bescherming op termijn'],
  },
  {
    title: 'Sloopwerk',
    text: 'Zorgvuldig voorbereid sloopwerk voor renovaties, zodat de ruimte schoon, veilig en klaar is voor de volgende stap.',
    image: '/sloopwerk.webp',
    icon: Hammer,
    bullets: ['Voor renovatie', 'Veilig en netjes', 'Afvoer in overleg'],
  },
];

const reviews: Review[] = [
  {
    name: 'Barry Verschoor',
    date: 'maart 2026',
    quote:
      'Alles is netjes voorbereid, geschuurd en strak geschilderd. Het contact was prettig, afspraken werden nagekomen en er werd netjes gewerkt.',
  },
  {
    name: 'Marielle Strobos',
    date: 'maart 2026',
    quote:
      'Ze hebben alles voor me geregeld: stucwerk, schilderwerk, egalisatie van de vloer en timmerwerk. Alles was op tijd klaar en de kwaliteit is uitstekend.',
  },
  {
    name: 'Marek Balog',
    date: 'maart 2026',
    quote:
      'De service is top en alles wordt netjes en professioneel geregeld. Ze denken goed mee en komen afspraken na.',
  },
];

const processSteps = [
  ['Foto of afspraak', 'Stuur foto’s mee of plan een opname op locatie in Woerden en omgeving.'],
  ['Duidelijke offerte', 'U weet vooraf wat er gebeurt, welke materialen worden gebruikt en wanneer het werk start.'],
  ['Netjes uitgevoerd', 'Richard werkt zelf mee op de vloer en bewaakt voorbereiding, planning en afwerking.'],
  ['Oplevering', 'Samen controleren we het resultaat en eventuele restpunten worden direct helder gemaakt.'],
] as const;

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
    <div id="top" className="min-h-[100dvh] overflow-x-hidden bg-paper">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={() => setQuoteOpen(true)} />
      <main>
        <Hero openQuote={() => setQuoteOpen(true)} />
        <ProofStrip />
        <OwnerSection openQuote={() => setQuoteOpen(true)} />
        <Services />
        <FeaturedWork openQuote={() => setQuoteOpen(true)} />
        <Reviews />
        <Process openQuote={() => setQuoteOpen(true)} />
        <Contact openQuote={() => setQuoteOpen(true)} />
      </main>
      <Footer />
      <MobileCta openQuote={() => setQuoteOpen(true)} />
      <QuoteModal open={quoteOpen} onClose={() => setQuoteOpen(false)} />
    </div>
  );
}

function Nav({
  menuOpen,
  setMenuOpen,
  openQuote,
}: {
  menuOpen: boolean;
  setMenuOpen: (open: boolean) => void;
  openQuote: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 transition ${scrolled ? 'bg-whitewash/95 shadow-sm backdrop-blur-md' : 'bg-whitewash/80 backdrop-blur-sm'}`}>
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="RN Schilders & Renovatie">
          <img src="/logo.webp" alt="" className="h-10 w-10 rounded-md object-cover" />
          <span className="min-w-0">
            <span className="block truncate font-display text-lg font-extrabold text-navy sm:text-xl">RN Schilders</span>
            <span className="block text-xs font-bold uppercase tracking-[0.12em] text-roller">Woerden</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map(([label, href]) => (
            <a key={href} href={href} className="text-sm font-semibold text-graphite transition hover:text-navy">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a href={phoneHref} className="btn-outline hidden md:inline-flex">
            <Phone size={17} />
            Bel direct
          </a>
          <button type="button" onClick={openQuote} className="btn-primary hidden lg:inline-flex">
            Offerte aanvragen
            <ArrowRight size={17} />
          </button>
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-line bg-white lg:hidden"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-line bg-whitewash lg:hidden">
          <div className="shell py-5">
            <div className="grid gap-1">
              {navLinks.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-between rounded-md px-2 py-3 font-display text-xl font-bold text-navy"
                >
                  {label}
                  <ChevronRight size={18} />
                </a>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                openQuote();
              }}
              className="btn-primary mt-4 w-full"
            >
              Gratis offerte aanvragen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="relative min-h-[82dvh] overflow-hidden md:min-h-[calc(92dvh-5rem)]">
      <div className="absolute inset-0">
        <img src="/workspace-hero.webp" alt="" className="h-full w-full object-cover" fetchPriority="high" />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(20,36,59,0.94)_0%,rgba(20,36,59,0.78)_46%,rgba(20,36,59,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="shell relative flex min-h-[82dvh] items-center py-14 md:min-h-[calc(92dvh-5rem)] md:py-24">
        <div className="w-full max-w-3xl pb-12">
          <p className="eyebrow max-w-full text-[10px] tracking-[0.14em] text-roller-soft sm:text-xs sm:tracking-[0.18em]">
            Schilder en renovatiebedrijf in Woerden
          </p>
          <h1 className="mt-5 max-w-full text-[2.45rem] font-extrabold leading-[0.98] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">RN Schilders</span>
            <span className="block">& Renovatie</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-white/88 sm:text-lg sm:leading-8 md:text-xl">
            Vakwerk dat zichtbaar blijft. Richard werkt zelf mee op de vloer, bewaakt de afwerking en regelt schilderwerk, kozijnen, stucwerk en renovatie vanuit één aanspreekpunt.
          </p>

          <div className="mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <button type="button" onClick={openQuote} className="btn-primary w-full md:w-auto">
              Gratis prijsindicatie
              <ArrowRight size={18} />
            </button>
            <a href={phoneHref} className="btn-light w-full md:w-auto">
              <Phone size={18} />
              {phoneDisplay}
            </a>
          </div>

          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="min-w-0 rounded-md border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                <strong className="block font-display text-2xl font-extrabold">{value}</strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-white/70 sm:text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofStrip() {
  const items = [
    [BadgeCheck, 'Eigenaar werkt mee', 'Kwaliteit wordt op locatie bewaakt.'],
    [ShieldCheck, 'PKVW aandacht', 'Veilig hang- en sluitwerk voor kozijnen.'],
    [CalendarCheck, 'Heldere planning', 'Snel schakelen en afspraken nakomen.'],
    [Star, '5.0 op Google', 'Alle recente beoordelingen zijn vijf sterren.'],
  ] as const;

  return (
    <section className="relative -mt-8 z-10">
      <div className="shell">
        <div className="grid overflow-hidden rounded-lg border border-line bg-whitewash shadow-[0_24px_70px_-46px_rgba(20,36,59,0.55)] md:grid-cols-4">
          {items.map(([Icon, title, text]) => (
            <div key={title} className="border-b border-line p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
              <Icon className="text-roller" size={24} />
              <h2 className="mt-4 font-display text-lg font-extrabold text-navy">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-graphite">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function OwnerSection({ openQuote }: { openQuote: () => void }) {
  return (
    <section className="section-pad">
      <div className="shell grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="grid gap-4 sm:grid-cols-[0.72fr_1fr]">
          <img src="/owner-richard.webp" alt="Richard van RN Schilders" className="aspect-[4/5] w-full rounded-lg object-cover sm:aspect-auto" />
          <div className="grid gap-4">
            <img src="/hoogwerker.webp" alt="RN Schilders aan het werk bij buitenschilderwerk" className="h-full min-h-52 rounded-lg object-cover" />
            <div className="rounded-lg bg-door p-5 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-white/65">Belofte</p>
              <p className="mt-2 font-display text-2xl font-extrabold leading-tight">Strak werk, duidelijke afspraken en geen onnodige tussenpersonen.</p>
            </div>
          </div>
        </div>

        <div>
          <p className="eyebrow">Waarom dit vertrouwen geeft</p>
          <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
            Niet alleen een schilder, maar een meewerkend eigenaar op uw project.
          </h2>
          <p className="mt-6 text-lg leading-8 text-graphite">
            RN Schilders & Renovatie is gebouwd rond Richard: meer dan vijftien jaar ervaring, direct contact en zelf aanwezig bij de uitvoering. Dat maakt de websiteboodschap sterker dan een standaard aannemerssite: de klant weet wie er komt, wie aanspreekbaar is en wie het resultaat controleert.
          </p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {['Schilderwerk binnen en buiten', 'Kozijnen, houtrot en hang- en sluitwerk', 'Stucwerk, spuitwerk en renovatie', 'Gratis offerte met duidelijke scope'].map((item) => (
              <div key={item} className="flex gap-3 rounded-md border border-line bg-whitewash p-4">
                <Check className="mt-0.5 shrink-0 text-roller" size={19} />
                <span className="text-sm font-semibold leading-6 text-ink">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={openQuote} className="btn-dark">
              Plan een opname
              <ArrowRight size={17} />
            </button>
            <a href="#werk" className="btn-outline">
              Bekijk recent werk
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section id="diensten" className="section-pad bg-whitewash">
      <div className="shell">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow">Diensten</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Alles voor een woning of pand dat weer strak, fris en goed beschermd is.
            </h2>
          </div>
          <p className="max-w-md text-base leading-7 text-graphite">
            De zes oude servicepagina’s worden hier samengebracht in een scanbare structuur die mobiel direct duidelijk is.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article key={service.title} className="group overflow-hidden rounded-lg border border-line bg-white">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={service.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" loading="lazy" />
                <div className="absolute left-4 top-4 rounded-md bg-navy p-3 text-white">
                  <service.icon size={22} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-display text-2xl font-extrabold text-navy">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-graphite">{service.text}</p>
                <div className="mt-5 grid gap-2">
                  {service.bullets.map((bullet) => (
                    <div key={bullet} className="flex items-center gap-2 text-sm font-semibold text-ink">
                      <Check size={16} className="text-roller" />
                      {bullet}
                    </div>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturedWork({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="werk" className="section-pad bg-navy text-white">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="eyebrow text-roller-soft">Recent werk</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight md:text-5xl">
              Van versleten voordeur naar hoogglans visitekaartje.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/78">
              De sterkste verkoopkans zit in voor-en-na bewijs. Dit concept maakt projectverhalen groot en concreet, zodat bezoekers direct zien wat “strak vakwerk” betekent.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {['Schuren', 'Herstellen', 'Aflakken'].map((step, index) => (
                <div key={step} className="rounded-md border border-white/12 bg-white/8 p-4">
                  <span className="text-xs font-bold uppercase tracking-[0.15em] text-roller-soft">Stap {index + 1}</span>
                  <strong className="mt-2 block font-display text-xl font-extrabold">{step}</strong>
                </div>
              ))}
            </div>

            <button type="button" onClick={openQuote} className="btn-primary mt-8">
              Ik wil dit resultaat
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ['/voordeur-voor.webp', 'Voor'],
              ['/voordeur-tijdens.webp', 'Tijdens'],
              ['/voordeur-na.webp', 'Na'],
            ].map(([src, label]) => (
              <figure key={label} className="overflow-hidden rounded-lg bg-white/8">
                <img src={src} alt={`Voordeur ${label.toLowerCase()} behandeling`} className="aspect-[4/5] w-full object-cover" loading="lazy" />
                <figcaption className="border-t border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/75">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <ProjectSlideshow
            slides={['/interieur-slide-1.webp', '/interieur-slide-2.webp', '/interieur-slide-3.webp']}
            title="Interieur renovatie"
            text="Donkere luxe tint, strak afgewerkt en direct klaar voor gebruik."
          />
          <ProjectSlideshow
            slides={['/kantoor-slide-1.webp', '/kantoor-slide-2.webp', '/kantoor-slide-3.webp']}
            title="Casco naar kantoor"
            text="Systeemwanden, isolatie, plafonds, stuc- en schilderwerk in één traject."
          />
        </div>
      </div>
    </section>
  );
}

function ProjectSlideshow({ slides, title, text }: { slides: string[]; title: string; text: string }) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-white/10 bg-white/8 md:grid-cols-[0.72fr_1fr]">
      <div className="project-slideshow relative min-h-72 overflow-hidden bg-navy md:h-full">
        {slides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            className="project-slide absolute inset-0 h-full w-full object-cover"
            style={{ animationDelay: `${index * 4}s` }}
            loading="lazy"
          />
        ))}
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <p className="mt-3 leading-7 text-white/72">{text}</p>
        <div className="mt-6 flex items-center gap-2 text-sm font-bold text-roller-soft">
          Bekijk projectaanpak
          <ArrowRight size={16} />
        </div>
      </div>
    </article>
  );
}

function Reviews() {
  return (
    <section id="reviews" className="section-pad">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr] lg:items-start">
          <div>
            <p className="eyebrow">Reviews</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Recente klanten noemen precies wat nieuwe klanten willen weten.
            </h2>
            <div className="mt-7 rounded-lg border border-line bg-whitewash p-6">
              <div className="flex items-center gap-1 text-roller">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} size={22} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 font-display text-4xl font-extrabold text-navy">5.0 op Google</p>
              <p className="mt-2 text-sm leading-6 text-graphite">Gebaseerd op acht openbare beoordelingen uit maart 2026.</p>
            </div>
          </div>

          <div className="grid gap-5">
            {reviews.map((review) => (
              <article key={review.name} className="rounded-lg border border-line bg-whitewash p-6">
                <div className="flex items-center gap-1 text-roller">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} size={17} fill="currentColor" />
                  ))}
                </div>
                <blockquote className="mt-4 text-lg leading-8 text-ink">“{review.quote}”</blockquote>
                <p className="mt-5 text-sm font-bold text-navy">{review.name}</p>
                <p className="text-sm text-graphite">{review.date}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Process({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="werkwijze" className="section-pad bg-whitewash">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center">
          <div>
            <p className="eyebrow">Werkwijze</p>
            <h2 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight text-navy md:text-5xl">
              Een renovatie voelt rustiger wanneer de stappen vooraf helder zijn.
            </h2>
            <div className="mt-9 grid gap-4">
              {processSteps.map(([title, text], index) => (
                <div key={title} className="grid grid-cols-[3rem_1fr] gap-4 rounded-lg border border-line bg-white p-5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-roller text-lg font-extrabold text-white">{index + 1}</div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-navy">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-graphite">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg bg-navy p-6 text-white md:p-8">
            <img src="/pkvw-logo.webp" alt="PKVW logo" className="h-14 w-auto rounded-md bg-white p-2" />
            <h3 className="mt-8 font-display text-3xl font-extrabold leading-tight">Gratis offerte, snelle opname en duidelijke scope.</h3>
            <p className="mt-4 leading-7 text-white/75">
              De oude offertepagina had vooral contactgegevens. Deze versie geeft bezoekers direct een route: bellen, mailen of projectinformatie achterlaten.
            </p>
            <button type="button" onClick={openQuote} className="btn-primary mt-7 w-full sm:w-auto">
              Start offerteaanvraag
              <MessageSquare size={17} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact({ openQuote }: { openQuote: () => void }) {
  return (
    <section id="contact" className="section-pad">
      <div className="shell">
        <div className="grid overflow-hidden rounded-lg border border-line bg-whitewash lg:grid-cols-[0.9fr_1.1fr]">
          <div className="p-6 md:p-10">
            <p className="eyebrow">Contact</p>
            <h2 className="mt-4 text-4xl font-extrabold leading-tight text-navy md:text-5xl">RN Schilders is bereikbaar van maandag tot en met zaterdag.</h2>
            <div className="mt-8 grid gap-4">
              <ContactLine icon={Phone} label="Bel direct" value={phoneDisplay} href={phoneHref} />
              <ContactLine icon={Mail} label="E-mail" value={email} href={`mailto:${email}`} />
              <ContactLine icon={MapPin} label="Adres" value="Kuipersweg 33, 3449 JA Woerden" href={mapsHref} />
              <ContactLine icon={Clock3} label="Openingstijden" value="Maandag t/m zaterdag, 09.00-17.00" />
            </div>
            <button type="button" onClick={openQuote} className="btn-dark mt-8">
              Stuur projectinformatie
              <ArrowRight size={17} />
            </button>
          </div>

          <div className="min-h-[420px] bg-navy">
            <iframe
              title="Kaart RN Schilders Woerden"
              src="https://www.google.com/maps?q=Kuipersweg%2033%203449%20JA%20Woerden&output=embed"
              className="h-full min-h-[420px] w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Phone;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <div className="flex gap-4 rounded-md border border-line bg-white p-4">
      <Icon className="mt-1 shrink-0 text-roller" size={21} />
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite/70">{label}</p>
        <p className="mt-1 font-semibold text-navy">{value}</p>
      </div>
    </div>
  );

  if (!href) return content;
  return (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined}>
      {content}
    </a>
  );
}

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const serviceOptions = useMemo(() => services.map((service) => service.title), []);

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
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label="Offerte aanvragen">
      <div className="mx-auto my-4 max-w-3xl rounded-lg bg-whitewash shadow-2xl md:my-10">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-7">
          <div>
            <p className="eyebrow">Offerte aanvragen</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">Vertel kort wat er moet gebeuren.</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">Voor het concept is dit formulier front-end only. In de live versie koppelen we dit aan e-mail of CRM.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white" aria-label="Sluiten">
            <X size={22} />
          </button>
        </div>

        <form
          className="grid gap-5 p-5 md:grid-cols-2 md:p-7"
          onSubmit={(event) => {
            event.preventDefault();
            onClose();
          }}
        >
          <label className="grid gap-2 text-sm font-bold text-navy">
            Naam
            <input className="field" placeholder="Uw naam" autoComplete="name" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            Telefoonnummer
            <input className="field" placeholder={phoneDisplay} autoComplete="tel" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            E-mailadres
            <input className="field" type="email" placeholder={email} autoComplete="email" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy">
            Dienst
            <select className="field" defaultValue="">
              <option value="" disabled>
                Kies een dienst
              </option>
              {serviceOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
              <option>Totaalrenovatie</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
            Projectomschrijving
            <textarea className="field min-h-32 resize-y" placeholder="Bijvoorbeeld: buitenschilderwerk kozijnen, houtrot bij voordeur, stucwerk woonkamer..." />
          </label>
          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-md border border-dashed border-navy/25 bg-white p-4 text-sm font-bold text-navy md:col-span-2">
            <span className="flex items-center gap-3">
              <Upload size={20} className="text-roller" />
              Foto’s meesturen
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite/65">Optioneel</span>
            <input type="file" multiple className="sr-only" />
          </label>
          <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
            <p className="text-sm leading-6 text-graphite">Liever direct bellen? RN Schilders is bereikbaar via {phoneDisplay}.</p>
            <button type="submit" className="btn-primary">
              Verstuur aanvraag
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MobileCta({ openQuote }: { openQuote: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 440);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.88fr_1.12fr] gap-2 bg-whitewash/94 px-4 pt-3 shadow-[0_-12px_30px_-24px_rgba(20,36,59,0.8)] backdrop-blur-md md:hidden">
      <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline px-3">
        <MessageCircle size={17} />
        WhatsApp
      </a>
      <button type="button" onClick={openQuote} className="btn-primary px-3 text-xs sm:text-sm">
        Gratis prijsindicatie
      </button>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-ink py-10 text-white">
      <div className="shell flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold">RN Schilders & Renovatie</p>
          <p className="mt-2 text-sm text-white/62">Vakwerk dat zichtbaar blijft in Woerden en omgeving.</p>
        </div>
        <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/78">
          <a href="https://www.facebook.com/profile.php?id=61588338225794" target="_blank" rel="noreferrer" className="hover:text-white">
            Facebook
          </a>
          <a href="https://www.instagram.com/rn.schilders/" target="_blank" rel="noreferrer" className="hover:text-white">
            Instagram
          </a>
          <a href={`mailto:${email}`} className="hover:text-white">
            {email}
          </a>
        </div>
      </div>
    </footer>
  );
}

export default App;
