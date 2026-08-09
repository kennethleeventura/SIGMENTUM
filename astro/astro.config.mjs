import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site:   'https://sigmentum.com',
  trailingSlash: 'never',
});
