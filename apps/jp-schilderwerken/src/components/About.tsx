import { Clock, Shield, Coffee, GraduationCap, ExternalLink } from 'lucide-react';
import { usps, sectionTitles, business } from '../content';

const uspIcons = [Clock, Shield, Coffee, GraduationCap];

export default function About() {
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
                JP Schilderwerken is opgericht in {business.founded} door Justin Pothuizen.
                Het bedrijf draait nu bijna twee jaar zelfstandig in en rond Houten.
              </p>
              <p>
                Het vak heb ik geleerd van mijn vader. Vier tot vijf jaar heb ik met hem
                meegelopen bij {business.fatherCompany.name} voordat ik mijn eigen bedrijf
                startte. Daarnaast rondde ik de schildersschool af op niveau 3 en mag ik mij
                gezel schilder noemen.
              </p>
              <p>
                U krijgt persoonlijk contact, een eerlijke prijs en strak werk. Geen rommel,
                geen verrassingen. Gewoon netjes opleveren.
              </p>
            </div>

            <p className="mt-8 font-display italic text-lg text-ink">Justin</p>

            <a
              href={business.fatherCompany.url}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-saffron-deep border-b border-saffron pb-0.5"
            >
              Bekijk {business.fatherCompany.name}
              <ExternalLink size={14} strokeWidth={2} />
            </a>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-2xl bg-bone shadow-[0_20px_60px_-20px_rgba(26,26,26,0.35)]">
              <img
                src="/jp-car-square.webp"
                alt="JP Schilderwerken bus onderweg"
                className="w-full h-auto object-cover aspect-square md:aspect-[4/5]"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div className="absolute -bottom-6 -left-4 md:-left-8 bg-ink text-bone rounded-2xl p-5 shadow-xl max-w-[260px]">
              <p className="font-display text-xl leading-tight">Vader op zoon</p>
              <p className="mt-2 text-sm text-bone/80">
                {business.yearsCombined}+ jaar eigen ervaring
              </p>
              <p className="mt-1 text-sm text-saffron font-medium">
                Niveau 3 &middot; Gezel schilder
              </p>
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
