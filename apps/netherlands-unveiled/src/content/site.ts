// Copy for both languages. Nothing here is shipped to the browser as JSON any
// more: each language is rendered into its own URL at build time, so a page
// only ever contains the strings for the language it is served in.

export const chrome = {
  en: {
    nav: {
      brandAria: 'Netherlands Unveiled home',
      tagline: 'Amsterdam city tours and more',
      guidingLanguages: 'Guiding languages',
      languageToggleLabel: 'Site language',
      menu: 'Menu',
      aria: 'Main navigation',
      tours: 'Tours',
      about: 'About us',
      reviews: 'Reviews',
      blog: 'Blog',
      contact: 'Contact',
    },
    languageNames: {
      English: 'English',
      Dutch: 'Dutch',
      German: 'German',
      French: 'French',
      Spanish: 'Spanish',
      Italian: 'Italian',
    },
    footer: {
      brand: 'Netherlands Unveiled',
      copy: 'Amsterdam city tours and more',
      nav: 'Footer navigation',
    },
  },
  fr: {
    nav: {
      brandAria: 'Accueil Netherlands Unveiled',
      tagline: 'Visites d’Amsterdam et plus encore',
      guidingLanguages: 'Langues de visite',
      languageToggleLabel: 'Langue du site',
      menu: 'Menu',
      aria: 'Navigation principale',
      tours: 'Visites',
      about: 'À propos',
      reviews: 'Avis',
      blog: 'Blog',
      contact: 'Contact',
    },
    languageNames: {
      English: 'Anglais',
      Dutch: 'Néerlandais',
      German: 'Allemand',
      French: 'Français',
      Spanish: 'Espagnol',
      Italian: 'Italien',
    },
    footer: {
      brand: 'Netherlands Unveiled',
      copy: 'Visites d’Amsterdam et plus encore',
      nav: 'Navigation du pied de page',
    },
  },
} as const;

export const home = {
  en: {
    meta: {
      title: 'Netherlands Unveiled | Amsterdam City Tours and More',
      description:
        'Amsterdam city tours and excursions with Marion to Zaanse Schans, Edam, Volendam, Marken, The Hague, Rotterdam, Delft and Nijmegen.',
      ogDescription:
        'Discover Amsterdam and more with a guide who brings Dutch history, culture and the differences between Amsterdam and New Amsterdam to life.',
    },
    hero: {
      label: 'Netherlands Unveiled',
      imageAlt: 'Colorful Netherlands scene with canals, tulips, Delft blue and Dutch city details',
      title: 'Netherlands Unveiled',
      primaryCta: 'Plan a tour',
      secondaryCta: 'Explore tours',
    },
    toursSection: {
      title: 'What we offer: Amsterdam city tours and more',
      copy:
        'Choose from themed walking tours in Amsterdam, visits to villages around Amsterdam and city tours in The Hague, Rotterdam, Delft and Nijmegen.',
    },
    tours: [
      {
        title: 'Amsterdam',
        image: 'amsterdam',
        alt: 'Amsterdam canal with gabled houses and bicycles',
        copy:
          'Four ways to discover Amsterdam on foot, each revealing a different side of the city.',
        items: [
          'Introduction to Amsterdam. From Amsterdam Centraal through part of the Red Light District to Dam Square and the Flower Market. This tour takes 2 to 3 hours, depending on the itinerary.',
          'Jewish and WWII Amsterdam. Learn about Amsterdam’s Jewish community and what happened during WWII. See the Holocaust Names Monument, the Jewish Museum from the outside, Wertheimpark and Waterlooplein. If time allows, continue to the Anne Frank House.',
          'Jordaan. Discover how this famous neighbourhood developed from a working-class district into one of Amsterdam’s most sought-after areas.',
          'Red Light District. Explore the history of the neighbourhood known for its “ladies of the night” and its surprising connection with Wall Street in New York.',
        ],
      },
      {
        title: 'Zaanse Schans, Edam, Volendam & Marken',
        image: 'villages',
        alt: 'Traditional harbor village with Dutch houses',
        copy:
          'This excursion through the countryside around Amsterdam can be enjoyed as a half-day or full-day tour, with or without lunch.',
        items: [
          'Visit Zaanse Schans, an open-air village showing life in one of the largest industrial areas of the 17th century. Watch a demonstration of how Dutch clogs are made and enjoy free time to explore.',
          'Stop at a cheese farm for a demonstration of how Dutch cheese is made, followed by a tasting.',
          'Continue to the historic streets of Edam and the harbour village of Volendam, with a crossing to Marken.',
        ],
      },
      {
        title: 'The Hague',
        image: 'den-haag',
        alt: 'The Binnenhof and Ridderzaal reflected in the Hofvijver in The Hague',
        copy:
          'Discover the governmental and international heart of the Netherlands on foot or by bus.',
        items: [
          'Walking tour. Explore the city centre, including Lange Voorhout, the Parliament Buildings and the former Jewish district, which is now The Hague’s Chinatown.',
          'Bus tour. See the city centre, the Peace Palace, the embassy district, Madurodam and the beach at Scheveningen.',
        ],
      },
      {
        title: 'Rotterdam',
        image: 'rotterdam',
        alt: 'The yellow Cube Houses and the Markthal in Rotterdam',
        copy:
          'See the striking architecture and changing skyline of the Netherlands’ modern port city.',
        items: [
          'Walking tour. Discover the Cube Houses, the new Markthal and views from the Erasmus Bridge.',
          'Bus tour. Pass Blijdorp Zoo, Coolsingel and the Cube Houses, cross the Maas over the Willems Bridge and return via the Erasmus Bridge, passing the Euromast observation tower.',
        ],
      },
      {
        title: 'Delft',
        image: 'delft',
        alt: 'A Delft Blue plate being hand-painted in a Delft pottery workshop',
        copy:
          'Visit Royal Delft, the country’s oldest Delft Blue factory, for a demonstration of how the famous pottery is made, followed by a walking tour of this beautiful historic city.',
        items: [
          'The Hague, Rotterdam and Delft can also be combined in a full-day tour known as “Grand Holland”. Contact us for more information.',
        ],
      },
      {
        title: 'Nijmegen',
        image: 'nijmegen',
        alt: 'Historic Nijmegen city view',
        copy:
          'The city Marion likes guiding most: the oldest in the country and the only one built on two levels.',
        items: [],
        link: '#nijmegen',
        linkLabel: 'More about Nijmegen',
      },
    ],
    nijmegen: {
      label: 'Nijmegen walking tours',
      eyebrow: 'Marion’s favourite',
      title: 'Nijmegen, the oldest city in the Netherlands',
      copy: [
        'Nijmegen is the city Marion likes guiding most. It is the oldest city in the country, with roots going back to the Romans, and the only Dutch city built on two levels: an upper town on the ridge and a lower town along the water.',
        'The walking tour takes about two hours and covers the best-known landmarks, with Stevenskerk towering above the centre and the Waalkade running along the river Waal below it. The two levels keep changing the view: old streets and squares up top, the wide river opening up at the edge.',
        'Nijmegen works particularly well for coach groups arriving for the day. Route and pace are set to the group.',
      ],
      imageAlt: 'Marion with a tour group during a walking tour in Nijmegen',
      cta: 'Ask about Nijmegen',
    },
    spring: {
      label: 'Keukenhof spring tours',
      eyebrow: 'Springtime',
      title: 'Discover Keukenhof',
      copy: [
        'In the springtime, discover Keukenhof: home to millions of flowers, starting with daffodils and ending with about 350 different varieties of tulips. Keukenhof is about an hour from Amsterdam and can be visited as a stand-alone excursion or combined with nearby attractions such as The Hague or Delft.',
        'We can also shape the day around an official lunch nearby.',
      ],
      readMore: 'Read: a day at Keukenhof',
    },
    about: {
      title: 'About us',
      copy: [
        'Most of our tours are done by Marion.',
        'Marion Baumgarten’s career in the travel industry has spanned many years. She went from tour guiding to hotel and attraction sales and back again to tour guiding, first in New York City and now in Amsterdam.',
        'Born in New York City and having lived in the Netherlands and other countries, Marion made the original journey in reverse: from “New Amsterdam to Amsterdam”. In the process, she became a specialist in explaining the differences in lifestyle on each side of the Atlantic.',
      ],
      note:
        'With a background in French language and literature as well as tourism, Marion brings history, culture and everyday life together in the stories she shares.',
      video: {
        play: 'Play the video',
        posterAlt: 'Marion Baumgarten on the Waalkade in Nijmegen, with the Waal bridge behind her',
        caption: 'Marion on the Waalkade in Nijmegen, with the Waal bridge behind her.',
        length: '1 min 37',
        openOnVimeo: 'Watch on Vimeo',
      },
    },
    reviews: {
      title: 'What guests and tour operators say',
      items: [
        {
          quote:
            'I thank YOU! This Wegener group was my first very top tip incentive group and I was nervous about it, and I am so happy everything went well. A big thank you to you! You will be missed, lord knows we don’t have enough good guides in NYC.',
          name: 'Hanna',
          from: 'CTN Tours',
        },
        {
          quote:
            'Good afternoon Marion and Steve (driver), we remember you with great pleasure! We wish you lots of luck with future groups. Greetings from the whole family: Luca, Marta, Samuele and Tommasso.',
          name: 'Luca Matteini',
          from: 'Italy',
        },
        {
          quote: 'Thank you for the guided tour you did for us. We were very satisfied.',
          name: 'Lena',
          from: 'Sweden',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Tell us what you want to see',
      copy:
        'Send your preferred date, group size and tour idea. We reply by email or Messenger with availability and a fitting route.',
      messenger: 'Message on Messenger',
    },
    form: {
      success: 'Thank you. Your request was sent. We will reply by email or Messenger.',
      firstName: 'First name *',
      lastName: 'Last name',
      email: 'Email *',
      contactPreference: 'Preferred contact',
      emailOption: 'Email',
      messengerOption: 'Messenger',
      tourInterest: 'Tour interest *',
      chooseTour: 'Choose a tour',
      date: 'Preferred date or period *',
      datePlaceholder: 'For example: 18 May or spring 2027',
      groupSize: 'Group size *',
      groupSizePlaceholder: 'For example: 2 guests or a bus group',
      language: 'Preferred language',
      message: 'Message *',
      messagePlaceholder:
        'Tell us who is traveling, what you want to see and whether the pace should be relaxed or full-day.',
      submit: 'Send tour request',
      submitting: 'Sending...',
      privacy: 'Your details are only used to answer this tour request.',
      errorDefault: 'Your request could not be sent.',
      siteLanguage: 'English',
      tourOptions: {
        Amsterdam: 'Amsterdam',
        'Jordaan tour': 'Jordaan tour',
        'Jewish heritage tour': 'Jewish heritage tour',
        'Red Light District tour': 'Red Light District tour',
        'Keukenhof spring tour': 'Keukenhof spring tour',
        'Volendam, Edam, Marken or Zaanse Schans': 'Volendam, Edam, Marken or Zaanse Schans',
        'Nijmegen walking tour': 'Nijmegen walking tour',
        'The Grand Holland': 'The Grand Holland',
        'The Hague, Rotterdam or Delft': 'The Hague, Rotterdam or Delft',
      },
    },
  },
  fr: {
    meta: {
      title: 'Netherlands Unveiled | Visites d’Amsterdam et plus encore',
      description:
        'Visites d’Amsterdam et excursions avec Marion à Zaanse Schans, Edam, Volendam, Marken, La Haye, Rotterdam, Delft et Nimègue.',
      ogDescription:
        'Découvrez Amsterdam et bien plus avec une guide qui donne vie à l’histoire, à la culture et aux différences entre Amsterdam et New Amsterdam.',
    },
    hero: {
      label: 'Netherlands Unveiled',
      imageAlt: 'Scène colorée des Pays-Bas avec canaux, tulipes, bleu de Delft et détails urbains',
      title: 'Netherlands Unveiled',
      primaryCta: 'Planifier une visite',
      secondaryCta: 'Voir les visites',
    },
    toursSection: {
      title: 'Notre offre : visites d’Amsterdam et plus encore',
      copy:
        'Choisissez parmi des visites thématiques à pied d’Amsterdam, des excursions dans les villages des environs et des visites de La Haye, Rotterdam, Delft et Nimègue.',
    },
    tours: [
      {
        title: 'Amsterdam',
        image: 'amsterdam',
        alt: 'Canal d’Amsterdam avec maisons à pignons et vélos',
        copy:
          'Quatre façons de découvrir Amsterdam à pied, chacune révélant un visage différent de la ville.',
        items: [
          'Introduction à Amsterdam. De la gare centrale d’Amsterdam, en passant par une partie du Quartier rouge, jusqu’à la place du Dam et au marché aux fleurs. Cette visite dure de 2 à 3 heures, selon l’itinéraire.',
          'Amsterdam juif et la Seconde Guerre mondiale. Découvrez la communauté juive d’Amsterdam et ce qui lui est arrivé pendant la guerre. Voyez le Mémorial des noms de l’Holocauste, le Musée juif de l’extérieur, le Wertheimpark et Waterlooplein. Si le temps le permet, poursuivez jusqu’à la Maison d’Anne Frank.',
          'Jordaan. Découvrez comment ce célèbre quartier populaire est devenu l’un des secteurs les plus recherchés d’Amsterdam.',
          'Quartier rouge. Explorez l’histoire du quartier connu pour ses « dames de la nuit » et son lien surprenant avec Wall Street à New York.',
        ],
      },
      {
        title: 'Zaanse Schans, Edam, Volendam et Marken',
        image: 'villages',
        alt: 'Village portuaire traditionnel avec maisons néerlandaises',
        copy:
          'Cette excursion dans la campagne autour d’Amsterdam peut se faire en une demi-journée ou une journée complète, avec ou sans déjeuner.',
        items: [
          'Visitez Zaanse Schans, un village en plein air qui présente la vie dans l’une des plus grandes régions industrielles du XVIIe siècle. Assistez à une démonstration de fabrication de sabots néerlandais et profitez de temps libre pour explorer le village.',
          'Arrêtez-vous dans une ferme fromagère pour découvrir la fabrication du fromage néerlandais, suivie d’une dégustation.',
          'Poursuivez vers les rues historiques d’Edam et le village portuaire de Volendam, avec une traversée vers Marken.',
        ],
      },
      {
        title: 'La Haye',
        image: 'den-haag',
        alt: 'Le Binnenhof et la Ridderzaal reflétés dans le Hofvijver à La Haye',
        copy:
          'Découvrez à pied ou en bus le cœur gouvernemental et international des Pays-Bas.',
        items: [
          'Visite à pied. Explorez le centre-ville, notamment Lange Voorhout, les bâtiments du Parlement et l’ancien quartier juif, devenu aujourd’hui le quartier chinois de La Haye.',
          'Visite en bus. Découvrez le centre-ville, le Palais de la Paix, le quartier des ambassades, Madurodam et la plage de Scheveningen.',
        ],
      },
      {
        title: 'Rotterdam',
        image: 'rotterdam',
        alt: 'Les maisons cubiques jaunes et le Markthal à Rotterdam',
        copy:
          'Découvrez l’architecture audacieuse et le paysage urbain changeant de la ville portuaire moderne des Pays-Bas.',
        items: [
          'Visite à pied. Découvrez les Maisons Cubes, le nouveau Markthal et la vue depuis le pont Érasme.',
          'Visite en bus. Passez devant le zoo de Blijdorp, Coolsingel et les Maisons Cubes, traversez la Meuse par le pont Willems et revenez par le pont Érasme, en passant devant la tour panoramique Euromast.',
        ],
      },
      {
        title: 'Delft',
        image: 'delft',
        alt: 'Une assiette en bleu de Delft peinte à la main dans un atelier de Delft',
        copy:
          'Visitez Royal Delft, la plus ancienne manufacture de faïence bleu de Delft du pays, pour découvrir sa fabrication, puis partez à pied à la découverte de cette belle ville historique.',
        items: [
          'La Haye, Rotterdam et Delft peuvent également être combinées en une excursion d’une journée appelée « Grand Holland ». Contactez-nous pour plus d’informations.',
        ],
      },
      {
        title: 'Nimègue',
        image: 'nijmegen',
        alt: 'Vue historique de la ville de Nimègue',
        copy:
          'La ville que Marion préfère guider : la plus ancienne du pays et la seule construite sur deux niveaux.',
        items: [],
        link: '#nijmegen',
        linkLabel: 'En savoir plus sur Nimègue',
      },
    ],
    nijmegen: {
      label: 'Visites à pied de Nimègue',
      eyebrow: 'La préférée de Marion',
      title: 'Nimègue, la plus ancienne ville des Pays-Bas',
      copy: [
        'Nimègue est la ville que Marion préfère guider. C’est la plus ancienne du pays, avec des origines qui remontent aux Romains, et la seule ville néerlandaise construite sur deux niveaux : une ville haute sur la crête et une ville basse au bord de l’eau.',
        'La visite à pied dure environ deux heures et couvre les monuments les plus connus, avec la Stevenskerk qui domine le centre et la Waalkade qui longe le Waal en contrebas. Les deux niveaux changent sans cesse la perspective : rues et places anciennes en haut, large panorama sur le fleuve au bord de la ville haute.',
        'Nimègue convient particulièrement bien aux groupes en autocar venus pour la journée. L’itinéraire et le rythme s’adaptent au groupe.',
      ],
      imageAlt: 'Marion avec un groupe pendant une visite à pied de Nimègue',
      cta: 'Renseignez-vous sur Nimègue',
    },
    spring: {
      label: 'Visites de printemps à Keukenhof',
      eyebrow: 'Printemps',
      title: 'Découvrez Keukenhof',
      copy: [
        'Au printemps, découvrez Keukenhof : un lieu qui abrite des millions de fleurs, commençant par les jonquilles et se terminant par environ 350 variétés de tulipes. Keukenhof se trouve à environ une heure d’Amsterdam et peut se visiter comme excursion séparée ou être combiné avec des attractions proches comme La Haye ou Delft.',
        'Nous pouvons aussi organiser la journée autour d’un déjeuner officiel à proximité.',
      ],
      readMore: 'À lire : une journée à Keukenhof',
    },
    about: {
      title: 'À propos de nous',
      copy: [
        'La plupart de nos visites sont assurées par Marion.',
        'La carrière de Marion Baumgarten dans le tourisme s’étend sur de nombreuses années. Elle est passée du guidage à la vente hôtelière et d’attractions, puis est revenue au guidage, d’abord à New York et maintenant à Amsterdam.',
        'Née à New York et ayant vécu aux Pays-Bas ainsi que dans d’autres pays, Marion a fait le voyage originel en sens inverse : de « New Amsterdam à Amsterdam ». Elle est ainsi devenue spécialiste des différences de mode de vie de chaque côté de l’Atlantique.',
      ],
      note:
        'Grâce à sa formation en langue et littérature françaises ainsi qu’en tourisme, Marion réunit histoire, culture et vie quotidienne dans les récits qu’elle partage.',
      video: {
        play: 'Lancer la vidéo',
        posterAlt: 'Marion Baumgarten sur la Waalkade à Nimègue, le pont sur le Waal derrière elle',
        caption: 'Marion sur la Waalkade à Nimègue, le pont sur le Waal derrière elle.',
        length: '1 min 37',
        openOnVimeo: 'Voir sur Vimeo',
      },
    },
    reviews: {
      title: 'Ce que disent les voyageurs et les tour-opérateurs',
      items: [
        {
          quote:
            'C’est moi qui vous remercie ! Ce groupe Wegener était mon tout premier groupe incentive haut de gamme et j’étais nerveuse ; je suis tellement heureuse que tout se soit bien passé. Un grand merci à vous ! Vous allez nous manquer, il n’y a vraiment pas assez de bons guides à New York.',
          name: 'Hanna',
          from: 'CTN Tours',
        },
        {
          quote:
            'Bonjour Marion et Steve (le chauffeur), nous nous souvenons de vous avec grand plaisir ! Nous vous souhaitons beaucoup de réussite avec vos prochains groupes. Salutations de toute la famille : Luca, Marta, Samuele et Tommasso.',
          name: 'Luca Matteini',
          from: 'Italie',
        },
        {
          quote: 'Merci pour la visite guidée que vous avez faite pour nous. Nous étions très satisfaits.',
          name: 'Lena',
          from: 'Suède',
        },
      ],
    },
    contact: {
      eyebrow: 'Contact',
      title: 'Dites-nous ce que vous voulez voir',
      copy:
        'Envoyez votre date préférée, la taille de votre groupe et votre idée de visite. Nous répondons par e-mail ou Messenger avec nos disponibilités et un itinéraire adapté.',
      messenger: 'Envoyer un message sur Messenger',
    },
    form: {
      success: 'Merci. Votre demande a été envoyée. Nous vous répondrons par e-mail ou Messenger.',
      firstName: 'Prénom *',
      lastName: 'Nom',
      email: 'E-mail *',
      contactPreference: 'Contact préféré',
      emailOption: 'E-mail',
      messengerOption: 'Messenger',
      tourInterest: 'Visite souhaitée *',
      chooseTour: 'Choisissez une visite',
      date: 'Date ou période préférée *',
      datePlaceholder: 'Par exemple : 18 mai ou printemps 2027',
      groupSize: 'Taille du groupe *',
      groupSizePlaceholder: 'Par exemple : 2 personnes ou un groupe en bus',
      language: 'Langue préférée',
      message: 'Message *',
      messagePlaceholder:
        'Dites-nous qui voyage, ce que vous voulez voir et si le rythme doit être détendu ou sur une journée complète.',
      submit: 'Envoyer la demande',
      submitting: 'Envoi...',
      privacy: 'Vos coordonnées servent uniquement à répondre à cette demande de visite.',
      errorDefault: 'Votre demande n’a pas pu être envoyée.',
      siteLanguage: 'French',
      tourOptions: {
        Amsterdam: 'Amsterdam',
        'Jordaan tour': 'Visite du Jordaan',
        'Jewish heritage tour': 'Visite du patrimoine juif',
        'Red Light District tour': 'Visite du Quartier rouge',
        'Keukenhof spring tour': 'Visite printanière de Keukenhof',
        'Volendam, Edam, Marken or Zaanse Schans': 'Volendam, Edam, Marken ou Zaanse Schans',
        'Nijmegen walking tour': 'Visite à pied de Nimègue',
        'The Grand Holland': 'La Grande Hollande',
        'The Hague, Rotterdam or Delft': 'La Haye, Rotterdam ou Delft',
      },
    },
  },
} as const;

export const languagesPage = {
  en: {
    meta: {
      title: 'Guiding languages | Netherlands Unveiled',
      description:
        'Tours guided in English, German, French, Spanish and Italian, with Dutch available as well.',
      ogDescription: 'Tours guided in English, German, French, Spanish and Italian.',
    },
    page: {
      eyebrow: 'Languages',
      title: 'Guiding languages',
      lead:
        'Marion guides in six languages. Tours in English are the most common, and the others can be arranged on request.',
      cta: 'Plan a tour',
    },
  },
  fr: {
    meta: {
      title: 'Langues de visite | Netherlands Unveiled',
      description:
        'Visites guidées en anglais, allemand, français, espagnol et italien, le néerlandais étant également possible.',
      ogDescription: 'Visites guidées en anglais, allemand, français, espagnol et italien.',
    },
    page: {
      eyebrow: 'Langues',
      title: 'Langues de visite',
      lead:
        'Marion guide en six langues. Les visites en anglais sont les plus courantes, et les autres peuvent être organisées sur demande.',
      cta: 'Planifier une visite',
    },
  },
} as const;

export const toursIndex = {
  en: {
    meta: {
      title: 'Guided Tours in the Netherlands | Netherlands Unveiled',
      description:
        'Private guided tours in Amsterdam, Keukenhof, the villages north of Amsterdam, The Hague, Rotterdam, Delft and Nijmegen, for individuals, families and coach groups.',
      ogDescription:
        'Private guided tours across the Netherlands, for individuals, families and coach groups.',
    },
    page: {
      eyebrow: 'Tours',
      title: 'Guided tours in the Netherlands',
      lead:
        'Walking tours, half days and full days, guided in six languages. Every route is set to the group rather than run from a script.',
      readMore: 'See the tour',
      cta: 'Plan a tour',
    },
  },
  fr: {
    meta: {
      title: 'Visites guidées aux Pays-Bas | Netherlands Unveiled',
      description:
        'Visites privées guidées à Amsterdam, Keukenhof, les villages au nord d’Amsterdam, La Haye, Rotterdam, Delft et Nimègue, pour individuels, familles et groupes en autocar.',
      ogDescription:
        'Visites privées guidées à travers les Pays-Bas, pour individuels, familles et groupes en autocar.',
    },
    page: {
      eyebrow: 'Visites',
      title: 'Visites guidées aux Pays-Bas',
      lead:
        'Visites à pied, demi-journées et journées complètes, guidées en six langues. Chaque parcours s’adapte au groupe au lieu de suivre un script.',
      readMore: 'Voir la visite',
      cta: 'Planifier une visite',
    },
  },
} as const;

export const tourUi = {
  en: {
    breadcrumb: 'Breadcrumb',
    home: 'Home',
    tours: 'Tours',
    facts: 'At a glance',
    faq: 'Common questions',
    related: 'Related reading',
    all: 'All tours',
  },
  fr: {
    breadcrumb: 'Fil d’Ariane',
    home: 'Accueil',
    tours: 'Visites',
    facts: 'En bref',
    faq: 'Questions fréquentes',
    related: 'À lire aussi',
    all: 'Toutes les visites',
  },
} as const;

export const blogIndex = {
  en: {
    meta: {
      title: 'Blog | Tours, traditions and days out in the Netherlands',
      description:
        'Articles from the road: Keukenhof, the villages north of Amsterdam, Dutch food, day trips and the traditions behind them, written by a working guide.',
      ogDescription: 'Articles from the road, written by a working guide in the Netherlands.',
    },
    page: {
      eyebrow: 'Blog',
      title: 'Stories from the tours',
      lead:
        'What is worth seeing, when to see it and how a day out is actually put together. Written from years of guiding groups around the Netherlands and just across the border.',
      readMore: 'Read the article',
      cta: 'Plan a tour',
    },
  },
  fr: {
    meta: {
      title: 'Blog | Visites, traditions et sorties aux Pays-Bas',
      description:
        'Des articles écrits sur le terrain : Keukenhof, les villages au nord d’Amsterdam, la cuisine néerlandaise, les excursions et les traditions qui vont avec.',
      ogDescription: 'Des articles écrits sur le terrain par une guide en activité aux Pays-Bas.',
    },
    page: {
      eyebrow: 'Blog',
      title: 'Récits de visites',
      lead:
        'Ce qui mérite d’être vu, à quel moment, et comment une journée se construit vraiment. Écrit après des années à guider des groupes aux Pays-Bas et juste de l’autre côté de la frontière.',
      readMore: 'Lire l’article',
      cta: 'Planifier une visite',
    },
  },
} as const;

export const postUi = {
  en: {
    breadcrumb: 'Breadcrumb',
    home: 'Home',
    blog: 'Blog',
    backToBlog: 'All articles',
    related: 'More from the tours',
    planTitle: 'Planning a trip around this?',
    planCopy:
      'Tell us the dates, the group size and what you want to see. We reply by email or Messenger with a route that fits.',
    planCta: 'Plan a tour',
  },
  fr: {
    breadcrumb: 'Fil d’Ariane',
    home: 'Accueil',
    blog: 'Blog',
    backToBlog: 'Tous les articles',
    related: 'À lire aussi',
    planTitle: 'Vous organisez un séjour autour de cela ?',
    planCopy:
      'Indiquez vos dates, la taille du groupe et ce que vous voulez voir. Nous répondons par e-mail ou Messenger avec un itinéraire adapté.',
    planCta: 'Planifier une visite',
  },
} as const;

// The blurbs stay in their own language on purpose: they are the message a
// German or Italian visitor should read. Dutch is deliberately left without a
// blurb, though the flag stays in the header.
export const guidingLanguages = [
  {
    code: 'us',
    language: 'English',
    anchor: 'english',
    message:
      'Marion offers walking tours of Amsterdam, the city she loves and where she lives. Other excursions can also be arranged.',
  },
  {
    code: 'nl',
    language: 'Dutch',
    anchor: null,
    message: null,
  },
  {
    code: 'de',
    language: 'German',
    anchor: 'german',
    message:
      'Marion bietet Stadtrundgänge von Amsterdam an, die Stadt, die sie liebt und in der sie lebt, aber sie kann auch andere Ausflüge organisieren.',
  },
  {
    code: 'fr',
    language: 'French',
    anchor: 'french',
    message:
      'Marion conduit des visites à pied d’Amsterdam, la ville qu’elle adore et où elle habite. D’autres excursions peuvent aussi être arrangées.',
  },
  {
    code: 'es',
    language: 'Spanish',
    anchor: 'spanish',
    message:
      'Marion da paseos por Ámsterdam, la ciudad donde vive y que le encanta, pero puede organizar también otras excursiones.',
  },
  {
    code: 'it',
    language: 'Italian',
    anchor: 'italian',
    message:
      'Marion fa delle passeggiate di Amsterdam, la città dove vive e che ama molto, ma può anche organizzare altre gite.',
  },
] as const;
