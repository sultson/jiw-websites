import { interfaceDefaults, interfaceLabels, type InterfaceCopy } from "./interface";
import raw from "./pages.json";
import type { Img } from "../content/types";
export type Node =
  | string
  | { text: string; key: string }
  | {
      tag: string;
      attrs: Record<string, string>;
      children: Node[];
      imageKey?: string;
      linkKey?: string;
    };
export type Page = {
  path: string;
  title: string;
  description: string;
  tree: Node[];
  texts: { _key: string; label: string; text: string }[];
  images: { _key: string; label: string; src: string; alt: string }[];
  videos?: { _key: string; video: string; title: string; text: string }[];
  links: { _key: string; label: string; href: string }[];
};
export type PageContent = {
  path: string;
  title?: string;
  description?: string;
  texts?: Page["texts"];
  images?: { _key: string; img?: Img | null; alt?: string }[];
  links?: Page["links"];
  videos?: Page["videos"];
};
export const templates: Page[] = [...raw as Page[], {
  path: '@interface', title: 'Formulieren en vaste labels', description: 'Teksten voor formulieren, video’s en activiteiten', tree: [], images: [], links: [],
  texts: Object.entries(interfaceDefaults).map(([key, text]) => ({_key:key, label:interfaceLabels[key as keyof InterfaceCopy], text})),
}];
export const template = (path: string) =>
  templates.find((p) => p.path === path);
export const safeLink = (href: string) =>
  /^(\/[^/]|\/$|#|https:\/\/|mailto:|tel:)/.test(href) ? href : "#";
export const activityTypes: Record<
  string,
  { title: string; category: string; image: string; description: string }
> = {
  inloopochtend: {
    title: "Inloopochtend",
    category: "Inloop",
    image: "ipso-welkom",
    description:
      "Een kop koffie of thee, een gesprek of gewoon even zitten. Tijdens de inloop ben je welkom zonder afspraak.",
  },
  inloopavond: {
    title: "Inloopavond",
    category: "Inloop",
    image: "ipso-groep",
    description:
      "Ook in de avond is er ruimte voor ontmoeting. Vraag naar het volgende bevestigde moment.",
  },
  "inloop-met-activiteit": {
    title: "Inloop met activiteit",
    category: "Creatief",
    image: "activiteit-creatief-v2.jpg",
    description:
      "Een creatief tintje aan de inloop. Opgeven is niet nodig; gewoon koffie drinken en een praatje maken kan natuurlijk ook.",
  },
  wandelen: {
    title: "Samen wandelen",
    category: "Bewegen",
    image: "activiteit-wandelen-v2.jpg",
    description:
      "Samen naar buiten, in een rustig tempo. We beginnen met koffie om 10.00 uur en vertrekken om 10.30 uur voor een wandeling van ongeveer drie kilometer.",
  },
  zenmeditatie: {
    title: "Zenmeditatie op de stoel",
    category: "Wellness",
    image: "activiteit-mindfulness-v2.jpg",
    description:
      "Samen oefenen met aandacht en stilte, zittend op een stoel. Vraag naar de volgende bijeenkomst.",
  },
  "mandala-stippen": {
    title: "Mandala stippen",
    category: "Creatief",
    image: "activiteit-creatief-v2.jpg",
    description:
      "Even je zinnen verzetten en iets moois maken. Ervaring is niet nodig. Vraag naar een volgende datum.",
  },
  "encaustic-art": {
    title: "Encaustic art",
    category: "Creatief",
    image: "extra-encaustic-agenda.png",
    description:
      "Met warme bijenwas en kleur een eigen afbeelding maken. Tekenen hoeft niet je talent te zijn.",
  },
  "junk-journaling": {
    title: "Junk journaling",
    category: "Creatief",
    image: "extra-junk-journaling-agenda.png",
    description:
      "Maak een persoonlijk boekje met papier, beelden en kleine herinneringen. Vraag naar de volgende bijeenkomst.",
  },
  voetreflexmassage: {
    title: "Voetreflexmassage",
    category: "Wellness",
    image: "activiteit-mindfulness-v2.jpg",
    description: "Vraag naar de volgende gelegenheid voor voetreflexmassage.",
  },
  sponsordiner: {
    title: "Sponsordiner bij Classic Mike",
    category: "Overig",
    image: "hero",
    description:
      "Een feestelijke avond bij Classic Mike in Zeewolde ten bate van Toon over Leven.",
  },
};
