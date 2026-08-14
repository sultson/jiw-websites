import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Bericht, Teksten } from '../content/types';
import { useStrook } from '../beweging';
import BerichtKaart from './BerichtKaart';
import { Kop } from '../ui';

/**
 * De strook met berichten, direct onder de kop en de knoppen.
 *
 * Hij stond eerst helemaal onderaan en heette "van onze socials". Dat was
 * precies verkeerd om: dit is het levendigste van de hele site en het is het
 * antwoord op de vraag waar iemand mee binnenkomt, namelijk of hier iets
 * gebeurt. Dus staat hij nu bovenaan, en zijn het gewoon berichten die zij zelf
 * schrijven, met een pagina van zichzelf.
 */
export default function NieuwsStrook({
  teksten,
  berichten,
}: {
  teksten: Teksten;
  berichten: Bericht[];
}) {
  const { ref: strook, naar } = useStrook<HTMLDivElement>();

  if (!berichten.length) return null;

  // Twee identieke rijen laten de lus rondlopen. Bij heel weinig berichten
  // wordt dat een zichtbare herhaling, dus dan staat de rij er gewoon één keer.
  const rondloop = berichten.length >= 4;

  return (
    <section className="bg-room-diep py-14 md:py-20">
      <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6 px-5 md:px-8">
        <Kop kicker={teksten.nieuwsBlok.kicker} titel={teksten.nieuwsBlok.titel} intro={teksten.nieuwsBlok.lead} />
        <div className="flex items-center gap-2">
          {rondloop && (
            <div className="hidden gap-2 md:flex">
              <StrookKnop kant="links" bij={() => naar(-1)} />
              <StrookKnop kant="rechts" bij={() => naar(1)} />
            </div>
          )}
          <a
            href="/nieuws"
            className="inline-flex items-center gap-2 rounded-full border border-inkt/25 bg-white px-5 py-2.5 font-semibold text-inkt transition hover:border-inkt/60"
          >
            Alle berichten <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>

      <div className="mt-10 md:mt-12">
        <div className="strook" ref={strook}>
          <div className="strook-spoor">
            {(rondloop ? [0, 1] : [0]).map((ronde) => (
              <ul key={ronde} className="flex gap-6 px-3 pr-6" aria-hidden={ronde === 1 || undefined}>
                {berichten.map((bericht) => (
                  <li key={`${ronde}-${bericht.id}`} className="w-[19rem] flex-none sm:w-[21rem]">
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
      </div>
    </section>
  );
}

function StrookKnop({ kant, bij }: { kant: 'links' | 'rechts'; bij: () => void }) {
  const links = kant === 'links';
  return (
    <button
      type="button"
      onClick={bij}
      aria-label={links ? 'Vorige berichten' : 'Volgende berichten'}
      className="grid h-11 w-11 place-items-center rounded-full border border-inkt/20 bg-white text-inkt transition hover:border-inkt/50 hover:text-wijn"
    >
      {links ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
    </button>
  );
}
