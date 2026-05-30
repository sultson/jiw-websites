import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

const links = [
  { href: '#services', key: 'nav.services' },
  { href: '#studio',   key: 'nav.about' },
  { href: '#work',     key: 'nav.gallery' },
  { href: '#reviews',  key: 'nav.reviews' },
  { href: '#visit',    key: 'nav.visit' },
];

function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`leading-none ${className}`}>
      <span className="block font-display text-2xl md:text-[1.7rem] tracking-[0.12em] text-ink">MBV</span>
      <span className="block text-[8px] md:text-[9px] tracking-[0.42em] uppercase text-ink-mute mt-0.5">
        Nail Art Studio
      </span>
    </span>
  );
}

export default function Nav({ lang, setLang, t, onBook }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-ink/8'
          : 'bg-cream/50 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="MBV Studio" className="flex items-center min-w-0">
            <Wordmark />
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13px] tracking-wide text-ink/70 hover:text-ink transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <button onClick={onBook} className="btn-rose hidden md:inline-flex">
              {t('nav.book')}
            </button>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 -mr-2 text-ink"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream border-b border-ink/10 shadow-xl">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-display tracking-wide text-ink border-b border-ink/5 last:border-0"
              >
                {t(l.key)}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBook(); }}
              className="btn-rose w-full mt-4"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
