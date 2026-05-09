import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import LogoMark from './LogoMark';
import LangToggle from './LangToggle';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  onIntake: () => void;
};

const sections = [
  { href: '#werk', key: 'nav.work' },
  { href: '#diensten', key: 'nav.services' },
  { href: '#werkwijze', key: 'nav.method' },
  { href: '#historie', key: 'nav.history' },
  { href: '#contact', key: 'nav.contact' },
] as const;

export default function Nav({ lang, setLang, t, onIntake }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const handleNav = (href: string) => {
    setOpen(false);
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-200 ${
          scrolled ? 'bg-paper/92 backdrop-blur border-b border-ink/8' : 'bg-paper'
        }`}
      >
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#top" aria-label="De Vest Schilderwerken" className="flex items-center" onClick={() => handleNav('#top')}>
            <LogoMark animate={false} className="h-9 sm:h-10 w-auto" />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            {sections.map((s) => (
              <button
                key={s.href}
                type="button"
                onClick={() => handleNav(s.href)}
                className="text-ink/70 hover:text-ink transition-colors py-1"
              >
                {t(s.key)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <LangToggle lang={lang} setLang={setLang} className="hidden sm:inline-flex" />
            <a
              href="tel:+31653860031"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-ink/80 hover:text-ink transition-colors"
            >
              <Phone size={14} aria-hidden />
              <span className="font-mono tracking-tight">06 53 86 00 31</span>
            </a>
            <button type="button" onClick={onIntake} className="hidden md:inline-flex btn-orange py-3">
              {t('nav.cta')}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-ink"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/40" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-paper border-l border-ink/10 flex flex-col">
            <div className="h-16 sm:h-20 flex items-center justify-between px-5 border-b border-ink/8">
              <LogoMark animate={false} className="h-8 w-auto" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
                className="w-10 h-10 inline-flex items-center justify-center -mr-2"
              >
                <X size={22} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
              {sections.map((s) => (
                <button
                  key={s.href}
                  type="button"
                  onClick={() => handleNav(s.href)}
                  className="text-left py-3 text-lg font-display tracking-tight text-ink"
                >
                  {t(s.key)}
                </button>
              ))}
            </nav>
            <div className="px-5 py-5 border-t border-ink/8 flex flex-col gap-3 safe-bottom">
              <button type="button" onClick={() => { setOpen(false); onIntake(); }} className="btn-orange w-full">
                {t('nav.cta')}
              </button>
              <a href="tel:+31653860031" className="btn-outline w-full">
                <Phone size={14} aria-hidden /> 06 53 86 00 31
              </a>
              <div className="pt-2 flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-ink/50">
                <span className="font-mono">№ III · sinds 1930</span>
                <LangToggle lang={lang} setLang={setLang} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
