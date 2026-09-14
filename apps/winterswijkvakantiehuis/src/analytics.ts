import {SITE_URL} from './site';

export const MEASUREMENT_ID = 'G-J9G5MV9W28';
const CONSENT_KEY = 'ww-analytics-consent-v1';
type Consent = 'granted' | 'denied';
type Context = {site_language: string; page_type: string; destination: string; home_id: string};
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}
let context: Context = {site_language: 'nl', page_type: 'landing', destination: 'winterswijk', home_id: 'none'};
let currentPath = '/';
let lastPage = '';
let started = false;
let consent: Consent | null = null;

export function readConsent(): Consent | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    consent = value === 'granted' || value === 'denied' ? value : null;
  } catch { /* A blocked storage area must not prevent booking or consent. */ }
  return consent;
}

function allowed() { return consent === 'granted' && typeof window !== 'undefined'; }

/** Only controlled campaign labels survive; never forward arbitrary query values. */
function pageLocation() {
  const url = new URL(currentPath, SITE_URL);
  const input = new URLSearchParams(window.location.search);
  const allowedValues: Record<string, string[]> = {
    utm_source: ['google', 'bing', 'facebook', 'instagram', 'newsletter', 'qr'],
    utm_medium: ['organic', 'social', 'email', 'referral', 'offline'],
    utm_campaign: ['business_profile', 'startpakket', 'reviewkaart'],
  };
  for (const [key, values] of Object.entries(allowedValues)) {
    const value = input.get(key);
    if (value && values.includes(value)) url.searchParams.set(key, value);
  }
  return url.href;
}

function start() {
  if (!allowed() || started) return;
  started = true;
  (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = false;
  window.dataLayer = [];
  // gtag expects an Arguments object rather than an array.
  window.gtag = function () { window.dataLayer!.push(arguments); };
  window.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
  });
  window.gtag('js', new Date());
  let referrer = '';
  try { referrer = document.referrer ? new URL(document.referrer).origin : ''; } catch { /* Invalid referrer. */ }
  window.gtag('config', MEASUREMENT_ID, {
    send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
    ...(location.hostname === '127.0.0.1' || location.hostname === 'localhost' ? {debug_mode: true} : {}),
    page_location: pageLocation(), page_referrer: referrer,
  });
  const script = document.createElement('script');
  script.id = 'ww-analytics'; script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.append(script);
}

export function trackPage(path: string, details: Context) {
  currentPath = path;
  context = details;
  if (!allowed() || details.page_type === 'notFound') return;
  try {
    start();
    if (lastPage === path) return;
    lastPage = path;
    window.gtag?.('set', {page_location: pageLocation(), page_title: document.title, ...context});
    window.gtag?.('event', 'page_view', {page_location: pageLocation(), page_title: document.title, ...context});
  } catch { /* Analytics must not interrupt navigation or rendering. */ }
}

export function trackEvent(name: 'contact_click' | 'availability_click' | 'generate_lead', method?: 'whatsapp' | 'phone' | 'email' | 'form') {
  if (!allowed()) return;
  try {
    start();
    window.gtag?.('event', name, {...context, ...(method ? {contact_method: method} : {})});
  } catch { /* Measurement failure must never change a successful enquiry or block contact. */ }
}

export function setConsent(value: Consent) {
  consent = value;
  try { localStorage.setItem(CONSENT_KEY, value); } catch { /* Current-page choice still works. */ }
  if (value === 'granted') {
    trackPage(currentPath, context);
    return;
  }
  (window as unknown as Record<string, unknown>)[`ga-disable-${MEASUREMENT_ID}`] = true;
  window.dataLayer = [];
  document.getElementById('ww-analytics')?.remove();
  // Expire GA cookies on both host-only and parent domains.
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^_ga(?:_|$)/.test(name)) continue;
    document.cookie = `${name}=; Max-Age=0; path=/`;
    const parts = location.hostname.split('.');
    for (let i = 0; i < parts.length - 1; i++) {
      document.cookie = `${name}=; Max-Age=0; path=/; domain=.${parts.slice(i).join('.')}`;
    }
  }
  // Unload Google's listeners after withdrawal; the next page loads without a tag.
  if (started) window.location.reload();
}

export function trackContactLink(event: MouseEvent) {
  if (event.button !== 0 || !allowed()) return;
  const target = event.target instanceof Element ? event.target.closest('a') : null;
  if (!target) return;
  const href = target.getAttribute('href') || '';
  if (href.startsWith('tel:')) trackEvent('contact_click', 'phone');
  else if (href.startsWith('mailto:')) trackEvent('contact_click', 'email');
  else {
    try {
      const url = new URL(href, location.origin);
      if (url.hostname === 'wa.me' || url.hostname === 'api.whatsapp.com') trackEvent('contact_click', 'whatsapp');
      else if (url.hostname === 'www.huurkalender.nl' || url.hostname === 'huurkalender.nl' || ['#availability', '#house-availability'].includes(url.hash)) trackEvent('availability_click');
    } catch { /* Not a navigable URL. */ }
  }
}
