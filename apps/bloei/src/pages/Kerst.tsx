import {ArrowRight, Camera, Gift, Lightbulb, Phone, Sparkles, TreePine} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {
  Bullet, FACEBOOK, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Kicker, Section, TEL, TEL_DISPLAY,
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
const ONDERDELEN = [
  {
    icon: TreePine,
    titel: 'Kerstbomen',
    tekst:
      'Voor de deur staan de bomen, in verschillende maten. U zoekt er een uit, wij zetten hem in het net zodat hij schoon in de auto gaat.',
    punten: ['Verschillende maten', 'In het net mee', 'Zolang de voorraad strekt'],
  },
  {
    icon: Sparkles,
    titel: 'Kerstkransen',
    tekst:
      'Kransen voor aan de deur, van groen en van kunstgroen, kaal of opgemaakt. Wilt u er een in uw eigen kleuren, dan maken we hem op bestelling.',
    punten: ['Kaal of opgemaakt', 'In uw eigen kleuren op bestelling', 'Ook kerststukjes voor op tafel'],
  },
  {
    icon: Lightbulb,
    titel: 'Verlichting',
    tekst:
      'Lichtsnoeren voor in de boom en voor buiten aan de gevel, en losse lampjes om bij te kopen als er een reeks stuk is.',
    punten: ['Voor binnen en voor buiten', 'Snoeren en losse lampjes', 'Op batterij en op stroom'],
  },
  {
    icon: Gift,
    titel: 'Accessoires',
    tekst:
      'De hele tafel met kleinigheden waar een boom en een huis pas kerst van worden: ballen, pieken, kaarsen, linten en decoratie.',
    punten: ['Ballen, pieken en kaarsen', 'Linten en decoratie', 'Elk jaar nieuwe kleuren'],
  },
];

export default function Kerst() {
  return (
    <Pagina>
      <PaginaKop
        kicker="November en december"
        titel="Kerst bij Bloei!"
        intro="Vanaf begin november gaat de hal om. Kerstbomen voor de deur, kransen en verlichting binnen, en een tafel vol accessoires. Wie vroeg is heeft de ruimste keuze."
        img="/img/seizoen-najaar.webp"
        alt="De buitentafels in het najaar, vol chrysanten in geel, rood, oranje en wit"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
            <Phone className="h-4 w-4" /> {TEL_DISPLAY}
          </a>
          <a href={FACEBOOK} target="_blank" rel="noreferrer" className={KNOP_TWEEDE_LICHT}>
            <Camera className="h-4 w-4 text-accent-dark" /> Volg het op Facebook
          </a>
        </div>
      </PaginaKop>

      {/* ------------------------------------------------------------------ */}

      <Section tone="cream" ranken={0}>
        <div className="max-w-2xl">
          <Kicker>Wat er komt te staan</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Vier hoeken van de kerstafdeling</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            De kerstafdeling bouwen we elk jaar opnieuw op. Dit is wat er dan staat.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {ONDERDELEN.map((o) => (
            <article key={o.titel} className="flex flex-col rounded-2xl border border-line bg-white p-7">
              <o.icon className="h-8 w-8 text-accent-dark" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-semibold">{o.titel}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{o.tekst}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {o.punten.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      <Section tone="ink" ranken={2}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Kicker light>Wanneer</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Vanaf begin november</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">
              De eerste kransen en de verlichting komen het eerst binnen, de bomen volgen zodra ze
              gesneden zijn. Wilt u weten of ze er al staan, bel ons even of kijk op Facebook: daar staat
              het als eerste.
            </p>
            <p className="mt-4 leading-relaxed text-white/60">
              Een krans of een stuk in uw eigen kleuren maken we op bestelling. Geef het op tijd door,
              dan heeft u er zeker een.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#vraag-aan" className={KNOP_HOOFD}>
                Iets laten maken <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={`tel:${TEL}`}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">In het kort</p>
            <dl className="mt-6 space-y-5 text-sm">
              <div>
                <dt className="font-semibold text-white">Vanaf</dt>
                <dd className="mt-1 text-white/65">Begin november, tot de kerstdagen</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Bomen</dt>
                <dd className="mt-1 text-white/65">Voor de deur, in het net mee</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Op bestelling</dt>
                <dd className="mt-1 text-white/65">Kransen en stukjes in uw eigen kleuren</dd>
              </div>
              <div>
                <dt className="font-semibold text-white">Nieuws</dt>
                <dd className="mt-1 text-white/65">Staat als eerste op Facebook</dd>
              </div>
            </dl>
          </div>
        </div>
      </Section>
    </Pagina>
  );
}
