export const WHATSAPP_PHONE = '31628707620';
export const WHATSAPP_URL = 'https://api.whatsapp.com/send/?phone=31628707620';
export const SITE_URL = 'https://doelio.nl';

/**
 * Cal.com element-click embed trigger. Spread onto any clickable element to
 * open the "discovery-call" booking overlay — embed.js (loaded in index.html)
 * delegates clicks for `[data-cal-link]`, so React-rendered buttons work.
 */
export const CAL_TRIGGER_PROPS = {
  'data-cal-link': 'doelio/discovery-call',
  'data-cal-namespace': 'discovery-call',
  'data-cal-config': '{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}',
} as const;

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
