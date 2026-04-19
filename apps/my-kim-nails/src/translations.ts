export type Lang = 'nl' | 'en';

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  nl: {
    'nav.services': 'Behandelingen',
    'nav.biab': 'BIAB',
    'nav.gallery': "Foto's",
    'nav.visit': 'Bezoek',
    'nav.faq': 'FAQ',
    'nav.book': 'Boek afspraak',
    'nav.bookShort': 'Boek',
    'nav.call': 'Bel',

    'topbar.new': 'BIAB — versterk je natuurlijke nagels',

    'hero.kicker': 'Winkelcentrum Dukenburg',
    'hero.title': 'Rust, precisie en prachtige nagels.',
    'hero.sub': "Verzorgde nagels, BIAB en pedicure in hart van Nijmegen. Boek zelf online — snel, simpel en zonder bellen.",
    'hero.ctaBook': 'Boek online',
    'hero.ctaWa': 'WhatsApp',
    'hero.scroll': 'Scroll',

    'usp.rating': '4,3 ★ · 40+ recensies',
    'usp.ratingSub': 'Google reviews',
    'usp.biab': 'BIAB',
    'usp.biabSub': 'Sterke, natuurlijke nagels',
    'usp.hygiene': 'Hygiënisch & geurvrij',
    'usp.hygieneSub': 'Geventileerde salon',
    'usp.walkin': 'Korte termijn',
    'usp.walkinSub': 'Vaak dezelfde week nog',

    'biab.kicker': 'Signature behandeling',
    'biab.title': 'BIAB — sterke nagels, natuurlijke look.',
    'biab.body': 'Builder in a Bottle versterkt je eigen nagels met een dunne, flexibele laag. Lange houdbaarheid, glanzende afwerking en geen schade aan je nagelplaat.',
    'biab.cta': 'Boek een BIAB',

    'services.kicker': 'Prijslijst',
    'services.title': 'Behandelingen & tarieven',
    'services.sub': 'Richtprijzen — definitieve prijs kan afwijken bij extra lange nagels of reparaties.',
    'services.book': 'Boek',
    'services.min': 'min',

    'gallery.kicker': "Ons werk",
    'gallery.title': 'Recente sets',
    'gallery.sub': 'Tik op een foto voor een grotere weergave.',

    'about.kicker': 'Over ons',
    'about.title': 'Vietnamees vakmanschap, Nijmeegse warmte.',
    'about.body': "Mykimnails is een kleine, zorgvuldig gerunde salon in Winkelcentrum Dukenburg. Vietnamees vakmanschap gecombineerd met een persoonlijke, rustige aanpak. Bij ons krijg je de tijd — en nagels waar je trots op bent.",

    'visit.kicker': 'Bezoek ons',
    'visit.title': 'Kom langs in Dukenburg',
    'visit.address': 'Zwanenveld 9040, 6538 SB Nijmegen',
    'visit.phone': 'Bel of app ons',
    'visit.email': 'E-mail',
    'visit.hours': 'Openingstijden',
    'visit.parking': 'Gratis parkeren onder Winkelcentrum Dukenburg.',
    'visit.directions': 'Route',

    'faq.kicker': 'Veelgestelde vragen',
    'faq.title': 'Goed om te weten',

    'faq.q1': 'Kan de prijs afwijken van wat ik aan de telefoon hoorde?',
    'faq.a1': 'Ja, bij extra lange nagels, reparaties of BIAB over bestaande nagels rekenen wij een kleine toeslag. We bespreken dit altijd vóór we beginnen.',
    'faq.q2': 'Hoe kan ik annuleren of verzetten?',
    'faq.a2': 'Stuur ons een WhatsApp op 06 34899263, liefst minstens 24 uur van tevoren, zodat we het slot aan iemand anders kunnen geven.',
    'faq.q3': 'Moet ik vooraf boeken of kan ik binnenlopen?',
    'faq.a3': 'Een afspraak is aan te raden — vooral in het weekend. Walk-in kan soms, maar je bent dan afhankelijk van de planning.',
    'faq.q4': 'Hoe zit het met hygiëne?',
    'faq.a4': 'We werken hygiënisch met een ventilatiesysteem dat de salon geurvrij houdt.',
    'faq.q5': 'Welke talen spreken jullie?',
    'faq.a5': 'Nederlands, Engels en Vietnamees.',

    'footer.tagline': 'Nagelsalon in Winkelcentrum Dukenburg, Nijmegen.',
    'footer.rights': '© Mykimnails — Alle rechten voorbehouden.',
    'footer.legal': 'Algemene voorwaarden',

    'book.title': 'Afspraak maken',
    'book.step': 'Stap',
    'book.of': 'van',
    'book.next': 'Verder',
    'book.back': 'Terug',
    'book.close': 'Sluiten',

    'book.s1.title': 'Kies een behandeling',
    'book.s1.sub': 'Selecteer een categorie en daarna een behandeling.',

    'book.s2.title': 'Kies een datum',
    'book.s2.sub': 'Zondag gesloten. Beschikbare dagen zijn blauw gemarkeerd.',

    'book.s3.title': 'Kies een tijd',
    'book.s3.sub': 'Grijs betekent bezet.',
    'book.s3.taken': 'Bezet',
    'book.s3.noSlots': 'Geen tijden beschikbaar op deze dag.',

    'book.s4.title': 'Jouw gegevens',
    'book.s4.name': 'Naam',
    'book.s4.phone': 'Telefoonnummer',
    'book.s4.email': 'E-mail (optioneel)',
    'book.s4.note': 'Opmerking (optioneel)',
    'book.s4.submit': 'Afspraak bevestigen',
    'book.s4.summary': 'Samenvatting',

    'book.s5.title': 'Gelukt — we zien je binnenkort!',
    'book.s5.sub': 'We bevestigen je afspraak binnen 1 uur via WhatsApp of telefoon.',
    'book.s5.ics': 'Voeg toe aan kalender',
    'book.s5.again': 'Nog een afspraak maken',
    'book.s5.done': 'Sluiten',

    'lang.nl': 'NL',
    'lang.en': 'EN',
  },
  en: {
    'nav.services': 'Services',
    'nav.biab': 'BIAB',
    'nav.gallery': 'Gallery',
    'nav.visit': 'Visit',
    'nav.faq': 'FAQ',
    'nav.book': 'Book now',
    'nav.bookShort': 'Book',
    'nav.call': 'Call',

    'topbar.new': 'BIAB — strengthen your natural nails',

    'hero.kicker': 'Winkelcentrum Dukenburg',
    'hero.title': 'Calm, precise, beautifully done nails.',
    'hero.sub': 'Manicures, BIAB and pedicures in the heart of Nijmegen. Book online — fast, simple, no phone calls needed.',
    'hero.ctaBook': 'Book online',
    'hero.ctaWa': 'WhatsApp',
    'hero.scroll': 'Scroll',

    'usp.rating': '4.3 ★ · 40+ reviews',
    'usp.ratingSub': 'Google reviews',
    'usp.biab': 'BIAB',
    'usp.biabSub': 'Strong, natural nails',
    'usp.hygiene': 'Hygienic & odour-free',
    'usp.hygieneSub': 'Ventilated salon',
    'usp.walkin': 'Short notice welcome',
    'usp.walkinSub': 'Often same-week slots',

    'biab.kicker': 'Signature treatment',
    'biab.title': 'BIAB — strong nails, natural look.',
    'biab.body': 'Builder in a Bottle strengthens your natural nails with a thin, flexible layer. Long-lasting, glossy finish — without damaging the nail plate.',
    'biab.cta': 'Book a BIAB',

    'services.kicker': 'Price list',
    'services.title': 'Treatments & prices',
    'services.sub': 'Indicative prices — final price may differ for extra-long nails or repairs.',
    'services.book': 'Book',
    'services.min': 'min',

    'gallery.kicker': 'Our work',
    'gallery.title': 'Recent sets',
    'gallery.sub': 'Tap an image to view larger.',

    'about.kicker': 'About us',
    'about.title': 'Vietnamese craftsmanship, Nijmegen warmth.',
    'about.body': 'Mykimnails is a small, carefully run salon in Winkelcentrum Dukenburg. Vietnamese craftsmanship combined with a calm, personal approach. You get the time you deserve — and nails you are proud of.',

    'visit.kicker': 'Visit us',
    'visit.title': 'Drop by in Dukenburg',
    'visit.address': 'Zwanenveld 9040, 6538 SB Nijmegen',
    'visit.phone': 'Call or message',
    'visit.email': 'Email',
    'visit.hours': 'Opening hours',
    'visit.parking': 'Free parking underneath Winkelcentrum Dukenburg.',
    'visit.directions': 'Get directions',

    'faq.kicker': 'Frequently asked',
    'faq.title': 'Good to know',

    'faq.q1': 'Can the price differ from the one quoted on the phone?',
    'faq.a1': 'Yes — extra-long nails, repairs or BIAB over existing nails carry a small surcharge. We always discuss this before starting.',
    'faq.q2': 'How do I cancel or reschedule?',
    'faq.a2': 'Send us a WhatsApp on 06 34899263, ideally at least 24 hours in advance, so we can give the slot to someone else.',
    'faq.q3': 'Do I need to book, or can I walk in?',
    'faq.a3': 'Booking is recommended, especially on weekends. Walk-ins are sometimes possible depending on the schedule.',
    'faq.q4': 'What about hygiene?',
    'faq.a4': 'We work hygienically with a ventilation system that keeps the salon odour-free.',
    'faq.q5': 'Which languages do you speak?',
    'faq.a5': 'Dutch, English and Vietnamese.',

    'footer.tagline': 'Nail salon in Winkelcentrum Dukenburg, Nijmegen.',
    'footer.rights': '© Mykimnails — All rights reserved.',
    'footer.legal': 'Terms',

    'book.title': 'Book an appointment',
    'book.step': 'Step',
    'book.of': 'of',
    'book.next': 'Next',
    'book.back': 'Back',
    'book.close': 'Close',

    'book.s1.title': 'Choose a treatment',
    'book.s1.sub': 'Select a category, then a treatment.',

    'book.s2.title': 'Pick a date',
    'book.s2.sub': 'Sundays closed. Available days are highlighted.',

    'book.s3.title': 'Pick a time',
    'book.s3.sub': 'Grey slots are already taken.',
    'book.s3.taken': 'Taken',
    'book.s3.noSlots': 'No slots available on this day.',

    'book.s4.title': 'Your details',
    'book.s4.name': 'Name',
    'book.s4.phone': 'Phone number',
    'book.s4.email': 'Email (optional)',
    'book.s4.note': 'Note (optional)',
    'book.s4.submit': 'Confirm appointment',
    'book.s4.summary': 'Summary',

    'book.s5.title': 'All set — see you soon!',
    'book.s5.sub': "We'll confirm your appointment within 1 hour via WhatsApp or phone.",
    'book.s5.ics': 'Add to calendar',
    'book.s5.again': 'Book another appointment',
    'book.s5.done': 'Close',

    'lang.nl': 'NL',
    'lang.en': 'EN',
  },
};
