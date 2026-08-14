import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import Formulier from './Formulier';
import { usePad } from '../router';
import { MAIL, TEL, TEL_LINK } from '../ui';

/**
 * Contact opnemen mag nooit betekenen dat je eerst een hele pagina moet
 * afscrollen. Dus staat er op elke pagina, ook op een groot scherm, een knop
 * rechtsonder die een venster met het formulier opent.
 *
 * Op de contactpagina staat het formulier er al, en dan is deze knop alleen
 * ruis, dus daar blijft hij weg.
 */
export default function ContactKnop() {
  const pad = usePad();
  const [open, setOpen] = useState(false);
  const venster = useRef<HTMLDivElement>(null);

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
    };
  }, [open]);

  useEffect(() => setOpen(false), [pad]);

  if (pad === '/contact') return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 rounded-full bg-teal px-5 py-3.5 font-semibold text-white shadow-lg transition hover:bg-groen"
      >
        <MessageCircle className="h-5 w-5" />
        <span className="hidden sm:inline">Stuur een bericht</span>
        <span className="sm:hidden">Bericht</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button
            type="button"
            aria-label="Sluiten"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-groen-diep/45 backdrop-blur-[2px]"
          />
          <div
            ref={venster}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-venster-titel"
            tabIndex={-1}
            className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-room p-6 shadow-2xl outline-none sm:rounded-3xl md:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="contact-venster-titel" className="text-2xl">
                  Stuur ons een bericht
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-groen/70">
                  Je hoeft niet uit te leggen wat er speelt. Een berichtje met alleen je naam en de
                  vraag of je een keer mag komen kijken is genoeg.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluiten"
                className="grid h-10 w-10 flex-none place-items-center rounded-full border border-groen/20 text-groen transition hover:bg-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6">
              <Formulier compact />
            </div>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-lijn pt-5">
              <a
                href={TEL_LINK}
                className="inline-flex items-center gap-2 rounded-full border border-groen/25 px-5 py-2.5 font-semibold text-groen transition hover:bg-white"
              >
                <Phone className="h-4 w-4" /> {TEL}
              </a>
              <a
                href={`mailto:${MAIL}`}
                className="inline-flex items-center gap-2 rounded-full border border-groen/25 px-5 py-2.5 font-semibold text-groen transition hover:bg-white"
              >
                {MAIL}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
