import type { SectionContent } from '../types';

export const business: SectionContent = {
  title: 'Créer une entreprise aux Pays-Bas',
  metaTitle: 'Créer une entreprise aux Pays-Bas | E & I Expat Services',
  metaDescription:
    'Créez ou relocalisez une entreprise aux Pays-Bas avec un seul partenaire pour les visas, l’immatriculation, le logement et la relocation familiale. Conçu pour les entrepreneurs internationaux.',
  eyebrow: 'Entreprise',
  intro: [
    'Les cabinets de visas obtiennent des permis. Les agents de constitution immatriculent des sociétés. Les agences immobilières trouvent des appartements. Un entrepreneur international a besoin des trois à la fois, plus une famille qui a réellement envie de rester, et personne ne vous propose cela comme un seul service. Nous, si. Immigration, création d’entreprise, logement et relocation, coordonnés par une équipe qui ne répond qu’à vous.',
    'La même logique vaut à l’échelle de l’entreprise. Quand une société déplace des personnes aux Pays-Bas, nous relocalisons le tableau entier : l’entité, les dirigeants, les équipes et chaque famille qui les accompagne.',
  ],
  image: '/images/business-meeting.jpg?v=20260728',
  imageAlt: 'Entrepreneurs internationaux planifiant leur société néerlandaise autour d’une table de réunion',
  cta: {
    title: 'Amenez votre entreprise aux Pays-Bas',
    text: 'Dites-nous ce que vous voulez bâtir ici et qui vous accompagne. Nous tracerons la route complète, des permis aux locaux, en un seul plan.',
    label: 'Planifier mon implantation',
  },
  services: [
    {
      slug: 'starting-a-business-in-the-netherlands',
      menuLabel: 'Créer une entreprise',
      title: 'Créer une entreprise aux Pays-Bas',
      metaTitle: 'Créer une entreprise aux Pays-Bas en tant qu’étranger | E & I',
      metaDescription:
        'Tout ce dont un entrepreneur étranger a besoin pour créer une entreprise aux Pays-Bas : la bonne base de séjour, la forme juridique, les immatriculations et un guide personnel à travers tout cela.',
      eyebrow: 'Entrepreneuriat',
      intro: [
        'Les Pays-Bas sont l’un des endroits les plus faciles d’Europe pour faire des affaires et l’un des plus déroutants pour créer une entreprise en tant qu’étranger, car la question du séjour et la question de la société doivent être résolues ensemble. La bonne forme juridique dépend de votre voie de visa, et votre voie de visa dépend de ce que vous bâtissez.',
        'Nous dénouons ce nœud dès la toute première conversation. Vous recevez une feuille de route unique couvrant votre base de séjour, votre structure de société et vos premières immatriculations, plus une ligne WhatsApp directe vers nous à toute heure pendant que vous l’exécutez.',
      ],
      cardText: 'Une feuille de route unique pour votre base de séjour, votre structure et vos premières immatriculations.',
      forWho: {
        title: 'Qui commence ici',
        items: [
          'Entrepreneurs hors UE qui ont besoin à la fois d’un permis et d’une société',
          'Citoyens de l’UE qui peuvent commencer immédiatement mais veulent un montage bien fait',
          'Freelances et consultants apportant une activité existante aux Pays-Bas',
          'Fondateurs qui hésitent encore entre les Pays-Bas et d’autres bases européennes',
        ],
      },
      included: {
        title: 'Ce que couvre la feuille de route',
        blocks: [
          {
            title: 'Stratégie de séjour',
            text: 'Visa start-up, DAFT pour les Américains, permis d’indépendant ou aucun permis pour les citoyens de l’UE. Nous identifions la base qui correspond à votre nationalité et à vos projets.',
          },
          {
            title: 'Conseil sur la forme juridique',
            text: 'Eenmanszaak ou BV, expliquées en termes de responsabilité, d’impôts et d’interaction de chaque choix avec votre voie d’immigration.',
          },
          {
            title: 'Des immatriculations dans l’ordre',
            text: 'KvK, numéro de TVA auprès du fisc, compte bancaire professionnel et assurances, séquencés pour que rien ne bloque rien.',
          },
          {
            title: 'La vie autour de l’entreprise',
            text: 'Un logement, l’inscription dans votre commune, la santé et l’organisation familiale, car un fondateur qui ne peut pas s’installer ne peut pas bâtir.',
          },
        ],
      },
      process: {
        title: 'De l’idée à l’ouverture',
        steps: [
          { title: 'Session stratégique', text: 'Un entretien couvrant votre activité, votre nationalité et votre famille. Vous repartez avec la route décidée.' },
          { title: 'Permis et formalités', text: 'Nous menons la demande d’immigration et la constitution de la société en parallèle chaque fois que possible.' },
          { title: 'Portes ouvertes', text: 'Immatriculé, bancarisé, assuré et logé. Vous commencez à facturer pendant que nous finissons les derniers détails.' },
        ],
      },
      faq: {
        title: 'Les fondateurs nous demandent',
        items: [
          {
            q: 'Puis-je créer une entreprise néerlandaise sans vivre aux Pays-Bas ?',
            a: 'Vous pouvez détenir une société néerlandaise depuis l’étranger, mais la diriger sur place en tant que ressortissant hors UE exige une base de séjour. Nous vous aidons à décider si vous devez vraiment déménager, et si oui, avec quel permis.',
          },
          {
            q: 'Ai-je besoin d’un associé néerlandais ?',
            a: 'Non. Les Pays-Bas n’exigent ni actionnaires ni administrateurs locaux pour la plupart des structures. Votre société peut être entièrement la vôtre.',
          },
          {
            q: 'Combien de temps avant de pouvoir réellement commercer ?',
            a: 'Pour les citoyens de l’UE, quelques jours. Pour les fondateurs hors UE, le permis dicte le rythme, et nous confirmons les délais IND en vigueur lors de votre entretien pour que votre date de lancement soit réaliste dès le premier jour.',
          },
        ],
      },
      cta: {
        title: 'Votre entreprise a sa place ici',
        text: 'Décrivez votre activité en deux phrases. Nous reviendrons avec la route, la structure et les trois premières étapes.',
        label: 'Tracer ma route',
      },
      form: 'immigration',
      image: '/images/start-business.jpg',
      imageAlt: 'Entrepreneuse ouvrant la porte de son nouvel espace de bureau',
    },
    {
      slug: 'company-registration-netherlands',
      menuLabel: 'Constitution de société',
      title: 'Immatriculation de société Pays-Bas',
      metaTitle: 'Immatriculation de société Pays-Bas pour fondateurs étrangers',
      metaDescription:
        'Immatriculez votre société néerlandaise sans faux pas : forme juridique, notaire, KvK, TVA et compte bancaire, avec un accompagnement personnel pour fondateurs étrangers et entreprises internationales.',
      eyebrow: 'Constitution de société',
      intro: [
        'Immatriculer une société néerlandaise est mécaniquement simple et stratégiquement facile à rater. La forme juridique que vous choisissez au premier jour détermine votre responsabilité, votre position fiscale et, pour les fondateurs étrangers, la fluidité avec laquelle votre séjour et votre banque s’enchaînent ensuite.',
        'Nous pilotons la constitution de bout en bout et dans le bon ordre, avec le notaire, la Chambre de commerce, le fisc et la banque recevant chacun exactement ce qu’il leur faut du premier coup.',
      ],
      cardText: 'La constitution prise en charge de bout en bout : forme juridique, notaire, KvK, TVA et banque.',
      forWho: {
        title: 'Nous immatriculons des sociétés pour',
        items: [
          'Fondateurs étrangers établissant leur première entité néerlandaise',
          'Entreprises internationales ouvrant une succursale ou une filiale néerlandaise',
          'Demandeurs DAFT et visa start-up dont le permis dépend d’un montage propre',
          'Structures de holding qui ont besoin d’une société opérationnelle néerlandaise',
        ],
      },
      included: {
        title: 'Le montage, pièce par pièce',
        blocks: [
          {
            title: 'Structure et nom',
            text: 'BV, succursale ou entreprise individuelle, choisie pour votre situation, plus une vérification du nom commercial avant que vous n’imprimiez quoi que ce soit.',
          },
          {
            title: 'Coordination notariale',
            text: 'Une BV se constitue par acte notarié néerlandais. Nous briefons le notaire, préparons les informations d’actionnariat et organisons la signature, y compris avec des fondateurs encore à l’étranger.',
          },
          {
            title: 'Immatriculation KvK et fiscale',
            text: 'Inscription au registre du commerce, déclaration UBO et le numéro de TVA de la Belastingdienst qui vous permet de facturer.',
          },
          {
            title: 'Banque professionnelle',
            text: 'Les banques néerlandaises sont prudentes avec les fondateurs étrangers. Nous préparons le dossier qui répond à leurs questions de conformité et vous introduisons là où nous le pouvons.',
          },
          {
            title: 'Adresse de siège',
            text: 'Toute société néerlandaise a besoin d’une adresse réelle. Nous vous aidons à trouver des locaux ou un siège conforme avant le début des dépôts.',
          },
        ],
      },
      process: {
        title: 'Le déroulé de la constitution',
        steps: [
          { title: 'Concevoir', text: 'Structure, actionnaires et adresse décidés en une session de travail.' },
          { title: 'Exécuter', text: 'Acte notarié, inscription KvK et déclarations fiscales accomplis dans l’ordre.' },
          { title: 'Opérer', text: 'Compte bancaire ouvert, numéro de TVA actif, et votre société prête à signer son premier contrat.' },
        ],
      },
      note: 'Si votre permis de séjour est encore en cours d’instruction, l’ordre des opérations compte : certaines étapes peuvent avancer avant l’arrivée et d’autres non. Nous planifions la séquence autour de votre calendrier d’immigration.',
      faq: {
        title: 'Avant de constituer',
        items: [
          {
            q: 'Dois-je être aux Pays-Bas pour constituer la société ?',
            a: 'Pas nécessairement. Une BV peut être constituée par procuration pendant que vous êtes à l’étranger, et nous coordonnons les signatures légalisées que le notaire exige.',
          },
          {
            q: 'BV ou eenmanszaak, que choisir ?',
            a: 'Une BV limite la responsabilité et convient à la croissance et aux investisseurs ; une eenmanszaak est plus légère et moins chère à faire vivre. Les facteurs fiscaux et migratoires font pencher la balance au cas par cas, alors nous conseillons sur vos chiffres, pas sur une règle empirique.',
          },
          {
            q: 'Quel capital social faut-il pour une BV ?',
            a: 'Le droit néerlandais permet de fonder une BV avec un capital symbolique, même un centime d’euro. Ce qui compte, c’est une capitalisation adaptée à votre plan d’affaires et, le cas échéant, aux conditions de votre permis.',
          },
        ],
      },
      cta: {
        title: 'Constituez-la proprement, une seule fois',
        text: 'Dites-nous ce que fera la société et qui la détient. Nous proposerons la structure et lancerons le chronomètre.',
        label: 'Monter ma société',
      },
      form: 'immigration',
      image: '/images/business-signing.jpg?v=20260728',
      imageAlt: 'Fondateur signant des actes de constitution chez un notaire néerlandais',
    },
    {
      slug: 'kvk-registration-for-foreigners-netherlands',
      menuLabel: 'Inscription KvK',
      title: 'Inscription KvK pour étrangers',
      metaTitle: 'Inscription KvK pour étrangers | Chambre de commerce néerlandaise',
      metaDescription:
        'Inscrivez-vous à la Chambre de commerce néerlandaise en tant qu’étranger sans confusion. Préparation du rendez-vous, documents, codes SBI et accompagnement personnel à la KvK.',
      eyebrow: 'Chambre de commerce',
      intro: [
        'Toute entreprise aux Pays-Bas commence à la Kamer van Koophandel, et pour les étrangers le rendez-vous KvK est l’endroit où les papiers rencontrent la réalité : identification, adresse professionnelle néerlandaise, codes d’activité et questions posées dans un système conçu pour les locaux.',
        'Nous préparons toute l’inscription, puis Johanna vous accompagne au rendez-vous lui-même, pour que la langue, un document manquant ou une question inattendue ne vous coûtent jamais une seconde visite.',
      ],
      cardText: 'Votre inscription à la Chambre de commerce préparée, réservée et effectuée ensemble.',
      forWho: {
        title: 'Avec qui nous entrons',
        items: [
          'Freelances et indépendants enregistrant une eenmanszaak',
          'Demandeurs DAFT dont le permis exige une inscription KvK',
          'Citoyens de l’UE commençant à travailler en indépendant aux Pays-Bas',
          'Fondateurs qui hésitent sur les activités et codes à enregistrer',
        ],
      },
      included: {
        title: 'Autour de votre inscription',
        blocks: [
          {
            title: 'Revue des documents',
            text: 'Passeport, justificatif d’adresse et preuves de vos activités professionnelles, vérifiés au regard des exigences de la KvK avant toute réservation.',
          },
          {
            title: 'Solutions d’adresse professionnelle',
            text: 'La KvK exige une véritable adresse professionnelle néerlandaise, et une chambre d’hôtel ne compte pas. Nous vous aidons à en trouver une qui satisfasse à la fois la KvK et le fisc.',
          },
          {
            title: 'Codes SBI et description',
            text: 'Vos activités enregistrées alimentent assurance, banque et impôts. Nous choisissons les codes délibérément, pas sur le vif au guichet.',
          },
          {
            title: 'Rendez-vous et suivi',
            text: 'Nous réservons le rendez-vous, y assistons avec vous, puis confirmons que votre numéro KvK, votre extrait et votre immatriculation TVA arrivent tous comme prévu.',
          },
        ],
      },
      process: {
        title: 'Trois étapes vers votre numéro KvK',
        steps: [
          { title: 'Préparer', text: 'Documents, adresse et description d’activité finalisés ensemble.' },
          { title: 'S’inscrire', text: 'Nous vous accompagnons au bureau de la KvK et gérons les imprévus sur place.' },
          { title: 'Confirmer', text: 'Numéro KvK délivré, numéro de TVA suivi et copies classées là où votre banque et votre comptable en ont besoin.' },
        ],
      },
      note: 'Si vous n’avez pas encore de BSN, l’inscription reste possible dans bien des situations, mais la voie diffère. Mentionnez-le quand vous nous contactez et nous planifierons en conséquence.',
      faq: {
        title: 'Questions KvK',
        items: [
          {
            q: 'Puis-je m’inscrire à la KvK sans vivre encore aux Pays-Bas ?',
            a: 'Dans certains cas, oui, si votre activité opère réellement depuis une adresse néerlandaise. Le montage diffère d’une inscription de résident, et nous évaluons lequel s’applique à vous.',
          },
          {
            q: 'Combien coûte l’inscription à la KvK ?',
            a: 'La KvK facture des frais d’inscription uniques et modestes, qui changent périodiquement. Nous confirmons le montant en vigueur en réservant votre rendez-vous, et il n’y a aucun frais caché ensuite.',
          },
          {
            q: 'Est-ce que je reçois mon numéro de TVA à la KvK ?',
            a: 'La KvK transmet votre inscription à la Belastingdienst, qui délivre ensuite le numéro de TVA. Nous suivons ce relais pour que vous ne restiez pas à attendre en silence, incapable de facturer.',
          },
        ],
      },
      cta: {
        title: 'Faisons votre inscription',
        text: 'Envoyez-nous votre situation et votre date de début souhaitée. Nous préparerons tout et réserverons la KvK ensemble.',
        label: 'Réserver mon inscription KvK',
      },
      form: 'immigration',
      image: '/images/kvk-registration.jpg',
      imageAlt: 'Entrepreneur recevant un extrait d’immatriculation de société à un guichet',
    },
    {
      slug: 'relocation-services-for-entrepreneurs-netherlands',
      menuLabel: 'Relocation entrepreneurs',
      title: 'Services de relocation pour entrepreneurs Pays-Bas',
      metaTitle: 'Services de relocation pour entrepreneurs Pays-Bas | E & I',
      metaDescription:
        'Une relocation pensée pour les entrepreneurs s’installant aux Pays-Bas : permis, logement, famille et entreprise montés comme un seul projet, avec un point de contact personnel unique.',
      eyebrow: 'Relocation',
      intro: [
        'Un salarié qui s’expatrie a un service RH. Un entrepreneur qui s’expatrie a une liste de tâches qui se rebiffe : un permis qui dépend d’une société, une société qui a besoin d’une adresse, une adresse qui exige une inscription, et une famille qui attend tout cela. Les forfaits de relocation standard ne sont pas faits pour ce casse-tête circulaire.',
        'Le nôtre, si. Nous menons votre installation comme un seul projet avec un seul responsable, et parce que les questions n’attendent pas les heures de bureau, vous nous joignez sur une ligne WhatsApp personnelle 24h/24 et 7j/7, du premier carton au dernier formulaire signé.',
      ],
      cardText: 'L’installation, le permis, la société et la famille, menés comme un seul projet.',
      forWho: {
        title: 'Les entrepreneurs que nous installons',
        items: [
          'Fondateurs qui relocalisent en même temps leur personne et leur société',
          'Indépendants sous permis DAFT ou permis d’indépendant',
          'Entrepreneurs venant avec un partenaire et des enfants',
          'Chefs d’entreprise qui ont tenté de tout organiser à distance et se sont retrouvés bloqués',
        ],
      },
      included: {
        title: 'Un projet, tous les fils',
        blocks: [
          {
            title: 'Un séquencement qui fonctionne',
            text: 'Nous ordonnons les étapes permis, société, logement et inscription pour que chacune déverrouille la suivante au lieu de la bloquer.',
          },
          {
            title: 'Recherche de logement avec logique d’entreprise',
            text: 'Un logement qui convient à votre famille et tient la route comme adresse d’enregistrement pour vous et, quand c’est judicieux, pour votre société.',
          },
          {
            title: 'Atterrissage administratif',
            text: 'Inscription communale, BSN, assurance santé et les praticités néerlandaises comme DigiD, réglées dans vos premières semaines.',
          },
          {
            title: 'Installation de la famille',
            text: 'Écoles, garde d’enfants et découverte du quartier pour ceux qui n’ont pas choisi cette aventure mais la vivent avec vous.',
          },
        ],
      },
      process: {
        title: 'Le déroulé de votre installation',
        steps: [
          { title: 'Plan directeur', text: 'Un plan couvrant permis, société, logement et famille, avec des dépendances rendues explicites.' },
          { title: 'Exécution', text: 'Nous menons les chantiers en parallèle et rendons compte en langage clair, pas en notifications de portail.' },
          { title: 'Installé', text: 'Vous êtes inscrit, logé, bancarisé et opérationnel, et votre famille sait où est la bonne boulangerie.' },
        ],
      },
      faq: {
        title: 'Ce que demandent les entrepreneurs',
        items: [
          {
            q: 'Pouvez-vous gérer toute l’installation ou seulement des parties ?',
            a: 'Les deux. La plupart des entrepreneurs nous confient le projet entier, mais vous pouvez aussi nous appeler pour la pièce qui coince, généralement le logement ou la séquence du permis.',
          },
          {
            q: 'Quand dois-je vous impliquer, avant ou après mon permis ?',
            a: 'Avant, idéalement. La voie du permis influence la structure de la société et même l’endroit où vous devriez vivre. Nous impliquer tôt évite des reprises coûteuses.',
          },
          {
            q: 'Travaillez-vous avec des entrepreneurs hors de la Randstad ?',
            a: 'Oui. Nous travaillons dans tous les Pays-Bas, avec une profondeur particulière autour de Rotterdam et de la région industrielle du sud où beaucoup de nos clients bâtissent leur entreprise.',
          },
        ],
      },
      cta: {
        title: 'Déménagez comme si c’était votre meilleure décision d’affaires',
        text: 'Dites-nous où vous en êtes : permis, société, famille, logement. Nous vous montrerons l’ordre qui vous installe le plus vite.',
        label: 'Lancer mon plan de relocation',
      },
      form: 'immigration',
      image: '/images/entrepreneur-relocation.jpg',
      imageAlt: 'Fondateur portant un carton et un ordinateur portable dans un nouveau bureau',
    },
    {
      slug: 'business-relocation-to-the-netherlands',
      menuLabel: 'Relocalisation d’entreprise',
      title: 'Relocalisation d’entreprise aux Pays-Bas',
      metaTitle: 'Relocalisation d’entreprise aux Pays-Bas | Entreprises et équipes',
      metaDescription:
        'Relocalisez votre entreprise et vos collaborateurs aux Pays-Bas : création d’entité, permis de travail et relocations multi-familles pour des équipes entières, pilotées par un seul partenaire.',
      eyebrow: 'Entreprises',
      intro: [
        'Déplacer une entreprise aux Pays-Bas, ce sont en réalité deux déménagements : la société, avec son entité, ses contrats et ses immatriculations, et les personnes, avec leurs permis, leurs maisons, leurs écoles et leurs conjoints. Les entreprises qui planifient le premier et improvisent le second perdent précisément les collaborateurs pour lesquels le déménagement avait lieu.',
        'Nous sommes construits pour les deux, et notre terrain est la région industrielle de Rotterdam, Europoort et la Maasvlakte, où les entreprises internationales de l’énergie, de la logistique et de l’offshore posent leurs opérations européennes. Nous relocalisons des équipes entières et leurs familles comme un seul programme coordonné.',
      ],
      cardText: 'Des relocalisations d’entreprise qui déplacent l’entité, l’équipe et chaque famille derrière elle.',
      forWho: {
        title: 'Qui fait appel à nous',
        items: [
          'Entreprises internationales ouvrant un bureau, une usine ou une succursale aux Pays-Bas',
          'Sociétés transférant d’un coup une équipe de spécialistes et leurs familles',
          'Responsables RH et mobilité qui ont besoin d’un partenaire local responsable et unique',
          'Entreprises des secteurs portuaire, énergétique, logistique et offshore s’implantant dans la région',
        ],
      },
      included: {
        title: 'Le programme entreprise',
        blocks: [
          {
            title: 'Entité et conformité',
            text: 'Entité ou succursale néerlandaise établie, immatriculée et prête à employer, en coordination avec vos conseils juridiques et fiscaux.',
          },
          {
            title: 'Sponsoring reconnu et permis',
            text: 'Nous guidons votre entreprise vers le statut de sponsor reconnu IND quand c’est nécessaire et pilotons les demandes de permis de travail de chaque salarié transféré.',
          },
          {
            title: 'Relocation multi-familles',
            text: 'Chaque famille a sa propre recherche de logement, ses placements scolaires et son parcours d’installation, menés en parallèle pour que toute l’équipe démarre à l’heure.',
          },
          {
            title: 'Un tableau de bord unique pour les RH',
            text: 'Un point de contact unique et une vision claire de l’avancement de chaque salarié et de chaque famille, au lieu de trente fils d’e-mails dispersés.',
          },
          {
            title: 'Un suivi qui retient les talents',
            text: 'Les premiers mois décident si les familles restent. Nous restons disponibles pour vos collaborateurs après l’arrivée, ce qui protège l’investissement consenti pour les déplacer.',
          },
        ],
      },
      process: {
        title: 'De la décision à l’opérationnel',
        steps: [
          { title: 'Cadrer', text: 'Nous traduisons les besoins d’entité, l’effectif, les familles et l’échéance en un seul plan de programme.' },
          { title: 'Mobiliser', text: 'Création de la société et demandes de permis avancent pendant que logements et écoles sont sécurisés par famille.' },
          { title: 'Faire atterrir l’équipe', text: 'Les arrivées sont échelonnées et accompagnées, les inscriptions bouclées, et votre implantation néerlandaise ouvre avec ses équipes au complet.' },
        ],
      },
      faq: {
        title: 'Questions des RH et de la direction',
        items: [
          {
            q: 'Combien de salariés pouvez-vous relocaliser à la fois ?',
            a: 'Notre modèle est délibérément boutique : moins de programmes, menés en profondeur. Nous acceptons des relocations d’équipe à une échelle où chaque famille reçoit encore une attention personnelle, et nous sommes honnêtes quand une demande la dépasse.',
          },
          {
            q: 'Pouvez-vous travailler aux côtés de nos conseils juridiques ou fiscaux existants ?',
            a: 'Oui, et nous le préférons. Nous coordonnons le volet pratique et humain et nous insérons dans la structure que vos conseils conçoivent.',
          },
          {
            q: 'Combien coûte une relocalisation d’entreprise ?',
            a: 'Cela dépend de l’effectif, de la taille des familles et des exigences de logement. Nous cadrons d’abord le programme puis proposons un forfait projet clair, pas un compteur horaire qui tourne en arrière-plan.',
          },
        ],
      },
      cta: {
        title: 'Déplacez l’entreprise. Gardez les personnes.',
        text: 'Indiquez-nous la taille de l’équipe et la date cible. Nous reviendrons avec les grandes lignes du programme et un calendrier réaliste.',
        label: 'Discuter de notre projet d’entreprise',
      },
      form: 'immigration',
      image: '/images/business-relocation.jpg',
      imageAlt: 'Équipe transportant des caisses dans un immeuble de bureaux moderne',
    },
    {
      slug: 'housing-support-for-entrepreneurs-netherlands',
      menuLabel: 'Logement pour entrepreneurs',
      title: 'Accompagnement logement pour entrepreneurs Pays-Bas',
      metaTitle: 'Accompagnement logement pour entrepreneurs aux Pays-Bas | E & I',
      metaDescription:
        'Accompagnement logement pour entrepreneurs aux Pays-Bas : locations sans fiches de paie, adresses enregistrables et visites accompagnées en personne sur un marché exigeant.',
      eyebrow: 'Logement',
      intro: [
        'Le marché du logement néerlandais est dur pour tous et le plus dur pour les entrepreneurs. Les propriétaires veulent des fiches de paie et des attestations d’employeur ; vous avez une jeune société, des relevés bancaires étrangers et une belle histoire que personne, lors d’une visite bondée, ne reste écouter.',
        'Cette histoire, nous la racontons pour vous. Nous savons quels propriétaires et agents acceptent les revenus d’entrepreneur, comment présenter le dossier d’un fondateur pour qu’il l’emporte face aux candidats salariés, et nous assistons aux visites avec vous ou pour vous quand vous êtes encore à l’étranger.',
      ],
      cardText: 'Gagner des locations sans fiches de paie : dossiers, visites et négociations pour fondateurs.',
      forWho: {
        title: 'Qui en a besoin',
        items: [
          'Fondateurs arrivant sous visa start-up, DAFT ou permis d’indépendant',
          'Entrepreneurs dont les revenus sont réels mais ne rentrent pas dans les cases des propriétaires',
          'Chefs d’entreprise cherchant depuis l’étranger qui ne peuvent pas assister aux visites',
          'Familles d’entrepreneurs qui ont besoin d’un logement près des écoles et de l’entreprise',
        ],
      },
      included: {
        title: 'Comment nous vous gagnons un logement',
        blocks: [
          {
            title: 'Un dossier qui convainc les propriétaires',
            text: 'Comptes d’entreprise, contrats et références présentés dans le format auquel les propriétaires et agents néerlandais font réellement confiance de la part de locataires indépendants.',
          },
          {
            title: 'Recherche ciblée',
            text: 'Nous cherchons là où votre enregistrement, votre trajet et vos besoins familiaux se rejoignent, y compris des biens hors marché via notre réseau d’agents.',
          },
          {
            title: 'Des visites accompagnées',
            text: 'Nous visitons avec vous, ou en vidéo pour vous, et vous donnons un verdict honnête sur la rue, l’immeuble et les conditions du contrat.',
          },
          {
            title: 'Négociation et vérification du contrat',
            text: 'Prix, dépôt et clauses négociés, et le bail relu avant votre signature, y compris la question de savoir si l’adresse permet l’enregistrement de l’entreprise.',
          },
        ],
      },
      process: {
        title: 'La recherche, structurée',
        steps: [
          { title: 'Profil', text: 'Budget, secteurs, besoins familiaux et exigences d’enregistrement définis en un appel.' },
          { title: 'Chasse', text: 'Nous présélectionnons, réservons et visitons vite, car ici les bons logements partent en quelques jours.' },
          { title: 'Sécuriser', text: 'Offre négociée, contrat vérifié, clés remises, enregistrement organisé.' },
        ],
      },
      note: 'Un logement temporaire peut faire le pont pendant la recherche, mais toutes les adresses de courte durée ne permettent pas l’inscription communale. Nous signalons cette distinction avant que vous ne vous engagiez à quoi que ce soit.',
      faq: {
        title: 'Questions logement des entrepreneurs',
        items: [
          {
            q: 'Puis-je louer sans fiches de paie néerlandaises ?',
            a: 'Oui, avec la bonne présentation. Les propriétaires acceptent les revenus d’entrepreneur quand ils sont documentés de façon convaincante, et certains demandent un dépôt supplémentaire ou un loyer prépayé. Nous négocions ces conditions vers quelque chose de raisonnable.',
          },
          {
            q: 'Puis-je enregistrer ma société à mon adresse personnelle ?',
            a: 'Souvent, si le bail le permet et si les activités conviennent à un cadre résidentiel. Nous vérifions le contrat et les règles de la commune pour votre cas précis avant votre signature.',
          },
          {
            q: 'En combien de temps pouvez-vous trouver ?',
            a: 'Cela dépend du budget et du secteur, et nous vous dirons honnêtement dès l’entretien ce que vos critères donnent sur le marché actuel. Ce que nous ne faisons jamais, c’est vous laisser prendre l’avion sans plan pour savoir où vous dormirez et vous enregistrerez.',
          },
        ],
      },
      cta: {
        title: 'Trouvez un logement qui travaille aussi dur que vous',
        text: 'Partagez votre budget, vos secteurs et votre date de déménagement. Nous vous dirons ce qui est réaliste et lancerons la recherche cette semaine.',
        label: 'Lancer ma recherche de logement',
      },
      form: 'immigration',
      image: '/images/entrepreneur-housing.jpg',
      imageAlt: 'Loft lumineux mêlant logement et travail avec un bureau près de la fenêtre',
    },
  ],
  crossLinks: [
    {
      path: '/immigration/startup-visa-netherlands',
      label: 'Visa start-up',
      text: 'Un permis fondateur d’un an pour bâtir votre entreprise innovante avec un facilitateur reconnu.',
    },
    {
      path: '/immigration/daft-visa-netherlands',
      label: 'Visa DAFT',
      text: 'La voie du traité qui permet aux Américains de vivre et travailler aux Pays-Bas avec un investissement de 4 500 €.',
    },
  ],
};
