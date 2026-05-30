import { ShieldCheck, Sofa, Gem, BadgeCheck } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function Promise({ t }: Props) {
  const items = [
    { icon: ShieldCheck, t: t('promise.p1.t'), b: t('promise.p1.b') },
    { icon: Sofa,        t: t('promise.p2.t'), b: t('promise.p2.b') },
    { icon: Gem,         t: t('promise.p3.t'), b: t('promise.p3.b') },
    { icon: BadgeCheck,  t: t('promise.p4.t'), b: t('promise.p4.b') },
  ];

  return (
    <section className="py-20 md:py-28 bg-mocha text-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12 md:mb-14">
          <span className="rose-rule !text-rose-soft">{t('promise.kicker')}</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-cream">{t('promise.title')}</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {items.map(({ icon: Icon, t: title, b }) => (
            <div
              key={title}
              className="rounded-2xl bg-cream/5 border border-cream/10 p-6 backdrop-blur-sm"
            >
              <div className="w-12 h-12 rounded-full bg-cream/10 flex items-center justify-center text-rose-soft mb-5">
                <Icon size={22} />
              </div>
              <h3 className="font-display text-2xl text-cream">{title}</h3>
              <p className="mt-2.5 text-sm text-cream/70 leading-relaxed">{b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
