/**
 * All page copy. The client wrote this text herself (WhatsApp, 01-11-2026) and it is
 * kept verbatim where she worded things carefully — in particular the paragraph about
 * what the treatment does and does not do. Do not "improve" that wording.
 */

/** Therapists in the network. Empty on purpose: the client still has to supply the list. */
export type Therapeut = {
  naam: string;
  plaats: string;
  provincie: string;
  telefoon?: string;
  site?: string;
};

export const therapeuten: Therapeut[] = [];

export const leerdoelen = [
  'Neuropathie herkennen bij cliënten die nog niet gediagnosticeerd zijn en weten wanneer doorverwijzing naar een arts noodzakelijk is.',
  'Begrijpen wat neuropathie is en welke gevolgen deze aandoening kan hebben.',
  'Cliënten informeren over neuropathie en de mogelijkheden van complementaire ondersteuning.',
  'Een doelgerichte voetreflexbehandeling toepassen, afgestemd op cliënten met neuropathie.',
  'Rekening houden met de specifieke aandachtspunten en gevoeligheden bij deze doelgroep.',
];

/** Exactly the four complaints she names, nothing added. */
export const klachten = ['Tintelingen', 'Pijn', 'Een branderig gevoel', 'Juist gevoelloosheid'];
