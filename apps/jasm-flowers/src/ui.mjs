// Shared markup helpers.
import fs from 'node:fs';
import { company, values } from './data.mjs';
import { LANGS, localise } from './i18n.mjs';

export const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')
  .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const MARK = fs.readFileSync(new URL('./brand/mark.svg', import.meta.url), 'utf8')
  .replace(/\s*role="img"[^>]*?(?=>)/, '').replace(/<\?xml[^>]*>/, '').trim();

// The `tbc` placeholder marker is gone: the client supplied real phone numbers and
// mailboxes on 29 Sep 2026, so nothing on the page is a stand-in any more.

export const mark = (cls = '', aria = 'true') =>
  MARK.replace('<svg ', `<svg class="${cls}" aria-hidden="${aria}" `);

/**
 * The client's own lockup, keyed off its background by tools/gen-logo.mjs. Two files
 * rather than one recoloured file: the wordmark is dark green on light surfaces and
 * cream on dark ones, and the rose stays red in both.
 * build.mjs fills these in with hashed paths once the images exist.
 */
export const LOGO = { light: '', dark: '', w: 0, h: 0 };
export const setLogo = o => Object.assign(LOGO, o);

const logoImg = (variant, cls) =>
  `<img class="${cls}" src="${LOGO[variant]}" alt="${esc(company.name)}" ` +
  `width="${LOGO.w}" height="${LOGO.h}" decoding="async">`;

export const ico = {
  wa: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.5 14.4c-.3-.2-1.7-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.5-.5c.1-.2.2-.3.3-.5v-.5c0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.7-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><rect x="2.5" y="4.5" width="19" height="15" rx="2"/><path d="m3 6 9 6.5L21 6"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><path d="M6.5 3h-2A1.5 1.5 0 0 0 3 4.6C3 13 11 21 19.4 21a1.5 1.5 0 0 0 1.6-1.5v-2a1 1 0 0 0-.8-1l-3.3-.7a1 1 0 0 0-1 .4l-.9 1.2a13 13 0 0 1-5.4-5.4l1.2-.9a1 1 0 0 0 .4-1l-.7-3.3a1 1 0 0 0-1-.8Z"/></svg>',
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14m-6-7 7 7-7 7"/></svg>',
  left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:17px;height:17px"><path d="m14 5-7 7 7 7"/></svg>',
  right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="width:17px;height:17px"><path d="m10 5 7 7-7 7"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
  down: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12m0 0-4.5-4.5M12 15l4.5-4.5M4 20h16"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m4 12.5 5.5 5.5L20 6.5"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21c0-8 5-14 18-15 0 10-6 15-13 15H3Z"/><path d="M9 18c1.5-4 4-7 8-9"/></svg>',
  mtn: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 20 6.5-12L13 16l2.5-4L22 20H2Z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5.5l3.5 2"/></svg>',
  ruler: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="8" width="20" height="8" rx="1.5"/><path d="M6.5 8v3.5M11 8v5M15.5 8v3.5M20 8v3.5"/></svg>',
  cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h3l1.5-2.5h9L18 8h3v11H3V8Z"/><circle cx="12" cy="13" r="3.5"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2v20M4 7l16 10M20 7 4 17"/></svg>',
  plane: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 13.5 21 4l-4.5 16-4-6.5-6.5-2 .5 5-2-2-2.5-1Z"/></svg>',
  box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5v-9Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/></svg>',
  tag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12.6V4a1 1 0 0 1 1-1h8.6a1 1 0 0 1 .7.3l7.4 7.4a1 1 0 0 1 0 1.4l-8.6 8.6a1 1 0 0 1-1.4 0L3.3 13.3a1 1 0 0 1-.3-.7Z"/><circle cx="7.9" cy="7.9" r="1.5"/></svg>',
};

/**
 * Flags for the hero market rotator, drawn rather than emoji: Windows has no colour
 * flag glyphs, so a regional-indicator pair renders as two letter boxes there.
 * 24x16 viewBox, displayed around 21px wide - simple field-and-band designs only.
 * `globe` covers Scandinavia and the Middle East, which are regions, not countries.
 */
const euStars = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 - 90) * Math.PI / 180;
  return `<circle cx="${(12 + 4.4 * Math.cos(a)).toFixed(2)}" cy="${(8 + 4.4 * Math.sin(a)).toFixed(2)}" r=".78"/>`;
}).join('');

const flagSvg = body =>
  `<svg viewBox="0 0 24 16" aria-hidden="true" preserveAspectRatio="none">${body}</svg>`;
const bands = (a, b, c) => `<rect width="24" height="5.34" fill="${a}"/>` +
  `<rect y="5.33" width="24" height="5.34" fill="${b}"/><rect y="10.66" width="24" height="5.34" fill="${c}"/>`;
const stripes = (a, b, c) => `<rect width="8" height="16" fill="${a}"/>` +
  `<rect x="8" width="8" height="16" fill="${b}"/><rect x="16" width="8" height="16" fill="${c}"/>`;

export const flags = {
  eu: flagSvg(`<rect width="24" height="16" fill="#039"/><g fill="#FC0">${euStars}</g>`),
  nl: flagSvg(bands('#AE1C28', '#fff', '#21468B')),
  de: flagSvg(bands('#000', '#D00', '#FFCE00')),
  it: flagSvg(stripes('#008C45', '#F4F5F0', '#CD212A')),
  fr: flagSvg(stripes('#002395', '#fff', '#ED2939')),
  be: flagSvg(stripes('#000', '#FAE042', '#ED2939')),
  es: flagSvg(`<rect width="24" height="16" fill="#AA151B"/><rect y="4" width="24" height="8" fill="#F1BF00"/>`),
  pl: flagSvg(`<rect width="24" height="16" fill="#fff"/><rect y="8" width="24" height="8" fill="#DC143C"/>`),
  gb: flagSvg(`<rect width="24" height="16" fill="#012169"/>` +
    `<path d="M0 0 24 16M24 0 0 16" stroke="#fff" stroke-width="3.4"/>` +
    `<path d="M0 0 24 16M24 0 0 16" stroke="#C8102E" stroke-width="1.9"/>` +
    `<path d="M12 0v16M0 8h24" stroke="#fff" stroke-width="5.4"/>` +
    `<path d="M12 0v16M0 8h24" stroke="#C8102E" stroke-width="3.2"/>`),
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true" class="fl-g">` +
    `<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.6 2.6 2.6 15 0 18-2.6-3-2.6-15.4 0-18Z"/></svg>`,
};

export const NAV = [
  ['/catalogue/', 'Catalogue'],
  ['/shipping/', 'Shipping'],
  ['/about/', 'About'],
  ['/contact/', 'Contact'],
];

export const waLink = (text = '') =>
  `https://wa.me/${company.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;

/**
 * Language switcher. Each link points at the same page in the other language, not at
 * that language's home page, so a buyer reading the shipping page stays on it.
 * data-lang keeps the build's link rewriter off these hrefs; translate="no" keeps the
 * codes out of the dictionary.
 */
export function langNav(path, lang, cls = 'lang') {
  const p = path === '/404.html' ? '/' : path;
  return `<div class="${cls}" role="group" aria-label="Language">${LANGS.map(l =>
    `<a data-lang="${l.code}" href="${localise(p, l.code)}" hreflang="${l.code}" lang="${l.code}"` +
    `${l.code === lang ? ' aria-current="true"' : ''} title="${l.label}" translate="no">` +
    `${l.code.toUpperCase()}</a>`).join('')}</div>`;
}

export function header(path, lang = 'en') {
  const links = NAV.map(([h, t]) =>
    `<a href="${h}"${path === h ? ' aria-current="page"' : ''}>${t}</a>`).join('');
  return `<header class="hdr">
  <div class="wrap hdr-in">
    <a class="brand" href="/" aria-label="${esc(company.name)} home">
      ${logoImg('light', 'brand-logo')}
    </a>
    <nav class="nav" aria-label="Main">${links}</nav>
    <div class="hdr-cta">
      ${langNav(path, lang)}
      <a class="btn btn-o btn-sm hdr-avail" href="/catalogue/#availability">Availability</a>
      <a class="btn btn-p btn-sm" href="/contact/">Request a quote</a>
      <button class="burger" type="button" aria-expanded="false" aria-controls="mnav" aria-label="Menu"><span></span></button>
    </div>
  </div>
  <div class="mnav" id="mnav"><div class="wrap">
    ${NAV.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}
    <a class="btn btn-p" href="/contact/">Request a quote</a>
  </div></div>
</header>`;
}

export function footer() {
  return `<footer class="ftr"><div class="wrap ftr-in">
  ${mark('ftr-mark')}
  <div class="ftr-top">
    <div>
      <a class="brand" href="/" aria-label="${esc(company.name)} home">${logoImg('dark', 'brand-logo brand-logo-lg')}</a>
      <p class="tiny" style="max-width:32ch;color:rgba(255,255,255,.66)">A Kenyan flower export business connecting selected Kenyan growers with professional flower buyers in Europe, Africa, the Middle East, Asia and other international markets.</p>
      <p class="tiny" style="margin-top:12px;color:rgba(255,255,255,.5)">${values.join('. ')}.</p>
    </div>
    <div><h4>Product</h4><ul>
      <li><a href="/catalogue/">Full catalogue</a></li>
      <li><a href="/jasm-flowers-catalogue.pdf" download>Catalogue PDF</a></li>
      <li><a href="/catalogue/#availability">Availability calendar</a></li>
      <li><a href="/shipping/">Packing &amp; specs</a></li>
      <li><a href="/shipping/">Cold chain</a></li>
    </ul></div>
    <div><h4>Company</h4><ul>
      <li><a href="/about/">About JASM</a></li>
      <li><a href="/about/#partners">Our growing partners</a></li>
      <li><a href="/about/#quality">Quality control</a></li>
      <li><a href="/contact/">Contact</a></li>
    </ul></div>
    <div><h4>Get in touch</h4><ul>
      <li><a href="mailto:${company.email}">${company.email}</a></li>
      <li><a href="mailto:${company.emailAlt}">${company.emailAlt}</a></li>
      <li><a href="tel:+${company.phoneDigits}">${esc(company.phone)}</a></li>
      <li><a href="tel:+${company.phoneAltDigits}">${esc(company.phoneAlt)}</a></li>
      <li><a href="${waLink('Hello JASM Flowers, I would like a quote.')}" rel="noopener">WhatsApp</a></li>
      <li><span style="color:rgba(255,255,255,.74);font-size:14.5px">${esc(company.address)}</span></li>
    </ul></div>
  </div>
  <div class="ftr-bot">
    <span>&copy; ${new Date().getFullYear()} ${esc(company.legal)}. All rights reserved.</span>
    <span>Built by <a href="https://jouwidealewebsite.nl" rel="noopener">Jouw Ideale Website</a></span>
  </div>
</div></footer>`;
}

export const basket = () => `<div class="basket" id="basket" role="region" aria-label="Quote list" aria-live="polite">
  <div class="wrap basket-in">
    <span class="basket-c" id="basketCount">0</span>
    <span class="basket-t" id="basketText">No items yet</span>
    <span class="basket-a">
      <button class="btn btn-o btn-o-light btn-sm" type="button" id="basketClear">Clear</button>
      <a class="btn btn-g btn-sm" href="/contact/">Request quote ${ico.arrow}</a>
    </span>
  </div>
</div>`;

export const stickyCta = () => `<div class="stick" id="stick">
  <div class="wrap stick-in">
    <span class="stick-t"><b>Ready for a price?</b><span>Send us your list and we come back with a quote.</span></span>
    <a class="btn btn-g btn-sm" href="/contact/">Request a quote</a>
    <a class="btn btn-o btn-o-light btn-sm" href="${waLink('Hello JASM Flowers, I would like a quote.')}" rel="noopener">${ico.wa} WhatsApp</a>
  </div>
</div>`;
