import { ShieldCheck, Stethoscope, Activity, HomeIcon } from 'lucide-react';

type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { icon: ShieldCheck,  title: t('usp.1.title'), sub: t('usp.1.sub') },
    { icon: Stethoscope,  title: t('usp.2.title'), sub: t('usp.2.sub') },
    { icon: Activity,     title: t('usp.3.title'), sub: t('usp.3.sub') },
    { icon: HomeIcon,     title: t('usp.4.title'), sub: t('usp.4.sub') },
  ];

  return (
    <section className="relative -mt-12 md:-mt-16 z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 bg-white rounded-2xl p-3 md:p-4 shadow-[0_10px_40px_-20px_rgba(31,42,46,0.25)] border border-ink/5">
          {items.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-start gap-3 p-3 rounded-xl md:hover:bg-sand-soft/50">
              <div className="shrink-0 w-10 h-10 rounded-full bg-sand flex items-center justify-center text-teal">
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
