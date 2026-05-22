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
  { href: '#expertise',   key: 'nav.expertise' },
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#werk',        key: 'nav.gallery' },
  { href: '#recensies',   key: 'nav.reviews' },
  { href: '#bezoek',      key: 'nav.visit' },
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
    <>
      <nav
        className={`sticky top-0 z-50 transition-colors ${
          scrolled
            ? 'bg-ivory/92 backdrop-blur-md border-b border-ink/5'
            : 'bg-ivory/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="#top" aria-label="Clinic 22 Huidtherapie" className="flex items-center min-w-0">
              <span className="font-serif text-lg sm:text-xl md:text-[1.4rem] tracking-[0.05em] text-ink uppercase">
                Clinic 22
              </span>
              <span className="hidden sm:inline-block ml-3 pl-3 border-l border-ink/20 text-[10px] tracking-[0.28em] uppercase text-stone">
                Huidtherapie
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-7">
              {links.map(l => (
                <a key={l.href} href={l.href} className="text-sm text-ink/70 hover:text-ink transition-colors">
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
                {open ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {open && (
        <div className="fixed inset-x-0 top-16 z-40 lg:hidden bg-ivory border-b border-ink/10 shadow-xl">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-serif text-ink border-b border-ink/5 last:border-0"
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
    </>
  );
}
