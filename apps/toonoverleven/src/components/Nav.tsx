import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { usePad } from '../router';
import { MAIL, TEL, TEL_LINK } from '../ui';

/**
 * De balk bovenaan: het logo links, de pagina's ernaast en één knop rechts die
 * overal hetzelfde belooft. Contact opnemen is de enige handeling die op elke
 * pagina evenveel waard is, dus dat is de enige knop; de rest zijn gewone
 * links.
 */
export const MENU = [
  { pad: '/wie-we-zijn', label: 'Wie we zijn' },
  { pad: '/agenda', label: 'Agenda' },
  { pad: '/nieuws', label: 'Nieuws & Blog' },
  { pad: '/vrijwilliger', label: 'Vrijwilliger worden' },
  { pad: '/steun', label: 'Steun ons' },
];

export const CONTACT = { pad: '/contact', label: 'Kom langs' };

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
          gescrold ? 'bg-room/95 shadow-[0_1px_0_rgba(67,54,59,0.08)] backdrop-blur' : 'bg-room'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3.5 md:px-8">
          <a href="/" className="flex-none" aria-label="Naar de voorpagina">
            <img src="/img/logo.png" alt="Toon over Leven" className="h-11 w-auto md:h-12" />
          </a>

          <nav className="hidden items-center gap-7 lg:flex">
            {MENU.map((m) => {
              const hier = pad === m.pad || (m.pad !== '/' && pad.startsWith(`${m.pad}/`));
              return (
                <a
                  key={m.pad}
                  href={m.pad}
                  aria-current={hier ? 'page' : undefined}
                  className={`text-[15px] transition ${
                    hier ? 'font-semibold text-wijn' : 'font-medium text-inkt/75 hover:text-wijn'
                  }`}
                >
                  {m.label}
                </a>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={CONTACT.pad}
              className="hidden rounded-full bg-wijn px-6 py-2.5 text-[15px] font-semibold text-white transition hover:bg-wijn-diep sm:inline-flex"
            >
              Neem contact op
            </a>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              className="grid h-11 w-11 place-items-center rounded-full text-wijn transition hover:bg-blos lg:hidden"
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
          <div className="flex items-center justify-between px-5 py-3.5">
            <img src="/img/logo.png" alt="Toon over Leven" className="h-11 w-auto" />
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Menu sluiten"
              className="grid h-11 w-11 place-items-center rounded-full text-wijn transition hover:bg-blos"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 pb-8">
            {[...MENU, CONTACT].map((m) => (
              <a
                key={m.pad}
                href={m.pad}
                className="block border-b border-lijn py-4 font-display text-xl text-wijn"
              >
                {m.label}
              </a>
            ))}
            <div className="mt-8 flex flex-col gap-3">
              <a
                href={TEL_LINK}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-wijn px-5 py-3.5 font-semibold text-white"
              >
                <Phone className="h-4 w-4" /> {TEL}
              </a>
              <a
                href={`mailto:${MAIL}`}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-wijn/30 px-5 py-3.5 font-semibold text-wijn"
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
