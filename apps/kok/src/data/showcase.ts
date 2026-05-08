export type ShowcaseCategory = 'exterior' | 'interior' | 'spray';

export type ShowcaseItem = {
  /** filename in /public/showcase/ (`.webp` after optimize-images runs) */
  src: string;
  category: ShowcaseCategory;
  /** Aspect bias used to pick layout slot. 'tall' = portrait emphasis, 'wide' = landscape, 'square' default */
  shape?: 'tall' | 'wide' | 'square';
};

/**
 * Curated from the Instagram archive. Only Sidecar (photo carousel) sources or
 * the one clean B&W spray-portrait video frame; video posts whose thumbnail
 * has Instagram chrome (music sticker, caption overlay) are excluded.
 *
 * Filenames map to /public/showcase/<src>.webp after optimize-images runs.
 */
export const showcase: ShowcaseItem[] = [
  { src: 'CkTZYQ_oHQk-0.webp', category: 'spray',    shape: 'tall' },   // b&w spray portrait, hero of the gallery
  { src: 'Ca4TsAhoSeP-0.webp', category: 'spray',    shape: 'tall' },   // industrial overhead door, lakspuiten
  { src: 'CsZKQR-oZc7-0.webp', category: 'exterior', shape: 'tall' },   // Montfoort red-roof semi
  { src: 'CsgKbZoI8Y3-0.webp', category: 'exterior', shape: 'tall' },
  { src: 'CTwSnOfoSfT-0.webp', category: 'exterior', shape: 'tall' },
  { src: 'CiO_vH8o00c-0.webp', category: 'interior', shape: 'tall' },
  { src: 'Ciay_Y5odrO-0.webp', category: 'spray',    shape: 'tall' },
  { src: 'CeYW9ssInwU-0.webp', category: 'spray',    shape: 'tall' },
  { src: 'Cd-6lePIk9_-0.webp', category: 'spray',    shape: 'tall' },
  { src: 'Ca4TsAhoSeP-1.webp', category: 'spray',    shape: 'tall' },
  { src: 'CsZKQR-oZc7-1.webp', category: 'exterior', shape: 'tall' },
  { src: 'CsgKbZoI8Y3-1.webp', category: 'exterior', shape: 'tall' },
  { src: 'CTwSnOfoSfT-1.webp', category: 'exterior', shape: 'tall' },
  { src: 'CiO_vH8o00c-1.webp', category: 'interior', shape: 'tall' },
  { src: 'Ciay_Y5odrO-1.webp', category: 'spray',    shape: 'tall' },
  { src: 'CeYW9ssInwU-1.webp', category: 'spray',    shape: 'tall' },
  { src: 'Cd-6lePIk9_-1.webp', category: 'spray',    shape: 'tall' },
  { src: 'CsgKbZoI8Y3-2.webp', category: 'exterior', shape: 'tall' },
];
