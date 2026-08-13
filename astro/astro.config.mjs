import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site:   process.env.PUBLIC_SITE_URL || 'https://kennethleeventura.github.io/SIGMENTUM',
  trailingSlash: 'never',
  integrations: [sitemap()],
});
