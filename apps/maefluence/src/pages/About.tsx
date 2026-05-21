import { useEffect } from 'react';
import type { Route } from '../hooks/useRoute';
import CtaBanner from '../components/CtaBanner';

type Props = {
  t: (k: string) => string;
  go: (r: Route) => void;
};

export default function About({ t, go }: Props) {
  useEffect(() => {
    document.title = t('meta.about.title');
  }, [t]);

  return (
    <>
      <section className="pt-28 lg:pt-36 pb-20 lg:pb-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="relative">
                <div className="absolute -inset-3 bg-sand/15 rounded-[2.5rem] -z-10 blur-2xl" aria-hidden />
                <img
                  src="/sofia-halflength.webp?v=20260520"
                  alt="Sofia Mae"
                  className="w-full aspect-[2/3] object-cover rounded-[2rem]"
                  loading="eager"
                  fetchPriority="high"
                />
              </div>
              <div className="mt-6 hidden lg:block">
                <img
                  src="/sofia-fulllength-bw.webp?v=20260520"
                  alt="Sofia Mae · editorial portrait"
                  className="w-2/3 aspect-[2/3] object-cover rounded-2xl grayscale"
                  loading="lazy"
                />
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="kicker">{t('about.kicker')}</p>
              <h1 className="display-xl mt-6">
                {t('about.title')}
                <span className="block italic text-sand text-[0.5em] mt-2">— Founder</span>
              </h1>
              <div className="mt-10 space-y-6 text-coffee/85 text-base lg:text-lg max-w-2xl">
                <p>{t('about.intro')}</p>
                <p>{t('about.p2')}</p>
                <p>{t('about.p3')}</p>
                <p>{t('about.p4')}</p>
              </div>

              <div className="mt-12 grid sm:grid-cols-3 gap-8 max-w-2xl">
                {[
                  ['about.fact1.label', 'about.fact1.value'],
                  ['about.fact2.label', 'about.fact2.value'],
                  ['about.fact3.label', 'about.fact3.value'],
                ].map(([labelKey, valueKey]) => (
                  <div key={labelKey}>
                    <p className="text-[10px] uppercase tracking-[0.28em] text-sand">{t(labelKey)}</p>
                    <p className="font-serif text-xl text-coffee mt-2">{t(valueKey)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <button onClick={() => go('services')} className="btn-primary">{t('about.cta')}</button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <CtaBanner t={t} />
    </>
  );
}
