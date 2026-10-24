import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://fesq.in',
  integrations: [sitemap(), react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
