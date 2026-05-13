import { Clock, Shield, Coffee, GraduationCap } from 'lucide-react';
import { usps, sectionTitles, ownerImage, about, business } from '../content';

const uspIcons = [Clock, Shield, Coffee, GraduationCap];

function About() {
  return (
    <section id="over" className="section bg-bone-soft">
      <div className="container-page">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <span className="eyebrow">{sectionTitles.about.eyebrow}</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-ink">
              {sectionTitles.about.title}
            </h2>

            <div className="mt-8 space-y-5 text-stone text-base md:text-lg leading-relaxed">
              {about.paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            <p className="mt-8 font-display italic text-lg text-ink">{about.sign}</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-bone shadow-[0_20px_60px_-20px_rgba(7,42,70,0.35)]">
              <img
                src={ownerImage}
                alt={`${about.sign} van ${business.name}`}
                className="w-full h-auto object-cover"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-ink text-bone rounded-2xl p-5 shadow-xl max-w-[240px]">
              <p className="font-display text-xl leading-tight">{about.badge.line1}</p>
              <p className="mt-2 text-sm text-bone/80">{about.badge.line2}</p>
              {about.badge.line3 && (
                <p className="mt-1 text-sm text-saffron font-medium">{about.badge.line3}</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {usps.map((usp, i) => {
            const Icon = uspIcons[i] ?? Clock;
            return (
              <div
                key={usp.title}
                className="flex flex-col gap-3 p-6 rounded-2xl border border-line bg-bone"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-saffron/15 text-saffron-deep">
                  <Icon size={20} strokeWidth={1.8} />
                </span>
                <h3 className="font-display text-xl text-ink leading-tight">{usp.title}</h3>
                <p className="text-stone text-sm leading-relaxed">{usp.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About;
