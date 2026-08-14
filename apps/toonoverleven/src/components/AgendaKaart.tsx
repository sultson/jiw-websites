import { useEffect, useRef, useState } from 'react';
import {
  CalendarDays,
  CalendarPlus,
  Check,
  ChevronRight,
  Clock,
  Copy,
  Euro,
  MapPin,
  MoreHorizontal,
  Repeat,
} from 'lucide-react';
import type { Activiteit } from '../content/types';
import { bron } from '../content';
import {
  CATEGORIE_FOTO,
  CATEGORIE_STIJL,
  dagNaam,
  ics,
  icsBestandsnaam,
  maandNaam,
  ritme,
  tijdvak,
} from '../agenda/model';
import { PLAATS, STRAAT, schrijfNaam } from '../ui';
import { SITE_URL } from '../meta';

/**
 * Eén activiteit.
 *
 * Twee vormen, dezelfde inhoud en dezelfde regels eronder: een kaart met een
 * foto erboven voor in een raster, en een brede regel voor de lijst op de
 * agendapagina. Twee losse onderdelen zouden twee plekken zijn waar de datum
 * verkeerd kan komen te staan.
 */
export default function AgendaKaart({
  activiteit,
  regel = false,
  strook = false,
}: {
  activiteit: Activiteit;
  /** De brede vorm: liggende foto links, tekst ernaast, knop rechts. */
  regel?: boolean;
  /** De smalle kaart die in een rij langs schuift. */
  strook?: boolean;
}) {
  const foto = activiteit.img ? bron(activiteit.img, 'klein') : CATEGORIE_FOTO[activiteit.categorie];

  if (regel) {
    return (
      <article className="flex flex-col gap-4 rounded-3xl border border-lijn bg-white p-4 transition hover:border-wijn/25 sm:flex-row sm:items-center sm:gap-5">
        <img
          src={foto}
          alt=""
          className="h-32 w-full flex-none rounded-2xl object-cover sm:h-24 sm:w-32"
          loading="lazy"
          decoding="async"
        />
        <div className="min-w-0 flex-1">
          <Label activiteit={activiteit} />
          <h3 className="mt-2 text-lg leading-snug">{schrijfNaam(activiteit.titel)}</h3>
          {activiteit.omschrijving && (
            <p className="mt-1 line-clamp-2 text-[15px] leading-relaxed text-inkt/70">
              {schrijfNaam(activiteit.omschrijving)}
            </p>
          )}
          <Details activiteit={activiteit} />
        </div>
        <div className="flex flex-none items-center gap-1 sm:flex-col sm:items-end sm:gap-2">
          <Hoofdknop activiteit={activiteit} />
          <Menu activiteit={activiteit} />
        </div>
      </article>
    );
  }

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-lijn bg-white transition hover:border-wijn/25">
      <div className="relative">
        <img
          src={foto}
          alt=""
          className={`w-full object-cover ${strook ? 'aspect-[16/10]' : 'aspect-[16/9]'}`}
          loading="lazy"
          decoding="async"
        />
        <span className="absolute left-3 top-3">
          <Label activiteit={activiteit} opFoto />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg leading-snug">{schrijfNaam(activiteit.titel)}</h3>
        {activiteit.omschrijving && (
          <p
            className={`mt-2 text-[15px] leading-relaxed text-inkt/70 ${
              strook ? 'line-clamp-3' : 'line-clamp-2'
            }`}
          >
            {schrijfNaam(activiteit.omschrijving)}
          </p>
        )}
        <div className="flex-1">
          <Details activiteit={activiteit} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-2 border-t border-lijn pt-4">
          <Hoofdknop activiteit={activiteit} />
          <Menu activiteit={activiteit} />
        </div>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/*  De vaste onderdelen                                                */
/* ------------------------------------------------------------------ */

function Label({ activiteit, opFoto = false }: { activiteit: Activiteit; opFoto?: boolean }) {
  const stijl = CATEGORIE_STIJL[activiteit.categorie];
  // Op een foto wint een gekleurd vlakje het niet van wat eronder ligt, dus
  // daar staat hij op wit met alleen het stipje in de kleur.
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        opFoto ? 'bg-white/95 text-inkt shadow-sm' : stijl.vlak
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${stijl.stip}`} />
      {activiteit.categorie}
    </span>
  );
}

/**
 * De regels waar iemand op afgaat: wanneer, hoe laat, waar, en of hij zich
 * moet aanmelden. Wat er niet is, staat er niet.
 */
function Details({ activiteit }: { activiteit: Activiteit }) {
  const datum = `${dagNaam(activiteit.start).slice(0, 2)} ${activiteit.start.getDate()} ${maandNaam(
    activiteit.start,
  ).slice(0, 3)}`;
  const elke = ritme(activiteit);

  const regels: { icoon: typeof Clock; tekst: string }[] = [
    { icoon: elke ? Repeat : CalendarDays, tekst: elke ?? datum },
  ];
  if (elke) regels.push({ icoon: CalendarDays, tekst: `Eerstvolgend ${datum}` });
  if (!activiteit.heleDag) regels.push({ icoon: Clock, tekst: tijdvak(activiteit) });
  // Alles is aan het Mazerhard tenzij het ergens anders is, en dat staat boven
  // de lijst. Alleen de uitzondering hoort op de kaart.
  if (activiteit.locatie) regels.push({ icoon: MapPin, tekst: activiteit.locatie });
  // Of aanmelden nodig is staat op de knop ernaast, dus niet ook nog hier.
  if (activiteit.bijdrage) regels.push({ icoon: Euro, tekst: activiteit.bijdrage });

  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[13px] text-inkt/60">
      {regels.map((r) => {
        const Icoon = r.icoon;
        return (
          <li key={r.tekst} className="flex items-center gap-1.5">
            <Icoon className="h-3.5 w-3.5 flex-none text-wijn/50" />
            {r.tekst}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Eén knop per activiteit, en die zegt wat er werkelijk te doen is. Is
 * aanmelden nodig, dan is dat de knop. Is het niet nodig, dan is er niets te
 * regelen en staat dat er, want dat is bij dit huis het hele punt.
 */
function Hoofdknop({ activiteit }: { activiteit: Activiteit }) {
  if (activiteit.aanmelden) {
    return (
      <a
        href="/contact"
        className="inline-flex items-center gap-1.5 rounded-full border border-wijn/30 px-4 py-2 text-sm font-semibold text-wijn transition hover:border-wijn hover:bg-blos"
      >
        Aanmelden <ChevronRight className="h-4 w-4" />
      </a>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-blos px-4 py-2 text-sm font-semibold text-wijn">
      Loop zo binnen
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  In je eigen agenda                                                 */
/* ------------------------------------------------------------------ */

/**
 * Achter de drie puntjes, want dit is voor wie het zoekt en niet iets om de
 * kaart mee vol te zetten.
 */
function Menu({ activiteit }: { activiteit: Activiteit }) {
  const [open, setOpen] = useState(false);
  const [gekopieerd, setGekopieerd] = useState(false);
  const houder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const buiten = (e: MouseEvent) => {
      if (!houder.current?.contains(e.target as Node)) setOpen(false);
    };
    const ontsnap = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', buiten);
    document.addEventListener('keydown', ontsnap);
    return () => {
      document.removeEventListener('mousedown', buiten);
      document.removeEventListener('keydown', ontsnap);
    };
  }, [open]);

  const plaats = activiteit.locatie || `${STRAAT}, ${PLAATS}`;

  const download = () => {
    const bestand = ics(activiteit, { url: `${SITE_URL}/agenda`, plaats });
    const blob = new Blob([bestand], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = icsBestandsnaam(activiteit);
    document.body.appendChild(link);
    link.click();
    link.remove();
    // Pas vrijgeven als de browser de download heeft opgepakt.
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setOpen(false);
  };

  const kopieer = async () => {
    const regels = [
      activiteit.titel,
      `${dagNaam(activiteit.start)} ${activiteit.start.getDate()} ${maandNaam(activiteit.start)}, ${tijdvak(activiteit)}`,
      plaats,
    ].join('\n');
    try {
      await navigator.clipboard.writeText(regels);
      setGekopieerd(true);
      setTimeout(() => setGekopieerd(false), 2000);
    } catch {
      // Zonder toestemming voor het klembord gebeurt er niets, en dat is beter
      // dan een foutmelding over iets wat de bezoeker niet kan oplossen.
    }
    setOpen(false);
  };

  return (
    <div ref={houder} className="relative flex-none">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`Opties voor ${activiteit.titel}`}
        aria-expanded={open}
        className="grid h-9 w-9 place-items-center rounded-full text-inkt/40 transition hover:bg-blos hover:text-wijn"
      >
        {gekopieerd ? <Check className="h-4 w-4 text-wijn" /> : <MoreHorizontal className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-20 mb-2 w-60 overflow-hidden rounded-2xl border border-lijn bg-white py-1 shadow-xl">
          <button
            type="button"
            onClick={download}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-inkt transition hover:bg-blos"
          >
            <CalendarPlus className="h-4 w-4 flex-none text-wijn" />
            Zet in mijn agenda
          </button>
          <button
            type="button"
            onClick={kopieer}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-inkt transition hover:bg-blos"
          >
            <Copy className="h-4 w-4 flex-none text-wijn" />
            Kopieer datum en adres
          </button>
        </div>
      )}
    </div>
  );
}
