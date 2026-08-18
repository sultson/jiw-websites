// Vertaalde inhoud: projecttitels, intros, FAQ, voor/na-bijschriften, werkgebied
// en reviews. NL blijft de bron (projects.mjs, content.mjs); hier staat per taal
// alleen wat afwijkt.
//
// Alles valt terug op NL als een vertaling ontbreekt. Dat is opzet: een half
// vertaald project levert dan een pagina met een Nederlandse alinea op in plaats
// van een lege plek of een build die omvalt.
//
// Wat bewust NIET vertaald is (afspraak met Armando, 17-08-2026): de bijschriften
// onder de losse foto's en de fasekoppen op de projectpagina's. Dat is het
// leeuwendeel van de tekst en verandert het vaakst; niemand kiest een
// badkamerbouwer op een fotobijschrift.

import { TR_PROJ, TR_TEXT } from './i18n-content-tr.mjs';
import { RU_PROJ, RU_TEXT } from './i18n-content-ru.mjs';

// ---- projecten --------------------------------------------------------------
// t = title, k = kicker, g = tags, b = blurb, i = intro-alineas
const EN_PROJ = {
  'visgraat-badkamer-met-ligbad': {
    t: 'Herringbone, bath and underfloor heating',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Underfloor heating', 'Herringbone tiling'],
    b: 'A bathroom stripped back to the screed and rebuilt from scratch: new pipework, underfloor heating, a built-in bath and a herringbone feature wall.',
    i: [
      'Nothing of the old bathroom survived this job. The walls went back to the concrete, the floor was rebuilt and all the pipework was run again. That is the moment to get right the things you never see afterwards: where the drains sit, the fall of the shower floor, the connections behind the wall.',
      'Underfloor heating sits on top of the new floor, so no radiator has to steal space. The wall behind the basin is laid in herringbone. That pattern only works if the substrate is dead straight and the tiles are set out in advance.',
    ],
  },
  'terrazzo-met-vrijstaand-bad': {
    t: 'Terrazzo with a freestanding bath',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Terrazzo', 'Freestanding bath'],
    b: 'Old tiled bathroom out, terrazzo in. A freestanding bath under the window, a walk-in shower with a linear drain and a double basin on a wooden unit.',
    i: [
      'The old bathroom was tiled from top to bottom in small white tiles and laid out entirely around a corner bath. All of it was stripped out, back to the brickwork.',
      'What replaced it is calmer: terrazzo on the floor and in the shower, smooth walls, and a bath that stands free in the room instead of being pushed into a corner.',
    ],
  },
  'hexagon-badkamer-en-dakkapel': {
    t: 'Hexagon, terrazzo and a new dormer',
    k: 'Bathroom + extension',
    g: ['Full renovation', 'Dormer window', 'Hexagon tiling'],
    b: 'The biggest job in the archive: first the roof opened up for a dormer, then a complete bathroom in pink hexagon, terrazzo and a green ribbed vanity unit.',
    i: [
      'This bathroom was made bigger first. Scaffolding went up against the facade, the roof was opened and a dormer went in. Only then did the bathroom itself start.',
      'The finish was allowed some colour: pink hexagon tiles against a terrazzo-like base, a green ribbed unit with two basins, and a round mirror that throws the daylight from the new dormer into the room.',
    ],
  },
  'betonlook-met-zwart-staal': {
    t: 'Concrete look with black steel',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Concrete look', 'Double basin'],
    b: 'Large-format concrete look from floor to ceiling, a shower screen in black steel and two dark basins on a wooden unit.',
    i: [
      'The old bathroom was full of colour: yellow walls, old pipework, a layout that no longer worked. All of it came out, right down to the floor joists.',
      'The new bathroom is about calm. Large-format concrete-look tiles run from floor to ceiling, and the only real contrast is the black steel: the shower screen, the radiator, the taps and the toilet.',
    ],
  },
  'badkamer-met-betegelde-zitbank': {
    t: 'A tiled bench in the shower',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Tiled bench', 'LED lighting'],
    b: 'Warm beige tiles, a textured wall in green and a built bench with LED lighting underneath. Plus a linear drain across the full width.',
    i: [
      'The old bathroom was small, tiled in white and dated. The brief: a shower you can actually sit down in, without it turning into a bathroom for old age.',
      'The bench is built, tiled and lit from below with an LED strip so it appears to float. The back wall got a textured tile in green, the one place where the eye stops.',
    ],
  },
  'chevron-met-messing': {
    t: 'Black and white chevron with brass',
    k: 'Bathroom and toilet',
    g: ['Marble look', 'Chevron', 'Brass details'],
    b: 'Marble look on the walls, a black and white chevron pattern in the shower and brass taps, drain and rails as the accent.',
    i: [
      'A small footprint, a big statement. The walls are finished in marble look, and the shower got a black and white chevron pattern that runs from floor to ceiling.',
      'The brass accents were deliberately kept to a minimum: the linear drain, the taps and the rails. That only works if the pattern itself is laid dead straight. With chevron every joint is visible.',
    ],
  },
  'marmerlook-met-ronde-spiegel': {
    t: 'Marble look with a round mirror',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Marble look', 'Black sanitary ware'],
    b: 'An old room taken back to the brickwork and then finished in marble look with black taps, a black basin and a round, lit mirror.',
    i: [
      'Behind the old walls sat brickwork, old pipework and a ceiling that had to come out. All of that was replaced before a single tile went on.',
      'The finish is kept light: marble look on the walls, black taps as the counterweight and a round lit mirror above a black basin.',
    ],
  },
  'houtlook-inloopdouche': {
    t: 'Wood look with a walk-in shower',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Wood-look tiles', 'Linear drain'],
    b: 'Wood-look tiles on wall and floor, a walk-in shower with a full-width linear drain and a vanity unit with a mirrored wall.',
    i: [
      'Wood-look tiles give you the warmth of wood without the upkeep. They are harder to lay: the tiles are long and narrow, so any deviation in the substrate shows up straight away in the joint.',
      'The shower is level with the floor, with a linear drain against the wall, so the floor runs as one plane from the door to the shower head.',
    ],
  },
  'travertijn-met-natuursteen-wastafel': {
    t: 'Travertine with a natural stone basin',
    k: 'Bathroom and toilet',
    g: ['Travertine look', 'Natural stone', 'Round mirror'],
    b: 'A warm travertine look on wall and floor, a solid natural stone basin on a dark unit and a shower floor falling to the drain from four sides.',
    i: [
      'This bathroom is finished in a travertine look: a warm, lightly mottled stone look that keeps large surfaces calm.',
      'The centrepiece is the solid natural stone basin, with a round lit mirror above it. The tap is set into the wall so the top stays completely clear.',
    ],
  },
  'badkamer-met-ligbad-metamorfose': {
    t: 'From dated bathroom to clean lines',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Bath', 'Double basin'],
    b: 'A bathroom from the last century with brown tiling, a corner bath and a loose radiator, replaced by a clean room with a bath and a double basin.',
    i: [
      'This is the clearest before and after in the archive. The old bathroom had small brown tiles, a built-in bath with a tiled surround and a radiator in the middle of the wall.',
      'The new bathroom uses exactly the same square metres, but with large-format tiles, a clean bath, a double basin and a black design radiator.',
    ],
  },
  'woonkamer-en-keuken': {
    t: 'Living room, kitchen and stairwell',
    k: 'Renovation',
    g: ['Renovation', 'Indirect lighting', 'Wall panelling'],
    b: 'Not only bathrooms: a complete floor of the house with a lowered ceiling, indirect lighting, wooden wall panels and a herringbone floor.',
    i: [
      'This job shows the work does not stop at the bathroom door. Here the whole floor was taken on: ceilings out, new layout, new floor.',
      'The lowered ceiling with indirect lighting sets the tone. Underneath it: ribbed wooden panels around the TV, an open staircase and a herringbone floor that carries through into the kitchen.',
    ],
  },
  toiletrenovaties: {
    t: 'Toilet renovations',
    k: 'Toilet',
    g: ['Toilet renovation', 'Concealed cistern', 'Small basin'],
    b: 'A toilet is small, and that is exactly why it is unforgiving: every cut and every joint stands out. A series of complete toilet renovations, from strip-out to basin.',
    i: [
      'In a toilet you see everything. The room is so small that you take in a whole wall at a glance, so the tiling has to be right from the very first tile.',
      'These renovations all went the same way: old tiles and sanitary ware out, a new concealed cistern in a stud wall, large-format tiling and a wall-hung toilet with a small basin.',
    ],
  },
  'grijze-badkamer-houten-meubel': {
    t: 'Grey bathroom with a wooden unit',
    k: 'Complete bathroom',
    g: ['Full renovation', 'Walk-in shower', 'Wooden unit'],
    b: 'Large-format grey tiling, a wooden vanity unit with a round basin and a walk-in shower behind glass.',
    i: [
      'The old bathroom had a terracotta floor, a built-in bath and dated sanitary ware. The new layout traded the bath for a generous walk-in shower.',
      'The tiling is kept grey and large-format; the wood of the vanity unit does the rest.',
    ],
  },
  'patroontegels-in-de-douche': {
    t: 'Patterned tiles in the shower',
    k: 'Shower room',
    g: ['Patterned tiles', 'Waterproofing', 'Linear drain'],
    b: 'A shower with Portuguese patterned tiles as the back wall, set against a calm grey frame and with a linear drain in the floor.',
    i: [
      'Patterned tiles work best when they get one wall and the rest stays quiet. Here the patterned wall is the back of the shower; the side walls and the floor are kept plain.',
      'The real work sits under the tiling: a fully waterproofed shower floor falling towards a linear drain.',
    ],
  },
  'bruine-tegels-met-hexagon': {
    t: 'Brown tiles with hexagon',
    k: 'Complete bathroom',
    g: ['Hexagon', 'Round mirror', 'Walk-in shower'],
    b: 'Warm brown wall tiles, a hexagon panel as the accent and a round lit mirror above a clean vanity top.',
    i: [
      'A bathroom in warm, dark tones. The large wall tiles run right into the shower; the hexagon panel breaks that open in one place.',
      'The round lit mirror hangs clear of the wall, so you can see the tiling continue behind it.',
    ],
  },
  'leidingwerk-cv-en-techniek': {
    t: 'Pipework, heating and services',
    k: 'Installation work',
    g: ['Boiler', 'Manifold', 'Water pipes'],
    b: 'The part of the job you never see again: boilers, manifolds, expansion vessels and water pipes tucked away neatly and kept accessible.',
    i: [
      'Half of a bathroom is installation work. Water pipes, drainage, electrics and heating end up behind tiles and screed. After that you cannot easily get at them.',
      'These photos come from several jobs: boilers with a manifold and expansion vessel, new water pipes and drains, and the stud walls it all disappears into.',
    ],
  },
};

// ---- losse teksten: FAQ, voor/na, werkgebied, reviews -----------------------
const EN_TEXT = {
  faq: [
    {
      q: 'What does a bathroom renovation cost?',
      a: 'That depends on the size, the choice of tiles and how much has to happen behind the wall. That is why there is no calculator here: you first get a visit to the room, then a fixed quote with materials and labour listed separately. So you know where you stand before the first tile comes off.',
    },
    {
      q: 'How long does a complete bathroom take?',
      a: 'A complete bathroom is usually two to three weeks of work, a toilet a few days. At the visit you get a start date and a duration, and during the work you hear straight away if anything changes.',
    },
    {
      q: 'Can I keep living at home during the work?',
      a: 'Yes. The room is screened off, the rubble goes out every day and the rest of your house stays clean. The toilet stays in use as long as possible; if it really has to go out for a while, you know in advance.',
    },
    {
      q: 'Do you supply the materials as well?',
      a: 'Either way works. You choose in the showroom and we fit it, or we advise and order everything for you. A bathroom you bought yourself, including an IKEA one, we fit and connect just as well.',
    },
    {
      q: 'Do you also do tiling only, or plumbing only?',
      a: 'Yes. Single jobs are fine too: wall tiles only, replacing a tap or a radiator, fixing a leak, installing a boiler with a manifold or running new water pipes.',
    },
    {
      q: 'Who does the pipework and the technical side?',
      a: 'Mike does the water, the drainage and the heating himself. That is why installation and tiling are in one pair of hands here. What is needed for the electrics we discuss at the visit.',
    },
    {
      q: 'Do I get a guarantee on the work?',
      a: 'Yes, on the work delivered. MTS Badkamers is a trading name of M. Techno Service, registered with the Dutch Chamber of Commerce under number 91131537 and a verified company on Werkspot.',
    },
    {
      q: 'And if something turns up after handover?',
      a: 'Then you come back to the same man who built it. At handover we walk through everything together and snags are fixed straight away; after that the number stays the same.',
    },
    {
      q: 'Do you work outside Apeldoorn?',
      a: 'Yes. Apeldoorn is the home base, but Deventer, Zutphen, Arnhem, Epe, Vaassen and Twello are all within reach. For a complete renovation we will drive further. A message is the quickest way.',
    },
  ],
  ba: [
    {
      tab: 'Terrazzo',
      cap: 'Old tiled bathroom stripped back to the brickwork. Then terrazzo on floor and wall, with a freestanding bath under the same window.',
    },
    {
      tab: 'Concrete look',
      cap: 'Yellow walls and a layout that no longer worked. Now large-format concrete look from floor to ceiling, with black steel as the only contrast.',
    },
    {
      tab: 'Bath',
      cap: 'The old built-in bath with its tiled surround out, a clean bath with a concealed tap in. Same window, same square metres.',
    },
    {
      tab: 'Hexagon',
      cap: 'Back to the brickwork, a dormer added for daylight, and then pink hexagon with a green ribbed unit.',
    },
    {
      tab: 'Bench',
      cap: 'Small white tiling and a layout that wasted the room. Now warm beige tiles, a linear drain and a built-in bench.',
    },
    {
      tab: 'Walk-in shower',
      cap: 'Terracotta floor and a built-in bath out. The bath was traded for a generous walk-in shower behind glass.',
    },
  ],
  area: ['Right nearby', 'Within half an hour', 'Further out, by arrangement'],
  reviews: [
    {
      d: 'August 2026',
      t: 'Very happy with Mike, he handled the complete installation of our bathroom. Mike has an eye for detail and thinks along with you. I can recommend him to anyone.',
    },
    {
      d: 'June 2026',
      t: 'Mike helped us out brilliantly, he did our whole bathroom. From the strip-out to installing everything. Mike always kept to his appointments. Absolutely recommended!!',
    },
    {
      d: 'April 2025',
      t: 'A craftsman with an enormous eye for detail! The bathroom is genuinely beautiful. Pleasant communication and very tidy work.',
    },
  ],
};

const PROJ = { en: EN_PROJ, tr: TR_PROJ, ru: RU_PROJ };
const TEXT = { en: EN_TEXT, tr: TR_TEXT, ru: RU_TEXT };

// ---- getters ----------------------------------------------------------------
// Elk van deze valt per veld terug op de Nederlandse bron. Per veld en niet per
// project: zo levert een half afgemaakte vertaling nog steeds een werkende
// pagina op.
export function tProject(loc, p) {
  const t = PROJ[loc]?.[p.slug];
  return {
    ...p,
    title: t?.t || p.title,
    kicker: t?.k || p.kicker,
    tags: t?.g || p.tags,
    blurb: t?.b || p.blurb,
    intro: t?.i || p.intro,
    // Fasekoppen en bijschriften blijven Nederlands (zie de kop van dit bestand).
    sections: p.sections || [],
  };
}

export function tFaq(loc, i, f) {
  const t = TEXT[loc]?.faq?.[i];
  return { q: t?.q || f.q, a: t?.a || f.a };
}

export function tBa(loc, i, b) {
  const t = TEXT[loc]?.ba?.[i];
  return { tab: t?.tab || b.tab, cap: t?.cap || b.cap };
}

export function tArea(loc, i, h) {
  return TEXT[loc]?.area?.[i] || h;
}

// Reviews zijn citaten van klanten. De naam blijft altijd staan zoals hij op
// Werkspot staat; alleen de datum en de tekst worden vertaald, en dat is ook wat
// Werkspot zelf doet met buitenlandse bezoekers.
export function tReview(loc, i, r) {
  const t = TEXT[loc]?.reviews?.[i];
  return { ...r, d: t?.d || r.d, t: t?.t || r.t };
}
