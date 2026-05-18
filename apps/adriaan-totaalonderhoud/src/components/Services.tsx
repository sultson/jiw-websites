import {
  Home,
  PaintRoller,
  Building2,
  Hammer,
  Wrench,
  Store,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { sectionTitles, services, ui } from '../content';

const iconByKey: Record<string, LucideIcon> = {
  verbouwingen: Home,
  renovatie: PaintRoller,
  nieuwbouw: Building2,
  sloopwerkzaamheden: Hammer,
  onderhoud: Wrench,
  zakelijk: Store,
};

export default function Services() {
  const { t } = useSite();
  const { open } = useOfferte();

  return (
    <section id="diensten" className="section bg-ink">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{t(sectionTitles.services.eyebrow)}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {t(sectionTitles.services.titleStart)}
            <span className="text-orange">{t(sectionTitles.services.titleEm)}</span>
            {t(sectionTitles.services.titleEnd)}
          </h2>
          <p className="mt-5 text-bone-soft">{t(sectionTitles.services.intro)}</p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = iconByKey[service.key] ?? Wrench;
            return (
              <article
                key={service.key}
                className="card group p-6 md:p-7 transition duration-200 hover:-translate-y-1 hover:border-orange hover:shadow-lg hover:shadow-black/30"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg border border-orange/30 bg-orange/10 text-orange">
                  <Icon size={22} strokeWidth={1.9} />
                </div>
                <h3 className="mt-5 text-lg font-bold">{t(service.title)}</h3>
                <p className="mt-2 text-bone-soft">{t(service.body)}</p>
              </article>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col items-start gap-4 rounded-xl border border-line bg-ink-2 p-6 sm:flex-row sm:items-center sm:justify-between md:p-7">
          <p className="font-semibold text-bone-soft">{t(ui.servicesPrompt)}</p>
          <button type="button" onClick={open} className="btn btn-orange shrink-0">
            {t(ui.navCta)}
            <ArrowRight size={16} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </section>
  );
}
