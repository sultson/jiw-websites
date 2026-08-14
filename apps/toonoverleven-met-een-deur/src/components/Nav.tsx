import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { usePad } from '../router';
import { MAIL, TEL, TEL_LINK } from '../ui';

export const MENU = [
  { pad: '/wie-we-zijn', label: 'Wie we zijn' },
  { pad: '/agenda', label: 'Agenda' },
  { pad: '/nieuws', label: 'Nieuws & Blog' },
  { pad: '/vrijwilliger', label: 'Vrijwilliger worden' },
  { pad: '/steun', label: 'Steun ons' },
  { pad: '/contact', label: 'Kom langs' },
];

export default function Nav() {
  const pad = usePad();
  const [open, setOpen] = useState(false);
  const [gescrold, setGescrold] = useState(false);

  useEffect(() => {
    const kijk = () => setGescrold(window.scrollY > 16);
    kijk();
    window.addEventListener('scroll', kijk, { passive: true });
    return () => window.removeEventListener('scroll', kijk);
  }, []);

  // Van pagina wisselen sluit het menu; anders blijft het over de nieuwe pagina
  // heen liggen.
  useEffect(() => setOpen(false), [pad]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition ${
          gescrold ? 'bg-room/95 shadow-sm backdrop-blur' : 'bg-room'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3 md:px-8">
          <a href="/" className="flex-none" aria-label="Naar de voorpagina">
            <img src="/img/logo.png" alt="Toon over Leven" className="h-11 w-auto md:h-13" />
          </a>

          <nav className="hidden items-center gap-0.5 lg:flex">
            {MENU.map((m) => {
              const hier = pad === m.pad || (m.pad !== '/' && pad.startsWith(`${m.pad}/`));
              return (
                <a
                  key={m.pad}
                  href={m.pad}
                  aria-current={hier ? 'page' : undefined}
                  className={`rounded-full px-3.5 py-2 text-[15px] transition ${
                    hier
                      ? 'font-semibold text-groen'
                      : 'font-medium text-groen/70 hover:bg-room-diep hover:text-groen'
                  }`}
                >
                  {m.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Bellen is voor dit publiek de laagste drempel, en het nummer
                staat er voluit: een telefoonicoontje alleen zegt niet wie er
                opneemt. */}
            <a
              href={TEL_LINK}
              className="hidden items-center gap-2 rounded-full bg-teal px-5 py-2.5 font-semibold text-white transition hover:bg-groen sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              {TEL}
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              className="grid h-11 w-11 place-items-center rounded-full text-groen transition hover:bg-room-diep lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Als broer van de balk en niet erin: een vast menu binnen een element
          met backdrop-blur wordt door die laag afgeknipt en komt dan niet over
          de pagina heen. */}
      {open && (
        <div className="fixed inset-0 z-50 flex flex-col bg-room lg:hidden">
          <div className="flex items-center justify-between px-5 py-3">
            <img src="/img/logo.png" alt="Toon over Leven" className="h-11 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menu sluiten"
              className="grid h-11 w-11 place-items-center rounded-full text-groen transition hover:bg-room-diep"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-8">
            {MENU.map((m) => (
              <a
                key={m.pad}
                href={m.pad}
                className="block border-b border-lijn py-4 font-display text-xl text-groen"
              >
                {m.label}
              </a>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={TEL_LINK}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3.5 font-semibold text-white"
              >
                <Phone className="h-4 w-4" /> {TEL}
              </a>
              <a
                href={`mailto:${MAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-groen/25 px-5 py-3.5 font-semibold text-groen"
              >
                {MAIL}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
