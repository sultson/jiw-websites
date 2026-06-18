import { CalendarCheck } from 'lucide-react';
import type { SiteContent } from '../i18n';
import { CAL_TRIGGER_PROPS } from '../data/site';

type Props = { c: SiteContent };

export default function CtaBand({ c }: Props) {
  return (
    <section className="relative px-4 py-12 sm:py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="glass reveal relative overflow-hidden px-7 py-14 text-center sm:px-10 sm:py-20">
          <div className="glass-scrim" />
          {/* Prismatic thermal bloom — screen-blended glow art lighting the panel
              from within. */}
          <img
            src="/art/cta-bloom.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-1/2 w-[120%] max-w-none -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
            style={{
              zIndex: 0,
              opacity: 0.55,
              maskImage: 'radial-gradient(60% 60% at 50% 50%, #000 35%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(60% 60% at 50% 50%, #000 35%, transparent 80%)',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(60% 120% at 50% 0%, color-mix(in oklab, white 7%, transparent), transparent 70%)',
            }}
            aria-hidden="true"
          />
          <h2 className="relative mx-auto max-w-[20ch] text-[clamp(2rem,4.4vw,3.3rem)]">{c.cta.title}</h2>
          <p className="relative mx-auto mt-5 max-w-[42ch] text-[1.1rem] leading-relaxed text-ink-dim">{c.cta.body}</p>
          <div className="relative mt-9 flex justify-center">
            <button type="button" {...CAL_TRIGGER_PROPS} className="btn btn-primary !min-h-[54px] !px-8 text-[1rem]">
              <CalendarCheck size={20} />
              {c.cta.button}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
