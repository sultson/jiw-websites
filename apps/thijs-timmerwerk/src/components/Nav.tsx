import { useEffect, useState } from 'react';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import LangToggle from './LangToggle';
import Magnetic from './Magnetic';
import { SITE } from '../lib/site';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onIntake: () => void;
};

const links = [
  { href: '#diensten', k: 'nav.diensten' },
  { href: '#werkwijze', k: 'nav.werkwijze' },
  { href: '#projecten', k: 'nav.projecten' },
  { href: '#reviews', k: 'nav.reviews' },
  { href: '#over', k: 'nav.over' },
];

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
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-md border-b border-line-cool'
          : 'bg-white/0 border-b border-transparent'
      }`}
    >
      <div className="shell flex items-center justify-between gap-4 h-[68px] lg:h-[76px]">
        <a href="#top" className="flex items-center shrink-0" aria-label={SITE.name}>
          <img
            src="/logo/thijs-full.png"
            alt={SITE.name}
            width={180}
            height={56}
            className="h-9 lg:h-10 w-auto"
            draggable={false}
          />
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="px-3.5 py-2 text-[14px] font-semibold text-ink-soft hover:text-cobalt transition-colors"
            >
              {t(l.k)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={SITE.phoneHref}
            className="hidden md:inline-flex items-center gap-1.5 text-[14px] font-bold text-ink hover:text-cobalt transition-colors"
            aria-label={`${t('ct.phoneLabel')} ${SITE.phoneDisplay}`}
          >
            <Phone size={15} strokeWidth={2.5} />
            <span className="tnum">{SITE.phoneDisplay}</span>
          </a>

          <LangToggle lang={lang} setLang={setLang} compact />

          <div className="hidden sm:block">
            <Magnetic strength={12}>
              <button type="button" className="btn-cobalt" onClick={onIntake}>
                {t('nav.cta')}
                <ArrowRight size={16} strokeWidth={2.6} />
              </button>
            </Magnetic>
          </div>

          <button
            type="button"
            className="lg:hidden -mr-1 p-2 text-ink"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-50 bg-white border-t border-line-cool overflow-y-auto safe-bottom">
          <nav className="shell py-4 flex flex-col">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-[17px] font-bold text-ink border-b border-line-cool"
              >
                {t(l.k)}
                <ArrowRight size={17} strokeWidth={2.4} className="text-ink-mute" />
              </a>
            ))}
            <a
              href={SITE.phoneHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 py-4 text-[17px] font-bold text-ink border-b border-line-cool"
            >
              <Phone size={18} strokeWidth={2.5} className="text-cobalt" />
              <span className="tnum">{SITE.phoneDisplay}</span>
            </a>
            <button
              type="button"
              className="btn-cobalt w-full mt-6"
              onClick={() => {
                setOpen(false);
                onIntake();
              }}
            >
              {t('nav.cta')}
              <ArrowRight size={16} strokeWidth={2.6} />
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
