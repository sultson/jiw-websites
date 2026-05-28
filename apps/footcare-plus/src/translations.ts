// FootCare+ is NL-only (hyper-local Friesland pedicure practice).
// We keep the Lang type for compatibility with components that import it.
export type Lang = 'nl';

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  nl: {
    // ---------------------------------------------------------------------
    // Nav
    // ---------------------------------------------------------------------
    'nav.services':       'Behandelingen',
    'nav.specialisaties': 'Specialisaties',
    'nav.werk':           'Praktijk',
    'nav.recensies':      'Over Gerda',
    'nav.bezoek':         'Bezoek',
    'nav.faq':            'Veelgesteld',
    'nav.book':           'Bel ons',

    // ---------------------------------------------------------------------
    // Hero
    // ---------------------------------------------------------------------
    'hero.kicker':  'Pedicurepraktijk · Wijckel, Friesland',
    'hero.title':   'Voetzorg waar\nde voet centraal staat.',
    'hero.sub':     'Pedicurepraktijk FootCare+ is een rustige praktijk aan de Menno van Coehoornweg in Wijckel. KRP-geregistreerd via Provoet, met ruimte voor diabetische, reumatische, oncologische en spastische voet. Ook aan huis in de regio.',
    'hero.ctaCall': 'Bel 06 48490004',
    'hero.ctaWa':   'WhatsApp',
    'hero.meta1':   'KRP-geregistreerd',
    'hero.meta2':   'Op afspraak',
    'hero.meta3':   'Aan huis mogelijk',

    // ---------------------------------------------------------------------
    // USP Strip
    // ---------------------------------------------------------------------
    'usp.1.title': 'KRP via Provoet',
    'usp.1.sub':   'Kwaliteitsregister Pedicures',
    'usp.2.title': 'Medisch pedicure',
    'usp.2.sub':   'Risicovoeten in vertrouwde handen',
    'usp.3.title': 'Diabetische voet',
    'usp.3.sub':   'Gespecialiseerde aantekening',
    'usp.4.title': 'Ook aan huis',
    'usp.4.sub':   'Voor wie slecht ter been is',

    // ---------------------------------------------------------------------
    // About
    // ---------------------------------------------------------------------
    'about.kicker': 'Over Gerda',
    'about.title':  'Van de thuiszorg naar de praktijk.',
    'about.body1':  'Ik ben Gerda Haringsma. Voor ik in 2022 mijn diploma haalde aan de Noord Nederlandse Academie in Heerenveen, werkte ik jaren in de thuiszorg. Daar zag ik dagelijks voeten die meer aandacht verdienden dan ik op dat moment kon geven.',
    'about.body2':  'Dat is de reden dat FootCare+ er staat. Een vaste plek voor goede voetzorg, met genoeg tijd per behandeling en de aantekeningen om ook risicovoeten te behandelen. Voor wie de praktijk niet kan bereiken, kom ik aan huis in de regio rond Wijckel.',
    'about.owner':  'Gerda Haringsma · KRP-geregistreerd pedicure',
    'about.tag1':   'NNA Heerenveen, 2022',
    'about.tag2':   'KRP via Provoet',
    'about.tag3':   'Achtergrond in de thuiszorg',
    'about.tag4':   'Ambulant in de regio',

    // ---------------------------------------------------------------------
    // Specialisaties (the "+" in the name)
    // ---------------------------------------------------------------------
    'specs.kicker': 'De plus in FootCare+',
    'specs.title':  'Voor voeten die net iets meer vragen.',
    'specs.intro':  'Naast de reguliere pedicure behandel ik ook risicovoeten. Dat vraagt om extra opleiding en jaarlijkse bijscholing, geregistreerd in het Kwaliteitsregister Pedicures.',

    'specs.item1.title': 'Diabetische voet',
    'specs.item1.body':  'Bij diabetes kan de doorbloeding en het gevoel in de voet veranderen. Een kleine wond of drukplek blijft dan niet altijd opgemerkt. We doen een screening, behandelen met de juiste techniek en houden de voet tussen afspraken door samen in de gaten.',

    'specs.item2.title': 'Reumatische voet',
    'specs.item2.body':  'Reuma verandert de stand van de voet en de belasting per stap. Dat geeft drukplekken, eelt en pijnpunten die om een rustige, zachte behandeling vragen. We werken met antidruk-technieken waar dat helpt.',

    'specs.item3.title': 'Oncologische voet',
    'specs.item3.body':  'Tijdens en na een oncologische behandeling reageren huid en nagels anders. Brossere nagels, gevoelige huid, soms tintelingen. De behandeling is zachter en aangepast aan wat de voet die dag aankan.',

    'specs.item4.title': 'Spastische voet',
    'specs.item4.body':  'Bij spasticiteit is de voetstand vaak gespannen of star, waardoor nagels en huid extra zorg nodig hebben. De behandeling gebeurt in een houding en tempo die voor jou werkt.',

    // ---------------------------------------------------------------------
    // Services
    // ---------------------------------------------------------------------
    'services.kicker': 'Behandelingen',
    'services.title':  'Wat ik doe',
    'services.sub':    'Tarieven op aanvraag, want elke voet vraagt om een eigen behandeltijd. Bel of app voor een richtprijs.',
    'services.min':    'min',

    // ---------------------------------------------------------------------
    // MediaMarquee
    // ---------------------------------------------------------------------
    'marquee.kicker': 'Gerda aan het werk',
    'marquee.title':  'In de praktijk en aan huis',
    'marquee.intro':  'Beelden van behandelingen, bij cliënten thuis en op de praktijk. Tik op een foto om groter te bekijken.',

    // ---------------------------------------------------------------------
    // Reviews — real Google reviews populated; carousel renders by default.
    // ---------------------------------------------------------------------
    'reviews.kicker': 'Wat klanten zeggen',
    'reviews.title':  'Vijf sterren, zes keer.',
    'reviews.sub':    'Google-recensies van klanten in de praktijk en aan huis.',
    'reviews.empty':  'Recensies zijn er nog niet. De praktijk is sinds eind 2022 open. Liever even sparren? Bel of app gerust, of bekijk de',

    'creds.1.title': 'KRP via Provoet',
    'creds.1.body':  'Kwaliteitsregister Pedicures, beheerd door ProCert. Jaarlijkse bijscholing en periodieke audits.',
    'creds.1.cta':   'Bekijk Provoet-profiel',
    'creds.2.title': 'NNA Heerenveen, 2022',
    'creds.2.body':  'Diploma behaald aan de Noord Nederlandse Academie. Vervolgcursussen voor de medische aantekeningen.',
    'creds.3.title': 'Werkgebied',
    'creds.3.body':  'Wijckel, Sloten, Balk, Sondel, Harich, Oudemirdum, Bakhuizen, Lemmer en omgeving. Aan huis op afspraak.',

    // ---------------------------------------------------------------------
    // Visit
    // ---------------------------------------------------------------------
    'visit.kicker':     'Praktijk',
    'visit.title':      'Bezoek de praktijk',
    'visit.address':    'Menno van Coehoornweg 15, 8563 AD Wijckel',
    'visit.phone':      'Bel of app',
    'visit.hours':      'Bereikbaarheid',
    'visit.directions': 'Routebeschrijving',
    'visit.note':       'Behandeling op afspraak. Bel of stuur een bericht voor beschikbaarheid; voor cliënten die slecht ter been zijn is een afspraak aan huis mogelijk.',

    // ---------------------------------------------------------------------
    // FAQ
    // ---------------------------------------------------------------------
    'faq.kicker': 'Veelgestelde vragen',
    'faq.title':  'Goed om te weten',

    'faq.q1': 'Moet ik een afspraak maken?',
    'faq.a1': 'Ja, de praktijk werkt alleen op afspraak. Bel of stuur een berichtje en we kijken samen wanneer het uitkomt.',

    'faq.q2': 'Behandelen jullie ook diabetische voeten?',
    'faq.a2': 'Ja. De aantekening Diabetische voet is onderdeel van de KRP-registratie. We starten met een screening en passen de behandeling aan op wat de voet die dag nodig heeft.',

    'faq.q3': 'Wordt de behandeling vergoed door de zorgverzekering?',
    'faq.a3': 'Een gewone pedicure wordt niet vergoed. Voor diabetische voetzorg geldt soms vergoeding via de podotherapeutische zorgketen, afhankelijk van uw zorgprofiel en aanvullende verzekering. Vraag het na bij uw zorgverzekeraar of podotherapeut.',

    'faq.q4': 'Hoe lang duurt een behandeling?',
    'faq.a4': 'Reken op drie kwartier tot een uur, afhankelijk van de voet en het type behandeling. Voor een eerste afspraak houden we extra tijd aan voor een goede intake.',

    'faq.q5': 'Komt u ook aan huis?',
    'faq.a5': 'Ja, in de regio rond Wijckel. Vooral bedoeld voor cliënten die slecht ter been zijn of niet zelf naar de praktijk kunnen komen. Geef bij het maken van de afspraak aan dat het om een huisbezoek gaat.',

    'faq.q6': 'Welke voetproblemen behandelt u?',
    'faq.a6': 'Naast de reguliere pedicure: ingegroeide of beschadigde nagels, eelt en likdoorns, schimmelnagels, drukplekken, en de aantekeningen diabetes, reuma, oncologisch en spastisch. Voor klachten waarvoor doorverwijzing nodig is, verwijs ik door naar een podotherapeut of huisarts.',

    'faq.q7': 'Vanaf wanneer kan ik terecht?',
    'faq.a7': 'De praktijk is open sinds eind 2022. Bel of app voor de eerstvolgende beschikbare afspraak.',

    // ---------------------------------------------------------------------
    // Footer
    // ---------------------------------------------------------------------
    'footer.tagline': 'Pedicurepraktijk FootCare+ in Wijckel. KRP-geregistreerd via Provoet.',
    'footer.rights':  '© Pedicurepraktijk FootCare+. Alle rechten voorbehouden.',
    'footer.follow':  'Op het web',
    'footer.region':  'Wijckel · De Fryske Marren',
  },
};
