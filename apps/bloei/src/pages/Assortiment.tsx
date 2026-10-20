import {ArrowRight, Flower2, Home, Leaf, Phone, Shovel, Sprout} from 'lucide-react';
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
    /* Sinds 20-10-2026 de foto van de bloementafel die de winkel zelf stuurde.
       Liggend, want de opstelling loopt over de hele breedte: hortensia's en
       tulpen bovenin, rozen en anjers eronder, de emmers rechts. */
    img: '/img/afdeling-bloemen.webp',
    liggend: true,
    alt: 'De bloementafel in de winkel met hortensia’s, tulpen, rozen, anjers en emmers met boeketten',
    tekst:
      'De winkel staat vol met verse bloemen die we dagelijks aanvullen. Neem een boeket mee dat al klaar staat of laat er een samenstellen naar eigen keuze. Uiteraard denken wij graag met u mee.',
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
    img: '/img/kaart-planten.webp?v=20261020',
    alt: 'De rij kamerplanten langs de houten wand in de winkel, van zamioculcas en ficus tot palmen',
    tekst: 'Van vetplant tot palmboom, in alle soorten en maten.',
    punten: [
      'Kamerplanten van klein tot groot',
      'Vetplanten, hangplanten en cactussen',
      'Varens, palmen en dracaena',
    ],
  },
  {
    id: 'wonen',
    icon: Home,
    kicker: 'Binnen',
    titel: 'Wonen',
    img: '/img/kaart-wonen.webp?v=20261020',
    alt: 'De woonhoek in de winkel met kandelaars, schapenvachten, windlichten en bonsai op de tafels',
    /* Drie extra foto's van dezelfde hoek, als strook onder het blok. Eén
       beeld laat van deze afdeling te weinig zien: het is geen schap met
       dezelfde artikelen maar een tafel die elke paar weken anders staat. */
    strook: [
      ['/img/wonen-1.webp', 'Tafels met vachten, kandelaars, windlichten en bonsai'],
      ['/img/wonen-2.webp', 'Een vaas met bessentakken, een hertenkop en een windlicht op een vacht'],
      ['/img/wonen-3.webp', 'Stellingen vol keramieken potten met een bronskleurige vaas ervoor'],
    ],
    tekst:
      'Potten in alle soorten en maten, van kunststof en keramiek tot rotan. Daarnaast luxe woonaccessoires, van klassiek tot landelijk.',
    punten: [
      'Binnen- en buitenpotten in alle maten',
      'Schalen, vazen en manden',
      'Keramiek, kunststof, rotan en terracotta',
      'Luxe woondecoratie, van landelijk tot klassiek',
    ],
  },
  {
    id: 'tuin',
    icon: Shovel,
    kicker: 'Buiten',
    titel: 'Tuin',
    /* De violenfoto die hier stond is er op 14-10-2026 uit gehaald. Nu de foto
       van het terrein zelf: de stellingen met planten, de hangpotten eronder en
       de zakken grond op de achtergrond — dat is waar deze lijst over gaat. */
    img: '/img/grond.webp',
    liggend: true,
    alt: 'Het buitenterrein met de stellingen vol planten, hangpotten eronder en de zakken grond erachter',
    tekst:
      'Op het buitenterrein is onder andere dit te vinden:',
    punten: [
      'Perkgoed en vaste planten',
      'Siergrassen, heide en buxusbollen',
      'Buitenpotten',
      'Olijfbomen, palmbomen',
      'Zaden: gras, groente en kruiden',
      'Bollen: bloembollen',
    ],
  },
];

/**
 * Wat er niet op een plant lijkt maar wel elke tuin in gaat.
 *
 * Dit stond als eigen sectie "Grond en mest" met een eigen kop en een
 * belknop ernaast. Die kop is er op 14-10-2026 uit; de lijst zelf staat nu
 * onder de tuin, want daar hoort hij ook.
 */
const GROND = [
  ['Potgrond', 'Voor binnen- en buitenpotten, in zakken van verschillende maten'],
  ['Tuinaarde', 'Om een border bij te vullen of een nieuw perk aan te leggen'],
  ['Hydrokorrels', 'Als drainage voor de plant, onderin de pot'],
  ['Meststoffen', 'Voor gazon, planten en groenten'],
  ['Boomschors en houtsnippers', 'Voor paden en borders, houdt onkruid weg en vocht vast'],
  ['Openhaardhout', 'Voor de haard en de vuurkorf'],
];

/* Zaden stonden hier als eigen sectie met zes tegels en een uitsplitsing per
   soort gazon eronder. Dat is er op 14-10-2026 uit: het was een blok over een
   wand in de winkel, en het liep vooruit op voorraad die niemand bevestigd
   heeft. Zaden staan nu als twee regels in de lijst bij Tuin. */

export default function Assortiment() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Assortiment"
        titel="Bloemen, planten, tuin en wonen"
        intro="Binnen de winkel, buiten het terrein. Van een orchidee voor op tafel tot een kruiwagen tuinaarde voor de border, en alles ertussenin."
        img="/img/over-winkel.webp"
        alt="De winkel met houten wanden, stellingen met potten en grote kamerplanten"
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
                /* De foto van het buitenterrein is liggend geschoten; in een
                   staande uitsnede blijft er een strook tegelvloer over. */
                className={`w-full rounded-2xl object-cover ${a.liggend ? 'aspect-[4/3]' : 'aspect-[4/5]'}`}
              />
            </figure>

            <div>
              <Kicker>{a.kicker}</Kicker>
              <h2 className="flex items-center gap-3 text-3xl font-semibold sm:text-4xl">
                <a.icon className="h-7 w-7 shrink-0 text-accent-dark" strokeWidth={1.75} />
                {a.titel}
              </h2>
              <p className="mt-5 text-lg leading-relaxed text-ink-zacht">{a.tekst}</p>

              <ul className="mt-7 space-y-3">
                {a.punten.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>

              {a.noot && (
                <p className="mt-7 rounded-2xl border border-accent-dark/20 bg-accent-dark/[0.06] p-5 leading-relaxed text-ink-zacht">
                  {a.noot}
                </p>
              )}
            </div>
          </div>

          {/* De extra foto's bij Wonen. Drie naast elkaar, ook op de telefoon:
              het zijn sfeerbeelden van dezelfde hoek, dus ze horen als strook
              gelezen te worden en niet als drie losse platen onder elkaar. */}
          {a.strook && (
            <ul className="mt-10 grid grid-cols-3 gap-3 sm:gap-5">
              {a.strook.map(([src, alt]) => (
                <li key={src}>
                  <img
                    src={src}
                    alt={alt}
                    loading="lazy"
                    width={700}
                    height={875}
                    className="aspect-[4/5] w-full rounded-2xl object-cover"
                  />
                </li>
              ))}
            </ul>
          )}

          {/* Grond en mest stond hieronder als eigen sectie met een eigen kop.
              Het hoort bij de tuin en staat er nu onder, als lijst in dezelfde
              sectie: dezelfde regels, een kop minder. */}
          {a.id === 'tuin' && (
            <div className="mt-14">
              <h3 className="flex items-center gap-2.5 text-xl font-semibold">
                <Sprout className="h-5 w-5 shrink-0 text-accent-dark" strokeWidth={1.75} />
                Grondsoorten en meststoffen
              </h3>
              <p className="mt-2 max-w-2xl leading-relaxed text-ink-vaag">
                Het ligt buiten op pallet, dus u kunt er met de auto naast.
              </p>
              <dl className="mt-6 grid gap-x-10 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
                {GROND.map(([kop, onder]) => (
                  <div key={kop} className="border-b border-line pb-4">
                    <dt className="font-semibold">{kop}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-ink-vaag">{onder}</dd>
                  </div>
                ))}
              </dl>

              <p className="mt-8 max-w-3xl rounded-2xl border border-accent-dark/20 bg-accent-dark/[0.06] p-5 leading-relaxed text-ink-zacht">
                Zoekt u een bepaald merk, een soort of een maat die hier niet staat? Laat het ons
                weten, we kunnen veel bestellen.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
                  <Phone className="h-4 w-4 text-accent-dark" /> Even vragen of het er is
                </a>
              </div>
            </div>
          )}
        </Section>
      ))}
    </Pagina>
  );
}
