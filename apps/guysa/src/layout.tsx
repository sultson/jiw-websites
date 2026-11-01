import {useEffect, useState} from 'react';
import {Menu, Phone, X} from 'lucide-react';
import {BEDRIJF, Huisje, Logo, MAIL, TEL, TEL_TEKST, useFormKnopInBeeld} from './ui';
import {useAnker} from './pad';
import {ZAAK} from '../site.config.mjs';

/**
 * De balk bovenaan, de voet en de vaste knoppenbalk op mobiel.
 *
 * Ze stonden in App.tsx, maar sinds de 404 een echte pagina is die ook
 * voorgerenderd wordt, moeten twee pagina's dezelfde balk tonen. Een kopie zou
 * betekenen dat een nieuw menu-item op een van de twee blijft staan.
 */

export const NAV = [
  ['Diensten', '#diensten'],
  ['Opkoop', '#opkoop'],
  ['Werkwijze', '#werkwijze'],
  ['Reviews', '#reviews'],
  ['Werkgebied', '#werkgebied'],
  ['Contact', '#contact'],
] as const;

export function Kop() {
  const [menu, setMenu] = useState(false);
  const anker = useAnker();

  /* Menu dicht zodra er ergens anders heen gescrold wordt. */
  useEffect(() => {
    if (!menu) return;
    const dicht = () => setMenu(false);
    window.addEventListener('hashchange', dicht);
    return () => window.removeEventListener('hashchange', dicht);
  }, [menu]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:h-20 sm:px-8">
        <a href={anker('#top')} className="flex items-center gap-2.5">
          <Logo className="h-10 w-auto sm:h-12" />
          <span className="hidden text-sm font-semibold leading-tight text-white sm:block">
            GuySa
            <span className="block text-[11px] font-normal tracking-wide text-gold">Inboedels &amp; Opruimingen</span>
          </span>
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map(([label, href]) => (
            <a key={href} href={anker(href)} className="text-sm font-medium text-white/70 transition hover:text-gold">
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${TEL}`}
            className="hidden items-center gap-2 rounded-full border border-gold/50 px-4 py-2 text-sm font-semibold text-gold transition hover:bg-gold hover:text-ink sm:flex"
          >
            <Phone className="h-4 w-4" /> <span className="tabular-nums">{TEL_TEKST}</span>
          </a>
          <button
            onClick={() => setMenu((m) => !m)}
            aria-label="Menu"
            aria-expanded={menu}
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/40 text-gold lg:hidden"
          >
            {menu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav className="border-t border-white/10 bg-ink px-5 pb-5 pt-2 lg:hidden">
          {NAV.map(([label, href]) => (
            <a
              key={href}
              href={anker(href)}
              onClick={() => setMenu(false)}
              className="block border-b border-white/[0.07] py-3 text-white/80 transition hover:text-gold"
            >
              {label}
            </a>
          ))}
          <a
            href={`tel:${TEL}`}
            className="mt-4 flex items-center justify-center gap-2 rounded-full bg-gold py-3 font-semibold text-ink"
          >
            <Phone className="h-4 w-4" /> <span className="tabular-nums">{TEL_TEKST}</span>
          </a>
        </nav>
      )}
    </header>
  );
}

export function Voet() {
  const anker = useAnker();

  return (
    <footer className="border-t border-white/10 bg-ink">
      <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        <div className="flex flex-wrap items-start justify-between gap-8">
          <div className="max-w-sm">
            <div className="flex items-center gap-2.5">
              <Huisje className="h-8 w-8 text-gold" />
              <span className="font-semibold text-white">{BEDRIJF}</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/50">
              Inboedels opruimen, opkopen en schoonmaken in de regio Antwerpen.
            </p>
          </div>

          <div className="grid gap-2 text-sm">
            {NAV.map(([label, href]) => (
              <a key={href} href={anker(href)} className="text-white/55 transition hover:text-gold">{label}</a>
            ))}
          </div>

          <div className="grid gap-2 text-sm">
            <a href={`tel:${TEL}`} className="tabular-nums text-white/55 transition hover:text-gold">{TEL_TEKST}</a>
            <a href={`mailto:${MAIL}`} className="text-white/55 transition hover:text-gold">{MAIL}</a>
            <a href={anker('#werkgebied')} className="text-white/55 transition hover:text-gold">Antwerpen en omstreken</a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-white/35">
          <p>{BEDRIJF}</p>
          <p className="flex gap-5">
            {/* De voorwaarden en het privacybeleid staan op hun eigen site; die
                teksten zijn van hen en horen daar thuis, niet in een kopie hier
                die bij een wijziging achterblijft. */}
            <a href={ZAAK.voorwaarden} className="transition hover:text-white/60">Algemene voorwaarden</a>
            <a href={ZAAK.privacy} className="transition hover:text-white/60">Privacybeleid</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

/**
 * De vaste balk onderaan op mobiel. Verbergt zich zodra de hoofdknop van het
 * formulier in beeld staat, zodat er nooit twee knoppen naar hetzelfde wijzen.
 */
export function MobieleBalk() {
  const formInBeeld = useFormKnopInBeeld();
  const anker = useAnker();

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 flex gap-2.5 border-t border-white/10 bg-ink/95 px-4 py-3 backdrop-blur transition-transform lg:hidden ${
        formInBeeld ? 'translate-y-full' : 'translate-y-0'
      }`}
    >
      <a
        href={anker('#offerte')}
        className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gold py-3.5 font-semibold text-ink"
      >
        Gratis offerte
      </a>
      <a
        href={`tel:${TEL}`}
        aria-label={`Bel ${TEL_TEKST}`}
        className="grid h-[3.25rem] w-[3.25rem] shrink-0 place-items-center rounded-full border border-white/20 text-white"
      >
        <Phone className="h-5 w-5" />
      </a>
    </div>
  );
}
