import {ArrowRight, Briefcase, Flower2, Phone, Repeat, Scissors, Sparkles, Wallet} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {
  Bullet, KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section, TEL, TEL_DISPLAY,
} from '../ui';

/* ------------------------------------------------------------------ */

const HOE = [
  {
    icon: Repeat,
    kop: 'Wekelijks, tweewekelijks of maandelijks',
    tekst: 'U kiest het ritme dat bij u past. Een keer overslaan of stoppen kan altijd, een appje is genoeg.',
  },
  {
    icon: Wallet,
    kop: 'Een vaste prijs per boeket',
    tekst: 'U spreekt met ons af wat een boeket mag kosten. Daar maken wij telkens het mooiste van dat erin past, wat er die week ook binnenkomt.',
  },
  {
    icon: Sparkles,
    kop: 'Altijd van het seizoen',
    tekst: 'Wat er op dat moment vers binnenkomt bepaalt wat erin gaat. Geen twee keer hetzelfde boeket.',
  },
  {
    icon: Briefcase,
    kop: 'Ook voor de zaak',
    tekst: 'Op de balie, in de wachtkamer of op kantoor. Een vaste dag, en het staat er weer vers.',
  },
];

/* De klant kiest de vorm, niet de bloemen: dat is precies wat het abonnement
   leuk maakt en het scheelt elke week een gesprek. */
const VORMEN = [
  {
    img: '/img/boeket-roze-wit.webp',
    titel: 'Klassiek rond boeket',
    tekst:
      'Strak rond gebonden, vol en compact. Staat mooi in een lage vaas en past overal: op tafel, op de balie of in de vensterbank.',
  },
  {
    img: '/img/pluk-zonnebloem.webp',
    titel: 'Plukboeket',
    tekst:
      'Losser en luchtiger, alsof het net uit de tuin komt. Verschillende hoogtes en soorten door elkaar, met wat groen erbij.',
  },
];

/* De drie bedragen stonden alleen in lopende tekst. Ze staan hier als eigen band
   omdat "wat kost het" de eerste vraag is bij een abonnement, en omdat het bedrag
   PER BOEKET is en niet per maand. Hier stond eerst "15 of 30 per maand" onder
   elk bedrag: dat rekende twee ritmes voor. Sinds er drie zijn (wekelijks,
   tweewekelijks, maandelijks) klopt dat sommetje niet meer, en de winkel zegt
   het zelf zo: wat u per boeket besteedt, bepaalt u. */
const PRIJZEN = [15, 20, 35];

const STAPPEN: [string, string][] = [
  ['U geeft door wat u wilt', 'Wekelijks, tweewekelijks of maandelijks, rond of pluk, en welk bedrag per boeket u in gedachten heeft.'],
  ['Wij spreken een vaste dag af', 'Zo weet u wanneer uw boeket klaarstaat en weten wij wat we moeten inkopen.'],
  ['Elke keer iets anders', 'Wij binden het boeket van wat er op dat moment het mooist binnenkomt. U haalt het op in de winkel.'],
];

export default function Abonnement() {
  return (
    <Pagina>
      {/* Hier stond het uitgesneden abonnementsboeket op een roomvlak. Dat was het
          enige lichte kader in de donkergroene kop en het viel op deze pagina uit
          de toon: de drie andere paginakoppen hebben een gevulde foto zonder
          kader. Nu een eigen winkelfoto, gevuld, zoals daar. Het aangeleverde
          boeket staat nog op de tegel op de voorpagina en in het aanvraagformulier
          (abo-boeket-kaart.webp); abo-boeket.webp blijft staan om terug te zetten. */}
      <PaginaKop
        kicker="Abonnement"
        titel="Een bloemenabonnement, zonder eraan te denken"
        intro="Met een bloemenabonnement staat er wekelijks, tweewekelijks of maandelijks een vers boeket voor u klaar, tegen een vaste prijs per boeket: 15, 20 of 35 euro. Geen twee keer hetzelfde boeket. U kunt kiezen tussen een klassiek rond boeket of een plukboeket."
        img="/img/abo-hero.webp"
        alt="Een arm vol verse pioenen voor de winkel aan de Molendijk"
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#vraag-aan" className={KNOP_HOOFD}>
            Abonnement aanvragen <ArrowRight className="h-4 w-4" />
          </a>
          <a href={`tel:${TEL}`} className={KNOP_TWEEDE_DONKER}>
            <Phone className="h-4 w-4 text-accent" /> {TEL_DISPLAY}
          </a>
        </div>
      </PaginaKop>

      {/* -------------------------------------------------------------- */}

      <Section slank>
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-md">
            <Kicker>Prijzen</Kicker>
            <h2 className="text-2xl font-semibold sm:text-3xl">U kiest het bedrag per boeket</h2>
            <p className="mt-2.5 leading-relaxed text-ink/65">
              Wat u per boeket wilt besteden, bepaalt u zelf. Wilt u liever een ander bedrag, zeg het
              gerust.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 md:shrink-0">
            {PRIJZEN.map((p) => (
              <div key={p} className="rounded-2xl border border-line bg-white px-4 py-7 text-center sm:px-7 sm:py-8">
                <p className="text-3xl font-semibold leading-none sm:text-4xl">
                  <span className="text-accent-dark">&euro;</span> {p}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
                  per boeket
                </p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="max-w-2xl">
          <Kicker>Hoe het werkt</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">U bepaalt het ritme en het bedrag</h2>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2">
          {HOE.map((h) => (
            <div key={h.kop} className="flex gap-4 rounded-2xl border border-line bg-cream p-6">
              <h.icon className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
              <div>
                <p className="font-semibold leading-snug">{h.kop}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{h.tekst}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section>
        <div className="max-w-2xl">
          <Kicker>Twee vormen</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Rond of pluk, u kiest</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            De bloemen wisselen elke keer, de vorm blijft zoals u het wilt. Twijfelt u? Zeg het gerust bij de
            eerste levering, dan kijken we samen wat het beste bij uw huis of zaak past.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {VORMEN.map((v) => (
            <article key={v.titel} className="overflow-hidden rounded-2xl border border-line bg-white">
              {/* Contain en niet cover: dit zijn uitgesneden boeketten, dus er
                  mag niets van afvallen. De room eromheen laat zien dat het
                  een voorbeeld is en geen sfeerfoto uit de winkel. */}
              <img
                src={v.img}
                alt={v.titel}
                width={420}
                height={420}
                loading="lazy"
                className="aspect-[4/3] w-full bg-cream object-contain px-4 py-3"
              />
              <div className="p-6">
                <Scissors className="h-5 w-5 text-accent-dark" />
                <h3 className="mt-3 text-lg font-semibold">{v.titel}</h3>
                <p className="mt-2 leading-relaxed text-ink/65">{v.tekst}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <div>
            <Kicker>In drie stappen</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Zo begint het</h2>

            <ol className="mt-8 space-y-6">
              {STAPPEN.map(([kop, tekst], i) => (
                <li key={kop} className="flex gap-4">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent/15 text-sm font-bold text-accent-dark">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold leading-snug">{kop}</p>
                    <p className="mt-1 leading-relaxed text-ink/65">{tekst}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-line bg-cream p-6 sm:p-8">
            <Flower2 className="h-6 w-6 text-accent-dark" />
            <h3 className="mt-4 text-xl font-semibold">Goed om te weten</h3>
            <ul className="mt-5 space-y-3 text-ink/75">
              <Bullet>Een keer overslaan kan, bijvoorbeeld als u op vakantie bent</Bullet>
              <Bullet>Stoppen kan altijd, u zit nergens aan vast</Bullet>
              <Bullet>Een abonnement cadeau doen kan ook, voor een aantal maanden</Bullet>
              <Bullet>Voor de zaak maken we een vaste afspraak over de dag en de plek</Bullet>
            </ul>
            <div className="mt-7 flex gap-3.5 border-t border-line pt-6">
              <Briefcase className="mt-0.5 h-5 w-5 shrink-0 text-accent-dark" />
              <p className="text-sm leading-relaxed text-ink/65">
                Zakelijk en wilt u eerst een voorstel? Bel ons op{' '}
                <a href={`tel:${TEL}`} className="font-semibold text-accent-dark hover:underline">{TEL_DISPLAY}</a>,
                dan kijken we mee naar de ruimte en het budget.
              </p>
            </div>
          </div>
        </div>
      </Section>
    </Pagina>
  );
}
