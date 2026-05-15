import { Clock, Shield, Coffee, Wrench } from 'lucide-react';
import { usps, sectionTitles, aboutCopy } from '../content';

const uspIcons = [Clock, Shield, Coffee, Wrench];

export default function About() {
  return (
    <section id="over" className="section bg-bone-soft">
      <div className="container-page">
        <div className="max-w-3xl">
          <span className="eyebrow">{sectionTitles.about.eyebrow}</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-ink">
            {sectionTitles.about.title}
          </h2>

          <div className="mt-8 space-y-5 text-stone text-base md:text-lg leading-relaxed">
            {aboutCopy.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </div>

        <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          {usps.map((usp, i) => {
            const Icon = uspIcons[i] ?? Clock;
            return (
              <div
                key={usp.title}
                className="flex flex-col gap-3 p-6 rounded-2xl border border-line bg-bone"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brick/15 text-brick-deep">
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
