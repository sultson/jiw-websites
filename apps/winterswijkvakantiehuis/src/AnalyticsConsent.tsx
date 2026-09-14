import {useEffect, useRef, useState} from 'react';
import {readConsent, setConsent} from './analytics';

const copy = {
  nl: {
    title: 'Help ons de website verbeteren',
    text: 'Met analytische cookies van Google Analytics zien we welke pagina’s helpen bij het vinden van een vakantiehuis. Mogen we die gebruiken? We gebruiken ze niet voor advertenties.',
    accept: 'Toestaan', reject: 'Weigeren', settings: 'Privacy & cookies',
    details: 'We meten bezoek en contactkliks, zonder formulierinhoud mee te sturen. De website werkt ook als u weigert. Uw keuze wordt in deze browser bewaard. U kunt toestemming hier altijd intrekken. Statistieken starten pas na toestemming; eerdere bezoeken worden niet alsnog gemeten. Voor vragen over uw gegevens kunt u mailen naar achterhoekbooking@gmail.com.',
    close: 'Sluiten',
  },
  de: {
    title: 'Helfen Sie uns, die Website zu verbessern',
    text: 'Mit Analyse-Cookies von Google Analytics sehen wir, welche Seiten bei der Suche nach einem Ferienhaus helfen. Dürfen wir diese verwenden? Wir nutzen sie nicht für Werbung.',
    accept: 'Erlauben', reject: 'Ablehnen', settings: 'Datenschutz & Cookies',
    details: 'Wir messen Besuche und Kontaktklicks, ohne Formularinhalte zu übertragen. Die Website funktioniert auch bei Ablehnung. Ihre Auswahl wird in diesem Browser gespeichert. Sie können Ihre Zustimmung hier jederzeit widerrufen. Die Statistik beginnt erst nach Zustimmung; frühere Besuche werden nicht nachträglich gemessen. Fragen zu Ihren Daten: achterhoekbooking@gmail.com.',
    close: 'Schließen',
  },
  en: {
    title: 'Help us improve the website',
    text: 'Google Analytics cookies help us understand which pages are useful when finding a holiday home. May we use them? We do not use them for advertising.',
    accept: 'Allow', reject: 'Decline', settings: 'Privacy & cookies',
    details: 'We measure visits and contact clicks without sending form contents. The website works if you decline. Your choice is saved in this browser. You can withdraw consent here at any time. Statistics begin only after permission; earlier visits are not measured retroactively. Questions about your data: achterhoekbooking@gmail.com.',
    close: 'Close',
  },
};

export default function AnalyticsConsent({lang}: {lang: keyof typeof copy}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [decided, setDecided] = useState(false);
  useEffect(() => { const choice = readConsent(); setDecided(!!choice); setOpen(!choice); }, []);
  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
    if (!open && dialog?.open) dialog.close();
  }, [open]);
  const L = copy[lang];
  function choose(value: 'granted' | 'denied') { setConsent(value); setDecided(true); setOpen(false); }
  return <>
    <div className="bg-brand-green-dark text-center pb-5 text-brand-cream">
      <button type="button" className="underline text-sm p-2" onClick={() => setOpen(true)}>{L.settings}</button>
    </div>
    <dialog ref={dialogRef} aria-labelledby="analytics-consent-title" aria-describedby="analytics-consent-description" onCancel={() => setOpen(false)} className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-[440px] rounded-2xl bg-white text-stone-700 border border-stone-300 shadow-xl p-5 max-h-[85dvh] overflow-y-auto backdrop:bg-black/35">
      <h2 id="analytics-consent-title" tabIndex={-1} autoFocus className="font-serif text-lg font-semibold text-brand-green-dark">{L.title}</h2>
      <p id="analytics-consent-description" className="mt-2 text-sm leading-relaxed">{L.text}</p>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <button type="button" className="border border-brand-green bg-brand-green text-white rounded-xl px-3 py-2.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green" onClick={() => choose('granted')}>{L.accept}</button>
        <button type="button" className="border border-brand-green bg-white text-brand-green-dark rounded-xl px-3 py-2.5 font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-green" onClick={() => choose('denied')}>{L.reject}</button>
      </div>
      <details className="mt-3 text-sm"><summary className="cursor-pointer underline">{L.settings}</summary><p className="mt-2 leading-relaxed">{L.details}</p></details>
      {decided && <button type="button" className="mt-3 underline text-sm" onClick={() => setOpen(false)}>{L.close}</button>}
    </dialog>
  </>;
}
