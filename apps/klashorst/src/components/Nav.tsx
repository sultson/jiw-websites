import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Copy, Lang } from '../translations';

const links = (t: Copy) => [
  { href: '#zaal', label: t.nav.room },
  { href: '#werk', label: t.nav.work },
  { href: '#peter', label: t.nav.peter },
  { href: '#s21', label: t.nav.s21 },
  { href: '#nieuws', label: t.nav.news },
  { href: '#bezoek', label: t.nav.visit },
];

export default function Nav({
  t,
  lang,
  setLang,
}: {
  t: Copy;
  lang: Lang;
  setLang: (lang: Lang) => void;
}) {
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
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
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          solid ? 'border-b border-hair bg-ink/85 backdrop-blur-md' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:px-10">
          <a href="#zaal" className="display whitespace-nowrap text-sm tracking-[0.2em] md:text-base">
            Klashorst<span className="text-red"> Museum</span>
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {links(t).map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="eyebrow text-bone/70 transition-colors hover:text-bone"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            {/* Hidden on phones, where it would crowd the logo. The mobile
                menu carries its own copy of this toggle. */}
            <div className="eyebrow hidden items-center gap-1.5 text-bone/60 sm:flex">
              {(['nl', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-1 transition-colors ${lang === code ? 'text-red-soft' : 'hover:text-bone'}`}
                  aria-pressed={lang === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
            {/* The newsletter is the client's headline ask, so it stays
                reachable on a phone too. */}
            <a href="#nieuwsbrief" className="btn !px-3 !py-2 !text-[0.68rem] sm:!px-5 sm:!py-2.5 sm:!text-[0.72rem]">
              {t.nav.cta}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="lg:hidden"
              aria-label={t.nav.menu}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Rendered as a sibling of the header so it never clips to the blurred bar. */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink lg:hidden">
          <div className="flex h-16 items-center justify-between px-5">
            <span className="display text-sm tracking-[0.2em]">
              Klashorst<span className="text-red"> Museum</span>
            </span>
            <button type="button" onClick={() => setOpen(false)} aria-label={t.nav.close}>
              <X size={24} />
            </button>
          </div>
          <nav className="flex flex-1 flex-col justify-center gap-6 px-8">
            {links(t).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="display text-3xl text-bone"
              >
                {link.label}
              </a>
            ))}
            <a href="#nieuwsbrief" onClick={() => setOpen(false)} className="btn btn-solid mt-4 self-start">
              {t.nav.cta}
            </a>

            {/* The header toggle is covered while this overlay is open. */}
            <div className="eyebrow mt-8 flex items-center gap-3 text-bone/60">
              {(['nl', 'en'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLang(code)}
                  className={`px-1 transition-colors ${lang === code ? 'text-red-soft' : 'hover:text-bone'}`}
                  aria-pressed={lang === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
