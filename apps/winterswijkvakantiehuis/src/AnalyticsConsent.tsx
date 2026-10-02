import {useEffect, useRef, useState} from 'react';
import {readConsent, setConsent} from './analytics';

const copy = {
  nl: {
    title: 'Help ons de website verbeteren',
    text: 'Met Google Analytics en Microsoft Clarity zien we welke pagina’s helpen bij het vinden van een vakantiehuis en hoe bezoekers de website gebruiken. Mogen we die gebruiken? We gebruiken ze niet voor advertenties.',
    accept: 'Toestaan', reject: 'Weigeren', settings: 'Privacy & cookies',
    details: 'Google Analytics meet bezoeken en contactkliks zonder formulierinhoud mee te sturen. Microsoft Clarity registreert interacties zoals klikken en scrollen om de website te verbeteren. De website werkt ook als u weigert. Uw keuze wordt in deze browser bewaard. U kunt toestemming hier altijd intrekken. Meting start pas na toestemming; eerdere bezoeken worden niet alsnog gemeten. Voor vragen over uw gegevens kunt u mailen naar achterhoekbooking@gmail.com.',
    close: 'Sluiten',
  },
  de: {
    title: 'Helfen Sie uns, die Website zu verbessern',
    text: 'Mit Google Analytics und Microsoft Clarity sehen wir, welche Seiten bei der Suche nach einem Ferienhaus helfen und wie Besucher die Website nutzen. Dürfen wir diese verwenden? Wir nutzen sie nicht für Werbung.',
    accept: 'Erlauben', reject: 'Ablehnen', settings: 'Datenschutz & Cookies',
    details: 'Google Analytics misst Besuche und Kontaktklicks, ohne Formularinhalte zu übertragen. Microsoft Clarity erfasst Interaktionen wie Klicks und Scrollen, damit wir die Website verbessern können. Die Website funktioniert auch bei Ablehnung. Ihre Auswahl wird in diesem Browser gespeichert. Sie können Ihre Zustimmung hier jederzeit widerrufen. Die Messung beginnt erst nach Zustimmung; frühere Besuche werden nicht nachträglich gemessen. Fragen zu Ihren Daten: achterhoekbooking@gmail.com.',
    close: 'Schließen',
  },
  en: {
    title: 'Help us improve the website',
    text: 'Google Analytics and Microsoft Clarity help us understand which pages are useful when finding a holiday home and how visitors use the website. May we use them? We do not use them for advertising.',
    accept: 'Allow', reject: 'Decline', settings: 'Privacy & cookies',
    details: 'Google Analytics measures visits and contact clicks without sending form contents. Microsoft Clarity records interactions such as clicks and scrolling to help improve the website. The website works if you decline. Your choice is saved in this browser. You can withdraw consent here at any time. Measurement starts only after permission; earlier visits are not measured retroactively. Questions about your data: achterhoekbooking@gmail.com.',
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
