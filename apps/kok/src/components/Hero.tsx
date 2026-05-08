import { ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onIntake: () => void };

export default function Hero({ t, onIntake }: Props) {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="relative max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 lg:pt-24 pb-12 sm:pb-16 lg:pb-20">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <div className="lg:col-span-7 rise-in">
            <span className="kicker">{t('hero.kicker')}</span>
            <h1 className="mt-6 font-extrabold whitespace-pre-line tracking-[-0.04em] leading-[0.92]"
                style={{ fontSize: 'clamp(48px, 9vw, 112px)' }}>
              {t('hero.title')}
            </h1>
            <p className="mt-7 text-lg sm:text-xl text-ink/75 max-w-2xl leading-relaxed">
              {t('hero.sub')}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button type="button" className="btn-ochre" onClick={onIntake}>
                {t('hero.cta')}
                <ArrowRight size={16} strokeWidth={2.5} />
              </button>
              <a href="#diensten" className="btn-outline">{t('hero.cta2')}</a>
            </div>
          </div>

          {/* Single decisive photograph. The brand is a painter, the photo is the proof. */}
          <aside className="lg:col-span-5 rise-in-delay-1">
            <figure className="relative">
              <img
                src="/showcase/CtN9A2joAtb-0.webp"
                alt={t('show.alt.exterior')}
                width={900}
                height={1125}
                fetchPriority="high"
                decoding="async"
                className="w-full aspect-[4/5] object-cover"
              />
              {/* Paint-swatch chip: a specimen-book style label, not a duplicate proof line */}
              <figcaption className="absolute -left-3 -bottom-3 sm:-left-5 sm:-bottom-5 bg-ochre text-ink px-4 py-3 shadow-[0_12px_24px_-8px_rgba(26,29,34,0.22)]">
                <div className="font-display font-extrabold text-sm leading-none tracking-[-0.01em]">
                  OCHRE 934A
                </div>
                <div className="text-[10px] uppercase tracking-[0.22em] mt-1 font-semibold">
                  Kok · Huis №&nbsp;01
                </div>
              </figcaption>
            </figure>
          </aside>
        </div>

        {/* Inline proof strip - replaces the Vakkaart sheet card */}
        <dl className="mt-14 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-6 pt-8 border-t border-ink/15">
          <ProofItem dt={t('hero.proof.region')}    dd={t('hero.proof.regionSub')} />
          <ProofItem dt={t('hero.proof.spray')}     dd={t('hero.proof.spraySub')} />
          <ProofItem dt={t('hero.proof.brand')}     dd={t('hero.proof.brandSub')} />
          <ProofItem dt={t('hero.proof.response')}  dd={t('hero.proof.responseSub')} />
        </dl>
      </div>
    </section>
  );
}

function ProofItem({ dt, dd }: { dt: string; dd: string }) {
  return (
    <div>
      <dt className="text-[11px] uppercase tracking-[0.24em] text-ochre-deep font-semibold">
        {dt}
      </dt>
      <dd className="mt-2 font-display font-bold text-ink leading-snug">
        {dd}
      </dd>
    </div>
  );
}
