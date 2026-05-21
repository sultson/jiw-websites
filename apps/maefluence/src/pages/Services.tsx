import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { services } from '../data/services';
import { ugcExamples } from '../data/portfolio';
import CtaBanner from '../components/CtaBanner';
import LazyVideo from '../components/LazyVideo';

type Props = { t: (k: string) => string };

export default function Services({ t }: Props) {
  useEffect(() => {
    document.title = t('meta.services.title');
  }, [t]);

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-12 lg:pb-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-10 text-center">
          <p className="kicker">{t('services.kicker')}</p>
          <h1 className="display-xl mt-6">
            {t('services.title').split('\n').map((line, i) => (
              <span key={i} className="block">{line}</span>
            ))}
          </h1>
          <p className="mt-8 text-coffee/80 text-base lg:text-lg max-w-3xl mx-auto">
            {t('services.lead')}
          </p>
        </div>
      </section>

      <section className="pb-20 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map(s => {
              const highlight = s.highlight;
              return (
                <article
                  key={s.id}
                  className={`relative flex flex-col rounded-3xl p-8 lg:p-10 border transition ${
                    highlight
                      ? 'bg-coffee text-bone border-coffee shadow-[0_24px_60px_-20px_rgba(84,69,65,0.5)]'
                      : 'bg-white/60 border-coffee/20'
                  }`}
                >
                  {highlight && (
                    <span className="absolute top-5 right-5 text-[10px] uppercase tracking-[0.28em] text-sand">
                      Populair
                    </span>
                  )}
                  <h2 className={`font-display text-3xl lg:text-4xl ${highlight ? 'text-bone' : ''}`}>
                    {t(`services.${s.id}.name`)}
                  </h2>
                  <p className={`mt-2 italic font-serif text-base ${highlight ? 'text-sand-soft' : 'text-sand'}`}>
                    {t(`services.${s.id}.tag`)}
                  </p>
                  <p className={`mt-6 text-sm leading-relaxed ${highlight ? 'text-bone/85' : 'text-coffee/80'}`}>
                    {t(`services.${s.id}.body`)}
                  </p>

                  <ul className="mt-7 space-y-3 text-sm flex-1">
                    {s.featureKeys.map(fk => (
                      <li key={fk} className="flex items-start gap-3">
                        <Check size={14} strokeWidth={1.5} className={`mt-1 shrink-0 ${highlight ? 'text-sand' : 'text-sand'}`} />
                        <span className={highlight ? 'text-bone/90' : 'text-coffee/85'}>{t(fk)}</span>
                      </li>
                    ))}
                  </ul>

                  <div className={`mt-8 pt-6 border-t ${highlight ? 'border-bone/15' : 'border-coffee/20'}`}>
                    <div className="flex items-baseline gap-2">
                      <span className="font-display text-4xl">{t(`services.${s.id}.price`)}</span>
                    </div>
                    <p className={`mt-1 text-[11px] uppercase tracking-[0.2em] ${highlight ? 'text-bone/75' : 'text-coffee/80'}`}>
                      {t(`services.${s.id}.priceSuffix`)}
                    </p>
                    <p className={`mt-4 text-xs ${highlight ? 'text-bone/75' : 'text-coffee/80'}`}>
                      {t(`services.${s.id}.term`)}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Add-ons */}
          <div className="mt-16 rounded-3xl bg-bone border border-coffee/20 p-8 lg:p-12">
            <h3 className="font-display text-2xl lg:text-3xl mb-6">{t('services.addons.title')}</h3>
            <ul className="divide-y divide-coffee/10">
              {(['a1', 'a2', 'a3'] as const).map(k => (
                <li key={k} className="flex items-center justify-between py-4 text-sm lg:text-base">
                  <span className="text-coffee/85">{t(`services.addons.${k}`)}</span>
                  <span className="font-serif text-xl text-coffee">{t(`services.addons.${k}.price`)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* UGC */}
      <section className="py-24 lg:py-32 bg-sand/20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-5">
              <p className="kicker">{t('services.ugc.kicker')}</p>
              <h2 className="display-lg mt-6">
                {t('services.ugc.title').split('\n').map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </h2>
              <p className="mt-8 text-coffee/85 text-base">{t('services.ugc.what')}</p>
            </div>

            <div className="lg:col-span-7 space-y-10">
              <div>
                <h3 className="font-serif text-2xl mb-5">{t('services.ugc.why.title')}</h3>
                <ul className="space-y-3 text-sm text-coffee/85">
                  <li className="flex items-start gap-3"><Check size={14} className="mt-1 text-sand shrink-0" strokeWidth={1.5} />{t('services.ugc.why.1')}</li>
                  <li className="flex items-start gap-3"><Check size={14} className="mt-1 text-sand shrink-0" strokeWidth={1.5} />{t('services.ugc.why.2')}</li>
                  <li className="flex items-start gap-3"><Check size={14} className="mt-1 text-sand shrink-0" strokeWidth={1.5} />{t('services.ugc.why.3')}</li>
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-2xl mb-5">{t('services.ugc.types.title')}</h3>
                <ul className="grid sm:grid-cols-2 gap-3 text-sm text-coffee/85">
                  {['type1', 'type2', 'type3', 'type4'].map(k => (
                    <li key={k} className="rounded-2xl border border-coffee/20 bg-bone/60 px-4 py-3">
                      {t(`services.ugc.${k}`)}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl bg-coffee text-bone p-6">
                <p className="text-sm">{t('services.ugc.price1')}</p>
                <p className="text-sm text-bone/70 mt-2">{t('services.ugc.price2')}</p>
              </div>
            </div>
          </div>

          {/* UGC examples — card-like video tiles, same look as the snippets rail */}
          <div className="mt-16 lg:mt-24 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-md sm:max-w-none mx-auto">
            {ugcExamples.map(item => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-3xl bg-coffee/15 aspect-[9/16]"
              >
                <LazyVideo
                  src={item.src}
                  poster={item.poster}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner t={t} />
    </>
  );
}
