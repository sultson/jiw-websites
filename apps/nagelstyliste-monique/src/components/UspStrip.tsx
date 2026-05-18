import { Heart, Gem, Sparkles, Leaf } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Heart,    title: t('usp.personal'), sub: t('usp.personalSub') },
    { icon: Gem,      title: t('usp.quality'),  sub: t('usp.qualitySub') },
    { icon: Sparkles, title: t('usp.creative'), sub: t('usp.creativeSub') },
    { icon: Leaf,     title: t('usp.relax'),    sub: t('usp.relaxSub') },
  ];

  return (
    <section className="relative -mt-10 md:-mt-14 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_14px_44px_-22px_rgba(12,61,82,0.3)] border border-ink/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-blush-soft transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-pink">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink leading-tight">{title}</p>
                <p className="text-xs text-ink/55 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
