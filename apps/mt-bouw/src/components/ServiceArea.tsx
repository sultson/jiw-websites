import { MapPin } from 'lucide-react';
import { business, sectionTitles } from '../content';

export default function ServiceArea() {
  return (
    <section id="werkgebied" className="relative overflow-hidden bg-ink text-bone">
      <video
        className="absolute inset-0 h-full w-full object-cover opacity-40"
        autoPlay
        muted
        loop
        playsInline
        poster="/google-earth-poster.jpg"
        aria-hidden="true"
      >
        <source src="/google-earth.webm" type="video/webm" />
        <source src="/google-earth.mp4" type="video/mp4" />
      </video>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-ink/80 via-ink/55 to-ink/85"
      />

      <div className="relative container-page py-24 md:py-32">
        <div className="max-w-2xl">
          <p className="eyebrow text-saffron">{sectionTitles.area.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-bone">
            {sectionTitles.area.title}
          </h2>
          <p className="mt-5 text-bone/80 text-base md:text-lg leading-relaxed">
            We werken vanuit {business.address.city} door heel Zuid-Holland. Komt uw plaats
            er niet bij voor? Bel of mail toch even, vaak komen we ook iets verder.
          </p>
        </div>

        <ul className="mt-10 flex flex-wrap gap-2 md:gap-3 max-w-3xl">
          {business.serviceArea.map((place) => (
            <li
              key={place}
              className="inline-flex items-center gap-1.5 bg-bone/10 border border-bone/15 text-bone rounded-full px-3.5 py-1.5 text-sm backdrop-blur-sm"
            >
              <MapPin size={14} className="text-saffron" />
              {place}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
