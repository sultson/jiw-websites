// Single source of truth for the whole site.
// Anything marked TODO is a placeholder the client still has to confirm.

export const company = {
  name: 'JASM Flowers',
  legal: 'JASM Flowers Ltd',
  tagline: 'Premium Kenyan summer flowers and foliage for professional buyers',
  strap: 'Consistent quality. Reliable supply.',
  origin: 'Naivasha & Mount Kenya, Kenya',
  email: 'sales@jasmflowers.co.ke',
  emailAlt: 'mary@jasmflowers.co.ke',
  phone: '+254 710 693 400',
  phoneDigits: '254710693400',
  phoneAlt: '+254 728 466 288',
  phoneAltDigits: '254728466288',
  whatsapp: '254710693400',
  // Confirmed by the client 30 Sep 2026. No longer a placeholder.
  address: 'Airport North Road, P.O. Box 5212-100, Nairobi, Kenya',
  addressStreet: 'Airport North Road',
  addressPoBox: '5212-100',
  domain: 'jasmflowers.jouwidealewebsite.nl',
};

// The four words the client wants the business measured against. Updated Sep 2026:
// "Transparency" gave way to "Competitive pricing", which the client's own copy now
// names as a pillar in the hero, the why-us block and the footer.
export const values = ['Quality', 'Reliability', 'Competitive pricing', 'Long-term partnerships'];

/**
 * What actually happens to the product, in the client's own words. This replaced a list of
 * named certification schemes (KFC, Fairtrade, GLOBALG.A.P., MPS-A): the client's Sep 2026
 * brief says not to publish certifications unless JASM can substantiate them, and after two
 * rounds of asking they still have not confirmed which they hold. A process we know is real
 * beats a badge we cannot stand behind.
 */
export const qualityFocus = [
  { t: 'Harvesting',
    d: 'Cut at the maturity your order specifies, not at whatever stage the block happens to be.' },
  { t: 'Grading',
    d: 'Checked against the agreed specification, stem length and grade included.' },
  { t: 'Bunching & packing',
    d: 'Prepared and packed to the agreed format and the requirements of the shipment.' },
  { t: 'Post-harvest handling',
    d: 'We work with our grower and packing partners so stems are handled carefully after the cut.' },
  { t: 'Export preparation',
    d: 'We coordinate the shipment and export requirements before the flowers leave Kenya.' },
];

const J = 'Jan', F = 'Feb', M = 'Mar', A = 'Apr', MY = 'May', JN = 'Jun',
      JL = 'Jul', AU = 'Aug', S = 'Sep', O = 'Oct', N = 'Nov', D = 'Dec';
export const MONTHS = [J, F, M, A, MY, JN, JL, AU, S, O, N, D];
const ALL_YEAR = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

/**
 * The colour range the client gave for the rose family in Sep 2026. One list, because they
 * quoted one list for roses, spray roses, garden roses and spray garden roses together.
 * "Bio colours" is the trade term for stems tinted through the stem in the packhouse.
 *
 * David Austin is deliberately NOT on this list: those are licensed named varieties that come
 * in the breeder's own palette and are not tinted, so claiming purple or bio colours there
 * would be a claim we cannot stand behind. Worth putting back to the client.
 */
const ROSE_COLOURS = ['White', 'Red', 'Yellow', 'Orange', 'Pink', 'Soft pink', 'Peach',
  'Purple', 'Cream', 'Bio colours'];

/**
 * tier: 'signature' = the core programme, 'core' = the wider grower network
 * focus: 'main' = the two lines the business leads with, 'programme' = core but secondary
 * avail: 12 numbers, 0 = none, 1 = available, 2 = peak
 */
export const varieties = [
  {
    slug: 'solidago', name: 'Solidago', latin: 'Solidago canadensis',
    common: 'Goldenrod', tier: 'signature', focus: 'main', group: 'Filler',
    img: 'solidago',
    colours: ['Golden yellow', 'Tinted'],
    lengths: ['50 cm', '60 cm', '70 cm', '80 cm'],
    packBunch: '20 stems', packBox: '300 stems / full box',
    vaseLife: '10-14 days',
    blurb: 'Our largest programme. Dense, feathery plumes on a strong straight stem, cut at the ' +
      'stage that travels and opens in the vase.',
    why: 'The workhorse filler for supermarket bouquets and florist work. Our growers plant it for us ' +
      'year round, so the volume is there through the European peaks.',
  },
  // The client's Sep 2026 copy names Baby Blue and Silver Dollar as two separate key flowers
  // and gives each its own section and its own pricing request. They used to share one card,
  // which meant one photo, one blurb and one quote button for two products a buyer orders
  // separately. They are two entries now. Both are `focus: main`, so the home page still shows
  // exactly three core cards in its three-column row - Solidago and the two eucalyptus lines,
  // which is the client's own key-flower list.
  {
    slug: 'eucalyptus-baby-blue', name: 'Eucalyptus Baby Blue', latin: 'Eucalyptus cinerea',
    common: 'Baby Blue', tier: 'signature', focus: 'main', group: 'Foliage',
    img: 'eucalyptus-baby-blue',
    colours: ['Powder blue', 'Blue green'],
    lengths: ['50 cm', '60 cm', '70 cm', '80 cm'],
    // Was sold by weight (250/300 g). The client's 5 Oct sheet prices both eucalyptus
    // lines by stem count instead, so the catalogue counts stems.
    packBunch: '10 stems', packBox: '300 stems / full box',
    vaseLife: '14-21 days',
    blurb: 'Small round powder-blue leaves on a fine stem, with the scent the leaf is bought for. ' +
      'Cut at the stage that holds its bloom rather than the stage that fills a box fastest.',
    why: 'Grown at altitude the leaf keeps its colour and does not black off in transit. ' +
      'Foliage is where bouquet margin sits.',
  },
  {
    slug: 'eucalyptus-silver-dollar', name: 'Eucalyptus Silver Dollar',
    latin: 'Eucalyptus polyanthemos',
    common: 'Silver Dollar', tier: 'signature', focus: 'main', group: 'Foliage',
    img: 'eucalyptus-silver-dollar',
    colours: ['Silver green', 'Grey green'],
    lengths: ['50 cm', '60 cm', '70 cm', '80 cm'],
    packBunch: '10 stems', packBox: '300 stems / full box',
    vaseLife: '14-21 days',
    blurb: 'The large rounded coin leaf, on a straighter and heavier stem than Baby Blue. ' +
      'Used where a bouquet needs structure and volume rather than texture.',
    why: 'One stem does the work of three fillers, which is why bouquet lines keep coming back ' +
      'to it. Holds shape for weeks in the vase.',
  },
  {
    slug: 'limonium', name: 'Limonium', latin: 'Limonium perezii / latifolium',
    common: 'Sea lavender, misty', tier: 'signature', focus: 'programme', group: 'Filler',
    img: 'limonium',
    // Matched to the photo the client sent on 29 Sep: the yellow line is in the bunch too.
    colours: ['Lavender', 'Deep purple', 'Yellow', 'White'],
    lengths: ['50 cm', '60 cm', '70 cm'],
    packBunch: '25 stems', packBox: '300 stems / full box',
    vaseLife: '12-18 days',
    blurb: 'Airy sprays of small papery flowers on a branched stem, graded so every bunch carries ' +
      'the same spray weight.',
    why: 'Long vase life, dries well, and fills volume without adding weight to the box. ' +
      'A cheap way to make a bouquet look twice the size.',
  },

  {
    slug: 'gypsophila', name: 'Gypsophila', latin: 'Gypsophila paniculata',
    common: "Baby's breath", tier: 'core', group: 'Filler', img: 'gypsophila',
    // Client photo, 9 Oct 2026. The card has said "Dyed to order" since the first build
    // and nothing on the site showed what that means; this is their own tinted bunch.
    img2: 'gypsophila-tinted',
    img2Alt: 'A bunch of tinted gypsophila in blue, pink, yellow and lime, held up in the field',
    img2Cap: 'Tinted to your colour reference',
    colours: ['White', 'Dyed to order'],
    lengths: ['60 cm', '70 cm', '80 cm'],
    packBunch: '25 stems', packBox: '300-500 stems / full box',
    vaseLife: '10-14 days',
    blurb: 'Million Star and Xlence types, cut at 60 to 70 percent open.',
    why: 'Still the highest volume filler in Europe. We can hold a standing weekly weight.',
  },
  {
    slug: 'carnations', name: 'Carnations', latin: 'Dianthus caryophyllus',
    common: 'Single standard', tier: 'core', group: 'Flower', img: 'carnations',
    colours: ['Full colour range'],
    lengths: ['50 cm', '60 cm', '70 cm'],
    packBunch: '20 stems', packBox: '400-600 stems / full box',
    vaseLife: '14-21 days',
    blurb: 'Large single head on a strong node, sleeved per bunch.',
    why: 'Long vase life and low breakage make it the safest line to ship long haul.',
  },
  {
    slug: 'spray-carnations', name: 'Spray Carnations', latin: 'Dianthus caryophyllus',
    common: 'Multi head', tier: 'core', group: 'Flower', img: 'spray-carnations',
    colours: ['Full colour range', 'Novelty & bicolour'],
    lengths: ['50 cm', '60 cm', '70 cm'],
    packBunch: '10 stems', packBox: '300-400 stems / full box',
    vaseLife: '14-18 days',
    blurb: 'Three to five open blooms per stem with buds to follow.',
    why: 'One stem does the work of a small bunch. Strong in mixed bouquet programmes.',
  },
  {
    slug: 'statice', name: 'Statice', latin: 'Limonium sinuatum',
    common: 'Winged statice', tier: 'core', group: 'Filler', img: 'statice',
    colours: ['Purple', 'White', 'Apricot', 'Yellow', 'Rose', 'Mixed'],
    lengths: ['50 cm', '60 cm', '70 cm'],
    packBunch: '10 stems', packBox: '200 bunches / full box',
    vaseLife: '14-21 days',
    blurb: 'Papery clustered blooms on a winged stem, in single colours or a graded mix.',
    why: 'Holds colour when dried, so it carries into dried and preserved programmes too.',
  },
  {
    slug: 'chrysanthemums', name: 'Chrysanthemums', latin: 'Chrysanthemum indicum',
    common: 'Spray & disbud', tier: 'core', group: 'Flower', img: 'chrysanthemums',
    colours: ['White', 'Yellow', 'Pink', 'Purple', 'Red', 'Bio colours'],
    lengths: ['60 cm', '70 cm', '80 cm'],
    packBunch: '10 stems', packBox: '200-220 stems / full box',
    vaseLife: '14-21 days',
    // Zembla is a variety, not a colour, so it belongs in the description rather than the swatches.
    blurb: 'Santini, daisy and disbud forms depending on the programme, including Zembla disbud ' +
      'in white and yellow.',
    why: 'Vase life is the longest on our list. A safe volume line for retail.',
  },
  {
    slug: 'hydrangeas', name: 'Hydrangeas', latin: 'Hydrangea macrophylla',
    common: 'Mophead', tier: 'core', group: 'Flower', img: 'hydrangeas',
    colours: ['White', 'Pink', 'Cerise', 'Red', 'Blue', 'Purple', 'Green', 'Bio colours'],
    lengths: ['50 cm', '60 cm', '70 cm'],
    packBunch: '5 stems, individually netted', packBox: '40-60 stems / full box',
    vaseLife: '7-12 days',
    blurb: 'Cut at the mature antique stage so the head travels and holds shape.',
    why: 'High value per stem and a strong wedding and event line. Ships hydrated.',
  },
  {
    slug: 'delphiniums', name: 'Delphiniums', latin: 'Delphinium elatum',
    common: 'Larkspur', tier: 'core', group: 'Flower', img: 'delphiniums',
    colours: ['White', 'Blue', 'Purple', 'Pink'],
    lengths: ['70 cm', '80 cm', '90 cm'],
    packBunch: '10 stems', packBox: '100-200 stems / full box',
    vaseLife: '7-10 days',
    blurb: 'Tall dense spires, packed upright to protect the florets.',
    why: 'The line that gives a bouquet height. Very little of it comes out of Kenya well packed.',
  },
  {
    slug: 'eryngium', name: 'Eryngium', latin: 'Eryngium planum',
    common: 'Sea holly', tier: 'core', group: 'Filler', img: 'eryngium',
    colours: ['Steel blue', 'Silver'],
    lengths: ['60 cm', '70 cm'],
    packBunch: '10 stems', packBox: '200 bunches / full box',
    vaseLife: '14-21 days',
    blurb: 'Spiky metallic bracts on a branched stem.',
    why: 'A texture line with no real substitute, and it dries without losing colour.',
  },
  // The client asked for Roses and Spray Roses to stop sharing one entry, and sent a mixed
  // varieties picture for each. They are different products on a buyer's order sheet, so they
  // are different lines here.
  {
    slug: 'roses', name: 'Roses', latin: 'Rosa hybrida',
    common: 'Premium single head', tier: 'core', group: 'Rose', img: 'roses',
    colours: ROSE_COLOURS,
    lengths: ['40 cm', '50 cm', '60 cm', '70 cm', '80 cm'],
    packBunch: '10 stems, sleeved', packBox: '200-400 stems / full box',
    vaseLife: '8-14 days',
    blurb: 'One large head per stem, in mixed varieties or straight colour. Head size is graded ' +
      'against the stem length you order.',
    why: 'Kenya is the reference origin for roses. We buy on head size and neck strength.',
  },
  {
    slug: 'spray-roses', name: 'Spray Roses', latin: 'Rosa hybrida',
    common: 'Multi head', tier: 'core', group: 'Rose', img: 'spray-roses',
    colours: ROSE_COLOURS,
    lengths: ['40 cm', '50 cm', '60 cm', '70 cm'],
    packBunch: '10 stems, sleeved', packBox: '200-300 stems / full box',
    vaseLife: '8-14 days',
    blurb: 'Three to five smaller heads on a branched stem, available as a graded mix of ' +
      'varieties or as a single colour.',
    why: 'One stem carries a whole spray, so it does the work of a small bunch in a mixed bouquet.',
  },
  {
    slug: 'garden-roses', name: 'Garden Roses', latin: 'Rosa hybrida',
    common: 'Open cupped', tier: 'core', group: 'Rose', img: 'garden-roses',
    colours: ROSE_COLOURS,
    lengths: ['40 cm', '50 cm', '60 cm'],
    packBunch: '10 stems, individually netted', packBox: '100-200 stems / full box',
    vaseLife: '5-8 days',
    blurb: 'Many petalled cupped blooms cut at a stage that opens on arrival.',
    why: 'Event and bridal work. Priced per stem, so the cut stage matters more than the count.',
  },
  {
    slug: 'spray-garden-roses', name: 'Spray Garden Roses', latin: 'Rosa hybrida',
    common: 'Multi head garden', tier: 'core', group: 'Rose', img: 'spray-garden-roses',
    colours: ROSE_COLOURS,
    lengths: ['40 cm', '50 cm', '60 cm'],
    packBunch: '10 stems, netted', packBox: '100-200 stems / full box',
    vaseLife: '5-8 days',
    blurb: 'Several cupped garden blooms per stem, cut open.',
    why: 'The romantic look of a garden rose at a working price point.',
  },
  {
    slug: 'david-austin', name: 'David Austin', latin: 'Rosa (Austin selections)',
    common: 'English garden roses', tier: 'core', group: 'Rose', img: 'david-austin',
    colours: ['White', 'Cream', 'Peach', 'Soft pink', 'Pink'],
    lengths: ['40 cm', '50 cm', '60 cm'],
    packBunch: '10 stems, individually netted', packBox: '100 stems / full box',
    vaseLife: '4-7 days',
    blurb: 'Licensed Austin varieties from nominated farms, deeply cupped rosette form.',
    why: 'The top of the bridal market. Made to order for a delivery date.',
  },
];

// Availability by month. 2 = peak, 1 = available, 0 = out.
const AVAIL = {
  solidago: ALL_YEAR.map((_, i) => ([9, 10, 11, 0, 1].includes(i) ? 2 : 1)),
  'eucalyptus-baby-blue': ALL_YEAR,
  'eucalyptus-silver-dollar': ALL_YEAR,
  limonium: ALL_YEAR,
  gypsophila: ALL_YEAR,
  carnations: ALL_YEAR,
  'spray-carnations': ALL_YEAR,
  statice: [1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1],
  chrysanthemums: ALL_YEAR,
  hydrangeas: [2, 2, 2, 1, 1, 0, 0, 1, 1, 2, 2, 2],
  delphiniums: [1, 1, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1],
  eryngium: [1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1],
  roses: ALL_YEAR.map((_, i) => ([0, 1, 8, 9, 10, 11].includes(i) ? 2 : 1)),
  'spray-roses': ALL_YEAR.map((_, i) => ([0, 1, 8, 9, 10, 11].includes(i) ? 2 : 1)),
  'garden-roses': [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
  'spray-garden-roses': [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
  'david-austin': [2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2],
};
varieties.forEach(v => { v.avail = AVAIL[v.slug] || ALL_YEAR; });

export const signature = varieties.filter(v => v.tier === 'signature');
export const mainFocus = varieties.filter(v => v.focus === 'main');
// The home page leads with the three key flowers and rails everything else, Limonium
// included. Limonium is still tier `signature`, so the catalogue keeps tagging it Core -
// it is a core programme line the client does not lead with, which is what they have said
// about it twice now ("an additional core programme product").
export const homeRail = varieties.filter(v => v.focus !== 'main');

/**
 * What actually happens between a buyer's first mail and the box landing, in the order the
 * client describes it (Sep 2026 copy, "From your requirements to your shipment").
 *
 * This replaced a production timeline - Plan, Grow, Harvest & grade, Pack & export, Deliver.
 * That was the wrong process to put on the home page: it described a crop rather than an
 * order, and it implied every order is contract-grown from planting, which is not how JASM
 * buys. The real first move is an availability check with the growing partners, and the real
 * second is a quotation. Contract growing does exist, but only for programme buyers, so it
 * now sits on the About page with the grower partnerships instead of standing in for the
 * default route. The packhouse timeline still lives on the shipping page as `chain`.
 */
export const steps = [
  { n: '01', t: 'Tell us what you need',
    d: 'Send the varieties, stem lengths, quantities and where it has to land. A list in a mail ' +
       'is enough to start.' },
  { n: '02', t: 'We check availability',
    d: 'We go to our growing partners with your specification and confirm what can actually be ' +
       'cut for you, in what volume and from when.' },
  { n: '03', t: 'You get a quotation',
    d: 'A written price against the agreed specification, quantity and shipment, so you can ' +
       'compare it with what you pay now.' },
  { n: '04', t: 'We prepare your order',
    d: 'Once confirmed we coordinate harvesting, grading, packing and export preparation against ' +
       'that same specification.' },
  { n: '05', t: 'Your flowers ship',
    d: 'We book the shipment and keep you posted while it travels. Pallet photos before it ' +
       'leaves, on request.' },
];

export const reasons = [
  { t: 'Cut to order',
    d: 'Your stems are cut after your order is confirmed.' },
  { t: 'Graded to your specification',
    d: 'Stem length, bunch weight and cut stage are set per customer and checked before the box closes.' },
  { t: 'Photos before shipment',
    d: 'A photo of your pallet before it leaves Nairobi, on request.' },
  { t: 'One named contact',
    d: 'We assign one contact to your account, in your time zone.' },
  { t: 'One partner, the whole list',
    d: 'Fillers, foliage and roses on one airway bill, so one bouquet costs one freight minimum.' },
  // Replaced an altitude claim that repeated the section directly below it. The client's own
  // Sep 2026 copy names competitive pricing as a pillar, and it had nowhere else to live.
  { t: 'Competitive pricing',
    d: 'We price with the grower and the buyer in the same conversation, so the number works ' +
       'commercially at both ends.' },
];

export const faqs = [
  // Client wording, 5 Oct 2026. Replaced "a half box for a trial, a full box for a standing
  // programme": the minimum is five boxes now, trial included.
  { q: 'What is the minimum order?',
    a: 'A minimum order of 5 boxes applies. For first-time customers, we offer a minimum trial ' +
       'order of 5 boxes. Boxes can be mixed across different flower varieties, allowing you to ' +
       'test several lines in one shipment while meeting the minimum order requirement.' },
  // Also client wording, 5 Oct 2026. The old answer said an order confirmed early in the week
  // normally flies that same week, which is a shorter lead time than the one they now publish.
  { q: 'How long from order to delivery?',
    a: 'Orders should be confirmed 4 days before the scheduled shipment date. Earlier booking is ' +
       'recommended for larger volumes and standing programmes to ensure availability and ' +
       'consistent supply.' },
  { q: 'Do you ship direct or through the Dutch auction?',
    a: 'Direct. Your box is built for you and flown to you. Nothing goes through the clock, which ' +
       'saves a day of handling and a margin.' },
  // The client removed every named European airport on 5 Oct: Amsterdam and Liege came out of
  // the cold chain steps and the whole Airports card came off the shipping page. Naming them
  // here would put the claim straight back.
  { q: 'Which airports do you fly into?',
    a: 'We fly into the destination airport agreed on your order. Tell us where the shipment has ' +
       'to land and we quote the route with it.' },
  { q: 'How is the cold chain protected?',
    a: 'Pre-cooled within an hour of cutting, sealed into pre-chilled boxes, held at 2 to 4 C airside ' +
       'and in the aircraft hold. Temperature is logged and the log travels with the shipment.' },
  { q: 'Can we get our own grading spec?',
    a: 'Yes. Stem length, bunch weight, stem count and cut stage are set per customer and written into ' +
       'the order, and that spec is what the packhouse checks against.' },
  // Client wording, 30 Sep 2026. The old answer promised a credit or a replacement on the next
  // flight; they do not want that committed to in public, only the process.
  { q: 'What happens if a box arrives short or damaged?',
    a: 'If a quality or transit issue occurs, please share photos and relevant shipment details ' +
       'within 24 hours of arrival. We will assess the issue promptly and agree on the ' +
       'appropriate resolution.' },
  { q: 'Do you supply dyed or tinted flowers?',
    // Client, 9 Oct 2026: solidago out. They tint gypsophila and roses, not solidago.
    a: 'Yes, on gypsophila and roses. Tinting is done in the packhouse to your colour reference.' },
];

/**
 * The regions the client leads with. Sep 2026: their own copy says Europe, Africa, the
 * Middle East, Asia and worldwide, so the site stopped describing itself as a Europe-only
 * supplier. Europe is still first because that is where the volume and the named countries are.
 */
export const regions = ['Europe', 'Africa', 'Middle East', 'Asia', 'Worldwide'];

export const markets = [
  'Netherlands', 'Germany', 'United Kingdom', 'France', 'Belgium',
  'Italy', 'Spain', 'Poland', 'Scandinavia', 'Middle East',
];

/**
 * The hero market chip cycles through these. Europe leads because that is where the named
 * country volume is; the other regions follow, then the individual European markets, each
 * with the flag key it draws (see `flags` in ui.mjs). Names are the same strings as
 * `regions` and `markets`, so they reuse the existing translations.
 */
export const heroMarkets = [
  ['Europe', 'eu'], ['Africa', 'globe'], ['Middle East', 'globe'], ['Asia', 'globe'],
  ['Netherlands', 'nl'], ['Germany', 'de'], ['United Kingdom', 'gb'],
  ['France', 'fr'], ['Belgium', 'be'], ['Italy', 'it'], ['Spain', 'es'],
  ['Poland', 'pl'], ['Scandinavia', 'globe'],
];
