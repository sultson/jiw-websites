import { Clock, Shield, BadgeCheck, Wrench } from 'lucide-react';
import { usps, sectionTitles } from '../content';

const uspIcons = [Clock, Shield, Wrench, BadgeCheck];

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
              <p>
                Color&apos;s Schildersbedrijf zit in Rotterdam en doet binnen- en
                buitenschilderwerk, behangen en houtrotherstel. Vakwerk met oog voor detail.
              </p>
              <p>
                We werken in heel Zuid-Holland. Vaste prijs vooraf, planning die klopt en
                een schone oplevering. U weet vooraf wat het kost en wanneer we klaar zijn.
              </p>
              <p>
                Klein klusje of het hele huis, we komen langs voor een vrijblijvende
                prijsindicatie en bespreken kleuren, materialen en planning.
              </p>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-3xl bg-bone shadow-[0_20px_60px_-20px_rgba(0,0,0,0.35)]">
              <img
                src="/about.webp"
                alt="Color's aan het werk"
                className="w-full h-auto object-cover aspect-[4/5]"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-ink text-bone rounded-2xl p-5 shadow-xl max-w-[240px]">
              <p className="font-display text-xl leading-tight">Vakwerk uit Rotterdam</p>
              <p className="mt-2 text-sm text-bone/80">Binnen, buiten, behangen</p>
              <p className="mt-1 text-sm text-rood font-medium">Garantie op het werk</p>
            </div>
          </div>
        </div>

        <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-4 gap-5 md:gap-6">
          {usps.map((usp, i) => {
            const Icon = uspIcons[i] ?? Clock;
            return (
              <div
                key={usp.title}
                className="flex flex-col gap-3 p-6 rounded-2xl border border-line bg-bone"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-rood/12 text-rood">
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
