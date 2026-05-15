import { Zap, UserCheck, Handshake, ShieldCheck, type LucideIcon } from 'lucide-react';
import { sectionTitles, usps } from '../content';

const icons: LucideIcon[] = [Zap, UserCheck, Handshake, ShieldCheck];

export default function UspStrip() {
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

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {usps.map((usp, i) => {
            const Icon = icons[i];
            return (
              <div
                key={usp.title}
                className="card p-6 md:p-7 transition duration-200 hover:-translate-y-1 hover:border-gold hover:shadow-lg hover:shadow-black/30"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                  <Icon size={22} strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{usp.title}</h3>
                <p className="mt-2 text-bone-soft">{usp.body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
