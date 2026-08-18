import {ArrowRight, Clock, Heart, MessageCircle, Phone} from 'lucide-react';
import {Pagina, PaginaKop} from '../layout';
import {
  Bullet, KNOP_HOOFD, KNOP_TWEEDE_DONKER, Kicker, Section, TEL, TEL_DISPLAY, WHATSAPP,
} from '../ui';

/* ------------------------------------------------------------------ */

const SOORTEN = [
  {
    titel: 'Rouwboeket',
    tekst: 'Een gebonden boeket om mee te nemen naar de dienst of om thuis neer te zetten.',
  },
  {
    titel: 'Bloemstuk voor op de kist',
    tekst: 'Op maat gemaakt voor de kist, in de kleuren en de stijl die bij hem of haar pasten.',
  },
  {
    titel: 'Hart of krans',
    tekst: 'Een klassieke vorm, strak of juist landelijk, van de bloemen die u kiest.',
  },
  {
    titel: 'Losse bloemen voor de dienst',
    tekst: 'Bloemen om uit te delen aan de aanwezigen, of om bij de kist neer te leggen.',
  },
];

const AANDACHT = [
  'De kleuren die bij hem of haar pasten',
  'Een lint met tekst is mogelijk',
  'Bloemen die een betekenis hadden, als u die weet',
  'Wij zorgen dat het op tijd op de juiste plek is',
];

/* De aangeleverde foto's staan op vlak wit; dat wit is eruit gesneden zodat de
   stukken los op de room staan. Zie raw/rouw.mjs. */
const VOORBEELDEN: {kop: string; onder: string; items: [string, string, string][]}[] = [
  {
    kop: 'Liggend, voor op of naast de kist',
    onder: 'Aan een kant afgewerkt zodat het plat ligt. De eerste twee zijn met de hand gebonden, met de stelen in het zicht.',
    items: [
      ['rouw-liggend-wit', 'Wit gebonden', 'Witte rozen en lelies met lisianthus, eucalyptus en veel blad'],
      ['rouw-liggend-roze', 'Roze gebonden', "Roze gerbera's en chrysant met zalmroze rozen, heide en eucalyptus"],
      ['rouw-druppel-oranje', 'Druppelvorm, oranje', "Oranje gerbera's en rozen met lelie, craspedia en herfstblad"],
      ['rouw-druppel-roze', 'Druppelvorm, roze', "Roze gerbera's en rozen met paarse lisianthus en blauwe distel"],
    ],
  },
  {
    kop: 'Rond gebonden',
    onder: 'Van boven af rond, even hoog rondom. Kan op de kist, maar staat ook op zichzelf.',
    items: [
      ['rouw-rond-wit', 'Wit met pluim', "Witte gerbera's, rozen en lisianthus met pluimgras ertussen"],
      ['rouw-rond-wit-groen', 'Wit en groen', 'Witte rozen met groene chrysant, witte bessen en eucalyptus'],
    ],
  },
];

export default function Rouwbloemen() {
  return (
    <Pagina>
      <PaginaKop
        kicker="Rouwbloemen"
        titel="Rouwbloemen om afscheid mee te nemen"
        intro="Een boeket, een stuk voor op de kist, een hart of een krans. We maken het in de kleuren die bij hem of haar pasten, en zorgen dat het op tijd op de juiste plek is."
        /* Op verzoek van de klant weer het conceptbeeld in de kop: hun eigen
           studiofoto op deze plek vonden ze niet mooi. Hun eigen stukken staan
           wel in de sectie Voorbeelden hieronder. Het bijgesneden alternatief
           blijft als /img/rouw-hero.webp klaarliggen. */
        img="/img/rouwbloemwerk.webp"
        alt="Rouwbloemwerk gemaakt in de winkel aan de Molendijk"
      >
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
            <Phone className="h-4 w-4" /> Bel ons: {TEL_DISPLAY}
          </a>
          <a href="#vraag-aan" className={KNOP_TWEEDE_DONKER}>
            Aanvraag doen <ArrowRight className="h-4 w-4 text-accent" />
          </a>
        </div>
        {/* Hier staat bellen bovenaan en niet het formulier: wie dit zoekt heeft
            vaak haast en wil een mens spreken, geen invulvelden. */}
        <p className="mt-5 flex items-center gap-2 text-sm text-white/55">
          <Clock className="h-4 w-4 shrink-0 text-accent" /> Moet het snel? Bel gerust, ook als het morgen al moet.
        </p>
      </PaginaKop>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div>
            <Kicker>Wat we maken</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">Van boeket tot krans</h2>
            <p className="mt-4 text-lg leading-relaxed text-ink/70">
              Weet u nog niet welke vorm het moet worden, dan denken we met u mee. Vertel ons over wie het gaat
              en wat hij of zij mooi vond, dan komen wij met een voorstel.
            </p>

            <ul className="mt-7 space-y-3 text-ink/75">
              {AANDACHT.map((a) => <Bullet key={a}>{a}</Bullet>)}
            </ul>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {SOORTEN.map((s) => (
              <article key={s.titel} className="rounded-2xl border border-line bg-cream p-6">
                <Heart className="h-5 w-5 text-accent-dark" />
                <h3 className="mt-3 font-semibold leading-snug">{s.titel}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink/65">{s.tekst}</p>
              </article>
            ))}
          </div>
        </div>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section>
        <div className="max-w-2xl">
          <Kicker>Voorbeelden</Kicker>
          <h2 className="text-3xl font-semibold sm:text-4xl">Zo kan rouwbloemwerk eruitzien</h2>
          <p className="mt-4 text-lg leading-relaxed text-ink/70">
            Wat er precies in gaat hangt af van wat er die week binnenkomt, dus geen twee stukken zijn
            hetzelfde. Deze geven een idee van de vormen en van de kleuren waar u aan kunt denken.
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
                  {/* De witte studioachtergrond is eruit gesneden, dus het stuk
                      staat los op de room. Geen losse schaduwvlek onder het
                      kader: deze stukken zijn niet even hoog en dan zweeft die
                      vlek los onder een liggend boeket. drop-shadow volgt de
                      uitsnede zelf, dus de schaduw ligt altijd goed. */}
                  <img
                    src={`/img/${bestand}.webp`}
                    alt={onder}
                    width={480}
                    height={480}
                    loading="lazy"
                    className="w-full drop-shadow-[0_10px_9px_rgba(13,42,33,0.16)] transition duration-300 group-hover:-translate-y-1.5"
                  />
                  <p className="mt-1 font-semibold">{titel}</p>
                  <p className="mt-1 text-sm leading-relaxed text-ink/60">{onder}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <p className="mt-12 text-ink/70">
          Iets anders in gedachten, of een hart, een krans of een lint met tekst?{' '}
          <a href="#vraag-aan" className="font-semibold text-accent-dark underline-offset-4 hover:underline">
            Vertel ons wat u zoekt
          </a>{' '}
          of bel ons even.
        </p>
      </Section>

      {/* -------------------------------------------------------------- */}

      <Section tone="wit">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <Kicker>Hoe het gaat</Kicker>
            <h2 className="text-3xl font-semibold sm:text-4xl">U hoeft het niet alleen uit te zoeken</h2>
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-ink/70">
              <p>
                Bel ons of loop binnen. We vragen wanneer de dienst is en waar het bloemwerk naartoe moet, en
                bespreken daarna rustig de vorm, de kleuren en wat het ongeveer gaat kosten.
              </p>
              <p>
                Is er weinig tijd, zeg dat dan meteen. Vaak kunnen we meer dan u denkt, ook als het de volgende
                dag al klaar moet zijn.
              </p>
              <p>
                Wij zorgen dat het op tijd bij het uitvaartcentrum, de kerk of het huis is. Geef ons het adres en
                het tijdstip door, dan regelen we de rest.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href={`tel:${TEL}`} className={KNOP_HOOFD}>
                <Phone className="h-4 w-4" /> {TEL_DISPLAY}
              </a>
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-line px-5 py-3 text-sm font-semibold transition hover:border-accent-dark hover:text-accent-dark"
              >
                <MessageCircle className="h-4 w-4 text-accent-dark" /> Stuur een appje
              </a>
            </div>
          </div>

          <img
            src="/img/rouw-druppel-roze.webp"
            alt="Rouwstuk in druppelvorm met roze gerbera's en rozen"
            loading="lazy"
            width={480}
            height={480}
            className="w-full object-contain"
          />
        </div>
      </Section>
    </Pagina>
  );
}
