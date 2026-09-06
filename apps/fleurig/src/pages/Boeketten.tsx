import {ArrowRight, Clock, Flower2, Gift, Hand, Phone, Sparkles} from 'lucide-react';
import {GeslotenKopMelding, Pagina, PaginaKop} from '../layout';
import {
  Bullet, KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section, TEL, TEL_DISPLAY, TIJDELIJK_GESLOTEN,
} from '../ui';

/* ------------------------------------------------------------------ */

const MANIEREN = [
  {
    img: '/img/boeket-dragen.webp',
    icon: Clock,
    titel: 'Een boeket dat klaarstaat',
    tekst:
      'Er staan altijd gebonden boeketten klaar in verschillende maten. Uitzoeken, afrekenen en mee, u bent zo weer buiten.',
    punten: ['Elke winkeldag vers gebonden', 'In meerdere prijsklassen', 'Zo mee te nemen'],
  },
  {
    img: '/img/plukboeket.webp',
    icon: Hand,
    titel: 'Samengesteld naar eigen keuze',
    tekst:
      'Wijs aan welke bloemen u mooi vindt en in welke kleuren u denkt. Wij snijden ze voor u en binden er een boeket van, precies zoals u het wilt.',
    punten: ['U kiest de bloemen en de kleuren', 'Wij snijden en binden het op', 'Klaar terwijl u wacht'],
  },
  {
    img: '/img/ranonkels.webp',
    icon: Sparkles,
    titel: 'Boeket op maat, op bestelling',
    tekst:
      'Voor een verjaardag, een geboorte, een jubileum of gewoon omdat het kan. Geef door waar het voor is en wat u wilt besteden, dan zetten wij het klaar.',
    punten: ['In elke prijsklasse', 'Ook zakelijk mogelijk', 'Op tijd doorgeven scheelt'],
  },
];

/**
 * De boeketten die de winkel zelf aanleverde. Twee groepen, want dat is het
 * onderscheid dat ze overal zelf maken: strak rond gebonden of los geplukt.
 *
 * Het bijschrift noemt wat er in staat en niets meer. Geen prijs en geen
 * "altijd op voorraad": welke bloemen er die week zijn wisselt, en een
 * voorbeeld hoort niet te lezen als een bestelling.
 */
const VOORBEELDEN: {kop: string; onder: string; items: [string, string, string][]}[] = [
  {
    kop: 'Klassiek rond gebonden',
    onder: 'Vol en compact, van boven af rond opgebonden. Staat mooi in een lage vaas.',
    items: [
      ['boeket-roze-wit', 'Roze en wit', "Roze rozen, witte en fuchsia gerbera's, lisianthus en oranje hypericum"],
      ['boeket-wit-groen', 'Wit en groen', "Witte rozen, gerbera's en lisianthus met veel blad ertussen"],
      ['boeket-roze-paars', 'Roze en paars', "Roze gerbera's en rozen met paarse limonium"],
      ['boeket-rode-rozen', 'Rode rozen', 'Alleen rode rozen met hun eigen blad, verder niets'],
    ],
  },
  {
    kop: 'In plukstijl',
    onder: 'Losser en luchtiger, verschillende hoogtes door elkaar, alsof het net geplukt is.',
    items: [
      ['pluk-zonnebloem', 'Zomers', 'Zonnebloem, blauwe distel, craspedia en grassen'],
      ['pluk-oranje-paars', 'Oranje en paars', "Oranje gerbera's en freesia met paarse klokjes en eucalyptus"],
      ['pluk-herfst', 'Herfst', "Rood eikenblad, rode gerbera's en rozen met bes"],
    ],
  },
];

const GELEGENHEDEN = [
  'Verjaardag',
  'Geboorte',
  'Jubileum of huwelijk',
  'Bedankje',
  'Zomaar, om iemand blij te maken',
  'Zakelijk of voor op kantoor',
];

export default function Boeketten() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Boeketten"
        titel="Een boeket voor elk moment"
        intro="De winkel staat vol met verse bloemen die we dagelijks aanvullen. Neem een boeket mee dat al klaar staat of laat er een samenstellen naar eigen keuze. Uiteraard denken wij graag met u mee."
        img="/img/plukboeket.webp"
        alt="Een net gebonden boeket in de winkel aan de Molendijk"
      >
        {TIJDELIJK_GESLOTEN ? (
          <GeslotenKopMelding />
        ) : (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#vraag-aan" className={KNOP_HOOFD}>
              Boeket aanvragen <ArrowRight className="h-4 w-4" />
            </a>
            <a href={`tel:${TEL}`} className={KNOP_TWEEDE_DONKER}>
              <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
            </a>
          </div>
        )}
      </PaginaKop>

      {/* -------------------------------------------------------------- */}

      {/* Meteen onder de kop, want dit is de vraag waar iemand mee op deze
          pagina komt: hoe ziet zo'n boeket er dan uit. De uitleg over hoe u
          eraan komt staat daaronder. */}
      <Section>
        <div className="max-w-2xl">
          <Kicker>Voorbeelden</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Zo kan een boeket eruitzien</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Wat er precies in gaat hangt af van wat er die week binnenkomt, dus geen twee boeketten zijn
            hetzelfde. Deze geven een idee van de twee vormen en van de kleuren waar u aan kunt denken.
          </p>
        </div>

        {VOORBEELDEN.map((groep) => (
          <div key={groep.kop} className="mt-12 first:mt-10">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-line pb-3">
              <h3 className="text-xl font-semibold">{groep.kop}</h3>
              <p className="text-sm leading-relaxed text-ink/55">{groep.onder}</p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-8 lg:grid-cols-4">
              {groep.items.map(([bestand, titel, onder]) => (
                <li key={bestand} className="group">
                  {/* De witte studioachtergrond is eruit gesneden, dus het
                      boeket staat los op de room. De zachte schaduw eronder
                      geeft het een bodem; zonder die vlek zweeft het. */}
                  <div className="relative">
                    <div
                      aria-hidden="true"
                      className="absolute inset-x-[35%] bottom-[2%] h-[5%] rounded-[50%] bg-ink/20 blur-[6px]"
                    />
                    <img
                      src={`/img/${bestand}.webp`}
                      alt={onder}
                      width={420}
                      height={420}
                      loading="lazy"
                      className="relative w-full transition duration-300 group-hover:-translate-y-1.5"
                    />
                  </div>
                  <p className="mt-1 font-semibold">{titel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">{onder}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {TIJDELIJK_GESLOTEN ? (
          <p className="mt-12 text-sm leading-relaxed text-ink/55">
            Iets anders in gedachten? Zodra de winkel weer open is maken we er iets van dat past. Op dit
            moment nemen we geen aanvragen aan.
          </p>
        ) : (
          <p className="mt-12 text-sm leading-relaxed text-ink/55">
            Iets anders in gedachten? Zeg welke kleuren u mooi vindt en wat u wilt besteden, dan maken wij er
            iets van dat past.{' '}
            <a
              href="#vraag-aan"
              className="font-semibold text-accent-dark underline decoration-accent-dark/25 underline-offset-4 transition hover:decoration-accent-dark"
            >
              Vertel wat u zoekt
            </a>
          </p>
        )}
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="max-w-2xl">
          <Kicker>Drie manieren</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Hoe u aan uw boeket komt</h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {MANIEREN.map((m) => (
            <article key={m.titel} className="overflow-hidden rounded-2xl border border-line bg-cream">
              <img src={m.img} alt={m.titel} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              <div className="p-6">
                <m.icon className="h-5 w-5 text-accent-dark" />
                <h3 className="mt-3 text-lg font-semibold">{m.titel}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{m.tekst}</p>
                <ul className="mt-4 space-y-2 text-sm text-ink/75">
                  {m.punten.map((p) => <Bullet key={p}>{p}</Bullet>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Kicker>Waarvoor dan ook</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Zeg waar het voor is, dan denken we mee</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              Een boeket voor een verjaardag ziet er anders uit dan een bedankje aan de buren of een boeket
              voor op de balie. Vertel ons de gelegenheid en de kleuren die erbij horen, dan maken wij er iets
              van dat past.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2">
              {GELEGENHEDEN.map((g) => (
                <li key={g} className="rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink/70">
                  {g}
                </li>
              ))}
            </ul>

            {/* De cadeaubon krijgt geen eigen pagina: dit is alles wat erover
                te zeggen valt, dus hij staat hier waar hij logisch opkomt. */}
            <div className="mt-9 flex gap-3.5 rounded-2xl border border-line bg-white p-5">
              <Gift className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
              <div>
                <p className="font-semibold">Liever een cadeaubon?</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/65">
                  Handig als u iets moois wilt geven maar de ontvanger liever zelf laat kiezen. De bon ligt in
                  de winkel klaar.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <img
              src="/img/tulpen.webp"
              alt="Verse tulpen in de winkel"
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover"
            />
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/img/zonnebloemen.webp"
                alt="Zonnebloemen"
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <img
                src="/img/pioenen.webp"
                alt="Pioenen van de kweker"
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit" slank>
        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-line bg-cream p-6 sm:p-8">
          <div className="flex gap-3.5">
            <Flower2 className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
            <div>
              <p className="text-lg font-semibold">Steeds hetzelfde plezier, zonder eraan te denken?</p>
              <p className="mt-1 text-sm leading-relaxed text-ink/65">
                Met een abonnement staat er wekelijks, tweewekelijks of maandelijks een vers boeket klaar.
              </p>
            </div>
          </div>
          <a
            href="/abonnement/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent-dark underline decoration-accent-dark/25 underline-offset-4 transition hover:decoration-accent-dark"
          >
            Meer over het abonnement <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </Section>
    </Pagina>
  );
}
