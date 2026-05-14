import { Clock, Shield, Coffee, GraduationCap } from 'lucide-react';
import { usps, sectionTitles, ownerImage } from '../content';

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
              <p>
                MT Bouw is een schildersbedrijf uit Rijswijk. Tarek en Hasim doen samen
                buitenschilderwerk, kozijnen, houtrotherstel, binnenwerk en glaszetten in
                heel Zuid-Holland.
              </p>
              <p>
                Persoonlijk contact en duidelijke communicatie staan centraal. We zijn vaak
                de eerste die belt na uw aanvraag, geven een scherpe prijs en houden u
                tijdens het werk op de hoogte.
              </p>
              <p>
                Vakmanschap met 21 jaar ervaring, bekroond met Top Pro en Top Score op
                Trustoo in 2024, 2025 en 2026. 58 reviews met een 9,3.
              </p>
            </div>

            <p className="mt-8 font-display italic text-lg text-ink">Tarek &amp; team</p>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-bone shadow-[0_20px_60px_-20px_rgba(15,26,46,0.35)]">
              <img
                src={ownerImage}
                alt="Tarek van MT Bouw"
                className="w-full h-auto object-cover aspect-[4/5]"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-ink text-bone rounded-2xl p-5 shadow-xl max-w-[240px]">
              <p className="font-display text-xl leading-tight">Rijswijk en omgeving</p>
              <p className="mt-2 text-sm text-bone/80">Schilder · Bouw · Renovatie</p>
              <p className="mt-1 text-sm text-saffron font-medium">9,3 op 58 reviews</p>
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
