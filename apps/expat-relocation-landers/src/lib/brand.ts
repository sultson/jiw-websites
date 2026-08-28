/**
 * Company details shared by every lander in this app.
 *
 * Two values are deliberately pointed at the existing E & I infrastructure and
 * should be swapped the moment the Immigration Services NL mailbox exists:
 * `email` (shown on the page) and `LEAD_RECIPIENT` in each wrangler config
 * (where the lead is delivered). The brief asks for info@immigration-services.nl;
 * until that mailbox is live, a displayed address that bounces costs leads.
 *
 * The legal block is E & I's: same owner, same phone, and a Dutch commercial
 * site must carry a KvK number. Confirm with the client whether Immigration
 * Services NL trades under this KvK or has its own.
 */
export const brand = {
  name: 'Immigration Services NL',
  legalName: 'E & I: Expat, Relocation and Immigration Services The Netherlands',
  owner: 'Johanna',
  kvk: '65768922',
  address: {
    line1: 'Laan van Zuid Hoorn 70',
    postcode: '2289 DC',
    city: 'Rijswijk',
    country: 'Nederland',
  },
  email: 'info@expat-relocation.nl',
  phone: {
    display: '+31 (0)70 800 2111',
    e164: '+31708002111',
  },
  whatsapp: {
    display: '+31 6 17 77 14 41',
    number: '31617771441',
  },
} as const;

export function whatsappUrl(text: string): string {
  return `https://wa.me/${brand.whatsapp.number}?text=${encodeURIComponent(text)}`;
}
