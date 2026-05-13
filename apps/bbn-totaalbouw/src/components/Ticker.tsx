const items = [
  'Stucwerk',
  'Schilderwerk',
  'Renovatie',
  'Badkamer',
  'Behangen',
  'Spuitwerk',
  'Vloer egaliseren',
  'Nieuwbouw',
  'Spachtelputz',
];

export default function Ticker() {
  const doubled = [...items, ...items];
  return (
    <div className="overflow-hidden border-y border-bbn-line bg-bbn-red py-4">
      <div className="ticker flex whitespace-nowrap">
        {doubled.map((it, i) => (
          <span
            key={i}
            className="flex items-center gap-6 px-6 text-base font-bold uppercase tracking-wider text-white"
          >
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-white/60" />
          </span>
        ))}
      </div>
    </div>
  );
}
