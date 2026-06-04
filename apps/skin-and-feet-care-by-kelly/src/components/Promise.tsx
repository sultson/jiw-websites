import { ShieldCheck, Clock, MessageCircleHeart, Sparkles } from 'lucide-react';

type Props = { t: (k: string) => string };

const pillars = [
  { i: 1, Icon: ShieldCheck },
  { i: 2, Icon: Clock },
  { i: 3, Icon: MessageCircleHeart },
  { i: 4, Icon: Sparkles },
] as const;

export default function Promise({ t }: Props) {
  return (
    <section id="belofte" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="kicker">{t('promise.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.1]">{t('promise.title')}</h2>
          <p className="mt-5 text-ink/70 leading-relaxed">{t('promise.body')}</p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {pillars.map(({ i, Icon }) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-ink/5 shadow-[0_1px_2px_rgba(43,27,51,0.04)]">
              <div className="w-10 h-10 rounded-full bg-blush flex items-center justify-center text-plum">
                <Icon size={18} />
              </div>
              <p className="mt-4 font-serif text-lg text-ink leading-tight">{t(`promise.p${i}.t`)}</p>
              <p className="mt-2 text-sm text-ink/65 leading-relaxed">{t(`promise.p${i}.b`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
