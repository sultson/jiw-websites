import { isPreview } from './content';

export const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-52NBFYWENV';
const KEY = 'klashorst-analytics-consent-v1';
const MAX_AGE = 180 * 24 * 60 * 60 * 1000;
export type Consent = 'granted' | 'denied';
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
let consent: Consent | null = null;
let started = false;
let lastPage = '';

export function readConsent(): Consent | null {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    consent = saved && Date.now() - saved.at < MAX_AGE && ['granted', 'denied'].includes(saved.value) ? saved.value : null;
  } catch { /* Storage can be unavailable; default to no analytics. */ }
  return consent;
}

function allowed() {
  return consent === 'granted' && /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) && !isPreview
    && !new URLSearchParams(location.search).has('preview')
    && location.hostname === 'klashorstmuseum.nl';
}
function cleanReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin : ''; } catch { return ''; }
}
export function trackPage() {
  if (!allowed()) return;
  const page = location.origin + location.pathname;
  if (!started) {
    started = true;
    (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer!.push(arguments); };
    window.gtag('consent', 'default', {
      analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, {
      send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
      page_location: page, page_referrer: cleanReferrer(), cookie_expires: 60 * 60 * 24 * 180,
    });
    const script = document.createElement('script');
    script.id = 'klashorst-analytics';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.append(script);
  }
  if (lastPage === page) return;
  const referrer = lastPage || cleanReferrer();
  lastPage = page;
  window.gtag?.('set', { page_location: page, page_title: document.title, page_referrer: referrer });
  window.gtag?.('event', 'page_view', { page_location: page, page_title: document.title, page_referrer: referrer });
}
export function setConsent(value: Consent) {
  consent = value;
  try { localStorage.setItem(KEY, JSON.stringify({ value, at: Date.now() })); } catch { /* Respect the choice for this page even without storage. */ }
  if (value === 'granted') { trackPage(); return; }
  (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`;
  }
  // A reload removes the already-loaded tag and its automatic listeners.
  if (started) location.reload();
}
