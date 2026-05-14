import { Sparkles, Wand2, Heart, Footprints, Flower2, Zap } from 'lucide-react';

type Props = { t: (k: string) => string };

const items = [
  { i: 1, Icon: Sparkles   },
  { i: 2, Icon: Wand2      },
  { i: 3, Icon: Heart      },
  { i: 4, Icon: Footprints },
  { i: 5, Icon: Flower2    },
  { i: 6, Icon: Zap        },
] as const;

export default function Specialties({ t }: Props) {
  return (
    <section id="specialiteiten" className="py-20 md:py-28 bg-espresso text-cream">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl">
          <span className="inline-block text-[11px] uppercase tracking-[0.22em] text-gold-soft font-medium">
            {t('special.kicker')}
          </span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1] text-cream">
            {t('special.title')}
          </h2>
          <p className="mt-5 text-cream/75 leading-relaxed">{t('special.body')}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map(({ i, Icon }) => (
            <div
              key={i}
              className="bg-espresso-soft/40 rounded-2xl p-6 border border-cream/10 backdrop-blur-sm"
            >
              <div className="w-11 h-11 rounded-full bg-gold/15 flex items-center justify-center text-gold-soft">
                <Icon size={20} />
              </div>
              <p className="mt-5 font-serif text-xl text-cream leading-tight">
                {t(`special.s${i}.t`)}
              </p>
              <p className="mt-2 text-sm text-cream/70 leading-relaxed">
                {t(`special.s${i}.b`)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a href="#behandelingen" className="btn-gold inline-flex">
            {t('special.cta')}
          </a>
        </div>
      </div>
    </section>
  );
}
