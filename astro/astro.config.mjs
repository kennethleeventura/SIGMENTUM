import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site:   'https://sigmentum.com',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
