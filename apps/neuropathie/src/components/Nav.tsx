import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import { SITE } from '../lib/site';

import type { SubjectKey } from './ContactModal';

type Props = { onOpen: (subject?: SubjectKey) => void };

const links = [
  { id: 'neuropathie', label: 'Wat is neuropathie' },
  { id: 'clienten', label: 'Voor cliënten' },
  { id: 'overzicht', label: 'Therapeut vinden' },
  { id: 'therapeuten', label: 'Voor therapeuten' },
  { id: 'ontstaan', label: 'Ontstaan' },
];

export default function Nav({ onOpen }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 bg-canvas border-b transition-shadow duration-200 ${
        scrolled ? 'border-line shadow-[0_1px_12px_rgba(20,32,42,0.06)]' : 'border-line'
      }`}
    >
      <div className="shell-wide flex items-center justify-between gap-4 h-[68px] lg:h-[80px]">
        <a href="#top" className="flex flex-col leading-none shrink-0" aria-label={SITE.name}>
          <span className="font-display text-[19px] lg:text-[22px] text-ink" style={{ letterSpacing: '-0.01em' }}>
            Voetreflexologie
          </span>
          <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.24em] text-terra font-bold mt-0.5">
            bij neuropathie
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              className="px-3 py-2 text-[14px] font-semibold text-ink-soft hover:text-terra transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={() => onOpen()}
            className="hidden sm:inline-flex btn-terra !min-h-0 !py-2.5 !px-5"
          >
            Stel uw vraag
            <ArrowRight size={15} strokeWidth={2.6} />
          </button>
          <button
            type="button"
            className="lg:hidden p-2 text-ink"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-50 bg-canvas border-t border-line overflow-y-auto safe-bottom">
          <nav className="shell py-4 flex flex-col">
            {[...links, { id: 'contact', label: 'Contact' }].map((l) => (
              <a
                key={l.id}
                href={`#${l.id}`}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-[18px] font-bold text-ink border-b border-line"
              >
                {l.label}
                <ArrowRight size={17} strokeWidth={2.2} className="text-ink-mute" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpen();
              }}
              className="btn-terra w-full mt-6"
            >
              Stel uw vraag
              <ArrowRight size={16} strokeWidth={2.6} />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
