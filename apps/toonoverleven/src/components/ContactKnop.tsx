import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import Formulier from './Formulier';
import { usePad } from '../router';
import { CONTACT } from '../navigatie';
import { MAIL, TEL, TEL_LINK } from '../ui';

/**
 * Contact opnemen mag nooit betekenen dat je eerst een hele pagina moet
 * afscrollen. Dus staat er op elke pagina, ook op een groot scherm, een knop
 * rechtsonder die een venster met het formulier opent.
 *
 * De voet houdt rechtsonder ruimte vrij (pb-24 en sm:pr-56) zodat deze knop
 * daar nooit een regel afdekt. Hij meet ongeveer 198 bij 54 op twintig pixel
 * van de rand; wordt hij groter, dan moet de voet mee.
 */

/**
 * Pagina's waar het formulier zelf al op staat. Een zwevende contactknop boven
 * een openstaand contactformulier is alleen ruis.
 */
const AL_AANWEZIG = [CONTACT.pad, '/over-ons/vrijwilliger-worden'];

export default function ContactKnop() {
  const pad = usePad();
  const [open, setOpen] = useState(false);
  const venster = useRef<HTMLDivElement>(null);
  const knop = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const ontsnap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', ontsnap);
    document.body.style.overflow = 'hidden';
    // De eerste keer dat er iets te lezen valt hoort bovenaan het venster te
    // beginnen, niet halverwege het formulier.
    venster.current?.focus();
    return () => {
      document.removeEventListener('keydown', ontsnap);
      document.body.style.overflow = '';
      // Wie het venster met het toetsenbord sluit, hoort terug te komen bij de
      // knop waarmee hij het opende, en niet bovenaan de pagina.
      knop.current?.focus();
    };
  }, [open]);

  useEffect(() => setOpen(false), [pad]);

  if (AL_AANWEZIG.includes(pad)) return null;

  return (
    <>
      <button
        ref={knop}
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 inline-flex min-h-[3.4rem] items-center gap-2.5 rounded-full border border-wijn bg-wijn px-[1.25rem] py-3.5 text-[0.88rem] font-extrabold leading-tight text-white shadow-[0_10px_28px_rgba(55,28,38,0.22)] transition hover:-translate-y-0.5 hover:border-wijn-diep hover:bg-wijn-diep"
      >
        <MessageCircle className="h-5 w-5 flex-none" aria-hidden="true" />
        <span className="max-sm:sr-only">Stuur een bericht</span>
        <span className="sm:hidden" aria-hidden="true">
          Bericht
        </span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-wijn-diep/45"
          />
          <div
            ref={venster}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-venster-titel"
            tabIndex={-1}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-[1.65rem] bg-room p-6 shadow-[var(--shadow-zacht)] outline-none sm:rounded-[1.65rem] md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-venster-titel" className="text-[1.5rem]">
                  Stuur ons een bericht
                </h2>
                <p className="mt-2.5 leading-relaxed text-inkt-zacht">
                  Je hoeft niet uit te leggen wat er speelt. Een berichtje met alleen je naam en de
                  vraag of je een keer mag komen kijken is genoeg.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="grid h-11 w-11 flex-none place-items-center rounded-full border border-lijn bg-white text-inkt transition hover:border-blos-diep hover:bg-blos"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6">
              <Formulier compact />
            </div>

            <p className="mt-6 border-t border-lijn pt-5 text-[0.88rem] leading-relaxed text-grijs">
              Liever meteen iemand spreken? Bel{' '}
              <a href={TEL_LINK} className="font-bold text-wijn no-underline hover:underline">
                {TEL}
              </a>{' '}
              of mail{' '}
              <a href={`mailto:${MAIL}`} className="font-bold text-wijn no-underline hover:underline">
                {MAIL}
              </a>
              .
            </p>
          </div>
        </div>
      )}
    </>
  );
}
