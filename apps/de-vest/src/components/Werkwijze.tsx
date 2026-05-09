import { CalendarCheck } from 'lucide-react';

type Props = { t: (key: string) => string };

const STEPS = [1, 2, 3, 4, 5, 6] as const;

export default function Werkwijze({ t }: Props) {
  return (
    <section id="werkwijze" className="py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <header className="grid lg:grid-cols-12 gap-x-12 gap-y-6 mb-14 lg:mb-20">
          <div className="lg:col-span-5">
            <span className="kicker">{t('method.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08]">
              {t('method.title')}
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-base sm:text-lg text-ink-soft leading-relaxed self-end max-w-[58ch]">
            {t('method.lede')}
          </p>
        </header>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-12 lg:gap-y-16">
          {STEPS.map((n) => (
            <li key={n} className="relative">
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="font-display font-bold text-[3.5rem] lg:text-[4.5rem] leading-none text-orange-deep"
                  style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0' }}
                >
                  {String(n).padStart(2, '0')}
                </span>
                {n === 6 && (
                  <CalendarCheck size={20} className="text-orange-deep mb-1" aria-hidden />
                )}
              </div>
              <h3 className="text-xl font-display tracking-tight mb-2.5">
                {t(`method.s${n}.title`)}
              </h3>
              <p className="text-base text-ink-soft leading-relaxed max-w-[44ch]">
                {t(`method.s${n}.body`)}
              </p>
              <span className="absolute -top-1 right-0 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-mute hidden sm:inline">
                Stap {n}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
