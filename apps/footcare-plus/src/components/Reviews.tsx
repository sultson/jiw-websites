import { useRef } from 'react';
import {
  Star,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  GraduationCap,
  MapPin,
} from 'lucide-react';
import { reviews } from '../data/reviews';

type Props = { t: (k: string) => string };

const PROVOET_URL =
  'https://www.provoet.nl/professionals/footcare-wijckel-58466-120132';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=100087431473852';

export default function Reviews({ t }: Props) {
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dir: -1 | 1) => {
    const el = scroller.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-review-card]');
    const amount = card ? card.offsetWidth + 16 : 320;
    el.scrollBy({ left: amount * dir, behavior: 'smooth' });
  };

  // No real reviews yet — render a credentials block instead of fake stars.
  // The component still ships as <Reviews> so the rest of App.tsx is stable.
  if (reviews.length === 0) {
    const creds = [
      {
        icon: ShieldCheck,
        title: t('creds.1.title'),
        body:  t('creds.1.body'),
        href:  PROVOET_URL,
        cta:   t('creds.1.cta'),
      },
      {
        icon: GraduationCap,
        title: t('creds.2.title'),
        body:  t('creds.2.body'),
      },
      {
        icon: MapPin,
        title: t('creds.3.title'),
        body:  t('creds.3.body'),
      },
    ];

    return (
      <section id="over-gerda" className="py-20 md:py-28 bg-sand-soft/40">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <div className="max-w-2xl">
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl leading-[1.08]">
              {t('reviews.title')}
            </h2>
            <p className="mt-4 text-ink/70 leading-relaxed">{t('reviews.sub')}</p>
          </div>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {creds.map(({ icon: Icon, title, body, href, cta }) => (
              <article key={title} className="card p-6 md:p-7 flex flex-col">
                <div className="w-11 h-11 rounded-full bg-sand flex items-center justify-center text-teal mb-5">
                  <Icon size={20} />
                </div>
                <h3 className="font-serif text-xl text-ink">{title}</h3>
                <p className="mt-3 text-sm text-ink/70 leading-relaxed flex-1">{body}</p>
                {href && cta && (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-1 text-sm text-teal hover:underline"
                  >
                    {cta} <ExternalLink size={12} />
                  </a>
                )}
              </article>
            ))}
          </div>

          <p className="mt-10 text-sm text-ink/55 max-w-2xl leading-relaxed">
            {t('reviews.empty')}{' '}
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal hover:underline"
            >
              Facebook-pagina van de praktijk
            </a>
            .
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="over-gerda" className="py-20 md:py-28 bg-sand-soft/40">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-3 font-serif text-4xl md:text-5xl">{t('reviews.title')}</h2>
            <p className="mt-3 text-sm text-ink/60 max-w-md">{t('reviews.sub')}</p>
          </div>
          <div className="hidden md:flex gap-2">
            <button onClick={() => scrollBy(-1)} className="btn-outline !px-3" aria-label="Vorige">
              <ChevronLeft size={16} />
            </button>
            <button onClick={() => scrollBy(1)} className="btn-outline !px-3" aria-label="Volgende">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div
          ref={scroller}
          className="no-scrollbar flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 -mx-5 px-5 sm:mx-0 sm:px-0"
        >
          {reviews.map(r => (
            <article
              key={r.id}
              data-review-card
              className="card shrink-0 w-[85%] sm:w-[360px] p-6 md:p-7 snap-start flex flex-col"
            >
              <div className="flex gap-0.5 text-teal mb-3">
                {Array.from({ length: r.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="currentColor" />
                ))}
              </div>
              <p className="font-serif italic text-lg md:text-xl leading-snug text-ink flex-1">
                "{r.nl}"
              </p>
              <div className="mt-5 pt-5 border-t border-ink/5 flex items-center justify-between text-xs">
                <span className="font-medium text-ink">{r.name}</span>
                <span className="text-ink/50 tracking-wider uppercase">{r.source}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
