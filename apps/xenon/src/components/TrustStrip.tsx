import { Clock, MapPin, Cpu, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type Props = {
  t: (key: string) => string;
};

const items: Array<{ icon: LucideIcon; key: string }> = [
  { icon: Clock,  key: 'trust.hours' },
  { icon: MapPin, key: 'trust.coverage' },
  { icon: Users,  key: 'trust.dutch' },
  { icon: Cpu,    key: 'trust.tech' },
];

export default function TrustStrip({ t }: Props) {
  return (
    <section aria-label="Kerngegevens" className="border-y border-mist bg-night-soft">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <ul className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-3 items-center">
          {items.map(({ icon: Icon, key }) => (
            <li key={key} className="flex items-center gap-2.5 text-steel/85">
              <Icon size={14} className="text-xenon-bright shrink-0" aria-hidden />
              <span className="font-display text-[12px] uppercase tracking-[0.2em]">{t(key)}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
