import {ArrowRight, Facebook, Lightbulb, Phone, Sparkles, TreePine} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {
  Bullet, FACEBOOK, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Section, TEL, TEL_DISPLAY,
} from '../ui';

/* ------------------------------------------------------------------ */

/**
 * De kerstpagina staat er het hele jaar, ook in mei.
 *
 * Dat is met opzet: wie in oktober "kerstbomen Ouddorp" zoekt, moet een pagina
 * vinden die er al staat en die Google al kent. Een pagina die pas in november
 * online komt, begint elk jaar opnieuw vanaf nul.
 *
 * LET OP — er is geen enkele kerstfoto van deze winkel. Alles hieronder is
 * daarom tekst op hun eigen groen, en nergens een gekochte sfeerfoto van een
 * andere kerstafdeling: die zet een verwachting die de winkel daarna moet
 * waarmaken. Zodra er foto's zijn kunnen ze hier zo in.
 */
/**
 * Sinds 15-10-2026 staan hier de soorten die de winkel zelf doorgaf, in plaats
 * van omschrijvingen van hoe het eraan toegaat. Dat is ook precies waar iemand
 * in november op zoekt: niet "verschillende maten" maar Nordmann of Nobilis.
 *
 * De vierde kaart, Accessoires, is er op hun verzoek uit ("voor nu weglaten").
 */
const ONDERDELEN = [
  {
    icon: TreePine,
    titel: 'Kerstbomen',
    tekst: 'Kerstbomen verkrijgbaar in alle maten.',
    punten: [
      'Nordmann kerstbomen op stam of in pot',
      'Nobilis kerstbomen',
      'Picea bomen',
      'Besneeuwde popup kerstbomen van kunststof',
    ],
  },
  {
    icon: Sparkles,
    titel: 'Kerstkransen',
    tekst: 'In alle maten.',
    punten: ['Nordmann kransen', 'Nobilis kransen', 'Opgemaakte kransjes en kerststukjes'],
  },
  {
    icon: Lightbulb,
    titel: 'Verlichting',
    tekst: 'In ons assortiment hebben we verschillende soorten verlichting.',
    punten: ['Verschillende lengtes', 'Voor binnen en buiten'],
  },
];

export default function Kerst() {
  return (
    <Pagina>
      <PaginaKop
        kicker="November en december"
        titel="Kerst bij Bloei!"
        img="/img/seizoen-najaar.webp"
        alt="De buitentafels in het najaar, vol chrysanten in geel, rood, oranje en wit"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
            <Phone className="h-4 w-4" /> {TEL_DISPLAY}
          </a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_LICHT}>
            <Facebook className="h-4 w-4 text-accent-dark" /> Volg het op Facebook
          </a>
        </div>
      </PaginaKop>

      {/* ------------------------------------------------------------------ */}

      {/* De sectie "Vanaf begin november" met het blok "In het kort" ernaast
          stond hieronder; die is er op 15-10-2026 op verzoek van de winkel
          uit, net als de introzin bovenaan.

          Daarmee bleef er op de pagina die helemaal over kerst gaat geen
          enkele plek over die er ook naar kerst uitzag. Het kerstdecor zit nu
          op deze sectie — het lichtsnoer langs de bovenrand, de rij vurenbomen
          eronder en de takken erachter, in dezelfde variant als op de
          homepage. Dat is vorm en kleur, dus er verdwijnt geen tekst mee en er
          komt niets bij dat beloofd wordt.

          Die variant was op 15-10 crème en is op 16-10 weer het diepe groen,
          op verzoek van de winkel. De kaarten gingen mee: wit op room, en nu
          weer doorschijnend op donker, zodat het decor er niet onder verdwijnt. */}
      {/* Geen `ranken` erbij: die krullen en de vurentakken staan dan allebei
          over hetzelfde vlak en dat wordt een web. Kerst krijgt de takken. */}
      <Section tone="kerst" kerst>
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-kerstlicht">
            Wat er komt te staan
          </p>
          <h2 className="text-3xl font-semibold sm:text-4xl">De kerstafdeling</h2>
          <p className="mt-4 text-lg leading-relaxed text-white/75">
            De kerstafdeling bouwen we elk jaar opnieuw op. Dit is wat er dan staat.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ONDERDELEN.map((o) => (
            <article key={o.titel} className="flex flex-col rounded-2xl border border-white/15 bg-white/[0.05] p-7">
              <o.icon className="h-8 w-8 text-kerstlicht" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-semibold">{o.titel}</h3>
              <p className="mt-3 leading-relaxed text-white/70">{o.tekst}</p>
              <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                {o.punten.map((p) => (
                  <Bullet key={p} light>{p}</Bullet>
                ))}
              </ul>
            </article>
          ))}

          {/* Drie kaarten in een raster van twee laat rechtsonder een gat
              staan. Daar staat nu de stap die de weggehaalde sectie ook bood:
              iets laten maken, of even bellen. */}
          <div className="flex flex-col justify-center rounded-2xl border border-dashed border-white/25 p-7">
            <p className="text-lg font-semibold">Iets in uw eigen kleuren?</p>
            <p className="mt-2 leading-relaxed text-white/70">
              Een krans of een stuk maken we op bestelling. Geef het op tijd door, dan heeft u er
              zeker een.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="#vraag-aan" className={KNOP_HOOFD}>
                Iets laten maken <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white/90 transition hover:border-kerstlicht hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-kerstlicht" /> {TEL_DISPLAY}
              </a>
            </div>
          </div>
        </div>
      </Section>
    </Pagina>
  );
}
