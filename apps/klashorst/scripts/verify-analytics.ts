import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/analytics.ts', import.meta.url), 'utf8')
  .replace("import { isPreview } from './content';", 'const isPreview = false;')
  .replace("import.meta.env.VITE_GA_MEASUREMENT_ID", "'G-TEST123'");
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
function setup(hostname = 'klashorstmuseum.nl', search = '') {
  const store = new Map<string, string>();
  const scripts: unknown[] = [];
  let reloads = 0;
  const location = { hostname, origin: `https://${hostname}`, pathname: '/', search, reload: () => reloads++ };
  const document = { title: 'Museum', referrer: 'https://example.com/private?email=secret', cookie: '', createElement: () => ({}), head: { append: (script: unknown) => scripts.push(script) } };
  const window: { dataLayer?: IArguments[]; [key: string]: unknown } = {};
  const context = { exports: {} as Record<string, (...args: unknown[]) => unknown>, window, document, location, URL, URLSearchParams, Date, localStorage: { getItem: (key: string) => store.get(key) || null, setItem: (key: string, value: string) => store.set(key, value) } };
  vm.runInNewContext(js, context);
  return { ...context, scripts, store, reloads: () => reloads, calls: () => (window.dataLayer || []).map(args => Array.from(args)) };
}
const a = setup();
a.exports.readConsent(); a.exports.trackPage();
assert.equal(a.scripts.length, 0, 'No Google tag before consent');
a.exports.setConsent('denied'); a.exports.trackPage();
assert.equal(a.scripts.length, 0, 'No Google tag after refusal');
a.exports.setConsent('granted');
assert.equal(a.scripts.length, 1);
assert.equal(a.window['ga-disable-G-TEST123'], false, 'Grant after refusal enables analytics');
a.exports.trackPage();
assert.equal(a.calls().filter(c => c[1] === 'page_view').length, 1, 'No duplicate page view');
a.location.pathname = '/en/blog'; a.document.title = 'Journal'; a.exports.trackPage();
const pages = a.calls().filter(c => c[1] === 'page_view');
assert.equal(pages.length, 2);
assert.equal((pages[1][2] as { page_title: string }).page_title, 'Journal');
assert.ok(!JSON.stringify(a.calls()).includes('secret'), 'Referrer queries do not leak');
a.document.cookie = '_ga=test; _ga_TEST123=session'; a.exports.setConsent('denied');
assert.equal(a.window['ga-disable-G-TEST123'], true);
assert.equal(a.reloads(), 1, 'Withdrawal unloads tag listeners');
for (const b of [setup('localhost'), setup('klashorstmuseum.nl', '?preview=secret')]) {
  b.exports.setConsent('granted'); assert.equal(b.scripts.length, 0, 'No dev or preview tracking');
}
const expired = setup();
expired.store.set('klashorst-analytics-consent-v1', JSON.stringify({value:'granted', at: 0}));
assert.equal(expired.exports.readConsent(), null);
console.log('Analytics checks passed: consent, re-grant, page views, privacy, withdrawal, preview/dev exclusion, expiration.');
