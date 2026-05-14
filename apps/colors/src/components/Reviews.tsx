import { Quote, Star } from 'lucide-react';
import { business, reviews, sectionTitles } from '../content';

function Reviews() {
  return (
    <section id="reviews" className="section bg-ink text-bone">
      <div className="container-page">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="eyebrow text-rood">{sectionTitles.reviews.eyebrow}</p>
          <h2 className="mt-3 text-4xl md:text-5xl text-bone mb-6">
            {sectionTitles.reviews.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-1" aria-label="5 van 5 sterren">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className="text-geel"
                  fill="currentColor"
                  strokeWidth={0}
                />
              ))}
            </div>
            <p className="text-lg md:text-xl text-bone font-display">
              {business.reviewsScore} / 10
              {business.reviewsCount > 0
                ? ` op basis van ${business.reviewsCount} reviews via Trustoo`
                : ' via Trustoo'}
            </p>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:break-inside-avoid [&>*]:mb-6">
          {reviews.map((r) => (
            <article
              key={`${r.name}-${r.date}`}
              className="bg-ink-soft rounded-2xl p-6"
            >
              <Quote size={22} strokeWidth={1.5} className="text-rood mb-4" />
              <p className="text-bone leading-relaxed">{r.text}</p>
              <div className="h-px bg-rood/60 w-10 my-5" />
              <div>
                <p className="font-display text-bone text-lg leading-tight">{r.name}</p>
                <p className="text-bone/60 text-sm mt-1">{r.date}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 md:mt-16 flex justify-center">
          <a
            href={business.trustoo}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-primary"
          >
            Bekijk alle reviews op Trustoo
          </a>
        </div>
      </div>
    </section>
  );
}

export default Reviews;
