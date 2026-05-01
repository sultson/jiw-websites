import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock3,
  FileText,
  Hammer,
  Home,
  Loader2,
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
const email = 'info@rn-schilders.nl';
const mapsHref = 'https://www.google.com/maps/search/?api=1&query=Kuipersweg+33+3449+JA+Woerden';
const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY || '';
const attachmentAccept = '.jpg,.jpeg,.png,.webp,.heic,.heif,.pdf,image/jpeg,image/png,image/webp,image/heic,image/heif,application/pdf';
const MAX_ATTACHMENTS = 5;
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const SUCCESS_AUTO_CLOSE_MS = 3200;

function isLocalFormHost() {
  if (typeof window === 'undefined') return false;
  return ['localhost', '127.0.0.1', '[::1]', '::1'].includes(window.location.hostname);
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File) {
  return file.type.startsWith('image/') && !file.type.includes('heic') && !file.type.includes('heif');
}

declare global {
  interface Window {
    turnstile?: {
      render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}

type TurnstileRenderOptions = {
  sitekey: string;
  callback: (token: string) => void;
  'expired-callback': () => void;
  'error-callback': () => void;
};

type Service = {
  title: string;
  text: string;
  image: string;
  width: number;
  height: number;
  icon: typeof PaintRoller;
  bullets: string[];
  detailTitle: string;
  detailIntro: string;
  detailSections: Array<{
    title: string;
    items: string[];
  }>;
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
    width: 1300,
    height: 867,
    icon: PaintRoller,
    bullets: ['Binnen en buiten', 'Kozijnen en boeidelen', 'Onderhoudsplanning'],
    detailTitle: 'Binnen- en buitenschilderwerk',
    detailIntro:
      'Schilderwerk bepaalt de uitstraling van uw woning of bedrijfspand, maar beschermt ook tegen vocht, UV en slijtage. RN Schilders werkt met grondige voorbereiding en hoogwaardige verfproducten voor een duurzaam eindresultaat.',
    detailSections: [
      {
        title: 'Binnen',
        items: ['Muren, plafonds, kozijnen, deuren en trappen', 'Schoonmaken, schuren, vullen en gronden', 'Kleuradvies en planning met minimale overlast'],
      },
      {
        title: 'Buiten',
        items: ['Inspectie van houtwerk en bestaande verflagen', 'Herstelwerk voordat er afgewerkt wordt', 'Bescherming tegen weer, vocht en zon'],
      },
    ],
  },
  {
    title: 'Kozijnen',
    text: 'Renovatie, plaatsing en herstel van houten en kunststof kozijnen, inclusief hang- en sluitwerk met PKVW-focus.',
    image: '/kozijnen-3.webp',
    width: 1100,
    height: 733,
    icon: Home,
    bullets: ['Hout en kunststof', 'Plaatsing en renovatie', 'PKVW hang- en sluitwerk'],
    detailTitle: 'Houten en kunststof kozijnen',
    detailIntro:
      'RN Schilders helpt met levering, plaatsing, renovatie en onderhoud van kozijnen. De focus ligt op uitstraling, isolatie, veiligheid en een lange levensduur.',
    detailSections: [
      {
        title: 'Houten kozijnen',
        items: ['Warme, luxe uitstraling', 'Goed te herstellen en geschikt voor maatwerk', 'Sterke isolatie bij correcte plaatsing en onderhoud'],
      },
      {
        title: 'Kunststof kozijnen',
        items: ['Onderhoudsarm en kleurvast', 'Goede warmte- en geluidsisolatie', 'Weerbestendig en geschikt voor moderne renovaties'],
      },
      {
        title: 'Veiligheid',
        items: ['PKVW-gecertificeerd hang- en sluitwerk', 'Aandacht voor inbraakwering', 'Advies per woning of bedrijfspand'],
      },
    ],
  },
  {
    title: 'Spuitwerk',
    text: 'Egaal spuitwerk voor woningen, kantoren en bedrijfspanden wanneer tempo en een moderne afwerking belangrijk zijn.',
    image: '/spuitwerk.webp',
    width: 1300,
    height: 867,
    icon: Sparkles,
    bullets: ['Muren en plafonds', 'Kantoren en woningen', 'Glad eindresultaat'],
    detailTitle: 'Professioneel spuitwerk',
    detailIntro:
      'Spuitwerk is een efficiënte techniek om wanden, plafonds en grote oppervlakken strak en egaal af te werken. Vooral bij grotere ruimtes geeft het een rustig en modern resultaat.',
    detailSections: [
      {
        title: 'Toepassingen',
        items: ['Woningen, nieuwbouw en renovaties', 'Kantoren, winkels en bedrijfspanden', 'Muren, plafonds en andere grote oppervlakken'],
      },
      {
        title: 'Voorbereiding',
        items: ['Reinigen en gladmaken van ondergronden', 'Herstellen van beschadigingen', 'Zorgvuldig afplakken van vloeren, ramen en deuren'],
      },
    ],
  },
  {
    title: 'Stucwerk',
    text: 'Gladde wanden en plafonds als sterke basis voor schilderwerk, renovatiestuc en reparaties in bestaande woningen.',
    image: '/stukadoor.webp',
    width: 1100,
    height: 762,
    icon: Ruler,
    bullets: ['Pleisterwerk', 'Nieuwbouw en renovatie', 'Reparaties'],
    detailTitle: 'Strak stucwerk in Woerden',
    detailIntro:
      'Goed stucwerk is de basis voor een strak interieur. RN Schilders verzorgt pleisterwerk voor wanden en plafonds, inclusief voorbereiding en schadeherstel.',
    detailSections: [
      {
        title: 'Werkzaamheden',
        items: ['Wanden en plafonds glad afwerken', 'Ondergrond voorbereiden en beschadigingen herstellen', 'Geschikt voor renovatie en nieuwbouw'],
      },
      {
        title: 'Combinatie',
        items: ['Naadloos te combineren met schilderwerk', 'Ook geschikt als basis voor spuitwerk', 'Een vaste partij voor voorbereiding en afwerking'],
      },
    ],
  },
  {
    title: 'Houtrotherstel',
    text: 'Aangetast houtwerk duurzaam herstellen voordat vocht grotere schade veroorzaakt aan kozijnen, deuren of boeidelen.',
    image: '/houtrotherstel.webp',
    width: 1200,
    height: 675,
    icon: Wrench,
    bullets: ['Inspectie en herstel', 'Schuren en gronden', 'Bescherming op termijn'],
    detailTitle: 'Houtrotherstel zonder onnodige vervanging',
    detailIntro:
      'Houtrot komt vaak voor bij kozijnen, deuren, boeidelen en ander buitenhout. Tijdig herstel voorkomt dat kleine vochtproblemen uitgroeien tot kostbare vervanging.',
    detailSections: [
      {
        title: 'Aanpak',
        items: ['Grondige inspectie van aangetast houtwerk', 'Beschadigd hout zorgvuldig verwijderen', 'Herstel met gespecialiseerde reparatieproducten'],
      },
      {
        title: 'Afwerking',
        items: ['Schuren, gronden en strak schilderen', 'Bescherming tegen vocht en temperatuurwisselingen', 'Preventief advies voor toekomstig onderhoud'],
      },
    ],
  },
  {
    title: 'Sloopwerk',
    text: 'Zorgvuldig voorbereid sloopwerk voor renovaties, zodat de ruimte schoon, veilig en klaar is voor de volgende stap.',
    image: '/sloopwerk.webp',
    width: 1000,
    height: 500,
    icon: Hammer,
    bullets: ['Voor renovatie', 'Veilig en netjes', 'Afvoer in overleg'],
    detailTitle: 'Sloopwerk als voorbereiding op renovatie',
    detailIntro:
      'Sloopwerk is vaak de eerste fase van een verbouwing. RN Schilders verwijdert oude materialen veilig en zorgvuldig, zodat de ruimte klaar is voor herstel, stucwerk, schilderwerk of spuitwerk.',
    detailSections: [
      {
        title: 'Voorbereiding',
        items: ['Verwijderen van oude wanden, afwerkingen en plafondmaterialen', 'Werkruimte netjes en veilig houden', 'Materialen zorgvuldig loshalen en afvoeren in overleg'],
      },
      {
        title: 'Aansluiting op afwerking',
        items: ['Direct door naar herstelwerk', 'Stucwerk, schilderwerk en spuitwerk sluiten aan', 'Geschikt voor woningen en bedrijfspanden in de regio Woerden'],
      },
    ],
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
    <div id="top" className="min-h-[100dvh] bg-paper">
      <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} openQuote={() => setQuoteOpen(true)} />
      <main className="pt-16 md:pt-20">
        <Hero openQuote={() => setQuoteOpen(true)} />
        <ProofStrip />
        <OwnerSection openQuote={() => setQuoteOpen(true)} />
        <Services openQuote={() => setQuoteOpen(true)} />
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
    <header className={`fixed inset-x-0 top-0 z-50 transition ${scrolled ? 'bg-whitewash/95 shadow-sm backdrop-blur-md' : 'bg-whitewash/90 backdrop-blur-sm'}`}>
      <div className="shell flex h-16 items-center justify-between md:h-20">
        <a href="#top" className="flex min-w-0 items-center gap-3" aria-label="RN Schilders & Renovatie">
          <img src="/logo-mark.webp" alt="" width={800} height={679} className="h-11 w-11 object-contain" />
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
        <img
          src="/workspace-hero.webp"
          srcSet="/workspace-hero-mobile.webp 720w, /workspace-hero.webp 1536w"
          sizes="100vw"
          alt=""
          width={1536}
          height={1024}
          className="hero-bg h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(13,30,61,0.94)_0%,rgba(13,30,61,0.78)_46%,rgba(13,30,61,0.28)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-paper to-transparent" />
      </div>

      <div className="shell relative flex min-h-[82dvh] items-center py-14 md:min-h-[calc(92dvh-5rem)] md:py-24">
        <div className="w-full max-w-3xl pb-12">
          <p className="hero-reveal hero-reveal-1 eyebrow max-w-full text-[10px] tracking-[0.14em] text-roller-soft sm:text-xs sm:tracking-[0.18em]">
            Schilder en renovatiebedrijf in Woerden
          </p>
          <h1 className="hero-reveal hero-reveal-2 mt-5 max-w-full text-[2.45rem] font-extrabold leading-[0.98] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">RN Schilders</span>
            <span className="block">& Renovatie</span>
          </h1>
          <p className="hero-reveal hero-reveal-3 mt-6 max-w-2xl text-base leading-7 text-white/88 sm:text-lg sm:leading-8 md:text-xl">
            Vakwerk dat zichtbaar blijft. Richard werkt zelf mee op de vloer, bewaakt de afwerking en regelt schilderwerk, kozijnen, stucwerk en renovatie vanuit één aanspreekpunt.
          </p>

          <div className="hero-reveal hero-reveal-4 mt-8 flex flex-col gap-3 md:flex-row md:flex-wrap">
            <button type="button" onClick={openQuote} className="btn-primary w-full md:w-auto">
              Gratis prijsindicatie
              <ArrowRight size={18} />
            </button>
            <a href={phoneHref} className="btn-light w-full md:w-auto">
              <Phone size={18} />
              {phoneDisplay}
            </a>
          </div>

          <div className="hero-reveal hero-reveal-5 mt-8 grid max-w-2xl grid-cols-2 gap-3 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="min-w-0 rounded-md border border-white/15 bg-white/10 p-4 text-white backdrop-blur-sm">
                <strong className="block font-display text-2xl font-extrabold">{value}</strong>
                <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.1em] text-white/85 sm:text-xs">{label}</span>
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
        <div className="grid overflow-hidden rounded-lg border border-line bg-whitewash shadow-[0_24px_70px_-46px_rgba(13,30,61,0.55)] md:grid-cols-4">
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
          <img src="/logo-mark.webp" alt="RN Schilders & Renovatie logo" width={800} height={679} className="aspect-[4/5] w-full rounded-lg object-contain p-4 sm:aspect-auto" loading="lazy" decoding="async" />
          <div className="grid gap-4">
            <img src="/hoogwerker.webp" alt="RN Schilders aan het werk bij buitenschilderwerk" width={810} height={540} className="h-full min-h-52 rounded-lg object-cover" loading="lazy" decoding="async" />
            <div className="rounded-lg border border-line bg-whitewash p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite">Belofte</p>
              <img
                src="/slogan.webp"
                alt="Vakwerk met passie."
                width={500}
                height={341}
                className="mt-2 h-auto w-full max-w-xs"
                loading="lazy"
                decoding="async"
              />
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

function Services({ openQuote }: { openQuote: () => void }) {
  const [selectedService, setSelectedService] = useState<Service | null>(null);

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
            <button
              key={service.title}
              type="button"
              onClick={() => setSelectedService(service)}
              className="group overflow-hidden rounded-lg border border-line bg-white text-left transition hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-30px_rgba(13,30,61,0.65)] focus-visible:-translate-y-0.5"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={service.image}
                  alt=""
                  width={service.width}
                  height={service.height}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                  loading="lazy"
                  decoding="async"
                />
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
                <div className="mt-5 flex items-center gap-2 text-sm font-bold text-roller">
                  Lees uitleg
                  <ArrowRight size={16} />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      <ServiceModal service={selectedService} onClose={() => setSelectedService(null)} openQuote={openQuote} />
    </section>
  );
}

function ServiceModal({
  service,
  onClose,
  openQuote,
}: {
  service: Service | null;
  onClose: () => void;
  openQuote: () => void;
}) {
  useEffect(() => {
    if (!service) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [service, onClose]);

  if (!service) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label={`${service.title} uitleg`}>
      <div className="mx-auto my-4 max-w-4xl overflow-hidden rounded-lg bg-whitewash shadow-2xl md:my-10">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative min-h-64 bg-navy">
            <img src={service.image} alt="" width={service.width} height={service.height} className="h-full w-full object-cover" />
            <div className="absolute left-5 top-5 rounded-md bg-navy p-3 text-white">
              <service.icon size={24} />
            </div>
          </div>
          <div className="p-5 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Onze diensten</p>
                <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-navy">{service.detailTitle}</h2>
              </div>
              <button type="button" onClick={onClose} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white" aria-label="Sluiten">
                <X size={22} />
              </button>
            </div>
            <p className="mt-5 text-base leading-7 text-graphite">{service.detailIntro}</p>
            <div className="mt-6 grid gap-5">
              {service.detailSections.map((section) => (
                <div key={section.title} className="rounded-md border border-line bg-white p-4">
                  <h3 className="font-display text-xl font-extrabold text-navy">{section.title}</h3>
                  <div className="mt-3 grid gap-2">
                    {section.items.map((item) => (
                      <div key={item} className="flex gap-2 text-sm leading-6 text-ink">
                        <Check className="mt-1 shrink-0 text-roller" size={16} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openQuote();
                }}
                className="btn-primary"
              >
                Gratis prijsindicatie
                <ArrowRight size={17} />
              </button>
              <a href={whatsappHref} target="_blank" rel="noreferrer" className="btn-outline">
                <MessageCircle size={17} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
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
            <p className="mt-6 text-lg leading-8 text-white/88">
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
                <img src={src} alt={`Voordeur ${label.toLowerCase()} behandeling`} width={451} height={590} className="aspect-[4/5] w-full object-cover" loading="lazy" decoding="async" />
                <figcaption className="border-t border-white/10 px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white/85">
                  {label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <ProjectSlideshow
            slides={['/interieur-slide-1.webp', '/interieur-slide-2.webp', '/interieur-slide-3.webp']}
            imageWidth={720}
            imageHeight={880}
            title="Interieur renovatie"
            text="Donkere luxe tint, strak afgewerkt en direct klaar voor gebruik."
          />
          <ProjectSlideshow
            slides={['/kantoor-slide-1.webp', '/kantoor-slide-2.webp', '/kantoor-slide-3.webp']}
            imageWidth={720}
            imageHeight={1072}
            title="Casco naar kantoor"
            text="Systeemwanden, isolatie, plafonds, stuc- en schilderwerk in één traject."
          />
        </div>
      </div>
    </section>
  );
}

function ProjectSlideshow({
  slides,
  imageWidth,
  imageHeight,
  title,
  text,
}: {
  slides: string[];
  imageWidth: number;
  imageHeight: number;
  title: string;
  text: string;
}) {
  return (
    <article className="grid overflow-hidden rounded-lg border border-white/10 bg-white/8 md:grid-cols-[0.72fr_1fr]">
      <div className="project-slideshow relative min-h-72 overflow-hidden bg-navy md:h-full">
        {slides.map((slide, index) => (
          <img
            key={slide}
            src={slide}
            alt=""
            width={imageWidth}
            height={imageHeight}
            className="project-slide absolute inset-0 h-full w-full object-cover"
            style={{ animationDelay: `${index * 4}s` }}
            loading="lazy"
            decoding="async"
          />
        ))}
      </div>
      <div className="p-6">
        <h3 className="font-display text-2xl font-extrabold">{title}</h3>
        <p className="mt-3 leading-7 text-white/88">{text}</p>
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
            <img src="/pkvw-logo.webp" alt="PKVW logo" width={450} height={160} className="h-14 w-auto rounded-md bg-white p-2" />
            <h3 className="mt-8 font-display text-3xl font-extrabold leading-tight">Gratis offerte, snelle opname en duidelijke scope.</h3>
            <p className="mt-4 leading-7 text-white/88">
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
              width="600"
              height="420"
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
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-graphite">{label}</p>
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

type FilePreview = { file: File; key: string; url: string | null };

function QuoteModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const serviceOptions = useMemo(() => services.map((service) => service.title), []);
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [submitState, setSubmitState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [attachmentNotice, setAttachmentNotice] = useState('');
  const formRef = useRef<HTMLFormElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isSubmitting = submitState === 'submitting';
  const isSuccess = submitState === 'success';
  const isLocalForm = isLocalFormHost();
  const shouldUseTurnstile = Boolean(turnstileSiteKey && !isLocalForm);
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose, isSubmitting]);

  const previewsRef = useRef<FilePreview[]>([]);
  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);
  useEffect(() => {
    return () => {
      for (const preview of previewsRef.current) {
        if (preview.url) URL.revokeObjectURL(preview.url);
      }
    };
  }, []);

  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => {
      setPreviews((prev) => {
        for (const preview of prev) {
          if (preview.url) URL.revokeObjectURL(preview.url);
        }
        return [];
      });
      setSubmitState('idle');
      setSubmitMessage('');
      setAttachmentNotice('');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
      formRef.current?.reset();
    }, 250);
    return () => clearTimeout(t);
  }, [open]);

  useEffect(() => {
    if (!isSuccess) return;
    const t = setTimeout(onClose, SUCCESS_AUTO_CLOSE_MS);
    return () => clearTimeout(t);
  }, [isSuccess, onClose]);

  const addFiles = (incoming: File[]) => {
    setPreviews((prev) => {
      const seen = new Set(prev.map((p) => p.key));
      const next: FilePreview[] = [...prev];
      let skippedDuplicate = 0;
      let skippedSize = 0;
      let skippedCap = 0;

      for (const file of incoming) {
        if (file.size === 0) continue;
        const key = `${file.name}__${file.size}__${file.lastModified}`;
        if (seen.has(key)) {
          skippedDuplicate += 1;
          continue;
        }
        if (file.size > MAX_ATTACHMENT_BYTES) {
          skippedSize += 1;
          continue;
        }
        if (next.length >= MAX_ATTACHMENTS) {
          skippedCap += 1;
          continue;
        }
        seen.add(key);
        next.push({ file, key, url: isImageFile(file) ? URL.createObjectURL(file) : null });
      }

      const notices: string[] = [];
      if (skippedCap > 0) notices.push(`Maximaal ${MAX_ATTACHMENTS} bestanden. ${skippedCap} bestand(en) overgeslagen.`);
      if (skippedSize > 0) notices.push(`${skippedSize} bestand(en) groter dan 10 MB overgeslagen.`);
      if (skippedDuplicate > 0) notices.push(`${skippedDuplicate} duplicaat overgeslagen.`);
      setAttachmentNotice(notices.join(' '));

      return next;
    });
  };

  const removeFile = (key: string) => {
    setPreviews((prev) => {
      const target = prev.find((p) => p.key === key);
      if (target?.url) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.key !== key);
    });
    setAttachmentNotice('');
  };

  const submitQuote = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!shouldUseTurnstile && !isLocalForm && !import.meta.env.DEV) {
      setSubmitState('error');
      setSubmitMessage('De spambeveiliging is nog niet ingesteld. Bel of mail RN Schilders direct.');
      return;
    }

    if (shouldUseTurnstile && !turnstileToken) {
      setSubmitState('error');
      setSubmitMessage('De spamcontrole is nog niet klaar. Probeer het formulier opnieuw te versturen.');
      return;
    }

    setSubmitState('submitting');
    setSubmitMessage('');

    try {
      const formData = new FormData(form);
      formData.delete('files');
      for (const preview of previews) {
        formData.append('files', preview.file, preview.file.name);
      }
      if (turnstileToken) formData.set('cf-turnstile-response', turnstileToken);

      const response = await fetch('/api/forms/offerte', {
        method: 'POST',
        body: formData,
      });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || 'De aanvraag kon niet worden verstuurd.');
      }

      setSubmitState('success');
      setSubmitMessage('Bedankt. RN Schilders heeft uw aanvraag ontvangen en neemt zo snel mogelijk contact op.');
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      const totalBytes = previews.reduce((sum, p) => sum + (p.file?.size ?? 0), 0);
      const beacon = JSON.stringify({
        name: err.name,
        message: err.message,
        online: typeof navigator !== 'undefined' ? navigator.onLine : null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
        attachmentCount: previews.length,
        attachmentBytes: totalBytes,
        turnstilePresent: Boolean(turnstileToken),
        href: typeof window !== 'undefined' ? window.location.href : null,
        ts: new Date().toISOString(),
      });
      try {
        const blob = new Blob([beacon], { type: 'application/json' });
        if (typeof navigator !== 'undefined' && navigator.sendBeacon?.('/api/forms/offerte/log', blob)) {
          // delivered
        } else {
          void fetch('/api/forms/offerte/log', { method: 'POST', body: beacon, headers: { 'content-type': 'application/json' }, keepalive: true }).catch(() => {});
        }
      } catch {
        // swallow — beacon is best-effort
      }
      setSubmitState('error');
      setSubmitMessage(err.message || 'De aanvraag kon niet worden verstuurd. Bel of mail RN Schilders direct.');
      setTurnstileToken('');
      setTurnstileResetKey((value) => value + 1);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-navy/70 p-4 backdrop-blur-sm md:p-6" role="dialog" aria-modal="true" aria-label="Offerte aanvragen">
      <div className="mx-auto my-4 max-w-3xl rounded-lg bg-whitewash shadow-2xl md:my-10">
        <div className="flex items-start justify-between gap-4 border-b border-line p-5 md:p-7">
          <div>
            <p className="eyebrow">Offerte aanvragen</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-navy">Vertel kort wat er moet gebeuren.</h2>
            <p className="mt-2 text-sm leading-6 text-graphite">Stuur de belangrijkste projectinformatie en eventueel foto's mee. Richard ontvangt uw aanvraag direct per e-mail.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-line bg-white disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Sluiten"
          >
            <X size={22} />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center gap-4 px-6 py-16 text-center md:px-10 md:py-20">
            <div className="success-check flex h-20 w-20 items-center justify-center rounded-full bg-door text-white shadow-[0_18px_30px_-18px_rgba(35,83,63,0.9)]">
              <Check size={44} strokeWidth={3} />
            </div>
            <h3 className="font-display text-2xl font-extrabold text-navy md:text-3xl">Aanvraag verstuurd</h3>
            <p className="max-w-md text-sm leading-6 text-graphite">
              {submitMessage || 'Bedankt. RN Schilders heeft uw aanvraag ontvangen en neemt zo snel mogelijk contact op.'}
            </p>
            <div className="mt-2 h-1 w-48 overflow-hidden rounded-full bg-line">
              <div className="success-bar h-full bg-door" />
            </div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-graphite">Dit venster sluit automatisch</p>
          </div>
        ) : (
          <div className="relative">
            <form
              ref={formRef}
              className={`grid gap-5 p-5 md:grid-cols-2 md:p-7 ${isSubmitting ? 'pointer-events-none select-none opacity-60' : ''}`}
              onSubmit={submitQuote}
              aria-busy={isSubmitting}
            >
              <label className="grid gap-2 text-sm font-bold text-navy">
                Naam
                <input className="field" name="name" placeholder="Uw naam" autoComplete="name" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Telefoonnummer
                <input className="field" name="phone" placeholder={phoneDisplay} autoComplete="tel" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                E-mailadres
                <input className="field" name="email" type="email" placeholder={email} autoComplete="email" required />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Dienst <span className="text-xs font-semibold text-graphite">optioneel</span>
                <select className="field" name="service" defaultValue="">
                  <option value="">
                    Nog niet zeker
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                  <option>Totaalrenovatie</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Postcode of plaats <span className="text-xs font-semibold text-graphite">optioneel</span>
                <input className="field" name="postalCode" placeholder="3449 JA Woerden" autoComplete="postal-code" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy">
                Gewenste planning
                <input className="field" name="preferredTiming" placeholder="Bijvoorbeeld: binnen 4 weken" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
                Adres
                <input className="field" name="address" placeholder="Straat en huisnummer, optioneel" autoComplete="street-address" />
              </label>
              <label className="grid gap-2 text-sm font-bold text-navy md:col-span-2">
                Projectomschrijving
                <textarea
                  className="field min-h-32 resize-y"
                  name="message"
                  placeholder="Bijvoorbeeld: buitenschilderwerk kozijnen, houtrot bij voordeur, stucwerk woonkamer..."
                  required
                  minLength={10}
                />
              </label>

              <div className="md:col-span-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={attachmentAccept}
                  multiple
                  className="sr-only"
                  onChange={(event) => {
                    const picked = Array.from(event.currentTarget.files ?? []);
                    if (picked.length) addFiles(picked);
                    event.currentTarget.value = '';
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={previews.length >= MAX_ATTACHMENTS}
                  className="flex w-full items-center justify-between gap-4 rounded-md border border-dashed border-navy/25 bg-white p-4 text-left text-sm font-bold text-navy transition hover:border-roller/60 hover:bg-roller/5 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-3">
                    <Upload size={20} className="text-roller" />
                    {previews.length === 0 ? "Foto's of PDF meesturen" : 'Meer bestanden toevoegen'}
                  </span>
                  <span className="text-xs font-semibold uppercase tracking-[0.12em] text-graphite">
                    {previews.length}/{MAX_ATTACHMENTS}
                  </span>
                </button>
                {attachmentNotice && (
                  <p className="mt-2 text-xs font-semibold text-roller" role="status">
                    {attachmentNotice}
                  </p>
                )}
                {previews.length > 0 && (
                  <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {previews.map((preview) => (
                      <li key={preview.key} className="group relative overflow-hidden rounded-md border border-line bg-white">
                        <div className="flex aspect-square items-center justify-center bg-paper">
                          {preview.url ? (
                            <img src={preview.url} alt={preview.file.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex flex-col items-center justify-center gap-2 p-3 text-center">
                              <FileText size={28} className="text-roller" />
                              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-graphite">
                                {preview.file.name.split('.').pop()?.toUpperCase() || 'Bestand'}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="border-t border-line px-2 py-1.5">
                          <p className="truncate text-xs font-semibold text-navy" title={preview.file.name}>
                            {preview.file.name}
                          </p>
                          <p className="text-[10px] text-graphite">{formatFileSize(preview.file.size)}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFile(preview.key)}
                          aria-label={`${preview.file.name} verwijderen`}
                          className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-navy/85 text-white shadow-md transition hover:bg-navy md:opacity-0 md:focus:opacity-100 md:group-hover:opacity-100"
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="md:col-span-2">
                {shouldUseTurnstile ? (
                  <TurnstileWidget siteKey={turnstileSiteKey} resetKey={turnstileResetKey} onTokenChange={handleTurnstileToken} />
                ) : (
                  <input type="hidden" name="cf-turnstile-response" value="dev" />
                )}
              </div>
              {submitMessage && submitState === 'error' && (
                <div
                  className="rounded-md border border-roller/25 bg-roller/10 p-4 text-sm font-semibold text-roller md:col-span-2"
                  role="status"
                >
                  {submitMessage}
                </div>
              )}
              <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-between">
                <p className="text-sm leading-6 text-graphite">
                  Liever direct bellen? RN Schilders is bereikbaar via{' '}
                  <a href={phoneHref} className="font-bold text-navy underline decoration-roller/50 underline-offset-4">
                    {phoneDisplay}
                  </a>
                  .
                </p>
                <button type="submit" className="btn-primary disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting}>
                  Verstuur aanvraag
                  <ArrowRight size={17} />
                </button>
              </div>
            </form>
            {isSubmitting && (
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-b-lg bg-whitewash/85 backdrop-blur-[2px]"
                role="status"
                aria-live="polite"
              >
                <Loader2 size={40} className="animate-spin text-roller" />
                <p className="text-sm font-bold text-navy">Aanvraag wordt verstuurd…</p>
                <p className="text-xs text-graphite">Even geduld, dit duurt maximaal een paar seconden.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function TurnstileWidget({
  siteKey,
  resetKey,
  onTokenChange,
}: {
  siteKey: string;
  resetKey: number;
  onTokenChange: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const hasResetSignalMountedRef = useRef(false);

  useEffect(() => {
    let timer: number | undefined;
    let cancelled = false;

    const renderWidget = () => {
      if (cancelled || widgetIdRef.current || !containerRef.current || !window.turnstile?.render) return false;

      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: onTokenChange,
        'expired-callback': () => onTokenChange(''),
        'error-callback': () => onTokenChange(''),
      });
      return true;
    };

    if (!renderWidget()) {
      timer = window.setInterval(() => {
        if (renderWidget() && timer) window.clearInterval(timer);
      }, 150);
    }

    return () => {
      cancelled = true;
      if (timer) window.clearInterval(timer);
      if (widgetIdRef.current) {
        try {
          window.turnstile?.remove?.(widgetIdRef.current);
        } catch {
          // Turnstile may already have removed the iframe while the modal is unmounting.
        }
        widgetIdRef.current = null;
      }
      onTokenChange('');
    };
  }, [onTokenChange, siteKey]);

  useEffect(() => {
    if (!hasResetSignalMountedRef.current) {
      hasResetSignalMountedRef.current = true;
      return;
    }
    if (!widgetIdRef.current) return;
    try {
      window.turnstile?.reset?.(widgetIdRef.current);
    } catch {
      return;
    }
    onTokenChange('');
  }, [onTokenChange, resetKey]);

  return <div ref={containerRef} />;
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
    <div className="safe-bottom fixed inset-x-0 bottom-0 z-40 grid grid-cols-[0.88fr_1.12fr] gap-2 bg-whitewash/94 px-4 pt-3 shadow-[0_-12px_30px_-24px_rgba(13,30,61,0.8)] backdrop-blur-md md:hidden">
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

function TrustooWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://static.trustoo.nl/widget/widget_v2.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      className="trustoo-widget"
      data-id="uOmxp_aP-RjJ2uxfXOoY5KO9OTh1N2Y-3cH8Hpx4ezRvSg"
      data-language-code="nl"
      data-country-code="NL"
      data-badge="hidden"
      data-quote="default"
      data-size="small"
      data-type="landscape"
      data-border="shadow"
      data-theme="light"
      data-background="default"
      data-google="default"
    />
  );
}

function Footer() {
  return (
    <footer className="bg-ink pb-28 pt-10 text-white md:pb-10">
      <div className="shell flex flex-col gap-8">
        <TrustooWidget />
        <div className="flex flex-col gap-6 border-t border-white/10 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <img src="/logo-mono.webp" alt="" width={470} height={457} className="h-14 w-14 shrink-0 object-contain" loading="lazy" decoding="async" />
            <div>
              <p className="font-display text-2xl font-extrabold">RN Schilders & Renovatie</p>
              <p className="mt-2 text-sm text-white/85">Vakwerk dat zichtbaar blijft in Woerden en omgeving.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-white/88">
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
      </div>
    </footer>
  );
}

export default App;
