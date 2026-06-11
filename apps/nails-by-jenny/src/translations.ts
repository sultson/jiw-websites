export type Lang = 'nl' | 'en';

type Dict = Record<string, string>;

export const translations: Record<Lang, Dict> = {
  nl: {
    // Nav
    'nav.services': 'Behandelingen',
    'nav.biab': 'Biab',
    'nav.nailart': 'Nail art',
    'nav.gallery': "Foto's",
    'nav.reviews': 'Recensies',
    'nav.visit': 'Contact',
    'nav.call': 'Bel Jenny',

    // Hero
    'hero.kicker': 'Nagelstudio in Etten-Leur',
    'hero.title': 'Jouw handen,\nop hun mooist.',
    'hero.sub': 'Van strakke gellak tot opvallende nail art. Jenny zet je nagels precies zoals jij ze wilt.',
    'hero.ctaCall': 'Bel voor een afspraak',
    'hero.ctaWa': 'Stuur een appje',
    'hero.m1': 'Biab',
    'hero.m2': 'Acrygel & polygel',
    'hero.m3': 'Verlenging',

    // UspStrip
    'usp.1t': 'Persoonlijke aandacht',
    'usp.1s': 'Eén klant tegelijk',
    'usp.2t': 'Volop kleuren',
    'usp.2s': 'Altijd iets dat bij je past',
    'usp.3t': 'Elke vorm en lengte',
    'usp.3s': 'Kort en natuurlijk of juist lang',
    'usp.4t': 'Zo geregeld',
    'usp.4s': 'Bel of app voor je afspraak',

    // About
    'about.kicker': 'Over Jenny',
    'about.title': 'Liefde voor het vak, oog voor jouw nagels.',
    'about.p1': 'Ik ben Jennifer, voor de meesten gewoon Jenny. In 2025 maakte ik van mijn passie mijn werk en sindsdien gaat er bijna geen dag voorbij zonder vijlen, gel en kleur. Elk setje dat de deur uitgaat, deel ik met trots.',
    'about.p2': 'Ik werk rustig, kijk goed naar je nagel en stop pas als elk randje klopt. Bijblijven hoort daar voor mij bij, van verse technieken tot de producten waarmee ik werk.',
    'about.tag1': 'Gediplomeerd nagelspecialist',
    'about.tag2': 'Workshop 3D Trend Designs bij Prachtnagels',
    'about.tag3': 'Werkt met PNS producten',
    'about.owner': 'Jennifer · Nails by Jenny',
    'about.imgAlt': 'De nagels van Jenny zelf, biab met blauwe glitter',

    // Biab dark section
    'biab.kicker': 'De basis',
    'biab.title': 'Sterke nagels die natuurlijk ogen.',
    'biab.body': 'Biab staat voor Builder In A Bottle, een gel die ik in dunne lagen opbouw en die je eigen nagel verstevigt. Ideaal als je nagels snel scheuren of afbrokkelen, of als je je eigen lengte wilt laten doorgroeien. Wil je niet wachten op die lengte, dan zet ik met tips of sjablonen een verlenging die nergens nep aanvoelt.',
    'biab.b1': 'Verstevigt je eigen nagel, die rustig kan doorgroeien',
    'biab.b2': 'Dun en natuurlijk, maar een stuk sterker dan gellak alleen',
    'biab.b3': 'Bij uitgroei vul ik op in plaats van alles opnieuw te zetten',
    'biab.cta': 'Bel voor een biab afspraak',
    'biab.imgAlt': 'Roze amandelvormige nagels met verlenging',

    // Nail art section
    'art.kicker': 'De finishing touch',
    'art.title': 'Nail art, van één accentnagel tot 3D.',
    'art.body': 'Een setje wordt pas echt van jou met een ontwerp dat bij je past. Ik teken en bouw alles met de hand, van een subtiel lijntje tot 3D designs met reliëf.',
    'art.b1': 'Eén accentnagel of een volledig bewerkte set, jij bepaalt',
    'art.b2': '3D designs met reliëf dat je echt voelt',
    'art.b3': 'Van zachte glitter tot een ontwerp dat niemand anders heeft',
    'art.cta': 'App je idee naar Jenny',
    'art.imgAlt': 'Zomerse nail art met citroentjes en bloemen',

    // Services
    'services.kicker': 'Prijslijst',
    'services.title': 'Behandelingen en tarieven',
    'services.sub': 'Dit betaal je, zonder verrassingen achteraf.',
    'services.color': 'Alle prijzen zijn inclusief kleur naar keuze.',
    'services.ctaLine': 'Twijfel je wat het beste bij jouw nagels past? Bel of app me even, dan kijk ik met je mee.',
    'services.min': 'min',

    // Gallery
    'gallery.kicker': 'Uit de studio',
    'gallery.title': 'Recent werk',
    'gallery.sub': 'Tik op een foto om in te zoomen.',

    // Marquee
    'marquee.aria': 'Doorlopende fotostrook met werk van Nails by Jenny',

    // Reviews
    'reviews.kicker': 'Google reviews',
    'reviews.title': 'Drie reviews, drie keer vijf sterren.',
    'reviews.google': 'Bekijk op Google',
    'reviews.write': 'Laat zelf een review achter',

    // Visit
    'visit.kicker': 'Contact en bezoek',
    'visit.title': 'Plan je afspraak',
    'visit.addressLabel': 'Adres',
    'visit.directions': 'Route plannen',
    'visit.phoneLabel': 'Bellen of appen',
    'visit.emailLabel': 'E-mail',
    'visit.hoursLabel': 'Openingstijden',
    'visit.hoursLine': "Ma t/m zo op afspraak, ook 's avonds",
    'visit.explainer': "Jenny werkt vanuit haar studio aan huis en alleen op afspraak. Ook 's avonds is er vaak plek, handig naast werk of gezin.",
    'visit.practical': 'Parkeren is gratis in de straat en betalen kan contactloos.',
    'visit.access': 'De studio is niet rolstoeltoegankelijk. Bel gerust vooraf, dan overleg je samen wat mogelijk is.',
    'visit.mapTitle': 'Nails by Jenny op Google Maps',

    // FAQ
    'faq.kicker': 'Veelgestelde vragen',
    'faq.title': 'Goed om te weten',
    'faq.q1': 'Hoe maak ik een afspraak?',
    'faq.a1': 'Bel of stuur een appje. Geef daarbij door welke behandeling je wilt, of je verlenging wilt en op welke dagen je kunt. Jenny stuurt dan snel een voorstel terug.',
    'faq.call': 'Bel 06 27034206',
    'faq.whatsapp': 'Stuur een appje',
    'faq.q2': 'Moet ik vooraf al weten welke kleur of welk design ik wil?',
    'faq.a2': 'Nee, kleur kiezen kan gewoon in de studio. Heb je voor nail art een voorbeeld gezien, stuur dat dan vooraf via WhatsApp mee. Dan ligt alles klaar als je komt.',
    'faq.q3': 'Wat is het verschil tussen gellak, biab en acrygel of polygel?',
    'faq.a3': 'Gellak is een laagje kleur en glans op je eigen nagel. Biab voegt daar versteviging aan toe en is fijn als je nagels snel breken. Acrygel of polygel is de stevigste opbouw en de beste keuze voor langere sets. Twijfel je, dan adviseert Jenny je bij je afspraak.',
    'faq.q4': 'Kan ik mijn set laten opvullen in plaats van opnieuw laten zetten?',
    'faq.a4': 'Ja. Zodra de uitgroei zichtbaar wordt, kun je je set laten opvullen. Geef bij het boeken even door dat het om opvullen gaat.',
    'faq.q5': 'Wat als er een nagel breekt of loslaat?',
    'faq.a5': 'Neem dan gewoon even contact op. Op elke set zit garantie en daarbuiten geldt het reparatietarief uit de prijslijst. Zijn het vier nagels of meer, dan is een nieuwe set voordeliger en wordt die gerekend.',
    'faq.q6': 'Kun je ook nagels verwijderen die ergens anders gezet zijn?',
    'faq.a6': 'Ja, ook sets van een andere salon haalt Jenny er netjes af, zonder je eigen nagel te beschadigen. Laat je direct een nieuwe set zetten, dan kost het verwijderen niets extra.',

    // Footer
    'footer.tagline': 'Nagelstudio Nails by Jenny. Voor nagels waar je elke dag even naar kijkt.',
    'footer.follow': 'Volg Jenny',
    'footer.rights': '© Nails by Jenny. Alle rechten voorbehouden.',

    // WhatsApp bubble
    'wa.aria': 'Stuur Jenny een WhatsApp-bericht',
    'wa.tooltip': 'App Jenny',
  },

  en: {
    // Nav
    'nav.services': 'Treatments',
    'nav.biab': 'BIAB',
    'nav.nailart': 'Nail art',
    'nav.gallery': 'Photos',
    'nav.reviews': 'Reviews',
    'nav.visit': 'Contact',
    'nav.call': 'Call Jenny',

    // Hero
    'hero.kicker': 'Nail studio in Etten-Leur',
    'hero.title': 'Your hands,\nat their best.',
    'hero.sub': 'From clean gel polish to standout nail art. Jenny does your nails exactly the way you want them.',
    'hero.ctaCall': 'Call to book',
    'hero.ctaWa': 'Send a WhatsApp',
    'hero.m1': 'BIAB',
    'hero.m2': 'Acrygel & polygel',
    'hero.m3': 'Extensions',

    // UspStrip
    'usp.1t': 'Personal attention',
    'usp.1s': 'One client at a time',
    'usp.2t': 'Plenty of colours',
    'usp.2s': 'Always something that suits you',
    'usp.3t': 'Every shape and length',
    'usp.3s': 'Short and natural or long',
    'usp.4t': 'Easy to book',
    'usp.4s': 'Call or WhatsApp for your appointment',

    // About
    'about.kicker': 'Meet Jenny',
    'about.title': 'Love for the craft, an eye for your nails.',
    'about.p1': "I'm Jennifer, Jenny to most. In 2025 I turned my passion into my profession, and hardly a day has gone by since without files, gel and colour. Every set that walks out the door is one I'm proud to share.",
    'about.p2': 'I work calmly, look closely at your nails and only stop when every edge is right. Staying current is part of that, from fresh techniques to the products I work with.',
    'about.tag1': 'Certified nail specialist',
    'about.tag2': '3D Trend Designs workshop at Prachtnagels',
    'about.tag3': 'Works with PNS products',
    'about.owner': 'Jennifer · Nails by Jenny',
    'about.imgAlt': "Jenny's own nails, BIAB with blue glitter",

    // Biab dark section
    'biab.kicker': 'The foundation',
    'biab.title': 'Strong nails that look natural.',
    'biab.body': "BIAB stands for Builder In A Bottle, a gel I build up in thin layers to strengthen your own nail. Ideal if your nails tear or crumble easily, or if you want to grow out your natural length. If you'd rather not wait for that length, I create extensions with tips or forms that never feel fake.",
    'biab.b1': 'Strengthens your own nail while it grows out',
    'biab.b2': 'Thin and natural, yet much stronger than gel polish alone',
    'biab.b3': 'When it grows out I do an infill instead of starting over',
    'biab.cta': 'Call to book a BIAB appointment',
    'biab.imgAlt': 'Pink almond shaped nails with extensions',

    // Nail art section
    'art.kicker': 'The finishing touch',
    'art.title': 'Nail art, from one accent nail to 3D.',
    'art.body': 'A set only truly becomes yours with a design that fits you. I draw and build everything by hand, from a subtle line to 3D designs with real texture.',
    'art.b1': 'One accent nail or a fully designed set, you decide',
    'art.b2': '3D designs with texture you can actually feel',
    'art.b3': 'From soft glitter to a design nobody else has',
    'art.cta': 'WhatsApp Jenny your idea',
    'art.imgAlt': 'Summery nail art with lemons and flowers',

    // Services
    'services.kicker': 'Price list',
    'services.title': 'Treatments and prices',
    'services.sub': 'This is what you pay, no surprises afterwards.',
    'services.color': 'All prices include your choice of colour.',
    'services.ctaLine': "Not sure what suits your nails best? Call or message me and I'll help you choose.",
    'services.min': 'min',

    // Gallery
    'gallery.kicker': 'From the studio',
    'gallery.title': 'Recent work',
    'gallery.sub': 'Tap a photo to zoom in.',

    // Marquee
    'marquee.aria': 'Scrolling photo strip of work by Nails by Jenny',

    // Reviews
    'reviews.kicker': 'Google reviews',
    'reviews.title': 'Three reviews, all five stars.',
    'reviews.google': 'View on Google',
    'reviews.write': 'Leave a review',

    // Visit
    'visit.kicker': 'Contact and visit',
    'visit.title': 'Book your appointment',
    'visit.addressLabel': 'Address',
    'visit.directions': 'Get directions',
    'visit.phoneLabel': 'Call or WhatsApp',
    'visit.emailLabel': 'Email',
    'visit.hoursLabel': 'Opening hours',
    'visit.hoursLine': 'Mon to Sun by appointment, evenings too',
    'visit.explainer': 'Jenny works from her home studio and by appointment only. Evening slots are often available too, which helps around work or family.',
    'visit.practical': 'Parking on the street is free and contactless payment is accepted.',
    'visit.access': 'The studio is not wheelchair accessible. Feel free to call ahead to discuss what is possible.',
    'visit.mapTitle': 'Nails by Jenny on Google Maps',

    // FAQ
    'faq.kicker': 'Frequently asked',
    'faq.title': 'Good to know',
    'faq.q1': 'How do I book an appointment?',
    'faq.a1': "Call or send a WhatsApp message. Mention which treatment you'd like, whether you want extensions and which days work for you. Jenny will get back to you quickly with a suggestion.",
    'faq.call': 'Call +31 6 27034206',
    'faq.whatsapp': 'Send a WhatsApp',
    'faq.q2': 'Do I need to know my colour or design in advance?',
    'faq.a2': "No, you can pick your colour at the studio. If you've seen an example for nail art, send it ahead via WhatsApp. That way everything is ready when you arrive.",
    'faq.q3': 'What is the difference between gel polish, BIAB and acrygel or polygel?',
    'faq.a3': 'Gel polish is a layer of colour and shine on your natural nail. BIAB adds strength and is great if your nails break easily. Acrygel or polygel is the firmest build and the best choice for longer sets. Not sure? Jenny will advise you at your appointment.',
    'faq.q4': 'Can I get an infill instead of a whole new set?',
    'faq.a4': "Yes. As soon as the regrowth becomes visible, you can have your set filled in. Just mention it's an infill when you book.",
    'faq.q5': 'What if a nail breaks or comes loose?',
    'faq.a5': "Just get in touch. Every set comes with a guarantee, and outside of it the repair rate from the price list applies. If it's four nails or more, a new set is the better deal and that's what gets charged.",
    'faq.q6': 'Can you remove nails done at another salon?',
    'faq.a6': 'Yes, Jenny carefully removes sets from other salons too, without damaging your natural nail. If you have a new set applied right away, removal is free.',

    // Footer
    'footer.tagline': "Nail studio Nails by Jenny. For nails you'll catch yourself admiring every day.",
    'footer.follow': 'Follow Jenny',
    'footer.rights': '© Nails by Jenny. All rights reserved.',

    // WhatsApp bubble
    'wa.aria': 'Send Jenny a WhatsApp message',
    'wa.tooltip': 'Message Jenny',
  },
};
