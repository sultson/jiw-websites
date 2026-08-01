import type { CoreContent } from '../types';

export const core: CoreContent = {
  ui: {
    skipToContent: 'Aller au contenu',
    nav: {
      home: 'Accueil',
      immigration: 'Immigration',
      housing: 'Logement',
      relocation: 'Relocation',
      business: 'Créer une entreprise',
      vip: 'Services VIP',
      guides: 'Guides',
      about: 'À propos',
      contact: 'Contact',
    },
    cta: {
      whatsapp: 'WhatsApp',
      whatsappLong: 'Écrivez-nous sur WhatsApp',
      consultation: 'Réserver une consultation de relocation',
      startRelocation: 'Commencer votre relocation',
      readMore: 'En savoir plus',
      allServices: 'Tous les services',
      backTo: 'Retour à',
      send: 'Envoyer la demande',
      sending: 'Envoi en cours…',
      explore: 'Découvrir',
    },
    langBanner: {
      prompt: 'Préférez-vous consulter ce site en {lang}?',
      switch: 'Changer',
      dismiss: 'Non, merci',
    },
    form: {
      firstName: 'Prénom',
      lastName: 'Nom',
      email: 'Adresse e-mail',
      phone: 'Téléphone / WhatsApp',
      optional: 'facultatif',
      successTitle: 'Merci, votre demande a bien été envoyée',
      successBody:
        'Johanna étudiera personnellement votre situation et vous répondra sous un jour ouvré, souvent bien plus vite. Pour toute urgence, écrivez-nous sur WhatsApp.',
      errorTitle: 'Une erreur est survenue',
      errorBody: 'Votre demande n’a pas pu être envoyée. Veuillez réessayer, ou écrivez-nous sur WhatsApp.',
      consent: 'En envoyant ce formulaire, vous acceptez notre politique de confidentialité.',
      nextSteps:
        'Après l’envoi de ce formulaire, Johanna étudie personnellement votre situation et vous répond sous un jour ouvré avec une évaluation honnête de la possibilité et de la manière de vous aider. Si votre demande sort de nos services ou de notre région, nous vous le disons d’emblée.',
    },
    footer: {
      tagline: 'Un cabinet boutique de relocation pour les professionnels internationaux et les familles qui s’installent à Rotterdam, Europoort et dans la grande région portuaire.',
      services: 'Services',
      company: 'Société',
      contactHeading: 'Contact',
      legalHeading: 'Mentions légales',
      kvkLabel: 'KvK',
      rightsReserved: 'Tous droits réservés.',
      builtBy: 'Site réalisé par',
      disclaimer:
        'E & I est un cabinet indépendant de relocation et d’immigration. Nous ne sommes pas un organisme public et n’avons aucun lien avec l’IND, le gouvernement néerlandais, une ambassade ou un consulat. Les décisions relatives aux visas, aux titres de séjour et à la naturalisation relèvent exclusivement des autorités compétentes.',
    },
    misc: {
      from: 'Investissement à partir de',
      whatsIncluded: 'Ce qui est inclus',
      otherServices: 'Autres services',
      relatedGuides: 'Guides associés',
      conditions: 'Conditions',
      investment: 'Investissement',
      feesDisclaimer:
        'Les montants indiqués correspondent uniquement à nos honoraires et sont donnés à titre indicatif. Les taxes administratives (y compris les frais de dossier de l’IND), la TVA, les frais de légalisation et d’apostille, les traductions assermentées, les frais consulaires et les débours de tiers ne sont pas compris, sauf mention expresse dans la proposition.',
    },
  },

  home: {
    metaTitle: 'Services boutique de relocation et d’immigration aux Pays-Bas | E & I',
    metaDescription:
      'Un cabinet boutique de relocation pour les professionnels internationaux, les familles et les entrepreneurs à Rotterdam, Europoort et dans la grande région portuaire. Logement, écoles, démarches, immigration et forfaits VIP.',
    hero: {
      h1: 'Services boutique de relocation et d’immigration aux Pays-Bas',
      sub: 'Un cabinet de relocation privé pour les professionnels internationaux, les familles et les entrepreneurs qui s’installent à Rotterdam, Europoort et dans la grande région portuaire. L’immigration en fait partie, elle n’est jamais toute l’histoire.',
      ctaPrimary: 'Réserver une consultation de relocation',
      ctaWhatsapp: 'Écrivez-nous sur WhatsApp',
      ctaSecondary: 'Commencer votre relocation',
      trust: 'Accompagnement personnel par Johanna, joignable 24h/24',
    },
    paths: {
      heading: 'Comment pouvons-nous faciliter votre arrivée?',
      sub: 'Relocation, logement, accompagnement VIP et immigration, réunis dans un seul cabinet. Choisissez votre porte d’entrée et une seule personne connaît votre nom, du premier message au jour où vous vous sentez chez vous.',
      items: [
        {
          key: 'immigration',
          title: 'Services d’immigration',
          text: 'Visas et permis pour les professionnels, partenaires, familles et fondateurs. Des dossiers préparés avec précision et un accompagnement personnel, de l’éligibilité à l’approbation.',
          label: 'Découvrir l’immigration',
          path: '/immigration',
          image: '/images/path-immigration.jpg?v=20260731',
          imageAlt: 'Conseillère en entretien avec un client international',
        },
        {
          key: 'relocation',
          title: 'Relocation & logement',
          text: 'Des forfaits de relocation complets ou des services à la carte : recherche de logement, écoles, BSN, assurances et tout ce qui les relie.',
          label: 'Découvrir la relocation',
          path: '/relocation',
          image: '/images/path-relocation.jpg?v=20260731',
          imageAlt: 'Famille arrivant dans une maison au bord d’un canal néerlandais',
        },
        {
          key: 'vip',
          title: 'Relocation VIP',
          text: 'Pour les artistes, athlètes, dirigeants et visites éclair d’un week-end. Toute votre installation orchestrée autour d’une seule visite, chaque porte déjà ouverte.',
          label: 'Découvrir les services VIP',
          path: '/vip-services',
          image: '/images/path-vip.jpg?v=20260731',
          imageAlt: 'Chauffeur ouvrant la portière d’une voiture devant la skyline de Rotterdam',
        },
      ],
    },
    mostRequested: {
      heading: 'Les services les plus demandés',
      sub: 'Les huit demandes que les expatriés nous adressent en premier.',
      items: [
        { label: 'Visa de migrant hautement qualifié', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Aide à la recherche de logement', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Visa partenaire Pays-Bas', path: '/immigration/partner-visa-netherlands' },
        { label: 'Enregistrement BSN', path: '/relocation/bsn-registration-netherlands' },
        { label: 'Visa start-up Pays-Bas', path: '/immigration/startup-visa-netherlands' },
        { label: 'Recherche d’école', path: '/relocation/school-search-netherlands' },
        { label: 'Forfait relocation complet', path: '/vip-services' },
        { label: 'Services de relocation à Rotterdam', path: '/relocation/relocation-services-rotterdam' },
      ],
    },
    vipBlock: {
      eyebrow: 'Services de relocation VIP',
      heading: 'Arrivez comme vous avez l’habitude d’arriver',
      text: [
        'Certains clients ne peuvent pas consacrer six semaines aux formalités. Ils arrivent pour un week-end, signent, s’enregistrent et repartent pendant que nous terminons le reste. Nos forfaits VIP condensent une relocation entière dans un agenda bâti autour de vous : rendez-vous alignés sur une seule visite, sélection de logements prête avant votre atterrissage, voiture qui vous attend à Schiphol.',
        'Couples, familles et entreprises disposent chacun de leur forfait, et le niveau conciergerie s’écrit autour de ce que votre vie exige.',
      ],
      label: 'Découvrir la relocation VIP',
    },
    immigrationBlock: {
      eyebrow: 'Immigration pour expatriés',
      heading: 'Le bon permis, préparé comme il se doit',
      text: [
        'L’immigration néerlandaise récompense la préparation. Nous déterminons la voie qui correspond réellement à votre situation, préparons la demande telle que l’IND souhaite la recevoir, et vous accompagnons aux rendez-vous qui comptent.',
      ],
      label: 'Tous les services d’immigration',
      links: [
        { label: 'Migrant hautement qualifié', path: '/immigration/highly-skilled-migrant-visa-netherlands' },
        { label: 'Carte bleue européenne', path: '/immigration/eu-blue-card-netherlands' },
        { label: 'Visa partenaire', path: '/immigration/partner-visa-netherlands' },
        { label: 'Visa start-up', path: '/immigration/startup-visa-netherlands' },
        { label: 'Visa DAFT', path: '/immigration/daft-visa-netherlands' },
        { label: 'Titres de séjour', path: '/immigration/residence-permit-netherlands' },
      ],
    },
    housingBlock: {
      eyebrow: 'Logement & installation',
      heading: 'Un foyer, pas seulement une adresse',
      text: [
        'Le marché locatif néerlandais se joue en jours, pas en semaines. Nous cherchons, assistons aux visites avec vous ou à votre place, examinons chaque clause du contrat avant signature, et restons l’interlocuteur de votre propriétaire bien après la remise des clés.',
      ],
      label: 'Tous les services logement',
      links: [
        { label: 'Recherche de logement', path: '/housing/housing-search-assistance-netherlands' },
        { label: 'Logement expat à Rotterdam', path: '/housing/housing-for-expats-rotterdam' },
        { label: 'Accompagnement aux visites', path: '/housing/viewing-assistance-netherlands' },
        { label: 'Logement temporaire', path: '/housing/temporary-housing-for-expats-netherlands' },
      ],
    },
    businessBlock: {
      eyebrow: 'Créer une entreprise',
      heading: 'Fondez votre société là où le monde accoste',
      text: [
        'Visa start-up, traité DAFT, immatriculation à la KvK, une adresse, un logement, une école pour vos enfants. La plupart des cabinets traitent l’un de ces sujets. Nous orchestrons l’ensemble, car un fondateur ne déménage pas par étapes, il déplace une vie.',
      ],
      label: 'Services entreprises',
    },
    portBlock: {
      eyebrow: 'Ports, zones portuaires & offshore',
      heading: 'Le spécialiste du port de Rotterdam',
      text: [
        'Le plus grand port d’Europe ne figure dans aucune brochure de relocation, et pourtant des dizaines de milliers de professionnels internationaux y construisent leur carrière. Nous sommes la seule agence boutique spécialisée dans Rotterdam, la région au sud de la ville, Europoort et la Maasvlakte, et nous travaillons chaque jour avec les entreprises portuaires, offshore, maritimes et d’ingénierie qui font venir ces talents ici.',
      ],
      label: 'Services pour expatriés de l’industrie',
      areas: [
        { title: 'Rotterdam', text: 'Vivre face à la skyline, des écoles internationales et la ville qui se transforme le plus vite des Pays-Bas.' },
        { title: 'Europoort & Maasvlakte', text: 'Une relocation pragmatique pour les professionnels du port, de l’offshore et du raffinage, et leurs familles.' },
        { title: 'Au sud de Rotterdam', text: 'Des villes paisibles comme Brielle, Rozenburg et Hellevoetsluis, à quelques minutes des terminaux et pourtant dans un autre monde.' },
      ],
      advantages: [
        { title: 'Connaissance locale', text: 'Nous connaissons les quartiers, les écoles, les propriétaires et les trajets de cette région rue par rue.' },
        { title: 'Assistance personnelle rapide', text: 'Nous sommes sur place, ce qui nous permet d’être présents à une visite, à un guichet municipal ou lors d’une urgence dans les plus brefs délais.' },
        { title: 'Un réseau établi', text: 'Agences, municipalités, écoles et employeurs internationaux de la région nous connaissent déjà.' },
        { title: 'Un suivi après l’arrivée', text: 'La relation ne s’arrête pas à la remise des clés. Nous restons votre interlocuteur bien après votre installation.' },
      ],
      links: [
        { label: 'Expatriés Europoort', path: '/industrial-expat-services/europoort-relocation-services-netherlands' },
        { label: 'Expatriés Maasvlakte', path: '/industrial-expat-services/maasvlakte-expat-relocation-netherlands' },
        { label: 'Professionnels de l’offshore', path: '/industrial-expat-services/offshore-expat-services-netherlands' },
        { label: 'Professionnels de la logistique', path: '/industrial-expat-services/relocation-for-logistics-professionals-netherlands' },
      ],
    },
    familyBlock: {
      eyebrow: 'Relocation familiale',
      heading: 'Déménager une famille est une autre discipline',
      text: [
        'Des années scolaires qui commencent à dates fixes, plusieurs dossiers à l’IND au lieu d’un, et un logement qui doit convenir à tous. Nous coordonnons l’arrivée de toute la famille, immigration comprise, en un seul plan et une seule paire de mains.',
      ],
      label: 'Services de relocation familiale',
      path: '/relocation/family-relocation-netherlands',
      image: '/images/family-unpacking.jpg?v=20260731',
      imageAlt: 'Famille installée dans son nouveau salon aux Pays-Bas',
      links: [
        { label: 'Forfait VIP Famille', path: '/vip-services/family-relocation-immigration-services-netherlands' },
        { label: 'Recherche d’école', path: '/relocation/school-search-netherlands' },
        { label: 'Regroupement familial', path: '/immigration/family-reunification-netherlands' },
      ],
    },
    whyBoutique: {
      eyebrow: 'Pourquoi une boutique',
      heading: 'Un cabinet. Une personne. Votre nom.',
      text: [
        'Les grands cabinets de relocation vous attribuent un numéro de dossier. Un cabinet boutique vous attribue une personne. Johanna a bâti sa réputation dans le monde des ambassades, où la discrétion et la précision ne sont pas des qualités, mais la définition même du métier.',
        'Nous ne sommes pas une usine à relocation qui propose tous les services imaginables. Nous faisons la relocation, le logement, l’accompagnement VIP et l’immigration pour une seule région, au sein d’un seul cabinet, et nous les faisons jusqu’au bout.',
      ],
      points: [
        {
          title: 'Nous vous accompagnons',
          text: 'À la municipalité, à l’IND, à la banque et aux visites. On ne vous remet jamais une simple checklist en vous souhaitant bonne chance.',
        },
        {
          title: '24/7, personnellement',
          text: 'Une seule ligne WhatsApp, tenue par la personne qui gère votre dossier. Jour et nuit, première semaine comme première année.',
        },
        {
          title: 'Unique en son genre',
          text: 'Les Pays-Bas comptent des cabinets de mobilité corporate et des guichets à visas. Ils comptent exactement une conciergerie boutique pour expatriés.',
        },
        {
          title: 'Des forfaits pensés pour des vies',
          text: 'Couple, famille, entreprise ou conciergerie complète. Chaque forfait couvre l’arrivée dans son ensemble, pas une tranche.',
        },
      ],
      stats: [
        { value: 'Depuis 2016', label: 'À accompagner les arrivées aux Pays-Bas' },
        { value: '1200+', label: 'Expatriés et familles accompagnés' },
        { value: '98%', label: 'Taux de satisfaction client' },
        { value: '24/7', label: 'Assistance personnelle sur WhatsApp' },
      ],
    },
    reviews: {
      eyebrow: 'Histoires de clients',
      heading: 'Des arrivées dont nous sommes fiers',
      sub: 'De vrais clients, de vrais parcours vers les Pays-Bas.',
      items: [
        {
          quote: 'Grâce à E & I, notre regroupement familial s’est déroulé sans le moindre stress. Tout était parfaitement organisé.',
          name: 'Anna',
          route: 'De la Russie aux Pays-Bas',
          tags: ['Relocation', 'Visa', 'Permis de travail', 'Aide au logement', 'Famille'],
        },
        {
          quote: 'Johanna a été présente pour nous 24h/24 durant nos premiers jours. Un service vraiment unique!',
          name: 'Chinedu',
          route: 'Du Nigeria aux Pays-Bas',
          tags: ['Relocation', 'Visa', 'Entreprise', 'Start-up', 'Intégration'],
        },
      ],
    },
    whatsappCta: {
      heading: 'Un message. Nous nous chargeons du reste.',
      text: 'Dites-nous où vous êtes et où vous devez être. Vous parlerez avec Johanna, pas avec un chatbot.',
      label: 'Écrivez-nous sur WhatsApp',
    },
    contactBlock: {
      eyebrow: 'Engagez la conversation',
      heading: 'Parlez-nous de votre projet d’installation',
      text: 'Quelques lignes suffisent. Nous répondons sous un jour ouvré.',
    },
  },

  about: {
    metaTitle: 'À propos d’E & I | Agence boutique expat & immigration Pays-Bas',
    metaDescription:
      'E & I est la seule agence boutique de relocation et d’immigration pour expatriés aux Pays-Bas. Un accompagnement personnel par Johanna, du visa au logement, jusqu’au jour où vous vous sentez chez vous.',
    eyebrow: 'À propos d’E & I',
    title: 'La boutique derrière un millier d’arrivées',
    intro: [
      'E & I : Expat, Relocation and Immigration Services The Netherlands est né d’une observation simple, faite au cœur du monde des ambassades : ceux qui changent de pays le mieux sont ceux qui sont personnellement accompagnés. Pas gérés comme des dossiers. Accompagnés.',
      'Aujourd’hui, Johanna et son réseau guident professionnels, couples, familles et fondateurs vers les Pays-Bas, avec une spécialité que personne d’autre ne revendique : Rotterdam, Europoort et la région industrielle autour du plus grand port d’Europe.',
    ],
    image: '/images/about-joanna.jpg',
    imageAlt: 'Johanna, fondatrice d’E & I, dans son bureau',
    approach: {
      heading: 'Notre approche personnelle de la relocation',
      text: [
        'Chaque client dispose d’un interlocuteur unique qui connaît l’ensemble du dossier. Quand la municipalité exige votre présence, nous sommes assis à côté de vous. Quand un propriétaire appelle, nous répondons en néerlandais. Et si quelque chose survient à onze heures du soir durant votre première semaine, la ligne WhatsApp est tenue par la personne qui est venue vous chercher à l’aéroport.',
        'Cette façon de travailler ne se prête pas à des milliers de clients par an. C’est précisément le but.',
      ],
    },
    history: {
      heading: 'En activité depuis 2016',
      text: [
        'E & I a été fondé en 2016 et accompagne depuis lors les arrivées aux Pays-Bas. Une décennie dans une seule région explique pourquoi nous savons quelle commune réclame quel document, quels bailleurs accepteront d’examiner un candidat dont le contrat commence le mois prochain, et combien de temps l’IND met réellement le mois où vous déposez votre dossier.',
        'Cela signifie aussi que les relations sont réelles. Des agents, des notaires, des secrétariats d’école et des fonctionnaires qui décrochent parce qu’ils reconnaissent le nom. C’est l’avantage discret qu’un cabinet ne peut pas acheter et qu’un nouveau venu ne peut pas imiter.',
      ],
    },
    boutique: {
      heading: 'Pourquoi choisir une agence boutique',
      text: [
        'Les cabinets de mobilité corporate sont conçus pour le volume : portails, tickets, niveaux de service. Une boutique est conçue pour les résultats. Vous bénéficiez du jugement de quelqu’un qui a guidé des centaines de clients à travers l’IND, de la rapidité d’une équipe qui connaît chaque guichet de la région, et de la discrétion qu’exige une réputation bâtie parmi les diplomates.',
      ],
      points: [
        { title: 'Des racines dans le monde des ambassades', text: 'Précision et discrétion apprises là où l’erreur n’est pas une option.' },
        { title: 'Une région que personne d’autre ne couvre', text: 'Rotterdam, Europoort et la Maasvlakte, connues rue par rue.' },
        { title: 'Immigration et relocation dans une seule main', text: 'Le permis, le logement et la vie autour, orchestrés par une seule équipe.' },
      ],
    },
    families: {
      heading: 'Un soutien pour les expatriés et les familles',
      text: [
        'La moitié d’une relocation réussie n’a rien à voir avec les formalités. Des écoles qui conviennent à vos enfants, un quartier qui convient à vos soirées, un médecin, une salle de sport, un trajet vers le travail. Notre accompagnement à l’installation les traite avec le même sérieux que le visa, car c’est là que se joue la réussite d’un déménagement.',
      ],
    },
    reviews: {
      heading: 'Avis & expériences clients',
      sub: 'Ce que disent les clients arrivés avec E & I.',
    },
    cta: {
      title: 'Rencontrez-nous avant de décider',
      text: 'Une consultation ne coûte rien et vous dit exactement où vous en êtes.',
      label: 'Réserver une consultation de relocation',
    },
  },

  contact: {
    metaTitle: 'Contact E & I | Relocation & immigration aux Pays-Bas',
    metaDescription:
      'Réservez une consultation de relocation, écrivez-nous sur WhatsApp ou envoyez une demande immigration, relocation ou VIP. Réponse personnelle sous un jour ouvré.',
    eyebrow: 'Contact',
    title: 'Commencez votre relocation',
    intro: [
      'Choisissez le parcours qui correspond à votre situation et écrivez-nous quelques lignes. Votre demande arrive directement chez Johanna, et vous recevrez une réponse personnelle sous un jour ouvré.',
    ],
    tabs: [
      {
        key: 'immigration',
        label: 'Immigration',
        text: 'Visas, permis et demandes auprès de l’IND.',
      },
      {
        key: 'relocation',
        label: 'Relocation & logement',
        text: 'Forfaits, logement, écoles et installation.',
      },
      {
        key: 'vip',
        label: 'VIP',
        text: 'Relocations conciergerie et visites éclair.',
      },
    ],
    whatsapp: {
      heading: 'Assistance relocation sur WhatsApp',
      text: 'Le moyen le plus rapide de nous joindre, et le canal que nos clients continuent d’utiliser bien après leur arrivée.',
      label: 'Écrivez-nous sur WhatsApp',
    },
    emergency: {
      heading: 'Assistance relocation d’urgence',
      text: 'Échéance demain, logement tombé à l’eau, rendez-vous impossible à manquer? Écrivez-nous sur WhatsApp avec le mot URGENT et nous répondons immédiatement, de jour comme de nuit.',
    },
    details: {
      heading: 'Coordonnées',
    },
    formCopy: {
      immigration: {
        heading: 'Demande immigration & relocation',
        text: 'Indiquez-nous votre nationalité et la voie que vous envisagez. Vous ne savez pas quel visa vous convient? Dites-le, cette évaluation est précisément notre métier.',
        service: 'De quel service avez-vous besoin?',
        serviceOptions: [
          'Visa de migrant hautement qualifié',
          'Carte bleue européenne',
          'Visa année d’orientation',
          'Visa partenaire',
          'Regroupement familial',
          'Visa start-up',
          'Visa DAFT',
          'Visa Schengen affaires',
          'Titre de séjour',
          'Je ne sais pas encore',
        ],
        nationality: 'Nationalité',
        currentLocation: 'Pays de résidence actuel',
        status: 'Statut d’immigration actuel',
        statusOptions: [
          'Hors de l’UE, pas encore de permis néerlandais',
          'Déjà aux Pays-Bas avec un visa ou un permis',
          'Citoyen de l’UE ou de l’EEE',
          'Autre ou incertain',
        ],
        timeline: 'Quand prévoyez-vous de déménager?',
        timelineOptions: ['Dès que possible', 'D’ici 3 mois', '3 à 6 mois', 'J’explore les options'],
        message: 'Votre situation',
        messagePlaceholder: 'Par exemple : citoyen américain, poste proposé à Rotterdam à partir de mars, accompagné de mon partenaire et de deux enfants.',
      },
      relocation: {
        heading: 'Demande relocation & logement',
        text: 'D’un service unique à un forfait complet. Dites-nous à quoi votre arrivée doit ressembler.',
        service: 'De quoi avez-vous besoin?',
        serviceOptions: [
          'Forfait relocation complet',
          'Recherche de logement',
          'Recherche d’école',
          'BSN et enregistrements',
          'Accompagnement à l’installation',
          'Logement temporaire',
          'Relocation région industrielle',
          'Autre chose',
        ],
        movingFrom: 'Vous partez de',
        household: 'Qui déménage?',
        householdOptions: ['Moi seul(e)', 'Mon partenaire et moi', 'Ma famille avec enfants', 'Des collaborateurs de mon entreprise', 'Autre'],
        timeline: 'Quand arrivez-vous?',
        timelineOptions: ['Dès que possible', 'D’ici 3 mois', '3 à 6 mois', 'J’explore les options'],
        message: 'Votre déménagement',
        messagePlaceholder: 'Par exemple : famille de quatre personnes arrivant de Zürich cet été, logement recherché près d’une école internationale.',
      },
      vip: {
        heading: 'Demande relocation VIP',
        text: 'Discret, rapide et bâti autour de votre agenda. Donnez-nous les dates et nous concevons la visite.',
        package: 'Quel forfait vous intéresse?',
        packageOptions: [
          'Forfait VIP Couple',
          'Forfait VIP Famille',
          'Forfait VIP Entreprise',
          'Conciergerie Relocation VIP',
          'Je ne sais pas encore',
        ],
        preferredContact: 'Contact préféré',
        preferredContactOptions: ['WhatsApp', 'Téléphone', 'E-mail'],
        arrival: 'Arrivée prévue',
        movingFrom: 'Vous partez de',
        message: 'Votre relocation',
        messagePlaceholder: 'Par exemple : installation depuis Los Angeles en octobre, disponible pour une visite de préparation en septembre.',
      },
    },
  },

  privacy: {
    metaTitle: 'Politique de confidentialité | E & I Expat & Immigration Services',
    title: 'Politique de confidentialité',
    intro: [
      'E & I : Expat, Relocation and Immigration Services The Netherlands traite les données personnelles uniquement pour répondre à votre demande et fournir les services de relocation et d’immigration que vous nous confiez.',
    ],
    sections: [
      {
        heading: 'Les données que nous collectons',
        paragraphs: [
          'Lorsque vous nous contactez, nous recevons les informations que vous choisissez de partager : votre nom, vos coordonnées et la description de votre situation. Pour les clients actifs, nous traitons également les documents nécessaires aux demandes, toujours en toute transparence.',
        ],
      },
      {
        heading: 'L’usage que nous en faisons',
        paragraphs: [
          'Vos données servent à vous répondre, à préparer et gérer votre dossier de relocation ou d’immigration, et à rien d’autre. Nous ne vendons pas de données et ne les utilisons pas à des fins publicitaires.',
        ],
      },
      {
        heading: 'Conservation et vos droits',
        paragraphs: [
          'Les données de demande ne sont conservées que le temps nécessaire pour vous servir. Vous pouvez à tout moment demander l’accès, la rectification ou la suppression de vos données via les coordonnées ci-dessous.',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [
          'E & I : Expat, Relocation and Immigration Services The Netherlands, Laan van Zuid Hoorn 70, Rijswijk. KvK 65768922.',
        ],
      },
    ],
  },

  notFound: {
    title: 'Cette page a poursuivi sa route',
    text: 'La page que vous cherchez n’existe pas, ou son adresse a changé. Laissez-nous vous ramener.',
    label: 'Retour à l’accueil',
  },
};
