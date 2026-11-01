import {useState} from 'react';
import {
  ArrowRight, Boxes, Brush, ChevronDown, Coins, HandHeart, Mail, MapPin,
  Package, Phone, Quote, Recycle, ShieldCheck, Star, Truck,
} from 'lucide-react';
import {
  Bullet, GOOGLE_REVIEWS, Kicker, MAIL, PLAATSEN, Section, TEL, TEL_TEKST,
} from './ui';
import {Kop, MobieleBalk, Voet} from './layout';
import Aanvraag from './Aanvraag';
import Voorna from './Voorna';
import Kaart from './Kaart';

/* ------------------------------------------------------------------ */
/*  Inhoud                                                             */
/* ------------------------------------------------------------------ */

const DIENSTEN = [
  {
    icon: Truck,
    img: '/img/dienst-ontruiming.webp',
    titel: 'Opruiming en ontruiming',
    tekst:
      'Woningen, appartementen, kelders, zolders, garages en kantoren. Alles gaat eruit, tot het laatste doosje achteraan de zolder.',
  },
  {
    icon: Coins,
    img: '/img/opkoop-kast.webp',
    titel: 'Opkoop van inboedels',
    tekst:
      'Volledig of gedeeltelijk, aan een eerlijke prijs. Wat waarde heeft gaat van de kostprijs af, soms houdt u er geld aan over.',
  },
  {
    icon: Brush,
    img: '/img/dienst-schoonmaak.webp',
    titel: 'Schoonmaak',
    tekst:
      'Borstelschoon achterlaten, of grondig kuisen zodat het pand meteen verkocht of bewoond kan worden. Schilderwerk kan erbij.',
  },
  {
    icon: Recycle,
    img: '/img/dienst-sortering.webp',
    titel: 'Sortering en afvoer',
    tekst:
      'Bruikbare spullen krijgen een tweede leven via kringloop en verzamelaars. De rest gaat gesorteerd naar het containerpark.',
  },
];

const SITUATIES = [
  {
    icon: HandHeart,
    img: '/img/situatie-nalatenschap.webp',
    titel: 'Na een overlijden',
    tekst:
      'We nemen de tijd. Wat u wilt bewaren zetten we apart voor we ook maar iets meenemen, en u hoeft er niet bij te zijn als dat te zwaar is.',
  },
  {
    icon: Package,
    img: '/img/situatie-verhuis.webp',
    titel: 'Verhuis naar een zorgwoning',
    tekst:
      'Vaak moet het pand snel vrij zijn. Wij plannen het volledige leegmaken en de oplevering, u regelt alleen de nieuwe kamer.',
  },
  {
    icon: Boxes,
    img: '/img/situatie-ruimte.webp',
    titel: 'Ruimte maken',
    tekst:
      'Kelder, zolder of garage die jaren is volgelopen, of een handelspand dat sluit. Ook daarvoor rijden we uit.',
  },
];

const STAPPEN = [
  {n: '01', titel: 'U neemt contact op', tekst: 'Via het formulier of gewoon aan de telefoon. Foto\'s helpen, verplicht is het niet.'},
  {n: '02', titel: 'Wij komen langs', tekst: 'Vrijblijvend ter plaatse kijken. Op basis van grootte en samenstelling krijgt u een prijs.'},
  {n: '03', titel: 'Wij maken leeg', tekst: 'Op de afgesproken dag. Kleinere panden zijn er vaak op één dag uit.'},
  {n: '04', titel: 'U krijgt het pand terug', tekst: 'Bezemschoon of gekuist, met de sleutels erbij. Bij opkoop ontvangt u een verkoopbewijs.'},
];

const WAAROM = [
  {icon: ShieldCheck, titel: 'Discreet', tekst: 'Geen opvallende reclame aan de deur, geen verhalen bij de buren.'},
  {icon: Coins, titel: 'Gratis offerte', tekst: 'Langskomen en schatten kost niets en verplicht u tot niets.'},
  {icon: Phone, titel: 'Eén aanspreekpunt', tekst: 'Van het eerste telefoontje tot de sleuteloverdracht dezelfde persoon.'},
  {icon: Recycle, titel: 'Tweede leven', tekst: 'Wat nog dienst kan doen belandt niet in de container.'},
];

const REVIEWS = [
  {t: 'Goede afspraken nagekomen en de werken volledig uitgevoerd naar wens. Prijs zeer degelijk.', n: 'Theo Dhaene'},
  {t: 'Zeer tevreden, zeer propere en nette afwerking. Top.', n: 'Marie-Louise Stas'},
  {t: 'We hebben GuySa gevraagd voor opruiming inboedel. Topservice, aangename man, alles correct verlopen.', n: 'Lima Fun'},
  {t: 'De woning was op één dag leeg en proper, echt top.', n: 'Raf Theunissen'},
  {t: 'Vriendelijk, eerlijk en veruit de goedkoopste. Zeker aan te raden als je het zonde vindt dat spullen geen tweede leven meer krijgen.', n: 'Onno Van de Sype'},
  {t: 'Correcte afspraken en vlotte communicatie van begin tot eind.', n: 'Sophie Vanseer'},
];

/**
 * De vragen zoals GuySa ze zelf op hun site beantwoordt. Ze staan ook in
 * index.html als FAQPage-gegevens; de twee horen woordelijk gelijk te blijven,
 * want een zoekmachine die er verschil tussen ziet vertrouwt geen van beide.
 */
export const VRAGEN = [
  {
    v: 'Hoe verloopt het opruimen van een inboedel?',
    a: 'Hiervoor komen wij vrijblijvend langs om een offerte te maken. Die offerte wordt gemaakt op basis van de grootte en de samenstelling van de inboedel. Na akkoord gaan wij over tot een vlotte afhandeling.',
  },
  {
    v: 'Wat kost een taxatie of een offerte?',
    a: 'Niets. Enkel wanneer u een gedetailleerde taxatie wenst, met de waarde van elk item op een inventaris, kan daarvoor een tarief aangerekend worden. Dat hangt af van de grootte van de inboedel.',
  },
  {
    v: 'Kan ik ook losse items verkopen?',
    a: 'Ja, bij GuySa Inboedels kunt u ook losse items verkopen, voornamelijk stukken die enige waarde hebben. Neem gerust contact op voor meer uitleg.',
  },
  {
    v: 'Wat is borstelschoon?',
    a: 'Mogelijk moet het pand na het verwerken van de inboedel nog verkocht of opnieuw bewoond worden. Wij kunnen ervoor zorgen dat alles grondig gekuist wordt voor de instap. Ook schilderwerken zijn mogelijk. Hier vallen niet onder: kleine herstellingen aan elektriciteit of loodgieterij, het uitbreken van muren of vloeren en bezetwerk. Daarvoor kan wel samen naar een oplossing gezocht worden.',
  },
  {
    v: 'Hoe verloopt de betaling?',
    a: 'Wordt de inboedel opgekocht, dan bezorgen wij u een verkoopbewijs en storten wij het bedrag op rekening, of betalen we op de manier die u verkiest: Payconiq, contant bij kleinere bedragen, of via de bankapp. Gaat het om een opruiming of een andere dienst, dan maken wij een factuur op.',
  },
];

/* ------------------------------------------------------------------ */
/*  Pagina                                                             */
/* ------------------------------------------------------------------ */

export default function App() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="bg-ink">
      <Kop />

      {/* ---------------------------------------------------------- */}
      {/*  Hero                                                       */}
      {/* ---------------------------------------------------------- */}
      <section id="top" className="relative isolate overflow-hidden pt-16 sm:pt-20">
        <img
          src="/img/hero.webp"
          alt="Leeggemaakte woonkamer met licht door het raam"
          width={1376}
          height={768}
          /* Dit is het grootste beeld van de eerste weergave. Zonder deze twee
             regels begint de browser er pas aan nadat hij de rest van de pagina
             heeft gelezen, en dat is precies de meting waar Google een trage
             site aan herkent. */
          fetchPriority="high"
          decoding="async"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-ink via-ink/92 to-ink/70" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink via-transparent to-ink/60" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 sm:px-8 sm:py-20 lg:grid-cols-[1.05fr_minmax(0,26rem)] lg:gap-14 lg:py-24">
          <div>
            <Kicker>Antwerpen, Lier en omstreken</Kicker>
            <h1 className="text-4xl leading-[1.08] text-white sm:text-5xl lg:text-[3.5rem]">
              Een woning leeg, proper<br className="hidden sm:block" /> en <span className="text-gold">op tijd.</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
              Wij ruimen inboedels op, kopen ze aan en leveren het pand borstelschoon op.
              Van kelder tot zolder, in één opdracht en met één aanspreekpunt.
            </p>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/65">
              {['Gratis offerte aan huis', 'Antwoord binnen 24 uur', 'Discreet en zonder omkijken'].map((t) => (
                <li key={t} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" /> {t}
                </li>
              ))}
            </ul>

            <div className="mt-8 hidden items-center gap-5 lg:flex">
              <a
                href={`tel:${TEL}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 font-semibold text-white transition hover:border-gold hover:text-gold"
              >
                <Phone className="h-4 w-4" /> <span className="tabular-nums">{TEL_TEKST}</span>
              </a>
              <a href="#diensten" className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/60 transition hover:text-white">
                Wat we doen <ChevronDown className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div id="offerte">
            <Aanvraag />
            <p className="mt-4 text-center text-sm text-white/50 lg:hidden">
              Liever bellen?{' '}
              <a href={`tel:${TEL}`} className="font-semibold tabular-nums text-gold underline-offset-4 hover:underline">
                {TEL_TEKST}
              </a>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- */}
      {/*  Waarom                                                     */}
      {/* ---------------------------------------------------------- */}
      <div className="border-y border-white/10 bg-ink-soft">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-10 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {WAAROM.map((w) => (
            <div key={w.titel} className="flex gap-3.5">
              <w.icon className="h-6 w-6 shrink-0 text-gold" strokeWidth={1.6} />
              <div>
                <p className="font-semibold text-white">{w.titel}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/55">{w.tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/*  Diensten                                                   */}
      {/* ---------------------------------------------------------- */}
      <Section id="diensten" tone="bone">
        <div className="max-w-2xl">
          <Kicker dark>Onze diensten</Kicker>
          <h2 className="text-3xl sm:text-4xl">Alles wat een leegstaand pand nodig heeft</h2>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {DIENSTEN.map((d) => (
            <article
              key={d.titel}
              className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:border-gold-deep/40 hover:shadow-lg"
            >
              <img
                src={d.img}
                alt=""
                loading="lazy"
                decoding="async"
                width={1024}
                height={1024}
                className="h-44 w-full object-cover"
              />
              <div className="p-6">
                <d.icon className="h-6 w-6 text-gold-deep" strokeWidth={1.6} />
                <h3 className="mt-3 text-lg font-bold">{d.titel}</h3>
                <p className="mt-2 leading-relaxed text-muted">{d.tekst}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Situaties                                                  */}
      {/* ---------------------------------------------------------- */}
      <Section tone="ink" plattegrond={1}>
        <div className="max-w-2xl">
          <Kicker>Wanneer mensen ons bellen</Kicker>
          <h2 className="text-3xl text-white sm:text-4xl">Meestal op een moment dat het slecht uitkomt</h2>
          <p className="mt-4 leading-relaxed text-white/60">
            Een opruiming staat zelden op zichzelf. Er speelt iets anders, en dat vraagt aandacht.
            Daar houden we rekening mee in hoe we werken en hoe we plannen.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SITUATIES.map((s) => (
            <article key={s.titel} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <img
                src={s.img} alt="" loading="lazy" decoding="async" width={1024} height={1024}
                className="h-40 w-full object-cover opacity-90"
              />
              <div className="p-6">
                <s.icon className="h-6 w-6 text-gold" strokeWidth={1.6} />
                <h3 className="mt-3 text-lg font-bold text-white">{s.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{s.tekst}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Voor en na                                                 */}
      {/* ---------------------------------------------------------- */}
      <Section tone="soft">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.15fr]">
          <div>
            <Kicker>Het resultaat</Kicker>
            <h2 className="text-3xl text-white sm:text-4xl">Sleep de greep en zie het verschil</h2>
            <p className="mt-4 leading-relaxed text-white/60">
              Zo ziet een woonkamer eruit voor we beginnen, en zo laten we hem achter.
              Vloeren geveegd, kasten leeg, niets meer op zolder.
            </p>
            <ul className="mt-6 space-y-3 text-white/75">
              <Bullet>Meubels, textiel en huisraad volledig verwijderd</Bullet>
              <Bullet>Gesorteerd afgevoerd, met de nodige attesten</Bullet>
              <Bullet>Bezemschoon, of gekuist tot instapklaar</Bullet>
            </ul>
          </div>
          <Voorna
            voor="/img/voor.webp"
            na="/img/na.webp"
            voorAlt="Volle woonkamer voor de opruiming"
            naAlt="Dezelfde woonkamer leeg en geveegd na de opruiming"
          />
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Opkoop                                                     */}
      {/* ---------------------------------------------------------- */}
      <Section id="opkoop" tone="bone">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            <img
              src="/img/opkoop-kast.webp"
              alt="Antieke kast uit een opgekochte inboedel"
              loading="lazy" decoding="async" width={1264} height={848}
              className="col-span-2 h-56 w-full rounded-2xl object-cover sm:h-64"
            />
            <img
              src="/img/opkoop-juwelen.webp"
              alt="Vintage juwelen uit een inboedel"
              loading="lazy" decoding="async" width={1024} height={1024}
              className="h-36 w-full rounded-2xl object-cover sm:h-44"
            />
            <img
              src="/img/opkoop-detail.webp"
              alt="Oud servies en glaswerk"
              loading="lazy" decoding="async" width={1024} height={1024}
              className="h-36 w-full rounded-2xl object-cover sm:h-44"
            />
          </div>

          <div>
            <Kicker dark>Opkoop</Kicker>
            <h2 className="text-3xl sm:text-4xl">Uw inboedel is vaak meer waard dan u denkt</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Antiek, design, juwelen, munten, boeken, gereedschap, curiosa. Wat verkoopbaar is
              schatten we ter plaatse en kopen we aan. Die waarde gaat van de kostprijs van de
              opruiming af, waardoor een leegmaking soms niets meer kost.
            </p>
            <ul className="mt-6 space-y-3">
              <Bullet dark>Volledige of gedeeltelijke inboedel</Bullet>
              <Bullet dark>Ook losse stukken met waarde</Bullet>
              <Bullet dark>Schatting ter plaatse, geen wachttijd</Bullet>
              <Bullet dark>Verkoopbewijs en betaling op uw rekening</Bullet>
            </ul>
            <a
              href="#offerte"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-semibold text-white transition hover:bg-ink-soft"
            >
              Laat uw inboedel schatten <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Werkwijze                                                  */}
      {/* ---------------------------------------------------------- */}
      <Section id="werkwijze" tone="ink" plattegrond={0}>
        <div className="max-w-2xl">
          <Kicker>Werkwijze</Kicker>
          <h2 className="text-3xl text-white sm:text-4xl">Vier stappen, geen verrassingen</h2>
        </div>

        <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STAPPEN.map((s) => (
            <li key={s.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <span className="text-2xl font-bold tabular-nums text-gold">{s.n}</span>
              <h3 className="mt-3 font-bold text-white">{s.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{s.tekst}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Reviews                                                    */}
      {/* ---------------------------------------------------------- */}
      <Section id="reviews" tone="bone">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <Kicker dark>Klanten aan het woord</Kicker>
            <h2 className="text-3xl sm:text-4xl">Wat mensen achteraf zeggen</h2>
          </div>
          <a
            href={GOOGLE_REVIEWS}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-sm font-semibold transition hover:border-ink"
          >
            <Star className="h-4 w-4 fill-gold-deep text-gold-deep" /> Lees alles op Google
          </a>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {REVIEWS.map((r) => (
            <figure key={r.n} className="rounded-2xl border border-line bg-white p-6">
              <Quote className="h-6 w-6 text-gold-deep/40" />
              <blockquote className="mt-3 leading-relaxed">{r.t}</blockquote>
              <figcaption className="mt-4 text-sm font-semibold text-muted">{r.n}</figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Werkgebied                                                 */}
      {/* ---------------------------------------------------------- */}
      <Section id="werkgebied" tone="soft">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-center">
          <div>
            <Kicker>Werkgebied</Kicker>
            <h2 className="text-3xl text-white sm:text-4xl">Antwerpen en de gemeentes eromheen</h2>
            <p className="mt-4 leading-relaxed text-white/60">
              In deze gemeentes rijden we dagelijks. Ligt uw pand er net buiten, bel dan gerust,
              vaak lukt het alsnog.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {PLAATSEN.map((naam) => (
                <span
                  key={naam}
                  className="rounded-full border border-white/15 bg-white/[0.04] px-3 py-1.5 text-sm text-white/70"
                >
                  {naam}
                </span>
              ))}
            </div>
          </div>
          <Kaart />
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  FAQ                                                        */}
      {/* ---------------------------------------------------------- */}
      <Section tone="bone">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <Kicker dark>Veelgestelde vragen</Kicker>
            <h2 className="text-3xl sm:text-4xl">Wat mensen ons vooraf vragen</h2>
          </div>

          <div className="mt-10 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
            {VRAGEN.map((q, i) => (
              <div key={q.v}>
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold transition hover:bg-bone"
                >
                  {q.v}
                  <ChevronDown className={`h-5 w-5 shrink-0 text-gold-deep transition ${open === i ? 'rotate-180' : ''}`} />
                </button>
                {/* Het antwoord staat altijd in de HTML en wordt alleen
                    verborgen. Zou het pas bij het openklappen bestaan, dan
                    leest een crawler vijf vragen zonder antwoord, en dan staat
                    de helft van de tekst van deze pagina er niet. */}
                <p className={`px-6 pb-6 leading-relaxed text-muted ${open === i ? '' : 'hidden'}`}>{q.a}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ---------------------------------------------------------- */}
      {/*  Contact                                                    */}
      {/* ---------------------------------------------------------- */}
      <Section id="contact" tone="ink" plattegrond={2}>
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,28rem)] lg:gap-14">
          <div>
            <Kicker>Contact</Kicker>
            <h2 className="text-3xl text-white sm:text-4xl">Klaar om te starten?</h2>
            <p className="mt-4 max-w-lg leading-relaxed text-white/60">
              Vertel kort wat er moet gebeuren en waar het pand ligt. We plannen een
              vrijblijvend bezoek en u weet snel wat het kost.
            </p>

            <div className="mt-8 space-y-3">
              <a
                href={`tel:${TEL}`}
                className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.03] p-5 transition hover:border-gold/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm text-white/50">Bellen</span>
                  <span className="block font-semibold tabular-nums text-white">{TEL_TEKST}</span>
                </span>
              </a>
              <a
                href={`mailto:${MAIL}`}
                className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.03] p-5 transition hover:border-gold/50"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <Mail className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm text-white/50">Mailen</span>
                  <span className="block truncate font-semibold text-white">{MAIL}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-white/12 bg-white/[0.03] p-5">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gold/15 text-gold">
                  <MapPin className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-sm text-white/50">Werkgebied</span>
                  <span className="block font-semibold text-white">Antwerpen, Lier en omstreken</span>
                </span>
              </div>
            </div>
          </div>

          <Aanvraag compact />
        </div>
      </Section>

      <Voet />
      <MobieleBalk />
    </div>
  );
}
