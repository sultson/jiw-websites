import { MapPin } from 'lucide-react';
import { business, sectionTitles } from '../content';

export default function Location() {
  return (
    <section className="section bg-ink text-bone overflow-hidden">
      <div className="container-page">
        <div className="grid md:grid-cols-12 gap-10 md:gap-14 items-center">
          <div className="md:col-span-5">
            <p className="eyebrow">{sectionTitles.location.eyebrow}</p>
            <h2 className="mt-4 font-display text-4xl md:text-5xl leading-tight text-bone">
              {sectionTitles.location.title}
            </h2>
            <p className="mt-6 text-bone/75 text-base md:text-lg leading-relaxed">
              We zijn gevestigd in Houten en rijden door de hele provincie Utrecht.
              Voor een gratis kennismaking komen we graag even langs.
            </p>

            <div className="mt-8 space-y-3 text-bone/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 mt-0.5 text-saffron shrink-0" />
                <div>
                  <div className="text-bone">{business.address.street}</div>
                  <div>
                    {business.address.postalCode} {business.address.city}
                  </div>
                </div>
              </div>
            </div>

            <h3 className="mt-10 font-display text-xl text-bone">Werkgebied</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {business.serviceArea.map((place) => (
                <span
                  key={place}
                  className="border border-bone/20 rounded-full px-3 py-1 text-sm text-bone/80"
                >
                  {place}
                </span>
              ))}
            </div>
          </div>

          <div className="md:col-span-7">
            <div className="relative rounded-2xl overflow-hidden shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)]">
              <video
                src="/location-flyover.mp4"
                poster="/location-flyover-poster.webp"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                className="w-full h-full object-cover aspect-[16/10]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
