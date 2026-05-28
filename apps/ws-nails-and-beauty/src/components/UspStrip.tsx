import { Award, Sparkles, Palette, Coffee } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Award,    title: t('usp.cert'),    sub: t('usp.certSub') },
    { icon: Sparkles, title: t('usp.natural'), sub: t('usp.naturalSub') },
    { icon: Palette,  title: t('usp.colors'),  sub: t('usp.colorsSub') },
    { icon: Coffee,   title: t('usp.coffee'),  sub: t('usp.coffeeSub') },
  ];

  return (
    <section className="relative -mt-4 md:-mt-10 z-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(42,24,32,0.25)] border border-plum/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-porcelain">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-plum leading-tight">{title}</p>
                <p className="text-xs text-plum/60 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
