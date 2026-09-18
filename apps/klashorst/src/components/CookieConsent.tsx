import { useEffect, useState } from 'react';
import { lang } from '../content';
import { readConsent, setConsent, trackPage, type Consent } from '../analytics';
import { to } from '../router';

export const COOKIE_SETTINGS_EVENT = 'klashorst-cookie-settings';
export default function CookieConsent({ path }: { path: string }) {
  const [visible, setVisible] = useState(() => readConsent() === null);
  const [choice, setChoice] = useState(readConsent);
  const t = lang === 'nl' ? {
    title: 'Uw cookievoorkeuren',
    body: 'Met uw toestemming gebruiken we Google Analytics om te zien hoeveel mensen het museum online bezoeken en welke pagina’s zij bekijken. Zonder toestemming laden we Google Analytics niet. Uw keuze wordt 6 maanden onthouden.',
    accept: 'Statistieken toestaan', reject: 'Alleen noodzakelijk', privacy: 'Privacyverklaring', close: 'Sluiten',
  } : {
    title: 'Your cookie preferences',
    body: 'With your permission, we use Google Analytics to see how many people visit the museum online and which pages they view. Without consent, we do not load Google Analytics. We remember your choice for 6 months.',
    accept: 'Allow analytics', reject: 'Necessary only', privacy: 'Privacy statement', close: 'Close',
  };
  useEffect(() => {
    const reopen = () => setVisible(true);
    const sync = () => window.location.reload();
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    const storage = (event: StorageEvent) => { if (event.key === 'klashorst-analytics-consent-v1' || event.key === null) sync(); };
    window.addEventListener('storage', storage);
    return () => { window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen); window.removeEventListener('storage', storage); };
  }, []);
  useEffect(() => { queueMicrotask(trackPage); }, [path]);
  function choose(value: Consent) { setChoice(value); setVisible(false); setConsent(value); }
  if (!visible) return null;
  return <section role="region" aria-labelledby="cookie-title" className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-h-[80dvh] max-w-3xl overflow-auto border border-hair bg-wall p-5 shadow-xl md:p-6">
    <h2 id="cookie-title" className="display text-xl">{t.title}</h2>
    <p className="mt-2 text-sm leading-relaxed text-bone">{t.body} <a className="underline underline-offset-4" href={to('/privacy')}>{t.privacy}</a></p>
    <div className="mt-4 flex flex-wrap gap-3">
      <button type="button" onClick={() => choose('denied')} className="border border-bone px-4 py-3 text-sm hover:bg-bone hover:text-ink">{t.reject}</button>
      <button type="button" onClick={() => choose('granted')} className="border border-bone px-4 py-3 text-sm hover:bg-bone hover:text-ink">{t.accept}</button>
      {choice && <button type="button" onClick={() => setVisible(false)} className="px-4 py-3 text-sm underline">{t.close}</button>}
    </div>
  </section>;
}
