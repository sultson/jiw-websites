import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Activiteit } from '../content/types';
import AgendaKaart from './AgendaKaart';

/**
 * De eerstvolgende activiteiten als een rij die je opzij veegt.
 *
 * Bewust geen lijst die de pagina in de lengte laat groeien: op een telefoon
 * wordt dat een muur van identieke donderdagen. Een rij laat zien dat er meer
 * is zonder dat je erdoorheen moet scrollen, en de hele agenda staat een klik
 * verderop in de kalender.
 */
export default function AgendaRij({ activiteiten }: { activiteiten: Activiteit[] }) {
  const rij = useRef<HTMLDivElement>(null);

  const schuif = (richting: 1 | -1) => {
    const el = rij.current;
    if (!el) return;
    const kaart = el.querySelector('li');
    const breedte = kaart instanceof HTMLElement ? kaart.offsetWidth + 20 : 320;
    el.scrollBy({ left: richting * breedte, behavior: 'smooth' });
  };

  if (!activiteiten.length) {
    return (
      <p className="rounded-2xl border border-lijn bg-white p-6 text-groen/70">
        Er staat op dit moment niets gepland. Bel ons gerust, dan vertellen we wanneer we er weer
        zijn.
      </p>
    );
  }

  return (
    <div className="relative">
      <div className="rij -mx-5 flex gap-5 px-5 md:-mx-8 md:px-8" ref={rij}>
        <ul className="flex gap-5">
          {activiteiten.map((activiteit) => (
            <li key={activiteit.id} className="w-[17.5rem] flex-none sm:w-[19rem]">
              <AgendaKaart activiteit={activiteit} strook />
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-5 hidden gap-2 md:flex">
        <Pijl kant="links" bij={() => schuif(-1)} />
        <Pijl kant="rechts" bij={() => schuif(1)} />
      </div>
    </div>
  );
}

function Pijl({ kant, bij }: { kant: 'links' | 'rechts'; bij: () => void }) {
  const links = kant === 'links';
  return (
    <button
      type="button"
      onClick={bij}
      aria-label={links ? 'Eerdere activiteiten' : 'Latere activiteiten'}
      className="grid h-11 w-11 place-items-center rounded-full border border-groen/20 bg-white text-groen transition hover:border-groen/50 hover:text-teal-tekst"
    >
      {links ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
