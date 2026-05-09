import { ArrowUpRight, Check } from 'lucide-react';
import { services, type Service } from '../data/services';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

export default function Services({ t, onIntake }: Props) {
  return (
    <section id="diensten" className="bg-paper-deep border-y border-ink/8 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <header className="grid lg:grid-cols-12 gap-x-12 gap-y-6 mb-12 lg:mb-16">
          <div className="lg:col-span-5">
            <span className="kicker">{t('services.kicker')}</span>
            <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display leading-[1.08]">
              {t('services.title')}
            </h2>
          </div>
          <p className="lg:col-span-6 lg:col-start-7 text-base sm:text-lg text-ink-soft leading-relaxed self-end max-w-[60ch]">
            {t('services.lede')}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
          {services.map((svc, i) => (
            <ServiceCard key={svc.key} svc={svc} t={t} onIntake={onIntake} index={i} />
          ))}
          <div className="hidden lg:flex flex-col justify-between bg-paper-soft p-7 lg:p-8 lg:col-span-1">
            <div>
              <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-orange-deep">№ III</span>
              <p className="mt-4 font-display text-xl leading-snug text-ink">
                Drie generaties.<br/>Eén familie.<br/>Elk vak in huis.
              </p>
            </div>
            <button type="button" onClick={onIntake} className="btn-primary self-start mt-6">
              {t('services.cta')}
              <ArrowUpRight size={16} aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({
  svc,
  t,
  onIntake,
  index,
}: {
  svc: Service;
  t: (key: string) => string;
  onIntake: () => void;
  index: number;
}) {
  const Icon = svc.icon;
  return (
    <article className="bg-paper-soft p-7 lg:p-8 flex flex-col group">
      <div className="flex items-start justify-between mb-5">
        <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-ink-mute">
          № {svc.number}
        </span>
        <Icon size={22} className="text-ink-mute group-hover:text-orange-deep transition-colors" aria-hidden />
      </div>
      <h3 className="font-display text-2xl lg:text-[1.65rem] leading-tight mb-1.5 text-ink">
        {t(`svc.${svc.key}.title`)}
      </h3>
      <p className="text-sm text-ink-mute mb-4">{t(`svc.${svc.key}.sub`)}</p>
      <p className="text-base text-ink-soft leading-relaxed mb-6 max-w-[40ch]">
        {t(`svc.${svc.key}.body`)}
      </p>
      <ul className="space-y-2 mb-7 mt-auto">
        {[1, 2, 3].map((n) => (
          <li key={n} className="flex items-start gap-2.5 text-sm text-ink-soft">
            <Check size={14} className="mt-1 flex-shrink-0 text-orange-deep" aria-hidden strokeWidth={2.5} />
            <span>{t(`svc.${svc.key}.b${n}`)}</span>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={onIntake}
        className="btn-ghost self-start group/btn"
      >
        <span>{t(`svc.${svc.key}.cta`)}</span>
        <ArrowUpRight
          size={14}
          className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
          aria-hidden
        />
      </button>
      {/* Subtle order tick to vary cards visually */}
      <span className="sr-only">Card position {index + 1}</span>
    </article>
  );
}
