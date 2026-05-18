import { Quote, Star } from 'lucide-react';
import { useSite } from '../contexts/SiteContext';
import { useOfferte } from '../contexts/OfferteContext';
import { reviews, reviewsMeta, sectionTitles, ui } from '../content';

export default function Reviews() {
  const { t } = useSite();
  const { open } = useOfferte();

  return (
    <section id="ervaringen" className="section bg-ink">
      <div className="container-page">
        <header className="max-w-2xl">
          <span className="eyebrow">{t(sectionTitles.reviews.eyebrow)}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            {t(sectionTitles.reviews.titleStart)}
            <span className="text-orange">{t(sectionTitles.reviews.titleEm)}</span>
            {t(sectionTitles.reviews.titleEnd)}
          </h2>
        </header>

        {/* Rating summary */}
        <div className="mt-8 card inline-flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-4">
          <span className="text-4xl font-extrabold leading-none text-bone">{reviewsMeta.score}</span>
          <div>
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 text-orange" fill="currentColor" strokeWidth={0} />
              ))}
            </div>
            <p className="mt-1 text-sm text-bone-soft">
              {t(ui.reviewsNote, { score: reviewsMeta.score })}
            </p>
          </div>
        </div>

        {/* Masonry of reviews */}
        <div className="mt-12 columns-1 gap-6 md:columns-2 lg:columns-3">
          {reviews.map((review) => (
            <article
              key={`${review.name}-${review.date}`}
              className="card mb-6 break-inside-avoid p-6"
            >
              <Quote className="h-7 w-7 text-orange" fill="currentColor" strokeWidth={0} aria-hidden="true" />
              <p className="mt-4 leading-relaxed text-bone-soft">{review.text}</p>

              <div className="mt-5 h-px w-12 rounded-full bg-orange" />

              <div className="mt-4 flex items-center gap-3">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-orange/15 text-sm font-bold text-orange"
                  aria-hidden="true"
                >
                  {review.name.charAt(0)}
                </span>
                <div>
                  <p className="font-bold text-bone">{review.name}</p>
                  <p className="text-sm text-mute">
                    {review.place} · {review.date}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <button type="button" onClick={open} className="btn btn-orange">
            {t(ui.reviewsCta)}
          </button>
        </div>
      </div>
    </section>
  );
}
