import { Suspense, lazy, useEffect, useState } from 'react';
import { ArrowDown, Phone } from 'lucide-react';
import { PHONE_DISPLAY, PHONE_HREF, SERVICES, type ServiceKey } from '../data';

const Diorama = lazy(() => import('./Diorama'));

interface HeroProps {
  active: ServiceKey | null;
  onSelect: (key: ServiceKey | null) => void;
}

export default function Hero({ active, onSelect }: HeroProps) {
  // The 3D scene is a client-only enhancement; SSR ships the full text content.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <section id="top" className="blueprint relative overflow-hidden bg-ink text-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pt-28 sm:px-6 lg:min-h-svh lg:flex-row lg:items-center lg:gap-8 lg:px-8 lg:pt-16">
        <div className="relative z-10 max-w-2xl shrink-0 lg:w-[44%]">
          <p className="eyebrow text-xs text-oranje">Bouw en installatietechniek, Amsterdam en Lelystad</p>
          <h1 className="display mt-5 text-[clamp(2rem,11vw,2.9rem)] sm:text-6xl xl:text-7xl">
            Elk gebouw verdient topconditie
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">
            BEHR verzorgt onderhoud, reparatie en afbouw voor woningcorporaties, VvE's, aannemers en
            particulieren. Zeven vakgebieden in eigen hand, van melding tot oplevering.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={PHONE_HREF}
              className="inline-flex items-center gap-2.5 rounded-full bg-oranje px-6 py-3.5 text-base font-bold text-white transition-colors hover:bg-oranje-deep"
            >
              <Phone size={18} strokeWidth={2.5} />
              {PHONE_DISPLAY}
            </a>
            <a
              href="#wat-we-doen"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:border-white/60"
            >
              Wat we doen
              <ArrowDown size={16} />
            </a>
          </div>

          <div className="mt-10 hidden lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              Verken de maquette, kies een vakgebied
            </p>
            <div className="mt-3 flex max-w-xl flex-wrap gap-2">
              {SERVICES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => onSelect(active === s.key ? null : s.key)}
                  aria-pressed={active === s.key}
                  className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                    active === s.key
                      ? 'border-oranje bg-oranje text-white'
                      : 'border-white/20 text-white/75 hover:border-white/50 hover:text-white'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Diorama */}
        <div className="relative z-0 mt-6 h-[24rem] w-full sm:h-[28rem] lg:mt-0 lg:h-[38rem] lg:flex-1">
          {mounted && (
            <Suspense fallback={null}>
              <Diorama active={active} onSelect={onSelect} />
            </Suspense>
          )}
        </div>

        <div className="relative z-10 pb-8 lg:hidden">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Verken de maquette, kies een vakgebied
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SERVICES.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => onSelect(active === s.key ? null : s.key)}
                aria-pressed={active === s.key}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ${
                  active === s.key
                    ? 'border-oranje bg-oranje text-white'
                    : 'border-white/20 text-white/75'
                }`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-8 gap-y-2 px-4 py-4 text-sm text-white/55 sm:px-6 lg:px-8">
          <span>Sinds 2019</span>
          <span>Amsterdam, Lelystad en omstreken</span>
          <span>Voor corporaties, VvE's, aannemers en particulieren</span>
        </div>
      </div>
    </section>
  );
}
