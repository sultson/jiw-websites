import { useMemo, useState } from 'react';
import { ArrowRight, HeartHandshake, Mail, MapPin, Phone, X } from 'lucide-react';
import type { Activiteit, Categorie, Teksten } from '../content/types';
import AgendaKaart from '../components/AgendaKaart';
import Kalender from '../components/Kalender';
import { MAANDEN, datumSleutel, perActiviteit } from '../agenda/model';
import {
  Knop,
  MAIL,
  PLAATS,
  PaginaHero,
  STRAAT,
  Sectie,
  TEL,
  TEL_LINK,
  Uitnodiging,
} from '../ui';

const FILTERS: (Categorie | 'Alles')[] = ['Alles', 'Inloop', 'Creatief', 'Bewegen', 'Wellness'];

/**
 * De agenda heeft een pagina van zichzelf.
 *
 * Links de maand, rechts de lijst. Dat is dezelfde agenda vanuit twee vragen
 * bekeken: "waar kan ik binnenkort naartoe" leest van boven naar beneden mee,
 * en "is er in oktober iets op een donderdag" klik je in de kalender aan,
 * waarna de lijst ernaast alleen die dag laat zien.
 */
export default function AgendaPagina({
  teksten,
  agenda,
}: {
  teksten: Teksten;
  agenda: Activiteit[];
}) {
  const [filter, setFilter] = useState<Categorie | 'Alles'>('Alles');
  const [dag, setDag] = useState<string | null>(null);

  /** Wat de kalender laat zien: alles van deze soort, ongeacht welke dag. */
  const vanSoort = useMemo(
    () =>
      agenda.filter(
        (a) => a.soort === 'activiteit' && (filter === 'Alles' || a.categorie === filter),
      ),
    [agenda, filter],
  );

  /**
   * Wat er in de lijst staat.
   *
   * Zonder gekozen dag staat elke activiteit er één keer in, met de
   * eerstvolgende keer erbij: de wekelijkse inloop is één regel en niet
   * tweeënvijftig donderdagen onder elkaar. Klikt iemand een dag aan, dan is
   * juist die dag de vraag en staat alles wat er die dag is er los in.
   */
  const lijst = useMemo(() => {
    if (dag) return vanSoort.filter((a) => datumSleutel(a.start) === dag);
    return perActiviteit(vanSoort);
  }, [vanSoort, dag]);

  return (
    <>
      <PaginaHero
        kruimels={[{ label: 'Agenda' }]}
        titel="Agenda en activiteiten"
        lead={teksten.agendaBlok.paginaLead}
        foto={{
          src: '/img/sfeer-gesprek.jpg',
          alt: 'Twee bezoeksters aan de grote tafel met een kop thee',
        }}
        knoppen={
          <>
            <Knop href="#lijst">Bekijk alles</Knop>
            <Knop href="/contact" soort="rand">
              Hulp bij kiezen
            </Knop>
          </>
        }
      />

      <Sectie kleur="room-diep" id="lijst" className="scroll-mt-20">
        {/* De regel die het verschil uitlegt tussen binnenlopen en meedoen.
            Hij staat boven de filters, want het is het antwoord op de eerste
            vraag die iemand bij een agenda heeft: moet ik me ergens melden. */}
        <p className="flex items-start gap-3 rounded-2xl bg-blos px-5 py-4 leading-relaxed text-inkt/80">
          <HeartHandshake className="mt-0.5 h-5 w-5 flex-none text-wijn" />
          <span>
            Bij de inloop hoef je je niet aan te melden, je loopt zo naar binnen. Voor een workshop
            is een berichtje handig, want er is een beperkt aantal plekken.
          </span>
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-2">
          {FILTERS.map((f) => {
            const aan = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  setFilter(f);
                  setDag(null);
                }}
                aria-pressed={aan}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  aan
                    ? 'bg-wijn text-white'
                    : 'border border-lijn bg-white text-inkt/70 hover:border-wijn/40 hover:text-wijn'
                }`}
              >
                {f}
              </button>
            );
          })}
          <p className="ml-auto flex items-center gap-2 text-sm text-inkt/55">
            <MapPin className="h-4 w-4" /> Tenzij anders vermeld aan het {STRAAT} in {PLAATS}
          </p>
        </div>

        <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,22rem)_1fr]">
          <div className="order-2 grid gap-6 lg:sticky lg:top-24 lg:order-1">
            <Kalender activiteiten={vanSoort} gekozen={dag} bijKiezen={setDag} />

            <Uitnodiging
              titel="Weet je niet wat past?"
              tekst="Geen zorgen, en geen oordeel. We denken graag met je mee en zoeken samen iets dat bij jou en je situatie past."
            >
              <ul className="grid gap-2">
                <li>
                  <a
                    href={TEL_LINK}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold text-wijn transition hover:bg-white/70"
                  >
                    <Phone className="h-4 w-4 flex-none" /> {TEL}
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${MAIL}`}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 font-semibold text-wijn transition hover:bg-white/70"
                  >
                    <Mail className="h-4 w-4 flex-none" /> {MAIL}
                  </a>
                </li>
                <li>
                  <a
                    href="/contact"
                    className="flex items-center gap-3 rounded-2xl border border-wijn/25 px-4 py-3 font-semibold text-wijn transition hover:border-wijn"
                  >
                    <ArrowRight className="h-4 w-4 flex-none" /> Kom een keer kennismaken
                  </a>
                </li>
              </ul>
            </Uitnodiging>
          </div>

          <div className="order-1 lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl">{dag ? `Op ${gekozenDag(dag)}` : 'Binnenkort'}</h2>
              {dag && (
                <button
                  type="button"
                  onClick={() => setDag(null)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-wijn/25 px-4 py-2 text-sm font-semibold text-wijn transition hover:border-wijn"
                >
                  <X className="h-4 w-4" /> Toon weer alles
                </button>
              )}
            </div>

            {lijst.length ? (
              <ul className="mt-5 grid gap-4">
                {lijst.map((activiteit) => (
                  <li key={activiteit.id}>
                    <AgendaKaart activiteit={activiteit} regel />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-3xl border border-lijn bg-white p-6 leading-relaxed text-inkt/70">
                Hier staat op dit moment niets. Kies een andere dag of zet de filter op alles, of bel
                ons gerust: dan vertellen we wanneer we er weer zijn.
              </p>
            )}
          </div>
        </div>
      </Sectie>
    </>
  );
}

/** "2026-09-10" wordt "donderdag 10 september". */
function gekozenDag(sleutel: string): string {
  const [jaar, maand, dag] = sleutel.split('-').map(Number);
  const datum = new Date(jaar, maand - 1, dag);
  const dagen = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  return `${dagen[datum.getDay()]} ${dag} ${MAANDEN[maand - 1]}`;
}
