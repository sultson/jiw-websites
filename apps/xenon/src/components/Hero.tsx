import { ArrowRight, AlertOctagon, Phone } from 'lucide-react';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
  onSpoed: () => void;
};

export default function Hero({ t, onIntake, onSpoed }: Props) {
  return (
    <section id="top" className="relative pt-24 sm:pt-28 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
      {/* Background image — mobile only. Desktop uses the HUD station frame on the right (single villa instance per viewport). */}
      <div className="absolute inset-0 lg:hidden">
        <div className="absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
          <img
            src="/work/hero-villa-night.webp"
            alt=""
            aria-hidden
            className="absolute inset-x-0 bottom-0 w-full h-full object-cover object-[68%_45%]"
          />
          {/* Top-fade so the mobile image blends into the dark copy area above. */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, rgba(6,8,15,0.98) 0%, rgba(6,8,15,0.55) 18%, rgba(6,8,15,0.05) 40%, rgba(6,8,15,0.10) 80%, rgba(11,16,27,0.85) 100%)',
            }}
          />
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start lg:items-center min-h-[92vh] sm:min-h-[88vh] lg:min-h-[78vh]">
          {/* Left: copy */}
          <div className="lg:col-span-7 xl:col-span-7 max-w-2xl">
            <h1 className="rise-in mt-2 text-[34px] sm:text-[44px] lg:text-[58px] xl:text-[68px] leading-[1.05] text-silver font-display font-bold">
              {t('hero.title')}
            </h1>

            <p className="rise-in-delay-2 mt-5 sm:mt-6 text-[15.5px] sm:text-[17px] text-steel/90 max-w-xl leading-relaxed">
              {t('hero.lede')}
            </p>

            <div className="rise-in-delay-3 mt-7 sm:mt-9 flex flex-wrap items-center gap-3">
              <button type="button" onClick={onIntake} className="btn-xenon">
                {t('hero.cta.intake')}
                <ArrowRight size={15} aria-hidden />
              </button>
              <button
                type="button"
                onClick={onSpoed}
                className="btn-outline border-xenon-bright/45 text-xenon-bright hover:bg-xenon-bright hover:border-xenon-bright hover:text-silver"
              >
                <AlertOctagon size={15} aria-hidden />
                {t('hero.cta.spoed')}
              </button>
            </div>

            {/* Phone line, sober. */}
            <a
              href="tel:+31645172726"
              className="rise-in-delay-4 mt-6 inline-flex items-center gap-2 text-steel/85 hover:text-silver transition-colors"
            >
              <Phone size={14} aria-hidden />
              <span className="font-mono text-[14px] tracking-tight">06 45 17 27 26</span>
              <span className="spec-line">· {t('trust.hours')}</span>
            </a>
          </div>

          {/* Right: HUD station tile — single composed frame, not a fake mosaic. */}
          <div className="lg:col-span-5 xl:col-span-5 hidden lg:block">
            <div className="rise-in-delay-2 ml-auto max-w-sm">
              {/* Header bar */}
              <div className="flex items-center justify-between text-xenon-bright">
                <span className="spec-line text-xenon-bright">{t('hero.feed.label')}</span>
                <span className="inline-flex items-center gap-1.5 spec-line text-signal">
                  <span className="relative inline-flex w-1.5 h-1.5">
                    <span className="absolute inset-0 rounded-full bg-signal" aria-hidden />
                    <span className="absolute inset-0 rounded-full bg-signal animate-ping opacity-60" aria-hidden />
                  </span>
                  {t('hero.feed.status')}
                </span>
              </div>

              {/* Single framed image, generous size. */}
              <div className="mt-3 relative aspect-[4/5] overflow-hidden bg-night-deep border border-xenon-bright/30 hud-frame">
                <span className="hud-tl" aria-hidden />
                <span className="hud-br" aria-hidden />
                <img
                  src="/work/hero-villa-night.webp"
                  alt=""
                  aria-hidden
                  className="absolute inset-0 w-full h-full object-cover object-[60%_center] opacity-90"
                />
                {/* HUD scanlines, light */}
                <div className="absolute inset-0 hud-scanlines pointer-events-none" aria-hidden />
                {/* Reticle box — fixed, decorative target on the upper-floor window */}
                <div className="absolute" style={{ left: '38%', top: '38%', width: '22%', height: '18%' }} aria-hidden>
                  <div className="absolute inset-0 border border-xenon-bright/80" />
                  <div className="absolute -top-1 -left-1 w-2 h-2 border-t border-l border-xenon-bright" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-xenon-bright" />
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-xenon-bright" />
                  <div className="absolute -bottom-1 -right-1 w-2 h-2 border-b border-r border-xenon-bright" />
                </div>
                {/* Bottom telemetry bar */}
                <div className="absolute inset-x-0 bottom-0 px-3 py-2.5 bg-night-deep/80 backdrop-blur-sm flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-silver">
                    CAM-01 · ENTREE
                  </span>
                  <span className="font-mono text-[10px] text-steel-mute tabular-nums">
                    21:48 CET
                  </span>
                </div>
                {/* Top-left frame counter */}
                <div className="absolute top-3 left-3 spec-line text-xenon-bright">
                  REC · 4K · 30 FPS
                </div>
              </div>

              {/* Bottom telemetry rail */}
              <dl className="mt-3 grid grid-cols-3 gap-x-3 border-t border-mist pt-3">
                {[
                  { l: 'UPTIME',  v: '99.98%' },
                  { l: 'LATENCY', v: '42 MS' },
                  { l: 'NODES',   v: '03 / 03' },
                ].map((row) => (
                  <div key={row.l} className="flex flex-col gap-0.5">
                    <dt className="spec-line">{row.l}</dt>
                    <dd className="font-mono text-[12px] text-silver tabular-nums">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
