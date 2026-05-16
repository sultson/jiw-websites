import { Star } from 'lucide-react';
import { about, reviewsMeta, sectionTitles } from '../content';

export default function About() {
  return (
    <section id="over" className="section bg-ink-2">
      <div className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          {/* Left: header, paragraphs, signature */}
          <div>
            <span className="eyebrow">{sectionTitles.about.eyebrow}</span>
            <h2 className="mt-4 text-4xl md:text-5xl">
              Een installateur die{' '}
              <span className="text-gradient-gold">afspraken nakomt</span>.
            </h2>

            <div className="mt-6 space-y-4">
              {about.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-bone-soft">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Right: image with accent + floating rating stat */}
          <div className="relative">
            {/* Offset gold-gradient block accent */}
            <span
              aria-hidden="true"
              className="gold-gradient absolute -right-4 -top-4 h-28 w-28 rounded-2xl opacity-90 md:-right-6 md:-top-6 md:h-36 md:w-36"
            />

            <div className="relative overflow-hidden rounded-2xl border border-line shadow-2xl shadow-black/40">
              <img
                src={about.image}
                alt={about.imageAlt}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            {/* Floating rating stat */}
            <div className="card absolute -bottom-6 -left-4 flex items-center gap-4 p-4 shadow-xl shadow-black/40 md:-left-6 md:p-5">
              <div className="leading-none">
                <p className="font-display text-3xl font-bold text-bone md:text-4xl">
                  {reviewsMeta.score}
                </p>
                <div
                  className="mt-1.5 flex gap-0.5"
                  role="img"
                  aria-label={`${reviewsMeta.score} van 5 sterren`}
                >
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="h-3.5 w-3.5 fill-gold text-gold"
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
              <span className="h-10 w-px bg-line" aria-hidden="true" />
              <p className="max-w-[6.5rem] text-sm text-bone-soft">
                {reviewsMeta.count} {reviewsMeta.source}-reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
