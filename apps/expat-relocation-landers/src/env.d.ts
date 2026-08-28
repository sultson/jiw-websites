/// <reference types="astro/client" />

interface ImportMetaEnv {
  /** Site id selected at build time by the SITE environment variable. */
  readonly LANDER_SITE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
