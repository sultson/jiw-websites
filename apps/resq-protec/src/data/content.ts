export type Lang = 'nl' | 'en';
export const routes = {
  nl: { home: '/', courses: '/opleidingen-en-trainingen', equipment: '/equipment', updates: '/actueel', contact: '/contact' },
  en: { home: '/en', courses: '/en/courses-and-training', equipment: '/en/equipment', updates: '/en/updates', contact: '/en/contact' },
};

export const copy = {
  nl: {
    nav: ['Home', 'Opleidingen & trainingen', 'Equipment', 'Actueel', 'Contact'],
    heroEyebrow: 'Ontwikkeld door en voor professionals',
    heroTitle: 'Elke seconde telt bij een waterredding.',
    heroText: 'Veiligheid, snelheid en bedieningsgemak komen samen in het materieel en de opleidingen waarmee u het water op gaat.',
    heroPrimary: 'Ontdek Rescue Watercraft', heroSecondary: 'Stel je vraag',
    coursesTitle: 'Opleidingen en trainingen', coursesIntro: 'Leer veilig en professioneel werken met een reddingswaterscooter. Ontdek de opleidingen Rescue watercraft operator en Instructeur Rescue watercraft operator.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professionele reddingsmiddelen, beschermingsmiddelen en uitrusting, geselecteerd voor betrouwbare operationele inzet.',
    contactTitle: 'Contact', contactIntro: 'Vertel ons wat uw organisatie nodig heeft. We denken mee over materiaal, opleiding en inzetbaarheid.',
    request: 'Aanvragen', view: 'Bekijk aanbod', all: 'Alle categorieën', search: 'Zoeken', noResults: 'Geen resultaten gevonden.',
  },
  en: {
    nav: ['Home', 'Courses & training', 'Equipment', 'Updates', 'Contact'],
    heroEyebrow: 'Developed by and for professionals',
    heroTitle: 'Every second counts in water rescue.',
    heroText: 'Safety, speed and ease of use come together in the equipment and training you take onto the water.',
    heroPrimary: 'Discover Rescue Watercraft', heroSecondary: 'Ask your question',
    coursesTitle: 'Courses and training', coursesIntro: 'Learn to operate a rescue watercraft safely and professionally. Explore our Rescue Watercraft Operator and Rescue Watercraft Operator Instructor courses.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professional rescue and protective equipment selected for dependable operational use.',
    contactTitle: 'Contact', contactIntro: 'Tell us what your organisation needs. We advise on equipment, training and operational readiness.',
    request: 'Request information', view: 'View offering', all: 'All categories', search: 'Search', noResults: 'No results found.',
  },
};
