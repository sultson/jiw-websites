import { Clock, Shield, Sparkles, BadgeCheck } from 'lucide-react';
import { usps } from '../content';

const icons = [Clock, Shield, Sparkles, BadgeCheck];

export default function UspStrip() {
  return (
    <section className="bg-ink text-bone py-10 md:py-12">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {usps.map((usp, i) => {
            const Icon = icons[i] ?? Clock;
            return (
              <div key={usp.title} className="flex items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rood/15 text-rood">
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <div>
                  <p className="font-display text-base md:text-lg text-bone leading-tight">
                    {usp.title}
                  </p>
                  <p className="text-bone/70 text-sm mt-1 leading-snug">{usp.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
