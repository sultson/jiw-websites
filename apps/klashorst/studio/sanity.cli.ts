import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'banas90d',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /** Where the client logs in: https://klashorst-museum.sanity.studio */
  studioHost: 'klashorst-museum',
  deployment: { appId: 'zzq9q5dca12le2zxxkkkl32g', autoUpdates: false },
  /*
   * autoUpdates is off (in `deployment` above, its current home) on purpose.
   * With it on, the Studio pulls its runtime from Sanity's CDN, so their UI
   * changes, including new product banners, land in a client's CMS unannounced
   * and what we tested is not what they see. Updating is `pnpm up sanity` and a
   * deploy.
   */
});
