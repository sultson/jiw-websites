import { UserCheck, FileCheck2, Hammer, CalendarCheck, type LucideIcon } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { sectionTitles, usps } from '../content';

const icons: LucideIcon[] = [UserCheck, FileCheck2, Hammer, CalendarCheck];

export default function UspStrip() {
  const { t } = useSite();
  return (
    <section id="waarom" className="section bg-ink-2">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{t(sectionTitles.usps.eyebrow)}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {t(sectionTitles.usps.titleStart)}
            <span className="text-orange">{t(sectionTitles.usps.titleEm)}</span>
            {t(sectionTitles.usps.titleEnd)}
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {usps.map((usp, i) => {
            const Icon = icons[i];
            return (
              <div
                key={usp.title.nl}
                className="card p-6 md:p-7 transition duration-200 hover:-translate-y-1 hover:border-orange hover:shadow-lg hover:shadow-black/30"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-orange/30 bg-orange/10 text-orange">
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{t(usp.title)}</h3>
                <p className="mt-2 text-bone-soft">{t(usp.body)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
