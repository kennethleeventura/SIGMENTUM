import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

const site = process.env.PUBLIC_SITE_URL || 'https://sigmentumtrade.com';
const base = new URL(site).pathname.replace(/\/$/, '') || '/';

export default defineConfig({
  output: 'static',
  site,
  base,
  trailingSlash: 'never',
  integrations: [sitemap()],
});
