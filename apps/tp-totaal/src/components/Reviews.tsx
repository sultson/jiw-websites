import { Quote, Star } from 'lucide-react';
import { business, reviews, sectionTitles } from '../content';

export default function Reviews() {
  return (
    <section id="reviews" className="section bg-bone">
      <div className="container-page">
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="eyebrow mb-3">{sectionTitles.reviews.eyebrow}</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-6">
            {sectionTitles.reviews.title}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-6">
            <div className="flex items-center gap-1" aria-label="5 van 5 sterren">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={22}
                  className="text-brick fill-brick"
                  strokeWidth={1.5}
                />
              ))}
            </div>
            <p className="text-lg md:text-xl text-ink font-display">
              {business.reviewsScore} / 10 op basis van {business.reviewsCount} reviews via Trustoo
            </p>
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 [&>*]:break-inside-avoid [&>*]:mb-6">
          {reviews.map((r) => (
            <article
              key={`${r.name}-${r.date}`}
              className="bg-bone-soft border border-line rounded-2xl p-6"
            >
              <Quote
                size={22}
                strokeWidth={1.5}
                className="text-brick-deep mb-4"
              />
              <p className="text-ink leading-relaxed">{r.text}</p>
              <div className="h-px bg-brick/40 w-10 my-5" />
              <div>
                <p className="font-display text-ink text-lg leading-tight">
                  {r.name}
                </p>
                <p className="text-stone text-sm mt-1">{r.date}</p>
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
