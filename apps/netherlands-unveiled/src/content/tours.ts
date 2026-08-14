// One landing page per tour, in both languages. The home page lists all of
// them but can only carry one <title>, so each tour gets its own URL, its own
// heading and its own answer to the question someone actually typed.
//
// Everything factual here comes from Marion's own tour descriptions. Where a
// duration or a meeting point was never fixed, the fact row says so rather
// than inventing a number.

import type { Block } from './blog';

/** Tour pages take headings, paragraphs and lists, but no inline figures. */
export type TourBlock = Exclude<Block, { image: string }>;

export type Fact = { label: string; value: string };
export type Faq = { q: string; a: string };

export type TourCopy = {
  slug: string;
  /** Small label above the H1. */
  eyebrow: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Card text on the tours hub and the home page. */
  excerpt: string;
  alt: string;
  lead: string;
  body: TourBlock[];
  facts: Fact[];
  faq: Faq[];
  ctaLabel: string;
};

export type Tour = {
  id: string;
  image: string;
  /** Widths generated for this image by scripts/optimize-images.mjs. */
  widths: number[];
  /** Blog post ids to link to from the bottom of the page. */
  related: string[];
  en: TourCopy;
  fr: TourCopy;
};

const CITY_WIDTHS = [400, 600, 800, 1064];
const BLOG_IMAGE_WIDTHS = [360, 540, 720];

export const tours: Tour[] = [
  {
    id: 'amsterdam',
    image: 'amsterdam',
    widths: CITY_WIDTHS,
    related: ['bikes', 'herring', 'food'],
    en: {
      slug: 'amsterdam-walking-tours',
      eyebrow: 'Amsterdam',
      title: 'Amsterdam walking tours',
      metaTitle: 'Amsterdam Walking Tours with a Private Guide | Netherlands Unveiled',
      metaDescription:
        'Four private walking tours of Amsterdam: an introduction to the city, Jewish and WWII Amsterdam, the Jordaan and the Red Light District. Guided in six languages.',
      excerpt:
        'Four ways to walk the city, each revealing a different side of it. Two to three hours on foot with a private guide.',
      alt: 'Amsterdam canal with gabled houses and bicycles',
      lead:
        'Amsterdam rewards walking more than almost any other European capital, because the thing worth seeing is the street pattern itself. These are private tours, shaped around who is in the group.',
      body: [
        { h: 'Introduction to Amsterdam' },
        {
          p: 'The tour most first-time visitors want. It runs from Amsterdam Centraal through part of the Red Light District to Dam Square and the Flower Market, and takes two to three hours depending on the route. Along the way it covers how a swamp at the mouth of the Amstel became the richest city in seventeenth century Europe, why the houses lean forward, and what the hooks at the top of them are still used for.',
        },
        { h: 'Jewish Amsterdam and the Second World War' },
        {
          p: 'A slower, heavier walk through what was the Jewish quarter. It takes in the Holocaust Names Monument, the Jewish Museum from the outside, Wertheimpark and Waterlooplein, and continues to the Anne Frank House if time allows. Amsterdam had one of the largest Jewish communities in Western Europe before 1940. This tour is about what that community was, not only about how it ended.',
        },
        { h: 'The Jordaan' },
        {
          p: 'Built in the seventeenth century for the workers who were not allowed inside the canal ring, the Jordaan spent three hundred years as the poorest district in the city and the last forty becoming one of the most expensive. The walk follows that reversal through its courtyards, its hofjes and its remaining brown cafés.',
        },
        { h: 'The Red Light District' },
        {
          p: 'The oldest part of Amsterdam, and much older than what it is now known for. The walk covers the history of the neighbourhood, the Oude Kerk standing in the middle of it, and the connection between this quarter and Wall Street in New York, which is less of a coincidence than it sounds.',
        },
        { h: 'How the walks are put together' },
        {
          p: 'All four can be combined or shortened. Groups arriving by coach are picked up where the coach can legally stop, which since the 2018 city ordinances is no longer the centre. Cruise passengers on a short call usually take the introduction tour, which fits the time ashore without rushing.',
        },
      ],
      facts: [
        { label: 'Duration', value: '2 to 3 hours, depending on the route' },
        { label: 'Format', value: 'On foot, private group' },
        { label: 'Who it suits', value: 'Individuals, families, coach groups and cruise calls' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'How much walking is involved?',
          a: 'Two to three hours at a conversational pace, on flat ground, with stops. The route can be shortened or given more sitting time for groups who need it.',
        },
        {
          q: 'Can you combine two of the walks in one day?',
          a: 'Yes. The introduction tour plus the Jordaan is the most common pairing, usually with a break in between.',
        },
        {
          q: 'Do you run tours in bad weather?',
          a: 'Yes. Amsterdam is a wet city and the tours run anyway, though the route shifts towards covered stretches and the pace picks up.',
        },
      ],
      ctaLabel: 'Ask about an Amsterdam walking tour',
    },
    fr: {
      slug: 'visites-a-pied-amsterdam',
      eyebrow: 'Amsterdam',
      title: 'Visites à pied d’Amsterdam',
      metaTitle: 'Visites guidées à pied d’Amsterdam en français | Netherlands Unveiled',
      metaDescription:
        'Quatre visites privées à pied d’Amsterdam : introduction à la ville, Amsterdam juif et la Seconde Guerre mondiale, le Jordaan et le Quartier rouge. Guidage en six langues.',
      excerpt:
        'Quatre façons de parcourir la ville, chacune en révélant un visage différent. Deux à trois heures à pied avec une guide privée.',
      alt: 'Canal d’Amsterdam avec maisons à pignons et vélos',
      lead:
        'Amsterdam récompense la marche plus que presque toute autre capitale européenne, parce que ce qui mérite d’être vu est le tracé même des rues. Ce sont des visites privées, adaptées à ceux qui composent le groupe.',
      body: [
        { h: 'Introduction à Amsterdam' },
        {
          p: 'La visite que souhaitent la plupart des primo-visiteurs. Elle part de la gare centrale, traverse une partie du Quartier rouge et rejoint la place du Dam et le marché aux fleurs, en deux à trois heures selon l’itinéraire. On y raconte comment un marécage à l’embouchure de l’Amstel est devenu la ville la plus riche de l’Europe du XVIIe siècle, pourquoi les maisons penchent en avant et à quoi servent encore les crochets à leur sommet.',
        },
        { h: 'Amsterdam juif et la Seconde Guerre mondiale' },
        {
          p: 'Une marche plus lente et plus grave dans l’ancien quartier juif. Elle passe par le Mémorial des noms de l’Holocauste, le Musée juif vu de l’extérieur, le Wertheimpark et Waterlooplein, et se prolonge jusqu’à la Maison d’Anne Frank si le temps le permet. Amsterdam abritait avant 1940 l’une des plus grandes communautés juives d’Europe occidentale. Cette visite parle de ce qu’était cette communauté, pas seulement de la façon dont elle a disparu.',
        },
        { h: 'Le Jordaan' },
        {
          p: 'Bâti au XVIIe siècle pour les ouvriers que l’on n’admettait pas dans la ceinture de canaux, le Jordaan a passé trois siècles comme le quartier le plus pauvre de la ville et les quarante dernières années à devenir l’un des plus chers. La promenade suit ce renversement à travers ses cours, ses hofjes et ses cafés bruns encore debout.',
        },
        { h: 'Le Quartier rouge' },
        {
          p: 'La partie la plus ancienne d’Amsterdam, bien antérieure à ce qui fait aujourd’hui sa réputation. La visite retrace l’histoire du quartier, l’Oude Kerk plantée en son milieu et le lien entre ce quartier et Wall Street à New York, qui doit moins au hasard qu’il n’y paraît.',
        },
        { h: 'Comment les visites s’organisent' },
        {
          p: 'Les quatre peuvent se combiner ou se raccourcir. Les groupes en autocar sont pris en charge là où le car peut légalement s’arrêter, ce qui depuis les arrêtés municipaux de 2018 n’est plus le centre. Les passagers de croisière en escale courte choisissent en général la visite d’introduction, qui tient dans le temps à terre sans précipitation.',
        },
      ],
      facts: [
        { label: 'Durée', value: '2 à 3 heures selon l’itinéraire' },
        { label: 'Format', value: 'À pied, groupe privé' },
        { label: 'Pour qui', value: 'Individuels, familles, groupes en autocar et escales de croisière' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Combien de marche cela représente-t-il ?',
          a: 'Deux à trois heures à un rythme de conversation, sur terrain plat, avec des arrêts. L’itinéraire peut être raccourci ou prévoir plus de pauses assises pour les groupes qui en ont besoin.',
        },
        {
          q: 'Peut-on combiner deux visites dans la même journée ?',
          a: 'Oui. L’introduction suivie du Jordaan est la combinaison la plus fréquente, en général avec une pause entre les deux.',
        },
        {
          q: 'Les visites ont-elles lieu par mauvais temps ?',
          a: 'Oui. Amsterdam est une ville pluvieuse et les visites se tiennent quand même, mais l’itinéraire privilégie les portions abritées et le rythme s’accélère.',
        },
      ],
      ctaLabel: 'Demander une visite à pied d’Amsterdam',
    },
  },
  {
    id: 'keukenhof',
    image: 'blog-keukenhof',
    widths: BLOG_IMAGE_WIDTHS,
    related: ['keukenhof', 'villages', 'food'],
    en: {
      slug: 'keukenhof-tour-from-amsterdam',
      eyebrow: 'Lisse, spring only',
      title: 'Keukenhof tours from Amsterdam',
      metaTitle: 'Keukenhof Tour from Amsterdam with a Private Guide | Netherlands Unveiled',
      metaDescription:
        'Guided Keukenhof excursions from Amsterdam during the eight-week spring season, on their own or combined with The Hague, Delft or the villages. Groups and individuals.',
      excerpt:
        'Millions of bulbs over eight weeks, an hour from Amsterdam. On its own as a half day, or built into a full day.',
      alt: 'A tour group at the entrance to Keukenhof, with daffodils in the foreground',
      lead:
        'Keukenhof is open for roughly eight weeks a year, which makes it the one excursion where the date decides everything. It sits about an hour from Amsterdam, near Lisse.',
      body: [
        { h: 'What the day looks like' },
        {
          p: 'The gardens themselves take two to three hours to walk properly. That leaves most of the day free, which is why Keukenhof is almost never booked on its own: it becomes a morning with an afternoon somewhere else, or an afternoon after a morning in The Hague or Delft.',
        },
        {
          p: 'The planting runs in waves. Daffodils and crocuses open the season, hyacinths follow, and the tulips carry the second half. Groups arriving in the first fortnight get a quieter park and a lot of yellow. Groups arriving in mid to late April get the tulip blocks and the crowds that come with them.',
        },
        { h: 'The bulb fields are separate' },
        {
          p: 'The commercial fields around the gardens are not part of Keukenhof and follow the growers’ schedule, not the visitor’s. They are cut as soon as the bulb has taken what it needs from the flower, so a field that was scarlet on Tuesday can be bare on Friday. A route past whatever is actually in flower is decided on the day.',
        },
        { h: 'Combining it' },
        {
          p: 'The Hague and Delft are both close enough to add without rushing. So is the coast at Scheveningen. An official lunch nearby can be built into the timing, and coach groups who want the classic Dutch pairing take the gardens in the morning and Volendam, Marken or Zaanse Schans in the afternoon.',
        },
      ],
      facts: [
        { label: 'Duration', value: '2 to 3 hours in the gardens, or a full day combined' },
        { label: 'Format', value: 'On foot in the gardens, by coach from Amsterdam' },
        { label: 'Distance', value: 'About an hour from Amsterdam' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Roughly eight weeks, late March to mid May' },
        { label: 'Booking', value: 'By email or Messenger, early for spring dates' },
      ],
      faq: [
        {
          q: 'When is the best time to go?',
          a: 'Mid to late April for tulips at full strength. The opening fortnight is quieter and better for anyone who would rather walk than queue, with daffodils and hyacinths carrying the colour.',
        },
        {
          q: 'Will we see the tulip fields as well?',
          a: 'When there is something in flower, yes, on the way. The fields are commercial and get cut without notice, so the route is decided on the day rather than promised in advance.',
        },
        {
          q: 'Is Keukenhof enough for a whole day?',
          a: 'For most groups, no. Two to three hours covers the gardens. The rest of the day works better paired with The Hague, Delft, the coast or the villages north of Amsterdam.',
        },
      ],
      ctaLabel: 'Ask about a Keukenhof day',
    },
    fr: {
      slug: 'keukenhof-depuis-amsterdam',
      eyebrow: 'Lisse, printemps uniquement',
      title: 'Excursions à Keukenhof depuis Amsterdam',
      metaTitle: 'Excursion à Keukenhof depuis Amsterdam avec guide francophone',
      metaDescription:
        'Excursions guidées à Keukenhof depuis Amsterdam pendant les huit semaines de la saison, seules ou combinées avec La Haye, Delft ou les villages. Groupes et individuels.',
      excerpt:
        'Des millions de bulbes sur huit semaines, à une heure d’Amsterdam. En demi-journée seule ou intégrée à une journée complète.',
      alt: 'Un groupe à l’entrée de Keukenhof, avec des jonquilles au premier plan',
      lead:
        'Keukenhof n’ouvre qu’environ huit semaines par an, ce qui en fait la seule excursion où la date décide de tout. Les jardins se trouvent à une heure environ d’Amsterdam, près de Lisse.',
      body: [
        { h: 'À quoi ressemble la journée' },
        {
          p: 'Les jardins demandent deux à trois heures pour être parcourus correctement. Cela laisse le reste de la journée libre, et c’est pourquoi Keukenhof ne se réserve presque jamais seul : la visite devient une matinée suivie d’un après-midi ailleurs, ou un après-midi après une matinée à La Haye ou à Delft.',
        },
        {
          p: 'Les plantations se succèdent par vagues. Jonquilles et crocus ouvrent la saison, les jacinthes suivent, et les tulipes portent la seconde moitié. Les groupes qui viennent la première quinzaine trouvent un parc plus calme et beaucoup de jaune. Ceux qui viennent de la mi-avril à la fin avril ont les massifs de tulipes, et la foule qui va avec.',
        },
        { h: 'Les champs de bulbes sont autre chose' },
        {
          p: 'Les champs commerciaux autour des jardins ne font pas partie de Keukenhof et suivent le calendrier des producteurs, pas celui des visiteurs. Ils sont coupés dès que le bulbe a pris ce qu’il lui fallait de la fleur : un champ écarlate le mardi peut être nu le vendredi. Le passage par ce qui fleurit réellement se décide le jour même.',
        },
        { h: 'Ce que l’on y ajoute' },
        {
          p: 'La Haye et Delft sont assez proches pour être ajoutées sans courir, la côte à Scheveningen aussi. Un déjeuner officiel dans les environs peut entrer dans le programme, et les groupes en autocar qui veulent la combinaison néerlandaise classique prennent les jardins le matin et Volendam, Marken ou Zaanse Schans l’après-midi.',
        },
      ],
      facts: [
        { label: 'Durée', value: '2 à 3 heures dans les jardins, ou une journée combinée' },
        { label: 'Format', value: 'À pied dans les jardins, en autocar depuis Amsterdam' },
        { label: 'Distance', value: 'Environ une heure d’Amsterdam' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Environ huit semaines, de fin mars à mi-mai' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger, tôt pour les dates de printemps' },
      ],
      faq: [
        {
          q: 'Quel est le meilleur moment pour y aller ?',
          a: 'De la mi-avril à la fin avril pour les tulipes à leur apogée. La quinzaine d’ouverture est plus calme et convient mieux à qui préfère marcher que faire la queue, les jonquilles et les jacinthes portant alors la couleur.',
        },
        {
          q: 'Verrons-nous aussi les champs de tulipes ?',
          a: 'S’il y a quelque chose en fleur, oui, sur le trajet. Ces champs sont commerciaux et se coupent sans préavis : l’itinéraire se décide le jour même plutôt que de se promettre à l’avance.',
        },
        {
          q: 'Keukenhof suffit-il pour une journée entière ?',
          a: 'Pour la plupart des groupes, non. Deux à trois heures couvrent les jardins. Le reste de la journée fonctionne mieux avec La Haye, Delft, la côte ou les villages au nord d’Amsterdam.',
        },
      ],
      ctaLabel: 'Demander une journée à Keukenhof',
    },
  },
  {
    id: 'villages',
    image: 'villages',
    widths: CITY_WIDTHS,
    related: ['villages', 'broeker', 'food'],
    en: {
      slug: 'zaanse-schans-volendam-marken-tour',
      eyebrow: 'North of Amsterdam',
      title: 'Zaanse Schans, Edam, Volendam and Marken',
      metaTitle: 'Zaanse Schans, Volendam and Marken Tour from Amsterdam | Netherlands Unveiled',
      metaDescription:
        'Half-day and full-day guided excursions to Zaanse Schans, Edam, Volendam and Marken from Amsterdam, with clog and cheese demonstrations and the crossing to Marken.',
      excerpt:
        'Windmills, a cheese farm, a harbour and an island that stopped being one in 1957. Half day or full day, with or without lunch.',
      alt: 'Traditional harbor village with Dutch houses',
      lead:
        'This is the excursion visitors picture when they picture the Netherlands, and all of it sits within half an hour of Amsterdam. It runs as a half day or a full day, with or without lunch.',
      body: [
        { h: 'Zaanse Schans' },
        {
          p: 'Not a village but a reconstruction of one, assembled from buildings moved here from around the Zaan region. The point is what the region was: one of the largest industrial areas of seventeenth century Europe, where hundreds of windmills sawed timber, ground pigment and pressed oil. The mills that turn here still do the work. A clog demonstration takes ten minutes and explains why a wet Dutch field destroys leather but not willow.',
        },
        { h: 'The cheese farm' },
        {
          p: 'A short demonstration of how Dutch cheese is made, followed by the tasting, which is the part that changes minds. Dutch cheese is graded by age, and most visitors arrive expecting to prefer the young one and leave carrying the year-old one that crunches with salt crystals.',
        },
        { h: 'Edam, Volendam and Marken' },
        {
          list: [
            'Edam is the quiet one: the cheese name, a weighing house, and canals that nobody photographs enough.',
            'Volendam is the working harbour, with an eel smokehouse, a fish stall and traditional costume still worn behind some counters rather than only in the photo studios.',
            'Marken was an island until a causeway reached it in 1957. Its wooden houses stand on mounds and posts because the water used to come in, and arriving by boat from Volendam is the better way to see why.',
          ],
        },
        { h: 'Fitting it into the time you have' },
        {
          p: 'All four fit into a full day with lunch. A half day means choosing two, and the pairing that disappoints least is Zaanse Schans with Volendam and Marken. Coach groups usually run the full loop; individuals and families more often take the half day.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'Half day or full day, with or without lunch' },
        { label: 'Format', value: 'By coach, on foot in each village' },
        { label: 'Distance', value: '20 to 30 minutes from Amsterdam' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'Can all four places be done in half a day?',
          a: 'Not comfortably. Half a day covers two, usually Zaanse Schans with Volendam and Marken. The full day is what fits Edam in as well and leaves time to sit down.',
        },
        {
          q: 'Is the boat to Marken included?',
          a: 'It can be. The crossing from Volendam runs in season and is the better way to arrive. Out of season the causeway is used instead.',
        },
        {
          q: 'Is this suitable for a coach group?',
          a: 'Yes, this is one of the most common coach itineraries in the country. Route and stops are set to the group and to where the coach can park.',
        },
      ],
      ctaLabel: 'Ask about the village excursion',
    },
    fr: {
      slug: 'zaanse-schans-volendam-marken',
      eyebrow: 'Au nord d’Amsterdam',
      title: 'Zaanse Schans, Edam, Volendam et Marken',
      metaTitle: 'Excursion Zaanse Schans, Volendam et Marken depuis Amsterdam',
      metaDescription:
        'Excursions guidées d’une demi-journée ou d’une journée à Zaanse Schans, Edam, Volendam et Marken depuis Amsterdam, avec démonstrations de sabots et de fromage.',
      excerpt:
        'Des moulins, une ferme fromagère, un port et une île qui a cessé d’en être une en 1957. Demi-journée ou journée, avec ou sans déjeuner.',
      alt: 'Village portuaire traditionnel avec maisons néerlandaises',
      lead:
        'C’est l’excursion que les visiteurs imaginent quand ils imaginent les Pays-Bas, et tout se trouve à moins d’une demi-heure d’Amsterdam. Elle se fait en demi-journée ou en journée complète, avec ou sans déjeuner.',
      body: [
        { h: 'Zaanse Schans' },
        {
          p: 'Pas un village mais sa reconstitution, assemblée à partir de bâtiments déplacés depuis toute la région du Zaan. L’intérêt tient à ce que fut cette région : l’une des plus grandes zones industrielles de l’Europe du XVIIe siècle, où des centaines de moulins sciaient le bois, broyaient les pigments et pressaient l’huile. Les moulins qui tournent ici travaillent encore. Une démonstration de sabots dure dix minutes et explique pourquoi un champ néerlandais détrempé détruit le cuir mais pas le saule.',
        },
        { h: 'La ferme fromagère' },
        {
          p: 'Une courte démonstration de fabrication du fromage néerlandais, suivie de la dégustation, qui est la partie qui fait changer d’avis. Le fromage néerlandais se classe par affinage, et la plupart des visiteurs arrivent en pensant préférer le jeune et repartent avec celui d’un an, qui croque sous les cristaux de sel.',
        },
        { h: 'Edam, Volendam et Marken' },
        {
          list: [
            'Edam est le village tranquille : le nom du fromage, une maison de pesée et des canaux que personne ne photographie assez.',
            'Volendam est le port en activité, avec son fumoir à anguilles, son étal de poisson et le costume traditionnel encore porté derrière certains comptoirs, et pas seulement dans les studios photo.',
            'Marken fut une île jusqu’à ce qu’une digue-route l’atteigne en 1957. Ses maisons de bois reposent sur des buttes et des pilotis parce que l’eau montait, et arriver en bateau depuis Volendam reste la meilleure façon de comprendre pourquoi.',
          ],
        },
        { h: 'Adapter au temps disponible' },
        {
          p: 'Les quatre tiennent dans une journée complète avec déjeuner. En demi-journée, il faut en choisir deux, et la combinaison qui déçoit le moins est Zaanse Schans avec Volendam et Marken. Les groupes en autocar font en général la boucle complète ; les individuels et les familles prennent plus souvent la demi-journée.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Demi-journée ou journée, avec ou sans déjeuner' },
        { label: 'Format', value: 'En autocar, à pied dans chaque village' },
        { label: 'Distance', value: '20 à 30 minutes d’Amsterdam' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Peut-on faire les quatre lieux en une demi-journée ?',
          a: 'Pas confortablement. Une demi-journée en couvre deux, en général Zaanse Schans avec Volendam et Marken. La journée complète permet d’ajouter Edam et de prendre le temps de s’asseoir.',
        },
        {
          q: 'Le bateau pour Marken est-il compris ?',
          a: 'Il peut l’être. La traversée depuis Volendam fonctionne en saison et reste la meilleure façon d’arriver. Hors saison, on emprunte la digue-route.',
        },
        {
          q: 'Est-ce adapté à un groupe en autocar ?',
          a: 'Oui, c’est l’un des itinéraires en autocar les plus courants du pays. Le parcours et les arrêts s’adaptent au groupe et aux possibilités de stationnement.',
        },
      ],
      ctaLabel: 'Demander l’excursion dans les villages',
    },
  },
  {
    id: 'the-hague',
    image: 'den-haag',
    widths: CITY_WIDTHS,
    related: ['rooftop', 'grand-holland', 'herring'],
    en: {
      slug: 'the-hague-city-tours',
      eyebrow: 'The Hague',
      title: 'The Hague city tours',
      metaTitle: 'The Hague Guided City Tours, on Foot or by Coach | Netherlands Unveiled',
      metaDescription:
        'Guided tours of The Hague: the Binnenhof, the Peace Palace, the embassy district, Madurodam and Scheveningen beach, on foot in the centre or by coach.',
      excerpt:
        'The seat of government, the International Court of Justice and a beach, all within fifteen minutes of each other.',
      alt: 'The Binnenhof and Ridderzaal reflected in the Hofvijver in The Hague',
      lead:
        'The Hague is where the country is actually run, and it is not the capital. That contradiction is the best way into the city, and it is where the tour starts.',
      body: [
        { h: 'The walking tour' },
        {
          p: 'The centre is compact and covers the political heart of the country on foot. It takes in Lange Voorhout, the Parliament buildings at the Binnenhof with the Hofvijver beside them, and the former Jewish district, which is now the city’s Chinatown. The walk explains why parliament sits here while Amsterdam holds the title of capital, an arrangement that has survived since the Dutch Republic.',
        },
        { h: 'The coach tour' },
        {
          p: 'The wider version, for groups who want the parts that are too far apart to walk. It covers the centre, the Peace Palace that houses the International Court of Justice, the embassy district, Madurodam where the entire country is reproduced at one twenty fifth scale, and the beach and pier at Scheveningen.',
        },
        { h: 'Where it fits' },
        {
          p: 'The Hague is fifteen minutes from Delft and about twenty five from Rotterdam, which is why all three are often taken together as a full day. In spring it also pairs naturally with Keukenhof, which is closer to The Hague than to Amsterdam.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'Half day, or a full day combined with Delft and Rotterdam' },
        { label: 'Format', value: 'On foot in the centre, or by coach for the wider route' },
        { label: 'Who it suits', value: 'Individuals, families and coach groups' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'Is The Hague the capital of the Netherlands?',
          a: 'No. Amsterdam is the capital, but parliament, the government, the Supreme Court and the King’s working palace are all in The Hague. The arrangement dates back to the Dutch Republic and the tour explains how it happened.',
        },
        {
          q: 'Can we go inside the Peace Palace?',
          a: 'The coach tour passes it and the visitor centre is nearby. Access to the building itself depends on the court’s schedule and is arranged separately when it is possible at all.',
        },
        {
          q: 'Is Madurodam worth it for adults?',
          a: 'More than people expect. Seeing the whole country at one twenty fifth scale is the fastest way to understand how the Dutch landscape was engineered, which is useful before you drive through the real version.',
        },
      ],
      ctaLabel: 'Ask about a tour of The Hague',
    },
    fr: {
      slug: 'visites-la-haye',
      eyebrow: 'La Haye',
      title: 'Visites guidées de La Haye',
      metaTitle: 'Visites guidées de La Haye, à pied ou en autocar | Netherlands Unveiled',
      metaDescription:
        'Visites guidées de La Haye : le Binnenhof, le Palais de la Paix, le quartier des ambassades, Madurodam et la plage de Scheveningen, à pied ou en autocar.',
      excerpt:
        'Le siège du gouvernement, la Cour internationale de justice et une plage, le tout à quinze minutes l’un de l’autre.',
      alt: 'Le Binnenhof et la Ridderzaal reflétés dans le Hofvijver à La Haye',
      lead:
        'La Haye est la ville où le pays se gouverne réellement, et ce n’est pas la capitale. Cette contradiction est la meilleure entrée en matière, et c’est par là que commence la visite.',
      body: [
        { h: 'La visite à pied' },
        {
          p: 'Le centre est compact et couvre à pied le cœur politique du pays. On y parcourt le Lange Voorhout, les bâtiments du Parlement au Binnenhof avec le Hofvijver à côté, et l’ancien quartier juif devenu le quartier chinois de la ville. La promenade explique pourquoi le Parlement siège ici alors qu’Amsterdam porte le titre de capitale, un arrangement qui remonte à la République des Provinces-Unies.',
        },
        { h: 'La visite en autocar' },
        {
          p: 'La version élargie, pour les groupes qui veulent voir ce qui est trop éloigné pour être fait à pied. Elle couvre le centre, le Palais de la Paix qui abrite la Cour internationale de justice, le quartier des ambassades, Madurodam où le pays entier est reproduit au vingt-cinquième, et la plage et la jetée de Scheveningen.',
        },
        { h: 'Où elle s’insère' },
        {
          p: 'La Haye est à quinze minutes de Delft et à environ vingt-cinq de Rotterdam, ce qui explique que les trois villes se prennent souvent ensemble en une journée. Au printemps, la ville se combine aussi naturellement avec Keukenhof, plus proche de La Haye que d’Amsterdam.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Demi-journée, ou journée combinée avec Delft et Rotterdam' },
        { label: 'Format', value: 'À pied dans le centre, ou en autocar pour le parcours élargi' },
        { label: 'Pour qui', value: 'Individuels, familles et groupes en autocar' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'La Haye est-elle la capitale des Pays-Bas ?',
          a: 'Non. Amsterdam est la capitale, mais le Parlement, le gouvernement, la Cour suprême et le palais de travail du roi se trouvent tous à La Haye. Cet arrangement remonte à la République des Provinces-Unies et la visite explique comment il s’est installé.',
        },
        {
          q: 'Peut-on entrer dans le Palais de la Paix ?',
          a: 'La visite en autocar passe devant et le centre des visiteurs est tout proche. L’accès au bâtiment lui-même dépend du calendrier de la Cour et s’organise séparément, quand c’est possible.',
        },
        {
          q: 'Madurodam vaut-il le détour pour des adultes ?',
          a: 'Plus qu’on ne le croit. Voir le pays entier au vingt-cinquième est la façon la plus rapide de comprendre comment le paysage néerlandais a été fabriqué, ce qui est utile avant de traverser la version grandeur nature.',
        },
      ],
      ctaLabel: 'Demander une visite de La Haye',
    },
  },
  {
    id: 'rotterdam',
    image: 'rotterdam',
    widths: CITY_WIDTHS,
    related: ['grand-holland', 'rooftop', 'food'],
    en: {
      slug: 'rotterdam-city-tours',
      eyebrow: 'Rotterdam',
      title: 'Rotterdam city tours',
      metaTitle: 'Rotterdam Guided City Tours, Walking or by Coach | Netherlands Unveiled',
      metaDescription:
        'Guided tours of Rotterdam: the Cube Houses, the Markthal, the Erasmus Bridge and the Zadkine monument, on foot or by coach. Also run for cruise calls.',
      excerpt:
        'The city that was flattened in 1940 and decided not to rebuild what was there. Walking tour or coach tour.',
      alt: 'The yellow Cube Houses and the Markthal in Rotterdam',
      lead:
        'Rotterdam is the one Dutch city that looks nothing like the postcard, and it is the more interesting for it. Understanding why takes about ten minutes and one date.',
      body: [
        { h: 'The date everything turns on' },
        {
          p: 'On 14 May 1940 the centre of Rotterdam was bombed flat. What went up afterwards was not a reconstruction: the city decided to build something else entirely, and it has never stopped. That decision is why the skyline keeps changing, and why Zadkine’s statue The Destroyed City, a figure with a hole where its heart should be, has stood near the harbour since 1953.',
        },
        { h: 'The walking tour' },
        {
          p: 'On foot through the centre, taking in the Cube Houses that Piet Blom finished in 1984, the Markthal that opened in 2014 with apartments curving over a food hall, and the views from the Erasmus Bridge. The distances are walkable and the contrasts arrive quickly.',
        },
        { h: 'The coach tour' },
        {
          p: 'The wider loop, past Blijdorp Zoo and along Coolsingel to the Cube Houses, across the Maas over the Willems Bridge and back over the Erasmus Bridge, passing the Euromast. This is the version most cruise calls take, since Rotterdam is a working cruise port and the ship is already in the middle of the subject.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'Half day, or a full day combined with Delft and The Hague' },
        { label: 'Format', value: 'On foot or by coach' },
        { label: 'Who it suits', value: 'Individuals, families, coach groups and cruise calls' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'Why does Rotterdam look so different from the rest of the country?',
          a: 'The centre was destroyed by bombing in May 1940 and rebuilt as something new rather than as a copy of what was lost. Almost everything you see in the middle of the city is later than that.',
        },
        {
          q: 'Can you go inside the Cube Houses?',
          a: 'One of them is open as a show house. The tour covers the outside and the idea behind them; going inside is a short separate stop if the group wants it.',
        },
        {
          q: 'Do you guide cruise groups arriving in Rotterdam?',
          a: 'Yes. The coach tour is built to fit the time ashore, and the same call often continues to Delft and The Hague as a full day.',
        },
      ],
      ctaLabel: 'Ask about a Rotterdam tour',
    },
    fr: {
      slug: 'visites-rotterdam',
      eyebrow: 'Rotterdam',
      title: 'Visites guidées de Rotterdam',
      metaTitle: 'Visites guidées de Rotterdam, à pied ou en autocar | Netherlands Unveiled',
      metaDescription:
        'Visites guidées de Rotterdam : les Maisons Cubes, le Markthal, le pont Érasme et le monument de Zadkine, à pied ou en autocar. Également pour les escales de croisière.',
      excerpt:
        'La ville rasée en 1940 qui a choisi de ne pas rebâtir ce qui s’y trouvait. Visite à pied ou en autocar.',
      alt: 'Les maisons cubiques jaunes et le Markthal à Rotterdam',
      lead:
        'Rotterdam est la seule ville néerlandaise qui ne ressemble en rien à la carte postale, et elle n’en est que plus intéressante. Comprendre pourquoi demande dix minutes et une date.',
      body: [
        { h: 'La date qui explique tout' },
        {
          p: 'Le 14 mai 1940, le centre de Rotterdam a été rasé par les bombes. Ce qui s’est élevé ensuite n’était pas une reconstruction : la ville a décidé de bâtir tout autre chose, et elle n’a jamais cessé. C’est pourquoi sa silhouette change sans arrêt, et pourquoi la statue de Zadkine, La Ville détruite, une figure trouée à la place du cœur, se dresse près du port depuis 1953.',
        },
        { h: 'La visite à pied' },
        {
          p: 'À pied dans le centre, avec les Maisons Cubes achevées par Piet Blom en 1984, le Markthal ouvert en 2014 dont les appartements s’incurvent au-dessus d’une halle alimentaire, et les vues depuis le pont Érasme. Les distances se font à pied et les contrastes arrivent vite.',
        },
        { h: 'La visite en autocar' },
        {
          p: 'La boucle élargie, devant le zoo de Blijdorp puis le long du Coolsingel jusqu’aux Maisons Cubes, traversée de la Meuse par le pont Willems et retour par le pont Érasme, en passant devant l’Euromast. C’est la version que choisissent la plupart des escales de croisière, Rotterdam étant un port de croisière en activité où le navire se trouve déjà au milieu du sujet.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Demi-journée, ou journée combinée avec Delft et La Haye' },
        { label: 'Format', value: 'À pied ou en autocar' },
        { label: 'Pour qui', value: 'Individuels, familles, groupes en autocar et escales de croisière' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Pourquoi Rotterdam est-elle si différente du reste du pays ?',
          a: 'Le centre a été détruit par les bombardements de mai 1940 puis reconstruit comme quelque chose de neuf plutôt qu’en copie de ce qui avait disparu. Presque tout ce que l’on voit au centre est postérieur à cette date.',
        },
        {
          q: 'Peut-on entrer dans les Maisons Cubes ?',
          a: 'L’une d’elles se visite en maison témoin. La visite couvre l’extérieur et l’idée qui les sous-tend ; entrer constitue un court arrêt supplémentaire si le groupe le souhaite.',
        },
        {
          q: 'Guidez-vous les groupes de croisière arrivant à Rotterdam ?',
          a: 'Oui. La visite en autocar est calibrée sur le temps à terre, et la même escale se prolonge souvent vers Delft et La Haye pour une journée complète.',
        },
      ],
      ctaLabel: 'Demander une visite de Rotterdam',
    },
  },
  {
    id: 'delft',
    image: 'delft',
    widths: CITY_WIDTHS,
    related: ['grand-holland', 'villages', 'food'],
    en: {
      slug: 'delft-and-royal-delft-tours',
      eyebrow: 'Delft',
      title: 'Delft and Royal Delft tours',
      metaTitle: 'Delft Guided Tour with Royal Delft Blue Factory | Netherlands Unveiled',
      metaDescription:
        'Guided tours of Delft with a visit to Royal Delft, the oldest Delft Blue factory, founded in 1653, followed by a walking tour of the historic centre.',
      excerpt:
        'The oldest Delft Blue factory in the country, then a walk through the town Vermeer painted and never left.',
      alt: 'A Delft Blue plate being hand-painted in a Delft pottery workshop',
      lead:
        'Delft is small enough to walk in an afternoon and holds two things that are worth the trip on their own: the pottery and the crypt.',
      body: [
        { h: 'Royal Delft' },
        {
          p: 'Founded in 1653 and the last survivor of the thirty two potteries that once worked in this town. The demonstration shows a painter laying cobalt oxide onto raw glaze freehand, in a dull grey that only turns blue in the kiln, which means every line is committed before anyone can see it. The technique came from Chinese porcelain that Dutch ships were bringing back faster than Europe could copy it.',
        },
        { h: 'The walking tour' },
        {
          p: 'The historic centre is compact, quiet and full of water. The Nieuwe Kerk on the market square holds the crypt of the House of Orange, where Dutch monarchs have been buried since William of Orange in 1584. Vermeer was born here, worked here and painted his view of this town, and the walk passes the spots he stood in.',
        },
        { h: 'Combining it' },
        {
          p: 'Delft is fifteen minutes from The Hague and fifteen from Rotterdam, which makes it the natural middle stop in the full-day Grand Holland route. On its own it is a comfortable half day.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'Half day, or the middle stop on a full-day route' },
        { label: 'Format', value: 'Factory visit plus a walking tour' },
        { label: 'Distance', value: '15 minutes from The Hague, 15 from Rotterdam' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'Is Royal Delft the original Delft Blue factory?',
          a: 'It is the oldest one still working. Thirty two potteries operated in Delft in the seventeenth century and Royal Delft, founded in 1653, is the only one left.',
        },
        {
          q: 'Is there a connection to Vermeer?',
          a: 'Delft is his town. He was born here, worked here and painted his View of Delft here, and the walking tour covers where he stood and what has survived of it.',
        },
        {
          q: 'Can Delft be combined with other cities?',
          a: 'It usually is. Delft sits fifteen minutes from both The Hague and Rotterdam, and the three together make the full-day Grand Holland tour.',
        },
      ],
      ctaLabel: 'Ask about a Delft tour',
    },
    fr: {
      slug: 'visites-delft-et-royal-delft',
      eyebrow: 'Delft',
      title: 'Visites de Delft et de Royal Delft',
      metaTitle: 'Visite guidée de Delft avec la faïencerie Royal Delft | Netherlands Unveiled',
      metaDescription:
        'Visites guidées de Delft avec la faïencerie Royal Delft, la plus ancienne manufacture de bleu de Delft, fondée en 1653, suivies d’une promenade dans le centre historique.',
      excerpt:
        'La plus ancienne faïencerie de bleu de Delft du pays, puis une promenade dans la ville que Vermeer a peinte sans jamais la quitter.',
      alt: 'Une assiette en bleu de Delft peinte à la main dans un atelier de Delft',
      lead:
        'Delft se parcourt à pied en un après-midi et réunit deux choses qui justifient à elles seules le déplacement : la faïence et la crypte.',
      body: [
        { h: 'Royal Delft' },
        {
          p: 'Fondée en 1653, dernière survivante des trente-deux faïenceries qui travaillaient autrefois dans cette ville. La démonstration montre un peintre posant à main levée l’oxyde de cobalt sur l’émail cru, dans un gris terne qui ne devient bleu qu’au four : chaque trait est donc engagé avant que quiconque puisse le voir. La technique vient des porcelaines chinoises que les navires néerlandais rapportaient plus vite que l’Europe ne savait les copier.',
        },
        { h: 'La visite à pied' },
        {
          p: 'Le centre historique est compact, calme et plein d’eau. La Nieuwe Kerk, sur la place du marché, abrite la crypte de la maison d’Orange, où les souverains néerlandais reposent depuis Guillaume d’Orange en 1584. Vermeer y est né, y a travaillé et y a peint sa vue de la ville ; la promenade passe par les endroits où il s’est tenu.',
        },
        { h: 'Ce que l’on y ajoute' },
        {
          p: 'Delft est à quinze minutes de La Haye et à quinze de Rotterdam, ce qui en fait l’étape médiane naturelle du parcours Grand Holland en journée complète. Seule, elle occupe confortablement une demi-journée.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Demi-journée, ou étape médiane d’une journée complète' },
        { label: 'Format', value: 'Visite de la manufacture puis promenade guidée' },
        { label: 'Distance', value: '15 minutes de La Haye, 15 de Rotterdam' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Royal Delft est-elle la faïencerie d’origine du bleu de Delft ?',
          a: 'C’est la plus ancienne encore en activité. Trente-deux faïenceries fonctionnaient à Delft au XVIIe siècle et Royal Delft, fondée en 1653, est la seule qui subsiste.',
        },
        {
          q: 'Y a-t-il un lien avec Vermeer ?',
          a: 'Delft est sa ville. Il y est né, y a travaillé et y a peint sa Vue de Delft, et la promenade couvre les endroits où il s’est tenu et ce qui en subsiste.',
        },
        {
          q: 'Delft peut-elle se combiner avec d’autres villes ?',
          a: 'C’est le plus souvent le cas. Delft se trouve à quinze minutes de La Haye comme de Rotterdam, et les trois ensemble composent la journée Grand Holland.',
        },
      ],
      ctaLabel: 'Demander une visite de Delft',
    },
  },
  {
    id: 'nijmegen',
    image: 'nijmegen',
    widths: CITY_WIDTHS,
    related: ['grand-holland', 'food', 'broeker'],
    en: {
      slug: 'nijmegen-walking-tours',
      eyebrow: 'Marion’s favourite',
      title: 'Nijmegen walking tours',
      metaTitle: 'Nijmegen Walking Tour, the Oldest City in the Netherlands',
      metaDescription:
        'A two-hour guided walking tour of Nijmegen, the oldest city in the Netherlands and the only one built on two levels. Well suited to coach groups arriving for the day.',
      excerpt:
        'The oldest city in the country, with Roman roots, and the only Dutch city built on two levels.',
      alt: 'Historic Nijmegen city view',
      lead:
        'Nijmegen is the city Marion likes guiding most. It is the oldest in the country, its roots go back to the Romans, and it is the only Dutch city built on two levels.',
      body: [
        { h: 'A city on two floors' },
        {
          p: 'An upper town along the ridge and a lower town down on the water, which is unusual in a country famous for being flat. The two levels keep resetting the view as you walk: old streets and squares at the top, then the Waal opening up wide at the edge of them. The Stevenskerk towers over the centre and the Waalkade runs along the river below it.',
        },
        { h: 'What the walk covers' },
        {
          p: 'About two hours through the best known landmarks, with the Roman origins running underneath the whole route. Nijmegen was Noviomagus, a Roman settlement on the empire’s northern frontier, and it has the market square, the church and the river gates that trace what happened to it afterwards, including the floods that used to reach the lower town.',
        },
        { h: 'For coach groups' },
        {
          p: 'Nijmegen works particularly well for coach groups arriving for the day. It is far enough from Amsterdam to feel like a different country and compact enough to cover properly in a morning, and route and pace are set to the group rather than to a fixed script.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'About 2 hours' },
        { label: 'Format', value: 'On foot, private group' },
        { label: 'Who it suits', value: 'Coach groups arriving for the day, and individuals' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'What makes Nijmegen the oldest city in the Netherlands?',
          a: 'It grew out of Noviomagus, a Roman settlement on the northern frontier of the empire, and it was the first place in what is now the Netherlands to be granted city rights.',
        },
        {
          q: 'Is the walk hilly?',
          a: 'There is a real height difference between the upper and lower town, which is rare in this country. The route can be arranged to keep the climbing to a minimum.',
        },
        {
          q: 'Can a coach group be dropped in the centre?',
          a: 'Yes, and this is one of the reasons Nijmegen works so well for day groups. Pickup and drop-off points are agreed in advance with the driver.',
        },
      ],
      ctaLabel: 'Ask about Nijmegen',
    },
    fr: {
      slug: 'visites-a-pied-nimegue',
      eyebrow: 'La préférée de Marion',
      title: 'Visites à pied de Nimègue',
      metaTitle: 'Visite à pied de Nimègue, la plus ancienne ville des Pays-Bas',
      metaDescription:
        'Visite guidée à pied de deux heures à Nimègue, la plus ancienne ville des Pays-Bas et la seule construite sur deux niveaux. Idéale pour les groupes en autocar.',
      excerpt:
        'La plus ancienne ville du pays, d’origine romaine, et la seule ville néerlandaise bâtie sur deux niveaux.',
      alt: 'Vue historique de la ville de Nimègue',
      lead:
        'Nimègue est la ville que Marion préfère guider. C’est la plus ancienne du pays, ses origines remontent aux Romains et c’est la seule ville néerlandaise construite sur deux niveaux.',
      body: [
        { h: 'Une ville à deux étages' },
        {
          p: 'Une ville haute le long de la crête et une ville basse au bord de l’eau, ce qui est inhabituel dans un pays réputé plat. Les deux niveaux réinitialisent sans cesse la perspective au fil de la marche : rues et places anciennes en haut, puis le Waal qui s’ouvre largement à leur bord. La Stevenskerk domine le centre et la Waalkade longe le fleuve en contrebas.',
        },
        { h: 'Ce que couvre la promenade' },
        {
          p: 'Environ deux heures parmi les monuments les plus connus, avec les origines romaines qui courent sous tout l’itinéraire. Nimègue fut Noviomagus, un établissement romain sur la frontière nord de l’empire, et elle a gardé la place du marché, l’église et les portes fluviales qui racontent ce qui lui est arrivé ensuite, y compris les crues qui atteignaient autrefois la ville basse.',
        },
        { h: 'Pour les groupes en autocar' },
        {
          p: 'Nimègue convient particulièrement bien aux groupes en autocar venus pour la journée. Elle est assez loin d’Amsterdam pour donner l’impression d’un autre pays et assez compacte pour être parcourue correctement en une matinée ; l’itinéraire et le rythme s’adaptent au groupe plutôt qu’à un script figé.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Environ 2 heures' },
        { label: 'Format', value: 'À pied, groupe privé' },
        { label: 'Pour qui', value: 'Groupes en autocar à la journée et individuels' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Pourquoi Nimègue est-elle la plus ancienne ville des Pays-Bas ?',
          a: 'Elle est née de Noviomagus, un établissement romain sur la frontière nord de l’empire, et fut le premier lieu de l’actuel territoire néerlandais à recevoir le droit de cité.',
        },
        {
          q: 'La promenade est-elle vallonnée ?',
          a: 'Il existe une vraie différence de niveau entre la ville haute et la ville basse, chose rare dans ce pays. L’itinéraire peut être organisé pour réduire la montée au minimum.',
        },
        {
          q: 'Un autocar peut-il déposer le groupe au centre ?',
          a: 'Oui, et c’est l’une des raisons pour lesquelles Nimègue fonctionne si bien avec les groupes à la journée. Les points de dépose et de reprise se conviennent à l’avance avec le chauffeur.',
        },
      ],
      ctaLabel: 'Renseignez-vous sur Nimègue',
    },
  },
  {
    id: 'grand-holland',
    image: 'grand-holland',
    widths: CITY_WIDTHS,
    related: ['grand-holland', 'rooftop', 'villages'],
    en: {
      slug: 'grand-holland-full-day-tour',
      eyebrow: 'Full day',
      title: 'The Grand Holland tour',
      metaTitle: 'Grand Holland Full-Day Tour: The Hague, Delft and Rotterdam',
      metaDescription:
        'A full-day guided tour combining The Hague, Delft and Rotterdam: parliament and the Peace Palace, Royal Delft and the royal crypt, and Rotterdam’s rebuilt centre.',
      excerpt:
        'Three cities within twenty minutes of each other and about four centuries apart, in one day.',
      alt: 'The Netherlands in one image: Rotterdam’s skyline, Delft Blue, the Binnenhof and tulips',
      lead:
        'The Hague, Delft and Rotterdam sit within twenty minutes of each other and could not be less alike. Taking all three in a day works precisely because of that contrast.',
      body: [
        { h: 'Why the three go together' },
        {
          p: 'One city is a seat of government that is not the capital. One is a preserved seventeenth century town where the royal family is buried. One was flattened in 1940 and rebuilt as an experiment that is still running. Seen on the same day, each one explains the others, and the country stops looking like a single flat thing.',
        },
        { h: 'The route' },
        {
          list: [
            'The Hague: the Binnenhof and the Hofvijver, the Peace Palace, the embassy district, and Scheveningen or Madurodam if the day allows.',
            'Delft: Royal Delft, founded in 1653 and the last of the town’s thirty two potteries, then the market square, the Nieuwe Kerk and the crypt of the House of Orange.',
            'Rotterdam: the Cube Houses, the Markthal, the Erasmus Bridge and Zadkine’s Destroyed City near the harbour.',
          ],
        },
        { h: 'How the day is paced' },
        {
          p: 'A full day fits all three when the walking is concentrated and the driving is not padded: one guided walk in each city with time to sit down in one of them, rather than three half walks and a lot of coach. Groups who want more time in Delft usually trade the Madurodam stop for it. Cruise groups arriving in Rotterdam run the route in reverse.',
        },
      ],
      facts: [
        { label: 'Duration', value: 'Full day' },
        { label: 'Format', value: 'By coach between the cities, on foot in each' },
        { label: 'Cities', value: 'The Hague, Delft and Rotterdam' },
        { label: 'Languages', value: 'English, German, French, Spanish, Italian and Dutch' },
        { label: 'Season', value: 'Year round' },
        { label: 'Booking', value: 'By email or Messenger' },
      ],
      faq: [
        {
          q: 'Is a full day enough for three cities?',
          a: 'Yes, because they are twenty minutes apart and each guided walk is concentrated on one part of each centre. What a day does not allow is a long museum stop in all three.',
        },
        {
          q: 'Can the route start from Rotterdam instead of Amsterdam?',
          a: 'Yes. Cruise groups arriving at Rotterdam usually run it in reverse, which also avoids the busiest part of the day in The Hague.',
        },
        {
          q: 'Can we swap one of the cities?',
          a: 'The three are chosen because the contrast between them is the point, but the stops inside each city are flexible. Keukenhof replaces one of them in spring for some groups.',
        },
      ],
      ctaLabel: 'Ask about Grand Holland',
    },
    fr: {
      slug: 'grand-holland-journee-complete',
      eyebrow: 'Journée complète',
      title: 'La journée Grand Holland',
      metaTitle: 'Grand Holland : journée complète La Haye, Delft et Rotterdam',
      metaDescription:
        'Journée guidée combinant La Haye, Delft et Rotterdam : le Parlement et le Palais de la Paix, Royal Delft et la crypte royale, et le centre reconstruit de Rotterdam.',
      excerpt:
        'Trois villes à vingt minutes l’une de l’autre et à près de quatre siècles d’écart, en une journée.',
      alt: 'Les Pays-Bas en une image : la silhouette de Rotterdam, le bleu de Delft, le Binnenhof et des tulipes',
      lead:
        'La Haye, Delft et Rotterdam se trouvent à vingt minutes l’une de l’autre et ne pourraient pas être plus différentes. Prendre les trois en une journée fonctionne précisément grâce à ce contraste.',
      body: [
        { h: 'Pourquoi les trois vont ensemble' },
        {
          p: 'Une ville est un siège de gouvernement qui n’est pas la capitale. Une autre est une ville du XVIIe siècle préservée où repose la famille royale. La troisième a été rasée en 1940 puis reconstruite comme une expérience toujours en cours. Vues le même jour, chacune explique les autres, et le pays cesse de ressembler à une seule étendue plate.',
        },
        { h: 'Le parcours' },
        {
          list: [
            'La Haye : le Binnenhof et le Hofvijver, le Palais de la Paix, le quartier des ambassades, et Scheveningen ou Madurodam si la journée le permet.',
            'Delft : Royal Delft, fondée en 1653 et dernière des trente-deux faïenceries de la ville, puis la place du marché, la Nieuwe Kerk et la crypte de la maison d’Orange.',
            'Rotterdam : les Maisons Cubes, le Markthal, le pont Érasme et La Ville détruite de Zadkine près du port.',
          ],
        },
        { h: 'Le rythme de la journée' },
        {
          p: 'Une journée complète suffit aux trois si la marche est concentrée et les trajets non rallongés : une visite guidée dans chaque ville avec le temps de s’asseoir dans l’une d’elles, plutôt que trois demi-visites et beaucoup d’autocar. Les groupes qui veulent plus de temps à Delft échangent en général l’arrêt à Madurodam. Les groupes de croisière arrivant à Rotterdam font le parcours en sens inverse.',
        },
      ],
      facts: [
        { label: 'Durée', value: 'Journée complète' },
        { label: 'Format', value: 'En autocar entre les villes, à pied dans chacune' },
        { label: 'Villes', value: 'La Haye, Delft et Rotterdam' },
        { label: 'Langues', value: 'Anglais, allemand, français, espagnol, italien et néerlandais' },
        { label: 'Saison', value: 'Toute l’année' },
        { label: 'Réservation', value: 'Par e-mail ou Messenger' },
      ],
      faq: [
        {
          q: 'Une journée suffit-elle pour trois villes ?',
          a: 'Oui, parce qu’elles sont à vingt minutes l’une de l’autre et que chaque visite guidée se concentre sur une partie de chaque centre. Ce qu’une journée ne permet pas, c’est un long arrêt dans un musée des trois.',
        },
        {
          q: 'Le parcours peut-il partir de Rotterdam plutôt que d’Amsterdam ?',
          a: 'Oui. Les groupes de croisière arrivant à Rotterdam le font en général en sens inverse, ce qui évite aussi l’heure la plus chargée à La Haye.',
        },
        {
          q: 'Peut-on remplacer l’une des villes ?',
          a: 'Les trois sont choisies parce que leur contraste est l’intérêt même de la journée, mais les arrêts dans chaque ville restent souples. Au printemps, Keukenhof en remplace une pour certains groupes.',
        },
      ],
      ctaLabel: 'Demander la journée Grand Holland',
    },
  },
];

export const findTour = (lang: 'en' | 'fr', slug: string) =>
  tours.find((tour) => tour[lang].slug === slug);
