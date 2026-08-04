import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { port: 3063, host: '0.0.0.0' },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Keep Vite's preload helper out of the heavy chunk, or the whole
          // three.js bundle becomes a static import of the entry.
          if (id.includes('vite/preload-helper')) return 'preload';
          if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react';
          if (id.includes('node_modules/three/') || id.includes('@react-three')) return 'three';
        },
      },
    },
  },
});
