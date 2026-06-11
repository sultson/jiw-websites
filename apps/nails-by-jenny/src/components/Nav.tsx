import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import type { Lang } from '../translations';
import { TEL_URL } from '../data/contact';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const links = [
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#biab',          key: 'nav.biab' },
  { href: '#nailart',       key: 'nav.nailart' },
  { href: '#fotos',         key: 'nav.gallery' },
  { href: '#recensies',     key: 'nav.reviews' },
  { href: '#bezoek',        key: 'nav.visit' },
];

export default function Nav({ lang, setLang, t }: Props) {
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
          <a href="#top" aria-label="Nails by Jenny" className="flex items-center gap-2.5 min-w-0">
            <img src="/logo.webp" alt="" className="h-8 w-8 md:h-9 md:w-9 rounded-lg" />
            <span className="font-serif text-xl md:text-2xl tracking-wide text-espresso">
              Nails by <span className="text-gold">Jenny</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {links.map(l => (
              <a key={l.href} href={l.href} className="text-sm text-espresso/75 hover:text-espresso">
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <a href={TEL_URL} className="btn-gold hidden md:inline-flex">
              <Phone size={16} />
              {t('nav.call')}
            </a>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 -mr-2 text-espresso"
              aria-label="Menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-cream border-b border-espresso/10 shadow-xl">
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
            <a href={TEL_URL} onClick={() => setOpen(false)} className="btn-gold w-full mt-4">
              <Phone size={16} />
              {t('nav.call')}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
