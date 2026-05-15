import { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import { useOfferte } from '../contexts/OfferteContext';
import { sectionTitles, usps } from '../content';
import OfferteForm from './OfferteForm';

export default function OfferteModal() {
  const { isOpen, close } = useOfferte();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

  // Mount/unmount with enter + exit animation
  useEffect(() => {
    if (isOpen) {
      lastActiveRef.current = document.activeElement as HTMLElement | null;
      setMounted(true);
      const raf = requestAnimationFrame(() => setVisible(true));
      return () => cancelAnimationFrame(raf);
    }
    setVisible(false);
    const timer = window.setTimeout(() => setMounted(false), 220);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  // Focus first field on open, restore focus on close
  useEffect(() => {
    if (!mounted) return;
    if (visible) {
      const focusTimer = window.setTimeout(() => {
        const el = panelRef.current?.querySelector<HTMLElement>(
          'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea',
        );
        el?.focus();
      }, 60);
      return () => window.clearTimeout(focusTimer);
    }
  }, [mounted, visible]);

  useEffect(() => {
    if (mounted) return;
    lastActiveRef.current?.focus?.();
  }, [mounted]);

  // Focus trap
  useEffect(() => {
    if (!visible) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([type="hidden"]):not([tabindex="-1"]), select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [visible]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-ink/70 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offerte-modal-title"
        className={`relative w-full sm:max-w-3xl bg-ink-2 border border-line shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[90vh] rounded-t-2xl sm:rounded-2xl transition-all duration-200 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Sticky header */}
        <div className="sticky top-0 z-10 bg-ink-2/95 backdrop-blur-sm border-b border-line rounded-t-2xl px-5 sm:px-7 py-4 flex items-start justify-between gap-4">
          <div>
            <span className="eyebrow">{sectionTitles.offerte.eyebrow}</span>
            <h2
              id="offerte-modal-title"
              className="mt-2 text-xl sm:text-2xl font-bold text-bone leading-tight"
            >
              Vraag een gratis prijsindicatie aan
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Sluiten"
            className="shrink-0 -mr-1 p-2 rounded-lg text-mute hover:text-bone hover:bg-ink-3 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 sm:px-7 py-6">
          <div className="grid md:grid-cols-[0.85fr_1.15fr] gap-8">
            <aside className="hidden md:block">
              <p className="text-bone-soft leading-relaxed">
                Vertel ons kort wat er speelt. U krijgt een duidelijke prijsindicatie en eerlijk
                advies, zonder verplichtingen.
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {usps.map((u) => (
                  <li key={u.title} className="flex items-start gap-2.5 text-sm text-bone-soft">
                    <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full bg-gold/15 flex items-center justify-center">
                      <Check size={13} strokeWidth={3} className="text-gold" />
                    </span>
                    <span>{u.title}</span>
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
