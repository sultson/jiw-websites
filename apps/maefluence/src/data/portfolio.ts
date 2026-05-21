export type PortfolioItem = {
  id: string;
  src: string;       // mp4
  poster: string;    // jpg
  aspect: 'portrait' | 'landscape';
};

export const portfolio: PortfolioItem[] = [
  { id: 'blonde-reveal',         src: '/portfolio/blonde-reveal.mp4',         poster: '/portfolio/blonde-reveal.jpg',         aspect: 'portrait'  },
  { id: 'blonde-transformation', src: '/portfolio/blonde-transformation.mp4', poster: '/portfolio/blonde-transformation.jpg', aspect: 'portrait'  },
  { id: 'barber-fade',           src: '/portfolio/barber-fade.mp4',           poster: '/portfolio/barber-fade.jpg',           aspect: 'portrait'  },
  { id: 'pedicure-ringlight',    src: '/portfolio/pedicure-ringlight.mp4',    poster: '/portfolio/pedicure-ringlight.jpg',    aspect: 'landscape' },
  { id: 'bridal-hairspray',      src: '/portfolio/bridal-hairspray.mp4',      poster: '/portfolio/bridal-hairspray.jpg',      aspect: 'landscape' },
  { id: 'fur-coats-walk',        src: '/portfolio/fur-coats-walk.mp4',        poster: '/portfolio/fur-coats-walk.jpg',        aspect: 'landscape' },
  { id: 'irish-pub',             src: '/portfolio/irish-pub.mp4',             poster: '/portfolio/irish-pub.jpg',             aspect: 'portrait'  },
];

export const ugcExamples: PortfolioItem[] = [
  { id: 'codex-labs-hand-cream', src: '/portfolio/codex-labs-hand-cream.mp4', poster: '/portfolio/codex-labs-hand-cream.jpg', aspect: 'portrait' },
  { id: 'rhode-lips',            src: '/portfolio/rhode-lips.mp4',            poster: '/portfolio/rhode-lips.jpg',            aspect: 'portrait' },
  { id: 'salon-mirror',          src: '/portfolio/salon-mirror.mp4',          poster: '/portfolio/salon-mirror.jpg',          aspect: 'portrait' },
];
