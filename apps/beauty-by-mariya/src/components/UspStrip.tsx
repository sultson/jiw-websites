import { Award, Heart, Calendar, MapPin } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Award,    title: t('usp.craft'),    sub: t('usp.craftSub') },
    { icon: Heart,    title: t('usp.personal'), sub: t('usp.personalSub') },
    { icon: Calendar, title: t('usp.fresha'),   sub: t('usp.freshaSub') },
    { icon: MapPin,   title: t('usp.local'),    sub: t('usp.localSub') },
  ];

  return (
    <section className="relative -mt-2 md:-mt-6 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(45,26,34,0.18)] border border-ink/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-pearl">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-rose">
                <Icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{title}</p>
                <p className="text-xs text-ink/60 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
