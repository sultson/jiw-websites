import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';
import BrandMark from './BrandMark';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

const links = [
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#suiker',        key: 'nav.suiker' },
  { href: '#wenkbrauwen',   key: 'nav.brows' },
  { href: '#fotos',         key: 'nav.gallery' },
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
    <nav
      className={`sticky top-0 z-50 transition-colors ${
        scrolled
          ? 'bg-cream/90 backdrop-blur-md border-b border-espresso/5'
          : 'bg-cream/60 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="Smooth By Lau" className="flex items-center gap-2.5 md:gap-3 min-w-0 shrink-0">
            <BrandMark />
            <img src="/brand/wordmark.svg" alt="" width="870" height="83" className="w-28 min-[360px]:w-32 sm:w-40 xl:w-44 h-auto" />
          </a>

          <div className="hidden xl:flex items-center gap-4 xl:gap-7">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-espresso/75 hover:text-espresso">
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <button onClick={onBook} className="btn-gold hidden md:inline-flex">
              {t('nav.book')}
            </button>
            <button
              onClick={() => setOpen(v => !v)}
              className="xl:hidden p-2 -mr-2 text-espresso"
              aria-label="Menu"
              aria-expanded={open}
              aria-controls="mobile-navigation"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="xl:hidden absolute top-full left-0 w-full bg-cream border-b border-espresso/10 shadow-xl">
          <div className="px-6 py-6 space-y-1">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block py-3 text-lg font-serif text-espresso border-b border-espresso/5 last:border-0"
              >
                {t(l.key)}
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBook(); }}
              className="btn-gold w-full mt-4"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
