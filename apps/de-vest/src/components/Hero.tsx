import { ArrowUpRight, Phone, Award, MapPin, Calendar, Layers, Beaker } from 'lucide-react';
import PortfolioDrift from './PortfolioDrift';

type Props = {
  t: (key: string) => string;
  onIntake: () => void;
};

export default function Hero({ t, onIntake }: Props) {
  return (
    <section id="top" className="relative pt-10 sm:pt-14 lg:pt-20 pb-16 sm:pb-24 lg:pb-28">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-y-10 gap-x-8 lg:gap-x-12 items-end">
          <div className="lg:col-span-7">
            <div className="kicker rise-in">{t('hero.kicker')}</div>
            <h1 className="mt-4 text-[2.5rem] leading-[1.05] sm:text-5xl lg:text-[5rem] lg:leading-[1.02] font-display rise-in-delay-1">
              {t('hero.title')}
            </h1>
            <p className="mt-6 text-base sm:text-lg text-ink-soft max-w-[58ch] leading-relaxed rise-in-delay-2">
              {t('hero.lede')}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4 rise-in-delay-3">
              <button type="button" onClick={onIntake} className="btn-orange group">
                {t('hero.cta.intake')}
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden
                />
              </button>
              <a href="tel:+31653860031" className="btn-outline">
                <Phone size={14} aria-hidden />
                {t('hero.cta.call')}
              </a>
            </div>
          </div>

          {/* Vakkaart proof panel */}
          <aside className="lg:col-span-5 rise-in-delay-4">
            <div className="relative panel corner-marks p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-ink/12 -mx-5 sm:-mx-6 px-5 sm:px-6 pb-3 mb-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-mute">
                  {t('hero.proof.heading')}
                </span>
                <span className="gen-mark">№ III</span>
              </div>
              <ul className="space-y-3.5">
                <ProofRow
                  icon={Calendar}
                  label={t('hero.proof.row1.label')}
                  value={t('hero.proof.row1.value')}
                />
                <ProofRow
                  icon={Layers}
                  label={t('hero.proof.row2.label')}
                  value={t('hero.proof.row2.value')}
                />
                <ProofRow
                  icon={Award}
                  label={t('hero.proof.row3.label')}
                  value={t('hero.proof.row3.value')}
                />
                <ProofRow
                  icon={MapPin}
                  label={t('hero.proof.row4.label')}
                  value={t('hero.proof.row4.value')}
                />
                <ProofRow
                  icon={Beaker}
                  label={t('hero.proof.row5.label')}
                  value={t('hero.proof.row5.value')}
                />
              </ul>
            </div>
          </aside>
        </div>

        <PortfolioDrift />
      </div>
    </section>
  );
}

function ProofRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <li className="flex items-start gap-3.5">
      <Icon size={16} className="mt-0.5 text-orange-deep flex-shrink-0" aria-hidden />
      <div className="flex-1 min-w-0 flex items-baseline justify-between gap-3">
        <span className="text-[11px] uppercase tracking-[0.18em] text-ink-mute font-semibold">{label}</span>
        <span className="text-sm text-ink text-right truncate">{value}</span>
      </div>
    </li>
  );
}
