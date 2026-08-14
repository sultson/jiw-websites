import { useMemo, useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Activiteit, Categorie, Teksten } from '../content/types';
import AgendaRij from '../components/AgendaRij';
import Kalender from '../components/Kalender';
import { Kop, PLAATS, STRAAT, Sectie } from '../ui';

const FILTERS: (Categorie | 'Alles')[] = ['Alles', 'Inloop', 'Creatief', 'Bewegen', 'Wellness'];

/**
 * De agenda heeft een pagina van zichzelf.
 *
 * Twee manieren om te kijken, want er zijn twee vragen. "Waar kan ik binnenkort
 * naartoe" beantwoordt de rij kaarten bovenaan. "Is er in oktober iets op een
 * donderdag" beantwoordt de kalender eronder, waar elke dag met iets erop een
 * stipje heeft.
 */
export default function AgendaPagina({
  teksten,
  agenda,
}: {
  teksten: Teksten;
  agenda: Activiteit[];
}) {
  const [filter, setFilter] = useState<Categorie | 'Alles'>('Alles');

  const activiteiten = useMemo(
    () =>
      agenda.filter(
        (a) => a.soort === 'activiteit' && (filter === 'Alles' || a.categorie === filter),
      ),
    [agenda, filter],
  );

  return (
    <>
      <Sectie>
        <Kop
          kicker={teksten.agendaBlok.kicker}
          titel="Wat er te doen is"
          intro={teksten.agendaBlok.lead}
        />

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => {
            const aan = filter === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                aria-pressed={aan}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  aan
                    ? 'bg-teal text-white'
                    : 'border border-groen/15 text-groen/70 hover:border-groen/40 hover:text-groen'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        <p className="mt-5 flex items-center gap-2 text-sm text-groen/55">
          <MapPin className="h-4 w-4" /> Tenzij anders vermeld is alles aan het {STRAAT} in {PLAATS}
        </p>

        <h2 className="mt-12 text-2xl">Binnenkort</h2>
        <div className="mt-6">
          <AgendaRij activiteiten={activiteiten.slice(0, 14)} />
        </div>
      </Sectie>

      <Sectie kleur="room-diep">
        <Kop
          titel="Verder vooruit kijken"
          intro="Blader per maand. Elke dag waarop iets is heeft een stip in de kleur van de activiteit."
          klein
        />
        <div className="mt-8">
          <Kalender activiteiten={activiteiten} />
        </div>

        <p className="mt-10 max-w-2xl leading-relaxed text-groen/70">
          Bij de inloop hoef je je niet aan te melden, je loopt zo naar binnen. Wil je meedoen aan
          een workshop, laat het dan even weten: er is een beperkt aantal plekken. Met de drie
          puntjes op een kaart zet je een activiteit in je eigen agenda.
        </p>
      </Sectie>
    </>
  );
}
