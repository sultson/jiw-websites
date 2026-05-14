import { Sparkles, Heart, Star, Phone } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Sparkles, title: t('usp.specialist'), sub: t('usp.specialistSub') },
    { icon: Heart,    title: t('usp.healthy'),    sub: t('usp.healthySub') },
    { icon: Star,     title: t('usp.rated'),      sub: t('usp.ratedSub') },
    { icon: Phone,    title: t('usp.contact'),    sub: t('usp.contactSub') },
  ];

  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(44,26,16,0.25)] border border-espresso/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-cream">
              <div className="shrink-0 w-10 h-10 rounded-full bg-blush flex items-center justify-center text-gold">
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
