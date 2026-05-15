import { Quote, Star } from 'lucide-react';
import { business, reviews, reviewsMeta, sectionTitles } from '../content';

const STAR_COUNT = 5;

export default function Reviews() {
  return (
    <section id="ervaringen" className="section bg-ink">
      <div className="container-page">
        <header className="max-w-2xl">
          <span className="eyebrow">{sectionTitles.reviews.eyebrow}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            Wat klanten <span className="text-gradient-gold">zeggen</span>.
          </h2>
        </header>

        {/* Rating summary trust badge */}
        <div className="mt-8 card inline-flex flex-wrap items-center gap-x-5 gap-y-3 px-6 py-4">
          <span className="text-4xl font-bold leading-none text-bone">
            {reviewsMeta.score}
          </span>
          <div>
            <div className="flex items-center gap-1" aria-hidden="true">
              {Array.from({ length: STAR_COUNT }).map((_, i) => (
                <Star
                  key={i}
                  className="h-5 w-5 text-gold"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="mt-1 text-sm text-bone-soft">
              op basis van {reviewsMeta.count} {reviewsMeta.source}-reviews
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
              <Quote
                className="h-7 w-7 text-gold"
                fill="currentColor"
                strokeWidth={0}
                aria-hidden="true"
              />
              <p className="mt-4 leading-relaxed text-bone-soft">{review.text}</p>

              <div className="gold-gradient mt-5 h-px w-12 rounded-full" />

              <div className="mt-4 flex items-center gap-2">
                <Star
                  className="h-4 w-4 shrink-0 text-gold"
                  fill="currentColor"
                  strokeWidth={0}
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-bone">{review.name}</p>
                  <p className="text-sm text-mute">{review.date}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex justify-center">
          <a
            href={business.maps}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline"
          >
            Bekijk alle reviews op Google
          </a>
        </div>
      </div>
    </section>
  );
}
