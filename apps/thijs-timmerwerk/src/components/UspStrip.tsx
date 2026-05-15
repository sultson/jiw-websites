import { Users, CalendarCheck, FileText, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import Reveal from './Reveal';

type Props = { t: (k: string) => string };

const pillars: { icon: LucideIcon; title: string; sub: string }[] = [
  { icon: Users, title: 'usp.1', sub: 'usp.1sub' },
  { icon: CalendarCheck, title: 'usp.2', sub: 'usp.2sub' },
  { icon: FileText, title: 'usp.3', sub: 'usp.3sub' },
  { icon: Sparkles, title: 'usp.4', sub: 'usp.4sub' },
];

export default function UspStrip({ t }: Props) {
  return (
    <section className="bg-bone border-y border-line">
      <div className="shell section">
        <Reveal>
          <h2 className="display-md text-ink dot-spark max-w-md">{t('usp.title')}</h2>
        </Reveal>

        <div className="mt-10 lg:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <Reveal key={p.title} delay={(i % 4) as 0 | 1 | 2 | 3} className="bg-bone">
                <div className="h-full bg-white p-7 lg:p-8 flex flex-col">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-cobalt/10 text-cobalt">
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <h3 className="mt-5 text-[18px] font-extrabold text-ink leading-snug">
                    {t(p.title)}
                  </h3>
                  <p className="mt-2.5 text-[14px] leading-relaxed text-ink-soft">
                    {t(p.sub)}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
