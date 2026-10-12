import {Apple, ArrowLeft, ArrowRight, Compass, Leaf, Moon, Smile} from 'lucide-react';
import {Bloem} from './bloem';
import {useKop} from './kop';
import {omschrijving as specOmschrijving, titel as specTitel} from './specmeta';

/* ------------------------------------------------------------------
   De vijf pijlers. Eerder stonden hier de acht losse onderwerpen uit
   haar opzet; Marjon heeft ze zelf teruggebracht naar vijf:

     1 Voeding                = oud 1
     2 Ontspanning            = oud 2 + 3 + 6
     3 Zingeving              = oud 4
     4 Natuurlijke remedies   = oud 5 + 7
     5 Mondhygiëne            = oud 8 (+ 7 in de routine)

   Haar eigen zinnen zijn overgenomen, niet herschreven. Waar twee
   onderwerpen samenkwamen staan ze als aparte blokken op de pagina, elk
   met haar eigen tekst eronder.

   TEKST TOEVOEGEN: vul per pijler `blokken` aan met {kop, tekst} en zet
   `compleet: true`, dan verdwijnt de 'Tekst volgt'-placeholder.
   ------------------------------------------------------------------ */

export type Blok = {kop: string; tekst: string};

export type Spec = {
  slug: string;
  oud?: string[]; // eerdere adressen, blijven werken
  naam: string;
  /** De kop in het zoekresultaat. Alleen de naam ("Voeding") zegt daar te
   *  weinig: niemand zoekt op dat woord alleen. Staat hier en niet in
   *  site.config.mjs, zodat de pijler zijn eigen titel bij zich draagt. */
  seoTitel?: string;
  icon: typeof Apple;
  kleur: string; // hex, voor de ikigai en de vlakken
  tekstKleur?: string; // donkerder variant waar de kleur als tekst leesbaar moet zijn
  samenvatting: string;
  intro: string;
  blokken: Blok[];
  compleet?: boolean;
};

export const SPECIALISATIES: Spec[] = [
  {
    slug: 'voeding',
    seoTitel: 'Voeding en je mondgezondheid',
    oud: ['voeding-en-gifstoffen', 'natuurlijke-voeding'],
    naam: 'Voeding',
    icon: Apple,
    kleur: '#7c8460',
    samenvatting: 'Wat je in je mond stopt, bepaalt de basis.',
    intro:
      'Natuurlijke voeding bouwt je mond- en darmflora op, terwijl roken het microbioom juist volledig verwoest. Roken vernauwt de bloedvaten in je tandvlees, waardoor ontstekingen worden gemaskeerd en het weefsel langzaam degenereert.',
    blokken: [],
  },
  {
    slug: 'ontspanning',
    seoTitel: 'Ontspanning, slaap en je mond',
    oud: ['slaap-en-ademhaling', 'mentale-gezondheid', 'sport-en-beweging', 'stopsport'],
    naam: 'Ontspanning',
    icon: Moon,
    kleur: '#33606d',
    samenvatting: 'Rust, ademhaling en beweging zijn de herstelmotoren van je mond.',
    intro:
      'Slaap, een ontspannen hoofd en een lichaam dat beweegt doen samen het werk waar geen tandenborstel bij kan. Ze bepalen hoeveel herstel je mond krijgt en hoeveel spanning erin blijft zitten.',
    blokken: [
      {
        kop: 'Slaap en ademhaling',
        tekst:
          'Nachtrust en ademhaling zijn de ultieme herstelmotoren voor je mond. Chronisch door de mond ademen (in plaats van de neus) droogt het speeksel uit, wat leidt tot een explosie van slechte bacteriën, tandvleesontstekingen en een slechte adem. Goede slaap en een gezonde neusademhaling beschermen je gebit en je energieniveau.',
      },
      {
        kop: 'Mentale gezondheid en stress',
        tekst:
          'Een overprikkeld brein weerspiegelt zich direct in de mond. Stress verhoogt het hormoon cortisol, wat ontstekingen aanjaagt. Daarnaast uit een verminderde mentale gezondheid zich fysiek vaak in tandenknarsen (bruxisme), klemmen en een gespannen kaakgebied.',
      },
      {
        kop: 'Sport en beweging',
        tekst:
          'Hoe actieve beweging en een ontstekingsvrije mond zorgen voor maximale fysieke prestaties en minder blessures.',
      },
    ],
  },
  {
    slug: 'zingeving',
    seoTitel: 'Zingeving en je mondgezondheid',
    oud: ['zingeving-en-vrijheid'],
    naam: 'Zingeving',
    icon: Compass,
    kleur: '#316d78',
    samenvatting: 'Dit is de spirituele en emotionele motor van je welzijn (jouw ikigai).',
    intro:
      'Wanneer je leeft met een duidelijk doel en zingeving ervaart, zorg je automatisch beter voor jezelf. Het geeft je de motivatie om de verantwoordelijkheid voor je eigen gezondheid en vrijheid écht te dragen.',
    blokken: [],
  },
  {
    slug: 'natuurlijke-remedies',
    seoTitel: 'Natuurlijke remedies voor je mond',
    oud: ['oosterse-balans', 'oosterse-geneeskunde', 'natuurlijke-producten', 'essentiele-olie'],
    naam: 'Natuurlijke remedies',
    icon: Leaf,
    kleur: '#c4691c',
    samenvatting: 'Plantenkracht in plaats van agressieve chemie, en de signalen die je lichaam zelf afgeeft.',
    intro:
      'Je lichaam vertelt zelf waar de disbalans zit, en de natuur levert het middel om er iets aan te doen. Die twee horen bij elkaar.',
    blokken: [
      {
        kop: 'Oosterse balans en energie',
        tekst:
          'Via de Chinese tongdiagnostiek lezen we de diepere signalen van je organen en je energiebanen (Qi). Het geeft ons een vroege waarschuwing bij een disbalans.',
      },
      {
        kop: 'Natuurlijke producten en essentiële olie',
        tekst:
          'Het ondersteunen van je mondhygiëne met zuivere plantenkracht in plaats van agressieve chemische middelen.',
      },
    ],
  },
  {
    slug: 'mondhygiene',
    seoTitel: 'Mondhygiëne: poetsen en dagelijkse routine',
    oud: ['dagelijkse-routines'],
    naam: 'Mondhygiëne',
    icon: Smile,
    kleur: '#a8823c',
    tekstKleur: '#8a6a2c',
    samenvatting:
      'De praktische vertaling van al deze pijlers naar simpele, effectieve rituelen in jouw badkamer en dagelijkse leven.',
    intro:
      'Hier komt alles samen: wat je eet, hoe je slaapt en wat je gebruikt, terug te zien in wat je elke ochtend en avond doet. Kleine rituelen die je vol kunt houden, in plaats van een lijst die je na een week weer loslaat.',
    blokken: [],
  },
];

/* Ook de eerdere adressen blijven werken: die komen op de opvolger uit, en de
   canonical van die pagina wijst naar het nieuwe adres. */
export function vindSpec(slug: string) {
  return SPECIALISATIES.find((s) => s.slug === slug || s.oud?.includes(slug));
}

export const PAD = (slug: string) => `/aanpak/${slug}`;

/* Echte adressen, dus een gewone link werkt ook zonder javascript (en in een
   nieuw tabblad). Een normale klik vangen we op zodat er niets herladen hoeft
   te worden. */
export function ga(e: React.MouseEvent, pad: string) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  if (window.location.pathname !== pad) window.history.pushState({}, '', pad);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

/* ---------- de ikigai ----------

   Vijf cirkels rond een hart, met in elke cirkel alleen het symbool van de
   pijler. De namen staan in de lijst ernaast: in het figuur werd het met acht
   losse woorden te druk. */

const N = SPECIALISATIES.length;
const C = 330; // middelpunt
const D = 132; // afstand middelpunt tot cirkelmiddelpunt
const R = 170; // straal van een cirkel
const L = 216; // afstand van het symbool tot het midden
const IC = 52; // formaat van het symbool

function positie(i: number, afstand: number) {
  const hoek = ((-90 + (i * 360) / N) * Math.PI) / 180;
  return {x: C + afstand * Math.cos(hoek), y: C + afstand * Math.sin(hoek)};
}

export function Ikigai() {
  return (
    <section id="specialisaties" className="bg-zand py-20">
      <div className="mx-auto max-w-6xl px-5">
        <p className="kicker text-olijf">Mijn aanpak</p>
        <h2 className="titel mt-2 text-3xl text-inkt sm:text-4xl">Waar mijn werk samenkomt</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-inkt/75">
          Vijf pijlers met overlap in het midden, de kern van het geheel:{' '}
          <span className="whitespace-nowrap">Bewust Gezond in je Mond</span>.
          Klik op een symbool om verder te lezen.
        </p>

        <div className="mt-10 grid items-center gap-10 lg:grid-cols-2">
          <svg
            viewBox="0 0 660 660"
            className="mx-auto w-full max-w-[34rem]"
            role="group"
            aria-label="De vijf pijlers"
          >
            {/* de vlakken eerst, zodat de randen en de symbolen er altijd overheen liggen */}
            {SPECIALISATIES.map((s, i) => {
              const p = positie(i, D);
              return (
                <circle
                  key={`v-${s.slug}`}
                  className="vlak"
                  cx={p.x}
                  cy={p.y}
                  r={R}
                  fill={s.kleur}
                  opacity={0.12}
                  style={{mixBlendMode: 'multiply'}}
                />
              );
            })}

            {SPECIALISATIES.map((s, i) => {
              const p = positie(i, D);
              const t = positie(i, L);
              return (
                <a
                  key={s.slug}
                  href={PAD(s.slug)}
                  onClick={(e) => ga(e, PAD(s.slug))}
                  className="ikigai-deel"
                  aria-label={s.naam}
                >
                  <title>{s.naam}</title>
                  <circle
                    className="vlak"
                    cx={p.x}
                    cy={p.y}
                    r={R}
                    fill={s.kleur}
                    opacity={0}
                    style={{mixBlendMode: 'multiply'}}
                  />
                  <circle className="rand" cx={p.x} cy={p.y} r={R} fill="none" stroke={s.kleur} strokeWidth={2} />
                  <g
                    transform={`translate(${t.x - IC / 2} ${t.y - IC / 2})`}
                    style={{color: s.tekstKleur ?? s.kleur}}
                  >
                    <s.icon width={IC} height={IC} strokeWidth={1.4} aria-hidden="true" />
                  </g>
                </a>
              );
            })}

            {/* het hart van de ikigai */}
            <circle cx={C} cy={C} r={74} fill="#2b4249" />
            <text
              x={C}
              y={C}
              textAnchor="middle"
              /* Woordmerk, dus Cormorant -- en hier ook uit noodzaak: deze drie
                 regels moeten binnen een cirkel van 148px blijven en Quicksand is
                 bij hetzelfde font-size een stuk breder. */
              className="merknaam"
              fill="#f6f4ef"
              fontSize={17}
              letterSpacing="0.04em"
            >
              <tspan x={C} dy={-18}>
                Bewust
              </tspan>
              <tspan x={C} dy={20}>
                Gezond in
              </tspan>
              <tspan x={C} dy={20}>
                je Mond
              </tspan>
            </text>
          </svg>

          {/* op een telefoon is een rozet geen fatsoenlijk aanraakdoel: de
              cirkels overlappen elkaar en dan tik je zo de verkeerde aan.
              Daarom staan de vijf er ook als gewone knoppen, met de
              samenvatting erbij. */}
          <ol className="grid gap-2.5">
            {SPECIALISATIES.map((s, i) => (
              <li key={s.slug}>
                <a
                  href={PAD(s.slug)}
                  onClick={(e) => ga(e, PAD(s.slug))}
                  className="group flex items-center gap-3.5 rounded-2xl bg-room p-3.5 ring-1 ring-zand-diep transition hover:shadow-md"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{backgroundColor: `${s.kleur}22`, color: s.tekstKleur ?? s.kleur}}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="titel block text-lg leading-tight text-inkt">
                      <span className="text-inkt/40">{i + 1}.</span> {s.naam}
                    </span>
                    <span className="mt-0.5 block text-sm leading-snug text-inkt/70">{s.samenvatting}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-inkt/40 transition group-hover:translate-x-1 group-hover:text-petrol" />
                </a>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- de losse pagina per pijler ---------- */

export function SpecialisatiePagina({spec, afsluiting}: {spec: Spec; afsluiting?: React.ReactNode}) {
  /* Ook als je via een van de eerdere adressen binnenkomt (`oud` in de lijst
     hierboven) wijst de canonical naar het huidige adres van deze pijler. */
  useKop({
    titel: specTitel(spec),
    kort: specOmschrijving(spec),
    canoniek: PAD(spec.slug),
  });

  const nummer = SPECIALISATIES.indexOf(spec) + 1;
  const anderen = SPECIALISATIES.filter((s) => s.slug !== spec.slug);

  return (
    <main>
      <section className="relative overflow-hidden pt-28 pb-14 sm:pt-32" style={{backgroundColor: `${spec.kleur}14`}}>
        <Bloem
          className="bloem-draait pointer-events-none absolute -right-24 top-8 h-[22rem] w-[22rem] opacity-[0.13]"
          style={{color: spec.kleur}}
        />
        <div className="relative mx-auto max-w-3xl px-5">
          <a
            href="/#specialisaties"
            className="inline-flex items-center gap-2 text-sm font-semibold text-inkt/70 transition hover:text-petrol"
          >
            <ArrowLeft className="h-4 w-4" /> Terug naar mijn aanpak
          </a>
          <p className="kicker mt-6" style={{color: spec.tekstKleur ?? spec.kleur}}>
            Pijler {nummer} van {SPECIALISATIES.length}
          </p>
          {/* Geen toUpperCase meer: dit was de laatste kop in kapitalen die op
              10-10 is blijven staan, en Marjon wil nergens een titel in
              hoofdletters. */}
          <h1 className="titel mt-2 text-4xl leading-tight text-inkt sm:text-5xl">{spec.naam}</h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-inkt/80">{spec.samenvatting}</p>
        </div>
      </section>

      <article id="inhoud" tabIndex={-1} className="mx-auto max-w-3xl px-5 py-16 outline-none">
        {spec.intro && <p className="text-lg leading-relaxed text-inkt/80">{spec.intro}</p>}

        {spec.blokken.map((b) => (
          <div key={b.kop} className="mt-10">
            <h2 className="titel text-2xl text-inkt sm:text-3xl">{b.kop}</h2>
            <p className="mt-3 leading-relaxed text-inkt/75">{b.tekst}</p>
          </div>
        ))}

        {!spec.compleet && (
          <div className="mt-10 rounded-2xl border border-dashed border-zand-diep bg-room p-8">
            <span className="inline-block rounded-full bg-mosterd/20 px-3 py-1 text-xs font-semibold text-terra">
              Tekst volgt
            </span>
            <p className="mt-4 leading-relaxed text-inkt/70">
              Deze pagina staat klaar. De inhoud over {spec.naam.toLowerCase()} schrijft Marjon zelf, en die zetten we
              hier neer zodra hij er is. De plek, de opmaak en de doorkliks kloppen dan al.
            </p>
          </div>
        )}

        {/* Het losse 'Een vraag hierover?'-blok stond hier eerder. Het is eruit:
            sinds deze ronde staat het volledige contactblok onderaan elke
            pagina, dus dit was twee keer dezelfde vraag onder elkaar. */}
      </article>

      <section className="bg-zand py-16">
        <div className="mx-auto max-w-5xl px-5">
          <p className="kicker text-olijf">Verder lezen</p>
          <h2 className="titel mt-2 text-3xl text-inkt">De andere pijlers</h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {anderen.map((s) => (
              <li key={s.slug}>
                <a
                  href={PAD(s.slug)}
                  onClick={(e) => ga(e, PAD(s.slug))}
                  className="group flex h-full items-start gap-4 rounded-2xl bg-room p-5 ring-1 ring-zand-diep transition hover:shadow-md"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
                    style={{backgroundColor: `${s.kleur}22`, color: s.tekstKleur ?? s.kleur}}
                  >
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span>
                    <span className="titel block text-lg leading-tight text-inkt">{s.naam}</span>
                    <span className="mt-1 block text-sm leading-snug text-inkt/70">{s.samenvatting}</span>
                  </span>
                  <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-inkt/40 transition group-hover:translate-x-1 group-hover:text-petrol" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* pioniersblok + contact, precies zoals op de voorpagina */}
      {afsluiting}
    </main>
  );
}
