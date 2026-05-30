import { Star, ShieldCheck, Sparkles, Car } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Star,        title: t('usp.rating'),   sub: t('usp.ratingSub') },
    { icon: ShieldCheck, title: t('usp.warranty'), sub: t('usp.warrantySub') },
    { icon: Sparkles,    title: t('usp.sterile'),  sub: t('usp.sterileSub') },
    { icon: Car,         title: t('usp.parking'),  sub: t('usp.parkingSub') },
  ];

  return (
    <section className="relative -mt-10 md:-mt-14 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-cream rounded-2xl p-3 md:p-4 shadow-[0_18px_50px_-26px_rgba(42,34,29,0.4)] border border-ink/8">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-cream-soft transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-rose-deep">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{title}</p>
                <p className="text-xs text-ink-mute mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
