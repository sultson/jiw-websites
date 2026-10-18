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
    tekst: 'Een cadeaubon waarmee de ontvanger zelf iets leuks uit kan zoeken.',
    punten: [
      'U bepaalt zelf het bedrag',
      'Te besteden aan alles in de winkel',
      'Ligt klaar, u kunt hem zo meenemen',
    ],
  },
  {
    icon: Package,
    titel: 'Cadeaupakketje',
    /* Letterlijk wat de winkel doorgaf op 15-10-2026. Schulp is het
       sappenmerk; Hoeksche is de chips van de Hoeksche Waard. Dit is het enige
       stuk van de site waar producten van buiten het eigen assortiment staan,
       dus hier niets bij verzinnen. */
    tekst:
      'Pak een cadeaupakketje dat er al staat, of geef door wat u erin wilt hebben, dan maken wij het naar uw wens. Het kan bestaan uit een fles Schulp of een fles wijn, keuze uit verschillende noten, kaassoorten, en of Hoeksche chips.',
    punten: [
      'U zegt het bedrag en voor wie het is',
      'Wij zoeken uit en maken het op',
      'Ook op bestelling, ook grotere aantallen',
    ],
  },
];

const GELEGENHEDEN = [
  'Verjaardag',
  'Nieuwe woning',
  'Bedankje',
  'Welkom heten van nieuwe buren',
  'Beterschap',
  'Jubileum',
  'Afscheid van een collega',
  'Kerstpakket voor het personeel',
];

/* De sectie "Drie stappen" stond hier tot 15-10-2026 tussen de twee manieren
   en "Waar het meestal voor is". Die is er op verzoek van de winkel uit: wat
   erin stond (zeg het bedrag, vertel voor wie) staat al als vinkjes op de
   kaart van het cadeaupakketje, en het formulier vraagt het daarna nog een
   keer. */

export default function Cadeau() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Cadeau"
        titel="Iets geven uit de winkel"
        intro="Een cadeaubon waarmee de ontvanger zelf iets leuks kan uitzoeken, of een cadeaupakket dat wij zelf samenstellen."
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
              <p className="mt-3 leading-relaxed text-ink-vaag">{m.tekst}</p>
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
