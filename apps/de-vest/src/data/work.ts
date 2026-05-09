export type WorkItem = {
  src: string;
  alt: string;
  /** orientation: 'p' = portrait, 'l' = landscape, 's' = square. Used for grid layout. */
  o: 'p' | 'l' | 's';
  /** category tag (one short word) */
  tag: 'behang' | 'spuitwerk' | 'interieur' | 'voordeur' | 'restauratie' | 'buitenwerk';
};

export const behangBand: WorkItem[] = [
  { src: '/work/DVA2ahXCAyG-0.webp', alt: '3D akoestische wandbekleding, Eindhoven', o: 'p', tag: 'behang' },
  { src: '/work/Cl6Jncooc-w-0.webp', alt: 'Exclusief vliesbehang, particulier project', o: 'p', tag: 'behang' },
  { src: '/work/C7KRRbirmvw-0.webp', alt: 'Bijzonder vliesbehang, woonkamerwand', o: 'p', tag: 'behang' },
  { src: '/work/Cl8kRGPLpl7-0.webp', alt: 'Big Croco vliesbehang van Elitis', o: 'p', tag: 'behang' },
];

export const work: WorkItem[] = [
  { src: '/work/DXLpyTHCPLt-0.webp', alt: '3D akoestische wandbekleding van Arte', o: 'p', tag: 'behang' },
  { src: '/work/DVwGJUYiOLx-0.webp', alt: 'Behangwerk van Arte Walls', o: 'p', tag: 'behang' },
  { src: '/work/Ctjt2fTL4vR-0.webp', alt: 'Statement vliesbehang voltooid', o: 'p', tag: 'behang' },
  { src: '/work/CmFH5qAL5vq-0.webp', alt: 'Vliesbehang van Arte en Vescom', o: 'p', tag: 'behang' },
  { src: '/work/C42F3scixWN-0.webp', alt: 'Vliesbehang van Casamance', o: 'p', tag: 'behang' },
  { src: '/work/Cn1fQYDLZwk-0.webp', alt: 'Behang in slaapkamerproject', o: 'p', tag: 'behang' },
  { src: '/work/CKrmssFHNlN-0.webp', alt: 'Project Rotterdam, Arte en Elitis behang', o: 'p', tag: 'behang' },
  { src: '/work/CKouPSmnj3V-0.webp', alt: 'Elitis vliesbehang in particuliere woning', o: 'p', tag: 'behang' },

  { src: '/work/C2AZBAGCFaW-0.webp', alt: 'Gang en trappenhal in 2-componentenlak', o: 'p', tag: 'spuitwerk' },
  { src: '/work/CUcdKg8oVE2-0.webp', alt: 'Voordeur gelakt met Caparol Trimaxx', o: 'p', tag: 'voordeur' },
  { src: '/work/C_ScNRuiTpg-0.webp', alt: 'Witte gevel hersteld en gespoten, Veldhoven', o: 'p', tag: 'buitenwerk' },
  { src: '/work/C4QCETbr3Ua-0.webp', alt: 'Appartement met glasweefsel en spuitwerk', o: 'p', tag: 'interieur' },
  { src: '/work/DM-W5g8CU42-0.webp', alt: 'Wanden en plafonds in samenwerking met JM Style', o: 'p', tag: 'interieur' },
  { src: '/work/CKoyL1NntgE-0.webp', alt: 'Opgeleverd interieurproject', o: 'p', tag: 'interieur' },
  { src: '/work/DWCPSEkiCvx-0.webp', alt: 'Twee kamers van een appartement opgeleverd', o: 'p', tag: 'interieur' },
  { src: '/work/CMcnZGhrK2E-0.webp', alt: 'Foto geprint op airtex, slaapkamer', o: 'p', tag: 'interieur' },
];

/**
 * Photos used by the hero PortfolioDrift marquee.
 * Curated for variety across columns: bathrooms with painted ceilings, jungle
 * murals, dark grasscloth walls, lacquered doors, exterior facades, etc.
 *
 * No overlap with `work` (Werk grid) or `behangBand`.
 */
export const driftColA: WorkItem[] = [
  { src: '/work/DXLpyTHCPLt-3.webp', alt: 'Badkamer met geschilderd plafond en glas in lood', o: 'l', tag: 'restauratie' },
  { src: '/work/Ctjt2fTL4vR-2.webp', alt: 'Wandbekleding met stadsgezicht', o: 'p', tag: 'behang' },
  { src: '/work/CKrmssFHNlN-4.webp', alt: 'Tropische muurschildering, Rotterdam', o: 'p', tag: 'behang' },
  { src: '/work/DVwGJUYiOLx-2.webp', alt: 'Donkere grasweefsel wand met dubbele deuren', o: 'p', tag: 'behang' },
];

export const driftColB: WorkItem[] = [
  { src: '/work/C7KRRbirmvw-2.webp', alt: '3D jungle muurbekleding op gebogen wand', o: 'p', tag: 'behang' },
  { src: '/work/CKoyL1NntgE-6.webp', alt: 'Subtiel patroonbehang met sfeerverlichting', o: 'p', tag: 'behang' },
  { src: '/work/DVA2ahXCAyG-2.webp', alt: '3D akoestische tegel, detailopname', o: 'p', tag: 'behang' },
  { src: '/work/CKouPSmnj3V-5.webp', alt: 'Marmeren wandbekleding in opdrachtruimte', o: 'p', tag: 'behang' },
];

export const driftColC: WorkItem[] = [
  { src: '/work/Cl6Jncooc-w-2.webp', alt: 'Bladpatroon vliesbehang in kantoor', o: 'p', tag: 'behang' },
  { src: '/work/C42F3scixWN-2.webp', alt: 'Subtiele wandafwerking in nieuwe woning', o: 'p', tag: 'behang' },
  { src: '/work/DV_qLEtCL0x-0.webp', alt: 'Geschilderde muurkunst boven houten vloer', o: 'p', tag: 'behang' },
  { src: '/work/C_ScNRuiTpg-3.webp', alt: 'Veldhoven gevel, opgeleverd', o: 'p', tag: 'buitenwerk' },
];
