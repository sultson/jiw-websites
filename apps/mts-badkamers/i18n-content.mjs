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

import { TR_PROJ, TR_TEXT, TR_SVC } from './i18n-content-tr.mjs';
import { RU_PROJ, RU_TEXT, RU_SVC } from './i18n-content-ru.mjs';

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

// ---- dienstenpagina's -------------------------------------------------------
// t = title, h = h1, k = kicker, l = lead, d = meta description, i = intro,
// o = omvat (paren), s = slotalinea. Zelfde terugval per veld als de projecten.
const EN_SVC = {
  badkamerrenovatie: {
    t: 'Bathroom Renovation Apeldoorn',
    k: 'Complete bathrooms',
    h: 'A complete bathroom, from strip-out to handover',
    l: 'Everything between the old bathroom and the new one, done by the same craftsman: stripping out, pipework, waterproofing, tiling and fitting.',
    d: 'Complete bathroom renovation in Apeldoorn and the surrounding area. Strip-out, pipework, waterproofing, tiling and fitting by one craftsman. Fixed price after the survey.',
    i: [
      'Renovating a bathroom is not one job but six, and at most firms a different person turns up for each one. Not here. The strip-out, the water, the drainage, the heating, the tiling and the fitting are all done by Mike himself. That saves you the part of a renovation people usually find worst: working out who to call when something is not right.',
      'The order is fixed because the building work demands it. First everything comes out, back to the shell, because only then can you see what sits behind the wall. Then the pipework, measured out around where the sanitaryware will go. Then the waterproofing, and that is the one part you can never repair later without taking the tiles off. Only after that does the tiling start.',
      'A complete bathroom is usually two to three weeks of work. You hear at the survey which weeks those are, and you hear straight away if anything shifts. The room is sealed off, the rubble leaves every day and the toilet stays in service as long as possible.',
    ],
    o: [
      ['Strip-out and disposal', 'Old bathroom out, back to the screed or back to the shell. Rubble leaves every day.'],
      ['Pipework and drainage', 'New water pipes and waste, measured out around the new sanitaryware.'],
      ['Underfloor heating', 'Electric or run off the boiler, so no radiator has to steal space.'],
      ['Waterproofing', 'Floor, corners and shower zone sealed before a single tile goes on.'],
      ['Wall and floor tiles', 'Set out before anything is cut. Herringbone, hexagon, large format or stone look.'],
      ['Sanitaryware and fitting', 'Basin, unit, shower screen, toilet, taps and radiator fitted and connected.'],
    ],
    s: 'What the electrics need is discussed at the survey. If you would rather pick the materials yourself in a showroom, we fit those just as readily as anything we order.',
  },
  toiletrenovatie: {
    t: 'Toilet Renovation Apeldoorn',
    k: 'Toilet and cloakroom basin',
    h: 'A new toilet in a few days',
    l: 'Wall-hung toilet, concealed cistern, tiling and a small basin. The smallest room in the house, and the one where sloppy work shows up fastest.',
    d: 'Toilet renovation in Apeldoorn and the surrounding area. Wall-hung toilet, concealed cistern, tiling and cloakroom basin, usually finished within a few days.',
    i: [
      'A toilet is a couple of square metres, which is exactly why you see everything in it. A grout line that does not run through, a tile cut in the wrong place, a cistern a centimetre out of true: in a bathroom that disappears against the size of the room, in a toilet it sits at eye level.',
      'In a toilet renovation the old pan comes out, a concealed cistern goes into the wall and the waste is set at the new height. The wall around it is boarded and tiled as far up as you want: all the way to the ceiling, or halfway with plaster above it.',
      'Most toilets are finished in two to four days. That is shorter than a bathroom, but it is the room you miss most at home. So it gets finished in one run rather than slotted in between other jobs.',
    ],
    o: [
      ['Wall-hung toilet with concealed cistern', 'Cistern in the wall, waste at the right height, wall boarded and tiled.'],
      ['Tiling', 'Floor and wall, to the ceiling or up to a tile trim with plaster above.'],
      ['Cloakroom basin and tap', 'Including water and waste, even where there has never been a basin.'],
      ['Replacing a toilet without building work', 'Just the pan and cistern, tiling stays as it is.'],
      ['Ventilation', 'Extraction connected or replaced, so the damp actually leaves.'],
    ],
    s: 'Swapping a floor-standing toilet for a wall-hung one is possible too. That moves the waste, so it is something we look at during the survey.',
  },
  tegelwerk: {
    t: 'Tiler in Apeldoorn',
    k: 'Wall and floor tiles',
    h: 'Tiling where the lines run through',
    l: 'Herringbone, chevron, hexagon, large format and stone look. Also when tiling is the only job and the rest of the bathroom stays put.',
    d: 'Tiler in Apeldoorn and the surrounding area. Herringbone, chevron, hexagon and large-format tiling, also as a standalone job without a full renovation.',
    i: [
      'On a tiled floor you can tell within a second whether someone set it out or simply started in a corner. Setting out means working out in advance where the pattern lands, so you do not finish with a two-centimetre sliver in full view and the grout lines carry on around the corner.',
      'Patterns like herringbone and chevron demand that most. They only work if the substrate is dead straight, because any unevenness gets magnified by the pattern rather than hidden by it. Large-format tiles are the same for a different reason: the bigger the tile, the less an uneven substrate can be worked away in the adhesive.',
      'Tiling does not have to be part of a full renovation. Just a shower wall redone, a kitchen splashback, a hallway floor or a toilet: that works as a standalone job. Still in the same order, so we look at what is underneath first.',
    ],
    o: [
      ['Herringbone and chevron', 'Set out in advance, because in this pattern a centimetre out shows immediately.'],
      ['Large-format tiles', 'Flat substrate first, otherwise the tile will never sit true.'],
      ['Hexagon and mosaic', 'Also as a feature panel in a shower or behind a basin.'],
      ['Natural stone and stone look', 'Travertine, marble look and terrazzo, including the treatment that goes with them.'],
      ['Floor tiles over underfloor heating', 'Level the screed first, then tile.'],
      ['Grouting and silicone', 'Also on its own, when the old grout or silicone line is due for replacement.'],
    ],
    s: 'You can choose the tiles yourself or order them with us. Bring a photo or a sample to the survey and we will work out how much you need on the spot.',
  },
  'loodgieter-en-cv': {
    t: 'Plumber and Boilers Apeldoorn',
    k: 'Water, waste and heating',
    h: 'Pipework, boilers and everything behind the wall',
    l: 'Water pipes, drainage, radiators and boilers. The work you never see again after handover, which is exactly why you want it right first time.',
    d: 'Plumber in Apeldoorn and the surrounding area. Water pipes, drainage, leaks, radiators and boiler installation, also without a bathroom renovation.',
    i: [
      'Most installation work disappears behind a wall or under a floor. That does not make it less important, it only makes it more expensive to put right later. A branch at the wrong height, a waste pipe with too little fall, or a joint you can never reach again: those are the things a renovation still comes unstuck on years afterwards.',
      'At MTS Badkamers the installation work sits in the same pair of hands as the tiling. That is not a detail. The man running the pipes knows where the tiles are going, and the man tiling knows what is behind that wall. On a bathroom it saves you the classic argument between two trades about who measured wrong.',
      'Standalone jobs are fine too, with no renovation around them. Fixing a leak, replacing a tap or a radiator, running new water pipes, or replacing a boiler including the manifold and expansion vessel.',
    ],
    o: [
      ['Water pipes', 'Moved, replaced or run completely new, in copper or plastic.'],
      ['Drainage and waste', 'New waste with the right fall, including where sanitaryware moves.'],
      ['Finding and fixing leaks', 'Find where it is coming from first, open things up after.'],
      ['Boiler installation', 'Replacement or new installation, including manifold and expansion vessel.'],
      ['Radiators', 'Designer and towel radiators fitted or moved, including the pipework to them.'],
      ['Underfloor heating', 'Laid and connected to the boiler, or as an electric mat under the tiles.'],
    ],
    s: 'What the electrics need is discussed at the survey. For a leak or a dead boiler, a message with a photo is quickest.',
  },
};

const PROJ = { en: EN_PROJ, tr: TR_PROJ, ru: RU_PROJ };
const TEXT = { en: EN_TEXT, tr: TR_TEXT, ru: RU_TEXT };
const SVC = { en: EN_SVC, tr: TR_SVC, ru: RU_SVC };

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

// Dienstenpagina's. Zelfde terugval per veld: een dienst zonder vertaling levert
// een Engelse pagina met Nederlandse alinea's op, niet een lege pagina.
export function tService(loc, s) {
  const t = SVC[loc]?.[s.slug];
  return {
    ...s,
    title: t?.t || s.title,
    kicker: t?.k || s.kicker,
    h1: t?.h || s.h1,
    lead: t?.l || s.lead,
    desc: t?.d || s.desc,
    intro: t?.i || s.intro,
    omvat: t?.o || s.omvat,
    slot: t?.s || s.slot,
  };
}
