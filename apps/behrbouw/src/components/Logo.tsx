export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <a href="#top" className="inline-flex flex-col leading-none" aria-label="BEHR Bouw en Installatietechniek, naar boven">
      <span
        className={`display text-[1.7rem] leading-none ${dark ? 'text-ink' : 'text-white'}`}
      >
        BEHR<span className="ml-1 inline-block h-[0.55em] w-[0.55em] rounded-[3px] bg-oranje align-baseline" />
      </span>
      <span className={`mt-1 text-[0.55rem] font-bold uppercase tracking-[0.28em] ${dark ? 'text-ink/60' : 'text-white/60'}`}>
        Bouw | Installatietechniek
      </span>
    </a>
  );
}
