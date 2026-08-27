import { Info } from 'lucide-react';
import type { Activiteit } from '../content/types';
import { maandNaam } from '../agenda/model';
import { Schil, Tekstlink, schrijfNaam } from '../ui';

/**
 * Loopt er een mededeling, zoals de vakantiesluiting, dan hoort die bovenaan te
 * staan. Anders staat er iemand voor een dichte deur.
 *
 * Met het jaar erbij, net als in de agenda: wie in december leest dat het huis
 * "tot en met 6 januari" dicht is, moet niet hoeven uitzoeken welk jaar dat is.
 */
export default function Melding({ melding }: { melding: Activiteit }) {
  const eind = melding.eind;
  return (
    <div className="border-b border-zorg-lijn bg-zorg">
      <Schil>
        <p className="flex items-start gap-2.5 py-3 text-[0.92rem] leading-relaxed text-inkt-zacht">
          <Info className="mt-0.5 h-4 w-4 flex-none text-wijn" aria-hidden="true" />
          <span>
            <strong className="font-bold text-wijn-diep">{schrijfNaam(melding.titel)}</strong>, tot
            en met {eind.getDate()} {maandNaam(eind)} {eind.getFullYear()}.{' '}
            {melding.omschrijving ? `${schrijfNaam(melding.omschrijving)} ` : ''}
            <Tekstlink href="/praktisch/contact">Neem contact op</Tekstlink>
          </span>
        </p>
      </Schil>
    </div>
  );
}
