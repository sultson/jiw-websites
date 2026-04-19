export type Lang = 'nl' | 'en';

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  nl: {
    'nav.services':   'Behandelingen',
    'nav.facial':     'Signature Facial',
    'nav.gallery':    "Foto's",
    'nav.reviews':    'Recensies',
    'nav.visit':      'Bezoek',
    'nav.faq':        'FAQ',
    'nav.book':       'Boek afspraak',
    'nav.bookShort':  'Boek',

    'hero.kicker':    'Frederik Hendrikbuurt, Amsterdam',
    'hero.title':     'Stralende huid, vakkundige handen.',
    'hero.sub':       'Gepersonaliseerde huidverzorging, facials en microneedling in een serene studio in Amsterdam-West. Claire is gecertificeerd schoonheidsspecialiste en werkt exclusief met Emergin C.',
    'hero.ctaBook':   'Boek een behandeling',
    'hero.ctaMore':   'Bekijk behandelingen',

    'usp.rating':     '4,9 ★ · 467 recensies',
    'usp.ratingSub':  'Google reviews',
    'usp.brand':      'Emergin C',
    'usp.brandSub':   'Exclusief huidverzorgingsmerk',
    'usp.certified':  'Gecertificeerd',
    'usp.certifiedSub': 'Erkend schoonheidsspecialiste',
    'usp.personal':   'Persoonlijk',
    'usp.personalSub': 'Behandeling op maat',

    'facial.kicker':  'Signature behandeling',
    'facial.title':   'Supreme Glow Facial — jouw huid, opnieuw geboren.',
    'facial.body':    'De meest complete gezichtsbehandeling van de studio. Dieptereiniging, exfoliatie, serum op maat en een ontspannende massage — in 70 minuten naar een zichtbaar stralende huid.',
    'facial.cta':     'Boek een Supreme Glow Facial',

    'services.kicker': 'Prijslijst',
    'services.title':  'Behandelingen & tarieven',
    'services.sub':    'Alle prijzen zijn inclusief persoonlijk huidadvies.',
    'services.book':   'Boek',
    'services.min':    'min',

    'gallery.kicker':  'Resultaten',
    'gallery.title':   'Voor & na',
    'gallery.sub':     'Tik op een foto voor een grotere weergave.',

    'reviews.kicker':  'Klanten vertellen',
    'reviews.title':   'Recensies',
    'reviews.sub':     'Echte ervaringen van Google. 4,9 ★ gemiddeld.',
    'reviews.all':     'Bekijk alle op Google',

    'about.kicker':   'Over Claire',
    'about.title':    'Vakkundigheid die je ziet.',
    'about.body':     'Claire is gecertificeerd schoonheidsspecialiste met een passie voor gezonde huid. In haar studio in de Frederik Hendrikbuurt werkt ze uitsluitend met Emergin C — een professioneel merk dat huidverbetering en natuurlijke huidlifting combineert. Elke behandeling begint met een grondige huidanalyse, zodat het resultaat écht persoonlijk is.',

    'visit.kicker':   'Bezoek ons',
    'visit.title':    'De studio in Amsterdam-West',
    'visit.address':  'Buyskade 130, 1051 ME Amsterdam',
    'visit.hours':    'Openingstijden',
    'visit.directions': 'Route',
    'visit.parking':  'Bereikbaar met tram en OV.',

    'faq.kicker':  'Veelgestelde vragen',
    'faq.title':   'Goed om te weten',

    'faq.q1': 'Welke producten gebruikt Claire?',
    'faq.a1': 'De studio werkt exclusief met Emergin C — een professioneel huidverzorgingsmerk gericht op huidverbetering en anti-aging.',
    'faq.q2': 'Is een intake nodig vóór mijn eerste bezoek?',
    'faq.a2': 'Bij je eerste bezoek start de behandeling altijd met een huidanalyse, zodat de behandeling perfect aansluit op jouw huid.',
    'faq.q3': 'Hoe ver van tevoren moet ik annuleren?',
    'faq.a3': 'Graag minimaal 24 uur van tevoren annuleren of verzetten, zodat het tijdslot aan een andere klant kan worden gegeven.',
    'faq.q4': 'Welke talen spreekt Claire?',
    'faq.a4': 'Claire spreekt Nederlands en Engels.',
    'faq.q5': 'Zijn de behandelingen geschikt voor gevoelige huid?',
    'faq.a5': 'Ja. Elke behandeling wordt aangepast aan jouw huidtype. Bij twijfel kun je dit aangeven bij het boeken of vragen bij binnenkomst.',

    'footer.tagline': 'Huidverzorging & facials in de Frederik Hendrikbuurt, Amsterdam.',
    'footer.rights':  '© Claire\'s Skincare Studio — Alle rechten voorbehouden.',
  },
  en: {
    'nav.services':   'Treatments',
    'nav.facial':     'Signature Facial',
    'nav.gallery':    'Gallery',
    'nav.reviews':    'Reviews',
    'nav.visit':      'Visit',
    'nav.faq':        'FAQ',
    'nav.book':       'Book now',
    'nav.bookShort':  'Book',

    'hero.kicker':    'Frederik Hendrikbuurt, Amsterdam',
    'hero.title':     'Radiant skin, expert hands.',
    'hero.sub':       'Personalised skincare, facials and microneedling in a serene studio in Amsterdam-West. Claire is a licensed aesthetician working exclusively with Emergin C.',
    'hero.ctaBook':   'Book a treatment',
    'hero.ctaMore':   'View treatments',

    'usp.rating':     '4.9 ★ · 467 reviews',
    'usp.ratingSub':  'Google reviews',
    'usp.brand':      'Emergin C',
    'usp.brandSub':   'Exclusive skincare brand',
    'usp.certified':  'Certified',
    'usp.certifiedSub': 'Licensed aesthetician',
    'usp.personal':   'Personal',
    'usp.personalSub': 'Treatment tailored to you',

    'facial.kicker':  'Signature treatment',
    'facial.title':   'Supreme Glow Facial — your skin, reborn.',
    'facial.body':    'The most complete facial in the studio. Deep cleanse, exfoliation, bespoke serum and a relaxing massage — in 70 minutes to visibly radiant skin.',
    'facial.cta':     'Book a Supreme Glow Facial',

    'services.kicker': 'Price list',
    'services.title':  'Treatments & prices',
    'services.sub':    'All prices include personalised skin advice.',
    'services.book':   'Book',
    'services.min':    'min',

    'gallery.kicker':  'Results',
    'gallery.title':   'Before & after',
    'gallery.sub':     'Tap an image to view larger.',

    'reviews.kicker':  'What clients say',
    'reviews.title':   'Reviews',
    'reviews.sub':     'Real experiences from Google. 4.9 ★ average.',
    'reviews.all':     'See all on Google',

    'about.kicker':   'About Claire',
    'about.title':    'Expertise you can see.',
    'about.body':     'Claire is a certified aesthetician with a passion for healthy skin. In her studio in the Frederik Hendrikbuurt she works exclusively with Emergin C — a professional brand combining skin improvement with natural face lifting. Every treatment starts with a thorough skin analysis so results are truly personal.',

    'visit.kicker':   'Visit us',
    'visit.title':    'The studio in Amsterdam-West',
    'visit.address':  'Buyskade 130, 1051 ME Amsterdam',
    'visit.hours':    'Opening hours',
    'visit.directions': 'Get directions',
    'visit.parking':  'Accessible by tram and public transport.',

    'faq.kicker':  'Frequently asked',
    'faq.title':   'Good to know',

    'faq.q1': 'Which products does Claire use?',
    'faq.a1': 'The studio works exclusively with Emergin C — a professional skincare brand focused on skin improvement and anti-aging.',
    'faq.q2': 'Is an intake needed before my first visit?',
    'faq.a2': 'At your first visit, every treatment starts with a skin analysis to ensure the treatment perfectly matches your skin.',
    'faq.q3': 'How far in advance do I need to cancel?',
    'faq.a3': 'Please cancel or reschedule at least 24 hours in advance so the slot can be offered to another client.',
    'faq.q4': 'Which languages does Claire speak?',
    'faq.a4': 'Claire speaks Dutch and English.',
    'faq.q5': 'Are the treatments suitable for sensitive skin?',
    'faq.a5': 'Yes. Every treatment is adapted to your skin type. If in doubt, mention it when booking or upon arrival.',

    'footer.tagline': 'Skincare & facials in the Frederik Hendrikbuurt, Amsterdam.',
    'footer.rights':  '© Claire\'s Skincare Studio — All rights reserved.',
  },
};
