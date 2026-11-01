const words = [
  'Aanvullend op de reguliere zorg',
  'Gericht op ontspanning',
  'Ondersteunen van welzijn',
  'Speciaal opgeleide therapeuten',
  'Een landelijk netwerk',
];

export default function Marquee() {
  const Sequence = () => (
    <div className="flex items-center shrink-0" aria-hidden>
      {words.map((label, i) => (
        <div key={i} className="flex items-center">
          <span className="px-7 py-4 font-display text-[18px] sm:text-[21px] text-cream/90 whitespace-nowrap">
            {label}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose shrink-0" />
        </div>
      ))}
    </div>
  );

  return (
    <section className="marquee relative overflow-hidden bg-terra-ink" aria-label={words.join(', ')}>
      <div className="marquee-track">
        <Sequence />
        <Sequence />
      </div>
      <div
        className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-terra-ink to-transparent pointer-events-none"
        aria-hidden
      />
      <div
        className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-terra-ink to-transparent pointer-events-none"
        aria-hidden
      />
    </section>
  );
}
