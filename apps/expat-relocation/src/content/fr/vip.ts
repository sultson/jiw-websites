import type { VipContent } from '../types';

export const vip: VipContent = {
  title: 'Services de relocation VIP',
  metaTitle: 'Forfaits VIP relocation & immigration Pays-Bas | E & I',
  metaDescription:
    'Forfaits de relocation VIP pour les couples, familles et entreprises qui s’installent aux Pays-Bas. Immigration, logement, enregistrements et installation, orchestrés par une seule personne. À partir de 2 000 €.',
  eyebrow: 'Services VIP',
  intro: [
    'Des artistes en tournée. Des athlètes entre deux saisons. Des dirigeants avec un seul week-end libre et des fondateurs qui n’en ont aucun. Nos forfaits VIP existent pour ceux dont l’agenda ne plie pas. Alors, ce sont les Pays-Bas qui plient.',
    'Chaque forfait est piloté personnellement par Johanna : rendez-vous regroupés, portes ouvertes à l’avance, et une ligne 24/7 tenue par la personne qui connaît votre dossier, pas par un service client.',
  ],
  image: '/images/vip-hub.jpg?v=20260731',
  imageAlt: 'Hôte accueillant un couple arrivant en voiture devant un hôtel au bord d’un canal',
  pricingNote: {
    title: 'Comment le VIP est chiffré',
    text: [
      'Des prestations sur mesure, adaptées à vos exigences personnelles. À l’issue d’un premier entretien, vous recevez une proposition personnalisée fondée sur vos objectifs, votre situation familiale et le niveau d’accompagnement souhaité.',
      'Cette proposition est un montant fixe pour le périmètre convenu. Pas de taux horaire, pas d’ajouts en cours de déménagement, et aucun frais pour l’entretien dont elle découle.',
    ],
  },
  tailored: {
    text: 'Chaque forfait est un point de départ, pas un menu figé. Lors de la première consultation, nous adaptons le périmètre à votre situation, en ajoutant ce dont vous avez besoin et en écartant ce qui ne vous sert pas.',
    label: 'Discuter d’un forfait sur mesure',
  },
  packages: [
    {
      slug: 'couple-relocation-immigration-package-netherlands',
      name: 'Forfait VIP Couple',
      tagline: 'Deux vies, une arrivée sans couture.',
      metaTitle: 'Forfait relocation & immigration Couple Pays-Bas | E & I',
      metaDescription:
        'Forfait complet de relocation et d’immigration pour les couples qui s’installent aux Pays-Bas : visa partenaire, logement, BSN, assurances, compte bancaire et installation, avec un accompagnement personnel.',
      investment: 'Sur mesure',
      intro: [
        'Vous déménagez pour une carrière, une entreprise ou l’un pour l’autre, et aucun de vous deux n’a le temps de devenir expert en bureaucratie néerlandaise. Le Forfait VIP Couple confie vos deux dossiers à une seule main et séquence l’ensemble pour que visas, logement et enregistrements arrivent dans le bon ordre.',
      ],
      included: {
        title: 'Ce qui est inclus',
        items: [
          { title: 'Accompagnement visa partenaire', text: 'Évaluation, préparation et dépôt de la voie partenaire, alignée sur le permis du partenaire qui travaille.' },
          { title: 'Conseil en immigration', text: 'Une seule stratégie pour les deux dossiers, afin qu’aucune demande n’attende l’autre.' },
          { title: 'Aide au logement', text: 'Une sélection adaptée à votre vie, des visites organisées, un contrat vérifié avant signature.' },
          { title: 'Enregistrement BSN', text: 'Rendez-vous en municipalité réservés et effectués ensemble.' },
          { title: 'Assurance santé', text: 'La bonne police néerlandaise choisie et activée à temps.' },
          { title: 'Ouverture de compte bancaire', text: 'Un compte néerlandais ouvert sans l’éternel cercle vicieux de l’adresse et du BSN.' },
          { title: 'Rendez-vous en municipalité', text: 'Chaque enregistrement planifié, préparé et accompagné.' },
          { title: 'Aide à l’installation', text: 'Énergie, internet, médecin, dentiste et ces petites choses qui font d’une ville la vôtre.' },
          { title: 'Accompagnement WhatsApp', text: 'Une ligne directe vers Johanna, à toute heure, pour vous deux.' },
        ],
      },
      forWho: {
        title: 'Conçu pour',
        items: [
          'Les couples dont un partenaire déménage pour le travail et l’autre a besoin d’une voie de séjour',
          'Les couples à double carrière arrivant avec des permis distincts',
          'Les partenaires rejoignant une personne qui travaille déjà aux Pays-Bas',
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          { title: 'Consultation', text: 'Une conversation sur votre situation, votre calendrier et vos impératifs. Vous recevez un devis fixe.' },
          { title: 'Préparation', text: 'Les deux demandes préparées en parallèle pendant que nous présélectionnons les logements.' },
          { title: 'Semaine d’arrivée', text: 'Enregistrements, banque et assurance bouclés en quelques jours, avec nous à vos côtés.' },
          { title: 'Installation', text: 'Nous restons en ligne jusqu’à ce que le dernier carton soit vidé et le dernier compte opérationnel.' },
        ],
      },
      justification: {
        title: 'Pourquoi les couples le choisissent',
        text: [
          'Menée séparément, la relocation d’un couple représente deux dossiers d’immigration, une recherche de logement sur un marché qui se joue en jours, et un mois de rendez-vous aux heures de bureau que vous n’avez pas. Menée par nous, c’est un seul plan et une poignée de signatures.',
        ],
      },
      faq: {
        title: 'Les questions que posent les couples',
        items: [
          { q: 'Mon partenaire peut-il travailler aux Pays-Bas?', a: 'Avec la plupart des permis partenaire, oui, avec un accès libre au marché du travail. Nous confirmons votre situation exacte lors de la consultation.' },
          { q: 'Devons-nous être mariés?', a: 'Non. Les Pays-Bas reconnaissent les relations durables pour les voies partenaire ; nous vous conseillons sur les preuves qui rendent votre dossier convaincant.' },
          { q: 'En combien de temps pouvons-nous être enregistrés tous les deux?', a: 'Avec des documents préparés avant l’arrivée, les enregistrements essentiels sont généralement bouclés durant votre première semaine.' },
        ],
      },
      cta: {
        title: 'Planifiez votre arrivée à deux',
        text: 'Donnez-nous vos dates et nous vous dirons exactement ce qui est possible.',
        label: 'Lancer votre demande VIP',
      },
      image: '/images/vip-couple.jpg?v=20260728',
      imageAlt: 'Couple sur la terrasse d’un penthouse dominant Rotterdam au crépuscule',
    },
    {
      slug: 'family-relocation-immigration-services-netherlands',
      name: 'Forfait VIP Famille',
      tagline: 'Toute la famille, posée en douceur.',
      metaTitle: 'Relocation & immigration Famille Pays-Bas | E & I',
      metaDescription:
        'Forfait de relocation familiale pour les Pays-Bas : immigration pour chaque membre de la famille, logement, recherche d’école, santé, enregistrements et découverte du quartier, avec un accompagnement personnel.',
      investment: 'Sur mesure',
      badge: 'Le plus choisi',
      intro: [
        'Une relocation familiale n’est pas la version agrandie d’une relocation individuelle, c’est une autre discipline. Des années scolaires qui commencent à dates fixes, un logement qui doit convenir à tous, quatre dossiers à l’IND au lieu d’un. Ce forfait existe parce que réussir cet enchaînement est ce que nous faisons de mieux.',
      ],
      included: {
        title: 'Ce qui est inclus',
        items: [
          { title: 'Immigration familiale', text: 'Le permis de chaque membre de la famille préparé et déposé comme une seule demande coordonnée.' },
          { title: 'Aide au logement', text: 'Un logement à taille familiale près des bonnes écoles, trouvé et négocié.' },
          { title: 'Recherche d’école', text: 'Écoles internationales et néerlandaises comparées, visites organisées, inscriptions gérées avant la clôture des listes d’attente.' },
          { title: 'Enregistrement BSN familial', text: 'Une seule visite en municipalité pour tout le foyer, préparée et accompagnée.' },
          { title: 'Parcours santé', text: 'Une assurance pour chaque membre, un médecin de famille et un dentiste qui acceptent de nouveaux patients.' },
          { title: 'Rendez-vous en municipalité', text: 'Planifiés autour des horaires d’école et de votre journée de travail.' },
          { title: 'Accompagnement à l’installation', text: 'Des contrats d’énergie aux clubs de sport, toute l’infrastructure de la vie de famille mise en place.' },
          { title: 'Découverte du quartier', text: 'Une introduction guidée à votre quartier : trajets, aires de jeux, supermarchés, vie du week-end.' },
          { title: 'Assistance WhatsApp', text: 'Une seule ligne pour les deux parents, à toute heure.' },
        ],
      },
      forWho: {
        title: 'Conçu pour',
        items: [
          'Les familles mutées à Rotterdam ou dans la région portuaire',
          'Les parents pour qui l’école doit être réglée avant tout le reste',
          'Les foyers arrivant en regroupement familial aux côtés d’un permis de travail',
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          { title: 'Consultation', text: 'Nous cartographions la famille : âges, écoles, voies de visa, dates. Vous recevez un devis fixe unique.' },
          { title: 'Les écoles d’abord', text: 'Les inscriptions commencent immédiatement, car les places scolaires dictent le calendrier de tout le reste.' },
          { title: 'Logement et permis', text: 'La recherche de logement et les démarches d’immigration avancent en parallèle.' },
          { title: 'Arrivée', text: 'Les enregistrements bouclés en une visite, la découverte du quartier vécue en famille, et nous restons joignables.' },
        ],
      },
      justification: {
        title: 'Pourquoi les familles le choisissent',
        text: [
          'Le coût d’un forfait familial se mesure à une autre aune : celle d’une année scolaire manquée, d’une location perdue au profit d’un candidat plus rapide, ou d’un parent qui passe ses trois premiers mois dans des files d’attente plutôt qu’au travail et à la maison. Les familles nous disent que le forfait s’est amorti dès les quinze premiers jours.',
        ],
      },
      faq: {
        title: 'Les questions que posent les familles',
        items: [
          { q: 'Pouvez-vous obtenir une place pour nos enfants dans une école internationale?', a: 'Nous ne pouvons pas créer des places qui n’existent pas, mais nous savons quelles écoles en ont, comment leurs listes fonctionnent réellement, et comment présenter une candidature qui avance vite.' },
          { q: 'Nos enfants ont-ils besoin de leur propre permis?', a: 'Oui, chaque enfant a besoin d’un titre de séjour. Nous les préparons avec les vôtres pour que la famille soit approuvée comme un tout.' },
          { q: 'Combien de temps avant que la famille se sente installée?', a: 'Les formalités prennent quelques jours une fois préparées. Le sentiment prend une saison, et notre accompagnement à l’installation couvre précisément cette période.' },
        ],
      },
      cta: {
        title: 'Offrez à votre famille un atterrissage en douceur',
        text: 'Parlez-nous de votre foyer et de vos dates. Nous concevrons l’arrivée autour de l’année scolaire.',
        label: 'Lancer votre demande VIP',
      },
      image: '/images/vip-family.jpg?v=20260731',
      imageAlt: 'Famille arrivant dans une villa néerlandaise dans la lumière du soir',
    },
    {
      slug: 'business-relocation-immigration-services-netherlands',
      name: 'Forfait VIP Entreprise',
      tagline: 'Fonder, immatriculer, vivre. Dans cet ordre, vite.',
      metaTitle: 'Relocation & immigration Entreprise Pays-Bas | E & I',
      metaDescription:
        'Forfait de relocation entreprise pour les Pays-Bas : visa start-up ou DAFT, création de société et immatriculation KvK, logement et installation pour fondateurs et dirigeants, en un seul plan.',
      investment: 'Sur mesure',
      intro: [
        'Les fondateurs et dirigeants qui s’installent aux Pays-Bas affrontent deux bureaucraties à la fois : celle de l’entreprise et celle de la vie autour. Ce forfait mène les deux chantiers de front, pour que la société soit opérationnelle pendant que son fondateur vit déjà bien, au lieu de faire la navette entre un hôtel et une file de guichets.',
      ],
      included: {
        title: 'Ce qui est inclus',
        items: [
          { title: 'Visa start-up', text: 'Mise en relation avec un facilitateur, alignement du business plan et dépôt pour la voie start-up néerlandaise.' },
          { title: 'Visa DAFT', text: 'Pour les citoyens américains : la voie du traité d’amitié américano-néerlandais (DAFT), préparée de bout en bout.' },
          { title: 'Création de société', text: 'Forme juridique, constitution et les décisions pratiques qui les relient.' },
          { title: 'Immatriculation KvK', text: 'L’enregistrement à la Chambre de commerce réussi du premier coup.' },
          { title: 'Aide au logement', text: 'Un domicile ou un pied-à-terre adapté à votre base d’opérations.' },
          { title: 'Relocation d’entrepreneur', text: 'Le volet personnel du déménagement séquencé sur le calendrier de l’entreprise.' },
          { title: 'Enregistrement BSN', text: 'Rendez-vous en municipalité réservé et accompagné.' },
          { title: 'Accompagnement à l’installation', text: 'Banque, assurances et infrastructure quotidienne pour vous et votre famille.' },
          { title: 'Conseil à la création', text: 'Des introductions auprès de comptables, notaires et du réseau local dont vous aurez réellement besoin.' },
        ],
      },
      forWho: {
        title: 'Conçu pour',
        items: [
          'Les fondateurs entrant avec le visa start-up ou le traité DAFT',
          'Les dirigeants qui s’installent tout en créant une entité néerlandaise',
          'Les entreprises qui déplacent des personnes clés avec leurs familles',
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          { title: 'Consultation', text: 'Les projets de l’entreprise et la situation personnelle sur une même table. Vous recevez un devis fixe et une feuille de route.' },
          { title: 'Deux chantiers', text: 'Visa et création de société avancent en parallèle, chacun débloquant l’autre au bon moment.' },
          { title: 'Atterrissage', text: 'KvK, BSN, banque et logement bouclés en une semaine d’arrivée condensée.' },
          { title: 'En activité', text: 'Vous dirigez l’entreprise. Nous restons en ligne pour régler tout ce qui surgit.' },
        ],
      },
      justification: {
        title: 'Pourquoi les fondateurs le choisissent',
        text: [
          'Personne d’autre sur le marché ne réunit le visa, la constitution, le logement et la famille dans une seule mission. Assembler cela auprès de quatre prestataires distincts coûte plus cher, prend plus de temps et fait de vous le chef de projet. Ici, le chef de projet est inclus.',
        ],
      },
      faq: {
        title: 'Les questions que posent les fondateurs',
        items: [
          { q: 'Visa start-up ou DAFT, lequel me correspond?', a: 'Le DAFT est réservé aux citoyens américains et exige un investissement modeste ; le visa start-up requiert un facilitateur agréé. Nous évaluons les deux au regard de vos projets dès la première conversation.' },
          { q: 'Puis-je immatriculer une société avant d’avoir une adresse?', a: 'L’ordre entre adresse, BSN et KvK est exactement le genre de piège de séquencement que nous existons pour résoudre. Nous organisons les étapes pour que rien ne bloque.' },
          { q: 'Travaillez-vous avec des équipes en mobilité?', a: 'Oui. Pour les relocations corporate de plusieurs collaborateurs et leurs familles, nous bâtissons un programme combiné ; interrogez-nous sur nos conditions entreprises.' },
        ],
      },
      cta: {
        title: 'Déplacez le fondateur, pas seulement l’entreprise',
        text: 'Confiez-nous vos projets et votre fenêtre. Nous reviendrons avec une feuille de route et un devis fixe.',
        label: 'Lancer votre demande VIP',
      },
      image: '/images/vip-business.jpg?v=20260731',
      imageAlt: 'Dirigeant travaillant à l’arrière d’une voiture avec chauffeur',
    },
    {
      slug: 'vip-relocation-concierge',
      name: 'Conciergerie Relocation VIP',
      tagline: 'Pour les vies qui ne s’arrêtent pas pour déménager.',
      metaTitle: 'Conciergerie Relocation VIP Pays-Bas | E & I',
      metaDescription:
        'Relocation en conciergerie complète vers les Pays-Bas pour artistes, athlètes et dirigeants : une visite préparée, tous les rendez-vous alignés, journées avec chauffeur et assistance personnelle 24/7.',
      investment: 'Sur mesure',
      intro: [
        'Un artiste entre deux dates de tournée. Un athlète recruté en pleine saison. Un dirigeant dont l’agenda est planifié jusqu’à l’année prochaine. Le niveau conciergerie condense une relocation dans le temps dont vous disposez réellement, parfois un seul week-end, et prend en charge tout ce qui peut l’être sans vous.',
        'Vous nous donnez les dates où vous pouvez être aux Pays-Bas. Nous chorégraphions le reste autour.',
      ],
      included: {
        title: 'Ce qui est inclus',
        items: [
          { title: 'Une visite préparée', text: 'Chaque rendez-vous exigeant légalement votre présence, aligné sur un seul déplacement : IND, municipalité, banque, visites de logements.' },
          { title: 'Le logement avant l’atterrissage', text: 'Une sélection soignée visitée d’abord en vidéo, pour que votre venue confirme au lieu de chercher.' },
          { title: 'Journées avec chauffeur', text: 'Prise en charge à l’aéroport et un chauffeur pour toute la durée de votre visite.' },
          { title: 'L’immigration, gérée en silence', text: 'Demandes préparées, déposées et relancées pendant que vous êtes ailleurs.' },
          { title: 'La famille incluse', text: 'Partenaires, enfants, écoles et personnel de maison pris en charge si nécessaire.' },
          { title: 'Discrétion', text: 'Une manière de travailler héritée du monde des ambassades. Votre déménagement reste votre affaire.' },
          { title: 'Ligne 24/7', text: 'Johanna, en direct, quel que soit votre fuseau horaire.' },
        ],
      },
      forWho: {
        title: 'Conçu pour',
        items: [
          'Les artistes et interprètes qui s’installent entre tournées et productions',
          'Les athlètes et leurs staffs qui déménagent en pleine saison',
          'Les dirigeants et personnalités publiques qui exigent vitesse et discrétion à parts égales',
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          { title: 'Une conversation confidentielle', text: 'Votre situation, vos contraintes, vos dates. Nous concevons la visite et la chiffrons à prix fixe.' },
          { title: 'Tout est préparé', text: 'Documents, dépôts, sélections et rendez-vous organisés pendant que vous poursuivez votre vie.' },
          { title: 'La visite', text: 'Un séjour chorégraphié, généralement deux à trois jours, avec un chauffeur et Johanna en continu.' },
          { title: 'Le suivi', text: 'Nous achevons le reste, réceptionnons les clés lorsque c’est permis, et restons disponibles quand vous arrivez pour de bon.' },
        ],
      },
      justification: {
        title: 'Pourquoi ce prix',
        text: [
          'Ce niveau atteint 10 000 € pour les relocations les plus condensées, et son prix repose sur une vérité simple : votre temps est la ressource la plus rare du déménagement. Chaque heure que nous retirons de votre côté de la table est une heure sur scène, sur le terrain ou en conseil d’administration. C’est là l’échange.',
        ],
      },
      faq: {
        title: 'Les questions que posent les clients',
        items: [
          { q: 'Tout peut-il vraiment se faire en une seule visite?', a: 'Presque tout. La loi néerlandaise exige votre présence physique pour un petit nombre de rendez-vous ; nous regroupons précisément ceux-là dans votre visite et absorbons le reste.' },
          { q: 'À quel point le processus est-il discret?', a: 'Totalement. Pas de liste de clients, pas d’études de cas nominatives, et lorsque c’est utile, nous travaillons via votre management ou votre family office.' },
          { q: 'Et si mes dates changent?', a: 'Les plannings bâtis autour d’artistes et d’athlètes sont faits pour être rebâtis. Nous rechorégraphions et maintenons les dossiers en mouvement.' },
        ],
      },
      cta: {
        title: 'Donnez-nous votre fenêtre',
        text: 'Indiquez-nous les dates dont vous disposez. Nous vous montrerons ce qui peut se passer à l’intérieur.',
        label: 'Lancer une demande discrète',
      },
      image: '/images/vip-concierge.jpg?v=20260728',
      imageAlt: 'Jet privé et voiture qui attend à l’aube',
    },
  ],
  cta: {
    title: 'Vous hésitez entre les forfaits?',
    text: 'Une conversation suffit à concevoir le bon. Chaque forfait commence par la même étape, une consultation personnelle.',
    label: 'Réserver une consultation de relocation',
  },
};
