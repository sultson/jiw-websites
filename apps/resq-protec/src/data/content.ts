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
    heroText: 'Veiligheid, snelheid en bedieningsgemak komen samen in professionele oplossingen voor waterredding.',
    heroPrimary: 'Ontdek Rescue Watercraft', heroSecondary: 'Bespreek uw inzet',
    coursesTitle: 'Opleidingen en trainingen', coursesIntro: 'Praktijkgerichte scholing voor hulpdiensten, overheid en professionals die op en langs het water werken.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professionele reddingsmiddelen, beschermingsmiddelen en uitrusting, geselecteerd voor betrouwbare operationele inzet.',
    contactTitle: 'Contact', contactIntro: 'Vertel ons wat uw organisatie nodig heeft. We denken mee over materiaal, opleiding en inzetbaarheid.',
    request: 'Aanvragen', view: 'Bekijk aanbod', all: 'Alle categorieën', search: 'Zoeken', noResults: 'Geen resultaten gevonden.',
  },
  en: {
    nav: ['Home', 'Courses & training', 'Equipment', 'Updates', 'Contact'],
    heroEyebrow: 'Developed by and for professionals',
    heroTitle: 'Every second counts in water rescue.',
    heroText: 'Safety, speed and ease of use come together in professional water rescue solutions.',
    heroPrimary: 'Discover Rescue Watercraft', heroSecondary: 'Discuss your operation',
    coursesTitle: 'Courses and training', coursesIntro: 'Practical education for emergency services, government and professionals working on and around water.',
    equipmentTitle: 'Equipment', equipmentIntro: 'Professional rescue and protective equipment selected for dependable operational use.',
    contactTitle: 'Contact', contactIntro: 'Tell us what your organisation needs. We advise on equipment, training and operational readiness.',
    request: 'Request information', view: 'View offering', all: 'All categories', search: 'Search', noResults: 'No results found.',
  },
};
