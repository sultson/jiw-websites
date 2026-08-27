/**
 * Maakt de sfeerbeelden die niet gefotografeerd konden worden.
 *
 * Toon over Leven heeft eigen foto's van het huis, van de wandelgroep, van de
 * kraam en van het werk uit de workshops, maar van veruit de meeste onderwerpen
 * op de site bestaat geen foto: een jongvolwassene achter een laptop, rouw, een
 * eerste keer aanbellen, een ouder die ziek is. Die beelden worden hier gemaakt.
 *
 * De klant heeft er een harde voorwaarde bij gesteld: een gemaakt beeld mag
 * nooit doorgaan voor een foto van een echte bezoeker. Daarom is in elke prompt
 * afgedwongen dat het onderwerp niet herkenbaar is - handen om een mok, een rug
 * op een pad, twee silhouetten voor een raam, een lege warme kamer. Verder houdt
 * de serie dezelfde beeldtaal aan als de mock-up van het bestuur: Nederlands
 * daglicht, hout, linnen, en een gedempt palet dat naast wijn, salie, teal en
 * crème kan liggen. Geen ziekenhuis, geen lintje, geen stockglimlach.
 *
 * Draaien met: node scripts/sfeerbeelden.mjs [naam ...]
 * Bestaande bestanden worden overgeslagen, dus een tweede run maakt alleen aan
 * wat nog mist. Een naam meegeven forceert dat ene beeld opnieuw.
 */
import {mkdirSync, existsSync, writeFileSync} from 'node:fs';

const SLEUTEL = 'n31amyHUqDm25NnCNUu52tcUjjZStVyC';
const URL_API = 'https://api.runware.ai/v1';
const MODEL = 'google:4@3'; // beste voor redactionele lifestylefotografie
const BREEDTE = 1264;
const HOOGTE = 848; // 3:2, de enige toegestane maat die bij de hero past
const UIT = 'raw/sfeer2';

/** Wat voor elk beeld geldt, zodat de serie er als één serie uitziet. */
const STIJL =
  'Editorial lifestyle photograph, photorealistic, shot on a 35mm lens with natural light. ' +
  'Dutch domestic setting, soft daylight, wood, linen and ceramics, muted natural palette of ' +
  'cream, olive green, deep wine red and soft teal. Calm, warm, unsentimental, not glossy, not stocky. ' +
  'No text, no lettering, no logo, no watermark, no signage. No hospital, no medical equipment, no ribbons.';

/** Bijna overal nodig: het onderwerp mag niet herkenbaar in beeld staan. */
const ANONIEM =
  'Faces are not visible or not readable: seen from behind, cropped out of frame, backlit into silhouette or softly out of focus. ' +
  'Nobody looks at the camera. Do not show a recognisable portrait.';

const BEELDEN = [
  /* ---------------------------------------------------------------- */
  /*  Het huis, aankomen en de praktische pagina's                     */
  /* ---------------------------------------------------------------- */
  [
    'voordeur',
    'The front door of an ordinary Dutch brick terraced house standing slightly open, seen from the pavement. ' +
      'Warm lamplight in the hallway behind the door, a coir doormat, a potted plant beside the step, bare autumn branches. ' +
      'Nobody in the frame.',
  ],
  [
    'gang-kapstok',
    'A narrow hallway in a Dutch house: a wooden coat rack with a few coats and a scarf, a pair of shoes on the floor, ' +
      'a glass-panelled door letting warm daylight through from the room beyond. Nobody in the frame.',
  ],
  [
    'twee-stoelen',
    'Two empty upholstered armchairs facing each other beside a large window with sheer curtains in a warm living room. ' +
      'A low wooden side table between them, a houseplant, a bookshelf out of focus behind. Late morning daylight. Nobody in the frame.',
  ],
  [
    'stoel-deken',
    'One empty armchair by a window in a quiet living room, a knitted wool blanket folded over the arm, ' +
      'a mug on the windowsill, soft grey-warm daylight, a few plants. Nobody in the frame.',
  ],
  [
    'huiskamerhoek',
    'A corner of a warm Dutch living room: a wooden bookshelf with well-read books and a few ceramic bowls, ' +
      'a standing lamp switched on, a large houseplant, a woven rug. Domestic and ordinary, clearly not a clinic. Nobody in the frame.',
  ],
  [
    'koffie-inschenken',
    'Close-up of two hands pouring coffee from an enamel pot into a ceramic mug on a worn wooden table, ' +
      'a second mug waiting beside it, steam catching the window light. Only hands and forearms in frame, cropped at the wrists and elbows.',
  ],
  [
    'twee-mokken',
    'Two mismatched ceramic mugs of tea side by side on a wide wooden windowsill, a small plant beside them, ' +
      'a Dutch garden softly out of focus through the glass. Nobody in the frame.',
  ],
  [
    'koffie-koek',
    'A wooden table with two mugs of coffee and a plate of simple Dutch biscuits and a slice of cake, ' +
      'a small vase of garden flowers, daylight from the left. Nobody in the frame.',
  ],
  [
    'tafel-gedekt',
    'A living-room table laid for visitors before anyone has arrived: eight mismatched ceramic mugs, a coffee pot, ' +
      'a jug of milk, a bowl of biscuits, chairs pulled slightly back. Warm morning light through a large window. Nobody in the frame.',
  ],
  [
    'telefoon-tafel',
    'A mobile phone and an open notepad with a pen lying on a wooden kitchen table next to a mug of tea, ' +
      'one hand resting at the edge of the frame, cropped at the wrist. Soft daylight from a window.',
  ],
  [
    'folders-tafel',
    'A low wooden coffee table with a small stack of plain unbranded paper leaflets, a pair of reading glasses, ' +
      'a mug and a houseplant, seen from slightly above. Warm living-room light. No readable text on the leaflets. Nobody in the frame.',
  ],
  [
    'notitieboek',
    'An open blank notebook and a pen on a wooden table beside a mug, daylight from a window, ' +
      'a plant out of focus behind. No writing or text on the page. Nobody in the frame.',
  ],
  [
    'deurbel',
    'Close-up of one hand reaching for the doorbell beside the front door of a Dutch brick house. ' +
      'Only the hand, the sleeve of a wool cardigan and the doorframe are in frame; the person is cropped out.',
  ],
  [
    'handen-gevouwen',
    'Close-up of a pair of folded hands resting on a wooden table beside an untouched mug of tea, ' +
      'soft window light. Cropped at the chest so the face is out of frame. Quiet and serious, not distressed.',
  ],
  [
    'ontvangst-hal',
    'Seen from behind: a person in a wool cardigan holding open an internal door into a warm, lit living room, ' +
      'welcoming gesture, back to the camera, face not visible. Wooden floor, plants, daylight in the room beyond.',
  ],
  [
    'huis-avondlicht',
    'An ordinary Dutch brick house at dusk seen from the quiet street, warm lamplight glowing in the ground-floor windows, ' +
      'a bicycle against the wall, a hedge and a lamppost. Blue evening sky. Nobody in the frame.',
  ],
  [
    'binnenkomen-huiskamer',
    'A warm Dutch living room seen from the doorway: sofas, a low wooden table with mugs, plants and a bookshelf. ' +
      'Two or three people are seated further back, small in the frame and softly out of focus, turned away from the camera so no face is readable. ' +
      'Late afternoon daylight.',
  ],

  /* ---------------------------------------------------------------- */
  /*  Ontmoeten en activiteiten                                        */
  /* ---------------------------------------------------------------- */
  [
    'stoelenkring',
    'A loose circle of eight empty wooden and upholstered chairs in a warm room with a wooden floor, ' +
      'a large window with daylight, a plant on a stool. Nobody in the frame.',
  ],
  [
    'ontmoeting-tafel',
    'Four adults around a wooden table in a warm living room with mugs and a plate of biscuits, photographed from directly behind ' +
      'the shoulder of the nearest one. Everyone is turned away from the camera or hidden behind that shoulder; not one face appears ' +
      'anywhere in the picture. Daylight through a window.',
  ],
  [
    'avond-tafel-volwassenen',
    'Adults in their forties at a wooden kitchen table in the evening, all photographed from directly behind so that only the backs ' +
      'of their heads, their shoulders and their cardigans are visible. Not one face appears anywhere in the picture. Mugs, bread and ' +
      'a bowl of soup, a warm pendant lamp overhead, coats over the chair backs.',
  ],
  [
    'tuinbank',
    'A weathered wooden garden bench under a tree in dappled afternoon light, a folded wool blanket and a mug on the seat, ' +
      'long grass and hydrangeas around it. Nobody in the frame.',
  ],
  [
    'gezinstafel',
    'A Dutch family kitchen table after breakfast: mismatched mugs, a child\'s crayon drawing, a fruit bowl, ' +
      'a pair of small shoes on the floor, daylight from the garden window. Nobody in the frame.',
  ],
  [
    'bureau-raam',
    'A simple home desk at a window: a closed laptop, a notebook, a mug and a small plant, ' +
      'a jacket over the back of the chair, morning daylight. Nobody in the frame.',
  ],
  [
    'muziek-huiskamer',
    'An acoustic guitar leaning against an armchair and a small hand drum on a woven rug in a warm living room, ' +
      'a music stand with blank paper, a lamp and plants. Nobody in the frame.',
  ],
  [
    'wegwijzer-pad',
    'A sandy footpath through a green Dutch wood splitting into two ways, dappled morning light, ' +
      'ferns and birch trunks. No signposts, no text. Nobody in the frame.',
  ],
  [
    'boeken-tafel',
    'A stack of well-used books and a mug of tea on a wooden table beside a window, a pair of reading glasses, ' +
      'a plant. No readable titles on the covers. Nobody in the frame.',
  ],
  [
    'overleg-papieren',
    'A wooden table with printed papers, a laptop and two mugs, photographed from above at table height. Two people are working at it, ' +
      'but the frame is cropped at chest height so only their sleeves, hands and torsos are in the picture; both heads are entirely above ' +
      'the top edge and not one face appears anywhere. Daylight from a window. No readable text on the papers.',
  ],

  /* ---------------------------------------------------------------- */
  /*  Herstel, energie en het gewone leven weer oppakken               */
  /* ---------------------------------------------------------------- */
  [
    'ochtend-raam',
    'Seen from behind: a person in a wool jumper standing at a large window holding a mug with both hands, ' +
      'looking out at a Dutch garden in early morning light. Back to the camera, face not visible.',
  ],
  [
    'raam-planten-ochtend',
    'A wide windowsill of an ordinary Dutch house crowded with houseplants in terracotta pots, a mug beside them, ' +
      'bright early morning light coming through the glass. Nobody in the frame.',
  ],
  [
    'fietspad-dijk',
    'One cyclist far away on a paved path along a Dutch dyke, seen from behind and small in a wide landscape, ' +
      'reeds, water and a big sky with high cloud in soft afternoon light. The figure is too distant to recognise.',
  ],
  [
    'raam-regen-mok',
    'A ceramic mug on a windowsill with rain running down the glass, a soft grey-warm interior light behind it, ' +
      'a blurred garden outside. Nobody in the frame.',
  ],
  [
    'gesprek-twee-silhouet',
    'Two people sitting opposite each other at a small table in front of a bright window, ' +
      'photographed against the light so both are dark silhouettes with no readable faces. Mugs on the table, a plant on the sill.',
  ],
  [
    'luisteren-bank',
    'Two people sitting side by side on a sofa in front of a bright window, seen from behind over the sofa back, ' +
      'only the backs of their heads and shoulders visible. A low table with mugs, a woven rug, warm afternoon light.',
  ],

  /* ---------------------------------------------------------------- */
  /*  Jong en kanker                                                   */
  /* ---------------------------------------------------------------- */
  [
    'jong-fietsen',
    'Two young adults walking their bicycles side by side along a Dutch canal path at golden hour, ' +
      'seen from behind, backpacks and everyday clothes, autumn trees. Faces not visible.',
  ],
  [
    'jong-laptop',
    'A young adult sitting at a desk by a window with an open laptop and study notes, ' +
      'photographed from behind over the shoulder so only the back of the head, the jumper and one hand are visible. ' +
      'Morning daylight, a mug and a plant on the desk. No readable text on the screen.',
  ],
  [
    'jong-bank-raam',
    'Two young adults sitting close together on a sofa, seen from behind, looking out through a large window ' +
      'at a Dutch street. A blanket over their knees, mugs on the sill. Faces not visible. Warm late daylight.',
  ],
  [
    'jong-telefoon',
    'Close-up of a young person\'s hands holding a phone above a wooden table beside a mug and a set of keys, ' +
      'cropped at the wrists so the face is out of frame. Daylight from a window. No readable text on the screen.',
  ],
  [
    'jong-keuken-avond',
    'Three young adults cooking together at the worktop of a small Dutch kitchen in the evening, all photographed from directly behind, ' +
      'so only their backs, shoulders and the backs of their heads are visible. Not one face appears anywhere in the picture. ' +
      'Chopping board, pans and mugs on the worktop, warm lamplight.',
  ],
  [
    'jong-buiten-bank',
    'Two young adults sitting on a park bench under a tree, seen from behind, jackets and a backpack beside them, ' +
      'a green Dutch park and low evening sun. Faces not visible.',
  ],
  [
    'jong-raam-alleen',
    'A young adult sitting sideways on a wide windowsill with knees drawn up, seen from behind, ' +
      'looking out at a Dutch garden in soft afternoon light. A mug beside them. Face not visible.',
  ],

  /* ---------------------------------------------------------------- */
  /*  Naasten, rouw en verlies                                         */
  /* ---------------------------------------------------------------- */
  [
    'naasten-handen',
    'Two pairs of adult hands resting on a worn wooden table, one hand laid lightly over another, ' +
      'two mugs of tea beside them. Cropped at the forearms so both faces are out of frame. Soft window light.',
  ],
  [
    'naasten-keuken',
    'Two adults in a Dutch kitchen in the early evening, seen from behind: one filling a kettle at the tap, ' +
      'the other leaning against the worktop. Warm lamplight, plants on the windowsill. Faces not visible.',
  ],
  [
    'naasten-samen-lopen',
    'Two adults walking side by side along a grassy Dutch dyke path in the afternoon, seen from behind, ' +
      'coats and a scarf, water and a wide sky. Faces not visible.',
  ],
  [
    'ouder-kind-raam',
    'An older adult and a younger adult standing side by side at a large window, seen from behind, ' +
      'looking out at a Dutch garden. Warm afternoon light, a plant on the sill. Faces not visible.',
  ],
  [
    'jonge-naaste-raam',
    'A teenager sitting on the floor against a wall beside a window with a schoolbag next to them, ' +
      'seen from the side and against the light so the face is in shadow and not readable. A Dutch bedroom, soft daylight.',
  ],
  [
    'rouw-licht',
    'An empty armchair beside a window in a quiet room, a single lit candle on the side table next to a framed photograph ' +
      'turned away from the camera, a folded blanket. Soft late daylight, muted warm colours. Nobody in the frame. Restrained, not mournful.',
  ],
  [
    'alleen-tuin-thee',
    'One person sitting alone on a wooden bench in a small Dutch garden holding a mug, seen from behind, ' +
      'hedge and hydrangeas around them, soft afternoon light. Face not visible.',
  ],
];

/* ------------------------------------------------------------------ */

mkdirSync(UIT, {recursive: true});

const gevraagd = process.argv.slice(2);
const werk = BEELDEN.filter(([naam]) =>
  gevraagd.length ? gevraagd.includes(naam) : !existsSync(`${UIT}/${naam}.jpg`),
);

/** Eén beeld, met herkansingen: de API valt er af en toe even uit. */
async function maak(naam, prompt, pogingen = 3) {
  const positief = `${STIJL} ${prompt} ${naam.startsWith('huis') || prompt.includes('Nobody in the frame') ? '' : ANONIEM}`.trim();
  for (let p = 1; p <= pogingen; p++) {
    try {
      const antwoord = await fetch(URL_API, {
        method: 'POST',
        headers: {'Content-Type': 'application/json', Authorization: `Bearer ${SLEUTEL}`},
        body: JSON.stringify([
          {
            taskType: 'imageInference',
            taskUUID: crypto.randomUUID(),
            model: MODEL,
            positivePrompt: positief,
            width: BREEDTE,
            height: HOOGTE,
            numberResults: 1,
            outputFormat: 'JPG',
          },
        ]),
        signal: AbortSignal.timeout(180_000),
      });
      const data = await antwoord.json();
      const url = data?.data?.[0]?.imageURL;
      if (!url) throw new Error(JSON.stringify(data).slice(0, 300));
      const beeld = await fetch(url, {signal: AbortSignal.timeout(120_000)});
      writeFileSync(`${UIT}/${naam}.jpg`, Buffer.from(await beeld.arrayBuffer()));
      console.log(`ok   ${naam}`);
      return true;
    } catch (fout) {
      console.log(`fout ${naam} (poging ${p}): ${String(fout).slice(0, 200)}`);
      await new Promise((r) => setTimeout(r, 2000 * p));
    }
  }
  return false;
}

/** Vijf tegelijk: sneller dan één voor één, en de API blijft het bijhouden. */
const rij = [...werk];
const mislukt = [];
await Promise.all(
  Array.from({length: 5}, async () => {
    for (;;) {
      const volgende = rij.shift();
      if (!volgende) return;
      const gelukt = await maak(volgende[0], volgende[1]);
      if (!gelukt) mislukt.push(volgende[0]);
    }
  }),
);

console.log(`\nklaar: ${werk.length - mislukt.length} van ${werk.length}`);
if (mislukt.length) console.log(`mislukt: ${mislukt.join(' ')}`);
