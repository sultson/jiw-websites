/**
 * De vaste gegevens van de site, op één plek zodat de Worker, de bevestiging en
 * de sitemap niet uit elkaar kunnen lopen.
 */

/** De canonieke host. Elke andere host stuurt zijn bezoekers hierheen. */
export const CANONIEKE_HOST = 'installatieveilig.nl';

export const SITE_URL = `https://${CANONIEKE_HOST}`;

/**
 * De hosts die naar deze Worker wijzen maar niet de canonieke zijn: de
 * www-variant en het opleveradres. Zonder omleiding staat de site op drie
 * adressen tegelijk in de index en verdeelt hij zijn eigen positie over de
 * kopieën.
 */
export const ANDERE_HOSTS = [`www.${CANONIEKE_HOST}`, 'drukkeinstallatie.jouwidealewebsite.nl'];

export const CONTACT = {
  telefoonWeergave: '+31 6 18195027',
  email: 'info@installatieveilig.nl',
};
