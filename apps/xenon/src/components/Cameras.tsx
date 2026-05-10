import { useRef, useState } from 'react';
import { ArrowRight, Camera, ShieldCheck, Cloud, Smartphone, Headphones, Lock } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

const features: Array<{ icon: LucideIcon; titleKey: string; bodyKey: string }> = [
  { icon: Camera,       titleKey: 'cam.feature.1.title', bodyKey: 'cam.feature.1.body' },
  { icon: ShieldCheck,  titleKey: 'cam.feature.2.title', bodyKey: 'cam.feature.2.body' },
  { icon: Cloud,        titleKey: 'cam.feature.3.title', bodyKey: 'cam.feature.3.body' },
  { icon: Smartphone,   titleKey: 'cam.feature.4.title', bodyKey: 'cam.feature.4.body' },
  { icon: Headphones,   titleKey: 'cam.feature.5.title', bodyKey: 'cam.feature.5.body' },
  { icon: Lock,         titleKey: 'cam.feature.6.title', bodyKey: 'cam.feature.6.body' },
];

const specRows: Array<{ labelKey: string; valueKey: string }> = [
  { labelKey: 'cam.spec.row1.label', valueKey: 'cam.spec.row1.value' },
  { labelKey: 'cam.spec.row2.label', valueKey: 'cam.spec.row2.value' },
  { labelKey: 'cam.spec.row3.label', valueKey: 'cam.spec.row3.value' },
  { labelKey: 'cam.spec.row4.label', valueKey: 'cam.spec.row4.value' },
  { labelKey: 'cam.spec.row5.label', valueKey: 'cam.spec.row5.value' },
];

export default function Cameras({ t, onIntake }: Props) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (!stageRef.current) return;
    const r = stageRef.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top });
  };

  return (
    <section id="cameras" className="relative py-20 sm:py-28 lg:py-32 bg-night-soft border-t border-mist">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: copy + features */}
          <div className="lg:col-span-7">
            <span className="kicker !text-xenon-bright">{t('cam.kicker')}</span>
            <h2 className="mt-4 text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.08] text-silver font-display">
              {t('cam.title')}
            </h2>
            <p className="mt-5 max-w-2xl text-[15.5px] sm:text-[16.5px] text-steel/90 leading-relaxed">
              {t('cam.lede')}
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-x-8 gap-y-7">
              {features.map(({ icon: Icon, titleKey, bodyKey }) => (
                <div key={titleKey} className="flex gap-3.5">
                  <span className="shrink-0 mt-0.5 inline-flex items-center justify-center w-9 h-9 bg-xenon-bright/15 text-xenon-bright border border-xenon-bright/25 rounded-sm">
                    <Icon size={16} aria-hidden />
                  </span>
                  <div>
                    <h3 className="font-display text-silver text-[16px] tracking-wide">
                      {t(titleKey)}
                    </h3>
                    <p className="mt-1.5 text-[14px] text-steel/85 leading-relaxed">
                      {t(bodyKey)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <button type="button" onClick={onIntake} className="btn-xenon">
                {t('cam.cta')}
                <ArrowRight size={15} aria-hidden />
              </button>
            </div>
          </div>

          {/* Right: camera image with reticle hover + spec card */}
          <div className="lg:col-span-5">
            <div
              ref={stageRef}
              onMouseMove={handleMove}
              onMouseLeave={() => setPos(null)}
              className="relative aspect-square overflow-hidden bg-night-deep border border-mist hud-frame cursor-crosshair"
            >
              <span className="hud-tl" aria-hidden />
              <span className="hud-br" aria-hidden />
              <img
                src="/work/camera-closeup.webp"
                alt="Xenon camera"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 hud-scanlines pointer-events-none" aria-hidden />

              {/* HUD spec corner */}
              <div className="absolute top-3 left-3 spec-line text-xenon-bright bg-night-deep/65 backdrop-blur-sm px-2 py-1">
                CAM-01 · BULLET · 8 MP
              </div>
              <div className="absolute bottom-3 right-3 spec-line text-signal bg-night-deep/65 backdrop-blur-sm px-2 py-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-signal" aria-hidden />
                LIVE
              </div>

              {/* Reticle (lg+ only, follows cursor) */}
              {pos && (
                <span
                  className="reticle hidden lg:block"
                  style={{ left: pos.x, top: pos.y }}
                  aria-hidden
                >
                  <span className="reticle-dot" />
                </span>
              )}
            </div>

            {/* Spec callout card */}
            <div className="mt-5 panel hud-frame relative p-5">
              <span className="hud-tl" aria-hidden />
              <span className="hud-br" aria-hidden />
              <div className="flex items-center justify-between">
                <span className="font-display text-silver text-[13px] tracking-[0.18em] uppercase">
                  {t('cam.spec.heading')}
                </span>
                <span className="spec-line text-steel-mute">SPEC · 0.1</span>
              </div>
              <div className="hairline-soft mt-3" aria-hidden />
              <dl className="mt-3">
                {specRows.map(({ labelKey, valueKey }) => (
                  <div key={labelKey} className="flex items-baseline justify-between py-1.5 border-b border-mist last:border-0">
                    <dt className="spec-line text-steel-mute">{t(labelKey)}</dt>
                    <dd className="font-mono text-[13px] text-silver tracking-tight">{t(valueKey)}</dd>
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
