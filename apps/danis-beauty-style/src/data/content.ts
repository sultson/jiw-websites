// Source: @danisbeautystyle on Instagram, scraped via Apify
// Posters live in /public/ig-{shortCode}.webp; videos in /public/ig-{shortCode}.mp4
// Captions written from looking at each image, not from IG captions.
export type InstaPost = {
  shortCode: string;
  type: 'image' | 'video';
  poster: string;
  video?: string;
  url: string;
  aspect: 'portrait' | 'square' | 'landscape';
  tag: 'nails' | 'braids' | 'gems' | 'misc';
  caption: string;
};

const v = (shortCode: string, aspect: InstaPost['aspect'], tag: InstaPost['tag'], caption: string): InstaPost => ({
  shortCode,
  type: 'video',
  poster: `/ig-${shortCode}.webp`,
  video: `/ig-${shortCode}.mp4`,
  url: `https://www.instagram.com/p/${shortCode}/`,
  aspect,
  tag,
  caption,
});

const i = (shortCode: string, aspect: InstaPost['aspect'], tag: InstaPost['tag'], caption: string): InstaPost => ({
  shortCode,
  type: 'image',
  poster: `/ig-${shortCode}.webp`,
  url: `https://www.instagram.com/p/${shortCode}/`,
  aspect,
  tag,
  caption,
});

// Reel rail. DTxLgRvDCIC is used as the Hero video and intentionally not listed here.
export const reels: InstaPost[] = [
  v('DSctK9eCl8K', 'portrait',  'nails', 'BIAB teddy met goldflakes'),
  v('DJ_uWZHtvcu', 'portrait',  'nails', 'Refresh in de salon'),
  v('DQwhhEkjA3t', 'portrait',  'nails', 'BIAB in hibiscus-rood'),
  v('DWXEcE8DtRA', 'portrait',  'nails', 'BIAB in actie'),
  v('DJrtse2NGR2', 'portrait',  'nails', 'Refill van vandaag'),
  v('DL2d4drtUGB', 'portrait',  'nails', 'Marathon nails'),
  v('DQ7fILFjma-', 'landscape', 'nails', 'BIAB in plum'),
  v('DOqgs7-jDCX', 'portrait',  'nails', 'Klassiek rood'),
  v('DSvBC-OjH1n', 'portrait',  'misc',  'Even ontspannen'),
];

// Photo gallery. Every entry was verified against the actual image content;
// promo screenshots, selfies and non-work shots have been removed.
export const gallery: InstaPost[] = [
  i('DCZRn4StEAs', 'portrait',  'nails',  'French manicure met gouden ringen'),
  i('C_am5nvN19D', 'portrait',  'nails',  'Lila met witte vlinder-accent'),
  i('DAqJV5ZNV5U', 'portrait',  'nails',  'Glanzend burgundy'),
  i('DFsV6OBN9tN', 'portrait',  'nails',  'French met gouden nail-art'),
  i('DBbkvlDNNIX', 'portrait',  'nails',  'Donkerrode amandelvorm'),
  i('C_dWL3GtNyx', 'portrait',  'nails',  'Soft French BIAB'),
  i('C-ai89lNw-h', 'landscape', 'nails',  'Hoogglans lipstick rood'),
  i('DE48aPINGmO', 'portrait',  'nails',  'Cherry cat eye'),
  i('DSctK9eCl8K', 'portrait',  'nails',  'Soft pink met gouden glitter'),
  i('C84gRLRNFiR', 'portrait',  'gems',   'Gouden tandsieraad'),
  i('DVBKHD2DIkH', 'square',    'braids', 'Vlechten voor de kleinste'),
  i('C8CSXXdNCuJ', 'landscape', 'braids', 'Bubble braids op voorraad'),
];
