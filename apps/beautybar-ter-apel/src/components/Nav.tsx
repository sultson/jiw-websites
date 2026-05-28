import { useState, useEffect } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import type { Lang } from '../translations';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
};

const links = [
  { href: '#over', key: 'nav.about' },
  { href: '#werk', key: 'nav.gallery' },
  { href: '#behandelingen', key: 'nav.services' },
  { href: '#recensies', key: 'nav.reviews' },
  { href: '#bezoek', key: 'nav.visit' },
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
    <>
      <div className="sticky top-0 z-[60] bg-ink text-cream text-center py-2 px-4">
        <p className="text-[11px] tracking-wider">{t('topbar.line')}</p>
      </div>
      <nav
        className={`sticky top-[32px] z-50 transition-colors ${
          scrolled
            ? 'bg-cream/90 backdrop-blur-md border-b border-ink/5'
            : 'bg-cream/60 backdrop-blur-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            <a href="#top" aria-label="Beautybar Ter Apel" className="flex items-baseline gap-2 min-w-0">
              <span className="font-serif text-lg md:text-xl tracking-tight truncate">
                Beautybar <span className="text-rose italic">Ter Apel</span>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-7">
              {links.map((l) => (
                <a key={l.href} href={l.href} className="text-sm text-ink/75 hover:text-rose">
                  {t(l.key)}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <LangToggle lang={lang} setLang={setLang} compact />
              <a
                href="tel:+31623800854"
                className="btn-primary hidden sm:inline-flex"
                aria-label={t('nav.call')}
              >
                <Phone size={16} />
                <span className="hidden md:inline">06 23800854</span>
                <span className="md:hidden">{t('nav.callShort')}</span>
              </a>
              <button
                onClick={() => setOpen((v) => !v)}
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
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-lg font-serif text-ink border-b border-ink/5 last:border-0"
                >
                  {t(l.key)}
                </a>
              ))}
              <a
                href="tel:+31623800854"
                onClick={() => setOpen(false)}
                className="btn-primary w-full mt-4"
              >
                <Phone size={16} /> 06 23800854
              </a>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
