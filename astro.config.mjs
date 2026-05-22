// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://imgt.vercel.app',
  vite: {
    plugins: [tailwindcss()]
  },
  build: {
    format: 'file'
  },
  server: {
    port: 3000
  }
});
