export const WHATSAPP_PHONE = '31628707620';
export const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=31628707620';
export const SITE_URL = 'https://doelio.nl';

export type Brand = 'claude' | 'openai' | 'google' | 'gemini' | 'microsoft' | 'server';
export type EcoItem = { label: string; brand: Brand };

/** Hero "Werkt met" strip — recognisable platform names. */
export const ECOSYSTEM: EcoItem[] = [
  { label: 'Claude', brand: 'claude' },
  { label: 'ChatGPT', brand: 'openai' },
  { label: 'Google', brand: 'google' },
  { label: 'Microsoft', brand: 'microsoft' },
  { label: 'On-premise', brand: 'server' },
];

/** Capabilities "AI-stack" tile — the concrete products we reach for. */
export const STACK: EcoItem[] = [
  { label: 'Claude Cowork', brand: 'claude' },
  { label: 'Codex', brand: 'openai' },
  { label: 'Gemini', brand: 'gemini' },
  { label: 'Microsoft Copilot', brand: 'microsoft' },
  { label: 'Self-hosted stack', brand: 'server' },
];
