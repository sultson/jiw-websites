import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

function inlineCss(): Plugin {
  return {
    name: 'inline-css',
    apply: 'build',
    enforce: 'post',
    generateBundle(_, bundle) {
      const html = Object.values(bundle).find((item) => item.type === 'asset' && item.fileName === 'index.html');
      const css = Object.values(bundle).find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
      if (!html || !css || html.type !== 'asset' || css.type !== 'asset') return;

      const cssSource = String(css.source);
      html.source = String(html.source).replace(
        /<link rel="stylesheet" crossorigin href="[^"]+">/,
        `<style>${cssSource}</style>`,
      );
      delete bundle[css.fileName];
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), inlineCss()],
  server: { port: 3055, host: '0.0.0.0' },
});
