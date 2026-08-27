import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Bericht } from '../content/types';
import { useStrook } from '../beweging';
import BerichtKaart from './BerichtKaart';

/**
 * De rij berichten zelf, zonder kop eromheen: die zet BerichtenStrook.
 *
 * Vanaf vier berichten schuift de rij traag door en blijft hij ondertussen een
 * gewoon scrollbaar vak, dus vegen, slepen en de twee knoppen doen het
 * allemaal. Daaronder zou het doorschuiven een zichtbare herhaling worden van
 * dezelfde twee kaarten, dus dan staat er gewoon een raster. Een strook die
 * heen en weer wiebelt is geen strook.
 */
export default function NieuwsStrook({ berichten }: { berichten: Bericht[] }) {
  const { ref: strook, naar } = useStrook<HTMLDivElement>();

  if (!berichten.length) return null;

  if (berichten.length < 4) {
    return (
      <ul className="grid gap-4 sm:grid-cols-2">
        {berichten.map((bericht) => (
          <li key={bericht.id}>
            <BerichtKaart bericht={bericht} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      <div className="strook" ref={strook}>
        <div className="strook-spoor">
          {[0, 1].map((ronde) => (
            <ul key={ronde} className="flex gap-4 px-2 pr-4" aria-hidden={ronde === 1 || undefined}>
              {berichten.map((bericht) => (
                <li key={`${ronde}-${bericht.id}`} className="w-[17.5rem] flex-none sm:w-[19.5rem]">
                  {/* De tweede rij is er alleen om de lus rond te maken. Hij is
                      verborgen voor schermlezers en niet met de toets te
                      bereiken, anders staat alles er twee keer in. */}
                  <BerichtKaart bericht={bericht} bereikbaar={ronde === 0} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
      <div className="mt-4 hidden justify-end gap-2 md:flex">
        <StrookKnop kant="links" bij={() => naar(-1)} />
        <StrookKnop kant="rechts" bij={() => naar(1)} />
      </div>
    </>
  );
}

function StrookKnop({ kant, bij }: { kant: 'links' | 'rechts'; bij: () => void }) {
  const links = kant === 'links';
  return (
    <button
      type="button"
      onClick={bij}
      aria-label={links ? 'Vorige berichten' : 'Volgende berichten'}
      className="grid h-10 w-10 place-items-center rounded-full border border-lijn bg-white text-inkt-zacht transition hover:border-blos-diep hover:text-wijn"
    >
      {links ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
