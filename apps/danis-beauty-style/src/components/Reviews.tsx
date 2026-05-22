import { Star, ExternalLink } from 'lucide-react';
import { reviews } from '../data/reviews';
import { business } from '../data/contact';

type Props = { t: (k: string) => string };

function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${count} sterren`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="fill-[#dcb251] text-[#dcb251]" />
      ))}
    </div>
  );
}

export default function Reviews({ t }: Props) {
  return (
    <section id="reviews" className="section bg-ink">
      <div className="container-page">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="kicker">{t('reviews.kicker')}</span>
            <h2 className="mt-5 text-4xl md:text-5xl font-serif text-bone">
              {t('reviews.title')}
            </h2>
            <p className="mt-4 text-bone-soft text-base">{t('reviews.sub')}</p>
          </div>
          <a
            href={business.google}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs uppercase tracking-[0.22em] text-gold inline-flex items-center gap-2 hover:text-gold-bright self-start sm:self-auto"
          >
            {t('reviews.all')}
            <ExternalLink size={12} aria-hidden="true" />
          </a>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {reviews.map(r => (
            <article key={r.name + r.date} className="card p-6 flex flex-col">
              <Stars count={r.stars} />
              <p className="mt-4 text-bone-soft text-sm leading-relaxed flex-1">
                "{r.text}"
              </p>
              <div className="mt-5 pt-5 border-t border-line">
                <p className="text-sm font-semibold text-bone">{r.name}</p>
                {r.context && (
                  <p className="text-xs text-mute mt-0.5">{r.context}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
