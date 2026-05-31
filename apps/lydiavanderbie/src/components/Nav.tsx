import { useEffect, useState } from 'react';
import { Menu, X, ArrowRight } from 'lucide-react';
import LangToggle from './LangToggle';
import { SITE } from '../lib/site';
import type { Lang } from '../translations';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  onHome: boolean;
  onOpen: (subject?: string) => void;
};

const links = [
  { id: 'opleidingen', k: 'nav.opleidingen' },
  { id: 'trainingen', k: 'nav.trainingen' },
  { id: 'behandelingen', k: 'nav.behandelingen' },
  { id: 'agenda', k: 'nav.agenda' },
  { id: 'over', k: 'nav.over' },
];

export default function Nav({ lang, setLang, t, onHome, onOpen }: Props) {
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

  const href = (id: string) => `${onHome ? '' : '/'}#${id}`;

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-canvas/85 backdrop-blur-md border-b border-line' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="shell-wide flex items-center justify-between gap-4 h-[68px] lg:h-[80px]">
        <a href={onHome ? '#top' : '/'} className="flex flex-col leading-none shrink-0" aria-label={SITE.name}>
          <span className="font-display text-[20px] lg:text-[23px] text-ink" style={{ letterSpacing: '-0.01em' }}>
            Lydia van der Bie
          </span>
          <span className="text-[10px] lg:text-[11px] uppercase tracking-[0.24em] text-terra font-bold mt-0.5">
            Opleidingen & behandelingen
          </span>
        </a>

        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.id}
              href={href(l.id)}
              className="px-3.5 py-2 text-[14.5px] font-semibold text-ink-soft hover:text-terra transition-colors"
            >
              {t(l.k)}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <LangToggle lang={lang} setLang={setLang} compact />
          <button type="button" onClick={() => onOpen()} className="hidden sm:inline-flex btn-terra !min-h-0 !py-2.5 !px-5">
            {t('nav.cta')}
            <ArrowRight size={15} strokeWidth={2.6} />
          </button>
          <button
            type="button"
            className="lg:hidden p-2 text-ink"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-x-0 top-[68px] bottom-0 z-50 bg-canvas border-t border-line overflow-y-auto safe-bottom">
          <nav className="shell py-4 flex flex-col">
            {[...links, { id: 'contact', k: 'nav.contact' }].map((l) => (
              <a
                key={l.id}
                href={href(l.id)}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-4 text-[18px] font-bold text-ink border-b border-line"
              >
                {t(l.k)}
                <ArrowRight size={17} strokeWidth={2.2} className="text-ink-mute" />
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                onOpen();
              }}
              className="btn-terra w-full mt-6"
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
