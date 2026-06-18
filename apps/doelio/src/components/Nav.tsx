import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Lang, SiteContent } from '../i18n';
import { CAL_TRIGGER_PROPS } from '../data/site';
import Logo from './Logo';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  c: SiteContent;
};

export default function Nav({ lang, setLang, c }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`mx-auto flex max-w-[1180px] items-center justify-between gap-3 px-3 transition-all duration-500 ${
          scrolled ? 'pt-2.5' : 'pt-4 sm:pt-5'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* The bar itself is one glass pill */}
        <nav className="glass-bar flex flex-1 items-center justify-between gap-2 py-2 pl-4 pr-2">
          <a href="#top" aria-label="Doelio" className="flex items-center">
            <Logo />
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {c.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-full px-3.5 py-2 text-[0.92rem] text-ink-dim transition-colors hover:bg-white/8 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <LangToggle lang={lang} setLang={setLang} />
            <button
              type="button"
              {...CAL_TRIGGER_PROPS}
              className="btn btn-primary hidden !min-h-[42px] !px-5 text-[0.88rem] sm:inline-flex"
            >
              {c.nav.cta}
            </button>
            <button
              onClick={() => setOpen((v) => !v)}
              className="grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-white/10 md:hidden"
              aria-label={open ? 'Sluit menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile sheet — sibling of the blurred bar, never a descendant (avoids the
          backdrop-filter clipping trap on iOS) */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden" role="dialog" aria-modal="true">
          <button
            className="absolute inset-0 bg-base/60"
            style={{ backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
            aria-label="Sluit menu"
            onClick={() => setOpen(false)}
          />
          <div className="glass absolute inset-x-3 top-20 origin-top p-3">
            <div className="glass-scrim" />
            {c.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-2xl px-4 py-3.5 text-lg text-ink transition-colors hover:bg-white/8"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              {...CAL_TRIGGER_PROPS}
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-2 w-full"
            >
              {c.nav.cta}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
