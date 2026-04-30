import { Star, Clock, ShieldCheck, Sparkles } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Star, title: t('usp.rating'), sub: t('usp.ratingSub') },
    { icon: Clock, title: t('usp.experience'), sub: t('usp.experienceSub') },
    { icon: ShieldCheck, title: t('usp.hygiene'), sub: t('usp.hygieneSub') },
    { icon: Sparkles, title: t('usp.social'), sub: t('usp.socialSub') },
  ];

  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-[repeat(2,minmax(0,1fr))] md:grid-cols-[repeat(4,minmax(0,1fr))] gap-2 md:gap-4 bg-white rounded-lg p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(42,33,32,0.25)] border border-espresso/5 overflow-hidden">
          {items.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-start gap-2 md:gap-3 p-3 rounded-lg md:hover:bg-cream min-w-0"
            >
              <div className="shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-full bg-blush flex items-center justify-center text-gold">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-espresso leading-tight">{title}</p>
                <p className="text-xs text-espresso/60 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
