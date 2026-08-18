export declare const SITE_URL: string;
export declare const VORIG_ADRES: string;
export declare const SITE_NAAM: string;
export declare const CONTACT_EMAIL: string;
export declare const TALEN: readonly ['en', 'nl', 'pap'];
export declare const VOORVOEGSEL: Record<'en' | 'nl' | 'pap', string>;
export declare const PADEN: readonly {pad: string; gewicht: number}[];
export declare function padVoor(taal: 'en' | 'nl' | 'pap', pad: string): string;
