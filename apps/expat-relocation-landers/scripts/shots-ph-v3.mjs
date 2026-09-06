/**
 * partnerhereniging.nl, third design round — the shot list.
 *
 * The client's feedback in one line: the page has to feel human, and it has to
 * feel Dutch. So every shot is (a) a couple or a person, faces visible, and
 * (b) set somewhere recognisably Dutch without being touristy.
 *
 * Two composition rules the layout depends on:
 *  - `hero-*` is cropped to a tall column on desktop. Faces sit in the UPPER
 *    THIRD and the lower half stays quiet, because a white form card overlaps
 *    the bottom of it.
 *  - `band-*` runs full-bleed behind text: subject right of centre, empty left.
 */
export const STYLE =
  'Natural documentary photography, real everyday Netherlands, warm daylight, candid and unposed, ' +
  'true-to-life colour, gentle natural contrast, ordinary approachable people, believable everyday clothing, ' +
  'photorealistic, shot on a 35mm lens. Faces clearly visible, eyes open, relaxed genuine smiles. ' +
  'No crying, no tears, no distress. No text, no lettering, no logos, no signage, no watermarks, ' +
  'no flags, no tourist souvenirs, no windmills, no clogs.';

export const SHOTS = [
  /* ---------- hero candidates: faces high, quiet lower half ---------- */
  {
    name: 'v3-hero-brug',
    ratio: '4:5',
    prompt:
      'A Dutch woman in her early thirties and her partner, a man of South Asian descent, stand close together on a ' +
      'small brick canal bridge in a Dutch city, her arm around his back, both laughing at each other mid-conversation. ' +
      'Narrow brick canal houses and a row of parked bicycles behind them, still green canal water below. ' +
      'Their two faces are placed high in the upper third of the tall frame and the couple is centred horizontally; ' +
      'the entire lower half of the image is quiet empty background of bridge railing and canal water with nothing ' +
      'important in it. Soft bright overcast daylight, early autumn.',
  },
  {
    name: 'v3-hero-gracht',
    ratio: '4:5',
    prompt:
      'A mixed-nationality couple in their thirties stand together at a canal railing in a Dutch city on a bright ' +
      'morning, foreheads almost touching, both smiling warmly. She is Dutch, he is from West Africa. Tall narrow ' +
      'gabled canal houses softly out of focus behind them. Their faces sit high in the upper third of the tall ' +
      'frame, the couple centred horizontally, and the lower half of the image is calm empty water and railing with ' +
      'nothing important in it. Clear soft daylight.',
  },
  {
    name: 'v3-hero-stoep',
    ratio: '4:5',
    prompt:
      'A Dutch woman in her thirties and her partner, a man from Latin America, stand arm in arm on the pavement in ' +
      'front of an ordinary Dutch brick terraced street, two bicycles leaning against the wall beside them, both ' +
      'laughing together. Their faces are high in the upper third of the tall frame, the couple centred horizontally, ' +
      'and the lower half of the frame is plain pavement and brickwork with nothing important in it. Warm late ' +
      'afternoon light, red brick, white window frames.',
  },

  /* ---------- the emotional beats ---------- */
  {
    name: 'v3-aankomst',
    prompt:
      'A woman waiting at the arrivals barrier of a Dutch airport throws her arms around her partner who has just ' +
      'walked through, both laughing with relief, his suitcase abandoned beside them. She is Dutch, he is from the ' +
      'Middle East. Bright diffused daylight through tall terminal windows, other travellers far out of focus. ' +
      'Wide framing, the couple slightly right of centre at mid height.',
  },
  {
    name: 'v3-videocall',
    prompt:
      'A woman in her early thirties sits cross-legged on a plain sofa in a small Dutch flat in the evening, a laptop ' +
      'on a cushion in front of her, smiling and talking to her partner on a video call, a mug of tea beside her. ' +
      'Rain on the window behind her, one warm lamp, plants on the sill. Ordinary Dutch interior, nothing luxurious. ' +
      'Hopeful rather than sad.',
  },
  {
    name: 'v3-keukentafel',
    prompt:
      'A couple in their thirties sit side by side at a wooden kitchen table in an ordinary Dutch home, a laptop open ' +
      'between them and a small stack of printed documents and a passport beside it, looking at the screen together ' +
      'and smiling. She is Dutch, he is from South East Asia. Morning light through a large window, coffee cups, ' +
      'plants on the sill.',
  },
  {
    name: 'v3-advies',
    prompt:
      'A friendly Dutch woman in her forties, an adviser, sits at a light wooden table across from a couple in their ' +
      'thirties, all three leaning in over an open folder of documents, talking and smiling. Bright plain Dutch office ' +
      'with a large window and plants, no branding anywhere. Warm, informal, reassuring.',
  },

  /* ---------- Dutch life, the thing they are buying ---------- */
  {
    name: 'v3-fietsen',
    prompt:
      'A mixed-nationality couple in their thirties ride bicycles side by side down a quiet Dutch street on a bright ' +
      'afternoon, turning to laugh at each other, brick terraced houses and lime trees along the pavement. ' +
      'Ordinary Dutch city cycling, no helmets, everyday clothes.',
  },
  {
    name: 'v3-markt',
    prompt:
      'A couple in their thirties buy flowers together at an outdoor Dutch street market on a Saturday morning, ' +
      'the stallholder handing over a wrapped bunch of tulips, both of them smiling. She is Dutch, he is from Africa. ' +
      'Rows of market stalls and shoppers softly out of focus behind them, grey-bright Dutch daylight.',
  },
  {
    name: 'v3-gemeente',
    prompt:
      'A couple in their thirties walk down the front steps of a Dutch municipal town hall hand in hand, both ' +
      'laughing, she is holding a folder of paperwork. Modern brick and glass Dutch civic building behind them, ' +
      'bicycles parked at the railing. Bright daylight, no signage or lettering visible.',
  },
  {
    name: 'v3-station',
    prompt:
      'A couple in their thirties stand together on a Dutch railway platform in the morning, one suitcase at their ' +
      'feet, her head against his shoulder, both smiling. A long steel platform canopy and a blurred yellow and blue ' +
      'train behind them. Wide framing, the couple centred at mid height, soft daylight.',
  },
  {
    name: 'v3-strand',
    prompt:
      'A couple in their thirties walk along a wide empty Dutch North Sea beach in autumn coats and scarves, arms ' +
      'linked, laughing into the wind, dune grass and a pale wide sky behind them. Wide framing with generous open ' +
      'space, cool soft daylight, the sea flat and grey-blue.',
  },
  {
    name: 'v3-park',
    prompt:
      'A couple in their thirties sit close together on a wooden bench in a Dutch city park in autumn, sharing a ' +
      'thermos, yellow leaves on the grass and a canal path behind them, both smiling at something off camera. ' +
      'Soft low afternoon sun.',
  },
  {
    name: 'v3-sleutel',
    prompt:
      'A couple in their thirties stand in the open doorway of an ordinary Dutch brick terraced house, she is holding ' +
      'up a set of keys and both are laughing, a couple of moving boxes just inside the hallway behind them. ' +
      'White window frames, a bicycle by the wall, warm afternoon light.',
  },
  {
    name: 'v3-tuin',
    prompt:
      'A mixed-nationality couple and a small group of Dutch family and friends sit around a long table in a garden ' +
      'behind a Dutch terraced house on a summer evening, plates and glasses on the table, everyone laughing and ' +
      'talking. The couple sits together on the right of the frame. Warm low sunlight, string lights, brick wall.',
  },

  /* ---------- full-bleed bands: subject right, space left for text ---------- */
  {
    name: 'v3-band-gracht',
    ratio: '21:9',
    prompt:
      'A couple in their thirties stand together at a canal railing in a Dutch city at dusk, her head on his shoulder, ' +
      'both smiling quietly, warm lit windows of narrow gabled canal houses reflected in the water. Very wide ' +
      'cinematic framing: the couple stands in the right third of the frame and the whole left half is calm empty ' +
      'canal and soft blue evening light with nothing important in it.',
  },
  {
    name: 'v3-band-avond',
    ratio: '21:9',
    prompt:
      'A mixed-nationality couple walk home together along a quiet Dutch brick street in the blue hour, bicycles ' +
      'parked along the pavement and warm light in the terraced house windows, both smiling as they talk. Very wide ' +
      'cinematic framing: the couple is in the right third of the frame, the left half is empty street and soft ' +
      'evening blue with nothing important in it.',
  },
];
