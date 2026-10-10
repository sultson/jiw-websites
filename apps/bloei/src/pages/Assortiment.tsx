import {ArrowRight, Flower2, Home, Leaf, Phone, Shovel, Sprout, Wheat} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {Bullet, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Kicker, Section, TEL, TEL_DISPLAY} from '../ui';

/* ------------------------------------------------------------------ */

/**
 * De vier hoeken van de winkel, in de volgorde waarin een bezoeker ze
 * tegenkomt: binnen eerst de bloemen en de planten, dan de potten, en buiten
 * de tuin.
 *
 * Elk blok heeft een eigen anker (#bloemen, #planten, #tuin, #wonen), want de
 * tegels op de homepage wijzen er rechtstreeks naartoe.
 */
const AFDELINGEN = [
  {
    id: 'bloemen',
    icon: Flower2,
    kicker: 'Binnen',
    titel: 'Bloemen',
    img: '/img/kaart-bloemen.webp',
    alt: 'Orchideeën, anthurium en bromelia op de houten tafel in de winkel',
    tekst:
      'Orchideeën, anthurium, bromelia en bloeiende kamerplanten staan binnen op de lange tafel bij het raam. Daarnaast snijbloemen, en bonsai en ficus voor wie iets wil dat lang meegaat.',
    punten: [
      'Orchideeën, anthurium, bromelia en cyclaam',
      'Snijbloemen, wisselend met het seizoen',
      'Boeketten maken we op bestelling',
    ],
    /* Letterlijk wat de winkel zelf zegt. Het staat hier en niet alleen in de
       veelgestelde vragen, omdat dit precies het blok is waar iemand afhaakt
       die niet vindt wat hij zocht. */
    noot:
      'Ons bloemenassortiment is nog aan het groeien. Kunt u niet vinden wat u zoekt? Laat het ons weten, we kunnen veel regelen.',
  },
  {
    id: 'planten',
    icon: Leaf,
    kicker: 'Binnen',
    titel: 'Planten',
    img: '/img/kaart-planten.webp',
    alt: 'De stellingen in de hal met vetplanten, potten en grote kamerplanten erboven',
    tekst:
      'Van een vetplant van tien centimeter tot een kentiapalm die tot aan het plafond komt. In de hal staan de stellingen met kleine planten en de grote exemplaren ernaast, zodat u meteen ziet hoe hoog ze worden.',
    punten: [
      'Kamerplanten van klein tot manshoog',
      'Vetplanten, cactussen en varens',
      'Palmen, olijfbomen en dracaena',
      'Hydrokorrels voor wie op water wil kweken',
    ],
  },
  {
    id: 'wonen',
    icon: Home,
    kicker: 'Binnen',
    titel: 'Wonen',
    img: '/img/kaart-wonen.webp',
    alt: 'Stellingen vol keramieken potten in oud roze, crème, groen en zwart',
    tekst:
      'Twee volle stellingen met potten, van een kleine binnenpot tot een hoge buitenvaas. In keramiek en in kleur: oud roze, crème, mosgroen, zand en mat zwart, en gewassen beton voor buiten.',
    punten: [
      'Binnenpotten en buitenpotten, alle maten',
      'Schalen, vazen en manden',
      'In keramiek, beton en terracotta',
      'Woondecoratie en kaarten',
    ],
  },
  {
    id: 'tuin',
    icon: Shovel,
    kicker: 'Buiten',
    titel: 'Tuin',
    img: '/img/kaart-tuin.webp',
    alt: 'De lange tafels buiten met violen in paars, geel, wit en oranje',
    tekst:
      'Het buitenterrein ligt achter de winkel, onder de schaduwdoeken. Daar liggen de tafels met perkgoed en vaste planten, staan de heesters en de bomen in pot, en liggen de zakken grond en mest op pallet.',
    punten: [
      'Perkgoed, vaste planten en heesters',
      'Siergrassen, heide en buxusbollen',
      'Hangpotten en terraspotten',
      'Bomen in pot: olijf, palm en sierheester',
      'Zaden: gras, bloemen, groenten, kruiden en bollen',
    ],
  },
];

/* Wat er niet op een plant lijkt maar wel elke tuin in gaat. Een eigen blok,
   want dit is waar mensen gericht voor komen: wie potgrond nodig heeft, komt
   voor potgrond en wil weten of het er is. */
const GROND = [
  ['Potgrond', 'Voor binnen- en buitenpotten, in zakken van verschillende maten'],
  ['Tuinaarde', 'Om een border bij te vullen of een nieuw perk aan te leggen'],
  ['Hydrokorrels', 'Voor op water kweken en voor onderin de pot'],
  ['Meststoffen', 'Voor gazon, planten en groenten'],
  ['Houtsnippers', 'Voor paden en borders, houdt onkruid weg en vocht vast'],
];

/**
 * Zaden krijgen een eigen blok en niet één regel in de lijst hierboven. Iemand
 * die zaad komt halen zoekt gericht, en wil voor hij in de auto stapt weten of
 * het soort dat hij nodig heeft er ligt.
 *
 * Breed getrokken op 08-10-2026: de winkel heeft naar eigen zeggen veel zaden,
 * niet alleen gras. Welke soorten en merken er werkelijk liggen is nog niet
 * bevestigd — dit zijn de gangbare groepen. Staat ook in NOTITIES.md.
 */
const ZADEN = [
  {
    titel: 'Gras',
    tekst: 'Doorzaaien, nieuw gazon, schaduw en speelgazon. Elk gazon vraagt iets anders.',
  },
  {
    titel: 'Bloemen',
    tekst: 'Eenjarige zomerbloeiers en bloemenmengsels voor de border of een strook langs het pad.',
  },
  {
    titel: 'Groenten',
    tekst: 'Voor de tuin, de bak op het balkon of de volkstuin. Wat er gezaaid kan worden verschuift met het seizoen.',
  },
  {
    titel: 'Kruiden',
    tekst: 'Basilicum, peterselie, bieslook en de rest, voor op de keukenvensterbank of buiten in een pot.',
  },
  {
    titel: 'Bollen en knollen',
    tekst: 'Najaar de voorjaarsbollen, voorjaar de zomerbloeiers. Per zak of los te scheppen.',
  },
  {
    titel: 'Bijen en vlinders',
    tekst: 'Mengsels die bloeien voor insecten, voor wie een hoek van de tuin wil laten staan.',
  },
];

/* Gras blijft de meest gerichte vraag van allemaal: wie een kale plek heeft
   wil weten of juist zijn soort er ligt. Daarom hieronder apart uitgeschreven
   in plaats van alleen de regel in de tegel. */
const GRASZAAD = [
  ['Doorzaaien', 'Kale plekken in een bestaand gazon bijwerken'],
  ['Nieuw gazon', 'Vanaf niets inzaaien, na aanleg of het weghalen van bestrating'],
  ['Schaduw', 'Onder bomen en langs de schutting, een paar uur zon per dag'],
  ['Speelgazon', 'Steviger gras dat zich herstelt, voor kinderen of een hond'],
];

export default function Assortiment() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Assortiment"
        titel="Bloemen, planten, tuin en wonen"
        intro="Binnen de overdekte hal, buiten het terrein. Van een orchidee voor op tafel tot een kruiwagen tuinaarde voor de border, en alles ertussenin."
        img="/img/over-winkel.webp"
        alt="De overdekte hal met houten wanden, stellingen met potten en grote kamerplanten"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Vertel wat u zoekt <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
            <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
          </a>
        </div>
      </PaginaKop>

      {/* De vier afdelingen, om en om links en rechts: anders leest het als een
          lijst in plaats van als een wandeling door de winkel. */}
      {AFDELINGEN.map((a, i) => (
        <Section key={a.id} id={a.id} tone={i % 2 === 0 ? 'cream' : 'wit'}>
          <div className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${i % 2 === 1 ? 'lg:[&>figure]:order-2' : ''}`}>
            <figure>
              <img
                src={a.img}
                alt={a.alt}
                loading="lazy"
                width={800}
                height={1000}
                className="aspect-[4/5] w-full rounded-2xl object-cover"
              />
            </figure>

            <div>
              <Kicker>{a.kicker}</Kicker>
              <h2 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
                <a.icon className="h-7 w-7 shrink-0 text-accent-dark" strokeWidth={1.75} />
                {a.titel}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink/70">{a.tekst}</p>

              <ul className="mt-7 space-y-3">
                {a.punten.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>

              {a.noot && (
                <p className="mt-7 rounded-2xl border border-accent-dark/20 bg-accent-dark/[0.06] p-5 leading-relaxed text-ink/75">
                  {a.noot}
                </p>
              )}
            </div>
          </div>
        </Section>
      ))}

      {/* ------------------------------------------------------------------ */}

      <Section id="grond" tone="cream" ranken={0}>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Kicker>Buiten, op pallet</Kicker>
            <h2 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
              <Sprout className="h-7 w-7 shrink-0 text-accent-dark" strokeWidth={1.75} />
              Grond en mest
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">
              Wat er niet uitziet als een plant maar wel elke tuin in gaat. Het ligt buiten op pallet, dus
              u kunt er met de auto naast.
            </p>
            <div className="mt-7">
              <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
                <Phone className="h-4 w-4 text-accent-dark" /> Even vragen of het er is
              </a>
            </div>
          </div>

          <div>
            <img
              src="/img/grond.webp"
              alt="Zakken tuinaarde en potgrond op pallet naast de tafels met planten"
              loading="lazy"
              width={1200}
              height={750}
              className="aspect-[16/10] w-full rounded-2xl object-cover"
            />
            <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
              {GROND.map(([kop, onder]) => (
                <div key={kop} className="border-b border-line pb-4">
                  <dt className="font-semibold">{kop}</dt>
                  <dd className="mt-1 text-sm leading-relaxed text-ink/60">{onder}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      {/* Zaden staan apart van grond en mest: dit is een gerichte aankoop.
          Tegels in plaats van regels, zodat iemand in één blik ziet of zijn
          soort erbij staat. Gras daaronder nog een niveau verder uitgesplitst. */}
      <Section id="zaden" tone="wit">
        <div className="max-w-3xl">
          <Kicker>Buiten, bij de grond</Kicker>
          <h2 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
            <Wheat className="h-7 w-7 shrink-0 text-accent-dark" strokeWidth={1.75} />
            Zaden
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-ink/70">
            Hier staat een flinke wand zaden: gras, bloemen, groenten en kruiden, plus bollen voor het
            seizoen. Wat er precies ligt verschuift met het jaar, want zaaien is een kwestie van de
            juiste maand. Vertel wat u wilt zaaien en waar, dan zoeken we het juiste zakje erbij.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ZADEN.map((z) => (
            <div
              key={z.titel}
              className="rounded-2xl border border-line bg-cream p-6"
            >
              <Sprout className="h-6 w-6 text-accent-dark" strokeWidth={1.75} />
              <h3 className="mt-4 text-xl font-semibold">{z.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{z.tekst}</p>
            </div>
          ))}
        </div>

        {/* Gras apart, want dit is de vraag waar iemand het meest gericht voor
            komt: niet "heeft u graszaad" maar "heeft u iets voor de schaduw". */}
        <div className="mt-10 rounded-2xl border border-line bg-cream p-6 sm:p-8">
          <h3 className="text-xl font-semibold">Graszaad per soort gazon</h3>
          <p className="mt-2 max-w-3xl leading-relaxed text-ink/60">
            Een kale plek onder een boom heeft iets anders nodig dan een pas aangelegde tuin of een
            grasveld waar kinderen op spelen.
          </p>
          <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2">
            {GRASZAAD.map(([kop, onder]) => (
              <div key={kop} className="border-b border-line pb-4">
                <dt className="font-semibold">{kop}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-ink/60">{onder}</dd>
              </div>
            ))}
          </dl>
        </div>

        <p className="mt-8 max-w-3xl rounded-2xl border border-accent-dark/20 bg-accent-dark/[0.06] p-5 leading-relaxed text-ink/75">
          Zoekt u een bepaald merk, een mengsel of een soort die hier niet staat? Laat het ons weten,
          we kunnen veel bestellen.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
            <Phone className="h-4 w-4 text-accent-dark" /> Even vragen wat u nodig heeft
          </a>
        </div>
      </Section>
    </Pagina>
  );
}
