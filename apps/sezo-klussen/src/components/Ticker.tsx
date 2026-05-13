const items = [
  'Stucwerk',
  'Schilderwerk',
  'Tegelwerk',
  'Badkamer',
  'Renovatie',
  'Laminaat',
  'Sausen',
  'Timmerwerk',
  'Sloopwerk',
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden bg-ink py-5 border-y border-ink-soft">
      <div className="ticker flex whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 font-display text-2xl md:text-3xl text-bone"
          >
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          </span>
        ))}
      </div>
    </div>
  );
}
