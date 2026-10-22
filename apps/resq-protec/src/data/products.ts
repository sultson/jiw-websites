import data from './products.json';
import { routes, type Lang } from './content';

export type ProductSection = { title: string; paragraphs?: string[]; items?: string[] };
export type ProductImage = { src: string; width: number; height: number };
export type Product = {
  id: string;
  name: string;
  category: string;
  url: string;
  image: string;
  images: ProductImage[];
  summary: string;
  sections: ProductSection[];
  technicalSheet?: string;
};

export const productCategories = {
  nl: { protection: 'Beschermingsmiddelen', rescue: 'Reddingsmaterialen', accessories: 'Accessoires' },
  en: { protection: 'Protective equipment', rescue: 'Rescue equipment', accessories: 'Accessories' },
  de: { protection: 'Schutzausrüstung', rescue: 'Rettungsmaterial', accessories: 'Zubehör' },
};

// Client Word files supply the bilingual copy; attached manufacturer PDFs take
// precedence for ALPINE's 420D fabric, SHARK's specs and HEROES' dimensions.
// Pro Matrix's ISO reference is corrected against the manufacturer's user manual:
// https://cdn.shopify.com/s/files/1/0683/8881/5141/files/PCU022_-_PRO_MATRIX_USER_MANUAL_v3.pdf
export function getProducts(lang: Lang = 'nl'): Product[] {
  return data.map(product => ({
    id: product.id,
    ...product[lang],
    category: productCategories[lang][product.category as keyof typeof productCategories.nl],
    url: `${routes[lang].equipment}/${product.id}`,
    image: `/images/products/${product.id}/card.webp`,
    images: product.images,
    technicalSheet: product.technicalSheet,
  }));
}
