import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// https://astro.build/config
export default defineConfig({
  // Dominio público. Se usa para canonical, Open Graph y sitemap.
  site: 'https://viraly.shop',
  // Landing estática: todo se prerenderiza en build.
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Inlinea el CSS crítico por debajo de 4 kB, improves el LCP.
    inlineStylesheets: 'auto',
  },
  integrations: [
    preact(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
