// One entry per article, mirrored across both languages, each with its own
// slug so /blog/<en-slug> and /fr/blog/<fr-slug> are separate indexable pages.
//
// The source material is Marion's own photos and field notes from
// touringwithmarion.com. The notes are a sentence or two each, so the articles
// below expand them into something a visitor planning a trip can actually use:
// what the thing is, when it happens, and how it fits into a day out.

import type { Lang } from '../i18n';

export type Block =
  | { h: string }
  | { p: string }
  | { list: string[] }
  | { image: string; alt: string; caption: string };

export type PostCopy = {
  slug: string;
  title: string;
  /** Longer, keyword-bearing version used for <title> only. */
  metaTitle: string;
  metaDescription: string;
  /** Card text on the blog index. */
  excerpt: string;
  /** Hero photo alt text. */
  alt: string;
  /** Small chip above the card title: place and season. */
  topic: string;
  body: Block[];
  ctaLabel: string;
};

export type Post = {
  id: string;
  /** Base name of the hero photo in public/images. */
  image: string;
  /** Anchor on the home page this article sends readers to. */
  ctaAnchor: string;
  en: PostCopy;
  fr: PostCopy;
};

export const posts: Post[] = [
  {
    id: 'keukenhof',
    image: 'blog-keukenhof',
    ctaAnchor: '#contact',
    en: {
      slug: 'keukenhof-day-out-from-amsterdam',
      title: 'A day at Keukenhof, and how to make it a good one',
      metaTitle: 'Keukenhof day out from Amsterdam: how to plan it | Netherlands Unveiled',
      metaDescription:
        'When Keukenhof opens, how long the gardens take, when the coaches arrive and how to combine the tulip gardens with The Hague, Delft or the bulb fields.',
      excerpt:
        'Bulb season brings groups from everywhere at once. Here is how the day works, when to arrive and what to add to it.',
      alt: 'A tour group at the entrance to Keukenhof, with daffodils in the foreground',
      topic: 'Lisse, spring',
      body: [
        {
          p: 'Keukenhof sits in Lisse, about an hour from Amsterdam, and it is open for roughly eight weeks a year. That short window is the whole reason the day needs planning: everyone who wants to see it has to come in the same two months, and most of them arrive between ten and two.',
        },
        { h: 'What is actually in flower when' },
        {
          p: 'The gardens are planted in waves. Daffodils and crocuses carry the first weeks, hyacinths follow and fill the paths with scent, and the tulips take over for the second half of the season. If you have a specific picture in your head of solid blocks of tulip colour, aim for mid to late April. If you would rather have space to walk, the opening fortnight is quieter and the daffodils are at their best.',
        },
        {
          p: 'The bulb fields outside the gardens run on their own schedule and are not part of Keukenhof at all. They are commercial fields, and they get cut once the bulb has taken what it needs from the flower. A field that was scarlet on Tuesday can be bare on Friday, which is why a route past them is decided on the day rather than promised in advance.',
        },
        { h: 'Timing the visit' },
        {
          p: 'Two to three hours inside the gardens is enough for most groups. Four if there is a pavilion exhibition worth queuing for, or if lunch is being eaten on site. Arriving before ten or after three changes the experience more than anything else you can control, because the coach park empties out and the main axis of the gardens stops feeling like a corridor.',
        },
        {
          list: [
            'Book the entrance ticket for a time slot, then build the rest of the day around it rather than the other way round.',
            'Bring one layer more than the forecast suggests. The gardens are open, flat and windy, and April in the Netherlands does what it likes.',
            'The windmill in the middle of the park has a viewing platform over the fields behind it. It has a queue by eleven.',
          ],
        },
        { h: 'What to put with it' },
        {
          p: 'Keukenhof is a half day, not a full one, so it pairs well. The Hague and Delft are both close enough to add without rushing, and a lunch stop nearby can be built into the timing. Groups often split the day the other way as well: gardens in the morning, then the coast at Scheveningen or a village afternoon around Volendam.',
        },
        {
          p: 'It is also the moment in the year when the country is at its most international. On one spring day we had a French group from Marseille walking the gardens and an Italian group finishing their afternoon in Volendam, and both of them thought they had the country to themselves.',
        },
      ],
      ctaLabel: 'Ask about a Keukenhof day',
    },
    fr: {
      slug: 'keukenhof-une-journee-depuis-amsterdam',
      title: 'Une journée à Keukenhof, et comment la réussir',
      metaTitle: 'Keukenhof depuis Amsterdam : comment organiser la journée | Netherlands Unveiled',
      metaDescription:
        'Période d’ouverture de Keukenhof, durée de la visite, heure d’arrivée des autocars et façons de combiner les jardins avec La Haye, Delft ou les champs de bulbes.',
      excerpt:
        'La saison des bulbes fait venir des groupes de partout en même temps. Voici comment se déroule la journée et quoi y ajouter.',
      alt: 'Un groupe à l’entrée de Keukenhof, avec des jonquilles au premier plan',
      topic: 'Lisse, printemps',
      body: [
        {
          p: 'Keukenhof se trouve à Lisse, à environ une heure d’Amsterdam, et n’ouvre que huit semaines par an. C’est toute la raison pour laquelle cette journée se prépare : tous ceux qui veulent voir les jardins doivent venir pendant les deux mêmes mois, et la plupart arrivent entre dix heures et quatorze heures.',
        },
        { h: 'Ce qui fleurit, et quand' },
        {
          p: 'Les jardins sont plantés par vagues. Les jonquilles et les crocus portent les premières semaines, les jacinthes suivent et parfument les allées, puis les tulipes prennent le relais pour la seconde moitié de la saison. Si vous avez en tête des blocs de couleur pleins de tulipes, visez la mi-avril ou la fin avril. Si vous préférez marcher tranquillement, la quinzaine d’ouverture est plus calme et les jonquilles y sont au mieux.',
        },
        {
          p: 'Les champs de bulbes autour des jardins suivent leur propre calendrier et ne font pas partie de Keukenhof. Ce sont des champs commerciaux, coupés dès que le bulbe a pris ce qu’il lui fallait de la fleur. Un champ écarlate le mardi peut être nu le vendredi, et c’est pourquoi un passage par ces champs se décide le jour même plutôt qu’à l’avance.',
        },
        { h: 'Choisir son horaire' },
        {
          p: 'Deux à trois heures dans les jardins suffisent à la plupart des groupes. Quatre s’il y a une exposition dans un pavillon qui mérite la file, ou si le déjeuner se prend sur place. Arriver avant dix heures ou après quinze heures change davantage la visite que tout le reste, parce que le parking des autocars se vide et que l’allée principale cesse de ressembler à un couloir.',
        },
        {
          list: [
            'Réservez le billet d’entrée sur un créneau horaire, puis construisez la journée autour, et non l’inverse.',
            'Prévoyez une couche de plus que ce qu’annonce la météo. Les jardins sont ouverts, plats et venteux, et le mois d’avril néerlandais n’en fait qu’à sa tête.',
            'Le moulin au centre du parc a une plateforme qui domine les champs derrière lui. Il y a la queue dès onze heures.',
          ],
        },
        { h: 'Avec quoi la combiner' },
        {
          p: 'Keukenhof occupe une demi-journée, pas une journée entière, et se combine donc facilement. La Haye et Delft sont assez proches pour être ajoutées sans courir, et un déjeuner dans les environs peut entrer dans le programme. Les groupes inversent aussi souvent l’ordre : les jardins le matin, puis la côte à Scheveningen ou un après-midi dans les villages autour de Volendam.',
        },
        {
          p: 'C’est aussi le moment de l’année où le pays est le plus international. Un jour de printemps, un groupe français de Marseille parcourait les jardins pendant qu’un groupe italien finissait son après-midi à Volendam, et les deux étaient convaincus d’avoir le pays pour eux seuls.',
        },
      ],
      ctaLabel: 'Demander une journée à Keukenhof',
    },
  },
  {
    id: 'villages',
    image: 'blog-cheese',
    ctaAnchor: '#tours',
    en: {
      slug: 'cheese-costume-and-the-villages-north-of-amsterdam',
      title: 'Cheese, costume and the villages north of Amsterdam',
      metaTitle: 'Volendam, Marken, Edam and Zaanse Schans: the villages north of Amsterdam',
      metaDescription:
        'What Zaanse Schans, Edam, Volendam and Marken are actually like, how the cheese and clog demonstrations work, and how much of it fits into one day.',
      excerpt:
        'A stop in a cheese shop where the traditional costume is still worn behind the counter, and what else the village day is made of.',
      alt: 'Two women in a cheese shop, one wearing traditional Volendam dress',
      topic: 'Volendam, year round',
      body: [
        {
          p: 'The excursion north of Amsterdam is the one visitors picture when they picture the Netherlands: windmills, a harbour, a wheel of cheese and a pair of wooden shoes. All of it is real, and all of it is closer to the city than people expect. Zaanse Schans is twenty minutes out. Volendam is half an hour.',
        },
        { h: 'Zaanse Schans is an industrial site, not a village' },
        {
          p: 'This is the part that surprises people. The Zaan region was one of the largest industrial areas in seventeenth century Europe, with hundreds of windmills sawing timber, grinding pigment and pressing oil. What stands at Zaanse Schans today is a collection of buildings brought together from around the region, and the mills that turn there still do real work. The paint mill grinds pigment. The sawmill saws.',
        },
        {
          p: 'The clog demonstration takes ten minutes and answers a question everyone has: why wood. The answer is that a wet field will destroy leather in a season, and a clog can be hollowed out of a single block of willow in a few minutes and floats when the field floods.',
        },
        { h: 'The cheese stop' },
        {
          p: 'The cheese farm demonstration is short and the tasting board that follows it is the real point. Dutch cheese is graded by age: jong at four weeks, belegen at four months, oud at a year and over. Most visitors arrive assuming they like the young one and leave buying the old one, which crunches with salt crystals and tastes nothing like the mild yellow slices sold abroad as gouda.',
        },
        {
          p: 'In Volendam the traditional costume is still worn behind some counters, not as a performance but because that is what the shop has always looked like. The photo studios on the harbour are a separate thing entirely, and they have been dressing visitors in lace caps since well before the tour bus arrived.',
        },
        { h: 'Edam, Volendam and Marken are three different places' },
        {
          list: [
            'Edam is the quiet one, with the cheese name, a weighing house and canals nobody photographs enough.',
            'Volendam is the harbour: an eel smokehouse, a fish stall, a sea wall to walk along, and the busiest hour of the day between noon and one.',
            'Marken was an island until a causeway reached it in 1957. The wooden houses stand on mounds and posts because the water used to come in, and the crossing by boat from Volendam is the better way to arrive.',
          ],
        },
        {
          p: 'All four can be done in a full day with lunch. Half a day means choosing two of them, and the pairing that disappoints least is Zaanse Schans plus Volendam and Marken.',
        },
      ],
      ctaLabel: 'See the village excursion',
    },
    fr: {
      slug: 'fromage-costume-et-villages-au-nord-d-amsterdam',
      title: 'Fromage, costume et villages au nord d’Amsterdam',
      metaTitle: 'Volendam, Marken, Edam et Zaanse Schans : les villages au nord d’Amsterdam',
      metaDescription:
        'À quoi ressemblent vraiment Zaanse Schans, Edam, Volendam et Marken, comment se passent les démonstrations de fromage et de sabots, et ce qui tient en une journée.',
      excerpt:
        'Un arrêt dans une fromagerie où le costume traditionnel se porte encore derrière le comptoir, et ce qui compose le reste de la journée.',
      alt: 'Deux femmes dans une fromagerie, dont l’une en costume traditionnel de Volendam',
      topic: 'Volendam, toute l’année',
      body: [
        {
          p: 'L’excursion au nord d’Amsterdam correspond à l’image que les visiteurs se font des Pays-Bas : des moulins, un port, une meule de fromage et une paire de sabots. Tout cela existe vraiment, et tout est plus proche de la ville qu’on ne le croit. Zaanse Schans est à vingt minutes. Volendam à une demi-heure.',
        },
        { h: 'Zaanse Schans est un site industriel, pas un village' },
        {
          p: 'C’est ce qui surprend le plus. La région du Zaan fut l’une des plus grandes zones industrielles d’Europe au XVIIe siècle, avec des centaines de moulins qui sciaient le bois, broyaient les pigments et pressaient l’huile. Ce que l’on voit aujourd’hui à Zaanse Schans est un ensemble de bâtiments rassemblés depuis toute la région, et les moulins qui y tournent travaillent encore. Le moulin à couleurs broie du pigment. La scierie scie.',
        },
        {
          p: 'La démonstration de sabots dure dix minutes et répond à la question que tout le monde se pose : pourquoi le bois. Parce qu’un champ détrempé détruit le cuir en une saison, alors qu’un sabot se creuse dans un seul bloc de saule en quelques minutes et flotte quand le champ est inondé.',
        },
        { h: 'L’arrêt fromager' },
        {
          p: 'La démonstration à la ferme fromagère est courte, et la planche de dégustation qui suit en est le vrai intérêt. Le fromage néerlandais se classe par affinage : jong à quatre semaines, belegen à quatre mois, oud à un an et plus. La plupart des visiteurs arrivent persuadés de préférer le jeune et repartent avec le vieux, qui croque sous les cristaux de sel et n’a rien à voir avec les tranches jaunes vendues à l’étranger sous le nom de gouda.',
        },
        {
          p: 'À Volendam, le costume traditionnel se porte encore derrière certains comptoirs, non comme un spectacle mais parce que la boutique a toujours eu cette allure. Les studios photo du port sont une autre affaire, et ils habillent les visiteurs de bonnets de dentelle bien avant l’arrivée du premier autocar.',
        },
        { h: 'Edam, Volendam et Marken sont trois lieux différents' },
        {
          list: [
            'Edam est le village tranquille, celui qui a donné son nom au fromage, avec sa maison de pesée et des canaux que personne ne photographie assez.',
            'Volendam, c’est le port : un fumoir à anguilles, un étal de poisson, une digue où marcher, et l’heure la plus chargée de la journée entre midi et treize heures.',
            'Marken fut une île jusqu’à la construction d’une digue-route en 1957. Les maisons de bois reposent sur des buttes et des pilotis parce que l’eau montait, et la traversée en bateau depuis Volendam reste la meilleure façon d’y arriver.',
          ],
        },
        {
          p: 'Les quatre tiennent dans une journée complète avec déjeuner. En demi-journée, il faut en choisir deux, et la combinaison qui déçoit le moins est Zaanse Schans avec Volendam et Marken.',
        },
      ],
      ctaLabel: 'Voir l’excursion dans les villages',
    },
  },
  {
    id: 'bikes',
    image: 'blog-amsterdam',
    ctaAnchor: '#tours',
    en: {
      slug: 'amsterdam-on-two-wheels',
      title: 'Amsterdam on two wheels, and how to walk among them',
      metaTitle: 'Amsterdam by bike: what visitors on foot need to know | Netherlands Unveiled',
      metaDescription:
        'Why Amsterdam has more bicycles than residents, how the city was rebuilt around them, and the practical rules that keep visitors on foot out of trouble.',
      excerpt:
        'In Amsterdam almost everything travels by bike, dogs included. What that means for anyone crossing the city on foot.',
      alt: 'A woman on a Dutch bicycle with two small dogs in the basket',
      topic: 'Amsterdam, year round',
      body: [
        {
          p: 'Amsterdam has more bicycles than it has residents. Not as a slogan, as an accounting fact, and you feel it about ninety seconds after leaving Centraal Station. Shopping, children, ladders, dogs and the occasional sofa all travel by bike, and the city has been rebuilt around that assumption for fifty years.',
        },
        { h: 'It was a decision, not a tradition' },
        {
          p: 'The usual assumption is that the Dutch have always cycled and never stopped. They did stop. Through the 1950s and 60s Dutch cities were being cleared for cars like everywhere else, and traffic deaths climbed with them. The campaign that turned it around in the 1970s was called Stop de Kindermoord, stop the child murder, and it was started by parents. What followed was decades of quiet engineering: separated lanes, priority at junctions, and traffic light phases that let bikes go first.',
        },
        {
          p: 'The result is visible in the small things. The red asphalt is not decoration, it is a road. The bike parking garage under the water at Centraal Station holds seven thousand bicycles and opened in 2023. A bakfiets, the long wooden box bike, does the work that a second car does elsewhere.',
        },
        { h: 'Rules for walking in it' },
        {
          list: [
            'Red asphalt is a bike lane. Standing in it to take a photo is the single most common visitor mistake.',
            'Look both ways twice, then once more for the scooter. Bikes come faster and quieter than they look.',
            'If a bell rings behind you, keep walking in a straight line. Stepping aside unpredictably is what causes the collision.',
            'Cross the tram rails at an angle if you are cycling yourself. A wheel in the groove ends badly.',
          ],
        },
        { h: 'Why it matters on a walking tour' },
        {
          p: 'The bike explains the shape of the centre better than any building does. The canals set the street pattern in the seventeenth century, the bike kept those streets from being widened in the twentieth, and that is the reason the Golden Age houses are still standing to be looked at. Scenes like a woman pedalling past with two small dogs in the basket turn up on every walk, and they are not staged for anybody.',
        },
      ],
      ctaLabel: 'See the Amsterdam walking tours',
    },
    fr: {
      slug: 'amsterdam-a-velo',
      title: 'Amsterdam à vélo, et comment marcher au milieu',
      metaTitle: 'Amsterdam à vélo : ce qu’il faut savoir quand on visite à pied',
      metaDescription:
        'Pourquoi Amsterdam compte plus de vélos que d’habitants, comment la ville s’est reconstruite autour d’eux, et les règles pratiques pour les visiteurs à pied.',
      excerpt:
        'À Amsterdam, presque tout se déplace à vélo, les chiens compris. Ce que cela implique quand on traverse la ville à pied.',
      alt: 'Une femme sur un vélo néerlandais avec deux petits chiens dans le panier',
      topic: 'Amsterdam, toute l’année',
      body: [
        {
          p: 'Amsterdam compte plus de vélos que d’habitants. Ce n’est pas un slogan mais un fait comptable, et on le ressent quatre-vingt-dix secondes après être sorti de la gare centrale. Les courses, les enfants, les échelles, les chiens et parfois un canapé voyagent à vélo, et la ville se reconstruit autour de cette évidence depuis cinquante ans.',
        },
        { h: 'Une décision, pas une tradition' },
        {
          p: 'On imagine souvent que les Néerlandais ont toujours pédalé sans jamais s’arrêter. Ils se sont arrêtés. Dans les années 1950 et 1960, les villes néerlandaises se dégageaient pour la voiture comme partout ailleurs, et le nombre de morts sur la route montait avec elles. La campagne qui a tout renversé dans les années 1970 s’appelait Stop de Kindermoord, arrêtez le meurtre des enfants, et elle a été lancée par des parents. Ont suivi des décennies d’ingénierie discrète : pistes séparées, priorité aux carrefours, feux qui laissent partir les vélos en premier.',
        },
        {
          p: 'Le résultat se lit dans les détails. L’asphalte rouge n’est pas un décor, c’est une route. Le parking à vélos sous l’eau devant la gare centrale contient sept mille vélos et a ouvert en 2023. Le bakfiets, ce long vélo à caisse en bois, fait le travail qu’une deuxième voiture fait ailleurs.',
        },
        { h: 'Les règles pour marcher au milieu' },
        {
          list: [
            'L’asphalte rouge est une piste cyclable. S’y arrêter pour prendre une photo est l’erreur de visiteur la plus fréquente.',
            'Regardez deux fois des deux côtés, puis une troisième pour le scooter. Les vélos arrivent plus vite et plus silencieusement qu’ils n’en ont l’air.',
            'Si une sonnette retentit derrière vous, continuez tout droit. C’est l’écart imprévisible qui provoque la collision.',
            'Si vous pédalez vous-même, franchissez les rails du tramway en biais. Une roue dans la rainure finit mal.',
          ],
        },
        { h: 'Pourquoi cela compte pendant une visite à pied' },
        {
          p: 'Le vélo explique la forme du centre mieux que n’importe quel bâtiment. Les canaux ont fixé le tracé des rues au XVIIe siècle, le vélo a empêché qu’on les élargisse au XXe, et c’est pour cela que les maisons du Siècle d’or sont encore là à regarder. Des scènes comme cette femme qui passe avec deux petits chiens dans son panier apparaissent à chaque promenade, et elles ne sont mises en scène pour personne.',
        },
      ],
      ctaLabel: 'Voir les visites à pied d’Amsterdam',
    },
  },
  {
    id: 'grand-holland',
    image: 'blog-grand-holland',
    ctaAnchor: '#tours',
    en: {
      slug: 'grand-holland-three-cities-in-one-day',
      title: 'Grand Holland: The Hague, Delft and Rotterdam in one day',
      metaTitle: 'Grand Holland tour: The Hague, Delft and Rotterdam in one day',
      metaDescription:
        'Three cities within twenty minutes of each other, and how a full day tour of The Hague, Delft and Rotterdam is put together without turning into a coach ride.',
      excerpt:
        'Three cities, twenty minutes apart, and about four centuries between them. How the full day is actually built.',
      alt: 'A tour group at the Zadkine monument to the destroyed city in Rotterdam',
      topic: 'South Holland, full day',
      body: [
        {
          p: 'The Hague, Delft and Rotterdam sit within twenty minutes of each other, and they could not be less alike. One is a seat of government, one is a preserved seventeenth century town, and one was flattened in 1940 and rebuilt as an experiment. Putting the three together in a day is the tour we call Grand Holland, and it works because the contrast does the explaining.',
        },
        { h: 'The Hague: where the country is run' },
        {
          p: 'The Hague is not the capital and never has been, which confuses people before they arrive and interests them once they know it. Parliament sits at the Binnenhof, a courtyard of medieval buildings around a lake, and the Peace Palace a mile away houses the International Court of Justice. Between them is the embassy district and, at Madurodam, the entire country reproduced at one twenty fifth scale. Scheveningen beach is fifteen minutes from the government quarter.',
        },
        { h: 'Delft: the blue and the crypt' },
        {
          p: 'Delft is small and walkable and holds two things worth the stop. Royal Delft, founded in 1653, is the last survivor of the thirty two potteries that once worked in the town, and you can watch a painter lay down cobalt oxide freehand, knowing it will only turn blue in the kiln. Across the market square, the Nieuwe Kerk holds the crypt of the House of Orange, where Dutch monarchs have been buried since William of Orange in 1584. Vermeer painted his view of this town and never really left it.',
        },
        { h: 'Rotterdam: rebuilt on purpose' },
        {
          p: 'On 14 May 1940 the centre of Rotterdam was bombed flat. What went up afterwards was not a reconstruction but a decision to build something else entirely, and that decision is still running: the Cube Houses of 1984, the Erasmus Bridge of 1996, the Markthal of 2014. Zadkine’s statue The Destroyed City, a figure with a hole where its heart should be, was placed near the harbour in 1953 and remains the most direct thing in the city.',
        },
        { h: 'How the day is paced' },
        {
          p: 'A full day fits all three if the walking is concentrated and the driving is not padded. In practice that means one guided walk in each city with time to sit down in one of them, rather than three half walks and a lot of coach. Groups that want more time in Delft trade the Madurodam stop for it. Groups arriving by cruise ship at Rotterdam usually run the route in reverse.',
        },
      ],
      ctaLabel: 'Ask about Grand Holland',
    },
    fr: {
      slug: 'grand-holland-trois-villes-en-une-journee',
      title: 'Grand Holland : La Haye, Delft et Rotterdam en une journée',
      metaTitle: 'Circuit Grand Holland : La Haye, Delft et Rotterdam en une journée',
      metaDescription:
        'Trois villes à vingt minutes l’une de l’autre, et comment se construit une journée complète entre La Haye, Delft et Rotterdam sans la transformer en trajet en autocar.',
      excerpt:
        'Trois villes, vingt minutes d’écart et près de quatre siècles entre elles. Comment la journée se construit vraiment.',
      alt: 'Un groupe devant le monument de Zadkine à la ville détruite, à Rotterdam',
      topic: 'Hollande-Méridionale, journée',
      body: [
        {
          p: 'La Haye, Delft et Rotterdam se trouvent à vingt minutes l’une de l’autre et ne pourraient pas être plus différentes. L’une est un siège de gouvernement, l’autre une ville du XVIIe siècle préservée, la troisième a été rasée en 1940 puis reconstruite comme une expérience. Réunir les trois en une journée, c’est la visite que nous appelons Grand Holland, et elle fonctionne parce que le contraste explique tout.',
        },
        { h: 'La Haye : là où le pays se gouverne' },
        {
          p: 'La Haye n’est pas la capitale et ne l’a jamais été, ce qui déroute avant l’arrivée et intéresse une fois su. Le Parlement siège au Binnenhof, une cour de bâtiments médiévaux au bord d’un étang, et le Palais de la Paix, à un kilomètre et demi, abrite la Cour internationale de justice. Entre les deux s’étend le quartier des ambassades, et à Madurodam le pays entier est reproduit au vingt-cinquième. La plage de Scheveningen est à quinze minutes du quartier gouvernemental.',
        },
        { h: 'Delft : le bleu et la crypte' },
        {
          p: 'Delft est petite, se parcourt à pied et réunit deux raisons de s’arrêter. Royal Delft, fondée en 1653, est la dernière des trente-deux faïenceries qui travaillaient autrefois dans la ville, et l’on peut y regarder un peintre poser l’oxyde de cobalt à main levée en sachant qu’il ne deviendra bleu qu’au four. De l’autre côté de la place du marché, la Nieuwe Kerk abrite la crypte de la maison d’Orange, où les souverains néerlandais reposent depuis Guillaume d’Orange en 1584. Vermeer a peint sa vue de cette ville et ne l’a jamais vraiment quittée.',
        },
        { h: 'Rotterdam : reconstruite volontairement' },
        {
          p: 'Le 14 mai 1940, le centre de Rotterdam a été rasé par les bombes. Ce qui s’est élevé ensuite n’était pas une reconstruction mais la décision de bâtir tout autre chose, et cette décision se poursuit : les Maisons Cubes de 1984, le pont Érasme de 1996, le Markthal de 2014. La statue de Zadkine, La Ville détruite, une figure trouée à la place du cœur, a été installée près du port en 1953 et reste ce que la ville dit de plus direct.',
        },
        { h: 'Le rythme de la journée' },
        {
          p: 'Une journée complète permet les trois si la marche est concentrée et les trajets non rallongés. En pratique, cela veut dire une visite guidée dans chaque ville avec le temps de s’asseoir dans l’une d’elles, plutôt que trois demi-visites et beaucoup d’autocar. Les groupes qui veulent plus de temps à Delft échangent l’arrêt à Madurodam. Les groupes qui arrivent en croisière à Rotterdam font le parcours en sens inverse.',
        },
      ],
      ctaLabel: 'Renseignez-vous sur Grand Holland',
    },
  },
  {
    id: 'food',
    image: 'blog-dutch-food',
    ctaAnchor: '#contact',
    en: {
      slug: 'what-to-eat-in-the-netherlands',
      title: 'What to eat in the Netherlands, and when to eat it',
      metaTitle: 'What to eat in the Netherlands: a visitor’s food guide | Netherlands Unveiled',
      metaDescription:
        'Poffertjes, bitterballen, stroopwafels, rijsttafel and the famous Dutch lunch problem. What Dutch food actually is and how the eating day is organised.',
      excerpt:
        'Dutch food is not what the country is famous for, which is exactly why it surprises people. A guide to the eating day.',
      alt: 'Poffertjes cooking in rows on a cast iron griddle',
      topic: 'Everywhere, year round',
      body: [
        {
          p: 'The Netherlands is not sold to visitors on its cooking, and that is part of why the food lands well: nobody arrives with expectations. What the country does have is a set of very specific things done very well, plus four centuries of trade that put Indonesian and Surinamese kitchens on ordinary Dutch high streets.',
        },
        { h: 'The lunch problem, explained' },
        {
          p: 'Lunch in the Netherlands is traditionally a sandwich. A modest one, eaten quickly, often at a desk. This has a consequence that catches visitors out: plenty of restaurants simply do not open until dinner, and many of those that do put a blackboard outside listing the evening specials, which are not available at lunch. Every Dutch person understands this. No visitor does.',
        },
        {
          p: 'If you want a hot meal in the middle of the day, look for a pancake house, an eetcafé, a lunchroom or anything Indonesian. Dinner, meanwhile, is early. Kitchens fill from six and many stop taking orders around nine.',
        },
        { h: 'The short list worth ordering' },
        {
          list: [
            'Poffertjes: small, spongy, yeast-risen pancakes cooked in a dimpled iron pan, served under butter and icing sugar. Pictured above, cooking by the dozen.',
            'Pannenkoeken: dinner plate sized pancakes, savoury as often as sweet. Bacon and cheese is a normal main course, not a novelty.',
            'Bitterballen: crisp on the outside, molten ragout inside, served with mustard alongside a beer. Let them cool for one minute longer than you want to.',
            'Broodje kroket: the same ragout in a longer shape, in a soft white roll, sold from a wall of little coin operated hatches at FEBO. It is a national institution and a national joke at the same time.',
            'Stroopwafel: two thin waffles with caramel syrup between them. Buy it warm off the griddle at a market, not sealed in a packet.',
            'Erwtensoep, also called snert: pea soup thick enough to stand a spoon in, with smoked sausage. Winter only, and worth the trip in January.',
          ],
        },
        {
          image: 'blog-rijsttafel',
          alt: 'An Indonesian dish of satay skewers with rice on a banana leaf',
          caption: 'Rijsttafel, the Indonesian rice table, is as Dutch a meal as anything in the country.',
        },
        { h: 'The colonial kitchen is the best kitchen' },
        {
          p: 'When the Dutch left Indonesia they brought back an appetite that never faded. The rijsttafel, literally rice table, is a spread of many small Indonesian dishes served around rice, and it was invented in the colonial era for exactly the reason it still works: it lets a table try fifteen things at once. Satay with peanut sauce has been absorbed so completely that it turns up as a topping on chips. Surinamese roti shops, a legacy of the other side of the empire, do the same job for a fraction of the price.',
        },
        { h: 'A note on herring' },
        {
          p: 'Raw herring is the one thing visitors brace themselves for and then like. It is cured rather than raw in the sushi sense, mild rather than fishy, and in Amsterdam it is usually served chopped in a soft roll with onion and pickle. The season has its own festival, which is a story of its own.',
        },
      ],
      ctaLabel: 'Ask about a tour with a food stop',
    },
    fr: {
      slug: 'que-manger-aux-pays-bas',
      title: 'Que manger aux Pays-Bas, et à quelle heure',
      metaTitle: 'Que manger aux Pays-Bas : le guide du visiteur | Netherlands Unveiled',
      metaDescription:
        'Poffertjes, bitterballen, stroopwafels, rijsttafel et le fameux problème du déjeuner néerlandais. Ce qu’est vraiment la cuisine locale et comment s’organise la journée.',
      excerpt:
        'La cuisine néerlandaise n’est pas ce qui fait la réputation du pays, et c’est précisément pour cela qu’elle surprend.',
      alt: 'Des poffertjes en train de cuire en rangées sur une plaque en fonte',
      topic: 'Partout, toute l’année',
      body: [
        {
          p: 'Les Pays-Bas ne se vendent pas aux visiteurs par leur cuisine, et c’est en partie pour cela qu’elle plaît : personne n’arrive avec des attentes. Ce que le pays possède, c’est une série de choses très précises très bien faites, plus quatre siècles de commerce qui ont installé les cuisines indonésienne et surinamienne dans les rues ordinaires.',
        },
        { h: 'Le problème du déjeuner, expliqué' },
        {
          p: 'Le déjeuner néerlandais est traditionnellement un sandwich. Modeste, avalé vite, souvent au bureau. Cela a une conséquence qui piège les visiteurs : beaucoup de restaurants n’ouvrent tout simplement pas avant le dîner, et parmi ceux qui ouvrent, nombreux sont ceux qui affichent dehors une ardoise des plats du soir, indisponibles le midi. Tous les Néerlandais le savent. Aucun visiteur ne le sait.',
        },
        {
          p: 'Pour un repas chaud en milieu de journée, cherchez une crêperie, un eetcafé, un lunchroom ou n’importe quelle adresse indonésienne. Le dîner, lui, est tôt : les cuisines se remplissent dès dix-huit heures et beaucoup cessent de prendre les commandes vers vingt et une heures.',
        },
        { h: 'La liste courte à commander' },
        {
          list: [
            'Poffertjes : petites crêpes levées et moelleuses cuites dans une plaque à alvéoles, servies sous le beurre et le sucre glace. Sur la photo ci-dessus, en train de cuire par douzaines.',
            'Pannenkoeken : des crêpes de la taille d’une assiette, aussi souvent salées que sucrées. Lard et fromage constituent un plat principal normal, pas une curiosité.',
            'Bitterballen : croustillantes dehors, ragoût brûlant dedans, servies avec de la moutarde à côté d’une bière. Laissez-les refroidir une minute de plus que vous ne le voudriez.',
            'Broodje kroket : le même ragoût en forme allongée, dans un pain blanc moelleux, vendu dans un mur de petites trappes à pièces chez FEBO. Une institution nationale et une blague nationale à la fois.',
            'Stroopwafel : deux fines gaufres avec du sirop de caramel entre elles. Achetez-la tiède sur le gaufrier d’un marché, pas scellée dans un paquet.',
            'Erwtensoep, aussi appelée snert : une soupe de pois assez épaisse pour y tenir la cuillère debout, avec de la saucisse fumée. En hiver seulement, et elle vaut le voyage en janvier.',
          ],
        },
        {
          image: 'blog-rijsttafel',
          alt: 'Un plat indonésien de brochettes satay avec du riz sur une feuille de bananier',
          caption: 'Le rijsttafel, la table de riz indonésienne, est un repas aussi néerlandais que n’importe quel autre.',
        },
        { h: 'La meilleure cuisine est celle des colonies' },
        {
          p: 'En quittant l’Indonésie, les Néerlandais ont rapporté un appétit qui ne s’est jamais éteint. Le rijsttafel, littéralement table de riz, est un ensemble de nombreux petits plats indonésiens servis autour du riz, inventé à l’époque coloniale pour la raison même qui le fait encore fonctionner : une tablée goûte quinze choses d’un coup. Le satay et sa sauce cacahuète ont été si bien absorbés qu’on les retrouve en garniture sur des frites. Les échoppes de roti surinamien, héritage de l’autre versant de l’empire, rendent le même service pour une fraction du prix.',
        },
        { h: 'Un mot sur le hareng' },
        {
          p: 'Le hareng cru est la seule chose que les visiteurs redoutent avant de l’aimer. Il est saumuré plutôt que cru au sens du sushi, doux plutôt que fort, et à Amsterdam on le sert le plus souvent haché dans un petit pain avec oignon et cornichon. La saison a sa propre fête, qui mérite son propre récit.',
        },
      ],
      ctaLabel: 'Demander une visite avec un arrêt gourmand',
    },
  },
  {
    id: 'herring',
    image: 'blog-herring',
    ctaAnchor: '#tours',
    en: {
      slug: 'hollandse-nieuwe-the-dutch-herring-season',
      title: 'Hollandse Nieuwe: the day the first herring arrives',
      metaTitle: 'Hollandse Nieuwe: the Dutch herring season explained | Netherlands Unveiled',
      metaDescription:
        'What Hollandse Nieuwe is, why the first barrel is auctioned for charity, and how to eat raw herring the way the Dutch actually eat it.',
      excerpt:
        'Music, beer, a whole barrel auctioned off and dancing into the night. One of the few food traditions that still stops a whole town.',
      alt: 'A horse and cart at the herring festival in the city centre',
      topic: 'Dutch traditions, June',
      body: [
        {
          p: 'Once a year the country loses its composure over a fish. The new herring comes in, a barrel gets auctioned off for an amount that would embarrass a wine merchant, a band plays, and the dancing runs into the night. We were there with a camera, because this is one of the few Dutch traditions that has not been tidied up for visitors.',
        },
        { h: 'What Hollandse Nieuwe actually is' },
        {
          p: 'Hollandse Nieuwe is herring caught in early summer, when the fish has fed all spring and its fat content has climbed past sixteen percent. That fat is the whole point. It is what makes the flesh soft and mild instead of sharp, and it is why the same fish caught two months earlier would not qualify.',
        },
        {
          p: 'The fish is gutted at sea, but the pancreas is deliberately left in. Its enzymes ripen the herring slowly in a light salt brine over a few days, which is a form of curing rather than pickling. Nothing about it is raw in the way people fear when they hear raw fish, and nothing about it tastes of vinegar.',
        },
        { h: 'The first barrel' },
        {
          p: 'The season opens with Vlaggetjesdag in Scheveningen, the fishing harbour beside The Hague, where the boats dress overall with flags and the town treats it as a public holiday. The first barrel of the catch is auctioned for charity and the bidding is a matter of civic pride, so the price has long since stopped bearing any relation to fish.',
        },
        { h: 'How to eat it' },
        {
          p: 'The image everyone knows, head tipped back and the herring lowered in by the tail, is real but is more of a Rotterdam and The Hague habit. In Amsterdam you will usually be handed a broodje haring: the fillets chopped, tucked into a soft white roll with raw onion and sweet pickle. Order it at a stall rather than a restaurant, eat it standing up, and do not skip the onion, which is there to cut the fat.',
        },
        {
          p: 'From June onwards the stalls are part of the ordinary street furniture in Amsterdam, and a walking tour can easily take a detour past a good one. If you happen to be here in the opening week, the festival version is worth planning around.',
        },
      ],
      ctaLabel: 'See the Amsterdam walking tours',
    },
    fr: {
      slug: 'hollandse-nieuwe-la-saison-du-hareng',
      title: 'Hollandse Nieuwe : le jour où arrive le premier hareng',
      metaTitle: 'Hollandse Nieuwe : la saison du hareng néerlandais expliquée',
      metaDescription:
        'Ce qu’est le Hollandse Nieuwe, pourquoi le premier tonneau est vendu aux enchères au profit d’œuvres caritatives, et comment manger le hareng comme les Néerlandais.',
      excerpt:
        'De la musique, de la bière, un tonneau entier vendu aux enchères et de la danse jusque tard. Une des rares traditions qui arrête encore une ville entière.',
      alt: 'Un attelage de chevaux pendant la fête du hareng dans le centre-ville',
      topic: 'Traditions néerlandaises, juin',
      body: [
        {
          p: 'Une fois par an, le pays perd son sang-froid pour un poisson. Le nouveau hareng arrive, un tonneau part aux enchères à un prix qui ferait rougir un marchand de vin, un orchestre joue et l’on danse jusque tard dans la nuit. Nous étions là avec une caméra, parce que c’est l’une des rares traditions néerlandaises que l’on n’a pas rangée pour les visiteurs.',
        },
        { h: 'Ce qu’est vraiment le Hollandse Nieuwe' },
        {
          p: 'Le Hollandse Nieuwe est un hareng pêché au début de l’été, quand le poisson s’est nourri tout le printemps et que sa teneur en graisse a dépassé seize pour cent. Cette graisse est l’essentiel : c’est elle qui rend la chair douce et fondante au lieu de piquante, et c’est pourquoi le même poisson pêché deux mois plus tôt n’aurait pas droit au nom.',
        },
        {
          p: 'Le poisson est vidé en mer, mais on laisse volontairement le pancréas. Ses enzymes font mûrir le hareng lentement dans une saumure légère pendant quelques jours, ce qui relève de l’affinage plutôt que de la marinade. Rien n’y est cru au sens que l’on redoute en entendant poisson cru, et rien n’y a le goût du vinaigre.',
        },
        { h: 'Le premier tonneau' },
        {
          p: 'La saison s’ouvre avec le Vlaggetjesdag à Scheveningen, le port de pêche voisin de La Haye, où les bateaux se pavoisent et où la ville traite la journée comme un jour férié. Le premier tonneau de la pêche est vendu aux enchères au profit d’une œuvre, et la surenchère est une affaire de fierté locale : le prix n’a plus grand-chose à voir avec du poisson.',
        },
        { h: 'Comment le manger' },
        {
          p: 'L’image que tout le monde connaît, la tête renversée et le hareng descendu par la queue, existe bel et bien mais tient davantage de l’habitude de Rotterdam et de La Haye. À Amsterdam, on vous tendra plutôt un broodje haring : les filets hachés, glissés dans un petit pain blanc avec de l’oignon cru et du cornichon sucré. Commandez-le à un étal plutôt qu’au restaurant, mangez-le debout et ne sautez pas l’oignon, qui est là pour couper le gras.',
        },
        {
          p: 'À partir de juin, les étals font partie du mobilier urbain ordinaire d’Amsterdam, et une visite à pied peut aisément faire un détour par un bon. Si vous êtes ici la semaine de l’ouverture, la version festive mérite qu’on organise la journée autour.',
        },
      ],
      ctaLabel: 'Voir les visites à pied d’Amsterdam',
    },
  },
  {
    id: 'broeker',
    image: 'blog-broekerveiling',
    ctaAnchor: '#contact',
    en: {
      slug: 'broeker-veiling-the-auction-you-can-bid-at',
      title: 'Broeker Veiling: the vegetable auction you can bid at',
      metaTitle: 'Broeker Veiling: a different day trip north of Amsterdam',
      metaDescription:
        'The oldest sail-through vegetable auction in the world, north of Amsterdam, where visitors work the descending clock themselves and take a boat through the old growing islands.',
      excerpt:
        'A working auction until the 1970s, now a museum where you bid on the clock yourself and buy the vegetables. Boat ride included.',
      alt: 'Boats moored inside the wooden auction hall at Broeker Veiling',
      topic: 'North Holland, half day',
      body: [
        {
          p: 'Half an hour north of Amsterdam, in Broek op Langedijk, is a wooden hall with a canal running straight through the middle of it. Growers used to steer their boats in one end loaded with cabbages, sell the load, and float out the other. It ran that way from 1887 until 1973, and it was the only sail-through auction of its kind in the world.',
        },
        { h: 'A thousand islands of cabbage' },
        {
          p: 'The landscape around it explains the building. This area was once known as het Rijk der Duizend Eilanden, the kingdom of a thousand islands: several thousand tiny plots of land separated by water, each one a farm too small to reach by cart. Everything moved by boat. Vegetables, cattle, the priest, the dead. When the auction was built, it was built for boats because there was no other way anything arrived.',
        },
        { h: 'The clock runs backwards' },
        {
          p: 'The auction itself works the way Dutch auctions still work, which is backwards from what most visitors expect. The clock starts high and falls, and the first person to press the button wins at whatever price the hand had reached. Hesitate and you pay less but risk getting nothing. Press early and you are certain, and you have overpaid. It is a machine for making people uncomfortable, and it is still the mechanism behind the flower auction at Aalsmeer, which handles a large share of the world cut flower trade every morning.',
        },
        {
          p: 'At the museum you sit at a real bidding desk and do it yourself, with real produce, and you take home what you win. Groups take this considerably more seriously than they intend to.',
        },
        { h: 'Why it makes a good half day' },
        {
          p: 'It is a good answer for a second visit, or for a group that has already done Zaanse Schans and Volendam and wants something the coach crowd has not found. It is indoors, which makes it weatherproof, and the boat trip through the old growing plots gets you out on the water without the queue for a canal cruise. Pair it with Alkmaar, twenty minutes away, whose cheese market runs on Friday mornings from spring to autumn.',
        },
      ],
      ctaLabel: 'Ask about a day like this',
    },
    fr: {
      slug: 'broeker-veiling-la-criee-ou-l-on-encherit-soi-meme',
      title: 'Broeker Veiling : la criée aux légumes où l’on enchérit soi-même',
      metaTitle: 'Broeker Veiling : une autre excursion au nord d’Amsterdam',
      metaDescription:
        'La plus ancienne criée aux légumes navigable du monde, au nord d’Amsterdam, où les visiteurs actionnent eux-mêmes l’horloge dégressive et parcourent en bateau les anciennes îles maraîchères.',
      excerpt:
        'Une criée en activité jusqu’aux années 1970, aujourd’hui un musée où l’on enchérit soi-même et où l’on repart avec les légumes.',
      alt: 'Des bateaux amarrés à l’intérieur de la halle en bois de la criée de Broek op Langedijk',
      topic: 'Hollande-Septentrionale, demi-journée',
      body: [
        {
          p: 'À une demi-heure au nord d’Amsterdam, à Broek op Langedijk, se dresse une halle en bois traversée en son milieu par un canal. Les maraîchers y faisaient entrer leur bateau chargé de choux par un bout, vendaient la cargaison et ressortaient par l’autre. Cela a fonctionné ainsi de 1887 à 1973, et c’était la seule criée navigable de ce type au monde.',
        },
        { h: 'Mille îles de choux' },
        {
          p: 'Le paysage alentour explique le bâtiment. La région était autrefois connue comme het Rijk der Duizend Eilanden, le royaume des mille îles : plusieurs milliers de minuscules parcelles séparées par l’eau, chacune trop petite pour être atteinte en charrette. Tout circulait en bateau. Les légumes, le bétail, le curé, les morts. Quand la criée a été construite, elle l’a été pour des bateaux, parce que rien n’arrivait autrement.',
        },
        { h: 'L’horloge tourne à l’envers' },
        {
          p: 'La criée fonctionne comme les enchères néerlandaises fonctionnent encore, c’est-à-dire à l’inverse de ce à quoi s’attendent les visiteurs. L’horloge part haut et descend, et le premier à appuyer sur le bouton l’emporte au prix atteint par l’aiguille. Hésitez et vous paierez moins cher, au risque de n’avoir rien. Appuyez tôt et vous êtes sûr d’avoir, mais vous avez payé trop. C’est une machine à mettre les gens mal à l’aise, et c’est toujours le mécanisme de la criée aux fleurs d’Aalsmeer, qui traite chaque matin une large part du commerce mondial de la fleur coupée.',
        },
        {
          p: 'Au musée, vous vous asseyez à un vrai pupitre d’enchères et vous jouez vous-même, avec de vrais produits, et vous emportez ce que vous remportez. Les groupes prennent la chose bien plus au sérieux qu’ils ne le prévoyaient.',
        },
        { h: 'Pourquoi c’est une bonne demi-journée' },
        {
          p: 'C’est une bonne réponse pour un deuxième séjour, ou pour un groupe qui a déjà fait Zaanse Schans et Volendam et veut quelque chose que les autocars n’ont pas trouvé. C’est couvert, donc à l’épreuve de la météo, et la promenade en bateau entre les anciennes parcelles met sur l’eau sans la file d’attente d’une croisière sur les canaux. À combiner avec Alkmaar, à vingt minutes, dont le marché aux fromages se tient le vendredi matin du printemps à l’automne.',
        },
      ],
      ctaLabel: 'Demander une journée de ce type',
    },
  },
  {
    id: 'haarlem',
    image: 'blog-haarlem',
    ctaAnchor: '#contact',
    en: {
      slug: 'haarlem-in-december',
      title: 'Haarlem in December, fifteen minutes from Amsterdam',
      metaTitle: 'Haarlem day trip from Amsterdam: the December market and the old city',
      metaDescription:
        'Haarlem is fifteen minutes by train from Amsterdam and holds a Christmas market, the oldest museum in the country and an organ Mozart played at ten years old.',
      excerpt:
        'A Christmas market in the streets around the Grote Markt, and a city that is easier to walk than Amsterdam in winter.',
      alt: 'The Christmas market in Haarlem at dusk, with stalls along the main street',
      topic: 'Haarlem, December',
      body: [
        {
          p: 'Haarlem is fifteen minutes from Amsterdam Centraal by train and gets a fraction of the visitors, which is the entire argument for going. It is the capital of the province of North Holland, it is older than Amsterdam, and in December it fills its streets with one of the larger Christmas markets in the country.',
        },
        { h: 'The market' },
        {
          p: 'The stalls run through the streets around the Grote Markt rather than being penned into one square, so the market is something you walk through on the way somewhere rather than queue to enter. It runs for a stretch of days in mid December, in the afternoon and into the evening, and the light at four o’clock in a Dutch December does more for it than any amount of decoration.',
        },
        { h: 'What is there the rest of the year' },
        {
          list: [
            'The Grote Kerk, also called St Bavo, holds the Müller organ. Mozart played it in 1766, aged ten, and it is still played today. The church is the one in the background of a good many Golden Age paintings.',
            'Teylers Museum opened in 1784 and is the oldest museum in the Netherlands. It has never been modernised, which is the point: you are looking at an eighteenth century idea of what a museum should be, in its original cabinets.',
            'The Frans Hals Museum holds the largest collection of the painter who spent his career here, in the almshouse where some of his sitters ended up.',
            'Jopenkerk is a working brewery inside a former church, which sounds like a gimmick and is in fact just a good place to sit down with bitterballen after the walk.',
          ],
        },
        { h: 'Why it works as a winter day' },
        {
          p: 'The centre is compact and flat, the distances between the four things above are all under ten minutes on foot, and the whole thing is coverable in an afternoon. In summer Haarlem also functions as the back door to the coast, with Zandvoort beach twenty minutes further down the same railway line.',
        },
      ],
      ctaLabel: 'Ask about a Haarlem afternoon',
    },
    fr: {
      slug: 'haarlem-en-decembre',
      title: 'Haarlem en décembre, à quinze minutes d’Amsterdam',
      metaTitle: 'Haarlem depuis Amsterdam : le marché de décembre et la vieille ville',
      metaDescription:
        'Haarlem est à quinze minutes de train d’Amsterdam et réunit un marché de Noël, le plus ancien musée du pays et un orgue dont Mozart a joué à dix ans.',
      excerpt:
        'Un marché de Noël dans les rues autour du Grote Markt, et une ville plus facile à parcourir qu’Amsterdam en hiver.',
      alt: 'Le marché de Noël de Haarlem au crépuscule, avec ses stands le long de la rue principale',
      topic: 'Haarlem, décembre',
      body: [
        {
          p: 'Haarlem est à quinze minutes en train de la gare centrale d’Amsterdam et reçoit une fraction des visiteurs, ce qui suffit à justifier le déplacement. C’est la capitale de la province de Hollande-Septentrionale, elle est plus ancienne qu’Amsterdam, et en décembre elle remplit ses rues de l’un des plus grands marchés de Noël du pays.',
        },
        { h: 'Le marché' },
        {
          p: 'Les stands courent dans les rues autour du Grote Markt au lieu d’être parqués sur une seule place : on traverse le marché en allant ailleurs plutôt que de faire la queue pour y entrer. Il dure quelques jours à la mi-décembre, l’après-midi et jusqu’en soirée, et la lumière de seize heures dans un décembre néerlandais lui fait plus d’effet que toutes les décorations.',
        },
        { h: 'Ce qu’il y a le reste de l’année' },
        {
          list: [
            'La Grote Kerk, aussi appelée Saint-Bavon, abrite l’orgue Müller. Mozart en a joué en 1766, à dix ans, et on en joue encore. C’est l’église que l’on voit à l’arrière-plan de bien des tableaux du Siècle d’or.',
            'Le musée Teylers a ouvert en 1784 : c’est le plus ancien musée des Pays-Bas. Il n’a jamais été modernisé, et c’est tout l’intérêt : on regarde une idée du XVIIIe siècle de ce que doit être un musée, dans ses vitrines d’origine.',
            'Le musée Frans Hals conserve la plus grande collection du peintre qui a passé sa carrière ici, dans l’hospice où certains de ses modèles ont fini leurs jours.',
            'Le Jopenkerk est une brasserie en activité dans une ancienne église, ce qui a l’air d’un gadget et se révèle simplement un bon endroit pour s’asseoir avec des bitterballen après la marche.',
          ],
        },
        { h: 'Pourquoi cela fait une bonne journée d’hiver' },
        {
          p: 'Le centre est compact et plat, les quatre lieux ci-dessus sont tous à moins de dix minutes à pied les uns des autres, et l’ensemble se couvre en un après-midi. En été, Haarlem sert aussi de porte dérobée vers la côte, la plage de Zandvoort étant à vingt minutes de plus sur la même ligne de train.',
        },
      ],
      ctaLabel: 'Demander un après-midi à Haarlem',
    },
  },
  {
    id: 'oostende',
    image: 'blog-oostende',
    ctaAnchor: '#contact',
    en: {
      slug: 'oostende-and-the-belgian-coast',
      title: 'Across the border: Oostende and the Belgian coast',
      metaTitle: 'Oostende and the Belgian coast: how it differs from the Dutch one',
      metaDescription:
        'High rises on the sand, cafés serving hot meals all afternoon and a tram that runs the length of the country’s coast. Why the Belgian seaside feels nothing like the Dutch one.',
      excerpt:
        'Excursions do not stop at the border. The Belgian coast is nothing like the Dutch one, starting with what is built on the beach.',
      alt: 'White beach cabins on the sand at Oostende',
      topic: 'Belgium, day trip',
      body: [
        {
          p: 'The Dutch coast is dunes, marram grass and a low line of buildings kept politely behind them. The Belgian coast is a wall of apartment towers standing directly on the sand. Sixty seven kilometres of it, almost continuously built. The first time you see it after years of the Dutch version, it is genuinely startling.',
        },
        { h: 'What it gets right' },
        {
          p: 'What Belgium does with that seafront is the part worth crossing the border for. Cafés and restaurants along the promenade serve proper hot meals all afternoon, at hours when a Dutch kitchen would tell you the chef starts at six. Mussels, shrimp croquettes, a plate of chips that takes itself seriously. The dressing cabins on the beach at Oostende look like they were carried over from another century, and are still in use.',
        },
        {
          p: 'The Kusttram runs the entire length of the coast, from the French border to the Dutch one, which makes it one of the longest tram lines in the world. It stops roughly every kilometre. You can get off at any resort, walk on the sand, and pick up the next one, which turns the whole coast into a single afternoon rather than a choice of one town.',
        },
        { h: 'Oostende itself' },
        {
          p: 'Oostende was the fashionable Belgian resort when Leopold II was building his seafront gallery, and it kept the scale even after the fashion moved on. James Ensor lived and painted here, and his masks are as strange in person as they look in reproduction. The harbour end near the station has the boats, the promenade has the crowd, and there is usually a busker somewhere in the middle willing to serenade a passing tour guide.',
        },
        { h: 'Getting there' },
        {
          p: 'Oostende is about three hours from Amsterdam by road, so as a day out it is a long one and works better as part of a Belgian leg with Bruges or Ghent, both of which are within an hour of it. If the point of the trip is the sea rather than the border, Scheveningen and Zandvoort are twenty minutes from The Hague and Haarlem respectively.',
        },
      ],
      ctaLabel: 'Ask about an excursion across the border',
    },
    fr: {
      slug: 'ostende-et-la-cote-belge',
      title: 'De l’autre côté de la frontière : Ostende et la côte belge',
      metaTitle: 'Ostende et la côte belge : en quoi elle diffère de la côte néerlandaise',
      metaDescription:
        'Des immeubles sur le sable, des cafés qui servent chaud tout l’après-midi et un tram qui longe toute la côte du pays. Pourquoi le littoral belge ne ressemble en rien au néerlandais.',
      excerpt:
        'Les excursions ne s’arrêtent pas à la frontière. La côte belge ne ressemble en rien à la néerlandaise, à commencer par ce qu’on a bâti sur la plage.',
      alt: 'Cabines de plage blanches sur le sable à Ostende',
      topic: 'Belgique, excursion',
      body: [
        {
          p: 'La côte néerlandaise, ce sont des dunes, des oyats et une ligne basse de bâtiments qui se tiennent poliment derrière. La côte belge, c’est un mur de tours d’habitation posé directement sur le sable. Soixante-sept kilomètres, presque continûment bâtis. La première fois qu’on la voit après des années de version néerlandaise, la surprise est réelle.',
        },
        { h: 'Ce qu’elle réussit' },
        {
          p: 'Ce que la Belgique fait de ce front de mer vaut le passage de la frontière. Cafés et restaurants de la promenade servent de vrais repas chauds tout l’après-midi, à des heures où une cuisine néerlandaise vous répondrait que le chef commence à dix-huit heures. Moules, croquettes de crevettes, une assiette de frites qui se prend au sérieux. Les cabines de bain sur la plage d’Ostende semblent venir d’un autre siècle et servent toujours.',
        },
        {
          p: 'Le Kusttram parcourt toute la côte, de la frontière française à la frontière néerlandaise, ce qui en fait l’une des plus longues lignes de tramway du monde. Il s’arrête environ tous les kilomètres. On descend dans la station balnéaire de son choix, on marche sur le sable et on reprend le suivant, ce qui transforme la côte entière en un seul après-midi au lieu d’un choix de ville.',
        },
        { h: 'Ostende même' },
        {
          p: 'Ostende était la station belge à la mode lorsque Léopold II y faisait bâtir sa galerie du front de mer, et elle en a gardé l’échelle même après que la mode est passée. James Ensor y a vécu et peint, et ses masques sont aussi étranges en vrai qu’en reproduction. Le côté du port, près de la gare, a les bateaux, la promenade a la foule, et il y a en général quelque part au milieu un musicien de rue prêt à donner la sérénade à une guide de passage.',
        },
        { h: 'Y aller' },
        {
          p: 'Ostende est à environ trois heures de route d’Amsterdam : en excursion d’une journée, c’est long, et cela fonctionne mieux au sein d’une étape belge avec Bruges ou Gand, toutes deux à moins d’une heure. Si le but du voyage est la mer plutôt que la frontière, Scheveningen et Zandvoort sont à vingt minutes de La Haye et de Haarlem.',
        },
      ],
      ctaLabel: 'Demander une excursion de l’autre côté de la frontière',
    },
  },
  {
    id: 'rooftop',
    image: 'blog-urban-farm',
    ctaAnchor: '#tours',
    en: {
      slug: 'the-rooftop-farm-in-the-hague',
      title: 'The rooftop farm in The Hague, and what became of it',
      metaTitle: 'The Hague rooftop farm: an excursion, and the lesson it left behind',
      metaDescription:
        'A visit with an Italian group to Europe’s largest rooftop farm on a former Philips building in The Hague, why it closed, and what to see in the city instead.',
      excerpt:
        'Vegetables grown on water six floors up, fish in tanks below them, and a group in protective coats. What happened next is the interesting part.',
      alt: 'A group in protective coats inside a rooftop greenhouse in The Hague',
      topic: 'The Hague, one off',
      body: [
        {
          p: 'One of the odder excursions we have run was with an Italian group to a farm on a roof. Not a few herb boxes: a twelve hundred square metre greenhouse on the sixth floor of a former Philips factory in The Hague, growing vegetables in water instead of soil, with tanks of tilapia downstairs whose waste fed the plants. It opened in 2016 as the largest rooftop farm in Europe, and standing in it in a protective coat felt like being shown the next century.',
        },
        { h: 'Why the group liked it' },
        {
          p: 'The Netherlands is the second largest agricultural exporter in the world by value, from a country you can drive across in three hours. Every visitor notices the greenhouses from the motorway without quite registering what they mean. A rooftop farm makes the argument in one room: no soil, no pesticides, no distance between where a tomato grows and where it is eaten. The group asked more questions there than at the Peace Palace.',
        },
        { h: 'What happened' },
        {
          p: 'It went bankrupt in 2018. Roughly two point seven million euro of investment, ambitious production targets, and a location forty minutes from the Westland, the vast greenhouse region that grows the same crops at a fraction of the cost. The building could not beat its own neighbours on price. The greenhouse stood empty afterwards.',
        },
        {
          p: 'We keep the story because it is honest about how this country works. The Dutch instinct to engineer a solution and try it at full scale is real, and so is the willingness to let it fail in public rather than quietly prop it up. Both halves are worth knowing before you look at a polder, a storm barrier or a reclaimed province and assume it all went to plan first time.',
        },
        { h: 'What to see in The Hague now' },
        {
          p: 'The city tour covers the ground that has not moved: the Binnenhof and the Hofvijver, the Peace Palace, the embassy quarter, the former Jewish district that is now the city’s Chinatown, Madurodam and the beach at Scheveningen. It works on foot in the centre or by coach if the Peace Palace and the beach are both on the list.',
        },
      ],
      ctaLabel: 'See the The Hague tours',
    },
    fr: {
      slug: 'la-ferme-sur-les-toits-de-la-haye',
      title: 'La ferme sur les toits de La Haye, et ce qu’elle est devenue',
      metaTitle: 'La ferme sur les toits de La Haye : une excursion et la leçon qu’elle a laissée',
      metaDescription:
        'Visite avec un groupe italien de la plus grande ferme sur toit d’Europe, sur une ancienne usine Philips à La Haye, les raisons de sa fermeture et quoi voir dans la ville.',
      excerpt:
        'Des légumes cultivés sur l’eau au sixième étage, des poissons en bassin en dessous, et un groupe en blouse. La suite est le plus intéressant.',
      alt: 'Un groupe en blouse de protection dans une serre sur un toit à La Haye',
      topic: 'La Haye, visite unique',
      body: [
        {
          p: 'L’une des excursions les plus étranges que nous ayons menées conduisait un groupe italien dans une ferme installée sur un toit. Pas quelques bacs d’aromates : une serre de mille deux cents mètres carrés au sixième étage d’une ancienne usine Philips à La Haye, où les légumes poussaient sur l’eau plutôt que dans la terre, avec en dessous des bassins de tilapias dont les déjections nourrissaient les plantes. Elle a ouvert en 2016 comme la plus grande ferme sur toit d’Europe, et s’y tenir en blouse donnait l’impression qu’on vous montrait le siècle suivant.',
        },
        { h: 'Pourquoi le groupe a aimé' },
        {
          p: 'Les Pays-Bas sont le deuxième exportateur agricole mondial en valeur, depuis un pays que l’on traverse en trois heures de voiture. Tous les visiteurs remarquent les serres depuis l’autoroute sans vraiment saisir ce qu’elles signifient. Une ferme sur un toit résume l’argument en une seule pièce : pas de terre, pas de pesticides, aucune distance entre l’endroit où pousse une tomate et celui où on la mange. Le groupe y a posé plus de questions qu’au Palais de la Paix.',
        },
        { h: 'Ce qui s’est passé' },
        {
          p: 'Elle a fait faillite en 2018. Environ deux millions sept cent mille euros investis, des objectifs de production ambitieux, et une implantation à quarante minutes du Westland, l’immense région de serres qui cultive les mêmes produits à une fraction du coût. Le bâtiment ne pouvait pas battre ses propres voisins sur les prix. La serre est restée vide ensuite.',
        },
        {
          p: 'Nous gardons cette histoire parce qu’elle dit honnêtement comment fonctionne ce pays. L’instinct néerlandais qui consiste à concevoir une solution et à l’essayer en grandeur réelle est bien réel, tout comme l’acceptation de la voir échouer en public plutôt que de la soutenir en silence. Il faut connaître les deux moitiés avant de regarder un polder, un barrage anti-tempête ou une province gagnée sur l’eau en supposant que tout a marché du premier coup.',
        },
        { h: 'Que voir à La Haye aujourd’hui' },
        {
          p: 'La visite de la ville couvre ce qui n’a pas bougé : le Binnenhof et le Hofvijver, le Palais de la Paix, le quartier des ambassades, l’ancien quartier juif devenu le quartier chinois de la ville, Madurodam et la plage de Scheveningen. Elle se fait à pied dans le centre, ou en bus si le Palais de la Paix et la plage figurent tous deux au programme.',
        },
      ],
      ctaLabel: 'Voir les visites de La Haye',
    },
  },
];

/** Posts in index order for a given language, newest-first is not meaningful here. */
export const postsFor = (lang: Lang) => posts.map((post) => ({ post, copy: post[lang] }));

export const findPost = (lang: Lang, slug: string) => posts.find((post) => post[lang].slug === slug);

/** Three other articles, wrapping around, for the read-next row. */
export const relatedPosts = (id: string) => {
  const index = posts.findIndex((post) => post.id === id);
  if (index < 0) return posts.slice(0, 3);
  return [1, 2, 3].map((step) => posts[(index + step) % posts.length]);
};
