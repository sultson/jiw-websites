/**
 * De galerij: alle beelden van de drie stichtingen bij elkaar, met een echt
 * bijschrift onder elk beeld in plaats van een naamloos raster.
 *
 * De beelden worden niet bijgesneden. Hun foto's lopen van staand telefoonbeeld
 * tot liggend landschap, en in een raster met een vaste verhouding valt van een
 * staande foto de helft weg. Daarom kolommen: elk beeld houdt zijn eigen vorm en
 * de kolom vult zichzelf.
 *
 * Klikken opent hetzelfde beeld groot, met het bijschrift ernaast. Dat venster
 * is met het toetsenbord te bedienen: pijltjes bladeren, Escape sluit.
 */

import {useCallback, useEffect, useRef, useState} from 'react';
import {GALERIJ, STICHTINGEN, ZEGEL_KLEUR, type Beeld, type Herkomst} from './data';
import {Link, Zegel} from './ui';
import {useT} from './taal';
import T from './tekst';
import {PaginaKop} from './Paginas';
import {ArrowRight, ChevronLeft, ChevronRight, X, ZoomIn} from 'lucide-react';

/* De herkomst van een beeld krijgt een eigen kleur, zodat in een oogopslag te
   zien is wat hun eigen foto is en wat niet. */
const HERKOMST_KLEUR: Record<Herkomst, string> = {
  eigen: '#b89838',
  archief: '#16375a',
  sfeer: '#6f5b44',
  concept: '#a4482f',
};

function stichtingVan(b: Beeld) {
  return b.wie ? STICHTINGEN.find((x) => x.id === b.wie) : undefined;
}

/* ------------------------------------------------------------------- kaart */

function Kaart({b, openen}: {b: Beeld; openen: () => void}) {
  const t = useT();
  const s = stichtingVan(b);
  const accent = s?.accent ?? '#b89838';

  return (
    <figure className="mb-6 break-inside-avoid bg-white/60">
      <button
        type="button"
        onClick={openen}
        aria-label={`${t(T.galerij.open)}: ${t(b.titel)}`}
        className="group relative block w-full overflow-hidden">
        <img
          src={b.src}
          alt={t(b.alt)}
          width={b.b}
          height={b.h}
          loading="lazy"
          className="w-full transition duration-700 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-end justify-end p-3 opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
          <span className="rounded-full bg-nacht-diep/80 p-2.5 text-zand">
            <ZoomIn size={17} />
          </span>
        </span>
      </button>

      <figcaption className="px-5 pb-5 pt-5">
        <h2 className="text-[1.3rem] leading-snug">{t(b.titel)}</h2>
        <p className="mt-2 text-[0.95rem] leading-relaxed text-grijs">{t(b.tekst)}</p>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.78rem]">
          {s && (
            <span className="inline-flex items-center gap-1.5 font-semibold text-inkt">
              <Zegel vorm={s.logoKern} maat={15} kleur={ZEGEL_KLEUR} />
              {t(s.kort)}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 text-grijs/85">
            <span aria-hidden className="size-1.5 rounded-full" style={{background: HERKOMST_KLEUR[b.herkomst]}} />
            {t(T.galerij[b.herkomst])}
          </span>
        </p>
      </figcaption>
      <span aria-hidden className="block h-1 w-full" style={{background: accent}} />
    </figure>
  );
}

/* --------------------------------------------------------------- vergroting */

function Vergroot({i, zet, sluit}: {i: number; zet: (n: number) => void; sluit: () => void}) {
  const t = useT();
  const b = GALERIJ[i];
  const s = stichtingVan(b);
  const sluitKnop = useRef<HTMLButtonElement>(null);

  const vorige = useCallback(() => zet((i - 1 + GALERIJ.length) % GALERIJ.length), [i, zet]);
  const volgende = useCallback(() => zet((i + 1) % GALERIJ.length), [i, zet]);

  useEffect(() => {
    const toets = (e: KeyboardEvent) => {
      if (e.key === 'Escape') sluit();
      else if (e.key === 'ArrowLeft') vorige();
      else if (e.key === 'ArrowRight') volgende();
    };
    window.addEventListener('keydown', toets);
    /* De pagina eronder mag niet meescrollen zolang dit venster openstaat. */
    const eerder = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', toets);
      document.body.style.overflow = eerder;
    };
  }, [sluit, vorige, volgende]);

  useEffect(() => {
    sluitKnop.current?.focus();
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t(T.galerij.kicker)}
      onClick={sluit}
      className="fixed inset-0 z-[60] flex flex-col bg-nacht-diep/96 backdrop-blur-sm">
      <div className="ruim flex shrink-0 items-center justify-between gap-4 py-4">
        <p className="text-[0.85rem] text-zand/60">
          {i + 1} {t(T.galerij.van)} {GALERIJ.length}
        </p>
        <button
          ref={sluitKnop}
          type="button"
          onClick={sluit}
          aria-label={t(T.galerij.sluiten)}
          className="rounded-full border border-white/25 p-2.5 text-zand transition hover:border-goud hover:text-goud-licht">
          <X size={18} />
        </button>
      </div>

      {/* De bladerknoppen staan tegen de randen van het venster en niet in de
          rij zelf: naast het beeld duwen ze de tekst weg zodra het beeld breed
          is, en dan lopen ze eroverheen. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          vorige();
        }}
        aria-label={t(T.galerij.vorige)}
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/25 bg-nacht-diep/70 p-3 text-zand transition hover:border-goud hover:text-goud-licht sm:block">
        <ChevronLeft size={20} />
      </button>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          volgende();
        }}
        aria-label={t(T.galerij.volgende)}
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-white/25 bg-nacht-diep/70 p-3 text-zand transition hover:border-goud hover:text-goud-licht sm:block">
        <ChevronRight size={20} />
      </button>

      <div
        onClick={(e) => e.stopPropagation()}
        className="mx-auto flex min-h-0 w-full max-w-[88rem] flex-1 flex-col items-center gap-6 overflow-y-auto px-5 pb-8 sm:px-20 lg:flex-row lg:items-center lg:gap-12 lg:overflow-hidden">
        <img
          src={b.src}
          alt={t(b.alt)}
          width={b.b}
          height={b.h}
          className="max-h-[52vh] w-auto max-w-full shrink object-contain lg:max-h-[78vh] lg:min-w-0 lg:flex-1"
        />

        <div className="w-full max-w-md text-zand lg:w-[22rem] lg:shrink-0">
          <h2 className="text-[1.6rem] leading-snug text-zand">{t(b.titel)}</h2>
          <p className="mt-3 leading-relaxed text-zand/70">{t(b.tekst)}</p>
          <p className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.8rem]">
            {s && (
              <span className="inline-flex items-center gap-1.5 font-semibold text-zand">
                <Zegel vorm={s.logoKern} maat={16} kleur={ZEGEL_KLEUR} />
                {t(s.kort)}
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 text-zand/55">
              <span aria-hidden className="size-1.5 rounded-full" style={{background: HERKOMST_KLEUR[b.herkomst]}} />
              {t(T.galerij[b.herkomst])}
            </span>
          </p>

          {/* Op een telefoon staan de pijlknoppen niet naast het beeld, daar
              zijn ze te klein om te raken. Hier staan ze als brede knoppen. */}
          <div className="mt-6 flex gap-3 sm:hidden">
            <button
              type="button"
              onClick={vorige}
              aria-label={t(T.galerij.vorige)}
              className="flex-1 rounded-full border border-white/25 py-3 text-zand">
              <ChevronLeft size={18} className="mx-auto" />
            </button>
            <button
              type="button"
              onClick={volgende}
              aria-label={t(T.galerij.volgende)}
              className="flex-1 rounded-full border border-white/25 py-3 text-zand">
              <ChevronRight size={18} className="mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ pagina */

export function GalerijPagina() {
  const t = useT();
  const [open, setOpen] = useState<number | null>(null);

  return (
    <>
      <PaginaKop
        kicker={t(T.galerij.kicker)}
        titel={t(T.galerij.titel)}
        cursief={t(T.galerij.cursief)}
        tekst={t(T.galerij.lead)}
        grond="#1b110a"
        accent="#b89838"
        accentZacht="#e0c069"
        merk="sankofa"
      />

      <section className="wrap py-16 sm:py-24">
        <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {GALERIJ.map((b, i) => (
            <Kaart key={b.src} b={b} openen={() => setOpen(i)} />
          ))}
        </div>

        <div className="mt-10 border-l-4 border-goud bg-goud/10 p-6 sm:p-8">
          <h2 className="text-[1.5rem]">{t(T.galerij.meerKop)}</h2>
          <p className="mt-3 max-w-3xl lees text-grijs">{t(T.galerij.meerTekst)}</p>
          <Link
            naar="/contact"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-nacht px-6 py-3.5 text-sm font-semibold text-zand transition hover:bg-nacht-zacht">
            {t(T.galerij.meerKnop)} <ArrowRight size={15} aria-hidden />
          </Link>
        </div>
      </section>

      {open !== null && <Vergroot i={open} zet={setOpen} sluit={() => setOpen(null)} />}
    </>
  );
}
