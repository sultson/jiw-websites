import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import type { Lang } from '../translations';
import type { Route } from '../hooks/useRoute';
import LangToggle from './LangToggle';

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: string) => string;
  route: Route;
  go: (r: Route) => void;
};

const items: { route: Route; key: string }[] = [
  { route: 'home', key: 'nav.home' },
  { route: 'about', key: 'nav.about' },
  { route: 'services', key: 'nav.services' },
  { route: 'contact', key: 'nav.contact' },
];

export default function Nav({ lang, setLang, t, route, go }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const navigate = (r: Route) => {
    setOpen(false);
    go(r);
  };

  // On home, we have an edge-to-edge dark hero — nav uses light tones until scrolled.
  // On other pages the background is bone, so the nav is always dark.
  const overImage = route === 'home' && !scrolled && !open;
  const textColor = overImage ? 'text-bone' : 'text-coffee';
  const mutedColor = overImage ? 'text-bone/85' : 'text-coffee/85';
  const hoverColor = overImage ? 'hover:text-bone' : 'hover:text-coffee';

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          scrolled || open ? 'bg-bone/85 backdrop-blur-md border-b border-coffee/20' : 'bg-transparent'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-10 h-20 lg:h-24 flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('home')}
            className={`flex items-center gap-3 group transition ${textColor}`}
            aria-label="Maefluence home"
          >
            <img
              src={overImage ? '/logo-light.png?v=20260520' : '/logo-dark.png?v=20260520'}
              alt="Maefluence"
              className="h-11 lg:h-14 w-auto"
              width={48}
              height={48}
            />
            <span className="font-display text-2xl lg:text-3xl tracking-wide">
              Maefluence
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-10">
            {items.map(item => (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                className={`text-[11px] uppercase tracking-[0.28em] font-semibold transition ${
                  route === item.route ? textColor : `${mutedColor} ${hoverColor}`
                }`}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          <div className={`hidden md:flex items-center gap-6 transition ${overImage ? 'text-bone/80' : 'text-coffee/80'}`}>
            <LangToggle lang={lang} setLang={setLang} />
          </div>

          <div className={`md:hidden flex items-center gap-2 transition ${textColor}`}>
            <LangToggle lang={lang} setLang={setLang} />
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="p-2 -mr-2"
              aria-label={open ? 'Sluit menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 top-20 z-30 md:hidden bg-bone flex flex-col">
          <nav className="flex-1 px-8 pt-12 pb-8 flex flex-col gap-8">
            {items.map(item => (
              <button
                key={item.route}
                type="button"
                onClick={() => navigate(item.route)}
                className={`text-left font-display text-4xl ${
                  route === item.route ? 'text-coffee' : 'text-coffee/80'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
            <div className="pt-8 mt-auto border-t border-coffee/20 flex items-center justify-between">
              <LangToggle lang={lang} setLang={setLang} />
              <span className="text-[11px] uppercase tracking-[0.28em] text-coffee/65">@maefluence.nl</span>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
