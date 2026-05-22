import { CalendarCheck, Sparkles, MapPin, Heart } from 'lucide-react';

type Props = { t: (k: string) => string };

const items: Array<{ icon: typeof Heart; t: string; sub: string }> = [
  { icon: CalendarCheck, t: 'usp.appointment', sub: 'usp.appointmentSub' },
  { icon: Sparkles,      t: 'usp.specialties', sub: 'usp.specialtiesSub' },
  { icon: MapPin,        t: 'usp.local',       sub: 'usp.localSub' },
  { icon: Heart,         t: 'usp.experience',  sub: 'usp.experienceSub' },
];

export default function UspStrip({ t }: Props) {
  return (
    <section className="bg-ink-2 border-y border-line">
      <div className="container-page py-8 md:py-10">
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {items.map(({ icon: Icon, t: titleKey, sub: subKey }) => (
            <li key={titleKey} className="flex items-start gap-3">
              <span
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full gold-gradient"
                aria-hidden="true"
              >
                <Icon size={18} strokeWidth={2} className="text-ink" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-bone">{t(titleKey)}</p>
                <p className="text-xs text-mute mt-0.5">{t(subKey)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
