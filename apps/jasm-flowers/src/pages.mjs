import {
  company, qualityFocus, varieties, signature, mainFocus, homeRail, steps, reasons, faqs, markets,
  regions, heroMarkets, MONTHS, values,
} from './data.mjs';
import { esc, ico, mark, flags, waLink } from './ui.mjs';

/**
 * The market line in the hero: one chip that cycles through Europe and the countries
 * we ship to, each with its flag. Every chip is in the DOM as real text so it
 * translates and so a screen reader (and a browser with no JS) still gets the full
 * list; app.js only moves the `on` class. They share one grid cell, which sizes the
 * box to the widest name once, so the line never reflows as it rotates.
 */
function marketChip() {
  return `<p class="mkt-row"><span class="mkt-k">Markets</span><span class="mkt" id="mkt">${
    heroMarkets.map(([name, flag], i) =>
      `<span${i === 0 ? ' class="on"' : ''}>${flags[flag]}${esc(name)}</span>`).join('')
  }</span></p>`;
}

const availBars = v => v.avail.map((a, i) =>
  `<i class="${a ? 'a-' + a : ''}" title="${MONTHS[i]}"></i>`).join('');

const addBtn = v => `<button class="add" type="button" data-add="${v.slug}" data-name="${esc(v.name)}"
  aria-pressed="false"><span class="add-p">${ico.plus} Add to quote</span><span class="add-d">${ico.check} Added</span></button>`;

const faqList = list => `<div class="faq">${list.map(f => `<details>
  <summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join('')}</div>`;

// ============================================================ HOME
export function home(img) {
  // The client's three key flowers lead: Solidago, Eucalyptus Baby Blue, Eucalyptus Silver
  // Dollar. Everything else rails underneath, so the page does not claim we specialise
  // equally in everything.
  const sig = mainFocus.map(v => `<article class="sig-card reveal">
    <div class="sig-img">${img(v.img, `${v.name} grown in Kenya for ${company.name}`, 660, { ratio: '4/5' })}
      <span class="sig-tag sig-tag-main">Key flower</span></div>
    <div class="sig-body">
      <h3 class="d3">${esc(v.name)}</h3>
      <p class="sig-latin">${esc(v.latin)}</p>
      <p>${esc(v.blurb)}</p>
      <dl class="sig-meta">
        <div><dt>Lengths</dt><dd>${v.lengths.join(' &middot; ')}</dd></div>
        <div><dt>Vase life</dt><dd>${esc(v.vaseLife)}</dd></div>
        <div><dt>Bunch</dt><dd>${esc(v.packBunch)}</dd></div>
        <div><dt>Colours</dt><dd>${esc(v.colours.join(', '))}</dd></div>
      </dl>
    </div>
  </article>`).join('');

  const railCards = homeRail.map(v => `<a class="vcard" href="/catalogue/#${v.slug}">
    <div class="vcard-img">${img(v.img, v.name, 420, { ratio: '3/4' })}
      <span class="vcard-tag">${esc(v.group)}</span></div>
    <div class="vcard-body"><h3>${esc(v.name)}</h3><p class="l">${esc(v.latin)}</p>
      <p class="s">${v.lengths[0]} to ${v.lengths.at(-1)} &middot; ${esc(v.vaseLife)}</p></div>
  </a>`).join('');

  // One icon per reason, in order, each matching what the point actually says.
  const reasonIcons = [ico.leaf, ico.ruler, ico.cam, ico.user, ico.box, ico.tag];

  return { title: `Premium Kenyan summer flowers & foliage | ${company.name}`,
    desc: 'Solidago, eucalyptus and limonium grown in Kenya for professional flower buyers across ' +
      'Europe. Consistent quality, reliable supply, cut to order and graded to your specification.',
    path: '/', body: `
<section class="hero">
  <div class="hero-bg">${img('hero-field', 'Rows of solidago and limonium on a Kenyan highland flower farm at sunrise', 1800,
    { eager: true, plain: true, mobileKey: 'hero-field-tall' })}</div>
  <div class="wrap hero-in on-dark">
    <h1 class="d1">Premium Kenyan summer<br>flowers <em>&amp; foliage</em></h1>
    <p class="lead">Consistent quality. Reliable supply. Grown in Kenya for professional
      flower buyers.</p>
    ${marketChip()}
    <div class="hero-btns">
      <a class="btn btn-g" href="/catalogue/">See the catalogue ${ico.arrow}</a>
      <a class="btn btn-o" href="/contact/">Request a quote</a>
    </div>
  </div>
  <div class="wrap"><div class="hero-strip">
    <div><b>Solidago</b><span>&amp; eucalyptus, our key flowers</span></div>
    <div><b>2,400 m</b><span>top growing altitude</span></div>
    <div><b>2&ndash;4 &deg;C</b><span>cold chain, kept unbroken</span></div>
    <div><b>4 days</b><span>order confirmed before shipment</span></div>
  </div></div>
</section>

<section class="sec sec-paper">
  <div class="wrap">
    <div class="sec-head-row">
      <div class="sec-head">
        <h2 class="d2">Our key flowers</h2>
        <p class="lead">Solidago and the two eucalyptus lines lead the programme and the season
          is planned around them.</p>
      </div>
      <div class="head-acts">
        <a class="btn btn-o btn-sm" href="/jasm-flowers-catalogue.pdf" download>${ico.down} Catalogue PDF</a>
        <a class="link" href="/catalogue/">All ${varieties.length} lines ${ico.arrow}</a>
      </div>
    </div>
    <div class="sig">${sig}</div>
  </div>
</section>

<section class="sec sec-sand">
  <div class="wrap">
    <div class="sec-head-row">
      <div class="sec-head">
        <h2 class="d2">Additional flowers</h2>
        <p class="lead">Limonium runs alongside as a core programme line; the rest come through
          our grower network. All of it packs on the same airway bill, so one bouquet costs one
          freight minimum.</p>
      </div>
      <div class="rail-nav">
        <button class="rail-btn" type="button" data-rail-prev="r1" aria-label="Previous">${ico.left}</button>
        <button class="rail-btn" type="button" data-rail-next="r1" aria-label="Next">${ico.right}</button>
      </div>
    </div>
    <div class="rail-wrap"><div class="rail" id="r1" tabindex="0" role="group" aria-label="More varieties">${railCards}</div></div>
  </div>
</section>

<div class="trip">
  ${video('packhouse', 'packhouse',
    'A grader bunching and sleeving roses at the bench, filmed at one of our growing partners',
    'The packhouse', 'Graded against your written spec, an hour after the cut')}
  <figure>${img('coldchain', 'JASM export cartons stacked on a pallet in the cold room', 900, { ratio: '4/5' })}
    <figcaption><b>Two degrees</b><span>Pre-cooled within the hour and held there until it flies</span></figcaption></figure>
  <figure>${img('qc', 'A full-length eucalyptus stem held up and checked against the grading spec', 900, { ratio: '4/5' })}
    <figcaption><b>Every stem measured</b><span>Full length checked against your spec before bunching</span></figcaption></figure>
</div>

<section class="sec sec-pale">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Why buyers work<br>with JASM</h2></div>
    <div class="grid3 bare">${reasons.map((r, i) => `<div class="reason">${reasonIcons[i]}
      <h3>${esc(r.t)}</h3><p>${esc(r.d)}</p></div>`).join('')}</div>
  </div>
</section>

<section class="split sec-paper" id="how">
  <div class="split-copy"><div>
    <h2 class="d2">From your list<br>to your shipment</h2>
    <p class="lead" style="margin-top:18px">Five steps, from the mail you send us to the box at
      your cold store.</p>
    <p class="flow" aria-hidden="true">${steps.map(s => `<span>${esc(s.t)}</span>`).join('')}</p>
    <div style="margin-top:clamp(24px,3vw,36px)">${steps.map(s => `<div class="step reveal"><span class="step-n">${s.n}</span>
      <div><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p></div></div>`).join('')}</div>
    <div class="note" style="margin-top:28px">
      <b>Buying the same lines every week?</b> Talk to us about a weekly or seasonal supply
      programme and we plan it with you and our growing partners.
      <a class="link" href="/contact/" style="display:inline-block;margin-top:10px">Talk to us about a programme ${ico.arrow}</a>
    </div>
  </div></div>
  <div class="split-img">${img('harvest', 'Solidago in full bloom on a partner farm in the Kenyan highlands', 1100, { plain: true, sizes: '(max-width:880px) 100vw, 50vw' })}
    <span class="split-tag">We check availability</span></div>
</section>

<section class="split sec-pale">
  <div class="split-copy"><div>
    <h2 class="d2">Altitude does<br>the work</h2>
    <p class="lead" style="margin-top:20px">Between Naivasha and the slopes of Mount Kenya the days
      are bright and the nights drop close to ten degrees. That swing slows the plant, which gives a
      tighter head, a thicker neck and a deeper colour.</p>
    <p class="muted">It is why a Kenyan stem still looks fresh on day six in a Dutch shop, and why we
      buy above 1,800 metres even when a lower farm quotes less.</p>
    <div class="badges" style="margin-top:26px">
      <span class="badge">${ico.mtn}<b>1,800&ndash;2,400 m</b></span>
      <span class="badge">${ico.snow}<b>2&ndash;4 &deg;C</b> cold chain</span>
      <span class="badge">${ico.clock}<b>Flown</b> out of Nairobi</span>
    </div>
  </div></div>
  <div class="split-img">${img('highlands', 'Cut-flower rows on a highland slope above a valley holding morning mist, with a mountain ridge behind', 1100, { plain: true, sizes: '(max-width:880px) 100vw, 50vw', mobileKey: 'highlands-wide', mobileAt: 880 })}
    <span class="split-tag">The Kenyan highlands</span></div>
</section>

<section class="split rev sec-dark on-dark">
  <div class="split-copy"><div>
    <h2 class="d2">Out of Kenya,<br>on a cold chain we control</h2>
    <p class="lead" style="margin-top:20px">Europe is where most of our volume goes: out of Nairobi
      on the booked flight to your destination airport. Nothing goes through the Dutch clock,
      which saves a day of handling and a margin.</p>
    <p class="muted">Pre-cooled within the hour of cutting, sealed into pre-chilled boxes and held at
      2 to 4 degrees through the export process, with the temperature logged.</p>
    <p class="muted">We also ship into Africa, the Middle East and Asia. Tell us the destination and
      we quote the route with it.</p>
    <div class="mk" style="margin-top:28px">${
      [...regions.filter(r => r !== 'Worldwide' && !markets.includes(r)), ...markets]
        .map(m => `<span>${esc(m)}</span>`).join('')}</div>
  </div></div>
  <div class="split-img">${img('cargo', 'Flower boxes loaded onto a freighter aircraft at night', 1100, { plain: true, sizes: '(max-width:880px) 100vw, 50vw' })}
    <span class="split-tag">Pack &amp; export</span></div>
</section>

<section class="sec sec-paper">
  <div class="wrap" style="max-width:880px">
    <div class="sec-head center">      <h2 class="d2">Questions buyers ask first</h2></div>
    ${faqList(faqs.slice(0, 6))}
    <p style="text-align:center;margin-top:36px"><a class="link" href="/shipping/">All shipping detail ${ico.arrow}</a></p>
  </div>
</section>

${quoteBand()}` };
}

// ============================================================ shared CTA band
function quoteBand() {
  return `<section class="split rev sec-ink on-dark" id="quote">
  <div class="split-copy"><div>
    <h2 class="d2">Send us a list.<br>We send back a price.</h2>
    <p class="lead" style="margin-top:20px">Tell us the lines, the lengths and the volume. We
      check availability with our growing partners and come back with a written quote, grade,
      pack and freight included.</p>
    <div class="hero-btns">
      <a class="btn btn-g" href="/contact/">Request a quote ${ico.arrow}</a>
      <a class="btn btn-o" href="${waLink('Hello JASM Flowers, I would like a quote.')}" rel="noopener">${ico.wa} WhatsApp us</a>
    </div>
  </div></div>
  <div class="split-img">${imgRef('hero-bunch', 'A bunch of eucalyptus, solidago and limonium on linen')}</div>
</section>`;
}
// placeholder replaced at build time
let _img = null;
export const setImg = fn => { _img = fn; };
/**
 * The client's own packhouse clip, with the still they sent from the same bench as its
 * poster - so the strip still reads as three photographs until someone presses play.
 *
 * The caption stays at the bottom like its two neighbours. Moving it to the top to get
 * out of the way of the video controls looked like the obvious fix and was wrong: the
 * top of these figures is a 220px arch, so a caption up there gets sliced by the curve,
 * which is the same thing that ate the core-product badges in September. Instead the
 * controls stay hidden behind a play button until someone starts the clip, and the
 * caption fades out when it does.
 */
let _video = null;
export const setVideo = fn => { _video = fn; };
function video(key, posterKey, alt, title, note) {
  return `<figure class="v">${_video(key, posterKey, alt)}
    <figcaption><b>${esc(title)}</b><span>${esc(note)}</span></figcaption></figure>`;
}
// Full-bleed: no aspect-ratio, the .split-img box decides the crop.
function imgRef(k, a) { return _img(k, a, 1100, { plain: true, sizes: '(max-width:880px) 100vw, 50vw' }); }

// ============================================================ CATALOGUE
export function catalogue(img) {
  const groups = ['All', 'Core', 'Filler', 'Foliage', 'Flower', 'Rose'];
  const count = g => g === 'All' ? varieties.length
    : g === 'Core' ? signature.length : varieties.filter(v => v.group === g).length;

  const items = varieties.map(v => `<article class="cat-item" id="${v.slug}"
      data-group="${esc(v.group)}" data-tier="${v.tier}">
    <div class="cat-img">${img(v.img, `${v.name} from ${company.name}`, 560, { ratio: '1/1' })}
      <span class="vcard-tag">${v.tier === 'signature' ? 'Core' : esc(v.group)}</span></div>
    <div class="cat-body">
      <h3>${esc(v.name)}</h3>
      <p class="cat-latin">${esc(v.latin)}</p>
      <p>${esc(v.blurb)}</p>
      <div class="swatches">${v.colours.map(c => `<span class="swatch">${esc(c)}</span>`).join('')}</div>
      ${v.img2 ? `<figure class="cat-x">${img(v.img2, v.img2Alt, 420, { ratio: '4/5',
        sizes: '116px' })}
        <figcaption>${esc(v.img2Cap)}</figcaption></figure>` : ''}
      <dl class="spec">
        <div><dt>Lengths</dt><dd>${v.lengths.join(' &middot; ')}</dd></div>
        <div><dt>Bunch</dt><dd>${esc(v.packBunch)}</dd></div>
        <div><dt>Per box</dt><dd>${esc(v.packBox)}</dd></div>
        <div><dt>Vase life</dt><dd>${esc(v.vaseLife)}</dd></div>
      </dl>
      <div class="cat-foot">
        <span class="mini-avail" title="Availability by month, January to December" aria-label="Availability by month">${availBars(v)}</span>
        ${addBtn(v)}
      </div>
    </div>
  </article>`).join('');

  const availRows = varieties.map(v => `<tr><th scope="row">${esc(v.name)}</th>${
    v.avail.map((a, i) => `<td><div class="a-cell ${a ? 'a-' + a : ''}"><span class="sr-only">${MONTHS[i]}: ${a === 2 ? 'peak' : a ? 'available' : 'limited'}</span></div></td>`).join('')}</tr>`).join('');

  return { title: `Flower catalogue: ${varieties.length} lines from Kenya | ${company.name}`,
    desc: 'Solidago, eucalyptus, limonium, gypsophila, carnations, statice, chrysanthemums, ' +
      'hydrangeas, delphiniums, eryngium, roses and spray roses. Lengths, bunch specs and month ' +
      'by month availability.',
    path: '/catalogue/', body: `
<section class="phead">
  <div class="phead-bg">${img('hero-bunch', 'A bunch of eucalyptus, solidago and limonium on linen', 1600, { eager: true, plain: true })}</div>
  ${mark('phead-mark')}
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Catalogue</span></nav>
    <h1 class="d1">The catalogue</h1>
    <p class="lead">${varieties.length} lines on one airway bill. The specs below are the standard
      pack; stem length, bunch weight and cut stage can be set to your own programme.</p>
    <div class="phead-btns">
      <a class="btn btn-g" href="/jasm-flowers-catalogue.pdf" download>${ico.down} Download the catalogue (PDF)</a>
      <a class="btn btn-o btn-o-light" href="#availability">Availability by month</a>
    </div>
  </div>
</section>

<section class="sec sec-paper">
  <div class="wrap">
    <div class="filters" role="group" aria-label="Filter by type">
      ${groups.map((g, i) => `<button class="chip" type="button" data-filter="${g}"
        aria-pressed="${i === 0}">${g}<span class="c">${count(g)}</span></button>`).join('')}
      <span class="tiny" style="margin-left:auto" id="filterCount"></span>
    </div>
    <div class="cat-grid" id="catGrid">${items}</div>
    <p class="tiny" style="margin-top:28px;max-width:70ch">Box counts are a guide for a standard
      full box. Actual counts depend on stem length and cut stage, and go on your order confirmation.</p>
  </div>
</section>

<section class="sec sec-sand" id="availability">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Availability, month by month</h2>
      <p class="lead">Kenya grows through the European winter, when local supply stops. Peak marks
        the months we can take large standing volume at the best grade.</p></div>
    <div class="a-key">
      <span><i class="a-2"></i> Peak volume</span>
      <span><i class="a-1"></i> Available</span>
      <span><i class="a-0"></i> Limited, ask first</span>
    </div>
    <div class="avail-scroll"><table class="avail">
      <thead><tr><th scope="col">Variety</th>${MONTHS.map(m => `<th scope="col">${m}</th>`).join('')}</tr></thead>
      <tbody>${availRows}</tbody>
    </table></div>
  </div>
</section>

${quoteBand()}` };
}

// ============================================================ SHIPPING
export function shipping(img) {
  const specRows = varieties.map(v => `<tr>
    <td>${esc(v.name)}<span class="l">${esc(v.latin)}</span></td>
    <td>${v.lengths.join(', ')}</td><td>${esc(v.packBunch)}</td>
    <td>${esc(v.packBox)}</td><td>${esc(v.vaseLife)}</td></tr>`).join('');

  /**
   * [icon, kicker, heading, body]. The client stripped the day-and-time kicker off every
   * step on 5 Oct 2026 - the chain describes the order of events, not a timetable they
   * want to be held to - so only the last step keeps a kicker, which is their own wording.
   * "Ready for pick up" has no body on purpose: they deleted the delivery sentence and
   * did not replace it, and FOB Nairobi means the shipment is collected, not trucked.
   */
  const chain = [
    [ico.leaf, '', 'Cut', 'Stems cut in the cool of the morning, straight into clean water with a hydration treatment.'],
    [ico.ruler, '', 'Graded and bunched', 'Length and bunch weight checked against your written spec. Anything off spec is left behind.'],
    [ico.snow, '', 'Pre-cooled', 'Into the cold room at 2 to 4 C within an hour of cutting. Vase life is won here.'],
    [ico.box, '', 'Packed', 'Sealed into pre-chilled boxes with your labels.'],
    [ico.plane, '', 'Airside at JKIA', 'Handed to the airline in a temperature-controlled build-up area, on the booked and confirmed flight.'],
    [ico.clock, '', 'Lands in destination airport', 'Cleared and moved into a cold store upon arrival.'],
    [ico.check, 'On to you', 'Ready for pick up', ''],
  ];

  return { title: `Shipping, packing and cold chain | ${company.name}`,
    desc: 'How flowers get from a Kenyan field to your cold store: cut to order, pre-cooled ' +
      'within the hour, flown out of Nairobi on an unbroken cold chain.',
    path: '/shipping/', body: `
<section class="phead">
  <div class="phead-bg">${img('cargo', 'Flower boxes loaded onto a freighter aircraft at night', 1600, { eager: true, plain: true })}</div>
  ${mark('phead-mark')}
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Shipping</span></nav>
    <h1 class="d1">From Kenya to your destination,<br>cold the whole way</h1>
    <p class="lead">Most vase life is lost before a flower leaves the country of origin. Here is what
      happens to your stems between the field and your cold store.</p>
  </div>
</section>

<section class="sec sec-paper">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Seven steps, one unbroken<br>temperature line</h2></div>
    <div class="proc">
      <div>${chain.map(([i, when, t, d]) => `<div class="step reveal">
        <span class="step-n" style="color:var(--gold-bright);width:30px">${i.replace('width:17px;height:17px', '')}</span>
        <div>${when ? `<p class="kicker" style="margin-bottom:7px">${when}</p>` : ''}<h3>${t}</h3>${d ? `<p>${d}</p>` : ''}</div></div>`).join('')}</div>
      <div class="proc-img">${img('coldchain', 'Flower export boxes stacked in a refrigerated cold room', 760, { ratio: '4/5' })}</div>
    </div>
  </div>
</section>

<section class="sec sec-sand">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Specs for every line</h2>
      <p class="lead">The house standard. Every figure can be changed to your own programme and
        written into the order, and that is what the packhouse checks against.</p></div>
    <div class="tbl-wrap"><table class="tbl">
      <thead><tr><th scope="col">Variety</th><th scope="col">Lengths</th><th scope="col">Per bunch</th>
        <th scope="col">Per full box</th><th scope="col">Vase life</th></tr></thead>
      <tbody>${specRows}</tbody>
    </table></div>
  </div>
</section>

<section class="sec sec-pale">
  <div class="wrap">
    <div class="sec-head">
      <h2 class="d2">Boxes, minimums and terms</h2></div>
    <div class="grid3" style="background:var(--line-soft)">
      <div class="reason">${ico.box}<h3>Box sizes</h3>
        <p>Full box and half box. A full box is the standard flower carton for air freight
        and holds roughly 10 to 12 kg of product depending on the line.</p></div>
      <div class="reason">${ico.check}<h3>Minimum order</h3>
        <p>A minimum order of 5 boxes applies. For first-time customers, we offer a minimum trial
        order of 5 boxes. Boxes can be mixed across different flower varieties, allowing you to test
        several lines in one shipment while meeting the minimum order requirement.</p></div>
      <div class="reason">${ico.clock}<h3>Order deadline</h3>
        <p>Orders should be confirmed 4 days before the scheduled shipment date. Earlier booking is
        recommended for larger volumes and standing programmes to ensure availability and consistent
        supply.</p></div>
      <div class="reason">${ico.ruler}<h3>Incoterms</h3>
        <p>FOB Nairobi. The terms go on every order confirmation, in writing.</p></div>
      <div class="reason">${ico.cam}<h3>Quality and transit issues</h3>
        <p>Share photos and shipment details within 24 hours of arrival and we assess it promptly.</p></div>
      <!-- Five cards in a three-wide grid leaves the sixth cell showing the grid's own
           hairline colour, which reads as a grey hole rather than as nothing. This closes
           the row with the card surface; it collapses when the grid goes single column. -->
      <div class="fill" aria-hidden="true"></div>
    </div>
    <div class="note" style="margin-top:32px;max-width:74ch">Freight rates vary according to
      destination, season, airline capacity and fuel costs. We quote them per shipment.</div>
  </div>
</section>

<section class="sec sec-paper">
  <div class="wrap" style="max-width:880px">
    <div class="sec-head center">      <h2 class="d2">Shipping questions</h2></div>
    ${faqList(faqs)}
  </div>
</section>

${quoteBand()}` };
}

// ============================================================ ABOUT
export function about(img) {
  return { title: `About JASM: Kenyan flower export | ${company.name}`,
    desc: 'JASM Flowers is a Kenyan flower export business connecting selected Kenyan growers with ' +
      'professional flower buyers in Europe, Africa, the Middle East, Asia and other international markets.',
    path: '/about/', body: `
<section class="phead">
  <div class="phead-bg phead-bg-hi">${img('packhouse', 'A grader at one of our growing partners bunching and sleeving roses at the bench', 1600, { eager: true, plain: true })}</div>
  ${mark('phead-mark')}
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>About</span></nav>
    <h1 class="d1">Selected growers,<br>professional buyers</h1>
    <p class="lead">${company.name} is a Kenyan flower export business connecting selected Kenyan
      growers with professional flower buyers in Europe, Africa, the Middle East, Asia and other
      international markets.</p>
    <div class="vals">${values.map(v => `<span>${esc(v)}</span>`).join('')}</div>
  </div>
</section>

<section class="sec sec-paper" id="partnership">
  <div class="wrap cols2">
    <div>
      <p class="kicker">About JASM Flowers</p>
      <h2 class="d2">Long-term<br>partnership</h2>
      <p class="lead" style="margin-top:20px">We focus on reliable supply, consistent quality and
        competitive export solutions for professional wholesalers, importers, florists and other
        flower businesses.</p>
      <p class="muted">Our role is to coordinate sourcing, quality specifications, consolidation and
        export logistics while working closely with our growing partners and international
        customers.</p>
      <p class="muted">We believe in building long-term relationships with both growers and buyers.
        By understanding our customers&rsquo; specifications and maintaining good communication with
        our growing partners, we aim to create reliable supply programmes that work for both
        sides.</p>
      <div class="hero-btns" style="margin-top:26px">
        <a class="btn btn-p" href="/contact/">Request a quote ${ico.arrow}</a>
      </div>
    </div>
    <div class="figure">${img('field-rows', 'Solidago at bud stage in the field, Kenyan highlands', 900, { ratio: '4/5' })}</div>
  </div>
</section>

<section class="sec sec-sand">
  <div class="wrap cols2">
    <div>
      <h2 class="d2">A short chain,<br>on purpose</h2>
      <p class="lead" style="margin-top:20px">Most Kenyan flowers reach a European florist through
        three or four hands: farm, exporter, auction, wholesaler. Every hand adds a day and a margin.</p>
      <p class="muted">You order from us, our growing partners cut to that order, and the box is built
        for you. One fewer week in transit, and a better price for the stem.</p>
      <p class="muted">We are not a farm. We bring the relationship with the growers, the specification
        the crop is held to, and the export process that gets it to you in the condition you were
        promised.</p>
    </div>
    <div class="figure">${img('coldchain', 'JASM export cartons stacked on a pallet in the cold room', 900, { ratio: '4/5' })}</div>
  </div>
</section>

<section class="sec sec-paper" id="partners">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Our growing partners</h2>
      <p class="lead">We work with selected Kenyan growers rather than owning farms, and collaborate
        closely with them on quality, specifications, grading and export preparation, so
        what leaves the country matches what was agreed.</p></div>
    <div class="grid3" style="background:var(--line-soft)">
      <div class="reason">${ico.leaf}<h3>A small group of growers</h3>
        <p>We work with growers we know, each chosen for the crop they are genuinely good at.</p></div>
      <div class="reason">${ico.ruler}<h3>Grown to a written specification</h3>
        <p>Stem length, bunch weight, stem count and cut stage are agreed up front and shared with
        the grower.</p></div>
      <div class="reason">${ico.check}<h3>Quality at every stage</h3>
        <p>Quality starts with the right crop and continues through every stage of the supply chain.
        We work closely with our growing partners to align production and handling with the
        specifications agreed with each buyer.</p></div>
      <div class="reason">${ico.mtn}<h3>Naivasha, around 1,900 m</h3>
        <p>Lakeside blocks on volcanic soil. The main solidago, limonium and statice ground, and the
        reason filler volume holds all year.</p></div>
      <div class="reason">${ico.mtn}<h3>Mount Kenya, 2,100&ndash;2,400 m</h3>
        <p>Cooler and higher. Eucalyptus, delphinium, hydrangea and the roses that need real altitude to
        build a head worth selling.</p></div>
      <div class="reason">${ico.box}<h3>Two regions, deliberately</h3>
        <p>Weather that ruins a crop in Naivasha rarely touches Mount Kenya in the same week, so one
        storm does not break a standing order.</p></div>
    </div>
  </div>
</section>

<section class="sec sec-sand" id="quality">
  <div class="wrap cols2">
    <div class="figure">${img('qc', 'A full-length eucalyptus stem held up and checked against the grading spec', 900, { ratio: '4/3' })}</div>
    <div>
      <h2 class="d2">Graded to your<br>specification</h2>
      <p class="lead" style="margin-top:20px">Every order is carefully graded according to your
        agreed specifications, including stem length, stem count and cut stage.</p>
      <p class="muted">Our grading team checks the flowers against the order before dispatch to
        ensure they meet your requirements.</p>
      <p class="muted">We take care to address any variations before the flowers leave Kenya,
        helping ensure you receive the quality and specifications you ordered.</p>
    </div>
  </div>
</section>

<section class="sec sec-dark on-dark" id="markets">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">Where our flowers go</h2>
      <p class="lead">Importers, wholesalers, floral distributors, florists, bouquet producers and
        retail flower businesses.</p></div>
    <div class="mk">${regions.map(m => `<span>${esc(m)}</span>`).join('')}</div>
    <p class="lead" style="margin-top:clamp(28px,4vw,44px);max-width:56ch">Where we are going:
      to be the Kenyan supply partner buyers worldwide keep coming back to, on long-term
      relationships rather than one-off shipments.</p>
  </div>
</section>

<section class="sec sec-paper">
  <div class="wrap">
    <div class="sec-head">      <h2 class="d2">What we hold<br>the product to</h2>
      <p class="lead">Consistency is the thing professional buyers actually pay for. These are the
        five points where it is either kept or lost.</p></div>
    <div class="grid3" style="background:var(--line-soft)">
      ${qualityFocus.map((q, i) => `<div class="reason">${
        [ico.leaf, ico.ruler, ico.box, ico.snow, ico.plane][i]}<h3>${esc(q.t)}</h3>
        <p>${esc(q.d)}</p></div>`).join('')}
      <div class="reason">${ico.check}<h3>Your specification</h3>
        <p>Stem length, grade, bunch size, packaging, quantity and shipment frequency are agreed
        before supply is confirmed, not after the first box lands.</p></div>
    </div>
    <div class="note" style="margin-top:clamp(26px,3vw,38px)">
      <b>Quality is not only the flower.</b> It is also a specification that says what you are
      actually getting, accurate information when something changes, and an answer from the same
      person between the first quotation and the shipment landing.
    </div>
  </div>
</section>

${quoteBand()}` };
}

// ============================================================ CONTACT
export function contact(img) {
  const pickList = varieties.map(v =>
    `<button class="pick" type="button" data-pick="${v.slug}" aria-pressed="false">${esc(v.name)}</button>`).join('');

  return { title: `Request a quote | ${company.name}`,
    desc: 'Send your list of lines, lengths and weekly volume. Written quote with grade, pack and ' +
      'freight per line.',
    path: '/contact/', body: `
<section class="phead">
  <div class="phead-bg">${img('greenhouse', 'Open field rows of solidago on a partner farm in the Kenyan highlands', 1600, { eager: true, plain: true })}</div>
  ${mark('phead-mark')}
  <div class="wrap">
    <nav class="crumb" aria-label="Breadcrumb"><a href="/">Home</a><span>/</span><span>Contact</span></nav>
    <h1 class="d1">Request a quote</h1>
    <p class="lead">Tell us what you need. We will check availability with our growing partners
      and come back with a quotation based on your requirements.</p>
  </div>
</section>

<section class="sec-sm sec-dark on-dark sec-tight">
  <div class="wrap"><div class="ccards">
    <a class="ccard" href="mailto:${company.email}">${ico.mail}<b>Email sales</b><span>${company.email}</span></a>
    <a class="ccard" href="${waLink('Hello JASM Flowers, I would like a quote.')}" rel="noopener">${ico.wa}<b>WhatsApp</b><span>${company.phone}</span></a>
    <a class="ccard" href="tel:+${company.phoneDigits}">${ico.phone}<b>Call the office</b><span>${company.phone}</span></a>
    <a class="ccard" href="tel:+${company.phoneAltDigits}">${ico.phone}<b>Office, second line</b><span>${company.phoneAlt}</span></a>
  </div></div>
</section>

<section class="sec sec-paper">
  <div class="wrap cols2" style="align-items:start;gap:clamp(34px,5vw,80px)">
    <div>
      <h2 class="d2" style="margin-bottom:26px">Buyer enquiry</h2>
      <form class="form" id="quoteForm" novalidate>
        <p class="fset">Who you are</p>
        <div class="row2">
          <div class="field"><label for="f-name">Your name <span class="req">*</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="f-company">Company <span class="req">*</span></label>
            <input id="f-company" name="company" type="text" autocomplete="organization" required></div>
        </div>
        <div class="row2">
          <div class="field"><label for="f-email">Email <span class="req">*</span></label>
            <input id="f-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="f-phone">Phone or WhatsApp</label>
            <input id="f-phone" name="phone" type="tel" autocomplete="tel"></div>
        </div>
        <div class="field"><label for="f-country">Country <span class="req">*</span></label>
          <input id="f-country" name="country" type="text" autocomplete="country-name" required></div>

        <p class="fset">What you need</p>
        <div class="field">
          <label id="picksLabel">Flowers required</label>
          <div class="picks" role="group" aria-labelledby="picksLabel" id="picks">${pickList}</div>
          <p class="hint">Anything you added from the catalogue is already selected here.</p>
        </div>
        <div class="row2">
          <div class="field"><label for="f-volume">Estimated quantity</label>
            <input id="f-volume" name="volume" type="text" placeholder="e.g. 2 full boxes solidago per week"></div>
          <div class="field"><label for="f-spec">Stem length / specification</label>
            <input id="f-spec" name="spec" type="text" placeholder="e.g. 60-70 cm, 250 g bunches, tight cut"></div>
        </div>
        <div class="row2">
          <div class="field"><label for="f-dest">Delivery destination</label>
            <input id="f-dest" name="dest" type="text" placeholder="Airport or delivery address"></div>
          <div class="field"><label for="f-freq">Shipment frequency</label>
            <input id="f-freq" name="freq" type="text" placeholder="e.g. weekly, or a one-off trial"></div>
        </div>
        <div class="field"><label for="f-msg">Message</label>
          <textarea id="f-msg" name="message" placeholder="Cut stage, your own grading spec, packaging or labelling requirements..."></textarea></div>
        <div class="hp" aria-hidden="true">
          <label for="f-website">Website</label>
          <input id="f-website" name="website" type="text" tabindex="-1" autocomplete="off"></div>
        <div class="hero-btns" style="margin:4px 0 0">
          <button class="btn btn-p" type="submit" data-send="post">${ico.mail} Send enquiry</button>
          <button class="btn btn-o" type="button" data-send="wa">${ico.wa} Send on WhatsApp</button>
        </div>
        <p class="form-status" id="formStatus" role="status" aria-live="polite"></p>
        <p class="form-note">We use what you send here to price your enquiry and to answer it.
          Nothing goes to anyone else. You get a copy by email.</p>
        <noscript><p class="form-note">This form needs JavaScript to send. Please email or
          WhatsApp us using the details above and we will pick it up the same way.</p></noscript>
      </form>
    </div>
    <div>
      <div class="figure" style="aspect-ratio:4/5">${img('bunch-real', 'A graded bunch of solidago, cut and bunched to spec on a partner farm', 760, { ratio: '4/5' })}</div>
      <div class="note" style="margin-top:24px">
        <b>What you get back:</b> a written quote per line with stem length, bunch spec, box count,
        FOB Nairobi price and the freight rate for your shipment.
      </div>
    </div>
  </div>
</section>` };
}

// ============================================================ 404
export function notFound() {
  return { title: `Page not found | ${company.name}`, desc: 'Page not found.', path: '/404.html',
    noindex: true, body: `
<section class="phead" style="padding-bottom:clamp(64px,9vw,120px)">
  ${mark('phead-mark')}
  <div class="wrap">
    <p class="kicker">404</p>
    <h1 class="d1">That page has<br>been cut</h1>
    <p class="lead">That link no longer works. Try the catalogue.</p>
    <div class="hero-btns">
      <a class="btn btn-g" href="/catalogue/">See the catalogue ${ico.arrow}</a>
      <a class="btn btn-o" href="/">Back to home</a>
    </div>
  </div>
</section>` };
}
