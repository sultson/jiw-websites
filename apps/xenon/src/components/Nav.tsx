import { useEffect, useState } from 'react';
import { Menu, Phone, X, AlertOctagon } from 'lucide-react';
import LogoMark from './LogoMark';
import LangToggle from './LangToggle';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  onIntake: () => void;
  onSpoed: () => void;
};

const sections = [
  { href: '#cameras', key: 'nav.cameras' },
  { href: '#diensten', key: 'nav.services' },
  { href: '#werkwijze', key: 'nav.method' },
  { href: '#dekking', key: 'nav.coverage' },
  { href: '#contact', key: 'nav.contact' },
] as const;

export default function Nav({ lang, setLang, t, onIntake, onSpoed }: Props) {
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
        className={`fixed top-0 inset-x-0 z-40 transition-colors duration-200 ${
          scrolled
            ? 'bg-night/85 backdrop-blur border-b border-mist'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a
            href="#top"
            aria-label="Xenon Security"
            className="flex items-center gap-2.5"
            onClick={() => handleNav('#top')}
          >
            <LogoMark variant="compact" className="h-9 w-9" />
            <span className="hidden sm:flex flex-col leading-none">
              <span className="font-display text-silver text-[15px] tracking-[0.14em] font-bold">
                XENON
              </span>
              <span className="font-display text-steel-mute text-[10px] tracking-[0.32em] uppercase mt-0.5">
                Security
              </span>
            </span>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm">
            {sections.map((s) => (
              <button
                key={s.href}
                type="button"
                onClick={() => handleNav(s.href)}
                className="text-steel/85 hover:text-silver transition-colors py-1 font-display tracking-wide"
              >
                {t(s.key)}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3 sm:gap-4">
            <LangToggle lang={lang} setLang={setLang} className="hidden sm:inline-flex" />
            <a
              href="tel:+31645172726"
              className="hidden md:inline-flex items-center gap-1.5 text-sm text-steel/85 hover:text-silver transition-colors"
            >
              <Phone size={14} aria-hidden />
              <span className="font-mono tracking-tight">{t('nav.phone')}</span>
            </a>
            <button
              type="button"
              onClick={onSpoed}
              className="hidden md:inline-flex items-center gap-1.5 text-[12px] uppercase tracking-[0.16em] font-display font-semibold text-xenon-bright hover:text-silver transition-colors"
            >
              <AlertOctagon size={14} aria-hidden />
              {t('nav.spoed')}
            </button>
            <button
              type="button"
              onClick={onIntake}
              className="hidden md:inline-flex btn-xenon py-3 text-[12px]"
            >
              {t('nav.cta')}
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden inline-flex items-center justify-center w-10 h-10 -mr-2 text-silver"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-night-deep/80 backdrop-blur-sm" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 top-0 h-full w-[88%] max-w-sm bg-night-soft border-l border-mist flex flex-col">
            <div className="h-16 sm:h-20 flex items-center justify-between px-5 border-b border-mist">
              <div className="flex items-center gap-2.5">
                <LogoMark variant="compact" className="h-8 w-8" />
                <span className="font-display text-silver text-[14px] tracking-[0.14em] font-bold">XENON</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Sluit menu"
                className="w-10 h-10 inline-flex items-center justify-center -mr-2 text-silver"
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
                  className="text-left py-3 text-lg font-display tracking-wide text-silver"
                >
                  {t(s.key)}
                </button>
              ))}
            </nav>
            <div className="px-5 py-5 border-t border-mist flex flex-col gap-3 safe-bottom">
              <button
                type="button"
                onClick={() => { setOpen(false); onIntake(); }}
                className="btn-xenon w-full"
              >
                {t('nav.cta')}
              </button>
              <a href="tel:+31645172726" className="btn-outline w-full">
                <Phone size={14} aria-hidden /> {t('nav.phone')}
              </a>
              <button
                type="button"
                onClick={() => { setOpen(false); onSpoed(); }}
                className="btn-ghost w-full justify-center text-xenon-bright hover:text-silver"
              >
                <AlertOctagon size={14} aria-hidden /> {t('nav.spoed')}
              </button>
              <div className="pt-2 flex items-center justify-between">
                <span className="spec-line">Advanced Dutch Protection</span>
                <LangToggle lang={lang} setLang={setLang} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
