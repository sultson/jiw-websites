import { Info } from 'lucide-react';
import type { Activiteit } from '../content/types';
import { maandNaam } from '../agenda/model';

/**
 * Loopt er een mededeling, zoals de vakantiesluiting, dan hoort die bovenaan te
 * staan. Anders staat er iemand voor een dichte deur.
 */
export default function Melding({ melding }: { melding: Activiteit }) {
  return (
    <div className="bg-zand">
      <p className="mx-auto flex max-w-6xl items-start gap-2.5 px-5 py-2.5 text-sm font-medium text-inkt md:items-center md:px-8">
        <Info className="mt-0.5 h-4 w-4 flex-none md:mt-0" />
        <span>
          {melding.titel}, tot en met {melding.eind.getDate()} {maandNaam(melding.eind)}. Bellen of
          mailen kan wel.
        </span>
      </p>
    </div>
  );
}
