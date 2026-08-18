import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  server: {
    /* De router leest het pad uit de adresbalk, dus een verversing op
       /nl/bonaire moet ook lokaal index.html teruggeven en geen 404. */
    port: 3065,
  },
});
