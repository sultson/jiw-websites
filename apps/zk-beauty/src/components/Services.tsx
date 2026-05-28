import { ArrowUpRight, Eye, Smile, Scissors } from 'lucide-react';
import { contact } from '../data/contact';

type Props = { t: (k: string) => string };

type Service = {
  id: string;
  icon: typeof Eye;
  titleKey: string;
  bodyKey: string;
  bullets: string[];
};

/**
 * Service cards are intentionally icon-forward, no photography — every
 * treatment photo on this site lives in the Work gallery so nothing repeats.
 */
const services: Service[] = [
  {
    id: 'lash-brow',
    icon: Eye,
    titleKey: 'srv.lash.title',
    bodyKey: 'srv.lash.body',
    bullets: ['srv.lash.l1', 'srv.lash.l2', 'srv.lash.l3', 'srv.lash.l4'],
  },
  {
    id: 'teeth',
    icon: Smile,
    titleKey: 'srv.teeth.title',
    bodyKey: 'srv.teeth.body',
    bullets: ['srv.teeth.l1', 'srv.teeth.l2', 'srv.teeth.l3'],
  },
  {
    id: 'hair',
    icon: Scissors,
    titleKey: 'srv.hair.title',
    bodyKey: 'srv.hair.body',
    bullets: ['srv.hair.l1', 'srv.hair.l2', 'srv.hair.l3'],
  },
];

export default function Services({ t }: Props) {
  return (
    <section id="behandelingen" className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">
        <div className="max-w-2xl">
          <span className="gold-rule">{t('services.kicker')}</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05]">
            {t('services.title')}
          </h2>
          <p className="mt-5 text-ink-mute max-w-lg">{t('services.sub')}</p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-5 md:gap-6">
          {services.map(({ id, icon: Icon, titleKey, bodyKey, bullets }) => (
            <article
              key={id}
              className="group flex flex-col bg-ivory rounded-2xl border border-ink/8 p-8 md:p-10 shadow-[0_2px_4px_rgba(26,24,22,0.04)] hover:shadow-[0_24px_60px_-30px_rgba(26,24,22,0.3)] transition-shadow"
            >
              <div className="w-14 h-14 rounded-full bg-sand-soft flex items-center justify-center text-gold-deep">
                <Icon size={22} strokeWidth={1.5} />
              </div>

              <h3 className="mt-7 font-display text-3xl md:text-4xl leading-[1.05]">
                {t(titleKey)}
              </h3>
              <p className="mt-4 text-[15px] text-ink-mute leading-relaxed">{t(bodyKey)}</p>

              <ul className="mt-6 space-y-2 text-sm">
                {bullets.map(b => (
                  <li key={b} className="flex items-start gap-3 text-ink/80">
                    <span className="mt-2.5 inline-block h-px w-3 bg-gold-soft shrink-0" />
                    <span>{t(b)}</span>
                  </li>
                ))}
              </ul>

              <a
                href={contact.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto pt-8 inline-flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase text-ink/80 hover:text-gold-deep group/cta self-start"
              >
                {t('services.book')}
                <ArrowUpRight size={14} className="transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
