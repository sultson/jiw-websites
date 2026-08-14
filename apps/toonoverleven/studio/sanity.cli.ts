import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'z4gex0g7',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  /*
   * autoUpdates staat bewust uit. Met die schakelaar aan haalt de Studio zijn
   * eigen code van de CDN van Sanity, en dan landen hun interfacewijzigingen en
   * productbanners onaangekondigd in het beheer van een klant: wat wij getest
   * hebben is dan niet wat zij zien. Bijwerken is `pnpm up sanity` en opnieuw
   * deployen.
   */
  deployment: { autoUpdates: false },
});
