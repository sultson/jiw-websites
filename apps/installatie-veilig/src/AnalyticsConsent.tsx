import {useEffect, useRef, useState} from 'react';
import {readConsent, setConsent} from './analytics';

const copy = {
  nl: {
    title: 'Help ons de website verbeteren',
    text: 'Met analytische cookies van Google Analytics zien we welke pagina’s helpen bij het kiezen van een groepenkast of laadpaal. Mogen we die gebruiken? We gebruiken ze niet voor advertenties.',
    accept: 'Toestaan', reject: 'Weigeren', settings: 'Privacy & cookies',
    details: 'We meten bezoek, contactkliks en geslaagde aanvragen, zonder namen, adressen, foto’s of formulierinhoud mee te sturen. De website werkt ook als u weigert. Uw keuze wordt in deze browser bewaard. U kunt toestemming hier altijd intrekken. Statistieken starten pas na toestemming; eerdere bezoeken worden niet alsnog gemeten. Voor vragen over uw gegevens kunt u mailen naar info@installatieveilig.nl.',
    close: 'Sluiten',
  },

};

export default function AnalyticsConsent() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false);
  useEffect(() => { const choice = readConsent(); setDecided(!!choice); setOpen(!choice); }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  const L = copy.nl;
  function choose(value: 'granted' | 'denied') { setConsent(value); setDecided(true); setOpen(false); }
  return <>
    <div className="text-white/60">
      <button type="button" className="underline text-sm p-2" onClick={() => setOpen(true)}>{L.settings}</button>
    </div>
    <dialog ref={dialogRef} aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description" onCancel={(event) => { event.preventDefault(); if (decided) setOpen(false); else choose('denied'); }} className="fixed inset-0 m-auto w-[calc(100%_-_2rem)] max-w-[440px] rounded-2xl bg-white text-stone-700 border border-stone-300 shadow-xl p-5 max-h-[85dvh] overflow-y-auto backdrop:bg-black/35">
      <h2 id="analytics-consent-title" tabIndex={-1} autoFocus className="font-display text-lg font-semibold text-ink outline-none">{L.title}</h2>
      <p id="analytics-consent-description" className="mt-2 text-sm leading-relaxed">{L.text}</p>
      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
        <button type="button" className="border border-accent-dark bg-accent text-ink rounded-xl px-3 py-2.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark" onClick={() => choose('granted')}>{L.accept}</button>
        <button type="button" className="border border-accent-dark bg-white text-ink rounded-xl px-3 py-2.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-dark" onClick={() => choose('denied')}>{L.reject}</button>
      </div>
      <details className="mt-3 text-sm"><summary className="cursor-pointer underline">{L.settings}</summary><p className="mt-2 leading-relaxed">{L.details}</p></details>
      {decided && <button type="button" className="mt-3 underline text-sm" onClick={() => setOpen(false)}>{L.close}</button>}
    </dialog>
  </>;
}
