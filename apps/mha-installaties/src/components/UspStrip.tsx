import { Zap, UserCheck, type LucideIcon } from 'lucide-react';
import { sectionTitles, usps } from '../content';
import Pic from './Pic';

const regularIcons: Record<string, LucideIcon> = {
  'Snel ter plaatse': Zap,
  'Eén aanspreekpunt': UserCheck,
};

export default function UspStrip() {
  const regular = usps.filter((u) => !u.badge);
  const featured = usps.find((u) => u.badge);

  return (
    <section id="waarom" className="section bg-ink-2">
      <div className="container-page">
        <div className="max-w-2xl">
          <span className="eyebrow">{sectionTitles.usps.eyebrow}</span>
          <h2 className="mt-4 text-4xl md:text-5xl">
            Installatiewerk waar u op{' '}
            <span className="text-gradient-gold">kunt rekenen</span>.
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-rows-2">
          {regular.map((usp, idx) => {
            const Icon = regularIcons[usp.title];
            const placement =
              idx === 0
                ? 'lg:col-start-1 lg:row-start-1'
                : 'lg:col-start-1 lg:row-start-2';
            return (
              <div
                key={usp.title}
                className={`card flex flex-col justify-center p-6 md:p-7 transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-black/30 ${placement}`}
              >
                <div className="flex items-start gap-5">
                  <div className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    {Icon && <Icon size={26} strokeWidth={1.75} />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-semibold">{usp.title}</h3>
                    <p className="mt-2 text-bone-soft">{usp.body}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {featured && (
            <div className="relative overflow-hidden rounded-2xl border border-[#3387AF]/40 bg-gradient-to-b from-[#0F2E48] via-[#0C2236] to-[#1c1d1d] p-6 md:p-8 transition duration-200 hover:border-[#5199BB]/70 hover:shadow-lg hover:shadow-[#0C2236]/70 sm:col-span-2 lg:col-span-1 lg:col-start-2 lg:row-start-1 lg:row-span-2">
              <div
                className="pointer-events-none absolute -top-20 -right-12 h-64 w-64 rounded-full bg-[#3387AF]/25 blur-3xl"
                aria-hidden="true"
              />
              <div
                className="pointer-events-none absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-[#136C9E]/15 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex h-full flex-col items-center gap-6 text-center sm:flex-row sm:items-center sm:gap-8 sm:text-left lg:flex-col lg:items-center lg:justify-center lg:gap-7 lg:text-center lg:py-2">
                <Pic
                  src={featured.badge!.src}
                  alt={featured.badge!.alt}
                  width={736}
                  height={1044}
                  sizes="(min-width: 1024px) 200px, (min-width: 640px) 180px, 150px"
                  className="h-36 w-auto shrink-0 drop-shadow-[0_12px_30px_rgba(15,78,120,0.6)] sm:h-44 lg:h-52"
                  loading="lazy"
                />
                <div className="lg:max-w-sm">
                  <p className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[#9CC5DE]">
                    Kiwa keurmerk Rijksoverheid
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-bone lg:text-2xl">
                    {featured.title}
                  </h3>
                  <p className="mt-3 text-bone-soft">{featured.body}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
