import { Scissors, Coffee, Star, CalendarCheck } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Scissors,      title: t('usp.handpicked'), sub: t('usp.handpickedSub') },
    { icon: Coffee,        title: t('usp.calm'),       sub: t('usp.calmSub') },
    { icon: Star,          title: t('usp.fivestar'),   sub: t('usp.fivestarSub') },
    { icon: CalendarCheck, title: t('usp.online'),     sub: t('usp.onlineSub') },
  ];

  return (
    <section className="relative -mt-14 md:-mt-20 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 bg-ivory rounded-2xl p-3 md:p-5 shadow-[0_18px_60px_-30px_rgba(26,24,22,0.45)] border border-ink/6">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-sand-soft/60 transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand-soft flex items-center justify-center text-gold-deep">
                <Icon size={17} />
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
