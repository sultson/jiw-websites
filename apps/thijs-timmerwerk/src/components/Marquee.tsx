type Props = { t: (k: string) => string };

const serviceKeys = [
  'svc.verbouw',
  'svc.badkamer',
  'svc.keuken',
  'svc.dak',
  'svc.kozijnen',
  'svc.maatwerk',
];

export default function Marquee({ t }: Props) {
  const items = [...serviceKeys.map((k) => t(k)), t('marquee.tagline')];

  const Sequence = () => (
    <div className="flex items-center shrink-0" aria-hidden>
      {items.map((label, i) => (
        <div key={i} className="flex items-center">
          <span className="px-7 py-4 text-[14px] sm:text-[15px] font-bold text-white/90 whitespace-nowrap">
            {label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-spark shrink-0" />
        </div>
      ))}
    </div>
  );

  return (
    <section
      className="marquee relative overflow-hidden bg-cobalt-ink border-y border-cobalt-ink-soft"
      aria-label={t('marquee.tagline')}
    >
      <div className="marquee-track">
        <Sequence />
        <Sequence />
      </div>

      {/* edge fades */}
      <div
        className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cobalt-ink to-transparent pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-cobalt-ink to-transparent pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
