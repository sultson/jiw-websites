import { AlertOctagon, Phone } from 'lucide-react';

type Props = {
  t: (key: string) => string;
  onSpoed: () => void;
};

export default function Spoedhulp({ t, onSpoed }: Props) {
  return (
    <section className="relative py-20 sm:py-28 border-t border-mist hex-pattern">
      <div className="absolute inset-0 bg-night-deep/60" aria-hidden />
      <div className="relative mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-2 text-xenon-bright">
              <AlertOctagon size={16} aria-hidden />
              <span className="kicker !text-xenon-bright !before:hidden">{t('spoed.kicker')}</span>
            </div>
            <h2 className="mt-4 text-[30px] sm:text-[40px] lg:text-[48px] leading-[1.08] text-silver font-display">
              {t('spoed.title')}
            </h2>
            <p className="mt-5 text-[15.5px] sm:text-[16.5px] text-steel/90 leading-relaxed max-w-2xl">
              {t('spoed.lede')}
            </p>
            <p className="mt-4 spec-line text-steel-mute">{t('spoed.note')}</p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3">
            <button
              type="button"
              onClick={onSpoed}
              className="btn-xenon w-full justify-between text-left text-[14px] py-5"
            >
              <span className="inline-flex items-center gap-3">
                <span className="relative inline-flex items-center justify-center w-7 h-7 rounded-full bg-xenon-bright/40">
                  <AlertOctagon size={14} className="relative z-10 text-silver" aria-hidden />
                </span>
                {t('spoed.cta.button')}
              </span>
              <span className="font-mono text-[13px] tracking-tight">→</span>
            </button>
            <a href="tel:+31645172726" className="btn-outline w-full justify-between text-[14px] py-5">
              <span className="inline-flex items-center gap-3">
                <Phone size={15} aria-hidden />
                {t('spoed.cta.call')}
              </span>
              <span className="font-mono text-[13px] tracking-tight">06 45 17 27 26</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
