import type { SectionContent } from '../types';

export const relocation: SectionContent = {
  title: 'Services de relocation Pays-Bas',
  metaTitle: 'Services de relocation Pays-Bas | E & I Expat Services',
  metaDescription:
    'Services de relocation boutique aux Pays-Bas. Un guide personnel pour votre BSN, l’inscription communale, l’assurance santé, les écoles et l’installation, qui vous accompagne à chaque rendez-vous.',
  eyebrow: 'Relocation',
  intro: [
    'Changer de pays, ce sont mille petites tâches déguisées en une seule grande. Le BSN, la commune, l’assurance, l’école, la banque, chacun avec son guichet, ses formulaires et sa propre idée d’un délai raisonnable. La plupart des agences vous tendent une check-list. Nous sommes la seule agence boutique pour expatriés aux Pays-Bas, et nous faisons autre chose : une personne apprend votre nom, votre famille et votre situation, puis s’en occupe, tout simplement.',
    'Cette personne ne pilote pas votre relocation depuis un bureau. Elle prend les rendez-vous, prépare les documents, vous conduit à la commune et s’assied à vos côtés au guichet. Du moment où vous atterrissez jusqu’au moment où les Pays-Bas deviennent chez vous, vous avez ici quelqu’un qui connaît déjà la réponse à votre prochaine question.',
  ],
  image: '/images/relocation-family.jpg',
  imageAlt: 'Une famille arrivant dans sa nouvelle maison aux Pays-Bas',
  services: [
    {
      slug: 'bsn-registration-netherlands',
      menuLabel: 'Enregistrement BSN',
      title: 'Enregistrement BSN Pays-Bas',
      metaTitle: 'Enregistrement BSN Pays-Bas | E & I Expat Services',
      metaDescription:
        'Obtenez votre BSN vite et bien. Nous préparons vos documents, réservons le rendez-vous et vous accompagnons au guichet de la commune.',
      eyebrow: 'BSN',
      intro: [
        'Le BSN, votre numéro de service citoyen néerlandais, est la clé qui déverrouille tout le reste ici : votre salaire, votre assurance santé, votre compte bancaire, jusqu’à votre abonnement téléphonique. Tant que vous ne l’avez pas, vous êtes officiellement dans les limbes. C’est pourquoi il doit être la toute première chose réglée après votre arrivée, et réglée correctement du premier coup.',
        'Nous préparons le rendez-vous, vérifions que vos actes de naissance et apostilles seront acceptés, et Johanna vous accompagne en personne au guichet. Si l’agent soulève une question sur un document étranger, vous avez à vos côtés quelqu’un qui a entendu cette question cent fois et en connaît la réponse.',
      ],
      cardText: 'Votre numéro de service citoyen obtenu vite, avec nous à vos côtés au guichet.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Nouveaux arrivants qui ont besoin d’un BSN avant le versement de leur premier salaire',
          'Familles enregistrant plusieurs membres, enfants compris, en une seule visite',
          'Expatriés dont les documents étrangers exigent apostilles ou traductions assermentées',
          'Tous ceux qui ont tenté de réserver un rendez-vous et se sont heurtés à un mur de délais',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Vérification des documents avant votre vol',
            text: 'Nous examinons à l’avance vos actes de naissance, votre acte de mariage et vos légalisations, pour que rien ne soit rejeté au guichet.',
          },
          {
            title: 'Stratégie de rendez-vous',
            text: 'Nous savons quelles communes et quels guichets expatriés ont les délais les plus courts et réservons le créneau réaliste le plus tôt pour votre situation.',
          },
          {
            title: 'Accompagnement personnel',
            text: 'Nous assistons au rendez-vous avec vous, traduisons si nécessaire et résolvons les questions sur place.',
          },
          {
            title: 'Après le rendez-vous',
            text: 'Nous suivons la confirmation, vous expliquons votre extrait d’inscription et veillons à ce que votre BSN parvienne correctement à votre employeur et à votre assureur.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Examen des documents',
            text: 'Envoyez-nous les scans de vos documents d’état civil et nous vous dirons exactement ce qui exige une apostille ou une traduction.',
          },
          {
            title: 'Rendez-vous réservé',
            text: 'Nous planifions votre inscription au meilleur guichet disponible pour votre adresse et votre calendrier.',
          },
          {
            title: 'Jour de l’inscription',
            text: 'Nous y allons ensemble, finalisons l’inscription et repartons avec tout confirmé.',
          },
        ],
      },
      note: 'Un BSN est délivré via l’inscription au registre des personnes, soit comme résident, soit, pour les courts séjours, comme non-résident via un guichet RNI. Nous vous conseillons la voie adaptée à votre situation lors de l’entretien.',
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'En combien de temps puis-je obtenir un BSN après mon arrivée ?',
            a: 'Avec des documents préparés à l’avance, souvent en quelques jours ; le numéro est généralement délivré au rendez-vous ou peu après. Les vrais retards viennent des apostilles manquantes et des files d’attente, précisément ce que nous éliminons.',
          },
          {
            q: 'Faut-il une adresse permanente pour obtenir un BSN ?',
            a: 'Il vous faut une adresse enregistrable, qui peut être temporaire si le prestataire autorise l’inscription. Si vous n’en avez pas encore, nous étudions la voie RNI ou organisons un logement de courte durée où l’inscription est permise.',
          },
          {
            q: 'Toute ma famille peut-elle être enregistrée en une fois ?',
            a: 'Oui, et cela en vaut la peine. Nous réservons un rendez-vous familial, préparons chaque acte à l’avance et veillons à ce que les enfants soient correctement enregistrés, ce qui compte plus tard pour l’inscription scolaire et les soins.',
          },
        ],
      },
      cta: {
        title: 'Obtenez votre BSN sans parcours du combattant',
        text: 'Envoyez-nous votre date d’arrivée et nous aurons le rendez-vous, les documents et une place à vos côtés, prêts.',
        label: 'Organiser mon BSN',
      },
      form: 'relocation',
      image: '/images/immigration-desk.jpg',
      imageAlt: 'Un rendez-vous d’inscription au guichet d’une commune néerlandaise',
    },
    {
      slug: 'municipality-registration-netherlands',
      menuLabel: 'Inscription communale',
      title: 'Inscription communale Pays-Bas',
      metaTitle: 'Inscription communale Pays-Bas | E & I Expat Services',
      metaDescription:
        'Inscrivez-vous auprès de votre commune néerlandaise sans stress. Préparation des documents, prise de rendez-vous et accompagnement personnel dans les démarches auprès de la gemeente.',
      eyebrow: 'Gemeente',
      intro: [
        'Tout résident des Pays-Bas doit être inscrit auprès de sa gemeente, la commune, et cette inscription vous suit partout : impôts, allocations, vote, permis de stationnement, places d’école. Une erreur, ou une inscription non mise à jour après un déménagement, et de petites anomalies administratives grandissent en silence jusqu’à devenir de vrais problèmes.',
        'Nous gérons toute la relation avec votre commune. Première inscription à l’arrivée, réinscription lors d’un déménagement aux Pays-Bas, radiation si vous partez, et corrections quand le registre ne correspond pas à la réalité. Des années de travail aux côtés des ambassades et consulats nous ont appris comment pense l’administration néerlandaise, et nous mettons cette aisance au service de votre guichet local.',
      ],
      cardText: 'Première inscription, déménagements et corrections à la gemeente, tout pris en charge pour vous.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Nouveaux venus effectuant leur première inscription au registre des personnes',
          'Expatriés changeant de ville néerlandaise qui doivent se réinscrire',
          'Résidents dont le registre communal contient des erreurs à répétition',
          'Expatriés sur le départ qui ont besoin d’une radiation propre',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Le bon guichet, la bonne voie',
            text: 'Les communes diffèrent plus qu’on ne l’imagine. Nous déterminons où et comment votre dossier doit être déposé, y compris les options de centre pour expatriés.',
          },
          {
            title: 'Dossier documentaire complet',
            text: 'Justificatif d’adresse, pièces d’identité, autorisation du bailleur et actes étrangers compilés et vérifiés avant le rendez-vous.',
          },
          {
            title: 'Rendez-vous et présence',
            text: 'Nous réservons le créneau, vous expliquons ce qui va se passer et venons avec vous pour traduire et débloquer.',
          },
          {
            title: 'Vérification du registre',
            text: 'Ensuite, nous contrôlons votre extrait du registre, car une coquille dans votre nom ou votre adresse aujourd’hui, c’est un crédit immobilier refusé demain.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Point de situation',
            text: 'Arrivée, déménagement ou correction ? Nous cadrons votre cas et les documents que votre gemeente demandera.',
          },
          {
            title: 'Dossier et rendez-vous',
            text: 'Nous constituons le dossier et décrochons le premier rendez-vous exploitable.',
          },
          {
            title: 'Inscrit et vérifié',
            text: 'Nous finalisons l’inscription ensemble et confirmons que le registre indique exactement ce qu’il doit.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Et si mon propriétaire n’a pas donné son autorisation pour l’inscription ?',
            a: 'Vous avez le droit de vous inscrire là où vous vivez réellement, et un propriétaire ne peut pas légalement l’interdire. Nous approchons d’abord le propriétaire pour régler cela à l’amiable, et si nécessaire nous vous guidons dans la procédure d’enquête d’adresse de la commune.',
          },
          {
            q: 'J’ai déménagé à l’intérieur des Pays-Bas. Dois-je vraiment me réinscrire ?',
            a: 'Oui, dans les cinq jours suivant le déménagement, et ce n’est pas une formalité. Votre assureur santé, le fisc et votre employeur lisent tous ce registre. Nous déposons le changement en ligne ou au guichet et confirmons son traitement.',
          },
          {
            q: 'Mes enfants doivent-ils venir au rendez-vous ?',
            a: 'Pour une première inscription, les communes veulent généralement voir chaque membre de la famille en personne, enfants compris. Nous planifions un rendez-vous familial efficace pour que vous n’ayez pas à revenir trois fois.',
          },
        ],
      },
      cta: {
        title: 'Rendez la gemeente facile',
        text: 'Quoi que votre commune attende de vous, nous l’avons déjà fait. Décrivez-nous votre situation et considérez cela comme réglé.',
        label: 'Gérer mon inscription',
      },
      form: 'relocation',
      image: '/images/immigration-desk.jpg',
      imageAlt: 'Formalités remplies au guichet d’un service communal',
    },
    {
      slug: 'health-insurance-guidance-netherlands',
      menuLabel: 'Assurance santé',
      title: 'Assurance santé Pays-Bas',
      metaTitle: 'Assurance santé Pays-Bas | E & I Expat Services',
      metaDescription:
        'L’assurance santé néerlandaise expliquée et souscrite. Nous aidons les expatriés à choisir la bonne police, à s’inscrire chez un médecin généraliste et à éviter les amendes pour affiliation tardive.',
      eyebrow: 'Santé',
      intro: [
        'L’assurance santé néerlandaise est obligatoire, excellente et sincèrement déroutante. Vous devez souscrire une police de base dans les quatre mois suivant le début de votre obligation d’assurance, les primes et franchises varient de façon difficile à comparer de l’extérieur, et manquer le délai entraîne amendes et primes rétroactives. Pendant ce temps, le site de chaque assureur suppose que vous comprenez déjà le système.',
        'Nous l’expliquons en une conversation honnête : ce que le forfait de base couvre toujours, quand une assurance complémentaire vaut la peine pour votre famille, et comment la franchise fonctionne vraiment. Puis nous vous aidons à souscrire, à vous inscrire chez un médecin de famille et à savoir quoi faire la première fois que vous ou votre enfant tombez malade.',
      ],
      cardText: 'La bonne police de santé néerlandaise, choisie, souscrite et expliquée en toute clarté.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Nouveaux arrivants face au délai d’assurance de quatre mois',
          'Familles pesant une couverture complémentaire pour le dentaire, la kiné ou les besoins des enfants',
          'Expatriés qui ignorent si leur assurance étrangère ou d’employeur s’applique encore',
          'Tous ceux qui ont reçu une lettre du CAK sans savoir pourquoi',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Le système bien expliqué',
            text: 'Forfait de base, franchise, participations, allocation santé : toute la machine expliquée une fois, clairement, avec vos chiffres.',
          },
          {
            title: 'Comparaison des polices et souscription',
            text: 'Nous présélectionnons les polices adaptées à votre famille et à votre budget, expliquons honnêtement les arbitrages et vous guidons dans la souscription.',
          },
          {
            title: 'Inscription chez le généraliste et en pharmacie',
            text: 'Nous trouvons un huisarts qui accepte de nouveaux patients près de chez vous, organisons votre inscription et expliquons le fonctionnement des orientations vers les spécialistes.',
          },
          {
            title: 'Vérification de l’allocation',
            text: 'Si vos revenus ouvrent droit à la zorgtoeslag, l’allocation santé mensuelle, nous vous aidons à la demander.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Conversation couverture',
            text: 'Nous évaluons votre famille, vos besoins de santé et votre date de début, et vérifions ce que votre employeur fournit déjà.',
          },
          {
            title: 'Choisir et souscrire',
            text: 'Vous choisissez dans une sélection claire et nous finalisons la souscription avec votre BSN.',
          },
          {
            title: 'Réseau de soins en place',
            text: 'Généraliste, dentiste et pharmacie enregistrés, pour que votre premier jour de maladie soit un désagrément, pas une crise.',
          },
        ],
      },
      note: 'L’assurance prend effet rétroactivement à la date où votre obligation a commencé : les primes sont donc dues à partir de cette date même si vous souscrivez plus tard. Souscrire rapidement ne coûte rien de plus et évite les amendes.',
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'J’ai une assurance voyage ou internationale. Est-ce suffisant ?',
            a: 'En général, non. Dès lors que vous vivez ou travaillez ici et relevez du système néerlandais, la police de base néerlandaise est légalement obligatoire, quelle que soit votre autre couverture. Nous vérifions votre situation précise, y compris les exceptions pour certains détachements et étudiants.',
          },
          {
            q: 'Pourquoi ai-je besoin d’un généraliste avant même d’être malade ?',
            a: 'Le huisarts est la porte d’entrée de tous les soins néerlandais ; les hôpitaux attendent une orientation. Les cabinets proches de chez vous peuvent avoir des listes fermées, alors s’inscrire tôt, en bonne santé, est la meilleure décision de santé qu’un nouveau venu puisse prendre.',
          },
          {
            q: 'Que se passe-t-il si une question de santé survient en dehors des horaires de bureau ?',
            a: 'Les Pays-Bas disposent d’un service de garde, la huisartsenpost, pour les cas urgents. Et nos clients peuvent toujours nous écrire sur la ligne WhatsApp personnelle à toute heure ; nous avons accompagné plus d’un parent inquiet à travers sa première fièvre nocturne néerlandaise.',
          },
        ],
      },
      cta: {
        title: 'Assurez-vous avant que le délai ne s’en mêle',
        text: 'Une conversation, et votre couverture santé néerlandaise est choisie, souscrite et prête à l’emploi.',
        label: 'Régler mon assurance',
      },
      form: 'relocation',
      image: '/images/relocation-settling.jpg',
      imageAlt: 'Un nouvel arrivant examinant les options d’assurance santé néerlandaises avec une accompagnatrice',
    },
    {
      slug: 'school-search-netherlands',
      menuLabel: 'Recherche d’école',
      title: 'Recherche d’école Pays-Bas',
      metaTitle: 'Recherche d’école Pays-Bas | E & I Expat Services',
      metaDescription:
        'Trouvez la bonne école néerlandaise, internationale ou bilingue pour vos enfants. Sélections d’écoles, visites et accompagnement à l’inscription pour les familles expatriées.',
      eyebrow: 'Écoles',
      intro: [
        'Demandez à des parents en pleine relocation ce qui les empêche de dormir : c’est rarement le visa. C’est l’école. Internationale ou néerlandaise ? Bilingue ? Combien durent les listes d’attente, et qu’advient-il d’une enfant de neuf ans qui ne parle pas un mot de néerlandais son premier lundi ? Ces questions méritent mieux qu’un fil de forum.',
        'Nous vous guidons à travers le paysage réel : écoles internationales, écoles néerlandaises avec classes d’accueil, programmes bilingues et la réalité des listes d’attente de chacune. Nous présélectionnons les écoles qui conviennent à votre enfant, organisons les visites et vous y accompagnons, puis pilotons le dossier d’inscription jusqu’à une place confirmée.',
      ],
      cardText: 'La bonne école pour votre enfant, de la présélection à l’inscription confirmée.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Familles hésitant entre enseignement international et néerlandais',
          'Parents d’enfants qui arriveront sans parler néerlandais',
          'Expatriés dont la durée d’affectation complique le choix de l’école',
          'Familles déménageant en cours d’année scolaire, inquiètes pour le placement',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Briefing sur le paysage éducatif',
            text: 'Comment fonctionne le système néerlandais, combien coûtent les écoles internationales, comment les classes d’accueil comblent l’écart linguistique et ce qui convient à la durée de votre affectation.',
          },
          {
            title: 'Sélection d’écoles personnalisée',
            text: 'Des écoles choisies pour l’âge, les langues et les besoins de votre enfant, en cohérence avec votre futur lieu de vie, avec des notes honnêtes sur chacune.',
          },
          {
            title: 'Visites organisées et accompagnées',
            text: 'Nous réservons les visites, préparons les questions qui valent la peine d’être posées et vous accompagnons sur place.',
          },
          {
            title: 'De l’inscription à la confirmation',
            text: 'Formulaires, dossiers scolaires antérieurs et relances de liste d’attente gérés jusqu’à ce que votre enfant ait une place confirmée.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Entretien familial',
            text: 'Nous parlons de vos enfants, de leurs langues, de leurs besoins et de vos projets aux Pays-Bas.',
          },
          {
            title: 'Présélectionner et visiter',
            text: 'Vous recevez une sélection ciblée et nous visitons ensemble les écoles prometteuses.',
          },
          {
            title: 'Inscrire et démarrer',
            text: 'Nous finalisons l’inscription et aidons votre enfant à arriver dans une école qui l’attend.',
          },
        ],
      },
      note: 'Le choix de l’école et le choix du logement sont une seule décision, pas deux : l’adresse détermine les options. Si nous menons aussi votre recherche de logement, nous les planifions ensemble.',
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Faut-il choisir l’enseignement international ou néerlandais ?',
            a: 'Pour les affectations de moins de trois ans environ, les écoles internationales offrent la continuité. Pour les familles qui restent plus longtemps, les écoles néerlandaises avec programme d’accueil intègrent souvent les enfants plus vite et coûtent bien moins cher. Nous vous aidons à décider selon vos projets, pas selon une règle générale.',
          },
          {
            q: 'Mon enfant ne parle pas néerlandais. Comment les écoles néerlandaises gèrent-elles cela ?',
            a: 'De nombreuses régions disposent de classes d’accueil dédiées où les enfants reçoivent un néerlandais intensif pendant environ un an avant de rejoindre les classes ordinaires. Le placement dépend de l’âge et de la région, et nous trouvons les options réelles près de chez vous.',
          },
          {
            q: 'Les listes d’attente sont-elles vraiment si terribles ?',
            a: 'Cela varie énormément selon la ville et l’école. Des écoles internationales prisées peuvent afficher de longues listes quand une école tout aussi solide à côté a des places. Postuler tôt et au bon éventail d’écoles fait l’essentiel de la bataille, et c’est ce que nous pilotons.',
          },
        ],
      },
      cta: {
        title: 'Offrez à vos enfants un atterrissage en douceur',
        text: 'Parlez-nous de vos enfants et nous trouverons l’école où ils s’épanouiront, puis nous les y inscrirons.',
        label: 'Trouver notre école',
      },
      form: 'relocation',
      image: '/images/relocation-family.jpg',
      imageAlt: 'Parents et enfants visitant une école aux Pays-Bas',
    },
    {
      slug: 'settling-in-services-netherlands',
      menuLabel: 'Services d’installation',
      title: 'Services d’installation Pays-Bas',
      metaTitle: 'Services d’installation Pays-Bas | E & I Expat Services',
      metaDescription:
        'Accompagnement à l’installation pour expatriés aux Pays-Bas : banque, énergie, téléphone, transports, découverte du quartier et les cent petites choses qui font d’une maison une vie.',
      eyebrow: 'Installation',
      intro: [
        'Les formalités se terminent et les vraies questions commencent. Quelle banque ouvrira un compte cette semaine ? Pourquoi existe-t-il trois sortes de conteneurs à déchets ? Comment fonctionne le système du généraliste, où acheter un vélo qui ne sera pas volé d’ici vendredi, et qu’est-ce donc que l’eigen risico ? S’installer, ce sont cent petits casse-têtes, et les résoudre seul prend des mois.',
        'Nous comprimons ces mois en semaines. Banque, énergie, internet, téléphone, cartes de transport, bases de l’assurance et une vraie découverte de votre nouveau quartier, organisés avec vous et expliqués au fil de l’eau. Cet accompagnement personnel et concret est exactement ce qui fait dire à nos clients que nous sommes un concierge plutôt qu’une agence.',
      ],
      cardText: 'Banque, énergie, transports et le mode d’emploi du quartier, réglés en semaines, pas en mois.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Nouveaux arrivants qui veulent une vie pratique opérationnelle dès les premières semaines',
          'Professionnels occupés sans temps pour comparer les prestataires néerlandais',
          'Partenaires et familles qui atterrissent pendant que le conjoint est déjà au bureau',
          'Tous ceux qui ont déménagé il y a des mois et se sentent encore à moitié arrivés',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'La banque en place',
            text: 'Aide au choix et à l’ouverture d’un compte bancaire néerlandais, plus la mise en place d’iDEAL et des applications de paiement dont la vie quotidienne dépend ici.',
          },
          {
            title: 'La maison connectée',
            text: 'Contrats d’énergie, d’eau, d’internet et de téléphone comparés, souscrits et calés sur votre date d’emménagement.',
          },
          {
            title: 'Se déplacer',
            text: 'Cartes de transport public OV, conseils pour acheter un vélo, permis de stationnement et, si vous conduisez, accompagnement sur votre permis et la possession d’une voiture aux Pays-Bas.',
          },
          {
            title: 'Découverte du quartier',
            text: 'Une visite personnelle de votre secteur : le marché, le bon supermarché, la pharmacie, les clubs de sport, les raccourcis qu’utilisent les habitants.',
          },
          {
            title: 'Les petites grandes choses',
            text: 'Calendriers de collecte des déchets, création du DigiD, assurance responsabilité civile, options de garde d’enfants : ces petits sujets dont personne ne parle jusqu’à ce qu’ils tournent mal.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Plan d’installation',
            text: 'Nous listons ce dont votre foyer a besoin, dans l’ordre qui débloque tout le reste.',
          },
          {
            title: 'Organiser ensemble',
            text: 'En quelques sessions, nous mettons en place comptes, contrats et cartes, en expliquant chacun pour que vous gardiez la main.',
          },
          {
            title: 'Journée d’orientation',
            text: 'Nous passons du temps ensemble dans votre quartier jusqu’à ce qu’il commence à devenir le vôtre.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Puis-je ouvrir un compte bancaire néerlandais avant d’avoir un BSN ?',
            a: 'Certaines banques l’autorisent et acceptent que vous fournissiez le BSN ensuite ; les politiques changent souvent. Nous connaissons l’état actuel des pratiques et vous orientons vers la voie la plus rapide pour que votre salaire ait où atterrir.',
          },
          {
            q: 'Qu’est-ce que DigiD et en ai-je vraiment besoin ?',
            a: 'DigiD est votre identité numérique auprès de l’État néerlandais : impôts, santé, allocations et services communaux l’utilisent tous. Vous en aurez constamment besoin, et nous le créons avec vous dès le début.',
          },
          {
            q: 'Nous sommes arrivés il y a des mois sans jamais vraiment nous installer. Est-ce encore pour nous ?',
            a: 'Absolument, et c’est plus courant que vous ne le pensez. Nous auditons ce qui manque ou a été mal configuré, corrigeons, et achevons l’atterrissage que vous n’avez jamais eu le temps de faire.',
          },
        ],
      },
      cta: {
        title: 'Sentez-vous chez vous plus vite',
        text: 'Donnez-nous quelques semaines et les Pays-Bas cessent d’être un pays étranger pour devenir l’endroit où vous vivez.',
        label: 'M’aider à m’installer',
      },
      form: 'relocation',
      image: '/images/relocation-settling.jpg',
      imageAlt: 'Un nouvel arrivant prenant ses repères dans son nouveau quartier néerlandais',
    },
    {
      slug: 'airport-pickup-for-expats-netherlands',
      menuLabel: 'Accueil à l’aéroport',
      title: 'Accueil à l’aéroport pour expatriés Pays-Bas',
      metaTitle: 'Accueil à l’aéroport pour expatriés Pays-Bas | E & I Expat Services',
      metaDescription:
        'Un accueil chaleureux à Schiphol ou à l’aéroport de Rotterdam : prise en charge personnelle, transfert vers votre nouveau logement et briefing du premier jour pour une relocation qui commence sereinement.',
      eyebrow: 'Arrivée',
      intro: [
        'Toute relocation a un instant zéro : les portes du hall des arrivées s’ouvrent et votre nouvelle vie commence avec le décalage horaire, les bagages et un pays que vous ne connaissez pas encore. La façon dont se passe cette première heure colore toute l’installation. Elle ne devrait pas consister à traîner des valises entre deux correspondances de train ou à expliquer une adresse à un chauffeur de taxi à minuit.',
        'Nous vous attendons dans le hall, pancarte à votre nom comprise, et vous conduisons droit à votre nouvelle porte. En chemin, vous recevez l’essentiel du premier jour : comment fonctionne la maison, où faire les courses demain, ce qui se passe cette semaine. Et parce que les vols atterrissent quand ils atterrissent, notre ligne WhatsApp vous accompagne en continu dès le décollage.',
      ],
      cardText: 'Accueilli aux arrivées, conduit chez vous et briefé pour votre premier matin néerlandais.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Familles atterrissant avec enfants, bagages et aucune énergie pour la logistique',
          'Primo-arrivants qui veulent un visage familier dans le hall des arrivées',
          'Professionnels atterrissant tard le soir ou sur des vols de week-end',
          'Employeurs qui veulent accueillir leur nouvelle recrue comme il se doit',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Suivi du vol',
            text: 'Nous surveillons votre vol : un retard ou une arrivée anticipée ne change rien à votre accueil.',
          },
          {
            title: 'Accueil personnel',
            text: 'Un contact familier vous attend dans le hall des arrivées à Schiphol, Rotterdam The Hague ou Eindhoven, prêt à aider avec les bagages et les enfants.',
          },
          {
            title: 'Transfert direct au logement',
            text: 'Un trajet confortable vers votre nouveau logement ou appartement temporaire, sièges enfants prévus si nécessaire.',
          },
          {
            title: 'Briefing du premier jour',
            text: 'Clés, chauffage, wifi et appareils expliqués, un plan pour les premières courses et une vision claire des rendez-vous de votre première semaine.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Partagez votre vol',
            text: 'Envoyez vos détails de vol et votre adresse ; nous confirmons le plan et restons joignables pendant votre voyage.',
          },
          {
            title: 'Atterrir et être accueilli',
            text: 'Vous sortez des arrivées et votre relocation vous attend déjà sur place.',
          },
          {
            title: 'Arriver chez soi',
            text: 'Vous vous endormez dans un logement qui fonctionne, en sachant exactement à quoi ressemble demain.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Et si mon vol atterrit à 2 heures du matin ?',
            a: 'Alors nous sommes dans le hall des arrivées à 2 heures du matin. Les arrivées n’ont pas d’horaires de bureau et nous non plus ; cette promesse est le cœur de notre façon de travailler.',
          },
          {
            q: 'Pouvez-vous gérer une famille avec beaucoup de bagages et un animal ?',
            a: 'Oui. Indiquez-nous à l’avance le nombre de personnes, le nombre de valises et la taille de la caisse de transport et nous prévoyons un véhicule qui avale tout, animal compris.',
          },
          {
            q: 'L’accueil est-il réservé aux clients d’un forfait relocation complet ?',
            a: 'Il se réserve seul, même si la plupart des clients le combinent avec l’accompagnement à l’installation pour que la première semaine se déroule aussi bien que la première heure. Le tarif pour votre situation est confirmé lors de l’entretien.',
          },
        ],
      },
      cta: {
        title: 'Commencez votre nouvelle vie accueilli, pas perdu',
        text: 'Envoyez-nous votre numéro de vol et le premier visage que vous verrez aux Pays-Bas sera un visage ami.',
        label: 'Réserver mon accueil',
      },
      form: 'relocation',
      image: '/images/relocation-arrival.jpg',
      imageAlt: 'Un accueil chaleureux dans le hall des arrivées de l’aéroport',
    },
    {
      slug: 'family-relocation-netherlands',
      menuLabel: 'Relocation familiale',
      title: 'Relocation familiale Pays-Bas',
      metaTitle: 'Relocation familiale Pays-Bas | E & I Expat Services',
      metaDescription:
        'Installez toute votre famille aux Pays-Bas avec un guide personnel unique : logement, écoles, inscriptions, santé et un atterrissage en douceur pour chaque membre de la famille.',
      eyebrow: 'Familles',
      intro: [
        'Déménager seul est un projet. Déménager une famille, ce sont cinq projets menés de front : un logement qui convient à tous, des écoles avec de vraies places, des inscriptions pour chaque passeport du foyer, des soins pour le bébé comme pour l’adolescent, et un partenaire dont la carrière et la vie sociale méritent mieux qu’une pensée après coup. Lâchez un fil et toute l’installation s’effiloche.',
        'Nous tenons tous les fils. Un guide planifie l’installation familiale entière comme un seul calendrier, séquence les rendez-vous pour que rien ne bloque rien, et veille au côté humain : comment les enfants atterrissent, comment le partenaire qui suit construit sa vie, comment la maison commence à ressembler à un foyer. Notre réputation en la matière s’est bâtie dans le monde des ambassades, où les affectations familiales sont la norme et l’échec n’est pas une option.',
      ],
      cardText: 'Un calendrier, un guide, et un atterrissage en douceur pour chaque membre de la famille.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Familles s’installant aux Pays-Bas pour un nouveau poste ou une affectation',
          'Parents jonglant entre échéances scolaires et échéances de logement',
          'Foyers aux nationalités mixtes et aux dossiers mixtes',
          'Partenaires qui suivent et veulent leur propre plan d’atterrissage, pas un reste',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Un plan directeur familial',
            text: 'Logement, écoles, inscriptions, assurance et arrivée séquencés en un seul calendrier, avec les dépendances traitées dans le bon ordre.',
          },
          {
            title: 'Logement et école en tandem',
            text: 'Nous menons la recherche de logement et la recherche d’école comme une seule décision, pour que vous ne gagniez jamais une maison en perdant la place à l’école.',
          },
          {
            title: 'Des inscriptions pour tous',
            text: 'BSN et inscription communale pour chaque membre de la famille, avec les actes et traductions des enfants préparés à l’avance.',
          },
          {
            title: 'La santé du foyer',
            text: 'Une assurance pour la famille, un généraliste qui accepte de nouveaux patients, et les soins pédiatriques et dentaires repérés avant que quiconque en ait besoin.',
          },
          {
            title: 'Intégration du partenaire et de la famille',
            text: 'Découverte du quartier, clubs, garde d’enfants, options linguistiques et les présentations qui transforment une nouvelle ville en communauté.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Entretien familial',
            text: 'Nous rencontrons toute la famille, en visio ou en personne, et intégrons les besoins de chacun dans un seul plan.',
          },
          {
            title: 'Préparer et sécuriser',
            text: 'Avant votre vol, le volet logement, le volet école et le volet administratif sont déjà en mouvement.',
          },
          {
            title: 'Atterrir ensemble',
            text: 'Arrivée, inscriptions et rentrées scolaires se déroulent comme prévu, avec nous à vos côtés à chaque étape.',
          },
          {
            title: 'S’installer et faire le point',
            text: 'Nous restons impliqués pendant les premiers mois, car les questions ne s’arrêtent pas à la porte d’entrée.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Combien de temps à l’avance une famille doit-elle commencer à planifier ?',
            a: 'Trois à six mois avant le départ, c’est confortable, surtout parce que les places d’école et les locations familiales sont les ressources les plus rares. Moins que cela reste faisable ; cela signifie simplement que nous priorisons plus fort dès le premier jour.',
          },
          {
            q: 'Pouvez-vous aussi gérer le volet visa d’une installation familiale ?',
            a: 'Oui. Le regroupement familial et les visas partenaire passent par nos services d’immigration, et coordonner les deux volets sous un même toit est précisément ce qui garde une installation familiale cohérente.',
          },
          {
            q: 'Et nos enfants qui ne sont pas encore en âge scolaire ?',
            a: 'Les crèches aux Pays-Bas ont souvent des listes d’attente plus longues que les écoles, alors nous traitons la garde d’enfants avec la même urgence : sélections, candidatures et une explication de l’allocation de garde à laquelle vous pouvez avoir droit.',
          },
        ],
      },
      cta: {
        title: 'Déménagez toute la famille en un appel',
        text: 'Dites-nous qui vient et quand, et nous bâtirons le plan qui fait arriver tout le monde, installé, scolarisé et souriant.',
        label: 'Planifier notre déménagement familial',
      },
      form: 'relocation',
      image: '/images/vip-family.jpg',
      imageAlt: 'Une famille s’installant avec bonheur dans sa vie aux Pays-Bas',
    },
    {
      slug: 'relocation-services-rotterdam',
      menuLabel: 'Relocation Rotterdam',
      title: 'Services de relocation Rotterdam',
      metaTitle: 'Services de relocation Rotterdam | E & I Expat Services',
      metaDescription:
        'Accompagnement complet de relocation à Rotterdam par une spécialiste locale : logement, inscriptions, écoles et installation, pour la ville et la région portuaire.',
      eyebrow: 'Rotterdam',
      intro: [
        'Rotterdam récompense ceux qui arrivent avec un local à leurs côtés. C’est une ville de travail, directe et rapide, au marché du logement qui s’est fortement tendu et à l’économie portuaire qui attire des professionnels de tous les continents. Les check-lists nationales de relocation ne vous mènent pas loin ici ; ce qui compte, c’est de connaître les guichets, les quartiers et les rythmes de cette ville.',
        'C’est notre terrain. Nous sommes le spécialiste de Rotterdam et de son corridor industriel, du centre-ville jusqu’à la Maasvlakte en passant par Europoort, et tout ce que nous organisons, logement, inscription à la gemeente de Rotterdam, écoles, santé, s’ancre dans cette profondeur locale. Vous recevez le service de relocation complet, réglé précisément sur cette ville.',
      ],
      cardText: 'Le service de relocation complet, réglé sur Rotterdam par des gens qui la vivent.',
      forWho: {
        title: 'À qui s’adresse ce service',
        items: [
          'Professionnels débutant dans des entreprises rotterdamoises, au port ou dans le cluster industriel',
          'Familles s’installant à Rotterdam et dans les communes environnantes',
          'Recrues internationales dont les employeurs veulent un atterrissage fluide et rapide',
          'Expatriés déjà aux Pays-Bas qui déménagent à Rotterdam',
        ],
      },
      included: {
        title: 'Ce qui est inclus',
        blocks: [
          {
            title: 'Accompagnement logement à Rotterdam',
            text: 'Une recherche fondée sur la connaissance des quartiers et sur des relations avec les agents locaux, visites et relecture du contrat comprises.',
          },
          {
            title: 'Inscriptions faites localement',
            text: 'BSN et inscription communale via les guichets rotterdamois avec lesquels nous travaillons chaque semaine, préparés pour qu’une seule visite suffise.',
          },
          {
            title: 'Écoles et garde d’enfants dans la région',
            text: 'Options d’écoles internationales et néerlandaises à travers Rotterdam et sa périphérie, en cohérence avec votre logement et votre trajet.',
          },
          {
            title: 'S’installer dans la ville',
            text: 'Banque, transports, santé et une découverte personnelle de votre quartier, des marchés à la Meuse.',
          },
        ],
      },
      process: {
        title: 'Comment cela se déroule',
        steps: [
          {
            title: 'Entretien Rotterdam',
            text: 'Nous projetons votre lieu de travail, votre famille et votre calendrier sur la ville que nous connaissons rue par rue.',
          },
          {
            title: 'Tout en mouvement',
            text: 'Logement, inscriptions et écoles avancent en parallèle, coordonnés par une seule personne.',
          },
          {
            title: 'Arrivé et installé',
            text: 'Vous êtes inscrit, logé et orienté, avec un numéro local à contacter dès qu’une question surgit.',
          },
        ],
      },
      faq: {
        title: 'Questions fréquentes',
        items: [
          {
            q: 'Couvrez-vous uniquement Rotterdam même ?',
            a: 'Nous couvrons toute la région : Schiedam, Vlaardingen, Capelle, Barendrecht, la Hoeksche Waard et le corridor portuaire jusqu’à Hoek van Holland. Souvent, le meilleur logement pour votre budget est dans la commune d’à côté, et nous vous le dirons.',
          },
          {
            q: 'Mon employeur est dans la zone portuaire. Où devrais-je vivre ?',
            a: 'Cela dépend de vos horaires et de votre tolérance à l’A15. Beaucoup de professionnels du port vivent en centre-ville et roulent à contre-courant ; d’autres préfèrent Voorne-Putten ou le Westland pour la proximité. Nous modélisons votre trajet réel avant votre choix.',
          },
          {
            q: 'Pouvez-vous travailler directement avec mon employeur ou son service RH ?',
            a: 'Volontiers. Nous coordonnons régulièrement avec les RH sur les dates d’entrée, les contrats et les formalités, et pouvons servir de point de contact unique pour que le salarié n’ait qu’à arriver et que tout fonctionne.',
          },
        ],
      },
      cta: {
        title: 'Arrivez à Rotterdam comme un local',
        text: 'Une conversation avec quelqu’un qui connaît cette ville, et votre installation cesse d’être un casse-tête.',
        label: 'Lancer mon installation à Rotterdam',
      },
      form: 'relocation',
      image: '/images/rotterdam.jpg',
      imageAlt: 'Centre-ville de Rotterdam et son architecture moderne le long de la Meuse',
    },
  ],
  crossLinks: [
    {
      label: 'Relocation Europoort',
      path: '/industrial-expat-services/europoort-relocation-services-netherlands',
      text: 'Vous vous installez pour travailler dans la zone industrielle d’Europoort ? Découvrez notre service dédié à la région portuaire.',
    },
  ],
  cta: {
    title: 'Un seul guide pour toute votre relocation',
    text: 'De votre BSN à l’école de vos enfants, une personne qui connaît votre nom s’occupe de tout, et vous accompagne à chaque étape.',
    label: 'Lancer ma relocation',
  },
};
