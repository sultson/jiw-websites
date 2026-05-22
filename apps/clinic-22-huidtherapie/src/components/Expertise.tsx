import { Sparkles, Droplet, Zap, Sun, Heart, ClipboardList, ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

const items = [
  { k: 'e1', Icon: Droplet },
  { k: 'e2', Icon: Sparkles },
  { k: 'e3', Icon: Zap },
  { k: 'e4', Icon: Sun },
  { k: 'e5', Icon: Heart },
  { k: 'e6', Icon: ClipboardList },
];

export default function Expertise({ t, onBook }: Props) {
  return (
    <section id="expertise" className="py-20 md:py-28 bg-bone/55">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="md:flex md:items-end md:justify-between gap-10 mb-12">
          <div className="max-w-xl">
            <span className="kicker">{t('expertise.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08]">{t('expertise.title')}</h2>
            <p className="mt-4 text-ink/65 text-sm md:text-base max-w-md">{t('expertise.sub')}</p>
          </div>
          <button onClick={onBook} className="mt-6 md:mt-0 btn-outline">
            {t('nav.book')}
            <ArrowRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {items.map(({ k, Icon }) => (
            <article
              key={k}
              className="group relative bg-white rounded-2xl border border-ink/5 p-7 md:p-8 hover:border-ink/15 transition-colors"
            >
              <div className="w-11 h-11 rounded-full bg-ivory flex items-center justify-center text-ink border border-ink/8">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <h3 className="mt-5 font-serif text-xl md:text-2xl leading-tight text-ink">
                {t(`expertise.${k}.t`)}
              </h3>
              <p className="mt-3 text-sm text-ink/65 leading-relaxed">{t(`expertise.${k}.b`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
