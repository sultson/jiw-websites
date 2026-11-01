import { ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="absolute inset-0" aria-hidden>
        <img
          src="/img/hero-main.webp"
          alt=""
          className="w-full h-full object-cover"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/85 to-canvas/20 sm:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas/70 via-transparent to-transparent" />
      </div>

      <div className="shell-wide relative">
        <div className="max-w-xl py-20 sm:py-28 lg:py-36">
          <span className="kicker">Aanvullend op de reguliere zorg</span>
          <h1 className="mt-5 display-xl text-ink">
            Voetreflexologie bij{' '}
            <span className="serif-italic text-terra">neuropathie</span>
          </h1>
          <p className="mt-6 text-[18px] leading-relaxed text-ink-soft max-w-lg">
            Een behandeling gericht op ontspanning en het ondersteunen van uw welzijn, gegeven door
            voetreflextherapeuten die daar speciaal voor zijn opgeleid.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#clienten" className="btn-terra">
              Voor cliënten
              <ArrowRight size={17} strokeWidth={2.5} />
            </a>
            <a href="#therapeuten" className="btn-outline">
              Voor therapeuten
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
