import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'kkxa1yec',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Pinned so Sanity cannot push UI changes into the Studio unannounced.
  deployment: { autoUpdates: false },
});
