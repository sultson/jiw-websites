import { Sparkles, Hammer, Brush, Eye, ScanEye, Wand2, ArrowRight } from 'lucide-react';

type Props = { t: (k: string) => string; onBook: () => void };

type Item = {
  icon: typeof Sparkles;
  titleKey: string;
  bodyKey: string;
  accent?: boolean;
};

const items: Item[] = [
  { icon: Sparkles, titleKey: 'aanbod.biab.t',     bodyKey: 'aanbod.biab.b',     accent: true },
  { icon: Hammer,   titleKey: 'aanbod.gel.t',      bodyKey: 'aanbod.gel.b' },
  { icon: Brush,    titleKey: 'aanbod.gellak.t',   bodyKey: 'aanbod.gellak.b' },
  { icon: Eye,      titleKey: 'aanbod.brows.t',    bodyKey: 'aanbod.brows.b' },
  { icon: ScanEye,  titleKey: 'aanbod.wimpers.t',  bodyKey: 'aanbod.wimpers.b' },
  { icon: Wand2,    titleKey: 'aanbod.wax.t',      bodyKey: 'aanbod.wax.b' },
];

export default function Aanbod({ t, onBook }: Props) {
  return (
    <section id="aanbod" className="py-20 md:py-28 bg-blush-soft/50">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="kicker">{t('aanbod.kicker')}</span>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('aanbod.title')}</h2>
          <p className="mt-4 text-plum/65 leading-relaxed">{t('aanbod.sub')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {items.map(({ icon: Icon, titleKey, bodyKey, accent }) => (
            <article
              key={titleKey}
              className={`relative card p-6 md:p-7 flex flex-col ${accent ? 'ring-1 ring-rose/35 bg-white' : ''}`}
            >
              {accent && (
                <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.18em] text-rose font-medium">
                  Specialiteit
                </span>
              )}
              <div className="w-11 h-11 rounded-full bg-blush flex items-center justify-center text-rose mb-4">
                <Icon size={18} />
              </div>
              <h3 className="font-serif text-2xl text-plum">{t(titleKey)}</h3>
              <p className="mt-3 text-sm text-plum/65 leading-relaxed flex-1">{t(bodyKey)}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 md:mt-12 flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 md:p-6 rounded-2xl bg-plum text-porcelain">
          <p className="text-sm md:text-base text-porcelain/85 max-w-xl">{t('aanbod.note')}</p>
          <button onClick={onBook} className="inline-flex items-center justify-center gap-2 bg-porcelain text-plum px-6 py-3 rounded-full text-sm font-medium hover:bg-blush">
            {t('aanbod.cta')}
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
