import { useEffect, useRef, useState } from 'react';
import { X, Check } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { sectionTitles, usps, form } from '../content';
import OfferteForm from './OfferteForm';

export default function OfferteModal() {
  const { t } = useSite();
  const { isOpen, close } = useOfferte();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    if (!mounted || !visible) return;
    const focusTimer = window.setTimeout(() => {
      const el = panelRef.current?.querySelector<HTMLElement>(
        'input:not([type="hidden"]):not([tabindex="-1"]), select, textarea',
      );
      el?.focus();
    }, 60);
    return () => window.clearTimeout(focusTimer);
  }, [mounted, visible]);

  useEffect(() => {
    if (mounted) return;
    lastActiveRef.current?.focus?.();
  }, [mounted]);

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
    <div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center sm:p-4">
      <div
        className={`absolute inset-0 bg-ink/75 backdrop-blur-sm transition-opacity duration-200 ${
          visible ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="offerte-modal-title"
        className={`relative flex max-h-[92vh] w-full flex-col rounded-t-2xl border border-line bg-ink-2 shadow-2xl transition-all duration-200 sm:max-h-[90vh] sm:max-w-3xl sm:rounded-2xl ${
          visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-2xl border-b border-line bg-ink-2/95 px-5 py-4 backdrop-blur-sm sm:px-7">
          <div>
            <span className="eyebrow">{t(sectionTitles.offerte.eyebrow)}</span>
            <h2
              id="offerte-modal-title"
              className="mt-2 text-xl font-extrabold leading-tight text-bone sm:text-2xl"
            >
              {t(sectionTitles.offerte.title)}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Sluiten"
            className="-mr-1 shrink-0 rounded-lg p-2 text-mute transition-colors hover:bg-ink-3 hover:text-bone"
          >
            <X size={22} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr]">
            <aside className="hidden md:block">
              <p className="leading-relaxed text-bone-soft">{t(form.intro)}</p>
              <p className="mt-6 text-sm font-bold uppercase tracking-[0.12em] text-orange">
                {t(form.asideTitle)}
              </p>
              <ul className="mt-3 flex flex-col gap-3">
                {usps.map((u) => (
                  <li key={u.title.nl} className="flex items-start gap-2.5 text-sm text-bone-soft">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange/15">
                      <Check size={13} strokeWidth={3} className="text-orange" />
                    </span>
                    <span>{t(u.title)}</span>
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
