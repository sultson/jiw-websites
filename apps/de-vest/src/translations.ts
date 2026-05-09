export type Lang = 'nl' | 'en';

const nl: Record<string, string> = {
  // Nav
  'nav.work': 'Werk',
  'nav.services': 'Diensten',
  'nav.method': 'Werkwijze',
  'nav.history': 'Historie',
  'nav.contact': 'Contact',
  'nav.cta': 'Vraag offerte aan',
  'nav.phone': '06 53 86 00 31',

  // Hero
  'hero.kicker': 'Sinds 1930 · Drie generaties',
  'hero.title': 'Drie generaties schildersvak in Eindhoven en de Kempen.',
  'hero.lede':
    'Schilderwerk, wandafwerking en behang, latex en lak spuiten, glaszetten en restauratie. Voor particulieren en bedrijven, binnen en buiten, met de zorg van een familiebedrijf.',
  'hero.cta.intake': 'Vraag offerte aan',
  'hero.cta.call': 'Bel 06 53 86 00 31',
  'hero.proof.heading': 'Vakkaart',
  'hero.proof.row1.label': 'Sinds',
  'hero.proof.row1.value': '1930',
  'hero.proof.row2.label': 'Generaties',
  'hero.proof.row2.value': 'Drie · Antoon, Pierre, Toon',
  'hero.proof.row3.label': 'Certificering',
  'hero.proof.row3.value': 'VCA',
  'hero.proof.row4.label': 'Werkgebied',
  'hero.proof.row4.value': 'Eindhoven · de Kempen',
  'hero.proof.row5.label': 'Materialen',
  'hero.proof.row5.value': 'Sigma · Sikkens · Caparol',

  // Vakgebieden / Services
  'services.kicker': 'Vakgebieden',
  'services.title': 'Wat wij doen, zonder omwegen.',
  'services.lede':
    'Van een enkele voordeur tot het volledige interieur van een woning, van een stijlvolle behangwand tot het restaureren van een oude boerderij. Vraag wat u nodig heeft, dan kijken wij wat het vraagt.',
  'services.cta': 'Vraag offerte aan',

  'svc.paint.title': 'Schilderwerk',
  'svc.paint.sub': 'Binnen en buiten',
  'svc.paint.body':
    'Voor schilderwerk van vrijwel alles bent u bij ons aan het goede adres. Van één enkele deur tot uw complete bedrijf of huis.',
  'svc.paint.b1': 'Buitenschilderwerk en kozijnen',
  'svc.paint.b2': 'Binnenschilderwerk en deuren',
  'svc.paint.b3': 'Onderhoudsadvies per object',
  'svc.paint.cta': 'Meer over schilderwerk',

  'svc.wall.title': 'Wandafwerking en behang',
  'svc.wall.sub': 'Vlies, exclusief, akoestisch',
  'svc.wall.body':
    'Wij plakken behang van Arte, Elitis, Casamance, Vescom en Koroseal. Van strakke vliesbanen tot 3D akoestische wandbekleding.',
  'svc.wall.b1': 'Vliesbehang en fotobehang',
  'svc.wall.b2': 'Exclusieve merken',
  'svc.wall.b3': '3D akoestische wandbekleding',
  'svc.wall.cta': 'Meer over wandafwerking',

  'svc.spray.title': 'Latex en lak spuiten',
  'svc.spray.sub': 'Strak, mat, fabrieksafwerking',
  'svc.spray.body':
    'Spuitwerk geeft een egale en uniforme afwerking, zonder strepen of oneffenheden. Ideaal voor wanden, plafonds, deuren, kozijnen en meubels.',
  'svc.spray.b1': 'Latex spuiten op wanden en plafonds',
  'svc.spray.b2': 'Lak spuiten op hout en metaal',
  'svc.spray.b3': 'Werken met Caparol, Sikkens en Sigma',
  'svc.spray.cta': 'Meer over spuitwerk',

  'svc.glass.title': 'Glaszetten',
  'svc.glass.sub': 'Snel en grondig',
  'svc.glass.body':
    'Ruit defect of vervangen? Wij maken het snel en grondig in orde, met aandacht voor kit en kozijn.',
  'svc.glass.b1': 'Enkel en isolatieglas',
  'svc.glass.b2': 'Hersteldrukke kozijnen',
  'svc.glass.b3': 'Spoedreparatie waar mogelijk',
  'svc.glass.cta': 'Meer over glaszetten',

  'svc.heritage.title': 'Restauratie en decoratief',
  'svc.heritage.sub': 'Imitatiemarmer, glas in lood, sierpleister',
  'svc.heritage.body':
    'Antoon Hoevenaars maakte zijn naam met decoratief schilderwerk. Wij brengen die kennis ook vandaag naar oude boerderijen, bankgebouwen en monumenten.',
  'svc.heritage.b1': 'Imitatiemarmer en imitatiehout',
  'svc.heritage.b2': 'Glas in lood en sierpleister',
  'svc.heritage.b3': 'Restauratie op locatie',
  'svc.heritage.cta': 'Meer over restauratie',

  // Werkwijze
  'method.kicker': 'Werkwijze',
  'method.title': 'Zes stappen, geen verrassingen.',
  'method.lede':
    'Van een eerste vrijblijvend bezoek tot de jaarlijkse onderhoudsinspectie. Helder, eerlijk, en zonder verkooppraat.',

  'method.s1.title': 'Gesprek',
  'method.s1.body':
    'Een van onze meesterschilders komt vrijblijvend bij u langs. We bespreken welke werkzaamheden u wil laten uitvoeren.',

  'method.s2.title': 'Vrijblijvende offerte',
  'method.s2.body':
    'Een uitgebreide, gedetailleerde offerte volgens de geldende normen. Pas akkoord als alles klopt.',

  'method.s3.title': 'Akkoord',
  'method.s3.body':
    'Na akkoord plannen we de praktische zaken. Waar starten we, hoe is de toegang, waar moeten we rekening mee houden.',

  'method.s4.title': 'Uitvoering',
  'method.s4.body':
    'Onze schilders zijn Nederlandstalig en zelf opgeleid of vakopgeleid. Geen radio, pauze op de afgesproken tijden, en aan het eind van de dag alles netjes achtergelaten.',

  'method.s5.title': 'Oplevering',
  'method.s5.body':
    'We lopen het werk samen met u na. Wij vertrekken pas als u aangeeft volledig tevreden te zijn.',

  'method.s6.title': 'Onderhoud',
  'method.s6.body':
    'Geen onderhoudscontract. Wel komt een meesterschilder ieder jaar het buitenschilderwerk inspecteren, tot het moment dat onderhoud nodig is. In overleg, meestal op regie.',

  // Werk
  'work.kicker': 'Werk',
  'work.title': 'Een greep uit recente projecten.',
  'work.lede':
    'Behang, spuitwerk, voordeuren, appartementen en restauraties. Foto’s rechtstreeks uit de werkkast.',
  'work.cta.more': 'Meer op Instagram',

  // Behang band
  'behang.kicker': 'Wandafwerking',
  'behang.title': 'Behang als handwerk.',
  'behang.lede':
    'Wij plakken vlies, schuim, akoestisch en de meer eigenzinnige collecties van Arte, Elitis, Casamance, Vescom en Koroseal.',

  // Historie
  'history.kicker': 'Historie',
  'history.title': 'Drie generaties Hoevenaars.',
  'history.lede':
    'Een schildersbedrijf bestaat zolang er iemand is die het wil voortzetten. Wij doen dat sinds rond 1930.',
  'history.gen1.year': '1930',
  'history.gen1.mark': '№ I',
  'history.gen1.name': 'Antoon Hoevenaars',
  'history.gen1.body':
    'Antoon begint Schildersbedrijf Hoevenaars en richt zich op schilder- en behangklussen voor particulieren. Na de oorlog groeit het bedrijf mee met de wederopbouw, met opdrachten voor scholen, woningen en kloosters. Antoon is bekend om zijn ambachtelijke werk: glas in lood, decoratief schilderen, imitatiemarmer en imitatiehout.',
  'history.gen2.year': '1970s',
  'history.gen2.mark': '№ II',
  'history.gen2.name': 'Pierre Hoevenaars',
  'history.gen2.body':
    'Pierre zet het bedrijf voort, eerst aan de Peperstraat. Later verhuist de onderneming naar het industrieterrein De Vest in Valkenswaard. De naam wordt De Vest Schilderwerken. Het werk verandert mee: casino’s, bankgebouwen, oude boerderijen. Sierpleisters en spuittechnieken worden onderdeel van het palet.',
  'history.gen3.year': 'Vandaag',
  'history.gen3.mark': '№ III',
  'history.gen3.name': 'Toon Hoevenaars',
  'history.gen3.body':
    'Toon, vernoemd naar zijn opa, voert het werk voort in zowel de particuliere als zakelijke sector. Met die historie en een gezonde dosis frisse plannen kijken wij vooruit.',

  // Reviews + Materialen
  'reviews.kicker': 'Wat klanten zeggen',
  'reviews.title': 'Twee korte oordelen, eerlijk weergegeven.',
  'reviews.q1.text': 'Vaklui bij De Vest.',
  'reviews.q1.author': 'Frank van Hooff',
  'reviews.q1.context': 'Local Guide · 22 reviews · Google',
  'reviews.q2.text': 'Stiptheid, kwaliteit, professionaliteit, waarde.',
  'reviews.q2.author': 'Barbara Hoevenaars',
  'reviews.q2.context': 'Google review',
  'reviews.gmaps': 'Lees op Google Maps',

  'materials.kicker': 'Materialen',
  'materials.title': 'Waar wij mee werken.',
  'materials.body':
    'Wij werken alleen met de beste producten zoals Sigma, Sikkens, Trimetal, Caparol en Veveo. Behang van onder andere Arte, Elitis, Casamance, Vescom en Koroseal.',

  // FAQ
  'faq.kicker': 'Veelgestelde vragen',
  'faq.title': 'Wat u meestal als eerste wil weten.',

  'faq.q1.q': 'Werken jullie ook voor particulieren?',
  'faq.q1.a':
    'Ja. Wij werken zowel voor particulieren als voor bedrijven, voor één enkele deur tot een compleet pand.',
  'faq.q2.q': 'Komen jullie kijken voordat er iets op papier staat?',
  'faq.q2.a':
    'Ja. Een meesterschilder komt vrijblijvend bij u langs. Pas dan brengen wij offerte uit, gedetailleerd en volgens de geldende normen.',
  'faq.q3.q': 'Met welke verfmerken werken jullie?',
  'faq.q3.a':
    'Sigma, Sikkens, Trimetal, Caparol en Veveo. Voor behang werken wij onder meer met Arte, Elitis, Casamance, Vescom en Koroseal.',
  'faq.q4.q': 'Wat houdt jullie jaarlijkse onderhoudsbezoek in?',
  'faq.q4.a':
    'Wij werken niet met onderhoudscontracten. In plaats daarvan komt een meesterschilder ieder jaar het buitenschilderwerk inspecteren, tot het moment dat onderhoud nodig is. Dat plannen wij dan in overleg, meestal op basis van regie.',
  'faq.q5.q': 'Werken jullie alleen in Eindhoven?',
  'faq.q5.a':
    'Ons werkgebied is Eindhoven en de Kempen. Valkenswaard, Waalre, Veldhoven, Geldrop en omgeving zijn vertrouwd terrein. Voor projecten erbuiten gaan wij graag in gesprek.',
  'faq.q6.q': 'Zijn jullie VCA gecertificeerd?',
  'faq.q6.a':
    'Ja. Wij zijn VCA gecertificeerd. Daarmee waarborgen wij de veiligheid van u en onszelf zo goed mogelijk.',

  // Footer
  'footer.tagline': 'Drie generaties schildersvak. Sinds 1930.',
  'footer.contact': 'Contact',
  'footer.address': 'Enzerink 38, 5655 EH Eindhoven',
  'footer.legal': 'KvK 17176973 · BTW NL001698069B93 · IBAN NL84 RBRB 8841 7363 13',
  'footer.copy': '© De Vest Schilderwerken. Alle rechten voorbehouden.',
  'footer.built': 'Site door',
  'footer.builtName': 'Jouw Ideale Website',

  // StickyCta
  'sticky.call': 'Bel',
  'sticky.intake': 'Vraag offerte aan',

  // Intake modal
  'intake.kicker': 'Vrijblijvend',
  'intake.title': 'Vraag een offerte aan',
  'intake.subtitle':
    'Stuur ons een korte omschrijving. Indien gewenst met foto’s. Een meesterschilder komt vrijblijvend bij u langs.',
  'intake.servicePick': 'Kies een dienst',
  'intake.serviceOtherPlaceholder': 'Beschrijf kort waar het om gaat',
  'intake.attachmentsHint': 'JPG of PNG, maximaal 8 foto’s, 12 MB per stuk.',
  'intake.optional': 'optioneel',
  'intake.consent':
    'Ik ga akkoord dat mijn gegevens worden gebruikt om contact met mij op te nemen over deze aanvraag.',
  'intake.successAgain': 'Nieuwe aanvraag',
  'intake.errorGeneric': 'Er ging iets mis. Probeer het zo nog eens of bel 06 53 86 00 31.',
  'intake.field.service': 'Dienst',
  'intake.field.serviceOther': 'Toelichting',
  'intake.field.message': 'Korte omschrijving',
  'intake.field.postalCode': 'Postcode',
  'intake.field.city': 'Plaatsnaam',
  'intake.field.streetName': 'Straat',
  'intake.field.houseNumber': 'Huisnummer',
  'intake.field.name': 'Naam',
  'intake.field.email': 'E-mailadres',
  'intake.field.phone': 'Telefoonnummer',
  'intake.field.photos': "Foto's",
  'intake.opt.paint': 'Schilderwerk',
  'intake.opt.wall': 'Wandafwerking en behang',
  'intake.opt.spray': 'Latex of lak spuiten',
  'intake.opt.glass': 'Glaszetten',
  'intake.opt.heritage': 'Restauratie of decoratief',
  'intake.opt.other': 'Iets anders',
  'intake.next': 'Volgende',
  'intake.back': 'Terug',
  'intake.submit': 'Verstuur aanvraag',
  'intake.submitting': 'Versturen…',
  'intake.success.title': 'Bedankt voor uw aanvraag.',
  'intake.success.body':
    'Wij nemen binnen één werkdag contact op om uw aanvraag door te nemen. Heeft u haast? Bel gerust 06 53 86 00 31.',
  'intake.error.title': 'Versturen mislukt.',
  'intake.error.body':
    'Probeer het zo nog eens, of bel ons rechtstreeks op 06 53 86 00 31.',
  'intake.required': 'Verplicht',
  'intake.dropzone.idle': "Sleep foto's hier of klik om te kiezen",
  'intake.dropzone.hint': 'JPG of PNG, maximaal 8 foto’s, 12 MB per stuk.',
  'intake.dropzone.remove': 'Verwijder',
};

const en: Record<string, string> = {
  // Nav
  'nav.work': 'Work',
  'nav.services': 'Services',
  'nav.method': 'How we work',
  'nav.history': 'History',
  'nav.contact': 'Contact',
  'nav.cta': 'Request a quote',
  'nav.phone': '+31 6 53 86 00 31',

  // Hero
  'hero.kicker': 'Since 1930 · Three generations',
  'hero.title': 'Three generations of painting in Eindhoven and the Kempen.',
  'hero.lede':
    'Painting, wallpaper and wall finishes, latex and lacquer spraying, glazing, and restoration. For homes and businesses, inside and out, with the care of a family firm.',
  'hero.cta.intake': 'Request a quote',
  'hero.cta.call': 'Call +31 6 53 86 00 31',
  'hero.proof.heading': 'Trade card',
  'hero.proof.row1.label': 'Since',
  'hero.proof.row1.value': '1930',
  'hero.proof.row2.label': 'Generations',
  'hero.proof.row2.value': 'Three · Antoon, Pierre, Toon',
  'hero.proof.row3.label': 'Certified',
  'hero.proof.row3.value': 'VCA',
  'hero.proof.row4.label': 'Service area',
  'hero.proof.row4.value': 'Eindhoven · the Kempen',
  'hero.proof.row5.label': 'Materials',
  'hero.proof.row5.value': 'Sigma · Sikkens · Caparol',

  // Services
  'services.kicker': 'Trades',
  'services.title': 'What we do, plainly.',
  'services.lede':
    'From a single front door to a full home interior, from a statement wallpaper to the restoration of an old farmhouse. Tell us what you need; we will tell you what it asks for.',
  'services.cta': 'Request a quote',

  'svc.paint.title': 'Painting',
  'svc.paint.sub': 'Inside and out',
  'svc.paint.body':
    'Painting almost anything is what we do. From a single door to your full home or business premises.',
  'svc.paint.b1': 'Exterior painting and frames',
  'svc.paint.b2': 'Interior painting and doors',
  'svc.paint.b3': 'Maintenance advice per object',
  'svc.paint.cta': 'More on painting',

  'svc.wall.title': 'Wall finishes and wallpaper',
  'svc.wall.sub': 'Non-woven, exclusive, acoustic',
  'svc.wall.body':
    'We hang wallpaper from Arte, Elitis, Casamance, Vescom and Koroseal. From clean non-woven panels to 3D acoustic wall coverings.',
  'svc.wall.b1': 'Non-woven and photo wallpaper',
  'svc.wall.b2': 'Exclusive brands',
  'svc.wall.b3': '3D acoustic wall coverings',
  'svc.wall.cta': 'More on wall finishes',

  'svc.spray.title': 'Latex and lacquer spraying',
  'svc.spray.sub': 'Smooth, matte, factory finish',
  'svc.spray.body':
    'Spraying yields an even, uniform finish without streaks or imperfections. Ideal for walls, ceilings, doors, frames, and furniture.',
  'svc.spray.b1': 'Latex sprayed on walls and ceilings',
  'svc.spray.b2': 'Lacquer sprayed on wood and metal',
  'svc.spray.b3': 'Caparol, Sikkens, and Sigma products',
  'svc.spray.cta': 'More on spray work',

  'svc.glass.title': 'Glazing',
  'svc.glass.sub': 'Quick and thorough',
  'svc.glass.body':
    'Broken pane or replacement glass? We handle it quickly and thoroughly, with attention to sealant and frame.',
  'svc.glass.b1': 'Single and insulating glass',
  'svc.glass.b2': 'Frame repair where needed',
  'svc.glass.b3': 'Emergency repair where possible',
  'svc.glass.cta': 'More on glazing',

  'svc.heritage.title': 'Restoration and decorative',
  'svc.heritage.sub': 'Faux marble, leaded glass, ornamental plaster',
  'svc.heritage.body':
    'Antoon Hoevenaars built his name on decorative work. We carry that knowledge to old farmhouses, bank buildings, and monuments today.',
  'svc.heritage.b1': 'Faux marble and faux wood',
  'svc.heritage.b2': 'Leaded glass and ornamental plaster',
  'svc.heritage.b3': 'On-site restoration',
  'svc.heritage.cta': 'More on restoration',

  // Werkwijze
  'method.kicker': 'How we work',
  'method.title': 'Six steps, no surprises.',
  'method.lede':
    'From a free first visit to the yearly maintenance inspection. Clear, honest, and without sales talk.',

  'method.s1.title': 'Conversation',
  'method.s1.body':
    'One of our master painters visits without obligation to discuss what you would like to have done.',

  'method.s2.title': 'Free quote',
  'method.s2.body':
    'A detailed quote, drawn up to professional standards. You only commit when everything is right.',

  'method.s3.title': 'Approval',
  'method.s3.body':
    'After approval we plan the practical side. Where do we start, how is access, what should we keep in mind.',

  'method.s4.title': 'Execution',
  'method.s4.body':
    'Our painters are Dutch-speaking, trained in-house or vocationally. No radio, breaks at agreed times, and the site left tidy at end of day.',

  'method.s5.title': 'Handover',
  'method.s5.body':
    'We walk the work with you. We do not leave until you say you are fully satisfied.',

  'method.s6.title': 'Maintenance',
  'method.s6.body':
    'No maintenance contract. Each year a master painter inspects exterior paintwork, until maintenance is due. We then plan it together, usually on time-and-materials.',

  // Werk
  'work.kicker': 'Work',
  'work.title': 'A selection of recent projects.',
  'work.lede':
    'Wallpaper, spray work, doors, apartments, and restorations. Photographs straight from the toolbox.',
  'work.cta.more': 'More on Instagram',

  // Behang band
  'behang.kicker': 'Wall finishes',
  'behang.title': 'Wallpaper as craft.',
  'behang.lede':
    'We hang non-woven, foam, acoustic, and the more characterful collections from Arte, Elitis, Casamance, Vescom, and Koroseal.',

  // Historie
  'history.kicker': 'History',
  'history.title': 'Three generations of Hoevenaars.',
  'history.lede':
    'A painting firm exists as long as someone wants to carry it forward. We have done so since around 1930.',
  'history.gen1.year': '1930',
  'history.gen1.mark': '№ I',
  'history.gen1.name': 'Antoon Hoevenaars',
  'history.gen1.body':
    'Antoon founds Schildersbedrijf Hoevenaars and works on painting and wallpapering for private homes. After the war the firm grows with the rebuilding effort, taking on schools, homes, and monasteries. Antoon is known for his craft work: leaded glass, decorative painting, faux marble, and faux wood.',
  'history.gen2.year': '1970s',
  'history.gen2.mark': '№ II',
  'history.gen2.name': 'Pierre Hoevenaars',
  'history.gen2.body':
    'Pierre carries the firm forward, first on Peperstraat, later moving the workshop to the De Vest industrial estate in Valkenswaard. The name becomes De Vest Schilderwerken. The work shifts: casinos, bank buildings, old farmhouses. Decorative plaster and spray techniques join the palette.',
  'history.gen3.year': 'Today',
  'history.gen3.mark': '№ III',
  'history.gen3.name': 'Toon Hoevenaars',
  'history.gen3.body':
    'Toon, named for his grandfather, continues the work for both private and commercial clients. With that history and a fresh round of plans, we look ahead.',

  // Reviews + Materialen
  'reviews.kicker': 'What clients say',
  'reviews.title': 'Two short verdicts, plainly stated.',
  'reviews.q1.text': 'Craftsmen at De Vest.',
  'reviews.q1.author': 'Frank van Hooff',
  'reviews.q1.context': 'Local Guide · 22 reviews · Google',
  'reviews.q2.text': 'Punctuality, quality, professionalism, value.',
  'reviews.q2.author': 'Barbara Hoevenaars',
  'reviews.q2.context': 'Google review',
  'reviews.gmaps': 'Read on Google Maps',

  'materials.kicker': 'Materials',
  'materials.title': 'What we work with.',
  'materials.body':
    'We work only with the best products: Sigma, Sikkens, Trimetal, Caparol, and Veveo. Wallpaper from Arte, Elitis, Casamance, Vescom, Koroseal, among others.',

  // FAQ
  'faq.kicker': 'Frequently asked',
  'faq.title': 'What people usually ask first.',

  'faq.q1.q': 'Do you also work for private homeowners?',
  'faq.q1.a':
    'Yes. We work for both private and business clients, from a single door to an entire premises.',
  'faq.q2.q': 'Will you visit before quoting?',
  'faq.q2.a':
    'Yes. A master painter visits without obligation. Only after that do we issue a detailed quote, drawn up to professional standards.',
  'faq.q3.q': 'Which paint brands do you use?',
  'faq.q3.a':
    'Sigma, Sikkens, Trimetal, Caparol, and Veveo. For wallpaper we work with Arte, Elitis, Casamance, Vescom, and Koroseal, among others.',
  'faq.q4.q': 'What does your yearly maintenance visit involve?',
  'faq.q4.a':
    'We do not work with maintenance contracts. Instead, a master painter inspects exterior paintwork each year, until maintenance is due. We then plan it together, usually on time-and-materials.',
  'faq.q5.q': 'Do you work only in Eindhoven?',
  'faq.q5.a':
    'Our service area is Eindhoven and the Kempen region. Valkenswaard, Waalre, Veldhoven, Geldrop, and surroundings are familiar ground. For projects further afield, we are happy to discuss.',
  'faq.q6.q': 'Are you VCA certified?',
  'faq.q6.a':
    'Yes. We are VCA certified, which keeps everyone on site safe.',

  // Footer
  'footer.tagline': 'Three generations of painting. Since 1930.',
  'footer.contact': 'Contact',
  'footer.address': 'Enzerink 38, 5655 EH Eindhoven',
  'footer.legal': 'KvK 17176973 · VAT NL001698069B93 · IBAN NL84 RBRB 8841 7363 13',
  'footer.copy': '© De Vest Schilderwerken. All rights reserved.',
  'footer.built': 'Site by',
  'footer.builtName': 'Jouw Ideale Website',

  // StickyCta
  'sticky.call': 'Call',
  'sticky.intake': 'Request a quote',

  // Intake modal
  'intake.kicker': 'No obligation',
  'intake.title': 'Request a quote',
  'intake.subtitle':
    'Send us a short description, with photos if helpful. A master painter will visit without obligation.',
  'intake.servicePick': 'Choose a trade',
  'intake.serviceOtherPlaceholder': 'Briefly describe what it is about',
  'intake.attachmentsHint': 'JPG or PNG, up to 8 photos, 12 MB each.',
  'intake.optional': 'optional',
  'intake.consent':
    'I agree to my details being used to contact me about this request.',
  'intake.successAgain': 'New request',
  'intake.errorGeneric': 'Something went wrong. Please try again or call +31 6 53 86 00 31.',
  'intake.field.service': 'Trade',
  'intake.field.serviceOther': 'Details',
  'intake.field.message': 'Short description',
  'intake.field.postalCode': 'Postal code',
  'intake.field.city': 'City',
  'intake.field.streetName': 'Street',
  'intake.field.houseNumber': 'Number',
  'intake.field.name': 'Name',
  'intake.field.email': 'Email',
  'intake.field.phone': 'Phone',
  'intake.field.photos': 'Photos',
  'intake.opt.paint': 'Painting',
  'intake.opt.wall': 'Wall finishes and wallpaper',
  'intake.opt.spray': 'Latex or lacquer spraying',
  'intake.opt.glass': 'Glazing',
  'intake.opt.heritage': 'Restoration or decorative',
  'intake.opt.other': 'Something else',
  'intake.next': 'Next',
  'intake.back': 'Back',
  'intake.submit': 'Send request',
  'intake.submitting': 'Sending…',
  'intake.success.title': 'Thank you for your request.',
  'intake.success.body':
    'We will be in touch within one working day. In a hurry? Call +31 6 53 86 00 31.',
  'intake.error.title': 'Could not send.',
  'intake.error.body':
    'Please try again, or call us directly at +31 6 53 86 00 31.',
  'intake.required': 'Required',
  'intake.dropzone.idle': 'Drop photos here or click to choose',
  'intake.dropzone.hint': 'JPG or PNG, up to 8 photos, 12 MB each.',
  'intake.dropzone.remove': 'Remove',
};

export const translations: Record<Lang, Record<string, string>> = { nl, en };
