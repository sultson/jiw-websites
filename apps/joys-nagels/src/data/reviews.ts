export type Review = {
  id: number;
  name: string;
  rating: number;
  date: string;
  nl?: string;
  en?: string;
  source: string;
};

// Verbatim Google Maps reviews voor JOY'S complete nagelverzorging (5,0 / 48).
// Tekst is letterlijk overgenomen zoals klanten op Google plaatsten.
export const reviews: Review[] = [
  {
    id: 1,
    name: 'Ina Alink',
    rating: 5,
    date: 'Google',
    nl: 'Enkele dagen geleden ben ik voor het eerst bij Joyce geweest. Ik was onder de indruk van haar serieuze aanpak en eerlijke voorlichting. Met het eindresultaat was ik erg blij. De vervolgafspraken heb ik ook al. Want ook op dit punt is ze secuur. Ik kom zeker met plezier terug!',
    en: 'I went to Joyce for the first time a few days ago. I was impressed by her serious approach and honest advice. I was very happy with the result, and my follow-up appointments are already booked. She is meticulous on that front too. I will definitely be back with pleasure!',
    source: 'Google',
  },
  {
    id: 2,
    name: 'Lisanne Rozendaal',
    rating: 5,
    date: 'Google',
    nl: 'Professioneel, hygiënisch, precies, geduldig en zeer behulpzaam met probleemnagels. Via de app altijd bereikbaar bij problemen aan je nagels na een behandeling. En altijd erg gezellig! Raad haar echt aan!',
    en: 'Professional, hygienic, precise, patient and very helpful with problem nails. Always reachable via the app if anything goes wrong after a treatment. And always great company. Highly recommend!',
    source: 'Google',
  },
  {
    id: 3,
    name: 'Lizette Van Gils Weerts',
    rating: 5,
    date: 'Google',
    nl: "Super blij ben ik met JOY'S, dankzij haar ben ik na 35 jaar gestopt met nagelbijten. Nu heb ik wat producten en lakjes om het zelf bij te houden en als ik het ff niet meer weet hoef ik maar te appen. JOY'S je bent een topper!",
    en: "So happy with JOY'S, thanks to her I stopped biting my nails after 35 years. Now I have a few products to maintain them myself, and if I get stuck I just have to message her. JOY'S you are a star!",
    source: 'Google',
  },
  {
    id: 4,
    name: 'Petronella Maria D.',
    rating: 5,
    date: 'Google',
    nl: 'Tijdens onze reis hebben mijn nagels ook verzorging nodig. Via Google heb ik Joyce een bericht gestuurd. Warm ontvangst in haar knusse salon, eerst desinfectie en mijn nagels controleren, daarna de behandeling met me doorgesproken en uitleg over de producten. Ik mocht kiezen uit de TPO-vrije lak kleuren. Een zeer fijne, ontspannen nagelverzorging die ik iedereen aanraad.',
    en: 'My nails needed care during our trip. I messaged Joyce via Google and got a warm welcome in her cosy studio. She started with disinfection, checked my nails, walked me through the treatment and explained the products. I could choose from her TPO-free polish colours. A truly lovely, relaxed nail-care experience that I recommend to anyone.',
    source: 'Google',
  },
  {
    id: 5,
    name: 'Anne Marie Lamers',
    rating: 5,
    date: 'Google',
    nl: 'Vandaag voor het eerst met mijn dochter van 12 jaar bij Joyce geweest. Ze wilde graag haar nagels gedaan hebben maar ik wilde het vooral natuurlijk houden. Joyce heeft dat prima aangevoeld met als gevolg dat mijn dochter in de wolken was met haar zacht roze nageltjes, heel natuurlijk en passend bij haar leeftijd. Bedankt, Joyce!',
    en: 'Today I went to Joyce for the first time with my 12-year-old daughter. She wanted her nails done but I wanted to keep it natural. Joyce understood perfectly. My daughter was over the moon with her soft pink nails, very natural and fitting her age. Thank you, Joyce!',
    source: 'Google',
  },
  {
    id: 6,
    name: 'Patricia Smeets-van Krieken',
    rating: 5,
    date: 'Google',
    nl: 'Je bent in goede handen. Er wordt goed voor je gezorgd en daarnaast is het nog eens gezellig. Even tijd voor jezelf en ondertussen worden jouw nagels prachtig. Joyce is een fijne meid en ik kom er graag. Koffie staat altijd klaar.',
    en: 'You are in good hands. You are well looked after and it is fun on top of that. Some time for yourself while your nails turn out beautifully. Joyce is lovely and I come back gladly. Coffee is always ready.',
    source: 'Google',
  },
];
