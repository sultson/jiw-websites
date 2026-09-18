import assert from 'node:assert/strict';
import {readConsent, setConsent, trackPage, trackEvent, MEASUREMENT_ID} from '../src/analytics.ts';

const storage = new Map<string, string>();
const scripts: any[] = [];
let reloads = 0;
Object.assign(globalThis, {
  localStorage: {getItem: (key: string) => storage.get(key), setItem: (key: string, value: string) => storage.set(key, value)},
  location: {hostname: 'installatieveilig.nl', origin: 'https://installatieveilig.nl'},
  window: {location: {
    search: '?email=guest@example.com&message=private&text=private&utm_source=google&utm_medium=organic&utm_campaign=business_profile',
    reload: () => reloads++,
  }},
  document: {
    title: 'Installatie Veilig',
    referrer: 'https://example.com/private?email=guest@example.com',
    cookie: '_ga=sample; _ga_TEST=sample',
    createElement: () => ({remove() {}}),
    head: {append: (script: any) => scripts.push(script)},
    getElementById: () => ({remove() {}}),
  },
});
const details = {site_language: 'nl', page_type: 'landing'};
const events = () => (window.dataLayer || []).map((args: any) => Array.from(args) as any[]);
assert.equal(readConsent(), null);
trackPage('/', details);
trackEvent('contact_click', 'whatsapp');
assert.equal(scripts.length, 0, 'No analytics script before consent');
assert.equal(window.dataLayer, undefined, 'No queued pre-consent tracking');
setConsent('denied');
trackPage('/de', {...details, site_language: 'de'});
assert.equal(scripts.length, 0, 'Refusal keeps analytics unloaded');
setConsent('granted');
assert.equal(scripts.length, 1);
assert.equal(events().filter(x => x[0] === 'event' && x[1] === 'page_view').length, 1);
trackPage('/de', {...details, site_language: 'de'});
assert.equal(events().filter(x => x[0] === 'event' && x[1] === 'page_view').length, 1, 'Repeated render does not duplicate page views');
trackPage('/de/pferde', {...details, site_language: 'de', page_type: 'horses'});
trackPage('/de', {...details, site_language: 'de'});
assert.equal(events().filter(x => x[0] === 'event' && x[1] === 'page_view').length, 3, 'Real navigation back is a new page view');
trackEvent('contact_click', 'whatsapp');
const last = events().at(-1)!;
assert.equal(last[1], 'contact_click');
assert.equal(last[2].contact_method, 'whatsapp');
assert.equal(last[2].site_language, 'de');
const payload = JSON.stringify(events());
assert(!payload.includes('guest@example.com'));
assert(!payload.includes('private'));
assert(payload.includes('utm_source=google'));
assert(payload.includes('https://example.com'));
assert.equal(events().find(x => x[0] === 'config')![2].send_page_view, false);
const workingTag = window.gtag;
window.gtag = () => { throw new Error('Simulated tracker failure'); };
assert.doesNotThrow(() => trackEvent('generate_lead', 'form'), 'Tracking must not turn a successful enquiry into an error');
assert.doesNotThrow(() => trackPage('/en', {...details, site_language: 'en'}), 'Tracking must not interrupt navigation');
window.gtag = workingTag;
setConsent('denied');
assert.equal((window as any)[`ga-disable-${MEASUREMENT_ID}`], true);
assert.equal(reloads, 1, 'Withdrawal unloads existing tracker listeners');
trackEvent('generate_lead', 'form');
assert.equal(events().length, 0, 'No event after withdrawal');
console.log('PASS: consent refusal/acceptance/withdrawal, SPA deduplication, language attribution, PII stripping and campaign allowlist. No real network calls made.');
