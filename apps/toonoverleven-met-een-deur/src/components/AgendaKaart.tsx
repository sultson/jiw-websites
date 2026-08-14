import { useEffect, useRef, useState } from 'react';
import { CalendarPlus, Check, Copy, MoreHorizontal } from 'lucide-react';
import type { Activiteit } from '../content/types';
import { CATEGORIE_STIJL, dagNaam, ics, icsBestandsnaam, maandNaam, tijdvak } from '../agenda/model';
import { PLAATS, STRAAT, schrijfNaam } from '../ui';
import { SITE_URL } from '../meta';

/**
 * Eén activiteit.
 *
 * Twee vormen, dezelfde inhoud: `strook` is de smalle kaart die in een rij
 * langs schuift, en zonder die vlag is het een brede regel voor onder de
 * kalender. Twee losse onderdelen zouden twee plekken zijn waar de datum
 * verkeerd kan gaan staan.
 */
export default function AgendaKaart({
  activiteit,
  strook = false,
}: {
  activiteit: Activiteit;
  strook?: boolean;
}) {
  const stijl = CATEGORIE_STIJL[activiteit.categorie];

  const datumblok = (
    <div
      className={`flex flex-none flex-col items-center justify-center rounded-2xl border ${stijl.rand} bg-room-diep ${
        strook ? 'h-16 w-16' : 'h-[4.25rem] w-[4.25rem]'
      }`}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-groen/55">
        {maandNaam(activiteit.start).slice(0, 3)}
      </span>
      <span className="font-display text-2xl leading-none">{activiteit.start.getDate()}</span>
    </div>
  );

  const label = (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${stijl.vlak}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${stijl.stip}`} />
      {activiteit.categorie}
    </span>
  );

  return (
    <article
      className={`flex h-full flex-col rounded-3xl border border-lijn bg-white p-5 transition hover:border-teal/40 ${
        strook ? '' : 'md:p-6'
      }`}
    >
      <div className="flex items-start gap-4">
        {datumblok}
        <div className="min-w-0 flex-1">
          {label}
          <h3 className="mt-2 text-lg leading-snug">{schrijfNaam(activiteit.titel)}</h3>
          <p className="mt-0.5 text-sm text-groen/60">
            {dagNaam(activiteit.start)}, {tijdvak(activiteit)}
          </p>
        </div>
      </div>

      {activiteit.omschrijving && (
        <p
          className={`mt-4 flex-1 leading-relaxed text-groen/75 ${
            strook ? 'line-clamp-4 text-[15px]' : ''
          }`}
        >
          {schrijfNaam(activiteit.omschrijving)}
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-lijn pt-4">
        <p className="text-sm text-groen/60">
          {activiteit.aanmelden ? 'Even aanmelden' : 'Zo binnenlopen'}
          {activiteit.bijdrage ? ` · ${activiteit.bijdrage}` : ''}
        </p>
        <Menu activiteit={activiteit} />
      </div>
    </article>
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
        className="grid h-9 w-9 place-items-center rounded-full text-groen/45 transition hover:bg-room-diep hover:text-groen"
      >
        {gekopieerd ? <Check className="h-4 w-4 text-teal-tekst" /> : <MoreHorizontal className="h-5 w-5" />}
      </button>

      {open && (
        <div className="absolute bottom-full right-0 z-20 mb-2 w-60 overflow-hidden rounded-2xl border border-lijn bg-white py-1 shadow-xl">
          <button
            type="button"
            onClick={download}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-groen transition hover:bg-room-diep"
          >
            <CalendarPlus className="h-4 w-4 flex-none text-teal-tekst" />
            Zet in mijn agenda
          </button>
          <button
            type="button"
            onClick={kopieer}
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-[15px] text-groen transition hover:bg-room-diep"
          >
            <Copy className="h-4 w-4 flex-none text-teal-tekst" />
            Kopieer datum en adres
          </button>
        </div>
      )}
    </div>
  );
}
