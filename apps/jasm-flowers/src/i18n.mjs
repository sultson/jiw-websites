/**
 * Translation layer.
 *
 * The site is authored once in English. Every other language is produced by walking
 * the built HTML and swapping each text chunk for its entry in a dictionary keyed on
 * the English source string. That keeps one set of page templates instead of three,
 * and a missing entry falls back to English rather than blanking the page.
 *
 * The build prints every key that has no translation, so coverage is measured, not assumed.
 */
import fs from 'node:fs';

// Dictionaries are tab separated (english<TAB>translation), one string per line.
// Plain text rather than JS so a quote or an apostrophe in the copy cannot break the build.
const load = code => {
  const f = new URL(`./lang/${code}.tsv`, import.meta.url);
  if (!fs.existsSync(f)) return {};
  const out = {};
  for (const line of fs.readFileSync(f, 'utf8').split(/\r?\n/)) {
    if (!line || line[0] === '#') continue;
    const i = line.indexOf('\t');
    if (i < 1) continue;
    const v = line.slice(i + 1).trim();
    if (v) out[line.slice(0, i).trim()] = v;
  }
  return out;
};

export const LANGS = [
  { code: 'en', label: 'English' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'de', label: 'Deutsch' },
];

export const DICT = Object.fromEntries(
  LANGS.map(l => [l.code, l.code === 'en' ? {} : load(l.code)]));

const norm = s => s.replace(/\s+/g, ' ').trim();

/** Look one string up. Records a miss so the build can report coverage. */
export function t(en, lang, misses) {
  if (lang === 'en') return en;
  const key = norm(en);
  const hit = DICT[lang][key];
  if (hit != null) return hit;
  if (misses && key) (misses[lang] || (misses[lang] = new Set())).add(key);
  return en;
}

/* ------------------------------------------------------------------ paths */

// Anything served as a file rather than a page keeps its single copy at the root.
const SHARED = /^\/(i|f)\/|^\/favicon\.svg|\.(css|js|xml|txt|webmanifest)$/;

export function localise(path, lang) {
  if (lang === 'en' || !path.startsWith('/') || SHARED.test(path)) return path;
  return `/${lang}${path}`;
}

/* ------------------------------------------------------------------ html */

// Tags that sit inside a sentence: kept inside the chunk so word order can move
// around them. Anything else ends the chunk.
// 'i' is deliberately absent: this site uses <i> as an availability swatch, not italics.
const INLINE = new Set(['br', 'em', 'strong', 'b', 'small', 'sup', 'sub']);
const SKIP = new Set(['script', 'style']);
const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr']);
const ATTRS = /\b(alt|title|aria-label|placeholder)="([^"]*)"/g;

const TOKEN = /<!--[\s\S]*?-->|<![^>]*>|<\/?([a-zA-Z][\w:-]*)((?:"[^"]*"|'[^']*'|[^>])*)>/g;

/**
 * Rewrites a whole HTML document into `lang`: text nodes, a fixed list of attributes,
 * the WhatsApp prefill text and every internal link.
 */
export function translateHtml(html, lang, misses) {
  if (lang === 'en') return html;
  const tr = s => t(s, lang, misses);
  const out = [];
  let run = [];
  let skip = null;
  let depth = 0;
  let noAt = null;    // element depth at which a translate="no" region started
  let last = 0;
  let m;

  const flush = () => {
    if (!run.length) return;
    const raw = run.join('');
    run = [];
    if (noAt !== null) { out.push(raw); return; }
    const lead = raw.match(/^\s*/)[0];
    const trail = raw.match(/\s*$/)[0];
    let core = raw.slice(lead.length, raw.length - trail.length);
    // A <br> at either end belongs to the layout, not to the sentence.
    let pre = '', post = '', b;
    while ((b = core.match(/^<br\s*\/?>\s*/i))) { pre += b[0]; core = core.slice(b[0].length); }
    while ((b = core.match(/\s*<br\s*\/?>$/i))) { post = b[0] + post; core = core.slice(0, -b[0].length); }
    out.push(/[A-Za-z]/.test(core) ? lead + pre + tr(core) + post + trail : raw);
  };

  const fixTag = (tag, name) => {
    if (tag.includes('data-lang=')) return tag;   // the switcher writes its own hrefs
    let s = tag.replace(ATTRS, (whole, a, v) => /[A-Za-z]/.test(v) ? `${a}="${tr(v)}"` : whole);
    if (name === 'meta' && /(name="description"|property="og:(title|description)")/.test(s)) {
      s = s.replace(/content="([^"]*)"/, (w, v) => `content="${tr(v)}"`);
    }
    s = s.replace(/\b(href|action)="(\/[^"#]*)((?:#[^"]*)?)"/g,
      (w, a, p, frag) => `${a}="${localise(p, lang)}${frag}"`);
    // WhatsApp deep links carry a prefilled sentence in the query string.
    s = s.replace(/(wa\.me\/\d+\?text=)([^"]*)/g,
      (w, head, q) => head + encodeURIComponent(tr(decodeURIComponent(q))));
    return s;
  };

  while ((m = TOKEN.exec(html))) {
    const text = html.slice(last, m.index);
    last = TOKEN.lastIndex;
    const tag = m[0];
    const name = m[1] ? m[1].toLowerCase() : null;

    if (skip) {
      out.push(text, tag);
      if (name === skip && tag[1] === '/') { skip = null; depth--; }
      continue;
    }
    if (text) run.push(text);
    if (name && INLINE.has(name)) { run.push(tag); continue; }

    flush();
    out.push(name ? fixTag(tag, name) : tag);
    if (!name) continue;

    if (tag[1] === '/') {
      depth--;
      if (noAt !== null && depth < noAt) noAt = null;
    } else if (!VOID.has(name) && !/\/>$/.test(tag)) {
      depth++;
      if (noAt === null && tag.includes('translate="no"')) noAt = depth;
      if (SKIP.has(name)) skip = name;
    }
  }
  if (last < html.length) run.push(html.slice(last));
  flush();
  return out.join('');
}

/** The strings app.js needs at runtime, as one blob per page. */
export function runtimeStrings(lang, misses) {
  const tr = s => t(s, lang, misses);
  return {
    empty: tr('No items yet'),
    of: tr('of'),
    shown: tr('shown'),
    quoteVia: tr('Quote request via'),
    fName: tr('Name'),
    fCompany: tr('Company'),
    fEmail: tr('Email'),
    fCountry: tr('Country'),
    fLines: tr('Flowers required'),
    fNone: tr('not specified'),
    fVolume: tr('Estimated quantity'),
    fSpec: tr('Stem length / specification'),
    fDest: tr('Delivery destination'),
    fFreq: tr('Shipment frequency'),
    fPhone: tr('Phone'),
    fNotes: tr('Message'),
    subject: tr('Quote request'),
    // Shown in the status line under the enquiry form while it posts and after.
    sending: tr('Sending your enquiry...'),
    sent: tr('Thank you. Your enquiry is with us and a copy is on its way to your inbox.'),
    sendFailed: tr('The enquiry could not be sent. Please email or WhatsApp us instead.'),
  };
}
