import { ShieldCheck, Heart, Clock, Leaf } from 'lucide-react';

type Props = { t: (k: string) => string };

const pillars = [
  { i: 1, Icon: ShieldCheck },
  { i: 2, Icon: Heart },
  { i: 3, Icon: Clock },
  { i: 4, Icon: Leaf },
] as const;

export default function Promise({ t }: Props) {
  return (
    <section id="belofte" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-10 md:gap-14 items-center">
          <div className="relative">
            <div className="rounded-2xl aspect-[4/5] overflow-hidden bg-blush shadow-[0_20px_60px_-30px_rgba(44,26,16,0.35)]">
              <img
                src="/lau-handschoenen.webp"
                alt="Laura bereidt een behandeling voor, met verse handschoenen"
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden md:block absolute -bottom-8 -right-8 max-w-[16rem] rounded-2xl bg-white border border-espresso/5 shadow-[0_20px_60px_-30px_rgba(44,26,16,0.3)] p-5">
              <p className="font-serif italic text-espresso text-sm leading-snug">
                {t('promise.quote')}
              </p>
              <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-espresso/50">
                {t('promise.quoteCaption')}
              </p>
            </div>
          </div>

          <div>
            <span className="kicker">{t('promise.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">
              {t('promise.title')}
            </h2>
            <p className="mt-5 text-espresso/70 leading-relaxed max-w-prose">
              {t('promise.body')}
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4 md:gap-5">
              {pillars.map(({ i, Icon }) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 border border-espresso/5"
                >
                  <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                    <Icon size={18} />
                  </div>
                  <p className="mt-4 font-serif text-lg text-espresso leading-tight">
                    {t(`promise.p${i}.t`)}
                  </p>
                  <p className="mt-2 text-sm text-espresso/65 leading-relaxed">
                    {t(`promise.p${i}.b`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
