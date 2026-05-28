import { Gem, GraduationCap, Star, Calendar } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Gem,            title: t('usp.diamond'),   sub: t('usp.diamondSub') },
    { icon: GraduationCap,  title: t('usp.diploma'),   sub: t('usp.diplomaSub') },
    { icon: Star,           title: t('usp.google'),    sub: t('usp.googleSub') },
    { icon: Calendar,       title: t('usp.salonized'), sub: t('usp.salonizedSub') },
  ];

  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_18px_60px_-30px_rgba(0,0,0,0.35)] border border-ink/6">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-paper">
              <div className="shrink-0 w-10 h-10 rounded-full bg-paper flex items-center justify-center text-champagne ring-1 ring-ink/5">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{title}</p>
                <p className="text-xs text-mute mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
