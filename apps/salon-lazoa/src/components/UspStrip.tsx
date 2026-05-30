type Props = { t: (k: string) => string };

export default function UspStrip({ t }: Props) {
  const items = [
    { n: '01', title: t('usp.diamond'),   sub: t('usp.diamondSub') },
    { n: '02', title: t('usp.diploma'),   sub: t('usp.diplomaSub') },
    { n: '03', title: t('usp.google'),    sub: t('usp.googleSub') },
    { n: '04', title: t('usp.salonized'), sub: t('usp.salonizedSub') },
  ];

  return (
    <section className="bg-shoji border-y border-sumi/10">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((it, i) => (
            <div
              key={it.n}
              className={`py-8 md:py-10 px-2 md:px-6 flex flex-col gap-3 ${
                i > 0 ? 'md:border-l border-sumi/10' : ''
              } ${i === 2 ? 'border-l md:border-l border-sumi/10' : ''} ${
                i >= 2 ? 'border-t md:border-t-0 border-sumi/10' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-display text-sumi/50 text-[12px] tracking-[0.06em]">
                  {it.n}
                </span>
                <span className="block w-6 h-px bg-sumi/30" />
              </div>
              <p className="font-display text-xl md:text-2xl leading-tight text-sumi">
                {it.title}
              </p>
              <p className="text-[12px] text-sumi/55 leading-relaxed">{it.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
