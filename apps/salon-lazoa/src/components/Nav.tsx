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
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 bg-shoji transition-shadow ${
        scrolled ? 'shadow-[0_1px_0_0_oklch(0.205_0.012_62_/_0.14)]' : ''
      }`}
    >
      <nav className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          <a href="#top" aria-label="Salon LaZoa" className="flex items-center gap-3 min-w-0">
            <img src="/logo.png" alt="" className="h-7 md:h-8 w-auto" />
            <span className="sr-only">Salon LaZoa</span>
          </a>

          <div className="hidden lg:flex items-center gap-9">
            {links.map(l => (
              <a
                key={l.href}
                href={l.href}
                className="text-[12px] uppercase tracking-[0.18em] text-sumi/65 hover:text-sumi transition-colors"
              >
                {t(l.key)}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <LangToggle lang={lang} setLang={setLang} compact />
            <button onClick={onBook} className="btn-sumi hidden md:inline-flex !py-2.5 !text-[11px]">
              {t('nav.bookShort')}
            </button>
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 -mr-2 text-sumi"
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile slide-out */}
      {open && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-shoji border-t border-sumi/10 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.25)]">
          <div className="px-6 py-6">
            {links.map((l, i) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-baseline gap-4 py-3.5 border-b border-sumi/8 group"
              >
                <span className="font-display tracking-[0.05em] text-sumi/40 text-[12px] w-6">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="font-display text-xl text-sumi group-hover:text-hinoki transition-colors">
                  {t(l.key)}
                </span>
              </a>
            ))}
            <button
              onClick={() => { setOpen(false); onBook(); }}
              className="btn-sumi w-full mt-6"
            >
              {t('nav.book')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
