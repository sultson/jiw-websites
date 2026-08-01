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
  image: '/images/family-arrival.jpg?v=20260731',
  imageAlt: 'Famille internationale arrivant à sa maison sur un canal néerlandais',
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
      explainer: {
        title: 'Qu’est-ce qu’un BSN ?',
        text: [
          'Le BSN, burgerservicenummer, est votre numéro national néerlandais. C’est l’identifiant unique par lequel l’administration, votre employeur, votre banque, votre assureur et votre médecin vous reconnaissent, et presque rien dans la vie néerlandaise ne se met en route sans lui.',
          'Vous l’obtenez en vous inscrivant auprès d’une commune, et non par une demande distincte. C’est pourquoi l’inscription est la première tâche pratique après l’arrivée : sans ce numéro, aucun salaire ne peut être versé, aucune assurance maladie ne peut démarrer et l’ouverture d’un compte bancaire devient difficile.',
        ],
      },
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
      fees: {
        title: 'Honoraires pour l’obtention du BSN',
        kind: 'fixed',
        amount: 'Investissement à partir de 295 €',
        includes: [
          'Rendez-vous communal pris au bon guichet et au bon moment',
          'Exigences de documents, de légalisation et de traduction vérifiées à l’avance',
          'Accompagnement au rendez-vous, avec interprétation si nécessaire',
          'Suivi jusqu’à la délivrance effective du numéro',
        ],
      },
      note: 'Un BSN est délivré via l’inscription au registre des personnes, soit comme résident, soit, pour les courts séjours, comme non-résident via un guichet RNI. Nous vous conseillons la voie adaptée à votre situation lors de l’entretien.',
      conditions: {
        title: 'Ce que la commune demandera',
        intro:
          'Le BSN est la clé qui ouvre toutes les autres serrures. Presque tout retard que nous voyons vient de l\'un de ces six points.',
        items: [
          'L\'inscription se fait à la commune de votre adresse, et le bailleur doit autoriser l\'inscription à cette adresse.',
          'Un séjour de plus de quatre mois implique une inscription au BRP. Plus court signifie le registre RNI, dans l\'une des communes désignées.',
          'Apportez votre passeport, votre titre de séjour ou MVV le cas échéant, et votre bail.',
          'Les actes étrangers de naissance et de mariage doivent être légalisés ou porter une apostille, et être traduits par un traducteur assermenté.',
          'Les rendez-vous se prennent en général à l\'avance, et à Rotterdam le délai va de quelques jours à plusieurs semaines selon la saison.',
          'Chaque membre de la famille a besoin de son propre rendez-vous et de ses propres documents, enfants compris.',
        ],
      },
      details: {
        title: 'Là où les dossiers BSN déraillent',
        items: [
          {
            q: 'Pourquoi la légalisation pose-t-elle tant de problèmes ?',
            a:
              'Un acte non légalisé dans le pays d\'émission ne peut être accepté, et la chaîne passe souvent par un ministère local puis une ambassade néerlandaise. Cela prend des semaines ou des mois et ne peut plus être engagé une fois que vous êtes ici. C\'est la raison la plus fréquente d\'un enlisement à l\'arrivée, et la première chose que nous vérifions.',
          },
          {
            q: 'Puis-je obtenir un BSN sans adresse néerlandaise ?',
            a:
              'Oui, via le registre RNI des non-résidents, disponible dans dix-neuf communes désignées. Vous obtenez un BSN pour que la paie et la banque puissent démarrer, mais ce n\'est pas une inscription de résidence, et vous vous inscrirez normalement dès que vous aurez une adresse.',
          },
          {
            q: 'Que se passe-t-il juste après le rendez-vous ?',
            a:
              'Votre BSN est généralement délivré sur place ou en quelques jours. Il ouvre ensuite la demande de DigiD, l\'affiliation à l\'assurance maladie, l\'ouverture d\'un compte néerlandais et une paie correcte. Nous parcourons cette séquence avec vous plutôt que de vous laisser avec un numéro et une liste.',
          },
          {
            q: 'Venez-vous au rendez-vous avec moi ?',
            a:
              'Oui, c\'est le cœur de la prestation. Les rendez-vous se déroulent en néerlandais, les agents réclament des documents absents de la liste publiée, et avoir à ses côtés quelqu\'un qui connaît la réponse évite le second rendez-vous.',
          },
        ],
      },
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
      image: '/images/bsn-registration.jpg?v=20260731',
      image2: '/images/immigration-documents.jpg?v=20260731',
      image2Alt: 'Porte-documents en cuir et stylo plume sur un bureau',
      imageAlt: 'Conseillère et client autour d\'une table de conseil privée',
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
      explainer: {
        title: 'Qu’est-ce que l’inscription à la commune ?',
        text: [
          'L’inscription à la commune vous enregistre dans la Basisregistratie Personen, le BRP, le registre de la population néerlandaise. Il consigne qui vous êtes et où vous habitez, et c’est de lui que découle votre BSN. Tous les échelons de l’administration néerlandaise le consultent.',
          'C’est une obligation légale assortie d’un délai, non une formalité facultative. Vous vous inscrivez à la commune de l’adresse où vous résidez réellement, et vous avez besoin de l’accord du bailleur pour cette adresse. C’est précisément là que les inscriptions échouent le plus souvent.',
        ],
      },
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
      fees: {
        title: 'Honoraires pour l’inscription à la commune',
        kind: 'fixed',
        amount: 'Investissement à partir de 295 €',
        includes: [
          'Rendez-vous pris dans le délai légal de cinq jours',
          'Adresse et accord du bailleur vérifiés pour que l’inscription ne soit pas refusée',
          'Accompagnement à la commune le jour même',
          'Confirmation de l’exactitude de la fiche BRP une fois établie',
        ],
      },
      conditions: {
        title: 'Les règles qui piègent',
        intro:
          'Le registre communal vous suit dans toutes les institutions du pays, une erreur ici réapparaît donc partout.',
        items: [
          'La première inscription doit intervenir dans les cinq jours suivant l\'arrivée, et un déménagement aux Pays-Bas dans les cinq jours suivant le changement.',
          'Un changement d\'adresse se déclare à la nouvelle commune, pas à l\'ancienne.',
          'L\'inscription exige l\'accord du bailleur pour l\'adresse. S\'inscrire là où c\'est interdit met votre bail en danger.',
          'Votre état civil, l\'orthographe de votre nom et votre lieu de naissance sont repris d\'actes légalisés, et les corriger ensuite est bien plus difficile que de les saisir correctement une fois.',
          'Quitter les Pays-Bas plus de huit mois par an impose une radiation, qui touche l\'assurance, les allocations et les titres de séjour.',
          'Les ressortissants hors UE retirent normalement leur document de séjour auprès de l\'IND, pas de la commune. Ce sont deux rendez-vous distincts.',
        ],
      },
      details: {
        title: 'Obtenir un registre exact',
        items: [
          {
            q: 'Pourquoi l\'orthographe de mon nom compte-t-elle autant ?',
            a:
              'Le registre BRP alimente votre banque, votre employeur, le fisc, votre assureur et l\'IND. Une translittération qui diffère d\'une lettre de votre passeport produit des incohérences qui ressurgissent des mois plus tard au pire moment. Nous vérifions la saisie contre votre passeport avant que l\'agent n\'enregistre.',
          },
          {
            q: 'Pouvez-vous corriger une inscription déjà erronée ?',
            a:
              'Généralement oui, avec les pièces justificatives adéquates et une demande formelle de rectification. Les erreurs de date de naissance, d\'état civil et de nationalité antérieure sont celles que nous réparons le plus, et elles méritent d\'être réparées plutôt que subies.',
          },
          {
            q: 'Et si mon bailleur refuse l\'inscription ?',
            a:
              'Alors l\'adresse est un problème et non un désagrément. Nous vérifions la possibilité d\'inscription avant que vous ne signiez, et si un bailleur refuse après coup, nous reprenons la correspondance, car dans la plupart des situations résidentielles ce refus n\'a aucun fondement juridique.',
          },
          {
            q: 'Dois-je me radier en partant ?',
            a:
              'Oui, si vous partez plus de huit mois sur douze. Ne pas se radier vous laisse redevable des cotisations d\'assurance maladie néerlandaises et des taxes locales longtemps après votre départ. Nous encadrons le départ avec autant de soin que l\'arrivée.',
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
      image: '/images/municipality-registration.jpg?v=20260731',
      image2: '/images/consultation.jpg?v=20260731',
      image2Alt: 'Conseillère et client évoquant les prochaines étapes',
      imageAlt: 'Cliente arrivant devant un bâtiment municipal néerlandais historique',
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
      fees: {
        title: 'Honoraires pour un conseil en assurance maladie',
        kind: 'fixed',
        amount: 'Investissement à partir de 195 €',
        includes: [
          'La police néerlandaise adaptée à votre situation et à votre foyer identifiée',
          'Souscription complétée et déposée avec vous',
          'Date d’effet alignée sur votre arrivée pour ne jamais rester sans couverture',
          'Conseil sur la franchise, l’allocation santé et le choix d’un médecin traitant',
        ],
      },
      note: 'L’assurance prend effet rétroactivement à la date où votre obligation a commencé : les primes sont donc dues à partir de cette date même si vous souscrivez plus tard. Souscrire rapidement ne coûte rien de plus et évite les amendes.',
      conditions: {
        title: 'Comment fonctionne le système néerlandais',
        intro:
          'L\'assurance maladie néerlandaise est obligatoire, privée et encadrée par des délais. Se tromper de calendrier coûte cher d\'une manière qui surprend la plupart des arrivants.',
        items: [
          'Toute personne qui réside ou travaille aux Pays-Bas doit souscrire une assurance de base néerlandaise dans les quatre mois suivant son inscription.',
          'La couverture rétroagit au premier jour de résidence : une souscription tardive produit donc une facture pour les mois écoulés, plus une amende.',
          'Le panier de base est fixé par l\'État et identique chez tous les assureurs. Seuls le prix, le service et les garanties complémentaires diffèrent.',
          'Une franchise annuelle obligatoire s\'applique avant le remboursement de la plupart des soins. Le médecin généraliste en est exclu.',
          'Sans orientation de votre généraliste, pas de spécialiste, sauf urgence.',
          'Les revenus modestes et intermédiaires peuvent ouvrir droit au zorgtoeslag, une aide mensuelle du fisc.',
        ],
      },
      details: {
        title: 'Bien choisir, pas seulement vite',
        items: [
          {
            q: 'Quelles garanties complémentaires valent vraiment le coût ?',
            a:
              'Le dentaire adulte, la kinésithérapie au-delà du minimum légal et la couverture des soins à l\'étranger sont les trois qui se rentabilisent chez la plupart de nos clients. Les enfants sont couverts gratuitement sur la police d\'un parent, dentaire compris. Presque tout le reste est un calcul personnel, et nous le faisons avec vous et non à votre place.',
          },
          {
            q: 'Pourquoi ne trouvé-je pas de médecin traitant ?',
            a:
              'Les cabinets de Rotterdam et des grandes villes ferment régulièrement leurs listes, et l\'inscription doit précéder le besoin de soins plutôt que le suivre. Nous lançons la recherche dès votre première semaine et savons quels cabinets de la région acceptent encore des patients.',
          },
          {
            q: 'J\'ai la règle des 30 pour cent. Cela change-t-il quelque chose ?',
            a:
              'Votre obligation d\'assurance ne change pas. Ce qui peut changer, c\'est votre droit au zorgtoeslag, car cette aide dépend du revenu imposable. Nous le vérifions plutôt que de le présumer.',
          },
          {
            q: 'Et si je ne travaille ici qu\'une partie de l\'année ?',
            a:
              'Les situations transfrontalières et de rotation sont réellement complexes, et une erreur signifie soit des cotisations doubles, soit aucune couverture. Travailleurs offshore, salariés détachés et personnes employées dans un autre État de l\'UE relèvent chacun de règles différentes, et nous traitons la vôtre spécifiquement.',
          },
        ],
      },
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
      image: '/images/health-insurance.jpg?v=20260731',
      image2: '/images/relocation-settling.jpg?v=20260731',
      image2Alt: 'Conseillère passant en revue les premières démarches avec de nouveaux arrivants',
      imageAlt: 'Client et conseillère examinant l\'assurance maladie néerlandaise',
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
      fees: {
        title: 'Honoraires pour une recherche d’école',
        kind: 'fixed',
        amount: 'Investissement à partir de 995 €',
        includes: [
          'Une sélection d’écoles internationales, bilingues ou néerlandaises réellement adaptées à votre enfant',
          'Listes d’attente, périodes d’inscription et secteurs vérifiés avant votre choix',
          'Visites et rencontres organisées avec les écoles',
          'Dossiers d’inscription préparés et déposés',
        ],
      },
      note: 'Le choix de l’école et le choix du logement sont une seule décision, pas deux : l’adresse détermine les options. Si nous menons aussi votre recherche de logement, nous les planifions ensemble.',
      conditions: {
        title: 'Ce que les familles doivent savoir en premier',
        intro:
          'Ce sont les places à l\'école, et non le logement, qui déterminent le plus souvent quand une famille peut réellement déménager. Planifiez cela avant tout.',
        items: [
          'L\'instruction est obligatoire à partir de cinq ans, et la plupart des enfants commencent à quatre.',
          'Les écoles internationales de la région de Rotterdam ont des places limitées et des listes d\'attente, et les niveaux prisés se remplissent un an à l\'avance.',
          'Les écoles internationales néerlandaises se répartissent en deux catégories : les écoles internationales subventionnées, bien moins chères mais exigeant un parcours international démontrable, et les écoles internationales privées.',
          'Les enfants qui ne parlent pas encore néerlandais passent généralement un an en classe d\'accueil avant d\'intégrer le cursus ordinaire.',
          'L\'inscription exige normalement une adresse et un BSN, ce qui lie le calendrier scolaire à celui du logement et de l\'inscription.',
          'Nous conseillons sur les écoles et pilotons le processus. Nous ne pouvons pas créer une place là où une école n\'en a pas.',
        ],
      },
      details: {
        title: 'Choisir la bonne scolarité',
        items: [
          {
            q: 'École internationale ou école néerlandaise ?',
            a:
              'Tout dépend de la durée de votre séjour. En dessous de trois ans, l\'école internationale protège la continuité et le programme vers lequel votre enfant reviendra. Au-delà de cinq ans, l\'école néerlandaise lui donne la langue, les amitiés et une adolescence bien plus simple. Les années intermédiaires sont un vrai arbitrage, et nous en parlons franchement plutôt que de pousser l\'option coûteuse.',
          },
          {
            q: 'Quand faut-il s\'y prendre ?',
            a:
              'Six à neuf mois avant le déménagement pour les écoles internationales, trois mois pour les écoles néerlandaises. Si vous êtes déjà dans cette fenêtre, nous allons directement vers les établissements où il reste du mouvement, et ce n\'est pas la liste que vous trouverez en ligne.',
          },
          {
            q: 'Combien cela coûte-t-il ?',
            a:
              'Les écoles internationales subventionnées coûtent quelques milliers d\'euros par an. Les écoles internationales privées de la région sont nettement plus chères, et frais de scolarité, inscription et fournitures sont généralement facturés séparément. Nous établissons pour chaque école de votre sélection le montant annuel réel, afin qu\'il n\'y ait pas de surprise au deuxième mois.',
          },
          {
            q: 'Mon enfant s\'en sortira-t-il en néerlandais ?',
            a:
              'Les plus jeunes presque toujours, et vite. La classe d\'accueil existe exactement pour cela, et une année suffit généralement à amener un enfant au point où le cursus ordinaire fonctionne. Pour un adolescent proche des examens, le calcul est différent, et nous le disons franchement.',
          },
        ],
      },
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
      image: '/images/school-search.jpg?v=20260731',
      imageAlt: 'Mère et fille arrivant à une école internationale',
      image2: '/images/family-relocation.jpg?v=20260731',
      image2Alt: 'Famille à vélo le long d\'un canal néerlandais à l\'heure dorée',
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
      fees: {
        title: 'Ce que coûte l’accompagnement à l’installation',
        kind: 'tailored',
        amount: 'Proposition sur mesure',
        amountNote:
          'L’installation est la partie d’un déménagement qui diffère pour chacun, elle est donc chiffrée selon ce que vous souhaitez réellement voir pris en charge. Après le premier entretien, vous recevez un devis à prix fixe, pas un compteur horaire.',
        includes: [
          'Énergie, internet et taxes locales mis à votre nom',
          'Inscription chez le médecin, le dentiste et le pharmacien',
          'Banque, DigiD et les démarches néerlandaises qui bloquent tout le reste',
          'L’orientation pratique qui transforme une adresse en quartier',
        ],
      },
      conditions: {
        title: 'L\'ordre dans lequel les choses doivent se faire',
        intro:
          'L\'administration néerlandaise est une chaîne. Tenter l\'étape quatre avant l\'étape deux, voilà pourquoi certaines arrivées prennent des mois au lieu de semaines.',
        items: [
          'L\'adresse d\'abord, puis l\'inscription, puis le BSN. Avant le BSN, rien d\'essentiel ne peut être organisé.',
          'DigiD, l\'identifiant national, suit le BSN et sert au fisc, à la santé et à la plupart des services publics.',
          'La plupart des banques néerlandaises exigent un BSN et un justificatif d\'adresse, même si certains comptes s\'ouvrent plus tôt avec le seul passeport.',
          'L\'assurance maladie doit être souscrite dans les quatre mois suivant l\'inscription et rétroagit à l\'arrivée.',
          'Énergie, eau et internet sont à votre nom dès le début du bail, et un changement ultérieur comporte des préavis.',
          'L\'échange d\'un permis de conduire étranger n\'est possible que pour certains pays, et seulement dans un délai déterminé après l\'inscription.',
        ],
      },
      details: {
        title: 'Ce que personne ne vous dit',
        items: [
          {
            q: 'Quelle banque choisir ?',
            a:
              'Cela dépend moins de la banque que de ce que vous en attendez. Un projet de prêt immobilier, un compte professionnel, un employeur qui paie depuis l\'étranger et de la famille dans une autre devise mènent chacun à une réponse différente. Nous ouvrons le compte avec vous et veillons à ce qu\'iDEAL, sur lequel repose la moitié du pays, fonctionne dès le premier jour.',
          },
          {
            q: 'Puis-je utiliser mon permis de conduire étranger ?',
            a:
              'Les permis de l\'UE et de l\'EEE restent valables. Les permis de plusieurs autres pays, dont certains États américains, peuvent être échangés sans nouvel examen, mais seulement dans une fenêtre limitée après l\'inscription et parfois uniquement avec la règle des 30 pour cent. Fenêtre manquée, examen néerlandais complet. Nous vérifions votre cas tôt, car ce délai ne pardonne pas.',
          },
          {
            q: 'Comment trouver médecin, dentiste et pharmacie ?',
            a:
              'Vous vous inscrivez auprès d\'un cabinet de médecine générale proche de votre adresse, et le cabinet vous rattache une pharmacie. Les deux sont saturés, nous les réglons donc dans vos deux premières semaines. Les dentistes acceptent des patients privés directement et sont plus simples, même si les bons cabinets du centre ont encore des listes.',
          },
          {
            q: 'Et le fisc la première année ?',
            a:
              'Votre premier exercice fiscal néerlandais vaut presque toujours une déclaration, même si vous pensez ne rien devoir, car les déclarations de l\'année d\'arrivée débouchent souvent sur un remboursement. Nous sommes conseillers en relocation et non fiscalistes, nous vous présentons donc un conseiller spécialisé dans les déclarations d\'expatriés plutôt que de deviner à votre place.',
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
      image: '/images/relocation-settling.jpg?v=20260728',
      imageAlt: 'Un nouvel arrivant prenant ses repères dans son nouveau quartier néerlandais',
      image2: '/images/couple-moving-in.jpg?v=20260731',
      image2Alt: 'Couple avec les clés de son nouvel appartement aux Pays-Bas',
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
      fees: {
        title: 'Honoraires pour un accueil à l’aéroport',
        kind: 'fixed',
        amount: 'À partir de 395 €',
        includes: [
          'Un chauffeur professionnel et un véhicule de direction adaptés à votre groupe et à vos bagages',
          'Vol surveillé pour qu’un retard ne vous coûte pas la réservation',
          'Accueil dans le terminal, et non un message depuis le parking',
          'Transfert direct vers votre adresse, votre hôtel ou votre premier rendez-vous',
        ],
      },
      conditions: {
        title: 'Comment se déroule le transfert',
        intro:
          'Une prestation courte, avec peu de conditions, toutes destinées à ce que personne n\'attende dans un hall d\'arrivée.',
        items: [
          'Nous desservons Schiphol, Rotterdam La Haye et Eindhoven, et les terminaux privés sur demande.',
          'Communiquez votre numéro de vol et nous le suivons, ainsi un retard décale notre horaire et non votre accueil.',
          'L\'accueil se fait à l\'intérieur, dans le hall d\'arrivée, et non au bord du trottoir.',
          'Les véhicules sont choisis selon le nombre de passagers et les bagages, sièges enfants inclus si nécessaire.',
          'Les transferts desservent toute adresse à Rotterdam et dans la région portuaire, et au-delà sur accord.',
          'Nous confirmons les réservations au moins vingt-quatre heures à l\'avance quand c\'est possible, tout en absorbant les changements de dernière minute.',
        ],
      },
      details: {
        title: 'La première heure néerlandaise',
        items: [
          {
            q: 'Que se passe-t-il entre l\'aéroport et la porte d\'entrée ?',
            a:
              'On vous accueille à votre nom, on prend vos bagages, et le trajet sert au briefing qui compte : comment fonctionnent vos clés, où est le supermarché le plus proche, comment gérer les poubelles, quelle application pilote les transports, et ce qui est prévu demain. La plupart des clients trouvent cette demi-heure plus précieuse que le transfert lui-même.',
          },
          {
            q: 'Pouvez-vous accueillir une famille qui arrive séparément ?',
            a:
              'Oui. Les arrivées échelonnées sont fréquentes quand un partenaire suit plus tard ou que des enfants terminent une année scolaire. Nous coordonnons plusieurs vols et, quand l\'écart est d\'un ou deux jours, gardons le même chauffeur pour qu\'un visage connu attende des deux côtés.',
          },
          {
            q: 'Le logement est-il prêt à notre arrivée ?',
            a:
              'Il l\'est si nous l\'avons organisé. Dans le cadre d\'un forfait relocation, nous veillons à ce que les clés soient récupérées, le chauffage allumé, les lits utilisables, et le café, le lait et le pain déjà en cuisine. Arriver à minuit dans un appartement vide est un souvenir qui reste des années, et il est évitable.',
          },
          {
            q: 'Assurez-vous aussi les départs ?',
            a:
              'Oui, et pour les clients qui quittent les Pays-Bas nous le combinons avec l\'état des lieux de sortie, la récupération du dépôt et la radiation, afin que le dernier jour soit aussi encadré que le premier.',
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
      image: '/images/relocation-arrival.jpg?v=20260731',
      image2: '/images/vip-welcome.jpg?v=20260731',
      image2Alt: 'Voiture de direction sur une avenue arborée à l’heure dorée',
      imageAlt: 'Chauffeur accueillant un client dans un terminal d\'aviation privée',
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
      fees: {
        title: 'Ce que coûte une relocation familiale',
        kind: 'tailored',
        amount: 'Proposition sur mesure',
        amountNote:
          'Deux déménagements familiaux ne se ressemblent jamais : le nombre d’enfants, les écoles, la voie de séjour et le calendrier changent le travail. Après un premier entretien, vous recevez une proposition personnalisée couvrant toute l’arrivée.',
        includes: [
          'Un plan unique couvrant chaque membre de la famille, dans le bon ordre',
          'Recherche de logement construite autour des écoles et du trajet, pas seulement du code postal',
          'Recherche d’école, inscription et présentations',
          'Chaque formalité pour chaque membre de la famille, prise et accompagnée',
        ],
      },
      conditions: {
        title: 'Comment s\'organise un déménagement familial',
        intro:
          'Un déménagement familial comporte plus de dépendances que tout autre. Voici celles qui fixent le calendrier.',
        items: [
          'La disponibilité des places scolaires détermine généralement la date du déménagement, et non la date de prise de poste.',
          'Chaque membre de la famille a besoin de son propre rendez-vous d\'inscription et de ses propres documents légalisés, enfants compris.',
          'Le titulaire principal doit satisfaire à la condition de revenu pour les membres accompagnants, actuellement 2 523,96 euros bruts par mois, pécule inclus.',
          'Si un parent ne déménage pas, son consentement écrit est requis avant qu\'un enfant puisse partir.',
          'L\'assurance maladie est obligatoire pour chaque membre de la famille, les enfants étant couverts gratuitement sur la police d\'un parent.',
          'Un partenaire accompagnant un travailleur hautement qualifié a libre accès au marché du travail néerlandais et n\'a besoin d\'aucun permis de travail distinct.',
        ],
      },
      details: {
        title: 'Ce que les familles nous demandent',
        items: [
          {
            q: 'Dans quel ordre procéder ?',
            a:
              'Les écoles, puis le logement dans le secteur qui fonctionne, puis les titres et l\'inscription, puis la couche pratique. Inverser les deux premiers est l\'erreur familiale la plus fréquente et la plus coûteuse, car une belle maison à quarante minutes de la seule école ayant des places rend tout le monde malheureux dès novembre.',
          },
          {
            q: 'Mon partenaire renonce à sa carrière. Qu\'est-ce qui est réaliste ?',
            a:
              'Le marché du travail néerlandais est réellement ouvert aux partenaires accompagnants, en particulier dans les secteurs anglophones autour de Rotterdam et de La Haye, et aucun permis de travail n\'est nécessaire. Ce qui aide le plus : un CV au format néerlandais, comprendre comment le recrutement local fonctionne vraiment, et commencer avant le déménagement plutôt qu\'après. Nous faisons les présentations que nous pouvons faire.',
          },
          {
            q: 'Comment les enfants s\'adaptent-ils ?',
            a:
              'Mieux que les parents ne l\'attendent, et plus lentement qu\'ils ne l\'espèrent. Le système néerlandais est particulièrement bienveillant avec les enfants nouvellement arrivés, et la classe d\'accueil fonctionne. Le plus dur se situe généralement entre le troisième et le sixième mois, une fois la nouveauté passée, et il aide énormément d\'avoir prévu un sport, la musique ou un club avant d\'en avoir besoin.',
          },
          {
            q: 'Tout peut-il vraiment avancer en parallèle ?',
            a:
              'Oui, et c\'est même indispensable. Titres, candidatures scolaires, logement, inscription et assurance ont chacun leur délai, nous les menons donc simultanément contre une seule ligne de temps familiale plutôt que l\'un après l\'autre. C\'est la différence entre un déménagement de dix semaines et un de six mois.',
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
      image: '/images/family-relocation.jpg?v=20260731',
      image2: '/images/family-reunification.jpg?v=20260731',
      image2Alt: 'Famille réunie dans une maison de ville néerlandaise lumineuse',
      imageAlt: 'Famille à vélo le long d\'un canal néerlandais à l\'heure dorée',
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
      fees: {
        title: 'Ce que coûte une relocation à Rotterdam',
        kind: 'tailored',
        amount: 'Proposition sur mesure',
        amountNote:
          'Des prestations sur mesure, adaptées à vos exigences personnelles. À l’issue d’un premier entretien, vous recevez une proposition personnalisée fondée sur vos objectifs, votre situation familiale et le niveau d’accompagnement souhaité.',
        includes: [
          'Un plan unique couvrant l’immigration, le logement et chaque formalité',
          'Une conseillère qui connaît la ville et suit votre dossier de bout en bout',
          'Rendez-vous pris, préparés et honorés avec vous',
          'Un accompagnement qui continue une fois les cartons défaits',
        ],
      },
      conditions: {
        title: 'Ce que nous couvrons localement',
        intro:
          'Nous sommes établis dans cette région et nous y travaillons, ce qui rend nos conseils précis plutôt que nationaux.',
        items: [
          'Rotterdam et les communes voisines, dont Schiedam, Capelle aan den IJssel, Barendrecht, Spijkenisse et le corridor d\'Europoort.',
          'Les rendez-vous d\'inscription à Rotterdam se prennent à l\'avance, avec des délais de quelques jours à plusieurs semaines selon la saison.',
          'La ville applique des zones de stationnement avec permis par foyer, et au centre les listes d\'attente courent sur des mois.',
          'Les écoles internationales de la région se concentrent à Kralingen et dans le sud de la ville, et les places sont limitées.',
          'Les loyers du secteur libre débutent vers 1 200 euros pour un une-pièce et grimpent fortement pour le neuf en bord d\'eau.',
          'Les missions hors de notre région sont réorientées plutôt qu\'acceptées. Nous préférons vous envoyer au bon cabinet que d\'être le mauvais.',
        ],
      },
      details: {
        title: 'Vivre à Rotterdam',
        items: [
          {
            q: 'Pourquoi Rotterdam plutôt qu\'Amsterdam ?',
            a:
              'L\'espace, le coût et la franchise. Vous obtenez sensiblement plus de logement pour votre argent, un trajet plus court vers le port et le cluster industriel, une population internationale qui travaille plutôt qu\'elle ne visite, et une ville qui se reconstruit plutôt qu\'elle ne se conserve. Amsterdam est à quarante minutes quand l\'envie vous prend.',
          },
          {
            q: 'L\'anglais suffit-il ici ?',
            a:
              'Pour la vie quotidienne et la plupart des lieux de travail, oui. Pour le courrier administratif, les litiges locatifs, les petites lignes des assurances et l\'administration scolaire, non, et c\'est précisément cet écart que nous existons pour combler. Apprendre le néerlandais reste utile, et nous vous orientons vers des cours adaptés aux adultes qui travaillent.',
          },
          {
            q: 'Comment se déplace-t-on ?',
            a:
              'Le vélo d\'abord, le métro ensuite, la voiture en dernier. Le métro dessert l\'essentiel de la ville et une bonne part de la région, la carte OV ou votre carte bancaire suffit, et une voiture n\'est vraiment utile que si vous travaillez sur les terminaux ou conduisez de jeunes enfants dans deux directions.',
          },
          {
            q: 'À quoi ressemble la communauté internationale ?',
            a:
              'Vaste, active et répartie dans la région plutôt que rassemblée dans un quartier. Entre le cluster portuaire, l\'université Erasmus, le centre hospitalier et le secteur créatif, la plupart des arrivants trouvent ici leurs semblables plus vite qu\'ils ne l\'imaginent. Nous faisons les présentations que nous pouvons, et pour beaucoup de clients cela compte davantage que n\'importe quelle démarche administrative.',
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
      image: '/images/rotterdam.jpg?v=20260728',
      imageAlt: 'Centre-ville de Rotterdam et son architecture moderne le long de la Meuse',
      image2: '/images/rotterdam-evening.jpg',
      image2Alt: 'La ligne d\'horizon de Rotterdam le soir',
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
