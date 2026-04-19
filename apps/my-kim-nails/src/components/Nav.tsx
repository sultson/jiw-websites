import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onBook: () => void;
};

const links = [
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#biab', key: 'nav.biab' },
  { href: '#fotos', key: 'nav.gallery' },
  { href: '#bezoek', key: 'nav.visit' },
  { href: '#faq', key: 'nav.faq' },
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
      <div className="sticky top-0 z-[60] bg-espresso text-cream text-center py-2 px-4">
        <p className="text-[11px] tracking-wider">{t('topbar.new')}</p>
      </div>
      <nav
        className={`sticky top-[32px] z-50 ${
          scrolled ? 'bg-cream/90 backdrop-blur-md border-b border-espresso/5' : 'bg-cream/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="#top" className="flex items-center min-w-0" aria-label="Mykimnails">
              <span className="font-serif text-xl md:text-2xl tracking-wide truncate">
                mykim<span className="text-gold">nails</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-7">
              {links.map(l => (
                <a key={l.href} href={l.href} className="text-sm text-espresso/80 hover:text-espresso">
                  {t(l.key)}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <LangToggle lang={lang} setLang={setLang} compact />
              <a
                href="tel:+31634899263"
                className="hidden sm:inline-flex btn-ghost"
                aria-label={t('nav.call')}
              >
                <Phone size={16} />
                <span className="hidden md:inline">06 34899263</span>
              </a>
              <button onClick={onBook} className="btn-primary hidden md:inline-flex">
                {t('nav.book')}
              </button>
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
              <button
                onClick={() => {
                  setOpen(false);
                  onBook();
                }}
                className="btn-primary w-full mt-4"
              >
                {t('nav.book')}
              </button>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
