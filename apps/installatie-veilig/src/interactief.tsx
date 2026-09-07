import {useId, useRef, useState} from 'react';
import {ArrowRight, Check} from 'lucide-react';
import {useInBeeld, useZachteWaarde} from './anim';

/* ================================================================== */
/*  Verbruiksmeter: hoeveel kunt u tegelijk aan?                       */
/* ================================================================== */

const APPARATEN = [
  {id: 'inductie', naam: 'Inductie koken', kw: 7.4},
  {id: 'warmtepomp', naam: 'Warmtepomp', kw: 3.0},
  {id: 'auto', naam: 'Auto laden', kw: 7.4, kw3: 11},
  {id: 'boiler', naam: 'Boiler', kw: 2.0},
  {id: 'wasmachine', naam: 'Wasmachine', kw: 2.2},
  {id: 'vaatwasser', naam: 'Vaatwasser', kw: 2.0},
  {id: 'droger', naam: 'Droger', kw: 2.5},
  {id: 'airco', naam: 'Airco', kw: 1.5},
];

/* 230 V per fase, dus vermogen = fasen x ampere x 230 / 1000. */
const grens = (fase: 1 | 3, ampere: 25 | 35) => (fase * ampere * 230) / 1000;

export function Verbruiksmeter() {
  const [fase, setFase] = useState<1 | 3>(1);
  const [ampere, setAmpere] = useState<25 | 35>(25);
  const [aan, setAan] = useState<string[]>(['inductie', 'wasmachine']);

  const limiet = grens(fase, ampere);
  const totaal = APPARATEN
    .filter((a) => aan.includes(a.id))
    .reduce((s, a) => s + (fase === 3 && a.kw3 ? a.kw3 : a.kw), 0);

  /* De schaal loopt door tot anderhalf keer de grens, zodat overschrijden
     zichtbaar is in plaats van dat de meter simpelweg vol staat. */
  const schaal = limiet * 1.5;
  const deel = Math.min(1, totaal / schaal);
  const zacht = useZachteWaarde(deel);
  const zachtTotaal = useZachteWaarde(totaal);
  const grensDeel = limiet / schaal;

  const vol = totaal / limiet;
  const kleur = vol > 1 ? 'var(--color-hot)' : vol > 0.85 ? 'var(--color-warm)' : 'var(--color-accent)';
  const hoek = -90 + zacht * 180;

  const oordeel =
    vol > 1
      ? fase === 1
        ? 'Dit past niet op uw aansluiting. Uw hoofdzekering gaat eruit. Verzwaren naar 3-fase is hier de oplossing.'
        : 'Dit past niet op 3 x ' + ampere + 'A. Een zwaardere aansluiting is nodig, of niet alles tegelijk.'
      : vol > 0.85
      ? 'Dit past net, maar u zit tegen uw grens aan. Komt er nog iets bij, dan vliegt de hoofdzekering eruit.'
      : 'Hier heeft u ruimte over. Deze combinatie kan probleemloos tegelijk aan.';

  return (
    <div className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:p-8">
      <div className="grid gap-8 lg:grid-cols-[20rem_1fr] lg:gap-12">
        {/* Meter */}
        <div>
          <svg viewBox="0 0 260 168" className="w-full" role="img" aria-label={`Verbruiksmeter: ${totaal.toFixed(1)} kilowatt van maximaal ${limiet.toFixed(1)}`}>
            <path
              d="M30 140 A 100 100 0 0 1 230 140"
              fill="none"
              stroke="rgb(255 255 255 / 0.12)"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M30 140 A 100 100 0 0 1 230 140"
              fill="none"
              stroke={kleur}
              strokeWidth="16"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${zacht * 100} 100`}
              style={{transition: 'stroke 0.4s ease'}}
            />
            {/* Streepje op de grens van de aansluiting */}
            <g transform={`rotate(${-90 + grensDeel * 180} 130 140)`}>
              <line x1="130" y1="30" x2="130" y2="50" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            </g>
            {/* Wijzer */}
            <g transform={`rotate(${hoek} 130 140)`}>
              <line x1="130" y1="140" x2="130" y2="56" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" />
            </g>
            <circle cx="130" cy="140" r="8" fill="#ffffff" />
            <text x="130" y="112" textAnchor="middle" className="fill-white text-[30px] font-bold" style={{fontFamily: 'JetBrains Mono, monospace'}}>
              {zachtTotaal.toFixed(1)}
            </text>
            <text x="130" y="132" textAnchor="middle" className="fill-white/45 text-[12px] font-semibold">kW tegelijk</text>
          </svg>

          <p className="mt-2 text-center text-xs text-white/40">
            Het witte streepje is uw maximum: <span className="data">{limiet.toFixed(1)}</span> kW
          </p>

          <div
            className="mt-5 rounded-xl border p-4 text-sm leading-relaxed transition"
            style={{
              borderColor: vol > 1 ? 'rgb(255 84 73 / 0.45)' : vol > 0.85 ? 'rgb(255 176 32 / 0.45)' : 'rgb(69 214 47 / 0.4)',
              background: vol > 1 ? 'rgb(255 84 73 / 0.08)' : vol > 0.85 ? 'rgb(255 176 32 / 0.08)' : 'rgb(69 214 47 / 0.08)',
            }}
          >
            <p className="text-white/85">{oordeel}</p>
            {vol > 1 && fase === 1 && (
              <a href="#aanvraag" className="mt-3 inline-flex items-center gap-1.5 font-semibold text-white hover:underline">
                Vraag verzwaring aan <ArrowRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Bediening */}
        <div>
          <div className="flex flex-wrap gap-3">
            <div className="inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1">
              {([1, 3] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFase(f)}
                  aria-pressed={fase === f}
                  className={`data rounded-full px-5 py-2 text-sm font-bold transition ${
                    fase === f ? 'bg-accent text-ink' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {f} fase
                </button>
              ))}
            </div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/[0.06] p-1">
              {([25, 35] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => setAmpere(a)}
                  aria-pressed={ampere === a}
                  className={`data rounded-full px-5 py-2 text-sm font-bold transition ${
                    ampere === a ? 'bg-white/90 text-ink' : 'text-white/55 hover:text-white'
                  }`}
                >
                  {fase} x {a}A
                </button>
              ))}
            </div>
          </div>

          <p className="mt-6 text-sm font-semibold text-white/80">Wat staat er bij u tegelijk aan?</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {APPARATEN.map((a) => {
              const actief = aan.includes(a.id);
              const kw = fase === 3 && a.kw3 ? a.kw3 : a.kw;
              return (
                <button
                  key={a.id}
                  onClick={() => setAan((v) => (actief ? v.filter((x) => x !== a.id) : [...v, a.id]))}
                  aria-pressed={actief}
                  className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-medium transition ${
                    actief
                      ? 'border-accent bg-accent/15 text-white'
                      : 'border-white/15 bg-white/[0.04] text-white/55 hover:border-white/35 hover:text-white'
                  }`}
                >
                  {actief && <Check className="h-3.5 w-3.5 text-accent" strokeWidth={3} />}
                  {a.naam}
                  <span className="data text-xs text-white/45">{kw.toString().replace('.', ',')} kW</span>
                </button>
              );
            })}
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {[
              {l: 'Uw aansluiting', w: `${fase} x ${ampere}A`},
              {l: 'Maximaal', w: `${limiet.toFixed(1).replace('.', ',')} kW`},
              {l: 'Nu gekozen', w: `${totaal.toFixed(1).replace('.', ',')} kW`},
            ].map((s) => (
              <div key={s.l} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <p className="text-xs text-white/45">{s.l}</p>
                <p className="data mt-0.5 text-lg font-bold text-white">{s.w}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Laadtijd: hoe snel is uw auto vol?                                 */
/* ================================================================== */

const SNELHEDEN = [
  {kw: 3.7, label: '1-fase, 16A', fase: '1-fase'},
  {kw: 7.4, label: '1-fase, 32A', fase: '1-fase'},
  {kw: 11, label: '3-fase, 16A', fase: '3-fase'},
  {kw: 22, label: '3-fase, 32A', fase: '3-fase'},
];

const uren = (u: number) => {
  const heel = Math.floor(u);
  const min = Math.round((u - heel) * 60);
  if (heel === 0) return `${min} min`;
  return min === 0 ? `${heel} uur` : `${heel} uur ${min} min`;
};

export function Laadtijd() {
  const [accu, setAccu] = useState(60);
  const [ref, zichtbaar] = useInBeeld<HTMLDivElement>();

  /* Van 20 naar 80 procent: het stuk waar thuisladen over gaat. */
  const nodig = accu * 0.6;
  const traagste = nodig / SNELHEDEN[0].kw;

  return (
    <div ref={ref} className="rounded-2xl border border-white/12 bg-white/[0.04] p-6 sm:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold text-white">Hoe lang staat uw auto aan de laadpaal?</h3>
          <p className="mt-1 text-sm text-white/55">Van 20 naar 80 procent, het stuk waar thuisladen over gaat.</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/45">Accu</p>
          <p className="data text-3xl font-bold text-accent">{accu} kWh</p>
        </div>
      </div>

      <label className="mt-5 block">
        <span className="sr-only">Grootte van de accu in kilowattuur</span>
        <input
          type="range" min={20} max={110} step={5}
          value={accu}
          onChange={(e) => setAccu(Number(e.target.value))}
          className="schuif"
        />
      </label>
      <div className="data mt-1 flex justify-between text-[11px] text-white/35">
        <span>20 kWh</span><span>65 kWh</span><span>110 kWh</span>
      </div>

      <div className="mt-7 space-y-3">
        {SNELHEDEN.map((s, i) => {
          const t = nodig / s.kw;
          const breedte = zichtbaar ? Math.max(6, (t / traagste) * 100) : 0;
          return (
            <div key={s.kw}>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <span className="font-semibold text-white">
                  <span className="data">{s.kw.toString().replace('.', ',')} kW</span>
                  <span className="ml-2 font-normal text-white/45">{s.label}</span>
                </span>
                <span className="data shrink-0 font-bold text-white">{uren(t)}</span>
              </div>
              <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${breedte}%`,
                    background: s.fase === '3-fase'
                      ? 'linear-gradient(90deg, #45d62f, #1e8f12)'
                      : 'linear-gradient(90deg, rgb(255 255 255 / 0.45), rgb(255 255 255 / 0.2))',
                    transition: `width 1s cubic-bezier(.22,.61,.36,1) ${i * 90}ms`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ================================================================== */
/*  Voor en na: hetzelfde werk, van dezelfde plek gefotografeerd       */
/* ================================================================== */

export function VoorNa({
  voor, na, voorAlt, naAlt, titel, tekst,
}: {
  voor: string;
  na: string;
  voorAlt: string;
  naAlt: string;
  titel: string;
  tekst: string;
}) {
  const [x, setX] = useState(50);
  const houder = useRef<HTMLDivElement>(null);
  const sleept = useRef(false);
  /* Er staan er twee op de pagina, dus het label mag geen vast id hebben. */
  const id = useId();

  const zet = (clientX: number) => {
    const el = houder.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setX(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  return (
    <div>
      {/* Een muisklik OP een foto start in de browser een eigen sleepactie
          (het plaatje naar een ander venster trekken). Die slikt de
          mousemove op, en dan blijft de greep staan. Vandaar pointer
          events met preventDefault, draggable uit en pointer capture:
          alle beweging blijft bij deze balk, ook buiten het kader. */}
      <div
        ref={houder}
        className="relative aspect-[3/4] w-full touch-pan-y cursor-ew-resize select-none overflow-hidden rounded-2xl border border-white/12"
        onPointerDown={(e) => {
          e.preventDefault();
          sleept.current = true;
          e.currentTarget.setPointerCapture?.(e.pointerId);
          zet(e.clientX);
        }}
        onPointerMove={(e) => sleept.current && zet(e.clientX)}
        onPointerUp={(e) => {
          sleept.current = false;
          e.currentTarget.releasePointerCapture?.(e.pointerId);
        }}
        onPointerCancel={() => (sleept.current = false)}
      >
        <img src={na} alt={naAlt} loading="lazy" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
        {/* Wegsnijden in plaats van smaller maken: zo blijft de voor-foto op
            volle breedte staan en schuift alleen de rand mee. */}
        <img
          src={voor} alt={voorAlt} loading="lazy" draggable={false}
          className="absolute inset-0 h-full w-full object-cover"
          style={{clipPath: `inset(0 ${100 - x}% 0 0)`}}
        />

        <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-ink/75 px-3 py-1 text-xs font-bold text-white backdrop-blur">
          Voor
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-accent px-3 py-1 text-xs font-bold text-ink">
          Na
        </span>

        <div className="pointer-events-none absolute inset-y-0" style={{left: `${x}%`}}>
          <div className="h-full w-0.5 -translate-x-1/2 bg-white/90" />
          <div className="absolute top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-2 border-white bg-ink/85 text-white backdrop-blur">
            <span className="text-xs font-bold">&#8596;</span>
          </div>
        </div>
      </div>

      <h4 className="mt-5 text-lg font-semibold">{titel}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-white/65">{tekst}</p>

      <label className="sr-only" htmlFor={id}>Schuif tussen de foto voor en na: {titel}</label>
      <input
        id={id} type="range" min={0} max={100} value={x}
        onChange={(e) => setX(Number(e.target.value))}
        className="schuif mt-4"
      />
    </div>
  );
}

/* ================================================================== */
/*  Tijdlijn die zich vult terwijl u scrollt                           */
/* ================================================================== */

export function Tijdlijn({
  stappen,
}: {
  stappen: {icon: React.ComponentType<{className?: string; strokeWidth?: number}>; titel: string; tekst: string}[];
}) {
  const [ref, zichtbaar] = useInBeeld<HTMLDivElement>('0px 0px -20% 0px');

  return (
    <div ref={ref} className="relative">
      {/* De lijn die zich vult zodra het blok in beeld komt */}
      <div className="absolute left-[1.4rem] top-4 hidden h-[calc(100%-2rem)] w-px bg-line sm:block lg:left-0 lg:top-[1.4rem] lg:h-px lg:w-full">
        <div
          className="h-full w-px bg-accent-dark lg:h-px lg:w-full"
          style={{
            transform: zichtbaar ? 'scale(1)' : 'scale(0)',
            transformOrigin: 'top left',
            transition: 'transform 1.6s cubic-bezier(.22,.61,.36,1)',
          }}
        />
      </div>

      <ol className="relative grid gap-6 lg:grid-cols-4">
        {stappen.map((s, i) => (
          <li
            key={s.titel}
            className="reveal reveal-op sm:pl-16 lg:pl-0"
            style={{transitionDelay: `${i * 140}ms`, ...(zichtbaar ? {opacity: 1, transform: 'none'} : {})}}
          >
            <span
              className={`data absolute left-0 grid h-11 w-11 place-items-center rounded-full border-4 border-mist text-sm font-bold transition-colors duration-500 sm:mt-1 lg:relative lg:mb-5 ${
                zichtbaar ? 'bg-ink text-white' : 'bg-line text-ink-muted'
              }`}
              style={{transitionDelay: `${i * 140 + 250}ms`}}
            >
              {i + 1}
            </span>
            <div className="rounded-2xl border border-line bg-white p-6">
              <s.icon className="h-5 w-5 text-accent-dark" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold">{s.titel}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted">{s.tekst}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
