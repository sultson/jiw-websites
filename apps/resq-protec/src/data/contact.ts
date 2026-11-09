// Phone numbers for the floating WhatsApp + call buttons (Layout.astro).
// Patrick's number was the only one until 09-11-2026; Kevin added his own and asked for WhatsApp ("WhatsApp is laagdrempelig").
export const phones = {
  patrick: { tel: '+31613365840', display: '+31 6 133 658 40' },
  kevin: { tel: '+31648957927', display: '+31 6 489 579 27' },
} as const;
export const whatsapp = phones.kevin;
export const waLink = (text: string) => `https://wa.me/${whatsapp.tel.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;
