/**
 * De vaste gegevens van de site, op één plek zodat de Worker, de bevestiging en
 * de sitemap niet uit elkaar kunnen lopen.
 */

/** De canonieke host. Elke andere host stuurt zijn bezoekers hierheen. */
export const CANONIEKE_HOST = 'installatieveilig.nl';

export const SITE_URL = `https://${CANONIEKE_HOST}`;

/**
 * De hosts die naar deze Worker wijzen maar niet de canonieke zijn: de
 * www-variant en de twee opleveradressen. Zonder omleiding staat de site op
 * vier adressen tegelijk in de index en verdeelt hij zijn eigen positie over de
 * kopieën.
 *
 * installatieveilig.jouwidealewebsite.nl droeg tot september 2026 een tweede,
 * bijna gelijke versie van deze site. Dat adres wijst nu naar deze Worker en
 * stuurt zijn bezoekers hierheen, zodat de twee niet langer om dezelfde
 * zoekopdrachten concurreren.
 */
export const ANDERE_HOSTS = [
  `www.${CANONIEKE_HOST}`,
  'drukkeinstallatie.jouwidealewebsite.nl',
  'installatieveilig.jouwidealewebsite.nl',
];

export const CONTACT = {
  telefoonWeergave: '+31 6 18195027',
  email: 'info@installatieveilig.nl',
};
