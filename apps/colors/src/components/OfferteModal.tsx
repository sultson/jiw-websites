import { useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { sectionTitles, usps } from '../content';
import OfferteForm from './OfferteForm';

export default function OfferteModal() {
  const { isOpen, close } = useOfferte();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const previouslyFocused = document.activeElement as HTMLElement | null;
      const focusable = dialogRef.current?.querySelector<HTMLElement>(
        'input, button, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
      return () => previouslyFocused?.focus();
    }
  }, [isOpen]);

  return (
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[100] transition-opacity duration-200 ${
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button
        type="button"
        aria-label="Sluiten"
        onClick={close}
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        tabIndex={isOpen ? 0 : -1}
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offerte-modal-title"
        className={`absolute inset-x-0 bottom-0 md:inset-0 md:m-auto md:h-fit md:max-h-[90vh] md:max-w-3xl md:rounded-2xl bg-bone shadow-2xl flex flex-col overflow-hidden transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-8 md:translate-y-4'
        }`}
        style={{ maxHeight: 'min(100dvh, 100vh)' }}
      >
        <div className="flex items-center justify-between gap-4 px-5 md:px-8 py-4 border-b border-line bg-bone sticky top-0 z-10">
          <div>
            <p className="eyebrow">{sectionTitles.offerte.eyebrow}</p>
            <h2
              id="offerte-modal-title"
              className="font-display text-xl md:text-2xl mt-1 leading-tight"
            >
              Gratis prijsindicatie
            </h2>
          </div>
          <button
            type="button"
            aria-label="Sluiten"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-bone-soft"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-8 md:grid-cols-[1fr_1.4fr] px-5 md:px-8 py-6 md:py-8">
            <aside className="hidden md:flex flex-col">
              <p className="text-stone text-base leading-relaxed">
                We sturen u binnen 1 dag een reactie. Vaak komen we langs voor een gratis
                prijsindicatie en bespreken kleuren, materialen en planning.
              </p>
              <ul className="mt-6 space-y-3">
                {usps.slice(0, 4).map((u) => (
                  <li key={u.title} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-rood" />
                    <span className="text-ink font-medium">{u.title}</span>
                  </li>
                ))}
              </ul>
            </aside>
            <div>
              <OfferteForm onSuccess={close} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
