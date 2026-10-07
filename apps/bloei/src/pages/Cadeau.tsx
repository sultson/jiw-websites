import {ArrowRight, Gift, Package, Phone, Ticket, Wallet} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {Bullet, KNOP_HOOFD, KNOP_TWEEDE_LICHT, Kicker, Section, TEL, TEL_DISPLAY} from '../ui';

/* ------------------------------------------------------------------ */

/**
 * Twee dingen op één pagina, want het is dezelfde vraag met twee antwoorden:
 * "ik wil iets geven". Of de ontvanger zelf kiest (bon) of dat wij kiezen
 * (pakketje).
 *
 * NOG TE BEVESTIGEN: er staan geen bedragen op deze pagina. Wat een bon mag
 * kosten en wat een pakketje kost is niet doorgegeven.
 */
const MANIEREN = [
  {
    icon: Ticket,
    titel: 'Cadeaubon',
    tekst:
      'Voor wie liever zelf uitzoekt. De bon ligt in de winkel klaar en u bepaalt zelf het bedrag. De ontvanger komt langs en kiest er iets van uit: een plant, een pot, bloemen, of zakken tuinaarde.',
    punten: [
      'U bepaalt zelf het bedrag',
      'Te besteden aan alles in de winkel',
      'Ligt klaar, u kunt hem zo meenemen',
    ],
  },
  {
    icon: Package,
    titel: 'Cadeaupakketje',
    tekst:
      'Wij stellen het samen. Een plant in een bijpassende pot, een schaaltje met vetplanten, of een mandje met heide en kaarsjes erin. U zegt wat het ongeveer mag kosten en voor wie het is.',
    punten: [
      'U zegt het bedrag en voor wie het is',
      'Wij zoeken uit en maken het op',
      'Op bestelling, ook groter aantal',
    ],
  },
];

const GELEGENHEDEN = [
  'Verjaardag',
  'Nieuwe woning',
  'Bedankje',
  'Welkom bij de buren',
  'Beterschap',
  'Jubileum',
  'Afscheid van een collega',
  'Kerstpakket voor het personeel',
];

const STAPPEN: [string, string][] = [
  ['Zeg wat het mag kosten', 'Dat is het enige dat we echt nodig hebben om te beginnen.'],
  ['Vertel voor wie het is', 'Iemand met groene vingers of juist niet, veel licht in huis of weinig, een tuin of een balkon.'],
  ['Wij maken het klaar', 'U hoort van ons wanneer het klaarstaat. Ophalen kan tijdens openingstijden.'],
];

export default function Cadeau() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Cadeau"
        titel="Iets geven uit de winkel"
        intro="Een cadeaubon waarmee de ontvanger zelf uitzoekt, of een pakketje dat wij samenstellen. Voor één keer of voor een hele afdeling."
        img="/img/kaart-cadeau.webp"
        alt="Mandjes met heide, kalanchoë en kaarsjes op de houten tafel in de winkel"
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Een pakketje laten maken <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_LICHT}>
            <Phone className="h-4 w-4 text-accent-dark" /> {TEL_DISPLAY}
          </a>
        </div>
      </PaginaKop>

      {/* ------------------------------------------------------------------ */}

      <Section tone="cream" ranken={0}>
        <div className="max-w-2xl">
          <Kicker>Twee manieren</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Zelf kiezen of laten kiezen</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {MANIEREN.map((m) => (
            <article key={m.titel} className="flex flex-col rounded-2xl border border-line bg-white p-7">
              <m.icon className="h-8 w-8 text-accent-dark" strokeWidth={1.5} />
              <h3 className="mt-5 text-xl font-semibold">{m.titel}</h3>
              <p className="mt-3 leading-relaxed text-ink/65">{m.tekst}</p>
              <ul className="mt-5 space-y-2.5 text-sm">
                {m.punten.map((p) => (
                  <Bullet key={p}>{p}</Bullet>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      <Section tone="wit">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
          <div>
            <Kicker>Hoe het gaat</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Drie stappen</h2>
            <p className="mt-4 leading-relaxed text-ink/65">
              Een pakketje laten maken kost u één telefoontje of één formulier.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="#vraag-aan" className={KNOP_HOOFD}>
                Beginnen <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <ol className="space-y-7">
            {STAPPEN.map(([kop, tekst], i) => (
              <li key={kop} className="flex gap-5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-accent-dark/10 font-semibold text-accent-dark">
                  {i + 1}
                </span>
                <div>
                  <p className="text-lg font-semibold leading-snug">{kop}</p>
                  <p className="mt-1.5 leading-relaxed text-ink/65">{tekst}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* ------------------------------------------------------------------ */}

      <Section tone="ink" ranken={1}>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Kicker light>Waarvoor</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Waar het meestal voor is</h2>
            <p className="mt-5 leading-relaxed text-white/70">
              Staat uw gelegenheid er niet bij, dan kan het nog steeds. Vertel wat het is, dan denken we
              mee over wat erbij past.
            </p>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {GELEGENHEDEN.map((g) => (
                <span key={g} className="rounded-full border border-white/20 bg-white/[0.06] px-4 py-2 text-sm font-medium text-white/85">
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/[0.05] p-8">
            <Wallet className="h-10 w-10 text-accent" strokeWidth={1.5} />
            <p className="mt-5 text-lg font-semibold">Meerdere tegelijk</p>
            <p className="mt-2 leading-relaxed text-white/65">
              Kerstpakketten voor het personeel, een bedankje voor de vrijwilligers, of twintig dezelfde
              schaaltjes voor een jubileum: dat maken we op bestelling. Geef het op tijd door, dan
              hebben we genoeg in huis.
            </p>
            <div className="mt-6">
              <a href="#vraag-aan" className={KNOP_HOOFD}>
                <Gift className="h-4 w-4" /> Aantal doorgeven
              </a>
            </div>
          </div>
        </div>
      </Section>
    </Pagina>
  );
}
