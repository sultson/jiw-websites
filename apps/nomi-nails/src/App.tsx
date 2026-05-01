import { useMemo, useState } from 'react';
import {
  ChevronDown,
  ExternalLink,
  Instagram,
  Languages,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react';
import { translations, type Lang } from './translations';

const instagramUrl = 'https://www.instagram.com/nomi.nails.biab/';
const dmUrl = 'https://ig.me/m/nomi.nails.biab';
const phoneDisplay = '06 34459824';
const phoneHref = 'tel:0634459824';
const googleUrl =
  'https://www.google.com/maps/search/?api=1&query=NOMI%20Nails%20-%20BIAB%20IN%20BEESD&query_place_id=ChIJbUTLR29pxkcRxPISLYg97sE';
const directionsUrl =
  'https://www.google.com/maps/dir/?api=1&destination=Meinte%2014%2C%204153%20XE%20Beesd&destination_place_id=ChIJbUTLR29pxkcRxPISLYg97sE';
const pricesHighlightUrl = 'https://www.instagram.com/stories/highlights/18085163504202951/';
const salonHighlightUrl = 'https://www.instagram.com/stories/highlights/17890833471385192/';
const salonRulesHighlightUrl = 'https://www.instagram.com/stories/highlights/18331228747238303/';
const aftercareHighlightUrl = 'https://www.instagram.com/stories/highlights/18085674742798632/';

const heroImage = {
  src: '/salon-interior-google.webp',
  alt: 'BIAB nagels bij NOMI Nails',
};

const salonStories = [
  {
    type: 'video',
    src: '/salon-highlight-new-spot.mp4',
    poster: '/salon-highlight-new-spot-poster.webp',
    thumb: '/salon-highlight-new-spot-poster.webp',
    alt: 'Video uit de Salon highlight van NOMI Nails',
    labelNl: 'Nieuwe plek',
    labelEn: 'New spot',
  },
  {
    type: 'image',
    src: '/salon-highlight-studio.webp',
    thumb: '/salon-highlight-studio.webp',
    alt: 'Salonruimte van NOMI Nails in Beesd',
    labelNl: 'Salon',
    labelEn: 'Studio',
  },
  {
    type: 'image',
    src: '/salon-highlight-patricia.webp',
    thumb: '/salon-highlight-patricia.webp',
    alt: 'Patricia in haar salon van NOMI Nails',
    labelNl: 'Patricia',
    labelEn: 'Patricia',
  },
] as const;

const gallery = [
  { src: '/biab-before-after-natural.webp', alt: 'BIAB before and after natural nails' },
  { src: '/pink-polkadot-biab.webp', alt: 'Roze BIAB met polkadots' },
  { src: '/spring-yellow-biab.webp', alt: 'Spring nails met gele nail art' },
  { src: '/chocolate-tortoise-biab.webp', alt: 'Chocolate tones met subtiel tortoise detail' },
  { src: '/miffy-nail-art-biab.webp', alt: 'BIAB met Nijntje nail art' },
  { src: '/french-kiss-glitterbels.webp', alt: 'French Kiss BIAB van Glitterbels' },
  { src: '/silver-pink-buildergel.webp', alt: 'Silver pink buildergel' },
  { src: '/salon-highlight-studio.webp', alt: 'Salonruimte van NOMI Nails' },
  { src: '/salon-highlight-patricia.webp', alt: 'Patricia in de salon van NOMI Nails' },
];

const highlightLinks = [
  {
    title: 'Prijzen',
    count: '1 item',
    image: '/patricia-consultation.webp',
    href: pricesHighlightUrl,
    textNl: 'Open direct de highlight met Patricia haar actuele prijslijst.',
    textEn: "Open the highlight with Patricia's current price list.",
  },
  {
    title: 'Salon',
    count: '3 items',
    image: '/salon-highlight-studio.webp',
    href: salonHighlightUrl,
    textNl: 'Bekijk de salon, materialen en sfeer achter de afspraak.',
    textEn: 'See the studio, materials and atmosphere behind the appointment.',
  },
  {
    title: 'Salon Regels',
    count: '1 item',
    image: '/salon-tea-desk.webp',
    href: salonRulesHighlightUrl,
    textNl: 'Handig om voor je afspraak even door te nemen.',
    textEn: 'Useful to check before your appointment.',
  },
  {
    title: 'Aftercare',
    count: '1 item',
    image: '/biab-before-after-natural.webp',
    href: aftercareHighlightUrl,
    textNl: 'Nazorg voor mooie, sterke nagels tussen afspraken door.',
    textEn: 'Aftercare for beautiful, strong nails between appointments.',
  },
];

const reviews = [
  {
    name: 'Jessica van Stroe',
    text: 'Ik ga altijd tevreden met mooie nagels weer de deur uit. Patricia werkt hygiënisch en met oog voor detail en een steeds uitgebreider assortiment aan kleuren. Zeker een aanrader wanneer je wat moois op je nagels wilt 👌',
    en: 'I always leave satisfied with beautiful nails. Patricia works hygienically, with an eye for detail and an ever-growing colour range.',
  },
  {
    name: 'Romy Heesbeen',
    text: 'Super nauwkeurig, creatief en oog voor details. Elke keer weer heel erg blij met het resultaat!',
    en: 'Super precise, creative and detail focused. Every time I am very happy with the result.',
  },
  {
    name: 'Charlotte Geitenbeek',
    text: 'Heel blij met mijn nagels! Super mooi gedaan, en het is ook heel gezellig. Patricia heeft mooie kleuren en werkt heel precies',
    en: 'Very happy with my nails. Beautifully done, and it is also very pleasant. Patricia has lovely colours and works very precisely.',
  },
  {
    name: 'Michelle Pouw',
    text: 'Ontzettend blij met de nagels die zijn gezet! Ik heb BIAB met daaroverheen gellak. Er werd meegedacht over ontwerpen en kleurencombinaties voor de nailart. Het is ook heel lang nog heel netjes blijven zitten!',
    en: 'So happy with the nails. I had BIAB with gel polish, and she thought along about designs and colour combinations.',
  },
  {
    name: 'kim geer',
    text: 'Ik kom nu een tijdje bij Patricia, en erg blij met het resultaat, me nagels zijn langer en steviger, ze is lief en het is erg gezellig tijdens de afspraak, ze is flexibel met inplannen. En altijd super mooie resultaten! Aanrader!!',
    en: 'I have been coming to Patricia for a while and am very happy with the result. My nails are longer and stronger, and appointments are always pleasant.',
  },
  {
    name: 'Suus van Stroe',
    text: 'Super blij met mijn Biab! Kwaliteit en afwerking staan bij Patries voorop. En altijd fijn dat ze meedenkt over een leuke kleur of nailart. Ik kan PS Nails van harte aanbevelen.',
    en: 'Very happy with my BIAB. Quality and finish come first, and she always thinks along about colour or nail art.',
  },
];

const services = [
  {
    key: 'biab',
    icon: ShieldCheck,
    titleNl: 'BIAB voor natuurlijke nagels',
    titleEn: 'BIAB for natural nails',
    textNl:
      'Versteviging op de eigen nagel met een natuurlijke uitstraling. Mooi voor wie sterke, verzorgde nagels wil zonder zware look.',
    textEn:
      'Strengthening on your own nail with a natural look. Ideal when you want cared-for nails without a heavy finish.',
  },
  {
    key: 'hardgel',
    icon: Sparkles,
    titleNl: 'Hardgel en buildergel',
    titleEn: 'Hard gel and builder gel',
    textNl:
      'Voor extra stevigheid en mooie kleurmogelijkheden. Denk aan zachte nude tinten, diepe kleuren en een glossy finish.',
    textEn:
      'For extra strength and colour options. Think soft nude shades, deeper colours and a glossy finish.',
  },
  {
    key: 'gellak',
    icon: Star,
    titleNl: 'Gellak en nail art',
    titleEn: 'Gel polish and nail art',
    textNl:
      'Van rustige nude sets tot polkadots, tortoise, seasonal nails en kleine details. Voor de prijslijst en mogelijkheden kun je naar Instagram.',
    textEn:
      'From calm nude sets to polka dots, tortoise, seasonal nails and small details. Prices and options are available through Instagram.',
  },
];

const facts = [
  ['5,0 ★', '12 Google reviews'],
  ['DM', 'Direct afspraak maken'],
  ['06', '34459824'],
  ['BIAB', 'Hardgel'],
];

export default function App() {
  const [lang, setLang] = useState<Lang>('nl');
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeStory, setActiveStory] = useState(0);
  const t = useMemo(() => translations[lang], [lang]);
  const reviewText = (review: (typeof reviews)[number]) => (lang === 'nl' ? review.text : review.en);
  const selectedStory = salonStories[activeStory];

  return (
    <div className="min-h-screen bg-porcelain text-ink">
      <div className="bg-ink px-4 py-2 text-center text-[9px] uppercase leading-5 tracking-[0.02em] text-porcelain sm:text-xs sm:tracking-[0.18em]">
        {t.topbar}
      </div>

      <nav className="sticky top-0 z-50 bg-porcelain/90 backdrop-blur border-b border-ink/10">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#top" className="font-serif text-2xl tracking-tight">
            NOMI <span className="text-clay">Nails</span>
          </a>
          <div className="hidden items-center gap-7 lg:flex">
            {[
              ['#over', t.navAbout],
              ['#behandelingen', t.navServices],
              ['#werk', t.navWork],
              ['#stories', t.navStories],
              ['#reviews', t.navReviews],
              ['#bezoek', t.navVisit],
            ].map(([href, label]) => (
              <a key={href} href={href} className="text-sm text-ink/70 hover:text-clay">
                {label}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setLang(lang === 'nl' ? 'en' : 'nl')}
              className="inline-flex h-10 items-center gap-1 rounded-full border border-ink/15 px-3 text-xs font-semibold uppercase"
              aria-label="Switch language"
            >
              <Languages size={15} className="hidden sm:block" />
              {lang === 'nl' ? 'EN' : 'NL'}
            </button>
            <a href={dmUrl} target="_blank" rel="noreferrer" className="hidden sm:inline-flex btn-primary">
              <Instagram size={16} />
              {t.dm}
            </a>
            <button className="lg:hidden p-2" onClick={() => setMenuOpen(v => !v)} aria-label="Menu">
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {menuOpen && (
          <div className="border-t border-ink/10 bg-porcelain px-5 py-5 lg:hidden">
            {[
              ['#over', t.navAbout],
              ['#behandelingen', t.navServices],
              ['#werk', t.navWork],
              ['#stories', t.navStories],
              ['#reviews', t.navReviews],
              ['#bezoek', t.navVisit],
            ].map(([href, label]) => (
              <a key={href} onClick={() => setMenuOpen(false)} href={href} className="block py-3 font-serif text-xl">
                {label}
              </a>
            ))}
          </div>
        )}
      </nav>

      <main>
        <section id="top" className="relative overflow-hidden">
          <div className="absolute inset-0" aria-hidden="true">
            <img src={heroImage.src} alt="" fetchPriority="high" className="hero-photo" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(21,19,18,0.9)_0%,rgba(42,27,28,0.72)_45%,rgba(73,45,39,0.2)_100%)]" />
            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-porcelain to-transparent" />
          </div>
          <div className="relative mx-auto flex min-h-[calc(100vh-104px)] max-w-7xl items-center px-4 pb-28 pt-16 sm:px-6 md:py-24 lg:px-8">
            <div className="max-w-[22rem] min-w-0 sm:max-w-3xl">
              <p className="kicker text-sage drop-shadow-[0_1px_3px_rgba(0,0,0,0.45)]">{t.heroKicker}</p>
              <h1 className="mt-5 max-w-[22rem] text-wrap font-serif text-[2.55rem] leading-[1.02] text-porcelain drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)] sm:max-w-full sm:text-7xl lg:text-8xl">
                {t.heroTitle}
              </h1>
              <p className="mt-6 max-w-[22rem] text-base leading-7 text-porcelain/88 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)] sm:max-w-xl sm:text-lg sm:leading-8">{t.heroSub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={dmUrl} target="_blank" rel="noreferrer" className="btn-primary bg-clay text-white hover:bg-porcelain hover:text-ink">
                  <MessageCircle size={17} />
                  {t.heroCta}
                </a>
                <a href={phoneHref} className="btn-outline border-porcelain/40 text-porcelain hover:border-porcelain hover:bg-porcelain hover:text-ink">
                  <Phone size={17} />
                  {t.call}
                </a>
                <a href={googleUrl} target="_blank" rel="noreferrer" className="btn-outline border-porcelain/30 text-porcelain hover:border-porcelain hover:bg-porcelain hover:text-ink">
                  <Star size={17} />
                  {t.googleCta}
                </a>
              </div>
              <div className="mt-12 grid max-w-[22rem] grid-cols-2 gap-3 text-porcelain sm:max-w-full sm:grid-cols-4">
                {facts.map(([big, small]) => (
                  <div key={big + small} className="border-l border-sage/50 pl-4">
                    <p className="font-serif text-2xl">{big}</p>
                    <p className="max-w-full text-[10px] uppercase tracking-[0.05em] text-porcelain/68 sm:text-xs sm:tracking-[0.12em]">{small}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="over" className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.8fr_1fr_0.78fr] lg:px-8">
            <div>
              <p className="kicker">{t.aboutKicker}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.aboutTitle}</h2>
            </div>
            <div className="space-y-5 text-ink/72 leading-8">
              <p>{t.aboutBody1}</p>
              <p>{t.aboutBody2}</p>
              <div className="grid gap-3 pt-4 sm:grid-cols-3">
                <div className="mini-card">{t.detailCertified}</div>
                <div className="mini-card">{t.detailMoved}</div>
                <div className="mini-card">{t.detailBrands}</div>
              </div>
            </div>
            <div className="owner-photo-grid">
              <img src="/salon-highlight-patricia.webp" alt="Patricia in haar salon van NOMI Nails" />
              <img src="/patricia-in-salon.webp" alt="Patricia aan het werk in de salon" />
            </div>
          </div>
        </section>

        <section id="salon" className="bg-porcelain py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-[1fr_0.72fr] lg:px-8">
            <div>
              <p className="kicker">{t.salonKicker}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.salonTitle}</h2>
              <p className="mt-5 text-ink/68 leading-7">{t.salonSub}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={dmUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <MessageCircle size={16} /> {t.heroCta}
                </a>
              </div>
            </div>
            <div className="story-showcase">
              <div className="story-frame">
                {selectedStory.type === 'video' ? (
                  <video
                    key={selectedStory.src}
                    id="salon-video"
                    src={selectedStory.src}
                    poster={selectedStory.poster}
                    controls
                    muted
                    preload="metadata"
                    playsInline
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img src={selectedStory.src} alt={selectedStory.alt} className="h-full w-full object-cover" />
                )}
              </div>
              <div className="story-thumbs" aria-label="Salon highlight items">
                {salonStories.map((story, index) => (
                  <button
                    key={story.src}
                    type="button"
                    onClick={() => setActiveStory(index)}
                    className={index === activeStory ? 'is-active' : ''}
                    aria-label={lang === 'nl' ? story.labelNl : story.labelEn}
                  >
                    <img src={story.thumb} alt="" loading="lazy" />
                    {story.type === 'video' && <PlayCircle size={20} />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="bg-white py-20 md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
              <div className="max-w-2xl">
                <p className="kicker">{t.storiesKicker}</p>
                <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.storiesTitle}</h2>
                <p className="mt-5 text-ink/65 leading-7">{t.storiesSub}</p>
              </div>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="btn-outline">
                <Instagram size={16} /> Instagram
              </a>
            </div>
            <div className="highlight-grid">
              {highlightLinks.map(highlight => (
                <a key={highlight.title} href={highlight.href} target="_blank" rel="noreferrer" className="highlight-card">
                  <img src={highlight.image} alt="" loading="lazy" />
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3>{highlight.title}</h3>
                      <span>{highlight.count}</span>
                    </div>
                    <p>{lang === 'nl' ? highlight.textNl : highlight.textEn}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-clay">
                      {t.openHighlight} <ExternalLink size={14} />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section id="behandelingen" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="kicker">{t.servicesKicker}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.servicesTitle}</h2>
              <p className="mt-5 text-ink/65 leading-7">{t.servicesSub}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {services.map(({ icon: Icon, ...service }) => (
                <article key={service.key} className="service-card">
                  <Icon className="text-clay" size={24} />
                  <h3 className="mt-5 font-serif text-2xl">
                    {lang === 'nl' ? service.titleNl : service.titleEn}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-ink/68">
                    {lang === 'nl' ? service.textNl : service.textEn}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="werk" className="bg-ink py-20 text-porcelain md:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="kicker text-sage">{t.workKicker}</p>
                <h2 className="mt-4 font-serif text-4xl text-porcelain md:text-5xl">{t.workTitle}</h2>
              </div>
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-sage hover:text-porcelain">
                Instagram <ExternalLink size={14} />
              </a>
            </div>
            <div className="gallery-grid">
              {gallery.map((image, index) => (
                <img key={image.src} src={image.src} alt={image.alt} loading={index > 1 ? 'lazy' : 'eager'} />
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="py-20 md:py-28">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="kicker">{t.reviewsKicker}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.reviewsTitle}</h2>
              <p className="mt-5 text-ink/65">{t.reviewsSub}</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map(review => (
                <article key={review.name} className="review-card">
                  <div className="flex gap-1 text-clay" aria-label="5 sterren">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="mt-5 text-sm leading-7 text-ink/72">"{reviewText(review)}"</p>
                  <p className="mt-5 font-semibold">{review.name}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="bezoek" className="bg-white py-20 md:py-28">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 sm:px-6 md:grid-cols-[0.9fr_1.1fr] lg:px-8">
            <div>
              <p className="kicker">{t.visitKicker}</p>
              <h2 className="mt-4 font-serif text-4xl md:text-5xl">{t.visitTitle}</h2>
              <div className="mt-8 space-y-5">
                <p className="flex gap-3 text-ink/75"><MapPin className="mt-1 shrink-0 text-clay" size={18} /> Meinte 14, 4153 XE Beesd</p>
                <p className="flex gap-3 text-ink/75"><Phone className="mt-1 shrink-0 text-clay" size={18} /> <a href={phoneHref} className="hover:text-clay">{phoneDisplay}</a></p>
                <p className="flex gap-3 text-ink/75"><Instagram className="mt-1 shrink-0 text-clay" size={18} /> {t.bookingLine}</p>
                <p className="flex gap-3 text-ink/75"><Star className="mt-1 shrink-0 text-clay" size={18} /> 5,0 op Google uit 12 reviews</p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href={dmUrl} target="_blank" rel="noreferrer" className="btn-primary">
                  <Instagram size={16} /> {t.dm}
                </a>
                <a href={phoneHref} className="btn-outline">
                  <Phone size={16} /> {t.call}
                </a>
                <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-outline">
                  <MapPin size={16} /> {t.route}
                </a>
              </div>
            </div>
            <iframe
              title="NOMI Nails op Google Maps"
              src="https://www.google.com/maps?cid=13974174348858290884&output=embed"
              className="min-h-[360px] w-full rounded-sm border border-ink/10"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <Faq lang={lang} />
      </main>

      <footer className="bg-ink px-4 py-12 text-porcelain">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-serif text-2xl">NOMI Nails</p>
            <p className="mt-2 text-sm text-porcelain/60">BIAB, hardgel en gellak in Beesd.</p>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href={phoneHref} className="hover:text-sage">{phoneDisplay}</a>
            <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-sage">Instagram</a>
            <a href={googleUrl} target="_blank" rel="noreferrer" className="hover:text-sage">Google</a>
            <a href="https://jouwidealewebsite.nl" target="_blank" rel="noreferrer" className="hover:text-sage">
              jouwidealewebsite.nl
            </a>
          </div>
        </div>
      </footer>

      <a href={dmUrl} target="_blank" rel="noreferrer" className="fixed bottom-4 left-4 right-4 z-40 flex items-center justify-center gap-2 rounded-full bg-clay px-5 py-4 text-sm font-semibold text-white shadow-xl sm:hidden">
        <MessageCircle size={18} />
        {t.heroCta}
      </a>
    </div>
  );
}

function Faq({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(0);
  const items =
    lang === 'nl'
      ? [
          ['Hoe maak ik een afspraak?', 'Stuur Patricia een DM via Instagram of bel haar direct. De knoppen op deze site brengen je meteen naar de juiste plek.'],
          ['Welke behandelingen kan ik boeken?', 'BIAB, hardgel, gellak en nail art. De prijslijst staat in de Instagram highlights.'],
          ['Waar zit NOMI Nails?', 'Aan de Meinte 14 in Beesd. Je kunt via Instagram DM of telefonisch een afspraak maken.'],
          ['Waarom Instagram en telefoon?', 'Veel klanten regelen hun afspraak via DM. Bellen kan ook, handig als je sneller wilt afstemmen.'],
        ]
      : [
          ['How do I book?', 'Send Patricia a DM on Instagram or call her directly. The buttons on this site take you straight there.'],
          ['Which treatments can I book?', 'BIAB, hard gel, gel polish and nail art. The price list is in the Instagram highlights.'],
          ['Where is NOMI Nails located?', 'At Meinte 14 in Beesd. You can book through Instagram DM or by phone.'],
          ['Why Instagram and phone?', 'Many clients arrange their appointment by DM. Calling is also available when you want to check something quickly.'],
        ];

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <p className="kicker text-center">FAQ</p>
        <h2 className="mt-4 text-center font-serif text-4xl md:text-5xl">Goed om te weten</h2>
        <div className="mt-10 divide-y divide-ink/10">
          {items.map(([question, answer], index) => (
            <div key={question}>
              <button
                className="flex w-full items-center justify-between gap-4 py-5 text-left font-serif text-xl"
                onClick={() => setOpen(open === index ? -1 : index)}
              >
                {question}
                <ChevronDown className={open === index ? 'rotate-180' : ''} size={20} />
              </button>
              {open === index && <p className="pb-5 leading-7 text-ink/68">{answer}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
