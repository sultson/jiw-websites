/* Guest quotes, shown quietly where a visitor is deciding — under a home's
   calendar and on the topic pages — rather than as a wall on the homepage.
   Rules, so this stays trustworthy:
   - Guests' own words. Only punctuation and capitals are tidied; nothing is
     added, and parts left out are left out whole (the third guest's remark
     about the sockets went to the owner, not here, at the owner's request).
   - The Dutch is the original. The en/de text is our translation and the page
     says so.
   - No Review / AggregateRating structured data: Google does not show stars
     for reviews a business publishes about itself, and marking them up anyway
     risks a manual action. Stars in search come from the Google profile.
   - Each quote is shown on the house the guest actually stayed in (owner,
     9 Oct 2026), and elsewhere is labelled with that house. */
type Lang = 'nl' | 'en' | 'de';

/** The Google Business Profile, by its stable CID. */
export const GOOGLE_PROFILE_URL = 'https://maps.google.com/?cid=11913674244369039445';

export type ReviewId = 'richard' | 'jansen' | 'marianne';

export type Review = {
  name: string;
  /** Where the words were written: a public Google review, or a message to the
      owner that the guest agreed to have quoted. */
  source: 'google' | 'message';
  /** Month of the review, YYYY-MM; absent when we do not know it. */
  month?: string;
  /** The house the guest stayed in. */
  homeId: string;
  text: Record<Lang, string>;
};

export const reviews: Record<ReviewId, Review> = {
  richard: {
    name: 'Richard R.',
    source: 'google',
    month: '2026-10',
    homeId: 'jonkersweg57',
    text: {
      nl: 'Ruime, comfortabele vakantiewoning in een prachtige en rustige omgeving. Alles aanwezig wat we nodig hadden. Omheinde tuin zodat onze hond vrij kon rondlopen.',
      en: 'Spacious, comfortable holiday home in beautiful, peaceful surroundings. Everything we needed was there. A fenced garden, so our dog could roam freely.',
      de: 'Geräumiges, komfortables Ferienhaus in einer wunderschönen, ruhigen Umgebung. Alles da, was wir brauchten. Ein eingezäunter Garten, sodass unser Hund frei herumlaufen konnte.',
    },
  },
  jansen: {
    name: 'F.A.E. Jansen',
    source: 'google',
    month: '2026-09',
    homeId: 'jonkersweg57',
    text: {
      nl: 'Super woning, 5 sterren. Komen er al jaren. Top locatie, super rustig, alles op fietsafstand en het Hilgelo-strand op loopafstand.',
      en: 'Super home, 5 stars. We have been coming for years. Great location, very quiet, everything within cycling distance and the Hilgelo beach within walking distance.',
      de: 'Super Haus, 5 Sterne. Wir kommen schon seit Jahren. Top Lage, sehr ruhig, alles mit dem Rad erreichbar und der Hilgelo-Strand zu Fuß.',
    },
  },
  marianne: {
    name: 'Marianne',
    source: 'message',
    homeId: 'finschalet',
    text: {
      nl: 'Prachtig weer, mooie omgeving, maar bovenal een super knus huis, met mega grote tuin en privacy. Iedereen heeft heerlijk geslapen op de fijne bedden en ook de dekbedden vielen in de smaak!',
      en: 'Lovely weather, beautiful surroundings, but above all a really cosy house, with a huge garden and privacy. Everyone slept wonderfully in the comfortable beds, and the duvets were a hit too!',
      de: 'Herrliches Wetter, schöne Umgebung, aber vor allem ein super gemütliches Haus, mit riesigem Garten und Privatsphäre. Alle haben in den bequemen Betten herrlich geschlafen, und auch die Bettdecken kamen gut an!',
    },
  },
};

/** A home's page shows the quotes of guests who stayed there. */
export const homeReviewIds = (homeId: string) =>
  (Object.keys(reviews) as ReviewId[]).filter((id) => reviews[id].homeId === homeId);

/** The topic pages each get the quote that speaks to their visitor. */
export const TOPIC_REVIEWS: Partial<Record<'groups' | 'dogs' | 'hilgelo', ReviewId[]>> = {
  groups: ['marianne'],
  dogs: ['richard'],
  hilgelo: ['jansen', 'richard'],
};
