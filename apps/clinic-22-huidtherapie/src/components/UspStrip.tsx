import { Award, UserCheck, Sparkles, Calendar } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: Award,     title: t('usp.expert'),   sub: t('usp.expertSub') },
    { icon: UserCheck, title: t('usp.personal'), sub: t('usp.personalSub') },
    { icon: Sparkles,  title: t('usp.calm'),     sub: t('usp.calmSub') },
    { icon: Calendar,  title: t('usp.online'),   sub: t('usp.onlineSub') },
  ];

  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_18px_50px_-22px_rgba(30,29,27,0.28)] border border-ink/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-ivory transition-colors">
              <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-ink">
                <Icon size={18} strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-ink leading-tight">{title}</p>
                <p className="text-xs text-ink/55 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
