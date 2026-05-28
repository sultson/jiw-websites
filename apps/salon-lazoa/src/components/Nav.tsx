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
  { href: '#over',          key: 'nav.about' },
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#werk',          key: 'nav.gallery' },
  { href: '#recensies',     key: 'nav.reviews' },
  { href: '#bezoek',        key: 'nav.visit' },
];

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
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'bg-paper/95 backdrop-blur-md border-b border-ink/8'
          : 'bg-paper/70 backdrop-blur-sm'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="Salon LaZoa" className="flex items-center gap-3 min-w-0">
            <img src="/logo.png" alt="" className="h-8 md:h-9 w-auto" />
            <span className="sr-only">Salon LaZoa</span>
          </a>

          <div className="hidden lg:flex items-center gap-8">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-sm tracking-wide text-ink/70 hover:text-ink transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <button onClick={onBook} className="btn-primary hidden md:inline-flex">
              {t('nav.book')}
            </button>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 -mr-2 text-ink"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-paper border-b border-ink/10 shadow-xl">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-serif text-ink border-b border-ink/8 last:border-0"
              >
                {t(l.key)}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBook(); }}
              className="btn-primary w-full mt-4"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
